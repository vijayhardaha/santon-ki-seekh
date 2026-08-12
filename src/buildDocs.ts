/**
 * Build Dohe Collections Script
 *
 * Fetches couplets from the live Kabir Dohe API (paginated) and generates
 * markdown collection files in `docs/dohe`, one file per 100 couplets.
 *
 * Usage:
 *   bun run build:docs
 *   bun run src/buildDocs.ts --limit 2
 *   MAX_FILES=2 bun run src/buildDocs.ts
 *
 * Data source: https://kabirdoheapi.vercel.app/api/couplets
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import ora from 'ora';
import { format } from 'prettier';

import { ENTRIES_PER_FILE, SANT_KABIR } from './constants';
import { fetchAllCouplets, generateDoheMarkdown, padNumber, parseFileLimit, splitCoupletText } from './lib';
import type { DoheCollectionEntry } from './lib/formatting';

/**
 * Builds the dohe markdown collections under `docs/dohe`.
 *
 * @param {string[]} [argv] - Optional custom CLI args for the file limit.
 *
 * @returns {Promise<number>} The number of collection files created.
 */
export async function buildDocs(argv?: string[]): Promise<number> {
  const maxFiles = parseFileLimit(argv);
  const spinner = ora(
    `Fetching couplets from API${maxFiles !== undefined ? ` (limit: ${maxFiles} file${maxFiles > 1 ? 's' : ''})` : ''}...`
  ).start();

  try {
    const posts = await fetchAllCouplets();

    const entries: DoheCollectionEntry[] = posts.map((post) => ({
      content: splitCoupletText(post.text_hi).join('\n'),
      author: SANT_KABIR,
    }));

    const docsDir = resolve(process.cwd(), 'docs', 'dohe');

    // Remove the 'dohe' directory and all its contents, then recreate it.
    await rm(docsDir, { recursive: true, force: true });
    await mkdir(docsDir, { recursive: true });

    let fileCount = 0;

    for (let i = 0; i < entries.length && (maxFiles === undefined || fileCount < maxFiles); i += ENTRIES_PER_FILE) {
      const slice = entries.slice(i, i + ENTRIES_PER_FILE);
      const startNum = i + 1;
      const startNumber = padNumber(startNum, 2);
      const endNumber = padNumber(Math.min(startNum + ENTRIES_PER_FILE - 1, entries.length), 2);

      const heading = `# संत कबीर के दोहे संग्रह - ${startNumber} to ${endNumber}`;
      let content = `${heading}\n\n${generateDoheMarkdown(slice, startNum)}`;

      // Format the markdown with Prettier (same approach as kabir-ke-dohe).
      content = await format(content, { parser: 'markdown' });

      const fileName = `sant-kabir-ke-dohe-${padNumber(fileCount + 1, 2)}.md`;
      const filePath = join(docsDir, fileName);

      await writeFile(filePath, content, 'utf8');
      spinner.text = `File created: ${basename(filePath)}`;
      fileCount += 1;
    }

    spinner.succeed(`Created ${fileCount} collection file${fileCount === 1 ? '' : 's'} in docs/dohe`);
    return fileCount;
  } catch (error) {
    spinner.fail('Error fetching or generating collections:');
    console.error(error instanceof Error ? error.message : String(error));
    throw error;
  }
}

if ((import.meta as unknown as { main?: boolean }).main === true) {
  buildDocs().catch((error) => {
    console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

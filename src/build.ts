/**
 * Build Command
 *
 * Orchestrates the full build: the dohe markdown collections (docs/dohe) and
 * the downloadable assets (dist/) for bhajans and dohas.
 *
 * Usage:
 *   bun run build
 *   bun run build --limit 1
 *   MAX_FILES=1 bun run build
 *
 * Data source: https://kabirdoheapi.vercel.app/api/couplets
 */

import { buildAssets } from './buildAssets';
import { buildDocs } from './buildDocs';

/**
 * Runs the complete build: docs collections and downloadable assets.
 *
 * @param {string[]} [argv] - Optional custom CLI args (forwarded to buildDocs).
 *
 * @returns {Promise<void>} Resolves when the full build completes.
 */
export async function build(argv?: string[]): Promise<void> {
  await buildDocs(argv);
  await buildAssets();
}

if ((import.meta as unknown as { main?: boolean }).main === true) {
  build().catch((error) => {
    console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

/**
 * Build Assets Script
 *
 * Builds the downloadable assets (raw.json, json, txt, md, csv) for bhajans
 * and dohas (fetched live from the Kabir Dohe API) into `dist/`.
 *
 * Usage:
 *   bun run build:assets
 *
 * Data source: https://kabirdoheapi.vercel.app/api/couplets
 */

import ora from 'ora';

import BhajanMeta from './data/bhajans';
import { convertCoupletsToDohas } from './data/dohas';
import { fetchAllCouplets } from './lib';
import { Builder } from './lib/builder';
import type { BuildMeta } from './types';

/**
 * Builds all downloadable assets (bhajans and dohas) into `dist/`.
 *
 * @returns {Promise<void>} Resolves when all asset builds are complete.
 */
export async function buildAssets(): Promise<void> {
  const spinner = ora('Starting the assets build process...').start();

  try {
    // Execute Bhajan build process.
    spinner.start('Executing Bhajans build process...');
    await Builder.run(BhajanMeta);
    spinner.succeed('Bhajans assets built successfully!');

    // Execute Doha build process.
    spinner.start('Executing Dohe build process...');
    const couplets = await fetchAllCouplets();
    const DoheMeta: BuildMeta = {
      fileName: 'santon-ke-dohe',
      mdTitle: 'संतों के दोहे (Couplets)',
      data: convertCoupletsToDohas(couplets),
      appendNumber: true,
    };
    await Builder.run(DoheMeta);
    spinner.succeed('Dohe assets built successfully!');
  } catch (error) {
    spinner.fail('An error occurred during the assets build process.');
    console.error(error instanceof Error ? error.message : String(error));
    throw error;
  }
}

if ((import.meta as unknown as { main?: boolean }).main === true) {
  buildAssets().catch((error) => {
    console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

import type { BuildMeta, BuildContext } from '../types';
import { generateData } from './dataGenerator';
import { joinPath, makeDir } from './fileSystemUtils';

/**
 * The asset builder. Renders a dataset into raw.json, json, txt, md and csv
 * files inside the output directory (defaults to `dist`).
 */
export const Builder = {
  /**
   * Main run method which sequentially runs each format build.
   *
   * @param {BuildMeta} meta - Build metadata (fileName, mdTitle, data, appendNumber).
   * @param {string} [outputDir] - Directory to write assets into. Defaults to `dist`.
   *
   * @returns {Promise<void>} Resolves when the whole build process is complete.
   */
  async run(meta: BuildMeta, outputDir: string = joinPath(process.cwd(), 'dist')): Promise<void> {
    const context: BuildContext = { ...meta, outputDir };

    // Ensure the output directory exists.
    await makeDir(context.outputDir);

    // Build files in different formats.
    await generateData(context, 'raw.json');
    await generateData(context, 'json');
    await generateData(context, 'txt');
    await generateData(context, 'md');
    await generateData(context, 'csv');
  },
};

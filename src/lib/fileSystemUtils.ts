import { promises as fs } from 'fs';
import path from 'path';

/**
 * Join the path.
 *
 * @param {string[]} pathSegments - Local file paths.
 *
 * @returns {string} The joined path.
 */
export const joinPath = (...pathSegments: string[]): string => path.join(...pathSegments);

/**
 * Creates a directory recursively.
 * Creates all parent directories if they don't exist.
 *
 * @param {string} dirPath - Directory path to create.
 */
export async function makeDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Writes data to a file, creating it if it doesn't exist.
 *
 * @param {string} filePath - The path of the file to be created or written to.
 * @param {Buffer | string} data - The data to write into the file.
 *
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
export async function writeFile(filePath: string, data: Buffer | string): Promise<void> {
  await fs.writeFile(filePath, data);
}

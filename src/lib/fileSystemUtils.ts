import { constants, promises as fs } from 'fs';
import path from 'path';

/**
 * Get the file extension from the file path.
 *
 * @param {string} filePath - Local file path.
 *
 * @returns {string} The file extension.
 */
export const getFileExtension = (filePath: string): string => path.extname(filePath);

/**
 * Get the file basename from the file path.
 *
 * @param {string} filePath - Local file path.
 * @param {boolean} [removeExt] - Remove extension from file basename if true.
 *
 * @returns {string} The file basename.
 */
export const getFileName = (filePath: string, removeExt = false): string => {
  const ext = removeExt ? getFileExtension(filePath) : '';
  return path.basename(filePath, ext);
};

/**
 * Resolve the path.
 *
 * @param {string[]} pathSegments - Local file paths.
 *
 * @returns {string} The resolved path.
 */
export const resolvePath = (...pathSegments: string[]): string => path.resolve(...pathSegments);

/**
 * Join the path.
 *
 * @param {string[]} pathSegments - Local file paths.
 *
 * @returns {string} The joined path.
 */
export const joinPath = (...pathSegments: string[]): string => path.join(...pathSegments);

/**
 * Check if a file or directory path exists or not.
 *
 * Throws an error if the error code is not ENOENT.
 * ENOENT code is for "file not exists," but any other
 * error code results in an error being thrown.
 *
 * @param {string} filePath - Local file or directory path.
 *
 * @returns {Promise<boolean>} True if it exists; otherwise, false.
 */
export async function isExists(filePath: string): Promise<boolean> {
  const checkPermissions = async (checkPath: string, flags: number): Promise<boolean> => {
    try {
      await fs.access(checkPath, flags);
      return true;
    } catch (err) {
      if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  };

  // Check for file existence, read permission, and write permission.
  const isFileExists = await checkPermissions(filePath, constants.F_OK);
  const hasReadPermission = await checkPermissions(filePath, constants.R_OK);
  const hasWritePermission = await checkPermissions(filePath, constants.W_OK);

  return isFileExists && hasReadPermission && hasWritePermission;
}

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

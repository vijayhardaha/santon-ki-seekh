/**
 * Import packages.
 */
import { promises as fs, constants } from "fs";
import path from "path";

/**
 * Get the file extension from the file path.
 *
 * @param {string} filePath - Local file path.
 * @return {string} - The file extension.
 */
export const getFileExtension = (filePath) => path.extname(filePath);

/**
 * Get the file basename from the file path.
 *
 * @param {string}  filePath  - Local file path.
 * @param {boolean} removeExt - Remove extension from file basename if true. (Default: false)
 * @return {string} - The file basename.
 */
export const getFileName = (filePath, removeExt = false) => {
	const ext = removeExt ? getFileExtension(filePath) : "";
	return path.basename(filePath, ext);
};

/**
 * Resolve the path.
 *
 * @param {string} pathSegments - Local file paths.
 * @return {string} - The resolved path.
 */
export const resolvePath = (...pathSegments) => path.resolve(...pathSegments);

/**
 * Join the path.
 *
 * @param {string} pathSegments - Local file paths.
 * @return {string} - The joined path.
 */
export const joinPath = (...pathSegments) => path.join(...pathSegments);

/**
 * Check if a file or directory path exists or not.
 *
 * Throws an error if the error code is not ENOENT.
 * ENOENT code is for "file not exists," but any other
 * error code results in an error being thrown.
 *
 * @param {string} filePath - Local file or directory path.
 * @return {boolean} - True if it exists; otherwise, false.
 */
export async function isExists(filePath) {
	const checkPermissions = async (checkPath, flags) => {
		try {
			await fs.access(checkPath, flags);
			return true;
		} catch (err) {
			if (err.code === "ENOENT") {
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
 * Create a directory.
 *
 * @param {string} dirPath - Directory path.
 */
export async function makeDir(dirPath) {
	await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Create a file and write data to it.
 *
 * @param {string}          filePath - The path of the file to be created or written to.
 * @param {Buffer | string} data     - The data to write into the file. Can be a `Buffer` or a `string`.
 *
 * @return {Promise<void>} A promise that resolves when the file has been successfully written.
 *
 * @async
 */
export async function writeFile(filePath, data) {
	await fs.writeFile(filePath, data);
}

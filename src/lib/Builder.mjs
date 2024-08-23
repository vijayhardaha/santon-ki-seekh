/**
 * Import necessary packages and functions.
 */
import { generateData } from "./helpers/dataGenerator.mjs";
import { joinPath, makeDir } from "./helpers/fileSystemUtils.mjs";

/**
 * Builder module definition
 */
const Builder = {
	/**
	 * Main run method which sequentially calls various build methods.
	 *
	 * @param {Object} params              - Parameters for the run method.
	 * @param {string} params.fileName     - The name of the file to be processed.
	 * @param {string} params.mdTitle      - The title of the markdown document.
	 * @param {Object} params.data         - The data to be used in the build process.
	 * @param {Object} params.appendNumber - The data to be used in the build process.
	 *
	 * @return {Promise<void>} A promise that resolves when the build process is complete.
	 *
	 * @async
	 */
	run: async ( { fileName, mdTitle, data, appendNumber } ) => {
		Builder.fileName = fileName;
		Builder.mdTitle = mdTitle;
		Builder.outputDirName = "dist";
		Builder.data = data;
		Builder.appendNumber = appendNumber;
		Builder.outputDir = joinPath( process.cwd(), Builder.outputDirName );

		// Ensure the output directory exists
		await makeDir( Builder.outputDir );

		// Build files in different formats
		await Builder.buildRawJson();
		await Builder.buildJson();
		await Builder.buildTxt();
		await Builder.buildMd();
		await Builder.buildCsv();
	},

	/**
	 * Build raw JSON data
	 * @return {Promise<void>}
	 */
	buildRawJson: async () => generateData( Builder, "raw.json" ),

	/**
	 * Build formatted JSON data
	 * @return {Promise<void>}
	 */
	buildJson: async () => generateData( Builder, "json" ),

	/**
	 * Build text file
	 * @return {Promise<void>}
	 */
	buildTxt: async () => generateData( Builder, "txt" ),

	/**
	 * Build markdown file
	 * @return {Promise<void>}
	 */
	buildMd: async () => generateData( Builder, "md" ),

	/**
	 * Build CSV file
	 * @return {Promise<void>}
	 */
	buildCsv: async () => generateData( Builder, "csv" ),
};

// Export the Builder module
export default Builder;

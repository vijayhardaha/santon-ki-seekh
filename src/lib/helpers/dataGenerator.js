/**
 * Import necessary packages and functions.
 */
import { json2csv } from "json-2-csv";
import * as prettier from "prettier";

import { AUTHOR_PREFIX } from "./constants.js";
import { joinPath, writeFile } from "./fileSystemUtils.js";

/**
 * Generates a suffix string with the author information if available.
 *
 * @param {string} author - The author of the dataSet.
 * @return {string} The generated suffix string.
 */
const generateSuffix = ( author ) => ( author ? `\n\n${ AUTHOR_PREFIX } ${ author }` : "" );

/**
 * Sorts an array of objects by the 'id' field in ascending order.
 *
 * @param {Array<Object>} data - The array of objects to be sorted.
 * @return {Array<Object>} - The sorted array of objects.
 */
export const sortData = ( data ) => data.sort( ( a, b ) => ( a.id > b.id ? 1 : -1 ) );

/**
 * Generate JSON data from input data.
 * @param {Array} data - Input data.
 * @return {Array} - Formatted JSON data.
 */
export function generateJson( data ) {
	return data.map( ( dataSet ) => {
		const content = dataSet.content.join( "\n" );
		return { ...dataSet, content };
	} );
}

/**
 * Generate text data from input data.
 * @param {Array} data - Input data.
 * @return {string} - Formatted text data.
 */
export function generateTxt( data ) {
	return data
		.map( ( dataSet ) => dataSet.content.join( "\n" ) + generateSuffix( dataSet.author ) )
		.join( "\n\n================================\n\n" );
}

/**
 * Generate markdown data from input data.
 * @param {Array}  data    - Input data.
 * @param {string} [title] - Optional title to prepend to document. Default is an empty string.
 * @return {string} - Formatted markdown data.
 */
export function generateMd( data, title = "" ) {
	const titlePrefix = title ? `# ${ title } \n\n` : "";
	const output = data
		.map( ( dataSet ) => dataSet.content.join( "\\\n" ) + generateSuffix( dataSet.author ) )
		.join( "\n\n---\n\n" );

	return titlePrefix + output;
}

/**
 * Generate CSV data from JSON data.
 * @param {Array} data - JSON data.
 * @return {Promise<string>} - CSV data.
 */
export async function generateCSV( data ) {
	const jsonData = data.map( ( dataSet ) => [ dataSet.content.join( "\n" ) + generateSuffix( dataSet.author ) ] );
	const csvData = await json2csv( jsonData );
	return csvData;
}

/**
 * Generate data in specified format and write to file.
 * @param {Object} builder - Builder object containing data and configuration.
 * @param {string} type    - Type of data to generate (e.g., "raw.json", "json", "txt", "md", "csv").
 * @return {Promise<void>}
 */
export const generateData = async ( builder, type ) => {
	const {
		outputDir, fileName, data, mdTitle,
	} = builder;
	const path = joinPath( outputDir, `${ fileName }.${ type }` );
	let fileData;

	switch ( type ) {
		case "raw.json":
			fileData = JSON.stringify( data, null, 2 );
			break;
		case "json":
			fileData = JSON.stringify( generateJson( data ), null, 2 );
			break;
		case "txt":
			fileData = generateTxt( data );
			break;
		case "md":
			fileData = generateMd( data, mdTitle );
			fileData = await prettier.format( `${ fileData }`, { parser: "markdown" } );
			break;
		case "csv":
			fileData = await generateCSV( data );
			break;
		default:
			throw new Error( `Unsupported build type: ${ type }` );
	}

	await writeFile( path, fileData );

	return Promise.resolve();
};

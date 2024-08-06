const latinize = require( "latinize" );
const slugify = require( "slugify" );

/**
 * Utility function to collapse multiple spaces into a single space and trim whitespace.
 * @param {string} str - The input string to clean.
 * @return {string} The cleaned string.
 */
const cleanString = ( str ) => str.replace( /[^\S\r\n]+/g, " " ).trim();

/**
 * Creates a URL-friendly slug from the given text.
 *
 * @param {string} text - The text to be converted into a slug.
 * @return {string} The generated slug.
 */
const createSlug = ( text ) => {
	return slugify( latinize( text ), {
		lower: true,
		replacement: "_",
		strict: true,
		trim: true,
	} );
};

/**
 * Converts an array of header names to slugified keys.
 *
 * @param {string[]} headers - The array of header names.
 * @return {Object} An object mapping original header names to their slugified versions.
 */
const createSlugifiedKeys = ( headers ) => {
	return headers.reduce( ( acc, header ) => {
		const slugifiedHeader = createSlug( header );
		acc[ header ] = slugifiedHeader;
		return acc;
	}, {} );
};

/**
 * Maps CSV data to JSON with slugified keys.
 *
 * @param {Array<Object>} csvData - The parsed CSV data.
 * @param {Array<string>} headers - The headers from the CSV.
 * @return {Array<Object>} - The mapped JSON data.
 */
const mapCsvDataToJson = ( csvData, headers ) => {
	const columnMapping = createSlugifiedKeys( headers );

	return csvData.map( ( row ) => {
		const newRow = {};
		for ( const key in row ) {
			if ( columnMapping[ key ] ) {
				newRow[ columnMapping[ key ] ] = row[ key ];
			} else {
				newRow[ key ] = row[ key ];
			}
		}
		return newRow;
	} );
};

/**
 * Fetch Kabir Ke Dohe data from Google Sheets.
 * @return {Promise<Object[]>} Array of cleaned dohe objects
 * @throws {Error} Throws an error if fetching or parsing fails
 */
async function fetchKabirKeDohe() {
	const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
	const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

	const range = "kabir-ke-dohe!A:Z"; // Adjust range as needed
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${ SPREADSHEET_ID }/values/${ range }?key=${ API_KEY }`;

	try {
		console.log( url );
		const response = await fetch( url );
		if ( ! response.ok ) {
			throw new Error( "Network response was not ok" );
		}

		const data = await response.json();

		// Assuming data.values is an array of rows with header data
		const [ header, ...rows ] = data.values;
		const jsonData = rows.map( ( row ) => {
			const obj = {};
			header.forEach( ( h, i ) => ( obj[ h ] = row[ i ] ) );
			return obj;
		} );

		const mappedData = mapCsvDataToJson( jsonData, header );

		const processedData = mappedData.map( ( row ) => ( {
			index: parseInt( row.index ?? 0 ), // Provide a default value if `index` is undefined or not a number
			doha: cleanString( row.doha ?? "" ), // Provide a default empty string if `doha` is undefined
			english_doha: cleanString( row.english_doha ?? "" ), // Provide a default empty string if `english_doha` is undefined
			title_hindi: cleanString( row.title_hindi ?? "" ), // Provide a default empty string if `title_hindi` is undefined
			title_english: cleanString( row.title_english ?? "" ), // Provide a default empty string if `title_english` is undefined
			slug: cleanString( row?.slug?.trim() ?? "" ), // Safely handle `slug` and provide a default empty string if undefined
			meaning: row?.meaning?.trim() ?? "", // Safely handle `meaning` and provide a default empty string if undefined
			tags: row?.tags?.trim() ?? "", // Safely handle `tags` and provide a default empty string if undefined
		} ) );

		return processedData;
	} catch ( error ) {
		// Throw an error if fetching or parsing fails
		throw new Error( error );
	}
}

module.exports = { fetchKabirKeDohe };

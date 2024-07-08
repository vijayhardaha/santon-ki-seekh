const axios = require("axios");
const csv = require("csvtojson");

// URL to fetch the CSV data
const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQuwtO1d7pHNoKmTEUZjc0I08ZvgwoFgYh3paipOaO0L5UrDI4f7n608C5gc9A-DrgQK9QE5Aa2woyd/pub?gid=0&single=true&output=csv`;

/**
 * Utility function to collapse multiple spaces into a single space and trim whitespace.
 * @param {string} str - The input string to clean.
 * @returns {string} The cleaned string.
 */
function cleanString(str) {
  return str.replace(/[^\S\r\n]+/g, ' ').trim();
}

/**
 * Fetch Kabir Ke Dohe data from Google Sheets.
 * @returns {Promise<Object[]>} Array of cleaned dohe objects
 * @throws {Error} Throws an error if fetching or parsing fails
 */
async function fetchKabirKeDohe() {
	try {
		// Fetch CSV data from Google Sheets
		const response = await axios.get(url);
		const csvData = response.data;

		// Convert CSV to JSON
		const jsonData = await csv().fromString(csvData);

		// Clean and format the data
		const cleanedData = jsonData.map((item) => ({
			index: parseInt(item["index"]), // Convert index to integer
			doha: cleanString(item["doha"]), // Replace double spaces with single spaces and trim whitespace
			line_hindi: cleanString(item["line_hindi"]), // Replace double spaces with single spaces and trim whitespace
			line_english: cleanString(item["line_english"]), // Replace double spaces with single spaces and trim whitespace
			slug: item["slug"].trim(), // Trim whitespace from slug
			meaning: item["meaning"].trim(), // Trim whitespace from meaning
		}));

		return cleanedData;
	} catch (error) {
		// Throw an error if fetching or parsing fails
		throw new Error("Failed to fetch data");
	}
}

module.exports = { fetchKabirKeDohe };

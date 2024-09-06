import "dotenv/config";
import { GoogleSpreadsheet } from "google-spreadsheet";

import { createJwtClient } from "./createJwtClient.mjs";
import { mapCsvDataToJson } from "./utils.mjs";

/**
 * Fetches data from a specified Google Sheets spreadsheet.
 *
 * @param {string} sheetName - The name of the sheet to fetch data from.
 * @returns {Promise<Array>} A promise that resolves to an array of JSON objects representing the sheet's data.
 */
export async function getGoogleSheetData(sheetName) {
	const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

	if (!SPREADSHEET_ID) {
		throw new Error("Spreadsheet ID is not defined in environment variables.");
	}

	const jwtClient = createJwtClient();
	const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwtClient);

	try {
		// Load spreadsheet info
		await doc.loadInfo();

		// Get the sheet by title
		const sheet = doc.sheetsByTitle[sheetName];
		if (!sheet) {
			throw new Error(`Sheet titled "${sheetName}" not found`);
		}

		// Fetch rows from the sheet
		const rows = await sheet.getRows();

		// Convert rows to JSON format
		const data = rows.map((row) => row._rawData);
		const mappedData = mapCsvDataToJson({ values: [sheet.headerValues, ...data] });

		return mappedData;
	} catch (error) {
		console.error("Error fetching data from Google Sheets:", error.message);
		return [];
	}
}

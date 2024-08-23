import fs from "fs";
import path from "path";

import ora from "ora";

import { fetchData } from "./api/fetchData.mjs";

/**
 * Fetches data from the API, processes it, and saves it to JSON files.
 * @returns {Promise<void>} - A promise that resolves when the data has been fetched and saved.
 */
const buildData = async () => {
	const spinner = ora("Fetching data...").start();

	try {
		const verses = await fetchData();

		// Define the directory and file paths
		const dataDir = path.join(process.cwd(), "src/data");
		const postsFilePath = path.join(dataDir, "posts.json");

		// Check if the directory exists; if not, create it
		if (!fs.existsSync(dataDir)) {
			fs.mkdirSync(dataDir, { recursive: true });
		}

		// Save the processed data to posts.json
		fs.writeFileSync(postsFilePath, JSON.stringify(verses, null, 2));

		spinner.succeed("Data fetched and saved successfully");
	} catch (error) {
		spinner.fail("Error fetching data");
		// Log error for debugging.
		console.error("Error fetching group data:", error);
	}
};

buildData();

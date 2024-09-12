import fs from "fs/promises";
import path from "path";

import ora from "ora"; // For ES modules
import { prettier } from "prettier";

import { latinToHindiNumber, padIndex } from "./lib/helpers/dataGenerator";
import { SANT_KABIR } from "../src/lib/helpers/constants";

/**
 * Generates markdown content from an array of entries.
 *
 * @param {Array<Object>} entries  - The entries to include in the markdown.
 * @param {number}        startNum - The starting number for the entries.
 * @return {string} The generated markdown content.
 */
const generateMarkdownContent = (entries, startNum) => {
	return entries
		.map((entry, index) => {
			const entryIndex = latinToHindiNumber(padIndex(startNum + index, 2));
			return `- ${entry.content.split("\n").join("\\\n")}${entryIndex}।।\n\n  — ${entry.author}`;
		})
		.join("\n\n***\n\n");
};

/**
 * Pads a number with leading zeros.
 *
 * @param {number} number - The number to pad.
 * @param {number} width  - The desired width of the number string.
 * @return {string} The padded number as a string.
 */
const padNumber = (number, width) => {
	const numberStr = number.toString();
	return numberStr.padStart(width, "0");
};

/**
 * Creates markdown files from the given filtered data, with each file containing a specified number of entries.
 *
 * @param {Array<Object>} data    - The filtered data to write to markdown files.
 * @param {Object}        spinner - ora spinner object.
 * @return {Promise<void>}
 */
const createMarkdownFiles = async (data, spinner) => {
	const docsDir = path.resolve(process.cwd(), "docs", "dohe");
	const entriesPerFile = 100;

	// Remove the 'dohe' directory and all its contents
	await fs.rm(docsDir, { recursive: true, force: true });

	// Recreate the 'dohe' directory to ensure it exists for future use
	await fs.mkdir(docsDir, { recursive: true });

	let initial = 1;

	for (let i = 0; i < data.length; i += entriesPerFile) {
		const entries = data.slice(i, i + entriesPerFile);
		const startNum = i + 1;
		const startNumber = padNumber(i + 1, 2);
		const endNumber = padNumber(Math.min(i + entriesPerFile, data.length), 2);
		const heading = `# संत कबीर के दोहे संग्रह - ${startNumber} to ${endNumber}`;
		const content = `${heading}\n\n${generateMarkdownContent(entries, startNum)}`;
		const fileName = `sant-kabir-ke-dohe-${padNumber(initial, 2)}.md`;
		const filePath = path.join(docsDir, fileName);
		const finalContent = await prettier.format(`${content}`, {
			parser: "markdown",
		});

		await fs.writeFile(filePath, finalContent, "utf8");
		spinner.start(`File created: ${path.basename(filePath)}`);
		initial++;
	}
};

/**
 * Main function to read data from a JSON file, filter by author, and generate markdown files.
 *
 * @return {Promise<void>}
 */
const main = async () => {
	const spinner = ora("Fetching data and creating markdown files...").start();

	try {
		const response = await fetch("https://kabir-ke-dohe-api.vercel.app/api/couplets?perPage=-1");

		// Check if the response is OK (status code 2xx)
		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();

		// Check if the API response has a success flag
		if (!data.success) {
			throw new Error("API returned an unsuccessful response.");
		}

		const couplets = data.data.couplets;

		// Check if couplets data is valid
		if (!Array.isArray(couplets) || couplets.length === 0) {
			throw new Error("No couplets found in the API response.");
		}

		const filterData = couplets.map(({ unique_slug, couplet_hindi }) => {
			return { id: unique_slug, author: SANT_KABIR, content: couplet_hindi };
		});

		// Create markdown files from filtered data
		await createMarkdownFiles(filterData, spinner);
		spinner.succeed("Markdown files created successfully.");
	} catch (error) {
		// Handle any errors that occur during the process
		spinner.fail("Error reading or processing data:");
		console.error(error.message); // Log specific error message
	}
};

// Run the main function
main();

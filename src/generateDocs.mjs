import fs from "fs/promises";
import path from "path";

import ora from "ora"; // For ES modules
import prettier from "prettier";

import { latinToHindiNumber, padIndex } from "./lib/helpers/dataGenerator.mjs";
import { SANT_KABIR } from "../src/lib/helpers/constants.mjs";

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

	const filePath = path.resolve(process.cwd(), "src/data", "couplets.json");

	try {
		// Check if the file exists
		await fs.access(filePath, fs.constants.F_OK);

		const data = JSON.parse(await fs.readFile(filePath, "utf8"));

		const filterData = data.map(({ unique_slug, couplet_hindi }) => {
			return { id: unique_slug, author: SANT_KABIR, content: couplet_hindi };
		});

		await createMarkdownFiles(filterData, spinner);
		spinner.succeed("Markdown files created successfully.");
	} catch (error) {
		spinner.fail("Error reading or processing data:");
		console.error(error);
	}
};

// Run the main function
main();

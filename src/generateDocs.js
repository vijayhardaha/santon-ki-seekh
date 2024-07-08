import fs from "fs/promises";
import path from "path";
import {fileURLToPath} from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates markdown content from an array of entries.
 *
 * @param {Array<Object>} entries - The entries to include in the markdown.
 * @param {string} entries[].content - The content of the entry.
 * @param {string} entries[].author - The author of the entry.
 * @return {string} The generated markdown content.
 */
const generateMarkdownContent = (entries) => {
  return entries.map((entry) => `- ${entry.content.split("\n")
    .join("\\\n")}\n\n  — ${entry.author}`).join("\n\n***\n\n");
};

/**
 * Pads a number with leading zeros.
 *
 * @param {number} number - The number to pad.
 * @param {number} width - The desired width of the number string.
 * @return {string} The padded number as a string.
 */
const padNumber = (number, width) => {
  const numberStr = number.toString();
  return numberStr.padStart(width, "0");
};

/**
 * Filters data entries by author.
 *
 * @param {Array<Object>} data - The data to filter.
 * @param {string} author - The author name to filter by.
 * @return {Array<Object>} Filtered data entries.
 */
const filterEntriesByAuthor = (data, author) => {
  return data.filter((entry) => entry.author === author);
};

/**
 * Creates markdown files from the given filtered data, with each file containing a specified number of entries.
 *
 * @param {Array<Object>} data - The filtered data to write to markdown files.
 * @param {number} [entriesPerFile=50] - The number of entries per markdown file.
 * @return {Promise<void>}
 */
const createMarkdownFiles = async (data, entriesPerFile = 50) => {
  const docsDir = path.resolve(__dirname, "..", "docs", "dohe");

  // Ensure the docs directory exists
  await fs.mkdir(docsDir, {recursive: true});

  let initial = 1;

  for (let i = 0; i < data.length; i += entriesPerFile) {
    const entries = data.slice(i, i + entriesPerFile);
    const startNumber = padNumber(i + 1, 2);
    const endNumber = padNumber(Math.min(i + entriesPerFile, data.length), 2);
    const heading = `संत कबीर के दोहे संग्रह - ${startNumber} to ${endNumber}`;
    const content = `# ${heading}\n\n${generateMarkdownContent(entries)}`;
    const fileName = `sant-kabir-ke-dohe-${padNumber(initial, 2)}.md`;
    const filePath = path.join(docsDir, fileName);

    await fs.writeFile(filePath, content, "utf8");
    console.log(`File created: ${path.basename(filePath)}`);
    initial++;
  }
};

/**
 * Main function to read data from a JSON file, filter by author, and generate markdown files.
 *
 * @return {Promise<void>}
 */
const main = async () => {
  try {
    const data = JSON.parse(await fs.readFile(path.resolve(__dirname, "dist", "santon-ke-dohe.json"), "utf8"));
    const filteredData = filterEntriesByAuthor(data, "संत कबीर साहब");

    await createMarkdownFiles(filteredData);
  } catch (error) {
    console.error("Error reading or processing data:", error);
  }
};

// Run the main function
main();

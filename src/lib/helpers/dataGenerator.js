/**
 * Import necessary packages and functions.
 */
import { json2csv } from "json-2-csv";
import { joinPath, writeFile } from "./fileSystemUtils.js";

/**
 * Generate JSON data from input data.
 * @param {Array} data - Input data.
 * @returns {Array} - Formatted JSON data.
 */
export function generateJson(data) {
  return data.map((set) => set.join("\n"));
}

/**
 * Generate text data from input data.
 * @param {Array} data - Input data.
 * @param {string} [suffix] - Optional suffix to append to each set. Default is an empty string.
 * @returns {string} - Formatted text data.
 */
export function generateTxt(data, suffix = "") {
  return data
    .map((set) => {
      const formattedSet = set.join("\n");
      return suffix ? `${formattedSet}\n\n${suffix}` : formattedSet;
    })
    .join("\n\n================================\n\n");
}

/**
 * Generate markdown data from input data.
 * @param {Array} data - Input data.
 * @returns {string} - Formatted markdown data.
 */
export function generateMd(data) {
  const title = "# संत कबीर दास जी के दोहे \n\n";
  const content = data
    .map((set) => `**${set.join("\\\n")}**\n\n~ गुरु कबीर साहब`)
    .join("\n\n---\n\n");
  return title + content;
}

/**
 * Generate CSV data from JSON data.
 * @param {Array} data - JSON data.
 * @returns {Promise<string>} - CSV data.
 */
export async function generateCSV(data) {
  const csvData = await json2csv(data.map((set) => [set.join("\n")]));
  return csvData;
}

/**
 * Generate data in specified format and write to file.
 * @param {Object} builder - Builder object containing data and configuration.
 * @param {string} type - Type of data to generate (e.g., "raw.json", "json", "txt", "md", "csv").
 * @returns {Promise<void>}
 */
export const generateData = async (builder, type) => {
  const {
    outputDir, fileName, data, txtSuffix,
  } = builder;
  const path = joinPath(outputDir, `${fileName}.${type}`);
  let fileData;

  switch (type) {
  case "raw.json":
    fileData = JSON.stringify(data, null, 2);
    break;
  case "json":
    fileData = JSON.stringify(generateJson(data), null, 2);
    break;
  case "txt":
    fileData = generateTxt(data, txtSuffix);
    break;
  case "md":
    fileData = generateMd(data);
    break;
  case "csv":
    fileData = await generateCSV(data);
    break;
  default:
    throw new Error(`Unsupported build type: ${type}`);
  }

  await writeFile(path, fileData);

  return Promise.resolve();
};

import { json2csv } from 'json-2-csv';

import { AUTHOR_PREFIX } from '../constants';
import type { BuildContext, DataEntry } from '../types';
import { joinPath, writeFile } from './fileSystemUtils';
import { latinToHindiNumber, padNumber } from './formatting';

/**
 * Generates a suffix string with the author information.
 * Prepends the author prefix to the author name if provided.
 *
 * @param {string} author - The author of the data entry.
 *
 * @returns {string} The generated suffix string, or empty string if no author.
 */
const generateSuffix = (author: string): string => (author ? `\n\n${AUTHOR_PREFIX} ${author}` : '');

/**
 * Sorts data entries by their id field in ascending alphabetical order.
 *
 * @param {DataEntry[]} data - The array of data entries to sort.
 *
 * @returns {DataEntry[]} A new array with entries sorted by id.
 */
export const sortData = (data: DataEntry[]): DataEntry[] => data.sort((a, b) => (a.id > b.id ? 1 : -1));

/**
 * Generate JSON data from input data (content lines joined into a single string).
 *
 * @param {DataEntry[]} data - Input data.
 *
 * @returns {Array<Omit<DataEntry, 'content'> & { content: string }>} Formatted JSON data.
 */
export function generateJson(data: DataEntry[]): Array<Omit<DataEntry, 'content'> & { content: string }> {
  return data.map((dataSet) => {
    const content = dataSet.content.join('\n');
    return { ...dataSet, content };
  });
}

/**
 * Generate text data from input data.
 *
 * @param {DataEntry[]} data - Input data.
 * @param {boolean} [appendNumber] - Whether to append index number to content. Default is false.
 *
 * @returns {string} Formatted text data.
 */
export function generateTxt(data: DataEntry[], appendNumber = false): string {
  return data
    .map((dataSet, index) => {
      const content = dataSet.content.join('\n');
      const indexSuffix = appendNumber ? `${latinToHindiNumber(padNumber(index + 1, 2))}।। ` : '';
      return `${content}${indexSuffix}${generateSuffix(dataSet.author)}`;
    })
    .join('\n\n================================\n\n');
}

/**
 * Generate markdown data from input data.
 *
 * @param {DataEntry[]} data - Input data.
 * @param {string} [title] - Optional title to prepend to document. Default is an empty string.
 * @param {boolean} [appendNumber] - Whether to append index number to content. Default is false.
 *
 * @returns {string} Formatted markdown data.
 */
export function generateMd(data: DataEntry[], title = '', appendNumber = false): string {
  const titlePrefix = title ? `# ${title}\n\n` : '';

  const output = data
    .map((dataSet, index) => {
      const content = dataSet.content.join('\\\n');
      const indexSuffix = appendNumber ? `${latinToHindiNumber(padNumber(index + 1, 2))}।। ` : '';
      return `${content}${indexSuffix}${generateSuffix(dataSet.author)}`;
    })
    .join('\n\n---\n\n');

  return titlePrefix + output;
}

/**
 * Generate CSV data from JSON data.
 *
 * @param {DataEntry[]} data - JSON data.
 *
 * @returns {Promise<string>} CSV data.
 */
export async function generateCSV(data: DataEntry[]): Promise<string> {
  const jsonData = data.map((dataSet) => [dataSet.content.join('\n') + generateSuffix(dataSet.author)]);
  return json2csv(jsonData);
}

/**
 * Generate data in specified format and write to file.
 *
 * @param {BuildContext} builder - Builder context containing data and configuration.
 * @param {string} type - Type of data to generate (e.g., "raw.json", "json", "txt", "md", "csv").
 *
 * @returns {Promise<void>}
 */
export const generateData = async (builder: BuildContext, type: string): Promise<void> => {
  const { outputDir, fileName, data, mdTitle, appendNumber } = builder;
  const filePath = joinPath(outputDir, `${fileName}.${type}`);
  let fileData: string;

  switch (type) {
    case 'raw.json':
      fileData = JSON.stringify(data, null, 2);
      break;
    case 'json':
      fileData = JSON.stringify(generateJson(data), null, 2);
      break;
    case 'txt':
      fileData = generateTxt(data, appendNumber);
      break;
    case 'md':
      fileData = generateMd(data, mdTitle, appendNumber);
      break;
    case 'csv':
      fileData = await generateCSV(data);
      break;
    default:
      throw new Error(`Unsupported build type: ${type}`);
  }

  await writeFile(filePath, fileData);
};

/**
 * Pads the index with leading zeros or a specified character to ensure a desired length.
 *
 * @param {number} index - The index to pad.
 * @param {number} [length] - The desired length of the resulting string. Default is 3.
 * @param {string | number} [char] - The character to use for padding. Default is "0".
 *
 * @returns {string} The padded index as a string.
 */
export const padIndex = (index: number, length = 3, char: string | number = 0): string => {
  return index.toString().padStart(length, char.toString());
};

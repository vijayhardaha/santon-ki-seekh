import { HINDI_DIGITS } from '../constants';

/**
 * Converts a Latin number to Hindi (Devanagari) numerals.
 *
 * @param {number | string} latinNumber - The number to convert.
 *
 * @returns {string} The number in Hindi numerals.
 */
export function latinToHindiNumber(latinNumber: number | string): string {
  return latinNumber
    .toString()
    .split('')
    .map((digit) => {
      const num = parseInt(digit, 10);
      return Number.isNaN(num) ? digit : (HINDI_DIGITS[num] ?? digit);
    })
    .join('');
}

/**
 * Splits raw Hindi couplet text at the danda (।) character into trimmed pada
 * lines, re-appending a single danda (।) to every line except the last and a
 * double danda (।।) to the final line. This reproduces the legacy multi-line
 * couplet format used by the original JavaScript output.
 *
 * @param {string} text - The raw couplet Hindi text (typically a single line).
 *
 * @returns {string[]} The couplet pada lines with terminating dandas.
 */
export function splitCoupletText(text: string): string[] {
  const lines = text
    .split('।')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.map((line, i) => (i === lines.length - 1 ? `${line}।।` : `${line}।`));
}

/**
 * Pads a number with leading zeros to a given width.
 *
 * @param {number} number - The number to pad.
 * @param {number} width - The desired total width.
 *
 * @returns {string} The zero-padded number string.
 */
export function padNumber(number: number, width: number): string {
  return number.toString().padStart(width, '0');
}

/**
 * A single entry used to render a dohe collection file.
 *
 * @type {DoheCollectionEntry}
 * @property {string} content - The raw couplet content.
 * @property {string} author - The author name of the couplet.
 */
export interface DoheCollectionEntry {
  content: string;
  author: string;
}

/**
 * Generates markdown content for a batch of dohe entries.
 * Matches the original legacy output format.
 *
 * @param {DoheCollectionEntry[]} entries - The entries to render.
 * @param {number} startNum - The starting index (1-based) for numbering.
 *
 * @returns {string} The generated markdown content.
 */
export function generateDoheMarkdown(entries: DoheCollectionEntry[], startNum: number): string {
  return entries
    .map((entry, index) => {
      const entryIndex = latinToHindiNumber(String(startNum + index).padStart(2, '0'));
      return `- ${entry.content.split('\n').join('\\\n')}${entryIndex}।।\n\n  — ${entry.author}`;
    })
    .join('\n\n---\n\n');
}

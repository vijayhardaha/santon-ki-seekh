/**
 * Returns true when the given number is a finite positive integer (> 0 and not NaN).
 *
 * @param {number} value - The value to validate.
 *
 * @returns {boolean} True if the value is a valid positive integer, false otherwise.
 */
export function isPositiveInteger(value: number): boolean {
  return !Number.isNaN(value) && value > 0;
}

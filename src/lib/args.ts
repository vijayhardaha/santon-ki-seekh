import { isPositiveInteger } from './utils';

/**
 * Parses the maximum number of files limit from CLI arguments or environment variables.
 *
 * @param {string[]} [argv] - Optional custom argv for testing. Defaults to process.argv.
 *
 * @returns {number | undefined} The file limit, or undefined if unlimited.
 */
export function parseFileLimit(argv?: string[]): number | undefined {
  const args = (argv ?? process.argv).slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith('--limit=')) {
      const val = parseInt(arg.split('=')[1], 10);
      if (isPositiveInteger(val)) {
        return val;
      }
    }

    if (arg === '--limit' && i + 1 < args.length) {
      const val = parseInt(args[i + 1], 10);
      if (isPositiveInteger(val)) {
        return val;
      }
    }
  }

  const envVal = process.env.MAX_FILES ? parseInt(process.env.MAX_FILES, 10) : undefined;
  if (envVal !== undefined && isPositiveInteger(envVal)) {
    return envVal;
  }

  return undefined;
}

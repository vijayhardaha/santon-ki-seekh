/**
 * Base URL of the Kabir Dohe API. Overridable via the COUPLETS_API_URL env var.
 */
export const API_BASE_URL = process.env.COUPLETS_API_URL ?? 'https://kabirdoheapi.vercel.app';

/**
 * Number of couplet entries to include in each markdown collection file.
 */
export const ENTRIES_PER_FILE = 100;

/**
 * Maximum number of retry attempts for failed API requests.
 */
export const MAX_RETRIES = 3;

/**
 * Delay in milliseconds between API request retry attempts.
 */
export const RETRY_DELAY_MS = 1000;

/**
 * Prefix used to decorate an author suffix in generated text.
 */
export const AUTHOR_PREFIX = '—';

/**
 * Author name used for Kabir Saheb dohas/collections.
 */
export const SANT_KABIR = 'संत कबीर दास साहेब';

/**
 * Author name used for Kabir bhajans.
 */
export const GURU_KABIR = 'गुरु कबीर दास साहेब';

/**
 * Author name used for Acharya Prashant quotes.
 */
export const ACHARYA_PRASHANT = 'आचार्य प्रशांत';

/**
 * Hindi (Devanagari) digits for converting Latin numbers to Hindi numerals.
 */
export const HINDI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

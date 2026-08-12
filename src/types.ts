/**
 * A single couplet post returned by the live Kabir Dohe API.
 *
 * @type {ApiPost}
 * @property {number} number - Sequential post number.
 * @property {string} slug - URL-friendly slug.
 * @property {string} text_hi - Hindi text of the couplet.
 * @property {string} text_en - English transliteration of the couplet.
 * @property {string | null} meaning_hi - Hindi meaning/translation, may be null.
 * @property {string | null} meaning_en - English meaning/translation, may be null.
 * @property {{ name: string; slug: string } | null} category - Category info, or null when unassigned.
 * @property {Array<{ name: string; slug: string }>} tags - Tags associated with the couplet.
 * @property {string} created_at - Creation timestamp.
 * @property {string} updated_at - Last update timestamp.
 */
export interface ApiPost {
  number: number;
  slug: string;
  text_hi: string;
  text_en: string;
  meaning_hi: string | null;
  meaning_en: string | null;
  category: { name: string; slug: string } | null;
  tags: Array<{ name: string; slug: string }>;
  created_at: string;
  updated_at: string;
}

/**
 * The response envelope returned by the couplets API.
 *
 * @type {ApiResponse}
 * @property {boolean} success - Whether the API request succeeded.
 * @property {{ posts: ApiPost[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }} data - The response data containing posts and pagination info.
 */
export interface ApiResponse {
  success: boolean;
  data: { posts: ApiPost[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean };
}

/**
 * A single record used to build the downloadable assets (bhajan, doha, quote).
 *
 * @type {DataEntry}
 * @property {string} id - Unique slug/id of the entry.
 * @property {string} author - Author name of the entry.
 * @property {string[]} content - Lines of the entry content.
 */
export interface DataEntry {
  id: string;
  author: string;
  content: string[];
}

/**
 * Metadata describing how a dataset should be rendered into assets.
 *
 * @type {BuildMeta}
 * @property {string} fileName - Base file name for the generated assets.
 * @property {string} mdTitle - Title used in the markdown document.
 * @property {DataEntry[]} data - The dataset to render.
 * @property {boolean} appendNumber - Whether to append a Hindi index number to each entry.
 */
export interface BuildMeta {
  fileName: string;
  mdTitle: string;
  data: DataEntry[];
  appendNumber: boolean;
}

/**
 * The subset of a builder configuration needed by the data generator.
 *
 * @type {BuildContext}
 * @property {string} outputDir - Directory to write generated files into.
 * @property {string} fileName - Base file name for the generated assets.
 * @property {DataEntry[]} data - The dataset to render.
 * @property {string} mdTitle - Title used in the markdown document.
 * @property {boolean} appendNumber - Whether to append a Hindi index number to each entry.
 */
export interface BuildContext extends BuildMeta {
  outputDir: string;
}

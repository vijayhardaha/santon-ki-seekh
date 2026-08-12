import { API_BASE_URL, ENTRIES_PER_FILE, MAX_RETRIES, RETRY_DELAY_MS } from '../constants';
import type { ApiPost, ApiResponse } from '../types';

/**
 * Constructs the URL for fetching a specific page of couplets from the API.
 *
 * @param {number} page - The 1-based page number.
 * @param {number} [perPage] - The number of couplets per page.
 *
 * @returns {string} The constructed API endpoint URL.
 */
export function getCoupletsApiUrl(page: number, perPage: number = ENTRIES_PER_FILE): string {
  return `${API_BASE_URL}/api/couplets?per_page=${perPage}&page=${page}`;
}

/**
 * Fetches a single page of couplets from the API.
 *
 * @param {number} page - The page number to fetch (1-based).
 *
 * @returns {Promise<ApiPost[]>} The posts on the page, empty when the page has no posts.
 *
 * @throws {Error} When the request fails after MAX_RETRIES attempts or the response is invalid.
 */
export async function fetchPage(page: number): Promise<ApiPost[]> {
  const url = getCoupletsApiUrl(page);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const json: unknown = await response.json();
      const body = json as ApiResponse;

      if (!body?.success || !Array.isArray(body.data?.posts)) {
        throw new Error('API response shape is invalid');
      }

      return body.data.posts;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (attempt < MAX_RETRIES) {
        console.warn(`Page ${page} fetch failed (attempt ${attempt}/${MAX_RETRIES}): ${message}. Retrying...`);
        await new Promise((resolveTimeout) => setTimeout(resolveTimeout, RETRY_DELAY_MS));
        continue;
      }

      throw new Error(`Page ${page} fetch failed after ${MAX_RETRIES} attempts: ${message}`);
    }
  }

  throw new Error(`Page ${page} fetch failed after ${MAX_RETRIES} attempts`);
}

/**
 * Fetches every page of couplets from the API until an empty page is returned.
 *
 * @returns {Promise<ApiPost[]>} All couplet posts across all pages.
 *
 * @throws {Error} When a page fails after MAX_RETRIES attempts.
 */
export async function fetchAllCouplets(): Promise<ApiPost[]> {
  const all: ApiPost[] = [];

  for (let page = 1; ; page += 1) {
    const posts = await fetchPage(page);

    // Stop when a page returns no posts.
    if (posts.length === 0) {
      break;
    }

    all.push(...posts);
  }

  return all;
}

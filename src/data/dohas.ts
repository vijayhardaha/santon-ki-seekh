import { SANT_KABIR } from '../constants';
import { padIndex } from '../lib/dataGenerator';
import type { ApiPost, DataEntry } from '../types';

/**
 * Converts raw couplet posts (from the Kabir Dohe API) into doha data entries.
 * Empty/whitespace-only couplets are filtered out.
 *
 * @param {ApiPost[]} posts - The couplet posts returned by the API.
 *
 * @returns {DataEntry[]} The converted doha entries.
 */
export function convertCoupletsToDohas(posts: ApiPost[]): DataEntry[] {
  return posts
    .filter((post) => post.text_hi && post.text_hi.trim() !== '')
    .map((post) => ({
      id: `${post.slug}-${padIndex(post.number)}`,
      author: SANT_KABIR,
      content: [post.text_hi.trim()],
    }));
}

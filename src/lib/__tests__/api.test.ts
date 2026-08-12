import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL, ENTRIES_PER_FILE } from '../../constants';
import type { ApiPost, ApiResponse } from '../../types';
import { fetchAllCouplets, fetchPage, getCoupletsApiUrl } from '../api';

/**
 * Minimal valid ApiPost factory for tests.
 *
 * @param {Partial<ApiPost>} overrides - Optional partial overrides for ApiPost fields.
 *
 * @returns {ApiPost} A fully populated ApiPost with default values and overrides applied.
 */
function makePost(overrides: Partial<ApiPost> = {}): ApiPost {
  return {
    number: 1,
    slug: 'test-doha',
    text_hi: 'कबीर दोहा',
    text_en: 'Kabir doha',
    meaning_hi: 'अर्थ',
    meaning_en: 'meaning',
    category: null,
    tags: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('api module', () => {
  describe('getCoupletsApiUrl', () => {
    it('should construct API URL with default perPage', () => {
      const url = getCoupletsApiUrl(1);
      expect(url).toBe(`${API_BASE_URL}/api/couplets?per_page=${ENTRIES_PER_FILE}&page=1`);
    });

    it('should construct API URL with custom perPage', () => {
      const url = getCoupletsApiUrl(2, 10);
      expect(url).toBe(`${API_BASE_URL}/api/couplets?per_page=10&page=2`);
    });
  });

  describe('fetchPage', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should fetch posts successfully on first attempt', async () => {
      const mockResponse: ApiResponse = {
        success: true,
        data: {
          posts: [makePost({ number: 1, text_hi: 'कबीर दोहा १' }), makePost({ number: 2, text_hi: 'कबीर दोहा २' })],
          total: 2,
          totalPages: 1,
          page: 1,
          per_page: ENTRIES_PER_FILE,
          pagination: false,
        },
      };

      global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockResponse } as Response);

      const posts = await fetchPage(1);

      expect(posts).toHaveLength(2);
      expect(posts[0].text_hi).toBe('कबीर दोहा १');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed', async () => {
      const mockResponse: ApiResponse = {
        success: true,
        data: { posts: [makePost()], total: 1, totalPages: 1, page: 1, per_page: ENTRIES_PER_FILE, pagination: false },
      };

      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse } as Response);

      const posts = await fetchPage(1);

      expect(posts).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should throw error when HTTP response is not ok after retries', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response);

      await expect(fetchPage(1)).rejects.toThrow('Page 1 fetch failed after 3 attempts: API responded with status 500');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should throw error when API response shape is invalid', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) } as Response);

      await expect(fetchPage(1)).rejects.toThrow('Page 1 fetch failed after 3 attempts: API response shape is invalid');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should handle non-Error thrown values in catch branch', async () => {
      global.fetch = vi.fn().mockRejectedValue('plain string error');

      await expect(fetchPage(1)).rejects.toThrow('Page 1 fetch failed after 3 attempts: plain string error');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('fetchAllCouplets', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should fetch all pages until an empty page is returned', async () => {
      const pageOne: ApiResponse = {
        success: true,
        data: { posts: [makePost({ number: 1 })], total: 1, totalPages: 1, page: 1, per_page: 1, pagination: true },
      };
      const emptyPage: ApiResponse = {
        success: true,
        data: { posts: [], total: 1, totalPages: 1, page: 2, per_page: 1, pagination: true },
      };

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => pageOne } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => emptyPage } as Response);

      const posts = await fetchAllCouplets();

      expect(posts).toHaveLength(1);
      expect(posts[0].number).toBe(1);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});

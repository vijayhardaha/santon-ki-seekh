import { describe, expect, it } from 'vitest';

import { GURU_KABIR } from '../../constants';
import BhajanMeta from '../bhajans';

describe('bhajans dataset', () => {
  it('should export a valid BuildMeta configuration', () => {
    expect(BhajanMeta).toBeDefined();
    expect(BhajanMeta.fileName).toBe('santon-ke-bhajan');
    expect(BhajanMeta.mdTitle).toBe('संतों के भजन (Prayers)');
    expect(BhajanMeta.appendNumber).toBe(false);
  });

  it('should contain at least one bhajan entry', () => {
    expect(BhajanMeta.data.length).toBeGreaterThan(0);
  });

  it('should have unique kebab-case ids for every entry', () => {
    const ids = BhajanMeta.data.map((entry) => entry.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('should set the author and non-empty content for every entry', () => {
    for (const entry of BhajanMeta.data) {
      expect(entry.author).toBe(GURU_KABIR);
      expect(Array.isArray(entry.content)).toBe(true);
      expect(entry.content.length).toBeGreaterThan(0);
      expect(entry.content.every((line) => typeof line === 'string')).toBe(true);
    }
  });
});

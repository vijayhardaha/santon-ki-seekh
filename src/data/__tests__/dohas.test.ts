import { describe, expect, it } from 'vitest';

import { SANT_KABIR } from '../../constants';
import type { ApiPost } from '../../types';
import { convertCoupletsToDohas } from '../dohas';

const makePost = (overrides: Partial<ApiPost> = {}): ApiPost => ({
  number: 1,
  slug: 'kabir-doha',
  text_hi: 'दोहा पंक्ति।।',
  text_en: 'doha line',
  meaning_hi: 'अर्थ',
  meaning_en: 'meaning',
  category: null,
  tags: [],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('dohas mapper', () => {
  it('should convert couplet posts into doha entries', () => {
    const entries = convertCoupletsToDohas([makePost({ number: 7, slug: 'kabir-doha' })]);

    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe('kabir-doha-007');
    expect(entries[0].author).toBe(SANT_KABIR);
    expect(entries[0].content).toEqual(['दोहा पंक्ति।।']);
  });

  it('should filter out empty or whitespace-only couplets', () => {
    const entries = convertCoupletsToDohas([
      makePost({ number: 1 }),
      makePost({ number: 2, text_hi: '' }),
      makePost({ number: 3, text_hi: '   ' }),
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe('kabir-doha-001');
  });

  it('should split couplet text into multiple pada lines', () => {
    const entries = convertCoupletsToDohas([
      makePost({ text_hi: 'बलिहारी गुरु आपनो, घड़ी-घड़ी सौ सौ बार। मानुष से देवत किया, करत न लागी बार।।' }),
    ]);

    expect(entries[0].content).toEqual([
      'बलिहारी गुरु आपनो, घड़ी-घड़ी सौ सौ बार।',
      'मानुष से देवत किया, करत न लागी बार।।',
    ]);
  });

  it('should percent-pad the number into the entry id', () => {
    const entries = convertCoupletsToDohas([makePost({ number: 123 })]);
    expect(entries[0].id).toBe('kabir-doha-123');
  });
});

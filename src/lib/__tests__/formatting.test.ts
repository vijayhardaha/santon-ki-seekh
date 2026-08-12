import { describe, expect, it } from 'vitest';

import { generateDoheMarkdown, latinToHindiNumber, padNumber } from '../formatting';
import type { DoheCollectionEntry } from '../formatting';

describe('formatting module', () => {
  describe('latinToHindiNumber', () => {
    it('should convert single digits to Hindi numerals', () => {
      expect(latinToHindiNumber(0)).toBe('०');
      expect(latinToHindiNumber(5)).toBe('५');
      expect(latinToHindiNumber(9)).toBe('९');
    });

    it('should convert multi-digit numbers to Hindi numerals', () => {
      expect(latinToHindiNumber(123)).toBe('१२३');
      expect(latinToHindiNumber('2050')).toBe('२०५०');
    });
  });

  describe('padNumber', () => {
    it('should pad numbers with leading zeros', () => {
      expect(padNumber(1, 2)).toBe('01');
      expect(padNumber(50, 2)).toBe('50');
      expect(padNumber(5, 3)).toBe('005');
    });

    it('should not pad when number length exceeds width', () => {
      expect(padNumber(1234, 2)).toBe('1234');
    });
  });

  describe('generateDoheMarkdown', () => {
    it('should render entries as list items with Hindi index, danda and author', () => {
      const entries: DoheCollectionEntry[] = [
        { content: 'गुरु गोविंद दोऊ खड़े। काके लागूं पांय।', author: 'संत कबीर दास साहेब' },
        { content: 'बलिहारी गुरु आपने। गोबिंद दियो बताय।', author: 'संत कबीर दास साहेब' },
      ];

      const markdown = generateDoheMarkdown(entries, 1);
      expect(markdown).toContain('- गुरु गोविंद दोऊ खड़े। काके लागूं पांय।०१।।\n\n  — संत कबीर दास साहेब');
      expect(markdown).toContain('- बलिहारी गुरु आपने। गोबिंद दियो बताय।०२।।');
      expect(markdown).toContain('***');
    });

    it('should preserve newlines as hard markdown line breaks', () => {
      const entries: DoheCollectionEntry[] = [{ content: 'पहली पंक्ति।\nदूसरी पंक्ति।', author: 'संत कबीर दास साहेब' }];

      const markdown = generateDoheMarkdown(entries, 1);
      expect(markdown).toContain('- पहली पंक्ति।\\\nदूसरी पंक्ति।०१।।');
    });
  });
});

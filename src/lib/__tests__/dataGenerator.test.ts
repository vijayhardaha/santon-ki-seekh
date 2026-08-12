import { describe, expect, it } from 'vitest';

import { SANT_KABIR } from '../../constants';
import type { DataEntry } from '../../types';
import { generateCSV, generateJson, generateMd, generateTxt, padIndex, sortData } from '../dataGenerator';

const makeEntry = (id: string, content: string[], author = SANT_KABIR): DataEntry => ({ id, author, content });

const sampleData: DataEntry[] = [makeEntry('b', ['पंक्ति 1', 'पंक्ति 2']), makeEntry('a', ['पंक्ति एक'], 'गुरु कबीर')];

describe('dataGenerator module', () => {
  describe('sortData', () => {
    it('should sort entries by id in ascending order', () => {
      const sorted = sortData([...sampleData]);
      expect(sorted.map((entry) => entry.id)).toEqual(['a', 'b']);
    });
  });

  describe('generateJson', () => {
    it('should join content lines with newline', () => {
      const json = generateJson(sampleData);
      expect(json[0].content).toBe('पंक्ति 1\nपंक्ति 2');
    });
  });

  describe('generateTxt', () => {
    it('should join entries with the standard separator', () => {
      const txt = generateTxt(sampleData);
      expect(txt).toContain('================================');
      expect(txt).toContain(`— ${SANT_KABIR}`);
    });

    it('should append Hindi index number when appendNumber is true', () => {
      const txt = generateTxt(sampleData, true);
      expect(txt).toContain('१।। ');
    });
  });

  describe('generateMd', () => {
    it('should prepend the title when provided', () => {
      const md = generateMd(sampleData, 'संतों के दोहे (Couplets)');
      expect(md).toContain('# संतों के दोहे (Couplets)');
    });

    it('should format content lines with markdown trailing backslashes', () => {
      const md = generateMd(sampleData);
      expect(md).toContain('पंक्ति 1\\\nपंक्ति 2');
    });
  });

  describe('generateCSV', () => {
    it('should produce CSV data including author suffix', async () => {
      const csv = await generateCSV(sampleData);
      expect(csv).toContain('पंक्ति 1');
      expect(csv).toContain('संत कबीर');
    });
  });

  describe('padIndex', () => {
    it('should pad index to default length 3', () => {
      expect(padIndex(5)).toBe('005');
    });

    it('should pad index to a custom length', () => {
      expect(padIndex(5, 2)).toBe('05');
    });
  });
});

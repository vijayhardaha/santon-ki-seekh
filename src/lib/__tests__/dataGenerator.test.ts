import { describe, expect, it } from 'vitest';

import { SANT_KABIR } from '../../constants';
import type { BuildContext, DataEntry } from '../../types';
import { generateCSV, generateData, generateJson, generateMd, generateTxt } from '../dataGenerator';

const makeEntry = (id: string, content: string[], author = SANT_KABIR): DataEntry => ({ id, author, content });

const sampleData: DataEntry[] = [makeEntry('b', ['पंक्ति 1', 'पंक्ति 2']), makeEntry('a', ['पंक्ति एक'], 'गुरु कबीर')];

describe('dataGenerator module', () => {
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

    it('should append Hindi index number when appendNumber is true', () => {
      const md = generateMd(sampleData, 'संतों के दोहे (Couplets)', true);
      expect(md).toContain('०१।। ');
    });

    it('should render no author suffix when author is empty', () => {
      const md = generateMd([makeEntry('c', ['पंक्ति'], '')], 'शीर्षक');
      expect(md).not.toContain('—');
    });
  });

  describe('generateCSV', () => {
    it('should produce CSV data including author suffix', async () => {
      const csv = await generateCSV(sampleData);
      expect(csv).toContain('पंक्ति 1');
      expect(csv).toContain('संत कबीर');
    });
  });

  describe('generateData', () => {
    const context: BuildContext = {
      outputDir: '/tmp',
      fileName: 'test-assets',
      mdTitle: 'Test Collection',
      data: sampleData,
      appendNumber: false,
    };

    it('should throw for an unsupported build type', async () => {
      await expect(generateData(context, 'xml')).rejects.toThrow('Unsupported build type: xml');
    });
  });
});

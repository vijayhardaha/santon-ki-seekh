import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { describe, expect, it } from 'vitest';

import { getFileExtension, getFileName, isExists, joinPath, makeDir, writeFile } from '../fileSystemUtils';

describe('fileSystemUtils module', () => {
  const tempDir = join(tmpdir(), `fss-utils-test-${Date.now()}`);

  describe('getFileExtension', () => {
    it('should return the file extension', () => {
      expect(getFileExtension('/a/b/file.json')).toBe('.json');
    });

    it('should return an empty string when there is no extension', () => {
      expect(getFileExtension('/a/b/file')).toBe('');
    });
  });

  describe('getFileName', () => {
    it('should return the basename with extension', () => {
      expect(getFileName('/a/b/file.json')).toBe('file.json');
    });

    it('should return the basename without extension when removeExt is true', () => {
      expect(getFileName('/a/b/file.json', true)).toBe('file');
    });
  });

  describe('joinPath', () => {
    it('should join path segments', () => {
      expect(joinPath('a', 'b', 'c.txt')).toBe('a/b/c.txt');
    });
  });

  describe('makeDir / writeFile / isExists', () => {
    it('should create a directory, write a file and confirm it exists', async () => {
      await makeDir(tempDir);
      const filePath = join(tempDir, 'example.md');
      await writeFile(filePath, 'content');

      expect(await isExists(filePath)).toBe(true);
      const data = await fs.readFile(filePath, 'utf8');
      expect(data).toBe('content');

      await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('should return false for non-existent paths', async () => {
      expect(await isExists(join(tempDir, 'missing.txt'))).toBe(false);
    });
  });
});

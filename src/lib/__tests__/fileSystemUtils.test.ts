import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { describe, expect, it } from 'vitest';

import { joinPath, makeDir, writeFile } from '../fileSystemUtils';

describe('fileSystemUtils module', () => {
  const tempDir = join(tmpdir(), `fss-utils-test-${Date.now()}`);

  describe('joinPath', () => {
    it('should join path segments', () => {
      expect(joinPath('a', 'b', 'c.txt')).toBe('a/b/c.txt');
    });
  });

  describe('makeDir / writeFile', () => {
    it('should create a directory and write a file', async () => {
      await makeDir(tempDir);
      const filePath = join(tempDir, 'example.md');
      await writeFile(filePath, 'content');

      const data = await fs.readFile(filePath, 'utf8');
      expect(data).toBe('content');

      await fs.rm(tempDir, { recursive: true, force: true });
    });
  });
});

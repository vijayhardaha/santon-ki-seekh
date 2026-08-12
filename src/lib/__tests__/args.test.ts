import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { parseFileLimit } from '../args';

describe('args module', () => {
  describe('parseFileLimit', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.MAX_FILES;
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return undefined when no limit flags or env var are present', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts'];
      const result = parseFileLimit(args);
      expect(result).toBeUndefined();
    });

    it('should parse --limit=<n> flag with valid positive integer', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit=5'];
      const result = parseFileLimit(args);
      expect(result).toBe(5);
    });

    it('should ignore --limit=<n> flag with zero', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit=0'];
      const result = parseFileLimit(args);
      expect(result).toBeUndefined();
    });

    it('should ignore --limit=<n> flag with negative number', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit=-3'];
      const result = parseFileLimit(args);
      expect(result).toBeUndefined();
    });

    it('should ignore --limit=<n> flag with non-numeric value', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit=abc'];
      const result = parseFileLimit(args);
      expect(result).toBeUndefined();
    });

    it('should parse --limit <n> flag with valid positive integer', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit', '10'];
      const result = parseFileLimit(args);
      expect(result).toBe(10);
    });

    it('should ignore --limit <n> flag with missing value', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit'];
      const result = parseFileLimit(args);
      expect(result).toBeUndefined();
    });

    it('should ignore --limit <n> flag with non-positive value', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit', '0'];
      const result = parseFileLimit(args);
      expect(result).toBeUndefined();
    });

    it('should prefer --limit=<n> flag over MAX_FILES env var', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit=7'];
      process.env.MAX_FILES = '20';
      const result = parseFileLimit(args);
      expect(result).toBe(7);
    });

    it('should fall back to MAX_FILES env var when no flag present', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts'];
      process.env.MAX_FILES = '15';
      const result = parseFileLimit(args);
      expect(result).toBe(15);
    });

    it('should ignore MAX_FILES env var with invalid value', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts'];
      process.env.MAX_FILES = 'invalid';
      const result = parseFileLimit(args);
      expect(result).toBeUndefined();
    });

    it('should handle multiple flags and use the first valid one', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit=0', '--limit', '8'];
      const result = parseFileLimit(args);
      expect(result).toBe(8);
    });

    it('should truncate decimal numbers to integers', () => {
      const args: string[] = ['bun', 'run', 'src/build.ts', '--limit=3.14'];
      const result = parseFileLimit(args);
      expect(result).toBe(3);
    });

    it('should use process.argv when argv parameter is not provided', () => {
      process.env.MAX_FILES = '99';
      const originalArgv = process.argv;
      process.argv = ['bun', 'run', 'src/build.ts'];
      const result = parseFileLimit();
      process.argv = originalArgv;
      expect(result).toBe(99);
    });
  });
});

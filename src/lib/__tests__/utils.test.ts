import { describe, expect, it } from 'vitest';

import { isPositiveInteger } from '../utils';

describe('utils module', () => {
  describe('isPositiveInteger', () => {
    it('should return true for positive integers', () => {
      expect(isPositiveInteger(1)).toBe(true);
      expect(isPositiveInteger(50)).toBe(true);
      expect(isPositiveInteger(1000)).toBe(true);
    });

    it('should return false for zero', () => {
      expect(isPositiveInteger(0)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(isPositiveInteger(-1)).toBe(false);
      expect(isPositiveInteger(-100)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(isPositiveInteger(NaN)).toBe(false);
    });

    it('should return true for positive decimal numbers', () => {
      expect(isPositiveInteger(3.14)).toBe(true);
    });
  });
});

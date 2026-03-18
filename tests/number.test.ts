/**
 * Number Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  clamp, 
  randomInt, 
  round, 
  formatBytes, 
  formatNumber,
  sum,
  average,
  median,
  min,
  max,
  range
} from '../src/utils/number.js';

describe('Number Utilities', () => {
  describe('clamp', () => {
    it('should clamp value', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('randomInt', () => {
    it('should generate random integer in range', () => {
      const result = randomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('round', () => {
    it('should round to decimals', () => {
      expect(round(3.14159, 2)).toBe(3.14);
      expect(round(3.5)).toBe(4);
    });
  });

  describe('formatBytes', () => {
    it('should format bytes', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
    });
  });

  describe('formatNumber', () => {
    it('should format with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('sum', () => {
    it('should sum array', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });
  });

  describe('average', () => {
    it('should calculate average', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
    });
  });

  describe('median', () => {
    it('should calculate median', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3);
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });
  });

  describe('min/max', () => {
    it('should find min and max', () => {
      expect(min([3, 1, 4, 1, 5])).toBe(1);
      expect(max([3, 1, 4, 1, 5])).toBe(5);
    });
  });

  describe('range', () => {
    it('should generate range', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
      expect(range(0, 6, 2)).toEqual([0, 2, 4]);
    });
  });
});

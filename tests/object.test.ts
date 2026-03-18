/**
 * Object Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  deepClone, 
  deepMerge, 
  pick, 
  omit, 
  groupBy,
  uniqueBy,
  chunk
} from '../src/utils/object.js';

describe('Object Utilities', () => {
  describe('deepClone', () => {
    it('should deep clone object', () => {
      const original = { a: { b: { c: 1 } } };
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should handle arrays', () => {
      const original = [{ a: 1 }, { b: 2 }];
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('deepMerge', () => {
    it('should deep merge objects', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 }, e: 4 };
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });
  });

  describe('pick', () => {
    it('should pick keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('groupBy', () => {
    it('should group by key', () => {
      const arr = [{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }];
      const grouped = groupBy(arr, 'type');
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });
  });

  describe('uniqueBy', () => {
    it('should return unique values by key', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
      const unique = uniqueBy(arr, 'id');
      expect(unique).toHaveLength(2);
    });
  });

  describe('chunk', () => {
    it('should chunk array', () => {
      const arr = [1, 2, 3, 4, 5];
      const chunks = chunk(arr, 2);
      expect(chunks).toEqual([[1, 2], [3, 4], [5]]);
    });
  });
});

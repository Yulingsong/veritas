/**
 * Collection Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  mapValues, 
  mapKeys, 
  filterObject, 
  reduceObject,
  get,
  set,
  has,
  del
} from '../src/utils/collection.js';

describe('Collection Utilities', () => {
  describe('mapValues', () => {
    it('should map values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapValues(obj, (v) => v * 2);
      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });
  });

  describe('mapKeys', () => {
    it('should map keys', () => {
      const obj = { a: 1, b: 2 };
      const result = mapKeys(obj, (k) => k.toUpperCase());
      expect(result).toEqual({ A: 1, B: 2 });
    });
  });

  describe('filterObject', () => {
    it('should filter object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterObject(obj, (v) => v > 1);
      expect(result).toEqual({ b: 2, c: 3 });
    });
  });

  describe('reduceObject', () => {
    it('should reduce object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = reduceObject(obj, (acc, v) => acc + v, 0);
      expect(result).toBe(6);
    });
  });

  describe('get', () => {
    it('should get nested value', () => {
      const obj = { a: { b: { c: 123 } };
      expect(get(obj, 'a.b.c')).toBe(123);
      expect(get(obj, 'a.b.d', 'default')).toBe('default');
    });
  });

  describe('set', () => {
    it('should set nested value', () => {
      const obj: any = {};
      set(obj, 'a.b.c', 123);
      expect(obj.a.b.c).toBe(123);
    });
  });

  describe('has', () => {
    it('should check nested property', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(has(obj, 'a.b.c')).toBe(true);
      expect(has(obj, 'a.b.d')).toBe(false);
    });
  });

  describe('del', () => {
    it('should delete nested property', () => {
      const obj: any = { a: { b: { c: 1 } } };
      del(obj, 'a.b.c');
      expect(has(obj, 'a.b.c')).toBe(false);
    });
  });
});

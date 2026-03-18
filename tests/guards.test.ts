/**
 * Type Guards Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  isArray, 
  isObject, 
  isString, 
  isNumber, 
  isBoolean,
  isFunction,
  isNull,
  isUndefined,
  isEmpty,
  isPromise,
  isDate,
  isError,
  isPlainObject
} from '../src/utils/guards.js';

describe('Type Guards', () => {
  describe('isArray', () => {
    it('should detect arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray({})).toBe(false);
      expect(isArray('abc')).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should detect objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(true);
      expect(isObject(null)).toBe(false);
      expect(isObject('abc')).toBe(false);
    });
  });

  describe('isString', () => {
    it('should detect strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('abc')).toBe(true);
      expect(isString(123)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should detect numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber('123')).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should detect booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(0)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should detect functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction({})).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should detect null', () => {
      expect(isNull(null)).toBe(true);
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should detect undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(null)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should detect empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty('abc')).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should detect promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise({ then: () => {} })).toBe(true);
      expect(isPromise({})).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should detect dates', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate('2024-01-01')).toBe(false);
    });
  });

  describe('isError', () => {
    it('should detect errors', () => {
      expect(isError(new Error())).toBe(true);
      expect(isError({})).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('should detect plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject([])).toBe(false);
    });
  });
});

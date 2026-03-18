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
    it('should check if array', () => {
      expect(isArray([])).toBe(true);
      expect(isArray({})).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should check if object', () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(true);
      expect(isObject(null)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should check if string', () => {
      expect(isString('')).toBe(true);
      expect(isString(123)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should check if number', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(NaN)).toBe(true);
      expect(isNumber('123')).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should check if boolean', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(1)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should check if function', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(class {})).toBe(true);
      expect(isFunction({})).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should check if null', () => {
      expect(isNull(null)).toBe(true);
      expect(isNull(undefined)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should check if undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(null)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should check if empty', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty('hello')).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should check if promise', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise({ then: () => {} })).toBe(true);
      expect(isPromise({})).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should check if date', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate('2024-01-01')).toBe(false);
    });
  });

  describe('isError', () => {
    it('should check if error', () => {
      expect(isError(new Error())).toBe(true);
      expect(isError({ message: 'error' })).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('should check if plain object', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject([])).toBe(false);
    });
  });
});

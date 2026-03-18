/**
 * JSON Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  jsonParse, 
  jsonStringify, 
  queryStringToObject,
  objectToQueryString,
  flattenObject,
  unflattenObject
} from '../src/utils/json.js';

describe('JSON Utilities', () => {
  describe('jsonParse', () => {
    it('should parse valid JSON', () => {
      expect(jsonParse('{"a":1}')).toEqual({ a: 1 });
    });

    it('should return default for invalid JSON', () => {
      expect(jsonParse('invalid', { fallback: true })).toEqual({ fallback: true });
      expect(jsonParse('invalid')).toBeNull();
    });
  });

  describe('jsonStringify', () => {
    it('should stringify object', () => {
      expect(jsonStringify({ a: 1 })).toBe('{"a":1}');
    });

    it('should pretty print', () => {
      const result = jsonStringify({ a: 1 }, true);
      expect(result).toContain('\n');
    });
  });

  describe('queryStringToObject', () => {
    it('should convert query string to object', () => {
      expect(queryStringToObject('a=1&b=2')).toEqual({ a: '1', b: '2' });
    });
  });

  describe('objectToQueryString', () => {
    it('should convert object to query string', () => {
      expect(objectToQueryString({ a: '1', b: '2' })).toBe('a=1&b=2');
    });
  });

  describe('flattenObject', () => {
    it('should flatten nested object', () => {
      const result = flattenObject({ a: { b: { c: 1 } });
      expect(result).toEqual({ 'a.b.c': 1 });
    });
  });

  describe('unflattenObject', () => {
    it('should unflatten object', () => {
      const result = unflattenObject({ 'a.b.c': 1 });
      expect(result).toEqual({ a: { b: { c: 1 } });
    });
  });
});

/**
 * JSON & Storage Utilities Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
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
      expect(jsonParse('invalid', { a: 1 })).toEqual({ a: 1 });
    });
  });

  describe('jsonStringify', () => {
    it('should stringify JSON', () => {
      expect(jsonStringify({ a: 1 })).toBe('{"a":1}');
    });
  });

  describe('queryStringToObject', () => {
    it('should convert query string to object', () => {
      expect(queryStringToObject('a=1&b=2')).toEqual({ a: '1', b: '2' });
    });
  });

  describe('objectToQueryString', () => {
    it('should convert object to query string', () => {
      expect(objectToQueryString({ a: 1, b: 2 })).toBe('a=1&b=2');
    });
  });

  describe('flattenObject', () => {
    it('should flatten nested object', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(flattenObject(obj)).toEqual({ 'a.b.c': 1 });
    });
  });

  describe('unflattenObject', () => {
    it('should unflatten object', () => {
      const obj = { 'a.b.c': 1 };
      expect(unflattenObject(obj)).toEqual({ a: { b: { c: 1 } } });
    });
  });
});

describe('Storage Utilities', () => {
  const tmpDir = path.join(os.tmpdir(), 'veritas-test-' + Date.now());
  
  beforeEach(() => {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
  });
  
  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });

  // Note: LocalStorage and MemoryCache tests would go here
  // They're tested indirectly through integration tests
});

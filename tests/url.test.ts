/**
 * URL & Env Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  getQueryParams, 
  buildUrl, 
  addQueryParam, 
  removeQueryParam,
  getDomain,
  isValidUrl 
} from '../src/utils/url.js';
import { 
  env, 
  isDevelopment, 
  isProduction, 
  boolEnv, 
  numEnv 
} from '../src/utils/env.js';

describe('URL Utilities', () => {
  describe('getQueryParams', () => {
    it('should parse query params', () => {
      const params = getQueryParams('https://example.com?a=1&b=2');
      expect(params).toEqual({ a: '1', b: '2' });
    });
  });

  describe('buildUrl', () => {
    it('should build URL with params', () => {
      const url = buildUrl('https://example.com', { a: '1', b: '2' });
      expect(url).toContain('a=1');
      expect(url).toContain('b=2');
    });
  });

  describe('addQueryParam', () => {
    it('should add query param', () => {
      const url = addQueryParam('https://example.com', 'a', '1');
      expect(url).toContain('a=1');
    });
  });

  describe('removeQueryParam', () => {
    it('should remove query param', () => {
      const url = removeQueryParam('https://example.com?a=1', 'a');
      expect(url).not.toContain('a=1');
    });
  });

  describe('getDomain', () => {
    it('should extract domain', () => {
      expect(getDomain('https://example.com/path')).toBe('example.com');
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('not-a-url')).toBe(false);
    });
  });
});

describe('Environment Utilities', () => {
  describe('env', () => {
    it('should get env var', () => {
      process.env.TEST_VAR = 'test';
      expect(env('TEST_VAR')).toBe('test');
      expect(env('NON_EXISTENT', 'default')).toBe('default');
    });
  });

  describe('isDevelopment', () => {
    it('should detect dev environment', () => {
      const original = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      expect(isDevelopment()).toBe(true);
      process.env.NODE_ENV = original;
    });
  });

  describe('isProduction', () => {
    it('should detect prod environment', () => {
      const original = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      expect(isProduction()).toBe(true);
      process.env.NODE_ENV = original;
    });
  });

  describe('boolEnv', () => {
    it('should parse boolean env', () => {
      process.env.BOOL_VAR = 'true';
      expect(boolEnv('BOOL_VAR')).toBe(true);
      process.env.BOOL_VAR = 'false';
      expect(boolEnv('BOOL_VAR')).toBe(false);
      expect(boolEnv('NON_EXISTENT')).toBe(false);
    });
  });

  describe('numEnv', () => {
    it('should parse number env', () => {
      process.env.NUM_VAR = '123';
      expect(numEnv('NUM_VAR')).toBe(123);
      expect(numEnv('NON_EXISTENT', 0)).toBe(0);
    });
  });
});

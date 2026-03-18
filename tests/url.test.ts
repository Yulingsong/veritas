/**
 * URL Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  parseUrl, 
  getQueryParams, 
  buildUrl, 
  addQueryParam,
  removeQueryParam,
  getDomain,
  getPath,
  isValidUrl,
  joinUrl
} from '../src/utils/url.js';

describe('URL Utilities', () => {
  describe('parseUrl', () => {
    it('should parse URL', () => {
      const url = parseUrl('https://example.com/path?key=value');
      expect(url.hostname).toBe('example.com');
      expect(url.pathname).toBe('/path');
    });
  });

  describe('getQueryParams', () => {
    it('should get query params', () => {
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
      const url = addQueryParam('https://example.com', 'key', 'value');
      expect(url).toContain('key=value');
    });
  });

  describe('removeQueryParam', () => {
    it('should remove query param', () => {
      const url = removeQueryParam('https://example.com?key=value', 'key');
      expect(url).not.toContain('key=value');
    });
  });

  describe('getDomain', () => {
    it('should get domain', () => {
      expect(getDomain('https://example.com/path')).toBe('example.com');
    });
  });

  describe('getPath', () => {
    it('should get path', () => {
      expect(getPath('https://example.com/path/to/page')).toBe('/path/to/page');
    });
  });

  describe('isValidUrl', () => {
    it('should validate URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('not-a-url')).toBe(false);
    });
  });

  describe('joinUrl', () => {
    it('should join URL parts', () => {
      expect(joinUrl('https://example.com', 'api', 'users')).toBe('https://example.com/api/users');
    });
  });
});

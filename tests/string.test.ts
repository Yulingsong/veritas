/**
 * String Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  slugify, 
  camelCase, 
  pascalCase, 
  kebabCase, 
  snakeCase,
  truncate,
  capitalize,
  capitalize
} from '../src/utils/string.js';

describe('String Utilities', () => {
  describe('slugify', () => {
    it('should convert to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test @#$%')).toBe('test');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('test-case')).toBe('testCase');
    });
  });

  describe('pascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('TestCase')).toBe('test-case');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
    });
  });

  describe('truncate', () => {
    it('should truncate string', () => {
      expect(truncate('hello world', 8)).toBe('hello...');
      expect(truncate('hi', 10)).toBe('hi');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });
  });
});

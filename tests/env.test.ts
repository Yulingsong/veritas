/**
 * Env Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  env, 
  isDevelopment, 
  isProduction, 
  isTest,
  getEnvWithPrefix,
  requiredEnv,
  boolEnv,
  numEnv
} from '../src/utils/env.js';

describe('Env Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('env', () => {
    it('should get env variable', () => {
      process.env.TEST_VAR = 'test';
      expect(env('TEST_VAR')).toBe('test');
      expect(env('MISSING', 'default')).toBe('default');
    });
  });

  describe('isDevelopment', () => {
    it('should check if development', () => {
      process.env.NODE_ENV = 'development';
      expect(isDevelopment()).toBe(true);
      
      process.env.NODE_ENV = 'production';
      expect(isDevelopment()).toBe(false);
    });
  });

  describe('isProduction', () => {
    it('should check if production', () => {
      process.env.NODE_ENV = 'production';
      expect(isProduction()).toBe(true);
      
      process.env.NODE_ENV = 'development';
      expect(isProduction()).toBe(false);
    });
  });

  describe('isTest', () => {
    it('should check if test', () => {
      process.env.NODE_ENV = 'test';
      expect(isTest()).toBe(true);
      
      process.env.NODE_ENV = 'development';
      expect(isTest()).toBe(false);
    });
  });

  describe('getEnvWithPrefix', () => {
    it('should get env vars with prefix', () => {
      process.env.MYAPP_VAR1 = 'value1';
      process.env.MYAPP_VAR2 = 'value2';
      process.env.OTHER_VAR = 'value3';
      
      const result = getEnvWithPrefix('MYAPP_');
      expect(result).toEqual({ VAR1: 'value1', VAR2: 'value2' });
    });
  });

  describe('requiredEnv', () => {
    it('should get required env', () => {
      process.env.REQUIRED_VAR = 'value';
      expect(requiredEnv('REQUIRED_VAR')).toBe('value');
    });

    it('should throw for missing required env', () => {
      delete process.env.MISSING_VAR;
      expect(() => requiredEnv('MISSING_VAR')).toThrow();
    });
  });

  describe('boolEnv', () => {
    it('should parse boolean env', () => {
      process.env.BOOL_VAR = 'true';
      expect(boolEnv('BOOL_VAR')).toBe(true);
      
      process.env.BOOL_VAR = 'false';
      expect(boolEnv('BOOL_VAR')).toBe(false);
      
      process.env.BOOL_VAR = '1';
      expect(boolEnv('BOOL_VAR')).toBe(true);
    });

    it('should return default', () => {
      expect(boolEnv('MISSING')).toBe(false);
      expect(boolEnv('MISSING', true)).toBe(true);
    });
  });

  describe('numEnv', () => {
    it('should parse number env', () => {
      process.env.NUM_VAR = '42';
      expect(numEnv('NUM_VAR')).toBe(42);
    });

    it('should return default for missing', () => {
      expect(numEnv('MISSING')).toBeUndefined();
      expect(numEnv('MISSING', 10)).toBe(10);
    });
  });
});

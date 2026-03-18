/**
 * Validation Tests
 */

import { describe, it, expect } from 'vitest';
import { ConfigValidator, validators } from '../src/utils/validation.js';

describe('Validation', () => {
  describe('ConfigValidator', () => {
    it('should validate required fields', () => {
      const validator = new ConfigValidator().required('name');
      
      const result = validator.validate({ name: 'test' });
      expect(result.valid).toBe(true);
      
      const result2 = validator.validate({});
      expect(result2.valid).toBe(false);
    });

    it('should validate types', () => {
      const validator = new ConfigValidator().typeOf('count', 'number');
      
      const result = validator.validate({ count: 42 });
      expect(result.valid).toBe(true);
      
      const result2 = validator.validate({ count: '42' });
      expect(result2.valid).toBe(false);
    });

    it('should validate enums', () => {
      const validator = new ConfigValidator().enum('status', ['active', 'inactive']);
      
      const result = validator.validate({ status: 'active' });
      expect(result.valid).toBe(true);
      
      const result2 = validator.validate({ status: 'unknown' });
      expect(result2.valid).toBe(false);
    });

    it('should validate patterns', () => {
      const validator = new ConfigValidator().pattern('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      
      const result = validator.validate({ email: 'test@example.com' });
      expect(result.valid).toBe(true);
    });

    it('should chain validations', () => {
      const validator = new ConfigValidator()
        .required('name')
        .typeOf('age', 'number')
        .enum('status', ['active', 'inactive']);
      
      const result = validator.validate({
        name: 'John',
        age: 30,
        status: 'active'
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('Predefined validators', () => {
    it('should have veritasConfig validator', () => {
      const validator = validators.veritasConfig();
      expect(validator).toBeInstanceOf(ConfigValidator);
    });

    it('should have packageJson validator', () => {
      const validator = validators.packageJson();
      expect(validator).toBeInstanceOf(ConfigValidator);
    });
  });
});

/**
 * Test Configuration Validation
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Validation rule
 */
export interface ValidationRule {
  field: string;
  type: 'required' | 'type' | 'enum' | 'pattern' | 'custom';
  value?: any;
  message?: string;
}

/**
 * Config validator
 */
export class ConfigValidator {
  private rules: ValidationRule[] = [];

  /**
   * Add rule
   */
  addRule(rule: ValidationRule): this {
    this.rules.push(rule);
    return this;
  }

  /**
   * Required field
   */
  required(field: string, message?: string): this {
    return this.addRule({ field, type: 'required', message });
  }

  /**
   * Type check
   */
  typeOf(field: string, expectedType: string, message?: string): this {
    return this.addRule({ field, type: 'type', value: expectedType, message });
  }

  /**
   * Enum check
   */
  enum(field: string, values: any[], message?: string): this {
    return this.addRule({ field, type: 'enum', value: values, message });
  }

  /**
   * Pattern check
   */
  pattern(field: string, regex: RegExp, message?: string): this {
    return this.addRule({ field, type: 'pattern', value: regex.source, message });
  }

  /**
   * Custom validation
   */
  custom(field: string, fn: (value: any) => boolean, message?: string): this {
    return this.addRule({ field, type: 'custom', value: fn, message });
  }

  /**
   * Validate config
   */
  validate(config: any): ValidationResult {
    const errors: string[] = [];

    for (const rule of this.rules) {
      const value = this.getValue(config, rule.field);

      switch (rule.type) {
        case 'required':
          if (value === undefined || value === null) {
            errors.push(rule.message || `Field ${rule.field} is required`);
          }
          break;

        case 'type':
          if (value !== undefined && typeof value !== rule.value) {
            errors.push(rule.message || `Field ${rule.field} must be of type ${rule.value}`);
          }
          break;

        case 'enum':
          if (value !== undefined && !rule.value.includes(value)) {
            errors.push(rule.message || `Field ${rule.field} must be one of: ${rule.value.join(', ')}`);
          }
          break;

        case 'pattern':
          if (value !== undefined && !new RegExp(rule.value).test(value)) {
            errors.push(rule.message || `Field ${rule.field} does not match pattern`);
          }
          break;

        case 'custom':
          if (value !== undefined && !rule.value(value)) {
            errors.push(rule.message || `Field ${rule.field} failed custom validation`);
          }
          break;
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private getValue(obj: any, field: string): any {
    return field.split('.').reduce((o, k) => o?.[k], obj);
  }
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Predefined validators
 */
export const validators = {
  /**
   * Validate Veritas config
   */
  veritasConfig(): ConfigValidator {
    return new ConfigValidator()
      .required('ai.provider')
      .enum('ai.provider', ['openai', 'anthropic', 'gemini'])
      .enum('generator.testFramework', ['vitest', 'jest', 'playwright'])
      .enum('generator.testType', ['unit', 'component', 'integration', 'e2e'])
      .typeOf('recorder.duration', 'number')
      .typeOf('executor.timeout', 'number');
  },

  /**
   * Validate package.json
   */
  packageJson(): ConfigValidator {
    return new ConfigValidator()
      .required('name')
      .required('version')
      .typeOf('name', 'string')
      .typeOf('version', 'string')
      .pattern('name', /^[a-z@][a-z0-9-]*$/);
  },

  /**
   * Validate GitHub Actions workflow
   */
  githubWorkflow(): ConfigValidator {
    return new ConfigValidator()
      .required('name')
      .required('on')
      .required('jobs');
  }
};

export default { ConfigValidator, validators };

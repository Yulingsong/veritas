/**
 * Validation Utilities
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate test file
 */
export function validateTestFile(filePath: string): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  if (!fs.existsSync(filePath)) {
    result.valid = false;
    result.errors.push(`File not found: ${filePath}`);
    return result;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for imports
  if (!content.includes('import')) {
    result.warnings.push('No imports found');
  }

  // Check for describe/it blocks
  if (!content.includes('describe') && !content.includes('it') && !content.includes('test')) {
    result.warnings.push('No test blocks found (describe/it/test)');
  }

  // Check for expect assertions
  if (!content.includes('expect')) {
    result.warnings.push('No assertions found (expect)');
  }

  // Check for common issues
  if (content.includes('// TODO')) {
    result.warnings.push('Contains TODO comments');
  }

  if (content.includes('skip') || content.includes('pending')) {
    result.warnings.push('Contains skipped tests');
  }

  return result;
}

/**
 * Validate component file
 */
export function validateComponentFile(filePath: string): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  if (!fs.existsSync(filePath)) {
    result.valid = false;
    result.errors.push(`File not found: ${filePath}`);
    return result;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath);

  // Check file extension
  if (!['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'].includes(ext)) {
    result.warnings.push(`Unusual file extension: ${ext}`);
  }

  // Check for React/framework imports
  if (ext === '.tsx' || ext === '.jsx') {
    if (!content.includes('react')) {
      result.warnings.push('No React import found in .tsx/.jsx file');
    }
  }

  // Check for export
  if (!content.includes('export')) {
    result.warnings.push('No export found');
  }

  return result;
}

/**
 * Validate configuration
 */
export function validateConfig(config: any): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  if (!config.ai?.provider) {
    result.errors.push('AI provider is required');
  }

  if (!config.ai?.apiKey && !process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    result.errors.push('API key is required');
  }

  if (config.recorder?.duration < 1000) {
    result.warnings.push('Recorder duration is less than 1 second');
  }

  if (config.executor?.timeout < 5000) {
    result.warnings.push('Executor timeout is less than 5 seconds');
  }

  result.valid = result.errors.length === 0;

  return result;
}

/**
 * Validate URL
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate file path
 */
export function validateFilePath(filePath: string): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  // Check for absolute path
  if (!path.isAbsolute(filePath)) {
    result.warnings.push('Consider using absolute paths');
  }

  // Check for dangerous patterns
  if (filePath.includes('..')) {
    result.errors.push('Path contains dangerous ".." pattern');
    result.valid = false;
  }

  // Check extension
  const ext = path.extname(filePath);
  const allowed = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte', '.json'];
  if (ext && !allowed.includes(ext)) {
    result.warnings.push(`Unusual file extension: ${ext}`);
  }

  return result;
}

/**
 * Validate test framework
 */
export function validateTestFramework(framework: string): boolean {
  return ['vitest', 'jest', 'playwright'].includes(framework);
}

/**
 * Validate framework
 */
export function validateFramework(framework: string): boolean {
  return ['react', 'vue', 'next', 'nuxt', 'svelte'].includes(framework);
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Validate traffic data
 */
export function validateTrafficData(data: any): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  if (!data) {
    result.valid = false;
    result.errors.push('Traffic data is empty');
    return result;
  }

  if (!Array.isArray(data.requests)) {
    result.errors.push('Missing requests array');
    result.valid = false;
  }

  if (!Array.isArray(data.responses)) {
    result.errors.push('Missing responses array');
    result.valid = false;
  }

  if (data.requests?.length === 0) {
    result.warnings.push('No requests recorded');
  }

  return result;
}

/**
 * Executor Types
 */

export interface TestResult {
  success: boolean;
  exitCode: number;
  output: string;
  errorOutput: string;
  duration: number;
  tests: TestCaseResult[];
}

export interface TestCaseResult {
  name: string;
  passed: boolean;
  failed: boolean;
  duration?: number;
  error?: string;
}

export interface ExecutorOptions {
  update?: boolean;
  coverage?: boolean;
  reporter?: string;
  env?: Record<string, string>;
  timeout?: number;
}

export type TestFramework = 'vitest' | 'jest' | 'playwright';

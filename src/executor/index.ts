/**
 * Test Executor - Run generated tests
 */

import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import type { TestResult, ExecutorOptions } from './types.js';

export * from './types.js';

/**
 * Vitest Executor
 */
export class VitestExecutor {
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  async run(testFile: string, options: ExecutorOptions = {}): Promise<TestResult> {
    const args = [
      'vitest',
      'run',
      testFile,
      '--reporter=verbose'
    ];

    if (options.update) args.push('--update');
    if (options.coverage) args.push('--coverage');

    return this.spawnProcess(args, options);
  }

  async watch(testFile: string, options: ExecutorOptions = {}): Promise<TestResult> {
    const args = ['vitest', 'watch', testFile];
    return this.spawnProcess(args, options);
  }

  private spawnProcess(args: string[], options: ExecutorOptions): Promise<TestResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let output = '';
      let errorOutput = '';

      const proc = spawn('npx', args, {
        cwd: this.projectPath,
        shell: true,
        env: { ...process.env, ...options.env }
      });

      proc.stdout?.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      proc.on('close', (code) => {
        const duration = Date.now() - startTime;
        resolve({
          success: code === 0,
          exitCode: code || 0,
          output,
          errorOutput,
          duration,
          tests: this.parseTestResults(output)
        });
      });

      proc.on('error', (err) => {
        resolve({
          success: false,
          exitCode: 1,
          output: '',
          errorOutput: err.message,
          duration: Date.now() - startTime,
          tests: []
        });
      });
    });
  }

  private parseTestResults(output: string): any[] {
    const tests: any[] = [];
    // Simple parsing - could be enhanced
    const passMatch = output.match(/(\d+) passed/);
    const failMatch = output.match(/(\d+) failed/);
    
    if (passMatch || failMatch) {
      tests.push({
        name: 'test',
        passed: !!passMatch,
        failed: !!failMatch
      });
    }
    return tests;
  }
}

/**
 * Jest Executor
 */
export class JestExecutor {
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  async run(testFile: string, options: ExecutorOptions = {}): Promise<TestResult> {
    const args = ['jest', testFile];

    if (options.update) args.push('--updateSnapshot');
    if (options.coverage) args.push('--coverage');

    return this.spawnProcess(args, options);
  }

  private spawnProcess(args: string[], options: ExecutorOptions): Promise<TestResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let output = '';
      let errorOutput = '';

      const proc = spawn('npx', args, {
        cwd: this.projectPath,
        shell: true,
        env: { ...process.env, ...options.env }
      });

      proc.stdout?.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      proc.on('close', (code) => {
        resolve({
          success: code === 0,
          exitCode: code || 0,
          output,
          errorOutput,
          duration: Date.now() - startTime,
          tests: []
        });
      });

      proc.on('error', (err) => {
        resolve({
          success: false,
          exitCode: 1,
          output: '',
          errorOutput: err.message,
          duration: Date.now() - startTime,
          tests: []
        });
      });
    });
  }
}

/**
 * Playwright Executor
 */
export class PlaywrightExecutor {
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  async run(testFile: string, options: ExecutorOptions = {}): Promise<TestResult> {
    const args = ['playwright', 'test', testFile];

    if (options.reporter) args.push('--reporter', options.reporter);

    return this.spawnProcess(args, options);
  }

  private spawnProcess(args: string[], options: ExecutorOptions): Promise<TestResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let output = '';
      let errorOutput = '';

      const proc = spawn('npx', args, {
        cwd: this.projectPath,
        shell: true,
        env: { ...process.env, ...options.env }
      });

      proc.stdout?.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      proc.on('close', (code) => {
        resolve({
          success: code === 0,
          exitCode: code || 0,
          output,
          errorOutput,
          duration: Date.now() - startTime,
          tests: []
        });
      });

      proc.on('error', (err) => {
        resolve({
          success: false,
          exitCode: 1,
          output: '',
          errorOutput: err.message,
          duration: Date.now() - startTime,
          tests: []
        });
      });
    });
  }
}

/**
 * Create executor by test framework
 */
export function createExecutor(
  framework: 'vitest' | 'jest' | 'playwright',
  projectPath: string
): VitestExecutor | JestExecutor | PlaywrightExecutor {
  switch (framework) {
    case 'vitest':
      return new VitestExecutor(projectPath);
    case 'jest':
      return new JestExecutor(projectPath);
    case 'playwright':
      return new PlaywrightExecutor(projectPath);
    default:
      throw new Error(`Unknown test framework: ${framework}`);
  }
}

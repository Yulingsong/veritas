/**
 * Test Utilities
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Test file finder
 */
export function findTestFiles(
  dir: string,
  patterns: string[] = ['*.test.ts', '*.spec.ts', '**/*.test.ts', '**/*.spec.ts']
): string[] {
  const tests: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (patterns.some(p => matchPattern(entry.name, p))) {
        tests.push(fullPath);
      }
    }
  }

  walk(dir);
  return tests;
}

function matchPattern(filename: string, pattern: string): boolean {
  if (pattern.startsWith('**/')) {
    return filename.endsWith(pattern.slice(3));
  }
  return filename === pattern || filename.match(new RegExp('^' + pattern.replace('*', '.*') + '$'));
}

/**
 * Test runner
 */
export class TestRunner {
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  /**
   * Run all tests
   */
  async runAll(): Promise<TestRunResult> {
    return this.run('vitest run');
  }

  /**
   * Run specific test file
   */
  async runFile(file: string): Promise<TestRunResult> {
    return this.run(`vitest run ${file}`);
  }

  /**
   * Run tests with coverage
   */
  async runWithCoverage(): Promise<TestRunResult> {
    return this.run('vitest run --coverage');
  }

  /**
   * Run tests in watch mode
   */
  async runWatch(): Promise<TestRunResult> {
    return this.run('vitest watch');
  }

  private async run(command: string): Promise<TestRunResult> {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    const startTime = Date.now();

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.projectPath
      });

      return {
        success: true,
        duration: Date.now() - startTime,
        output: stdout,
        error: stderr,
        tests: this.parseOutput(stdout)
      };
    } catch (error: any) {
      return {
        success: false,
        duration: Date.now() - startTime,
        output: error.stdout || '',
        error: error.stderr || error.message,
        tests: this.parseOutput(error.stdout || '')
      };
    }
  }

  private parseOutput(output: string): TestInfo[] {
    const tests: TestInfo[] = [];
    const passMatch = output.match(/(\d+) passed/);
    const failMatch = output.match(/(\d+) failed/);

    if (passMatch || failMatch) {
      tests.push({
        name: 'Test Suite',
        passed: !!passMatch,
        failed: !!failMatch,
        duration: 0
      });
    }

    return tests;
  }
}

export interface TestRunResult {
  success: boolean;
  duration: number;
  output: string;
  error: string;
  tests: TestInfo[];
}

export interface TestInfo {
  name: string;
  passed: boolean;
  failed: boolean;
  duration: number;
}

/**
 * Snapshot manager
 */
export class SnapshotManager {
  private snapshotsDir: string;

  constructor(snapshotsDir: string = '__snapshots__') {
    this.snapshotsDir = snapshotsDir;
  }

  /**
   * Get snapshot file path
   */
  getSnapshotPath(testFile: string): string {
    const baseName = path.basename(testFile, path.extname(testFile));
    return path.join(path.dirname(testFile), this.snapshotsDir, `${baseName}.snap`);
  }

  /**
   * Read snapshot
   */
  readSnapshot(testFile: string): string | null {
    const snapPath = this.getSnapshotPath(testFile);
    return fs.existsSync(snapPath) ? fs.readFileSync(snapPath, 'utf-8') : null;
  }

  /**
   * Update snapshot
   */
  updateSnapshot(testFile: string, content: string): void {
    const snapPath = this.getSnapshotPath(testFile);
    const dir = path.dirname(snapPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(snapPath, content);
  }

  /**
   * Delete snapshot
   */
  deleteSnapshot(testFile: string): void {
    const snapPath = this.getSnapshotPath(testFile);
    if (fs.existsSync(snapPath)) {
      fs.unlinkSync(snapPath);
    }
  }
}

export default TestRunner;

/**
 * Test Case Management
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Test case
 */
export interface TestCase {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  status: 'active' | 'skipped' | 'pending';
  test: string;
}

/**
 * Test suite
 */
export interface TestSuite {
  name: string;
  description?: string;
  cases: TestCase[];
  tags: string[];
}

/**
 * Test case manager
 */
export class TestCaseManager {
  private suites: Map<string, TestSuite> = new Map();
  private outputPath: string;

  constructor(outputPath: string = 'test-cases.json') {
    this.outputPath = outputPath;
    this.load();
  }

  /**
   * Create test suite
   */
  createSuite(name: string, description?: string, tags: string[] = []): TestSuite {
    const suite: TestSuite = { name, description, tags, cases: [] };
    this.suites.set(name, suite);
    return suite;
  }

  /**
   * Add test case to suite
   */
  addCase(suiteName: string, testCase: Omit<TestCase, 'id'>): TestCase {
    const suite = this.suites.get(suiteName);
    if (!suite) {
      throw new Error(`Suite not found: ${suiteName}`);
    }

    const newCase: TestCase = {
      ...testCase,
      id: this.generateId(),
      status: testCase.status || 'active'
    };

    suite.cases.push(newCase);
    return newCase;
  }

  /**
   * Get all test cases
   */
  getAllCases(): TestCase[] {
    const cases: TestCase[] = [];
    for (const suite of this.suites.values()) {
      cases.push(...suite.cases);
    }
    return cases;
  }

  /**
   * Filter test cases by tag
   */
  filterByTag(tag: string): TestCase[] {
    return this.getAllCases().filter(c => c.tags.includes(tag));
  }

  /**
   * Filter test cases by status
   */
  filterByStatus(status: TestCase['status']): TestCase[] {
    return this.getAllCases().filter(c => c.status === status);
  }

  /**
   * Generate test code
   */
  generateTests(): string {
    const cases = this.getAllCases().filter(c => c.status === 'active');
    
    let code = '// Auto-generated test cases\n\n';
    code += "import { describe, it, expect } from 'vitest';\n\n";

    for (const testCase of cases) {
      code += `describe('${testCase.name}', () => {\n`;
      code += `  it('${testCase.name}', () => {\n`;
      code += `    ${testCase.test}\n`;
      code += `  });\n`;
      code += `});\n\n`;
    }

    return code;
  }

  /**
   * Save to file
   */
  save(): void {
    const data = Object.fromEntries(this.suites);
    fs.writeFileSync(this.outputPath, JSON.stringify(data, null, 2));
  }

  /**
   * Load from file
   */
  private load(): void {
    if (fs.existsSync(this.outputPath)) {
      const data = JSON.parse(fs.readFileSync(this.outputPath, 'utf-8'));
      this.suites = new Map(Object.entries(data));
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Test case builder
 */
export class TestCaseBuilder {
  private case: Partial<TestCase> = {
    tags: [],
    status: 'active'
  };

  /**
   * Set name
   */
  name(name: string): this {
    this.case.name = name;
    return this;
  }

  /**
   * Set description
   */
  description(description: string): this {
    this.case.description = description;
    return this;
  }

  /**
   * Add tag
   */
  tag(tag: string): this {
    this.case.tags!.push(tag);
    return this;
  }

  /**
   * Set status
   */
  status(status: TestCase['status']): this {
    this.case.status = status;
    return this;
  }

  /**
   * Set test code
   */
  test(test: string): this {
    this.case.test = test;
    return this;
  }

  /**
   * Build
   */
  build(): Omit<TestCase, 'id'> {
    return {
      name: this.case.name!,
      description: this.case.description,
      tags: this.case.tags!,
      status: this.case.status!,
      test: this.case.test!
    };
  }
}

export default TestCaseManager;

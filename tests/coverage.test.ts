/**
 * Coverage Tests
 */

import { describe, it, expect } from 'vitest';
import { CoverageReporter, checkThresholds } from '../src/coverage/index.js';

describe('Coverage', () => {
  const mockData = {
    lines: { total: 100, covered: 80, skipped: 0, pct: 80 },
    statements: { total: 50, covered: 40, skipped: 0, pct: 80 },
    functions: { total: 20, covered: 15, skipped: 0, pct: 75 },
    branches: { total: 30, covered: 20, skipped: 0, pct: 66.67 }
  };

  describe('CoverageReporter', () => {
    it('should create HTML report', () => {
      const reporter = new CoverageReporter();
      const html = reporter.generateHtml(mockData as any);
      expect(html).toContain('Coverage Report');
    });

    it('should create Markdown report', () => {
      const reporter = new CoverageReporter();
      const md = reporter.generateMarkdown(mockData as any);
      expect(md).toContain('Coverage Report');
    });
  });

  describe('checkThresholds', () => {
    it('should pass when above threshold', () => {
      const result = checkThresholds(mockData as any, { lines: 70 });
      expect(result.passed).toBe(true);
    });

    it('should fail when below threshold', () => {
      const result = checkThresholds(mockData as any, { lines: 90 });
      expect(result.passed).toBe(false);
      expect(result.failures.length).toBeGreaterThan(0);
    });
  });
});

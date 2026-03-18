/**
 * Reporter Tests
 */

import { describe, it, expect } from 'vitest';
import { JsonReporter, HtmlReporter, MarkdownReporter, generateReport } from '../src/reporter/index.js';

describe('Reporter', () => {
  const mockResults = [
    { name: 'test1', passed: true, failed: false, duration: 10 },
    { name: 'test2', passed: false, failed: true, duration: 20 }
  ];

  describe('JsonReporter', () => {
    it('should create JSON reporter', () => {
      const reporter = new JsonReporter('/tmp/test-report.json');
      expect(reporter).toBeDefined();
    });
  });

  describe('HtmlReporter', () => {
    it('should create HTML reporter', () => {
      const reporter = new HtmlReporter('/tmp/test-report.html');
      expect(reporter).toBeDefined();
    });
  });

  describe('MarkdownReporter', () => {
    it('should create Markdown reporter', () => {
      const reporter = new MarkdownReporter('/tmp/test-report.md');
      expect(reporter).toBeDefined();
    });
  });

  describe('generateReport', () => {
    it('should generate report with summary', () => {
      const report = generateReport(mockResults as any, { format: 'json' });
      expect(report.summary.total).toBe(2);
      expect(report.summary.passed).toBe(1);
      expect(report.summary.failed).toBe(1);
    });

    it('should calculate success rate', () => {
      const report = generateReport(mockResults as any);
      expect(report.summary.successRate).toBe(50);
    });
  });
});

/**
 * Test Reporter - Generate test reports in various formats
 */

import * as fs from 'fs';
import * as path from 'path';
import type { TestResult } from '../executor/types.js';

export * from './types.js';

/**
 * Test Report Data
 */
export interface TestReport {
  timestamp: string;
  summary: ReportSummary;
  results: TestResult[];
  coverage?: CoverageReport;
  duration: number;
}

export interface ReportSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  successRate: number;
}

export interface CoverageReport {
  lines: number;
  linesCovered: number;
  linesUncovered: number;
  functions: number;
  functionsCovered: number;
  branches: number;
  branchesCovered: number;
}

/**
 * JSON Reporter
 */
export class JsonReporter {
  private outputPath: string;

  constructor(outputPath: string = 'test-report.json') {
    this.outputPath = outputPath;
  }

  async generate(report: TestReport): Promise<string> {
    const content = JSON.stringify(report, null, 2);
    fs.writeFileSync(this.outputPath, content);
    return this.outputPath;
  }
}

/**
 * HTML Reporter
 */
export class HtmlReporter {
  private outputPath: string;

  constructor(outputPath: string = 'test-report.html') {
    this.outputPath = outputPath;
  }

  async generate(report: TestReport): Promise<string> {
    const html = this.buildHtml(report);
    fs.writeFileSync(this.outputPath, html);
    return this.outputPath;
  }

  private buildHtml(report: TestReport): string {
    const { summary, results, timestamp } = report;
    const statusColor = summary.failed > 0 ? '#e74c3c' : '#27ae60';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Veritas Test Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f6fa; padding: 20px; }
    .container { max-width: 1000px; margin: 0 auto; }
    h1 { color: #2c3e50; margin-bottom: 20px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .card .value { font-size: 32px; font-weight: bold; color: ${statusColor}; }
    .card .label { color: #7f8c8d; margin-top: 5px; }
    .card.total .value { color: #3498db; }
    .card.skipped .value { color: #95a5a6; }
    table { width: 100%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    th { background: #34495e; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #ecf0f1; }
    tr:last-child td { border-bottom: none; }
    .status { padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .status.passed { background: #d5f4e6; color: #27ae60; }
    .status.failed { background: #fadbd8; color: #e74c3c; }
    .status.skipped { background: #f4f6f6; color: #95a5a6; }
    .footer { text-align: center; color: #7f8c8d; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 Veritas Test Report</h1>
    <p style="color: #7f8c8d; margin-bottom: 20px;">Generated: ${timestamp}</p>
    
    <div class="summary">
      <div class="card total">
        <div class="value">${summary.total}</div>
        <div class="label">Total</div>
      </div>
      <div class="card passed">
        <div class="value">${summary.passed}</div>
        <div class="label">Passed</div>
      </div>
      <div class="card failed">
        <div class="value">${summary.failed}</div>
        <div class="label">Failed</div>
      </div>
      <div class="card skipped">
        <div class="value">${summary.skipped}</div>
        <div class="label">Skipped</div>
      </div>
    </div>

    <h2 style="margin-bottom: 15px; color: #2c3e50;">Test Results</h2>
    <table>
      <thead>
        <tr>
          <th>Test</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(r => `
        <tr>
          <td>${r.name || 'Unnamed Test'}</td>
          <td>${r.duration}ms</td>
          <td><span class="status ${r.passed ? 'passed' : r.failed ? 'failed' : 'skipped'}">${r.passed ? 'PASSED' : r.failed ? 'FAILED' : 'SKIPPED'}</span></td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="footer">
      <p>Veritas - AI-Powered Frontend Testing</p>
    </div>
  </div>
</body>
</html>`;
  }
}

/**
 * Markdown Reporter
 */
export class MarkdownReporter {
  private outputPath: string;

  constructor(outputPath: string = 'test-report.md') {
    this.outputPath = outputPath;
  }

  async generate(report: TestReport): Promise<string> {
    const md = this.buildMarkdown(report);
    fs.writeFileSync(this.outputPath, md);
    return this.outputPath;
  }

  private buildMarkdown(report: TestReport): string {
    const { summary, results, timestamp } = report;

    return `# 🧪 Veritas Test Report

**Generated:** ${timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Total | ${summary.total} |
| Passed | ✅ ${summary.passed} |
| Failed | ❌ ${summary.failed} |
| Skipped | ⏭️ ${summary.skipped} |
| Success Rate | ${summary.successRate.toFixed(1)}% |

## Test Results

${results.map(r => `### ${r.name || 'Unnamed Test'}

- **Status:** ${r.passed ? '✅ Passed' : r.failed ? '❌ Failed' : '⏭️ Skipped'}
- **Duration:** ${r.duration}ms
${r.error ? `- **Error:** \`\`\`\n${r.error}\n\`\`\`` : ''}

`).join('\n')}

---

*Generated by Veritas - AI-Powered Frontend Testing*
`;
  }
}

/**
 * Create reporter by type
 */
export function createReporter(
  type: 'json' | 'html' | 'markdown',
  outputPath?: string
): JsonReporter | HtmlReporter | MarkdownReporter {
  switch (type) {
    case 'json':
      return new JsonReporter(outputPath || 'test-report.json');
    case 'html':
      return new HtmlReporter(outputPath || 'test-report.html');
    case 'markdown':
      return new MarkdownReporter(outputPath || 'test-report.md');
    default:
      throw new Error(`Unknown reporter type: ${type}`);
  }
}

/**
 * Generate test report from results
 */
export function generateReport(
  results: TestResult[],
  options: {
    format?: 'json' | 'html' | 'markdown';
    outputPath?: string;
    includeCoverage?: boolean;
  } = {}
): TestReport {
  const { format = 'html', outputPath, includeCoverage = false } = options;

  const summary: ReportSummary = {
    total: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => r.failed).length,
    skipped: results.filter(r => !r.passed && !r.failed).length,
    successRate: results.length > 0 
      ? (results.filter(r => r.passed).length / results.length) * 100 
      : 0
  };

  const report: TestReport = {
    timestamp: new Date().toISOString(),
    summary,
    results,
    duration: results.reduce((sum, r) => sum + r.duration, 0)
  };

  // Generate file
  const reporter = createReporter(format, outputPath);
  reporter.generate(report);

  return report;
}

/**
 * Reporter Types
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

export interface ReporterOptions {
  outputPath?: string;
  format?: 'json' | 'html' | 'markdown';
  includeCoverage?: boolean;
  theme?: 'light' | 'dark';
}

export type ReporterType = 'json' | 'html' | 'markdown' | 'junit' | 'all';

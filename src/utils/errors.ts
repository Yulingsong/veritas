/**
 * Error Tracking & Reporting
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Error tracker
 */
export class ErrorTracker {
  private errors: TrackedError[] = [];
  private outputPath: string;

  constructor(outputPath: string = 'error-report.json') {
    this.outputPath = outputPath;
  }

  /**
   * Track an error
   */
  track(error: Error, context?: Record<string, any>): void {
    const tracked: TrackedError = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      type: error.constructor.name
    };

    this.errors.push(tracked);
  }

  /**
   * Get all errors
   */
  getErrors(): TrackedError[] {
    return this.errors;
  }

  /**
   * Save errors to file
   */
  save(): void {
    fs.writeFileSync(this.outputPath, JSON.stringify(this.errors, null, 2));
  }

  /**
   * Clear errors
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * Get error statistics
   */
  getStats(): ErrorStats {
    const types: Record<string, number> = {};
    
    for (const error of this.errors) {
      types[error.type] = (types[error.type] || 0) + 1;
    }

    return {
      total: this.errors.length,
      byType: types
    };
  }
}

export interface TrackedError {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: string;
  type: string;
}

export interface ErrorStats {
  total: number;
  byType: Record<string, number>;
}

/**
 * Error boundary for React
 */
export class ErrorBoundary {
  private error: Error | null = null;
  private errorInfo: any = null;

  /**
   * Catch error
   */
  catch(error: Error, errorInfo: any): void {
    this.error = error;
    this.errorInfo = errorInfo;
    
    console.error('Error caught:', error);
  }

  /**
   * Reset error state
   */
  reset(): void {
    this.error = null;
    this.errorInfo = null;
  }

  /**
   * Get error
   */
  getError(): { error: Error; errorInfo: any } | null {
    return this.error ? { error: this.error, errorInfo: this.errorInfo } : null;
  }
}

/**
 * Console error interceptor
 */
export class ConsoleInterceptor {
  private originalError: typeof console.error;
  private errors: string[] = [];

  /**
   * Start intercepting
   */
  intercept(): void {
    this.originalError = console.error;
    console.error = (...args: any[]) => {
      this.errors.push(args.map(a => String(a)).join(' '));
      this.originalError.apply(console, args);
    };
  }

  /**
   * Stop intercepting
   */
  restore(): void {
    console.error = this.originalError;
  }

  /**
   * Get intercepted errors
   */
  getErrors(): string[] {
    return this.errors;
  }

  /**
   * Clear errors
   */
  clear(): void {
    this.errors = [];
  }
}

export default { ErrorTracker, ErrorBoundary, ConsoleInterceptor };

/**
 * Logging System
 */

import * as fs from 'fs';
import * as path from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

export interface LoggerOptions {
  level: LogLevel;
  file?: string;
  timestamp: boolean;
}

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

export class Logger {
  private level: LogLevel;
  private file?: string;
  private timestamp: boolean;
  private static instance: Logger;

  constructor(options: LoggerOptions) {
    this.level = options.level;
    this.file = options.file;
    this.timestamp = options.timestamp;
  }

  /**
   * Get singleton instance
   */
  static getInstance(options?: LoggerOptions): Logger {
    if (!Logger.instance && options) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Log error message
   */
  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (levels[level] < levels[this.level]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: this.timestamp ? new Date().toISOString() : '',
      level,
      message,
      data
    };

    const formatted = this.format(entry);

    // Console output
    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.log(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }

    // File output
    if (this.file) {
      this.writeToFile(formatted);
    }
  }

  /**
   * Format log entry
   */
  private format(entry: LogEntry): string {
    const parts: string[] = [];
    
    if (entry.timestamp) {
      parts.push(`[${entry.timestamp}]`);
    }
    
    parts.push(`[${entry.level.toUpperCase()}]`);
    parts.push(entry.message);
    
    if (entry.data !== undefined) {
      parts.push(JSON.stringify(entry.data));
    }
    
    return parts.join(' ');
  }

  /**
   * Write to file
   */
  private writeToFile(message: string): void {
    if (!this.file) return;
    
    try {
      const dir = path.dirname(this.file);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.appendFileSync(this.file, message + '\n');
    } catch (e) {
      console.error('Failed to write to log file:', e);
    }
  }

  /**
   * Create child logger with prefix
   */
  child(prefix: string): Logger {
    const child = new Logger({
      level: this.level,
      file: this.file,
      timestamp: this.timestamp
    });
    
    const originalLog = child.log.bind(child);
    child.log = (level: LogLevel, message: string, data?: any) => {
      originalLog(level, `[${prefix}] ${message}`, data);
    };
    
    return child;
  }
}

/**
 * Create logger from config
 */
export function createLogger(options: Partial<LoggerOptions> = {}): Logger {
  return new Logger({
    level: options.level || 'info',
    file: options.file,
    timestamp: options.timestamp ?? true
  });
}

/**
 * Default logger instance
 */
export const logger = Logger.getInstance({
  level: 'info',
  timestamp: true
});

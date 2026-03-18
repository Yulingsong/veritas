/**
 * Global Error Handler
 */

import { EventEmitter } from 'events';

/**
 * Error categories
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  PARSING = 'PARSING',
  GENERATION = 'GENERATION',
  EXECUTION = 'EXECUTION',
  CONFIGURATION = 'CONFIGURATION',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Error with category
 */
export class VeritasError extends Error {
  category: ErrorCategory;
  code?: string;
  details?: any;

  constructor(message: string, category: ErrorCategory = ErrorCategory.UNKNOWN, code?: string, details?: any) {
    super(message);
    this.name = 'VeritasError';
    this.category = category;
    this.code = code;
    this.details = details;
  }
}

/**
 * Global error handler
 */
export class GlobalErrorHandler extends EventEmitter {
  private errors: VeritasError[] = [];
  private static instance: GlobalErrorHandler;

  private constructor() {
    super();
    this.setupHandlers();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  /**
   * Setup error handlers
   */
  private setupHandlers(): void {
    process.on('uncaughtException', (error) => {
      this.handleError(error);
    });

    process.on('unhandledRejection', (reason) => {
      this.handleError(reason instanceof Error ? reason : new Error(String(reason)));
    });
  }

  /**
   * Handle error
   */
  handleError(error: Error | VeritasError): VeritasError {
    const veritasError = error instanceof VeritasError 
      ? error 
      : new VeritasError(error.message, this.categorizeError(error));

    this.errors.push(veritasError);
    this.emit('error', veritasError);

    return veritasError;
  }

  /**
   * Categorize error
   */
  private categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();

    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorCategory.VALIDATION;
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('request')) {
      return ErrorCategory.NETWORK;
    }
    if (message.includes('parse') || message.includes('syntax')) {
      return ErrorCategory.PARSING;
    }
    if (message.includes('generate') || message.includes('ai')) {
      return ErrorCategory.GENERATION;
    }
    if (message.includes('execute') || message.includes('test')) {
      return ErrorCategory.EXECUTION;
    }
    if (message.includes('config') || message.includes('options')) {
      return ErrorCategory.CONFIGURATION;
    }

    return ErrorCategory.UNKNOWN;
  }

  /**
   * Get errors
   */
  getErrors(): VeritasError[] {
    return this.errors;
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): VeritasError[] {
    return this.errors.filter(e => e.category === category);
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
  getStats(): Record<ErrorCategory, number> {
    const stats: Record<ErrorCategory, number> = {
      [ErrorCategory.VALIDATION]: 0,
      [ErrorCategory.NETWORK]: 0,
      [ErrorCategory.PARSING]: 0,
      [ErrorCategory.GENERATION]: 0,
      [ErrorCategory.EXECUTION]: 0,
      [ErrorCategory.CONFIGURATION]: 0,
      [ErrorCategory.UNKNOWN]: 0
    };

    for (const error of this.errors) {
      stats[error.category]++;
    }

    return stats;
  }
}

/**
 * Create error with context
 */
export function createError(
  message: string,
  category: ErrorCategory,
  code?: string,
  details?: any
): VeritasError {
  return new VeritasError(message, category, code, details);
}

/**
 * Error handler decorator
 */
export function errorHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      const handler = GlobalErrorHandler.getInstance();
      handler.handleError(error instanceof VeritasError ? error : new VeritasError(error.message));
      throw error;
    }
  };

  return descriptor;
}

/**
 * Async error wrapper
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: {
    category?: ErrorCategory;
    code?: string;
    onError?: (error: VeritasError) => void;
  } = {}
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const handler = GlobalErrorHandler.getInstance();
    const veritasError = error instanceof VeritasError 
      ? error 
      : new VeritasError(
          error instanceof Error ? error.message : String(error),
          options.category || ErrorCategory.UNKNOWN,
          options.code
        );

    handler.handleError(veritasError);
    
    if (options.onError) {
      options.onError(veritasError);
    }

    throw veritasError;
  }
}

export default GlobalErrorHandler;

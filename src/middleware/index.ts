/**
 * Middleware System
 */

import type { TestGenerationRequest, GeneratedTest } from '../generator/index.js';
import type { TrafficData } from '../types.js';

/**
 * Middleware function type
 */
export type Middleware<T> = (context: T, next: () => Promise<void>) => Promise<void>;

/**
 * Generate Middleware Context
 */
export interface GenerateContext extends TestGenerationRequest {
  result?: GeneratedTest;
  errors: string[];
  metadata: Record<string, any>;
}

/**
 * Record Middleware Context
 */
export interface RecordContext {
  url: string;
  trafficData?: TrafficData;
  errors: string[];
  metadata: Record<string, any>;
}

/**
 * Middleware Manager
 */
export class MiddlewareManager {
  private generateMiddleware: Middleware<GenerateContext>[] = [];
  private recordMiddleware: Middleware<RecordContext>[] = [];

  /**
   * Add generate middleware
   */
  useGenerate(middleware: Middleware<GenerateContext>): void {
    this.generateMiddleware.push(middleware);
  }

  /**
   * Add record middleware
   */
  useRecord(middleware: Middleware<RecordContext>): void {
    this.recordMiddleware.push(middleware);
  }

  /**
   * Execute generate pipeline
   */
  async executeGenerate(context: GenerateContext): Promise<GenerateContext> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index >= this.generateMiddleware.length) {
        return;
      }
      const middleware = this.generateMiddleware[index++];
      await middleware(context, next);
    };

    await next();
    return context;
  }

  /**
   * Execute record pipeline
   */
  async executeRecord(context: RecordContext): Promise<RecordContext> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index >= this.recordMiddleware.length) {
        return;
      }
      const middleware = this.recordMiddleware[index++];
      await middleware(context, next);
    };

    await next();
    return context;
  }
}

/**
 * Built-in Middleware
 */

/**
 * Logging Middleware
 */
export function loggingMiddleware<T extends { metadata: Record<string, any> }>(): Middleware<T> {
  return async (context, next) => {
    const start = Date.now();
    console.log(`[Middleware] Starting: ${context.metadata.operation}`);
    await next();
    console.log(`[Middleware] Completed in ${Date.now() - start}ms`);
  };
}

/**
 * Error Handling Middleware
 */
export function errorHandlingMiddleware<T extends { errors: string[] }>(): Middleware<T> {
  return async (context, next) => {
    try {
      await next();
    } catch (error) {
      context.errors.push(`Error: ${error}`);
    }
  };
}

/**
 * Validation Middleware
 */
export function validationMiddleware(): Middleware<GenerateContext> {
  return async (context, next) => {
    if (!context.code) {
      context.errors.push('Code is required');
    }
    if (!context.file) {
      context.errors.push('File is required');
    }
    if (context.errors.length === 0) {
      await next();
    }
  };
}

/**
 * Cache Middleware
 */
export function cacheMiddleware(cache: Map<string, any>): Middleware<GenerateContext> {
  return async (context, next) => {
    const key = `${context.file}:${context.framework}:${context.testFramework}`;
    const cached = cache.get(key);
    
    if (cached) {
      context.result = cached;
      context.metadata.fromCache = true;
      return;
    }
    
    await next();
    
    if (context.result) {
      cache.set(key, context.result);
    }
  };
}

/**
 * Retry Middleware
 */
export function retryMiddleware(maxRetries: number = 3): Middleware<GenerateContext> {
  return async (context, next) => {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        await next();
        return;
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          context.errors.push(`Failed after ${maxRetries} attempts: ${error}`);
        }
      }
    }
  };
}

/**
 * Metrics Middleware
 */
export function metricsMiddleware(): Middleware<GenerateContext> {
  return async (context, next) => {
    const start = Date.now();
    
    await next();
    
    context.metadata.duration = Date.now() - start;
    context.metadata.timestamp = new Date().toISOString();
  };
}

export default MiddlewareManager;

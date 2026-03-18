/**
 * Retry Utilities
 */

import { performance } from 'perf_hooks';

/**
 * Retry options
 */
export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: 'linear' | 'exponential';
  maxDelayMs?: number;
  onRetry?: (error: Error, attempt: number) => void;
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Retry function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = 'exponential',
    maxDelayMs = 30000,
    onRetry,
    shouldRetry = () => true
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(lastError, attempt);
      }

      // Calculate delay
      let delay = delayMs;
      if (backoff === 'exponential') {
        delay = delayMs * Math.pow(2, attempt - 1);
      } else {
        delay = delayMs * attempt;
      }

      delay = Math.min(delay, maxDelayMs);

      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Sleep
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Timeout
 */
export function timeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    sleep(ms).then(() => {
      throw new Error(`Timeout after ${ms}ms`);
    })
  ]);
}

/**
 * Retry with timeout
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  options: RetryOptions & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs, ...retryOptions } = options;

  if (timeoutMs) {
    return retry(() => timeout(timeoutMs, fn()), retryOptions);
  }

  return retry(fn, retryOptions);
}

/**
 * Retry decorator
 */
export function retryable(options: RetryOptions = {}) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return retry(() => originalMethod.apply(this, args), options);
    };

    return descriptor;
  };
}

export default { retry, sleep, timeout, retryWithTimeout, retryable };

/**
 * Retry & Rate Limit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry, sleep, timeout, retryWithTimeout } from '../src/utils/retry.js';
import { RateLimiter, SlidingWindowRateLimiter } from '../src/utils/ratelimit.js';

describe('Retry Utilities', () => {
  describe('retry', () => {
    it('should retry on failure', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) throw new Error('fail');
        return 'success';
      };
      
      const result = await retry(fn, { maxAttempts: 3, delayMs: 10 });
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should fail after max attempts', async () => {
      const fn = async () => {
        throw new Error('fail');
      };
      
      await expect(
        retry(fn, { maxAttempts: 2, delayMs: 10 })
      ).rejects.toThrow('fail');
    });
  });

  describe('sleep', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('should sleep for specified time', async () => {
      const promise = sleep(100);
      vi.advanceTimersByTime(100);
      await promise;
    });
  });

  describe('timeout', () => {
    it('should timeout slow promise', async () => {
      const slow = new Promise(resolve => setTimeout(() => resolve('done'), 1000));
      
      await expect(
        timeout(50, slow)
      ).rejects.toThrow('Timeout');
    });
  });
});

describe('Rate Limiter', () => {
  describe('RateLimiter', () => {
    it('should allow requests within limit', () => {
      const limiter = new RateLimiter({ maxTokens: 5, refillRate: 10 });
      
      for (let i = 0; i < 5; i++) {
        expect(limiter.tryConsume()).toBe(true);
      }
      expect(limiter.tryConsume()).toBe(false);
    });
  });

  describe('SlidingWindowRateLimiter', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('should limit requests in window', () => {
      const limiter = new SlidingWindowRateLimiter(3, 1000);
      
      expect(limiter.tryRequest()).toBe(true);
      expect(limiter.tryRequest()).toBe(true);
      expect(limiter.tryRequest()).toBe(true);
      expect(limiter.tryRequest()).toBe(false);
    });
  });
});

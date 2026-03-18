/**
 * Retry Utilities Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { retry, sleep, timeout, retryWithTimeout } from '../src/utils/retry.js';

describe('Retry Utilities', () => {
  describe('retry', () => {
    it('should retry on failure', async () => {
      let attempts = 0;
      const fn = vi.fn(async () => {
        attempts++;
        if (attempts < 3) throw new Error('fail');
        return 'success';
      });

      const result = await retry(fn, { maxAttempts: 3, delayMs: 10 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should fail after max attempts', async () => {
      const fn = vi.fn(async () => {
        throw new Error('fail');
      });

      await expect(
        retry(fn, { maxAttempts: 2, delayMs: 10 })
      ).rejects.toThrow('fail');
    });

    it('should respect shouldRetry', async () => {
      const fn = vi.fn(async () => {
        throw new Error('permanent');
      });

      const shouldRetry = (err: Error) => err.message !== 'permanent';

      await expect(
        retry(fn, { maxAttempts: 3, shouldRetry, delayMs: 10 })
      ).rejects.toThrow('permanent');
    });
  });

  describe('timeout', () => {
    it('should resolve if promise resolves in time', async () => {
      const promise = sleep(10).then(() => 'success');
      const result = await timeout(100, promise);
      expect(result).toBe('success');
    });

    it('should reject if promise takes too long', async () => {
      const promise = sleep(100);
      await expect(timeout(10, promise)).rejects.toThrow('Timeout');
    });
  });
});

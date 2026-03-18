/**
 * Rate Limiter Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter, SlidingWindowRateLimiter } from '../src/utils/ratelimit.js';

describe('Rate Limiter', () => {
  describe('RateLimiter', () => {
    it('should allow requests within limit', () => {
      const limiter = new RateLimiter({ maxTokens: 5, refillRate: 10 });
      
      for (let i = 0; i < 5; i++) {
        expect(limiter.tryConsume()).toBe(true);
      }
    });

    it('should block requests over limit', () => {
      const limiter = new RateLimiter({ maxTokens: 2, refillRate: 1 });
      
      expect(limiter.tryConsume()).toBe(true);
      expect(limiter.tryConsume()).toBe(true);
      expect(limiter.tryConsume()).toBe(false);
    });

    it('should refill tokens over time', async () => {
      const limiter = new RateLimiter({ maxTokens: 1, refillRate: 10 });
      
      expect(limiter.tryConsume()).toBe(true);
      expect(limiter.tryConsume()).toBe(false);
      
      // Wait for refill
      await sleep(200);
      
      expect(limiter.tryConsume()).toBe(true);
    });

    it('should get available tokens', () => {
      const limiter = new RateLimiter({ maxTokens: 5, refillRate: 10 });
      limiter.tryConsume();
      expect(limiter.getAvailableTokens()).toBe(4);
    });
  });

  describe('SlidingWindowRateLimiter', () => {
    it('should allow requests within limit', () => {
      const limiter = new SlidingWindowRateLimiter(3, 1000);
      
      expect(limiter.tryRequest()).toBe(true);
      expect(limiter.tryRequest()).toBe(true);
      expect(limiter.tryRequest()).toBe(true);
      expect(limiter.tryRequest()).toBe(false);
    });

    it('should reset after window', async () => {
      const limiter = new SlidingWindowRateLimiter(2, 100);
      
      expect(limiter.tryRequest()).toBe(true);
      expect(limiter.tryRequest()).toBe(true);
      expect(limiter.tryRequest()).toBe(false);
      
      await sleep(150);
      
      expect(limiter.tryRequest()).toBe(true);
    });

    it('should get remaining requests', () => {
      const limiter = new SlidingWindowRateLimiter(3, 1000);
      
      limiter.tryRequest();
      limiter.tryRequest();
      
      expect(limiter.getRemainingRequests()).toBe(1);
    });
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

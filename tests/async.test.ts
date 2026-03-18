/**
 * Async Utilities Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  AsyncQueue, 
  PriorityQueue,
  debounce,
  throttle,
  once,
  memoize
} from '../src/utils/async.js';

describe('Async Utilities', () => {
  describe('AsyncQueue', () => {
    it('should process queue sequentially', async () => {
      const queue = new AsyncQueue(1);
      const results: number[] = [];
      
      queue.add(async () => {
        results.push(1);
        await new Promise(r => setTimeout(r, 10));
      });
      queue.add(async () => {
        results.push(2);
      });
      
      await new Promise(r => setTimeout(r, 50));
      expect(results).toEqual([1, 2]);
    });
  });

  describe('PriorityQueue', () => {
    it('should process by priority', () => {
      const queue = new PriorityQueue<number>();
      queue.enqueue(10, 1);
      queue.enqueue(20, 3);
      queue.enqueue(30, 2);
      
      expect(queue.dequeue()).toBe(20);
      expect(queue.dequeue()).toBe(30);
      expect(queue.dequeue()).toBe(10);
    });
  });

  describe('debounce', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('should debounce function', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      
      debounced();
      debounced();
      debounced();
      
      vi.advanceTimersByTime(100);
      
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('should throttle function', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);
      
      throttled();
      throttled();
      throttled();
      
      vi.advanceTimersByTime(100);
      
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('once', () => {
    it('should call function only once', () => {
      const fn = vi.fn(() => 'called');
      const onceFn = once(fn);
      
      expect(onceFn()).toBe('called');
      expect(onceFn()).toBe('called');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('memoize', () => {
    it('should memoize function', () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = memoize(fn);
      
      expect(memoized(2)).toBe(4);
      expect(memoized(2)).toBe(4);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});

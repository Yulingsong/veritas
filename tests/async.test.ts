/**
 * Async Utilities Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  AsyncQueue, 
  PriorityQueue,
  debounce,
  throttle,
  once
} from '../src/utils/async.js';

describe('Async Utilities', () => {
  describe('AsyncQueue', () => {
    it('should process tasks sequentially', async () => {
      const queue = new AsyncQueue(1);
      const results: number[] = [];
      
      queue.add(async () => { results.push(1); await delay(10); });
      queue.add(async () => { results.push(2); await delay(10); });
      queue.add(async () => { results.push(3); });
      
      await delay(50);
      expect(results).toEqual([1, 2, 3]);
    });

    it('should respect concurrency limit', async () => {
      const queue = new AsyncQueue(2);
      let running = 0;
      let maxRunning = 0;
      
      const task = async () => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await delay(10);
        running--;
      };
      
      for (let i = 0; i < 4; i++) {
        queue.add(task);
      }
      
      await delay(30);
      expect(maxRunning).toBe(2);
    });
  });

  describe('PriorityQueue', () => {
    it('should prioritize items', () => {
      const pq = new PriorityQueue<number>();
      pq.enqueue(1, 1);
      pq.enqueue(2, 2);
      pq.enqueue(3, 0);
      
      expect(pq.dequeue()).toBe(2);
      expect(pq.dequeue()).toBe(1);
      expect(pq.dequeue()).toBe(3);
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
      
      expect(fn).not.toHaveBeenCalled();
      
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
      
      expect(fn).toHaveBeenCalledTimes(1);
      
      vi.advanceTimersByTime(100);
      
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('once', () => {
    it('should call function only once', () => {
      const fn = vi.fn(() => 'called');
      const onceFn = once(fn);
      
      expect(onceFn()).toBe('called');
      expect(onceFn()).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

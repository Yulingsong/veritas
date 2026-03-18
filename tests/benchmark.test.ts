/**
 * Benchmark Utilities Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BenchmarkRunner, Stopwatch, measure } from '../src/utils/benchmark.js';

describe('Benchmark Utilities', () => {
  describe('Stopwatch', () => {
    it('should measure elapsed time', () => {
      const sw = new Stopwatch();
      sw.start();
      
      const start = Date.now();
      while (Date.now() - start < 10) {} // Busy wait 10ms
      
      sw.stop();
      expect(sw.elapsed()).toBeGreaterThan(0);
    });

    it('should reset', () => {
      const sw = new Stopwatch();
      sw.start();
      sw.stop();
      sw.reset();
      expect(sw.elapsed()).toBe(0);
    });
  });

  describe('measure', () => {
    it('should measure async function', async () => {
      const { result, time } = await measure(async () => {
        await new Promise(r => setTimeout(r, 10));
        return 'result';
      });

      expect(result).toBe('result');
      expect(time).toBeGreaterThan(10);
    });

    it('should measure sync function', async () => {
      const { result, time } = await measure(() => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) sum += i;
        return sum;
      });

      expect(result).toBe(499500);
      expect(time).toBeGreaterThan(0);
    });
  });

  describe('BenchmarkRunner', () => {
    it('should run benchmark', async () => {
      const runner = new BenchmarkRunner();
      const result = await runner.run('test', () => {
        let sum = 0;
        for (let i = 0; i < 100; i++) sum += i;
      }, 10);

      expect(result.name).toBe('test');
      expect(result.iterations).toBe(10);
      expect(result.mean).toBeGreaterThan(0);
    });

    it('should print results', async () => {
      const runner = new BenchmarkRunner();
      await runner.run('test', () => {}, 5);
      
      // Should not throw
      runner.printResults();
    });

    it('should compare results', async () => {
      const runner = new BenchmarkRunner();
      await runner.run('baseline', () => {}, 5);
      await runner.run('optimized', () => {}, 5);
      
      // Should not throw
      runner.compare();
    });
  });
});

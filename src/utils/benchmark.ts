/**
 * Benchmark Utilities
 */

import { performance } from 'perf_hooks';

/**
 * Benchmark runner
 */
export class BenchmarkRunner {
  private results: BenchmarkResult[] = [];

  /**
   * Run benchmark
   */
  async run(name: string, fn: () => void | Promise<void>, iterations: number = 1000): Promise<BenchmarkResult> {
    // Warmup
    for (let i = 0; i < 10; i++) {
      await fn();
    }

    // Actual benchmark
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
    }

    const result: BenchmarkResult = {
      name,
      iterations,
      mean: times.reduce((a, b) => a + b, 0) / times.length,
      median: this.percentile(times, 0.5),
      min: Math.min(...times),
      max: Math.max(...times),
      p95: this.percentile(times, 0.95),
      p99: this.percentile(times, 0.99)
    };

    this.results.push(result);
    return result;
  }

  /**
   * Get all results
   */
  getResults(): BenchmarkResult[] {
    return this.results;
  }

  /**
   * Print results
   */
  printResults(): void {
    console.log('\n📊 Benchmark Results\n');
    console.log('| Name | Iterations | Mean | Median | Min | Max | P95 | P99 |');
    console.log('|------|-------------|------|--------|-----|-----|-----|-----|');

    for (const result of this.results) {
      console.log(`| ${result.name} | ${result.iterations} | ${result.mean.toFixed(2)}ms | ${result.median.toFixed(2)}ms | ${result.min.toFixed(2)}ms | ${result.max.toFixed(2)}ms | ${result.p95.toFixed(2)}ms | ${result.p99.toFixed(2)}ms |`);
    }
  }

  /**
   * Compare results
   */
  compare(): void {
    if (this.results.length < 2) return;

    const baseline = this.results[0];
    
    console.log('\n📈 Comparison\n');
    
    for (let i = 1; i < this.results.length; i++) {
      const result = this.results[i];
      const diff = ((result.mean - baseline.mean) / baseline.mean) * 100;
      const symbol = diff > 0 ? '🔴' : '🟢';
      console.log(`${result.name} vs ${baseline.name}: ${symbol} ${diff.toFixed(2)}%`);
    }
  }

  private percentile(arr: number[], p: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }
}

export interface BenchmarkResult {
  name: string;
  iterations: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  p95: number;
  p99: number;
}

/**
 * Simple stopwatch
 */
export class Stopwatch {
  private startTime: number = 0;
  private endTime: number = 0;
  private running: boolean = false;

  /**
   * Start
   */
  start(): void {
    this.startTime = performance.now();
    this.running = true;
  }

  /**
   * Stop
   */
  stop(): number {
    if (!this.running) return 0;
    this.endTime = performance.now();
    this.running = false;
    return this.elapsed();
  }

  /**
   * Get elapsed time
   */
  elapsed(): number {
    if (this.running) {
      return performance.now() - this.startTime;
    }
    return this.endTime - this.startTime;
  }

  /**
   * Reset
   */
  reset(): void {
    this.startTime = 0;
    this.endTime = 0;
    this.running = false;
  }
}

/**
 * Measure function execution time
 */
export async function measure<T>(fn: () => T | Promise<T>): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await fn();
  const time = performance.now() - start;
  return { result, time };
}

export default { BenchmarkRunner, Stopwatch, measure };

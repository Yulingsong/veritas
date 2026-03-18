/**
 * Performance Monitor
 */

import { performance } from 'perf_hooks';

/**
 * Performance timer
 */
export class PerformanceTimer {
  private marks: Map<string, number> = new Map();

  /**
   * Mark a point in time
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();
    
    if (!start) {
      throw new Error(`Mark "${startMark}" not found`);
    }

    const duration = end! - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  /**
   * Clear all marks
   */
  clear(): void {
    this.marks.clear();
  }
}

/**
 * Memory monitor
 */
export class MemoryMonitor {
  /**
   * Get current memory usage
   */
  getMemory(): MemoryUsage {
    const usage = process.memoryUsage();
    return {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss
    };
  }

  /**
   * Log memory usage
   */
  logMemory(label: string = 'Memory'): void {
    const mem = this.getMemory();
    console.log(`[${label}]`);
    console.log(`  Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
  }

  /**
   * Check if memory is below threshold
   */
  isBelowThreshold(thresholdMB: number): boolean {
    const mem = this.getMemory();
    return mem.heapUsed / 1024 / 1024 < thresholdMB;
  }
}

export interface MemoryUsage {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

/**
 * Network monitor
 */
export class NetworkMonitor {
  private requests: RequestInfo[] = [];

  /**
   * Track request
   */
  trackRequest(url: string, method: string = 'GET'): void {
    this.requests.push({
      url,
      method,
      startTime: Date.now()
    });
  }

  /**
   * Complete request
   */
  completeRequest(url: string): void {
    const req = this.requests.find(r => r.url === url && !r.endTime);
    if (req) {
      req.endTime = Date.now();
      req.duration = req.endTime - req.startTime;
    }
  }

  /**
   * Get statistics
   */
  getStats(): NetworkStats {
    const completed = this.requests.filter(r => r.duration);
    const totalDuration = completed.reduce((sum, r) => sum + r.duration!, 0);
    
    return {
      total: this.requests.length,
      completed: completed.length,
      averageDuration: completed.length > 0 ? totalDuration / completed.length : 0,
      requests: this.requests
    };
  }

  /**
   * Reset
   */
  reset(): void {
    this.requests = [];
  }
}

export interface RequestInfo {
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

export interface NetworkStats {
  total: number;
  completed: number;
  averageDuration: number;
  requests: RequestInfo[];
}

export default { PerformanceTimer, MemoryMonitor, NetworkMonitor };

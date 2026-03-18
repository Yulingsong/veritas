/**
 * Async Queue
 */

import { EventEmitter } from 'events';

/**
 * Async task queue
 */
export class AsyncQueue extends EventEmitter {
  private queue: Array<() => Promise<void>> = [];
  private running: number = 0;
  private maxConcurrent: number;

  constructor(maxConcurrent: number = 1) {
    super();
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Add task to queue
   */
  add(task: () => Promise<void>): void {
    this.queue.push(task);
    this.process();
  }

  /**
   * Process queue
   */
  private async process(): Promise<void> {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift()!;

    try {
      await task();
      this.emit('complete');
    } catch (error) {
      this.emit('error', error);
    } finally {
      this.running--;
      this.process();
    }
  }

  /**
   * Get queue length
   */
  get length(): number {
    return this.queue.length;
  }

  /**
   * Check if running
   */
  get isRunning(): boolean {
    return this.running > 0;
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Wait for empty
   */
  async waitForEmpty(): Promise<void> {
    while (this.queue.length > 0 || this.running > 0) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
}

/**
 * Priority Queue
 */
export class PriorityQueue<T> {
  private items: Array<{ priority: number; value: T }> = [];

  /**
   * Add item with priority
   */
  enqueue(value: T, priority: number = 0): void {
    this.items.push({ priority, value });
    this.items.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Remove and return highest priority item
   */
  dequeue(): T | undefined {
    return this.items.shift()?.value;
  }

  /**
   * Peek at highest priority item
   */
  peek(): T | undefined {
    return this.items[0]?.value;
  }

  /**
   * Get size
   */
  get size(): number {
    return this.items.length;
  }

  /**
   * Check if empty
   */
  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Clear
   */
  clear(): void {
    this.items = [];
  }
}

/**
 * Debounce
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Throttle
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let lastCall: number = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Once decorator
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called: boolean = false;
  let result: any;
  return ((...args: any[]) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  }) as T;
}

/**
 * Memoize
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, any>();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export default { AsyncQueue, PriorityQueue, debounce, throttle, once, memoize };

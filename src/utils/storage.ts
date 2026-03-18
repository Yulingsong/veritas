/**
 * Storage Utilities
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Local storage with file backing
 */
export class LocalStorage {
  private filePath: string;
  private data: Record<string, any> = {};

  constructor(filePath: string) {
    this.filePath = filePath;
    this.load();
  }

  /**
   * Load from file
   */
  private load(): void {
    if (fs.existsSync(this.filePath)) {
      try {
        this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
      } catch {
        this.data = {};
      }
    }
  }

  /**
   * Save to file
   */
  private save(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  /**
   * Get value
   */
  get(key: string): any {
    return this.data[key];
  }

  /**
   * Set value
   */
  set(key: string, value: any): void {
    this.data[key] = value;
    this.save();
  }

  /**
   * Delete value
   */
  delete(key: string): void {
    delete this.data[key];
    this.save();
  }

  /**
   * Clear all
   */
  clear(): void {
    this.data = {};
    this.save();
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Object.keys(this.data);
  }

  /**
   * Check if has key
   */
  has(key: string): boolean {
    return key in this.data;
  }
}

/**
 * In-memory cache
 */
export class MemoryCache<T> {
  private cache: Map<string, { value: T; expiry: number }> = new Map();

  /**
   * Set value with TTL
   */
  set(key: string, value: T, ttlMs: number = 60000): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });
  }

  /**
   * Get value
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Delete value
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Clean expired entries
   */
  clean(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * LRUCache
 */
export class LRUCache<T> {
  private cache: Map<string, T> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  /**
   * Get value
   */
  get(key: string): T | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  /**
   * Set value
   */
  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Delete least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  /**
   * Delete value
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get size
   */
  size(): number {
    return this.cache.size;
  }
}

export default { LocalStorage, MemoryCache, LRUCache };

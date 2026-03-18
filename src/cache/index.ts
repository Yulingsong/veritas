/**
 * Cache System - Cache AI responses and analysis results
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  directory?: string;
  enabled?: boolean;
}

export interface CacheEntry {
  key: string;
  value: any;
  timestamp: number;
  ttl: number;
}

/**
 * File-based cache
 */
export class Cache {
  private directory: string;
  private ttl: number;
  private enabled: boolean;
  private memoryCache: Map<string, CacheEntry>;

  constructor(options: CacheOptions = {}) {
    this.directory = options.directory || path.join(process.cwd(), '.veritas-cache');
    this.ttl = options.ttl || 3600; // 1 hour default
    this.enabled = options.enabled ?? true;
    this.memoryCache = new Map();
    
    if (this.enabled && !fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory, { recursive: true });
    }
  }

  /**
   * Generate cache key from input
   */
  generateKey(...inputs: any[]): string {
    const data = JSON.stringify(inputs);
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    // Check memory first
    const memEntry = this.memoryCache.get(key);
    if (memEntry && !this.isExpired(memEntry)) {
      return memEntry.value as T;
    }

    // Check file cache
    if (!this.enabled) return null;
    
    const filePath = this.getFilePath(key);
    if (!fs.existsSync(filePath)) return null;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const entry: CacheEntry = JSON.parse(content);

      if (this.isExpired(entry)) {
        this.delete(key);
        return null;
      }

      // Store in memory
      this.memoryCache.set(key, entry);
      return entry.value as T;
    } catch {
      return null;
    }
  }

  /**
   * Set value to cache
   */
  set(key: string, value: any, ttl?: number): void {
    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      ttl: ttl || this.ttl
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Store in file
    if (this.enabled) {
      const filePath = this.getFilePath(key);
      fs.writeFileSync(filePath, JSON.stringify(entry));
    }
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    
    const filePath = this.getFilePath(key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear();
    
    if (fs.existsSync(this.directory)) {
      const files = fs.readdirSync(this.directory);
      for (const file of files) {
        fs.unlinkSync(path.join(this.directory, file));
      }
    }
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    const age = (Date.now() - entry.timestamp) / 1000;
    return age > entry.ttl;
  }

  /**
   * Get file path for key
   */
  private getFilePath(key: string): string {
    return path.join(this.directory, `${key}.json`);
  }

  /**
   * Get cache statistics
   */
  getStats(): { entries: number; size: number } {
    let size = 0;
    let entries = 0;

    if (fs.existsSync(this.directory)) {
      const files = fs.readdirSync(this.directory);
      entries = files.length;
      for (const file of files) {
        const stat = fs.statSync(path.join(this.directory, file));
        size += stat.size;
      }
    }

    return { entries, size };
  }
}

/**
 * Default cache instance
 */
export const cache = new Cache();

/**
 * Decorator for caching function results
 */
export function cached(options: CacheOptions = {}) {
  const cacheInstance = new Cache(options);
  
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const key = cacheInstance.generateKey(...args);
      const cached = cacheInstance.get(key);
      
      if (cached !== null) {
        return cached;
      }
      
      const result = await originalMethod.apply(this, args);
      cacheInstance.set(key, result);
      return result;
    };
    
    return descriptor;
  };
}

/**
 * Cache for AI responses
 */
export class AICache {
  private cache: Cache;

  constructor() {
    this.cache = new Cache({ ttl: 86400 }); // 24 hours
  }

  /**
   * Generate key for AI request
   */
  generateRequestKey(prompt: string, model: string): string {
    return this.cache.generateKey(prompt, model);
  }

  /**
   * Get cached response
   */
  getResponse(prompt: string, model: string): string | null {
    const key = this.generateRequestKey(prompt, model);
    return this.cache.get<string>(key);
  }

  /**
   * Cache AI response
   */
  setResponse(prompt: string, model: string, response: string): void {
    const key = this.generateRequestKey(prompt, model);
    this.cache.set(key, response);
  }
}

export const aiCache = new AICache();

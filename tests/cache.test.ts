/**
 * Cache Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Cache, cached, aiCache } from '../src/cache/index.js';

describe('Cache', () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache({ ttl: 1000 });
  });

  describe('Cache.set/get', () => {
    it('should set and get value', () => {
      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');
    });

    it('should return null for missing key', () => {
      expect(cache.get('missing')).toBeNull();
    });
  });

  describe('Cache TTL', () => {
    it('should expire after TTL', async () => {
      cache.set('key', 'value', 50);
      expect(cache.get('key')).toBe('value');
      await new Promise(r => setTimeout(r, 100));
      expect(cache.get('key')).toBeNull();
    });
  });

  describe('Cache.delete', () => {
    it('should delete key', () => {
      cache.set('key', 'value');
      cache.delete('key');
      expect(cache.get('key')).toBeNull();
    });
  });

  describe('Cache.clear', () => {
    it('should clear all', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.clear();
      expect(cache.get('a')).toBeNull();
    });
  });

  describe('Cache.generateKey', () => {
    it('should generate consistent keys', () => {
      const key1 = cache.generateKey('test', 'args');
      const key2 = cache.generateKey('test', 'args');
      expect(key1).toBe(key2);
    });
  });

  describe('Cache.getStats', () => {
    it('should return stats', () => {
      cache.set('key', 'value');
      const stats = cache.getStats();
      expect(stats.entries).toBeGreaterThan(0);
    });
  });
});

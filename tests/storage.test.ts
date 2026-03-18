/**
 * Storage Utilities Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorage, MemoryCache, LRUCache } from '../src/utils/storage.js';
import * as fs from 'fs';
import * as path from 'path';

describe('Storage Utilities', () => {
  describe('LocalStorage', () => {
    const testFile = '/tmp/veritas-test-storage.json';
    let storage: LocalStorage;

    beforeEach(() => {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      storage = new LocalStorage(testFile);
    });

    it('should set and get value', () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should delete value', () => {
      storage.set('key', 'value');
      storage.delete('key');
      expect(storage.get('key')).toBeUndefined();
    });

    it('should check if has key', () => {
      storage.set('key', 'value');
      expect(storage.has('key')).toBe(true);
      expect(storage.has('missing')).toBe(false);
    });

    it('should get all keys', () => {
      storage.set('a', 1);
      storage.set('b', 2);
      expect(storage.keys()).toEqual(['a', 'b']);
    });

    it('should clear all', () => {
      storage.set('a', 1);
      storage.clear();
      expect(storage.keys()).toEqual([]);
    });
  });

  describe('MemoryCache', () => {
    let cache: MemoryCache<string>;

    beforeEach(() => {
      cache = new MemoryCache<string>();
    });

    it('should set and get value', () => {
      cache.set('key', 'value', 1000);
      expect(cache.get('key')).toBe('value');
    });

    it('should expire after TTL', async () => {
      cache.set('key', 'value', 50);
      await sleep(60);
      expect(cache.get('key')).toBeUndefined();
    });

    it('should delete value', () => {
      cache.set('key', 'value', 1000);
      cache.delete('key');
      expect(cache.get('key')).toBeUndefined();
    });
  });

  describe('LRUCache', () => {
    let cache: LRUCache<string>;

    beforeEach(() => {
      cache = new LRUCache<string>(3);
    });

    it('should set and get value', () => {
      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');
    });

    it('should evict oldest when full', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.set('c', '3');
      cache.set('d', '4');
      
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('d')).toBe('4');
    });

    it('should update on get', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.get('a'); // Access 'a' to update LRU
      cache.set('c', '3');
      cache.set('d', '4');
      
      expect(cache.get('a')).toBe('1'); // Should NOT be evicted
    });
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

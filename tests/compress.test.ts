/**
 * Compression Tests
 */

import { describe, it, expect } from 'vitest';
import { compressGzip, decompressGzip, compressBrotli, decompressBrotli, Compressor } from '../src/utils/compress.js';

describe('Compression', () => {
  describe('gzip', () => {
    it('should compress and decompress', async () => {
      const original = 'Hello World! This is a test message.';
      const compressed = await compressGzip(original);
      const decompressed = await decompressGzip(compressed);
      expect(decompressed.toString()).toBe(original);
    });
  });

  describe('brotli', () => {
    it('should compress and decompress', async () => {
      const original = 'Hello World! This is a test message.';
      const compressed = await compressBrotli(original);
      const decompressed = await decompressBrotli(compressed);
      expect(decompressed.toString()).toBe(original);
    });
  });

  describe('Compressor class', () => {
    it('should compress with gzip', async () => {
      const data = 'test data';
      const compressed = await Compressor.compress(data, 'gzip');
      expect(compressed.length).toBeGreaterThan(0);
    });

    it('should decompress with gzip', async () => {
      const data = 'test data';
      const compressed = await Compressor.compress(data, 'gzip');
      const decompressed = await Compressor.decompress(compressed, 'gzip');
      expect(decompressed.toString()).toBe(data);
    });
  });
});

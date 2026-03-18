/**
 * Compression Utilities
 */

import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);
const brotliCompress = promisify(zlib.brotliCompress);
const brotliDecompress = promisify(zlib.brotliDecompress);

/**
 * Compress data with gzip
 */
export async function compressGzip(data: string | Buffer): Promise<Buffer> {
  const input = typeof data === 'string' ? Buffer.from(data) : data;
  return gzip(input);
}

/**
 * Decompress gzip data
 */
export async function decompressGzip(data: Buffer): Promise<Buffer> {
  return gunzip(data);
}

/**
 * Compress data with deflate
 */
export async function compressDeflate(data: string | Buffer): Promise<Buffer> {
  const input = typeof data === 'string' ? Buffer.from(data) : data;
  return deflate(input);
}

/**
 * Decompress deflate data
 */
export async function decompressDeflate(data: Buffer): Promise<Buffer> {
  return inflate(data);
}

/**
 * Compress data with brotli
 */
export async function compressBrotli(data: string | Buffer): Promise<Buffer> {
  const input = typeof data === 'string' ? Buffer.from(data) : data;
  return brotliCompress(input);
}

/**
 * Decompress brotli data
 */
export async function decompressBrotli(data: Buffer): Promise<Buffer> {
  return brotliDecompress(data);
}

/**
 * Compressor class
 */
export class Compressor {
  /**
   * Compress with specified algorithm
   */
  static async compress(
    data: string | Buffer, 
    algorithm: 'gzip' | 'deflate' | 'brotli' = 'gzip'
  ): Promise<Buffer> {
    switch (algorithm) {
      case 'gzip': return compressGzip(data);
      case 'deflate': return compressDeflate(data);
      case 'brotli': return compressBrotli(data);
    }
  }

  /**
   * Decompress with specified algorithm
   */
  static async decompress(
    data: Buffer, 
    algorithm: 'gzip' | 'deflate' | 'brotli' = 'gzip'
  ): Promise<Buffer> {
    switch (algorithm) {
      case 'gzip': return decompressGzip(data);
      case 'deflate': return decompressDeflate(data);
      case 'brotli': return decompressBrotli(data);
    }
  }
}

export default { compressGzip, decompressGzip, compressDeflate, decompressDeflate, compressBrotli, decompressBrotli, Compressor };

/**
 * Crypto Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { hash, md5, sha256, randomString, uuid, token, encrypt, decrypt, hmac } from '../src/utils/crypto.js';

describe('Crypto', () => {
  describe('hash', () => {
    it('should generate SHA256 hash', () => {
      const h = hash('test');
      expect(h).toHaveLength(64);
    });

    it('should generate different hashes for different algorithms', () => {
      const sha1 = hash('test', 'sha1');
      const sha256 = hash('test', 'sha256');
      expect(sha1).not.toBe(sha256);
    });
  });

  describe('md5', () => {
    it('should generate MD5 hash', () => {
      const h = md5('test');
      expect(h).toHaveLength(32);
    });
  });

  describe('sha256', () => {
    it('should generate SHA256 hash', () => {
      const h = sha256('test');
      expect(h).toHaveLength(64);
    });
  });

  describe('randomString', () => {
    it('should generate random string of specified length', () => {
      const s = randomString(16);
      expect(s).toHaveLength(32); // hex = 2x length
    });
  });

  describe('uuid', () => {
    it('should generate valid UUID', () => {
      const id = uuid();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });
  });

  describe('token', () => {
    it('should generate token', () => {
      const t = token();
      expect(t).toHaveLength(64);
    });
  });

  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt', () => {
      const key = '0123456789abcdef0123456789abcdef';
      const original = 'secret message';
      const encrypted = encrypt(original, key);
      const decrypted = decrypt(encrypted, key);
      expect(decrypted).toBe(original);
    });
  });

  describe('hmac', () => {
    it('should generate HMAC', () => {
      const h = hmac('message', 'secret');
      expect(h).toHaveLength(64);
    });
  });
});

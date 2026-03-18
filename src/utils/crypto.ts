/**
 * Crypto Utilities
 */

import * as crypto from 'crypto';

/**
 * Hash types
 */
export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

/**
 * Generate hash
 */
export function hash(data: string, algorithm: HashAlgorithm = 'sha256'): string {
  return crypto.createHash(algorithm).update(data).digest('hex');
}

/**
 * Generate MD5 hash
 */
export function md5(data: string): string {
  return hash(data, 'md5');
}

/**
 * Generate SHA256 hash
 */
export function sha256(data: string): string {
  return hash(data, 'sha256');
}

/**
 * Generate random string
 */
export function randomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate random UUID
 */
export function uuid(): string {
  return crypto.randomUUID();
}

/**
 * Generate random token
 */
export function token(): string {
  return randomString(32);
}

/**
 * Encrypt with AES
 */
export function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.slice(0, 32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt with AES
 */
export function decrypt(encrypted: string, key: string): string {
  const [ivHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * HMAC
 */
export function hmac(data: string, key: string, algorithm: HashAlgorithm = 'sha256'): string {
  return crypto.createHmac(algorithm, key).update(data).digest('hex');
}

export default { hash, md5, sha256, randomString, uuid, token, encrypt, decrypt, hmac };

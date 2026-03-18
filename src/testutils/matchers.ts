/**
 * Test Matchers - Custom Jest/Vitest matchers
 */

import type { Mock } from '@vitest/spy';

/**
 * Custom matchers for testing
 */
export const matchers = {
  /**
   * Match JSON string
   */
  toMatchJSON(received: string, expected: any): { pass: boolean; message: () => string } {
    try {
      const parsed = JSON.parse(received);
      const pass = JSON.stringify(parsed) === JSON.stringify(expected);
      return {
        pass,
        message: () => pass ? 'OK' : `Expected ${JSON.stringify(expected)}, got ${received}`
      };
    } catch {
      return { pass: false, message: () => 'Invalid JSON' };
    }
  },

  /**
   * Match URL
   */
  toBeValidURL(received: string): { pass: boolean; message: () => string } {
    try {
      new URL(received);
      return { pass: true, message: () => 'OK' };
    } catch {
      return { pass: false, message: () => `'${received}' is not a valid URL` };
    }
  },

  /**
   * Match email
   */
  toBeValidEmail(received: string): { pass: boolean; message: () => string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    return {
      pass,
      message: () => pass ? 'OK' : `'${received}' is not a valid email`
    };
  },

  /**
   * Match UUID
   */
  toBeUUID(received: string): { pass: boolean; message: () => string } {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      pass,
      message: () => pass ? 'OK' : `'${received}' is not a valid UUID`
    };
  },

  /**
   * Match phone number
   */
  toBeValidPhone(received: string): { pass: boolean; message: () => string } {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const pass = phoneRegex.test(received.replace(/[\s()-]/g, ''));
    return {
      pass,
      message: () => pass ? 'OK' : `'${received}' is not a valid phone number`
    };
  },

  /**
   * Contain subset
   */
  toContainSubset(received: any, expected: any): { pass: boolean; message: () => string } {
    const pass = Object.keys(expected).every(
      key => JSON.stringify(received[key]) === JSON.stringify(expected[key])
    );
    return {
      pass,
      message: () => pass ? 'OK' : `Object does not contain expected subset`
    };
  },

  /**
   * Match array unique
   */
  toBeUniqueArray(received: any[]): { pass: boolean; message: () => string } {
    const unique = new Set(received);
    const pass = unique.size === received.length;
    return {
      pass,
      message: () => pass ? 'OK' : `Array contains duplicates`
    };
  },

  /**
   * Match sorted array
   */
  toBeSorted(received: any[], ascending: boolean = true): { pass: boolean; message: () => string } {
    const sorted = [...received].sort((a, b) => ascending ? (a > b ? 1 : -1) : (a < b ? 1 : -1));
    const pass = JSON.stringify(received) === JSON.stringify(sorted);
    return {
      pass,
      message: () => pass ? 'OK' : `Array is not sorted`
    };
  }
};

/**
 * Async matchers
 */
export const asyncMatchers = {
  /**
   * Resolve within time
   */
  async toResolveWithin(promise: Promise<any>, ms: number): Promise<{ pass: boolean; message: () => string }> {
    try {
      await Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
      ]);
      return { pass: true, message: () => 'OK' };
    } catch {
      return { pass: false, message: () => `Promise did not resolve within ${ms}ms` };
    }
  },

  /**
   * Reject with error
   */
  async toRejectWith(promise: Promise<any>, errorType: any): Promise<{ pass: boolean; message: () => string }> {
    try {
      await promise;
      return { pass: false, message: () => 'Promise did not reject' };
    } catch (error) {
      const pass = error instanceof errorType;
      return {
        pass,
        message: () => pass ? 'OK' : `Expected ${errorType.name}, got ${error?.constructor?.name || 'unknown'}`
      };
    }
  }
};

/**
 * Extend expect
 */
export function extendExpect(): void {
  // This would be used to extend Jest/Vitest
  // For TypeScript, you'd need to declare module augmentation
}

export default { matchers, asyncMatchers, extendExpect };

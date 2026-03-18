/**
 * Environment Utilities
 */

/**
 * Get environment variable
 */
export function env(key: string, defaultValue?: string): string {
  return process.env[key] || defaultValue || '';
}

/**
 * Check if in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production';
}

/**
 * Check if in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if in test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get all env vars with prefix
 */
export function getEnvWithPrefix(prefix: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith(prefix)) {
      result[key.slice(prefix.length)] = value || '';
    }
  }
  return result;
}

/**
 * Required env var
 */
export function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Parse boolean env var
 */
export function boolEnv(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parse number env var
 */
export function numEnv(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export default { env, isDevelopment, isProduction, isTest, getEnvWithPrefix, requiredEnv, boolEnv, numEnv };

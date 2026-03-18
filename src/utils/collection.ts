/**
 * Collection Utilities
 */

/**
 * Map values
 */
export function mapValues<T extends Record<string, any>, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = fn(obj[key], key);
    }
  }
  return result;
}

/**
 * Map keys
 */
export function mapKeys<T extends Record<string, any>>(
  obj: T,
  fn: (key: string, value: T[keyof T]) => string
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = fn(key, obj[key]);
      result[newKey] = obj[key];
    }
  }
  return result;
}

/**
 * Filter object
 */
export function filterObject<T extends Record<string, any>>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result = {} as Partial<T>;
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && fn(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Reduce object
 */
export function reduceObject<T extends Record<string, any>, U>(
  obj: T,
  fn: (acc: U, value: T[keyof T], key: keyof T) => U,
  initial: U
): U {
  let acc = initial;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      acc = fn(acc, obj[key], key);
    }
  }
  return acc;
}

/**
 * Invert object keys/values
 */
export function invertObject<T extends Record<string, string>>(
  obj: T
): Record<T[keyof T], keyof T> {
  const result = {} as Record<T[keyof T], keyof T>;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[obj[key]] = key;
    }
  }
  return result;
}

/**
 * Get nested value
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) {
      return defaultValue;
    }
    current = current[key];
  }
  return current ?? defaultValue;
}

/**
 * Set nested value
 */
export function set<T extends Record<string, any>>(
  obj: T,
  path: string,
  value: any
): T {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * Has nested property
 */
export function has(obj: any, path: string): boolean {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null || !(key in current)) {
      return false;
    }
    current = current[key];
  }
  return true;
}

/**
 * Delete nested property
 */
export function del<T extends Record<string, any>>(obj: T, path: string): boolean {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current === undefined || current === null) {
      return false;
    }
    current = current[keys[i]];
  }
  const lastKey = keys[keys.length - 1];
  if (lastKey in current) {
    delete current[lastKey];
    return true;
  }
  return false;
}

export default { mapValues, mapKeys, filterObject, reduceObject, invertObject, get, set, has, del };

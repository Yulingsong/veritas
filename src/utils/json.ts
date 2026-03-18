/**
 * JSON Utilities
 */

/**
 * Safe JSON parse
 */
export function jsonParse<T = any>(str: string, defaultValue: T | null = null): T | null {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * Safe JSON stringify
 */
export function jsonStringify(val: any, pretty: boolean = false): string {
  try {
    return JSON.stringify(val, null, pretty ? 2 : 0);
  } catch {
    return '';
  }
}

/**
 * Query string to object
 */
export function queryStringToObject(query: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(query);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Object to query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

/**
 * Deep JSON clone
 */
export function jsonClone<T>(val: T): T {
  return jsonParse(jsonStringify(val)) as T;
}

/**
 * Flatten object
 */
export function flattenObject(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (isObject(value) && value !== null) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

/**
 * Unflatten object
 */
export function unflattenObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  return result;
}

function isObject(val: any): boolean {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export default { jsonParse, jsonStringify, queryStringToObject, objectToQueryString, jsonClone, flattenObject, unflattenObject };

/**
 * Type Guards
 */

/**
 * Is array
 */
export function isArray(val: any): val is any[] {
  return Array.isArray(val);
}

/**
 * Is object
 */
export function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Is string
 */
export function isString(val: any): val is string {
  return typeof val === 'string';
}

/**
 * Is number
 */
export function isNumber(val: any): val is number {
  return typeof val === 'number' && !isNaN(val);
}

/**
 * Is boolean
 */
export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean';
}

/**
 * Is function
 */
export function isFunction(val: any): val is Function {
  return typeof val === 'function';
}

/**
 * Is null
 */
export function isNull(val: any): val is null {
  return val === null;
}

/**
 * Is undefined
 */
export function isUndefined(val: any): val is undefined {
  return val === undefined;
}

/**
 * Is empty
 */
export function isEmpty(val: any): boolean {
  if (isNull(val) || isUndefined(val)) return true;
  if (isString(val)) return val.length === 0;
  if (isArray(val)) return val.length === 0;
  if (isObject(val)) return Object.keys(val).length === 0;
  return false;
}

/**
 * Is promise
 */
export function isPromise(val: any): val is Promise<any> {
  return val instanceof Promise || (typeof val === 'object' && typeof val.then === 'function');
}

/**
 * Is date
 */
export function isDate(val: any): val is Date {
  return val instanceof Date;
}

/**
 * Is error
 */
export function isError(val: any): val is Error {
  return val instanceof Error;
}

/**
 * Is plain object
 */
export function isPlainObject(val: any): val is Record<string, any> {
  return isObject(val) && (val.constructor === Object || val.constructor === undefined);
}

export default { isArray, isObject, isString, isNumber, isBoolean, isFunction, isNull, isUndefined, isEmpty, isPromise, isDate, isError, isPlainObject };

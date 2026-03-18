/**
 * Function Utilities
 */

/**
 * Compose functions
 */
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

/**
 * Pipe functions
 */
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

/**
 * Curry function
 */
export function curry<T extends (...args: any[]) => any>(fn: T): any {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
}

/**
 * Partial apply
 */
export function partial<T extends (...args: any[]) => any>(fn: T, ...args: any[]): (...args: any[]) => ReturnType<T> {
  return (...nextArgs: any[]) => fn(...args, ...nextArgs);
}

/**
 * Bind context
 */
export function bind<T extends (...args: any[]) => any>(fn: T, context: any): T {
  return fn.bind(context) as T;
}

/**
 * Negate function
 */
export function negate<T extends (...args: any[]) => boolean>(fn: T): (...args: Parameters<T>) => boolean {
  return (...args: Parameters<T>) => !fn(...args);
}

/**
 * Noop function
 */
export function noop(): void {}

/**
 * Identity function
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Constant function
 */
export function constant<T>(value: T): () => T {
  return () => value;
}

/**
 * Sleep/wait
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call function with delay
 */
export function delayedCall<T extends (...args: any[]) => any>(fn: T, delayMs: number): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => setTimeout(() => fn(...args), delayMs);
}

/**
 * Call function only once
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;
  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  }) as T;
}

/**
 * Call function with guard
 */
export function guarded<T extends (...args: any[]) => any>(fn: T, guard: (...args: Parameters<T>) => boolean): T {
  return ((...args: Parameters<T>) => {
    if (guard(...args)) {
      return fn(...args);
    }
  }) as T;
}

export default { compose, pipe, curry, partial, bind, negate, noop, identity, constant, wait, delayedCall, once, guarded };

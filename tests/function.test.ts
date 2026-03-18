/**
 * Function Utilities Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { 
  compose, 
  pipe, 
  curry,
  partial,
  negate,
  noop,
  identity,
  constant,
  memoize
} from '../src/utils/function.js';

describe('Function Utilities', () => {
  describe('compose', () => {
    it('should compose functions right to left', () => {
      const add1 = (x: number) => x + 1;
      const multiply2 = (x: number) => x * 2;
      const composed = compose(multiply2, add1);
      expect(composed(3)).toBe(8); // (3 + 1) * 2 = 8
    });
  });

  describe('pipe', () => {
    it('should pipe functions left to right', () => {
      const add1 = (x: number) => x + 1;
      const multiply2 = (x: number) => x * 2;
      const piped = pipe(add1, multiply2);
      expect(piped(3)).toBe(8); // (3 + 1) * 2 = 8
    });
  });

  describe('curry', () => {
    it('should curry function', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const curried = curry(add);
      expect(curried(1)(2)(3)).toBe(6);
      expect(curried(1, 2)(3)).toBe(6);
    });
  });

  describe('partial', () => {
    it('should partially apply function', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const partialAdd = partial(add, 1, 2);
      expect(partialAdd(3)).toBe(6);
    });
  });

  describe('negate', () => {
    it('should negate predicate', () => {
      const isEven = (n: number) => n % 2 === 0;
      const isOdd = negate(isEven);
      expect(isEven(2)).toBe(true);
      expect(isOdd(2)).toBe(false);
    });
  });

  describe('noop', () => {
    it('should do nothing', () => {
      expect(noop()).toBeUndefined();
    });
  });

  describe('identity', () => {
    it('should return input', () => {
      expect(identity(5)).toBe(5);
      expect(identity('hello')).toBe('hello');
    });
  });

  describe('constant', () => {
    it('should return constant function', () => {
      const fn = constant(5);
      expect(fn()).toBe(5);
    });
  });

  describe('memoize', () => {
    it('should memoize function', () => {
      let callCount = 0;
      const fn = (n: number) => { callCount++; return n * 2; };
      const memoized = memoize(fn);
      
      memoized(1);
      memoized(1);
      memoized(2);
      
      expect(callCount).toBe(2);
    });
  });
});

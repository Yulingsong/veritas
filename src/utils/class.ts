/**
 * Class Utilities
 */

/**
 * Create class
 */
export function createClass<T extends new (...args: any[]) => any>(
  constructor: T,
  methods: Partial<InstanceType<T>>
): T {
  Object.assign(constructor.prototype, methods);
  return constructor;
}

/**
 * Mixin
 */
export function mixin<T extends new (...args: any[]) => any>(
  baseClass: T,
  ...mixins: Array<Record<string, any>>
): T {
  class Mixed extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
  }
  
  for (const mixin of mixins) {
    Object.assign(Mixed.prototype, mixin);
  }
  
  return Mixed;
}

/**
 * Add method to class
 */
export function addMethod(
  target: any,
  name: string,
  fn: Function
): void {
  target.prototype[name] = fn;
}

/**
 * Add property to class
 */
export function addProperty(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
): void {
  Object.defineProperty(target.prototype, name, descriptor);
}

export default { createClass, mixin, addMethod, addProperty };

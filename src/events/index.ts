/**
 * Event Bus / Event Emitter
 */

import { EventEmitter } from 'events';

/**
 * Event bus for Veritas
 */
export class VeritasEventBus extends EventEmitter {
  private static instance: VeritasEventBus;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  /**
   * Get singleton instance
   */
  static getInstance(): VeritasEventBus {
    if (!VeritasEventBus.instance) {
      VeritasEventBus.instance = new VeritasEventBus();
    }
    return VeritasEventBus.instance;
  }

  /**
   * Emit with payload
   */
  emit(event: string, payload?: any): boolean {
    return super.emit(event, payload);
  }

  /**
   * On with payload
   */
  on(event: string, handler: (payload?: any) => void): this {
    return super.on(event, handler);
  }

  /**
   * Once with payload
   */
  once(event: string, handler: (payload?: any) => void): this {
    return super.once(event, handler);
  }
}

/**
 * Event types
 */
export const Events = {
  // Generation events
  GENERATE_START: 'generate:start',
  GENERATE_COMPLETE: 'generate:complete',
  GENERATE_ERROR: 'generate:error',

  // Recording events
  RECORD_START: 'record:start',
  RECORD_COMPLETE: 'record:complete',
  RECORD_ERROR: 'record:error',

  // Analysis events
  ANALYZE_START: 'analyze:start',
  ANALYZE_COMPLETE: 'analyze:complete',

  // Test events
  TEST_START: 'test:start',
  TEST_COMPLETE: 'test:complete',
  TEST_ERROR: 'test:error',

  // Cache events
  CACHE_HIT: 'cache:hit',
  CACHE_MISS: 'cache:miss',

  // Config events
  CONFIG_CHANGED: 'config:changed',

  // Plugin events
  PLUGIN_LOADED: 'plugin:loaded',
  PLUGIN_UNLOADED: 'plugin:unloaded'
};

/**
 * Create event handler
 */
export function createEventHandler(event: string, handler: (payload?: any) => void) {
  const bus = VeritasEventBus.getInstance();
  bus.on(event, handler);
  return () => bus.off(event, handler);
}

export default { VeritasEventBus, Events, createEventHandler };

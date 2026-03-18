/**
 * Event Bus Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { VeritasEventBus, Events } from '../src/events/index.js';

describe('Event Bus', () => {
  let bus: VeritasEventBus;

  beforeEach(() => {
    bus = VeritasEventBus.getInstance();
  });

  describe('emit/on', () => {
    it('should emit and receive events', () => {
      const handler = vi.fn();
      bus.on('test', handler);
      bus.emit('test', { data: 'hello' });
      
      expect(handler).toHaveBeenCalledWith({ data: 'hello' });
    });

    it('should support multiple handlers', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      bus.on('test', handler1);
      bus.on('test', handler2);
      bus.emit('test');
      
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe('once', () => {
    it('should only call handler once', () => {
      const handler = vi.fn();
      bus.once('test', handler);
      
      bus.emit('test');
      bus.emit('test');
      
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    it('should remove handler', () => {
      const handler = vi.fn();
      bus.on('test', handler);
      bus.off('test', handler);
      bus.emit('test');
      
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('should have all event types', () => {
      expect(Events.GENERATE_START).toBe('generate:start');
      expect(Events.GENERATE_COMPLETE).toBe('generate:complete');
      expect(Events.RECORD_START).toBe('record:start');
    });
  });
});

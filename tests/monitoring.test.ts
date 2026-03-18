/**
 * Monitor Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PerformanceTimer, MemoryMonitor, NetworkMonitor } from '../src/monitoring/index.js';

describe('Monitoring', () => {
  describe('PerformanceTimer', () => {
    it('should measure time', () => {
      const timer = new PerformanceTimer();
      timer.mark('start');
      
      const start = Date.now();
      while (Date.now() - start < 10) {}
      
      const duration = timer.measure('elapsed', 'start');
      expect(duration).toBeGreaterThan(0);
    });
  });

  describe('MemoryMonitor', () => {
    it('should get memory usage', () => {
      const monitor = new MemoryMonitor();
      const mem = monitor.getMemory();
      expect(mem.heapUsed).toBeGreaterThan(0);
    });

    it('should check threshold', () => {
      const monitor = new MemoryMonitor();
      expect(monitor.isBelowThreshold(100000)).toBe(true);
    });
  });

  describe('NetworkMonitor', () => {
    it('should track requests', () => {
      const monitor = new NetworkMonitor();
      monitor.trackRequest('https://api.example.com/users', 'GET');
      monitor.completeRequest('https://api.example.com/users');
      
      const stats = monitor.getStats();
      expect(stats.total).toBe(1);
      expect(stats.completed).toBe(1);
    });

    it('should reset', () => {
      const monitor = new NetworkMonitor();
      monitor.trackRequest('https://api.example.com/users', 'GET');
      monitor.reset();
      
      const stats = monitor.getStats();
      expect(stats.total).toBe(0);
    });
  });
});

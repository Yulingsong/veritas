/**
 * Logger Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger, createLogger } from '../src/logger/index.js';

describe('Logger', () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Logger', () => {
    it('should create logger instance', () => {
      const logger = createLogger({ level: 'info' });
      expect(logger).toBeDefined();
    });

    it('should log info messages', () => {
      const logger = createLogger({ level: 'info' });
      logger.info('test message');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should not log below threshold', () => {
      const logger = createLogger({ level: 'error' });
      logger.info('should not log');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log error messages', () => {
      const logger = createLogger({ level: 'info' });
      logger.error('error message');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log warn messages', () => {
      const logger = createLogger({ level: 'info' });
      logger.warn('warn message');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log debug messages when enabled', () => {
      const logger = createLogger({ level: 'debug' });
      logger.debug('debug message');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Logger.getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = Logger.getInstance({ level: 'info' });
      const instance2 = Logger.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
});

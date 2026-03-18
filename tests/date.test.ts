/**
 * Date Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  formatDate, 
  relativeTime, 
  addDays,
  startOfDay,
  endOfDay,
  isToday,
  daysBetween,
  formatDuration
} from '../src/utils/date.js';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date', () => {
      const date = new Date('2026-03-18T12:00:00Z');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2026-03-18');
    });
  });

  describe('relativeTime', () => {
    it('should return relative time', () => {
      const now = Date.now();
      expect(relativeTime(now)).toBe('just now');
    });
  });

  describe('addDays', () => {
    it('should add days', () => {
      const date = new Date('2026-03-18');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(23);
    });
  });

  describe('startOfDay', () => {
    it('should return start of day', () => {
      const date = new Date('2026-03-18T15:30:00');
      const result = startOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should return end of day', () => {
      const date = new Date('2026-03-18T15:30:00');
      const result = endOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });
  });

  describe('isToday', () => {
    it('should check if today', () => {
      expect(isToday(new Date())).toBe(true);
      expect(isToday(new Date('2020-01-01'))).toBe(false);
    });
  });

  describe('daysBetween', () => {
    it('should calculate days between', () => {
      const start = new Date('2026-03-01');
      const end = new Date('2026-03-18');
      expect(daysBetween(start, end)).toBe(17);
    });
  });

  describe('formatDuration', () => {
    it('should format duration', () => {
      expect(formatDuration(1000)).toBe('1s');
      expect(formatDuration(60000)).toBe('1m 0s');
      expect(formatDuration(3600000)).toBe('1h 0m');
    });
  });
});

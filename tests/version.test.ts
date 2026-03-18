/**
 * Version Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { parseVersion, compareVersions, VersionChecker } from '../src/utils/version.js';

describe('Version Utilities', () => {
  describe('parseVersion', () => {
    it('should parse version string', () => {
      const v = parseVersion('1.2.3');
      expect(v.major).toBe(1);
      expect(v.minor).toBe(2);
      expect(v.patch).toBe(3);
    });

    it('should parse pre-release', () => {
      const v = parseVersion('1.0.0-beta.1');
      expect(v.prerelease).toBe('beta.1');
    });

    it('should parse build', () => {
      const v = parseVersion('1.0.0+build.123');
      expect(v.build).toBe('build.123');
    });
  });

  describe('compareVersions', () => {
    it('should compare versions', () => {
      expect(compareVersions('2.0.0', '1.0.0')).toBe(1);
      expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    });

    it('should handle pre-release', () => {
      expect(compareVersions('1.0.0', '1.0.0-beta')).toBe(1);
      expect(compareVersions('1.0.0-alpha', '1.0.0-beta')).toBe(-1);
    });
  });

  describe('VersionChecker', () => {
    it('should check if greater', () => {
      const checker = new VersionChecker('2.0.0');
      expect(checker.isGreaterThan('1.0.0')).toBe(true);
      expect(checker.isLessThan('3.0.0')).toBe(true);
    });

    it('should check satisfies range', () => {
      const checker = new VersionChecker('1.5.0');
      expect(checker.satisfies('1.0.0-2.0.0')).toBe(true);
      expect(checker.satisfies('2.0.0-3.0.0')).toBe(false);
    });
  });
});

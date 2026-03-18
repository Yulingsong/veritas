/**
 * Version Manager
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Version info
 */
export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
  version: string;
}

/**
 * Parse version string
 */
export function parseVersion(version: string): VersionInfo {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([\da-zA-Z-]+))?(?:\+([\da-zA-Z-]+))?$/);
  
  if (!match) {
    throw new Error(`Invalid version: ${version}`);
  }

  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
    prerelease: match[4],
    build: match[5],
    version
  };
}

/**
 * Compare versions
 */
export function compareVersions(a: string, b: string): number {
  const v1 = parseVersion(a);
  const v2 = parseVersion(b);

  if (v1.major !== v2.major) return v1.major - v2.major;
  if (v1.minor !== v2.minor) return v1.minor - v2.minor;
  if (v1.patch !== v2.patch) return v1.patch - v2.patch;

  // Pre-release versions come after stable
  if (v1.prerelease && !v2.prerelease) return 1;
  if (!v1.prerelease && v2.prerelease) return -1;
  if (v1.prerelease && v2.prerelease) return v1.prerelease.localeCompare(v2.prerelease);

  return 0;
}

/**
 * Version checker
 */
export class VersionChecker {
  private currentVersion: string;

  constructor(currentVersion: string) {
    this.currentVersion = currentVersion;
  }

  /**
   * Check if current version is greater than target
   */
  isGreaterThan(target: string): boolean {
    return compareVersions(this.currentVersion, target) > 0;
  }

  /**
   * Check if current version is less than target
   */
  isLessThan(target: string): boolean {
    return compareVersions(this.currentVersion, target) < 0;
  }

  /**
   * Check if current version satisfies range
   */
  satisfies(range: string): boolean {
    const [min, max] = range.split('-').map(s => s.trim());
    
    if (min && this.isLessThan(min)) return false;
    if (max && this.isGreaterThan(max)) return false;
    
    return true;
  }
}

export default { parseVersion, compareVersions, VersionChecker };

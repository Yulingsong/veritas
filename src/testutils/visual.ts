/**
 * Visual Regression Testing
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Screenshot comparison
 */
export class ScreenshotComparator {
  private baselineDir: string;
  private diffDir: string;

  constructor(baselineDir: string = '__screenshots__/baseline', diffDir: string = '__screenshots__/diff') {
    this.baselineDir = baselineDir;
    this.diffDir = diffDir;
  }

  /**
   * Save baseline screenshot
   */
  saveBaseline(name: string, buffer: Buffer): void {
    const filePath = path.join(this.baselineDir, name);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, buffer);
  }

  /**
   * Compare screenshots
   */
  async compare(name: string, current: Buffer): Promise<ComparisonResult> {
    const baselinePath = path.join(this.baselineDir, name);
    
    if (!fs.existsSync(baselinePath)) {
      return { passed: false, reason: 'baseline_missing', diff: 0 };
    }

    const baseline = fs.readFileSync(baselinePath);
    
    // Simple byte comparison
    const diff = this.calculateDiff(baseline, current);
    const passed = diff === 0;

    if (!passed) {
      // Save diff
      const diffPath = path.join(this.diffDir, name);
      const diffDir = path.dirname(diffPath);
      if (!fs.existsSync(diffDir)) {
        fs.mkdirSync(diffDir, { recursive: true });
      }
      fs.writeFileSync(diffPath, current);
    }

    return { passed, reason: passed ? 'match' : 'diff', diff };
  }

  /**
   * Calculate difference percentage
   */
  private calculateDiff(buffer1: Buffer, buffer2: Buffer): number {
    if (buffer1.length !== buffer2.length) return 100;
    
    let diff = 0;
    for (let i = 0; i < buffer1.length; i++) {
      if (buffer1[i] !== buffer2[i]) diff++;
    }
    
    return (diff / buffer1.length) * 100;
  }

  /**
   * Update baseline
   */
  updateBaseline(name: string, buffer: Buffer): void {
    this.saveBaseline(name, buffer);
  }
}

export interface ComparisonResult {
  passed: boolean;
  reason: 'match' | 'diff' | 'baseline_missing';
  diff: number;
}

/**
 * Visual testing utilities
 */
export const visualUtils = {
  /**
   * Generate viewport sizes
   */
  viewports: [
    { width: 320, height: 480, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 800, name: 'desktop' },
    { width: 1920, height: 1080, name: 'wide' }
  ],

  /**
   * Generate color schemes
   */
  colorSchemes: ['light', 'dark', 'auto'],

  /**
   * Generate locales
   */
  locales: ['en', 'es', 'fr', 'de', 'zh']
};

export default { ScreenshotComparator, visualUtils };

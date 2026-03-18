/**
 * Bundle Analyzer
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Analyze bundle size
 */
export function analyzeBundle(bundlePath: string): BundleAnalysis {
  if (!fs.existsSync(bundlePath)) {
    return { exists: false, size: 0, gzipSize: 0 };
  }

  const stats = fs.statSync(bundlePath);
  const content = fs.readFileSync(bundlePath);
  
  // Estimate gzip size (rough)
  const gzipSize = Math.round(content.length * 0.3);

  return {
    exists: true,
    size: stats.size,
    gzipSize,
    path: bundlePath
  };
}

/**
 * Analyze imports
 */
export function analyzeImports(code: string): ImportAnalysis {
  const imports: ImportInfo[] = [];
  const regex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*)?)*\s+from\s+['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = regex.exec(code)) !== null) {
    imports.push({
      source: match[1],
      raw: match[0]
    });
  }

  return {
    total: imports.length,
    imports,
    byPackage: groupByPackage(imports)
  };
}

function groupByPackage(imports: ImportInfo[]): Record<string, number> {
  const groups: Record<string, number> = {};
  
  for (const imp of imports) {
    const pkg = imp.source.startsWith('.') ? 'local' : imp.source.split('/')[0];
    groups[pkg] = (groups[pkg] || 0) + 1;
  }

  return groups;
}

export interface BundleAnalysis {
  exists: boolean;
  size: number;
  gzipSize: number;
  path?: string;
}

export interface ImportAnalysis {
  total: number;
  imports: ImportInfo[];
  byPackage: Record<string, number>;
}

export interface ImportInfo {
  source: string;
  raw: string;
}

export default { analyzeBundle, analyzeImports };

/**
 * Utility Functions
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Find component files in directory
 */
export function findComponentFiles(
  dir: string,
  extensions: string[] = ['.tsx', '.jsx', '.vue', '.svelte']
): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip node_modules, dist, etc.
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', 'build', '.git', '__pycache__'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Get relative path
 */
export function getRelativePath(from: string, to: string): string {
  return path.relative(path.dirname(from), to);
}

/**
 * Ensure directory exists
 */
export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Format file size
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Format duration
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Detect framework from file
 */
export function detectFramework(filePath: string): string {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('react') || ext === '.tsx' || ext === '.jsx') return 'react';
  if (content.includes('vue') || ext === '.vue') return 'vue';
  if (content.includes('svelte') || ext === '.svelte') return 'svelte';
  if (content.includes('next') || content.includes('@next/')) return 'next';
  
  return 'react'; // default
}

/**
 * Detect test framework from package.json
 */
export function detectTestFramework(projectPath: string): string {
  const pkgPath = path.join(projectPath, 'package.json');
  
  if (!fs.existsSync(pkgPath)) return 'vitest';
  
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  if (deps.vitest) return 'vitest';
  if (deps.jest) return 'jest';
  if (deps['@playwright/test']) return 'playwright';
  
  return 'vitest'; // default
}

/**
 * Parse component name from file
 */
export function parseComponentName(filePath: string): string {
  const basename = path.basename(filePath, path.extname(filePath));
  
  // Handle PascalCase
  return basename
    .replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, c => c.toUpperCase());
}

/**
 * Generate test file path
 */
export function generateTestPath(
  sourceFile: string,
  options: { outputDir?: string; testPattern?: string } = {}
): string {
  const dir = options.outputDir || path.dirname(sourceFile);
  const basename = path.basename(sourceFile);
  const ext = path.extname(sourceFile);
  const name = basename.replace(ext, '');
  const pattern = options.testPattern || '.test';
  
  return path.join(dir, `${name}${pattern}.ts`);
}

/**
 * Deep merge objects
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] as any, source[key] as any);
    } else {
      result[key] = source[key] as any;
    }
  }
  
  return result;
}

/**
 * Retry function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delayMs?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000 } = options;
  
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts) throw error;
      await new Promise(r => setTimeout(r, delayMs * i));
    }
  }
  
  throw new Error('Retry failed');
}

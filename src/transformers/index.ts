/**
 * Code Transformers
 * 
 * Transform code for different purposes.
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Transform options
 */
export interface TransformOptions {
  removeComments?: boolean;
  minify?: boolean;
  format?: 'prettier' | 'default';
}

/**
 * Remove comments from code
 */
export function removeComments(code: string): string {
  // Remove single-line comments
  code = code.replace(/\/\/.*$/gm, '');
  
  // Remove multi-line comments
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  
  return code;
}

/**
 * Minify code (basic)
 */
export function minify(code: string): string {
  // Remove whitespace
  code = code.replace(/\s+/g, ' ');
  
  // Remove unnecessary whitespace around operators
  code = code.replace(/\s*([{}();,])\s*/g, '$1');
  
  return code.trim();
}

/**
 * Format code
 */
export async function formatCode(code: string, formatter: 'prettier' | 'default' = 'default'): Promise<string> {
  if (formatter === 'prettier') {
    try {
      const prettier = await import('prettier');
      return await prettier.format(code, {
        parser: 'typescript',
        semi: true,
        singleQuote: true
      });
    } catch {
      return code;
    }
  }
  
  // Default formatting
  return code;
}

/**
 * Code Transformer class
 */
export class CodeTransformer {
  private options: TransformOptions;

  constructor(options: TransformOptions = {}) {
    this.options = options;
  }

  /**
   * Transform code
   */
  async transform(code: string): Promise<string> {
    let result = code;

    if (this.options.removeComments) {
      result = removeComments(result);
    }

    if (this.options.minify) {
      result = minify(result);
    }

    if (this.options.format) {
      result = await formatCode(result, this.options.format);
    }

    return result;
  }

  /**
   * Transform file
   */
  async transformFile(inputPath: string, outputPath?: string): Promise<string> {
    const code = fs.readFileSync(inputPath, 'utf-8');
    const transformed = await this.transform(code);

    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, transformed);
    }

    return transformed;
  }
}

/**
 * Extract exports from code
 */
export function extractExports(code: string): string[] {
  const exports: string[] = [];
  
  // Named exports
  const namedMatch = code.matchAll(/export\s+(?:const|let|var|function|class|interface|type)\s+(\w+)/g);
  for (const match of namedMatch) {
    exports.push(match[1]);
  }
  
  // Default export
  const defaultMatch = code.match(/export\s+default\s+(\w+)/);
  if (defaultMatch) {
    exports.push(defaultMatch[1]);
  }
  
  // Re-exports
  const reExportMatch = code.matchAll(/export\s+\*\s+from\s+['"](.+?)['"]/g);
  for (const match of reExportMatch) {
    exports.push(`* from ${match[1]}`);
  }
  
  return exports;
}

/**
 * Extract imports from code
 */
export function extractImports(code: string): Array<{ source: string; specifiers: string[] }> {
  const imports: Array<{ source: string; specifiers: string[] }> = [];
  
  const match = code.matchAll(/import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*)?)*\s+from\s+['"]([^'"]+)['"]/g);
  for (const m of match) {
    imports.push({
      source: m[1],
      specifiers: m[0].replace(/import\s+/, '').replace(/from\s+['"].+['"]/, '').split(',').map(s => s.trim())
    });
  }
  
  return imports;
}

/**
 * Find TODO comments
 */
export function findTodos(code: string): Array<{ line: number; comment: string }> {
  const todos: Array<{ line: number; comment: string }> = [];
  
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('TODO') || line.includes('FIXME') || line.includes('XXX')) {
      todos.push({ line: index + 1, comment: line.trim() });
    }
  });
  
  return todos;
}

/**
 * Count lines of code
 */
export function countLines(code: string): { total: number; code: number; comments: number; blank: number } {
  const lines = code.split('\n');
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;
  
  let inBlockComment = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      blankLines++;
      continue;
    }
    
    if (trimmed.startsWith('/*')) {
      inBlockComment = true;
    }
    
    if (inBlockComment) {
      commentLines++;
      if (trimmed.includes('*/')) {
        inBlockComment = false;
      }
      continue;
    }
    
    if (trimmed.startsWith('//')) {
      commentLines++;
      continue;
    }
    
    codeLines++;
  }
  
  return {
    total: lines.length,
    code: codeLines,
    comments: commentLines,
    blank: blankLines
  };
}

export default CodeTransformer;

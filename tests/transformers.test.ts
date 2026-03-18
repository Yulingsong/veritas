/**
 * Transformers Tests
 */

import { describe, it, expect } from 'vitest';
import { removeComments, minify, countLines, findTodos, extractImports, extractExports } from '../src/transformers/index.js';

describe('Transformers', () => {
  describe('removeComments', () => {
    it('should remove single-line comments', () => {
      const code = `// comment
const a = 1;`;
      expect(removeComments(code)).toBe('\nconst a = 1;');
    });

    it('should remove multi-line comments', () => {
      const code = `/* comment */ const a = 1;`;
      expect(removeComments(code)).toBe(' const a = 1;');
    });
  });

  describe('minify', () => {
    it('should minify code', () => {
      const code = `const a = 1; const b = 2;`;
      const minified = minify(code);
      expect(minified).not.toContain('\n');
    });
  });

  describe('countLines', () => {
    it('should count lines', () => {
      const code = `const a = 1;\nconst b = 2;\n`;
      const result = countLines(code);
      expect(result.total).toBe(3);
    });

    it('should count code lines', () => {
      const code = `const a = 1;\n// comment\nconst b = 2;`;
      const result = countLines(code);
      expect(result.code).toBe(2);
    });
  });

  describe('findTodos', () => {
    it('should find TODO comments', () => {
      const code = `// TODO: fix this\n// FIXME: bug\nconst a = 1;`;
      const todos = findTodos(code);
      expect(todos.length).toBe(2);
    });
  });

  describe('extractImports', () => {
    it('should extract imports', () => {
      const code = `import { a } from 'a';\nimport b from 'b';`;
      const imports = extractImports(code);
      expect(imports.length).toBe(2);
    });
  });

  describe('extractExports', () => {
    it('should extract exports', () => {
      const code = `export const a = 1;\nexport function b() {}`;
      const exports = extractExports(code);
      expect(exports.length).toBe(2);
    });
  });
});

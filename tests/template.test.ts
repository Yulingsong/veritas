/**
 * Template Tests
 */

import { describe, it, expect } from 'vitest';
import { TemplateEngine, templates } from '../src/utils/template.js';

describe('Template', () => {
  describe('TemplateEngine', () => {
    it('should add and render template', () => {
      const engine = new TemplateEngine();
      engine.add('test', 'Hello {{name}}!');
      const result = engine.render('test', { name: 'World' });
      expect(result).toBe('Hello World!');
    });

    it('should handle if conditionals', () => {
      const engine = new TemplateEngine();
      engine.add('test', '{{#if show}}Hello!{{/if}}');
      
      expect(engine.render('test', { show: true })).toBe('Hello!');
      expect(engine.render('test', { show: false })).toBe('');
    });

    it('should handle each loops', () => {
      const engine = new TemplateEngine();
      engine.add('test', '{{#each items}}{{.}}{{/each}}');
      const result = engine.render('test', { items: ['a', 'b', 'c'] });
      expect(result).toBe('abc');
    });
  });

  describe('Predefined templates', () => {
    it('should have reactComponentTest template', () => {
      expect(templates.reactComponentTest).toContain('describe');
    });

    it('should have vitestSetup template', () => {
      expect(templates.vitestSetup).toContain('beforeAll');
    });

    it('should have mswHandler template', () => {
      expect(templates.mswHandler).toContain('http');
    });
  });
});

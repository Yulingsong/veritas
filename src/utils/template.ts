/**
 * Template Engine
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Simple template engine
 */
export class TemplateEngine {
  private templates: Map<string, string> = new Map();

  /**
   * Add template
   */
  add(name: string, template: string): void {
    this.templates.set(name, template);
  }

  /**
   * Load template from file
   */
  load(name: string, filePath: string): void {
    const template = fs.readFileSync(filePath, 'utf-8');
    this.templates.set(name, template);
  }

  /**
   * Render template
   */
  render(name: string, data: Record<string, any>): string {
    const template = this.templates.get(name);
    if (!template) {
      throw new Error(`Template not found: ${name}`);
    }

    return this.replace(template, data);
  }

  /**
   * Replace placeholders
   */
  private replace(template: string, data: Record<string, any>): string {
    let result = template;

    // Replace {{variable}}
    result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return data[key] !== undefined ? String(data[key]) : '';
    });

    // Replace {{#if condition}}...{{/if}}
    result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, content) => {
      return data[key] ? content : '';
    });

    // Replace {{#each array}}...{{/each}}
    result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, content) => {
      const arr = data[key];
      if (!Array.isArray(arr)) return '';
      return arr.map((item: any) => {
        let itemContent = content;
        // Replace {{.}} for array items
        itemContent = itemContent.replace(/\{\\{\\.\\}\}/g, String(item));
        // Replace {{property}} for object items
        if (typeof item === 'object') {
          for (const [k, v] of Object.entries(item)) {
            itemContent = itemContent.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
          }
        }
        return itemContent;
      }).join('');
    });

    return result;
  }
}

/**
 * Predefined templates
 */
export const templates = {
  /**
   * React component test template
   */
  reactComponentTest: `import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { {{componentName}} } from '{{importPath}}';

describe('{{componentName}}', () => {
  it('should render', () => {
    render(<{{componentName}} />);
  });
});
`,

  /**
   * Vitest setup template
   */
  vitestSetup: `import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
`,

  /**
   * MSW handler template
   */
  mswHandler: `import { http, HttpResponse } from 'msw';

export const handlers = [
  http.{{method}}('{{url}}', () => {
    return HttpResponse.json({{response}});
  })
];
`
};

export default { TemplateEngine, templates };

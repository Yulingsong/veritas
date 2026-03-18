/**
 * Server-Side Rendering Utils
 */

/**
 * Render to string (mock for testing)
 */
export async function renderToString(element: any): Promise<string> {
  // Simple mock implementation
  if (typeof element === 'string') {
    return element;
  }
  
  if (element?.type === 'element') {
    const children = element.children?.map((c: any) => renderToString(c)).join('') || '';
    return `<${element.props?.tag || 'div'}>${children}</${element.props?.tag || 'div'}>`;
  }
  
  return String(element);
}

/**
 * Render to static markup
 */
export function renderToStaticMarkup(element: any): string {
  return renderToString(element);
}

/**
 *hydrate root (mock)
 */
export function hydrateRoot(container: any, element: any): void {
  console.log('Hydrating root...');
  // Mock hydration
}

/**
 * create root (mock)
 */
export function createRoot(container: any): any {
  return {
    render(element: any) {
      container.innerHTML = renderToString(element);
    },
    unmount() {
      container.innerHTML = '';
    }
  };
}

/**
 * Static server utilities
 */
export const ssr = {
  /**
   * Extract CSS
   */
  extractCSS(html: string): string {
    const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    return match?.join('\n') || '';
  },

  /**
   * Extract scripts
   */
  extractScripts(html: string): string[] {
    const match = html.match(/<script[^>]*src="([^"]*)"[^>]*>/gi) || [];
    return match.map(m => m.match(/src="([^"]*)"/)?.[1] || '').filter(Boolean);
  },

  /**
   * Extract links
   */
  extractLinks(html: string): string[] {
    const match = html.match(/<link[^>]*href="([^"]*)"[^>]*>/gi) || [];
    return match.map(m => m.match(/href="([^"]*)"/)?.[1] || '').filter(Boolean);
  },

  /**
   * Minify HTML
   */
  minify(html: string): string {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  },

  /**
   * Pretty print HTML
   */
  pretty(html: string): string {
    let formatted = '';
    let indent = 0;
    
    html.split(/>\s*</).forEach(el => {
      if (el.match(/^<\/\w/)) {
        indent--;
      }
      formatted += '  '.repeat(Math.max(0, indent)) + '<' + el + '>\n';
      if (el.match(/^<\w[^>]*[^/]>/) && !el.match(/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
        indent++;
      }
    });
    
    return formatted;
  }
};

export default { renderToString, renderToStaticMarkup, hydrateRoot, createRoot, ssr };

/**
 * Example: Custom Plugin
 * 
 * This example shows how to create a custom plugin for Veritas.
 */

import type { VeritasPlugin, PluginContext } from '../src/plugins/index.js';
import type { TestGenerationRequest, GeneratedTest } from '../src/generator/index.js';
import type { ComponentInfo } from '../src/types.js';

/**
 * Custom Plugin: Add Custom Assertions
 * 
 * This plugin adds custom Jest/Vitest assertions for common testing scenarios.
 */
class CustomAssertionsPlugin implements VeritasPlugin {
  name = 'custom-assertions';
  version = '1.0.0';
  description = 'Add custom assertions for common scenarios';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add custom matchers
    const customMatchers = `
expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return {
      pass: emailRegex.test(received),
      message: () => \`Expected \${received} to be a valid email\`
    };
  },
  toBeValidUrl(received: string) {
    try {
      new URL(received);
      return { pass: true, message: () => '' };
    } catch {
      return { pass: false, message: () => \`Expected \${received} to be a valid URL\` };
    }
  },
  toHaveTextContent(received: HTMLElement, text: string) {
    const hasText = received.textContent?.includes(text);
    return {
      pass: hasText,
      message: () => \`Expected element to contain text: \${text}\`
    };
  }
});
`;
    content = content.replace(
      "import { render",
      customMatchers + "\nimport { render"
    );

    return { ...test, content };
  }
}

/**
 * Custom Plugin: Add Test IDs
 * 
 * This plugin ensures components have test IDs for easier testing.
 */
class TestIdsPlugin implements VeritasPlugin {
  name = 'test-ids';
  version = '1.0.0';
  description = 'Add test IDs to components';

  afterAnalyze(components: ComponentInfo[]): ComponentInfo[] {
    // Mark components that should have test IDs
    return components.map(comp => ({
      ...comp,
      props: [
        ...comp.props,
        { name: 'data-testid', type: 'string', required: false }
      ]
    }));
  }
}

/**
 * Custom Plugin: Add API Error Handling Tests
 * 
 * This plugin adds tests for API error scenarios.
 */
class ErrorHandlingPlugin implements VeritasPlugin {
  name = 'error-handling';
  version = '1.0.0';
  description = 'Add error handling tests';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add error handling test
    const errorTest = `

  it('should handle API errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Simulate error
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should display error message', () => {
    render(<TestComponent error="Something went wrong" />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
`;

    content = content.replace(
      '});',
      errorTest + '});'
    );

    return { ...test, content };
  }
}

/**
 * Custom Plugin: Add Performance Tests
 * 
 * This plugin adds performance-related tests.
 */
class PerformancePlugin implements VeritasPlugin {
  name = 'performance';
  version = '1.0.0';
  description = 'Add performance tests';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add performance test
    const perfTest = `

  it('should render quickly', () => {
    const start = performance.now();
    render(<TestComponent />);
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });
`;

    content = content.replace(
      '});',
      perfTest + '});'
    );

    return { ...test, content };
  }
}

/**
 * Custom Plugin: Add Snapshot Tests
 * 
 * This plugin adds snapshot testing.
 */
class SnapshotPlugin implements VeritasPlugin {
  name = 'snapshot';
  version = '1.0.0';
  description = 'Add snapshot tests';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add snapshot test
    const snapshotTest = `

  it('should match snapshot', () => {
    const { container } = render(<TestComponent />);
    expect(container).toMatchSnapshot();
  });
`;

    content = content.replace(
      '});',
      snapshotTest + '});'
    );

    return { ...test, content };
  }
}

/**
 * Register custom plugins
 */
function registerCustomPlugins(manager: any) {
  manager.register(new CustomAssertionsPlugin());
  manager.register(new TestIdsPlugin());
  manager.register(new ErrorHandlingPlugin());
  manager.register(new PerformancePlugin());
  manager.register(new SnapshotPlugin());
}

export {
  CustomAssertionsPlugin,
  TestIdsPlugin,
  ErrorHandlingPlugin,
  PerformancePlugin,
  SnapshotPlugin,
  registerCustomPlugins
};

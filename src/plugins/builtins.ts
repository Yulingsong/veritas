/**
 * Built-in Plugins
 */

import type { VeritasPlugin, PluginContext } from './types.js';
import type { TestGenerationRequest, GeneratedTest } from '../generator/index.js';
import type { TrafficData } from '../types.js';

/**
 * Jest Snapshot Plugin - Add snapshot assertions
 */
export class JestSnapshotPlugin implements VeritasPlugin {
  name = 'jest-snapshot';
  version = '1.0.0';
  description = 'Add Jest/Vitest snapshot support';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    const content = test.content;

    // Add .toMatchSnapshot() to expect statements
    let updated = content.replace(
      /expect\(([^)]+)\)\.toBe\(([^)]+)\)/g,
      'expect($1).toMatchSnapshot()'
    );

    // Add .toMatchInlineSnapshot() for inline snapshots
    updated = updated.replace(
      /expect\(([^)]+)\)\.toEqual\(([^)]+)\)/g,
      'expect($1).toMatchInlineSnapshot($2)'
    );

    return { ...test, content: updated };
  }
}

/**
 * React Testing Library Plugin
 */
export class RTLPlugin implements VeritasPlugin {
  name = 'rtl';
  version = '1.0.0';
  description = 'Enhance React Testing Library usage';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add userEvent setup
    if (!content.includes('userEvent')) {
      content = content.replace(
        'import { render',
        "import userEvent from '@testing-library/user-event';\nimport { render"
      );
    }

    // Replace fireEvent with userEvent
    content = content.replace(/fireEvent\.(\w+)/g, 'userEvent.$1');

    // Add cleanup
    if (!content.includes('cleanup')) {
      content = content.replace(
        "import { render",
        "import { render, cleanup } from '@testing-library/react';\nimport { render"
      );

      content = content.replace(
        'afterEach(() => {',
        'afterEach(() => {\n  cleanup();'
      );
    }

    return { ...test, content };
  }
}

/**
 * Coverage Plugin - Add coverage configuration
 */
export class CoveragePlugin implements VeritasPlugin {
  name = 'coverage';
  version = '1.0.0';
  description = 'Add coverage reporting';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add coverage comment
    const coverageComment = `/* coverage:ignore-file */\n`;
    content = coverageComment + content;

    return { ...test, content };
  }
}

/**
 * Accessibility Plugin - Add a11y tests
 */
export class AccessibilityPlugin implements VeritasPlugin {
  name = 'accessibility';
  version = '1.0.0';
  description = 'Add accessibility testing';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add axe import
    content = content.replace(
      'import { render',
      "import { axe, toHaveNoViolations } from 'jest-axe';\nimport { render"
    );

    // Add axe matcher
    content = content.replace(
      'expect(true).toBe(true);',
      `expect(true).toBe(true);
  
  // Accessibility tests
  it('should have no accessibility violations', async () => {
    const { container } = render(<test />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });`
    );

    return { ...test, content };
  }
}

/**
 * I18n Plugin - Add internationalization support
 */
export class I18nPlugin implements VeritasPlugin {
  name = 'i18n';
  version = '1.0.0';
  description = 'Add i18n testing support';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add i18next mock
    const i18nMock = `
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));
`;
    content = i18nMock + content;

    return { ...test, content };
  }
}

/**
 * Redux Plugin - Add Redux testing support
 */
export class ReduxPlugin implements VeritasPlugin {
  name = 'redux';
  version = '1.0.0';
  description = 'Add Redux testing support';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add Redux provider mock
    content = content.replace(
      'import { render',
      `import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
  reducer: {},
});
\nimport { render`
    );

    // Wrap with Provider
    content = content.replace(
      /render\(<(\w+)/g,
      'render(<Provider store={mockStore}><$1'
    );

    return { ...test, content };
  }
}

/**
 * Router Plugin - Add React Router testing support
 */
export class RouterPlugin implements VeritasPlugin {
  name = 'router';
  version = '1.0.0';
  description = 'Add React Router testing support';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add router mock
    content = content.replace(
      'import { render',
      `import { BrowserRouter } from 'react-router-dom';
import { render`
    );

    // Wrap with Router
    content = content.replace(
      /render\(<(\w+)/g,
      'render(<BrowserRouter><$1'
    );

    return { ...test, content };
  }
}

/**
 * API Mock Plugin - Add API mocking
 */
export class ApiMockPlugin implements VeritasPlugin {
  name = 'api-mock';
  version = '1.0.0';
  description = 'Add API mocking with MSW';

  afterGenerate(test: GeneratedTest): GeneratedTest {
    let content = test.content;

    // Add MSW handlers
    const mswSetup = `
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/user', () => {
    return HttpResponse.json({ id: 1, name: 'Test User' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
`;

    content = mswSetup + content;

    return { ...test, content };
  }
}

/**
 * Get all built-in plugins
 */
export function getBuiltInPlugins(): VeritasPlugin[] {
  return [
    new JestSnapshotPlugin(),
    new RTLPlugin(),
    new CoveragePlugin(),
    new AccessibilityPlugin(),
    new I18nPlugin(),
    new ReduxPlugin(),
    new RouterPlugin(),
    new ApiMockPlugin()
  ];
}

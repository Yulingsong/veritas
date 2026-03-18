/**
 * Vitest React Component Test Template
 */

export const vitestReactTemplate = `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { {{componentName}} } from '{{importPath}}';

describe('{{componentName}}', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<{{componentName}} />);
    expect(screen.getByText(/{{displayText}}/)).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    render(<{{componentName}} onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display props correctly', () => {
    render(<{{componentName}} title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(<{{componentName}} isLoading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should handle error state', () => {
    render(<{{componentName}} error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
`;

export const vitestReactMockTemplate = `import { vi } from 'vitest';

// Mock API calls
export const mockFetchSuccess = (data: any) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
};

export const mockFetchError = (error: string) => {
  global.fetch = vi.fn().mockRejectedValue(new Error(error));
};

export const mockFetchResponse = (status: number, data: any) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};

// Mock timers
export const mockTimers = () => {
  vi.useFakeTimers();
};

export const restoreTimers = () => {
  vi.useRealTimers();
};

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
`;

export const vitestVueTemplate = `import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {{componentName}} from '{{importPath}}';

describe('{{componentName}}', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount({{componentName}});
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should display props correctly', () => {
    const wrapper = mount({{componentName}}, {
      props: { title: 'Test Title' }
    });
    expect(wrapper.text()).toContain('Test Title');
  });

  it('should emit events', async () => {
    const wrapper = mount({{componentName}});
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
`;

export const jestReactTemplate = `import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {{componentName}} from '{{importPath}}';

describe('{{componentName}}', () => {
  it('should render correctly', () => {
    render(<{{componentName}} />);
    expect(screen.getByText(/{{displayText}}/)).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<{{componentName}} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('should display props correctly', () => {
    render(<{{componentName}} title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
`;

export const playwrightTemplate = `import { test, expect } from '@playwright/test';

test.describe('{{componentName}}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('{{url}}');
  });

  test('should render correctly', async ({ page }) => {
    await expect(page.locator('{{selector}}')).toBeVisible();
  });

  test('should handle user interactions', async ({ page }) => {
    await page.click('{{selector}}');
    await expect(page.locator('{{expectedSelector}}')).toBeVisible();
  });

  test('should display correct content', async ({ page }) => {
    await expect(page.locator('text={{displayText}}')).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    await expect(page.locator('[data-testid="loading"]')).toBeHidden();
  });
});
`;

export const integrationTemplate = `import { test, expect } from '@playwright/test';

test.describe('Integration: {{featureName}}', () => {
  test('complete user flow', async ({ page }) => {
    // 1. Navigate
    await page.goto('{{url}}');
    
    // 2. Perform actions
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    await page.click('#login');
    
    // 3. Verify results
    await expect(page.locator('.dashboard')).toBeVisible();
    await expect(page.locator('.user-name')).toContainText('testuser');
    
    // 4. Verify API calls
    const requests = page.request;
    const loginRequest = await requests?.waitForRequest('**/api/login');
    expect(loginRequest?.postDataJSON()).toMatchObject({
      username: 'testuser'
    });
  });

  test('error handling', async ({ page }) => {
    await page.goto('{{url}}');
    await page.fill('#username', 'invalid');
    await page.fill('#password', 'wrong');
    await page.click('#login');
    
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
`;

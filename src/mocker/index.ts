/**
 * Mock Generator - Generate mocks from traffic data
 */

import type { TrafficData, NetworkRequest, NetworkResponse } from '../types.js';

export * from './types.js';

/**
 * Generate MSW (Mock Service Worker) handlers
 */
export function generateMSWHandlers(trafficData: TrafficData): string {
  const requests = trafficData.requests;
  const responses = trafficData.responses;
  
  const handlerMap = new Map<string, NetworkResponse>();
  
  for (const res of responses) {
    handlerMap.set(res.url, res);
  }
  
  let code = `import { http, HttpResponse } from 'msw';\nimport { setupWorker } from 'msw/browser';\n\n`;
  
  code += `export const handlers = [\n`;
  
  for (const req of requests) {
    const res = handlerMap.get(req.url);
    if (!res || res.status >= 400) continue;
    
    const method = req.method.toLowerCase();
    const path = extractPath(req.url);
    
    code += `  http.${method}('${path}', () => {\n`;
    code += `    return HttpResponse.json(\n`;
    
    // Try to get response body
    const body = res.body || getDefaultBody(path);
    try {
      const parsed = JSON.parse(body);
      code += `      ${JSON.stringify(parsed, null, 8).replace(/\n/g, '\n      ')}\n`;
    } catch {
      code += `      ${body}\n`;
    }
    
    code += `    );\n`;
    code += `  }),\n\n`;
  }
  
  code += `];\n\n`;
  code += `export const worker = setupWorker(...handlers);\n`;
  
  return code;
}

/**
 * Generate Vitest mock file
 */
export function generateVitestMocks(trafficData: TrafficData): string {
  const requests = trafficData.requests;
  const responses = trafficData.responses;
  
  const handlerMap = new Map<string, NetworkResponse>();
  for (const res of responses) {
    handlerMap.set(res.url, res);
  }
  
  let code = `import { vi } from 'vitest';\n\n`;
  
  for (const req of requests) {
    const res = handlerMap.get(req.url);
    if (!res || res.status >= 400) continue;
    
    const mockName = getMockName(req.url);
    const body = res.body || getDefaultBody(req.url);
    
    code += `export const ${mockName} = `;
    
    try {
      code += JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      code += body;
    }
    code += `;\n\n`;
  }
  
  // Generate fetch mock
  code += `export const mockFetch = () => {\n`;
  code += `  global.fetch = vi.fn();\n`;
  code += `  \n`;
  code += `  global.fetch.mockImplementation((url) => {\n`;
  code += `    const urlStr = url.toString();\n`;
  code += `    \n`;
  
  for (const req of requests) {
    const mockName = getMockName(req.url);
    code += `    if (urlStr.includes('${extractPath(req.url)}')) {\n`;
    code += `      return Promise.resolve({\n`;
    code += `        ok: true,\n`;
    code += `        status: ${handlerMap.get(req.url)?.status || 200},\n`;
    code += `        json: () => Promise.resolve(${mockName}),\n`;
    code += `      });\n`;
    code += `    }\n`;
  }
  
  code += `    return Promise.reject(new Error('Unknown URL'));\n`;
  code += `  });\n`;
  code += `};\n`;
  
  return code;
}

/**
 * Generate JSON Server config
 */
export function generateJsonServerConfig(trafficData: TrafficData): any {
  const db: Record<string, any[]> = {};
  
  for (const res of trafficData.responses) {
    if (res.status >= 200 && res.status < 300 && res.body) {
      try {
        const body = JSON.parse(res.body);
        const collection = getCollectionName(res.url);
        
        if (!db[collection]) {
          db[collection] = [];
        }
        
        // Add ID if not present
        if (!body.id) {
          body.id = db[collection].length + 1;
        }
        
        db[collection].push(body);
      } catch {}
    }
  }
  
  return db;
}

/**
 * Extract path from URL
 */
function extractPath(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return url;
  }
}

/**
 * Get mock name from URL
 */
function getMockName(url: string): string {
  const path = extractPath(url);
  const parts = path.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || 'data';
  
  return `mock${capitalize(last.replace(/[^a-zA-Z]/g, ''))}`;
}

/**
 * Get collection name from URL
 */
function getCollectionName(url: string): string {
  const path = extractPath(url);
  const parts = path.split('/').filter(Boolean);
  
  if (parts.length > 0) {
    // Handle /api/users -> users
    // Handle /users/1 -> users
    const last = parts[parts.length - 1];
    if (last.match(/^\d+$/)) {
      return parts[parts.length - 2] || 'data';
    }
    return last;
  }
  
  return 'data';
}

/**
 * Capitalize string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get default body based on URL
 */
function getDefaultBody(url: string): string {
  const path = extractPath(url);
  
  if (path.includes('user')) {
    return '{"id": 1, "name": "Test User"}';
  }
  if (path.includes('list') || path.includes('all')) {
    return '[]';
  }
  if (path.includes('detail') || path.includes('id')) {
    return '{"id": 1}';
  }
  
  return '{}';
}

/**
 * Mock Generator class for more control
 */
export class MockGenerator {
  private trafficData: TrafficData;
  
  constructor(trafficData: TrafficData) {
    this.trafficData = trafficData;
  }
  
  /**
   * Generate MSW handlers
   */
  toMSW(): string {
    return generateMSWHandlers(this.trafficData);
  }
  
  /**
   * Generate Vitest mocks
   */
  toVitest(): string {
    return generateVitestMocks(this.trafficData);
  }
  
  /**
   * Generate JSON Server db.json
   */
  toJsonServer(): any {
    return generateJsonServerConfig(this.trafficData);
  }
  
  /**
   * Generate fetch mock
   */
  toFetchMock(): string {
    return generateFetchMock(this.trafficData);
  }
}

function generateFetchMock(trafficData: TrafficData): string {
  let code = `// Mock fetch for testing\n`;
  code += `export const setupFetchMock = () => {\n`;
  code += `  beforeEach(() => {\n`;
  code += `    fetchMock.reset();\n`;
  code += `  });\n\n`;
  
  for (const res of trafficData.responses) {
    if (res.status >= 200 && res.status < 300) {
      const path = extractPath(res.url);
      const body = res.body || '{}';
      
      code += `  fetchMock.mock('${path}', ${body}, { method: '${res.url.includes('POST') ? 'POST' : 'GET'}' });\n`;
    }
  }
  
  code += `};\n`;
  
  return code;
}

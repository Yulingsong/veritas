/**
 * Mocker Types
 */

export interface MockConfig {
  type: 'msw' | 'vitest' | 'fetch' | 'json-server';
  outputPath: string;
  includeHeaders?: boolean;
  includeCookies?: boolean;
}

export interface MockHandler {
  method: string;
  path: string;
  response: any;
  status: number;
  delay?: number;
}

export interface MockData {
  handlers: MockHandler[];
  delays: Record<string, number>;
}

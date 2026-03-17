// Type declarations
/// <reference types="node" />

export type Framework = 'react' | 'vue' | 'next' | 'nuxt' | 'svelte';
export type TestFramework = 'vitest' | 'jest' | 'playwright';
export type TestType = 'unit' | 'component' | 'integration' | 'e2e';

// Code analysis types
export interface ComponentInfo {
  name: string;
  type: 'function' | 'class' | 'arrow';
  file: string;
  props: PropInfo[];
  state: StateInfo[];
  effects: EffectInfo[];
  apis: ApiCallInfo[];
}

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
}

export interface StateInfo {
  name: string;
  type: string;
  initializer?: string;
}

export interface EffectInfo {
  type: 'useEffect' | 'useMemo' | 'useCallback' | 'computed' | 'watch';
  dependencies: string[];
  body: string;
}

export interface ApiCallInfo {
  url: string;
  method: string;
  caller: string;
  line: number;
}

// Traffic recording types
export interface NetworkRequest {
  id: string;
  url: string;
  urlShort: string;
  method: string;
  headers: Record<string, string>;
  postData?: string;
  timestamp: number;
  initiator?: string;
}

export interface NetworkResponse {
  requestId: string;
  url: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body?: string;
  timing: number;
}

export interface TrafficData {
  requests: NetworkRequest[];
  responses: NetworkResponse[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  cookies: Record<string, string>;
  stats: TrafficStats;
}

export interface TrafficStats {
  totalRequests: number;
  byMethod: Record<string, number>;
  byStatus: Record<string, number>;
  slowRequests: number;
}

// Test generation types
export interface TestGenerationRequest {
  code: string;
  file: string;
  framework: Framework;
  testFramework: TestFramework;
  testType: TestType;
  trafficData?: TrafficData;
}

export interface GeneratedTest {
  file: string;
  content: string;
  type: TestType;
  dependencies: string[];
}

// CLI options
export interface CLIOptions {
  projectPath: string;
  framework?: Framework;
  testFramework?: TestFramework;
  testType?: TestType;
  output?: string;
  openaiKey?: string;
  anthropicKey?: string;
  geminiKey?: string;
  port?: number;
  headless?: boolean;
  watch?: boolean;
}

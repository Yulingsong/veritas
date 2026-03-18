/**
 * Veritas Type Definitions
 */

// Re-export types
export * from './types';

// Framework types
export type Framework = 'react' | 'vue' | 'next' | 'nuxt' | 'svelte';
export type TestFramework = 'vitest' | 'jest' | 'playwright';
export type TestType = 'unit' | 'component' | 'integration' | 'e2e';
export type ProviderType = 'openai' | 'anthropic' | 'gemini';

// Config types
export interface VeritasConfig {
  ai: AIConfig;
  analyzer: AnalyzerConfig;
  generator: GeneratorConfig;
  recorder: RecorderConfig;
  executor: ExecutorConfig;
  logging: LoggingConfig;
}

export interface AIConfig {
  provider: ProviderType;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AnalyzerConfig {
  framework: Framework;
  parseTypes: boolean;
  extractProps: boolean;
  extractState: boolean;
  extractEffects: boolean;
  extractApiCalls: boolean;
}

export interface GeneratorConfig {
  testFramework: TestFramework;
  testType: TestType;
  outputDir: string;
  testPattern: string;
  includeMocks: boolean;
  includeSetup: boolean;
}

export interface RecorderConfig {
  headless: boolean;
  duration: number;
  outputFile: string;
  captureLocalStorage: boolean;
  captureSessionStorage: boolean;
  captureCookies: boolean;
  captureConsole: boolean;
}

export interface ExecutorConfig {
  framework: TestFramework;
  update: boolean;
  coverage: boolean;
  reporter: string;
  timeout: number;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  file?: string;
  timestamp: boolean;
}

// Component types
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

// Traffic types
export interface TrafficData {
  requests: NetworkRequest[];
  responses: NetworkResponse[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  cookies: Record<string, string>;
  stats: TrafficStats;
}

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

export interface TrafficStats {
  totalRequests: number;
  byMethod: Record<string, number>;
  byStatus: Record<string, number>;
  slowRequests: number;
}

// Test types
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

export interface TestResult {
  success: boolean;
  exitCode: number;
  output: string;
  errorOutput: string;
  duration: number;
  tests: TestCaseResult[];
}

export interface TestCaseResult {
  name: string;
  passed: boolean;
  failed: boolean;
  duration?: number;
  error?: string;
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

// Plugin types
export interface VeritasPlugin {
  name: string;
  version: string;
  description?: string;
  init?(context: PluginContext): Promise<void> | void;
  onAnalyze?(code: string, filePath: string): Promise<{ code: string; filePath: string }>;
  afterAnalyze?(components: ComponentInfo[]): Promise<ComponentInfo[]>;
  onGenerate?(request: TestGenerationRequest): Promise<TestGenerationRequest>;
  afterGenerate?(test: GeneratedTest): Promise<GeneratedTest>;
  onRecord?(url: string): Promise<string>;
  afterRecord?(data: TrafficData): Promise<TrafficData>;
  destroy?(): Promise<void> | void;
}

export interface PluginContext {
  config: VeritasConfig;
  logger: any;
  cache: any;
  registerCommand(name: string, handler: Function): void;
  registerHook(hook: string, handler: Function): void;
  use(middleware: Function): void;
}

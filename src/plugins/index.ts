/**
 * Plugin System - Extensible functionality
 */

import type { ComponentInfo, TrafficData } from '../types.js';
import type { TestGenerationRequest, GeneratedTest } from '../generator/index.js';

/**
 * Plugin interface
 */
export interface VeritasPlugin {
  name: string;
  version: string;
  description?: string;
  
  /**
   * Initialize plugin
   */
  init?(context: PluginContext): Promise<void> | void;
  
  /**
   * Called before code analysis
   */
  onAnalyze?(code: string, filePath: string): Promise<{ code: string; filePath: string }> | { code: string; filePath: string };
  
  /**
   * Called after code analysis
   */
  afterAnalyze?(components: ComponentInfo[]): Promise<ComponentInfo[]> | ComponentInfo[];
  
  /**
   * Called before test generation
   */
  onGenerate?(request: TestGenerationRequest): Promise<TestGenerationRequest> | TestGenerationRequest;
  
  /**
   * Called after test generation
   */
  afterGenerate?(test: GeneratedTest): Promise<GeneratedTest> | GeneratedTest;
  
  /**
   * Called before traffic recording
   */
  onRecord?(url: string): Promise<string> | string;
  
  /**
   * Called after traffic recording
   */
  afterRecord?(data: TrafficData): Promise<TrafficData> | TrafficData;
  
  /**
   * Called on cleanup
   */
  destroy?(): Promise<void> | void;
}

/**
 * Plugin context
 */
export interface PluginContext {
  config: any;
  logger: any;
  cache: any;
  
  /**
   * Register new command
   */
  registerCommand(name: string, handler: Function): void;
  
  /**
   * Register hook
   */
  registerHook(hook: string, handler: Function): void;
  
  /**
   * Add middleware
   */
  use(middleware: PluginMiddleware): void;
}

export type PluginMiddleware = (req: any, res: any, next: Function) => void;

/**
 * Plugin Manager
 */
export class PluginManager {
  private plugins: Map<string, VeritasPlugin>;
  private hooks: Map<string, Function[]>;

  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }

  /**
   * Register a plugin
   */
  register(plugin: VeritasPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already registered`);
    }

    this.plugins.set(plugin.name, plugin);
    console.log(`[Plugin] Registered: ${plugin.name} v${plugin.version}`);
  }

  /**
   * Unregister a plugin
   */
  unregister(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin?.destroy) {
      plugin.destroy();
    }
    this.plugins.delete(name);
  }

  /**
   * Get plugin
   */
  get(name: string): VeritasPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * List all plugins
   */
  list(): VeritasPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Register a hook
   */
  registerHook(hook: string, handler: Function): void {
    if (!this.hooks.has(hook)) {
      this.hooks.set(hook, []);
    }
    this.hooks.get(hook)!.push(handler);
  }

  /**
   * Execute hook
   */
  async executeHook<T>(hook: string, data: T): Promise<T> {
    const handlers = this.hooks.get(hook) || [];
    let result = data;

    for (const handler of handlers) {
      result = await handler(result) || result;
    }

    return result;
  }

  /**
   * Execute plugin lifecycle
   */
  async initialize(context: PluginContext): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.init) {
        await plugin.init(context);
      }
    }
  }

  /**
   * Run onAnalyze hooks
   */
  async onAnalyze(code: string, filePath: string): Promise<{ code: string; filePath: string }> {
    let result = { code, filePath };

    for (const plugin of this.plugins.values()) {
      if (plugin.onAnalyze) {
        result = await plugin.onAnalyze(result.code, result.filePath);
      }
    }

    return result;
  }

  /**
   * Run afterAnalyze hooks
   */
  async afterAnalyze(components: ComponentInfo[]): Promise<ComponentInfo[]> {
    let result = components;

    for (const plugin of this.plugins.values()) {
      if (plugin.afterAnalyze) {
        result = await plugin.afterAnalyze(result);
      }
    }

    return result;
  }

  /**
   * Run onGenerate hooks
   */
  async onGenerate(request: TestGenerationRequest): Promise<TestGenerationRequest> {
    let result = request;

    for (const plugin of this.plugins.values()) {
      if (plugin.onGenerate) {
        result = await plugin.onGenerate(result);
      }
    }

    return result;
  }

  /**
   * Run afterGenerate hooks
   */
  async afterGenerate(test: GeneratedTest): Promise<GeneratedTest> {
    let result = test;

    for (const plugin of this.plugins.values()) {
      if (plugin.afterGenerate) {
        result = await plugin.afterGenerate(result);
      }
    }

    return result;
  }

  /**
   * Run onRecord hooks
   */
  async onRecord(url: string): Promise<string> {
    let result = url;

    for (const plugin of this.plugins.values()) {
      if (plugin.onRecord) {
        result = await plugin.onRecord(result);
      }
    }

    return result;
  }

  /**
   * Run afterRecord hooks
   */
  async afterRecord(data: TrafficData): Promise<TrafficData> {
    let result = data;

    for (const plugin of this.plugins.values()) {
      if (plugin.afterRecord) {
        result = await plugin.afterRecord(result);
      }
    }

    return result;
  }

  /**
   * Cleanup all plugins
   */
  async destroy(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.destroy) {
        await plugin.destroy();
      }
    }
    this.plugins.clear();
    this.hooks.clear();
  }
}

/**
 * Default plugin manager instance
 */
export const pluginManager = new PluginManager();

/**
 * Example plugin: Jest Snapshot
 */
export class JestSnapshotPlugin implements VeritasPlugin {
  name = 'jest-snapshot';
  version = '1.0.0';
  description = 'Add Jest snapshot support for generated tests';

  async afterGenerate(test: GeneratedTest): Promise<GeneratedTest> {
    // Add .toMatchSnapshot() for assertions
    if (test.content.includes('expect(')) {
      test.content = test.content.replace(
        /expect\(([^)]+)\)\.toBe\([^)]+\)/g,
        'expect($1).toMatchSnapshot()'
      );
    }
    return test;
  }
}

/**
 * Example plugin: Coverage
 */
export class CoveragePlugin implements VeritasPlugin {
  name = 'coverage';
  version = '1.0.0';
  description = 'Add coverage reporting to generated tests';

  onGenerate(request: TestGenerationRequest): TestGenerationRequest {
    // Ensure coverage is enabled
    return request;
  }
}

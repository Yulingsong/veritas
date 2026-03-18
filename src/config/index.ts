/**
 * Veritas Configuration
 */

import * as fs from 'fs';
import * as path from 'path';
import { deepMerge } from '../utils/index.js';

export interface VeritasConfig {
  // AI Settings
  ai: {
    provider: 'openai' | 'anthropic' | 'gemini';
    apiKey?: string;
    model?: string;
    baseUrl?: string;
    temperature?: number;
    maxTokens?: number;
  };
  
  // Code Analysis
  analyzer: {
    framework: 'react' | 'vue' | 'next' | 'svelte';
    parseTypes: boolean;
    extractProps: boolean;
    extractState: boolean;
    extractEffects: boolean;
    extractApiCalls: boolean;
  };
  
  // Test Generation
  generator: {
    testFramework: 'vitest' | 'jest' | 'playwright';
    testType: 'unit' | 'component' | 'integration' | 'e2e';
    outputDir: string;
    testPattern: string;
    includeMocks: boolean;
    includeSetup: boolean;
  };
  
  // Traffic Recording
  recorder: {
    headless: boolean;
    duration: number;
    outputFile: string;
    captureLocalStorage: boolean;
    captureSessionStorage: boolean;
    captureCookies: boolean;
    captureConsole: boolean;
  };
  
  // Test Execution
  executor: {
    framework: 'vitest' | 'jest' | 'playwright';
    update: boolean;
    coverage: boolean;
    reporter: string;
    timeout: number;
  };
  
  // Logging
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file?: string;
    timestamp: boolean;
  };
}

export const defaultConfig: VeritasConfig = {
  ai: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4000
  },
  analyzer: {
    framework: 'react',
    parseTypes: true,
    extractProps: true,
    extractState: true,
    extractEffects: true,
    extractApiCalls: true
  },
  generator: {
    testFramework: 'vitest',
    testType: 'component',
    outputDir: './tests',
    testPattern: '.test',
    includeMocks: true,
    includeSetup: true
  },
  recorder: {
    headless: true,
    duration: 5000,
    outputFile: 'traffic.json',
    captureLocalStorage: true,
    captureSessionStorage: true,
    captureCookies: true,
    captureConsole: false
  },
  executor: {
    framework: 'vitest',
    update: false,
    coverage: false,
    reporter: 'verbose',
    timeout: 30000
  },
  logging: {
    level: 'info',
    timestamp: true
  }
};

/**
 * Load configuration from file
 */
export function loadConfig(configPath?: string): VeritasConfig {
  const defaultPath = path.join(process.cwd(), 'veritas.config.json');
  const filePath = configPath || defaultPath;
  
  if (!fs.existsSync(filePath)) {
    return defaultConfig;
  }
  
  try {
    const userConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return deepMerge(defaultConfig, userConfig);
  } catch (e) {
    console.warn(`Failed to load config from ${filePath}, using defaults`);
    return defaultConfig;
  }
}

/**
 * Save configuration to file
 */
export function saveConfig(config: VeritasConfig, configPath?: string): void {
  const defaultPath = path.join(process.cwd(), 'veritas.config.json');
  const filePath = configPath || defaultPath;
  
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}

/**
 * Get config value by path
 */
export function getConfigValue<T>(config: VeritasConfig, path: string): T {
  const keys = path.split('.');
  let value: any = config;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value as T;
}

/**
 * Validate configuration
 */
export function validateConfig(config: VeritasConfig): string[] {
  const errors: string[] = [];
  
  if (!config.ai.provider) {
    errors.push('AI provider is required');
  }
  
  if (!config.ai.apiKey && !process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY) {
    errors.push('API key is required (config.ai.apiKey or environment variable)');
  }
  
  if (config.recorder.duration < 1000) {
    errors.push('Recorder duration must be at least 1000ms');
  }
  
  if (config.executor.timeout < 5000) {
    errors.push('Executor timeout must be at least 5000ms');
  }
  
  return errors;
}

/**
 * Config Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadConfig, defaultConfig, validateConfig, getConfigValue } from '../src/config/index.js';
import * as fs from 'fs';
import * as path from 'path';

describe('Config', () => {
  const testConfigPath = '/tmp/veritas-test-config.json';

  beforeEach(() => {
    // Clean up test config
    if (fs.existsSync(testConfigPath)) {
      fs.unlinkSync(testConfigPath);
    }
  });

  describe('loadConfig', () => {
    it('should return default config when no config file', () => {
      const config = loadConfig('/non/existent/path.json');
      expect(config.ai.provider).toBe('openai');
    });
  });

  describe('validateConfig', () => {
    it('should pass valid config', () => {
      const errors = validateConfig(defaultConfig);
      expect(errors.length).toBe(0);
    });

    it('should fail without AI provider', () => {
      const config = { ...defaultConfig, ai: { ...defaultConfig.ai, provider: '' } };
      const errors = validateConfig(config);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should warn on short timeout', () => {
      const config = {
        ...defaultConfig,
        recorder: { ...defaultConfig.recorder, duration: 100 }
      };
      const errors = validateConfig(config);
      expect(errors.some(e => e.includes('duration'))).toBe(true);
    });
  });

  describe('getConfigValue', () => {
    it('should get nested config value', () => {
      const value = getConfigValue<string>(defaultConfig, 'ai.provider');
      expect(value).toBe('openai');
    });

    it('should return undefined for missing path', () => {
      const value = getConfigValue<string>(defaultConfig, 'ai.missing');
      expect(value).toBeUndefined();
    });
  });
});

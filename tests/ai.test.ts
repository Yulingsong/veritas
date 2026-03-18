/**
 * AI Provider Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIProvider, AnthropicProvider, GeminiProvider, createAIProvider } from '../src/ai/index.js';

describe('AI Providers', () => {
  describe('OpenAIProvider', () => {
    it('should create provider with api key', () => {
      const provider = new OpenAIProvider('test-key', 'gpt-4o-mini');
      expect(provider).toBeDefined();
    });

    it('should have generate method', () => {
      const provider = new OpenAIProvider('test-key');
      expect(typeof provider.generate).toBe('function');
    });
  });

  describe('AnthropicProvider', () => {
    it('should create provider with api key', () => {
      const provider = new AnthropicProvider('test-key', 'claude-3-5-sonnet-20241022');
      expect(provider).toBeDefined();
    });
  });

  describe('GeminiProvider', () => {
    it('should create provider with api key', () => {
      const provider = new GeminiProvider('test-key', 'gemini-2.0-flash');
      expect(provider).toBeDefined();
    });
  });

  describe('createAIProvider', () => {
    it('should create OpenAI provider', () => {
      const provider = createAIProvider('openai', 'test-key');
      expect(provider).toBeInstanceOf(OpenAIProvider);
    });

    it('should create Anthropic provider', () => {
      const provider = createAIProvider('anthropic', 'test-key');
      expect(provider).toBeInstanceOf(AnthropicProvider);
    });

    it('should create Gemini provider', () => {
      const provider = createAIProvider('gemini', 'test-key');
      expect(provider).toBeInstanceOf(GeminiProvider);
    });

    it('should throw for unknown provider', () => {
      expect(() => createAIProvider('unknown' as any, 'test-key')).toThrow();
    });
  });
});

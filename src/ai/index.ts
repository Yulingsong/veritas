/**
 * AI Providers - Unified AI API interface
 */

import OpenAI from 'openai';
import type { AIProvider, AIResponse, GenerateOptions } from './types.js';

export * from './types.js';

/**
 * OpenAI Provider
 */
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<AIResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: options?.model || this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4000,
        ...options
      });

      return {
        content: response.choices[0]?.message?.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error}`);
    }
  }
}

/**
 * Anthropic Provider (Claude)
 */
export class AnthropicProvider implements AIProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = 'https://api.anthropic.com/v1';
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: options?.model || this.model,
          max_tokens: options?.maxTokens ?? 4096,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${error}`);
      }

      const data = await response.json();
      return {
        content: data.content?.[0]?.text || '',
        usage: data.usage ? {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens
        } : undefined
      };
    } catch (error) {
      throw new Error(`Anthropic API error: ${error}`);
    }
  }
}

/**
 * Gemini Provider (Google)
 */
export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gemini-2.0-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<AIResponse> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${options?.model || this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: options?.temperature ?? 0.7,
              maxOutputTokens: options?.maxTokens ?? 4096
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${error}`);
      }

      const data = await response.json();
      return {
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      };
    } catch (error) {
      throw new Error(`Gemini API error: ${error}`);
    }
  }
}

/**
 * Factory function to create AI provider
 */
export function createAIProvider(
  provider: 'openai' | 'anthropic' | 'gemini',
  apiKey: string,
  model?: string
): AIProvider {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider(apiKey, model);
    case 'anthropic':
      return new AnthropicProvider(apiKey, model);
    case 'gemini':
      return new GeminiProvider(apiKey, model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

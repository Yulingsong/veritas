/**
 * AI Provider Types
 */

export type ProviderType = 'openai' | 'anthropic' | 'gemini';

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string[];
}

export interface AIProvider {
  generate(prompt: string, options?: GenerateOptions): Promise<AIResponse>;
}

export interface AIConfig {
  provider: ProviderType;
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

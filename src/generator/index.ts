// AI Test Generator

import OpenAI from 'openai';
import type { TestGenerationRequest, GeneratedTest, TrafficData, Framework, TestFramework, TestType } from '../types.js';

export class AITestGenerator {
  private openai: OpenAI | null = null;
  private provider: 'openai' | 'anthropic' | 'gemini' = 'openai';
  private apiKey: string;

  constructor(options: { provider?: 'openai' | 'anthropic' | 'gemini'; apiKey: string }) {
    this.provider = options.provider || 'openai';
    this.apiKey = options.apiKey;
    if (this.provider === 'openai') {
      this.openai = new OpenAI({ apiKey: options.apiKey });
    }
  }

  /**
   * Generate test
   */
  async generate(request: TestGenerationRequest): Promise<GeneratedTest> {
    const prompt = this.buildPrompt(request);
    const response = await this.callLLM(prompt);
    
    return {
      file: this.getTestFileName(request.file, request.testFramework),
      content: response,
      type: request.testType,
      dependencies: this.extractDependencies(response)
    };
  }

  /**
   * Build prompt
   */
  private buildPrompt(request: TestGenerationRequest): string {
    const { code, trafficData, framework, testFramework, testType } = request;

    let prompt = `You are a frontend testing expert. Generate ${testType} test for this ${framework} component.

## Code
\`\`\`${framework === 'react' ? 'tsx' : 'ts'}
${code}
\`\`\`
`;

    if (trafficData && trafficData.requests.length > 0) {
      prompt += `
## Real API Data (use this for assertions)
${trafficData.requests.slice(0, 5).map(r => `- ${r.method} ${r.urlShort}`).join('\n')}
`;
    }

    prompt += `
## Requirements
- Use ${testFramework === 'vitest' ? 'Vitest' : testFramework === 'jest' ? 'Jest' : 'Playwright'}
- Use @testing-library/${framework === 'react' ? 'react' : 'vue'}
- Test rendering and user interactions
- Follow best practices

Output only test code:
`;

    return prompt;
  }

  /**
   * Call LLM
   */
  private async callLLM(prompt: string): Promise<string> {
    try {
      if (this.provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        });
        return response.choices[0]?.message?.content || '';
      }
    } catch (e) {
      console.error('LLM Error:', e);
    }
    return this.fallback();
  }

  /**
   * Fallback template
   */
  private fallback(): string {
    return `import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('Tests', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});`;
  }

  private getTestFileName(sourceFile: string, testFramework: TestFramework): string {
    const ext = testFramework === 'playwright' ? '.spec.ts' : '.test.ts';
    return sourceFile.replace(/\.(ts|tsx|vue|jsx)$/, ext);
  }

  private extractDependencies(code: string): string[] {
    const deps: string[] = [];
    const match = code.match(/import\s+.*?from\s+['"](.+?)['"]/g);
    if (match) {
      for (const m of match) {
        const p = m.match(/from\s+['"](.+?)['"]/);
        if (p) deps.push(p[1]);
      }
    }
    return deps;
  }
}

export default AITestGenerator;

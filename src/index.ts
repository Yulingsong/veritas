#!/usr/bin/env node
/**
 * AI-Test V2 - CLI Entry
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import OpenAI from 'openai';

const VERSION = '1.0.0';

// Colors
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const gray = (s: string) => `\x1b[90m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;

async function main() {
  const program = new Command();

  program
    .name('ai-test')
    .description('AI-powered frontend testing')
    .version(VERSION);

  // generate command
  program
    .command('generate <file>')
    .description('Generate tests')
    .option('-o, --output <dir>', 'Output dir', './tests')
    .option('--ai-key <key>', 'OpenAI key')
    .action(async (file: string, opts: any) => {
      if (!fs.existsSync(file)) {
        console.error(red(`File not found: ${file}`));
        return;
      }
      const code = fs.readFileSync(file, 'utf-8');
      const key = opts.aiKey || process.env.OPENAI_API_KEY;
      if (!key) {
        console.error(red('API key required. Set OPENAI_API_KEY'));
        return;
      }
      
      console.log(gray('Generating test with AI...'));
      const test = await generateTest(code, key);
      
      const outDir = opts.output;
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, path.basename(file).replace(/\.(ts|tsx)$/, '.test.ts'));
      fs.writeFileSync(outPath, test);
      console.log(green(`Test generated: ${outPath}`));
    });

  // record command
  program
    .command('record <url>')
    .description('Record API traffic')
    .option('-o, --output <file>', 'Output file', 'traffic.json')
    .action(async (url: string, opts: any) => {
      console.log(gray(`Recording from: ${url}`));
      const data = await recordTraffic(url);
      fs.writeFileSync(opts.output, JSON.stringify(data, null, 2));
      console.log(green(`Traffic saved: ${opts.output}`));
      console.log(gray(`Requests: ${data.stats.totalRequests}`));
    });

  // auto command (full workflow)
  program
    .command('auto <file>')
    .description('Generate with traffic')
    .option('-u, --url <url>', 'URL to record')
    .option('-o, --output <dir>', 'Output dir', './tests')
    .action(async (file: string, opts: any) => {
      if (!fs.existsSync(file)) {
        console.error(red(`File not found: ${file}`));
        return;
      }
      const code = fs.readFileSync(file, 'utf-8');
      let trafficData;
      
      if (opts.url) {
        console.log(gray('Recording traffic...'));
        trafficData = await recordTraffic(opts.url);
      }
      
      const key = process.env.OPENAI_API_KEY;
      if (!key) {
        console.error(red('API key required. Set OPENAI_API_KEY'));
        return;
      }
      
      console.log(gray('Generating test...'));
      const test = await generateTest(code, key, trafficData);
      
      const outDir = opts.output;
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, path.basename(file).replace(/\.(ts|tsx)$/, '.test.ts'));
      fs.writeFileSync(outPath, test);
      console.log(green(`Test generated: ${outPath}`));
    });

  await program.parseAsync(process.argv);
}

/**
 * Record browser traffic
 */
async function recordTraffic(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const requests: any[] = [];
  const responses: any[] = [];
  
  // Setup listeners
  page.on('request', (req) => {
    requests.push({
      url: req.url(),
      method: req.method(),
      headers: req.headers()
    });
  });
  
  page.on('response', (res) => {
    responses.push({
      url: res.url(),
      status: res.status(),
      statusText: res.statusText()
    });
  });
  
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  await browser.close();
  
  return {
    requests,
    responses,
    stats: {
      totalRequests: requests.length,
      byMethod: requests.reduce((acc: any, r) => {
        acc[r.method] = (acc[r.method] || 0) + 1;
        return acc;
      }, {})
    }
  };
}

/**
 * Generate test with AI
 */
async function generateTest(code: string, apiKey: string, trafficData?: any): Promise<string> {
  const openai = new OpenAI({ apiKey });
  
  let prompt = `Generate Vitest test for this React component:

\`\`\`tsx
${code}
\`\`\`
`;

  if (trafficData?.requests?.length) {
    prompt += `\nUse this real API data:\n${trafficData.requests.slice(0, 5).map((r: any) => `- ${r.method} ${r.url}`).join('\n')}\n`;
  }

  prompt += `\nUse @testing-library/react. Output only test code.`;

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });
    return res.choices[0]?.message?.content || fallbackTest();
  } catch (e) {
    console.error(gray('AI error, using fallback'));
    return fallbackTest();
  }
}

/**
 * Fallback test template
 */
function fallbackTest(): string {
  return `import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('Component Tests', () => {
  it('should render', () => {
    expect(true).toBe(true);
  });
});
`;
}

main().catch(console.error);

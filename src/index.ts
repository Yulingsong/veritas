#!/usr/bin/env node
/**
 * Veritas - AI-Powered Frontend Testing
 * 
 * @author Yulingsong
 * @license MIT
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import pc from 'picocolors';
import { CodeAnalyzer } from './analyzer/index.js';
import { TrafficRecorder } from './recorder/index.js';
import { AITestGenerator } from './generator/index.js';
import { createAIProvider } from './ai/index.js';
import { MockGenerator } from './mocker/index.js';
import { loadConfig } from './config/index.js';
import { createLogger } from './logger/index.js';

const VERSION = '1.0.0';

// Re-export for library usage
export { CodeAnalyzer } from './analyzer/index.js';
export { TrafficRecorder } from './recorder/index.js';
export { AITestGenerator } from './generator/index.js';
export { createAIProvider } from './ai/index.js';
export { MockGenerator } from './mocker/index.js';
export { loadConfig, defaultConfig } from './config/index.js';
export type { VeritasConfig } from './config/index.js';
export { createLogger } from './logger/index.js';
export type { LogLevel, Logger } from './logger/index.js';

// CLI Entry Point
const log = createLogger({ level: 'info', timestamp: true });

async function cli() {
  const config = loadConfig();
  const program = new Command();

  program
    .name('veritas')
    .description('AI-powered frontend testing with real browser and API data')
    .version(VERSION);

  // generate
  program
    .command('generate <file>')
    .description('Generate tests from source file')
    .option('-f, --framework <f>', 'Framework', config.analyzer.framework)
    .option('-t, --test-framework <f>', 'Test framework', config.generator.testFramework)
    .option('-y, --test-type <t>', 'Test type', config.generator.testType)
    .option('-o, --output <dir>', 'Output dir', config.generator.outputDir)
    .option('--ai-key <key>', 'AI key')
    .option('--provider <p>', 'AI provider', config.ai.provider)
    .option('--traffic <file>', 'Traffic data file')
    .action(async (file: string, opts: any) => {
      if (!fs.existsSync(file)) {
        console.error(pc.red(`File not found: ${file}`));
        return;
      }
      
      const code = fs.readFileSync(file, 'utf-8');
      const key = opts.aiKey || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
      
      if (!key) {
        console.error(pc.red('API key required'));
        return;
      }
      
      let trafficData;
      if (opts.traffic && fs.existsSync(opts.traffic)) {
        try { trafficData = JSON.parse(fs.readFileSync(opts.traffic, 'utf-8')); } 
        catch { log.warn('Failed to load traffic data'); }
      }
      
      const provider = createAIProvider(opts.provider, key);
      const gen = new AITestGenerator(provider);
      const result = await gen.generate({ code, file, framework: opts.framework, testFramework: opts.testFramework, testType: opts.testType, trafficData });
      
      if (!fs.existsSync(opts.output)) fs.mkdirSync(opts.output, { recursive: true });
      const outPath = path.join(opts.output, path.basename(result.file));
      fs.writeFileSync(outPath, result.content);
      
      console.log(pc.green(`✓ Test generated: ${outPath}`));
    });

  // record
  program
    .command('record <url>')
    .description('Record API traffic')
    .option('-o, --output <file>', 'Output', config.recorder.outputFile)
    .option('--headless', 'Headless', true)
    .option('--duration <ms>', 'Duration', String(config.recorder.duration))
    .action(async (url: string, opts: any) => {
      console.log(pc.gray(`Recording from: ${url}`));
      const rec = new TrafficRecorder();
      await rec.start(url, { headless: opts.headless });
      await rec.waitForInteraction(Number(opts.duration));
      const data = await rec.stop();
      fs.writeFileSync(opts.output, JSON.stringify(data, null, 2));
      console.log(pc.green(`✓ Traffic saved: ${opts.output}`));
      console.log(pc.gray(`Requests: ${data.stats.totalRequests}`));
    });

  // mock
  program
    .command('mock <file>')
    .description('Generate mocks from traffic')
    .option('-t, --type <type>', 'Type', 'msw')
    .option('-o, --output <file>', 'Output')
    .action(async (file: string, opts: any) => {
      if (!fs.existsSync(file)) {
        console.error(pc.red(`File not found: ${file}`));
        return;
      }
      
      const trafficData = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const generator = new MockGenerator(trafficData);
      
      const content = opts.type === 'msw' ? generator.toMSW() : generator.toVitest();
      const outFile = opts.output || (opts.type === 'msw' ? 'mocks/handlers.ts' : '__mocks__/api.ts');
      
      const dir = path.dirname(outFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      fs.writeFileSync(outFile, content);
      console.log(pc.green(`✓ Mock generated: ${outFile}`));
    });

  // auto
  program
    .command('auto <file>')
    .description('Full workflow: record + generate')
    .option('-u, --url <url>', 'URL')
    .option('-o, --output <dir>', 'Output', config.generator.outputDir)
    .option('--ai-key <key>', 'AI key')
    .action(async (file: string, opts: any) => {
      if (!fs.existsSync(file)) {
        console.error(pc.red(`File not found: ${file}`));
        return;
      }
      
      let trafficData;
      if (opts.url) {
        console.log(pc.gray('Recording traffic...'));
        const rec = new TrafficRecorder();
        await rec.start(opts.url, { headless: true });
        await rec.waitForInteraction(config.recorder.duration);
        trafficData = await rec.stop();
      }
      
      const code = fs.readFileSync(file, 'utf-8');
      const key = opts.aiKey || process.env.OPENAI_API_KEY;
      if (!key) { console.error(pc.red('API key required')); return; }
      
      const provider = createAIProvider(config.ai.provider, key);
      const gen = new AITestGenerator(provider);
      const result = await gen.generate({ code, file, framework: config.analyzer.framework, testFramework: config.generator.testFramework, testType: config.generator.testType, trafficData });
      
      if (!fs.existsSync(opts.output)) fs.mkdirSync(opts.output, { recursive: true });
      const outPath = path.join(opts.output, path.basename(result.file));
      fs.writeFileSync(outPath, result.content);
      
      console.log(pc.green(`✓ Test generated: ${outPath}`));
    });

  await program.parseAsync(process.argv);
}

cli().catch(console.error);

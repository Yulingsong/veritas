/**
 * Veritas - CLI Entry
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
import { loadConfig, validateConfig, defaultConfig } from './config/index.js';
import { createLogger, logger } from './logger/index.js';

const VERSION = '1.0.0';

async function main() {
  // Load config
  const config = loadConfig();
  
  // Setup logger
  const log = createLogger({
    level: config.logging.level,
    file: config.logging.file,
    timestamp: config.logging.timestamp
  });
  
  const program = new Command();

  program
    .name('veritas')
    .description('AI-powered frontend testing with real browser and API data')
    .version(VERSION)
    .hook('preAction', () => {
      log.debug('Starting veritas CLI');
    });

  // Config command
  program
    .command('config')
    .description('Manage configuration')
    .action(() => {
      console.log(JSON.stringify(config, null, 2));
    });

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
      const key = opts.aiKey || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY;
      
      if (!key) {
        console.error(pc.red('API key required. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY'));
        return;
      }
      
      // Load traffic data if provided
      let trafficData;
      if (opts.traffic && fs.existsSync(opts.traffic)) {
        try {
          trafficData = JSON.parse(fs.readFileSync(opts.traffic, 'utf-8'));
          log.info(`Loaded traffic data: ${trafficData.requests?.length || 0} requests`);
        } catch (e) {
          log.warn('Failed to load traffic data');
        }
      }
      
      log.info(`Generating test for: ${file}`);
      
      const provider = createAIProvider(opts.provider, key);
      const gen = new AITestGenerator(provider);
      
      const result = await gen.generate({
        code,
        file,
        framework: opts.framework,
        testFramework: opts.testFramework,
        testType: opts.testType,
        trafficData
      });
      
      if (!fs.existsSync(opts.output)) {
        fs.mkdirSync(opts.output, { recursive: true });
      }
      
      const outPath = path.join(opts.output, path.basename(result.file));
      fs.writeFileSync(outPath, result.content);
      
      console.log(pc.green(`✓ Test generated: ${outPath}`));
      
      if (result.dependencies.length > 0) {
        console.log(pc.gray(`Dependencies: ${result.dependencies.join(', ')}`));
      }
    });

  // record
  program
    .command('record <url>')
    .description('Record API traffic from URL')
    .option('-o, --output <file>', 'Output file', config.recorder.outputFile)
    .option('--headless', 'Headless', config.recorder.headless)
    .option('--duration <ms>', 'Duration', String(config.recorder.duration))
    .action(async (url: string, opts: any) => {
      log.info(`Recording from: ${url}`);
      console.log(pc.gray('Starting browser...'));
      
      const rec = new TrafficRecorder();
      await rec.start(url, { 
        headless: opts.headless,
        captureConsole: config.recorder.captureConsole
      });
      
      console.log(pc.gray(`Recording for ${opts.duration}ms...`));
      await rec.waitForInteraction(Number(opts.duration));
      
      const data = await rec.stop();
      
      fs.writeFileSync(opts.output, JSON.stringify(data, null, 2));
      
      console.log(pc.green(`✓ Traffic saved: ${opts.output}`));
      console.log(pc.gray(`  Total requests: ${data.stats.totalRequests}`));
      console.log(pc.gray(`  By method: ${JSON.stringify(data.stats.byMethod)}`));
    });

  // mock
  program
    .command('mock <traffic-file>')
    .description('Generate mocks from traffic data')
    .option('-t, --type <type>', 'Mock type', 'msw')
    .option('-o, --output <file>', 'Output file')
    .action(async (trafficFile: string, opts: any) => {
      if (!fs.existsSync(trafficFile)) {
        console.error(pc.red(`File not found: ${trafficFile}`));
        return;
      }
      
      const trafficData = JSON.parse(fs.readFileSync(trafficFile, 'utf-8'));
      const generator = new MockGenerator(trafficData);
      
      let content: string;
      let outFile: string;
      
      switch (opts.type) {
        case 'msw':
          content = generator.toMSW();
          outFile = opts.output || 'mocks/handlers.ts';
          break;
        case 'vitest':
          content = generator.toVitest();
          outFile = opts.output || '__mocks__/api.ts';
          break;
        default:
          console.error(pc.red(`Unknown mock type: ${opts.type}`));
          return;
      }
      
      const dir = path.dirname(outFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outFile, content);
      console.log(pc.green(`✓ Mock generated: ${outFile}`));
    });

  // auto
  program
    .command('auto <file>')
    .description('Full workflow: record traffic + generate test')
    .option('-u, --url <url>', 'URL to record')
    .option('-o, --output <dir>', 'Output dir', config.generator.outputDir)
    .option('--ai-key <key>', 'AI key')
    .option('--no-record', 'Skip recording')
    .action(async (file: string, opts: any) => {
      if (!fs.existsSync(file)) {
        console.error(pc.red(`File not found: ${file}`));
        return;
      }
      
      let trafficData;
      
      if (opts.url && !opts.noRecord) {
        console.log(pc.gray('Step 1/2: Recording traffic...'));
        const rec = new TrafficRecorder();
        await rec.start(opts.url, { headless: config.recorder.headless });
        await rec.waitForInteraction(config.recorder.duration);
        trafficData = await rec.stop();
        
        console.log(pc.gray(`  Recorded ${trafficData.stats.totalRequests} requests`));
      }
      
      console.log(pc.gray('Step 2/2: Generating test...'));
      const code = fs.readFileSync(file, 'utf-8');
      const key = opts.aiKey || process.env.OPENAI_API_KEY;
      
      if (!key) {
        console.error(pc.red('API key required'));
        return;
      }
      
      const provider = createAIProvider(config.ai.provider, key);
      const gen = new AITestGenerator(provider);
      
      const result = await gen.generate({
        code,
        file,
        framework: config.analyzer.framework,
        testFramework: config.generator.testFramework,
        testType: config.generator.testType,
        trafficData
      });
      
      if (!fs.existsSync(opts.output)) {
        fs.mkdirSync(opts.output, { recursive: true });
      }
      
      const outPath = path.join(opts.output, path.basename(result.file));
      fs.writeFileSync(outPath, result.content);
      
      console.log(pc.green(`✓ Test generated: ${outPath}`));
    });

  // analyze
  program
    .command('analyze <file>')
    .description('Analyze source code')
    .option('-f, --framework <f>', 'Framework', config.analyzer.framework)
    .action(async (file: string, opts: any) => {
      if (!fs.existsSync(file)) {
        console.error(pc.red(`File not found: ${file}`));
        return;
      }
      
      const code = fs.readFileSync(file, 'utf-8');
      const analyzer = new CodeAnalyzer(opts.framework);
      const components = analyzer.analyze(code, file);
      
      console.log(pc.cyan(`\nFound ${components.length} component(s):\n`));
      
      for (const comp of components) {
        console.log(pc.bold(`${comp.name} (${comp.type})`));
        console.log(pc.gray(`  Props: ${comp.props.map(p => p.name).join(', ') || 'none'}`));
        console.log(pc.gray(`  State: ${comp.state.length || 'none'}`));
        console.log(pc.gray(`  Effects: ${comp.effects.length || 'none'}`));
        console.log(pc.gray(`  API calls: ${comp.apis.length || 'none'}`));
        console.log();
      }
    });

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  console.error(pc.red('Error:'), err.message);
  process.exit(1);
});

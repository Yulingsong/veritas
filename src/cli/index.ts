// CLI Entry
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import pc from 'picocolors';
import { CodeAnalyzer } from './analyzer/index';
import { TrafficRecorder } from './recorder/index';
import { AITestGenerator } from './generator/index';

const VERSION = '1.0.0';

async function main() {
  const program = new Command();

  program
    .name('ai-test')
    .description('AI-powered frontend testing')
    .version(VERSION);

  // generate
  program
    .command('generate <file>')
    .option('-f, --framework <f>', 'Framework', 'react')
    .option('-t, --test-framework <f>', 'Test framework', 'vitest')
    .option('-y, --test-type <t>', 'Test type', 'component')
    .option('-o, --output <dir>', 'Output dir', './tests')
    .option('--ai-key <key>', 'AI key')
    .action(async (file: string, opts: any) => {
      if (!fs.existsSync(file)) {
        console.error(pc.red(`File not found: ${file}`));
        return;
      }
      const code = fs.readFileSync(file, 'utf-8');
      const key = opts.aiKey || process.env.OPENAI_API_KEY;
      if (!key) {
        console.error(pc.red('API key required. Set OPENAI_API_KEY'));
        return;
      }
      const gen = new AITestGenerator({ apiKey: key });
      const result = await gen.generate({ code, file, framework: opts.framework, testFramework: opts.testFramework, testType: opts.testType });
      if (!fs.existsSync(opts.output)) fs.mkdirSync(opts.output, { recursive: true });
      const outPath = path.join(opts.output, path.basename(result.file));
      fs.writeFileSync(outPath, result.content);
      console.log(pc.green(`Test generated: ${outPath}`));
    });

  // record
  program
    .command('record <url>')
    .option('-o, --output <file>', 'Output', 'traffic.json')
    .option('--headless', 'Headless', true)
    .action(async (url: string, opts: any) => {
      console.log(pc.gray(`Recording from: ${url}`));
      const rec = new TrafficRecorder();
      await rec.start(url, { headless: opts.headless });
      await rec.waitForInteraction(5000);
      const data = await rec.stop();
      fs.writeFileSync(opts.output, JSON.stringify(data, null, 2));
      console.log(pc.green(`Traffic saved: ${opts.output}`));
      console.log(pc.gray(`Requests: ${data.stats.totalRequests}`));
    });

  // auto
  program
    .command('auto <file>')
    .option('-u, --url <url>', 'URL')
    .option('-o, --output <dir>', 'Output', './tests')
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
        await rec.waitForInteraction(5000);
        trafficData = await rec.stop();
      }
      const code = fs.readFileSync(file, 'utf-8');
      const key = opts.aiKey || process.env.OPENAI_API_KEY;
      if (!key) {
        console.error(pc.red('API key required'));
        return;
      }
      const gen = new AITestGenerator({ apiKey: key });
      const result = await gen.generate({ code, file, framework: 'react', testFramework: 'vitest', testType: 'component', trafficData });
      if (!fs.existsSync(opts.output)) fs.mkdirSync(opts.output, { recursive: true });
      const outPath = path.join(opts.output, path.basename(result.file));
      fs.writeFileSync(outPath, result.content);
      console.log(pc.green(`Test generated: ${outPath}`));
    });

  await program.parseAsync(process.argv);
}

main().catch(console.error);

/**
 * Example: Full Workflow - Auto Generate Test
 * 
 * This example shows the complete workflow:
 * 1. Record traffic from a URL
 * 2. Analyze source code
 * 3. Generate tests with AI
 * 4. Run tests
 */

import { CodeAnalyzer } from '../src/analyzer/index.js';
import { TrafficRecorder } from '../src/recorder/index.js';
import { AITestGenerator } from '../src/generator/index.js';
import { createAIProvider } from '../src/ai/index.js';
import { VitestExecutor } from '../src/executor/index.js';

interface Options {
  sourceFile: string;
  url?: string;
  outputDir?: string;
  openAiKey?: string;
}

async function autoGenerate(options: Options) {
  const {
    sourceFile,
    url,
    outputDir = './tests',
    openAiKey = process.env.OPENAI_API_KEY || ''
  } = options;

  console.log('🤖 Veritas Auto Generate\n');
  console.log(`Source: ${sourceFile}`);
  console.log(`Output: ${outputDir}\n`);

  // Step 1: Record traffic (optional)
  let trafficData;
  if (url) {
    console.log('Step 1: Recording traffic...');
    const recorder = new TrafficRecorder();
    await recorder.start(url, { headless: true });
    await recorder.waitForInteraction(5000);
    trafficData = await recorder.stop();
    console.log(`  Recorded ${trafficData.stats.totalRequests} requests\n`);
  }

  // Step 2: Analyze code
  console.log('Step 2: Analyzing code...');
  const fs = await import('fs');
  const code = fs.readFileSync(sourceFile, 'utf-8');
  
  const analyzer = new CodeAnalyzer('react');
  const components = analyzer.analyze(code, sourceFile);
  console.log(`  Found ${components.length} component(s)\n`);

  // Step 3: Generate test
  console.log('Step 3: Generating test...');
  const provider = createAIProvider('openai', openAiKey);
  const generator = new AITestGenerator(provider);

  const result = await generator.generate({
    code,
    file: sourceFile,
    framework: 'react',
    testFramework: 'vitest',
    testType: 'component',
    trafficData
  });

  // Save test
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const testFile = `${outputDir}/${result.file}`;
  fs.writeFileSync(testFile, result.content);
  console.log(`  Saved to ${testFile}\n`);

  // Step 4: Run test (optional)
  console.log('Step 4: Running test...');
  const executor = new VitestExecutor(process.cwd());
  const testResult = await executor.run(testFile);

  console.log(`  Status: ${testResult.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`  Duration: ${testResult.duration}ms\n`);

  return {
    success: testResult.success,
    testFile,
    components,
    trafficData
  };
}

// Run if executed directly
const sourceFile = process.argv[2];
if (sourceFile) {
  const url = process.argv[3];
  autoGenerate({ sourceFile, url })
    .then(result => {
      console.log('✅ Complete!');
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}

export { autoGenerate };

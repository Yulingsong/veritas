/**
 * Example: Traffic Recording and Mock Generation
 */

import { TrafficRecorder } from '../src/recorder/index.js';
import { MockGenerator } from '../src/mocker/index.js';

const url = process.argv[2] || 'http://localhost:3000';

async function main() {
  console.log(`Recording traffic from: ${url}\n`);

  // 1. Start recording
  const recorder = new TrafficRecorder();
  await recorder.start(url, { 
    headless: false // Show browser for interaction
  });

  console.log('Browser opened. Interact with the app...');
  console.log('Recording for 10 seconds...\n');

  // 2. Wait for interaction
  await recorder.waitForInteraction(10000);

  // 3. Stop and get data
  const data = await recorder.stop();

  console.log('Recording complete!\n');
  console.log('Stats:');
  console.log(`  Total requests: ${data.stats.totalRequests}`);
  console.log(`  By method: ${JSON.stringify(data.stats.byMethod)}`);
  console.log(`  By status: ${JSON.stringify(data.stats.byStatus)}`);

  // 4. Generate mocks
  const generator = new MockGenerator(data);

  // Generate MSW handlers
  const mswCode = generator.toMSW();
  console.log('\nGenerated MSW handlers:');
  console.log(mswCode.slice(0, 500) + '...');

  // Save to file
  const fs = await import('fs');
  fs.writeFileSync('mocks/handlers.ts', mswCode);
  console.log('\nSaved to mocks/handlers.ts');

  // Generate Vitest mocks
  const vitestCode = generator.toVitest();
  fs.writeFileSync('__mocks__/api.ts', vitestCode);
  console.log('Saved to __mocks__/api.ts');

  // Generate JSON Server config
  const db = generator.toJsonServer();
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  console.log('Saved to db.json');
}

main().catch(console.error);

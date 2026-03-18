/**
 * Example: CI/CD Integration
 */

import { GitHubActions } from '../src/integrations/ci.js';

async function main() {
  console.log('Creating CI/CD configurations...\n');

  // GitHub Actions
  const github = new GitHubActions();
  
  console.log('1. Creating test workflow...');
  github.createTestWorkflow();
  console.log('   ✓ Created .github/workflows/test.yml');

  console.log('2. Creating Veritas workflow...');
  github.createVeritasWorkflow();
  console.log('   ✓ Created .github/workflows/veritas.yml');

  console.log('\nAll CI/CD configurations created!');
  console.log('\nNext steps:');
  console.log('1. Add your API key to GitHub secrets:');
  console.log('   Settings -> Secrets -> New repository secret');
  console.log('   Name: OPENAI_API_KEY');
  console.log('');
  console.log('2. Push to GitHub to trigger workflows');
}

main().catch(console.error);

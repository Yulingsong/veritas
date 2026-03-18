/**
 * Example: Testing with Different Frameworks
 */

import { AITestGenerator } from '../src/generator/index.js';
import { createAIProvider } from '../src/ai/index.js';

const componentCode = `
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../api/user';

export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser(userId)).then(setUser);
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div data-testid="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};
`;

async function generateForVitest() {
  console.log('=== Vitest ===');
  const provider = createAIProvider('openai', process.env.OPENAI_API_KEY || '');
  const generator = new AITestGenerator(provider);

  const result = await generator.generate({
    code: componentCode,
    file: 'UserProfile.tsx',
    framework: 'react',
    testFramework: 'vitest',
    testType: 'component'
  });

  console.log(result.content);
}

async function generateForJest() {
  console.log('\n=== Jest ===');
  const provider = createAIProvider('openai', process.env.OPENAI_API_KEY || '');
  const generator = new AITestGenerator(provider);

  const result = await generator.generate({
    code: componentCode,
    file: 'UserProfile.tsx',
    framework: 'react',
    testFramework: 'jest',
    testType: 'component'
  });

  console.log(result.content);
}

async function generateForPlaywright() {
  console.log('\n=== Playwright ===');
  const provider = createAIProvider('openai', process.env.OPENAI_API_KEY || '');
  const generator = new AITestGenerator(provider);

  const result = await generator.generate({
    code: componentCode,
    file: 'UserProfile.tsx',
    framework: 'react',
    testFramework: 'playwright',
    testType: 'e2e'
  });

  console.log(result.content);
}

// Run all
async function main() {
  await generateForVitest();
  await generateForJest();
  await generateForPlaywright();
}

main().catch(console.error);

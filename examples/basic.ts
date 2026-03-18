/**
 * Example: Basic React Component Test Generation
 */

import { CodeAnalyzer } from '../src/analyzer/index.js';
import { AITestGenerator } from '../src/generator/index.js';
import { createAIProvider } from '../src/ai/index.js';

const componentCode = `
import React, { useState } from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary'
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      await onClick?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
};
`;

async function main() {
  // 1. Analyze code
  const analyzer = new CodeAnalyzer('react');
  const components = analyzer.analyze(componentCode, 'Button.tsx');

  console.log('Found components:', components.length);
  console.log('Component:', components[0]?.name);
  console.log('Props:', components[0]?.props.map(p => p.name));

  // 2. Generate test
  const apiKey = process.env.OPENAI_API_KEY || '';
  const provider = createAIProvider('openai', apiKey);
  const generator = new AITestGenerator(provider);

  const result = await generator.generate({
    code: componentCode,
    file: 'Button.tsx',
    framework: 'react',
    testFramework: 'vitest',
    testType: 'component'
  });

  console.log('\nGenerated test:');
  console.log(result.content);

  // 3. Save test
  const fs = await import('fs');
  fs.writeFileSync('Button.test.tsx', result.content);
  console.log('\nTest saved to Button.test.tsx');
}

main().catch(console.error);

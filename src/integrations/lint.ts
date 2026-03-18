/**
 * Linting & Formatting Configuration
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * ESLint Configuration
 */
export class ESLint {
  /**
   * Create .eslintrc.json
   */
  createESLintConfig(): void {
    const config = {
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error'] }]
      },
      settings: {
        react: { version: 'detect' }
      }
    };

    fs.writeFileSync(
      path.join(process.cwd(), '.eslintrc.json'),
      JSON.stringify(config, null, 2)
    );
  }

  /**
   * Create .eslintignore
   */
  createIgnore(): void {
    const ignore = `
node_modules
dist
coverage
tests
*.test.ts
*.spec.ts
mocks
__mocks__
veritas.config.json
`;

    fs.writeFileSync(
      path.join(process.cwd(), '.eslintignore'),
      ignore
    );
  }
}

/**
 * Prettier Configuration
 */
export class Prettier {
  /**
   * Create .prettierrc
   */
  createConfig(): void {
    const config = {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 100,
      bracketSpacing: true,
      arrowParens: 'avoid'
    };

    fs.writeFileSync(
      path.join(process.cwd(), '.prettierrc'),
      JSON.stringify(config, null, 2)
    );
  }

  /**
   * Create .prettierignore
   */
  createIgnore(): void {
    const ignore = `
node_modules
dist
coverage
tests
mocks
__mocks__
package*.json
*.lock
.veritas-cache
`;

    fs.writeFileSync(
      path.join(process.cwd(), '.prettierignore'),
      ignore
    );
  }
}

/**
 * EditorConfig
 */
export class EditorConfig {
  /**
   * Create .editorconfig
   */
  createConfig(): void {
    const config = `
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,ts,jsx,tsx}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
`;

    fs.writeFileSync(
      path.join(process.cwd(), '.editorconfig'),
      config
    );
  }
}

/**
 * Create all linting configurations
 */
export function createAll(): void {
  const eslint = new ESLint();
  eslint.createESLintConfig();
  eslint.createIgnore();

  const prettier = new Prettier();
  prettier.createConfig();
  prettier.createIgnore();

  const editorconfig = new EditorConfig();
  editorconfig.createConfig();

  console.log('Linting configurations created!');
}

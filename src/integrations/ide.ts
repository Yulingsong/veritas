/**
 * IDE Integrations
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * VSCode Integration
 */
export class VSCode {
  private settingsPath: string;

  constructor(workspacePath: string = process.cwd()) {
    this.settingsPath = path.join(workspacePath, '.vscode');
  }

  /**
   * Create VSCode settings for Veritas
   */
  createSettings(): void {
    const settings = {
      'veritas.provider': 'openai',
      'veritas.defaultFramework': 'react',
      'veritas.defaultTestFramework': 'vitest',
      'veritas.autoGenerate': true,
      'veritas.testPattern': '.test.ts',
      '[typescript]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode'
      },
      '[typescriptreact]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode'
      }
    };

    if (!fs.existsSync(this.settingsPath)) {
      fs.mkdirSync(this.settingsPath, { recursive: true });
    }

    fs.writeFileSync(
      path.join(this.settingsPath, 'settings.json'),
      JSON.stringify(settings, null, 2)
    );
  }

  /**
   * Create tasks.json for Veritas commands
   */
  createTasks(): void {
    const tasks = {
      version: '2.0.0',
      tasks: [
        {
          label: 'Veritas: Generate Tests',
          type: 'shell',
          command: 'npx veritas generate ${file}',
          problemMatcher: []
        },
        {
          label: 'Veritas: Record Traffic',
          type: 'shell',
          command: 'npx veritas record ${input:url}',
          problemMatcher: []
        },
        {
          label: 'Veritas: Auto Generate',
          type: 'shell',
          command: 'npx veritas auto ${file}',
          problemMatcher: []
        }
      ],
      inputs: [
        {
          id: 'url',
          type: 'promptString',
          description: 'Enter URL to record',
          default: 'http://localhost:3000'
        }
      ]
    };

    if (!fs.existsSync(this.settingsPath)) {
      fs.mkdirSync(this.settingsPath, { recursive: true });
    }

    fs.writeFileSync(
      path.join(this.settingsPath, 'tasks.json'),
      JSON.stringify(tasks, null, 2)
    );
  }

  /**
   * Create launch.json for debugging tests
   */
  createLaunch(): void {
    const launch = {
      version: '0.2.0',
      configurations: [
        {
          name: 'Debug Current Test File',
          type: 'node',
          request: 'launch',
          runtimeExecutable: 'npx',
          runtimeArgs: ['vitest', 'run', '${file}'],
          console: 'integratedTerminal',
          internalConsoleOptions: 'neverOpen'
        },
        {
          name: 'Debug All Tests',
          type: 'node',
          request: 'launch',
          runtimeExecutable: 'npx',
          runtimeArgs: ['vitest', 'run'],
          console: 'integratedTerminal'
        }
      ]
    };

    if (!fs.existsSync(this.settingsPath)) {
      fs.mkdirSync(this.settingsPath, { recursive: true });
    }

    fs.writeFileSync(
      path.join(this.settingsPath, 'launch.json'),
      JSON.stringify(launch, null, 2)
    );
  }

  /**
   * Create all VSCode configurations
   */
  createAll(): void {
    this.createSettings();
    this.createTasks();
    this.createLaunch();
    console.log('VSCode configurations created!');
  }
}

/**
 * JetBrains IDEs Integration (IntelliJ, WebStorm, etc.)
 */
export class JetBrains {
  /**
   * Create Run Configuration
   */
  createRunConfiguration(): void {
    const config = {
      name: 'Veritas',
      type: 'node',
      request: 'launch',
      runtimeExecutable: 'npx',
      runtimeArgs: ['veritas', 'auto', '${file}'],
      console: 'integratedTerminal'
    };

    // Save to .idea/runConfigurations
    const dir = path.join(process.cwd(), '.idea', 'runConfigurations');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dir, 'Veritas.xml'),
      JSON.stringify(config, null, 2)
    );
  }

  /**
   * Create code style settings
   */
  createCodeStyle(): void {
    const settings = {
      codeStyle: {
        defaultIndent: 2,
        defaultIndentCase: null,
        braceStyle: 'end_of_line'
      }
    };

    const dir = path.join(process.cwd(), '.idea');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dir, 'codeStyleConfig.xml'),
      JSON.stringify(settings, null, 2)
    );
  }
}

/**
 * Vim/Neovim Integration
 */
export class Vim {
  /**
   * Create .vimrc snippets for Veritas
   */
  createVimrc(): void {
    const vimrc = `
" Veritas mappings
nnoremap <leader>vg :!npx veritas generate %<CR>
nnoremap <leader>vr :!npx veritas record http://localhost:3000<CR>
nnoremap <leader>va :!npx veritas auto %<CR>

" Run tests
nnoremap <leader>tt :!npx vitest run %<CR>
nnoremap <leader>tw :!npx vitest watch %<CR>

" Veritas commands
command! VeritasGenerate !npx veritas generate %
command! VeritasRecord !npx veritas record http://localhost:3000
command! VeritasAuto !npx veritas auto %
`;

    const vimrcPath = path.join(process.cwd(), '.vimrc');
    fs.writeFileSync(vimrcPath, vimrc);
  }
}

/**
 * Create all IDE integrations
 */
export function createAllIntegrations(): void {
  const vscode = new VSCode();
  vscode.createAll();

  const jetbrains = new JetBrains();
  jetbrains.createRunConfiguration();
  jetbrains.createCodeStyle();

  const vim = new Vim();
  vim.createVimrc();

  console.log('IDE configurations created!');
}

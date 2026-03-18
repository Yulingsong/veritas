/**
 * Veritas VSCode Extension
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Command IDs
const CMD_GENERATE = 'veritas.generate';
const CMD_RECORD = 'veritas.record';
const CMD_AUTO = 'veritas.auto';
const CMD_ANALYZE = 'veritas.analyze';
const CMD_CONFIG = 'veritas.config';

// Status bar
let statusBar: vscode.StatusBarItem;

/**
 * Activate extension
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Veritas extension activated');

  // Create status bar
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBar.text = '$(robot) Veritas';
  statusBar.command = CMD_CONFIG;
  statusBar.show();

  // Register commands
  registerCommands(context);

  // Register file watcher
  registerFileWatcher(context);

  // Register tree data provider
  registerTestExplorer(context);

  // Add to subscriptions
  context.subscriptions.push(statusBar);
}

/**
 * Register all commands
 */
function registerCommands(context: vscode.ExtensionContext) {
  // Generate tests
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_GENERATE, async (uri?: vscode.Uri) => {
      const file = await getTargetFile(uri);
      if (!file) return;
      
      await runVeritasCommand(`generate "${file}"`, 'Generate Tests');
    })
  );

  // Record traffic
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_RECORD, async () => {
      const url = await vscode.window.showInputBox({
        prompt: 'Enter URL to record',
        placeHolder: 'http://localhost:3000'
      });
      if (!url) return;
      
      await runVeritasCommand(`record "${url}"`, 'Record Traffic');
    })
  );

  // Auto generate (record + test)
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_AUTO, async (uri?: vscode.Uri) => {
      const file = await getTargetFile(uri);
      if (!file) return;
      
      const url = await vscode.window.showInputBox({
        prompt: 'Enter URL for traffic recording',
        placeHolder: 'http://localhost:3000'
      });
      
      const cmd = url ? `auto "${file}" --url "${url}"` : `generate "${file}"`;
      await runVeritasCommand(cmd, 'Auto Generate');
    })
  );

  // Analyze code
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_ANALYZE, async (uri?: vscode.Uri) => {
      const file = await getTargetFile(uri);
      if (!file) return;
      
      await runVeritasCommand(`analyze "${file}"`, 'Analyze Code');
    })
  );

  // Open config
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_CONFIG, async () => {
      const config = vscode.workspace.getConfiguration('veritas');
      
      const choice = await vscode.window.showQuickPick([
        'View Configuration',
        'Set API Key',
        'Set Default Framework',
        'Set Test Framework'
      ], { placeHolder: 'Select action' });
      
      if (!choice) return;
      
      switch (choice) {
        case 'View Configuration':
          vscode.window.showInformationMessage(
            `Provider: ${config.get('provider')}\nFramework: ${config.get('defaultFramework')}`
          );
          break;
        case 'Set API Key':
          const key = await vscode.window.showInputBox({
            prompt: 'Enter API Key',
            password: true
          });
          if (key) {
            await config.update('apiKey', key, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('API Key saved');
          }
          break;
      }
    })
  );
}

/**
 * Register file watcher
 */
function registerFileWatcher(context: vscode.ExtensionContext) {
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.test.ts');
  
  watcher.onDidCreate((uri) => {
    vscode.window.showInformationMessage(
      `Test created: ${path.basename(uri.fsPath)}`,
      'Open'
    ).then(choice => {
      if (choice === 'Open') {
        vscode.window.showTextDocument(uri);
      }
    });
  });
  
  context.subscriptions.push(watcher);
}

/**
 * Register test explorer
 */
function registerTestExplorer(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider('veritasTests', {
    getChildren: () => {
      const files = vscode.workspace.findFiles('**/*.test.ts', '**/node_modules/**');
      return files.then(f => f.map(f => ({
        label: path.basename(f.fsPath),
        resourceUri: f,
        command: {
          command: 'vscode.open',
          arguments: [f],
          title: 'Open'
        }
      })));
    }
  });
}

/**
 * Get target file
 */
async function getTargetFile(uri?: vscode.Uri): Promise<string | undefined> {
  if (uri) {
    return uri.fsPath;
  }
  
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return editor.document.uri.fsPath;
  }
  
  const files = await vscode.workspace.findFiles('src/**/*.{ts,tsx,vue,svelte}');
  if (files.length > 0) {
    const picked = await vscode.window.showQuickPick(
      files.map(f => ({
        label: path.basename(f.fsPath),
        description: path.dirname(f.fsPath),
        value: f.fsPath
      })),
      { placeHolder: 'Select a file' }
    );
    return picked?.value;
  }
  
  vscode.window.showWarningMessage('No source file found');
  return undefined;
}

/**
 * Run veritas command
 */
async function runVeritasCommand(args: string, taskName: string): Promise<void> {
  statusBar.text = `$(sync~spin) ${taskName}...`;
  
  try {
    const config = vscode.workspace.getConfiguration('veritas');
    const apiKey = config.get<string>('apiKey') || process.env.OPENAI_API_KEY;
    
    if (!apiKey && !args.includes('analyze')) {
      vscode.window.showErrorMessage('API Key not set. Configure in Settings or set OPENAI_API_KEY');
      statusBar.text = '$(robot) Veritas';
      return;
    }
    
    const output = await execAsync(`npx veritas ${args}`, {
      cwd: vscode.workspace.rootPath || process.cwd(),
      env: { ...process.env, OPENAI_API_KEY: apiKey || '' }
    });
    
    // Parse output
    const lines = output.stdout.split('\n').filter(Boolean);
    for (const line of lines.slice(-3)) {
      vscode.window.showInformationMessage(line);
    }
    
    statusBar.text = '$(check) Done!';
    setTimeout(() => {
      statusBar.text = '$(robot) Veritas';
    }, 3000);
    
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
    statusBar.text = '$(alert) Error';
  }
}

/**
 * Deactivate
 */
export function deactivate() {
  console.log('Veritas extension deactivated');
}

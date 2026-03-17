// VSCode Extension - Main Entry

import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

let panel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('AI-Test V2 Extension Activated');

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('ai-test.generate', () => {
      generateTests();
    }),
    vscode.commands.registerCommand('ai-test.record', () => {
      recordTraffic();
    }),
    vscode.commands.registerCommand('ai-test.auto', () => {
      autoGenerate();
    }),
    vscode.commands.registerCommand('ai-test.openPanel', () => {
      openPanel();
    })
  );
}

/**
 * Generate tests for current file
 */
async function generateTests() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No file selected');
    return;
  }

  const file = editor.document.fileName;
  
  // Get config
  const config = vscode.workspace.getConfiguration('aiTest');
  const apiKey = config.get<string>('openAIKey') || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    const input = await vscode.window.showInputBox({
      prompt: 'Enter OpenAI API Key',
      password: true
    });
    if (!input) return;
    process.env.OPENAI_API_KEY = input;
  }

  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'AI-Test',
    cancellable: false
  }, async () => {
    // Run ai-test generate
    const terminal = vscode.window.createTerminal('AI-Test');
    terminal.sendText(`ai-test generate "${file}"`);
    terminal.show();
  });
}

/**
 * Record traffic from URL
 */
async function recordTraffic() {
  const url = await vscode.window.showInputBox({
    prompt: 'Enter URL to record traffic from',
    value: 'http://localhost:3000'
  });
  
  if (!url) return;

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'AI-Test Recording',
    cancellable: false
  }, async () => {
    const terminal = vscode.window.createTerminal('AI-Test Record');
    terminal.sendText(`ai-test record "${url}"`);
    terminal.show();
  });
}

/**
 * Auto generate with traffic recording
 */
async function autoGenerate() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No file selected');
    return;
  }

  const file = editor.document.fileName;
  const url = await vscode.window.showInputBox({
    prompt: 'Enter URL for traffic recording (optional)',
    value: 'http://localhost:3000'
  });

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'AI-Test Auto Generate',
    cancellable: false
  }, async () => {
    const cmd = url 
      ? `ai-test auto "${file}" --url "${url}"`
      : `ai-test auto "${file}"`;
    
    const terminal = vscode.window.createTerminal('AI-Test Auto');
    terminal.sendText(cmd);
    terminal.show();
  });
}

/**
 * Open webview panel
 */
function openPanel() {
  if (panel) {
    panel.reveal();
    return;
  }

  panel = vscode.window.createWebviewPanel(
    'ai-test-view',
    'AI-Test Panel',
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getWebviewHtml();

  panel.onDidDispose(() => {
    panel = undefined;
  });
}

/**
 * Get webview HTML
 */
function getWebviewHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 20px;
      background: #1e1e1e;
      color: #d4d4d4;
    }
    h2 { color: #569cd6; }
    .btn {
      background: #0e639c;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 5px;
      cursor: pointer;
      border-radius: 4px;
    }
    .btn:hover { background: #1177bb; }
    .input {
      background: #3c3c3c;
      border: 1px solid #555;
      color: white;
      padding: 8px;
      width: 300px;
      margin: 5px;
    }
    .log {
      background: #1e1e1e;
      border: 1px solid #333;
      padding: 10px;
      margin-top: 20px;
      max-height: 300px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 12px;
    }
    .success { color: #4ec9b0; }
    .error { color: #f14c4c; }
    .info { color: #569cd6; }
  </style>
</head>
<body>
  <h2>🤖 AI-Test V2</h2>
  
  <div>
    <input type="text" id="url" class="input" placeholder="URL (e.g. http://localhost:3000)" value="http://localhost:3000">
    <button class="btn" onclick="recordTraffic()">📡 Record Traffic</button>
  </div>
  
  <div style="margin-top: 10px;">
    <button class="btn" onclick="autoGenerate()">🚀 Auto Generate</button>
  </div>
  
  <div class="log" id="log">
    <div class="info">Ready. Select a file and click a button to start.</div>
  </div>
  
  <script>
    function log(msg, type = 'info') {
      const div = document.createElement('div');
      div.className = type;
      div.textContent = msg;
      document.getElementById('log').appendChild(div);
    }
    
    async function recordTraffic() {
      const url = document.getElementById('url').value;
      log('Recording traffic from: ' + url);
      // This would communicate with the extension
      vscode.postMessage({ command: 'record', url });
    }
    
    async function autoGenerate() {
      log('Auto generating tests...');
      vscode.postMessage({ command: 'auto' });
    }
  </script>
</body>
</html>
  `;
}

export function deactivate() {}

// Code Analyzer - AST parsing and component detection
// @ts-ignore - babel types
import * as parser from '@babel/parser';
// @ts-ignore
import traverse from '@babel/traverse';
import type { File, Identifier, CallExpression, VariableDeclarator, ArrowFunctionExpression, FunctionExpression } from '@babel/types';
import type { ComponentInfo, PropInfo, StateInfo, EffectInfo, ApiCallInfo, Framework } from '../types';

export class CodeAnalyzer {
  private framework: Framework;

  constructor(framework: Framework = 'react') {
    this.framework = framework;
  }

  /**
   * Analyze source code and extract component information
   */
  analyze(code: string, filePath: string): ComponentInfo[] {
    const components: ComponentInfo[] = [];

    try {
      const ast = this.parse(code);
      
      // @ts-ignore
      traverse(ast, {
        VariableDeclarator: (path: any) => {
          const node = path.node;
          if (
            node.id?.type === 'Identifier' &&
            (node.init?.type === 'ArrowFunctionExpression' ||
             node.init?.type === 'FunctionExpression')
          ) {
            const component = this.extractComponentInfo(node, filePath, code);
            if (component) {
              components.push(component);
            }
          }
        }
      });
    } catch (e) {
      console.error(`Failed to parse ${filePath}:`, e);
    }

    return components;
  }

  /**
   * Parse code to AST
   */
  private parse(code: string): File {
    return parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true
    });
  }

  /**
   * Extract component info
   */
  private extractComponentInfo(node: any, file: string, code: string): ComponentInfo | null {
    const name = node.id?.name;
    if (!name) return null;

    const init = node.init;
    if (!init) return null;

    return {
      name,
      type: init.type === 'ArrowFunctionExpression' ? 'arrow' : 'function',
      file,
      props: this.extractProps(init),
      state: [],
      effects: this.extractEffects(init),
      apis: this.extractApiCalls(init)
    };
  }

  /**
   * Extract props
   */
  private extractProps(fn: any): PropInfo[] {
    const props: PropInfo[] = [];
    const params = fn.params || [];

    for (const param of params) {
      if (param.type === 'Identifier') {
        props.push({ name: param.name, type: 'any', required: true });
      } else if (param.type === 'ObjectPattern') {
        for (const prop of param.properties || []) {
          if (prop.key?.name) {
            props.push({ name: prop.key.name, type: 'any', required: true });
          }
        }
      }
    }

    return props;
  }

  /**
   * Extract effects
   */
  private extractEffects(fn: any): EffectInfo[] {
    const effects: EffectInfo[] = [];
    const body = fn.body;

    if (body?.type === 'BlockStatement') {
      for (const stmt of body.body || []) {
        if (stmt.expression?.type === 'CallExpression') {
          const callee = stmt.expression.callee;
          if (callee?.name?.match(/^use(Effect|Memo|Callback)$/)) {
            effects.push({
              type: callee.name as EffectInfo['type'],
              dependencies: [],
              body: ''
            });
          }
        }
      }
    }

    return effects;
  }

  /**
   * Extract API calls
   */
  private extractApiCalls(fn: any): ApiCallInfo[] {
    const apis: ApiCallInfo[] = [];
    
    // Simple detection of fetch calls
    const code = fn.body?.body?.join?.('\n') || '';
    
    // Detect fetch
    const fetchMatches = code.matchAll(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/g);
    for (const match of fetchMatches) {
      apis.push({
        url: match[1],
        method: 'GET',
        caller: 'fetch',
        line: 0
      });
    }

    return apis;
  }

  /**
   * Detect framework
   */
  static detectFramework(code: string): Framework {
    if (code.includes('react') || code.includes('from "react"')) return 'react';
    if (code.includes('vue') || code.includes('@vue/')) return 'vue';
    if (code.includes('next') || code.includes('next/router')) return 'next';
    return 'react';
  }
}

export default CodeAnalyzer;

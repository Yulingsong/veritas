/**
 * AST Utilities
 */

import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

/**
 * Parse code to AST
 */
export function parseAST(code: string, options: {
  sourceType?: 'module' | 'script';
  plugins?: string[];
} = {}): any {
  return parser.parse(code, {
    sourceType: options.sourceType || 'module',
    plugins: options.plugins || ['jsx', 'typescript'],
    errorRecovery: true
  });
}

/**
 * Traverse AST
 */
export function traverseAST(ast: any, visitors: Record<string, (path: any) => void>): void {
  // @ts-ignore
  traverse(ast, visitors);
}

/**
 * Generate code from AST
 */
export function generateCode(ast: any): string {
  // @ts-ignore
  return generate(ast).code;
}

/**
 * Find nodes by type
 */
export function findNodesByType(ast: any, nodeType: string): any[] {
  const nodes: any[] = [];

  traverseAST(ast, {
    [nodeType](path: any) {
      nodes.push(path.node);
    }
  });

  return nodes;
}

/**
 * Find imports
 */
export function findImports(ast: any): Array<{ source: string; specifiers: string[]; type: string }> {
  const imports: Array<{ source: string; specifiers: string[]; type: string }> = [];

  traverseAST(ast, {
    ImportDeclaration(path: any) {
      const specifiers: string[] = [];
      path.node.specifiers.forEach((spec: any) => {
        if (spec.type === 'ImportSpecifier') {
          specifiers.push(spec.imported.name);
        } else if (spec.type === 'ImportDefaultSpecifier') {
          specifiers.push('default');
        } else if (spec.type === 'ImportNamespaceSpecifier') {
          specifiers.push('*');
        }
      });

      imports.push({
        source: path.node.source.value,
        specifiers,
        type: 'import'
      });
    }
  });

  return imports;
}

/**
 * Find exports
 */
export function findExports(ast: any): Array<{ name: string; type: string }> {
  const exports: Array<{ name: string; type: string }> = [];

  traverseAST(ast, {
    ExportNamedDeclaration(path: any) {
      if (path.node.declaration) {
        const name = path.node.declaration.id?.name;
        if (name) {
          exports.push({ name, type: 'named' });
        }
      }
    },
    ExportDefaultDeclaration(path: any) {
      exports.push({ name: 'default', type: 'default' });
    }
  });

  return exports;
}

/**
 * Find function declarations
 */
export function findFunctions(ast: any): Array<{ name: string; params: string[]; async: boolean }> {
  const functions: Array<{ name: string; params: string[]; async: boolean }> = [];

  traverseAST(ast, {
    FunctionDeclaration(path: any) {
      const params = path.node.params.map((p: any) => p.name || p.type);
      functions.push({
        name: path.node.id?.name || 'anonymous',
        params,
        async: path.node.async
      });
    },
    ArrowFunctionExpression(path: any) {
      const parent = path.parent;
      if (parent.type === 'VariableDeclarator') {
        functions.push({
          name: parent.id?.name || 'arrow',
          params: path.node.params.map((p: any) => p.name || p.type),
          async: false
        });
      }
    }
  });

  return functions;
}

/**
 * Find class declarations
 */
export function findClasses(ast: any): Array<{ name: string; methods: string[]; extends: string | null }> {
  const classes: Array<{ name: string; methods: string[]; extends: string | null }> = [];

  traverseAST(ast, {
    ClassDeclaration(path: any) {
      const methods: string[] = [];
      path.node.body.body.forEach((member: any) => {
        if (member.type === 'ClassMethod') {
          methods.push(member.key.name);
        }
      });

      classes.push({
        name: path.node.id?.name || 'AnonymousClass',
        methods,
        extends: path.node.superClass?.name || null
      });
    }
  });

  return classes;
}

/**
 * Find JSX elements
 */
export function findJSXElements(ast: any): string[] {
  const elements: string[] = [];

  traverseAST(ast, {
    JSXElement(path: any) {
      const name = path.node.openingElement.name;
      if (name.type === 'JSXIdentifier') {
        elements.push(name.name);
      }
    }
  });

  return elements;
}

/**
 * Find React hooks usage
 */
export function findHooks(ast: any): Array<{ name: string; deps: string[] }> {
  const hooks: Array<{ name: string; deps: string[] }> = [];

  traverseAST(ast, {
    CallExpression(path: any) {
      const callee = path.node.callee;
      if (callee.type === 'Identifier' && callee.name.startsWith('use')) {
        const args = path.node.arguments || [];
        const deps = args.length > 1 && args[1].type === 'ArrayExpression'
          ? args[1].elements.map((e: any) => e?.value || e?.name)
          : [];

        hooks.push({
          name: callee.name,
          deps
        });
      }
    }
  });

  return hooks;
}

export default {
  parseAST,
  traverseAST,
  generateCode,
  findNodesByType,
  findImports,
  findExports,
  findFunctions,
  findClasses,
  findJSXElements,
  findHooks
};

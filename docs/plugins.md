# Veritas 插件开发指南

## 概述

Veritas 提供强大的插件系统，允许开发者扩展核心功能。

## 插件类型

| 类型 | 描述 | 钩子 |
|------|------|------|
| `analyzer` | 代码分析插件 | `analyze`, `parse` |
| `generator` | 测试生成插件 | `generate`, `template` |
| `reporter` | 报告生成插件 | `report`, `format` |
| `mocker` | Mock 生成插件 | `mock`, `transform` |

## 创建插件

### 基本结构

```typescript
import type { Plugin, PluginContext } from 'veritas';

export const myPlugin: Plugin = {
  name: 'my-plugin',
  type: 'analyzer',
  version: '1.0.0',
  
  // 插件配置
  config: {
    enabled: true,
    options: {}
  },
  
  // 初始化
  init(ctx: PluginContext) {
    // 注册钩子
    ctx.hooks.analyze.tap('my-plugin', (code, filePath) => {
      // 分析代码
      return result;
    });
  },
  
  // 清理
  destroy() {
    // 清理资源
  }
};
```

## 插件上下文

```typescript
interface PluginContext {
  // 配置
  config: VeritasConfig;
  
  // 日志
  logger: Logger;
  
  // 缓存
  cache: Cache;
  
  // 工具
  utils: {
    ast: ASTUtil;
    fs: FileSystem;
    path: PathUtil;
  };
  
  // 钩子系统
  hooks: {
    analyze: Hook<AnalyzeHook>;
    generate: Hook<GenerateHook>;
    report: Hook<ReportHook>;
  };
}
```

## 钩子系统

### 注册钩子

```typescript
// 同步钩子
ctx.hooks.analyze.tap('my-plugin', (code, filePath) => {
  return newAnalysisResult;
});

// 异步钩子
ctx.hooks.generate.tapPromise('my-plugin', async (request) => {
  const result = await generateTest(request);
  return result;
});

// 带选项的钩子
ctx.hooks.report.tap('my-plugin', (report, options) => {
  return formattedReport;
}, { stage: 100 }); // 执行顺序
```

### 实现钩子

```typescript
// Analyzer 插件
class MyAnalyzerPlugin {
  init(ctx: PluginContext) {
    ctx.hooks.analyze.tap('MyAnalyzer', (code, filePath) => {
      const ast = ctx.utils.ast.parse(code);
      const components = this.extractComponents(ast);
      return { components };
    });
  }
}

// Generator 插件
class MyGeneratorPlugin {
  init(ctx: PluginContext) {
    ctx.hooks.generate.tap('MyGenerator', (request) => {
      if (request.testType === 'custom') {
        return this.generateCustomTest(request);
      }
      return null; // 返回 null 交给其他插件处理
    });
  }
}

// Reporter 插件
class MyReporterPlugin {
  init(ctx: PluginContext) {
    ctx.hooks.format.tap('MyReporter', (results, format) => {
      if (format === 'custom') {
        return this.formatCustom(results);
      }
      return null;
    });
  }
}
```

## 插件配置

### 配置文件

```json
{
  "plugins": [
    {
      "name": "my-plugin",
      "enabled": true,
      "options": {
        "option1": "value1"
      }
    }
  ]
}
```

### 访问配置

```typescript
export const myPlugin: Plugin = {
  name: 'my-plugin',
  
  init(ctx: PluginContext) {
    const options = ctx.config.plugins?.['my-plugin'] || {};
    const customOption = options.customOption;
  }
};
```

## 内置插件

### Jest Snapshot

```typescript
import { jestSnapshotPlugin } from 'veritas/plugins/jest-snapshot';

pluginManager.register(jestSnapshotPlugin);
```

### RTL (React Testing Library)

```typescript
import { rtlPlugin } from 'veritas/plugins/rtl';

pluginManager.register(rtlPlugin, {
  library: 'rtl',
  render: 'render',
  screen: 'screen'
});
```

### Coverage

```typescript
import { coveragePlugin } from 'veritas/plugins/coverage';

pluginManager.register(coveragePlugin, {
  threshold: 80,
  reporter: ['html', 'lcov']
});
```

### Accessibility

```typescript
import { accessibilityPlugin } from 'veritas/plugins/a11y';

pluginManager.register(accessibilityPlugin, {
  standards: ['wcag2a', 'wcag2aa'],
  verbose: true
});
```

## 打包插件

### 目录结构

```
my-veritas-plugin/
├── package.json
├── src/
│   └── index.ts
├── dist/
└── README.md
```

### package.json

```json
{
  "name": "veritas-plugin-my",
  "version": "1.0.0",
  "main": "dist/index.js",
  "peerDependencies": {
    "veritas": "^1.0.0"
  }
}
```

### 入口文件

```typescript
// src/index.ts
import type { Plugin } from 'veritas';
import { analyzer } from './analyzer';
import { generator } from './generator';

export const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  type: 'analyzer',
  
  init(ctx) {
    analyzer(ctx);
    generator(ctx);
  }
};

export default myPlugin;
```

## 测试插件

```typescript
import { describe, it, expect, vi } from 'vitest';
import { createPluginContext } from 'veritas/testutils';
import { myPlugin } from '../src';

describe('myPlugin', () => {
  it('should analyze code', async () => {
    const ctx = createPluginContext();
    myPlugin.init(ctx);
    
    const code = `
      function TestComponent() {
        return <div>Hello</div>;
      }
    `;
    
    const result = await ctx.hooks.analyze.call(code, 'Test.tsx');
    expect(result.components).toHaveLength(1);
  });
});
```

## 发布插件

```bash
# 打包
npm run build

# 发布到 npm
npm publish

# 或者发布到私有仓库
npm publish --registry https://your-registry.com
```

## 最佳实践

1. **单一职责** - 每个插件专注于一个功能
2. **错误处理** - 妥善处理异常，提供有意义的错误信息
3. **日志记录** - 使用 `ctx.logger` 记录关键操作
4. **配置验证** - 验证用户配置，提供默认值
5. **版本兼容** - 遵循语义版本，与主版本保持兼容
6. **文档完善** - 提供使用示例和配置说明

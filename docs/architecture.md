# Veritas 架构

## 概述

Veritas 是一个 AI 驱动的自动化前端测试生成工具，它结合了浏览器流量录制和 AI 分析来生成高质量的测试用例。

## 核心架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLI Layer                               │
│  (veritas generate | record | auto | analyze | mock | test)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Plugin System                                │
│            (pluginManager + built-in plugins)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Analyzer     │ │    Recorder     │ │    Generator    │
│   Code Analysis │ │ Traffic Record  │ │  AI Test Gen    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│     Mocker      │ │    Executor     │ │     Cache       │
│  Mock Gen +     │ │ Test Execution  │ │   Results       │
│  MSW/Vitest     │ │ Vitest/Jest/    │ │   Cache         │
│  JSON-Server    │ │ Playwright      │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 核心模块

### 1. Analyzer (代码分析器)

负责解析源代码，提取组件信息。

**位置**: `src/analyzer/`

**功能**:
- 解析 React/Vue 组件
- 提取 Props、State、Effects
- 识别 API 调用
- 类型推断

**关键类**:
```typescript
class CodeAnalyzer {
  analyze(code: string, filePath: string): ComponentInfo[];
  parseFramework(code: string): Framework;
  extractProps(ast: AST): PropInfo[];
  extractState(ast: AST): StateInfo[];
  extractEffects(ast: AST): EffectInfo[];
}
```

### 2. Recorder (流量录制器)

使用真实浏览器录制 API 流量。

**位置**: `src/recorder/`

**功能**:
- 启动无头浏览器
- 捕获网络请求/响应
- 收集 LocalStorage/SessionStorage/Cookies
- 录制控制台输出

**工作流程**:
```
start(url) → openBrowser → navigate → waitForInteraction → capture → stop → generateTrafficData
```

### 3. Generator (测试生成器)

基于代码和流量数据生成测试用例。

**位置**: `src/generator/`

**功能**:
- AI 分析组件
- 生成测试代码
- 支持多种测试框架 (Vitest/Jest/Playwright)
- 生成 Mock 数据

**测试类型**:
- `component` - 组件测试
- `hook` - Hook 测试
- `integration` - 集成测试
- `e2e` - 端到端测试

### 4. Mocker (Mock 生成器)

从流量数据生成 Mock 服务器。

**位置**: `src/mocker/`

**输出格式**:
- MSW (Mock Service Worker)
- Vitest mocks
- JSON Server 数据
- fetch-mock

### 5. Executor (测试执行器)

运行生成的测试。

**位置**: `src/executor/`

**支持框架**:
- Vitest
- Jest
- Playwright

**功能**:
- 单文件执行
- 批量执行
- 覆盖率收集
- 报告生成

### 6. Cache (缓存系统)

减少重复分析和 API 调用。

**位置**: `src/cache/`

**缓存策略**:
- 内存缓存
- 磁盘缓存
- LRU 淘汰

### 7. Reporter (报告生成器)

生成测试结果报告。

**位置**: `src/reporter/`

**输出格式**:
- HTML
- JSON
- Markdown
- JUnit XML

### 8. Plugin System (插件系统)

扩展 Veritas 功能。

**位置**: `src/plugins/`

**插件类型**:
- `analyzer` - 代码分析插件
- `generator` - 测试生成插件
- `reporter` - 报告插件
- `mocker` - Mock 插件

## 数据流

### 自动测试生成流程

```
1. Input: Component Code + URL
          │
          ▼
2. Recorder: Launch browser, record traffic
          │
          ▼
3. Analyzer: Parse code, extract components
          │
          ▼
4. Cache: Check if already analyzed
          │
          ▼
5. Generator: AI generate tests
          │
          ▼
6. Mocker: Generate mocks from traffic
          │
          ▼
7. Executor: Run tests
          │
          ▼
8. Reporter: Generate report
```

## 配置层级

```
CLI Arguments (最高优先级)
   │
   ▼
Project Config (veritas.config.json)
   │
   ▼
User Config (~/.veritas/config.json)
   │
   ▼
Default Config (最低优先级)
```

## 错误处理

**错误类型**:
- `AnalysisError` - 代码分析错误
- `GenerationError` - 测试生成错误
- `ExecutionError` - 测试执行错误
- `NetworkError` - 网络请求错误
- `ConfigurationError` - 配置错误

**处理策略**:
1. 降级处理 -某个步骤失败，尝试降级方案
2. 重试机制 - 临时错误自动重试
3. 错误报告 - 详细错误信息和建议

## 性能优化

1. **增量分析** - 只分析改动的文件
2. **并行处理** - 多文件并行分析
3. **智能缓存** - 缓存分析结果和 AI 响应
4. **流式生成** - 边生成边写入

## 扩展开发

参考 [plugins.md](plugins.md) 了解如何开发自定义插件。

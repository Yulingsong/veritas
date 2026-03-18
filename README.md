# Veritas 🤖

> AI-powered frontend testing with real browser and API data

[![CI](https://github.com/Yulingsong/veritas/actions/workflows/ci.yml/badge.svg)](https://github.com/Yulingsong/veritas/actions)
[![npm version](https://img.shields.io/npm/v/veritas)](https://www.npmjs.com/package/veritas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 核心特性

- 🌐 **浏览器流量录制** - 捕获真实 API 请求/响应
- 🤖 **AI 测试生成** - 基于代码 + 真实数据生成测试
- ⚡ **自生成 Mock** - 从流量自动生成 Mock 数据
- 📦 **多 AI 提供商** - 支持 OpenAI、Anthropic Claude、Google Gemini
- 🔧 **多测试框架** - 支持 Vitest、Jest、Playwright
- 📦 **VSCode 插件** - IDE 内嵌使用
- 🔄 **CI/CD 集成** - 自动化测试流程

## 安装

```bash
# 全局安装
npm install -g veritas

# 或使用 npx
npx veritas generate <file>
```

## 快速开始

### 1. 设置 API Key

```bash
# OpenAI (默认)
export OPENAI_API_KEY=sk-...

# 或使用命令行参数
veritas generate <file> --ai-key <key>
```

### 2. 生成测试

```bash
# 从组件文件生成测试
veritas generate src/components/Button.tsx

# 指定框架
veritas generate src/components/Button.tsx --framework react --test-framework vitest

# 指定输出目录
veritas generate src/components/Button.tsx -o ./__tests__
```

### 3. 录制流量

```bash
# 录制 API 请求
veritas record http://localhost:3000

# 保存到指定文件
veritas record http://localhost:3000 -o my-traffic.json
```

### 4. 自动生成 (代码 + 流量)

```bash
# 录制流量并生成测试
veritas auto src/components/Button.tsx --url http://localhost:3000

# 使用已有的流量数据
veritas generate src/components/Button.tsx --traffic traffic.json
```

## 命令行选项

### generate

```bash
veritas generate <file> [options]

Options:
  -f, --framework <f>     框架: react, vue, next (default: react)
  -t, --test-framework <f>  测试框架: vitest, jest, playwright (default: vitest)
  -y, --test-type <t>     测试类型: unit, component, integration, e2e (default: component)
  -o, --output <dir>      输出目录 (default: ./tests)
  --ai-key <key>          API Key
  --traffic <file>        流量数据文件
```

### record

```bash
veritas record <url> [options]

Options:
  -o, --output <file>     输出文件 (default: traffic.json)
  --headless              无头模式 (default: true)
  --duration <ms>         录制时长 (default: 5000)
```

### auto

```bash
veritas auto <file> [options]

Options:
  -u, --url <url>         应用 URL
  -o, --output <dir>       输出目录 (default: ./tests)
  --ai-key <key>          API Key
```

## 支持的 AI 提供商

| 提供商 | 环境变量 | 模型 |
|--------|----------|------|
| OpenAI | `OPENAI_API_KEY` | gpt-4o, gpt-4o-mini, gpt-4 |
| Anthropic | `ANTHROPIC_API_KEY` | claude-3-5-sonnet |
| Gemini | `GEMINI_API_KEY` | gemini-2.0-flash |

```bash
# 使用不同的 AI 提供商
veritas generate <file> --provider anthropic
veritas generate <file> --provider gemini
```

## 工作流程

```
1. 录制流量 (可选)
   veritas record http://localhost:3000
   → 浏览器打开应用，操作页面
   → 录制所有 API 请求/响应

2. 生成测试
   veritas auto src/App.tsx --url http://localhost:3000
   → 分析代码结构
   → 结合录制的流量数据
   → AI 生成测试用例

3. 运行测试
   npm test
   或
   npx vitest run
```

## 作为库使用

```typescript
import { CodeAnalyzer } from 'veritas/src/analyzer';
import { AITestGenerator } from 'veritas/src/generator';
import { TrafficRecorder } from 'veritas/src/recorder';
import { createAIProvider } from 'veritas/src/ai';

// 分析代码
const analyzer = new CodeAnalyzer('react');
const components = analyzer.analyze(code, filePath);

// 生成测试
const provider = createAIProvider('openai', apiKey);
const generator = new AITestGenerator(provider);
const test = await generator.generate(request);

// 录制流量
const recorder = new TrafficRecorder();
await recorder.start(url);
const data = await recorder.stop();
```

## 项目结构

```
veritas/
├── src/
│   ├── ai/           # AI 提供商封装
│   ├── analyzer/     # 代码分析 (AST)
│   ├── cli/          # 命令行入口
│   ├── executor/     # 测试执行器
│   ├── generator/    # AI 测试生成
│   ├── recorder/     # 流量录制
│   └── utils/        # 工具函数
├── templates/        # 测试模板
└── vscode-plugin/    # VSCode 插件
```

## 常见问题

### Q: 如何使用私有模型？

```bash
veritas generate <file> --model gpt-4 --base-url https://api.openai.com/v1
```

### Q: 如何添加自定义测试模板？

在项目根目录创建 `templates/` 目录。

### Q: 支持哪些测试框架？

- Vitest (默认)
- Jest
- Playwright

## 许可证

MIT License - see [LICENSE](LICENSE) for details.

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

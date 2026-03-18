# Veritas 🤖

> AI-powered frontend testing with real browser and API data

[![CI](https://github.com/Yulingsong/veritas/actions/workflows/ci.yml/badge.svg)](https://github.com/Yulingsong/veritas/actions)
[![npm version](https://img.shields.io/npm/v/veritas)](https://www.npmjs.com/package/veritas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-50%25-yellow)](https://github.com/Yulingsong/veritas/actions)

## 核心特性

- 🌐 **浏览器流量录制** - 捕获真实 API 请求/响应
- 🤖 **AI 测试生成** - 基于代码 + 真实数据生成测试
- ⚡ **自生成 Mock** - 从流量自动生成 Mock 数据
- 📦 **多 AI 提供商** - 支持 OpenAI、Anthropic Claude、Google Gemini
- 🔧 **多测试框架** - 支持 Vitest、Jest、Playwright
- 📊 **完整测试工具集** - Fixtures、Matchers、Snapshots、Factory
- 🧪 **TDD 支持** - 红-绿-重构开发循环

## 快速开始

```bash
# 安装
npm install -g veritas

# 生成测试
veritas generate src/components/Button.tsx

# 录制流量
veritas record http://localhost:3000

# 自动生成
veritas auto src/components/Button.tsx --url http://localhost:3000
```

## 项目结构

```
veritas/
├── src/
│   ├── ai/              # AI 提供商
│   ├── analyzer/         # 代码分析
│   ├── cache/            # 缓存系统
│   ├── cli/              # CLI 入口
│   ├── config/           # 配置管理
│   ├── coverage/         # 覆盖率分析
│   ├── errors/           # 错误处理
│   ├── events/           # 事件系统
│   ├── executor/         # 测试执行
│   ├── generator/       # 测试生成
│   ├── hooks/            # React Hooks
│   ├── integrations/     # CI/CD 集成
│   ├── logger/           # 日志系统
│   ├── middleware/      # 中间件
│   ├── mocker/           # Mock 生成
│   ├── plugins/         # 插件系统
│   ├── recorder/        # 流量录制
│   ├── reporter/        # 报告生成
│   ├── testutils/       # 测试工具
│   ├── transformers/     # 代码转换
│   └── utils/           # 工具函数
├── tests/                # 测试用例
├── docs/                 # 文档
└── vscode-plugin/       # VSCode 插件
```

## 工具函数

| 模块 | 功能 |
|------|------|
| `utils/string` | slugify, camelCase, kebabCase, truncate |
| `utils/number` | clamp, random, formatBytes, percent |
| `utils/date` | formatDate, relativeTime, addDays |
| `utils/object` | deepClone, deepMerge, pick, omit |
| `utils/array` | chunk, flatten, uniqueBy, groupBy |
| `utils/async` | Queue, debounce, throttle, memoize |
| `utils/storage` | LocalStorage, MemoryCache, LRUCache |
| `utils/validation` | ConfigValidator |
| `utils/errors` | Error tracking |

## 测试

```bash
# 运行测试
npm test

# 监听模式
npm run test:watch

# 覆盖率
npm run test:coverage

# UI 模式
npm run test:ui
```

## CI/CD

```yaml
# .github/workflows/ci.yml
- name: Lint
  run: npm run lint
  
- name: Test
  run: npm test
  
- name: Coverage
  run: npm run test:coverage
```

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 许可证

MIT License - see [LICENSE](LICENSE) for details.

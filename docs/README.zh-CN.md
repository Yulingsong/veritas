# Veritas 中文文档

> AI 驱动的自动化前端测试工具

## 什么是 Veritas？

Veritas 是一个利用 AI 技术自动生成前端测试的工具。它能够：
- 录制真实浏览器的网络流量
- 分析源代码提取组件信息
- 基于真实数据和 AI 生成高质量测试用例
- 自动生成 Mock 数据

## 核心特性

| 特性 | 说明 |
|------|------|
| 🌐 流量录制 | 使用真实浏览器捕获 API 请求和响应 |
| 🤖 AI 生成 | 基于代码和流量数据自动生成测试 |
| ⚡ 自动 Mock | 从流量数据自动生成 Mock 服务器 |
| 📦 多框架支持 | 支持 Vitest、Jest、Playwright |
| 🔧 完整工具集 | Fixtures、Matchers、Snapshots、Factory |

## 快速开始

### 安装

```bash
# 全局安装
npm install -g veritas

# 或者使用 npx
npx veritas generate <文件路径>
```

### 生成测试

```bash
# 从组件生成测试
veritas generate src/components/Button.tsx

# 录制流量并生成测试
veritas record http://localhost:3000

# 自动生成（录制+测试）
veritas auto src/components/Button.tsx --url http://localhost:3000
```

### 生成 Mock

```bash
# 从流量数据生成 Mock
veritas mock traffic.json
```

## 项目结构

```
veritas/
├── src/
│   ├── ai/              # AI 提供商 (OpenAI, Claude, Gemini)
│   ├── analyzer/        # 代码分析器
│   ├── generator/       # 测试生成器
│   ├── recorder/       # 流量录制器
│   ├── mocker/         # Mock 生成器
│   ├── executor/       # 测试执行器
│   ├── cache/          # 缓存系统
│   ├── reporter/       # 报告生成器
│   └── plugins/        # 插件系统
├── docs/               # 文档
└── tests/              # 测试用例
```

## 配置说明

创建 `veritas.config.json`：

```json
{
  "ai": {
    "provider": "openai",
    "model": "gpt-4o-mini"
  },
  "generator": {
    "testFramework": "vitest",
    "outputDir": "./tests"
  },
  "recorder": {
    "headless": true,
    "duration": 5000
  }
}
```

## CLI 命令

| 命令 | 说明 |
|------|------|
| `veritas generate <file>` | 生成测试 |
| `veritas record <url>` | 录制流量 |
| `veritas auto <file>` | 自动生成 |
| `veritas mock <file>` | 生成 Mock |
| `veritas analyze <file>` | 分析代码 |
| `veritas config` | 查看配置 |

## AI 提供商

### OpenAI

```bash
export OPENAI_API_KEY=sk-xxx
veritas generate src/...
```

### Anthropic Claude

```bash
export ANTHROPIC_API_KEY=sk-ant-xxx
veritas generate src/... --ai-provider anthropic
```

### Google Gemini

```bash
export GEMINI_API_KEY=xxx
veritas generate src/... --ai-provider gemini
```

## 测试框架

### Vitest (默认)

```json
{
  "generator": {
    "testFramework": "vitest"
  }
}
```

### Jest

```json
{
  "generator": {
    "testFramework": "jest"
  }
}
```

### Playwright

```json
{
  "generator": {
    "testFramework": "playwright"
  }
}
```

## 插件系统

Veritas 支持自定义插件扩展功能：

```typescript
import type { Plugin } from 'veritas';

const myPlugin: Plugin = {
  name: 'my-plugin',
  type: 'analyzer',
  
  init(ctx) {
    ctx.hooks.analyze.tap('my-plugin', (code, filePath) => {
      // 自定义分析逻辑
      return result;
    });
  }
};
```

## 常见问题

### 1. 安装失败

**问题**: 提示权限错误

**解决**:
```bash
sudo npm install -g veritas
# 或配置 npm 全局路径
```

### 2. 找不到命令

**问题**: 安装后找不到 `veritas` 命令

**解决**:
```bash
# 检查安装
npm list -g veritas

# 检查 PATH
echo $PATH
```

### 3. AI 生成失败

**问题**: AI 生成测试失败

**解决**:
1. 检查 API Key 是否正确设置
2. 检查网络连接
3. 查看详细日志: `veritas --verbose generate src/...`

## 开发指南

```bash
# 克隆项目
git clone https://github.com/Yulingsong/veritas.git
cd veritas

# 安装依赖
npm install

# 开发模式
npm run dev

# 运行测试
npm test

# 构建
npm run build
```

## 相关链接

- [GitHub](https://github.com/Yulingsong/veritas)
- [问题反馈](https://github.com/Yulingsong/veritas/issues)

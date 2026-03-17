# Veritas 🤖

> AI-powered frontend testing with real browser and API data

## 核心特性

- 🌐 **浏览器流量录制** - 捕获真实 API 请求/响应
- 🤖 **AI 测试生成** - 基于代码 + 真实数据生成测试
- ⚡ **自生成 Mock** - 从流量自动生成 Mock 数据
- 📦 **VSCode 插件** - IDE 内嵌使用
- 🔄 **CI/CD 集成** - 自动化测试流程

## 安装

```bash
npm install -g veritas

# 或使用 npx
npx veritas generate <file>
```

## 快速开始

### 1. 生成测试

```bash
veritas generate src/components/Button.tsx

# 指定框架
veritas generate src/components/Button.tsx --framework react --test-framework vitest
```

### 2. 录制流量

```bash
veritas record http://localhost:3000
```

### 3. 自动生成 (代码 + 流量)

```bash
veritas auto src/components/Button.tsx --url http://localhost:3000
```

## 命令行选项

```bash
veritas generate <file> [options]
veritas record <url> [options]
veritas auto <file> [options]
```

## 环境变量

```bash
export OPENAI_API_KEY=sk-...
```

## 工作流程

```
1. veritas record http://localhost:3000
   → 浏览器打开应用，操作页面
   → 录制所有 API 请求/响应

2. veritas auto src/App.tsx --url http://localhost:3000
   → 分析代码结构
   → 结合录制的流量数据
   → AI 生成测试用例

3. 运行测试
   → npm test
```

## 许可证

MIT License

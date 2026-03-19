# Veritas 🤖

<p align="center">
  <img src="./logo.svg" alt="Veritas Logo" width="128" height="128">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/node/v/veritas-orange" alt="Node">
  <img src="https://img.shields.io/github/stars/Yulingsong/veritas" alt="Stars">
  <img src="https://img.shields.io/npm/dm/veritas" alt="Downloads">
</p>

<p align="center">
  <strong>AI 驱动的自动化前端测试工具 | 自动化测试生成</strong>
</p>

---

## ✨ 特性

| 特性 | 说明 |
|------|------|
| 🌐 **流量录制** | 使用真实浏览器捕获 API 请求和响应 |
| 🤖 **AI 生成** | 基于代码和流量数据自动生成测试 |
| ⚡ **自动 Mock** | 从流量数据自动生成 Mock 服务器 |
| 📦 **多框架支持** | Vitest、Jest、Playwright |
| 🔧 **完整工具集** | Fixtures、Matchers、Snapshots、Factory |

---

## 🚀 快速开始

```bash
# 安装
npm install -g veritas

# 从组件生成测试
veritas generate src/components/Button.tsx

# 录制流量并生成测试
veritas record http://localhost:3000

# 自动生成（录制+测试）
veritas auto src/components/Button.tsx --url http://localhost:3000
```

---

## 📖 示例

### 输入：React 组件

```tsx
// src/components/Counter.tsx
import React, { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### 输出：测试代码

```tsx
// tests/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from '../src/components/Counter';

describe('Counter', () => {
  it('should increment count', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('should decrement count', () => {
    render(<Counter initialValue={5} />);
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByTestId('count')).toHaveTextContent('4');
  });
});
```

---

## 📦 安装

```bash
# 全局安装
npm install -g veritas

# 或使用 npx
npx veritas generate <文件路径>
```

---

## ⚙️ 配置

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
  }
}
```

---

## 🤖 AI 提供商

支持 OpenAI、Anthropic Claude、Google Gemini

```bash
export OPENAI_API_KEY=sk-xxx
# 或
export ANTHROPIC_API_KEY=sk-ant-xxx
# 或
export GEMINI_API_KEY=xxx
```

---

## 📚 文档

- [配置详解](./docs/config.md) - 配置文件选项
- [API 参考](./docs/api.zh-CN.md) - 编程接口
- [插件开发](./docs/plugins.md) - 自定义插件
- [架构设计](./docs/architecture.md) - 系统架构
- [常见问题](./docs/faq.md) - FAQ
- [使用教程](./docs/tutorial.md) - 详细教程

---

## 🛠️ 开发

```bash
git clone https://github.com/Yulingsong/veritas.git
cd veritas
npm install
npm run dev
```

---

## ⭐ 贡献

欢迎 Star 和 PR！

---

## 📄 License

MIT License

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Yulingsong">@Yulingsong</a>
</p>

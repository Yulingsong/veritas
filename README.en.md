# Veritas (English)

> AI-powered frontend testing with real browser and API data

[中文](./README.md) | English

## What is Veritas?

Veritas is an AI-powered tool that automatically generates frontend tests. It can:
- Record real browser network traffic
- Analyze source code to extract component information
- Generate high-quality tests based on real data and AI
- Automatically generate mock data

## Features

| Feature | Description |
|---------|-------------|
| 🌐 Traffic Recording | Capture real API requests/responses using browser |
| 🤖 AI Generation | Auto-generate tests from code and traffic data |
| ⚡ Auto Mock | Generate mock servers from traffic data |
| 📦 Multi-Framework | Support Vitest, Jest, Playwright |
| 🔧 Complete Toolset | Fixtures, Matchers, Snapshots, Factory |

## Installation

```bash
# Global install
npm install -g veritas

# Or use npx
npx veritas generate <file>
```

## Quick Start

```bash
# Generate tests from component
veritas generate src/components/Button.tsx

# Record traffic and generate tests
veritas record http://localhost:3000

# Auto-generate (record + test)
veritas auto src/components/Button.tsx --url http://localhost:3000
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `veritas generate <file>` | Generate tests |
| `veritas record <url>` | Record traffic |
| `veritas auto <file>` | Auto-generate |
| `veritas mock <file>` | Generate Mock |
| `veritas analyze <file>` | Analyze code |

## Configuration

Create `veritas.config.json`:

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

## Links

- [GitHub](https://github.com/Yulingsong/veritas)
- [Documentation](./docs/README.zh-CN.md)

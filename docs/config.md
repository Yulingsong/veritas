# Veritas 配置

## 配置文件位置

Veritas 会在以下位置查找配置文件（按优先级顺序）：

1. `./veritas.config.json` (当前目录)
2. `~/.veritas/config.json` (用户目录)
3. 默认配置

## 配置示例

```json
{
  "ai": {
    "provider": "openai",
    "apiKey": "your-api-key",
    "model": "gpt-4o-mini",
    "temperature": 0.7,
    "maxTokens": 4000
  },
  "analyzer": {
    "framework": "react",
    "parseTypes": true,
    "extractProps": true,
    "extractState": true,
    "extractEffects": true,
    "extractApiCalls": true
  },
  "generator": {
    "testFramework": "vitest",
    "testType": "component",
    "outputDir": "./tests",
    "testPattern": ".test",
    "includeMocks": true,
    "includeSetup": true
  },
  "recorder": {
    "headless": true,
    "duration": 5000,
    "outputFile": "traffic.json",
    "captureLocalStorage": true,
    "captureSessionStorage": true,
    "captureCookies": true,
    "captureConsole": false
  },
  "executor": {
    "framework": "vitest",
    "update": false,
    "coverage": false,
    "reporter": "verbose",
    "timeout": 30000
  },
  "logging": {
    "level": "info",
    "file": "./veritas.log",
    "timestamp": true
  }
}
```

## 环境变量

除了配置文件，还可以通过环境变量设置：

- `OPENAI_API_KEY` - OpenAI API Key
- `ANTHROPIC_API_KEY` - Anthropic Claude API Key
- `GEMINI_API_KEY` - Google Gemini API Key
- `VERITAS_CONFIG_PATH` - 自定义配置文件路径

## AI 提供商

### OpenAI

```json
{
  "ai": {
    "provider": "openai",
    "model": "gpt-4o-mini"
  }
}
```

### Anthropic Claude

```json
{
  "ai": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022"
  }
}
```

### Google Gemini

```json
{
  "ai": {
    "provider": "gemini",
    "model": "gemini-2.0-flash"
  }
}
```

## 测试框架

### Vitest

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

## 插件配置

可以通过插件系统扩展功能：

```json
{
  "plugins": [
    "jest-snapshot",
    "rtl",
    "coverage",
    "accessibility"
  ]
}
```

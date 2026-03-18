# Veritas 快速开始

## 安装

```bash
npm install -g veritas
```

## 快速开始

### 1. 设置 API Key

```bash
export OPENAI_API_KEY=your-api-key
```

### 2. 生成测试

```bash
veritas generate src/components/Button.tsx
```

### 3. 录制流量

```bash
veritas record http://localhost:3000
```

### 4. 自动生成

```bash
veritas auto src/components/Button.tsx --url http://localhost:3000
```

## 常用命令

```bash
# 生成测试
veritas generate <file>

# 录制流量
veritas record <url>

# 生成 Mock
veritas mock <traffic-file>

# 自动生成 (录制 + 测试)
veritas auto <file>

# 分析代码
veritas analyze <file>

# 生成报告
veritas report <result-file>

# 缓存管理
veritas cache --stats
veritas cache --clear
```

## 配置

创建 `veritas.config.json`:

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

## 示例

### 基本用法

```typescript
import { CodeAnalyzer } from 'veritas/src/analyzer';
import { AITestGenerator } from 'veritas/src/generator';
import { createAIProvider } from 'veritas/src/ai';

const analyzer = new CodeAnalyzer('react');
const components = analyzer.analyze(code, filePath);

const provider = createAIProvider('openai', apiKey);
const generator = new AITestGenerator(provider);
const result = await generator.generate(request);
```

### 录制流量

```typescript
import { TrafficRecorder } from 'veritas/src/recorder';

const recorder = new TrafficRecorder();
await recorder.start(url, { headless: true });
await recorder.waitForInteraction(5000);
const data = await recorder.stop();
```

### 生成 Mock

```typescript
import { MockGenerator } from 'veritas/src/mocker';

const generator = new MockGenerator(trafficData);
const msw = generator.toMSW();
const vitest = generator.toVitest();
```

## 插件

```typescript
import { pluginManager, getBuiltInPlugins } from 'veritas/src/plugins';

const plugins = getBuiltInPlugins();
plugins.forEach(p => pluginManager.register(p));
```

## 集成

### GitHub Actions

```yaml
- name: Generate Tests
  run: npx veritas auto src/
```

### VSCode

安装 VSCode 插件后，可以使用：

- `Ctrl+Shift+T` - 生成测试
- `Ctrl+Shift+R` - 录制流量

## 文档

- [配置指南](./docs/config.md)
- [API 参考](./docs/api.md)
- [贡献指南](./CONTRIBUTING.md)

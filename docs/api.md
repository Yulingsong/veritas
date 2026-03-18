# Veritas API Reference

## Core Modules

### Analyzer

```typescript
import { CodeAnalyzer } from 'veritas/src/analyzer';

const analyzer = new CodeAnalyzer('react');
const components = analyzer.analyze(code, filePath);
```

### Generator

```typescript
import { AITestGenerator } from 'veritas/src/generator';
import { createAIProvider } from 'veritas/src/ai';

const provider = createAIProvider('openai', apiKey);
const generator = new AITestGenerator(provider);
const result = await generator.generate(request);
```

### Recorder

```typescript
import { TrafficRecorder } from 'veritas/src/recorder';

const recorder = new TrafficRecorder();
await recorder.start(url, { headless: true });
await recorder.waitForInteraction(5000);
const data = await recorder.stop();
```

### Mocker

```typescript
import { MockGenerator } from 'veritas/src/mocker';

const generator = new MockGenerator(trafficData);
const msw = generator.toMSW();
const vitest = generator.toVitest();
const db = generator.toJsonServer();
```

### Executor

```typescript
import { VitestExecutor } from 'veritas/src/executor';

const executor = new VitestExecutor(projectPath);
const result = await executor.run(testFile);
```

### Cache

```typescript
import { Cache, cached } from 'veritas/src/cache';

const cache = new Cache();
cache.set('key', value);
const value = cache.get('key');

// Decorator
@cached()
async function expensiveFunction() { }
```

### Reporter

```typescript
import { generateReport } from 'veritas/src/reporter';

const report = generateReport(results, { format: 'html' });
```

### Plugins

```typescript
import { pluginManager, getBuiltInPlugins } from 'veritas/src/plugins';

// Load built-in plugins
const plugins = getBuiltInPlugins();
plugins.forEach(p => pluginManager.register(p));

// Register custom plugin
pluginManager.register(myPlugin);
```

### Config

```typescript
import { loadConfig, defaultConfig } from 'veritas/src/config';

const config = loadConfig();
```

### Logger

```typescript
import { createLogger } from 'veritas/src/logger';

const logger = createLogger({ level: 'info' });
logger.info('message');
logger.error('message');
```

## CLI Commands

```bash
# Generate tests
veritas generate <file>

# Record traffic
veritas record <url>

# Generate mocks
veritas mock <traffic-file>

# Auto generate (record + generate)
veritas auto <file>

# Analyze code
veritas analyze <file>

# Generate report
veritas report <result-file>

# Cache management
veritas cache --stats
veritas cache --clear

# Show config
veritas config
```

## Types

### ComponentInfo

```typescript
interface ComponentInfo {
  name: string;
  type: 'function' | 'class' | 'arrow';
  file: string;
  props: PropInfo[];
  state: StateInfo[];
  effects: EffectInfo[];
  apis: ApiCallInfo[];
}
```

### TrafficData

```typescript
interface TrafficData {
  requests: NetworkRequest[];
  responses: NetworkResponse[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  cookies: Record<string, string>;
  stats: TrafficStats;
}
```

### TestGenerationRequest

```typescript
interface TestGenerationRequest {
  code: string;
  file: string;
  framework: Framework;
  testFramework: TestFramework;
  testType: TestType;
  trafficData?: TrafficData;
}
```

### GeneratedTest

```typescript
interface GeneratedTest {
  file: string;
  content: string;
  type: TestType;
  dependencies: string[];
}
```

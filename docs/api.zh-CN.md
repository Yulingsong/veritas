# Veritas API 参考

## 模块导入

```typescript
import { 
  parser,
  generator, 
  formatter, 
  validator,
  EnhancedParser 
} from 'veritas';
```

## Parser (解析器)

### parser.parse()

解析输入内容并提取结构化信息。

```typescript
const result = await parser.parse(content, 'prd');
```

**参数:**
- `content: string` - 输入内容
- `type?: InputType` - 输入类型 ('prd' | 'trd' | 'source' | 'api')

**返回:** `Promise<ParsedResult>`

### parser.detectType()

自动检测输入类型。

```typescript
const type = parser.detectType(content);
// 返回: 'prd' | 'trd' | 'source' | 'api' | 'unknown'
```

## Generator (生成器)

### generator.generate()

生成 Skill。

```typescript
const skill = await generator.generate(parsed, {
  format: 'openclaw',
  includeExamples: true,
  includeValidation: true
});
```

**参数:**
- `parsed: ParsedResult` - 解析结果
- `config: GenerationConfig` - 生成配置

**返回:** `Promise<Skill>`

### GenerationConfig

```typescript
interface GenerationConfig {
  format: 'openclaw' | 'claude-code' | 'mcp';
  includeExamples: boolean;
  includeValidation: boolean;
  customTemplate?: string;
}
```

## Formatter (格式化器)

### formatter.formatSkillMD()

格式化为 SKILL.md。

```typescript
const md = formatter.formatSkillMD(skill);
```

### formatter.formatToolsJSON()

生成 tools.json。

```typescript
const tools = formatter.formatToolsJSON(skill);
```

### formatter.formatPackageJSON()

生成 package.json。

```typescript
const pkg = formatter.formatPackageJSON(skill);
```

## Validator (验证器)

### validator.validate()

验证 Skill 质量。

```typescript
const result = validator.validate(skill);

if (result.valid) {
  console.log('Skill 有效');
} else {
  console.log('错误:', result.errors);
}
```

**返回:** `ValidationResult`

### validator.test()

测试 Skill 触发。

```typescript
const test = validator.test(skill, '用户登录');
console.log(test.success); // true | false
```

## EnhancedParser (增强解析器)

支持 AI 增强功能。

```typescript
const enhancedParser = new EnhancedParser({
  provider: 'openai',
  apiKey: 'sk-xxx',
  model: 'gpt-4o-mini'
});

const result = await enhancedParser.parseWithAI(content, 'prd');
```

## 类型定义

### ParsedResult

```typescript
interface ParsedResult {
  type: InputType;
  content: string;
  metadata: {
    title?: string;
    description?: string;
    version?: string;
  };
  entities: ExtractedEntity[];
  userFlows: UserFlow[];
}
```

### Skill

```typescript
interface Skill {
  name: string;
  description: string;
  triggers: string[];
  steps: SkillStep[];
  tools: string[];
  examples: Example[];
  references: Reference[];
}
```

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
```

## CLI 用法

```bash
# 生成测试
veritas generate <file> [options]

# 录制流量
veritas record <url> [options]

# 自动生成
veritas auto <file> [options]

# 生成 Mock
veritas mock <file> [options]

# 分析代码
veritas analyze <file> [options]

# 验证配置
veritas config [options]
```

### 选项

| 选项 | 说明 |
|------|------|
| `-o, --output <dir>` | 输出目录 |
| `-t, --type <type>` | 输入类型 |
| `-f, --format <format>` | 输出格式 |
| `--ai` | 启用 AI |
| `--no-examples` | 排除示例 |
| `--verbose` | 详细输出 |

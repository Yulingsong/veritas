# Veritas 常见问题

## 安装问题

### Q: 安装失败，提示权限错误

**A**: 使用 `sudo npm install -g veritas` 或配置 npm 全局路径:

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH="$PATH:$HOME/.npm-global/bin"
# 添加到 ~/.zshrc
```

### Q: 找不到 `veritas` 命令

**A**: 
1. 检查是否安装成功: `npm list -g veritas`
2. 检查 PATH: `echo $PATH`
3. 尝试重新安装: `npm install -g veritas`

---

## 配置问题

### Q: 配置文件放在哪里?

**A**: Veritas 按以下顺序查找配置文件:
1. `./veritas.config.json` (项目根目录)
2. `~/.veritas/config.json` (用户目录)
3. 内置默认配置

### Q: 如何使用环境变量?

**A**: 支持以下环境变量:

```bash
# AI API Keys
export OPENAI_API_KEY=sk-xxx
export ANTHROPIC_API_KEY=sk-ant-xxx
export GEMINI_API_KEY=xxx

# 自定义配置路径
export VERITAS_CONFIG_PATH=/path/to/config.json
```

### Q: 支持哪些测试框架?

**A**: 当前支持:
- Vitest (默认)
- Jest
- Playwright

---

## 使用问题

### Q: 如何生成组件测试?

```bash
veritas generate src/components/Button.tsx
```

### Q: 如何录制流量?

```bash
# 启动录制
veritas record http://localhost:3000

# 带选项录制
veritas record http://localhost:3000 --headless --duration 10000
```

### Q: 如何自动生成测试(录制+生成)?

```bash
veritas auto src/components/Button.tsx --url http://localhost:3000
```

### Q: 如何只生成 Mock 数据?

```bash
veritas mock traffic.json --output ./mocks
```

### Q: 如何运行生成的测试?

```bash
veritas test ./tests/button.test.ts
```

---

## AI 相关

### Q: 支持哪些 AI 提供商?

**A**: 支持:
- OpenAI (GPT-4o, GPT-4o-mini, etc.)
- Anthropic Claude (Claude 3.5 Sonnet, etc.)
- Google Gemini (Gemini 2.0 Flash, etc.)

### Q: 如何切换 AI 模型?

```json
{
  "ai": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022"
  }
}
```

### Q: 为什么 AI 生成失败?

**A**: 常见原因:
1. API Key 未设置或无效
2. 网络问题 (需要代理)
3. API 配额用尽
4. 模型不支持

检查日志: `veritas --verbose generate src/...`

### Q: 如何减少 AI API 调用?

**A**: 使用缓存:

```bash
veritas generate src/... --cache
```

或在配置中启用:

```json
{
  "cache": {
    "enabled": true,
    "ttl": 86400
  }
}
```

---

## 测试生成

### Q: 生成的测试通过率低?

**A**: 尝试:
1. 提供更多流量数据: `veritas auto --url http://localhost:3000`
2. 增加 AI 温度: `"ai": { "temperature": 0.5 }`
3. 手动补充测试用例

### Q: 如何自定义测试模板?

**A**: 创建自定义插件或使用模板变量:

```typescript
// 在配置中指定模板
{
  "generator": {
    "template": "./templates/my-template.ts"
  }
}
```

### Q: 如何添加自定义断言?

**A**: 在测试文件中直接添加:

```typescript
import { expect } from 'vitest';

test('custom assertion', () => {
  expect(result).to satisfySomeCondition();
});
```

---

## 性能问题

### Q: 分析大项目很慢?

**A**: 
1. 使用增量分析: `veritas analyze --git`
2. 使用并行处理: `veritas analyze --parallel`
3. 排除不需要的目录: `"exclude": ["node_modules", "dist"]`

### Q: 内存占用过高?

**A**:
1. 减小缓存大小
2. 分批处理文件
3. 使用 `--no-cache` 禁用缓存

---

## 错误处理

### Q: 出现 "Parse error" 错误?

**A**: 
1. 确保代码可以正常解析
2. 检查文件编码 (UTF-8)
3. 尝试使用 `--no-parse-types`

### Q: 出现 "Network error"?

**A**:
1. 检查网络连接
2. 配置代理: `export HTTP_PROXY=http://proxy:8080`
3. 检查防火墙

### Q: 测试执行失败?

**A**:
1. 检查依赖是否安装: `npm install`
2. 检查测试框架配置
3. 查看详细错误: `veritas test --verbose`

---

## 调试

### Q: 如何开启调试模式?

```bash
veritas generate src/... --debug
```

### Q: 如何查看缓存状态?

```bash
veritas cache --stats
```

### Q: 如何清除缓存?

```bash
veritas cache --clear
```

### Q: 如何查看完整配置?

```bash
veritas config --show
```

---

## 贡献

### Q: 如何贡献代码?

1. Fork 项目
2. 创建特性分支: `git checkout -b feature/xxx`
3. 提交更改: `git commit -am 'Add xxx'`
4. 推送到分支: `git push origin feature/xxx`
5. 创建 Pull Request

### Q: 如何报告 bug?

请在 [GitHub Issues](https://github.com/Yulingsong/veritas/issues) 中报告，包含:
- 环境信息 (`veritas --version`)
- 复现步骤
- 错误日志

---

## 其他

### Q: 有 VSCode 插件吗?

**A**: 是的! 查看 [vscode-plugin](../vscode-plugin/) 目录。

### Q: 如何获取帮助?

- GitHub Issues: https://github.com/Yulingsong/veritas/issues
- 文档: https://github.com/Yulingsong/veritas#readme

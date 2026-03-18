# Veritas 贡献指南

## 欢迎贡献

感谢你对 Veritas 项目的兴趣！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 Bug 修复
- ✨ 新功能
- 📖 文档改进
- 🎨 代码优化
- 🧪 测试用例

## 开发环境设置

```bash
# 克隆项目
git clone https://github.com/Yulingsong/veritas.git
cd veritas

# 安装依赖
npm install

# 运行测试
npm test

# 构建项目
npm run build
```

## 项目结构

```
veritas/
├── src/
│   ├── ai/              # AI 提供商
│   ├── analyzer/        # 代码分析
│   ├── cache/           # 缓存系统
│   ├── cli/             # CLI 入口
│   ├── config/          # 配置管理
│   ├── coverage/        # 覆盖率分析
│   ├── executor/        # 测试执行
│   ├── generator/        # 测试生成
│   ├── hooks/           # React Hooks
│   ├── integrations/    # 集成工具
│   ├── logger/          # 日志系统
│   ├── mocker/          # Mock 生成
│   ├── plugins/         # 插件系统
│   ├── recorder/        # 流量录制
│   ├── reporter/        # 报告生成
│   ├── transformers/    # 代码转换
│   ├── utils/           # 工具函数
│   └── testutils/       # 测试工具
├── examples/            # 示例代码
├── docs/                # 文档
└── vscode-plugin/       # VSCode 插件
```

## 代码规范

### TypeScript

- 使用 TypeScript strict 模式
- 优先使用接口而非类型别名
- 使用 JSDoc 注释公共 API

### 命名规范

- 变量/函数: camelCase
- 类/接口: PascalCase
- 常量: UPPER_SNAKE_CASE
- 文件: kebab-case

### 提交规范

使用 Conventional Commits：

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具
```

示例：
```
feat(generator): 支持 Vue 组件测试生成
fix(recorder): 修复流量录制超时问题
docs: 更新 API 文档
```

## 提交 Pull Request

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: 添加某功能'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 测试

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行覆盖率
npm run test:coverage
```

## 问题反馈

请使用 GitHub Issues 反馈问题：

- 🐛 Bug 报告
- 💡 功能建议
- ❓ 问答

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

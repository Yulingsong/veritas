# Veritas 更新日志

## v1.0.0 (2024-xx-xx)

### 新增
- 初始版本发布
- PRD/TRD 解析支持
- 源代码分析
- OpenAPI 解析
- AI 增强功能
- 多 AI 提供商支持 (OpenAI, Anthropic, Gemini)
- CLI 工具
- 测试生成
- Mock 生成
- 插件系统
- 验证功能

### 核心功能
- 🌐 浏览器流量录制
- 🤖 AI 测试生成
- ⚡ 自动 Mock
- 📦 多框架支持
- 🔧 完整工具集

### 支持的框架
- React
- Vue
- Next.js
- Nuxt.js

### 测试框架
- Vitest (默认)
- Jest
- Playwright

## 已知问题

- 暂无

## 路线图

### 计划中
- [ ] 视频/截图解析
- [ ] Web UI
- [ ] 团队协作
- [ ] 插件市场

---

## 安装

```bash
npm install -g veritas
```

## 快速开始

```bash
# 生成测试
veritas generate src/components/Button.tsx

# 录制流量
veritas record http://localhost:3000

# 自动生成
veritas auto src/components/Button.tsx --url http://localhost:3000
```

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可证

MIT License - see [LICENSE](./LICENSE) for details.

# Forge — SaaS Starter Kit

基于 Figma 设计稿还原的生产级 SaaS 脚手架，面向 ToB 场景。单 App + Route Groups 架构，clone 即跑。

## 技术栈

- Next.js 16 + React 19
- Tailwind CSS v4
- TypeScript
- 60+ UI 组件（`src/components/ui`）
- 24 个组件用例（`src/app/(showcase)/cases`）
- AI 驱动工作流：Claude Code / Cursor / Codex 接入

## 启动

```bash
pnpm install
pnpm dev --port 3456 --hostname 0.0.0.0
```

访问 http://localhost:3456 查看 Showcase。

## 目录

| 路径 | 用途 |
|---|---|
| `src/components/ui/` | 60+ UI 组件 |
| `src/components/layouts/` | AppLayout 等布局模板 |
| `src/app/(showcase)/cases/` | 24 个组件用例页 |
| `src/app/(showcase)/docs/` | 文档站（Skill / AGENTS.md 接入） |
| `src/app/app/ecommerce/` | 业务模板（categories/customers/orders/products/sellers） |
| `src/app/{sign-in,sign-up,forgot-password,reset-password}/` | 登录套件 |
| `src/app/templates/` | 模板总览 |
| `src/app/globals.css` | 设计 token（`--fg-*` 色板 + 字体） |
| `figma-code/` | Figma Dev Mode 导出资料 |

## 设计资产

- 官网：[Majin UI Kit](https://www.figma.com/design/3MG7QpDykk6tJ2V7gMCL6V/Majin-UI)
- 后台：[Protask UI Kit](https://www.figma.com/design/NURk2MWDU9a86hgHBKbE5M/Protask-UI-Kit)

## AI 接入

项目面向 AI 助手协作开发，提供两种路线：

- **Skill（推荐）** — 按需加载，上下文更省。详见 `/docs/ui-for-agents`
- **AGENTS.md** — 单文件粘贴，轻量试用。详见 `/docs/agents-md`

顶层 `AGENTS.md` 是 Forge 内部开发时给 AI 的复核 / 重写 case 工作流规则。

## 架构决策

- 单 App + Route Groups，不用 monorepo（buyer clone 即跑）
- 不做租户 / 组织模型（简单就是卖点）
- 多仓库：`forge`（基础） + `forge-xxx`（垂直模板），包含完整代码不依赖 submodule

## 部署

Vercel 一键部署，参考 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。

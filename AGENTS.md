# Forge — Agent 入口

本仓库是组件库 `@forge-ui-official/core` 和文档站，不是后台业务脚手架。新后台从 [Forge Starter](https://github.com/forge-ui/forge-starter) 起。

写页面前先读组件目录，再读 Skill。props 以 case 源码和 `core/src` 为准，不要凭记忆发明接口。

## 先读

| 文档 | 用途 |
| --- | --- |
| [`docs/for-agents/README.md`](docs/for-agents/README.md) | 写业务页的入口和流程 |
| [`docs/for-agents/routes.md`](docs/for-agents/routes.md) | `/cases/*` 路由表 |
| [`docs/for-agents/components.md`](docs/for-agents/components.md) | 组件用途和对应 case |
| [`docs/for-agents/inventory.json`](docs/for-agents/inventory.json) | 全量 export |
| [`skills/forge-react/SKILL.md`](skills/forge-react/SKILL.md) | 可安装的 Forge Skill：组件、token、`AppLayout` |
| [`skills/forge-react/references/`](skills/forge-react/references/) | token、页面模式、布局、契约与蓝图 |
| [`docs/design/component-fusion-api-guide.md`](docs/design/component-fusion-api-guide.md) | 已并入组件的交互增强怎么用 |
| [`docs/design/public-content-guidelines.md`](docs/design/public-content-guidelines.md) | 官网与组件文案 |
| [`docs/ask-ai-fullscreen-layout.md`](docs/ask-ai-fullscreen-layout.md) | Ask AI 全屏插槽 |
| [`core/README.md`](core/README.md) | 包的安装与公开 API |

组件从 `@forge-ui-official/core` 引入。对应案例在 `src/app/cases/<name>/page.tsx`。

## 仓库地图

| 路径 | 用途 |
| --- | --- |
| `core/` | 组件包源码 |
| `src/app/docs` | 文档站 |
| `src/app/components` | 组件展示 |
| `src/app/cases` | 组合案例 |
| `src/app/templates` | 页面模板 |
| `skills/forge-react` | Skill 正文与 references |
| `public/` | 图片、图标、安装脚本 |

## 本地

Node.js `>=22.13.0`，包管理器为仓库锁定的 pnpm。

```bash
pnpm install
pnpm dev
pnpm typecheck
```

改组件后跑 `pnpm core:typecheck`。`docs/` 只放现行指南，不要把一次性审计、迁移对照或测试快照写回来。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

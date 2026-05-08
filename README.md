# Forge

Forge 是一个面向 ToB SaaS 和后台系统的开源 UI 工程仓库，包含 React 组件库、设计 token、AppLayout、业务模板、组件案例、文档站和 agent skill。目标是让开发者和 AI agent 使用同一套组件规则，快速搭出一致、可维护的业务后台。

## 内容

| 路径 | 说明 |
|---|---|
| `core/` | 组件库源码，发布为 `@forge-ui-official/core` |
| `src/app/docs` | 文档站页面 |
| `src/app/components` | 组件展示页 |
| `src/app/cases` | 组件组合案例 |
| `src/app/templates` | 后台业务模板和完整页面示例 |
| `skills/forge-react` | 可安装到 AI coding agent 的 Forge skill |
| `public/` | 图片资产和 skill 安装脚本 |

## 使用组件包

```bash
pnpm add @forge-ui-official/core
```

在 Tailwind v4 入口 CSS 中引入样式，并让 Tailwind 扫描组件包产物：

```css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../node_modules/@forge-ui-official/core/dist";
```

`@source` 的相对路径取决于你的 CSS 文件位置。如果入口在 `src/app/globals.css`，通常需要写成 `../../node_modules/@forge-ui-official/core/dist`。

## 本地开发

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm build           # 构建组件包和文档/示例站
pnpm typecheck       # 检查组件包和站点类型
pnpm core:build      # 只构建 @forge-ui-official/core
pnpm core:typecheck  # 只检查组件包类型
pnpm lint            # 运行 ESLint
```

## Agent Skill

Forge 提供一份可安装的 skill，用于约束 AI agent 写业务页面时优先使用 Forge 组件、token 和模板。

```bash
# Claude Code / Cursor
curl -fsSL https://forge-mu-amber.vercel.app/install-skill.sh | bash

# Codex
curl -fsSL https://forge-mu-amber.vercel.app/install-skill.sh | FORGE_AGENT=codex bash
```

## 相关仓库

- [`forge-starter`](https://github.com/forge-ui/forge-starter): 最小 Next.js 起手模板
- [`forge-agent`](https://github.com/forge-ui/forge-agent): 基于 Forge 的 AI agent 产品壳示例

## License

MIT

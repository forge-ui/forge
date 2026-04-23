# Forge

一套为 ToB SaaS 产品准备的设计系统 + React 组件库。从 Figma 稿到生产代码，团队拿来就能拼页面。

**[在线看组件和模板 →](https://forge-ui.github.io/forge/)**

## 做这个是为了解决什么

ToB 后台产品的 UI 通常有三个老问题：

- **Figma 稿到代码总要对齐**。每个新前端来都得重新校像素、间距、hover 态，重复劳动。
- **管理后台结构高度相似**。表格详情、统计卡、分类树、订单流，每个新项目都从零撸一遍。
- **设计规范放久了就散掉**。色板、字号、间距到处是"差不多"的小差异，用久了系统越走越歪。

Forge 把这套东西一次性打包：

- **75+ 组件**，按 Figma 源稿（Protask + Majin UI Kit）1:1 还原，不是"大概像就行"
- **分层设计 token**：8 色 × 10 shade 的 primitive 层 + 语义层（`bg-accent` / `text-muted` / `border-divider`），Tailwind v4 原生集成
- **现成业务模板**：电商后台（订单 / 商品 / 客户 / 分类 / 卖家）、dashboard builder、登录套件
- **AI 协作友好**：一份 `/docs/agents-md` 指引 + 一条命令把 Forge skill 装进 Claude Code / Cursor / Codex：
  ```bash
  curl -fsSL https://forge-ui.github.io/forge/install-skill.sh | bash
  ```

## 产品形态

| | |
|---|---|
| 组件包 | `@forge-ui/react`（GitHub Packages 私有） |
| 在线展示 | [forge-ui.github.io/forge](https://forge-ui.github.io/forge/) |
| 组件源码 | [forge-ui/forge-core](https://github.com/forge-ui/forge-core) |
| 本仓（forge） | 文档站 + showcase + 业务模板，消费组件包 |

在线展示分四块：

- `/components` — 每个组件的规格和变体矩阵
- `/cases` — 组件用法示例
- `/templates` — 现成页面（订单详情、登录套件、dashboard 等）
- `/docs` — 接入文档 + AI 协作规则

## 适合谁

- 做 ToB 后台 / SaaS 控制台类产品的团队
- 用 Next.js 16 + React 19 + Tailwind v4 的项目
- 希望 AI 辅助开发能"接得上"自己的设计系统

目前**组件包私有分发**——本文档站（`forge-ui/forge`）是公开的，但组件包 `@forge-ui/react` 发在 GitHub Packages 私有，成员加入 `forge-ui` team 后拿到 `read:packages` 权限即可装包。

---

## 开发者指南

本仓是文档站，不含组件实现。组件源码在 [forge-core](https://github.com/forge-ui/forge-core)。

### 本地起站

```bash
export GITHUB_TOKEN=ghp_xxx    # 需要 read:packages scope
pnpm install
pnpm dev --port 3456 --hostname 0.0.0.0
```

访问 http://localhost:3456。前提：GitHub 账号已被加进 `forge-ui` team。

### 仓结构

```
src/app/
├── docs/          接入文档 + AI 协作指南
├── cases/         组件用法示例（一个组件一页）
├── components/    组件规格页（props + 变体说明）
└── templates/     业务模板（auth / ecommerce / dashboard-builder）
```

### 部署

`main` 分支放源码，`gh-pages` 分支放静态构建产物。更新线上站走本地 build：

```bash
NODE_ENV=production pnpm build
touch out/.nojekyll                         # 阻止 Jekyll 处理 _next/ 下划线目录
MAIN_HASH=$(git rev-parse --short HEAD)
cd out
git init -q -b gh-pages
git remote add origin https://github.com/forge-ui/forge.git
git add -A
git commit -q -m "deploy: main@${MAIN_HASH}"
git push -f origin gh-pages
cd .. && rm -rf out/.git
```

1-2 分钟后 [forge-ui.github.io/forge](https://forge-ui.github.io/forge/) 生效。

## 技术栈

Next.js 16 (App Router, `output: export`) · React 19 · Tailwind CSS v4 · TypeScript

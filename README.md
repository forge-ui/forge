# Forge

Forge UI Kit 的文档站 + 组件 showcase。只消费组件，不产组件。

- **线上**: https://forge-ui.github.io/forge/
- **UI Kit 包**: [`@forge-ui/react`](https://github.com/forge-ui/forge-core)（GitHub Packages, private）
- **对外 AI 协作指引**: `/docs/agents-md`

## 这个仓里有什么

```
src/app/
├── docs/          接入文档（quick-start / agents-md / ui-for-agents）
├── cases/         每个组件一个示例页，铺 color / size / variant 矩阵
├── components/    组件规格页（props、变体说明）
└── templates/     业务模板：auth 套件 / ecommerce 后台 / dashboard-builder
```

组件实现、设计 token、布局壳都在另一个仓 [`forge-ui/forge-core`](https://github.com/forge-ui/forge-core)（发布为 `@forge-ui/react`）。本仓只是它的消费者和展示台。

## 本地起站

```bash
# 1. 拿一个有 read:packages scope 的 GitHub PAT
export GITHUB_TOKEN=ghp_xxx

# 2. 装依赖（从 GitHub Packages 拉 @forge-ui/react）
pnpm install

# 3. 起 dev
pnpm dev --port 3456 --hostname 0.0.0.0
```

访问 http://localhost:3456。前提是你的账号被加进了 forge-ui 的 team，否则包拉不下来。

## 部署

推 `main` 分支 → `.github/workflows/pages.yml` 自动 build + 部署到 GitHub Pages。`next.config.ts` 里 `output: "export"`，产物走 GitHub Pages artifact。

## 技术栈

Next.js 16 (App Router, `output: export`) · React 19 · Tailwind CSS v4 · TypeScript

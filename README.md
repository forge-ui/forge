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

`main` = 源码；`gh-pages` = 静态构建产物。Pages source 配成 **Branch: `gh-pages` / path: `/`**。

每次要更新线上站：

```bash
# 1. 本地 production build
NODE_ENV=production pnpm build

# 2. 阻止 GitHub Pages 用 Jekyll 处理 _next/ 下划线目录
touch out/.nojekyll

# 3. 把 out/ 当成一个临时 git 仓 push gh-pages 分支
MAIN_HASH=$(git rev-parse --short HEAD)
cd out
git init -q -b gh-pages
git remote add origin https://github.com/forge-ui/forge.git
git add -A
git commit -q -m "deploy: static export from main@${MAIN_HASH}"
git push -f origin gh-pages
cd .. && rm -rf out/.git
```

走完一遍站点会在 1-2 分钟内更新。

> **为什么不用 GitHub Actions workflow？**
> forge 仓的默认 `GITHUB_TOKEN` 拉不到另一个 user/org 下的 private package（`@forge-ui/react`）——除非在 package settings 里单独授权。本地 build 后推产物绕过这个限制，也省了 PAT 管理。

## 技术栈

Next.js 16 (App Router, `output: export`) · React 19 · Tailwind CSS v4 · TypeScript

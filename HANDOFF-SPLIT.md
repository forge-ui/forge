# Handoff: 拆分 forge / forge-core + 写 /docs/quick-start

交接给另一个窗口执行。读完这份文档就能独立开工。

---

## 1. 背景

当前 `forge` 仓库一锅炖：UI Kit 源码 + 案例 + 模版 + 文档站都挤在一起。
决定拆成两个仓库，让组件成为"对外正式产物"，让壳站只消费产物。

- `forge` → 文档站 + 案例 + 模版（壳站，公开或内部皆可）
- `forge-core` → UI Kit 源码 + 构建产物，发 `@forge-ui/react` 到 GitHub Packages 私有库

拆完后：
- 用户看到的 `forge` 站就是"用 @forge-ui/react 拼的站"，自己吃自己的狗粮
- `forge-core` 内部保留一个 preview 环境跑组件开发态（Storybook 或最简 playground）
- 权限靠 GitHub org team 管：`@forge-ui/core` org → team 有 `read:packages` 才能安装

## 2. 目标架构

```
forge-core/                         # 新仓库
├── src/
│   ├── components/ui/              # ← 从 forge/src/components/ui 搬过来
│   ├── components/layouts/         # ← 从 forge/src/components/layouts 搬过来
│   ├── lib/utils.ts                # ← cn helper
│   ├── styles/tokens.css           # ← 从 globals.css 抽 token 和基础层
│   └── index.ts                    # 统一 barrel export
├── preview/                        # 内部开发预览（Next.js 或 Vite，决定一个）
├── package.json                    # name: @forge-ui/react
├── tsup.config.ts                  # 或 rollup，打 ESM + dts
└── .github/workflows/publish.yml   # tag push → 发 GitHub Packages

forge/                              # 现仓库瘦身
├── src/
│   ├── app/                        # 文档站 + cases + templates + dashboard-builder
│   ├── components/                 # 只留站点自己的组件（site-header 等）
│   └── lib/                        # 站点工具
├── .npmrc                          # 配 GitHub Packages registry
└── package.json                    # 依赖 @forge-ui/react，不再自带组件源码
```

### 关键约束

- **forge 只吃正式版**：开发期间不搞 `link:` `file:` `pnpm link`，直接装发布版。forge-core 改了就发 prerelease（如 `0.2.0-next.3`），forge 升版本验收。本地联调靠 forge-core 的 preview 环境，不靠 forge。
- **peerDependencies**：react >=19, react-dom >=19, tailwindcss ^4, solar-icon-set ^2。不打包进产物。
- **样式分发**：token + 基础层编译成 `dist/styles.css`，消费方 `@import "@forge-ui/react/styles.css"`。
- **Tailwind v4 联动**：消费方的 Tailwind 要能扫到 node_modules 里的 class，用 `@source "../node_modules/@forge-ui/react/dist/**/*.js"`（具体路径装完实测）。

## 3. 现状快照（动手前先读）

- forge 现依赖：next 16.2.2 / react 19.2.4 / tailwindcss ^4 / solar-icon-set ^2.0.1
- `src/components/ui/` 共 75 个文件 + `charts/` 子目录
- `src/components/layouts/` 有 `app-layout.tsx`、`sidebar-popovers.tsx`、`index.ts`
- `src/lib/utils.ts` 是 cn helper
- `src/app/globals.css` 里 token 很多，fg-violet / fg-blue / fg-grey / fg-black 等全家桶 + `@theme` 映射
- 站点代码散落在 `src/app/` 下：`(showcase)/cases`、`dashboard-builder`、`templates`、`docs`

## 4. 拆分执行步骤

### Phase 1 — 建 forge-core 仓库

1. 在 github.com/forge-ui 下建空仓库 `forge-core`
2. 本地 init，加 `package.json`：
   ```json
   {
     "name": "@forge-ui/react",
     "version": "0.1.0",
     "type": "module",
     "main": "./dist/index.js",
     "module": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
       "./styles.css": "./dist/styles.css"
     },
     "files": ["dist"],
     "peerDependencies": {
       "react": ">=19",
       "react-dom": ">=19",
       "tailwindcss": "^4",
       "solar-icon-set": "^2"
     },
     "publishConfig": {
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```
3. 配 tsup（或 rollup + postcss 单独编译 css）：产物 ESM + dts + styles.css
4. `.github/workflows/publish.yml`：tag `v*` 触发 `pnpm build && pnpm publish`，auth 用 `GITHUB_TOKEN`

### Phase 2 — 搬代码

从 forge 拷（不是 move，先保留一份回退）：

- `src/components/ui/*` → `forge-core/src/components/ui/*`
- `src/components/layouts/*` → `forge-core/src/components/layouts/*`
- `src/lib/utils.ts` → `forge-core/src/lib/utils.ts`
- 从 `src/app/globals.css` 抽出 token 定义 + `@theme` 映射 + 基础层 → `forge-core/src/styles/tokens.css`

写 barrel `src/index.ts`，统一 `export * from "./components/ui/button"` 等。

### Phase 3 — 首次发版

1. forge-core `pnpm build` 本地跑通
2. `git tag v0.1.0 && git push --tags` 触发 workflow
3. 在 https://github.com/orgs/forge-ui/packages 确认发包成功

### Phase 4 — forge 改造成消费者

1. forge 根目录加 `.npmrc`：
   ```
   @forge-ui:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
2. `pnpm add @forge-ui/react@0.1.0`
3. `src/app/globals.css` 删掉 token 定义，改成 `@import "@forge-ui/react/styles.css"`
4. 全局替换 import：`@/components/ui/*` → `@forge-ui/react`，`@/components/layouts` → `@forge-ui/react`，`@/lib/utils` → `@forge-ui/react`（或保留 utils 在本地，二选一）
5. 删 `src/components/ui/`、`src/components/layouts/`、`src/lib/utils.ts`
6. 跑 `pnpm dev --port 3456 --hostname 0.0.0.0`，挨个路由点一遍确认没炸

### Phase 5 — forge-core preview 环境

在 `forge-core/preview/` 起一个最简 Next.js 或 Vite，`src` 直接 import `../src/index`（不经发布）。每加一个组件在 preview 里建一页验证。这份 preview 不发布、不出网。

## 5. /docs/quick-start 文档页内容

文件位置：`forge/src/app/docs/quick-start/page.tsx`（可能目前还不存在，创建）

用现有 docs 的页面骨架（参考 `src/app/docs/page.tsx` 里的 `DocSection` / `PageHeading` 等组件）。

### 页面结构（三大块）

**一、装**
- 前置条件：Next.js 16+ / React 19+ / Tailwind v4 项目
- `.npmrc` 配置示例（带注释说明 GITHUB_TOKEN 需要 `read:packages` 权限）
- 一句话："找 @forge-ui/core 管理员在 team 里加你，才能拉到包"
- 安装命令：`pnpm add @forge-ui/react`

**二、接**
- 在 `app/globals.css` 顶部加 `@import "@forge-ui/react/styles.css";`
- Tailwind v4 配置：`@source "../node_modules/@forge-ui/react/dist/**/*.js";`（Phase 4 实测后确认精确路径）
- peerDeps 提醒：solar-icon-set 要自己装

**三、用**
- 最小示例：
  ```tsx
  import { Button } from "@forge-ui/react";

  export default function Page() {
    return <Button>Hello Forge</Button>;
  }
  ```
- 贴一张渲染截图（跑起来之后截一张 button 效果）

**底部三条路标**（卡片或列表）：
- 看全部组件 → `/components`
- 看拼好的页面 → `/templates`
- 给 AI 写规则 → `/ui-for-agents`

### 写作风格

- 参考现有 `/docs/page.tsx` 的冷静直白风格，不喊口号
- 不要"从零起 Next 项目"那一段，让用户自己 `create-next-app`
- 代码块配一两句说明就够，不要逐行讲解
- "常见问题"先不写，等真有用户问再补

## 6. 验收标准

- [ ] forge-core 成功发 `@forge-ui/react@0.1.0` 到 GitHub Packages
- [ ] forge 删光 `src/components/ui/` `src/components/layouts/` 后仍能 `pnpm dev` 且所有路由正常渲染
- [ ] forge 的 `node_modules/@forge-ui/react/dist/` 能看到 js + d.ts + styles.css
- [ ] `/docs/quick-start` 页面按上面三块渲染出来，代码块语法高亮正常
- [ ] 用 Phase 5 的 preview 至少能点开一个组件页（证明 forge-core 自身闭环）

## 7. 注意事项 / 踩坑提醒

- **Tailwind v4 @source 路径**：这个拆完得实测，别想当然。如果 utility class 没生效，十有八九是 @source 没扫到
- **solar-icon-set 是 peerDep 不是 dep**：消费方必须自己装，不然 runtime 挂
- **token CSS 变量**：`styles.css` 是全局注入到 `:root`，消费方不 import 的话所有 fg-* token 全失效
- **charts 子目录**：`src/components/ui/charts/` 一起搬，barrel 别漏 export
- **accent-utils.ts / calendar-utils.ts / card-utils.tsx**：也是 ui 目录下的内部工具，跟着搬但不一定 export（看有没有被外部引用）
- **不要在 forge 里用 link: 或 pnpm link**：用户明确说了"forge 就是直接使用正式版"。改 core 就发 `-next.x` prerelease，forge 升版本
- **globals.css 里可能有基础层样式（不是 token）**：比如 body reset、字体，这部分要不要打进 styles.css 得斟酌。偏安全做法：只把 token 抽走，基础层留给消费方自己管
- **solar-icon-set 版本**：forge 现在锁 `^2.0.1`，forge-core peerDep 写 `^2` 就行，别写死
- **开发期间 forge-core 改完怎么联调**：preview 环境里改，不要跑 forge 联调。forge 只在发新版之后升级验收
- **HANDOFF 完成后**：这份 md 可以删，或者进 `docs/handoff-archive/` 存档

## 8. 本文档未决 / 交给执行方判断

- tsup 还是 rollup（tsup 更简单，rollup 更可控，选 tsup 我觉得够了）
- preview 用 Next.js 还是 Vite（forge 本身 Next，用 Next 保一致性；Vite 启动更快但双栈）
- `cn` helper 要不要从 forge-core export 出去让 forge 也用（推荐：export，避免重复）
- globals.css 里的基础层（非 token）处理方式 —— 建议先只搬 token，基础层留 forge 侧

---

有疑问回来问，不要硬猜。

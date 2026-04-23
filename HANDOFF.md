# Handoff（2026-04-21）

交接给下一轮 Claude。新窗口第一条消息：「读 `/Users/hesong/Documents/gihub_space/forge/HANDOFF.md` 然后接着做」。

## 项目

- 路径：`/Users/hesong/Documents/gihub_space/forge`
- 技术栈：Next.js 16 + React 19 + Tailwind v4 + TypeScript
- 定位：基于 Figma（Protask + Majin UI Kit）还原的 ToB SaaS 脚手架
- Dev：`pnpm dev --port 3456 --hostname 0.0.0.0`（**常驻**，别自己启 next dev）
- 用户偏好：中文回复、技术名词保留英文

## 目录结构（已扁平化，无 `(showcase)` 路由组）

```
src/app/
├── _components/site-header.tsx       顶部 tabs: 文档 / 组件 / 矩阵 / 模版
├── cases/                【矩阵版路由，用户暂不动】
│   ├── _shared / _nav / _toc / _preview-block / _api-table / layout
│   └── 24 子目录（11 空白占位 + 13 老矩阵）
├── components/           【HeroUI 精致版路由，24 个齐全】
│   ├── _shared / _nav / _toc / _preview-block / _api-table / layout
│   └── 24 子目录
├── docs/                 文档站（Introduction / Quick Start 占位，UI for Agents + AGENTS.md 完整）
├── templates/            模板入口
└── sign-in/ sign-up/ forgot-password/ reset-password/   登录套件

src/components/
├── ui/                   60+ UI 组件源（禁改）
└── layouts/app-layout.tsx  AppLayout（禁改）

.claude/skills/forge/
├── SKILL.md              主入口
└── references/
    ├── components/       72 个 md（56 精填 + 16 骨架）
    ├── tokens.md icons.md workflow.md   专题（已详填）
    ├── cases-index.md    简版
    └── templates/auth.md templates/business.md
```

## 进度

- **Skill md 组件**：56/72 精填。剩余 16 个骨架：`calendar-day-cell / calendar-week-row / charts / currency-converter / event-card / event-tag / filter-panel / filter-trigger / forms / full-calendar / image-grid / product-row / rating-stars / small-calendar / small-daily-calendar / style-guide`
- **Components/**：24/24 都是 HeroUI 风格（Preview + Code + API 表）
- **Cases/**：11 空白占位 + 13 老矩阵未动（旧版本已不可恢复，git 没 commit 过）
- **Docs/**：UI for Agents 和 AGENTS.md 两页内容完整；Introduction 和 Quick Start 是 `DocTBD` 占位

## 硬约束（别违反）

1. **不改 Kit 源** — `src/components/ui/` 和 `src/components/layouts/` 是组件库，只读不写
2. **HeroUI 精致版原则** — `components/` 下每个变体 1-3 个代表即可，不铺全（9 色放 1 个代表，3 尺寸放 1 个代表）。API 表列完整 prop 取值范围。**Table 是例外**：Body Cell 是 15 种独立内容形态，要铺全；Header Cell 只 3 种（标准/选择列/动作列）
3. **API 表字符串 type 用单引号** — `'purple'` 不是 `"purple"`
4. **颜色走 fg-\* token** — 禁用 `text-blue-500` 类裸色；全部 `text-fg-violet` / `bg-fg-grey-100`
5. **Icon 走 `solar-icon-set` + `color` prop** — className 颜色无效（库 fill 写死）
6. **布局用 `<AppLayout>`** — 业务页不自拼 sidebar + topbar
7. **cases/ 目录暂时别动** — 用户保留决定权
8. **不 git commit** — 等明确指示
9. **事件 handler 注意 client boundary** — `onClick` / `onChange` 等要 `"use client"`
10. **不瞎铺变体堆砌** — 上一轮翻车：对 Header Cell 铺 24 个同样的 "Product"，污染判断。精致 > 完整

## 下一步任务（按优先级用户选）

A. 填剩余 16 个 Skill md 骨架  
B. 审视 `components/` 24 页，挑过度铺陈或欠缺的修  
C. 恢复/重写 `cases/` 13 个老矩阵（工作量大，旧版已失）  
D. 填 `docs/` 的 Introduction + Quick Start 正文  
E. 发布相关（README、pkg、license）

## 关键文件 & 惯例

- `src/app/globals.css` — `--fg-*` token 定义（改色动这里）
- `AGENTS.md`（顶层）— 内部开发 case 复核/重写工作流
- `components/_preview-block.tsx` — HeroUI 风格 Preview+Code 折叠
- `components/_api-table.tsx` — `ApiTable` / `CodeBlock` / `InlineCode` 复用组件
- `components/_shared.tsx` — `PageHeading` / `Section` / `SubSection`

## 已踩坑（先记下，别重犯）

- `solar-icon-set` className 颜色无效 → 走 `color="#HEX"` prop
- `p-Y` wrapper 会压扁 SVG → icon 外只给 `w-X h-X` 方盒
- `(showcase)` 路由组已移除，所有路径直接 `src/app/xxx/`
- `ChartLegendItem` 必填 `value` prop
- `MultilayerDonutChart.layers` 是扁平 `DonutLayer[]`
- `BarUpsideDownChart` data 要 `{ upperValue, lowerValue }`
- cases 目录从未被 git tracked，丢了恢复不了
- Subagent 批量 Write md 曾被 sandbox 拒（原因未明），直接自己填更稳

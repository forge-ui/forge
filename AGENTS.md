<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 这个仓是什么

`forge/` 是 **Forge UI Kit 的 showcase + 文档站**（壳站）——只消费，不产组件。

Kit 源码与 token 都在 **另一个仓 `forge-core/`**（发布为 `@forge-ui/react`）。本仓通过 GitHub Packages 装 `@forge-ui/react`，然后拿 `src/app/cases/*` 作为组件矩阵展示，`src/app/docs/*` 作为接入文档。

## 本仓能改什么、不能改什么

| 场景 | 动在哪 |
|---|---|
| 改 case 页布局 / 铺变体 / 修演示数据 | ✅ 本仓 `src/app/cases/<name>/page.tsx` |
| 改 docs 站文案 / 导航 / 结构 | ✅ 本仓 `src/app/docs/**` |
| 改 `_shared.tsx` / `_nav.tsx` / `_toc.tsx` 等 case 工具 | ✅ 本仓 |
| **加 / 改组件本体** | ❌ 去 `forge-core/src/components/ui/` |
| **加 / 改颜色 token / shadow / font-size** | ❌ 去 `forge-core/src/styles/tokens.css` |
| **改 Kit 组件 API（加 prop / 改类型）** | ❌ 去 `forge-core/` 改完重发版，再升本仓 `@forge-ui/react` 依赖 |

简言之：**本仓只写 case 页与文档，组件和 token 都回 `forge-core/` 改**。碰到 "这个颜色不对 / 这个组件缺个 variant" → 停下告诉用户，由用户决定是去 Kit 仓扩还是在 case 页绕过。

---

# 复核 / 重写 case 的硬规则

每次开始复核或重写一个 case（例如 badge / filter / card / ...），必须先完成以下三件事，缺一不可：

1. **读 `figma-code/<name>.md` 的原始 Dev Mode 代码**（分区标题、变体、颜色、尺寸映射）
2. **读文件开头的 Figma 链接**（第一行 `https://www.figma.com/design/...`），记录下来便于人工核对
3. **看实际渲染的截图**：
   - 用 gstack 截当前 `/cases/<name>` 页面看现状
   - 如果 `figma-code/screenshot/` 没对应截图，把 `figma-code/<name>.md` 的 HTML 渲染成临时 HTML（tailwind CDN）+ 启本地 server + gstack 截图，对照 Figma 设计看样
   - 不要只凭 Dev Mode HTML 下判断，渲染出来的样子才算数

三件齐备再开口诊断"现状跟 Figma 对不对得上"。不要跳步骤。

---

# 新建 / 重写 case 的工作流

## 铁律

- case 页**只能** `import { X } from "@forge-ui/react"`，禁止手搓 `<div class="bg-...">` 复刻 Figma。Kit 里没有 → **停下问用户**，不要就地造。用户会决定是扩 `forge-core/` 还是在 case 里绕过去。
- Figma 细节（装饰、mock 数据、icon）也**一律抽组件**。抽组件在 **Kit 仓**里做，不在本仓的 case 页里。
- Icon 走 `solar-icon-set`，不要 inline SVG（文件类型 icon 除外，那是 `public/images/file-icons/` 下的资产）。
- Figma 还原**不用 MCP**，用用户给的"截图 + Dev Mode 原始代码"（后者通常在 `figma-code/<name>.md`）。
- 颜色/字号对不上时：**hex 是真相**，不是 class 名。token 不够回 `forge-core/src/styles/tokens.css` 扩，不要在本仓 `src/app/globals.css` 里打补丁。

## 输入（用户会给什么）

1. Figma 截图（展示目标样式）
2. `figma-code/<name>.md`（Dev Mode 导出的 HTML + 链接）
3. Figma 原始链接（在 md 第一行）

三样齐了才开始动。**复杂矢量图（文件夹、装饰插画等）Figma Dev Mode 会输出占位 div（如 `bg-amber-400`），不是真实 SVG** —— 碰到这种直接找用户要 SVG，别自己画。

## 流程

1. **读三件套**：`figma-code/<name>.md` + Figma 链接 + 已有截图（如果是复核）
2. **识别缺的组件 / token**：
   - 缺 color / shadow / radius → 告诉用户，让用户决定是否去 `forge-core/src/styles/tokens.css` 扩（8 色 × 10 shade 命名：`--fg-{hue}-{50..900}`，@theme inline 里加对应 `--color-fg-*` alias）
   - 缺组件 → 告诉用户，让用户决定是否去 `forge-core/src/components/ui/` 加
   - Kit 仓改完 → 重发版 → 本仓升 `@forge-ui/react` → 继续 case 页
3. **写 case 页**：`src/app/cases/<name>/page.tsx`
   - 用 `_shared` 里的 `PageHeading` / `Section` / `SubSection` / `Labeled`
   - **PageHeading 的 title 不要和第一个 Section 的 title 重名**（会显示两遍）
   - 组件所有变体都铺出来：按 color × size × variant 做矩阵
   - 有 dark 变体就单独开 Section `Matrix — dark`，用 `bg-fg-black p-6 rounded-xl` 包一层
4. **加到 `_nav.tsx`**：顺手加，别漏
5. **自检**：
   - `pnpm tsc --noEmit`
   - 截图看（见下节）

## Dev 环境

**`pnpm dev --port 3456 --hostname 0.0.0.0` 应该已经常驻**，别自己另起 `next dev`。
访问 `http://localhost:3456/cases/<name>` 看。

## 截图（browse 工具坏了就用这个）

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --hide-scrollbars \
  --screenshot=/tmp/<name>.png \
  --window-size=1600,<足够高> \
  http://localhost:3456/cases/<name>
```

然后 `Read` 这个 PNG 给用户看。高度按内容估，Progress 这种多 Section 页 3000+ 起步。

## 常见坑（都踩过）

- **Tailwind 扫不到 Kit 的 class**：`globals.css` 缺 `@source "../../node_modules/@forge-ui/react/dist"`，Kit 组件会渲染成裸 div。这是 Tailwind v4 必须的。
- **solar icon 颜色被覆盖**：`<Icon className="text-fg-red" />` 不生效，因为库里 fill 写死。用 `color="#HEX"` 或 `color="var(--fg-violet)"` prop。
- **solar icon 被压扁**：外层给了 `p-Y` 或固定 height 的 wrapper 会压 SVG。icon 外层只给 `w-X h-X` 的 square box。
- **PageHeading 和 Section title 重复**：user 会直接截图说"有两个 XX"。PageHeading 讲页面主题，Section 讲子块。
- **Figma class 名对不上 Tailwind**：Dev Mode 输出 `bg-amber-400` 不代表 Tailwind 就有这个色，看 hex 来判断映射到哪个 `fg-*` token。Kit 里没对应 token → 去 `forge-core` 扩。
- **文件资产重名 / 错位**：`public/images/file-icons/*.svg` 有过 avi ↔ ppt 错配，改之前先 `grep "<g id="` 验一下。
- **升级 Kit 版本后组件报错**：重发版里改了 API？看 `forge-core` 的 CHANGELOG（如果有）或 `@forge-ui/react` 的 types diff。

## 复核三件套（from 硬规则上面那段）

每次复核前必须：figma-code md + 原始 figma 链接 + **实际渲染截图**，三件齐备再开口。

## 提交前自检清单

- [ ] case 页只 `import @forge-ui/react`，无手搓 div 复刻
- [ ] 没有在本仓私自扩 Kit 或 token（该扩的都回了 `forge-core`）
- [ ] 覆盖 Figma 所有 variants（color / size / state / dark）
- [ ] `_nav.tsx` 已加入口
- [ ] `pnpm tsc --noEmit` 通过
- [ ] 截图与 Figma 对照过
- [ ] PageHeading title ≠ 任一 Section title

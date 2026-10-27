# 组件解剖示例

关键组件的尺寸图挂在设计规范里，给设计和审计对照源码。它是静态 HTML，不打进 `@forge-ui-official/core`。

**新关键组件入库须附解剖示例；无图不得标组件文档完成。**

画图步骤用 [`skills/dimensional-drawing/SKILL.md`](../../skills/dimensional-drawing/SKILL.md)。`examples/dialog-sheet.html` 是通用练习稿（宽 420、内边距 14、圆角 16），不是 Forge 的 Dialog。

## 已挂上的图

| 组件 | HTML | PNG | 源码 |
| --- | --- | --- | --- |
| Dialog（ConfirmationDialog + DialogSurface） | [`/design/anatomy/dialog.html`](../../public/design/anatomy/dialog.html) | [`dialog.png`](../../public/design/anatomy/dialog.png) | `core/src/components/ui/confirmation-dialog.tsx`、`core/src/internal/dialog-surface.tsx`、`core/src/styles/tokens.css` |
| DataTable | [`/design/anatomy/data-table.html`](../../public/design/anatomy/data-table.html) | [`data-table.png`](../../public/design/anatomy/data-table.png) | `core/src/components/ui/data-table.tsx`、`core/src/components/ui/checkbox.tsx`、`core/src/styles/tokens.css` |

Kit 入口：[`/components/style-guide`](../../src/app/components/style-guide/page.tsx)（设计规范）、[`/components/modal`](../../src/app/components/modal/page.tsx)（确认弹窗）、[`/components/table`](../../src/app/components/table/page.tsx)（数据表格）。

单位：Tailwind 间距是 `0.25rem`，本仓没有改 `--spacing`。下表 px 按根字号 16px。`rem` 工具类如果根字号不是 16px，px 会跟着变。

## Dialog token 对照

平面是默认 `layout="spread"`、各一行文案。高度会随换行变，276 只是这一行参考，不是固定 token。

| 图上 | 源码 | 值 |
| --- | --- | --- |
| S1 | `p-6` | 24 |
| S2 | 图标槽 `p-4` | 16 |
| S3 | 图标和文案 `gap-4` | 16 |
| S4 | 标题和说明 `gap-3` | 12 |
| S5 | 文案块和按钮 `gap-8` | 32 |
| S6 | 按钮 `px-4` | 16 |
| S7 | `layout="right"` 的按钮 `gap-3` | 12。spread 没有这个 gap，中间是 `justify-between` 的剩余空间 |
| S8 | 按钮 `py-3.5` | 14 |
| W | `max-w-[480px]` | 480px |
| Ws | `.forge-modal` 的 `width` | `min(480px, calc(100vw - 2rem))` |
| B | `outline-1` + `outline-offset-[-1px]` | 1px，画在盒子内侧，不加进宽高。ConfirmationDialog 按钮有这圈线；外壳在 DialogSurface 上是 `border-0` |
| I1 | Kit 示例 `size={32}` | 32。组件 CSS 不写死图标尺寸 |
| Z1 | `I1 + 2·S2` | 64（仅当 I1 = 32） |
| H4 | 标题 `leading-8` | 32。字号 `text-xl` = 20 |
| H6 | 说明 `leading-6` | 24。字号 `text-base` = 16 |
| LH | 按钮 `text-sm` 的默认行高 | 20（Tailwind 4.3.3 `--text-sm--line-height: calc(1.25 / 0.875)`） |
| H3 | `2·S8 + LH` | 48 |
| Wb | `w-32` | 128 |
| R1 | `--radius-card` | 20 |
| R4 | 按钮 `rounded-full` | H3 ÷ 2 = 24 |
| R5 | 图标槽 `rounded-full` | Z1 ÷ 2 = 32（仅当 I1 = 32） |
| Tk | `tracking-fg` | 0.5px |
| V1 | `calc(100vw - 2rem)` / `calc(100dvh - 2rem)` 两侧各留 | 1rem = 16 |
| MH | `.forge-modal` `max-height` | `100dvh - 2rem` |
| A | `.forge-dialog::backdrop` | alpha 0.35。色相不画 |
| 阴影 | DialogSurface `shadow-xl` | Tailwind 4.3.3 默认，两层：`y 20 / blur 25 / spread -5` 和 `y 8 / blur 10 / spread -6`。不是 `--shadow-card`。`open` 省略时没有这层阴影 |

`Modal`（`core/src/components/ui/modal.tsx`）用同一个 DialogSurface，内层不是这张平面：`p-6`（24）、`gap-6`（24）、标题行 `gap-4`（16）、标题 `text-xl` 且没有 `leading-8`（行高 28）、关闭按钮 `IconButton size="sm"`（`w-8 h-8` = 32，`p-1.5` = 6，图标 `size={20}`）、页脚 `gap-3`（12）。它还没有单独的解剖图。

## DataTable token 对照

外壳是 `w-full`。图上的 512 只是「勾选 + 身份列 + 普通列 + 操作列」这套 `getDefaultTableMinWidth` 配方，不是外壳宽度。

| 图上 | 源码 | 值 |
| --- | --- | --- |
| W | `w-full` | FILL |
| Wm | `56+240+128+88` | 512，只属于这张配方 |
| S1 | 表头和页脚 `p-5` | 20 |
| S2 | 标题和副标题 `gap-2` | 8 |
| S3 | 表头、页脚 `gap-3` | 12 |
| S4 | 标题组和 badge `gap-4` | 16 |
| S5 | 普通单元格 `px-5` | 20 |
| S6 | 普通单元格 `py-3.5` | 14 |
| S7 | 勾选列 `px-6` | 24 |
| S8 | 勾选列 `py-4` | 16 |
| S10 | 分页按钮之间 `gap-2` | 8 |
| S11 | 页码按钮 `p-2` | 8。高度由 `h-10` 决定 |
| S12 | 上一页 / 下一页 `p-2.5` | 10。加图标 20 后也是 40 |
| B | 外壳 `outline-1` + `outline-offset-[-1px]` | 1px，内侧 |
| Br | `border-fg-grey-200` | 1 |
| Wc | 勾选列 `w-14` | 56 |
| Zc | Checkbox `w-5 h-5` | 20 |
| Bc | Checkbox `border-2` | 2 |
| Rm | Checkbox `rounded-md` | Tailwind `--radius-md` 0.375rem = 6。本仓只改了 `--radius-xs`，没有改 `--radius-md` |
| Wi | `getDefaultTableMinWidth` 身份列项 | 240。不是单元格 CSS 宽度 |
| Wx | 身份列 `max-w-[280px]` 和 `maxWidth: 280` | 280。CSS 宽度是 `w-[1%]` |
| Wd | 普通列的 minWidth 项 | 128 |
| Wa | `key === "actions"` 或空表头 | 88 |
| Ht | 标题 `text-sm` + `leading-5` | 字号 14，行高 20 |
| Hs | 副标题 `text-xs` + `leading-4.5` | 字号 12，行高 18 |
| H10 | 单元格助手 `h-10` | 40。`td` 自己没有这个高度 |
| Hb | `2·S1 + Ht + S2 + Hs` | 86，标题和副标题各一行，且操作槽不更高 |
| Hh | 有勾选时表头行取较高的单元格 | `max(2·S8+Zc, 2·S6+Ht)` = 52 |
| Hr | 单元格含 `h-10` 时 | `max(2·S8+Zc, 2·S6+H10)` = 68 |
| Hf | `2·S1 + Zp` | 80 |
| Zp | 页码 `w-10 h-10` | 40 |
| Rp | 分页 `rounded-full` | 20 |
| Is / Ig | 排序按钮 `w-4 h-4`，图标 `size={10}` | 16 / 10 |
| R1 | `--radius-card` | 20 |
| 阴影 | DataTable 根节点 | 无。不要用 `--shadow-card` 去补 |
| 空状态 | `px-5 py-10` | 横 20，竖 40。不是正文行 |

勾选列：`2·S7 + Zc = 68`，大于列宽 56。控件从内容区溢进尾部 padding，起点 24 + 控件 20 = 44，仍落在 56 的列框里。图上的 Detail C 标的是这个差，不是列框外面还有一截。

`FullWidthTable` 表头是 `gap-4`（16），不是 DataTable 的 `gap-3`。这张图不覆盖它。

## 扩展清单

这些还没有解剖图。缺图时不能把对应组件文档标完成。

- Button
- 表单（TextField 等）
- Calendar
- Chart
- Card
- Toolbar
- Tooltip
- File
- Avatar
- Modal 内层（见上，和 ConfirmationDialog 同壳、间距不同）

## 自测

2026-10-27，在本机用 headless Chrome 打开两个 HTML（`window 1800×1700`，脚本同步画进 SVG）：

| 文件 | DOM 里的 `<rect>` | 抽到的标注 |
| --- | --- | --- |
| `public/design/anatomy/dialog.html` | 166 | `p-6 = 24`、`gap-8 = 32`、`w-32 = 128`、`--radius-card = 20`、`shadow-xl`、`1rem = 16`、`H1  276` |
| `public/design/anatomy/data-table.html` | 158 | `p-5 = 20`、`w-14 = 56`、`h-10 = 40`、`--radius-card = 20`、`rounded-md = 6`、`none on DataTable`、`WM  512` |

同一次渲染写出旁边的 PNG。本环境没有 Forge Design 本机桥，上面是静态文件的打开结果，不是浏览器里点 Kit 页面的交互记录。

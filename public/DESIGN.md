# DESIGN.md — Forge UI

给编码助手读的 Forge 视觉规则。组件 API 见 https://forgeui.org/llms-components.md ，完整规范见 https://forgeui.org/llms-full.md 。

## 总原则

- 组件从 `@forge-ui-official/core` 引入，图标从 `@forge-ui-official/core/icons` 引入。库里已有的组件不要用 div 重做。
- 颜色、字号、圆角、阴影走 token，业务代码里不写 `#hex` 和裸 px。
- 先确定页面角色（dashboard / collection / detail / detail-modal / form-modal / form-page / settings），再从同角色的模板或页面组件起步。
- 宿主已有 AppLayout 时不再嵌套第二套壳；壳层 padding 只算一次。

## 颜色

- 默认主色是蓝色：`--accent` = `fg-blue`（#3553FF），焦点环 `--focus` 同色。紫色、黑色是可选主题，不是默认。
- 组件的 color prop 用 `"purple"`，对应 CSS token `fg-violet`；不要写 `color="violet"`。
- 优先用语义 token，没有合适的再用色阶：
  - 文字：`--text-primary`（fg-black #000A19）、`--text-secondary`（fg-grey-900）、`--text-muted`（fg-grey-700）、`--text-disabled`（fg-grey-500）。
  - 背景：`--background`（白）、`--surface`（fg-grey-50）、`--overlay`（rgba(0,10,25,.40)）。
  - 边框：`--border` / `--divider`（fg-grey-200）、`--border-muted`（fg-grey-100）。
  - 状态：`--danger`（fg-red）、`--warning`（fg-yellow，前景用 fg-black）。
- 色族：violet、blue、green、red、yellow、cyan、black，加 grey 和 white，每族 50–900 十档，500 是基准。Tailwind 写法 `bg-fg-blue-500`、`text-fg-grey-700`。
- fg-black 是 #000A19，不是纯黑。默认弱化图标色 #71717A。

## 字色层级

- 标题和正文用 fg-black，次要信息 fg-grey-900，辅助说明 fg-grey-700。
- 弱化不等于禁用：只有真正不可操作的内容才用 disabled 色。标题和正文发灰是常见错误。

## 字体

- 正文 Manrope（`--font-sans`），标题 Plus Jakarta Sans（`--font-display`）。
- 标准字距 `tracking-fg`（0.5px）。字号、字重、行高以模板实测为准。

## 形状与阴影

- 卡片和弹窗圆角 `--radius-card`（20px），输入框紧凑圆角 `--radius-xs`（4px）。
- 阴影三档：`--shadow-subtle`、`--shadow-card`（默认卡片）、`--shadow-elevated`（浮层、弹窗）。

## 状态与数据

- 状态默认用 soft StatusBadge；分类和角色用普通文字，一列表格通常最多一个状态胶囊。
- 图表系列颜色、图例和文字语义一致，不能只靠颜色区分。
- 指标写清统计口径，不编造趋势或进度。

## 交互

- 每个按钮都有真实结果或有理由禁用；不写空 handler，不放 `href="#"`。
- 异步动作有 loading 和防重复提交；破坏性动作用受控的 ConfirmationDialog 确认一次。
- 图标按钮有 aria-label；浮层可用键盘关闭并归还焦点。

## 布局

- 比例列用 Grid / GridItem；固定 280px、336px 的业务侧栏可以用普通 Grid 或 Flex。
- 搜索、筛选、批量操作放在一条工具带里。
- 表格列宽按内容分配，数字右对齐，操作列按内容收缩；宽表在卡内局部横向滚动。
- 页脚、固定工具条不能盖住内容。

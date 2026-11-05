# 公共组件与变体展示覆盖审计

生成时间：2026-10-15T06:54:42.769Z

复现：`node scripts/audit-component-coverage.mjs`。这是源码覆盖审计，不代表浏览器验收。

## 汇总

- 公共 React 组件：182。
- 组件文档页存在可达 JSX：151；父组件内部组合展示：10；缺少可达 JSX：21。
- 案例页存在可达 JSX：148；仅共享布局注入证据：11；父组件内部组合展示：12；无案例 JSX 证据：11。
- 提取有限属性轴：469。

## 判定边界与误报排除

- 以 core/src/index.ts 的真实公共导出为准，解析 ui/layouts 中 PascalCase、可调用且返回 React Element/Node 的值；排除类型、常量、工具函数和 hooks。
- 仅统计 TypeScript 符号解析后的真实 JSX 开始/自闭合标签；import、注释和代码字符串均不计展示。行号相同的多个 JSX 按列号区分。
- 从文档/案例 page 默认导出追踪本地 JSX、函数调用、匿名回调及 next/dynamic 指定的加载导出。共享布局注入单列，路径/分类条件不能视为每个页面都展示所有示例。
- 字面量证据包括显式值、条件分支、可解析常量数组的 map，以及未被 spread 覆盖的声明默认值；只证明源码可能展示，并非初始可见或浏览器通过。
- 父组件内部调用的公共子组件有单独组合证据；没有独立 JSX 调用不直接判定缺案例。
- 类型推导出的联合值仅作为候选，不抵消字面量缺口；动态状态、spread 和复杂对象循环需人工核对。
- Provider、渲染辅助、组合子组件和面向用户的组件分开分类；辅助组件无需单独业务卡，配色/尺寸/语言不要求每种配置或笛卡尔积逐一铺开。
- 有限属性统计包括组件声明的顶层样式与布尔状态；排除继承 React HTML 的通用透传属性，仅保留 disabled/checked/required/readOnly/multiple/type 等用户行为相关项。嵌套数据、焦点、时序和组合仍需跟进。
- 调用图不能解析所有业务条件，公共 dispatcher 可能使一个组件静态可达多个分类（例如 Accordion）；所有页面关联都是可达候选，不能换算为确实可见覆盖率。

“无文档 JSX”不等于完全没有文字文档；“共享注入”需根据 registry 的分类与运行时条件确认，不能按每个页面都展示计算。条件分支和参数循环仅证明源码具有展示路径；隐藏、禁用、异步等状态需要实际操作。

## 无案例 JSX 证据

CalendarWeekRow、CellProgressValue、CheckIcon、CloseIcon、ColorSection、ColorSwatch、ImageGrid、ProductRow、TypefaceBlock、TypographySizeRow、TypographyWeightSample

## 无文档页 JSX 证据

Accordion、AddMember、AppSwitcherDropdown、CalendarCard、CalendarWeekRow、CellProgressValue、CheckIcon、CloseIcon、Drawer、LiquidTabs、Modal、OtpInput、RadioWithLabel、SidebarMenu、SmallDailyCalendar、TabsContent、TextFieldSelectSuffix、ToastProvider、Toggle、TooltipGroup、TopBar

## 代表项复核

- DebitCard.variant：已见 glow；缺少 flat / gradient。
- IconButton.shape：已见 circle / square；缺少 无。
- Button.effect：已见 glass / magnetic / ripple / roll；缺少 无。
- IconButton.effect：已见 bookmark / burst / morph；缺少 send。
- TabsContent.transition：已见 fade / slide；缺少 无。
- Drawer.transition：已见 slide / reveal；缺少 无。
- TabsContent 原生滑动由 panels 属性触发，不存在 transition=scroll；须另核对 panels 调用及实际拖动。
- IconButton 的 send effect 与案例 005 的专用 CSS 飞机发送动效是两条实现路径，不可相互当作覆盖证据。
- 色彩、大小与 locale 等支持配置的完整缺口保留于 JSON；下表只列有独立意义的变体，不要求每个配置新增案例卡。

## 逐组件清单

| 组件（用途） | 源码 | 文档页可达候选 | 案例页可达候选 | 有独立意义的变体缺口（静态） |
| --- | --- | --- | --- | --- |
| Accordion（用户组件） | core/src/components/ui/accordion.tsx:71 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ActivityCard（用户组件） | core/src/components/ui/activity-card.tsx:5 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AddMember（用户组件） | core/src/components/ui/add-member.tsx:40 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AgentCodeBlock（用户组件） | core/src/components/ui/agent/agent-code-block.tsx:67 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AgentDiffTable（用户组件） | core/src/components/ui/agent/agent-diff-table.tsx:25 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AgentFlowchart（用户组件） | core/src/components/ui/agent/agent-flowchart.tsx:41 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AgentTaskRows（用户组件） | core/src/components/ui/agent/agent-task-rows.tsx:40 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AppLayout（用户组件） | core/src/components/layouts/app-layout.tsx:167 | /components/menu-sections, /components/menu-sections/[view] | /cases/menu-sections, /cases/menu-sections/[view] | mode: "dark"; pageHeaderVariant: "detail"; topbarLeftMode: "hamburger" |
| ApprovalCard（用户组件） | core/src/components/ui/agent/approval-card.tsx:21 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AppSwitcherDropdown（用户组件） | core/src/components/layouts/sidebar-popovers.tsx:352 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ArtisticIcon（用户组件） | core/src/components/ui/badge.tsx:225 | /components/badge | /cases/badge | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AskAi（用户组件） | core/src/components/ui/ask-ai.tsx:107 | /components/chat-input-bar | /cases/chat-input-bar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Avatar（用户组件） | core/src/components/ui/avatar.tsx:41 | /components/table | /cases/menu, /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| AvatarGroup（用户组件） | core/src/components/ui/avatar.tsx:93 | /components/table | /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| BalanceCard（用户组件） | core/src/components/ui/balance-card.tsx:30 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| BarChart（用户组件） | core/src/components/ui/charts/bar-chart.tsx:39 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| BarChartStatCard（用户组件） | core/src/components/ui/bar-chart-stat-card.tsx:79 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| BarHorizontalChart（用户组件） | core/src/components/ui/charts/bar-horizontal-chart.tsx:33 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| BarUpsideDownChart（用户组件） | core/src/components/ui/charts/bar-upside-down-chart.tsx:29 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Breadcrumbs（用户组件） | core/src/components/ui/breadcrumbs.tsx:22 | /components/page-header | /cases/page-header, /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| BubbleChart（用户组件） | core/src/components/ui/charts/bubble-chart.tsx:49 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Button（用户组件） | core/src/components/ui/button.tsx:88 | /components/chat-input-bar, /components/button-link, /components/table, /components/toolbar | /cases/agent, /cases/button-link, /cases/card, /cases/chat, /cases/chat-input-bar, /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ButtonGroup（用户组件） | core/src/components/ui/button-group.tsx:28 | /components/grid, /components/button-link | /cases/agent, /cases/grid, /cases/tab | 未发现重要变体的字面量缺口；不代表状态全验收 |
| CalendarCard（用户组件） | core/src/components/ui/calendar-card.tsx:43 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| CalendarDayCell（组合子组件） | core/src/components/ui/calendar-day-cell.tsx:11 | /components/calendar | /cases/calendar | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CalendarWeekRow（组合子组件） | core/src/components/ui/calendar-week-row.tsx:3 | 无 JSX 证据 | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CardAvatarGroup（渲染辅助） | core/src/components/ui/card-utils.tsx:392 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CardGlow（渲染辅助） | core/src/components/ui/card-utils.tsx:156 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CardIconChip（渲染辅助） | core/src/components/ui/card-utils.tsx:224 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CardKebabButton（渲染辅助） | core/src/components/ui/card-utils.tsx:578 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CardTrend（渲染辅助） | core/src/components/ui/card-utils.tsx:170 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellActions（组合子组件） | core/src/components/ui/data-table.tsx:569 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellCode（组合子组件） | core/src/components/ui/data-table.tsx:495 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellFile（组合子组件） | core/src/components/ui/data-table.tsx:524 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellImageText（组合子组件） | core/src/components/ui/data-table.tsx:326 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellKebabMenu（组合子组件） | core/src/components/ui/data-table.tsx:374 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellLink（组合子组件） | core/src/components/ui/data-table.tsx:619 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellMuted（组合子组件） | core/src/components/ui/data-table.tsx:314 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellNumber（组合子组件） | core/src/components/ui/data-table.tsx:432 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellProgressBar（组合子组件） | core/src/components/ui/data-table.tsx:472 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellProgressValue（组合子组件） | core/src/components/ui/data-table.tsx:355 | 无 JSX 证据 | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellRating（组合子组件） | core/src/components/ui/data-table.tsx:505 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellStatusDot（组合子组件） | core/src/components/ui/data-table.tsx:405 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellText（组合子组件） | core/src/components/ui/data-table.tsx:279 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CellTextSubtitle（组合子组件） | core/src/components/ui/data-table.tsx:291 | /components/table | /cases/table | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ChartCard（用户组件） | core/src/components/ui/charts/chart-card.tsx:38 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ChartLegendItem（组合子组件） | core/src/components/ui/charts/chart-legend-item.tsx:18 | /components/chart | /cases/chart | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ChartListItem（组合子组件） | core/src/components/ui/charts/chart-list-item.tsx:19 | /components/chart | /cases/chart | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ChartStatFooter（组合子组件） | core/src/components/ui/charts/chart-stat-footer.tsx:20 | /components/chart | /cases/chart | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ChartTooltip（组合子组件） | core/src/components/ui/charts/chart-tooltip.tsx:15 | /components/chart | /cases/chart | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ChartValueRow（组合子组件） | core/src/components/ui/charts/chart-value-row.tsx:17 | /components/chart | /cases/chart | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ChatBubble（用户组件） | core/src/components/ui/chat-bubble.tsx:62 | /components/chat | /cases/chat | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ChatInputBar（用户组件） | core/src/components/ui/chat-input-bar.tsx:49 | /components/chat-input-bar, /components/chat | /cases/agent, /cases/chat, /cases/chat-input-bar | voiceState: "recording", "processing" |
| Checkbox（用户组件） | core/src/components/ui/checkbox.tsx:45 | /components/chat-input-bar, /components/grid, /components/input-field | /cases/agent, /cases/chat-input-bar, /cases/grid, /cases/input-field, /cases/tab, /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| CheckboxControl（用户组件） | core/src/components/ui/checkbox.tsx:45 | /components/chat-input-bar, /components/grid, /components/input-field | /cases/agent, /cases/chat-input-bar, /cases/grid, /cases/input-field, /cases/tab, /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| CheckboxWithLabel（用户组件） | core/src/components/ui/forms/selection-control.tsx:320 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| CheckIcon（渲染辅助） | core/src/components/ui/plain-icons.tsx:35 | 无 JSX 证据 | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| Checklist（用户组件） | core/src/components/ui/checklist.tsx:231 | /components/checklist | /cases/checklist | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ChecklistItem（组合子组件） | core/src/components/ui/checklist.tsx:70 | /components/checklist | /cases/checklist | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CircleIcon（用户组件） | core/src/components/ui/badge.tsx:146 | /components/badge, /components/table | /cases/badge | 未发现重要变体的字面量缺口；不代表状态全验收 |
| CloseIcon（渲染辅助） | core/src/components/ui/plain-icons.tsx:21 | 无 JSX 证据 | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ColorPicker（用户组件） | core/src/components/ui/forms/icon-selector.tsx:41 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ColorSection（渲染辅助） | core/src/components/ui/style-guide.tsx:106 | /components/style-guide | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ColorSwatch（渲染辅助） | core/src/components/ui/style-guide.tsx:44 | /components/style-guide | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| CommandSearch（用户组件） | core/src/components/ui/agent/command-search.tsx:28 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| CommentItem（用户组件） | core/src/components/ui/comment-item.tsx:83 | /components/comment | /cases/comment | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ConfirmationDialog（用户组件） | core/src/components/ui/confirmation-dialog.tsx:41 | /components/modal | /cases/modal | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ContactItem（用户组件） | core/src/components/ui/contact-item.tsx:14 | /components/list | /cases/chat, /cases/menu | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ContextCards（用户组件） | core/src/components/ui/agent/context-cards.tsx:19 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| CreditCard（用户组件） | core/src/components/ui/credit-card.tsx:23 | /components/card | /cases/card | variant: "gradient" |
| CurrencyConverter（用户组件） | core/src/components/ui/currency-converter.tsx:92 | /components/other-widget | /cases/other-widget | 未发现重要变体的字面量缺口；不代表状态全验收 |
| DashedHalfDonutChart（用户组件） | core/src/components/ui/charts/dashed-half-donut-chart.tsx:52 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| DataTable（用户组件） | core/src/components/ui/data-table.tsx:941 | /components/table | /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Datepicker（用户组件） | core/src/components/ui/forms/datepicker.tsx:51 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| DebitCard（用户组件） | core/src/components/ui/debit-card.tsx:19 | /components/card | /cases/card | variant: "flat", "gradient" |
| DescriptionItem（用户组件） | core/src/components/ui/list-item.tsx:115 | /components/list | /cases/list | 未发现重要变体的字面量缺口；不代表状态全验收 |
| DonutChart（用户组件） | core/src/components/ui/charts/donut-chart.tsx:44 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Drawer（用户组件） | core/src/components/ui/drawer.tsx:12 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| DropdownDivider（组合子组件） | core/src/components/ui/dropdown-panel.tsx:33 | /components/menu | /cases/menu | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| DropdownPanel（用户组件） | core/src/components/ui/dropdown-panel.tsx:6 | /components/menu | /cases/menu | 未发现重要变体的字面量缺口；不代表状态全验收 |
| EventCard（用户组件） | core/src/components/ui/event-card.tsx:37 | /components/calendar | /cases/calendar, /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| EventTag（用户组件） | core/src/components/ui/event-tag.tsx:35 | /components/calendar | /cases/calendar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| FileCard（用户组件） | core/src/components/ui/forms/file-upload.tsx:86 | /components/file-type | 父组件内部组合展示，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| FileTypeIcon（用户组件） | core/src/components/ui/forms/file-upload.tsx:65 | /components/file-type | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| FileUpload（用户组件） | core/src/components/ui/forms/file-upload.tsx:199 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| FilterGroup（用户组件） | core/src/components/ui/filter-group.tsx:50 | /components/filter, /components/toolbar | /cases/filter, /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| FilterPanel（用户组件） | core/src/components/ui/filter-panel.tsx:7 | /components/filter, /components/toolbar | /cases/filter, /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| FilterTrigger（用户组件） | core/src/components/ui/filter-trigger.tsx:9 | /components/filter | /cases/filter | 未发现重要变体的字面量缺口；不代表状态全验收 |
| FinancialOrbs（渲染辅助） | core/src/components/ui/card-utils.tsx:353 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| FullCalendar（用户组件） | core/src/components/ui/full-calendar.tsx:50 | /components/calendar | /cases/calendar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| FullWidthTable（用户组件） | core/src/components/ui/data-table.tsx:1060 | /components/table | /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Grid（用户组件） | core/src/components/layouts/grid.tsx:42 | /components/grid | /cases/grid | 未发现重要变体的字面量缺口；不代表状态全验收 |
| GridItem（组合子组件） | core/src/components/layouts/grid.tsx:60 | /components/grid | /cases/grid | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| HalfDonutChart（用户组件） | core/src/components/ui/charts/half-donut-chart.tsx:20 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| HighlightCard（用户组件） | core/src/components/ui/highlight-card.tsx:27 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| HistoryGrouped（用户组件） | core/src/components/ui/history-grouped.tsx:15 | /components/history | /cases/history | 未发现重要变体的字面量缺口；不代表状态全验收 |
| HistoryItem（用户组件） | core/src/components/ui/history-item.tsx:115 | /components/history | /cases/history | 未发现重要变体的字面量缺口；不代表状态全验收 |
| IconButton（用户组件） | core/src/components/ui/icon-button.tsx:88 | /components/button-link | /cases/button-link, /cases/history | effect: "send"; result: "error" |
| IconPicker（用户组件） | core/src/components/ui/forms/icon-selector.tsx:84 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| IconSelector（用户组件） | core/src/components/ui/forms/icon-selector.tsx:131 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| IconTrigger（用户组件） | core/src/components/ui/icon-trigger.tsx:17 | /components/menu | /cases/menu | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ImageGrid（用户组件） | core/src/components/ui/image-grid.tsx:16 | /components/other-widget | 无 JSX 证据 | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ImageStatCard（用户组件） | core/src/components/ui/image-stat-card.tsx:30 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| InsightCards（用户组件） | core/src/components/ui/agent/insight-cards.tsx:106 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| KebabMenu（用户组件） | core/src/components/ui/kebab-menu.tsx:42 | /components/menu | /cases/menu | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Label（用户组件） | core/src/components/ui/badge.tsx:79 | /components/badge, /components/card, /components/list, /components/table | /cases/badge, /cases/history, /cases/list, /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| LineChartStatCard（用户组件） | core/src/components/ui/line-chart-stat-card.tsx:142 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| LiquidTabs（用户组件） | core/src/components/ui/liquid-tabs.tsx:29 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ListGroup（用户组件） | core/src/components/ui/list-group.tsx:10 | /components/list | /cases/list | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ListItem（用户组件） | core/src/components/ui/list-item.tsx:44 | /components/list | /cases/list | 未发现重要变体的字面量缺口；不代表状态全验收 |
| MapCard（用户组件） | core/src/components/ui/map-card.tsx:148 | /components/map | /cases/map | 未发现重要变体的字面量缺口；不代表状态全验收 |
| MastercardLogo（渲染辅助） | core/src/components/ui/card-utils.tsx:381 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| MediaUpload（用户组件） | core/src/components/ui/forms/media-upload.tsx:60 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| MenuItem（用户组件） | core/src/components/ui/menu-item.tsx:18 | /components/menu | /cases/menu | 未发现重要变体的字面量缺口；不代表状态全验收 |
| MeterChart（用户组件） | core/src/components/ui/charts/meter-chart.tsx:20 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Modal（用户组件） | core/src/components/ui/modal.tsx:21 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| MultilayerDonutChart（用户组件） | core/src/components/ui/charts/multilayer-donut-chart.tsx:53 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| NotificationBadge（用户组件） | core/src/components/ui/badge.tsx:17 | /components/badge | /cases/badge, /cases/list | 未发现重要变体的字面量缺口；不代表状态全验收 |
| NotificationItem（用户组件） | core/src/components/ui/notification-item.tsx:12 | /components/list | /cases/menu | 未发现重要变体的字面量缺口；不代表状态全验收 |
| OtpInput（用户组件） | core/src/components/ui/otp-input.tsx:43 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| PageDot（用户组件） | core/src/components/ui/page-dot.tsx:27 | /components/pagination-stepper | /cases/pagination-stepper | 未发现重要变体的字面量缺口；不代表状态全验收 |
| PageHeader（用户组件） | core/src/components/ui/page-header.tsx:101 | /components/page-header | /cases/page-header | leftMode: "hamburger" |
| PageTitleToolbar（用户组件） | core/src/components/ui/toolbar.tsx:575 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Pagination（用户组件） | core/src/components/ui/pagination.tsx:33 | /components/pagination-stepper | /cases/pagination-stepper | 未发现重要变体的字面量缺口；不代表状态全验收 |
| PieChart（用户组件） | core/src/components/ui/charts/pie-chart.tsx:24 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| PlusIcon（渲染辅助） | core/src/components/ui/plain-icons.tsx:6 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| ProductRow（用户组件） | core/src/components/ui/product-row.tsx:11 | /components/other-widget | 无 JSX 证据 | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ProfileCard（用户组件） | core/src/components/ui/profile-card.tsx:9 | /components/list | /cases/card, /cases/menu | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ProfileImgUpload（用户组件） | core/src/components/ui/forms/media-upload.tsx:190 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ProgressBadge（用户组件） | core/src/components/ui/data-table.tsx:251 | /components/table | 父组件内部组合展示，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ProgressBar（用户组件） | core/src/components/ui/progress-bar.tsx:51 | /components/progress | /cases/progress | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ProgressCard（用户组件） | core/src/components/ui/progress-card.tsx:26 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ProgressStatCard（用户组件） | core/src/components/ui/progress-stat-card.tsx:41 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ProjectCard（用户组件） | core/src/components/ui/project-card.tsx:25 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| RadioButton（用户组件） | core/src/components/ui/forms/selection-control.tsx:200 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| RadioWithLabel（用户组件） | core/src/components/ui/forms/selection-control.tsx:250 | 无 JSX 证据 | 共享布局注入，见 JSON | 未发现重要变体的字面量缺口；不代表状态全验收 |
| RatingStars（用户组件） | core/src/components/ui/rating-stars.tsx:15 | /components/other-widget | /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| RecommendationCard（用户组件） | core/src/components/ui/agent/recommendation-card.tsx:31 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ReviewItem（用户组件） | core/src/components/ui/review-item.tsx:74 | /components/comment | /cases/comment | variant: "regular" |
| SelectOption（用户组件） | core/src/components/ui/forms/select-option.tsx:125 | /components/input-field | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| SidebarMenu（用户组件） | core/src/components/ui/sidebar-menu.tsx:81 | 无 JSX 证据 | /cases/menu | mode: "minimized" |
| SmallCalendar（用户组件） | core/src/components/ui/small-calendar.tsx:30 | /components/calendar | /cases/calendar, /cases/menu | 未发现重要变体的字面量缺口；不代表状态全验收 |
| SmallDailyCalendar（用户组件） | core/src/components/ui/small-daily-calendar.tsx:29 | 无 JSX 证据 | /cases/calendar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| SmoothLineChart（用户组件） | core/src/components/ui/charts/smooth-line-chart.tsx:67 | /components/chart | /cases/chart | 未发现重要变体的字面量缺口；不代表状态全验收 |
| StatCard（用户组件） | core/src/components/ui/stat-card.tsx:34 | /components/card | /cases/card | badgeVariant: "opacity", "white", "solid", "default", "greyBg" |
| StatCardShell（渲染辅助） | core/src/components/ui/card-utils.tsx:459 | 父组件内部组合展示，见 JSON | 父组件内部组合展示，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| StatusBadge（用户组件） | core/src/components/ui/data-table.tsx:198 | /components/table | 父组件内部组合展示，见 JSON | variant: "solid" |
| Stepper（用户组件） | core/src/components/ui/stepper.tsx:22 | /components/pagination-stepper | /cases/pagination-stepper | 未发现重要变体的字面量缺口；不代表状态全验收 |
| StreamingAnswer（用户组件） | core/src/components/ui/agent/streaming-answer.tsx:102 | /components/chat-input-bar, /components/agent | /cases/agent, /cases/chat-input-bar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| StyledLink（用户组件） | core/src/components/ui/link.tsx:30 | /components/button-link | /cases/button-link | effect: "magnetic", "roll" |
| SurfaceCard（用户组件） | core/src/components/ui/surface-card.tsx:16 | 父组件内部组合展示，见 JSON | /cases/button-link, /cases/card, /cases/tab | 未发现重要变体的字面量缺口；不代表状态全验收 |
| TabBar（用户组件） | core/src/components/ui/tab-bar.tsx:40 | /components/tab | /cases/tab | 未发现重要变体的字面量缺口；不代表状态全验收 |
| TableCell（用户组件） | core/src/components/ui/data-table.tsx:60 | /components/table | /cases/table | 未发现重要变体的字面量缺口；不代表状态全验收 |
| TabsContent（用户组件） | core/src/components/ui/tabs-content.tsx:27 | 无 JSX 证据 | /cases/tab | 未发现重要变体的字面量缺口；不代表状态全验收 |
| TaskCard（用户组件） | core/src/components/ui/task-card.tsx:26 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| TextArea（用户组件） | core/src/components/ui/forms/text-area.tsx:30 | /components/input-field | /cases/input-field | shape: "pill" |
| TextField（用户组件） | core/src/components/ui/forms/text-field.tsx:44 | /components/input-field | /cases/button-link, /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| TextFieldSelectSuffix（用户组件） | core/src/components/ui/forms/text-field-select.tsx:28 | 无 JSX 证据 | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ThinkingTrace（用户组件） | core/src/components/ui/agent/thinking-trace.tsx:63 | /components/agent | /cases/agent | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToastProvider（上下文辅助） | core/src/components/ui/toast.tsx:62 | 无 JSX 证据 | 共享布局注入，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| Toggle（用户组件） | core/src/components/ui/forms/selection-control.tsx:50 | 无 JSX 证据 | /cases/input-field | 未发现重要变体的字面量缺口；不代表状态全验收 |
| Toolbar（用户组件） | core/src/components/ui/toolbar.tsx:50 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarActions（用户组件） | core/src/components/ui/toolbar.tsx:368 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarDatepicker（用户组件） | core/src/components/ui/toolbar.tsx:237 | /components/table, /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarFavoriteButton（用户组件） | core/src/components/ui/toolbar.tsx:410 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarFilterButton（用户组件） | core/src/components/ui/toolbar.tsx:291 | /components/table, /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarKebabButton（用户组件） | core/src/components/ui/toolbar.tsx:384 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarPillTabs（用户组件） | core/src/components/ui/toolbar.tsx:441 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarSearchInput（用户组件） | core/src/components/ui/toolbar.tsx:74 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarSelectDropdown（用户组件） | core/src/components/ui/toolbar.tsx:147 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolbarShowSelect（用户组件） | core/src/components/ui/toolbar.tsx:337 | /components/toolbar | /cases/toolbar | 未发现重要变体的字面量缺口；不代表状态全验收 |
| ToolChips（用户组件） | core/src/components/ui/agent/tool-chips.tsx:56 | /components/agent | /cases/agent | state: "running", "idle", "success", "error", "cancelled" |
| Tooltip（用户组件） | core/src/components/ui/tooltip.tsx:106 | /components/tooltip | /cases/tooltip | 未发现重要变体的字面量缺口；不代表状态全验收 |
| TooltipAnchor（组合子组件） | core/src/components/ui/tooltip.tsx:228 | /components/tooltip | /cases/tooltip | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| TooltipBubble（组合子组件） | core/src/components/ui/tooltip.tsx:45 | /components/tooltip | /cases/tooltip | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| TooltipGroup（上下文辅助） | core/src/components/ui/tooltip.tsx:101 | 无 JSX 证据 | 共享布局注入，见 JSON | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| TopBar（用户组件） | core/src/components/ui/topbar.tsx:16 | 无 JSX 证据 | /cases/page-header | 未发现重要变体的字面量缺口；不代表状态全验收 |
| TypefaceBlock（渲染辅助） | core/src/components/ui/style-guide.tsx:139 | /components/style-guide | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| TypographySizeRow（渲染辅助） | core/src/components/ui/style-guide.tsx:195 | /components/style-guide | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| TypographyWeightSample（渲染辅助） | core/src/components/ui/style-guide.tsx:173 | /components/style-guide | 无 JSX 证据 | 辅助/组合能力，不要求独立业务卡；属性明细见 JSON |
| UserCard（用户组件） | core/src/components/ui/user-card.tsx:14 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |
| WheelChartStatCard（用户组件） | core/src/components/ui/wheel-chart-stat-card.tsx:59 | /components/card | /cases/card | 未发现重要变体的字面量缺口；不代表状态全验收 |

## 完整证据

详见同目录 `component-coverage-audit.json`：每个组件包含导出位置、逐处 JSX 行号、props 表达式、有限联合值、明确字面量/默认值、推导候选、动态未决与未分配页面的 JSX。

## 建议验收顺序

1. 人工确认无案例/无文档项是可独立使用的组件，还是依赖父组件组合展示的子组件。
2. 补齐有限属性轴的字面量缺口；优先 effect、variant、transition、state/status，避免重建冗长配色矩阵。
3. 依据业务重要性测试有效/无效输入、加载、错误、空态、禁用、键盘焦点及中英文；每项记录真实操作证据。
4. 对共享注入组件按 registry 官方分类验证页面可见性，不将仅源码可达当作已上屏。

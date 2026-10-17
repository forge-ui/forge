# 组件重复检查与融合统计

以 core 公共导出的 182 个 React 组件为统计范围，每个组件占一行。已处理 16 个组件的重复展示或说明（含本轮之前已处理的 ChatInputBar）。剩余需核对的重复候选 0 个；27 个未被命名标题或参数表扫描识别出主说明归属，须结合父组件说明核对，不能误记为“文档完整”。

## 判断口径

- 同一组件出现多次，不等于重复组件：颜色、大小、受控状态和业务组合保留。
- 相同组件的基础展示、代码和参数在多个分类重复铺开时，集中到一个主说明，原位置保留链接。
- 同名组件在示例和追加 API 区各占一节时，合成一节；简表与完整表重叠时，合成一张表。
- “主说明”来自实际 Section 标题与 API 归属；“使用页面”来自 TypeScript JSX 调用图，只表示静态可达，不能当作重复页面数量或浏览器验收。
- 交互清单只列该组件作为首个目标的条目，其他目标视为组合依赖；F03 与 178 共用一个列表操作台，沿用既有别名。99 条迁移记录不等于新增 99 个导出组件。
- 此表检查文档组织与重复归属，不能据此认定全部参数、变体或动效已通过逐项运行验收。参数缺项另见 documentation-props-audit.md。

## 全量统计

| 组件 | 类型 | 主说明分类 | 使用页面数 | 主要交互条目 | 处理结论 |
|---|---|---|---:|---|---|
| Accordion | 组件 | [grid](/components/grid) | 0 | 044 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ActivityCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| AddMember | 组件 | [agent](/components/agent) | 0 | F05 | 已合并：示例和参数位于同一节，移除末尾重复标题。 |
| AgentCodeBlock | 组件 | [agent](/components/agent) | 1 | 127、129 | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| AgentDiffTable | 组件 | [agent](/components/agent) | 1 | — | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| AgentFlowchart | 组件 | [agent](/components/agent) | 1 | — | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| AgentTaskRows | 组件 | [agent](/components/agent) | 1 | — | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| AppLayout | 组件 | [menu-sections](/components/menu-sections) | 2 | 037、040 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ApprovalCard | 组件 | [agent](/components/agent) | 1 | — | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| AppSwitcherDropdown | 组件 | 未明确 | 0 | — | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| ArtisticIcon | 组件 | [badge](/components/badge) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| AskAi | 组件 | 未明确 | 1 | — | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| Avatar | 组件 | 未明确 | 1 | 054、180 | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| AvatarGroup | 组件 | [table](/components/table) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| BalanceCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| BarChart | 组件 | [chart](/components/chart) | 1 | 095 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| BarChartStatCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| BarHorizontalChart | 组件 | [chart](/components/chart) | 1 | 163 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| BarUpsideDownChart | 组件 | [chart](/components/chart) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Breadcrumbs | 组件 | [page-header](/components/page-header) | 1 | — | 已合并：工具栏中的重复说明移至页面标题；保留工具栏业务组合。 |
| BubbleChart | 组件 | [chart](/components/chart) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Button | 组件 | [button-link](/components/button-link) | 4 | 001、002、003、004、006、009、010、066、067、081 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ButtonGroup | 组件 | [button-link](/components/button-link) | 2 | 047、056 | 已合并：页签中的重复介绍、颜色、形状、代码和 API 移至按钮与链接；保留原锚点链接。 |
| CalendarCard | 组件 | [calendar](/components/calendar) | 0 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| CalendarDayCell | 组合子组件 | [calendar](/components/calendar) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CalendarWeekRow | 组合子组件 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CardAvatarGroup | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CardGlow | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CardIconChip | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CardKebabButton | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CardTrend | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellActions | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellCode | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellFile | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellImageText | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellKebabMenu | 组合子组件 | 未明确 | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellLink | 组合子组件 | 未明确 | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellMuted | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellNumber | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellProgressBar | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellProgressValue | 组合子组件 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellRating | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellStatusDot | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellText | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CellTextSubtitle | 组合子组件 | [table](/components/table) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ChartCard | 组件 | [chart](/components/chart) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ChartLegendItem | 组合子组件 | [chart](/components/chart) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ChartListItem | 组合子组件 | [chart](/components/chart) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ChartStatFooter | 组合子组件 | [chart](/components/chart) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ChartTooltip | 组合子组件 | [chart](/components/chart) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ChartValueRow | 组合子组件 | [chart](/components/chart) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ChatBubble | 组件 | [chat](/components/chat) | 1 | 077、078、091 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ChatInputBar | 组件 | [chat](/components/chat)、[chat-input-bar](/components/chat-input-bar) | 2 | 084 | 已合并：智能体页改为链接，消息输入栏保留唯一主说明；回答组合仍保留。 |
| Checkbox | 组件 | [filter](/components/filter) | 3 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| CheckboxControl | 组件 | [input-field](/components/input-field) | 3 | 019 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| CheckboxWithLabel | 组件 | [input-field](/components/input-field) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| CheckIcon | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| Checklist | 组件 | [checklist](/components/checklist) | 1 | 014、093 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ChecklistItem | 组合子组件 | [checklist](/components/checklist) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CircleIcon | 组件 | [badge](/components/badge) | 2 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| CloseIcon | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ColorPicker | 组件 | [input-field](/components/input-field) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ColorSection | 渲染辅助 | [style-guide](/components/style-guide) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ColorSwatch | 渲染辅助 | [style-guide](/components/style-guide) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| CommandSearch | 组件 | [agent](/components/agent) | 1 | 046 | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| CommentItem | 组件 | [comment](/components/comment) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ConfirmationDialog | 组件 | [modal](/components/modal) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ContactItem | 组件 | [list](/components/list) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ContextCards | 组件 | [agent](/components/agent) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| CreditCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| CurrencyConverter | 组件 | [other-widget](/components/other-widget) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| DashedHalfDonutChart | 组件 | [chart](/components/chart) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| DataTable | 组件 | [table](/components/table) | 1 | 184 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Datepicker | 组件 | [input-field](/components/input-field) | 1 | 030 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| DebitCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| DescriptionItem | 组件 | [list](/components/list) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| DonutChart | 组件 | [chart](/components/chart) | 1 | 097 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Drawer | 组件 | [modal](/components/modal) | 0 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| DropdownDivider | 组合子组件 | 未明确 | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| DropdownPanel | 组件 | [menu](/components/menu) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| EventCard | 组件 | [calendar](/components/calendar) | 1 | 059 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| EventTag | 组件 | [calendar](/components/calendar) | 1 | 110 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| FileCard | 组件 | [file-type](/components/file-type) | 1 | — | 已合并：卡片中的重复说明移至文件；上传、成功、失败示例集中展示。 |
| FileTypeIcon | 组件 | [file-type](/components/file-type) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| FileUpload | 组件 | [input-field](/components/input-field) | 1 | 032、075、F01 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| FilterGroup | 组件 | [filter](/components/filter) | 2 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| FilterPanel | 组件 | [filter](/components/filter) | 2 | 092、F06 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| FilterTrigger | 组件 | [filter](/components/filter) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| FinancialOrbs | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| FullCalendar | 组件 | [calendar](/components/calendar) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| FullWidthTable | 组件 | [table](/components/table) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Grid | 组件 | [grid](/components/grid) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| GridItem | 组合子组件 | [grid](/components/grid) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| HalfDonutChart | 组件 | [chart](/components/chart) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| HighlightCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| HistoryGrouped | 组件 | [history](/components/history) | 1 | 176 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| HistoryItem | 组件 | [history](/components/history) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| IconButton | 组件 | [button-link](/components/button-link) | 1 | 005、007、008、011、012、018、022 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| IconPicker | 组件 | [input-field](/components/input-field) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| IconSelector | 组件 | [input-field](/components/input-field) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| IconTrigger | 组件 | [menu](/components/menu) | 1 | 045、074 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ImageGrid | 组件 | [other-widget](/components/other-widget) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ImageStatCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| InsightCards | 组件 | [agent](/components/agent) | 1 | — | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| KebabMenu | 组件 | [menu](/components/menu) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Label | 组件 | [badge](/components/badge) | 4 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| LineChartStatCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| LiquidTabs | 组件 | [tab](/components/tab) | 0 | — | 已合并：示例和参数位于同一节，移除末尾重复标题。 |
| ListGroup | 组件 | [list](/components/list) | 1 | 088 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ListItem | 组件 | [list](/components/list) | 1 | 071 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| MapCard | 组件 | [map](/components/map) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| MastercardLogo | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| MediaUpload | 组件 | [input-field](/components/input-field) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| MenuItem | 组件 | [menu](/components/menu) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| MeterChart | 组件 | [chart](/components/chart) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Modal | 组件 | [modal](/components/modal) | 0 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| MultilayerDonutChart | 组件 | [chart](/components/chart) | 1 | 099 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| NotificationBadge | 组件 | [badge](/components/badge) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| NotificationItem | 组件 | [list](/components/list) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| OtpInput | 组件 | [input-field](/components/input-field) | 0 | 026 | 已合并：示例和参数位于同一节，移除末尾重复标题。 |
| PageDot | 组件 | [pagination-stepper](/components/pagination-stepper) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| PageHeader | 组件 | [page-header](/components/page-header) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| PageTitleToolbar | 组件 | [toolbar](/components/toolbar) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Pagination | 组件 | [pagination-stepper](/components/pagination-stepper) | 1 | 043 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| PieChart | 组件 | [chart](/components/chart) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| PlusIcon | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| ProductRow | 组件 | [other-widget](/components/other-widget) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ProfileCard | 组件 | [list](/components/list) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ProfileImgUpload | 组件 | [input-field](/components/input-field) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ProgressBadge | 组件 | [table](/components/table) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ProgressBar | 组件 | [progress](/components/progress) | 1 | 058、083 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ProgressCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ProgressStatCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ProjectCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| RadioButton | 组件 | [input-field](/components/input-field) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| RadioWithLabel | 组件 | 未明确 | 0 | 015 | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| RatingStars | 组件 | [other-widget](/components/other-widget) | 1 | 016 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| RecommendationCard | 组件 | [agent](/components/agent) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ReviewItem | 组件 | [comment](/components/comment) | 1 | 057 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| SelectOption | 组件 | [input-field](/components/input-field) | 1 | 031 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| SidebarMenu | 组件 | 未明确 | 0 | — | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| SmallCalendar | 组件 | [calendar](/components/calendar) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| SmallDailyCalendar | 组件 | 未明确 | 0 | — | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| SmoothLineChart | 组件 | [chart](/components/chart) | 1 | 096、157、165 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| StatCard | 组件 | [card](/components/card) | 1 | 098 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| StatCardShell | 渲染辅助 | 未明确 | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| StatusBadge | 组件 | [table](/components/table) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Stepper | 组件 | [pagination-stepper](/components/pagination-stepper) | 1 | 042、087 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| StreamingAnswer | 组件 | [agent](/components/agent) | 2 | 086 | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| StyledLink | 组件 | [button-link](/components/button-link) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| SurfaceCard | 组件 | 未明确 | 0 | 049、050、080、089、090、108、179、181、F04 | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| TabBar | 组件 | [tab](/components/tab) | 1 | 039、041、048 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| TableCell | 组件 | [table](/components/table) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| TabsContent | 组件 | [tab](/components/tab) | 0 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| TaskCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| TextArea | 组件 | [input-field](/components/input-field) | 1 | 028、126 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| TextField | 组件 | [input-field](/components/input-field) | 1 | 025、029、033、036、062、063、128 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| TextFieldSelectSuffix | 组件 | 未明确 | 0 | — | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| ThinkingTrace | 组件 | [agent](/components/agent) | 1 | F02 | 已合并：简表说明并入完整 API，保留一张参数表及原有示例。 |
| ToastProvider | 上下文辅助 | [modal](/components/modal) | 0 | 070 | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| Toggle | 组件 | 未明确 | 0 | 013、021、023 | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| Toolbar | 组件 | [toolbar](/components/toolbar) | 1 | 177、178、F03 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolbarActions | 组件 | 未明确 | 1 | — | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| ToolbarDatepicker | 组件 | [toolbar](/components/toolbar) | 2 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolbarFavoriteButton | 组件 | [toolbar](/components/toolbar) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolbarFilterButton | 组件 | [toolbar](/components/toolbar) | 2 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolbarKebabButton | 组件 | [toolbar](/components/toolbar) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolbarPillTabs | 组件 | [toolbar](/components/toolbar) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolbarSearchInput | 组件 | [toolbar](/components/toolbar) | 1 | 027 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolbarSelectDropdown | 组件 | [toolbar](/components/toolbar) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolbarShowSelect | 组件 | [toolbar](/components/toolbar) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| ToolChips | 组件 | [agent](/components/agent) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| Tooltip | 组件 | [tooltip](/components/tooltip) | 1 | 076 | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| TooltipAnchor | 组合子组件 | [tooltip](/components/tooltip) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| TooltipBubble | 组合子组件 | [tooltip](/components/tooltip) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| TooltipGroup | 上下文辅助 | [tooltip](/components/tooltip) | 0 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| TopBar | 组件 | 未明确 | 0 | — | 未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。 |
| TypefaceBlock | 渲染辅助 | [style-guide](/components/style-guide) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| TypographySizeRow | 渲染辅助 | [style-guide](/components/style-guide) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| TypographyWeightSample | 渲染辅助 | [style-guide](/components/style-guide) | 1 | — | 保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。 |
| UserCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |
| WheelChartStatCard | 组件 | [card](/components/card) | 1 | — | 保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。 |

## 来源与复查

逐项源码位置、同名说明位置、页面路径和交互名称见同名 JSON 文件。复查命令：

```sh
node scripts/audit-component-coverage.mjs
node scripts/audit-documentation-props.mjs
node scripts/audit-component-duplication.mjs
```

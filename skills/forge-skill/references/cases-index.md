# Case 索引

共 24 个 case route（含 `/cases` 索引页），源文件 `src/app/cases/<name>/page.tsx`。AI 在写业务前读对应页的源文件查看组件实际用法（props / 组合 / 覆盖变体）。

机器可读索引：`../forge-app-design/precedents/forge-showcase-cases/metadata.json`。这个索引由 `../forge-app-design/scripts/forge-showcase-intake.mjs` 从当前源码生成，优先用于确认 route、组件使用和 required anchors。

每个 case 页都对照 `figma-code/<name>.md` 的 Dev Mode 代码做过变体全铺，是组件 API 的活文档。

| Case | 路由 | 覆盖组件（按出现顺序） |
|---|---|---|
| index | `/cases` | case 总览和导航 |
| agent | `/cases/agent` | `ThinkingTrace` / `StreamingAnswer` / `ApprovalCard` / `ToolChips` / `AgentTaskRows` / `ChatInputBar` / `ContextCards` / `RecommendationCard` / `AgentDiffTable` / `AgentCodeBlock` / `InsightCards` / `CommandSearch` / `AgentFlowchart` |
| badge | `/cases/badge` | `NotificationBadge` / `Label` / `CircleIcon` / `ArtisticIcon` |
| button-link | `/cases/button-link` | `Button` (9 色 × 3 variant × 3 size × icon × disabled) / `IconButton` (同上 + circle/square + ghost) / `StyledLink` (9 色 × icon × disabled) |
| calendar | `/cases/calendar` | `SmallCalendar` / `SmallDailyCalendar` / `FullCalendar` / `CalendarDayCell` / `CalendarWeekRow` / `EventCard` / `EventTag` |
| card | `/cases/card` | `StatCard` / `ProgressStatCard` / `LineChartStatCard` / `WheelChartStatCard` / `BarChartStatCard` / `ImageStatCard` / `BalanceCard` / `DebitCard` / `CreditCard` / `ProgressCard` / `ProjectCard` / `TaskCard` / `UserCard` / `EventCard` / `ProfileCard` / `HighlightCard` / `ActivityCard` |
| chart | `/cases/chart` | 全部 chart 家族：`MeterChart` / `HalfDonutChart` / `DashedHalfDonutChart` / `DonutChart` / `PieChart` / `MultilayerDonutChart` / `BubbleChart` / `BarChart` / `BarHorizontalChart` / `BarUpsideDownChart` / `SmoothLineChart` / `ChartCard` / `ChartTooltip` / `ChartListItem` / `ChartLegendItem` / `ChartValueRow` / `ChartStatFooter` |
| chat | `/cases/chat` | `ContactItem` / `ChatBubble` / `ChatInputBar` |
| checklist | `/cases/checklist` | `Checklist` / `ChecklistItem` |
| comment | `/cases/comment` | `CommentItem` / `ReviewItem` |
| filter | `/cases/filter` | `FilterGroup` / `FilterTrigger` / `FilterPanel` |
| history | `/cases/history` | `HistoryItem` / `HistoryGrouped` |
| input-field | `/cases/input-field` | `TextField` / `TextArea` / `SelectOption` / `Datepicker` / `MediaUpload` / `ProfileImgUpload` / `FileUpload` / `FileCard` / `FileTypeIcon` / `Toggle` / `RadioButton` / `CheckboxControl` / `CheckboxWithLabel` / `IconSelector` / `IconPicker` / `ColorPicker` / `TextFieldSelectSuffix` |
| list | `/cases/list` | `ListItem` / `DescriptionItem` / `ListGroup` |
| map | `/cases/map` | `MapCard` (3 variants × 3 colors × continent highlights) |
| menu | `/cases/menu` | `SidebarMenu` / `MenuItem` / `DropdownPanel` / `IconTrigger` / `ProfileCard` / `NotificationItem` / `KebabMenu` |
| modal | `/cases/modal` | `ConfirmationDialog` (5 色 × 2 layouts) |
| other-widget | `/cases/other-widget` | `CurrencyConverter` |
| page-header | `/cases/page-header` | `PageHeader` / `TopBar` |
| pagination-stepper | `/cases/pagination-stepper` | `PageDot` / `Pagination` / `Stepper` |
| progress | `/cases/progress` | `ProgressBar` (8 色 × 2 size × label variants × onDark) |
| tab | `/cases/tab` | `TabBar` (3 色 × surface inline/page × 2-7 tabs × badge) / `ButtonGroup` (3 色 × 2 shape × 2-7 items) |
| table | `/cases/table` | `DataTable` / `FullWidthTable` / `TableCell` / `StatusBadge` / `ProgressBadge` / 全部 `Cell*` 原子：`CellText` / `CellTextSubtitle` / `CellMuted` / `CellImageText` / `CellProgressValue` / `CellKebabMenu` / `CellStatusDot` / `CellNumber` / `CellProgressBar` / `CellCode` / `CellRating` / `CellFile` / `CellActions` / `CellLink` |
| toolbar | `/cases/toolbar` | `Breadcrumbs` / `Toolbar` / `ToolbarSearchInput` / `ToolbarSelectDropdown` / `ToolbarDatepicker` / `ToolbarFilterButton` / `ToolbarShowSelect` / `ToolbarActions` / `ToolbarKebabButton` / `ToolbarFavoriteButton` / `ToolbarPillTabs` / `PageTitleToolbar` |
| tooltip | `/cases/tooltip` | `TooltipBubble` / `Tooltip` / `TooltipAnchor` |

## 使用提示

- **AI 写代码前**：打开 `src/app/cases/<name>/page.tsx` 读 import 列表 + JSX，比凭想象写 props 靠谱十倍
- **生成前校验**：读 `../forge-app-design/precedents/forge-showcase-cases/metadata.json`，确认要用的组件是否已有 canonical case
- **缺组件**：Kit 里找不到目标组件 → 停下问人扩 Kit，不要手搓
- **Figma 对照**：每个 case 页对应 `figma-code/<name>.md`（Dev Mode 代码）+ Figma 链接在 md 第一行

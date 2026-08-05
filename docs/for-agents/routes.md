# Forge 路由表（Agent）

写业务页前：先定场景 → 打开对应 **case 源码** 看 props，不要凭记忆写。

源码根：`src/app/cases/<name>/page.tsx`  
本地预览：在 forge monorepo 跑 dev 后访问下表路由。

> 本表整理自 `.agents/skills/forge/references/cases-index.md`，与 showcase 保持一致。

## Cases（组件活文档）

| Case | 路由 | 源码 | 覆盖组件（摘要） |
|------|------|------|------------------|
| index | `/cases` | `src/app/cases/page.tsx` | 总览导航 |
| badge | `/cases/badge` | `src/app/cases/badge/page.tsx` | `NotificationBadge` / `Label` / `CircleIcon` / `ArtisticIcon` |
| button-link | `/cases/button-link` | `src/app/cases/button-link/page.tsx` | `Button` / `IconButton` / `StyledLink` |
| calendar | `/cases/calendar` | `src/app/cases/calendar/page.tsx` | `SmallCalendar` / `SmallDailyCalendar` / `FullCalendar` / `CalendarDayCell` / `CalendarWeekRow` / `EventCard` / `EventTag` |
| card | `/cases/card` | `src/app/cases/card/page.tsx` | `StatCard` / `ProgressStatCard` / `LineChartStatCard` / `WheelChartStatCard` / `BarChartStatCard` / `ImageStatCard` / `BalanceCard` / `DebitCard` … |
| chart | `/cases/chart` | `src/app/cases/chart/page.tsx` | `MeterChart` / `HalfDonutChart` / `DashedHalfDonutChart` / `DonutChart` / `PieChart` / `MultilayerDonutChart` / `BubbleChart` / `BarChart` … |
| chat | `/cases/chat` | `src/app/cases/chat/page.tsx` | `ContactItem` / `ChatBubble` / `ChatInputBar` |
| comment | `/cases/comment` | `src/app/cases/comment/page.tsx` | `CommentItem` / `ReviewItem` |
| filter | `/cases/filter` | `src/app/cases/filter/page.tsx` | `FilterGroup` / `FilterTrigger` / `FilterPanel` |
| history | `/cases/history` | `src/app/cases/history/page.tsx` | `HistoryItem` / `HistoryGrouped` |
| input-field | `/cases/input-field` | `src/app/cases/input-field/page.tsx` | `TextField` / `TextArea` / `SelectOption` / `Datepicker` / `MediaUpload` / `ProfileImgUpload` / `FileUpload` / `FileCard` … |
| list | `/cases/list` | `src/app/cases/list/page.tsx` | `ListItem` / `DescriptionItem` / `ListGroup` |
| map | `/cases/map` | `src/app/cases/map/page.tsx` | `MapCard` |
| menu | `/cases/menu` | `src/app/cases/menu/page.tsx` | `SidebarMenu` / `MenuItem` / `DropdownPanel` / `IconTrigger` / `ProfileCard` / `NotificationItem` / `KebabMenu` |
| modal | `/cases/modal` | `src/app/cases/modal/page.tsx` | `ConfirmationDialog` |
| other-widget | `/cases/other-widget` | `src/app/cases/other-widget/page.tsx` | `CurrencyConverter` |
| page-header | `/cases/page-header` | `src/app/cases/page-header/page.tsx` | `PageHeader` / `TopBar` |
| pagination-stepper | `/cases/pagination-stepper` | `src/app/cases/pagination-stepper/page.tsx` | `PageDot` / `Pagination` / `Stepper` |
| progress | `/cases/progress` | `src/app/cases/progress/page.tsx` | `ProgressBar` |
| tab | `/cases/tab` | `src/app/cases/tab/page.tsx` | `TabBar` / `ButtonGroup` |
| table | `/cases/table` | `src/app/cases/table/page.tsx` | `DataTable` / `FullWidthTable` / `TableCell` / `StatusBadge` / `ProgressBadge` / `CellText` / `CellTextSubtitle` / `CellMuted` … |
| toolbar | `/cases/toolbar` | `src/app/cases/toolbar/page.tsx` | `Breadcrumbs` / `Toolbar` / `ToolbarSearchInput` / `ToolbarSelectDropdown` / `ToolbarDatepicker` / `ToolbarFilterButton` / `ToolbarShowSelect` / `ToolbarActions` … |
| tooltip | `/cases/tooltip` | `src/app/cases/tooltip/page.tsx` | `TooltipBubble` / `Tooltip` / `TooltipAnchor` |

## 场景速查（先读哪个 case）

| 你要做的 | 先读 case |
|----------|-----------|
| 列表表格 / 状态列 / 行操作 | `table` |
| 筛选条 / 搜索 / 工具栏 | `toolbar` + `tab`（ButtonGroup） |
| 表单输入 | `input-field` |
| 确认删除弹窗 | `modal`（注意：只要内容卡，宿主自备 overlay） |
| 按钮 / 链接 | `button-link` |
| 详情字段列表 | `list` |
| 分段 / Tab | `tab` |
| 看板 KPI / 卡片 | `card` |
| 图表 | `chart` |
| 分页 / 步骤条 | `pagination-stepper` |
| 日历 | `calendar` |
| 聊天 | `chat` |

## Templates（页面骨架，可选）

完整后台示例在 `src/app/templates/`：

| 区域 | 路径前缀 | 适合 |
|------|----------|------|
| 看板 | `templates/(dashboards)/dashboards/` | KPI + 图表 |
| 电商 CRUD | `templates/(dashboard)/ecommerce/` | 列表 / 详情 / 新建 |
| CRM | `templates/crm-template/` | 线索客户 |
| 项目 | `templates/project-template/` | 任务成员文件 |

Starter 后台更优先抄 **forge-starter** 的 `accounts` / `approvals` 样板，再回 monorepo 查 props。

## 相关

- 组件介绍表：`components.md`
- 机器清单：`inventory.json`（~181，来自 forge-readdy 同步 core 0.1.7）
- 页面模式长文：`.agents/skills/forge/references/page-patterns.md`

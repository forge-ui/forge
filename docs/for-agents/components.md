# Forge 组件介绍表（Agent）

**来源：** 合并 [forge-readdy/catalog](../../../forge-readdy/catalog/forge-components.md)（core 0.1.7 全量）+ monorepo cases。  
**机器清单：** [`inventory.json`](./inventory.json)（181 项）  
**查 props：** 打开下表 **Case** 列对应的 `src/app/cases/<case>/page.tsx`，见 [`routes.md`](./routes.md)。

## 怎么用

1. 按场景在下表找组件（或先看 [`routes.md` 场景速查](./routes.md)）  
2. 读 Case 源码看真实 props  
3. 业务页只 `import { X } from "@forge-ui-official/core"`  
4. 表里没有 → **FORGE-GAP**，禁止手搓  

### 标记（沿用 readdy）

| 标记 | 含义 |
|------|------|
| ★ | 后台 CRUD / 壳 高频默认 |
| ◇ | 常用加分 |
| ○ | 域可选（日历/聊天/金融等） |
| ✗ | 慎用 |

### Starter 注意

- 通用 Modal：core 无导出，用业务仓 `components/ui/modal.tsx` 包 `ConfirmationDialog`  
- `DataTable.sortable` **不会自动排序**，未实现逻辑不要开  
- Starter 列表筛选：优先 `ButtonGroup` + 搜索（见 forge-starter 样板）  

---

## 组件一览（含 Case）

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|

### cards

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `ActivityCard` | ◇ | 动态流 | `card` |
| `BalanceCard` | ○ | 见 case / 源码 | `card` |
| `BarChartStatCard` | ◇ | 柱状 KPI 卡 | `card` |
| `CardAvatarGroup` | ○ | 见 case / 源码 | — |
| `CardGlow` | ○ | 见 case / 源码 | — |
| `CardIconChip` | ○ | 见 case / 源码 | — |
| `CardKebabButton` | ○ | 见 case / 源码 | — |
| `CardTrend` | ○ | 见 case / 源码 | — |
| `CardWidth` | ○ | 见 case / 源码 | — |
| `CreditCard` | ○ | 见 case / 源码 | `card` |
| `DebitCard` | ○ | 见 case / 源码 | `card` |
| `EventCard` | ○ | 日程事件卡 | `calendar` `card` |
| `FinancialOrbs` | ○ | 见 case / 源码 | — |
| `HighlightCard` | ○ | 强调内容卡 | `card` |
| `ImageStatCard` | ○ | 带图 KPI | `card` |
| `LineChartStatCard` | ★ | KPI 波形卡 | `card` |
| `MapCard` | ○ | 地图区域 | `map` |
| `MapContinent` | ○ | 见 case / 源码 | — |
| `MapRegion` | ○ | 见 case / 源码 | — |
| `MastercardLogo` | ○ | 见 case / 源码 | — |
| `ProfileCard` | ○ | 见 case / 源码 | `card` `menu` |
| `ProgressCard` | ✗ | 完成度卡 | `card` |
| `ProgressStatCard` | ○ | 进度 KPI 卡 | `card` |
| `ProjectCard` | ◇ | 项目卡片（card-grid） | `card` |
| `StatCard` | ○ | 见 case / 源码 | `card` |
| `StatCardShell` | ○ | 见 case / 源码 | — |
| `SurfaceCard` | ★ | 表单分组 / 详情块 | — |
| `TaskCard` | ◇ | 任务卡片 | `card` |
| `UserCard` | ○ | 见 case / 源码 | `card` |
| `WheelChartStatCard` | ◇ | 环形 KPI 卡 | `card` |

### charts

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `BarChart` | ○ | 见 case / 源码 | `chart` |
| `BarHorizontalChart` | ○ | 见 case / 源码 | `chart` |
| `BarUpsideDownChart` | ○ | 见 case / 源码 | `chart` |
| `BubbleChart` | ○ | 气泡图 | `chart` |
| `ChartCard` | ★ | 图容器 | `chart` |
| `ChartLegendItem` | ◇ | 图例项 | `chart` |
| `ChartListItem` | ★ | 图例/占比行 | `chart` |
| `ChartStatFooter` | ◇ | 图底部统计 | `chart` |
| `ChartTooltip` | ○ | 图提示 | `chart` |
| `ChartValueRow` | ◇ | 数值行 | `chart` |
| `DashedHalfDonutChart` | ○ | 见 case / 源码 | `chart` |
| `DonutChart` | ★ | 分布环图（dashboard） | `chart` |
| `HalfDonutChart` | ○ | 见 case / 源码 | `chart` |
| `MeterChart` | ○ | 仪表 | `chart` |
| `MultilayerDonutChart` | ○ | 多层环 | `chart` |
| `PieChart` | ◇ | 饼图 | `chart` |
| `SmoothLineChart` | ◇ | 平滑折线 | `chart` |

### chrome

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `BreadcrumbItem` | ○ | 见 case / 源码 | — |
| `Breadcrumbs` | ○ | 见 case / 源码 | `toolbar` |
| `PageDot` | ○ | 见 case / 源码 | `pagination-stepper` |
| `PageHeader` | ◇ | 更完整页头（含 profile/variant） | `page-header` |
| `PageHeaderAction` | ○ | 见 case / 源码 | — |
| `PageHeaderProfile` | ○ | 见 case / 源码 | — |
| `PageTitleToolbar` | ★ | 页标题 + 右侧 actions | `toolbar` |
| `Pagination` | ○ | 见 case / 源码 | `pagination-stepper` |
| `SidebarMenu` | ○ | 见 case / 源码 | `menu` |
| `SidebarMenuItem` | ○ | 见 case / 源码 | — |
| `Stepper` | ◇ | 流程步骤（详情 pipeline） | `pagination-stepper` |
| `TabBar` | ○ | 见 case / 源码 | `tab` |
| `TabItem` | ○ | 见 case / 源码 | — |
| `Toolbar` | ★ | 列表工具条容器 | `toolbar` |
| `ToolbarActions` | ★ | 工具条右侧；无内容则省略 prop，勿 `null` | `toolbar` |
| `ToolbarDatepicker` | ◇ | 工具条日期 | `toolbar` |
| `ToolbarFavoriteButton` | ○ | 见 case / 源码 | `toolbar` |
| `ToolbarFilterButton` | ◇ | 打开 FilterPanel | `toolbar` |
| `ToolbarKebabButton` | ○ | 见 case / 源码 | `toolbar` |
| `ToolbarPillTab` | ○ | 见 case / 源码 | — |
| `ToolbarPillTabs` | ○ | 见 case / 源码 | `toolbar` |
| `ToolbarSearchInput` | ★ | 搜索 | `toolbar` |
| `ToolbarSelectDropdown` | ★ | 下拉筛选 | `toolbar` |
| `ToolbarShowSelect` | ★ | 显示/密度类 | `toolbar` |
| `TopBar` | ○ | 独立顶栏（一般走 AppLayout） | `page-header` |

### forms

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `CheckboxWithLabel` | ◇ | 带标签勾选 | `input-field` |
| `ColorPicker` | ○ | 见 case / 源码 | `input-field` |
| `Datepicker` | ◇ | 日期（field role=datetime） | `input-field` |
| `FileCard` | ○ | 见 case / 源码 | `input-field` |
| `FileItem` | ○ | 见 case / 源码 | — |
| `FileTypeIcon` | ○ | 见 case / 源码 | `input-field` |
| `FileUpload` | ○ | 见 case / 源码 | `input-field` |
| `IconPicker` | ○ | 见 case / 源码 | `input-field` |
| `IconSelector` | ○ | 见 case / 源码 | `input-field` |
| `MediaItem` | ○ | 见 case / 源码 | — |
| `MediaUpload` | ○ | 见 case / 源码 | `input-field` |
| `ProfileImgUpload` | ○ | 见 case / 源码 | `input-field` |
| `RadioButton` | ○ | 见 case / 源码 | `input-field` |
| `RadioWithLabel` | ○ | 见 case / 源码 | — |
| `SelectOption` | ★ | 高频默认（见 readdy one-shot） | `input-field` |
| `SelectOptionItem` | ○ | 见 case / 源码 | — |
| `TextArea` | ★ | 长文本 | `input-field` |
| `TextField` | ★ | 文本/数字 | `input-field` |
| `TextFieldSelectSuffix` | ◇ | 输入+后缀选择 | `input-field` |
| `Toggle` | ◇ | 开关（settings） | `input-field` |

### layouts

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `AppLayout` | ★ | 全站壳：侧栏 + 顶栏 + content | — |
| `AppLayoutBreadcrumb` | ○ | 见 case / 源码 | — |
| `AppLayoutMenuItem` | ○ | 见 case / 源码 | — |
| `AppLayoutProfile` | ○ | 见 case / 源码 | — |

### other

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `IconTrigger` | ○ | 图标触发器 | `menu` |

### patterns

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `CalendarDayCell` | ○ | 见 case / 源码 | `calendar` |
| `CalendarEvent` | ○ | 见 case / 源码 | — |
| `CalendarWeekRow` | ○ | 见 case / 源码 | `calendar` |
| `ChatBubble` | ○ | 见 case / 源码 | `chat` |
| `ChatInputBar` | ○ | 见 case / 源码 | `chat` |
| `ChatInputBarToggle` | ○ | 见 case / 源码 | — |
| `CommentData` | ○ | 见 case / 源码 | — |
| `CommentItem` | ○ | 见 case / 源码 | `comment` |
| `CommentReply` | ○ | 见 case / 源码 | — |
| `ConfirmationDialog` | ◇ | 确认弹窗（删除/发布） | `modal` |
| `ContactItem` | ○ | 见 case / 源码 | `chat` |
| `CurrencyConverter` | ○ | 汇率换算 | `other-widget` |
| `DailyEvent` | ○ | 见 case / 源码 | — |
| `DescriptionItem` | ○ | 见 case / 源码 | `list` |
| `DropdownDivider` | ○ | 见 case / 源码 | — |
| `DropdownPanel` | ○ | 见 case / 源码 | `menu` |
| `EventTag` | ○ | 事件标签 | `calendar` |
| `FilterGroup` | ○ | 见 case / 源码 | `filter` |
| `FilterGroupCheckboxOption` | ○ | 见 case / 源码 | — |
| `FilterGroupContent` | ○ | 见 case / 源码 | — |
| `FilterGroupRadioOption` | ○ | 见 case / 源码 | — |
| `FilterPanel` | ○ | 见 case / 源码 | `filter` |
| `FilterTrigger` | ○ | 见 case / 源码 | `filter` |
| `FullCalendar` | ○ | 见 case / 源码 | `calendar` |
| `HistoryGrouped` | ○ | 见 case / 源码 | `history` |
| `HistoryItem` | ○ | 见 case / 源码 | `history` |
| `ImageGrid` | ○ | 图片宫格 | — |
| `KebabMenu` | ○ | 见 case / 源码 | `menu` |
| `KebabMenuItem` | ○ | 见 case / 源码 | — |
| `ListGroup` | ○ | 见 case / 源码 | `list` |
| `ListGroupTab` | ○ | 见 case / 源码 | — |
| `ListItem` | ○ | 见 case / 源码 | `list` |
| `MenuItem` | ○ | 菜单项 | `menu` |
| `NotificationItem` | ○ | 通知行 | `menu` |
| `ProductRow` | ○ | 商品行（电商） | — |
| `RatingStars` | ○ | 星级 | — |
| `ReviewItem` | ○ | 见 case / 源码 | `comment` |
| `SmallCalendar` | ○ | 见 case / 源码 | `calendar` |
| `SmallCalendarEvent` | ○ | 见 case / 源码 | — |
| `SmallDailyCalendar` | ○ | 见 case / 源码 | `calendar` |
| `Tooltip` | ○ | 见 case / 源码 | `tooltip` |
| `TooltipAnchor` | ○ | 见 case / 源码 | `tooltip` |
| `TooltipBubble` | ○ | 见 case / 源码 | `tooltip` |

### primitives

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `ArtisticIcon` | ○ | 见 case / 源码 | `badge` |
| `Avatar` | ○ | 见 case / 源码 | — |
| `AvatarGroup` | ○ | 见 case / 源码 | — |
| `Button` | ★ | 主/次 CTA；一页仅一个 visual primary 提交 | `button-link` |
| `ButtonGroup` | ○ | 见 case / 源码 | `tab` |
| `ButtonGroupItem` | ○ | 见 case / 源码 | — |
| `Checkbox` | ○ | 见 case / 源码 | — |
| `CheckboxControl` | ○ | 见 case / 源码 | `input-field` |
| `CheckIcon` | ○ | 见 case / 源码 | — |
| `CircleIcon` | ○ | 见 case / 源码 | `badge` |
| `CloseIcon` | ○ | 见 case / 源码 | — |
| `IconButton` | ◇ | 图标按钮 | `button-link` |
| `Label` | ○ | 标签文本 | `badge` |
| `NotificationBadge` | ◇ | 角标数字 | `badge` |
| `PlusIcon` | ○ | 见 case / 源码 | — |
| `ProgressBar` | ◇ | 细进度条（列表 metric 可用） | `progress` |
| `StyledLink` | ◇ | 文字链接 | `button-link` |

### table

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `CellActions` | ★ | 行操作（eye 等） | `table` |
| `CellCode` | ○ | 代码/SKU | `table` |
| `CellFile` | ○ | 见 case / 源码 | `table` |
| `CellImageText` | ○ | 见 case / 源码 | `table` |
| `CellKebabMenu` | ◇ | 行内 kebab | `table` |
| `CellLink` | ◇ | 链接列 | `table` |
| `CellMuted` | ◇ | 次要文本 | `table` |
| `CellNumber` | ◇ | 数字列 | `table` |
| `CellProgressBar` | ○ | 见 case / 源码 | `table` |
| `CellProgressValue` | ○ | 见 case / 源码 | `table` |
| `CellRating` | ○ | 评分 | `table` |
| `CellStatusDot` | ◇ | 状态点 | `table` |
| `CellText` | ★ | 主文本列 | `table` |
| `CellTextSubtitle` | ★ | 主+副标题 | `table` |
| `ColumnDef` | ★ | 高频默认（见 readdy one-shot） | `table` |
| `DataTable` | ★ | 业务主表 | `table` |
| `FullWidthTable` | ○ | 全宽表变体 | `table` |
| `ProgressBadge` | ◇ | 进度徽章 | `table` |
| `StatusBadge` | ○ | 彩色状态胶囊（**业务页已弃用**：状态/分类一律纯文本，危险态红字、失效态灰字；勿做彩虹胶囊） | `table` |
| `TableCell` | ○ | 底层单元格 | `table` |

### tokens-utils

| 组件 | 标记 | 典型用途 | Case |
|------|------|----------|------|
| `ColorSwatch` | ○ | 见 case / 源码 | — |
| `TypefaceBlock` | ○ | 见 case / 源码 | — |
| `TypographySizeRow` | ○ | 见 case / 源码 | — |
| `TypographyWeightSample` | ○ | 见 case / 源码 | — |

---

## 后台页面速配（Starter 对齐）

| 页面 | 优先组件 | Case | Starter 样板 |
|------|----------|------|--------------|
| 列表 | DataTable, Button, ButtonGroup, TextField, StatusBadge, Breadcrumbs | table, tab, toolbar | accounts / approvals 列表 |
| 表单弹窗 | TextField, TextArea, SelectOption + 宿主 Modal | input-field, modal | *-form-dialog |
| 轻详情 | StatusBadge, DescriptionItem/List*, Button | list, modal | approval-detail-dialog |
| 重详情 | StatCard, TabBar, DataTable, Breadcrumbs | card, tab, table, list | accounts/[id] |
| 工作台 | StatCard, ChartCard, DonutChart… | card, chart | dashboard |
| 删除确认 | ConfirmationDialog + 宿主 | modal | accounts 删除 |

## 刷新 inventory

从已安装 core 刷新（脚本在 forge-readdy）：

```bash
node ../forge-readdy/scripts/sync-forge-catalog.mjs --from ./node_modules/@forge-ui-official/core
# 然后将 catalog/forge-components.inventory.json 复制为 docs/for-agents/inventory.json
# 并视需要更新本 md
```

当前 inventory 同步自 forge-readdy（generatedAt: 2026-08-04T06:13:11.864Z）。

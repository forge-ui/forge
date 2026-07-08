# Forge UI Kit Agent 上下文

Forge UI Kit 是面向后台管理系统和 SaaS 原型的 React 19 + Next.js 16 + Tailwind v4 组件库。核心包是 `@forge-ui-official/core@0.1.6`。

## 使用边界

适合：后台管理、运营控制台、CRM/ERP/WMS/MES/IoT/AI 运维、dashboard/list/detail/action/workflow/settings/report/workspace 等业务页面。

不适合：营销落地页、纯装饰页面、用自由 CSS 重写组件库。ForgeUI 负责基础视觉和组件落地；业务模块地图、用户目标、数据流、字段、动作、页面意图仍然必须先设计清楚。

## 接入方式

```css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../../node_modules/@forge-ui-official/core/dist";
```

```tsx
import { AppLayout, Button, DataTable, SurfaceCard } from "@forge-ui-official/core";
```

Icon 使用 `solar-icon-set`：

```tsx
import { HomeLinear } from "solar-icon-set";

<HomeLinear size={20} color="#71717A" />
```

## 硬规则

- 组件只从 `@forge-ui-official/core` 导入。
- 颜色只用 `fg-*` token，不在业务页使用 Tailwind 默认色或裸 hex。
- Icon 用 `solar-icon-set`，通过 `size` / `color` prop 控制。
- 后台壳层用 `AppLayout`，不要在业务页重写 sidebar/topbar/profile。
- 页面保持后台系统密度：字号克制、颜色不过深、卡片不写死宽度、表格首屏要有有效行、右 rail 要服务决策。
- 缺组件时回到 core 扩展或记录 ForgeUI gap，不在业务页手搓通用 primitive。

## 页面生成顺序

1. 先做模块地图：业务对象、生命周期、入口页面、读写数据、字段、筛选、动作、详情、下一步闭环。
2. 再做 Page Intent Spec：user_goal、primary_decision、primary_action、secondary_context、business_flow、data_flow、field_model、layout_decision、action_design、component_plan。
3. 召回参考：cases、templates、Forge Starter、forge-app-design patterns、dataset module contracts。
4. 按页面角色选 pattern：dashboard / list / detail / action / workflow / settings / report / workspace。
5. 根据字段语义选择 ForgeUI 组件。
6. 实现后用 typecheck/build/browser screenshot/visual/product-quality 等门禁验证。

## 组件摘要

- ActivityCard (timeline) — import { ActivityCard } from "@forge-ui-official/core"; best for: dashboard activity column, team feed; avoid: none recorded; source: core/src/components/ui/activity-card.tsx
- AppLayout (layout) — import { AppLayout } from "@forge-ui-official/core"; best for: all generated Forge admin apps; avoid: custom marketing pages, standalone auth-only pages; source: core/src/components/layouts/app-layout.tsx
- Avatar (identity) — import { Avatar } from "@forge-ui-official/core"; best for: owner, assignee, customer, merchant, company, team; avoid: DataTable identity cells (use CellImageText instead), decorative icons without identity meaning; source: core/src/components/ui/avatar.tsx
- BarChartStatCard (metric-card) — import { BarChartStatCard } from "@forge-ui-official/core"; best for: dashboard distribution metric, short-term bar trend; avoid: full chart analysis; source: core/src/components/ui/bar-chart-stat-card.tsx:36-106
- Button (action) — import { Button } from "@forge-ui-official/core"; best for: primary page actions, form submit actions, short secondary actions, empty-state calls to action; avoid: icon-only toolbar controls, dense row overflow actions, long labels that should be links or menu items; source: core/src/components/ui/button.tsx
- ButtonGroup (control) — import { ButtonGroup } from "@forge-ui-official/core"; best for: status filters, segment filters, dashboard scope toggles; avoid: more than five options in one group, long option labels, multi-select filters; source: core/src/components/ui/button-group.tsx
- CellActions (table-cell) — import { CellActions } from "@forge-ui-official/core"; best for: row actions, owner contact rows; avoid: none recorded; source: core/src/components/ui/data-table.tsx:496-532
- CellCode (table-cell) — import { CellCode } from "@forge-ui-official/core"; best for: release IDs, short codes; avoid: long descriptive text; source: core/src/components/ui/data-table.tsx:422-430
- CellFile (table-cell) — import { CellFile } from "@forge-ui-official/core"; best for: attachment rows, evidence tables, import logs; avoid: none recorded; source: core/src/components/ui/data-table.tsx:451-477
- CellImageText (table-cell) — import { CellImageText } from "@forge-ui-official/core"; best for: row identity with image, customer / org / product cells; avoid: identity without image, use CellTextSubtitle instead; source: core/src/components/ui/data-table.tsx:253-280
- CellKebabMenu (table-cell) — import { CellKebabMenu } from "@forge-ui-official/core"; best for: row menus when no inline actions are needed; avoid: none recorded; source: core/src/components/ui/data-table.tsx:301-317
- CellLink (table-cell) — import { CellLink } from "@forge-ui-official/core"; best for: Open detail, Open audit log, Go to record; avoid: none recorded; source: core/src/components/ui/data-table.tsx:546-569
- CellMuted (table-cell) — import { CellMuted } from "@forge-ui-official/core"; best for: date strings, owner names without avatar, low-emphasis metadata; avoid: status enums (use Label), numeric KPIs (use CellNumber); source: core/src/components/ui/data-table.tsx:241-251
- CellNumber (table-cell) — import { CellNumber } from "@forge-ui-official/core"; best for: amount, count, percent change with badge; avoid: non-numeric values; source: core/src/components/ui/data-table.tsx:359-393
- CellProgressBar (table-cell) — import { CellProgressBar } from "@forge-ui-official/core"; best for: readiness, SLA pressure, completion in queue rows; avoid: binary status; source: core/src/components/ui/data-table.tsx:399-420
- CellProgressValue (table-cell) — import { CellProgressValue } from "@forge-ui-official/core"; best for: amount + change pill, score + delta; avoid: status enums; source: core/src/components/ui/data-table.tsx:282-299
- CellRating (table-cell) — import { CellRating } from "@forge-ui-official/core"; best for: rating cells, NPS rows; avoid: none recorded; source: core/src/components/ui/data-table.tsx:432-449
- CellStatusDot (table-cell) — import { CellStatusDot } from "@forge-ui-official/core"; best for: status enums that should not feel like a saturated pill, monitoring lists; avoid: status that must read as a count badge; source: core/src/components/ui/data-table.tsx:332-357
- CellText (table-cell) — import { CellText } from "@forge-ui-official/core"; best for: primary text cells, action names, headers in feed lists; avoid: muted/secondary values; source: core/src/components/ui/data-table.tsx:206-216
- CellTextSubtitle (table-cell) — import { CellTextSubtitle } from "@forge-ui-official/core"; best for: row identity without image, name + code rows, name + role rows; avoid: single-line text values; source: core/src/components/ui/data-table.tsx:218-239
- ChartCard (chart) — import { ChartCard } from "@forge-ui-official/core"; best for: dashboard trend panel, control tower chart, segment mix panel, analytics surface with footer stats; avoid: non-chart summary cards, right rail activity, wrapping a DataTable; source: core/src/components/ui/charts/chart-card.tsx
- CheckboxControl (form) — import { CheckboxControl } from "@forge-ui-official/core"; best for: boolean field, preflight checklist, policy toggles, single selection when paired with text; avoid: using CheckboxWithLabel; source: core/src/components/ui/checkbox.tsx
- ContactItem (identity) — import { ContactItem } from "@forge-ui-official/core"; best for: right rail owner/contact context, support or team lists; avoid: primary entity queue tables; source: core/src/components/ui/contact-item.tsx:14-71
- DataTable (data-display) — import { DataTable } from "@forge-ui-official/core"; best for: paginated lists, filtered queues, bulk selection, row actions, audit tables; avoid: single record detail, less than three static facts, kanban lane cards; source: core/src/components/ui/data-table.tsx:579-796
- Datepicker (form) — import { Datepicker } from "@forge-ui-official/core"; best for: scheduled deployment time, due date, window start/end; avoid: none recorded; source: core/src/components/ui/forms/datepicker.tsx
- FileCard (file) — import { FileCard } from "@forge-ui-official/core"; best for: evidence rails, detail attachments, audit packets, workflow documents; avoid: plain text links with no file context; source: core/src/components/ui/forms
- FileUpload (form) — import { FileUpload } from "@forge-ui-official/core"; best for: evidence upload, attachment upload, import file; avoid: none recorded; source: core/src/components/ui/forms/file-upload.tsx
- FilterPanel (filtering) — import { FilterPanel } from "@forge-ui-official/core"; best for: advanced filter popover, side filter drawer content, operational queue refinement panel; avoid: always-visible first-screen list filters, simple two-control toolbar filters; source: core/src/components/ui/filter-panel.tsx
- FullWidthTable (data-display) — import { FullWidthTable } from "@forge-ui-official/core"; best for: full-screen data management routes, audit logs; avoid: narrow rail tables, embedded mini-tables; source: core/src/components/ui/data-table.tsx:801-993
- HighlightCard (metric-card) — import { HighlightCard } from "@forge-ui-official/core"; best for: dashboard visual anchor, main signal of the day; avoid: none recorded; source: core/src/components/ui/highlight-card.tsx
- HistoryGrouped (timeline) — import { HistoryGrouped } from "@forge-ui-official/core"; best for: detail audit rail, long activity history; avoid: none recorded; source: core/src/components/ui/history-grouped.tsx
- HistoryItem (timeline) — import { HistoryItem } from "@forge-ui-official/core"; best for: recent activity, audit trail, status changes, comments/events; avoid: none recorded; source: core/src/components/ui/history-item.tsx
- IconSelector (form) — import { IconSelector } from "@forge-ui-official/core"; best for: settings forms, category configuration; avoid: freeform business data entry; source: core/src/components/ui/forms/icon-selector.tsx
- ImageStatCard (metric-card) — import { ImageStatCard } from "@forge-ui-official/core"; best for: product or venue metric, visual entity KPI; avoid: pure numeric dashboard rows; source: core/src/components/ui/image-stat-card.tsx:30-102
- Label (status) — import { Label } from "@forge-ui-official/core"; best for: status, priority, stage, risk tier, small count; avoid: paragraph labels, large KPI values, entire date or numeric cell content; source: core/src/components/ui/badge.tsx
- LineChartStatCard (metric-card) — import { LineChartStatCard } from "@forge-ui-official/core"; best for: dashboard trend KPI, revenue or risk movement; avoid: large analytical chart panels; source: core/src/components/ui/line-chart-stat-card.tsx:140-228
- ListGroup (grouped-list) — import { ListGroup } from "@forge-ui-official/core"; best for: right rail grouped context, dashboard risk or activity rail, detail evidence or audit group; avoid: primary entity queues that need sorting or pagination, large tabular datasets; source: core/src/components/ui/list-group.tsx
- MediaUpload (form) — import { MediaUpload } from "@forge-ui-official/core"; best for: asset upload forms, profile or venue media; avoid: simple text/file metadata rows; source: core/src/components/ui/forms/media-upload.tsx
- NotificationItem (timeline) — import { NotificationItem } from "@forge-ui-official/core"; best for: right rail activity stream, dashboard exception feed, detail audit or alert list; avoid: toast notifications, primary table rows, long-form comments; source: core/src/components/ui/notification-item.tsx
- PageTitleToolbar (page-title) — import { PageTitleToolbar } from "@forge-ui-official/core"; best for: dashboard page heading, list page heading with compact actions, detail or action page heading below AppLayout breadcrumbs; avoid: replacing AppLayout topbar, repeating section titles inside cards; source: core/src/components/ui/toolbar.tsx
- ProfileCard (identity) — import { ProfileCard } from "@forge-ui-official/core"; best for: detail identity strip, owner/assignee rail, team picker rows; avoid: none recorded; source: core/src/components/ui/profile-card.tsx
- ProgressBadge (status) — import { ProgressBadge } from "@forge-ui-official/core"; best for: up/down delta, stage advanced/blocked; avoid: none recorded; source: core/src/components/ui/data-table.tsx:178-204
- ProgressBar (status) — import { ProgressBar } from "@forge-ui-official/core"; best for: risk score, completion, readiness, progress, SLA pressure; avoid: binary status, decorative bars, inside a DataTable column (use CellProgressBar); source: core/src/components/ui/progress-bar.tsx
- ProgressStatCard (metric-card) — import { ProgressStatCard } from "@forge-ui-official/core"; best for: dashboard progress KPI, capacity/readiness metric; avoid: row-level progress cells; source: core/src/components/ui/progress-stat-card.tsx:41-146
- ProjectCard (work-card) — import { ProjectCard } from "@forge-ui-official/core"; best for: dashboard priority work rail, project lists; avoid: none recorded; source: core/src/components/ui/project-card.tsx
- SelectOption (form) — import { SelectOption } from "@forge-ui-official/core"; best for: more than four enum options, owner selector, segment selector, single or multiple scoped choices; avoid: two or three binary choices that fit radio/checkbox, status filters better served by ButtonGroup; source: core/src/components/ui/forms/select-option.tsx
- StatCard (metric-card) — import { StatCard } from "@forge-ui-official/core"; best for: dashboard KPI strip, major status numbers, control tower top row; avoid: low-frequency metadata, row-level values, detail description lists; source: core/src/components/ui/stat-card.tsx
- StatusBadge (status) — import { StatusBadge } from "@forge-ui-official/core"; best for: status, severity, tier badges; avoid: delta indicators (use ProgressBadge); source: core/src/components/ui/data-table.tsx:135-156
- StyledLink (navigation) — import { StyledLink } from "@forge-ui-official/core"; best for: open detail, open audit log, back to parent, secondary row action; avoid: primary destructive or write action, inside a DataTable column (use CellLink instead); source: core/src/components/ui/link.tsx
- SurfaceCard (surface) — import { SurfaceCard } from "@forge-ui-official/core"; best for: field groups, right rails, evidence panels, activity panels, compact summary cards; avoid: wrapping every table row, wrapping a DataTable only to add another table title; source: core/src/components/ui/surface-card.tsx
- TaskCard (work-card) — import { TaskCard } from "@forge-ui-official/core"; best for: dashboard priority work rail, kanban-like lane cards; avoid: none recorded; source: core/src/components/ui/task-card.tsx
- TextArea (form) — import { TextArea } from "@forge-ui-official/core"; best for: resolution notes, root cause notes, description, comments, review notes; avoid: short enum or status values; source: core/src/components/ui/forms/text-area.tsx
- TextField (form) — import { TextField } from "@forge-ui-official/core"; best for: name, email, phone, title, short codes, search when ToolbarSearchInput cannot be controlled; avoid: long text, selectable enums, date ranges; source: core/src/components/ui/forms/text-field.tsx
- Toggle (form) — import { Toggle } from "@forge-ui-official/core"; best for: settings toggles, boolean feature flags; avoid: multi-choice radio groups; source: core/src/components/ui/forms/selection-control.tsx:20-58
- Toolbar (toolbar) — import { Toolbar } from "@forge-ui-official/core"; best for: filter strip, page-title toolbar; avoid: none recorded; source: core/src/components/ui/toolbar.tsx:24-39
- ToolbarActions (toolbar) — import { ToolbarActions } from "@forge-ui-official/core"; best for: list primary actions, bulk actions, toolbar utilities; avoid: form footer actions; source: core/src/components/ui/toolbar.tsx:306-320
- ToolbarDatepicker (toolbar) — import { ToolbarDatepicker } from "@forge-ui-official/core"; best for: list toolbar controls, queue filtering, audit/search controls; avoid: none recorded; source: core/src/components/ui/toolbar.tsx:176-225
- ToolbarFilterButton (toolbar) — import { ToolbarFilterButton } from "@forge-ui-official/core"; best for: advanced filters, queue filtering, audit log filters; avoid: plain inline filter chips without disclosure; source: core/src/components/ui/toolbar.tsx:230-273
- ToolbarPillTabs (toolbar) — import { ToolbarPillTabs } from "@forge-ui-official/core"; best for: list toolbar controls, queue filtering, audit/search controls; avoid: none recorded; source: core/src/components/ui/toolbar.tsx:371-413
- ToolbarSearchInput (toolbar) — import { ToolbarSearchInput } from "@forge-ui-official/core"; best for: list toolbar controls, queue filtering, audit/search controls; avoid: none recorded; source: core/src/components/ui/toolbar.tsx:43-67
- ToolbarSelectDropdown (toolbar) — import { ToolbarSelectDropdown } from "@forge-ui-official/core"; best for: list toolbar controls, queue filtering, audit/search controls; avoid: none recorded; source: core/src/components/ui/toolbar.tsx:94-172
- ToolbarShowSelect (toolbar) — import { ToolbarShowSelect } from "@forge-ui-official/core"; best for: list toolbar controls, queue filtering, audit/search controls; avoid: none recorded; source: core/src/components/ui/toolbar.tsx:275-304
- WheelChartStatCard (metric-card) — import { WheelChartStatCard } from "@forge-ui-official/core"; best for: dashboard share or completion metric, capacity mix; avoid: dense list rows; source: core/src/components/ui/wheel-chart-stat-card.tsx:56-122

## Case 路由

- /cases/badge
- /cases/button-link
- /cases/calendar
- /cases/card
- /cases/chart
- /cases/chat
- /cases/comment
- /cases/filter
- /cases/history
- /cases/input-field
- /cases/list
- /cases/map
- /cases/menu
- /cases/modal
- /cases/other-widget
- /cases/page-header
- /cases
- /cases/pagination-stepper
- /cases/progress
- /cases/tab
- /cases/table
- /cases/toolbar
- /cases/tooltip

## Template 路由

- /templates/ecommerce/categories/[id]/edit
- /templates/ecommerce/categories/[id]
- /templates/ecommerce/categories/new
- /templates/ecommerce/categories
- /templates/ecommerce/customers/[id]
- /templates/ecommerce/customers
- /templates/ecommerce/orders/[id]/invoice
- /templates/ecommerce/orders/[id]
- /templates/ecommerce/orders/new
- /templates/ecommerce/orders
- /templates/ecommerce/products/[id]/edit
- /templates/ecommerce/products/[id]
- /templates/ecommerce/products/new
- /templates/ecommerce/products
- /templates/ecommerce/sellers/[id]
- /templates/ecommerce/sellers
- /templates/dashboards/analytics
- /templates/dashboards/crm
- /templates/dashboards/ecommerce-1
- /templates/dashboards/ecommerce-2
- /templates/dashboards/ecommerce-3
- /templates/dashboards/finance-1
- /templates/dashboards/finance-2
- /templates/dashboards/finance-3
- /templates/dashboards
- /templates/dashboards/project-1
- /templates/dashboards/project-2
- /templates/crm-template/activity
- /templates/crm-template/customers/[id]
- /templates/crm-template/customers/new
- /templates/crm-template/customers
- /templates/crm-template/forgot-password
- /templates/crm-template/leads/[id]
- /templates/crm-template/leads/new
- /templates/crm-template/leads
- /templates/crm-template/overview
- /templates/crm-template
- /templates/crm-template/register
- /templates/crm-template/reset-password
- /templates/crm-template/sales/[id]
- /templates/crm-template/sales/new
- /templates/crm-template/sales
- /templates/dashboard-builder/[variant]
- /templates/dashboard-builder
- /templates/finance-template/cards
- /templates/finance-template/forgot-password
- /templates/finance-template/invoices/[id]
- /templates/finance-template/invoices/new
- /templates/finance-template/invoices
- /templates/finance-template/overview
- /templates/finance-template
- /templates/finance-template/register
- /templates/finance-template/reset-password
- /templates/finance-template/transactions
- /templates/finance-template/wallets
- /templates/finance-template/wealth
- /templates/micellaneous-template/actions
- /templates/micellaneous-template/calendar
- /templates/micellaneous-template/chat
- /templates/micellaneous-template/files
- /templates/micellaneous-template/forgot-password
- /templates/micellaneous-template
- /templates/micellaneous-template/register
- /templates/micellaneous-template/reset-password
- /templates
- /templates/project-template/clients/[id]
- /templates/project-template/clients
- /templates/project-template/files
- /templates/project-template/invoices
- /templates/project-template/members/[id]
- /templates/project-template/members
- /templates/project-template/overview
- /templates/project-template
- /templates/project-template/projects/[id]
- /templates/project-template/projects
- /templates/project-template/tasks/[id]

## 页面组合块

## action-form-with-status-rail

- Role: action
- Intent: Create, edit, submit, or configure a record through grouped fields with save feedback and right context.
- Pattern: action-form-protask
- Components: Breadcrumbs, SurfaceCard, PageTitleToolbar, TextField, TextArea, SelectOption, CheckboxControl, ProgressBar, Label, Button, StyledLink, ListGroup
- First viewport must show: breadcrumbs or parent exit; H1; Cancel/Save; first field group; status/preflight rail
- Red lines: No action route in sidebar; No CheckboxWithLabel; No long hero copy above form

## app-shell

- Role: shell
- Intent: Provide Forge AppLayout with navigation-only sidebar and topbar profile.
- Components: AppLayout
- Inputs: navigation routes; app label; team profile; user profile
- Red lines: No custom page-level topbar; No action/detail routes in sidebar

## audit-activity-stream

- Role: audit
- Intent: Show who changed what, when, and which record is related.
- Pattern: audit-stream
- Components: SurfaceCard, HistoryItem, DataTable, StyledLink, Label
- First viewport must show: audit title; actor/action/target; timestamp; related record link
- Red lines: No write workflow inside audit page

## dashboard-control-tower

- Role: dashboard
- Intent: Prioritize operational work through KPI, trend/risk visual, priority work, activity, and workflow entry.
- Pattern: dashboard-control-tower-protask
- Components: StatCard, SurfaceCard, PageTitleToolbar, ProgressBar, DataTable, HistoryItem, ListGroup, NotificationItem, StyledLink, ButtonGroup
- First viewport must show: page title; KPI/stat strip; trend or risk visual; priority work or activity
- Red lines: Not just four KPI cards; No form workflow inside dashboard; No mixed saturated/white KPI row; No wide saturated red risk StatCard by default; KPI values must be visually stronger than page H1; No display-scale routine page titles

## kanban-workflow-board

- Role: workflow
- Intent: Move workflow items through lanes with direct actions and diagnostic links.
- Pattern: kanban-workflow-protask
- Components: SurfaceCard, TaskCard, Label, ProgressBar, Button, StyledLink
- First viewport must show: lane titles; lane counts; actionable cards; failed/blocked diagnostic link
- Red lines: Supporting route does not count as promoted kanban validation; No read-only status grouping pretending to be workflow

## rich-queue-list

- Role: list
- Intent: Let operators scan, filter, preview, and open the next row to act on.
- Pattern: rich-entity-list-protask
- Components: SurfaceCard, PageTitleToolbar, FilterPanel, DataTable, Avatar, Label, ProgressBar, Button, StyledLink, FileCard, HistoryItem, ListGroup, NotificationItem
- First viewport must show: compact filters; table header; multiple row identities; one row action
- Red lines: No lg side rail squeeze; No table-fixed; No vertical row action stack; No dual text actions in a row; No compound risk score/percent/bar cell; No redundant rounded filter shell; No noisy multi-color label row; No selected-row detail card below table; No two stacked 5-item ButtonGroups; No DataTable inside another large titled table card; No FilterPanel as the always-visible first-screen filter row

## settings-governance-panel

- Role: settings
- Intent: Change grouped configuration with owner, scope, test result, impact preview, rollback history, and audit evidence visible.
- Pattern: settings-grouped
- Components: SurfaceCard, PageTitleToolbar, TextField, TextArea, SelectOption, CheckboxControl, RadioButton, ProgressBar, Label, Button, StyledLink, HistoryItem, ListGroup
- First viewport must show: settings group identity; owner/scope; test or preflight result; save/disable/rollback action; audit or history rail
- Red lines: No flat static config dump; No high-risk setting without impact preview; No save action without pending/saved/error feedback; No missing rollback or audit context

## split-pane-triage-detail

- Role: detail
- Intent: Resolve a record by showing identity, evidence, root cause, impact, history, and action feedback.
- Pattern: split-pane-triage-protask
- Components: Breadcrumbs, SurfaceCard, PageTitleToolbar, Avatar, Label, ProgressBar, FileCard, HistoryItem, ListGroup, NotificationItem, TextArea, Button, StyledLink
- First viewport must show: identity/status; evidence or root cause; resolution/action; history or context
- Red lines: No all-field description dump; No loose unrelated card grid; No missing next workflow link

# Forge UI Kit

Package: @forge-ui-official/core@0.8.0
Source: this repository; forge-skill + generated core exports + real page routes
Source fingerprint: bb2648d534be76f98b97000b17b6e76d89efca1518e4d5e2cb5489ce3c7864f7

中文入口：采用正文与英文入口完全同源，保留 API 原名。

## Adopted rules / 采用规则

Screen → Blocks → Components. Start dashboards from a real Screen; 70 Blocks are implemented as copyable project source in blocks/ with public/r registry items, not core exports; install one with `npx shadcn@latest add https://forgeui.org/r/<name>.json`. Default status: soft StatusBadge; categories/roles use plain text. Default accent/focus: blue; purple/black optional. Icons: @forge-ui-official/core/icons. Missing capabilities: FORGE-GAP, ask before adding public primitives. In forge-starter use its host skills for routes, permission and data integration.

## 使用指南与 MCP

https://forgeui.org/guides · https://forgeui.org/docs/mcp · https://forgeui.org/api/mcp (read-only Streamable HTTP)

---

Source: content/guides/ai.md

# 让 AI 用 Forge

## 需要什么

先安装唯一规范 forge-skill；MCP 提供可选的检索数据，不能覆盖规范正文。让 AI 先选择 Screen，再选 Blocks，最后查组件 API。

## 选择配方

forge-skill、MCP、llms.txt 与统一审计清单。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Panel } from "@forge-ui-official/core";

export function ReviewScope() {
  return <Panel><p>按 Screen → Blocks → Components 实施，并提交真实验证证据。</p></Panel>;
}
```

## 常见错误与验收

安装：npx skills add https://github.com/forge-ui/forge --skill forge-skill。接入见 /docs/mcp，文本入口为 /llms.txt。示例提问：先检索运营看板 Screen 和趋势 Block，读取状态与布局规范，再给出配方。缺能力标记 FORGE-GAP 并询问；技术检查不能代替浏览器验收。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

---

Source: content/guides/dashboard.md

# 用 Forge 搭运营看板

## 需要什么

先确认指标口径、时间范围、下钻对象与刷新频率。选择 /templates/dashboards/analytics 作为主对照，不从空白卡片墙开始。

## 选择配方

dashboard-header、kpi-metrics、trend-chart、recent-records。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { KpiMetrics } from "@/components/blocks/kpi-metrics";

export function Overview() {
  return <KpiMetrics metrics={[{ id: "orders", title: "订单", value: "128" }]} />;
}
```

## 常见错误与验收

保留 Screen 的层级与密度：外壳 16/20、区块间 20、Grid 16、卡片 padding 16；图域参考 224。按业务选择 4 等分、8:4、3 等分或 2 等分；窄屏重排。不要把模板圆角 24 和 token 20 混作同一标准。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

---

Source: content/guides/detail.md

# 搭建详情页：全页与弹窗

## 需要什么

先确认阅读深度、可分享 URL、编辑权限和返回上下文。复杂详情用全页；轻量查看或局部编辑用 Modal 或 Drawer。

## 选择配方

Panel、Modal、Drawer；activity-feed。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Panel } from "@forge-ui-official/core";

export function Details() {
  return <Panel><h2>订单详情</h2><p>订单编号：SO-128</p></Panel>;
}
```

## 常见错误与验收

轻量详情由宿主控制打开状态，并保持可恢复的对象标识。以下组件接收宿主状态，不另造全局弹窗宿主：

```tsx
"use client";

import { Modal } from "@forge-ui-official/core";

export function DetailDialog({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return <Modal open={open} onOpenChange={onOpenChange} title="订单详情">
    <p>订单编号：SO-128</p>
  </Modal>;
}
```

全页详情保留返回路径；弹窗关闭后恢复触发点焦点。不要用同一弹窗承载无限嵌套详情；删除必须确认并处理失败。未找到、无权限与加载失败分别反馈。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-patterns.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

---

Source: content/guides/feedback.md

# 状态与反馈

## 需要什么

区分持久业务状态、一次动作反馈以及页面空、错、加载状态。颜色只辅助语义，文字必须清楚。

## 选择配方

StatusBadge soft、ToastProvider/useToast；现有空态与加载组件。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { StatusBadge } from "@forge-ui-official/core";

export function PendingStatus() {
  return <StatusBadge variant="soft" color="yellow" label="待处理" />;
}
```

## 常见错误与验收

成功 green、失败 red、警示 yellow、信息 blue、中性 grey。toast 由宿主统一提供，避免重复 Provider；空态给下一步，错误给重试，加载避免布局跳变。不要用 solid 或手写 pill 替代 soft 默认，也不要把徽章当按钮。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/status-presentation.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

---

Source: content/guides/form.md

# 搭建表单页：基础、分组与分步

## 需要什么

先列字段、默认值、校验、保存动作和取消后的去向。短表单单页；长表单按业务分组；有先后依赖时再分步。

## 选择配方

Panel、Button；参考真实表单案例。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Button, Panel } from "@forge-ui-official/core";

export function BasicForm() {
  return <Panel><form><label>名称<input name="name" required /></label><Button type="submit">保存</Button></form></Panel>;
}
```

## 常见错误与验收

示例只展示结构；接业务前需实现提交、服务端校验与错误关联。提交中防重复，失败保留输入；分步切换保留草稿。不要以 toast 代替字段错误，也不要为了视觉平均随意分列。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

---

Source: content/guides/list.md

# 搭建业务列表页

## 需要什么

先确定管理对象、查询条件、排序、分页和批量操作权限。选择最接近的列表案例，而不是把列表包装成看板。

## 选择配方

recent-records；DataTable、StatusBadge。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { StatusBadge } from "@forge-ui-official/core";

export function OrderStatus() {
  return <StatusBadge variant="soft" color="green" label="已完成" />;
}
```

## 常见错误与验收

实体名称提供真实详情入口；筛选、排序与分页保持可恢复状态。空结果区分无数据与筛选无匹配；批量动作仅对已选对象生效。不要把分类、角色都画成彩色胶囊。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-patterns.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

---

Source: content/guides/settings.md

# 搭建设置页

## 需要什么

先区分个人偏好、组织设置、权限范围与危险操作。明确即时保存还是显式保存，同一分组不要混用。

## 选择配方

Panel、Button；设置类 Screen 或案例。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Button, Panel } from "@forge-ui-official/core";

export function Settings() {
  return <Panel><h2>通知偏好</h2><label><input type="checkbox" name="email" />邮件通知</label><Button type="button">保存设置</Button></Panel>;
}
```

## 常见错误与验收

示例按钮需接真实持久化后才可交付。分组说明影响范围，未保存离开时提示；重置需说明恢复值。危险区域与普通配置分开，不要让开关只改变视觉而不保存。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-patterns.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

---

Source: content/guides/starter-module.md

# 在 Forge Starter 加业务模块

## 需要什么

先在 Starter 仓库读取其 new-module/new-page/audit skills，确认对象生命周期、数据权限、菜单与路由。这里不复制 Starter 的后端规则。

## 选择配方

模块 manifest、Ask AI 宿主；列表、详情和编辑界面。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Panel } from "@forge-ui-official/core";

export function ModuleOverview() {
  return <Panel><h2>客户模块</h2><p>先完成模块声明、权限与数据接口，再接列表。</p></Panel>;
}
```

## 常见错误与验收

先确认 Starter 版本具备模块 manifest 和 `module:new`。在不支持该契约的旧版本中停止并升级或询问，不猜测 manifest 字段，也不把新版本接入方式套进旧宿主。

接入时逐项核对：模块标识唯一；页面路由与菜单一致；读写能力声明与 RBAC 守卫一致；Ask AI 的知识与工具来自同一份模块声明；新模块对话能识别对象且写操作经确认。生成文件只是起点，还要验证实际接口、页面保存、权限拒绝和同一会话续办。

在 Starter 中先用 corepack pnpm run 查看脚本，再按该仓 module:new 的帮助创建模块；参数以已安装版本为准，不猜命令。manifest 声明与菜单、路由、RBAC 一起核对；Ask AI 自动知识由宿主注册链接入，不另造第二份知识库。不要仅交静态 CRUD 即声称模块完成。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/admin-module-playbook.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)
## Public exports (506, values and types distinguished)

- AccentColor [type] — core/src/components/ui/accent-utils.ts
- accentColors [value] — core/src/components/ui/accent-utils.ts
- AccentConfig [type] — core/src/components/ui/accent-utils.ts
- Accordion [value] — core/src/components/ui/accordion.tsx
- AccordionItem [type] — core/src/components/ui/accordion.tsx
- AccordionProps [type] — core/src/components/ui/accordion.tsx
- ActivityCard [value] — core/src/components/ui/activity-card.tsx
- AddMember [value] — core/src/components/ui/add-member.tsx
- AddMemberItem [type] — core/src/components/ui/add-member.tsx
- AddMemberLabels [type] — core/src/components/ui/add-member.tsx
- AddMemberProps [type] — core/src/components/ui/add-member.tsx
- AgentCodeBlock [value] — core/src/components/ui/agent/agent-code-block.tsx
- AgentCodeDiffRow [type] — core/src/components/ui/agent/agent-code-block.tsx
- AgentCodeDiffType [type] — core/src/components/ui/agent/agent-code-block.tsx
- AgentCodeFoldRange [type] — core/src/components/ui/agent/agent-code-block.tsx
- AgentCodePiece [type] — core/src/components/ui/agent/agent-code-block.tsx
- AgentDiffChange [type] — core/src/components/ui/agent/agent-diff-table.tsx
- AgentDiffColumn [type] — core/src/components/ui/agent/agent-diff-table.tsx
- AgentDiffRow [type] — core/src/components/ui/agent/agent-diff-table.tsx
- AgentDiffTable [value] — core/src/components/ui/agent/agent-diff-table.tsx
- AgentFlowchart [value] — core/src/components/ui/agent/agent-flowchart.tsx
- AgentFlowEdge [type] — core/src/components/ui/agent/agent-flowchart.tsx
- AgentFlowKind [type] — core/src/components/ui/agent/agent-flowchart.tsx
- AgentFlowNode [type] — core/src/components/ui/agent/agent-flowchart.tsx
- AgentMessage [value] — core/src/components/ui/agent/agent-conversation.tsx
- AgentMessagePart [type] — core/src/components/ui/agent/agent-parts.tsx
- AgentMessageProps [type] — core/src/components/ui/agent/agent-conversation.tsx
- AgentMessageRole [type] — core/src/components/ui/agent/agent-conversation.tsx
- AgentParts [value] — core/src/components/ui/agent/agent-parts.tsx
- AgentPartsProps [type] — core/src/components/ui/agent/agent-parts.tsx
- AgentTask [type] — core/src/components/ui/agent/agent-task-rows.tsx
- AgentTaskChild [type] — core/src/components/ui/agent/agent-task-rows.tsx
- AgentTaskRows [value] — core/src/components/ui/agent/agent-task-rows.tsx
- AgentTaskStatus [type] — core/src/components/ui/agent/agent-task-rows.tsx
- AgentToolPart [type] — core/src/components/ui/agent/agent-parts.tsx
- AgentToolState [type] — core/src/components/ui/agent/agent-parts.tsx
- ALL_CARD_THEMES [value] — core/src/components/ui/card-utils.tsx
- AppLayout [value] — core/src/components/layouts/app-layout.tsx
- AppLayoutAccentColor [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutBreadcrumb [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutLanguage [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutMenuItem [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutMenuSection [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutMode [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutPageHeaderVariant [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutProfile [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutProfilePosition [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutProps [type] — core/src/components/layouts/app-layout.tsx
- ApprovalCard [value] — core/src/components/ui/agent/approval-card.tsx
- ApprovalQuestion [type] — core/src/components/ui/agent/approval-card.tsx
- AppSwitcherDropdown [value] — core/src/components/layouts/sidebar-popovers.tsx
- AppSwitcherItem [type] — core/src/components/layouts/sidebar-popovers.tsx
- ArtifactCard [value] — core/src/components/ui/agent/agent-conversation.tsx
- ArtifactCardProps [type] — core/src/components/ui/agent/agent-conversation.tsx
- ArtifactKind [type] — core/src/components/ui/agent/agent-conversation.tsx
- ArtifactStatus [type] — core/src/components/ui/agent/agent-conversation.tsx
- ArtisticIcon [value] — core/src/components/ui/badge.tsx
- ArtisticIconColor [type] — core/src/components/ui/badge.tsx
- ArtisticIconVariant [type] — core/src/components/ui/badge.tsx
- ASK_AI_FS_LAYER_ATTR [value] — core/src/internal/ask-ai-fullscreen.tsx
- ASK_AI_FULLSCREEN_RAIL_WIDTH [value] — core/src/internal/ask-ai-fullscreen.tsx
- AskAi [value] — core/src/components/ui/ask-ai.tsx
- AskAiLink [type] — core/src/internal/ask-ai-types.ts
- AskAiMessage [type] — core/src/internal/ask-ai-types.ts
- AskAiProps [type] — core/src/components/ui/ask-ai.tsx
- AskAiRequest [type] — core/src/internal/ask-ai-types.ts
- AskAiResponse [type] — core/src/internal/ask-ai-types.ts
- AskAiSessionItem [type] — core/src/internal/ask-ai-types.ts
- Avatar [value] — core/src/components/ui/avatar.tsx
- AvatarGroup [value] — core/src/components/ui/avatar.tsx
- AvatarInitialColor [type] — core/src/components/ui/avatar.tsx
- AvatarSize [type] — core/src/components/ui/avatar.tsx
- BalanceCard [value] — core/src/components/ui/balance-card.tsx
- BalanceCardProps [type] — core/src/components/ui/balance-card.tsx
- BarChart [value] — core/src/components/ui/charts/bar-chart.tsx
- BarChartStatCard [value] — core/src/components/ui/bar-chart-stat-card.tsx
- BarChartStatCardProps [type] — core/src/components/ui/bar-chart-stat-card.tsx
- BarColor [type] — core/src/components/ui/bar-chart-stat-card.tsx
- BarHorizontalChart [value] — core/src/components/ui/charts/bar-horizontal-chart.tsx
- BarUpsideDownChart [value] — core/src/components/ui/charts/bar-upside-down-chart.tsx
- BreadcrumbColor [type] — core/src/components/ui/breadcrumbs.tsx
- BreadcrumbItem [type] — core/src/components/ui/breadcrumbs.tsx
- Breadcrumbs [value] — core/src/components/ui/breadcrumbs.tsx
- BubbleChart [value] — core/src/components/ui/charts/bubble-chart.tsx
- Button [value] — core/src/components/ui/button.tsx
- ButtonColor [type] — core/src/components/ui/button.tsx
- ButtonEffect [type] — core/src/components/ui/button.tsx
- ButtonGroup [value] — core/src/components/ui/button-group.tsx
- ButtonGroupColor [type] — core/src/components/ui/button-group.tsx
- ButtonGroupItem [type] — core/src/components/ui/button-group.tsx
- ButtonGroupShape [type] — core/src/components/ui/button-group.tsx
- ButtonHoldLabels [type] — core/src/components/ui/button.tsx
- ButtonProps [type] — core/src/components/ui/button.tsx
- ButtonSize [type] — core/src/components/ui/button.tsx
- ButtonVariant [type] — core/src/components/ui/button.tsx
- CalendarCard [value] — core/src/components/ui/calendar-card.tsx
- CalendarCardLabels [type] — core/src/components/ui/calendar-card.tsx
- CalendarCardProps [type] — core/src/components/ui/calendar-card.tsx
- CalendarDayCell [value] — core/src/components/ui/calendar-day-cell.tsx
- CalendarEvent [type] — core/src/components/ui/full-calendar.tsx
- CalendarWeekRow [value] — core/src/components/ui/calendar-week-row.tsx
- CardAvatarGroup [value] — core/src/components/ui/card-utils.tsx
- CardBadgeVariant [type] — core/src/components/ui/card-utils.tsx
- CardDensity [type] — core/src/components/ui/card-utils.tsx
- CardGlow [value] — core/src/components/ui/card-utils.tsx
- CardIconChip [value] — core/src/components/ui/card-utils.tsx
- CardKebabButton [value] — core/src/components/ui/card-utils.tsx
- CardTheme [type] — core/src/components/ui/card-utils.tsx
- CardThemeConfig [type] — core/src/components/ui/card-utils.tsx
- cardThemes [value] — core/src/components/ui/card-utils.tsx
- CardTrend [value] — core/src/components/ui/card-utils.tsx
- CardWidth [type] — core/src/components/ui/card-utils.tsx
- CellActionKey [type] — core/src/components/ui/data-table.tsx
- CellActions [value] — core/src/components/ui/data-table.tsx
- CellCode [value] — core/src/components/ui/data-table.tsx
- CellContentType [type] — core/src/components/ui/data-table.tsx
- CellFile [value] — core/src/components/ui/data-table.tsx
- CellImageText [value] — core/src/components/ui/data-table.tsx
- CellKebabMenu [value] — core/src/components/ui/data-table.tsx
- CellLink [value] — core/src/components/ui/data-table.tsx
- CellLinkColor [type] — core/src/components/ui/data-table.tsx
- CellMuted [value] — core/src/components/ui/data-table.tsx
- CellNumber [value] — core/src/components/ui/data-table.tsx
- CellProgressBar [value] — core/src/components/ui/data-table.tsx
- CellProgressValue [value] — core/src/components/ui/data-table.tsx
- CellRating [value] — core/src/components/ui/data-table.tsx
- CellStatusDot [value] — core/src/components/ui/data-table.tsx
- CellText [value] — core/src/components/ui/data-table.tsx
- CellTextSubtitle [value] — core/src/components/ui/data-table.tsx
- ChartCard [value] — core/src/components/ui/charts/chart-card.tsx
- ChartHeader [value] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartHeaderProps [type] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartLegendItem [value] — core/src/components/ui/charts/chart-legend-item.tsx
- ChartListItem [value] — core/src/components/ui/charts/chart-list-item.tsx
- ChartMetricRow [value] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartMetricRowProps [type] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartMetricSeries [type] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartStatFooter [value] — core/src/components/ui/charts/chart-stat-footer.tsx
- ChartTooltip [value] — core/src/components/ui/charts/chart-tooltip.tsx
- ChartTrend [type] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartValueRow [value] — core/src/components/ui/charts/chart-value-row.tsx
- ChatBubble [value] — core/src/components/ui/chat-bubble.tsx
- ChatInputBar [value] — core/src/components/ui/chat-input-bar.tsx
- ChatInputBarQuickAction [type] — core/src/components/ui/chat-input-bar.tsx
- ChatInputBarSendContext [type] — core/src/components/ui/chat-input-bar.tsx
- ChatInputBarToggle [type] — core/src/components/ui/chat-input-bar.tsx
- ChatReaction [type] — core/src/internal/chat-interactions.tsx
- ChatReactionOption [type] — core/src/internal/chat-interactions.tsx
- Checkbox [value] — core/src/components/ui/checkbox.tsx
- CheckboxColor [type] — core/src/components/ui/checkbox.tsx
- CheckboxControl [value] — core/src/components/ui/checkbox.tsx
- CheckboxWithLabel [value] — core/src/components/ui/forms/selection-control.tsx
- CheckIcon [value] — core/src/components/ui/plain-icons.tsx
- Checklist [value] — core/src/components/ui/checklist.tsx
- ChecklistColor [type] — core/src/components/ui/checklist.tsx
- ChecklistItem [value] — core/src/components/ui/checklist.tsx
- ChecklistSize [type] — core/src/components/ui/checklist.tsx
- ChecklistTask [type] — core/src/components/ui/checklist.tsx
- CircleIcon [value] — core/src/components/ui/badge.tsx
- CircleIconColor [type] — core/src/components/ui/badge.tsx
- CircleIconSize [type] — core/src/components/ui/badge.tsx
- CircleIconVariant [type] — core/src/components/ui/badge.tsx
- CloseIcon [value] — core/src/components/ui/plain-icons.tsx
- cn [value] — core/src/lib/utils.ts
- ColorPicker [value] — core/src/components/ui/forms/icon-selector.tsx
- ColorScaleStop [type] — core/src/components/ui/style-guide.tsx
- ColorSection [value] — core/src/components/ui/style-guide.tsx
- ColorSwatch [value] — core/src/components/ui/style-guide.tsx
- ColorSwatchSize [type] — core/src/components/ui/style-guide.tsx
- ColumnDef [type] — core/src/components/ui/data-table.tsx
- CommandSearch [value] — core/src/components/ui/agent/command-search.tsx
- CommandSearchItem [type] — core/src/components/ui/agent/command-search.tsx
- CommentData [type] — core/src/components/ui/comment-item.tsx
- CommentItem [value] — core/src/components/ui/comment-item.tsx
- CommentReply [type] — core/src/components/ui/comment-item.tsx
- ComposerCommand [type] — core/src/components/ui/chat-input-bar.tsx
- ComposerModel [type] — core/src/components/ui/composer-types.ts
- ComposerReply [type] — core/src/components/ui/composer-types.ts
- ComposerSource [type] — core/src/components/ui/chat-input-bar.tsx
- ComposerStatus [type] — core/src/components/ui/composer-types.ts
- ComposerVoiceState [type] — core/src/components/ui/composer-types.ts
- ConfirmationDialog [value] — core/src/components/ui/confirmation-dialog.tsx
- ConfirmationDialogColor [type] — core/src/components/ui/confirmation-dialog.tsx
- ConfirmationDialogLayout [type] — core/src/components/ui/confirmation-dialog.tsx
- ContactItem [value] — core/src/components/ui/contact-item.tsx
- ContextCards [value] — core/src/components/ui/agent/context-cards.tsx
- ContextChunk [type] — core/src/components/ui/agent/context-cards.tsx
- ControlColor [type] — core/src/components/ui/forms/selection-control.tsx
- Conversation [value] — core/src/components/ui/agent/agent-conversation.tsx
- ConversationProps [type] — core/src/components/ui/agent/agent-conversation.tsx
- CreditCard [value] — core/src/components/ui/credit-card.tsx
- CurrencyConverter [value] — core/src/components/ui/currency-converter.tsx
- CurrencyConverterColor [type] — core/src/components/ui/currency-converter.tsx
- DailyEvent [type] — core/src/components/ui/small-daily-calendar.tsx
- DashedHalfDonutChart [value] — core/src/components/ui/charts/dashed-half-donut-chart.tsx
- DataTable [value] — core/src/components/ui/data-table.tsx
- DataTableColor [type] — core/src/components/ui/data-table.tsx
- DataTableProps [type] — core/src/components/ui/data-table.tsx
- Datepicker [value] — core/src/components/ui/forms/datepicker.tsx
- DatepickerColor [type] — core/src/components/ui/forms/datepicker.tsx
- DatepickerMode [type] — core/src/components/ui/forms/datepicker.tsx
- DatepickerShape [type] — core/src/components/ui/forms/datepicker.tsx
- DatepickerState [type] — core/src/components/ui/forms/datepicker.tsx
- DebitCard [value] — core/src/components/ui/debit-card.tsx
- DescriptionItem [value] — core/src/components/ui/list-item.tsx
- DescriptionItemLead [type] — core/src/components/ui/list-item.tsx
- DivergingBarChart [value] — core/src/components/ui/charts/dashboard-charts.tsx
- DivergingBarChartProps [type] — core/src/components/ui/charts/dashboard-charts.tsx
- DonutChart [value] — core/src/components/ui/charts/donut-chart.tsx
- Drawer [value] — core/src/components/ui/drawer.tsx
- DrawerProps [type] — core/src/components/ui/drawer.tsx
- DropdownDivider [value] — core/src/components/ui/dropdown-panel.tsx
- DropdownPanel [value] — core/src/components/ui/dropdown-panel.tsx
- EventCard [value] — core/src/components/ui/event-card.tsx
- EventCardColor [type] — core/src/components/ui/event-card.tsx
- EventTag [value] — core/src/components/ui/event-tag.tsx
- EventTagColor [type] — core/src/components/ui/event-tag.tsx
- EventTagSize [type] — core/src/components/ui/event-tag.tsx
- EventTagVariant [type] — core/src/components/ui/event-tag.tsx
- FileCard [value] — core/src/components/ui/forms/file-upload.tsx
- FileInput [value] — core/src/components/ui/forms/file-input.tsx
- FileInputProps [type] — core/src/components/ui/forms/file-input.tsx
- FileItem [type] — core/src/components/ui/forms/file-upload.tsx
- FileState [type] — core/src/components/ui/forms/file-upload.tsx
- FileTypeIcon [value] — core/src/components/ui/forms/file-upload.tsx
- FileUpload [value] — core/src/components/ui/forms/file-upload.tsx
- FileUploadColor [type] — core/src/components/ui/forms/file-upload.tsx
- FilterGroup [value] — core/src/components/ui/filter-group.tsx
- FilterGroupCheckboxOption [type] — core/src/components/ui/filter-group.tsx
- FilterGroupColor [type] — core/src/components/ui/filter-group.tsx
- FilterGroupContent [type] — core/src/components/ui/filter-group.tsx
- FilterGroupRadioOption [type] — core/src/components/ui/filter-group.tsx
- FilterPanel [value] — core/src/components/ui/filter-panel.tsx
- FilterTrigger [value] — core/src/components/ui/filter-trigger.tsx
- FinancialOrbs [value] — core/src/components/ui/card-utils.tsx
- FinancialTheme [type] — core/src/components/ui/card-utils.tsx
- FinancialThemeConfig [type] — core/src/components/ui/card-utils.tsx
- financialThemes [value] — core/src/components/ui/card-utils.tsx
- FinancialVariant [type] — core/src/components/ui/card-utils.tsx
- Folder [value] — core/src/components/ui/folder.tsx
- FolderFloat [value] — core/src/components/ui/folder-float.tsx
- FolderFloatProps [type] — core/src/components/ui/folder-float.tsx
- FolderItem [type] — core/src/components/ui/folder.tsx
- FolderProps [type] — core/src/components/ui/folder.tsx
- FullCalendar [value] — core/src/components/ui/full-calendar.tsx
- FullWidthTable [value] — core/src/components/ui/data-table.tsx
- FullWidthTableProps [type] — core/src/components/ui/data-table.tsx
- Grid [value] — core/src/components/layouts/grid.tsx
- GridBreakpoint [type] — core/src/components/layouts/grid.tsx
- GridColumns [type] — core/src/components/layouts/grid.tsx
- GridGap [type] — core/src/components/layouts/grid.tsx
- GridItem [value] — core/src/components/layouts/grid.tsx
- GridItemProps [type] — core/src/components/layouts/grid.tsx
- GridProps [type] — core/src/components/layouts/grid.tsx
- GridResponsive [type] — core/src/components/layouts/grid.tsx
- GridSpan [type] — core/src/components/layouts/grid.tsx
- GroupedBarChart [value] — core/src/components/ui/charts/dashboard-charts.tsx
- GroupedBarChartProps [type] — core/src/components/ui/charts/dashboard-charts.tsx
- GroupedBarPoint [type] — core/src/components/ui/charts/dashboard-charts.tsx
- GroupedBarTooltipItem [type] — core/src/components/ui/charts/dashboard-charts.tsx
- HalfDonutChart [value] — core/src/components/ui/charts/half-donut-chart.tsx
- HighlightCard [value] — core/src/components/ui/highlight-card.tsx
- HighlightCardProps [type] — core/src/components/ui/highlight-card.tsx
- HistoryGrouped [value] — core/src/components/ui/history-grouped.tsx
- HistoryItem [value] — core/src/components/ui/history-item.tsx
- HistoryItemColor [type] — core/src/components/ui/history-item.tsx
- HistoryItemProps [type] — core/src/components/ui/history-item.tsx
- HistoryItemShowDatetime [type] — core/src/components/ui/history-item.tsx
- HistoryItemVariant [type] — core/src/components/ui/history-item.tsx
- IconButton [value] — core/src/components/ui/icon-button.tsx
- IconButtonColor [type] — core/src/components/ui/icon-button.tsx
- IconButtonEffect [type] — core/src/components/ui/icon-button.tsx
- IconButtonShape [type] — core/src/components/ui/icon-button.tsx
- IconButtonSize [type] — core/src/components/ui/icon-button.tsx
- IconButtonVariant [type] — core/src/components/ui/icon-button.tsx
- IconPicker [value] — core/src/components/ui/forms/icon-selector.tsx
- IconSelector [value] — core/src/components/ui/forms/icon-selector.tsx
- IconSelectorColor [type] — core/src/components/ui/forms/icon-selector.tsx
- IconTrigger [value] — core/src/components/ui/icon-trigger.tsx
- IconTriggerAccent [type] — core/src/components/ui/icon-trigger.tsx
- IconTriggerState [type] — core/src/components/ui/icon-trigger.tsx
- IconTriggerSurface [type] — core/src/components/ui/icon-trigger.tsx
- ImageGrid [value] — core/src/components/ui/image-grid.tsx
- ImageGridSize [type] — core/src/components/ui/image-grid.tsx
- ImageStatCard [value] — core/src/components/ui/image-stat-card.tsx
- ImageStatCardProps [type] — core/src/components/ui/image-stat-card.tsx
- InfoRow [value] — core/src/components/ui/info-row.tsx
- InfoRowProps [type] — core/src/components/ui/info-row.tsx
- InsightCard [type] — core/src/components/ui/agent/insight-cards.tsx
- InsightCards [value] — core/src/components/ui/agent/insight-cards.tsx
- InsightChart [type] — core/src/components/ui/agent/insight-cards.tsx
- InsightSeries [type] — core/src/components/ui/agent/insight-cards.tsx
- InsightTone [type] — core/src/components/ui/agent/insight-cards.tsx
- KebabMenu [value] — core/src/components/ui/kebab-menu.tsx
- KebabMenuAccent [type] — core/src/components/ui/kebab-menu.tsx
- KebabMenuItem [type] — core/src/components/ui/kebab-menu.tsx
- Label [value] — core/src/components/ui/badge.tsx
- LabelColor [type] — core/src/components/ui/badge.tsx
- LabelSize [type] — core/src/components/ui/badge.tsx
- LabelVariant [type] — core/src/components/ui/badge.tsx
- LegacyCardTheme [type] — core/src/components/ui/card-utils.tsx
- LineChartColor [type] — core/src/components/ui/line-chart-stat-card.tsx
- LineChartStatCard [value] — core/src/components/ui/line-chart-stat-card.tsx
- LineChartStatCardProps [type] — core/src/components/ui/line-chart-stat-card.tsx
- LinkColor [type] — core/src/components/ui/link.tsx
- LiquidTabs [value] — core/src/components/ui/liquid-tabs.tsx
- LiquidTabsItem [type] — core/src/components/ui/liquid-tabs.tsx
- LiquidTabsProps [type] — core/src/components/ui/liquid-tabs.tsx
- LiquidTabsTab [type] — core/src/components/ui/liquid-tabs.tsx
- ListGroup [value] — core/src/components/ui/list-group.tsx
- ListGroupProps [type] — core/src/components/ui/list-group.tsx
- ListGroupTab [type] — core/src/components/ui/list-group.tsx
- ListItem [value] — core/src/components/ui/list-item.tsx
- ListItemAvatarLead [type] — core/src/components/ui/list-item.tsx
- ListItemIconLead [type] — core/src/components/ui/list-item.tsx
- ListItemImageLead [type] — core/src/components/ui/list-item.tsx
- ListItemLead [type] — core/src/components/ui/list-item.tsx
- MapCard [value] — core/src/components/ui/map-card.tsx
- MapContinent [type] — core/src/components/ui/map-card.tsx
- MapRegion [type] — core/src/components/ui/map-card.tsx
- MapVariant [type] — core/src/components/ui/map-card.tsx
- MastercardLogo [value] — core/src/components/ui/card-utils.tsx
- MediaItem [type] — core/src/components/ui/forms/media-upload.tsx
- MediaUpload [value] — core/src/components/ui/forms/media-upload.tsx
- MediaUploadColor [type] — core/src/components/ui/forms/media-upload.tsx
- MenuItem [value] — core/src/components/ui/menu-item.tsx
- MenuItemAccent [type] — core/src/components/ui/menu-item.tsx
- MenuItemIntent [type] — core/src/components/ui/menu-item.tsx
- MenuItemKind [type] — core/src/components/ui/menu-item.tsx
- MenuItemLead [type] — core/src/components/ui/menu-item.tsx
- MenuItemState [type] — core/src/components/ui/menu-item.tsx
- MenuItemSurface [type] — core/src/components/ui/menu-item.tsx
- MessageActions [value] — core/src/components/ui/agent/agent-conversation.tsx
- MessageActionsProps [type] — core/src/components/ui/agent/agent-conversation.tsx
- MessageFeedback [type] — core/src/components/ui/agent/agent-conversation.tsx
- MeterChart [value] — core/src/components/ui/charts/meter-chart.tsx
- Modal [value] — core/src/components/ui/modal.tsx
- ModalProps [type] — core/src/components/ui/modal.tsx
- MotionPreference [type] — core/src/lib/motion.ts
- MultilayerDonutChart [value] — core/src/components/ui/charts/multilayer-donut-chart.tsx
- NotificationBadge [value] — core/src/components/ui/badge.tsx
- NotificationBadgeColor [type] — core/src/components/ui/badge.tsx
- NotificationItem [value] — core/src/components/ui/notification-item.tsx
- NotificationItemColor [type] — core/src/components/ui/notification-item.tsx
- OtpInput [value] — core/src/components/ui/otp-input.tsx
- OtpInputProps [type] — core/src/components/ui/otp-input.tsx
- PageDot [value] — core/src/components/ui/page-dot.tsx
- PageDotColor [type] — core/src/components/ui/page-dot.tsx
- PageHeader [value] — core/src/components/ui/page-header.tsx
- PageHeaderAction [type] — core/src/components/ui/page-header.tsx
- PageHeaderColor [type] — core/src/components/ui/page-header.tsx
- PageHeaderProfile [type] — core/src/components/ui/page-header.tsx
- PageHeaderProps [type] — core/src/components/ui/page-header.tsx
- PageHeaderVariant [type] — core/src/components/ui/page-header.tsx
- PageTitleToolbar [value] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarAction [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarDateAction [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarMenuAction [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarPresetProps [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarProps [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarVariant [type] — core/src/components/ui/toolbar.tsx
- Pagination [value] — core/src/components/ui/pagination.tsx
- PaginationColor [type] — core/src/components/ui/pagination.tsx
- Panel [value] — core/src/components/ui/panel.tsx
- PanelProps [type] — core/src/components/ui/panel.tsx
- PieChart [value] — core/src/components/ui/charts/pie-chart.tsx
- PlusIcon [value] — core/src/components/ui/plain-icons.tsx
- ProductRow [value] — core/src/components/ui/product-row.tsx
- ProfileCard [value] — core/src/components/ui/profile-card.tsx
- ProfileCardState [type] — core/src/components/ui/profile-card.tsx
- ProfileCardSurface [type] — core/src/components/ui/profile-card.tsx
- ProfileImgUpload [value] — core/src/components/ui/forms/media-upload.tsx
- ProgressBadge [value] — core/src/components/ui/data-table.tsx
- ProgressBadgeColor [type] — core/src/components/ui/data-table.tsx
- ProgressBar [value] — core/src/components/ui/progress-bar.tsx
- ProgressBarColor [type] — core/src/components/ui/data-table.tsx
- ProgressCard [value] — core/src/components/ui/progress-card.tsx
- ProgressColor [type] — core/src/components/ui/progress-bar.tsx
- ProgressLabelSize [type] — core/src/components/ui/progress-bar.tsx
- ProgressLabelVariant [type] — core/src/components/ui/progress-bar.tsx
- ProgressSize [type] — core/src/components/ui/progress-bar.tsx
- ProgressStatCard [value] — core/src/components/ui/progress-stat-card.tsx
- ProgressStatCardProps [type] — core/src/components/ui/progress-stat-card.tsx
- ProjectCard [value] — core/src/components/ui/project-card.tsx
- ProjectCardColor [type] — core/src/components/ui/project-card.tsx
- PromptSuggestions [value] — core/src/components/ui/agent/agent-conversation.tsx
- PromptSuggestionsProps [type] — core/src/components/ui/agent/agent-conversation.tsx
- RadioButton [value] — core/src/components/ui/forms/selection-control.tsx
- RadioWithLabel [value] — core/src/components/ui/forms/selection-control.tsx
- RatingStars [value] — core/src/components/ui/rating-stars.tsx
- RatingStarsSize [type] — core/src/components/ui/rating-stars.tsx
- RecommendationCard [value] — core/src/components/ui/agent/recommendation-card.tsx
- RecommendationConfidence [type] — core/src/components/ui/agent/recommendation-card.tsx
- RecommendationOption [type] — core/src/components/ui/agent/recommendation-card.tsx
- resolveCardTheme [value] — core/src/components/ui/card-utils.tsx
- resolveTableColumnAlign [value] — core/src/components/ui/data-table.tsx
- ReviewItem [value] — core/src/components/ui/review-item.tsx
- SelectOption [value] — core/src/components/ui/forms/select-option.tsx
- SelectOptionBgVariant [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionColor [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionItem [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionProps [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionShape [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionState [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionType [type] — core/src/components/ui/forms/select-option.tsx
- SidebarMenu [value] — core/src/components/ui/sidebar-menu.tsx
- SidebarMenuAccent [type] — core/src/components/ui/sidebar-menu.tsx
- SidebarMenuBgMode [type] — core/src/components/ui/sidebar-menu.tsx
- SidebarMenuItem [type] — core/src/components/ui/sidebar-menu.tsx
- SidebarMenuMode [type] — core/src/components/ui/sidebar-menu.tsx
- SmallCalendar [value] — core/src/components/ui/small-calendar.tsx
- SmallCalendarEvent [type] — core/src/components/ui/small-calendar.tsx
- SmallDailyCalendar [value] — core/src/components/ui/small-daily-calendar.tsx
- SmoothLineChart [value] — core/src/components/ui/charts/smooth-line-chart.tsx
- StatCard [value] — core/src/components/ui/stat-card.tsx
- StatCardProps [type] — core/src/components/ui/stat-card.tsx
- StatCardShell [value] — core/src/components/ui/card-utils.tsx
- StatCardSize [type] — core/src/components/ui/card-utils.tsx
- statCardSizes [value] — core/src/components/ui/card-utils.tsx
- StatusBadge [value] — core/src/components/ui/data-table.tsx
- StatusBadgeColor [type] — core/src/components/ui/data-table.tsx
- StatusBadgeVariant [type] — core/src/components/ui/data-table.tsx
- StatusDotColor [type] — core/src/components/ui/data-table.tsx
- Stepper [value] — core/src/components/ui/stepper.tsx
- StepperColor [type] — core/src/components/ui/stepper.tsx
- StepperItem [type] — core/src/components/ui/stepper.tsx
- StreamingAnswer [value] — core/src/components/ui/agent/streaming-answer.tsx
- StreamingAnswerProps [type] — core/src/components/ui/agent/streaming-answer.tsx
- StreamingAnswerStatus [type] — core/src/components/ui/agent/streaming-answer.tsx
- StreamingSource [type] — core/src/components/ui/agent/streaming-answer.tsx
- StyledLink [value] — core/src/components/ui/link.tsx
- SurfaceCard [value] — core/src/components/ui/surface-card.tsx
- SurfaceCardPadding [type] — core/src/components/ui/surface-card.tsx
- TabBar [value] — core/src/components/ui/tab-bar.tsx
- TabBarColor [type] — core/src/components/ui/tab-bar.tsx
- TabBarSurface [type] — core/src/components/ui/tab-bar.tsx
- TabItem [type] — core/src/components/ui/tab-bar.tsx
- TableCell [value] — core/src/components/ui/data-table.tsx
- TableCellProps [type] — core/src/components/ui/data-table.tsx
- TableCellVariant [type] — core/src/components/ui/data-table.tsx
- TableColumnAlign [type] — core/src/components/ui/data-table.tsx
- TableValueKind [type] — core/src/components/ui/data-table.tsx
- TabsContent [value] — core/src/components/ui/tabs-content.tsx
- TabsContentProps [type] — core/src/components/ui/tabs-content.tsx
- TaskCard [value] — core/src/components/ui/task-card.tsx
- TaskCardColor [type] — core/src/components/ui/task-card.tsx
- Team [type] — core/src/components/layouts/sidebar-popovers.tsx
- TeamSwitcherLabels [type] — core/src/components/layouts/sidebar-popovers.tsx
- TextArea [value] — core/src/components/ui/forms/text-area.tsx
- TextAreaColor [type] — core/src/components/ui/forms/text-area.tsx
- TextAreaProps [type] — core/src/components/ui/forms/text-area.tsx
- TextAreaShape [type] — core/src/components/ui/forms/text-area.tsx
- TextAreaState [type] — core/src/components/ui/forms/text-area.tsx
- TextField [value] — core/src/components/ui/forms/text-field.tsx
- TextFieldColor [type] — core/src/components/ui/forms/text-field.tsx
- TextFieldProps [type] — core/src/components/ui/forms/text-field.tsx
- TextFieldSelectSuffix [value] — core/src/components/ui/forms/text-field-select.tsx
- TextFieldShape [type] — core/src/components/ui/forms/text-field.tsx
- TextFieldState [type] — core/src/components/ui/forms/text-field.tsx
- ThinkingRow [type] — core/src/components/ui/agent/thinking-trace.tsx
- ThinkingTrace [value] — core/src/components/ui/agent/thinking-trace.tsx
- ThinkingVariant [type] — core/src/components/ui/agent/thinking-trace.tsx
- ToastApi [type] — core/src/components/ui/toast.tsx
- ToastOptions [type] — core/src/components/ui/toast.tsx
- ToastProvider [value] — core/src/components/ui/toast.tsx
- Toggle [value] — core/src/components/ui/forms/selection-control.tsx
- ToggleProps [type] — core/src/components/ui/forms/selection-control.tsx
- Toolbar [value] — core/src/components/ui/toolbar.tsx
- ToolbarActions [value] — core/src/components/ui/toolbar.tsx
- ToolbarColor [type] — core/src/components/ui/toolbar.tsx
- ToolbarDatepicker [value] — core/src/components/ui/toolbar.tsx
- ToolbarFavoriteButton [value] — core/src/components/ui/toolbar.tsx
- ToolbarFilterButton [value] — core/src/components/ui/toolbar.tsx
- ToolbarKebabButton [value] — core/src/components/ui/toolbar.tsx
- ToolbarPillTab [type] — core/src/components/ui/toolbar.tsx
- ToolbarPillTabs [value] — core/src/components/ui/toolbar.tsx
- ToolbarProps [type] — core/src/components/ui/toolbar.tsx
- ToolbarSearchInput [value] — core/src/components/ui/toolbar.tsx
- ToolbarSelectDropdown [value] — core/src/components/ui/toolbar.tsx
- ToolbarSelectionOptions [type] — core/src/components/ui/toolbar.tsx
- ToolbarShowSelect [value] — core/src/components/ui/toolbar.tsx
- ToolChipDetail [type] — core/src/components/ui/agent/tool-chips.tsx
- ToolChipItem [type] — core/src/components/ui/agent/tool-chips.tsx
- ToolChipKind [type] — core/src/components/ui/agent/tool-chips.tsx
- ToolChips [value] — core/src/components/ui/agent/tool-chips.tsx
- ToolDiffChip [type] — core/src/components/ui/agent/tool-chips.tsx
- Tooltip [value] — core/src/components/ui/tooltip.tsx
- TooltipAnchor [value] — core/src/components/ui/tooltip.tsx
- TooltipAnchorState [type] — core/src/components/ui/tooltip.tsx
- TooltipBubble [value] — core/src/components/ui/tooltip.tsx
- TooltipGroup [value] — core/src/components/ui/tooltip.tsx
- TooltipPosition [type] — core/src/components/ui/tooltip.tsx
- TooltipSize [type] — core/src/components/ui/tooltip.tsx
- TopBar [value] — core/src/components/ui/topbar.tsx
- TopBarColor [type] — core/src/components/ui/topbar.tsx
- TrendDirection [type] — core/src/components/ui/card-utils.tsx
- TypefaceBlock [value] — core/src/components/ui/style-guide.tsx
- TypographySizeRow [value] — core/src/components/ui/style-guide.tsx
- TypographyWeightSample [value] — core/src/components/ui/style-guide.tsx
- UserCard [value] — core/src/components/ui/user-card.tsx
- useToast [value] — core/src/components/ui/toast.tsx
- WalletGoalCard [value] — core/src/components/ui/wallet-goal-card.tsx
- WalletGoalCardProps [type] — core/src/components/ui/wallet-goal-card.tsx
- WheelChartStatCard [value] — core/src/components/ui/wheel-chart-stat-card.tsx
- WheelChartStatCardProps [type] — core/src/components/ui/wheel-chart-stat-card.tsx
- WheelColor [type] — core/src/components/ui/wheel-chart-stat-card.tsx

## Block gallery and detail routes

- /blocks — category-filtered gallery of 70 copyable Blocks
- /blocks/kpi-metrics — 图表与指标 / KPI 指标行; /r/kpi-metrics.json
- /blocks/recent-records — 数据列表 / 最近记录表卡; /r/recent-records.json
- /blocks/trend-chart — 图表与指标 / 趋势图表卡; /r/trend-chart.json
- /blocks/ranking-list — 数据列表 / 排行列表卡; /r/ranking-list.json
- /blocks/composition-card — 图表与指标 / 构成占比卡; /r/composition-card.json
- /blocks/region-distribution — 图表与指标 / 地区分布卡; /r/region-distribution.json
- /blocks/goal-progress-list — 财务 / 目标进度列表; /r/goal-progress-list.json
- /blocks/card-carousel — 财务 / 卡片轮播; /r/card-carousel.json
- /blocks/crm-summary — 图表与指标 / 客户经营摘要; /r/crm-summary.json
- /blocks/finance-workspace — 财务 / 财务工作区; /r/finance-workspace.json
- /blocks/overview-dashboard — 看板首屏 / 经营概览; /r/overview-dashboard.json
- /blocks/orders-table-section — 数据列表 / 订单列表; /r/orders-table-section.json
- /blocks/project-overview — 看板首屏 / 项目概览; /r/project-overview.json
- /blocks/finance-overview — 看板首屏 / 财务概览; /r/finance-overview.json
- /blocks/products-table — 数据列表 / 商品列表; /r/products-table.json
- /blocks/customers-table — 数据列表 / 客户列表; /r/customers-table.json
- /blocks/sellers-table — 数据列表 / 商家列表; /r/sellers-table.json
- /blocks/categories-table — 数据列表 / 商品分类; /r/categories-table.json
- /blocks/order-detail — 详情页 / 订单详情; /r/order-detail.json
- /blocks/invoice-document — 详情页 / 发票单据; /r/invoice-document.json
- /blocks/customer-profile — 详情页 / 客户详情; /r/customer-profile.json
- /blocks/product-detail — 详情页 / 商品详情; /r/product-detail.json
- /blocks/leads-table — 数据列表 / 销售线索; /r/leads-table.json
- /blocks/deals-table — 数据列表 / 商机列表; /r/deals-table.json
- /blocks/lead-detail — 详情页 / 线索详情; /r/lead-detail.json
- /blocks/product-form — 表单 / 分组表单; /r/product-form.json
- /blocks/order-form — 表单 / 分步表单; /r/order-form.json
- /blocks/invoice-form — 表单 / 单卡表单; /r/invoice-form.json
- /blocks/kanban-board — 协作与项目 / 项目看板; /r/kanban-board.json
- /blocks/task-detail — 详情页 / 任务详情; /r/task-detail.json
- /blocks/member-profile — 详情页 / 成员详情; /r/member-profile.json
- /blocks/calendar-month — 协作与项目 / 月历日程; /r/calendar-month.json
- /blocks/file-manager — 协作与项目 / 文件管理; /r/file-manager.json
- /blocks/transactions-table — 财务 / 交易流水; /r/transactions-table.json
- /blocks/invoices-table — 数据列表 / 发票列表; /r/invoices-table.json
- /blocks/cards-management — 财务 / 企业卡管理; /r/cards-management.json
- /blocks/savings-goals-table — 财务 / 储蓄目标表; /r/savings-goals-table.json
- /blocks/wealth-overview — 看板首屏 / 资产概览; /r/wealth-overview.json
- /blocks/client-directory — 数据列表 / 客户名录; /r/client-directory.json
- /blocks/register-form — 认证 / 注册; /r/register-form.json
- /blocks/password-recovery — 认证 / 找回密码; /r/password-recovery.json
- /blocks/ai-workspace-overview — AI 与智能体 / 智能体工作台; /r/ai-workspace-overview.json
- /blocks/agent-catalog — AI 与智能体 / 应用智能体目录; /r/agent-catalog.json
- /blocks/agent-run — AI 与智能体 / 任务会话; /r/agent-run.json
- /blocks/task-run-detail — AI 与智能体 / 任务执行详情; /r/task-run-detail.json
- /blocks/runtime-list — AI 与智能体 / 运行时管理; /r/runtime-list.json
- /blocks/message-channels — AI 与智能体 / 消息渠道; /r/message-channels.json
- /blocks/autonomous-agents — AI 与智能体 / 自主智能体; /r/autonomous-agents.json
- /blocks/ai-assistant-home — AI 与智能体 / 智能体对话; /r/ai-assistant-home.json
- /blocks/agent-orchestration — AI 与智能体 / 多智能体编排; /r/agent-orchestration.json
- /blocks/agent-usage — AI 与智能体 / 用量与成本; /r/agent-usage.json
- /blocks/prompt-evals — AI 与智能体 / 提示词评测; /r/prompt-evals.json
- /blocks/settings-profile — 设置 / 个人资料设置; /r/settings-profile.json
- /blocks/settings-members — 设置 / 成员与团队; /r/settings-members.json
- /blocks/settings-roles — 设置 / 角色与权限; /r/settings-roles.json
- /blocks/settings-notifications — 设置 / 通知设置; /r/settings-notifications.json
- /blocks/settings-security — 设置 / 安全设置; /r/settings-security.json
- /blocks/settings-billing — 设置 / 账单与套餐; /r/settings-billing.json
- /blocks/project-portfolio — 协作与项目 / 项目总览; /r/project-portfolio.json
- /blocks/workflow-builder — AI 与智能体 / 工作流编辑器; /r/workflow-builder.json
- /blocks/integrations-directory — 设置 / 集成目录; /r/integrations-directory.json
- /blocks/onboarding-flow — 认证 / 引导流程; /r/onboarding-flow.json
- /blocks/login-form — 认证 / 登录; /r/login-form.json
- /blocks/layout-topbar-profile — 页面结构 / 顶栏头像布局; /r/layout-topbar-profile.json
- /blocks/layout-sidebar-profile — 页面结构 / 侧栏头像布局; /r/layout-sidebar-profile.json
- /blocks/layout-icon-rail — 页面结构 / 图标栏布局; /r/layout-icon-rail.json
- /blocks/layout-settings — 页面结构 / 设置页布局; /r/layout-settings.json
- /blocks/layout-immersive — 页面结构 / 沉浸式布局; /r/layout-immersive.json
- /blocks/provider-settings-form — 表单 / 服务配置表单; /r/provider-settings-form.json
- /blocks/dialog-form — 表单 / 弹窗表单; /r/dialog-form.json

## Template routes

- /templates — src/app/templates/page.tsx
- /templates/agent — src/app/templates/agent/page.tsx
- /templates/crm-template — src/app/templates/crm-template/page.tsx
- /templates/crm-template/activity — src/app/templates/crm-template/activity/page.tsx
- /templates/crm-template/customers — src/app/templates/crm-template/customers/page.tsx
- /templates/crm-template/customers/[id] — src/app/templates/crm-template/customers/[id]/page.tsx (route pattern; use real IDs)
- /templates/crm-template/customers/new — src/app/templates/crm-template/customers/new/page.tsx
- /templates/crm-template/forgot-password — src/app/templates/crm-template/forgot-password/page.tsx
- /templates/crm-template/leads — src/app/templates/crm-template/leads/page.tsx
- /templates/crm-template/leads/[id] — src/app/templates/crm-template/leads/[id]/page.tsx (route pattern; use real IDs)
- /templates/crm-template/leads/new — src/app/templates/crm-template/leads/new/page.tsx
- /templates/crm-template/overview — src/app/templates/crm-template/overview/page.tsx
- /templates/crm-template/register — src/app/templates/crm-template/register/page.tsx
- /templates/crm-template/reset-password — src/app/templates/crm-template/reset-password/page.tsx
- /templates/crm-template/sales — src/app/templates/crm-template/sales/page.tsx
- /templates/crm-template/sales/[id] — src/app/templates/crm-template/sales/[id]/page.tsx (route pattern; use real IDs)
- /templates/crm-template/sales/new — src/app/templates/crm-template/sales/new/page.tsx
- /templates/dashboard-builder — src/app/templates/dashboard-builder/page.tsx
- /templates/dashboard-builder/[variant] — src/app/templates/dashboard-builder/[variant]/page.tsx (route pattern; use real IDs)
- /templates/dashboards — src/app/templates/(dashboards)/dashboards/page.tsx
- /templates/dashboards/analytics — src/app/templates/(dashboards)/dashboards/analytics/page.tsx
- /templates/dashboards/crm — src/app/templates/(dashboards)/dashboards/crm/page.tsx
- /templates/dashboards/ecommerce-1 — src/app/templates/(dashboards)/dashboards/ecommerce-1/page.tsx
- /templates/dashboards/ecommerce-2 — src/app/templates/(dashboards)/dashboards/ecommerce-2/page.tsx
- /templates/dashboards/ecommerce-3 — src/app/templates/(dashboards)/dashboards/ecommerce-3/page.tsx
- /templates/dashboards/finance-1 — src/app/templates/(dashboards)/dashboards/finance-1/page.tsx
- /templates/dashboards/finance-2 — src/app/templates/(dashboards)/dashboards/finance-2/page.tsx
- /templates/dashboards/finance-3 — src/app/templates/(dashboards)/dashboards/finance-3/page.tsx
- /templates/dashboards/project-1 — src/app/templates/(dashboards)/dashboards/project-1/page.tsx
- /templates/dashboards/project-2 — src/app/templates/(dashboards)/dashboards/project-2/page.tsx
- /templates/ecommerce/categories — src/app/templates/(dashboard)/ecommerce/categories/page.tsx
- /templates/ecommerce/categories/[id] — src/app/templates/(dashboard)/ecommerce/categories/[id]/page.tsx (route pattern; use real IDs)
- /templates/ecommerce/categories/[id]/edit — src/app/templates/(dashboard)/ecommerce/categories/[id]/edit/page.tsx (route pattern; use real IDs)
- /templates/ecommerce/categories/new — src/app/templates/(dashboard)/ecommerce/categories/new/page.tsx
- /templates/ecommerce/customers — src/app/templates/(dashboard)/ecommerce/customers/page.tsx
- /templates/ecommerce/customers/[id] — src/app/templates/(dashboard)/ecommerce/customers/[id]/page.tsx (route pattern; use real IDs)
- /templates/ecommerce/orders — src/app/templates/(dashboard)/ecommerce/orders/page.tsx
- /templates/ecommerce/orders/[id] — src/app/templates/(dashboard)/ecommerce/orders/[id]/page.tsx (route pattern; use real IDs)
- /templates/ecommerce/orders/[id]/invoice — src/app/templates/(dashboard)/ecommerce/orders/[id]/invoice/page.tsx (route pattern; use real IDs)
- /templates/ecommerce/orders/new — src/app/templates/(dashboard)/ecommerce/orders/new/page.tsx
- /templates/ecommerce/products — src/app/templates/(dashboard)/ecommerce/products/page.tsx
- /templates/ecommerce/products/[id] — src/app/templates/(dashboard)/ecommerce/products/[id]/page.tsx (route pattern; use real IDs)
- /templates/ecommerce/products/[id]/edit — src/app/templates/(dashboard)/ecommerce/products/[id]/edit/page.tsx (route pattern; use real IDs)
- /templates/ecommerce/products/new — src/app/templates/(dashboard)/ecommerce/products/new/page.tsx
- /templates/ecommerce/sellers — src/app/templates/(dashboard)/ecommerce/sellers/page.tsx
- /templates/ecommerce/sellers/[id] — src/app/templates/(dashboard)/ecommerce/sellers/[id]/page.tsx (route pattern; use real IDs)
- /templates/finance-template — src/app/templates/finance-template/page.tsx
- /templates/finance-template/cards — src/app/templates/finance-template/cards/page.tsx
- /templates/finance-template/forgot-password — src/app/templates/finance-template/forgot-password/page.tsx
- /templates/finance-template/invoices — src/app/templates/finance-template/invoices/page.tsx
- /templates/finance-template/invoices/[id] — src/app/templates/finance-template/invoices/[id]/page.tsx (route pattern; use real IDs)
- /templates/finance-template/invoices/new — src/app/templates/finance-template/invoices/new/page.tsx
- /templates/finance-template/overview — src/app/templates/finance-template/overview/page.tsx
- /templates/finance-template/register — src/app/templates/finance-template/register/page.tsx
- /templates/finance-template/reset-password — src/app/templates/finance-template/reset-password/page.tsx
- /templates/finance-template/transactions — src/app/templates/finance-template/transactions/page.tsx
- /templates/finance-template/wallets — src/app/templates/finance-template/wallets/page.tsx
- /templates/finance-template/wealth — src/app/templates/finance-template/wealth/page.tsx
- /templates/micellaneous-template — src/app/templates/micellaneous-template/page.tsx
- /templates/micellaneous-template/actions — src/app/templates/micellaneous-template/actions/page.tsx
- /templates/micellaneous-template/calendar — src/app/templates/micellaneous-template/calendar/page.tsx
- /templates/micellaneous-template/chat — src/app/templates/micellaneous-template/chat/page.tsx
- /templates/micellaneous-template/files — src/app/templates/micellaneous-template/files/page.tsx
- /templates/micellaneous-template/forgot-password — src/app/templates/micellaneous-template/forgot-password/page.tsx
- /templates/micellaneous-template/register — src/app/templates/micellaneous-template/register/page.tsx
- /templates/micellaneous-template/reset-password — src/app/templates/micellaneous-template/reset-password/page.tsx
- /templates/project-template — src/app/templates/project-template/page.tsx
- /templates/project-template/clients — src/app/templates/project-template/clients/page.tsx
- /templates/project-template/clients/[id] — src/app/templates/project-template/clients/[id]/page.tsx (route pattern; use real IDs)
- /templates/project-template/files — src/app/templates/project-template/files/page.tsx
- /templates/project-template/invoices — src/app/templates/project-template/invoices/page.tsx
- /templates/project-template/members — src/app/templates/project-template/members/page.tsx
- /templates/project-template/members/[id] — src/app/templates/project-template/members/[id]/page.tsx (route pattern; use real IDs)
- /templates/project-template/overview — src/app/templates/project-template/overview/page.tsx
- /templates/project-template/projects — src/app/templates/project-template/projects/page.tsx
- /templates/project-template/projects/[id] — src/app/templates/project-template/projects/[id]/page.tsx (route pattern; use real IDs)
- /templates/project-template/tasks/[id] — src/app/templates/project-template/tasks/[id]/page.tsx (route pattern; use real IDs)
- /templates/task-board — src/app/templates/task-board/page.tsx
- /templates/task-board/agents — src/app/templates/task-board/agents/page.tsx
- /templates/task-board/agents/[agent] — src/app/templates/task-board/agents/[agent]/page.tsx (route pattern; use real IDs)
- /templates/task-board/library — src/app/templates/task-board/library/page.tsx
- /templates/task-board/projects — src/app/templates/task-board/projects/page.tsx
- /templates/task-board/projects/[project] — src/app/templates/task-board/projects/[project]/page.tsx (route pattern; use real IDs)
- /templates/task-board/tasks — src/app/templates/task-board/tasks/page.tsx
- /templates/task-board/today — src/app/templates/task-board/today/page.tsx

## Case routes

- /cases — src/app/cases/page.tsx
- /cases/accordion — src/app/cases/accordion/page.tsx
- /cases/agent — src/app/cases/agent/page.tsx
- /cases/badge — src/app/cases/badge/page.tsx
- /cases/button-link — src/app/cases/button-link/page.tsx
- /cases/calendar — src/app/cases/calendar/page.tsx
- /cases/card — src/app/cases/card/page.tsx
- /cases/chart — src/app/cases/chart/page.tsx
- /cases/chat — src/app/cases/chat/page.tsx
- /cases/chat-input-bar — src/app/cases/chat-input-bar/page.tsx
- /cases/checklist — src/app/cases/checklist/page.tsx
- /cases/comment — src/app/cases/comment/page.tsx
- /cases/dashboard-kit — src/app/cases/dashboard-kit/page.tsx
- /cases/feedback — src/app/cases/feedback/page.tsx
- /cases/filter — src/app/cases/filter/page.tsx
- /cases/grid — src/app/cases/grid/page.tsx
- /cases/history — src/app/cases/history/page.tsx
- /cases/input-field — src/app/cases/input-field/page.tsx
- /cases/list — src/app/cases/list/page.tsx
- /cases/map — src/app/cases/map/page.tsx
- /cases/menu — src/app/cases/menu/page.tsx
- /cases/menu-sections — src/app/cases/menu-sections/page.tsx
- /cases/menu-sections/[view] — src/app/cases/menu-sections/[view]/page.tsx (route pattern; use real IDs)
- /cases/modal — src/app/cases/modal/page.tsx
- /cases/motion — src/app/cases/motion/page.tsx
- /cases/other-widget — src/app/cases/other-widget/page.tsx
- /cases/page-header — src/app/cases/page-header/page.tsx
- /cases/pagination-stepper — src/app/cases/pagination-stepper/page.tsx
- /cases/progress — src/app/cases/progress/page.tsx
- /cases/tab — src/app/cases/tab/page.tsx
- /cases/table — src/app/cases/table/page.tsx
- /cases/toolbar — src/app/cases/toolbar/page.tsx
- /cases/tooltip — src/app/cases/tooltip/page.tsx

---

Source: skills/forge-skill/SKILL.md

---
name: forge-skill
description: 使用 Forge / forge-ui 设计与实现看板、后台、管理系统及 starter 页面；按 Screen、Blocks、Components 复用模板和组件，核对 API、内容布局、交互与验收边界。
---

# Forge 页面设计与实施

## 唯一入口与阅读顺序

可选检索入口：[MCP 接入](https://forgeui.org/docs/mcp)、[使用指南](https://forgeui.org/guides) 与 [llms.txt](https://forgeui.org/llms.txt)。MCP 地址为 `https://forgeui.org/api/mcp`；只读数据辅助选型，不替代本 skill 规范正文。

唯一通用入口是本文件 `forge-skill/SKILL.md`，不同时拼读全局安装版与项目同步版。优先级：用户指定的版本/checkout > starter 已校验的 `docs/forge-skill/upstream/SKILL.md` > 全局安装的 forge-skill。项目内没有同步副本时才用全局版；版本不符应先同步并核对 manifest，不能静默混用。

在 starter 内先读该仓 AGENTS.md 与本任务对应的 quick-start / new-module / new-page，然后读项目 `docs/forge-skill/upstream/SKILL.md`；依次读 Screens → 主对照 Screen 源码 → Blocks 配方及单项 Props → 所用 Components 契约 → audit-checklist。全局 skill 在 starter 中仅负责找到并转入这一入口；starter 的路由、RBAC、数据与工程规则仍以 starter 专用 skill 为准。

## 先读项目

动手前运行 `node <skill目录>/scripts/project-info.mjs <项目根目录>`：它报告已装的 core 版本与本 skill 描述的版本是否一致、Next/React/Tailwind 版本、是否 forge-starter、项目里已有的页面组件和 AGENTS.md / DESIGN.md / MCP 配置。版本不一致时以项目 node_modules 里的类型为准；已有页面组件优先复用。

## 先确定范围

只交付用户授权的页面或系统；单页请求不自动扩成工作台、多模块或治理系统。先说明用户、对象、任务、页面角色、数据来源及完成标准。在 forge-starter 内先走该仓的 quick-start / new-module / new-page / audit skills：主 skill 提供通用规范，starter 负责路由、权限、数据库与工程约定。

## Screen → Blocks → Components

1. **Screen**：先选同角色、同业务密度的真实模板，记录源码路径与版本。看板必须从 [10 个 Screen](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/screens.md) 起步，不从四张指标卡自由拼页。
2. **Blocks**：复用模板中职责明确的页面组件；[页面组件目录](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md) 列出 70 个可复制源码（blocks/ 与 public/r/），覆盖看板首屏、AI 与智能体、数据列表、详情页、表单、协作、财务、设置与认证；不是 core 导出，按需复制进项目后自行维护。
3. **Components**：使用安装版本真实导出与 Props；查看 [生成 API](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/components/button.md) 和 [组件选型](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/component-recommended-standard.md)。不要猜测组件、图标、密度或交互参数。

缺失能力记录 **FORGE-GAP**：业务用途、已查组件与版本、缺口、影响、候选方案。标记并询问用户，不自行手搓公共原语或改 core。

## 模板和源码

- 看板：analytics、ecommerce-1、ecommerce-2、finance-1、finance-2、finance-3、project-1、project-2、crm、ecommerce-3；以 [Screen 目录](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/screens.md) 的实际路径为准。
- 业务模板：ecommerce、project-template、crm-template、finance-template、micellaneous-template、task-board、agent、dashboard-builder；[Screen 目录](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/screens.md) 覆盖全部 85 个页面源码（10 个看板、看板入口、74 个其他页面），动态示例使用真实 mock ID；不把模板演示当后端能力。
- 认证页使用 forge-starter 的实际路由，见 [认证模板](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/templates/auth.md)；不要引用不存在的 templates/auth；业务模板里的认证演示不提供真实会话能力。
- 运行 `node skills/forge-skill/scripts/list.mjs templates` 查看完整路由；`get-template.mjs dashboards/analytics` 同时输出 wrapper 和它引用的内容源；`get-component.mjs Button DataTable` 查询真实文档页。
- 脚本优先本地 `FORGE_REPO_DIR` 或当前 checkout，再只读回退 forge-ui/forge 的 main。离线缺源应报错，不能编造模板。

## 采用规则

- [页面规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md) 定布局与看板几何；[Grid](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/layout-grid.md) 定 API 和固定/比例列边界；[多维图方法](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-design-dimensional.md) 可随包使用，不依赖本机其他 skill。
- 组件来自 `@forge-ui-official/core`，图标来自 `@forge-ui-official/core/icons`。AppLayout 标识使用 `appName`；不要使用已弃用 teamName 或不存在的 FormField。
- 默认 accent/focus 为 blue，purple/black 仅为可选主题。7 个色族加 grey/white；token `fg-violet` 对应组件颜色 `"purple"`，见 [Tokens](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/tokens.md)。
- 状态默认 soft StatusBadge，分类/角色普通文字；一张表通常最多一个状态胶囊列，见 [状态表达](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/status-presentation.md)。
- 核对 [内容契约](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/component-content-contracts.md)、[弹层焦点](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/overlay-focus.md)、[动效](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/motion.md)。技术检查不等于浏览器和面向使用者的 验收。

## 交付前

先跑页面检查：MCP 的 `check_code`，或在项目根目录运行 `curl -fsSL https://forgeui.org/forge-check.mjs -o forge-check.mjs && node forge-check.mjs src`；错误全部修完，警告逐条确认。再按 [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md) 逐条记录通过、违规、不适用或未验证及证据。跑项目已有 typecheck、lint、测试和文档自检；需要数据库、浏览器、读屏器或实机而未执行的检查明确列出原因。不得把构建通过当视觉/真实操作验收。

接入专项：[Ask AI 宿主契约](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/ask-ai-host-contract.md)、[交互接入边界](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/interaction-adoption.md)。

---

Source: skills/forge-skill/references/admin-module-playbook.md

> 适用边界：以 SKILL.md 的用户授权范围为先。单页/局部任务只用相关契约；仅设计时不实施，已授权实施时再接对应模块与验证。状态默认 soft StatusBadge。

# Admin Module Playbook

Use this before building back-office systems or modules. The goal is to make the agent think like an admin product designer first, then compose Forge UI components second.

Good admin screens are not reports with many cards. They are work surfaces for managing objects, reviewing state, taking action, and recovering from mistakes.

A professional admin product is not one CRUD page. It is a connected system: navigation, workbench, resource modules, detail surfaces, mutation flows, settings, permissions, and audit trail all reinforce each other.

## Research Baseline

This playbook combines Forge templates with common patterns from mature admin ecosystems:

- React Admin models a back-office product around `Resource` definitions with list, create, edit, and show surfaces.
- Refine models resources with list/create/edit/show routes and standard table/form/show/delete actions.
- Ant Design Pro / ProComponents centers enterprise pages around query filters, ProTable, editable tables, modal/drawer forms, descriptions, and page containers.
- Modern shadcn admin templates commonly split by feature module, keep table filter/sort/page state in the URL, use drawers for mutation forms, and expose bulk actions only when rows are selected.
- Data table guidance from enterprise design systems converges on the same idea: tables are for finding, comparing, selecting, and acting on records, not just displaying text.

## Decision Pass

Before writing code, classify the task. A product can combine multiple types.

| Intent | Signals in the request | Primary model | Usual Forge surfaces |
|---|---|---|---|
| Resource management | orders, customers, projects, tasks, files, templates, users, invoices, rules | object lifecycle | list, detail, create/edit, delete/confirm, filters, batch actions |
| Analytics / monitoring | metrics, trends, dashboard, report, status, anomalies | insight and drill-down | KPI cards, charts, detail table, date filters, export |
| Workflow processing | approval, ticket, import, generate, publish, review, assign | queue + state machine | queue/list, detail panel, stepper, status actions, activity log |
| Collaboration | messages, comments, members, client communication, agent chat | conversation around objects | conversation list, chat stream, attachments, related object panel |
| Configuration | settings, permissions, integrations, notification, rules | grouped controls | settings sections, forms, toggles, reset/save, danger zone |

If the user asks for a single dashboard, keep it focused on insight. If the user asks for a module, product area, or management system, include the lifecycle surfaces that make the module usable.

## System Blueprint

Use this when the user asks for a "system", "platform", "admin", "后台", "业务系统", or anything broader than a single page.

```text
Product / domain:
Primary users:
Business goal:
Navigation groups:
Core modules:
Supporting modules:
Global dashboard / workbench:
High-frequency queues:
Cross-module links:
Shared objects:
Settings / permissions:
Audit / activity:
Notifications / jobs:
Data import / export:
```

System Brief format:

```text
This system helps <roles> operate <domain>.
Navigation: Dashboard, <core domain group>, <collaboration/workflow>, <finance/files>, Settings.
Core modules: <Module A>, <Module B>, <Module C>.
Workbench: shows KPIs, exceptions, assigned work, recent activity, and shortcuts into resource lists.
Operational loops: <queue -> detail -> action -> feedback>, <create/import -> validate -> review -> publish>.
Governance: roles, permissions, audit, settings, import/export, notification/job center.
Closest Forge references: project-template overview/projects/tasks/members/files/invoices, ecommerce products/orders/customers.
```

For system requests, build at least:

- App shell with domain navigation, not placeholder menu labels.
- Workbench/dashboard with metrics that link to work queues and resource lists.
- One core resource module with list, detail/inspector, create/edit, delete/archive confirmation, and state-driven row actions.
- One supporting module or surface: settings, permissions, files, invoices, members, messages, audit, or job center.
- Cross-module links so the UI feels like a product: customer -> orders, project -> tasks/files/members, invoice -> client/project, task -> assignee/activity.

If scope authorizes one screen, deliver that screen only; do not add a workbench or another module without approval.

## System Archetypes

Pick an archetype before choosing components. It gives the AI the expected modules and routes.

| Archetype | Typical modules | Workbench content | Operational loop |
|---|---|---|---|
| Project operations | overview, projects, tasks, members, files, invoices, clients, settings | project health, overdue tasks, blockers, recent files, invoice alerts | project list -> project detail -> task/file/member action -> activity |
| Commerce operations | overview, products, orders, customers, sellers, categories, invoices, refunds, settings | sales KPIs, pending orders, stock alerts, customer issues | order queue -> order detail -> fulfill/refund/message -> history |
| Data/reporting console | datasets, reports, templates, jobs, exports, permissions, audit | job status, failed imports, popular reports, freshness | upload/import -> validate -> map -> publish/export -> audit |
| Support/ticketing | inbox, tickets, customers, SLA, knowledge base, agents, settings | SLA risk, unassigned tickets, priority queue, agent load | queue -> ticket detail -> assign/reply/resolve -> satisfaction |
| Workflow/approval | requests, approvals, rules, teams, documents, audit, settings | pending approvals, risky changes, bottlenecks | request queue -> detail -> approve/reject/request changes -> audit |

For each archetype, the sidebar should expose the modules users work through daily. A dashboard alone is an entry point, not the whole product.

## Object Canvas

Fill this before composing UI. For substantial modules, share a short Module Brief with the user before writing the first JSX.

```text
Module:
Primary object:
Secondary objects:
User roles:
Object states:
State transitions:
High-frequency actions:
Dangerous actions:
Bulk actions:
Filters:
Sorts:
Search fields:
Detail tabs:
Form sections:
Audit / history:
Empty / loading / error / permission states:
Success behavior:
```

For a resource-management module, also sketch the resource contract:

```text
Resource name:
List route:
Create route or modal:
Show/detail route:
Edit route or modal:
Delete/archive action:
Bulk actions:
Import/export actions:
URL state: search, filters, sort, page, pageSize, view
```

Module Brief format:

```text
This module manages <object> for <roles>.
Core surfaces: list, detail, create/edit, <workflow/settings if needed>.
Main actions: <3-5 actions>.
State model: <states> with <important transitions>.
List behavior: <search/filter/sort/page/url/bulk>.
Mutation surfaces: <modal/drawer/full route/inline>.
Feedback states: <loading/empty/no results/error/permission/success>.
Closest Forge references: <template/case names>.
```

Keep the brief short. Its job is to stop the agent from writing a report-like dashboard when the product needs an operational module.

When generating a system, produce both a System Brief and a Module Brief for the first core module.

## Routing and Surface Decision

Choose the surface by product need, not by habit.

| Surface | Use when | Examples |
|---|---|---|
| Full route | shareable, bookmarkable, back-button friendly, complex form/detail, heavy data | `/orders/[id]`, `/products/[id]/edit` |
| Drawer / inspector | preserve list context while reading or making medium edits | task detail from queue, user update drawer |
| Modal form | 1-5 fields, quick action, low navigation value | assign owner, add member, change due date |
| Inline edit | table-like low-risk fields with obvious save/cancel | rule priority, simple status, display name |
| Stepper route/modal | ordered workflow or import with validation/review | CSV import, onboarding, report generation |

In Next.js App Router, if a modal/drawer should be shareable, consider route-backed UI using parallel/intercepting routes. If it is a transient quick action, local state is fine.

Examples from Forge templates:

- Ecommerce products: product list, product detail, new product, edit product, delete confirmation, product orders tab, reviews tab.
- Ecommerce orders: order list, order detail, invoice page, new order, delete confirmation, status badges, date/filter toolbar.
- Project template projects: project list with table/card switch, add/edit/delete modal, project detail tabs, kanban tasks, attachments, members.
- Project template members: member directory, table/card switch, add/edit/delete modal, member detail tabs for projects, tasks, and chat.
- Project template files/invoices: table, filters, pagination, delete confirmation, file/invoice-specific row actions.

## Page Map Patterns

### Resource Management

Typical routes or screens:

```text
/objects                 list / table / grid
/objects/new             create
/objects/[id]            detail
/objects/[id]/edit       edit
delete/archive           confirmation dialog
bulk action              selection toolbar
import/export            toolbar action or stepper
```

Use routes for complex forms or content-heavy detail pages. Use modals for small add/edit flows such as adding a member, editing a task date, assigning a user, or uploading an attachment.

Resource surface choices:

- Full page create/edit: many fields, multiple sections, uploads, permissions, review step, or risky changes.
- Drawer create/edit: medium complexity, user should keep list context visible, common in tasks/users/settings.
- Modal form: 1-5 fields, quick add/edit/assign/change date.
- Inline edit: table-like configuration, low-risk fields, obvious save/cancel behavior.
- Detail page: object needs tabs, related records, files, comments, history, or status operations.
- Master-detail: user must scan a queue/list while processing one selected object.

### Right Drawer / Inspector

Typical surfaces:

- Left/main area: table, grid, queue, or calendar.
- Right drawer: selected object summary, fields, related activity, comments, and primary actions.
- Drawer state can be local for quick inspection or URL-backed when users need to share the selected object.
- Use this for tasks, tickets, users, files, alerts, and approvals when users repeatedly scan many records.

### Analytics With Drill-Down

Typical surfaces:

- Dashboard with KPI cards, trend charts, anomaly/todo list.
- Date range and dimension filters in the toolbar.
- Detail table below charts for drill-down.
- Links from KPI/chart/table row to the underlying resource list or detail page.
- Export action when the report is likely to be shared.

### Workflow Queue

Typical surfaces:

- Queue list with status, assignee, SLA/due date, priority, and last update.
- Detail page or right panel with object summary, form/process controls, comments, attachments, and activity.
- State actions: approve, reject, assign, start, pause, publish, archive.
- Confirmation for irreversible state changes.

### Settings / Rules

Typical surfaces:

- Category navigation with `TabBar`, `ButtonGroup`, or `ListGroup`.
- Each setting group has a title, description, current value/control, and save/reset behavior.
- Rule tables need status, owner, last updated, enable/disable, duplicate, delete.
- Dangerous account/system operations live in a separated danger area.

### Configuration Deep Dive

Common SaaS configuration modules:

- Integrations: provider cards, connect/disconnect, test connection, last sync, scopes.
- API keys: create, copy once, rotate, revoke, scopes, last used.
- Webhooks: endpoint URL, subscribed events, signing secret, delivery logs, retry.
- Notifications: event x channel matrix, per-role defaults, quiet hours.
- Members and roles: invite, role, team, suspend/remove, MFA/SSO policy.
- Billing: plan, usage meter, upgrade/downgrade, payment method, invoice history.

## List Page Contract

A management list usually needs:

- Page title and primary action: New/Create/Add.
- Toolbar: search, status/type filter, date range, view switch, import/export, display count.
- Table or grid body: main object cell, key fields, status, owner, updated/due date, actions.
- Sorting for columns users compare: date, amount, status, priority, progress.
- Pagination or show count for long lists.
- Row click opens detail; explicit row actions handle edit, duplicate, archive, delete.
- Selection enables batch actions: archive, assign, change status, delete, export.
- Empty state explains whether no records exist or filters hide results.
- URL state for shareable operational views when useful: search, filters, sort, page, pageSize, and view mode.
- Column visibility or display settings when the dataset has many optional fields.
- Saved views or segments for repeated operational filters, such as "Overdue", "Needs review", "High priority", "My items".
- Pinned columns for wide operational tables when identity/actions must remain visible.
- Density mode when the same table serves both review and bulk operation workflows.

Forge mapping:

- Toolbar: `Toolbar`, `ToolbarSearchInput`, `ToolbarFilterButton`, `ToolbarDatepicker`, `ToolbarShowSelect`, `ToolbarActions`.
- Data: `FullWidthTable` for full-page management lists; `DataTable` for embedded dashboard/detail tables; `StatusBadge`, `CellActions`, `CellKebabMenu`, `KebabMenu`, `Pagination`.
- Confirmation: `ConfirmationDialog` with controlled `open` / `onOpenChange`; omit `open` only for inline content in an existing host shell. Do not double-wrap controlled mode.
- Feedback: use inline form/list feedback for validation and recoverable errors. Forge exports `ToastProvider` and `useToast` (`toast`, `dismiss`, `update`). Place the hook below the provider or reuse the host notification system; durable failures still need inline feedback. `NotificationItem` remains suitable for notification centers and job lists.

From design systems: data table toolbars commonly host primary actions, search, filtering, table settings, and utilities; selected rows should reveal batch actions rather than forcing repetitive row-by-row work.

List anatomy:

```text
Page header:
  title, description, primary action, optional secondary actions
Toolbar:
  search, filters, date range, view switch, import/export, display settings
Bulk bar:
  appears only when rows are selected
Table/grid:
  identity column, comparable fields, status, owner, dates, actions
Footer:
  pagination, selected count, total count
Feedback:
  loading, empty, no-filter-results, error, permission denied
```

Bulk action rules:

- Make it clear whether selection covers current page only or all matching records.
- For cross-page selection, expose a "select all matching" choice.
- For async bulk jobs, show progress via toast/notification/job center.
- For partial failure, show "n of m failed" with a detail table or downloadable report.
- Bulk delete or irreversible bulk changes may require typed confirmation.

Filtering rules:

- Keep high-frequency filters visible.
- Move advanced filters into a panel.
- Show applied filters as chips or clearable state when space allows.
- Store search/filter/sort/page in URL when the view should survive refresh/share/back.

List implementation skeleton:

```tsx
"use client";

import {
  Button,
  CellText,
  CellTextSubtitle,
  FullWidthTable,
  KebabMenu,
  StatusBadge,
  TextField,
  Toolbar,
  ToolbarActions,
  ToolbarDatepicker,
  ToolbarFilterButton,
  type ColumnDef,
  type KebabMenuItem,
} from "@forge-ui-official/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear, EyeLinear, PenLinear, TrashBinTrashLinear, MagniferLinear } from "@forge-ui-official/core/icons";

type OrderStatus = "draft" | "pending" | "paid" | "void";
type OrderRow = { id: string; number: string; customer: string; status: OrderStatus; updatedAt: string };
// Replace openOrder/openEdit/openDeleteConfirm with route pushes or dialog state from the host app.

const statusColor = {
  draft: "grey",
  pending: "yellow",
  paid: "green",
  void: "red",
} as const;

function useTableUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value == null || value === "") next.delete(key);
      else next.set(key, value);
    });
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
}

function getOrderActions(row: OrderRow): KebabMenuItem[] {
  const base: KebabMenuItem[] = [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => openOrder(row.id) },
    { label: "Edit", icon: <PenLinear size={16} color="#71717A" />, onSelect: () => openEdit(row.id) },
  ];
  if (row.status !== "paid") {
    base.push({
      label: "Delete",
      icon: <TrashBinTrashLinear size={16} color="var(--fg-red)" />,
      danger: true,
      onSelect: () => openDeleteConfirm(row.id),
    });
  }
  return base;
}

const columns: ColumnDef<OrderRow>[] = [
  { key: "number", header: "Order", sortable: true, flex: true,
    render: (row) => <CellTextSubtitle title={row.number} subtitle={row.customer} /> },
  { key: "status", header: "Status", width: "w-32",
    render: (row) => <StatusBadge label={row.status} color={statusColor[row.status]} /> },
  { key: "updatedAt", header: "Updated", sortable: true, width: "w-40",
    render: (row) => <CellText>{row.updatedAt}</CellText> },
  { key: "actions", header: "", width: "w-16",
    render: (row) => <KebabMenu items={getOrderActions(row)} /> },
];

export function OrdersList({ rows, selectedRows }: { rows: OrderRow[]; selectedRows: Set<number> }) {
  const setUrlState = useTableUrlState();

  return (
    <div className="flex w-full flex-col gap-4">
      <Toolbar
        left={
          <TextField
            placeholder="Search orders..."
            iconLeft={<MagniferLinear size={20} color="#71717A" />}
            onChange={(value) => setUrlState({ q: value, page: "1" })}
            className="w-80"
          />
        }
        right={
          <ToolbarActions>
            <ToolbarDatepicker label="Last 30 days" />
            <ToolbarFilterButton label="Filters" />
            <Button iconLeft={<AddCircleLinear size={16} color="white" />}>New order</Button>
          </ToolbarActions>
        }
      />
      <FullWidthTable<OrderRow>
        title="Orders"
        subtitle="Manage order lifecycle, payment status, and customer follow-up."
        columns={columns}
        rows={rows}
        showCheckbox
        selectedRows={selectedRows}
        showPagination
        currentPage={1}
        totalPages={8}
        onPageChange={(page) => setUrlState({ page: String(page) })}
        onSort={(sort) => setUrlState({ sort, page: "1" })}
        paginationLabel="Showing 1-20 of 156"
      />
    </div>
  );
}
```

`ToolbarSearchInput` is display-only today. When search needs to update URL state, use `TextField` with a search icon or a project wrapper that exposes `value` and `onChange`.

## Detail Page Contract

A detail page usually needs:

- Back navigation and breadcrumbs.
- Header summary: name/id, status, owner, key date, primary action.
- Summary cards only when they explain the object, not as decoration.
- Field groups: business identity, ownership, dates, financials, configuration.
- Related data: orders, tasks, files, members, invoices, usage, comments.
- History/audit: who changed what and when.
- Contextual actions: edit, duplicate, export, assign, change status, archive/delete.
- Danger actions with clear impact.
- A clear path back to the filtered list, not only browser back.

Forge mapping:

- Header: `AppLayout pageHeaderVariant="detail"`, `Breadcrumbs`, `PageHeader`.
- Fields: `DescriptionItem`, `ListGroup`, `ListItem`. `DescriptionItem` uses `content`, not `value`; `ListGroup` requires `title` and `items`.
- Related records: `TabBar`, `DataTable`, `FileCard`, `ChatBubble`, `HistoryGrouped`.

Detail tab candidates:

- Overview: summary and core fields.
- Activity: audit, status changes, comments.
- Related records: orders, tasks, invoices, usage, members.
- Files: attachments and uploads.
- Conversation: comments, chat, agent messages.
- Settings/configuration: rule fields, permissions, integration config.

Inspector/detail skeleton:

```tsx
<TabBar
  tabs={[
    { label: "Overview", active: true },
    { label: "Activity" },
  ]}
  onChange={(index) => setActiveTab(index)}
/>
<ListGroup
  title="Order profile"
  subtitle="Key fields and current routing owner."
  items={
    <>
      <DescriptionItem label="Order" content={order.number} />
      <DescriptionItem label="Customer" content={order.customer} />
      <DescriptionItem label="Owner" content={order.owner} />
      <ListItem title="Current status" subtitle={order.status} />
    </>
  }
/>
```

`TabBar` uses `tabs`, not `items/value`; active state lives on each tab item.

## Create / Edit Contract

A create/edit surface usually needs:

- Clear title: Create X, Edit X, Add member, Upload file.
- Sections by business meaning: basic info, configuration, permissions/owner, files, review.
- Defaults where safe; placeholders are not labels.
- Validation state near the relevant field.
- Save/Create primary action; Cancel/Back secondary action.
- For edit: show current status and warn when changing fields that affect downstream usage.
- For complex create/import: use a stepper with review before submit.
- Unsaved-change handling for multi-section forms, long forms, and edit routes.
- Server/API errors mapped to fields when possible; otherwise show a page/form-level error.
- Validation should exist at both client and server/API boundaries when the app has real mutations.
- On submit failure, show field errors, a summary/banner when useful, and guide the user to the first failing section.
- Long forms may need draft save or autosave; edit routes may need concurrent-edit handling.
- Conditional fields and repeatable field arrays should be driven by the object schema, not ad hoc visibility hacks.

Forge mapping:

- Forms: `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `Checkbox`, `FileUpload`, `MediaUpload`, `Stepper`.
- Actions: `Button`, `IconButton`.
- Confirmation: `ConfirmationDialog` for cancel/discard or destructive state changes.

Form layout choices:

- Single-column: short forms and mobile.
- Two-column: dense business forms where fields are independent.
- Sectioned: complex entities; each section has heading, helper text, and grouped fields.
- Stepper: onboarding, import, complex creation, multi-stage workflow.
- Drawer/modal: quick add/edit while preserving table context.

Field error mapping skeleton:

```tsx
"use client";

import { useActionState, useState } from "react";
import { Button, TextField } from "@forge-ui-official/core";
import { createOrder, type OrderFormState } from "../actions";

export function OrderForm() {
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [state, action, pending] = useActionState<OrderFormState, FormData>(
    createOrder,
    {},
  );

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="customer" value={customer} />
      <input type="hidden" name="amount" value={amount} />
      <TextField
        id="customer"
        label="Customer"
        placeholder="Acme Inc."
        value={customer}
        onChange={setCustomer}
        state={state.fieldErrors?.customer ? "error" : "idle"}
        errorMessage={state.fieldErrors?.customer}
      />
      <TextField
        id="amount"
        label="Amount"
        placeholder="1200"
        suffix="USD"
        value={amount}
        onChange={setAmount}
        state={state.fieldErrors?.amount ? "error" : "idle"}
        errorMessage={state.fieldErrors?.amount}
      />
      {state.message && <p className="text-sm text-fg-grey-700">{state.message}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
```

`TextField` uses `state="error"` plus `errorMessage`; do not show validation only in a toast. `TextFieldProps` extends native input attributes (except `color`, `size`, `onChange`), so `name` and `type` are accepted; its `onChange` receives a string, not an event. Check form serialization for non-native controls separately.

## Data and State Lifecycle

Professional admin modules must account for data lifecycle:

- Loading: skeleton or stable frame; avoid layout jumps.
- Empty: no records yet; offer create/import when allowed.
- No results: filters/search hide records; offer clear filters.
- Error: explain failed operation and offer retry.
- Permission denied: explain missing access without leaking sensitive data.
- Mutating: disable duplicate submit, show progress, keep user context.
- Success: toast/inline feedback and navigate to list/detail as appropriate.
- Optimistic updates: only when rollback is understandable.
- Deleted/archived objects: decide whether they disappear, move to archive, or show restore.
- Partial degraded state: if one block fails but the list loads, degrade that block instead of failing the whole page.

State should drive actions. Do not show the same actions for every row if object status makes some actions invalid.

## Action and Dialog Rules

Common actions:

- Create, view, edit, duplicate, delete, archive, restore.
- Assign owner/member.
- Change status: enable/disable, publish/unpublish, approve/reject, mark paid, mark resolved.
- Import, export, download, print, send.
- Add attachment/comment/member/task.

Use inline actions for common row-level operations. Use overflow menus for less frequent actions. Use confirmation dialogs for destructive or irreversible actions. Use a form modal when the action has 1-5 fields and does not need a full page.

Dialog/drawer selection:

- Confirmation dialog: delete, archive, revoke, reset, void invoice, discard changes.
- Form modal: quick add/edit/assign/change status with a small field count.
- Drawer: create/update while keeping list context, especially modern admin templates. Forge exports controlled `Drawer` with `open`, `onOpenChange`, `title`, `children`, optional `footer` and `side`; verify installed-version props. A route-backed panel remains a separate navigation choice; do not infer a `Sheet` export.
- Full route: complex create/edit, deep validation, uploads, multi-step workflows.
- Alert/banner: non-blocking warnings such as sync delay, read-only mode, partial failure.

For high-risk deletion, require explicit confirmation text when appropriate, especially bulk delete or irreversible account/system operations.

Compatibility inline-mode skeleton (intentionally omits `open` inside one native dialog; new standalone confirmations should prefer controlled mode):

```tsx
"use client";

import { useRef } from "react";
import { ConfirmationDialog } from "@forge-ui-official/core";

export function DeleteOrderDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>
        Delete
      </button>
      <dialog ref={dialogRef} className="rounded-card bg-transparent p-0 backdrop:bg-fg-black/40">
        <ConfirmationDialog
          color="red"
          title="Delete order"
          description="This removes the order from active operations."
          confirmLabel="Delete"
          onCancel={() => dialogRef.current?.close()}
          onConfirm={() => {
            dialogRef.current?.close();
            // call the delete server action or submit a hidden form here
          }}
        />
      </dialog>
    </>
  );
}
```

Optimistic and async actions:

- Optimistic is suitable for low-risk toggles, archive, row reorder, or dismiss operations with clear rollback.
- Avoid optimistic UI for payments, permission changes, irreversible deletes, and multi-record mutations unless rollback is explicit.
- Long-running operations should become jobs: show progress, allow leaving the page, and surface completion/failure later.

## State Model

Every module should model object states, not just labels.

Examples:

- Product: Draft, Published, Out of Stock, Archived.
- Order: New, Processing, Shipped, Delivered, Cancelled, Refunded.
- Project: Draft, In Progress, Blocked, Completed, Archived.
- Task: Not Started, In Progress, Blocked, Finished.
- Invoice: Draft, Sent, Paid, Pending, Overdue, Void.
- File: Uploading, Uploaded, Failed, Archived.

States influence available actions. For example, paid invoices may allow download/print but not delete; active rules may require disable before delete; uploaded files may allow preview/download/delete while failed files need retry/remove.

State transition rules:

- Treat states as a small state machine, not independent badges.
- For each state, decide allowed actions, disabled actions, and the reason.
- Disabled actions should explain why when useful; hide only actions the current role should never see.
- Irreversible transitions should explain side effects, such as cancelling pending work or revoking access.

State/action matrix example:

| Object | State | Likely actions |
|---|---|---|
| Invoice | Draft | edit, send, delete |
| Invoice | Sent/Pending | mark paid, resend, download, void |
| Invoice | Paid | download, print, refund/adjust if supported |
| Task | Not Started | start, assign, edit, delete |
| Task | In Progress | complete, block, comment, add file |
| Rule | Active | disable, duplicate, view usage |
| Rule | Disabled | enable, edit, delete |

Typed row action map example:

```tsx
import type { KebabMenuItem } from "@forge-ui-official/core";
import { EyeLinear, PenLinear, TrashBinTrashLinear } from "@forge-ui-official/core/icons";

type InvoiceStatus = "draft" | "sent" | "paid" | "void";
type Invoice = { id: string; status: InvoiceStatus };
// Replace viewInvoice/editInvoice/markPaid/etc. with host app routes or mutations.

const INVOICE_ACTIONS: Record<InvoiceStatus, (invoice: Invoice) => KebabMenuItem[]> = {
  draft: (invoice) => [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => viewInvoice(invoice.id) },
    { label: "Edit", icon: <PenLinear size={16} color="#71717A" />, onSelect: () => editInvoice(invoice.id) },
    { label: "Delete", icon: <TrashBinTrashLinear size={16} color="var(--fg-red)" />, danger: true, onSelect: () => confirmDelete(invoice.id) },
  ],
  sent: (invoice) => [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => viewInvoice(invoice.id) },
    { label: "Mark paid", onSelect: () => markPaid(invoice.id) },
    { label: "Void", danger: true, onSelect: () => confirmVoid(invoice.id) },
  ],
  paid: (invoice) => [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => viewInvoice(invoice.id) },
    { label: "Download", onSelect: () => downloadInvoice(invoice.id) },
    { label: "Print", onSelect: () => printInvoice(invoice.id) },
  ],
  void: (invoice) => [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => viewInvoice(invoice.id) },
  ],
};

// In a table column:
// render: (row) => <KebabMenu items={INVOICE_ACTIONS[row.status](row)} />
```

## Permissions and Roles

Admin UI should reflect role and permission boundaries:

- Hide actions the role can never perform.
- Disable actions that are temporarily unavailable and explain why.
- Separate visibility permission from mutation permission.
- Include ownership/assignee fields when workflows depend on responsibility.
- Dangerous actions should remain discoverable to authorized users but visually separated.
- Permission states need useful next steps: request access, switch workspace, contact admin.

## Information Architecture

Navigation should follow user work, not database tables alone:

- Put high-frequency modules near the top of sidebar.
- Group by domain: Dashboard, Operations, Customers, Projects, Finance, Team, Settings.
- Use dashboard pages as entry points to work queues and resource lists.
- Use resource pages for daily operations.
- Use settings pages for low-frequency configuration.
- Use labels users recognize from the business, not implementation names.

System-level navigation pattern:

```text
Dashboard / Workbench
Operations
  Core object A
  Core object B
  Queue / approvals / tasks
Relationships
  Customers / clients / members
  Files / documents / messages
Finance / output
  Invoices / reports / exports
Governance
  Settings / roles / audit / integrations
```

The page title, sidebar, breadcrumbs, table row links, detail tabs, and action labels should all agree on this information architecture. If they feel unrelated, the UI will look like a component demo rather than a system.

## Next.js / Module Organization

When building in a Next.js-style project, organize a module so business logic and UI surfaces are discoverable:

```text
app/<module>/page.tsx
app/<module>/new/page.tsx
app/<module>/[id]/page.tsx
app/<module>/[id]/edit/page.tsx
app/<module>/_components/
app/<module>/_data.ts
app/<module>/_schema.ts
```

For small template/demo modules, modal/drawer state can live in the page. For real apps, prefer feature-local components:

```text
features/<module>/
  components/<module>-table.tsx
  components/<module>-columns.tsx
  components/<module>-dialogs.tsx
  components/<module>-form.tsx
  data/schema.ts
```

Modern admin templates often use:

- table columns in a separate file,
- provider/context for dialog state,
- URL-synced table state,
- shared confirm dialog,
- shared table toolbar/pagination/bulk actions,
- schema validation for mutation forms.

Next.js App Router conventions:

- Use `searchParams` as the source of truth for shareable list search/filter/sort/page state.
- In Next.js 16, `searchParams` in Server Components is async. Type it as a `Promise` and `await` it before reading filters.
- Use `loading.tsx` or Suspense boundaries to keep admin pages responsive.
- Mutations can use Server Actions or route handlers depending on the host app convention.
- Revalidate list/detail data after successful mutations.
- Admin lists and details are usually dynamic user/workspace data; avoid caching them as static marketing content.
- Keep client components focused on interactivity: tables, filters, forms, dialogs, drawers, optimistic state.

Minimal App Router skeleton:

```tsx
// app/orders/page.tsx
import { OrdersScreen } from "./_components/orders-screen";
import { listOrders } from "./_data";

type Search = {
  q?: string;
  status?: string;
  sort?: string;
  page?: string;
  pageSize?: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const data = await listOrders({
    q: params.q ?? "",
    status: params.status ?? "all",
    sort: params.sort ?? "updatedAt:desc",
    page: Number(params.page ?? 1),
    pageSize: Number(params.pageSize ?? 20),
  });

  return <OrdersScreen data={data} initialParams={params} />;
}
```

```tsx
// app/orders/_components/orders-screen.tsx
"use client";

import { AppLayout } from "@forge-ui-official/core";
import { useState } from "react";
import { OrdersTable } from "./orders-table";

type Search = { q?: string; status?: string; sort?: string; page?: string; pageSize?: string };
type OrdersResult = { rows: OrderRow[]; total: number };
// CreateOrderDialog is the host app's create form dialog. Keep AppLayout in this client component when it needs onClick actions.

export function OrdersScreen({
  data,
  initialParams,
}: {
  data: OrdersResult;
  initialParams: Search;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <AppLayout
        pageTitle="Orders"
        primaryAction={{ label: "New order", onClick: () => setCreateOpen(true) }}
      >
        <OrdersTable data={data} initialParams={initialParams} />
      </AppLayout>
      {createOpen && <CreateOrderDialog onClose={() => setCreateOpen(false)} />}
    </>
  );
}
```

`AppLayout` is a client component. Server pages should pass serializable data into a client screen when header actions need `onClick`; do not pass functions from a Server Component into `primaryAction`.

教学片段：下列 _data 层必须在实际写入之前执行会话、租户、对象权限与状态迁移校验；未接入时不得用于真实数据。

```tsx
// app/orders/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { archiveOrderById } from "./_data";

export type ArchiveState = {
  ok?: boolean;
  fieldErrors?: Record<string, string>;
  message?: string;
};

export async function archiveOrder(
  _previous: ArchiveState,
  formData: FormData,
): Promise<ArchiveState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { fieldErrors: { id: "Order id is required" } };

  await archiveOrderById(id);
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  return { ok: true, message: "Order archived" };
}
```

```tsx
// app/orders/_components/archive-order-dialog.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@forge-ui-official/core";
import { archiveOrder, type ArchiveState } from "../actions";

export function ArchiveOrderDialog({ orderId }: { orderId: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ArchiveState, FormData>(
    archiveOrder,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      // Use the host toast system if it exists; otherwise close the dialog
      // and show inline success in the table/detail surface.
      dialogRef.current?.close();
      router.refresh();
    }
  }, [router, state.ok]);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>
        Archive
      </button>
      <form ref={formRef} action={action} className="sr-only">
        <input type="hidden" name="id" value={orderId} />
      </form>
      <dialog ref={dialogRef} className="rounded-card bg-transparent p-0 backdrop:bg-fg-black/40">
        <div className="flex flex-col gap-3">
          {state.message && <p className="text-sm text-fg-grey-700">{state.message}</p>}
          {state.fieldErrors?.id && <p className="text-sm text-fg-red">{state.fieldErrors.id}</p>}
          <ConfirmationDialog
            title="Archive order"
            description="Archived orders leave the active queue."
            color="red"
            confirmLabel={pending ? "Archiving..." : "Archive"}
            onCancel={() => dialogRef.current?.close()}
            onConfirm={() => formRef.current?.requestSubmit()}
          />
        </div>
      </dialog>
    </>
  );
}
```

Optimistic row action skeleton:

```tsx
"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "../actions";

type Order = { id: string; status: "active" | "paused" };

function StatusToggle({ row }: { row: Order }) {
  const router = useRouter();
  const [optimistic, setOptimistic] = useOptimistic(row.status);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const next = optimistic === "active" ? "paused" : "active";
        startTransition(async () => {
          setOptimistic(next);
          const result = await updateOrderStatus(row.id, next);
          if (!result.ok) {
            // Show inline/toast feedback using the host app system.
            setOptimistic(row.status);
            router.refresh();
          }
        });
      }}
    >
      {optimistic}
    </button>
  );
}
```

Route-backed modal/drawer sketch:

```text
app/orders/page.tsx
app/orders/[id]/page.tsx
app/orders/@modal/(.)[id]/page.tsx
app/orders/@modal/default.tsx
```

`@modal/default.tsx` should return `null`. Use route-backed modal/drawer only when the selected object needs share/back/refresh behavior. Quick transient dialogs can stay in local state.

## Content Density

Admin pages should feel operational, not like a written report.

- Replace long explanatory prose with labels, statuses, row metadata, helper text, and tooltips.
- Prefer short action labels: Create, Edit, Export, Assign, Archive.
- Use cards for repeated entities or summaries; use tables for comparison and operations.
- Use dashboard copy to clarify metrics, not to explain the whole feature.
- Every prominent block should answer: what is this, what changed, what can the user do next?

Make the content behave like a system:

- KPIs should link to the underlying filtered list or queue.
- Todo/exception cards should have owner, priority, due/SLA, and action.
- Detail surfaces should show related objects, not only fields.
- Settings should include real control groups such as integrations, roles, notifications, API keys, webhooks, or billing.
- Activity/audit should show actor, action, object, time, and result.
- Empty states should offer create/import/connect/sample data, depending on the module.

Translate prose into operational UI:

- "Users can manage templates" -> template list, create action, status, last updated, row actions.
- "Admins review anomalies" -> queue with severity/status/owner, detail panel, resolve/assign actions.
- "Configure rules" -> settings groups, rule table, enable/disable, test, duplicate, delete.
- "Generate reports" -> form/stepper, output table, download/export, history.

## Admin Anti-Patterns

Watch for these failure modes:

- Turning a management module into a report page with many descriptive cards and no object actions.
- Hiding search/filter/sort/pagination in custom UI instead of using a recognizable toolbar/table pattern.
- Putting a naked delete button in a row without a menu or confirmation path.
- Showing the same actions for every row regardless of object state.
- Keeping filter/page state only in local React state when the view should be shareable.
- Using toast-only validation instead of field-level feedback.
- Making a detail page with only fields and no related records, history, or next action.
- Using color alone for status; pair color with text and, when useful, icon/shape.
- Creating long explanatory copy where labels, statuses, row metadata, helper text, or tooltips would work better.
- Building only one CRUD table when the user asked for a system.
- Using sidebar items that do not correspond to visible modules or routes.
- Showing KPIs that do not link to any list, queue, or detail page.
- Omitting settings, permissions, audit, imports/exports, or job/notification feedback from a business system.

## Generation Checklist

Before coding, decide:

- Is the user asking for a page, a module, or a system?
- If system: what is the navigation/module map?
- What is the workbench/dashboard entry into daily operations?
- What supporting surfaces make it feel complete: settings, permissions, files, billing, messages, audit, jobs?
- What is the primary object?
- Does it have lifecycle states?
- Is this page mainly for insight, management, workflow, collaboration, or configuration?
- What are the top 3 user actions?
- Which actions are row-level, page-level, bulk, or dangerous?
- Does the module need list/detail/create/edit screens or a smaller modal flow?
- What filters and sorts help users find work?
- What detail tabs reveal related data?
- What empty/error/permission states are needed?
- Which Forge template is closest: ecommerce products/orders/customers/categories/sellers, project projects/members/clients/files/invoices/tasks, dashboard analytics/crm/finance/project?
- What resource contract will be implemented: list/create/show/edit/delete, or a deliberate subset?
- Which table state should live in URL?
- Which mutations need modal, drawer, full page, or inline edit?
- Which actions are hidden/disabled by role or object state?
- What does success do: stay, close modal, refresh table, navigate detail, or return to list?

Then write the UI.

## 中文实施补充

先定义对象画布：对象标识、负责人、生命周期、权限、输入输出、证据和下一步动作，再选择页面地图。导入导出等异步任务要提供进度、失败原因、重试和结果下载。配置模块需给出测试结果、影响范围、回滚和审计；仅设计任务不接接口或扩展为完整系统。

## 服务端示例安全前提

以上 Server Action 是教学片段，不是可直接部署的安全实现。archiveOrderById 必须在实际持久化之前验证当前会话、租户归属、对象级权限和允许状态迁移；只检查 id 或隐藏按钮不构成授权。未接入这些能力不得接真实数据或报告上线就绪。

---

Source: skills/forge-skill/references/ask-ai-host-contract.md

# Ask AI 宿主接入契约

适用当前 core 的 AskAi；API 以[生成参考](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/components/ask-ai.md)为准。以下是源码静态核对，不代替浏览器、辅助技术或业务后端验收。历史来源：[全屏布局记录](https://github.com/forge-ui/forge/blob/main/docs/archive/ask-ai-fullscreen-layout.md)、[面板变更记录](https://github.com/forge-ui/forge/blob/main/docs/archive/changes/2026-10-16-ask-ai-panel.md)。

## 布局与滚动

- 全屏消息区由 core 的 data-ask-ai-fs-scroll 管理纵向滚动。消息 slot 按自然高度展开，不加第二层 overflow 滚动；宿主不要另开跟随循环。会话列表可独立滚动，不与消息区争夺所有权。
- CSS 以主内容容器而非整个 viewport 分档：默认最大40rem，主区至少54rem时最大48rem。来源：core/src/styles/tokens.css 的 forge-ask-ai-fs-content 容器规则；不是全站最小宽度保证。
- core 根据 composer 实际高度预留底部空间；自定义 composer 应遵守同一所有权，不额外叠加固定页脚、重复 padding 或另一套 sticky 层。长内容、缩放、安全区、中文输入仍须实测。
- 当前 core 内置输入区最高192px；消息接近底部48px内跟随，否则暂停并提供“回到最新”。来源：core/src/internal/ask-ai-fullscreen.tsx。会话切换与 ResizeObserver 跟随是 core 职责；不据此宣称所有异步内容已验收。

## 面板与宿主

- panelMode 的非模态侧栏在至少1440px时启用，较窄环境回退模态抽屉；仅在 onDockedChange 为 true 时由宿主预留460px，关闭、全屏、窄屏或卸载后释放。来源：core/src/components/ui/ask-ai.tsx 的属性说明与媒体查询。
- 非模态布局不要锁住整个页面；模态焦点、关闭及 Escape 策略按[浮层规则](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/overlay-focus.md)验收，不用一次静态截图证明。保持稳定宿主实例，避免响应式切换丢失草稿与消息。
- 关闭面板不等于取消任务。取消、重试、流式请求、鉴权、持久化和真实录音均由宿主接入；未提供回调时不伪造相应能力。
- 异步结果绑定发起时的会话与请求身份，不能使用回调执行时恰好选中的会话。状态展示完成不等于真实任务完成。此为宿主约束，不是本轮实现后端或修复竞态的声明。

## 验收边界

分别记录宽窄屏、长消息、输入法、键盘、焦点恢复、会话切换与任务取消的实际证据。数据库、录音、模型服务和浏览器未连接时写“未核实”，不把模板演示当生产完成。

---

Source: skills/forge-skill/references/audit-checklist.md

# Forge 统一审计清单

## Screen 元素保真

- SF1：记录主对照 Screen 的源码版本、1440/375 截图与业务替换字段。逐项核对主题主卡、迷你图、图标/首字母头像、地图/旗帜、周期切换、指标行、tooltip、页头操作插槽，不得无理由省略。
- SF2：每项写通过/违规/不适用/未验证与证据。使用 plain 或自定义 children/items 必须逐项说明省略原因，例如没有历史序列、没有导出权限、地区不对应国家。不得为了截图伪造趋势、国家或可点击但无作用的操作。
- SF3：机械门禁运行 `pnpm blocks:check` 与 `pnpm test:interactions`：registry 与源码一致、默认迷你图/主题/图标/地图/图例、周期切换真实数据、受控选择、tooltip、插槽兼容。结构检查不替代主 Screen 并排截图和真实 hover/click。
- SF4：修改共享 Block 后按基线全量重放模板截图并像素比对；画廊允许变化，模板不允许。表格另核 `flex` 预算、minWidth、valueKind 与表头同向，见 [DataTable 选型](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/component-selection/data-table.md)。

编号底本：forge-starter/docs/audit-checklist.md；归属按 D.md 逐编号 G / G+S / S 审核。本清单只收通用规则及混合规则的通用部分，保留原编号，不重排。宿主路由、权限、存储、toast、数据库工程约定仍由宿主文档管理。

每条结果：通过 / 违规 / 不适用（原因） / 未验证（缺少的环境或证据）。记录文件行号、版本、页面 URL、截图和动作；静态检查不能证明浏览器、业务或安全全面通过。

纯 starter 项不迁入，编号保留：M3 菜单三处/存储、M6 尾斜杠、R5 redirect-only、D4 数据库表、E1 行数/目录、E2 session/json/zod、Q1 starter 专用检查命令。

## 六维度

| 维度 | 主要编号 | 验证方式 |
|---|---|---|
| 配色 | V1–V4、V6–V7 | 语义与计算样式 |
| 圆角外形 | L8、T3 | 同模板轮廓对照 |
| 字体字号 | V5、H3 | 字体/字重/行高实测 |
| 布局密度 | L2、L5–L7、L9 | 净宽/间距/响应式 |
| 整体风格 | R1、L4、T1–T4 | 同角色 Screen 对照 |
| 交互反馈 | C3–C6、F、D、Q | 实际点击/焦点/状态闭环 |

## M

- **M1**（通用部分；starter 适配留宿主）：导航只放真实模块入口；新增/编辑/详情不充当占位模块，逐一验证可达。
- **M2**（通用）：图标从 @forge-ui-official/core/icons 导入，核对真实导出，沿用模板变体与尺寸，不凭名称猜合法性。
- **M4**（通用）：禁止 href="#"、不存在路由和空处理器；真实点击需要解决对应任务。
- **M5**（通用）：分组、命名和顺序符合业务动线；个人资料/安全设置按宿主信息架构归位。

## R

- **R1**（通用）：先定 dashboard / collection / detail / detail-modal / form-modal / form-page / settings 角色，再选骨架。
- **R2**（通用部分；starter 适配留宿主）：详情形态由任务复杂度、上下文与分享需求决定，不按字段个数机械判断；不无理由维护重复两套。
- **R3**（通用部分；starter 适配留宿主）：表单选弹窗、分组全页或分步形态均须符合任务；starter 默认弹窗不是所有项目铁律。
- **R4**（通用部分；starter 适配留宿主）：需要分享、刷新或重开的业务状态具有真实 URL/深链；具体 query 与回退由宿主约定；mock 必须声明，不虚构 API。

## H

- **H1**（通用部分；starter 适配留宿主）：同页唯一业务标题：可选紧凑标题+面包屑、PageTitleToolbar 或合法壳页头；不得两套叠加，历史紧凑标题不一概判错。
- **H2**（通用部分；starter 适配留宿主）：祖先面包屑指向真实父级，当前项不放 href；PageTitleToolbar 的面包屑放其内部槽。
- **H3**（通用）：实体标题可读且能识别对象，不用裸 ID 代替名称。
- **H4**（通用部分；starter 适配留宿主）：父级/返回路径真实存在，不能统一硬写 dashboard。
- **H5**（通用部分；starter 适配留宿主）：返回入口按实际可见 chrome 判定；隐藏壳不等于已提供返回；检查来源上下文。
- **H6**（通用部分；starter 适配留宿主）：PageHeader 通常属于壳层，不当正文卡片；合法独立沉浸式布局可例外，但不得重复壳标题。
- **H7**（通用）：状态有明确对象或栏目语境，不能孤立放无主体徽章。

## L

- **L1**（通用部分；starter 适配留宿主）：宿主已有 AppLayout/AppShell 时不再嵌套第二套壳。
- **L2**（通用部分；starter 适配留宿主）：壳层 padding 只算一次，section/Grid/卡内间距按模板各自归属，不强制一律24px。
- **L3**（通用）：搜索、过滤、批量操作组织为一条功能工具带；必要换行可保留，不机械禁止多行。
- **L4**（通用部分；starter 适配留宿主）：详情以身份、内容、操作分层，选同角色真实对照，而非空卡堆字段。
- **L5**（通用）：看板从 Screen 起步，记录轨道、列宽、gap、页面组件高与密度；同视口/侧栏并排截图，不仅核对排列。
- **L6**（通用）：密度符合业务与模板；只用真实存在的 density/size API，不虚构 prop。
- **L7**（通用）：列宽按内容预算，身份可辨、数字对齐、尾操作 HUG，明确剩宽归属；宽表局部横滚，不强塞最后一列掩盖空白。
- **L8**（通用）：按角色/模板判定卡壳；ecommerce-2 的 DataTable 在卡内是有效例子，不执行“表绝不能套卡”；公共标题 Panel 未提供时用 FORGE-GAP。
- **L9**（通用）：比例列用 Grid/GridItem；固定280/336px业务侧栏允许静态 CSS Grid/Flex，不强改8:4。
- **L10**（通用部分；starter 适配留宿主）：页脚、固定工具与滚动区域不覆盖内容；具体 gutter/scroll 实现由宿主负责。

## C

- **C1**（通用）：先查 Kit 和已批准适配，再考虑缺口；不要虚构原语或导出。
- **C2**（通用）：普通数据列表优先 DataTable/FullWidthTable；邮件、语义/可访问性等有依据的原生 table 例外保留。
- **C3**（通用）：sortable 对应真实排序，不能只显示可点击表头。
- **C4**（通用）：ConfirmationDialog 采用真实受控 open；单宿主确认或内联确认二选其一，不叠双确认。
- **C5**（通用）：语义状态与分类/角色分开，分类默认文字；状态见 V6。
- **C6**（通用）：每个动作有实际结果、反馈或有理由禁用；禁止空 handler/伪成功。
- **C7**（通用）：组件与 Props 必须由当前安装版本导出，不把文档示意当 API。
- **C8**（通用）：Drawer、Modal、ToastProvider/useToast 按真实导出采用，不假设有 Sheet。
- **C9**（通用）：身份链接进入真实对应详情，保留返回上下文。
- **C10**（通用）：指标提供统计口径，不重复字段做虚假 KPI，不伪造进度。

## V

- **V1**（通用）：使用语义 fg-* Token；图表可使用对应 CSS变量，不硬编码随意配色。
- **V2**（通用）：默认 accent/focus blue；purple/black 为明确选择的主题，不默认紫色。
- **V3**（通用）：图标用 core/icons；currentColor 允许 className 继承色，显式 color 覆盖需说明，不错误禁止 className。
- **V4**（通用）：图表系列颜色/图例/文字语义一致，不能只靠颜色辨识。
- **V5**（通用）：字体、字号、字重、行高以模板和实际计算样式验证，静态声明不等于实测。
- **V6**（通用）：状态默认 soft StatusBadge，不用 solid/彩虹/自制 pill；分类角色普通文字，通常最多一个状态胶囊列。
- **V7**（通用）：主、次、muted、disabled 有区分；弱化信息不等于禁用。

## F

- **F1**（通用）：异步动作有 loading/saving、必要禁用与去重；同步演示按适用性记录，不造网络过程。
- **F2**（通用）：破坏性动作确认真实后果，受控打开/关闭，必要权限服务端执行。
- **F3**（通用）：字段错误关联字段，不能只有 toast。
- **F4**（通用部分；starter 适配留宿主）：全局反馈在正确 Provider/宿主内，路径由项目约定，不强制 starter 的 toast 路径；不以假成功横条替代。
- **F5**（通用）：保存后续导航/详情/状态一致，mock 与持久化明确区分。
- **F6**（通用）：按任务选 Drawer/Modal/全页，使用支持的 API，不猜 Sheet 导出。

## D

- **D1**（通用）：区分加载、可重试失败、无数据、无筛选结果；同步 mock 的加载/失败可不适用，只读空态不硬造创建动作。
- **D2**（通用）：加载与真实不存在分开，提供合理回退。
- **D3**（通用部分；starter 适配留宿主）：实际持久化或明确 mock；不把 starter 服务/store/DB路径迁为通用要求。
- **D5**（通用）：应分享/刷新保留的状态进入 URL；临时输入和选中态按宿主约定。
- **D6**（通用）：敏感数据脱敏，示例不包含真实密钥或个人秘密。

## E

- **E3**（通用）：重复业务抽象有实际需要；不阻止已计划的共享 Blocks/Core 抽取，也不无授权扩大重构。
- **E4**（通用部分；starter 适配留宿主）：仅需要客户端运行时才设客户端边界；纯服务端内容不机械加 use client。

## Q

- **Q2**（通用部分；starter 适配留宿主）：实施 UI 必须真实操作主流程并留截图；规范/文档任务只能标记未验证，不把脚本通过当浏览器验收。
- **Q3**（通用）：同视口同侧栏与主 Screen 比结构、密度、表格和实测，说明业务偏差及未核实项。
- **Q4**（通用）：不新增 console 错误或 overlay；既有警告单独记录，不扩范围修无关问题。
- **Q5**（通用）：验证 reduced-motion、重复触发及稳定壳不重挂；不把宿主220ms写成所有项目规则。

## T — 模板一致性

- **T1**：声明主 Screen、源码版本与任务适配理由，Screen→Blocks→Components 分层；Blocks 从 blocks/ 复制，不作为 core 导出；registry 依赖版本与发布状态分别核实。
- **T2**：1440 与 375 两档逐个 Screen 保存重构前后截图及像素 diff；同视口、相同侧栏、相同字体、固定时间和样例数据条件比较；依据页面规范分别核对 shell/section/Grid/卡内间距、轨道公式、图域与整卡高度。
- **T3**：模板圆角24px与 Token20px现状并存，不未经授权改全局 Token；有意偏差单独列出。
- **T4**：内容组件核到子层，例如表格单元格、详情阅读组件、弹层关闭/焦点；仅 import 相同不算一致。
- **T6**：Panel 变体与密度须由公开 API 设置，不恢复私有 density 覆盖；registry 每项可独立复制，blocks:check 通过；缺少截图必须标未验收。
- **T5**：未核实的尺寸、触摸/读屏/软键盘、缺少后台的动作明确列未验证；公共缺口用 FORGE-GAP，等待用户决定。

尺寸来源见 [页面规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md)，专项见 [内容](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/component-content-contracts.md)、[焦点](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/overlay-focus.md)、[动效](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/motion.md)。

---

Source: skills/forge-skill/references/blocks.md

# 页面组件（Blocks，复制到项目）

## 默认即 Screen 效果

以 ecommerce-2 为主对照时，KpiMetrics 数据入口默认首张 purple 主卡、其余白卡，并交替迷你折线/柱图；`visualization` 与 `data` 可逐指标替换，`variant="plain"` 才使用无图 StatCard。未提供 data 时迷你图仅是 core 的装饰性示意，不代表真实历史；生产数据须映射真实序列，不能从单个总数伪造趋势。

TrendChart 默认保留周期控件、带图标的指标行及 tooltip。`periods: [{label, chart?, countChart?}]` 每期传自己的真实数据，柱图与折线二选一；切换更新图、总数与 tooltip，受控模式由 activePeriod/onPeriodChange 管理。只传一个 chart 时只显示「本期」，不能伪造日/周/月切换；指标 value 可传业务口径，否则按输入序列求和。plain 才省略这些装饰。

RankingList 用 `entries: [{id,title,subtitle,value,avatar?,icon?,accent?}]`，未传 icon/accent 默认 Solar 商品图标与交替主题色；avatar 传首字母。默认 w-full，plain 为显式文字列表。items/children 是已验收 Screen 的完整插槽，不是推荐业务数据映射入口；使用插槽必须自行保留视觉元素，不能用 span 替代整张列表。

RegionDistribution 始终保留世界地图；地区传 name/salesLabel/value，可传 flag 图片或 ISO 两位 countryCode 自动生成旗帜；未知国家用名称缩写，不猜旗帜。中国大区等不对应国家的业务区域不要伪造国家映射。highlights 明确传入；默认高亮仅为展示示意，不代表地区业务统计。

CompositionCard 默认紫色起始配色与图例，segments 含 label/value，可覆盖颜色；plain 省略图例。DashboardHeader 保留 action/dateSelection/primaryAction 插槽，onExport 自动使用带下载图标的真实回调按钮；无授权或未接入操作时不显示假按钮，需在审计中注明原因。示例操作仅为接入边界，不声明导出已经实现。

最小配方见各单项生成文档与 `/r/index.json` 的 meta.example；结构化入口优先，其他 Screen 已验收的 children/items 插槽保持原输出。[表格列宽与数字对齐](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/component-selection/data-table.md) 适用于 RecentRecords。

70 个页面组件分为 11 类，已实现为仓内源码与 registry-item；不是 core 包导出，也不意味着已发布或通过截图验收。画廊 `/blocks` 可按分类筛选；每个 `/blocks/<name>` 提供同源 iframe 预览、1280px 桌面 / 390px 移动视口切换、完整代码、安装、用法、Props 与相关模板。预览路由 `/blocks/<name>/preview` 使用站点内的 AppLayout 外壳，按 registry.json 的 shell.menu / shell.active / shell.title 选择业务菜单、高亮项与顶栏标题；shell 为 none 时不显示后台外壳（认证类页面）；shell 为 frame 时页面组件自带整页外壳（页面结构类布局），预览不再另套；shell.with 指定窄卡页面并排展示的相关页面组件，shell.below 指定在下方接着展示的相关页面组件。菜单定义集中在站点 _shell.tsx，不进入安装源码。预览路由禁止索引，不进入 sitemap 与站内搜索；缩略图进入视口附近后才挂载。

| 分类 | 页面组件 | 导出名 | 源码目录 | 适用场景 |
|---|---|---|---|---|
| 看板首屏 | 经营概览 | OverviewDashboard | blocks/overview-dashboard/ | 将关键指标、收支趋势与收入构成集中在一个完整的经营首屏。 |
| 看板首屏 | 项目概览 | ProjectOverview | blocks/project-overview/ | 汇总项目进度、团队成员、里程碑与近期活动，掌握交付全貌。 |
| 看板首屏 | 财务概览 | FinanceOverview | blocks/finance-overview/ | 结合账户余额、收支趋势和储蓄目标，构建完整的财务工作台。 |
| 看板首屏 | 资产概览 | WealthOverview | blocks/wealth-overview/ | 总资产、现金与待收款趋势卡，配合企业卡与资金目标完成度。 |
| AI 与智能体 | 智能体工作台 | AiWorkspaceOverview | blocks/ai-workspace-overview/ | 工作台首页：应用智能体、知识库、工具与模型的资源汇总，按时间范围与智能体筛选的监控统计、趋势图和 TOP5 排行榜。 |
| AI 与智能体 | 应用智能体目录 | AgentCatalog | blocks/agent-catalog/ | 左侧目录树，按发布状态与类型筛选、排序和搜索的应用智能体卡片，分页浏览，并可从模板库一键创建高级工作流智能体。 |
| AI 与智能体 | 任务会话 | AgentRun | blocks/agent-run/ | 短会话模式的自主智能体任务：左侧对话记录与带快捷操作的追问输入框，回复逐字生成可停止；右侧概要、知识库授权与结果产物。 |
| AI 与智能体 | 任务执行详情 | TaskRunDetail | blocks/task-run-detail/ | 自主智能体任务详情：状态与来源、概要和知识库授权、带时间的执行过程，以及按类型分组、可预览下载复制的结果产物。 |
| AI 与智能体 | 运行时管理 | RuntimeList | blocks/runtime-list/ | 自主智能体可用的执行引擎：类型、在线状态、版本与最后检测时间、连接地址，支持搜索、单个检查与探测本机运行时。 |
| AI 与智能体 | 消息渠道 | MessageChannels | blocks/message-channels/ | 把智能体接入微信、企业微信、飞书、钉钉和 QQ：渠道入口、智能体与渠道的连接卡片、连接状态，以及填写凭据和绑定智能体的连接弹窗。 |
| AI 与智能体 | 自主智能体 | AutonomousAgents | blocks/autonomous-agents/ | 系统预置与我的自主智能体卡片，标明运行时、确认策略与知识库要求；发起任务弹窗可选知识库、执行模式与人工确认，最近任务跟踪状态。 |
| AI 与智能体 | 智能体对话 | AiAssistantHome | blocks/ai-assistant-home/ | 按自主智能体与应用智能体分组的会话侧栏，可搜索、展开历史会话；选中智能体后展示介绍与开场建议，带快捷操作和访问权限的输入框，回复逐字生成。 |
| AI 与智能体 | 多智能体编排 | AgentOrchestration | blocks/agent-orchestration/ | 编排者拆分任务给多个子智能体：树状分工、调用时间线与选中智能体的调用明细，可回放。 |
| AI 与智能体 | 用量与成本 | AgentUsage | blocks/agent-usage/ | 本月花费对比预算、每日趋势，按项目或模型拆分成本，并列出值得关注的异常用量。 |
| AI 与智能体 | 提示词评测 | PromptEvals | blocks/prompt-evals/ | 按版本对比通过率、得分、延迟与成本，展示提示词改动和可筛选的测试用例结果。 |
| AI 与智能体 | 工作流编辑器 | WorkflowBuilder | blocks/workflow-builder/ | 高级工作流智能体的编排页：点阵画布上可拖动、展开收起、直接编辑表单的节点与分支连线，带撤销重做、添加组件、一键美化、问题检查、调试运行与发布。 |
| 数据列表 | 最近记录表卡 | RecentRecords | blocks/recent-records/ | 在一张卡片内查看最近订单、交易或业务记录。 |
| 数据列表 | 排行列表卡 | RankingList | blocks/ranking-list/ | 展示商品、渠道或客户的业绩排行，快速识别主要贡献来源。 |
| 数据列表 | 订单列表 | OrdersTableSection | blocks/orders-table-section/ | 包含搜索、状态筛选、导出与分页的订单列表，适用于交易管理页面。 |
| 数据列表 | 商品列表 | ProductsTable | blocks/products-table/ | 按状态筛选、搜索、批量勾选与分页的商品管理表，含编辑与删除确认。 |
| 数据列表 | 客户列表 | CustomersTable | blocks/customers-table/ | 带搜索、在线状态、联系方式与新增客户弹窗的客户管理表。 |
| 数据列表 | 商家列表 | SellersTable | blocks/sellers-table/ | 展示店铺评分、营收与待结算金额的入驻商家管理表。 |
| 数据列表 | 商品分类 | CategoriesTable | blocks/categories-table/ | 维护商品分类的名称、说明、销量与库存，支持新增、编辑与删除。 |
| 数据列表 | 销售线索 | LeadsTable | blocks/leads-table/ | 线索总数、成交与流失指标卡，配合状态筛选、搜索与线索表格。 |
| 数据列表 | 商机列表 | DealsTable | blocks/deals-table/ | 按回款状态汇总金额，列出商机、客户、付款方式与回款状态。 |
| 数据列表 | 发票列表 | InvoicesTable | blocks/invoices-table/ | 按付款状态筛选的发票表，显示付款方、金额、开票与到期日，并汇总待收金额。 |
| 数据列表 | 客户名录 | ClientDirectory | blocks/client-directory/ | 可在表格与卡片视图间切换的客户名录，显示公司、联系方式与合作项目数。 |
| 详情页 | 订单详情 | OrderDetail | blocks/order-detail/ | 订单状态、商品明细、费用汇总、客户与收货信息，以及物流进度弹窗。 |
| 详情页 | 发票单据 | InvoiceDocument | blocks/invoice-document/ | 可打印的发票版式，含开票方、收货方、商品明细、税费合计与发送下载操作。 |
| 详情页 | 客户详情 | CustomerProfile | blocks/customer-profile/ | 客户画像卡、消费指标、最近购买、消费走势、订单与评价分页签。 |
| 详情页 | 商品详情 | ProductDetail | blocks/product-detail/ | 商品图集、价格与规格选择、描述参数，以及订单和评价分页签。 |
| 详情页 | 线索详情 | LeadDetail | blocks/lead-detail/ | 线索名片与基础信息，按类型筛选的跟进动态，以及添加跟进记录弹窗。 |
| 详情页 | 任务详情 | TaskDetail | blocks/task-detail/ | 任务基本信息、成员与附件，配合进度、描述、可勾选的检查清单和最近动态。 |
| 详情页 | 成员详情 | MemberProfile | blocks/member-profile/ | 成员档案卡、任务统计，以及参与项目、手头任务与动态分页签。 |
| 表单 | 分组表单 | ProductForm | blocks/product-form/ | 字段较多的录入页：同一张卡片里按基本信息、价格库存、图片、物流上架分组，每行三列等宽、单位写在输入框尾部，底部固定操作栏带校验结果与保存状态。 |
| 表单 | 分步表单 | OrderForm | blocks/order-form/ | 流程较长的录入拆成选择商品、客户信息、配送支付、确认订单四步，每步只校验当前字段，可回到上一步修改，提交后展示结果页。 |
| 表单 | 单卡表单 | InvoiceForm | blocks/invoice-form/ | 一张卡片从上到下填完：客户与日期两列排开，收费明细在表格里直接编辑，合计紧跟在明细下方，付款说明和操作按钮收在卡片底部。 |
| 表单 | 服务配置表单 | ProviderSettingsForm | blocks/provider-settings-form/ | 设置类表单：顶部按登录、支付、邮件、存储分标签，每个服务一张卡片，开关启用后展开字段与回调地址，卡片底部单独测试连接与保存。 |
| 表单 | 弹窗表单 | DialogForm | blocks/dialog-form/ | 列表页里的新建与编辑：树形部门列表，点新增、修改或新增下级弹出两列表单，带必填校验，确定后回写列表。 |
| 协作与项目 | 项目看板 | KanbanBoard | blocks/kanban-board/ | 项目详情页：按状态分栏的任务看板，可拖拽、勾选完成、展开子任务和快速添加；右侧项目属性、描述与资源，点任务卡片打开带动态、评论和属性的任务详情。 |
| 协作与项目 | 月历日程 | CalendarMonth | blocks/calendar-month/ | 月视图日历标注团队日程，侧栏列出近期安排，点击查看时间、地点与参会人。 |
| 协作与项目 | 文件管理 | FileManager | blocks/file-manager/ | 按类型筛选的文件夹与文件卡片墙，支持搜索、多选、上传与删除确认。 |
| 协作与项目 | 项目总览 | ProjectPortfolio | blocks/project-portfolio/ | 整体进度、项目进展与需要关注三张统计卡，项目按状态筛选、搜索与归档切换，并可在可操作的卡片和表格之间切换。 |
| 财务 | 目标进度列表 | GoalProgressList / WalletProgressPanel | blocks/goal-progress-list/ | 跟踪储蓄与预算目标，查看已积累金额和完成进度。 |
| 财务 | 卡片轮播 | CardCarousel | blocks/card-carousel/ | 以可切换的卡片展示多个账户，适用于钱包和财务首页。 |
| 财务 | 财务工作区 | FinanceSurface / FieldLine / VisualCard / FinanceMetricCard / WalletProgressLine / FinanceGoalCell / FinanceTransactionCell / FinanceExpenseGauge / FinanceBudgetPanel | blocks/finance-workspace/ | 整合账户余额、预算与费用明细，集中查看财务状况。 |
| 财务 | 交易流水 | TransactionsTable | blocks/transactions-table/ | 支出构成圆环、月度预算进度，配合按收支方向筛选与搜索的交易明细表。 |
| 财务 | 企业卡管理 | CardsManagement | blocks/cards-management/ | 企业卡列表与选中卡的额度、使用进度、临时冻结和最近消费。 |
| 财务 | 储蓄目标表 | SavingsGoalsTable | blocks/savings-goals-table/ | 资金目标的目标金额、存入进度与截止日期，支持多选和新建目标。 |
| 财务 | 目标进度列表 | GoalProgressList | blocks/goal-progress-list/ | 跟踪储蓄与预算目标，查看已积累金额和完成进度。 |
| 财务 | 财务工作区 | FinanceSurface | blocks/finance-workspace/ | 整合账户余额、预算与费用明细，集中查看财务状况。 |
| 设置 | 个人资料设置 | SettingsProfile | blocks/settings-profile/ | 头像上传、基本信息与地区语言，带校验和底部常驻的保存与撤销条。 |
| 设置 | 成员与团队 | SettingsMembers | blocks/settings-members/ | 席位与管理员概况、按角色筛选的成员表、行内改角色、批量移除与邀请成员。 |
| 设置 | 角色与权限 | SettingsRoles | blocks/settings-roles/ | 左侧角色列表，右侧按模块分组的菜单权限勾选树，支持整组勾选与撤销保存。 |
| 设置 | 通知设置 | SettingsNotifications | blocks/settings-notifications/ | 按事件和渠道（站内、邮件、飞书）开关通知，配置邮件摘要与夜间免打扰。 |
| 设置 | 安全设置 | SettingsSecurity | blocks/settings-security/ | 密码与强度提示、两步验证、单点登录、登录设备管理与 API 密钥。 |
| 设置 | 账单与套餐 | SettingsBilling | blocks/settings-billing/ | 本期用量、付款方式、按月或按年对比的套餐卡片与历史账单下载。 |
| 设置 | 集成目录 | IntegrationsDirectory | blocks/integrations-directory/ | 按分类浏览可连接的应用，支持搜索、连接中状态与断开连接。 |
| 图表与指标 | KPI 指标行 | KpiMetrics / FinanceMetricCard | blocks/kpi-metrics/ | 集中展示收入、订单与客户等关键指标，适用于经营看板首屏。 |
| 图表与指标 | 趋势图表卡 | TrendChart | blocks/trend-chart/ | 对比不同周期的业务走势，适用于收入、订单和流量分析。 |
| 图表与指标 | 构成占比卡 | CompositionCard | blocks/composition-card/ | 用圆环图展示收入、渠道或费用的构成与占比。 |
| 图表与指标 | 地区分布卡 | RegionDistribution | blocks/region-distribution/ | 结合地图与地区明细，查看客户或收入的地域分布。 |
| 图表与指标 | 客户经营摘要 | CrmSurface / CrmStat / DetailLine / CrmMetricCard | blocks/crm-summary/ | 概览客户规模与增长情况，为销售团队提供经营摘要。 |
| 图表与指标 | KPI 指标行 | KpiMetrics | blocks/kpi-metrics/ | 集中展示收入、订单与客户等关键指标，适用于经营看板首屏。 |
| 图表与指标 | 客户经营摘要 | CrmMetricCard | blocks/crm-summary/ | 概览客户规模与增长情况，为销售团队提供经营摘要。 |
| 认证 | 注册 | RegisterForm | blocks/register-form/ | 左图右表单的注册页，含第三方注册、邮箱与密码校验、协议勾选和成功反馈。 |
| 认证 | 找回密码 | PasswordRecovery | blocks/password-recovery/ | 邮箱验证、验证码与新密码三步找回流程，带进度提示与校验。 |
| 认证 | 引导流程 | OnboardingFlow | blocks/onboarding-flow/ | 首次使用的四步引导：创建工作区、连接工具、邀请成员、从模板创建第一个智能体。 |
| 认证 | 登录 | LoginForm | blocks/login-form/ | 邮箱密码与手机验证码两种登录方式，带记住登录、错误提示与企业单点登录入口。 |
| 页面结构 | 顶栏头像布局 | LayoutTopbarProfile | blocks/layout-topbar-profile/ | 侧栏展开并按业务分组，搜索在顶栏左侧，头像、通知与消息集中在顶栏右侧，页头带标题、面包屑和主操作。 |
| 页面结构 | 侧栏头像布局 | LayoutSidebarProfile | blocks/layout-sidebar-profile/ | 头像、通知与语言收进侧栏底部，菜单按工作区、智能体、平台分组；顶部只保留页头的标题、面包屑与操作。 |
| 页面结构 | 图标栏布局 | LayoutIconRail | blocks/layout-icon-rail/ | 侧栏默认收起为图标条，把宽度留给表格与筛选；顶栏左侧用汉堡按钮展开菜单，头像在右侧。 |
| 页面结构 | 设置页布局 | LayoutSettings | blocks/layout-settings/ | 设置类页面：左侧二级导航切换分类，右侧按主题分卡，说明在上、字段居中、每张卡底部单独保存。 |
| 页面结构 | 沉浸式布局 | LayoutImmersive | blocks/layout-immersive/ | 去掉页头，侧栏收成图标条，内容区整块留给对话、画布或编辑器这类需要满屏的工作区。 |

## 使用边界

每个 registry item 的 `meta.category` 为分类，`meta.screens` 为主对照或使用该页面组件的相关模板，`meta.example` 是完整最小示例，`meta.props` 是从当前 TypeScript 导出生成的 Props 表（含所有导出及继承属性），`meta.core` 列出实际依赖组件和版本；示例与复制源码一起编译校验。对应可读文档位于本目录的 `blocks/<name>.md`，由 `blocks:generate` 同步，不手工维护第二份 API。`CellText` 使用 children：`<CellText>订单 1</CellText>`，没有 text prop。

4 个组合页面组件均只依赖 React 与 core，不依赖其他 Block，提供可替换的默认业务数据。订单列表搜索、筛选和分页在本地运行，导出当前筛选结果；`onViewOrder` / `onExport` 可接入宿主流程。图表、金额与状态的口径仍由业务端负责，默认数据不代表生产业务。

## 看板配方

| Screen | 推荐组合（按阅读顺序） | KPI 选型 |
|---|---|---|
| ecommerce-3 | DashboardHeader → KpiMetrics → TrendChart + CompositionCard → RankingList + RegionDistribution → RecentRecords | 默认 chart，主题色 BarChartStatCard |
| analytics | DashboardHeader → KpiMetrics → TrendChart → RankingList + GoalProgressList | children 传 ProgressStatCard，保持原模板 |
| ecommerce-1 / ecommerce-2 | DashboardHeader → KpiMetrics → TrendChart → CompositionCard + RecentRecords → RegionDistribution + RankingList | ecommerce-2 默认紫色主卡、红色迷你折线、紫色迷你柱图；精确复用既有 Screen 时保留 children |
| finance-1 / finance-2 / finance-3 | DashboardHeader → FinanceSurface + KpiMetrics → CardCarousel → TrendChart + GoalProgressList → RecentRecords | FinanceMetricCard / 模板插槽 |
| project-1 / project-2 | DashboardHeader → KpiMetrics → TrendChart → MemberList + ScheduleCard + ActivityFeed | 按项目 Screen 传 children |
| crm | DashboardHeader → KpiMetrics → TrendChart → RankingList + RecentRecords | CrmMetricCard |

`KpiMetrics variant="plain"` 还原纯指标卡；默认 `chart` 首卡为紫色主题，其余为白底，交替使用迷你折线与柱图。逐项使用 `data` 提供真实序列，`visualization` 指定图型，`theme` 覆盖主题；`bars` 可统一提供柱图序列。未传序列的迷你图仅为模板演示，不是业务统计。已有 children 优先，默认装饰不包裹插槽内容。

### 周期切换

`TrendChart periods={[{ label: "日", chart: daily }, { label: "周", chart: weekly }, { label: "月", chart: monthly }]}` 提供非受控切换；每项也可使用 `countChart` 提供折线序列。`activePeriod/onPeriodChange` 提供受控方式，每项传对应聚合数据，不只换标签。Block 默认含周期控件、指标图标和 tooltip；没有多周期数据时仅显示「本期」，不伪造其他周期。显式 `variant="plain"` 移除这些装饰。底层 `ChartHeader` 本身默认无 tabs，与 Block 默认策略不同。

### 长周期计数：30 天与上一周期

用 `TrendChart countChart` 接受 SmoothLineChart 配置：series 两条分别为本期/上期订单笔数，各 30 个非负数；xAxisLabels 只标起止日期，showYAxis=true，yDomain 从 0 到两期最大值，yAxisLabels 用整数，不用货币。按序号对齐两个连续的 30 天窗口，说明时区、是否含退款、缺日补零。上期合计为零时不展示增长百分比。

```tsx
<TrendChart title="近 30 天订单趋势" subtitle="与上一周期逐日对齐 · 单位：笔" countChart={{
  series: [{ label: "本期", data: currentCounts }, { label: "上期", data: previousCounts }],
  showYAxis: true, yDomain: [0, maximum], yAxisLabels: [String(maximum), "0"],
  xAxisLabels: [startDate, endDate], interpolation: "linear",
}} />
```

宿主提供 currentCounts/previousCounts（各 30 项）、maximum（至少 1）及起止日期。dateSelection 可放真实 Datepicker，primaryAction 放导出等主操作；不要用 disabled 假按钮代替可用操作。

- 画廊：`/blocks`（74 项共用完整预览数据）；详情：`/blocks/<name>`；公共 API 对照：`/cases/dashboard-kit`。来源为[完整 Screens](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/screens.md)。
- 源码只依赖 React、`@forge-ui-official/core` 及其公开 icons 子路径；配色只使用 fg-* Token（白色/透明基础色除外），不依赖站点私有组件。
- 生成：`corepack pnpm blocks:generate`；校验：`corepack pnpm blocks:check`。`public/r/index.json` 为目录，`public/r/<name>.json` 内嵌完整源码，安装目标为 `@components/blocks/<name>.tsx`（遵循用户 components.json 别名）。
- 依赖 core `^0.6.0`。本次只修改版本，不发布 npm 或网站；公网安装须等待发布授权。可先在本仓使用 workspace core、本地访问 registry。
- 本地示例：`npx shadcn@latest add http://localhost:3000/r/kpi-metrics.json`。宿主须已有 React 19、Tailwind 4、core 样式及 Token，复制后的文件由用户维护。沿用[安装说明](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/SKILL.md)配置，不附带后台、数据请求、鉴权或持久化。
- API 以各目录 TSX 类型为准。插槽不会额外套内容容器；接入时保留 Screen 的轨道、className、图域高与 compact 密度。图片、文案、业务回调由宿主提供，未绑定回调不代表业务已实现。

## 公共组件决策

新增 `Panel`，不改变 `SurfaceCard`；dashboard 变体为圆角 24px/边框/padding16，template 变体兼容旧共享 Panel 的圆角 Token/outline/padding24。
`ChartHeader`、`ChartMetricRow`、`GroupedBarChart`、`DivergingBarChart` 归 charts；`WalletGoalCard` 归 core。
原 DashboardShell 只有 AppLayout 默认值，无独立抽象价值，Screens 直接用 AppLayout；财务轮播和特定储蓄面板归 Blocks，不扩大业务化 core API。

业务模板迁移新增 `FileInput` / `InfoRow` 及类型导出；Button 的 `unstyled` 不增加默认类名、图标或文字包装，适用于已验收的模板按钮。Panel 的 `custom` 保留原始几何，`as` 保留 section/aside/article 语义；`asChild` 仅允许 custom、单一子元素且无标题/页脚插槽，用于保留 Next Link 根节点。新页面应优先选标准变体，不以 custom 自由设计另一套卡片。Modal 的 `template` 保留标题和分割线，用共享 dialog 处理焦点与 Escape；窄屏最大宽高受视口约束，需单独比对。

## 验收状态

源码、类型、单测、registry 与构建检查分开记录；1440/375 的前后截图与像素 diff 是独立门禁。本次环境 Chromium 启动被 macOS sandbox MachPort 拒绝，不能把静态迁移或构建通过当成视觉一致性通过。重放脚本、基线源码和实际结果记录在 `/tmp/forge-impl/G-shots/`。

其余模板的 T 轮提供 81 条可访问路径作为外部基线输入；本轮未自行完成浏览器截图与像素验收。G 轮浏览器失败是历史记录，不代表本轮进行过同一尝试。图表和品牌演示色仅可保留在 mock 数据中；project 的品牌色集中在 `_mock-palette.ts`，不据此声称已完成视觉验收。

---

Source: skills/forge-skill/references/blocks/agent-catalog.md

# 应用智能体目录

分类：AI 与智能体。左侧目录树，按发布状态与类型筛选、排序和搜索的应用智能体卡片，分页浏览，并可从模板库一键创建高级工作流智能体。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ButtonGroup、ConfirmationDialog、IconButton、Modal、PageTitleToolbar、PlusIcon、SelectOption、StatusBadge、TextField。

## 最小可用示例

```tsx
import { AgentCatalog } from "@/components/blocks/agent-catalog";

export default function Example() {
  return (<AgentCatalog folders={[{ id: "default", name: "根目录" }, { id: "service", name: "客服中心" }]} />);
}
```

## AgentCatalog Props

| Prop | 必填 | Type |
|---|---|---|
| agents | 否 | `AppAgent[] \| undefined` |
| folders | 否 | `AgentFolder[] \| undefined` |
| templates | 否 | `AgentTemplate[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/agent-orchestration.md

# 多智能体编排

分类：AI 与智能体。编排者拆分任务给多个子智能体：树状分工、调用时间线与选中智能体的调用明细，可回放。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Panel、StatusBadge、cn。

## 最小可用示例

```tsx
import { AgentOrchestration } from "@/components/blocks/agent-orchestration";

export default function Example() {
  return (<AgentOrchestration />);
}
```

## AgentOrchestration Props

| Prop | 必填 | Type |
|---|---|---|
| run | 否 | `AgentOrchestrationData \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/agent-run.md

# 任务会话

分类：AI 与智能体。短会话模式的自主智能体任务：左侧对话记录与带快捷操作的追问输入框，回复逐字生成可停止；右侧概要、知识库授权与结果产物。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ChatInputBar、Modal、PageTitleToolbar、StatusBadge。

## 最小可用示例

```tsx
import { AgentRun } from "@/components/blocks/agent-run";

export default function Example() {
  return (<AgentRun />);
}
```

## AgentRun Props

| Prop | 必填 | Type |
|---|---|---|
| session | 否 | `AgentRunSession \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/agent-usage.md

# 用量与成本

分类：AI 与智能体。本月花费对比预算、每日趋势，按项目或模型拆分成本，并列出值得关注的异常用量。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ButtonGroup、Panel、ProgressBar、SmoothLineChart、StatCard、StatusBadge、cn。

## 最小可用示例

```tsx
import { AgentUsage } from "@/components/blocks/agent-usage";

export default function Example() {
  return (<AgentUsage />);
}
```

## AgentUsage Props

| Prop | 必填 | Type |
|---|---|---|
| usage | 否 | `AgentUsageData \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/ai-assistant-home.md

# 智能体对话

分类：AI 与智能体。按自主智能体与应用智能体分组的会话侧栏，可搜索、展开历史会话；选中智能体后展示介绍与开场建议，带快捷操作和访问权限的输入框，回复逐字生成。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ChatBubble、ChatInputBar、IconButton、StreamingAnswer。

## 最小可用示例

```tsx
import { AiAssistantHome } from "@/components/blocks/ai-assistant-home";

export default function Example() {
  return (<AiAssistantHome />);
}
```

## AiAssistantHome Props

| Prop | 必填 | Type |
|---|---|---|
| peers | 否 | `ChatPeer[] \| undefined` |
| threads | 否 | `ChatThread[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/ai-workspace-overview.md

# 智能体工作台

分类：AI 与智能体。工作台首页：应用智能体、知识库、工具与模型的资源汇总，按时间范围与智能体筛选的监控统计、趋势图和 TOP5 排行榜。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ButtonGroup、KebabMenu、LineChartStatCard、ListGroup、PageTitleToolbar、PlusIcon、ProgressStatCard、SelectOption、SmoothLineChart。

## 最小可用示例

```tsx
import { AiWorkspaceOverview } from "@/components/blocks/ai-workspace-overview";

export default function Example() {
  return (<AiWorkspaceOverview />);
}
```

## AiWorkspaceOverview Props

| Prop | 必填 | Type |
|---|---|---|
| aggregation | 否 | `WorkspaceAggregation \| undefined` |
| agents | 否 | `WorkspaceAgentOption[] \| undefined` |
| tokenRank | 否 | `RankItem[] \| undefined` |
| chatRank | 否 | `RankItem[] \| undefined` |
| userRank | 否 | `RankItem[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/autonomous-agents.md

# 自主智能体

分类：AI 与智能体。系统预置与我的自主智能体卡片，标明运行时、确认策略与知识库要求；发起任务弹窗可选知识库、执行模式与人工确认，最近任务跟踪状态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、Checkbox、ConfirmationDialog、Grid、Modal、PageTitleToolbar、PlusIcon、RadioWithLabel、SelectOption、StatusBadge、SurfaceCard、TextArea、TextField。

## 最小可用示例

```tsx
import { AutonomousAgents } from "@/components/blocks/autonomous-agents";

export default function Example() {
  return (<AutonomousAgents knowledge={[{ id: "kb-after-sales", name: "售后服务手册", documents: 48 }]} />);
}
```

## AutonomousAgents Props

| Prop | 必填 | Type |
|---|---|---|
| agents | 否 | `AutonomousAgent[] \| undefined` |
| tasks | 否 | `AutonomousTask[] \| undefined` |
| knowledge | 否 | `KnowledgeBase[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/calendar-month.md

# 月历日程

分类：协作与项目。月视图日历标注团队日程，侧栏列出近期安排，点击查看时间、地点与参会人。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Button、FullCalendar、Modal、SurfaceCard、cn。

## 最小可用示例

```tsx
import { CalendarMonth } from "@/components/blocks/calendar-month";

export default function Example() {
  return (<CalendarMonth onCreate={() => {}} />);
}
```

## CalendarMonth Props

| Prop | 必填 | Type |
|---|---|---|
| events | 否 | `ScheduleEvent[] \| undefined` |
| year | 否 | `number \| undefined` |
| month | 否 | `number \| undefined` |
| day | 否 | `number \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/card-carousel.md

# 卡片轮播

分类：财务。以可切换的卡片展示多个账户，适用于钱包和财务首页。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：CreditCard、PageDot。

## 最小可用示例

```tsx
import { CardCarousel } from "@/components/blocks/card-carousel";

export default function Example() {
  return (<CardCarousel cards={[{ id: "main", holderName: "运营账户", cardNumber: "9090" }]} showPagination />);
}
```

## CardCarousel Props

| Prop | 必填 | Type |
|---|---|---|
| cards | 是 | `({ locale?: "zh" \| "en"; cardNumberLabel?: string; holderNameLabel?: string; cardNumber?: string; holderName?: string; expiry?: string; theme?: import("@forge-ui-official/core").FinancialTheme; variant?: import("@forge-ui-official/core").FinancialVariant; width?: import("@forge-ui-official/core").CardWidth; className?: string; } & { id: string; })[]` |
| size | 否 | `"default" \| "compact" \| undefined` |
| index | 否 | `number \| undefined` |
| defaultIndex | 否 | `number \| undefined` |
| onIndexChange | 否 | `((index: number) => void) \| undefined` |
| showPagination | 否 | `boolean \| undefined` |

---

Source: skills/forge-skill/references/blocks/cards-management.md

# 企业卡管理

分类：财务。企业卡列表与选中卡的额度、使用进度、临时冻结和最近消费。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CreditCard、Panel、PlusIcon、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { CardsManagement } from "@/components/blocks/cards-management";

export default function Example() {
  return (<CardsManagement onFreezeChange={(cardId, frozen) => console.log(cardId, frozen)} />);
}
```

## CardsManagement Props

| Prop | 必填 | Type |
|---|---|---|
| cards | 否 | `ManagedCard[] \| undefined` |
| onAddCard | 否 | `(() => void) \| undefined` |
| onFreezeChange | 否 | `((cardId: string, frozen: boolean) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/categories-table.md

# 商品分类

分类：数据列表。维护商品分类的名称、说明、销量与库存，支持新增、编辑与删除。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CellImageText、CellMuted、CellText、ConfirmationDialog、DataTable、IconButton、Modal、PlusIcon、TextArea、TextField、cn。

## 最小可用示例

```tsx
import { CategoriesTable } from "@/components/blocks/categories-table";

export default function Example() {
  return (<CategoriesTable onSave={(category, id) => console.log(id ?? "new", category.name)} />);
}
```

## CategoriesTable Props

| Prop | 必填 | Type |
|---|---|---|
| categories | 否 | `CategoryRecord[] \| undefined` |
| onSave | 否 | `((category: CategoryDraft, id?: string) => void) \| undefined` |
| onDelete | 否 | `((category: CategoryRecord) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/client-directory.md

# 客户名录

分类：数据列表。可在表格与卡片视图间切换的客户名录，显示公司、联系方式与合作项目数。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Button、ButtonGroup、CellImageText、CellMuted、CellText、DataTable、IconButton、Panel、PlusIcon、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { ClientDirectory } from "@/components/blocks/client-directory";

export default function Example() {
  return (<ClientDirectory onOpen={client => console.log(client.company)} />);
}
```

## ClientDirectory Props

| Prop | 必填 | Type |
|---|---|---|
| clients | 否 | `ClientRecord[] \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((client: ClientRecord) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/composition-card.md

# 构成占比卡

分类：图表与指标。用圆环图展示收入、渠道或费用的构成与占比。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：DonutChart、Panel。

## 最小可用示例

```tsx
import { CompositionCard } from "@/components/blocks/composition-card";

export default function Example() {
  return (<CompositionCard title="渠道占比" chart={{ segments: [{ label: "商城", value: 257 }, { label: "小店", value: 255 }], centerValue: "512 笔" }} />);
}
```

## CompositionCard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `import("react").ReactNode` |
| defaultChecked | 否 | `boolean \| undefined` |
| defaultValue | 否 | `string \| number \| readonly string[] \| undefined` |
| suppressContentEditableWarning | 否 | `boolean \| undefined` |
| suppressHydrationWarning | 否 | `boolean \| undefined` |
| accessKey | 否 | `string \| undefined` |
| autoCapitalize | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |
| autoFocus | 否 | `boolean \| undefined` |
| className | 否 | `string \| undefined` |
| contentEditable | 否 | `(boolean \| "true" \| "false") \| "inherit" \| "plaintext-only" \| undefined` |
| contextMenu | 否 | `string \| undefined` |
| dir | 否 | `string \| undefined` |
| draggable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| enterKeyHint | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |
| hidden | 否 | `boolean \| undefined` |
| id | 否 | `string \| undefined` |
| lang | 否 | `string \| undefined` |
| nonce | 否 | `string \| undefined` |
| slot | 否 | `string \| undefined` |
| spellCheck | 否 | `(boolean \| "true" \| "false") \| undefined` |
| style | 否 | `import("react").CSSProperties \| undefined` |
| tabIndex | 否 | `number \| undefined` |
| translate | 否 | `"yes" \| "no" \| undefined` |
| radioGroup | 否 | `string \| undefined` |
| role | 否 | `import("react").AriaRole \| undefined` |
| about | 否 | `string \| undefined` |
| content | 否 | `string \| undefined` |
| datatype | 否 | `string \| undefined` |
| inlist | 否 | `any` |
| prefix | 否 | `string \| undefined` |
| property | 否 | `string \| undefined` |
| rel | 否 | `string \| undefined` |
| resource | 否 | `string \| undefined` |
| rev | 否 | `string \| undefined` |
| typeof | 否 | `string \| undefined` |
| vocab | 否 | `string \| undefined` |
| autoCorrect | 否 | `string \| undefined` |
| autoSave | 否 | `string \| undefined` |
| color | 否 | `string \| undefined` |
| itemProp | 否 | `string \| undefined` |
| itemScope | 否 | `boolean \| undefined` |
| itemType | 否 | `string \| undefined` |
| itemID | 否 | `string \| undefined` |
| itemRef | 否 | `string \| undefined` |
| results | 否 | `number \| undefined` |
| security | 否 | `string \| undefined` |
| unselectable | 否 | `"off" \| "on" \| undefined` |
| popover | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |
| popoverTargetAction | 否 | `"toggle" \| "show" \| "hide" \| undefined` |
| popoverTarget | 否 | `string \| undefined` |
| inert | 否 | `boolean \| undefined` |
| inputMode | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` |
| is | 否 | `string \| undefined` |
| exportparts | 否 | `string \| undefined` |
| part | 否 | `string \| undefined` |
| aria-activedescendant | 否 | `string \| undefined` |
| aria-atomic | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-autocomplete | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` |
| aria-braillelabel | 否 | `string \| undefined` |
| aria-brailleroledescription | 否 | `string \| undefined` |
| aria-busy | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-checked | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-colcount | 否 | `number \| undefined` |
| aria-colindex | 否 | `number \| undefined` |
| aria-colindextext | 否 | `string \| undefined` |
| aria-colspan | 否 | `number \| undefined` |
| aria-controls | 否 | `string \| undefined` |
| aria-current | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` |
| aria-describedby | 否 | `string \| undefined` |
| aria-description | 否 | `string \| undefined` |
| aria-details | 否 | `string \| undefined` |
| aria-disabled | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-dropeffect | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` |
| aria-errormessage | 否 | `string \| undefined` |
| aria-expanded | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-flowto | 否 | `string \| undefined` |
| aria-grabbed | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-haspopup | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` |
| aria-hidden | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-invalid | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` |
| aria-keyshortcuts | 否 | `string \| undefined` |
| aria-label | 否 | `string \| undefined` |
| aria-labelledby | 否 | `string \| undefined` |
| aria-level | 否 | `number \| undefined` |
| aria-live | 否 | `"off" \| "assertive" \| "polite" \| undefined` |
| aria-modal | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiline | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiselectable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-orientation | 否 | `"horizontal" \| "vertical" \| undefined` |
| aria-owns | 否 | `string \| undefined` |
| aria-placeholder | 否 | `string \| undefined` |
| aria-posinset | 否 | `number \| undefined` |
| aria-pressed | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-readonly | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-relevant | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` |
| aria-required | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-roledescription | 否 | `string \| undefined` |
| aria-rowcount | 否 | `number \| undefined` |
| aria-rowindex | 否 | `number \| undefined` |
| aria-rowindextext | 否 | `string \| undefined` |
| aria-rowspan | 否 | `number \| undefined` |
| aria-selected | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-setsize | 否 | `number \| undefined` |
| aria-sort | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` |
| aria-valuemax | 否 | `number \| undefined` |
| aria-valuemin | 否 | `number \| undefined` |
| aria-valuenow | 否 | `number \| undefined` |
| aria-valuetext | 否 | `string \| undefined` |
| dangerouslySetInnerHTML | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |
| onCopy | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCopyCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCut | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCutCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPaste | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPasteCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEnd | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEndCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStart | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStartCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdate | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdateCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onFocus | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onFocusCapture | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlur | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlurCapture | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onChange | 否 | `import("react").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onChangeCapture | 否 | `import("react").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onBeforeInput | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onBeforeInputCapture | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onInput | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onInputCapture | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onReset | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onResetCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSubmit | 否 | `import("react").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onSubmitCapture | 否 | `import("react").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onInvalid | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onInvalidCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoad | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onError | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onErrorCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onKeyDown | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyDownCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPress | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPressCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUp | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUpCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onAbort | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAbortCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlay | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThrough | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThroughCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptied | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptiedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncrypted | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncryptedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEnded | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEndedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedData | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedDataCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadata | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadataCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStart | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStartCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPause | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPauseCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlay | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlaying | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgress | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgressCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeked | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeking | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalled | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalledCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspend | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspendCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdate | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdateCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaiting | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaitingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAuxClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onAuxClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenu | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenuCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDrag | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnd | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEndCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnter | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnterCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExit | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExitCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeave | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeaveCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOver | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOverCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStart | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStartCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDrop | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDropCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onMouseDown | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseDownCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseEnter | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseLeave | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMove | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMoveCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOut | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOutCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOver | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOverCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUp | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUpCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onSelect | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSelectCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancel | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancelCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEnd | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEndCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMove | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMoveCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStart | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStartCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onPointerDown | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerDownCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMove | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMoveCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUp | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUpCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancel | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancelCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerEnter | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerLeave | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOver | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOverCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOut | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOutCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCaptureCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCaptureCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onScroll | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollCapture | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEnd | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEndCapture | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onWheel | 否 | `import("react").WheelEventHandler<HTMLDivElement> \| undefined` |
| onWheelCapture | 否 | `import("react").WheelEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStart | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStartCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEnd | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEndCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIteration | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIterationCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onToggle | 否 | `import("react").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onBeforeToggle | 否 | `import("react").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancel | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancelCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEnd | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEndCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRun | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRunCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStart | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStartCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| subtitle | 否 | `import("react").ReactNode` |
| action | 否 | `import("react").ReactNode` |
| footer | 否 | `import("react").ReactNode` |
| as | 否 | `"article" \| "div" \| "section" \| "aside" \| undefined` |
| asChild | 否 | `boolean \| undefined` |
| gap | 否 | `"none" \| "sm" \| "md" \| undefined` |
| children | 否 | `import("react").ReactNode` |
| chart | 否 | `DonutChartProps \| undefined` |
| variant | 否 | `"plain" \| "template" \| undefined` |

---

Source: skills/forge-skill/references/blocks/crm-summary.md

# 客户经营摘要

分类：图表与指标。概览客户规模与增长情况，为销售团队提供经营摘要。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Panel、DescriptionItem、LineChartStatCard、SurfaceCard。

## 最小可用示例

```tsx
import { CrmMetricCard } from "@/components/blocks/crm-summary";

export default function Example() {
  return (<CrmMetricCard title="客户数" date="本月" value="120" trend="10%" note="较上月" footer="已更新" />);
}
```

## CrmSurface Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| subtitle | 否 | `string \| undefined` |
| action | 否 | `ReactNode` |
| children | 是 | `ReactNode` |
| className | 否 | `string \| undefined` |

## CrmStat Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| value | 是 | `string` |
| tone | 否 | `"purple" \| "blue" \| "green" \| undefined` |
| bars | 是 | `number[]` |

## DetailLine Props

| Prop | 必填 | Type |
|---|---|---|
| label | 是 | `string` |
| value | 是 | `string` |

## CrmMetricCard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| date | 是 | `string` |
| value | 是 | `string` |
| trend | 是 | `string` |
| trendDirection | 否 | `"up" \| "down" \| undefined` |
| note | 是 | `string` |
| icon | 否 | `ReactNode` |
| iconClassName | 否 | `string \| undefined` |
| footer | 是 | `ReactNode` |

---

Source: skills/forge-skill/references/blocks/customer-profile.md

# 客户详情

分类：详情页。客户画像卡、消费指标、最近购买、消费走势、订单与评价分页签。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、IconButton、Panel、ReviewItem、SmoothLineChart、StatCard、StatusBadge、TabBar、cn。

## 最小可用示例

```tsx
import { CustomerProfile } from "@/components/blocks/customer-profile";

export default function Example() {
  return (<CustomerProfile onMessage={() => {}} />);
}
```

## CustomerProfile Props

| Prop | 必填 | Type |
|---|---|---|
| customer | 否 | `CustomerProfileData \| undefined` |
| onCall | 否 | `(() => void) \| undefined` |
| onMessage | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/customers-table.md

# 客户列表

分类：数据列表。带搜索、在线状态、联系方式与新增客户弹窗的客户管理表。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Button、CellImageText、CellMuted、CellText、DataTable、IconButton、Modal、PlusIcon、StatusBadge、TextField、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { CustomersTable } from "@/components/blocks/customers-table";

export default function Example() {
  return (<CustomersTable onCreate={customer => console.log(customer.name)} />);
}
```

## CustomersTable Props

| Prop | 必填 | Type |
|---|---|---|
| customers | 否 | `CustomerRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onCreate | 否 | `((customer: NewCustomer) => void) \| undefined` |
| onExport | 否 | `((customers: CustomerRecord[]) => void) \| undefined` |
| onContact | 否 | `((customer: CustomerRecord, channel: "email" \| "phone") => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/deals-table.md

# 商机列表

分类：数据列表。按回款状态汇总金额，列出商机、客户、付款方式与回款状态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CellImageText、CellText、ConfirmationDialog、DataTable、IconButton、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { DealsTable } from "@/components/blocks/deals-table";

export default function Example() {
  return (<DealsTable onOpen={deal => console.log(deal.title)} />);
}
```

## DealsTable Props

| Prop | 必填 | Type |
|---|---|---|
| deals | 否 | `DealRecord[] \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((deal: DealRecord) => void) \| undefined` |
| onEdit | 否 | `((deal: DealRecord) => void) \| undefined` |
| onExport | 否 | `((deals: DealRecord[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/dialog-form.md

# 弹窗表单

分类：表单。列表页里的新建与编辑：树形部门列表，点新增、修改或新增下级弹出两列表单，带必填校验，确定后回写列表。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ConfirmationDialog、DataTable、Modal、PageTitleToolbar、PlusIcon、RadioWithLabel、SelectOption、StatusBadge、TextField、Toolbar、ToolbarSearchInput。

## 最小可用示例

```tsx
import { DialogForm } from "@/components/blocks/dialog-form";

export default function Example() {
  return (<DialogForm />);
}
```

## DialogForm Props

| Prop | 必填 | Type |
|---|---|---|
| departments | 否 | `Department[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/file-manager.md

# 文件管理

分类：协作与项目。按类型筛选的文件夹与文件卡片墙，支持搜索、多选、上传与删除确认。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CellActions、Checkbox、ConfirmationDialog、FileTypeIcon、Panel、PlusIcon、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { FileManager } from "@/components/blocks/file-manager";

export default function Example() {
  return (<FileManager onOpen={file => console.log(file.name)} />);
}
```

## FileManager Props

| Prop | 必填 | Type |
|---|---|---|
| files | 否 | `FileEntry[] \| undefined` |
| onUpload | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((file: FileEntry) => void) \| undefined` |
| onDelete | 否 | `((file: FileEntry) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/finance-overview.md

# 财务概览

分类：看板首屏。结合账户余额、收支趋势和储蓄目标，构建完整的财务工作台。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ChartMetricRow、CreditCard、GroupedBarChart、Panel、WalletGoalCard、cn。

## 最小可用示例

```tsx
import { FinanceOverview } from "@/components/blocks/finance-overview";

export default function Example() {
  return (<FinanceOverview title="财务概览" periodLabel="2026.10.25 — 10.31" />);
}
```

## FinanceOverview Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| description | 否 | `string \| undefined` |
| periodLabel | 否 | `string \| undefined` |
| accounts | 否 | `FinanceAccount[] \| undefined` |
| trend | 否 | `{ data: import("@forge-ui-official/core").GroupedBarPoint[]; series: import("@forge-ui-official/core").ChartMetricSeries[]; activeIndex?: number; tooltipItems?: import("@forge-ui-official/core").GroupedBarTooltipItem[]; yAxisLabels?: string[]; heightClass?: string; } \| undefined` |
| goals | 否 | `(WalletGoalCardProps & { id: string; })[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/finance-workspace.md

# 财务工作区

分类：财务。整合账户余额、预算与费用明细，集中查看财务状况。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Panel、DescriptionItem、SurfaceCard、ToolbarKebabButton。

## 最小可用示例

```tsx
import { FinanceSurface } from "@/components/blocks/finance-workspace";

export default function Example() {
  return (<FinanceSurface title="财务摘要">本月收入：12000 元</FinanceSurface>);
}
```

## FinanceSurface Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| eyebrow | 否 | `string \| undefined` |
| action | 否 | `ReactNode` |
| children | 是 | `ReactNode` |
| className | 否 | `string \| undefined` |

## FieldLine Props

| Prop | 必填 | Type |
|---|---|---|
| label | 是 | `string` |
| value | 是 | `string` |

## VisualCard Props

| Prop | 必填 | Type |
|---|---|---|
| theme | 是 | `"purple" \| "blue" \| "yellow" \| "dark"` |
| name | 是 | `string` |
| type | 是 | `string` |
| last4 | 是 | `string` |
| balance | 是 | `string` |

## FinanceMetricCard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| value | 是 | `string` |
| trend | 是 | `string` |
| note | 是 | `string` |
| chartColor | 否 | `"blue" \| "green" \| "red" \| undefined` |

## WalletProgressLine Props

| Prop | 必填 | Type |
|---|---|---|
| value | 是 | `number` |
| color | 是 | `"purple" \| "blue" \| "green" \| "red" \| "yellow" \| "cyan"` |

## FinanceGoalCell Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| subtitle | 否 | `string \| undefined` |
| color | 是 | `"purple" \| "blue" \| "green" \| "red" \| "yellow" \| "cyan"` |

## FinanceTransactionCell Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| subtitle | 是 | `string` |
| color | 是 | `"purple" \| "blue" \| "green" \| "red" \| "yellow" \| "cyan"` |

## FinanceExpenseGauge Props

| Prop | 必填 | Type |
|---|---|---|


## FinanceBudgetPanel Props

| Prop | 必填 | Type |
|---|---|---|

---

Source: skills/forge-skill/references/blocks/goal-progress-list.md

# 目标进度列表

分类：财务。跟踪储蓄与预算目标，查看已积累金额和完成进度。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、KebabMenu、PageDot、Panel、WalletGoalCard。

## 最小可用示例

```tsx
import { GoalProgressList } from "@/components/blocks/goal-progress-list";

export default function Example() {
  return (<GoalProgressList title="目标进度" goals={[{ id: "monthly", title: "月度目标", date: "2026 年 11 月", amount: "¥16,000", progress: 50, progressColor: "purple" }]} />);
}
```

## GoalProgressList Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `import("react").ReactNode` |
| defaultChecked | 否 | `boolean \| undefined` |
| defaultValue | 否 | `string \| number \| readonly string[] \| undefined` |
| suppressContentEditableWarning | 否 | `boolean \| undefined` |
| suppressHydrationWarning | 否 | `boolean \| undefined` |
| accessKey | 否 | `string \| undefined` |
| autoCapitalize | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |
| autoFocus | 否 | `boolean \| undefined` |
| className | 否 | `string \| undefined` |
| contentEditable | 否 | `(boolean \| "true" \| "false") \| "inherit" \| "plaintext-only" \| undefined` |
| contextMenu | 否 | `string \| undefined` |
| dir | 否 | `string \| undefined` |
| draggable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| enterKeyHint | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |
| hidden | 否 | `boolean \| undefined` |
| id | 否 | `string \| undefined` |
| lang | 否 | `string \| undefined` |
| nonce | 否 | `string \| undefined` |
| slot | 否 | `string \| undefined` |
| spellCheck | 否 | `(boolean \| "true" \| "false") \| undefined` |
| style | 否 | `import("react").CSSProperties \| undefined` |
| tabIndex | 否 | `number \| undefined` |
| translate | 否 | `"yes" \| "no" \| undefined` |
| radioGroup | 否 | `string \| undefined` |
| role | 否 | `import("react").AriaRole \| undefined` |
| about | 否 | `string \| undefined` |
| content | 否 | `string \| undefined` |
| datatype | 否 | `string \| undefined` |
| inlist | 否 | `any` |
| prefix | 否 | `string \| undefined` |
| property | 否 | `string \| undefined` |
| rel | 否 | `string \| undefined` |
| resource | 否 | `string \| undefined` |
| rev | 否 | `string \| undefined` |
| typeof | 否 | `string \| undefined` |
| vocab | 否 | `string \| undefined` |
| autoCorrect | 否 | `string \| undefined` |
| autoSave | 否 | `string \| undefined` |
| color | 否 | `string \| undefined` |
| itemProp | 否 | `string \| undefined` |
| itemScope | 否 | `boolean \| undefined` |
| itemType | 否 | `string \| undefined` |
| itemID | 否 | `string \| undefined` |
| itemRef | 否 | `string \| undefined` |
| results | 否 | `number \| undefined` |
| security | 否 | `string \| undefined` |
| unselectable | 否 | `"off" \| "on" \| undefined` |
| popover | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |
| popoverTargetAction | 否 | `"toggle" \| "show" \| "hide" \| undefined` |
| popoverTarget | 否 | `string \| undefined` |
| inert | 否 | `boolean \| undefined` |
| inputMode | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` |
| is | 否 | `string \| undefined` |
| exportparts | 否 | `string \| undefined` |
| part | 否 | `string \| undefined` |
| aria-activedescendant | 否 | `string \| undefined` |
| aria-atomic | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-autocomplete | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` |
| aria-braillelabel | 否 | `string \| undefined` |
| aria-brailleroledescription | 否 | `string \| undefined` |
| aria-busy | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-checked | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-colcount | 否 | `number \| undefined` |
| aria-colindex | 否 | `number \| undefined` |
| aria-colindextext | 否 | `string \| undefined` |
| aria-colspan | 否 | `number \| undefined` |
| aria-controls | 否 | `string \| undefined` |
| aria-current | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` |
| aria-describedby | 否 | `string \| undefined` |
| aria-description | 否 | `string \| undefined` |
| aria-details | 否 | `string \| undefined` |
| aria-disabled | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-dropeffect | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` |
| aria-errormessage | 否 | `string \| undefined` |
| aria-expanded | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-flowto | 否 | `string \| undefined` |
| aria-grabbed | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-haspopup | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` |
| aria-hidden | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-invalid | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` |
| aria-keyshortcuts | 否 | `string \| undefined` |
| aria-label | 否 | `string \| undefined` |
| aria-labelledby | 否 | `string \| undefined` |
| aria-level | 否 | `number \| undefined` |
| aria-live | 否 | `"off" \| "assertive" \| "polite" \| undefined` |
| aria-modal | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiline | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiselectable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-orientation | 否 | `"horizontal" \| "vertical" \| undefined` |
| aria-owns | 否 | `string \| undefined` |
| aria-placeholder | 否 | `string \| undefined` |
| aria-posinset | 否 | `number \| undefined` |
| aria-pressed | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-readonly | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-relevant | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` |
| aria-required | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-roledescription | 否 | `string \| undefined` |
| aria-rowcount | 否 | `number \| undefined` |
| aria-rowindex | 否 | `number \| undefined` |
| aria-rowindextext | 否 | `string \| undefined` |
| aria-rowspan | 否 | `number \| undefined` |
| aria-selected | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-setsize | 否 | `number \| undefined` |
| aria-sort | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` |
| aria-valuemax | 否 | `number \| undefined` |
| aria-valuemin | 否 | `number \| undefined` |
| aria-valuenow | 否 | `number \| undefined` |
| aria-valuetext | 否 | `string \| undefined` |
| dangerouslySetInnerHTML | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |
| onCopy | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCopyCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCut | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCutCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPaste | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPasteCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEnd | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEndCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStart | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStartCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdate | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdateCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onFocus | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onFocusCapture | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlur | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlurCapture | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onChange | 否 | `import("react").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onChangeCapture | 否 | `import("react").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onBeforeInput | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onBeforeInputCapture | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onInput | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onInputCapture | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onReset | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onResetCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSubmit | 否 | `import("react").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onSubmitCapture | 否 | `import("react").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onInvalid | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onInvalidCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoad | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onError | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onErrorCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onKeyDown | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyDownCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPress | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPressCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUp | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUpCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onAbort | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAbortCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlay | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThrough | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThroughCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptied | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptiedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncrypted | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncryptedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEnded | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEndedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedData | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedDataCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadata | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadataCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStart | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStartCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPause | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPauseCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlay | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlaying | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgress | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgressCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeked | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeking | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalled | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalledCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspend | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspendCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdate | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdateCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaiting | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaitingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAuxClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onAuxClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenu | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenuCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDrag | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnd | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEndCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnter | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnterCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExit | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExitCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeave | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeaveCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOver | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOverCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStart | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStartCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDrop | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDropCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onMouseDown | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseDownCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseEnter | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseLeave | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMove | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMoveCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOut | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOutCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOver | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOverCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUp | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUpCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onSelect | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSelectCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancel | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancelCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEnd | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEndCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMove | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMoveCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStart | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStartCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onPointerDown | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerDownCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMove | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMoveCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUp | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUpCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancel | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancelCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerEnter | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerLeave | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOver | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOverCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOut | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOutCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCaptureCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCaptureCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onScroll | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollCapture | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEnd | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEndCapture | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onWheel | 否 | `import("react").WheelEventHandler<HTMLDivElement> \| undefined` |
| onWheelCapture | 否 | `import("react").WheelEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStart | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStartCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEnd | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEndCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIteration | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIterationCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onToggle | 否 | `import("react").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onBeforeToggle | 否 | `import("react").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancel | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancelCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEnd | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEndCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRun | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRunCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStart | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStartCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| subtitle | 否 | `import("react").ReactNode` |
| action | 否 | `import("react").ReactNode` |
| footer | 否 | `import("react").ReactNode` |
| variant | 否 | `"dashboard" \| "template" \| "custom" \| undefined` |
| as | 否 | `"article" \| "div" \| "section" \| "aside" \| undefined` |
| asChild | 否 | `boolean \| undefined` |
| gap | 否 | `"none" \| "sm" \| "md" \| undefined` |
| children | 否 | `import("react").ReactNode` |
| goals | 否 | `(WalletGoalCardProps & { id: string; })[] \| undefined` |

## WalletProgressPanel Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| subtitle | 否 | `string \| undefined` |
| goalTitle | 否 | `string \| undefined` |
| date | 否 | `string \| undefined` |
| amount | 否 | `string \| undefined` |
| progress | 否 | `number \| undefined` |
| onRefresh | 否 | `(() => void) \| undefined` |
| onTopUp | 否 | `(() => void) \| undefined` |
| onWithdraw | 否 | `(() => void) \| undefined` |

---

Source: skills/forge-skill/references/blocks/integrations-directory.md

# 集成目录

分类：设置。按分类浏览可连接的应用，支持搜索、连接中状态与断开连接。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Panel、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { IntegrationsDirectory } from "@/components/blocks/integrations-directory";

export default function Example() {
  return (<IntegrationsDirectory onConnect={app => console.log(app.name)} />);
}
```

## IntegrationsDirectory Props

| Prop | 必填 | Type |
|---|---|---|
| integrations | 否 | `Integration[] \| undefined` |
| onConnect | 否 | `((integration: Integration) => Promise<void> \| void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/invoice-document.md

# 发票单据

分类：详情页。可打印的发票版式，含开票方、收货方、商品明细、税费合计与发送下载操作。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、HistoryItem、Label、Panel、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { InvoiceDocument } from "@/components/blocks/invoice-document";

export default function Example() {
  return (<InvoiceDocument onSend={invoice => console.log(invoice.id)} />);
}
```

## InvoiceDocument Props

| Prop | 必填 | Type |
|---|---|---|
| invoice | 否 | `InvoiceDocumentData \| undefined` |
| onSend | 否 | `((invoice: InvoiceDocumentData) => void) \| undefined` |
| onDownload | 否 | `((invoice: InvoiceDocumentData) => void) \| undefined` |
| onEdit | 否 | `((invoice: InvoiceDocumentData) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/invoice-form.md

# 单卡表单

分类：表单。一张卡片从上到下填完：客户与日期两列排开，收费明细在表格里直接编辑，合计紧跟在明细下方，付款说明和操作按钮收在卡片底部。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、IconButton、PageTitleToolbar、PlusIcon、SelectOption、TextArea、TextField。

## 最小可用示例

```tsx
import { InvoiceForm } from "@/components/blocks/invoice-form";

export default function Example() {
  return (<InvoiceForm onSend={(value, total) => console.log(value.invoiceId, total)} />);
}
```

## InvoiceForm Props

| Prop | 必填 | Type |
|---|---|---|
| value | 否 | `InvoiceFormValue \| undefined` |
| onSave | 否 | `((value: InvoiceFormValue) => void) \| undefined` |
| onSend | 否 | `((value: InvoiceFormValue, total: number) => void) \| undefined` |
| onCancel | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/invoices-table.md

# 发票列表

分类：数据列表。按付款状态筛选的发票表，显示付款方、金额、开票与到期日，并汇总待收金额。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CellImageText、CellMuted、CellText、DataTable、IconButton、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { InvoicesTable } from "@/components/blocks/invoices-table";

export default function Example() {
  return (<InvoicesTable onOpen={invoice => console.log(invoice.id)} />);
}
```

## InvoicesTable Props

| Prop | 必填 | Type |
|---|---|---|
| invoices | 否 | `InvoiceRecord[] \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((invoice: InvoiceRecord) => void) \| undefined` |
| onDownload | 否 | `((invoice: InvoiceRecord) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/kanban-board.md

# 项目看板

分类：协作与项目。项目详情页：按状态分栏的任务看板，可拖拽、勾选完成、展开子任务和快速添加；右侧项目属性、描述与资源，点任务卡片打开带动态、评论和属性的任务详情。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Breadcrumbs、Button、IconButton、KebabMenu、PageTitleToolbar、PlusIcon、ProgressBar、TextField。

## 最小可用示例

```tsx
import { KanbanBoard } from "@/components/blocks/kanban-board";

export default function Example() {
  return (<KanbanBoard />);
}
```

## KanbanBoard Props

| Prop | 必填 | Type |
|---|---|---|
| project | 否 | `BoardProject \| undefined` |
| lanes | 否 | `BoardLane[] \| undefined` |
| items | 否 | `WorkItem[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/kpi-metrics.md

# KPI 指标行

分类：图表与指标。集中展示收入、订单与客户等关键指标，适用于经营看板首屏。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：BarChartStatCard、LineChartStatCard、Panel、StatCard、cn。

## 最小可用示例

```tsx
import { KpiMetrics } from "@/components/blocks/kpi-metrics";

export default function Example() {
  return (<KpiMetrics metrics={[{ id: "revenue", title: "营业收入", value: "¥32,200", trend: "10%", data: [12, 24, 18, 36, 42] }, { id: "orders", title: "订单", value: "1020", trend: "32%", visualization: "line", data: [20, 30, 24, 40, 52] }, { id: "customers", title: "客户", value: "860", data: [10, 30, 60, 95, 50, 40, 30] }]} />);
}
```

## KpiMetrics Props

| Prop | 必填 | Type |
|---|---|---|
| metrics | 否 | `({ title: string; value: ReactNode; animateValue?: boolean; locale?: string; numberFormat?: Intl.NumberFormatOptions; motion?: import("@forge-ui-official/core").MotionPreference; trend?: string; trendDirection?: import("@forge-ui-official/core").TrendDirection; subtitle?: string; theme?: import("@forge-ui-official/core").CardTheme \| ("dark" \| "orange"); size?: import("@forge-ui-official/core").StatCardSize; icon?: ReactNode; badgeVariant?: import("@forge-ui-official/core").CardBadgeVariant; action?: ReactNode; onKebabClick?: () => void; density?: import("@forge-ui-official/core").CardDensity; width?: import("@forge-ui-official/core").CardWidth; className?: string; } & { id: string; visualization?: "line" \| "bar"; data?: number[]; })[] \| undefined` |
| children | 否 | `ReactNode` |
| className | 否 | `string \| undefined` |
| variant | 否 | `"chart" \| "plain" \| undefined` |
| bars | 否 | `number[] \| undefined` |

## FinanceMetricCard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| value | 是 | `string` |
| color | 是 | `"purple" \| "red"` |
| direction | 是 | `"up" \| "down"` |

---

Source: skills/forge-skill/references/blocks/layout-icon-rail.md

# 图标栏布局

分类：页面结构。侧栏默认收起为图标条，把宽度留给表格与筛选；顶栏左侧用汉堡按钮展开菜单，头像在右侧。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、Breadcrumbs、Button、DataTable、PageTitleToolbar、PlusIcon、StatusBadge、Toolbar、ToolbarSearchInput、ToolbarSelectDropdown。

## 最小可用示例

```tsx
import { LayoutIconRail } from "@/components/blocks/layout-icon-rail";

export default function Example() {
  return (<LayoutIconRail><p>页面内容</p></LayoutIconRail>);
}
```

## LayoutIconRail Props

| Prop | 必填 | Type |
|---|---|---|
| menuItems | 否 | `AppLayoutMenuItem[] \| undefined` |
| children | 否 | `ReactNode` |

---

Source: skills/forge-skill/references/blocks/layout-immersive.md

# 沉浸式布局

分类：页面结构。去掉页头，侧栏收成图标条，内容区整块留给对话、画布或编辑器这类需要满屏的工作区。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、ChatBubble、ChatInputBar。

## 最小可用示例

```tsx
import { LayoutImmersive } from "@/components/blocks/layout-immersive";

export default function Example() {
  return (<LayoutImmersive><p>页面内容</p></LayoutImmersive>);
}
```

## LayoutImmersive Props

| Prop | 必填 | Type |
|---|---|---|
| menuItems | 否 | `AppLayoutMenuItem[] \| undefined` |
| children | 否 | `ReactNode` |

---

Source: skills/forge-skill/references/blocks/layout-settings.md

# 设置页布局

分类：页面结构。设置类页面：左侧二级导航切换分类，右侧按主题分卡，说明在上、字段居中、每张卡底部单独保存。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、Avatar、Breadcrumbs、Button、PageTitleToolbar、SelectOption、TextArea、TextField、Toggle。

## 最小可用示例

```tsx
import { LayoutSettings } from "@/components/blocks/layout-settings";

export default function Example() {
  return (<LayoutSettings><p>页面内容</p></LayoutSettings>);
}
```

## LayoutSettings Props

| Prop | 必填 | Type |
|---|---|---|
| menuItems | 否 | `AppLayoutMenuItem[] \| undefined` |
| children | 否 | `ReactNode` |

---

Source: skills/forge-skill/references/blocks/layout-sidebar-profile.md

# 侧栏头像布局

分类：页面结构。头像、通知与语言收进侧栏底部，菜单按工作区、智能体、平台分组；顶部只保留页头的标题、面包屑与操作。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、ProgressBar、StatusBadge、SurfaceCard。

## 最小可用示例

```tsx
import { LayoutSidebarProfile } from "@/components/blocks/layout-sidebar-profile";

export default function Example() {
  return (<LayoutSidebarProfile><p>页面内容</p></LayoutSidebarProfile>);
}
```

## LayoutSidebarProfile Props

| Prop | 必填 | Type |
|---|---|---|
| menuSections | 否 | `AppLayoutMenuSection[] \| undefined` |
| children | 否 | `ReactNode` |

---

Source: skills/forge-skill/references/blocks/layout-topbar-profile.md

# 顶栏头像布局

分类：页面结构。侧栏展开并按业务分组，搜索在顶栏左侧，头像、通知与消息集中在顶栏右侧，页头带标题、面包屑和主操作。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、Breadcrumbs、Button、DataTable、PageTitleToolbar、StatCard、StatusBadge。

## 最小可用示例

```tsx
import { LayoutTopbarProfile } from "@/components/blocks/layout-topbar-profile";

export default function Example() {
  return (<LayoutTopbarProfile><p>页面内容</p></LayoutTopbarProfile>);
}
```

## LayoutTopbarProfile Props

| Prop | 必填 | Type |
|---|---|---|
| menuSections | 否 | `AppLayoutMenuSection[] \| undefined` |
| children | 否 | `ReactNode` |

---

Source: skills/forge-skill/references/blocks/lead-detail.md

# 线索详情

分类：详情页。线索名片与基础信息，按类型筛选的跟进动态，以及添加跟进记录弹窗。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Modal、Panel、PlusIcon、SelectOption、StatusBadge、TabBar、TextArea、cn。

## 最小可用示例

```tsx
import { LeadDetail } from "@/components/blocks/lead-detail";

export default function Example() {
  return (<LeadDetail onAddActivity={activity => console.log(activity.kind)} />);
}
```

## LeadDetail Props

| Prop | 必填 | Type |
|---|---|---|
| lead | 否 | `LeadDetailData \| undefined` |
| onAddActivity | 否 | `((activity: LeadActivity) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/leads-table.md

# 销售线索

分类：数据列表。线索总数、成交与流失指标卡，配合状态筛选、搜索与线索表格。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、AvatarGroup、Button、ButtonGroup、CellImageText、CellMuted、CellText、DataTable、IconButton、Panel、PlusIcon、SmoothLineChart、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { LeadsTable } from "@/components/blocks/leads-table";

export default function Example() {
  return (<LeadsTable onOpen={lead => console.log(lead.id)} />);
}
```

## LeadsTable Props

| Prop | 必填 | Type |
|---|---|---|
| leads | 否 | `LeadRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onExport | 否 | `((leads: LeadRecord[]) => void) \| undefined` |
| onOpen | 否 | `((lead: LeadRecord) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/login-form.md

# 登录

分类：认证。邮箱密码与手机验证码两种登录方式，带记住登录、错误提示与企业单点登录入口。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、Checkbox、OtpInput、TextField、cn。

## 最小可用示例

```tsx
import { LoginForm } from "@/components/blocks/login-form";

export default function Example() {
  return (<LoginForm onLogin={payload => console.log(payload.account)} />);
}
```

## LoginForm Props

| Prop | 必填 | Type |
|---|---|---|
| productName | 否 | `string \| undefined` |
| image | 否 | `string \| undefined` |
| onLogin | 否 | `((payload: { method: "password" \| "code"; account: string; secret: string; remember: boolean; }) => Promise<void> \| void) \| undefined` |
| onSso | 否 | `((provider: string) => void) \| undefined` |
| onForgot | 否 | `(() => void) \| undefined` |
| onRegister | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/member-profile.md

# 成员详情

分类：详情页。成员档案卡、任务统计，以及参与项目、手头任务与动态分页签。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：DataTable、Panel、SmoothLineChart、StatusBadge、TabBar、cn。

## 最小可用示例

```tsx
import { MemberProfile } from "@/components/blocks/member-profile";

export default function Example() {
  return (<MemberProfile />);
}
```

## MemberProfile Props

| Prop | 必填 | Type |
|---|---|---|
| member | 否 | `MemberProfileData \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/message-channels.md

# 消息渠道

分类：AI 与智能体。把智能体接入微信、企业微信、飞书、钉钉和 QQ：渠道入口、智能体与渠道的连接卡片、连接状态，以及填写凭据和绑定智能体的连接弹窗。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、CheckboxWithLabel、ConfirmationDialog、Grid、KebabMenu、Modal、PageTitleToolbar、PlusIcon、RadioWithLabel、SelectOption、StatusBadge、SurfaceCard、TextField、Toolbar、ToolbarSearchInput、ToolbarSelectDropdown。

## 最小可用示例

```tsx
import { MessageChannels } from "@/components/blocks/message-channels";

export default function Example() {
  return (<MessageChannels />);
}
```

## MessageChannels Props

| Prop | 必填 | Type |
|---|---|---|
| connections | 否 | `ChannelConnection[] \| undefined` |
| applications | 否 | `ChannelAgentOption[] \| undefined` |
| autonomousAgents | 否 | `ChannelAgentOption[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/onboarding-flow.md

# 引导流程

分类：认证。首次使用的四步引导：创建工作区、连接工具、邀请成员、从模板创建第一个智能体。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Checkbox、ProgressBar、SelectOption、TextField、Toggle、cn。

## 最小可用示例

```tsx
import { OnboardingFlow } from "@/components/blocks/onboarding-flow";

export default function Example() {
  return (<OnboardingFlow onFinish={value => console.log(value.workspace)} />);
}
```

## OnboardingFlow Props

| Prop | 必填 | Type |
|---|---|---|
| initialValue | 否 | `Partial<OnboardingValue> \| undefined` |
| onFinish | 否 | `((value: OnboardingValue) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/order-detail.md

# 订单详情

分类：详情页。订单状态、商品明细、费用汇总、客户与收货信息，以及物流进度弹窗。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、HistoryItem、InfoRow、Label、Modal、Panel、SelectOption、StatusBadge、cn。

## 最小可用示例

```tsx
import { OrderDetail } from "@/components/blocks/order-detail";

export default function Example() {
  return (<OrderDetail onStatusChange={status => console.log(status)} />);
}
```

## OrderDetail Props

| Prop | 必填 | Type |
|---|---|---|
| order | 否 | `OrderDetailData \| undefined` |
| onStatusChange | 否 | `((status: OrderDetailStatus) => void) \| undefined` |
| onViewInvoice | 否 | `((invoiceId: string) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/order-form.md

# 分步表单

分类：表单。流程较长的录入拆成选择商品、客户信息、配送支付、确认订单四步，每步只校验当前字段，可回到上一步修改，提交后展示结果页。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、PageTitleToolbar、RadioWithLabel、SelectOption、Stepper、TextArea、TextField。

## 最小可用示例

```tsx
import { OrderForm } from "@/components/blocks/order-form";

export default function Example() {
  return (<OrderForm onSubmit={draft => console.log(draft.customer)} />);
}
```

## OrderForm Props

| Prop | 必填 | Type |
|---|---|---|
| products | 否 | `OrderProduct[] \| undefined` |
| onSubmit | 否 | `((draft: OrderDraft) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/orders-table-section.md

# 订单列表

分类：数据列表。包含搜索、状态筛选、导出与分页的订单列表，适用于交易管理页面。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Button、DataTable、IconButton、Modal、Pagination、Panel、StatusBadge、Toolbar、ToolbarSearchInput、ToolbarSelectDropdown、cn。

## 最小可用示例

```tsx
import { OrdersTableSection } from "@/components/blocks/orders-table-section";

export default function Example() {
  return (<OrdersTableSection title="订单列表" pageSize={6} />);
}
```

## OrdersTableSection Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| description | 否 | `string \| undefined` |
| orders | 否 | `OrderRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onViewOrder | 否 | `((order: OrderRecord) => void) \| undefined` |
| onExport | 否 | `((orders: OrderRecord[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/overview-dashboard.md

# 经营概览

分类：看板首屏。将关键指标、收支趋势与收入构成集中在一个完整的经营首屏。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：BarChartStatCard、Button、ChartHeader、ChartMetricRow、DonutChart、GroupedBarChart、LineChartStatCard、Panel、cn。

## 最小可用示例

```tsx
import { OverviewDashboard } from "@/components/blocks/overview-dashboard";

export default function Example() {
  return (<OverviewDashboard title="经营概览" description="知行科技 · 本周经营情况" />);
}
```

## OverviewDashboard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| description | 否 | `string \| undefined` |
| periodLabel | 否 | `string \| undefined` |
| metrics | 否 | `OverviewMetric[] \| undefined` |
| trend | 否 | `{ data: import("@forge-ui-official/core").GroupedBarPoint[]; series: import("@forge-ui-official/core").ChartMetricSeries[]; activeIndex?: number; tooltipItems?: import("@forge-ui-official/core").GroupedBarTooltipItem[]; yAxisLabels?: string[]; heightClass?: string; } \| undefined` |
| composition | 否 | `DonutChartProps \| undefined` |
| onExport | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/password-recovery.md

# 找回密码

分类：认证。邮箱验证、验证码与新密码三步找回流程，带进度提示与校验。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、OtpInput、TextField、cn。

## 最小可用示例

```tsx
import { PasswordRecovery } from "@/components/blocks/password-recovery";

export default function Example() {
  return (<PasswordRecovery onReset={payload => console.log(payload.email)} onBack={() => {}} />);
}
```

## PasswordRecovery Props

| Prop | 必填 | Type |
|---|---|---|
| image | 否 | `string \| undefined` |
| defaultEmail | 否 | `string \| undefined` |
| onSendCode | 否 | `((email: string) => void) \| undefined` |
| onReset | 否 | `((payload: { email: string; code: string; password: string; }) => void) \| undefined` |
| onBack | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/product-detail.md

# 商品详情

分类：详情页。商品图集、价格与规格选择、描述参数，以及订单和评价分页签。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Panel、StatusBadge、TabBar、cn。

## 最小可用示例

```tsx
import { ProductDetail } from "@/components/blocks/product-detail";

export default function Example() {
  return (<ProductDetail onEdit={() => {}} />);
}
```

## ProductDetail Props

| Prop | 必填 | Type |
|---|---|---|
| product | 否 | `ProductDetailData \| undefined` |
| onEdit | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/product-form.md

# 分组表单

分类：表单。字段较多的录入页：同一张卡片里按基本信息、价格库存、图片、物流上架分组，每行三列等宽、单位写在输入框尾部，底部固定操作栏带校验结果与保存状态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、MediaUpload、PageTitleToolbar、RadioWithLabel、SelectOption、TextArea、TextField。

## 最小可用示例

```tsx
import { ProductForm } from "@/components/blocks/product-form";

export default function Example() {
  return (<ProductForm onSubmit={(draft, mode) => console.log(mode, draft.name)} />);
}
```

## ProductForm Props

| Prop | 必填 | Type |
|---|---|---|
| initial | 否 | `ProductDraft \| undefined` |
| onSubmit | 否 | `((draft: ProductDraft, mode: "draft" \| "publish") => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/products-table.md

# 商品列表

分类：数据列表。按状态筛选、搜索、批量勾选与分页的商品管理表，含编辑与删除确认。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CellImageText、CellMuted、CellText、CellTextSubtitle、ConfirmationDialog、DataTable、IconButton、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { ProductsTable } from "@/components/blocks/products-table";

export default function Example() {
  return (<ProductsTable onAdd={() => {}} onEdit={product => console.log(product.id)} />);
}
```

## ProductsTable Props

| Prop | 必填 | Type |
|---|---|---|
| products | 否 | `ProductRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onEdit | 否 | `((product: ProductRecord) => void) \| undefined` |
| onDelete | 否 | `((product: ProductRecord) => void) \| undefined` |
| onExport | 否 | `((products: ProductRecord[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/project-overview.md

# 项目概览

分类：看板首屏。汇总项目进度、团队成员、里程碑与近期活动，掌握交付全貌。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、AvatarGroup、Panel、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { ProjectOverview } from "@/components/blocks/project-overview";

export default function Example() {
  return (<ProjectOverview title="客户工作台升级" progress={75} progressLabel="已完成 18 / 24 项任务" />);
}
```

## ProjectOverview Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| description | 否 | `string \| undefined` |
| progress | 否 | `number \| undefined` |
| progressLabel | 否 | `string \| undefined` |
| deadline | 否 | `string \| undefined` |
| members | 否 | `ProjectMember[] \| undefined` |
| milestones | 否 | `ProjectMilestone[] \| undefined` |
| activities | 否 | `ProjectActivity[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/project-portfolio.md

# 项目总览

分类：协作与项目。整体进度、项目进展与需要关注三张统计卡，项目按状态筛选、搜索与归档切换，并可在可操作的卡片和表格之间切换。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Breadcrumbs、Button、ButtonGroup、CardIconChip、CellMuted、CellProgressBar、CellText、CellTextSubtitle、ConfirmationDialog、DataTable、DonutChart、Grid、GridItem、IconButton、KebabMenu、PageTitleToolbar、ProgressBar、StatusBadge、SurfaceCard、Toolbar、ToolbarPillTabs、ToolbarSearchInput、ToolbarSelectDropdown、cardThemes。

## 最小可用示例

```tsx
import { ProjectPortfolio } from "@/components/blocks/project-portfolio";

export default function Example() {
  return (<ProjectPortfolio />);
}
```

## ProjectPortfolio Props

| Prop | 必填 | Type |
|---|---|---|
| projects | 否 | `PortfolioProject[] \| undefined` |
| stats | 否 | `PortfolioTaskStats \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/prompt-evals.md

# 提示词评测

分类：AI 与智能体。按版本对比通过率、得分、延迟与成本，展示提示词改动和可筛选的测试用例结果。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、DataTable、Panel、SmoothLineChart、StatusBadge、cn。

## 最小可用示例

```tsx
import { PromptEvals } from "@/components/blocks/prompt-evals";

export default function Example() {
  return (<PromptEvals onRun={() => {}} />);
}
```

## PromptEvals Props

| Prop | 必填 | Type |
|---|---|---|
| evals | 否 | `PromptEvalsData \| undefined` |
| onRun | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/provider-settings-form.md

# 服务配置表单

分类：表单。设置类表单：顶部按登录、支付、邮件、存储分标签，每个服务一张卡片，开关启用后展开字段与回调地址，卡片底部单独测试连接与保存。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、PageTitleToolbar、StatusBadge、TabBar、TextField、Toggle。

## 最小可用示例

```tsx
import { ProviderSettingsForm } from "@/components/blocks/provider-settings-form";

export default function Example() {
  return (<ProviderSettingsForm />);
}
```

## ProviderSettingsForm Props

| Prop | 必填 | Type |
|---|---|---|
| groups | 否 | `ProviderGroup[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/ranking-list.md

# 排行列表卡

分类：数据列表。展示商品、渠道或客户的业绩排行，快速识别主要贡献来源。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ChartListItem、ListGroup、cn。

## 最小可用示例

```tsx
import { RankingList } from "@/components/blocks/ranking-list";

export default function Example() {
  return (<RankingList title="商品排行" entries={[{ id: "keyboard", title: "机械键盘", subtitle: "192 件", value: "¥24,500", avatar: "KB" }, { id: "mouse", title: "无线鼠标", subtitle: "160 件", value: "¥12,500" }]} />);
}
```

## RankingList Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| className | 否 | `string \| undefined` |
| color | 否 | `import("@forge-ui-official/core").AccentColor \| undefined` |
| subtitle | 否 | `string \| undefined` |
| action | 否 | `ReactNode` |
| badge | 否 | `ReactNode` |
| tabs | 否 | `import("@forge-ui-official/core").ListGroupTab[] \| undefined` |
| activeTab | 否 | `string \| undefined` |
| onTabChange | 否 | `((value: string) => void) \| undefined` |
| closable | 否 | `boolean \| undefined` |
| onClose | 否 | `(() => void) \| undefined` |
| density | 否 | `import("@forge-ui-official/core").CardDensity \| undefined` |
| items | 否 | `ReactNode` |
| entries | 否 | `{ id: string; title: string; subtitle?: string; value: string; icon?: ComponentProps<typeof ChartListItem>["icon"]; accent?: ComponentProps<typeof ChartListItem>["accent"]; avatar?: string; }[] \| undefined` |
| variant | 否 | `"plain" \| "template" \| undefined` |

---

Source: skills/forge-skill/references/blocks/recent-records.md

# 最近记录表卡

分类：数据列表。在一张卡片内查看最近订单、交易或业务记录。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：DataTable、Panel。

## 最小可用示例

```tsx
import { RecentRecords } from "@/components/blocks/recent-records";

export default function Example() {
  return (<RecentRecords columns={[{ key: "name", header: "订单", render: row => row.name }]} data={[{ id: "1", name: "订单 1" }]} getRowKey={row => row.id} />);
}
```

## RecentRecords Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `import("react").ReactNode` |
| defaultChecked | 否 | `boolean \| undefined` |
| defaultValue | 否 | `string \| number \| readonly string[] \| undefined` |
| suppressContentEditableWarning | 否 | `boolean \| undefined` |
| suppressHydrationWarning | 否 | `boolean \| undefined` |
| accessKey | 否 | `string \| undefined` |
| autoCapitalize | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |
| autoFocus | 否 | `boolean \| undefined` |
| className | 否 | `string \| undefined` |
| contentEditable | 否 | `(boolean \| "true" \| "false") \| "inherit" \| "plaintext-only" \| undefined` |
| contextMenu | 否 | `string \| undefined` |
| dir | 否 | `string \| undefined` |
| draggable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| enterKeyHint | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |
| hidden | 否 | `boolean \| undefined` |
| id | 否 | `string \| undefined` |
| lang | 否 | `string \| undefined` |
| nonce | 否 | `string \| undefined` |
| slot | 否 | `string \| undefined` |
| spellCheck | 否 | `(boolean \| "true" \| "false") \| undefined` |
| style | 否 | `import("react").CSSProperties \| undefined` |
| tabIndex | 否 | `number \| undefined` |
| translate | 否 | `"yes" \| "no" \| undefined` |
| radioGroup | 否 | `string \| undefined` |
| role | 否 | `import("react").AriaRole \| undefined` |
| about | 否 | `string \| undefined` |
| content | 否 | `string \| undefined` |
| datatype | 否 | `string \| undefined` |
| inlist | 否 | `any` |
| prefix | 否 | `string \| undefined` |
| property | 否 | `string \| undefined` |
| rel | 否 | `string \| undefined` |
| resource | 否 | `string \| undefined` |
| rev | 否 | `string \| undefined` |
| typeof | 否 | `string \| undefined` |
| vocab | 否 | `string \| undefined` |
| autoCorrect | 否 | `string \| undefined` |
| autoSave | 否 | `string \| undefined` |
| color | 否 | `string \| undefined` |
| itemProp | 否 | `string \| undefined` |
| itemScope | 否 | `boolean \| undefined` |
| itemType | 否 | `string \| undefined` |
| itemID | 否 | `string \| undefined` |
| itemRef | 否 | `string \| undefined` |
| results | 否 | `number \| undefined` |
| security | 否 | `string \| undefined` |
| unselectable | 否 | `"off" \| "on" \| undefined` |
| popover | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |
| popoverTargetAction | 否 | `"toggle" \| "show" \| "hide" \| undefined` |
| popoverTarget | 否 | `string \| undefined` |
| inert | 否 | `boolean \| undefined` |
| inputMode | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` |
| is | 否 | `string \| undefined` |
| exportparts | 否 | `string \| undefined` |
| part | 否 | `string \| undefined` |
| aria-activedescendant | 否 | `string \| undefined` |
| aria-atomic | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-autocomplete | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` |
| aria-braillelabel | 否 | `string \| undefined` |
| aria-brailleroledescription | 否 | `string \| undefined` |
| aria-busy | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-checked | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-colcount | 否 | `number \| undefined` |
| aria-colindex | 否 | `number \| undefined` |
| aria-colindextext | 否 | `string \| undefined` |
| aria-colspan | 否 | `number \| undefined` |
| aria-controls | 否 | `string \| undefined` |
| aria-current | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` |
| aria-describedby | 否 | `string \| undefined` |
| aria-description | 否 | `string \| undefined` |
| aria-details | 否 | `string \| undefined` |
| aria-disabled | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-dropeffect | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` |
| aria-errormessage | 否 | `string \| undefined` |
| aria-expanded | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-flowto | 否 | `string \| undefined` |
| aria-grabbed | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-haspopup | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` |
| aria-hidden | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-invalid | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` |
| aria-keyshortcuts | 否 | `string \| undefined` |
| aria-label | 否 | `string \| undefined` |
| aria-labelledby | 否 | `string \| undefined` |
| aria-level | 否 | `number \| undefined` |
| aria-live | 否 | `"off" \| "assertive" \| "polite" \| undefined` |
| aria-modal | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiline | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiselectable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-orientation | 否 | `"horizontal" \| "vertical" \| undefined` |
| aria-owns | 否 | `string \| undefined` |
| aria-placeholder | 否 | `string \| undefined` |
| aria-posinset | 否 | `number \| undefined` |
| aria-pressed | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-readonly | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-relevant | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` |
| aria-required | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-roledescription | 否 | `string \| undefined` |
| aria-rowcount | 否 | `number \| undefined` |
| aria-rowindex | 否 | `number \| undefined` |
| aria-rowindextext | 否 | `string \| undefined` |
| aria-rowspan | 否 | `number \| undefined` |
| aria-selected | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-setsize | 否 | `number \| undefined` |
| aria-sort | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` |
| aria-valuemax | 否 | `number \| undefined` |
| aria-valuemin | 否 | `number \| undefined` |
| aria-valuenow | 否 | `number \| undefined` |
| aria-valuetext | 否 | `string \| undefined` |
| dangerouslySetInnerHTML | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |
| onCopy | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCopyCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCut | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCutCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPaste | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPasteCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEnd | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEndCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStart | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStartCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdate | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdateCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onFocus | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onFocusCapture | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlur | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlurCapture | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onChange | 否 | `import("react").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onChangeCapture | 否 | `import("react").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onBeforeInput | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onBeforeInputCapture | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onInput | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onInputCapture | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onReset | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onResetCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSubmit | 否 | `import("react").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onSubmitCapture | 否 | `import("react").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onInvalid | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onInvalidCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoad | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onError | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onErrorCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onKeyDown | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyDownCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPress | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPressCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUp | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUpCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onAbort | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAbortCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlay | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThrough | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThroughCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptied | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptiedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncrypted | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncryptedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEnded | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEndedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedData | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedDataCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadata | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadataCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStart | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStartCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPause | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPauseCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlay | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlaying | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgress | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgressCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeked | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeking | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalled | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalledCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspend | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspendCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdate | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdateCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaiting | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaitingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAuxClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onAuxClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenu | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenuCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDrag | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnd | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEndCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnter | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnterCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExit | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExitCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeave | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeaveCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOver | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOverCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStart | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStartCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDrop | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDropCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onMouseDown | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseDownCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseEnter | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseLeave | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMove | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMoveCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOut | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOutCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOver | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOverCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUp | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUpCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onSelect | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSelectCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancel | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancelCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEnd | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEndCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMove | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMoveCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStart | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStartCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onPointerDown | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerDownCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMove | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMoveCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUp | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUpCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancel | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancelCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerEnter | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerLeave | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOver | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOverCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOut | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOutCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCaptureCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCaptureCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onScroll | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollCapture | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEnd | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEndCapture | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onWheel | 否 | `import("react").WheelEventHandler<HTMLDivElement> \| undefined` |
| onWheelCapture | 否 | `import("react").WheelEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStart | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStartCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEnd | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEndCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIteration | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIterationCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onToggle | 否 | `import("react").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onBeforeToggle | 否 | `import("react").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancel | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancelCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEnd | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEndCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRun | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRunCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStart | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStartCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| subtitle | 否 | `import("react").ReactNode` |
| action | 否 | `import("react").ReactNode` |
| footer | 否 | `import("react").ReactNode` |
| variant | 否 | `"dashboard" \| "template" \| "custom" \| undefined` |
| as | 否 | `"article" \| "div" \| "section" \| "aside" \| undefined` |
| asChild | 否 | `boolean \| undefined` |
| gap | 否 | `"none" \| "sm" \| "md" \| undefined` |
| children | 否 | `import("react").ReactNode` |
| columns | 否 | `ColumnDef<RecordType>[] \| undefined` |
| data | 否 | `RecordType[] \| undefined` |
| getRowKey | 否 | `((row: RecordType, index: number) => string) \| undefined` |

---

Source: skills/forge-skill/references/blocks/region-distribution.md

# 地区分布卡

分类：图表与指标。结合地图与地区明细，查看客户或收入的地域分布。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：MapCard。

## 最小可用示例

```tsx
import { RegionDistribution } from "@/components/blocks/region-distribution";

export default function Example() {
  return (<RegionDistribution title="地区分布" highlights={["asia", "europe"]} regions={[{ name: "中国", countryCode: "CN", salesLabel: "340 笔", value: "¥17,678" }, { name: "英国", countryCode: "GB", salesLabel: "100 笔", value: "¥5,500" }]} />);
}
```

## RegionDistribution Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| className | 否 | `string \| undefined` |
| color | 否 | `import("@forge-ui-official/core").AccentColor \| undefined` |
| subtitle | 否 | `string \| undefined` |
| variant | 否 | `import("@forge-ui-official/core").MapVariant \| undefined` |
| highlights | 否 | `import("@forge-ui-official/core").MapContinent[] \| undefined` |
| onMenuClick | 否 | `(() => void) \| undefined` |
| width | 否 | `import("@forge-ui-official/core").CardWidth \| undefined` |
| regions | 否 | `(Omit<import("@forge-ui-official/core").MapRegion, "flag"> & { flag?: string; countryCode?: string; })[] \| undefined` |

---

Source: skills/forge-skill/references/blocks/register-form.md

# 注册

分类：认证。左图右表单的注册页，含第三方注册、邮箱与密码校验、协议勾选和成功反馈。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Checkbox、TextField、cn。

## 最小可用示例

```tsx
import { RegisterForm } from "@/components/blocks/register-form";

export default function Example() {
  return (<RegisterForm onSubmit={value => console.log(value.email)} onLogin={() => {}} />);
}
```

## RegisterForm Props

| Prop | 必填 | Type |
|---|---|---|
| productName | 否 | `string \| undefined` |
| image | 否 | `string \| undefined` |
| providers | 否 | `{ id: string; label: string; icon: string; }[] \| undefined` |
| onSubmit | 否 | `((value: RegisterValue) => void) \| undefined` |
| onProvider | 否 | `((providerId: string) => void) \| undefined` |
| onLogin | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/runtime-list.md

# 运行时管理

分类：AI 与智能体。自主智能体可用的执行引擎：类型、在线状态、版本与最后检测时间、连接地址，支持搜索、单个检查与探测本机运行时。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、DataTable、PageTitleToolbar、StatusBadge、TextField。

## 最小可用示例

```tsx
import { RuntimeList } from "@/components/blocks/runtime-list";

export default function Example() {
  return (<RuntimeList />);
}
```

## RuntimeList Props

| Prop | 必填 | Type |
|---|---|---|
| runtimes | 否 | `AgentRuntime[] \| undefined` |
| defaultRuntimeId | 否 | `string \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/savings-goals-table.md

# 储蓄目标表

分类：财务。资金目标的目标金额、存入进度与截止日期，支持多选和新建目标。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、DataTable、Modal、PlusIcon、ProgressBar、TextField、cn。

## 最小可用示例

```tsx
import { SavingsGoalsTable } from "@/components/blocks/savings-goals-table";

export default function Example() {
  return (<SavingsGoalsTable onCreate={goal => console.log(goal.title)} />);
}
```

## SavingsGoalsTable Props

| Prop | 必填 | Type |
|---|---|---|
| goals | 否 | `SavingsGoal[] \| undefined` |
| onCreate | 否 | `((goal: SavingsGoal) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/sellers-table.md

# 商家列表

分类：数据列表。展示店铺评分、营收与待结算金额的入驻商家管理表。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CellImageText、CellRating、CellText、DataTable、IconButton、Modal、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { SellersTable } from "@/components/blocks/sellers-table";

export default function Example() {
  return (<SellersTable onMessage={(seller, channel) => console.log(seller.store, channel)} />);
}
```

## SellersTable Props

| Prop | 必填 | Type |
|---|---|---|
| sellers | 否 | `SellerRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onExport | 否 | `((sellers: SellerRecord[]) => void) \| undefined` |
| onMessage | 否 | `((seller: SellerRecord, channel: "email" \| "chat") => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/settings-billing.md

# 账单与套餐

分类：设置。本期用量、付款方式、按月或按年对比的套餐卡片与历史账单下载。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CreditCard、Panel、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { SettingsBilling } from "@/components/blocks/settings-billing";

export default function Example() {
  return (<SettingsBilling onChangePlan={(plan, yearly) => console.log(plan, yearly)} />);
}
```

## SettingsBilling Props

| Prop | 必填 | Type |
|---|---|---|
| plans | 否 | `BillingPlan[] \| undefined` |
| currentPlan | 否 | `string \| undefined` |
| usage | 否 | `{ label: string; used: number; limit: number; unit: string; }[] \| undefined` |
| onChangePlan | 否 | `((planId: string, yearly: boolean) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/settings-members.md

# 成员与团队

分类：设置。席位与管理员概况、按角色筛选的成员表、行内改角色、批量移除与邀请成员。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CellImageText、DataTable、Modal、Panel、PlusIcon、ProgressBar、SelectOption、TabBar、TextField、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { SettingsMembers } from "@/components/blocks/settings-members";

export default function Example() {
  return (<SettingsMembers seats={10} onInvite={(email, role) => console.log(email, role)} />);
}
```

## SettingsMembers Props

| Prop | 必填 | Type |
|---|---|---|
| members | 否 | `WorkspaceMember[] \| undefined` |
| seats | 否 | `number \| undefined` |
| onInvite | 否 | `((email: string, role: MemberRole) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/settings-notifications.md

# 通知设置

分类：设置。按事件和渠道（站内、邮件、飞书）开关通知，配置邮件摘要与夜间免打扰。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、SelectOption、Toggle、cn。

## 最小可用示例

```tsx
import { SettingsNotifications } from "@/components/blocks/settings-notifications";

export default function Example() {
  return (<SettingsNotifications onSave={(rules, digest) => console.log(rules.length, digest)} />);
}
```

## SettingsNotifications Props

| Prop | 必填 | Type |
|---|---|---|
| rules | 否 | `NotificationRule[] \| undefined` |
| onSave | 否 | `((rules: NotificationRule[], digest: string) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/settings-profile.md

# 个人资料设置

分类：设置。头像上传、基本信息与地区语言，带校验和底部常驻的保存与撤销条。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、SelectOption、TextArea、TextField、cn。

## 最小可用示例

```tsx
import { SettingsProfile } from "@/components/blocks/settings-profile";

export default function Example() {
  return (<SettingsProfile onSave={value => console.log(value.name)} />);
}
```

## SettingsProfile Props

| Prop | 必填 | Type |
|---|---|---|
| value | 否 | `ProfileValue \| undefined` |
| avatar | 否 | `string \| undefined` |
| onSave | 否 | `((value: ProfileValue) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/settings-roles.md

# 角色与权限

分类：设置。左侧角色列表，右侧按模块分组的菜单权限勾选树，支持整组勾选与撤销保存。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Checkbox、Panel、PlusIcon、StatusBadge、cn。

## 最小可用示例

```tsx
import { SettingsRoles } from "@/components/blocks/settings-roles";

export default function Example() {
  return (<SettingsRoles onSave={role => console.log(role.permissions)} />);
}
```

## SettingsRoles Props

| Prop | 必填 | Type |
|---|---|---|
| tree | 否 | `PermissionNode[] \| undefined` |
| roles | 否 | `WorkspaceRole[] \| undefined` |
| onSave | 否 | `((role: WorkspaceRole) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/settings-security.md

# 安全设置

分类：设置。密码与强度提示、两步验证、单点登录、登录设备管理与 API 密钥。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Modal、StatusBadge、TextField、Toggle、cn。

## 最小可用示例

```tsx
import { SettingsSecurity } from "@/components/blocks/settings-security";

export default function Example() {
  return (<SettingsSecurity />);
}
```

## SettingsSecurity Props

| Prop | 必填 | Type |
|---|---|---|
| sessions | 否 | `LoginSession[] \| undefined` |
| apiKeys | 否 | `ApiKey[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/task-detail.md

# 任务详情

分类：详情页。任务基本信息、成员与附件，配合进度、描述、可勾选的检查清单和最近动态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、AvatarGroup、Button、Checkbox、IconButton、Panel、PlusIcon、ProgressBar、StatusBadge、TextField、cn。

## 最小可用示例

```tsx
import { TaskDetail } from "@/components/blocks/task-detail";

export default function Example() {
  return (<TaskDetail onChecklistChange={items => console.log(items.length)} />);
}
```

## TaskDetail Props

| Prop | 必填 | Type |
|---|---|---|
| task | 否 | `TaskDetailData \| undefined` |
| onChecklistChange | 否 | `((items: TaskChecklistItem[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/task-run-detail.md

# 任务执行详情

分类：AI 与智能体。自主智能体任务详情：状态与来源、概要和知识库授权、带时间的执行过程，以及按类型分组、可预览下载复制的结果产物。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ConfirmationDialog、Modal、PageTitleToolbar、StatusBadge。

## 最小可用示例

```tsx
import { TaskRunDetail } from "@/components/blocks/task-run-detail";

export default function Example() {
  return (<TaskRunDetail />);
}
```

## TaskRunDetail Props

| Prop | 必填 | Type |
|---|---|---|
| task | 否 | `TaskRunDetailData \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/transactions-table.md

# 交易流水

分类：财务。支出构成圆环、月度预算进度，配合按收支方向筛选与搜索的交易明细表。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ButtonGroup、CellTextSubtitle、DataTable、DonutChart、IconButton、Modal、Panel、ProgressBar、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { TransactionsTable } from "@/components/blocks/transactions-table";

export default function Example() {
  return (<TransactionsTable budget={80000} />);
}
```

## TransactionsTable Props

| Prop | 必填 | Type |
|---|---|---|
| transactions | 否 | `TransactionRecord[] \| undefined` |
| categories | 否 | `ExpenseCategory[] \| undefined` |
| budget | 否 | `number \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/trend-chart.md

# 趋势图表卡

分类：图表与指标。对比不同周期的业务走势，适用于收入、订单和流量分析。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ChartHeader、ChartMetricRow、GroupedBarChart、SmoothLineChart、Panel、cn。

## 最小可用示例

```tsx
import { TrendChart } from "@/components/blocks/trend-chart";

export default function Example() {
  return (<TrendChart title="订单趋势" periods={[{ label: "日", countChart: { series: [{ label: "订单", data: [12, 26, 18, 30] }], xAxisLabels: ["09:00", "12:00", "15:00", "18:00"] } }, { label: "周", countChart: { series: [{ label: "订单", data: [50, 80, 60, 100] }], xAxisLabels: ["周一", "周二", "周三", "周四"] } }]} />);
}
```

## TrendChart Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `import("react").ReactNode` |
| defaultChecked | 否 | `boolean \| undefined` |
| defaultValue | 否 | `string \| number \| readonly string[] \| undefined` |
| suppressContentEditableWarning | 否 | `boolean \| undefined` |
| suppressHydrationWarning | 否 | `boolean \| undefined` |
| accessKey | 否 | `string \| undefined` |
| autoCapitalize | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |
| autoFocus | 否 | `boolean \| undefined` |
| className | 否 | `string \| undefined` |
| contentEditable | 否 | `(boolean \| "true" \| "false") \| "inherit" \| "plaintext-only" \| undefined` |
| contextMenu | 否 | `string \| undefined` |
| dir | 否 | `string \| undefined` |
| draggable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| enterKeyHint | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |
| hidden | 否 | `boolean \| undefined` |
| id | 否 | `string \| undefined` |
| lang | 否 | `string \| undefined` |
| nonce | 否 | `string \| undefined` |
| slot | 否 | `string \| undefined` |
| spellCheck | 否 | `(boolean \| "true" \| "false") \| undefined` |
| style | 否 | `import("react").CSSProperties \| undefined` |
| tabIndex | 否 | `number \| undefined` |
| translate | 否 | `"yes" \| "no" \| undefined` |
| radioGroup | 否 | `string \| undefined` |
| role | 否 | `import("react").AriaRole \| undefined` |
| about | 否 | `string \| undefined` |
| content | 否 | `string \| undefined` |
| datatype | 否 | `string \| undefined` |
| inlist | 否 | `any` |
| prefix | 否 | `string \| undefined` |
| property | 否 | `string \| undefined` |
| rel | 否 | `string \| undefined` |
| resource | 否 | `string \| undefined` |
| rev | 否 | `string \| undefined` |
| typeof | 否 | `string \| undefined` |
| vocab | 否 | `string \| undefined` |
| autoCorrect | 否 | `string \| undefined` |
| autoSave | 否 | `string \| undefined` |
| color | 否 | `string \| undefined` |
| itemProp | 否 | `string \| undefined` |
| itemScope | 否 | `boolean \| undefined` |
| itemType | 否 | `string \| undefined` |
| itemID | 否 | `string \| undefined` |
| itemRef | 否 | `string \| undefined` |
| results | 否 | `number \| undefined` |
| security | 否 | `string \| undefined` |
| unselectable | 否 | `"off" \| "on" \| undefined` |
| popover | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |
| popoverTargetAction | 否 | `"toggle" \| "show" \| "hide" \| undefined` |
| popoverTarget | 否 | `string \| undefined` |
| inert | 否 | `boolean \| undefined` |
| inputMode | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` |
| is | 否 | `string \| undefined` |
| exportparts | 否 | `string \| undefined` |
| part | 否 | `string \| undefined` |
| aria-activedescendant | 否 | `string \| undefined` |
| aria-atomic | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-autocomplete | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` |
| aria-braillelabel | 否 | `string \| undefined` |
| aria-brailleroledescription | 否 | `string \| undefined` |
| aria-busy | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-checked | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-colcount | 否 | `number \| undefined` |
| aria-colindex | 否 | `number \| undefined` |
| aria-colindextext | 否 | `string \| undefined` |
| aria-colspan | 否 | `number \| undefined` |
| aria-controls | 否 | `string \| undefined` |
| aria-current | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` |
| aria-describedby | 否 | `string \| undefined` |
| aria-description | 否 | `string \| undefined` |
| aria-details | 否 | `string \| undefined` |
| aria-disabled | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-dropeffect | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` |
| aria-errormessage | 否 | `string \| undefined` |
| aria-expanded | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-flowto | 否 | `string \| undefined` |
| aria-grabbed | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-haspopup | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` |
| aria-hidden | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-invalid | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` |
| aria-keyshortcuts | 否 | `string \| undefined` |
| aria-label | 否 | `string \| undefined` |
| aria-labelledby | 否 | `string \| undefined` |
| aria-level | 否 | `number \| undefined` |
| aria-live | 否 | `"off" \| "assertive" \| "polite" \| undefined` |
| aria-modal | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiline | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiselectable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-orientation | 否 | `"horizontal" \| "vertical" \| undefined` |
| aria-owns | 否 | `string \| undefined` |
| aria-placeholder | 否 | `string \| undefined` |
| aria-posinset | 否 | `number \| undefined` |
| aria-pressed | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-readonly | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-relevant | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` |
| aria-required | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-roledescription | 否 | `string \| undefined` |
| aria-rowcount | 否 | `number \| undefined` |
| aria-rowindex | 否 | `number \| undefined` |
| aria-rowindextext | 否 | `string \| undefined` |
| aria-rowspan | 否 | `number \| undefined` |
| aria-selected | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-setsize | 否 | `number \| undefined` |
| aria-sort | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` |
| aria-valuemax | 否 | `number \| undefined` |
| aria-valuemin | 否 | `number \| undefined` |
| aria-valuenow | 否 | `number \| undefined` |
| aria-valuetext | 否 | `string \| undefined` |
| dangerouslySetInnerHTML | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |
| onCopy | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCopyCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCut | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCutCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPaste | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPasteCapture | 否 | `import("react").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEnd | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEndCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStart | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStartCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdate | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdateCapture | 否 | `import("react").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onFocus | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onFocusCapture | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlur | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlurCapture | 否 | `import("react").FocusEventHandler<HTMLDivElement> \| undefined` |
| onChange | 否 | `import("react").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onChangeCapture | 否 | `import("react").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onBeforeInput | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onBeforeInputCapture | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onInput | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onInputCapture | 否 | `import("react").InputEventHandler<HTMLDivElement> \| undefined` |
| onReset | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onResetCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSubmit | 否 | `import("react").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onSubmitCapture | 否 | `import("react").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onInvalid | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onInvalidCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoad | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onError | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onErrorCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onKeyDown | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyDownCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPress | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPressCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUp | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUpCapture | 否 | `import("react").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onAbort | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAbortCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlay | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThrough | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThroughCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptied | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptiedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncrypted | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncryptedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEnded | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEndedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedData | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedDataCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadata | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadataCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStart | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStartCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPause | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPauseCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlay | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlaying | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgress | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgressCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeked | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekedCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeking | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalled | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalledCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspend | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspendCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdate | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdateCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChange | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChangeCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaiting | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaitingCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAuxClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onAuxClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenu | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenuCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClick | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClickCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDrag | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnd | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEndCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnter | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnterCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExit | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExitCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeave | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeaveCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOver | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOverCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStart | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStartCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDrop | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onDropCapture | 否 | `import("react").DragEventHandler<HTMLDivElement> \| undefined` |
| onMouseDown | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseDownCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseEnter | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseLeave | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMove | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMoveCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOut | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOutCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOver | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOverCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUp | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUpCapture | 否 | `import("react").MouseEventHandler<HTMLDivElement> \| undefined` |
| onSelect | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSelectCapture | 否 | `import("react").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancel | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancelCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEnd | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEndCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMove | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMoveCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStart | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStartCapture | 否 | `import("react").TouchEventHandler<HTMLDivElement> \| undefined` |
| onPointerDown | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerDownCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMove | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMoveCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUp | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUpCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancel | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancelCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerEnter | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerLeave | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOver | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOverCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOut | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOutCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCaptureCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCaptureCapture | 否 | `import("react").PointerEventHandler<HTMLDivElement> \| undefined` |
| onScroll | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollCapture | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEnd | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEndCapture | 否 | `import("react").UIEventHandler<HTMLDivElement> \| undefined` |
| onWheel | 否 | `import("react").WheelEventHandler<HTMLDivElement> \| undefined` |
| onWheelCapture | 否 | `import("react").WheelEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStart | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStartCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEnd | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEndCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIteration | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIterationCapture | 否 | `import("react").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onToggle | 否 | `import("react").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onBeforeToggle | 否 | `import("react").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancel | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancelCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEnd | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEndCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRun | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRunCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStart | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStartCapture | 否 | `import("react").TransitionEventHandler<HTMLDivElement> \| undefined` |
| subtitle | 否 | `import("react").ReactNode` |
| action | 否 | `import("react").ReactNode` |
| footer | 否 | `import("react").ReactNode` |
| as | 否 | `"article" \| "div" \| "section" \| "aside" \| undefined` |
| asChild | 否 | `boolean \| undefined` |
| gap | 否 | `"none" \| "sm" \| "md" \| undefined` |
| children | 否 | `import("react").ReactNode` |
| chart | 否 | `{ data: import("@forge-ui-official/core").GroupedBarPoint[]; series: import("@forge-ui-official/core").ChartMetricSeries[]; activeIndex?: number; tooltipItems?: import("@forge-ui-official/core").GroupedBarTooltipItem[]; yAxisLabels?: string[]; heightClass?: string; } \| undefined` |
| periods | 否 | `TrendPeriod[] \| undefined` |
| variant | 否 | `"plain" \| "template" \| undefined` |
| activePeriod | 否 | `string \| undefined` |
| onPeriodChange | 否 | `((period: string) => void) \| undefined` |
| countChart | 否 | `SmoothLineChartProps \| undefined` |

---

Source: skills/forge-skill/references/blocks/wealth-overview.md

# 资产概览

分类：看板首屏。总资产、现金与待收款趋势卡，配合企业卡与资金目标完成度。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CreditCard、LineChartStatCard、Panel、PlusIcon、ProgressBar、cn。

## 最小可用示例

```tsx
import { WealthOverview } from "@/components/blocks/wealth-overview";

export default function Example() {
  return (<WealthOverview onAddCard={() => {}} />);
}
```

## WealthOverview Props

| Prop | 必填 | Type |
|---|---|---|
| metrics | 否 | `WealthMetric[] \| undefined` |
| cards | 否 | `({ locale?: "zh" \| "en"; cardNumberLabel?: string; holderNameLabel?: string; cardNumber?: string; holderName?: string; expiry?: string; theme?: import("@forge-ui-official/core").FinancialTheme; variant?: import("@forge-ui-official/core").FinancialVariant; width?: import("@forge-ui-official/core").CardWidth; className?: string; } & { id: string; })[] \| undefined` |
| goals | 否 | `WealthGoal[] \| undefined` |
| onAddCard | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blocks/workflow-builder.md

# 工作流编辑器

分类：AI 与智能体。高级工作流智能体的编排页：点阵画布上可拖动、展开收起、直接编辑表单的节点与分支连线，带撤销重做、添加组件、一键美化、问题检查、调试运行与发布。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、CellText、StatusBadge、TabBar。

## 最小可用示例

```tsx
import { WorkflowBuilder } from "@/components/blocks/workflow-builder";

export default function Example() {
  return (<WorkflowBuilder />);
}
```

## WorkflowBuilder Props

| Prop | 必填 | Type |
|---|---|---|
| nodes | 否 | `WorkflowNode[] \| undefined` |
| edges | 否 | `WorkflowEdge[] \| undefined` |
| className | 否 | `string \| undefined` |

---

Source: skills/forge-skill/references/blueprints/approval.md

# Blueprint: Approval Workflow

Use for approvals, reviews, publishing workflows, requests, compliance checks, document approval, expense approval, and change control.

## System Brief Defaults

```yaml
archetype: approval
primary_users:
  - role: Requester
    jobs: [create request, track status, respond to changes]
  - role: Reviewer
    jobs: [review queue, approve, reject, request changes]
  - role: Admin
    jobs: [configure rules, monitor audit, manage permissions]
nav_groups:
  - label: Workbench
    modules: [my queue, SLA risk, recent decisions]
  - label: Requests
    modules: [all requests, drafts, submitted]
  - label: Review
    modules: [approval queue, escalations]
  - label: Governance
    modules: [rules, roles, audit]
modules:
  - name: Requests
    type: core
    primary_object: Request
  - name: Approval Queue
    type: core
    primary_object: ApprovalTask
  - name: Rules
    type: governance
    primary_object: ApprovalRule
  - name: Audit
    type: governance
    primary_object: AuditEvent
```

## State Models

Request states:

```text
draft -> submitted -> reviewing -> approved
reviewing -> rejected
reviewing -> changes_requested -> submitted
approved -> published
```

Approval task states:

```text
pending -> claimed -> approved
pending | claimed -> rejected
claimed -> changes_requested
pending -> escalated
```

## Core Routes

```text
/workbench
/requests
/requests/new
/requests/[id]
/requests/[id]/edit
/approval-queue
/approval-queue/[id]
/rules
/rules/new
/settings/roles
/settings/audit
```

## Forge Mapping

- Queue: `FullWidthTable`, `Toolbar`, `StatusBadge`, `Pagination`
- Detail/inspector: `DescriptionItem`, `TabBar`, `ListGroup`, `HistoryGrouped`
- Request creation: `Stepper`, `TextField`, `TextArea`, `SelectOption`, `FileUpload`
- Rule configuration: `DataTable`, `Toggle`, `SelectOption`
- Decisions: controlled `ConfirmationDialog` (or inline mode inside an existing shell) for approve/reject/request changes when impact matters

## Avoid These Mistakes

- Do not treat approval as normal CRUD only; it needs queue ownership, state transitions, and audit.
- Do not allow approve/reject without showing impact and required comments when the domain requires it.
- Do not omit rules and audit in admin-facing approval systems.

---

Source: skills/forge-skill/references/blueprints/crm.md

# Blueprint: CRM And Pipeline

Use for CRM, sales pipeline, contacts, companies, deals, activities, account management, and forecasts.

## System Brief Defaults

```yaml
archetype: crm
primary_users:
  - role: Sales rep
    jobs: [manage leads, update deals, log activities]
  - role: Sales manager
    jobs: [review pipeline, forecast revenue, coach reps]
  - role: Admin
    jobs: [configure pipeline, fields, permissions]
nav_groups:
  - label: Workbench
    modules: [pipeline health, my activities, at-risk deals]
  - label: Sales
    modules: [deals, contacts, companies]
  - label: Activity
    modules: [tasks, notes, calendar]
  - label: Governance
    modules: [settings, audit]
modules:
  - name: Deals
    type: core
    primary_object: Deal
  - name: Contacts
    type: core
    primary_object: Contact
  - name: Companies
    type: support
    primary_object: Company
  - name: Activities
    type: support
    primary_object: Activity
```

## State Models

Deal states:

```text
lead -> qualified -> proposal -> negotiation -> won
qualified | proposal | negotiation -> lost
won -> archived
```

Activity states:

```text
scheduled -> completed
scheduled -> overdue
scheduled -> cancelled
```

## Core Routes

```text
/workbench
/deals
/deals/new
/deals/[id]
/contacts
/contacts/[id]
/companies
/companies/[id]
/activities
/settings/pipeline
/settings/audit
```

## Forge Mapping

- Pipeline: card/kanban style with `TaskCard`/business cards, filters, and status columns
- Lists: `FullWidthTable`, `Toolbar`, `StatusBadge`, `Pagination`
- Detail: `TabBar`, `DescriptionItem`, `ListGroup`, `HistoryGrouped`, related activity table
- Calendar/tasks: calendar components, `ListGroup`, `Datepicker`

## Avoid These Mistakes

- Do not show deals without stage, value, owner, next activity, and close date.
- Do not isolate contacts from companies and deals.
- Do not make forecast metrics unclickable; they should drill into filtered deals.

---

Source: skills/forge-skill/references/blueprints/data-ops.md

# Blueprint: Data And Reporting Operations

Use for reporting consoles, datasets, imports, scheduled exports, dashboards, data quality, and background jobs.

## System Brief Defaults

```yaml
archetype: data-ops
primary_users:
  - role: Analyst
    jobs: [build reports, inspect data quality, export results]
  - role: Operator
    jobs: [monitor imports, retry failed jobs, publish datasets]
  - role: Admin
    jobs: [manage sources, permissions, schedules]
nav_groups:
  - label: Workbench
    modules: [freshness, failed jobs, popular reports]
  - label: Data
    modules: [datasets, sources, import jobs]
  - label: Reporting
    modules: [reports, templates, exports]
  - label: Governance
    modules: [permissions, audit, schedules]
modules:
  - name: Datasets
    type: core
    primary_object: Dataset
  - name: Reports
    type: core
    primary_object: Report
  - name: Jobs
    type: support
    primary_object: Job
  - name: Exports
    type: support
    primary_object: Export
```

## State Models

Job states:

```text
queued -> running -> success
running -> failed
failed -> retrying -> running
success -> archived
```

Report states:

```text
draft -> scheduled -> published
published -> archived
```

## Core Routes

```text
/workbench
/datasets
/datasets/new
/datasets/[id]
/reports
/reports/new
/reports/[id]
/jobs
/jobs/[id]
/exports
/settings/schedules
/settings/audit
```

## Forge Mapping

- Workbench: `StatCard`, charts, job warning `ListGroup`
- Dataset/report lists: `FullWidthTable`, `Toolbar`, `StatusBadge`
- Job center: `DataTable`, `ProgressBar`, `StatusBadge`, retry actions
- Import wizard: `Stepper`, `FileUpload`, preview `DataTable`
- Report detail: chart cards, detail table, export action, `HistoryGrouped`

## Avoid These Mistakes

- Do not make reports only charts; include freshness, source, filters, detail rows, and export behavior.
- Do not hide failed jobs in transient toasts; job status needs a durable surface.
- Do not skip import validation and preview for uploaded data.

---

Source: skills/forge-skill/references/blueprints/ecommerce.md

# Blueprint: Commerce Operations

Use for ecommerce, retail operations, marketplace operations, order management, inventory, sellers, refunds, and product catalogs.

## System Brief Defaults

```yaml
archetype: commerce-ops
primary_users:
  - role: Operator
    jobs: [process orders, handle refunds, review stock alerts]
  - role: Merchandiser
    jobs: [manage products, categories, pricing]
  - role: Finance reviewer
    jobs: [review invoices, payments, refunds]
nav_groups:
  - label: Workbench
    modules: [overview, exception queue]
  - label: Commerce
    modules: [products, orders, customers, inventory]
  - label: Finance
    modules: [invoices, payments, refunds]
  - label: Governance
    modules: [settings, audit, integrations]
modules:
  - name: Orders
    type: core
    primary_object: Order
  - name: Products
    type: core
    primary_object: Product
  - name: Customers
    type: support
    primary_object: Customer
  - name: Invoices
    type: support
    primary_object: Invoice
  - name: Audit
    type: governance
    primary_object: AuditEvent
```

## State Models

Order states:

```text
draft -> pending_payment -> paid -> fulfillment -> shipped -> delivered
pending_payment -> cancelled
paid -> refunded
fulfillment -> exception
exception -> fulfillment | cancelled
```

Invoice states:

```text
draft -> sent -> paid
sent -> overdue
draft | sent -> void
```

Product states:

```text
draft -> active -> archived
active -> out_of_stock
out_of_stock -> active
```

## Core Routes

```text
/overview
/orders
/orders/new
/orders/[id]
/orders/[id]/edit
/orders/[id]/refund
/products
/products/new
/products/[id]
/customers
/customers/[id]
/invoices
/settings/audit
```

## Forge Mapping

- Shell: `AppLayout`
- Workbench: `StatCard`, chart cards, exception `ListGroup`
- Orders/products/customers lists: `FullWidthTable`, `Toolbar`, `StatusBadge`, `KebabMenu`, `Pagination`
- Detail: `DescriptionItem`, `TabBar`, `ListGroup`, `HistoryGrouped`, embedded `DataTable`
- Forms: `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`, `MediaUpload`
- Dangerous actions: `ConfirmationDialog`

## Avoid These Mistakes

- Do not model orders as `active/inactive`.
- Do not give refunded, cancelled, and shipped orders the same row actions.
- Do not make the dashboard end at metrics; every exception should link to an order/customer/product queue.
- Do not hide invoices/refunds if the scope includes operations or finance.

---

Source: skills/forge-skill/references/blueprints/files.md

# Blueprint: File Operations

Use for file managers, document repositories, media libraries, attachments, versions, shares, permissions, and recycle bins.

## System Brief Defaults

```yaml
archetype: files
primary_users:
  - role: Contributor
    jobs: [upload, organize, share files]
  - role: Reviewer
    jobs: [preview, approve, comment]
  - role: Admin
    jobs: [manage permissions, retention, audit]
nav_groups:
  - label: Workbench
    modules: [recent files, failed uploads, shared with me]
  - label: Library
    modules: [files, folders, tags, versions]
  - label: Sharing
    modules: [shared links, permissions]
  - label: Governance
    modules: [retention, audit, recycle bin]
modules:
  - name: Files
    type: core
    primary_object: File
  - name: Folders
    type: core
    primary_object: Folder
  - name: Shares
    type: support
    primary_object: Share
  - name: Audit
    type: governance
    primary_object: AuditEvent
```

## State Models

File states:

```text
uploading -> uploaded
uploading -> failed
uploaded -> archived
uploaded -> deleted
deleted -> uploaded (restore)
archived -> uploaded (unarchive)
failed -> uploading (retry)
```

## Core Routes

```text
/files
/files/[id]
/folders/[id]
/shared
/uploads
/recycle-bin
/settings/permissions
/settings/audit
```

## Forge Mapping

- File list: `FullWidthTable`, `Toolbar`, `FileTypeIcon`, `KebabMenu`
- Grid: `FileCard`
- Upload: `FileUpload`, progress state, retry action
- Detail: `DescriptionItem`, `TabBar`, `HistoryGrouped`, related versions table
- Permissions: `ListGroup`, `UserCard`, `AvatarGroup`, `ConfirmationDialog`

## Avoid These Mistakes

- Do not build only a gallery; file systems need permissions, versions, and delete/restore.
- Do not omit failed upload and retry states.
- Do not make delete irreversible unless the product explicitly requires it.

## 实施边界

这些状态/路由是业务蓝图建议，不代表已有后端。实施前确认每条迁移的权限、责任人、失败/重试、并发与审计；support 还需确认 SLA、等待客户与重开计时口径。仅执行已授权范围。

---

Source: skills/forge-skill/references/blueprints/finance.md

# Blueprint: Finance Operations

Use for invoices, payments, refunds, subscriptions, payouts, disputes, taxes, and financial reporting.

## System Brief Defaults

```yaml
archetype: finance
primary_users:
  - role: Finance operator
    jobs: [review invoices, reconcile payments, handle refunds]
  - role: Manager
    jobs: [monitor overdue risk, approve voids, export reports]
  - role: Admin
    jobs: [manage tax, integrations, permissions]
nav_groups:
  - label: Workbench
    modules: [cash position, overdue, exceptions]
  - label: Finance
    modules: [invoices, payments, refunds, subscriptions]
  - label: Reporting
    modules: [exports, statements]
  - label: Governance
    modules: [tax settings, audit, integrations]
modules:
  - name: Invoices
    type: core
    primary_object: Invoice
  - name: Payments
    type: core
    primary_object: Payment
  - name: Refunds
    type: support
    primary_object: Refund
  - name: Exports
    type: support
    primary_object: Export
```

## State Models

Invoice states:

```text
draft -> sent -> paid
sent -> overdue
draft | sent -> void
paid -> refunded
```

Payment states:

```text
pending -> succeeded
pending -> failed
succeeded -> disputed
succeeded -> refunded
```

## Core Routes

```text
/workbench
/invoices
/invoices/new
/invoices/[id]
/payments
/payments/[id]
/refunds
/exports
/settings/tax
/settings/audit
```

## Forge Mapping

- Lists: `FullWidthTable`, `Toolbar`, `StatusBadge`, `Pagination`
- Invoice detail: `DescriptionItem`, line-item `DataTable`, `Button`, `HistoryGrouped`
- Export/job surfaces: `DataTable`, `ProgressBar`, `StatusBadge`
- Settings: `ListGroup`, `Toggle`, `SelectOption`, `TextField`
- Destructive finance actions: `ConfirmationDialog`

## Avoid These Mistakes

- Do not treat paid, overdue, void, and refunded invoices the same.
- Do not omit audit history for financial state changes.
- Do not hide export/reconciliation jobs as temporary notifications.

---

Source: skills/forge-skill/references/blueprints/governance.md

# Blueprint: Governance And Settings

Use for settings, users, roles, permissions, audit logs, integrations, API keys, webhooks, notifications, and system rules.

## System Brief Defaults

```yaml
archetype: governance
primary_users:
  - role: Admin
    jobs: [configure system, manage users, review audit]
  - role: Security reviewer
    jobs: [inspect permissions, rotate keys, investigate events]
nav_groups:
  - label: Settings
    modules: [general, team, roles, notifications]
  - label: Integrations
    modules: [connected apps, API keys, webhooks]
  - label: Governance
    modules: [audit, policies, danger zone]
modules:
  - name: Team
    type: core
    primary_object: User
  - name: Roles
    type: core
    primary_object: Role
  - name: Integrations
    type: support
    primary_object: Integration
  - name: Audit
    type: governance
    primary_object: AuditEvent
```

## State Models

User states:

```text
invited -> active
active -> suspended
suspended -> active
active | suspended -> deactivated
```

API key states:

```text
active -> rotated
active | rotated -> revoked
```

Integration states:

```text
disconnected -> connected
connected -> failing
failing -> connected
connected -> disconnected
```

## Core Routes

```text
/settings
/settings/team
/settings/roles
/settings/integrations
/settings/api-keys
/settings/webhooks
/settings/notifications
/settings/audit
/settings/danger
```

## Forge Mapping

- Settings groups: `ListGroup`, `TabBar`, `ButtonGroup`
- Team: `UserCard`, `AvatarGroup`, `FullWidthTable`, `StatusBadge`
- Roles/rules: `DataTable`, `Toggle`, `SelectOption`
- Audit: `HistoryGrouped`, `Toolbar`, filters
- Danger actions: `ConfirmationDialog`

## Avoid These Mistakes

- Do not put dangerous actions next to normal save buttons.
- Do not expose API key values after creation unless the product explicitly supports it.
- Do not omit actor, action, object, time, and result from audit events.

---

Source: skills/forge-skill/references/blueprints/project-ops.md

# Blueprint: Project Operations

Use for project management, client delivery, agency operations, internal work management, tasks, files, members, milestones, and invoices.

## System Brief Defaults

```yaml
archetype: project-ops
primary_users:
  - role: Project manager
    jobs: [track health, assign tasks, manage blockers]
  - role: Contributor
    jobs: [complete tasks, upload files, comment on work]
  - role: Client or finance reviewer
    jobs: [review deliverables, approve invoices]
nav_groups:
  - label: Workbench
    modules: [overview, my work, blockers]
  - label: Delivery
    modules: [projects, tasks, milestones, files]
  - label: People
    modules: [clients, members]
  - label: Finance
    modules: [invoices]
  - label: Governance
    modules: [settings, audit]
modules:
  - name: Projects
    type: core
    primary_object: Project
  - name: Tasks
    type: core
    primary_object: Task
  - name: Files
    type: support
    primary_object: File
  - name: Members
    type: support
    primary_object: Member
  - name: Invoices
    type: support
    primary_object: Invoice
```

## State Models

Project states:

```text
planning -> active -> at_risk -> completed
active -> completed
at_risk -> active
at_risk -> completed
active -> paused
paused -> active
active | at_risk -> archived
```

Task states:

```text
todo -> in_progress -> review -> done
in_progress -> blocked
blocked -> in_progress
review -> changes_requested -> in_progress
```

## Core Routes

```text
/overview
/projects
/projects/new
/projects/[id]
/projects/[id]/edit
/projects/[id]/tasks
/projects/[id]/files
/projects/[id]/members
/tasks
/members
/files
/invoices
/settings/audit
```

## Forge Mapping

- Closest templates: `/templates/project-template/{overview,projects,members,files,invoices,clients}`; task list `/templates/task-board`, detail `/templates/project-template/tasks/[id]`
- Shell: `AppLayout`
- Project/task lists: `FullWidthTable`, `Toolbar`, `StatusBadge`, `KebabMenu`, `Pagination`
- Project detail: `TabBar`, `DescriptionItem`, related `DataTable`, `HistoryGrouped`
- Cards or kanban: `ProjectCard`, `TaskCard`, `ProgressCard`, `FilterGroup`
- Files: `FileCard`, `FileUpload`, `FileTypeIcon`
- Members: `UserCard`, `AvatarGroup`

## Avoid These Mistakes

- Do not make project detail a plain field card; include tasks, files, members, invoices, and activity.
- Do not show tasks without assignee, due date, priority, status, and blocker handling.
- Do not make dashboard shortcuts dead cards; they should link to overdue tasks, blockers, or project detail.

## 实施边界

这些状态/路由是业务蓝图建议，不代表已有后端。实施前确认每条迁移的权限、责任人、失败/重试、并发与审计；support 还需确认 SLA、等待客户与重开计时口径。仅执行已授权范围。

---

Source: skills/forge-skill/references/blueprints/support.md

# Blueprint: Support And Ticketing

Use for customer support, ticket queues, SLA handling, inboxes, knowledge base, and agent operations.

## System Brief Defaults

```yaml
archetype: support
primary_users:
  - role: Support agent
    jobs: [triage tickets, reply, assign, resolve]
  - role: Support lead
    jobs: [monitor SLA, balance workload, audit quality]
  - role: Admin
    jobs: [configure channels, macros, permissions]
nav_groups:
  - label: Workbench
    modules: [inbox, SLA risk, unassigned]
  - label: Support
    modules: [tickets, customers, knowledge base]
  - label: Team
    modules: [agents, workload]
  - label: Governance
    modules: [settings, audit, automations]
modules:
  - name: Tickets
    type: core
    primary_object: Ticket
  - name: Customers
    type: support
    primary_object: Customer
  - name: Knowledge Base
    type: support
    primary_object: Article
  - name: Automations
    type: governance
    primary_object: Rule
```

## State Models

Ticket states:

```text
open -> pending -> resolved -> closed
open -> assigned -> pending
pending -> waiting_customer
closed -> reopened
waiting_customer -> assigned | pending
reopened -> assigned | pending
```

## Core Routes

```text
/inbox
/tickets
/tickets/[id]
/customers
/customers/[id]
/knowledge
/knowledge/[id]/edit
/team/agents
/settings/automations
/settings/audit
```

## Forge Mapping

- Inbox: master-detail with `ListGroup` or `DataTable` plus detail panel
- Conversation: `ContactItem`, `ChatBubble`, `ChatInputBar`
- Ticket fields: `DescriptionItem`, `StatusBadge`, `TabBar`, `HistoryGrouped`
- Team workload: `StatCard`, `DataTable`, `AvatarGroup`
- Automations: `DataTable`, `Toggle`, `SelectOption`, `ConfirmationDialog`

## Avoid These Mistakes

- Do not build support as a static dashboard only; agents need an inbox and reply flow.
- Do not omit customer context next to ticket detail.
- Do not use the same actions for closed, pending, and reopened tickets.

## 实施边界

这些状态/路由是业务蓝图建议，不代表已有后端。实施前确认每条迁移的权限、责任人、失败/重试、并发与审计；support 还需确认 SLA、等待客户与重开计时口径。仅执行已授权范围。

---

Source: skills/forge-skill/references/cases-index.md

# 案例索引

当前仓库案例由 src/app/cases/**/page.tsx 提供；运行 node skills/forge-skill/scripts/list.mjs cases 枚举真实页面，使用 get-case.mjs 获取对应源码。组件 API 以同版本生成目录为准，案例用于组合与交互对照。

不依赖兄弟仓 metadata/registry；没有本地源码时只读回退 forge-ui/forge。案例、模板和发布包可能不同步，必须记录版本与证据，不能只凭页面标题猜测能力。

---

Source: skills/forge-skill/references/component-content-contracts.md

# 组件内容与布局契约

提炼自已采纳 component-content-layout-policy、description-item-layout-contract。推荐契约不等于所有版本已实现。

- 先计算父容器实际可用宽，再预留 lead、操作和间距，正文 FLEX 取得 max(0,可用宽−lead−操作−间距)。min-w-0 只允许收缩，不自动解决断行。
- 文本和 ReactNode 都需考虑空值、换行、长不可分标识；不固定说明/错误高度。身份信息必须可完整获取；次要信息截断需可恢复。
- DescriptionItem/ListItemLeadSlot 的参考预算：默认根字号16px时图片44px、circle icon lg48px（可覆盖）、slot gap8px、label-content gap4px、文字行高20px、尾操作 HUG 不收缩且 gap8px。来源为对应组件源码与已采纳契约，消费项目字体/覆盖需另测。
- 高度 HUG 内容，不把176px/320px等样本当全站最小宽。信息不足时重排或局部滚动，不能靠 overflow-hidden 隐藏操作。
- 表格身份列、数字对齐、剩余宽度归属明确；不要把剩余宽强塞最后一列掩盖空隙。图表区分标题、单位、图例和绘图区。
- 复杂图形标外包络/keep-out、安全区域；数量/内容支持域未知记 FORGE-GAP。Calendar、分页等输入边界、路由与数据归一仍由宿主负责，不把异常现状当规范。

本轮未做浏览器内容极限/字体/读屏器验证；按 [审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md) 分开记录源码与实测。

## Dialog / DataTable 解剖方法

提炼自 forge PR #16 的 component-anatomy.md（来源提交 `1175d3cbe8795f5f7bb198479f6d7f9771884794`），只保留可复用契约，不复制历史自测记录、静态成片或待办清单。

- 区分 DialogSurface 外壳、ConfirmationDialog 内容布局与 Modal 内层，不能因共用外壳就假设 padding、gap、标题行高相同。记录实际 variant/layout 和源码版本。
- 尺寸图每个标注对应一条源码 Token / class / 公式；Tailwind 间距基准 0.25rem，只有根字号 16px 时 p-6 才是 24px。`outline` + 负 outline-offset 不增加盒模型尺寸，不能当 border 加进预算。
- ConfirmationDialog 的默认 spread 是剩余宽 justify-between，而 right 布局是显式按钮 gap；标题/说明一行时的参考高度不是固定组件高度。视口上限和滚动应按实际 DialogSurface 样式验证，窄屏必须仍能关闭/提交。
- DataTable 外壳 w-full 与列的 min-width 预算不同。示例勾选/身份/普通/操作列预算 56+240+128+88=512px 只属于那套列组合，不可写成所有表的固定宽。FullWidthTable 也不继承 DataTable 的表头 gap。
- 分开核对表头/页脚 padding、普通单元格 padding、勾选单元格 padding，以及单元格助手的高度。行高由最高单元格决定：max(勾选控件+上下padding，内容+上下padding)，不是简单套助手高度。
- 同时标明固定宽、最大宽和内容溢出包络；控件落进 padding 与越出列框是两种问题。排序、分页和勾选的命中区单独记录；不要用 overflow-hidden 隐藏不可达操作。
- 交付源码映射表、尺寸图与运行截图三类证据，静态 HTML/PNG 不能证明真实 Dialog 焦点恢复、表格排序/分页或 375px 操作可达性。读安装版真实声明，CellText 内容用 children，不猜 text prop。

---

Source: skills/forge-skill/references/component-recommended-standard.md

# 组件组合默认推荐标准


## 如何选择与分配空间

|家族|推荐结构与伸缩|状态/溢出规则|消费者责任|
|---|---|---|---|
|按钮、图标入口、链接|文字HUG；图标槽和主要操作不收缩；采用既有尺寸档，不自行统一sm带图标高差|动作文字完整优先，窄处换行或移动操作组；禁用/处理中/结果以现有API呈现|有意义名称；真正结果由业务确认，不把成功外观当请求成功|
|字段与选择器|标签/说明/错误HUG，输入FILL且min-width:0；长字段整行|标签错误随内容增高；保留用户输入；长选项换行或提供可获取全文方式|唯一标识、校验/提交范围、受控回写；不承诺现有控件自动处理所有长值|
|卡片、列表行、描述项|标题/正文FLEX，尾操作HUG；外层padding只归卡片，组间gap归页面|正文允许断行；截断只用于次要可恢复信息；身份字段不可只剩省略号|确定正文与次要信息、全文入口；不一律加卡片或阴影|
|表格、关联明细|身份列保留识别能力，操作列HUG，其他列按内容预算|宽表局部横滚；加载、无数据、无筛选结果、失败分别呈现|排序筛选选择作用域、分页变化后的选择与回退|
|导航、页签、分页|当前对象与选中位置明确；稳定入口不随内容挤没|长名称可断行/收纳，导航溢出在所属区域滚动；非法页码由宿主归一|路由、权限、当前项、数据缩减后回退；不把CSS表现当输入域规范|
|弹窗、抽屉、菜单|独立标题/内容/操作；关闭控件不收缩；先给整层可用高度预算|正常内容区单滚；头尾超预算整层单滚；宽内容局部横滚；Escape只处理活动最上层|业务未保存保护和受控open回写；外点不抢新目标焦点。现有实现支持范围需按安装版本核对，不由本规则保证|
|图表、进度、统计|标题/单位/图例与图形分区；图形FILL可用空间|保留单位、无值与错误差异；不能仅用颜色说明状态|数据域、精度、异常值及业务阈值；图纸不验收数学/业务正确性|
|上传、文件、头像|预览/元信息/动作分区；文件名可完整获取|选择/上传中/失败/重试按已提供API组织；静态预览不证明上传成功|网络、格式大小限制、安全与取消策略另定义|
|聊天、流程、Folder等复杂组合|按对象身份、状态、主操作、辅助内容拆槽；不从装饰外延推内容宽|绘制外包络/keep-out；支持域内保证入口可达，超量先采用清单替代复杂装饰|异步归属、删除后焦点、数量上限需业务明确；未确认支持域标TBD|

## 所有组件的共同决策

1. 尺寸引用图册对应变量，数值区分源码/实测/推导/推荐；不将截图比例作为参数。
2. 宽度按父容器可用空间计算；HUG操作先预留，FLEX剩余不允许负值。无法满足内容时先重排，再局部滚动，最后对次要信息采用可恢复截断。
3. 默认不固定文字/错误/说明高度，不通过overflow-hidden掩盖不可达操作。布局变化保留阅读顺序。
4. 状态只列真实API/业务需要：默认、焦点、禁用、加载、空、失败、成功、只读、无权限按适用性选择，不要求每个装饰图形都有提交状态。
5. 使用既有fg-* Token；状态同时给文字或图标语义。对比度、中文字体、触控目标等专项未确定时记录边界；本次不新增Token值。
6. 组件能力不足时先给出规范推荐和已知实现差异，选择现有可用组合或标明后续实施需求；不擅自修改Core。

## 支持域与未核实项

支持域至少说明：受支持内容类型、主要尺寸/变体、宿主可用宽、溢出策略和责任方。数值上限未知不等于允许任意输入。非有限数值/负数等由参数契约或宿主校验处理，不能用异常渲染现状充当推荐行为。

平台字体、触控目标及复杂图形阈值未核实的，说明影响和临时方案；公共能力缺口用 FORGE-GAP 请求决定。不能把关闭路径或主要操作位置留空。


状态表达统一见[状态规则](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/status-presentation.md)。现状图中的胶囊是实现记录，不自动成为采用标准。


## 复合组件必须核对到内容层

采用DataTable、Modal或Drawer等复合组件时，核对容器、内容子组件及交互三层。仅确认import或外框不能证明组合符合Forge样式。

- 表格按内容选择配套CellText、CellTextSubtitle、CellNumber、CellMuted等；主键的详情按钮或链接放入相应文字单元格。自定义单元格允许保留，但须说明业务需要，并与安装版本case对照字体、字重、行高、数值对齐和溢出。
- 详情先确定对象标识、状态、关键信息与下一步操作，再选择DescriptionItem、列表或明细表等阅读组件。弹层容器不自动提供信息层次，内容稀少时按任务选择紧凑弹窗或抽屉，不用固定空白撑高。
- 浏览器检查实际计算样式与内容，而非只查组件名称。代表性单元格与当前版本官方case对照，记录有意差异；不把本次14px或69px实测写成跨版本固定标准。

## 家族采用正例

| 家族 | 组件与正例 |
|---|---|
| 按钮与入口 | Button：明确主操作，次操作降低强调 |
| 输入与选择 | TextField：标签、说明、错误与输入关联 |
| 卡片与描述 | DescriptionItem：标签和值分层，尾操作不挤丢身份 |
| 表格与明细 | DataTable：身份文字单元格可进入真实详情 |
| 导航 | TabBar：选中态与当前内容关联 |
| 弹层 | Modal、Drawer：可关闭，受控状态与焦点归属明确 |
| 图表与指标 | StatCard：单位、统计口径和数据时间明确 |
| 上传与头像 | Avatar：提供身份与无图回退 |
| 复杂组合 | ChatBubble：说明异步发送归属与失败重试 |

组件名称与 Props 仍以同版本生成目录为准；正例不承诺未安装版本具有这些导出。

---

Source: skills/forge-skill/references/contracts/component-mapping.md

> 适用边界：以 SKILL.md 的用户授权范围为先。单页/局部任务只用相关契约；仅设计时不实施，已授权实施时再接对应模块与验证。状态默认 soft StatusBadge。

# Forge Component Mapping Contract

Use this only after the System Brief, Module Contract, and Page Flow are clear.

## Required Output

```yaml
shell:
  component: "AppLayout"
  mode: "light | dark"
  accent: "purple | blue | black"
  menu_items: []
header:
  page_header_variant: "home | detail"
  breadcrumbs: true
toolbar:
  search: "TextField | ToolbarSearchInput"
  filters: []
  date: false
  actions: []
body:
  primary: "FullWidthTable | DataTable | cards | chart | calendar | chat | file-grid | form | stepper"
  secondary: []
tables:
  columns: []
  row_actions_component: "KebabMenu | CellActions | CellKebabMenu"
forms:
  fields: []
  validation: "field-level"
dialogs:
  destructive: "ConfirmationDialog with controlled open/onOpenChange; inline mode only inside an existing shell"
icons:
  package: "@forge-ui-official/core/icons"
  names: []
missing_primitives:
  drawer: "Drawer (controlled open/onOpenChange); check installed version"
  toast: "ToastProvider + useToast; hook below provider"
```

## Forge Rules

- Use `AppLayout` for admin chrome.
- Use `FullWidthTable` for full-page management lists; use `DataTable` for embedded tables.
- Follow [status presentation](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/status-presentation.md); use soft StatusBadge as the adopted default; categories and roles stay plain text.
- Use `DescriptionItem`, `ListGroup`, `HistoryGrouped`, and `TabBar` for detail and inspector surfaces.
- Use `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`, `MediaUpload`, and `Stepper` for forms.
- Use controlled `ConfirmationDialog` for standalone confirmation; omit `open` only for inline content in one existing shell.
- Use `fg-*` color tokens only.
- Use `@forge-ui-official/core/icons` icons with numeric `size`; currentColor may inherit from className, while an explicit color intentionally overrides it.

---

Source: skills/forge-skill/references/contracts/module-contract.md

# Module Contract

Use this after the System Brief and before composing a core admin module.

The module contract defines the business object lifecycle, not the visual layout.

## Required Output

```yaml
module: ""
primary_object: ""
secondary_objects: []
roles_permissions:
  - role: ""
    can: []
states: []
transitions:
  - from: ""
    action: ""
    to: ""
    guard: ""
state_action_matrix:
  - state: ""
    available_actions: []
    disabled_actions: []
list_contract:
  route: ""
  search_fields: []
  filters: []
  sorts: []
  url_state: ["search", "filters", "sort", "page", "pageSize"]
  bulk_actions: []
  row_actions: []
detail_contract:
  route: ""
  header_fields: []
  tabs: []
  related_records: []
  primary_actions: []
mutation_surfaces:
  create: "route | modal | drawer | inline"
  edit: "route | modal | drawer | inline"
  delete_or_archive: "confirm-dialog"
feedback_states:
  loading: true
  empty: true
  no_results: true
  error: true
  permission: true
  success: true
closest_template: ""
```

## Quality Bar

- Row actions should depend on object state. Avoid the same action set on every row.
- Detail must include related records or activity; a field-only detail page is incomplete.
- Create/edit forms should be grouped by business meaning, not by visual convenience.
- Dangerous actions must use controlled `ConfirmationDialog`, or inline content inside one existing shell.
- List state should be in URL when the view is operational or shareable.

---

Source: skills/forge-skill/references/contracts/page-flow.md

# Page Flow Contract

Use this after the module contract. It defines routes, entry points, and exits before implementation.

## Required Output

```yaml
routes:
  - path: ""
    purpose: ""
    surface: "page | modal | drawer | inspector | stepper"
entry_points:
  - from: "sidebar | workbench-kpi | queue | related-record | global-search"
    to: ""
exits:
  - from: ""
    to: ""
breadcrumbs:
  - route: ""
    trail: []
url_state_keys:
  - route: ""
    keys: []
mobile_behavior: ""
```

## Common Route Sets

Resource module:

```text
/objects
/objects/new
/objects/[id]
/objects/[id]/edit
delete/archive confirmation
```

Workflow queue:

```text
/queue
/queue?status=...
/queue/[id]
/queue/[id]/activity
approve/reject/request-changes confirmation
```

Settings module:

```text
/settings
/settings/team
/settings/roles
/settings/integrations
/settings/audit
```

## Quality Bar

- Sidebar items should resolve to real routes.
- Dashboard or workbench links should open filtered work, not dead buttons.
- Detail pages need a way back to list context.
- Route-backed modals or drawers are useful when the selected object should be shareable.

---

Source: skills/forge-skill/references/contracts/system-brief.md

# System Brief Contract

Use this contract before writing code for any admin system, platform, back-office, management console, or multi-module product.

The brief must be short enough to fit in one screen. Its job is to force business understanding before UI composition.

## Required Output

```yaml
domain: ""
archetype: "commerce-ops | project-ops | crm | approval | data-ops | support | finance | files | governance | custom"
primary_users:
  - role: ""
    jobs: []
business_goal: ""
nav_groups:
  - label: ""
    modules: []
modules:
  - name: ""
    type: "core | support | governance"
    primary_object: ""
workbench:
  kpis:
    - label: ""
      target_route: ""
  queues:
    - label: ""
      target_route: ""
  recent_activity: true
operational_loops:
  - "queue -> detail -> action -> feedback"
cross_links:
  - "object -> related object"
governance:
  permissions: true
  audit: true
  settings: true
  import_export: false
  job_center: false
out_of_scope: []
closest_forge_references: []
```

## Quality Bar

- `archetype` must be selected before choosing templates or components.
- For an explicitly authorized full system, include its necessary core/support/governance modules; a single-page task has no minimum module count.
- Every KPI or queue in `workbench` must point to a list, detail, or workflow route.
- `operational_loops` must describe actual work, not page sections.
- `cross_links` must make the product feel connected, such as customer -> orders -> invoices.
- If the user asks for one screen, implement only that authorized screen; broader system suggestions are optional and require approval before implementation.

---

Source: skills/forge-skill/references/icons.md

# Icons — @forge-ui-official/core/icons

Forge 项目唯一 icon 源。禁止用 `lucide-react`、inline SVG 等，**除**文件类型 icon（`public/images/file-icons/*.svg` 是 Figma 原图资产）。

## 基础用法

```tsx
import { MagniferLinear, BellBoldDuotone } from "@forge-ui-official/core/icons";

<MagniferLinear size={16} color="#71717A" />
<BellBoldDuotone size={24} color="var(--fg-violet)" />
```

## Variant 后缀（决定视觉风格）

| 后缀 | 视觉 | 何时用 |
|---|---|---|
| `Linear` | 细描边 | 功能性图标（搜索 / 复制 / 编辑 / 删除） |
| `Bold` | 粗实心 | 少用，几乎被 BoldDuotone 取代 |
| `BoldDuotone` | 双色实心（主色 + 半透明填充） | **装饰性 / widget 图标**（通知铃 / 日历 / 邮件等顶部 icon） |
| `LineDuotone` | 双色细线 | 偶用，线条 + 淡填充 |
| `Outline` | 单色粗描边 | 少用 |
| `Broken` | 破线装饰 | 少用 |

**Figma 规范**：widget 图标用 `BoldDuotone`，功能图标用 `Linear`。

## 项目统一色值

- **默认灰**：`#71717A`（等价 `fg-grey-700` 附近），90% 场景的功能图标直接传这个
- 语义色：传 `var(--fg-*)` 或 hex（如 `color="var(--fg-red)"` 表示危险色）
- 白字按钮上的 icon：`color="#fff"`

## 必踩的两个坑（反复犯）

1. core/icons 默认使用 currentColor，支持 className 继承色；显式 color 会覆盖继承色。
2. **wrapper 压扁 SVG**。外层给 `p-3` 或固定 `height` 会把 icon 挤扁。外层**只给正方形 box**（如 `w-5 h-5` + `inline-flex items-center justify-center`），padding 通过 `p-{n}` 放在更外层容器上。

## 常用 icon 索引（按语义分类）

### 导航 / 布局

- 菜单折叠：`HamburgerMenuLinear`
- 下拉箭头：`AltArrowDownLinear`
- 上下左右箭头：`AltArrow{Up,Down,Left,Right}Linear`
- 外链：`ArrowRightUpLinear`
- 返回：`AltArrowLeftLinear`
- 首页：`HomeLinear` / `HomeBoldDuotone`

### 操作 / 工具

- 搜索：`MagniferLinear`
- 复制：`CopyLinear`
- 编辑：`PenLinear` / `PenNewSquareLinear`
- 删除：`TrashBinMinimalisticLinear` / `TrashBinTrashLinear`
- 设置：`SettingsLinear`
- 添加：`AddCircleLinear` / `AddSquareLinear` / `PlusLinear`
- 关闭：`CloseCircleLinear` / `CloseSquareLinear`
- 更多：`MenuDotsLinear` / `MenuDotsBold`
- 过滤：`FilterLinear`
- 排序：`SortFromTopToBottomBold`
- 下载：`DownloadLinear` / `ExportLinear`
- 上传：`UploadLinear`

### 反馈 / 状态

- 勾选：`CheckCircleLinear` / `CheckReadLinear`
- 问号：`QuestionCircleLinear` / `InfoCircleLinear`
- 警告：`DangerLinear` / `DangerCircleLinear`
- 错误：`CloseCircleLinear`
- 星标：`StarLinear` / `StarBoldDuotone`
- 收藏：`HeartLinear` / `BookmarkLinear`
- 点赞：`LikeLinear`

### 用户 / 社交

- 头像：`UserLinear` / `UserCircleLinear`
- 多人：`UsersGroupTwoRoundedLinear`
- 消息：`LetterBoldDuotone` / `ChatRoundLineLinear`
- 通知：`BellBoldDuotone`
- 聊天：`ChatDotsLinear` / `ChatRoundLinear`

### 内容

- 日历：`CalendarBoldDuotone` / `CalendarLinear`
- 时间：`ClockCircleLinear` / `AlarmLinear`
- 文档：`DocumentLinear` / `DocumentsLinear` / `DocumentTextLinear`
- 文件：`FileLinear` / `FolderLinear`
- 图片：`GalleryLinear` / `GalleryAddLinear`
- 链接：`LinkCircleLinear`

### 商业

- 购物车：`CartLargeBoldDuotone` / `CartBoldDuotone`
- 货币：`WalletMoneyLinear` / `WalletMoneyLinear`
- 信用卡：`CardLinear` / `CardTransferLinear`
- 标签：`TagLinear` / `TagPriceLinear`

## 常见组合模式

```tsx
// 1. 灰色默认 icon（内容区）
<MagniferLinear size={16} color="#71717A" />

// 2. 主色点睛 icon（CTA 左侧）
<PlusLinear size={18} color="#fff" />
<IconButton><StarBoldDuotone size={20} color="var(--fg-violet)" /></IconButton>

// 3. BoldDuotone widget（顶部 TopBar / PageHeader）
<BellBoldDuotone size={24} color="var(--fg-grey-700)" />
<CalendarBoldDuotone size={20} color="var(--fg-violet)" />

// 4. 危险操作
<TrashBinMinimalisticLinear size={18} color="var(--fg-red)" />
```

## 查找 icon 名字

如果不确定某语义的 icon 名：

```bash
ls node_modules/@forge-ui-official/core/icons/dist/icons/ | grep -i <关键词>
```

常用关键词 → 文件名 映射：用"搜索 = magnifer"、"邮件 = letter"、"钱包 = wallet"、"编辑 = pen"、"删除 = trash" 等英文词 grep。

---

Source: skills/forge-skill/references/interaction-adoption.md

# 交互接入边界

由[旧交互 API 指南](https://github.com/forge-ui/forge/blob/main/docs/archive/design/component-fusion-api-guide.md)提取稳定原则；历史指南中的参数表、示例数量、验收结论不是当前事实。组件属性以[源码生成 API](https://github.com/forge-ui/forge/blob/main/docs/for-agents/components.md)为准，只有明确声明的属性才可传入。

- 回调表达操作意图；真实保存、撤销、支付、上传、录音、模型执行、权限校验与取消由宿主完成。点击有反馈不等于业务成功。
- 未知总量使用不定进度，不伪造百分比。数值动画输入保持数值及真实口径，展示格式不应改变业务值。
- Toast 需要 ToastProvider；展示时机与业务结果一致，重试/撤销必须有真实回调。持续通知提供明确关闭路径，不以自动消失掩盖错误。参数和返回值查看生成参考。
- 支持 motion/locale 的组件才传对应属性；减少动效不应关闭业务行为。格式化 locale 与文案语言分开核对，不假定所有组件共享语言参数。
- 组合案例负责展示状态和布局，不自动提供后端鉴权、幂等、持久化或异常恢复。宿主在真实写入边界校验租户、对象权限与状态。
- 使用[统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)、[内容契约](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/component-content-contracts.md)、[浮层与焦点](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/overlay-focus.md)、[动效](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/motion.md)验收，不保留第二套完成门槛。

---

Source: skills/forge-skill/references/layout-grid.md

# Forge layout grid

Read this before choosing page columns or adapting a page to a narrow viewport. APIs are exported from `@forge-ui-official/core`; see `/components/grid` and `/cases/grid` for runnable examples. Existing consumers need a Core version that actually exports Grid/GridItem; do not invent imports against an older installed package.

## Template first

First verify that the template fits the business task. For new page structures, read [page-design-dimensional](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-design-dimensional.md): basic forms, grouped forms, settings and read-only detail have distinct structures. The product rail below is scenario-specific, not a generic form default.

Choose the closest Forge template and page role before choosing tracks. Inherit its fixed versus proportional columns, spacing density and wide-screen hierarchy. Record the source template and justify breakpoint changes with actual content-width evidence. Grid defaults are API defaults, not permission to replace template spacing.

- Analytics uses four equal metric columns and an 8:4 chart/auxiliary split; its lower rows use three and two equal columns from lg.
- Product creation uses a flexible main form plus a fixed 280px right rail, 12px outer gap and 8px field/card gaps.
- Seller detail uses a fixed 336px left rail plus flexible detail content, with 16px outer gap.
- Keep narrow-screen stacking. Fixed rails may use page-level static CSS Grid or Flex; do not convert them to 8:4 just to use GridItem. Toolbars and automatic-width action columns do not need proportional spans.
- Case rulers illustrate geometry. Generic 24-column/offset exercises are optional API capabilities, not default template patterns.

## Ownership

- `AppLayout` owns sidebar, topbar and page padding. Do not add the same padding again to Grid.
- `Grid` owns tracks and gaps; `GridItem` owns span and start. Cards own their content and adapt through existing APIs such as `width="full"`.
- Dashboards/tables normally use available width. Standalone forms should generally cap content at 960px; forms with an auxiliary area use a responsive main/aside layout.
- Use Flex for toolbars, button groups and other one-dimensional arrangements. Do not replace every div with Grid.

## API and defaults

`Grid`: `columns` (1–24, default 12), `gap` (default 16px), `rowGap`, `columnGap`, `alignItems` (`start | center | end | stretch | baseline`, default stretch).

`GridItem`: `span` (1–24 or `full`, default full), `start` (1–24 or `auto`, default auto). Full spans the whole row and ignores start. Use `auto` to reset a previous breakpoint's start. At every breakpoint ensure numeric spans and starts fit the parent tracks; otherwise native CSS Grid creates implicit tracks.

Columns, gaps, span and start accept either a scalar or `{ base, sm, md, lg, xl, "2xl" }`. Breakpoints are viewport widths 640/768/1024/1280/1536px; unspecified values inherit upward. Empty objects use defaults. This is not a container-query API: check available width with the sidebar expanded too.

Gap values are **pixels**, limited to 0/4/8/12/16/20/24/32/48. An explicit axis gap overrides `gap` from its first specified breakpoint onward. Before that it follows `gap`; `0` is a valid override.

Both components accept normal div attributes, className, style and ref and work in server components. Custom classes/style are explicit CSS overrides; prefer the layout props. Nested grids reset their own variables rather than inheriting their parent's settings.

## Composition

```tsx
import { Grid, GridItem, StatCard } from "@forge-ui-official/core";

// Plain direct children auto-place into one cell each.
<Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={16}>
  {metrics.map(metric => <StatCard key={metric.title} {...metric} width="full" />)}
</Grid>

// Analytics proportional chart/auxiliary layout (not a fixed form rail).
<Grid gap={16} alignItems="start">
  <GridItem span={{ base: "full", lg: 8 }}>Main content</GridItem>
  <GridItem span={{ base: "full", lg: 4 }}>Auxiliary content</GridItem>
</Grid>

// Product template: preserve fixed rail and original density; stack below xl.
<div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
  <div className="min-w-0"><Grid columns={{ base: 1, sm: 2 }} gap={8}>…</Grid></div>
  <div className="min-w-0">Auxiliary fields</div>
</div>
```

Keep DOM order aligned with reading and keyboard order. Decide equal height per row, not globally; do not force all card grids to auto-rows-fr or fixed minimum heights. Charts need an intentional height. Long identifiers need wrapping/truncation chosen by content meaning; tables keep horizontal scrolling in their own container. `min-width: 0` permits shrinking but does not itself wrap long strings.

## Layout audit

- Record the source template; compare fixed rail widths, proportional tracks, field/action widths, gaps and breakpoint changes before checking overflow.

- Capture before/after at 375, 768, 1024 and 1440px; also inspect the breakpoints used by the page on both sides.
- Test expanded/collapsed sidebar and mobile overlay. Check actual content width, not only viewport width.
- No duplicated page padding, unintended implicit columns, or new document-level horizontal scroll.
- No clipped text/controls; long content must remain accessible. Wide tables scroll locally.
- Confirm relevant buttons, menus, fields, tabs and dialogs still work. Preserve pre-existing mock behavior; do not claim data was saved when a template only opens a dialog.
- Retain URL, screenshot and operation result. Record pre-existing failures separately; technical checks do not constitute user acceptance.

References: [Ant Design](https://ant.design/components/grid-cn/), [MUI](https://mui.com/material-ui/react-grid/), [Chakra UI](https://chakra-ui.com/docs/components/grid).

## 几何与验收单一来源

看板尺寸、轨道公式与模板出处统一见 [页面规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md#看板screen-优先与分层几何)；验收统一见 [审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)。固定280/336px业务侧栏不是比例Grid的默认替代品。

---

Source: skills/forge-skill/references/motion.md

# 动效采用规则

依据 docs/design/motion-role-fusion.md 的角色契约：enter180ms、exit120ms、layout200ms、press80ms；缓动 cubic-bezier(.2,.8,.2,1)。这些是对应角色的声明值，不是所有组件强制统一时长，也不是实机测量。

退出短于进入；Overlay 用透明度，减少动态偏好时 dialog 不平移、保留必要透明度反馈，motion="none" 即时完成。重新打开取消未结束的关闭计时，避免旧回调误关新弹层。路由切换保留稳定壳，不用整页重挂制造动画。

优先现有组件能力。core 当前存在 motion 依赖，LiquidTabs/Calendar/Chat 等可使用它；不以此授权新增另一套动效库或宣称所有组件均由纯CSS实现。具体 Props 以生成目录为准。

reduced-motion、快速重复操作、退出期间重开和焦点归属必须实测；本次文档任务未完成这些浏览器验证。

---

Source: skills/forge-skill/references/official-assets.md

# Forge 官方资产索引

唯一规范正文为本 skill；组件事实来自当前安装版本及主仓 core 源码，不依赖兄弟仓注册表。

- 组件导出：[清单](https://github.com/forge-ui/forge/blob/main/docs/for-agents/components.md) 与 [JSON](../../../docs/for-agents/inventory.json)。
- 组件 API：本目录 components 下按源码模块生成的文档。
- 页面骨架：[页面模式](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-patterns.md) 与 templates/business.md。
- 业务流程：[实施手册](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/admin-module-playbook.md)。
- 发现缺口：标记 FORGE-GAP，说明导出、安装版本、候选影响，询问用户；不手搓替代组件。

---

Source: skills/forge-skill/references/overlay-focus.md

# 弹层、焦点与 Tooltip 契约

提炼自已采纳 batch1-rules-addendum 与 tooltip-group-timing-contract；适用性仍需核对安装版本与宿主组合。

- 原生 dialog 内的 KebabMenu portal 留在所属 dialog；普通页面挂普通宿主，不能靠更高 z-index 修原生 top-layer。
- Escape 先关闭最上层活动子层，再由宿主处理父层；不能靠 stopPropagation 掩盖多层关闭。
- 选择或 Escape 后返回仍存在的 trigger；外点尊重新焦点。选择后开启子 Modal/导航则由新目标接管，不强抢旧 trigger。受控 open 由宿主确认回写，拒绝关闭后仍可再次操作。
- 标题可换行，关闭控件不收缩；正常 body 单滚，头尾超预算时整层单滚；宽代码和表格只在所属区域横滚，不藏关闭按钮。菜单外边预算8px、通知/个人/团队/应用面板16px是采用契约，需按当前实现核对。
- 独立 SearchHeader 窄屏允许搜索与操作换行；AppLayout 使用自身 mobile-menu 能力，不另画第二套汉堡或搜索。
- TooltipGroup 仅提供上下文，不生成布局盒/ARIA group；以最近 provider 为作用域，不自动合并。冷 hover 默认200ms（单项 delay 可覆盖），最后实际可见项关闭后 warmWindow 默认500ms；focus 即时开启。仅实际移除更新 warmUntil；计时参数变化会重建，不保证保留内部时序。
- 分组共享时序/位置，不保证互斥：两个受控 open=true 可同时存在，宿主负责仲裁。位置过渡声明180ms，不等于实机精确时长保证，也不提供 group motion prop。

触摸、读屏器、软键盘、跨浏览器及极端尺寸本轮未验证。验收见 [清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)。

---

Source: skills/forge-skill/references/page-design-dimensional.md

# 多维页面图方法

使用随本仓独立分发的 [dimensional-drawing](https://github.com/forge-ui/forge/blob/main/skills/dimensional-drawing/SKILL.md) 画静态尺寸图；只有用户明确要求动画成片时才使用 [dimensional-drawing-motion](https://github.com/forge-ui/forge/blob/main/skills/dimensional-drawing-motion/SKILL.md)。install-skill.sh 同时安装三者，不依赖固定本机路径。先选真实同角色 Screen；另行截图验证实际 UI，图纸不能替代运行验收。安装 skill 不自动执行 headless 依赖或下载浏览器。

1. 标注角色、任务、模板源码/版本、视口、侧栏状态及净内容宽。
2. 按外壳→页面组件→组件拆槽，标 FILL/FLEX/HUG，说明 padding、gap、宽高、滚动归属。操作先保留 HUG，正文取得非负剩余宽。
3. 尺寸线、变量表与公式一一对应，区分源码值、公式推导、建议值、未核实；不以截图比例猜参数。
4. 宽屏与窄屏分别画，保留阅读顺序、关闭/提交入口；长文字重排，宽代码/表局部横滚，不隐藏不可达操作。
5. 看板必填：Screen 路径与版本、目标/KPI业务入口、轨道/span/断点、section gap、Grid gap、卡padding与内部gap、图域高度与整卡高度的区别、字体层次、滚动与侧栏净宽。公式与数值单一来源见 [页面规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md)。
6. 交付图纸说明有意偏差与 FORGE-GAP；浏览器验证另记录实际计算样式、截图、真实动作、焦点与溢出。

验收使用 [统一清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)，不把技术构建或静态图纸当真实展示通过。

---

Source: skills/forge-skill/references/page-patterns.md

# Admin Page Patterns

Use this reference before designing common SaaS admin pages. Pick the page type first, then compose the screen from Forge components instead of hand-rolling UI.

Think in reusable page blocks, similar to shadcn Blocks: shell, toolbar, data body, feedback state, and confirmation flow. Prefer real Forge cases/templates as the source of truth.

## Page Selection Decision Tree

Before composing JSX, choose the page model:

1. If the request asks for a system/platform/admin/back-office, read `contracts/system-brief.md`, choose a `blueprints/*.md` archetype, and produce a System Brief before choosing page components.
2. If the request names a business object users manage, treat it as a resource module and read `contracts/module-contract.md` plus `admin-module-playbook.md` first.
3. If the user asks for metrics, trends, anomalies, or reports, start with analytics/reporting, then add drill-down links to lists/details.
4. If the user asks for approval, generation, import, publishing, tickets, or review, model a workflow queue with explicit states and actions.
5. If the user asks for settings, permissions, integrations, notifications, or rules, model grouped configuration with save/reset behavior and danger zones.
6. If the page mixes multiple intents, give each intent a clear surface: dashboard for insight, list/detail for operations, settings for configuration.

For dashboards, start from the ten Screens in [screens](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/screens.md); missing primitives require FORGE-GAP. Pick the nearest Forge template after the page model is clear. For example, ecommerce products/orders/customers are good CRUD references; project-template projects/members/files/invoices/tasks are good operational module references; dashboards are good entry pages, not replacements for CRUD flows.

When a blueprint exists, prefer its module map and state model over inventing generic fields. The page pattern decides the surface; the blueprint decides the business logic.

For system generation, combine patterns instead of picking only one: app shell + workbench/dashboard + core list/detail + mutation form/dialog + settings/audit/supporting surface.

## Pattern Map

| Page / flow | Structure | Forge components | Source examples |
|---|---|---|---|
| Full admin system | domain sidebar + workbench + core modules + supporting settings/audit | `AppLayout`, `StatCard`, `FullWidthTable`, `TabBar`, `ListGroup`, `HistoryGrouped`, `ConfirmationDialog` | project-template overview/projects/tasks/members/files/invoices |
| App shell / navigation | sidebar + topbar + breadcrumbs + user/team entry | `AppLayout`, `SidebarMenu`, `TopBar`, `PageHeader`, `Breadcrumbs` | `components/layouts-app-layout.md`, dashboard-builder templates |
| Auth | brand area + form + secondary links + loading/error states | `TextField`, `Button`, `Checkbox`, `StyledLink` | compose from form primitives; no Forge auth template yet |
| Dashboard | KPI grid + charts + activity/list/map | `StatCard`, `ProgressStatCard`, `ChartCard`, chart family, `MapCard`, `ActivityCard`, `ListGroup` | `cases/card`, `cases/chart`, `templates/(dashboards)/dashboards/*` |
| Analytics / reporting | metric summary + trends + dimension filters + detail table | `Toolbar`, `ChartCard`, chart family, `DataTable`, `StatCard`, `ButtonGroup` | analytics, CRM, finance dashboards |
| List page | `AppLayout` + `Toolbar` + `FullWidthTable`/`DataTable` + pagination/actions | `Toolbar`, `ToolbarSearchInput`, `ToolbarFilterButton`, `ToolbarActions`, `FullWidthTable`, `DataTable`, `StatusBadge`, `Pagination`, `KebabMenu` | `cases/toolbar`, `cases/table`, ecommerce/project templates |
| Detail page | back/breadcrumbs + summary + fields + related data + timeline | `AppLayout pageHeaderVariant="detail"`, `Breadcrumbs`, `DescriptionItem`, `ListGroup`, `HistoryGrouped`, `DataTable` | `cases/page-header`, `cases/list`, `cases/history` |
| Master-detail workspace | left list/search + right preview/detail + quick actions | `ToolbarSearchInput`, `ListGroup`, `DataTable`, `TabBar`, `DescriptionItem`, `ChatBubble` | project client/member detail templates |
| Right drawer / inspector | list/table/queue stays visible + selected object summary/actions | `DataTable`, `ListGroup`, `DescriptionItem`, `TabBar`, `HistoryGrouped`, `ConfirmationDialog` | task/user/file processing workspaces |
| Create / edit | sectioned form + submit actions + upload/validation | `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`, `MediaUpload`, `Button`, `Stepper` | `cases/input-field`, ecommerce `new` pages |
| Bulk import/export | selection state + actions, or stepper import flow | `DataTable`, `ToolbarActions`, `FileUpload`, `Stepper`, `StatusBadge` | list templates + form cases |
| Delete / danger | row/detail/settings action + confirmation | `KebabMenu`, `IconButton`, `Button color="red"`, `ConfirmationDialog` | `cases/menu`, `cases/modal` |
| Messages / notifications | conversation list + message detail, or notification list | `ContactItem`, `NotificationItem`, `ChatBubble`, `ChatInputBar`, `ListGroup` | `cases/chat`, `cases/menu` |
| Calendar | toolbar + view switch + calendar + event side panel | `FullCalendar`, `SmallCalendar`, `SmallDailyCalendar`, `EventCard`, `EventTag`, `ButtonGroup` | `cases/calendar`, `cases/tab` |
| File manager | search/filter + table/grid + upload + preview/permissions | `Toolbar`, `DataTable`, `FileCard`, `FileTypeIcon`, `FileUpload`, `KebabMenu` | project files/templates |
| Invoice / billing | invoice list + payment status + document detail + send/download/print | `DataTable`, `StatusBadge`, `DescriptionItem`, `Button`, `ConfirmationDialog` | project invoices, ecommerce invoice detail |
| Team / members | member directory + roles + profile detail + related work/chat | `UserCard`, `AvatarGroup`, `DataTable`, `TabBar`, `ChatBubble`, `LineChartStatCard` | project members templates |
| Profile | profile card + stats + activity + related projects/files | `ProfileCard`, `Avatar`, `UserCard`, `StatCard`, `ActivityCard`, `ProjectCard`, `ListGroup` | `cases/menu`, `cases/card`, `cases/list` |
| Settings | grouped settings + tabs + controls + danger zone | `TabBar`, `ListGroup`, `ListItem`, `TextField`, `SelectOption`, `Toggle`, `ConfirmationDialog` | `cases/tab`, `cases/list`, `cases/input-field` |
| Stepper / wizard | stepper + current step form + previous/next/save draft | `Stepper`, forms, `Button`, `ProgressBar`, `DescriptionItem` | `cases/pagination-stepper`, `cases/input-field` |
| Card / kanban | toolbar + filters + grid/columns + card actions | `ProjectCard`, `TaskCard`, `UserCard`, `ProgressCard`, `FilterGroup`, `KebabMenu` | `cases/card`, `cases/filter` |
| Chat / IM | conversation sidebar + message stream + input | `ContactItem`, `ChatBubble`, `ChatInputBar`, `TabBar` | `cases/chat` |
| Agent workspace | thread list + thinking / tools / streamed answer + HITL + prompt bar | `AppLayout`, `ThinkingTrace`, `ToolChips`, `StreamingAnswer`, `ApprovalCard`, `RecommendationCard`, `ContextCards`, `AgentTaskRows`, `ChatInputBar`, `AgentDiffTable`, `AgentCodeBlock`, `InsightCards`, `CommandSearch`, `AgentFlowchart`, `ChatBubble` | `cases/agent`, `templates/agent` |
| Audit / activity | filters + timeline + actor + object + before/after summary | `HistoryGrouped`, `HistoryItem`, `ActivityCard`, `ToolbarDatepicker`, `ToolbarFilterButton` | `cases/history` |
| Search results | search + category filters + list/table results + empty state | `ToolbarSearchInput`, `FilterGroup`, `ListGroup`, `DataTable`, `Pagination` | `cases/filter`, `cases/list` |
| Async job center | job list + progress/status + failure report + retry/download | `DataTable`, `StatusBadge`, `ProgressBar`, `NotificationItem`, `Button` | import/export/generate/report workflows |
| First-run / empty setup | empty state + guided primary action + sample/import option | `AppLayout`, `Button`, `FileUpload`, `Stepper`, `ListGroup`, `Checklist` | create/import onboarding flows; `cases/checklist` |

## Universal Admin Skeleton

1. Reuse the host AppLayout; add one only when the host has no shell.
2. Build navigation from business domains: dashboard/workbench, operations, relationships, output/finance, governance/settings.
3. Use `pageHeaderVariant="home"` for dashboard/list pages and `pageHeaderVariant="detail"` for detail/create/edit pages.
4. Use `Toolbar` for search, filters, view switches, export/import, and primary actions.
5. Choose the main body component: `FullWidthTable`, `DataTable`, cards, `ListGroup`, charts, calendar, file, or chat.
6. Add feedback states: loading, empty, error, permission denied, success.
7. Put row actions in `KebabMenu` / `CellActions`; use `ConfirmationDialog` for destructive actions.
8. Put bulk actions in `ToolbarActions` or the table selection state, not scattered around the page.
9. Run a layout integrity check: full width, equal-height rows, no accidental large blank card areas, no mobile overflow.

## Layout Integrity

Read [the layout grid contract](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/layout-grid.md) for Grid/GridItem props, page width ownership and responsive audit steps. Choose the closest template first and inherit its fixed/proportional columns, spacing and breakpoints before composing components. Do not stack arbitrary `div`s and hope the page fills correctly.

Rules:

- Page body should use `w-full`, `min-w-0`, `flex-1`, and `min-h-0` where needed so content can fill and shrink correctly.
- Use `Grid` and responsive `GridItem` spans for proportional dashboard regions, with explicit gaps matching the source template. Preserve fixed form/detail rails (product 280px, seller 336px) with static CSS Grid/Flex and narrow-screen stacking; do not force them into 8:4.
- If same-row cards have very different content density, do not leave a large blank area. Change the row span, split dense/sparse cards, or use `flex flex-col justify-between h-full` inside the sparse card.
- Choose equal-height cards only when the row benefits from them; do not force `auto-rows-fr` or minimum heights on every card grid.
- Charts need stable height, such as `h-[280px]`, `min-h-[320px]`, or `aspect-[16/9]`; do not let SVG/canvas natural height define the layout.
- Right-side todo/message/template cards placed next to large charts need enough visual density: footer actions, status summaries, grouped headings, or a smaller row span.
- Equal-width card groups use `<Grid columns={{ base: 1, sm: 2, lg: 4 }}>` and existing full-width card props. Verify available space with the sidebar expanded.
- Any `overflow-y-auto` region needs a clear parent height or a `min-h-0` chain, otherwise scroll/fill behavior will break.

Self-check:

- Does the first viewport have one side full and the other side mostly empty?
- Are lower modules misaligned because previous row heights are inconsistent?
- Does the layout fill naturally at 1440px, 1920px, and mobile widths?
- Do CTAs, stats, list items, chart legends, and footers create a complete visual block inside each card?

## App Shell / Auth

- Use `AppLayout` for all authenticated admin pages; do not rebuild sidebar/topbar/profile navigation.
- Group navigation by business domain: dashboard, core objects, collaboration, finance, settings.
- Use `pageHeaderVariant="home"` for dashboards/lists and `pageHeaderVariant="detail"` for detail/edit/invoice/task pages.
- Use `Breadcrumbs` for nested resources.
- Forge currently has no auth template source. For login/signup/reset/invite pages, compose the skeleton from `TextField`, `Checkbox`, `Button`, and `StyledLink`.
- Auth forms should cover loading, validation error, disabled submit, and success redirect states.

## Dashboard

- First row: 3-5 KPIs with `StatCard` / `ProgressStatCard`.
- Middle: main chart + secondary chart with `ChartCard` and chart family components.
- Bottom: activity, top lists, map, or tasks with `ActivityCard`, `ListGroup`, `MapCard`, `TaskCard`.
- Keep labels short, show units, and use `trend` / `trendDirection` for movement.
- Dashboard/workbench cards should navigate to work: each KPI, anomaly, task, or shortcut should imply a filtered list, queue, detail page, or action.

## Analytics / Reporting

- Top: `Toolbar` with date range, dimension filters, export, refresh.
- Summary: `StatCard` for key metrics such as revenue, conversion, activity, cost, anomalies.
- Body: `ChartCard` + chart family for trend, comparison, and breakdown.
- Detail: `DataTable` under the charts for sortable/paginated records.
- Make the time range and filter context visible; reporting pages are not trustworthy without them.

## List Page

- Header: title + `primaryAction` for New/Create.
- Toolbar: search, status filter, date filter, tabs or view switch, export, bulk actions.
- Table: 6-8 columns; status uses `StatusBadge`; main entity uses image/avatar text cell; final column uses `KebabMenu` or `CellKebabMenu`.
- Use `FullWidthTable` for full-page management lists. Use `DataTable` for embedded dashboard/detail tables.
- Footer: `Pagination`.
- Actions: view detail, edit, duplicate, archive, delete. Delete must confirm.
- Keep search, filters, sort, page, pageSize, and view mode in URL when the list is an operational view users may share or revisit.
- Show bulk actions only after selection. For cross-page selection, clarify whether the action applies to current page or all matching records.
- For saved views such as "Overdue", "Needs review", or "My items", show the active segment and make clearing filters obvious.
- `ToolbarSearchInput` is display-only today. For controlled search that updates URL state, use `TextField` with a search icon or a project wrapper exposing `value` and `onChange`.

## Detail / Master-Detail

- Use detail header with back behavior and breadcrumbs.
- Top summary: status, owner, key dates, important metrics.
- Field groups: `DescriptionItem` in logical sections.
- Related data: `DataTable` / `ListGroup`; history/audit: `HistoryGrouped`.
- For master-detail workspaces, use left search/list and right preview/detail; collapse to list -> detail on mobile.

## Create / Edit / Import

- Section forms by business meaning: basic info, configuration, permissions, files, confirmation.
- Short forms are single column; complex forms may use two columns.
- File/image fields use `FileUpload`, `MediaUpload`, `ProfileImgUpload`.
- Multi-step flows use `Stepper`; final step shows a summary before submit.
- Import flows should be upload -> map fields -> preview validation -> confirm import.

## File Manager

- Toolbar: search, type filter, upload, create folder, view switch.
- Table view: `FullWidthTable` for name, type, size, owner, updated time, permission.
- Grid view: `FileCard` + `KebabMenu` for download, rename, move, delete.
- Use `FileUpload` for upload and `FileTypeIcon` for file type.
- Cover permissions, upload progress, failed retry, empty folder, and destructive delete confirmation.

## Invoice / Billing

- List: `FullWidthTable` with invoice id, client, project, amount, due date, status.
- Status: `StatusBadge` for paid, pending, overdue, draft, void.
- Detail: summary, company/client info, line items, totals, tax/discount, actions.
- Actions: send, download, print, edit, void/delete. Void/delete must confirm.

## Team / Members / Profile

- Directory: `DataTable` or `UserCard` grid with avatar, role, team, status, last active.
- Filters: role, status, team, permission group.
- Detail: profile, stats, projects, tasks, files, chat; switch sections with `TabBar`.
- Permission changes, member removal, and invite reset should confirm.

## Messages / Chat / Agent

- Conversation list: `ContactItem`.
- Message stream: `ChatBubble`.
- Composer: `ChatInputBar`.
- Results/artifacts should render as table, card, chart, file preview, or tabs, not only plain text.
- Cover empty, loading, error, and retry states.

## Calendar

- Toolbar + `ButtonGroup` for month/week/day.
- Main area: `FullCalendar`; side area can use `SmallCalendar` and today's `EventCard`s.
- Use `EventTag` for type/status.
- Event forms need title, time, participants, reminders, and recurrence when required.

## Settings

- Group settings into sections with `ListGroup`.
- Use `TabBar` for categories.
- Use `Toggle` for booleans, `SelectOption` for enums, `TextField` / `TextArea` for text.
- Put account deletion / reset / revoke actions in a separated danger zone with red confirmation.

## Audit / Activity

- Filter by time, actor, object, and action with toolbar controls.
- Use `HistoryGrouped` by date; use `HistoryItem` / `ActivityCard` for entries.
- Each entry should include actor, action, object, time, and result.
- For field changes, show before/after in compact descriptions.

## Search / States

- Search pages need search, category filters, sorting, result count, pagination, and empty state.
- Loading should keep the page frame stable.
- Empty state should explain why and offer create/upload/clear filters.
- Error state should offer retry.
- Permission state should say what access is missing without leaking sensitive data.

## Complete Module Checklist

For a full admin module, consider whether it needs:

1. Dashboard: metrics and anomalies.
2. List: search, filters, sort, pagination, bulk actions.
3. Detail: summary, field groups, related data, history.
4. Create/Edit: sectioned forms, validation, uploads, draft save.
5. Delete/Archive: confirmation, impact, restore policy.
6. Files: attachments, upload, preview, permissions.
7. Billing: invoice, payment, refund, export.
8. Team/Permission: members, roles, invites, removal.
9. Audit: logs, approvals, activity.
10. Settings: global config, notifications, integrations, danger zone.

## 业务拆解补充

每页明确页面目的、字段、状态、权限及下一步动作。文件管理须包含上传/处理中/失败重试/预览权限；发票要有发送、下载与账单状态；团队页说明成员角色与可操作边界。列表、详情、编辑共享实体标识与状态，不把卡片网格当成业务闭环。布局仍以主模板及 Grid 契约为准，不继承旧副本的 gap-6、无条件等高或 auto-rows-fr。

---

Source: skills/forge-skill/references/page-recommended-standard.md

# 后台页面推荐标准

状态：2026-11-02 规范推荐稿，供新页面设计、评审与实施选型使用。本文定义**推荐行为与设计起点**，不证明当前 Core、模板或业务页面已经实现；不回填组件实测值，不关闭历史 pending，也不扩大第一批代码改造范围。用户确认范围、页面实现、技术检查与真实页面验收须分别记录。


## 1. 应先交付的页面契约

每种页面结构先写明：角色与对象、主要任务、入口/返回、权限、区域顺序、保存/选择作用范围、固定与伸缩区域、滚动拥有者、窄屏降级、状态与验收场景。不要为填满模板增加统计、辅助栏或业务操作。

| 类型 | 默认区域顺序 | 采用条件与操作范围 |
|---|---|---|
| 列表 | 对象标题与主要操作 → 查询 → 结果/选择反馈 → 分页 | 查找与批量处理；明确当前页选择或跨页选择，不含糊写“全选” |
| 基础表单 | 任务标题 → 单列字段 → 提交反馈与操作 | 一次可理解的单一任务；提交覆盖整张表单 |
| 分组表单 | 任务标题 → 有标题的信息组 → 统一提交 | 多组信息共同提交；分组不等于每组都有保存按钮 |
| 分步表单 | 步骤与当前位置 → 当前步骤 → 上下步/提交 | 有业务顺序或阶段校验；不要只因字段多而分步 |
| 详情 | 对象标识/状态/操作 → 只读信息组 → 必要关联数据/记录 | 支持判断对象现状及下一步；编辑须有明确入口 |
| 设置 | 分类入口 → 当前主题与生效范围 → 分组配置 → 保存反馈 | 说明个人/团队/组织范围；同一范围的生效方式一致 |

## 2. 推荐尺寸与可用宽预算

本节数值均为**设计推荐，非实测、非 Token 修改或现有 API 保证**。先复用组件内部几何；仅为页面拥有的间距设值。真实内容不适配时，记录理由调整，不能裁掉内容来保住数字。

| 参数 | 推荐起点 | 理由与使用边界 |
|---|---|---|
| 基础表单填写区上限 | 640px，实际宽为 min(可用宽, 640px) | 限制长视线与字段过宽；外层页面可继续填满，不要求所有卡片等宽 |
| 分组表单/详情主阅读区上限 | 960px，实际宽不超过可用宽 | 容纳相关短字段与描述组；大表、附件预览可独立用满内容区 |
| 页面组件间距 | 24px；窄空间可用16px | 区别于字段内部间距；不与已有外壳 padding 叠加成双份留白 |
| 独立字段间距 / 业务组间距 | 16px / 24px | 通过节奏表达关联层次；组件内标签、错误间距沿组件契约 |
| 两列字段间距 / 单列最小预算 | 24px / 280px | 为标签、输入、说明保留基础空间；280仅为起点，长字段可要求更宽 |
| 左右标签变体 | 初始标签预算120px，标签与值间距16px | 只用于短而稳定的同组标签；允许多行，不强行省略；更长标签优先改上标签 |

设 C 为**扣除外壳、侧栏、页面与卡片 padding 后**的实际字段容器宽，m 为该业务字段最小可读宽，g 为列间距。仅当 C ≥ 2m + g 时采用两列；上述推荐起点为 C ≥ 584px，而不是 viewport ≥ 584px。若依赖视口断点实现，应按侧栏展开后的最坏预算选择断点，再在该断点两侧验证；不得把 viewport 的 md 当作内容必能两列。标签120 + 间距16 + 字段最小宽 m 也须能放入同一行，否则回到上下标签。

现有视口断点依据见 Grid 证据：640/768/1024/1280/1536px。本文不新增全局断点；容器重排是页面设计要求，采用容器查询或视口规则须由宿主实现说明。没有容器宽证据时，安全起点为单列。

## 3. 各页面的执行规则

### 列表

- 标题表达对象范围；一个主要创建入口即可，避免页头与工具栏无理由重复。搜索、筛选与排序作用于同一结果集，显示已生效条件与清空方式。
- 查询更新后重置不再有效的页码，并重算选择范围；批量操作明确数量、对象及跨页规则。请求乱序不得让旧结果覆盖新条件。
- 列按主标识、判断信息、状态、操作组织，不为固定“6—8列”删掉必要业务信息。窄屏保留对象识别和核心动作，其他内容通过明确的详情或局部横滚访问。
- 宽表由表格容器横滚，主页面不横溢；分页紧邻结果。粘性表头、选择栏须在真正滚动容器内验证，不同时建立两个竞争的表格纵向滚动区。

### 基础、分组与分步表单

- 默认上标签、单列、自然高度；必填/可选表达在同页一致。说明和错误随内容换行，唯一 ID 与可访问描述关联由组件组合/宿主负责。
- 只有相关短字段并排；长文本、地址、富文本、附件与子表跨整行。左右标签、字段两列、主辅两栏分别评审，不把它们捆绑成一个布局变体。
- 短表单操作随末尾。长表单允许粘性操作区，须满足第4节；不同时再放一套同权重提交。草稿、取消、提交分别说明保存范围和离开结果。
- 分组按业务相关性命名；提交失败显示问题摘要并定位第一个可操作错误，保留已填值。不要仅用 toast 承载字段错误。
- 分步仅校验当前步骤的必要条件，最终提交复核整单；返回上一步保留数据。进度标识可读，未满足依赖的未来步骤不得假装可跳转。离开/取消是否保留草稿按业务决策，不默认替用户保存或丢弃。

### 详情

- 先识别对象，再读状态和关键操作。默认采用标签—值、正文、附件、明细等阅读结构；静态信息不伪装为禁用输入。
- 空值、未知、无权限、尚未生成分别表达，不统一画成破折号。短字段可按宽预算分列，长文本跨行，名称及标识可获取完整内容。
- 关联列表、时间线和附件只在任务需要时加入；内容过多才采用分类/分页，保留当前对象上下文。危险动作说明实际影响范围并确认。

### 设置

- 分类名称表达配置主题；切换后标题与当前位置一致。桌面左分类、右配置是可选结构，窄屏改为先选分类再读内容，不强挤双栏。
- 每一保存范围明确即时生效或点击保存生效。即时操作失败时还原并解释；需保存的修改显示未保存状态，失败保留值。不同保存范围视觉分组，避免一个按钮的作用含糊。
- 危险区与日常配置分开；说明后果和权限。秘密值不因布局展示需要而回显；连接测试、授权、撤销等只在实际业务存在时提供。

## 4. 固定、伸缩与滚动

默认采用页面主内容自然纵向滚动，卡片/字段随内容长高。只有列表工作台、主从处理等明确需要视口内操作的场景，才声明有高度预算的内部滚动。

- FILL 区域继承实际可用空间；FLEX 区域取剩余宽/高并建立 min-width:0、min-height:0 链路；HUG 区域按内容增长。按钮及必要标识不被压成不可操作尺寸。
- 视口工作区剩余高 H = 当前可用视口高 − 外壳占用 − 非重叠页头/工具栏/页脚高 − 间距。先指定唯一主纵向滚动拥有者；H不足时降级为整区自然滚动，不能把正文压到零高仍保留固定头尾。
- 粘性/固定操作区以实际内容高度留位，包含换行后的按钮与安全区；最后字段、错误、分页及键盘焦点均能完整滚入可视区。固定元素遮挡输入即验收失败。
- 移动端优先单列和一个主纵向滚动区；横滚仅限明确标识的表格/代码等内容区。主从双栏变为列表进入详情，返回保留合理的查询和位置。
- 弹层依据触发器与实际视口定位；滚动、resize、内容增长和锚点卸载须处理。关闭原因决定返焦，外部主动焦点不应被抢回。本文只规定设计要求，具体组件当前支持范围查其契约和第一批证据。

## 5. 状态及真实页面验收

| 状态/变化 | 页面必须表达 | 验收要点 |
|---|---|---|
| 首次加载/更新 | 保持标题与任务上下文；更新可保留旧数据但明确处理中 | 不跳成另一任务，不重复提交；完成后数据与条件一致 |
| 无数据/无筛选结果 | 区分尚无对象与查询无匹配 | 前者按权限提供创建；后者允许清空条件，保留输入 |
| 请求/提交失败 | 失败动作、可理解原因、恢复入口 | 重试有效、字段不丢失、不显示假成功 |
| 权限不足/权限变化 | 明确不可执行范围 | 不泄露敏感数据；进行中的操作可靠失败并解释 |
| 成功/保存中/未保存 | 明确对象与结果、是否已生效 | 成功由真实结果确认；刷新/返回与显示一致 |
| 长内容/缩放/断点变化 | 信息可读、关键动作可达 | 不只测短英文默认态；焦点和上下文不落在卸载/隐藏区 |

每个页面记录实际路由、角色权限、样本数据、viewport 与实际内容宽、侧栏状态、操作步骤、结果和证据路径。建议覆盖375、768、1024、1440及实际使用断点前后1px；320作为窄屏压力例，1800作为宽屏阅读例。宽度数字是**验收采样推荐**，不是全宽全状态通过的证明。补短高场景、长中文/连续标识、多行错误、最末项、空/失败、键盘往返；物理触摸、软键盘、读屏与跨浏览器未执行时单列未验证，不凭 DOM 或截图推定。

## 6. 可执行默认值与按业务复核项

以下规则由设计者作为下一页的默认起点执行，无需用户逐项确认。具体页面出现不同业务需要时，说明理由并提出调整；这不等于用户已经验收本规范。允许保留的 TBD 必须附对象、原因、影响、触发条件与责任，不允许只写“以后再看”。

| 按业务复核项 | 可执行默认/原因 | 影响与调整触发 |
|---|---|---|
| P01 页面尺度640/960与16/24 | 使用本稿设计起点，不改 Token；尚无跨业务真实页面验收 | 影响阅读密度与重排；首个代表性基础/分组表单用长中文及侧栏展开验证后确认或修订 |
| P02 长表单统一粘性操作还是按任务选择 | 短表单末尾；长表单逐页论证，避免短屏遮挡 | 影响滚动预算与末字段；首个超一屏表单、按钮换行或软键盘目标出现时确认 |
| P03 设置即时生效与显式保存、离开草稿策略 | 未定时采用显式保存，离开未保存内容默认提供“继续编辑”或“放弃更改”；只有业务实际支持时才提供“保存草稿” | 影响错误恢复及状态反馈；真实设置/分步任务确定提交语义时确认，不擅自生成自动保存能力 |
| TBD：中文字体与真实触摸/读屏体验 | 沿用宿主字体栈；技术与静态观察不能证明设备体验 | 影响标签换行、点击与播报；目标平台、字体或无障碍验收范围确定后专项验证；可保留但不得宣称对应体验通过 |
| TBD：特定复杂字段最小宽/多列阈值 | 缺业务样本时单列，不制造统一最小值 | 影响窄栏、主辅布局；复合选择、长标签、子表进入页面即重新预算并实页验证 |

以上按业务复核项不豁免可读、可达、保存范围明确和避免页面横溢等基本要求。任何需要新组件/API的推荐必须另立实现范围；本文不授权 Core 修改或后续批次。

## 草稿离开的保守默认

存在未保存更改时，应用内离开提供“继续编辑”（默认，保留输入）或“放弃更改”（明确放弃后离开）。不默认自动保存，不承诺关闭浏览器后恢复；刷新/关闭页面只能依平台能力提示。只有业务实际支持持久化草稿时才提供“保存草稿”，保存失败继续保留输入。此处是推荐行为，未实现弹窗或后端。

状态表达采用[状态规则](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/status-presentation.md)。设置分类宽200与504堆叠条件只是独立审查试排建议，未纳入R1或本版推荐值；分类宽与收起点按业务内容预算确定。

## 看板：Screen 优先与分层几何

本节采用 A.md 第六节已批准草案；以下路径/行号为审计时源码锚点，数值按默认根字号16px推导，本轮未做浏览器实测。源码变动时重新核对，不把行号当永久 API。D/ 指 src/app/templates/(dashboards)/dashboards/。

### 1. 适用、主模板与证据字段

1. 每个看板先选一个Screen作为视觉主对照，不跨多个模板任意拼密度。基准优先analytics；需要窄侧区+宽业务区时选finance-3；不是所有业务必须四个KPI。
2. 必填：Screen路径及版本/工作树、页面目标、KPI→实际业务入口、每行轨道/跨度/重排断点、section gap、Grid gap、卡内padding/gap、图表绘图区高度、整卡高度归属、文本层级、局部滚动、侧栏状态与内容净宽。
3. 每个尺寸标“源码现状 / 公式推导 / 设计提案 / 未核实”。最终补主模板与业务页同viewport/同侧栏状态的并排截图；实际Computed Style与源码推导不符时先查宿主spacing/font/CSS覆盖，不反向把截图像素硬写成Token。

### 2. 数值基线（不得把section gap与Grid gap混用）

| 层级/部位 | 基线 / 响应式规则 | 源码出处 |
|---|---|---|
| 页面外壳内容padding | base `p-4`=16px；sm起 `p-5`=20px；页面不再叠一份 | `core/src/components/layouts/app-layout.tsx:863` |
| 看板页面组件纵向间距 | 外层 `flex flex-col gap-5`=20px | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:183`；`src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:135` |
| Grid内部行/列gap | 默认16px，不继承section的20px | `core/src/components/layouts/grid.tsx:43`；analytics的Grid未显式改gap，见`:194`、`:202`、`:238`、`:297` |
| KPI行 | base1列、sm2列、lg4等分；卡 `width="full"`、size=wide | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:194` 至`:198` |
| 主图+辅助块 | base依DOM顺序全宽堆叠；lg默认12轨道中的8:4 | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:202`、`:203`、`:214` |
| 次级三列 | base1列；lg3等分 | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:238` |
| 底部两列 | base1列；lg2等分 | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:297` |
| finance-3主结构 | base1列；lg4轨道，左span1、右span3；列gap16px | `src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:137`、`:139`、`:199` |
| finance-3右区内嵌行 | 独立3轨道，2:1；不是整页再次2:1 | `src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:251`、`:253`、`:277` |
| 标题型图表/表格卡壳 | `rounded-3xl bg-background border border-fg-grey-200 p-4 flex flex-col gap-4`；即padding16、卡内gap16、圆角24px（默认换算） | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:203`、`:298`、`:317`；`src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:201` |
| compact KPI | padding16、内部gap12；density="compact" 同时控制字级/行高/子图高度，不能只改padding就说同密度 | core 中对应组件的 density="compact" |
| compact Balance/Image | Balance padding16/gap12；Image padding16/gap16 | core 中对应组件的 density="compact" |
| compact ListGroup | header左右/上16；body左右/上下16，条目gap12 | core 中对应组件的 density="compact" |
| compact Highlight特例 | `h-96`=384px，padding16/gap12；只适用该组件，不推广到所有卡 | core 中对应组件的 density="compact" |
| analytics主图绘图区 | `heightClass="h-56"`=224px；不是整卡高度 | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:210`；`core/src/components/ui/charts/dashboard-charts.tsx:117`、`:129` |
| finance-3上下柱图绘图区 | `heightClass="h-56"`=224px；标题/指标行另计 | `src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:239` 至`:246` |
| 主图纵轴槽 | 44px+剩余图域，轴与图gap12；图内还有pt-8等留量，不等于所有图都用44px轴 | `core/src/components/ui/charts/dashboard-charts.tsx:129`、`:136` |
| 断点 | sm640、md768、lg1024、xl1280、2xl1536；均是视口断点，不是净内容宽 | `core/src/styles/tokens.css:615`、`:626`、`:637`、`:648`、`:659` |

### 3. 几何公式与线框标注

设 `C` 为**扣除AppLayout侧栏与页面padding后**的看板内容净宽，`g=16px`。以下为公式推导，不是截图实测：

- 四等分卡宽：`(C-3g)/4`；三等分：`(C-2g)/3`；两等分：`(C-g)/2`。不足以容纳真实标题/指标/操作时按模板断点堆叠，不给卡片另定固定宽去反挤容器。
- **12轨道8:4不是简单先扣一个gap再乘2/3**：单轨 `t=(C-11g)/12`，主区 `8t+7g`，辅区 `4t+3g`，二者之间另有一个g。GridItem是跨轨道含中间gap，保持与真实Grid计算一致。
- finance-3四轨1+3：`t=(C-3g)/4`；左区`t`、右区`3t+2g`，区间gap另计g。右区嵌套3轨独立以其自身净宽计算。
- 图表卡高不指定一个“全站统一值”：整卡由上下padding、标题/指标/图例/绘图区及内部gap组成。224px只锁定对应图组件wrapper；文字换行、图例、提示层会影响整卡/可见区域。整卡实际高度未浏览器核实时标**未核实**。
- 图内至少标出：外壳padding16/20、section gap20、Grid gap16、卡padding16、卡内gap12或16、图域224、响应式跨度。不要用一条“页面gap24”覆盖全部层级。
- `--radius-card=20px` 与模板 `rounded-3xl=24px`并存：本草案记录模板24px现状，**不授权修改全局Token**。待Panel组件立项再决定模板兼容方式。

### 已实现的看板组件与页面组件

- 外壳：AppLayout；面板：Panel（dashboard/template），SurfaceCard 保持原 API。
- 密度：StatCard、ProgressStatCard、LineChartStatCard、BarChartStatCard、WheelChartStatCard、BalanceCard、ImageStatCard、HighlightCard、ListGroup 使用 density="compact"；不再依赖模板 !important。默认密度不变。
- 图表：ChartHeader、ChartMetricRow、GroupedBarChart、DivergingBarChart；目标：WalletGoalCard。
- 17 类可复制 Block 的实现名、目录和支持边界见 [Blocks](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md)，不要从 core import Block。
- 以上为实现状态；前后像素一致须独立验收，当前环境未完成截图，不将尺寸公式当实测。

---

Source: skills/forge-skill/references/screens.md

# 全部模板 Screen 目录

以下为仓内实际页面，不承诺样例数据具有业务后端。先选最接近任务的一个作风格基准，再改内容与路由。

## 如何本地预览模板

在用户授权的 Forge 主仓 checkout 中运行（不要在 starter 目录运行模板服务）：

```sh
export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH
corepack pnpm dev --hostname 127.0.0.1 --port 3219
```

如依赖未安装，先 `corepack pnpm install --frozen-lockfile`。打开 `http://127.0.0.1:3219/templates/dashboards/ecommerce-3`；analytics 为 `/templates/dashboards/analytics`，项目成员页为 `/templates/project-template/members`。路由分组 `(dashboards)` 不进入 URL。完整路由可运行 `node skills/forge-skill/scripts/list.mjs templates`。

生产预览可先 `corepack pnpm build`，再 `corepack pnpm start --hostname 127.0.0.1 --port 3219`，只在本地监听，不发布。starter 的业务页与 Forge 模板是两个服务：对照时保持同视口、侧栏状态与字号，复用已有 Chrome，不启动系统 Chrome 新 profile。端口被占用时核对服务归属，不能杀其他任务；结束只停止自己创建的服务。没有可运行的源码/服务或浏览器权限时，报告未验证，静态源码不能冒充视觉验收。

| Screen | 适用场景 | 源码 |
|---|---|---|
| analytics | 经营指标、趋势与辅助分析 | src/app/templates/(dashboards)/dashboards/analytics/page.tsx |
| crm | 客户与销售概览 | src/app/templates/(dashboards)/dashboards/crm/page.tsx |
| ecommerce-1 | 电商经营概览 | src/app/templates/(dashboards)/dashboards/ecommerce-1/page.tsx |
| ecommerce-2 | 电商数据与明细并列 | src/app/templates/(dashboards)/dashboards/ecommerce-2/page.tsx |
| ecommerce-3 | 多维电商经营与渠道分析 | src/app/templates/(dashboards)/dashboards/ecommerce-3/page.tsx |
| finance-1 | 财务概览 | src/app/templates/(dashboards)/dashboards/finance-1/page.tsx |
| finance-2 | 账户与交易分析 | src/app/templates/(dashboards)/dashboards/finance-2/page.tsx |
| finance-3 | 窄侧栏加宽财务主区 | src/app/templates/(dashboards)/dashboards/finance-3/page.tsx |
| project-1 | 项目进展与协作概览 | src/app/templates/(dashboards)/dashboards/project-1/page.tsx |
| project-2 | 项目任务与资源概览 | src/app/templates/(dashboards)/dashboards/project-2/page.tsx |

具体布局与尺寸见 [页面规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md)；页面组件抽取状态见 [Blocks](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md)。

## 实现分层

十个页面已直接使用 AppLayout；卡壳用 Panel，页面组件从 blocks/ 复制。原 dashboard-density、DashboardShell、Figma 前缀图表与私有 WalletGoalCard 已删除；公共图表与密度 API 见 [Blocks](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md)。

这是源码迁移状态，不是截图验收结论：须逐页比较 1440 与 375 两档、同字体/侧栏/固定数据的前后截图，记录不同尺寸或有意差异，不能用 build 代替。

## 全部业务与工作区 Screens

以下 74 个页面源码与前述 10 个看板及看板入口共同构成 85 个 Screen。看板入口 `/templates/dashboards` 的源码为 `src/app/templates/(dashboards)/dashboards/page.tsx`。路由组不进入 URL；示例路径使用各模板 mock 中存在的 ID。认证页仅演示界面，创建/编辑和协作默认使用本地数据，不代表已接入后台。

### ecommerce

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/ecommerce/categories` | `/templates/ecommerce/categories` | src/app/templates/(dashboard)/ecommerce/categories/page.tsx |
| `/templates/ecommerce/categories/[id]` | `/templates/ecommerce/categories/1`、`/templates/ecommerce/categories/new` | src/app/templates/(dashboard)/ecommerce/categories/[id]/page.tsx |
| `/templates/ecommerce/categories/[id]/edit` | `/templates/ecommerce/categories/1/edit` | src/app/templates/(dashboard)/ecommerce/categories/[id]/edit/page.tsx |
| `/templates/ecommerce/categories/new` | `/templates/ecommerce/categories/new` | src/app/templates/(dashboard)/ecommerce/categories/new/page.tsx |
| `/templates/ecommerce/customers` | `/templates/ecommerce/customers` | src/app/templates/(dashboard)/ecommerce/customers/page.tsx |
| `/templates/ecommerce/customers/[id]` | `/templates/ecommerce/customers/1` | src/app/templates/(dashboard)/ecommerce/customers/[id]/page.tsx |
| `/templates/ecommerce/orders` | `/templates/ecommerce/orders` | src/app/templates/(dashboard)/ecommerce/orders/page.tsx |
| `/templates/ecommerce/orders/[id]` | `/templates/ecommerce/orders/1`、`/templates/ecommerce/orders/new` | src/app/templates/(dashboard)/ecommerce/orders/[id]/page.tsx |
| `/templates/ecommerce/orders/[id]/invoice` | `/templates/ecommerce/orders/1/invoice` | src/app/templates/(dashboard)/ecommerce/orders/[id]/invoice/page.tsx |
| `/templates/ecommerce/orders/new` | `/templates/ecommerce/orders/new` | src/app/templates/(dashboard)/ecommerce/orders/new/page.tsx |
| `/templates/ecommerce/products` | `/templates/ecommerce/products` | src/app/templates/(dashboard)/ecommerce/products/page.tsx |
| `/templates/ecommerce/products/[id]` | `/templates/ecommerce/products/1`、`/templates/ecommerce/products/new` | src/app/templates/(dashboard)/ecommerce/products/[id]/page.tsx |
| `/templates/ecommerce/products/[id]/edit` | `/templates/ecommerce/products/1/edit` | src/app/templates/(dashboard)/ecommerce/products/[id]/edit/page.tsx |
| `/templates/ecommerce/products/new` | `/templates/ecommerce/products/new` | src/app/templates/(dashboard)/ecommerce/products/new/page.tsx |
| `/templates/ecommerce/sellers` | `/templates/ecommerce/sellers` | src/app/templates/(dashboard)/ecommerce/sellers/page.tsx |
| `/templates/ecommerce/sellers/[id]` | `/templates/ecommerce/sellers/1` | src/app/templates/(dashboard)/ecommerce/sellers/[id]/page.tsx |

### agent

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/agent` | `/templates/agent` | src/app/templates/agent/page.tsx |

### crm-template

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/crm-template` | `/templates/crm-template` | src/app/templates/crm-template/page.tsx |
| `/templates/crm-template/activity` | `/templates/crm-template/activity` | src/app/templates/crm-template/activity/page.tsx |
| `/templates/crm-template/customers` | `/templates/crm-template/customers` | src/app/templates/crm-template/customers/page.tsx |
| `/templates/crm-template/customers/[id]` | `/templates/crm-template/customers/john-bushmill`、`/templates/crm-template/customers/new` | src/app/templates/crm-template/customers/[id]/page.tsx |
| `/templates/crm-template/customers/new` | `/templates/crm-template/customers/new` | src/app/templates/crm-template/customers/new/page.tsx |
| `/templates/crm-template/forgot-password` | `/templates/crm-template/forgot-password` | src/app/templates/crm-template/forgot-password/page.tsx |
| `/templates/crm-template/leads` | `/templates/crm-template/leads` | src/app/templates/crm-template/leads/page.tsx |
| `/templates/crm-template/leads/[id]` | `/templates/crm-template/leads/lead-john-bushmill`、`/templates/crm-template/leads/new` | src/app/templates/crm-template/leads/[id]/page.tsx |
| `/templates/crm-template/leads/new` | `/templates/crm-template/leads/new` | src/app/templates/crm-template/leads/new/page.tsx |
| `/templates/crm-template/overview` | `/templates/crm-template/overview` | src/app/templates/crm-template/overview/page.tsx |
| `/templates/crm-template/register` | `/templates/crm-template/register` | src/app/templates/crm-template/register/page.tsx |
| `/templates/crm-template/reset-password` | `/templates/crm-template/reset-password` | src/app/templates/crm-template/reset-password/page.tsx |
| `/templates/crm-template/sales` | `/templates/crm-template/sales` | src/app/templates/crm-template/sales/page.tsx |
| `/templates/crm-template/sales/[id]` | `/templates/crm-template/sales/sales-web-redesign-1`、`/templates/crm-template/sales/new` | src/app/templates/crm-template/sales/[id]/page.tsx |
| `/templates/crm-template/sales/new` | `/templates/crm-template/sales/new` | src/app/templates/crm-template/sales/new/page.tsx |

### dashboard-builder

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/dashboard-builder` | `/templates/dashboard-builder` | src/app/templates/dashboard-builder/page.tsx |
| `/templates/dashboard-builder/[variant]` | `/templates/dashboard-builder/light-topbar`、`/templates/dashboard-builder/light-sidebar`、`/templates/dashboard-builder/purple-topbar`、`/templates/dashboard-builder/purple-sidebar`、`/templates/dashboard-builder/blue-topbar`、`/templates/dashboard-builder/blue-sidebar`、`/templates/dashboard-builder/black-topbar`、`/templates/dashboard-builder/black-sidebar` | src/app/templates/dashboard-builder/[variant]/page.tsx |

### finance-template

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/finance-template` | `/templates/finance-template` | src/app/templates/finance-template/page.tsx |
| `/templates/finance-template/cards` | `/templates/finance-template/cards` | src/app/templates/finance-template/cards/page.tsx |
| `/templates/finance-template/forgot-password` | `/templates/finance-template/forgot-password` | src/app/templates/finance-template/forgot-password/page.tsx |
| `/templates/finance-template/invoices` | `/templates/finance-template/invoices` | src/app/templates/finance-template/invoices/page.tsx |
| `/templates/finance-template/invoices/[id]` | `/templates/finance-template/invoices/inv302012-lisa-greg`、`/templates/finance-template/invoices/new` | src/app/templates/finance-template/invoices/[id]/page.tsx |
| `/templates/finance-template/invoices/new` | `/templates/finance-template/invoices/new` | src/app/templates/finance-template/invoices/new/page.tsx |
| `/templates/finance-template/overview` | `/templates/finance-template/overview` | src/app/templates/finance-template/overview/page.tsx |
| `/templates/finance-template/register` | `/templates/finance-template/register` | src/app/templates/finance-template/register/page.tsx |
| `/templates/finance-template/reset-password` | `/templates/finance-template/reset-password` | src/app/templates/finance-template/reset-password/page.tsx |
| `/templates/finance-template/transactions` | `/templates/finance-template/transactions` | src/app/templates/finance-template/transactions/page.tsx |
| `/templates/finance-template/wallets` | `/templates/finance-template/wallets` | src/app/templates/finance-template/wallets/page.tsx |
| `/templates/finance-template/wealth` | `/templates/finance-template/wealth` | src/app/templates/finance-template/wealth/page.tsx |

### micellaneous-template

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/micellaneous-template` | `/templates/micellaneous-template` | src/app/templates/micellaneous-template/page.tsx |
| `/templates/micellaneous-template/actions` | `/templates/micellaneous-template/actions` | src/app/templates/micellaneous-template/actions/page.tsx |
| `/templates/micellaneous-template/calendar` | `/templates/micellaneous-template/calendar` | src/app/templates/micellaneous-template/calendar/page.tsx |
| `/templates/micellaneous-template/chat` | `/templates/micellaneous-template/chat` | src/app/templates/micellaneous-template/chat/page.tsx |
| `/templates/micellaneous-template/files` | `/templates/micellaneous-template/files` | src/app/templates/micellaneous-template/files/page.tsx |
| `/templates/micellaneous-template/forgot-password` | `/templates/micellaneous-template/forgot-password` | src/app/templates/micellaneous-template/forgot-password/page.tsx |
| `/templates/micellaneous-template/register` | `/templates/micellaneous-template/register` | src/app/templates/micellaneous-template/register/page.tsx |
| `/templates/micellaneous-template/reset-password` | `/templates/micellaneous-template/reset-password` | src/app/templates/micellaneous-template/reset-password/page.tsx |

### 模板入口

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates` | `/templates` | src/app/templates/page.tsx |

### project-template

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/project-template` | `/templates/project-template` | src/app/templates/project-template/page.tsx |
| `/templates/project-template/clients` | `/templates/project-template/clients` | src/app/templates/project-template/clients/page.tsx |
| `/templates/project-template/clients/[id]` | `/templates/project-template/clients/mary` | src/app/templates/project-template/clients/[id]/page.tsx |
| `/templates/project-template/files` | `/templates/project-template/files` | src/app/templates/project-template/files/page.tsx |
| `/templates/project-template/invoices` | `/templates/project-template/invoices` | src/app/templates/project-template/invoices/page.tsx |
| `/templates/project-template/members` | `/templates/project-template/members` | src/app/templates/project-template/members/page.tsx |
| `/templates/project-template/members/[id]` | `/templates/project-template/members/linda` | src/app/templates/project-template/members/[id]/page.tsx |
| `/templates/project-template/overview` | `/templates/project-template/overview` | src/app/templates/project-template/overview/page.tsx |
| `/templates/project-template/projects` | `/templates/project-template/projects` | src/app/templates/project-template/projects/page.tsx |
| `/templates/project-template/projects/[id]` | `/templates/project-template/projects/alpha` | src/app/templates/project-template/projects/[id]/page.tsx |
| `/templates/project-template/tasks/[id]` | `/templates/project-template/tasks/marketing-partnership` | src/app/templates/project-template/tasks/[id]/page.tsx |

### task-board

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/task-board` | `/templates/task-board` | src/app/templates/task-board/page.tsx |
| `/templates/task-board/agents` | `/templates/task-board/agents` | src/app/templates/task-board/agents/page.tsx |
| `/templates/task-board/agents/[agent]` | `/templates/task-board/agents/research` | src/app/templates/task-board/agents/[agent]/page.tsx |
| `/templates/task-board/library` | `/templates/task-board/library` | src/app/templates/task-board/library/page.tsx |
| `/templates/task-board/projects` | `/templates/task-board/projects` | src/app/templates/task-board/projects/page.tsx |
| `/templates/task-board/projects/[project]` | `/templates/task-board/projects/%E5%93%81%E7%89%8C%E7%84%95%E6%96%B0%E8%AE%A1%E5%88%92` | src/app/templates/task-board/projects/[project]/page.tsx |
| `/templates/task-board/tasks` | `/templates/task-board/tasks` | src/app/templates/task-board/tasks/page.tsx |
| `/templates/task-board/today` | `/templates/task-board/today` | src/app/templates/task-board/today/page.tsx |

## 复用与本地边界

- ecommerce：公开 core 控件、Panel / InfoRow 与模板共用弹窗；订单、商品、分类、客户和物流的 mock、字段规则与路由适配保留本地。
- crm-template：crm-summary Block 承担摘要与趋势，客户/线索/销售状态和活动演示保留本地。
- project-template：KpiMetrics / ProjectSection Blocks；项目、客户、成员、任务与甘特演示模型保留本地，品牌色集中在 `_mock-palette.ts`。
- finance-template：finance-workspace Block；账单/钱包/财富路由和 mock 保留本地。
- task-board：core SurfaceCard、Board、TaskCard 及各业务控件；任务存储、拖拽、工作区上下文、编辑器和协作演示保留本地，不冒充通用 Block。
- micellaneous-template：TemplateSurface Block；日历、聊天、文件和表格操作使用 core，页面导航、样例数据与本地状态保留。
- agent：ConversationHeader Block；AgentTurn、样例来源、流式演示与会话存储保留本地。
- dashboard-builder：core AppLayout，画廊使用 Panel custom/asChild 保留 Next Link 根节点；8 个变体的路由元数据保留本地。
- `_shared`：Panel / InfoRow 直接转出 core；Modal 仅保留 onClose 接口适配；Protask 身份、mock 筛选、活动/认证演示不进入 core。

以上为源码适配事实；1440/375 的前后截图、真实点击、移动端与辅助技术验收仍需逐条补齐，不以静态检查替代。

---

Source: skills/forge-skill/references/status-presentation.md

# 状态表达

业务状态默认采用安装版本的 **soft StatusBadge**（variant="soft"），同时提供清楚的状态文字；颜色只辅助语义。成功/完成用 green，失败/危险用 red，待处理/警示用 yellow，进行中/信息用 blue，中性用 grey；精确可选值以生成 Props 为准。

分类、角色、渠道、标签默认普通文字，不把每列都做成彩色胶囊。单张表通常最多一个状态胶囊列；多个独立状态必须说明业务需要和主次关系。实体身份列优先可识别名称与真实详情入口。

不要用 solid 状态徽章、彩虹分类或自制圆角 pill 替代默认规范；特殊视觉需求先说明依据并获得确认。徽章不是可点击按钮，状态改变需要实际动作、权限和反馈。历史截图里的胶囊只记录现状，不自动成为推荐。

完整验收见 [V6、C5、H7](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)。

---

Source: skills/forge-skill/references/surface-card.md

# SurfaceCard 与标题 Panel 边界

SurfaceCard 已从当前 core 主入口间接导出，Props 和类型见 [生成 API](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/components/surface-card.md)，不要仅 grep 根 index.ts 就判定未导出。它提供中性内容容器，不自动等于后续计划中的模板风格通用标题 Panel。

按任务选真实 Screen：ecommerce-2 的表格卡壳是有效模板现状。不要把 ChartCard 伪装非图表面板，也不要把 SurfaceCard 的现有 API 宣称为已完成所有目标 Panel 契约。新增公共 API 时记录 FORGE-GAP 并等待决定，本阶段不修改 core。

参阅 [Blocks 计划](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md) 与 [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)。

---

Source: skills/forge-skill/references/templates/auth.md

# 认证页面

主仓没有独立的 src/app/templates/auth/ 套件；crm-template 等业务模板内的 register/forgot-password/reset-password 是演示，不能当作真实认证实现。不要引用不存在的 templates/auth/sign-in、sign-up 等路径。

认证接入应只读核对 forge-starter 当前真实路由，再按其 session/权限约定实施。使用 TextField、Checkbox、Button、StyledLink；明确校验、等待、错误与成功跳转。真实会话、权限与安全接入需单独验收，外观不等于后端安全能力。

---

Source: skills/forge-skill/references/templates/business.md

# 业务模板 — templates/ecommerce

电商后台参考骨架，以下5个模块；具体列表/详情/新建路径必须用脚本枚举，不能假设每个模块完全相同：

| 模块 | 路径 |
|---|---|
| categories | `src/app/templates/(dashboard)/ecommerce/categories/` |
| customers | `src/app/templates/(dashboard)/ecommerce/customers/` |
| orders | `src/app/templates/(dashboard)/ecommerce/orders/` |
| products | `src/app/templates/(dashboard)/ecommerce/products/` |
| sellers | `src/app/templates/(dashboard)/ecommerce/sellers/` |

每模块结构：

```
<module>/
├── page.tsx          # 列表
├── [id]/
│   └── page.tsx      # 详情
└── new/
    └── page.tsx      # 新建
```

## 新业务接入

1. 选最接近的模块 copy（如 orders 适合"订单类业务"）
2. 改路由目录名 + page 里的字段和接口
3. 复用模板页头、工具带与表格/表单骨架；宿主已有 AppLayout 时不再嵌套
4. 优先替换业务数据；结构有必要变化时说明业务依据并对照统一清单

---

Source: skills/forge-skill/references/tokens.md

# Forge Design Tokens — quick reference

Snapshot of `@forge-ui-official/core/styles.css`. When picking a color, pick a semantic alias first (`accent`, `text-muted`, `border`); reach for raw primitives (`fg-violet-500`) only when none fit.

Tailwind usage: `bg-fg-violet-500` / `text-fg-grey-700` / `border-fg-grey-200`. CSS: `var(--fg-violet)` / `var(--accent)`.

## Primitive palette (`--fg-*`)

The 7 color families plus grey and white share the same 10-shade scale. Aliases point at `500`.

### Violet (optional theme — alias `--fg-violet`)
| Shade | Hex | Typical use |
|---|---|---|
| 50 | `#F1EBFD` | soft background for violet surfaces |
| 100 | `#D3C2F8` | chip / tag background |
| 200 | `#BEA4F5` | |
| 300 | `#A17AF1` | |
| 400 | `#8E61EE` | |
| **500** | `#7239EA` | **primary brand** |
| 600 | `#6834D5` | hover |
| 700 | `#5128A6` | deep surfaces |
| 800 | `#3F1F81` | |
| 900 | `#301862` | high-contrast text on violet |

### Blue
| Shade | Hex |
|---|---|
| 50 | `#EBEEFF` |
| 100 | `#C0CAFF` |
| 200 | `#A2B0FF` |
| 300 | `#788CFF` |
| 400 | `#5D75FF` |
| **500** | `#3553FF` |
| 600 | `#304CE8` |
| 700 | `#263BB5` |
| 800 | `#1D2E8C` |
| 900 | `#16236B` |

### Green
| Shade | Hex |
|---|---|
| 50 | `#E6F8F0` |
| 100 | `#B3E9D2` |
| 200 | `#8EDFBC` |
| 300 | `#5AD09D` |
| 400 | `#3AC78A` |
| **500** | `#09B96D` |
| 600 | `#08A863` |
| 700 | `#06834D` |
| 800 | `#05663C` |
| 900 | `#044E2E` |

### Red (alias `--fg-red`)
| Shade | Hex |
|---|---|
| 50 | `#FFEDE9` |
| 100 | `#FFC7BB` |
| 200 | `#FFAC9A` |
| 300 | `#FE866C` |
| 400 | `#FE6E4F` |
| **500** | `#FE4A23` |
| 600 | `#E74320` |
| 700 | `#B43519` |
| 800 | `#8C2913` |
| 900 | `#6B1F0F` |

### Yellow (alias `--fg-yellow`)
| Shade | Hex |
|---|---|
| 50 | `#FEF9E6` |
| 100 | `#FCEBB1` |
| 200 | `#FBE28B` |
| 300 | `#F9D555` |
| 400 | `#F8CD35` |
| **500** | `#F6C002` |
| 600 | `#E0AF02` |
| 700 | `#AF8801` |
| 800 | `#876A01` |
| 900 | `#675101` |

### Cyan
| Shade | Hex |
|---|---|
| 50 | `#ECFAFB` |
| 100 | `#C5F0F3` |
| 200 | `#A9E8ED` |
| 300 | `#81DEE4` |
| 400 | `#69D8DF` |
| **500** | `#43CED7` |
| 600 | `#3DBBC4` |
| 700 | `#309299` |
| 800 | `#257176` |
| 900 | `#1C575A` |

### Black (alias `--fg-black`)
⚠ `fg-black-500` is `#000A19`, not pure `#000`. The whole scale is a cool near-black range for text + deep backgrounds.

| Shade | Hex |
|---|---|
| 50 | `#E6E7E8` |
| 100 | `#B0B3B8` |
| 200 | `#8A8E95` |
| 300 | `#545B65` |
| 400 | `#333B47` |
| **500** | `#000A19` |
| 600 | `#000917` |
| 700 | `#000712` |
| 800 | `#00060E` |
| 900 | `#00040B` |

### Grey
| Shade | Hex |
|---|---|
| 50 | `#FAFAFA` |
| 100 | `#EBEBEB` |
| 200 | `#E1E1E1` |
| 300 | `#D3D3D3` |
| 400 | `#CACACA` |
| 500 | `#BDBDBD` |
| 600 | `#ACACAC` |
| 700 | `#868686` |
| 800 | `#686868` |
| 900 | `#4F4F4F` |

Default muted icon color: `#71717A` (slightly bluer than `fg-grey-700`, standardized across the Kit).

### White
`--fg-white` = `#FFFFFF`.

---

## Semantic tokens (light theme — defaults)

Always prefer these over primitives when the meaning matches.

| Token | Value | Use for |
|---|---|---|
| `--background` | `fg-white` | page background |
| `--foreground` | `fg-black` | primary text / icon on background |
| `--surface` | `fg-grey-50` | raised card background |
| `--surface-foreground` | `fg-black` | text on surface |
| `--overlay` | `rgba(0,10,25,0.40)` | modal scrim |
| `--accent` | `fg-blue` | primary action |
| `--accent-foreground` | `fg-white` | text on accent |
| `--accent-soft` | `fg-blue-100` | soft accent background |
| `--accent-soft-foreground` | `fg-blue` | text on soft accent |
| `--text-primary` | `fg-black` | body text |
| `--text-secondary` | `fg-grey-900` | secondary text |
| `--text-muted` | `fg-grey-700` | muted text, helper text |
| `--text-disabled` | `fg-grey-500` | disabled text |
| `--border` | `fg-grey-200` | default border / divider |
| `--border-muted` | `fg-grey-100` | softer divider |
| `--divider` | `fg-grey-200` | horizontal rules |
| `--danger` | `fg-red` | destructive action |
| `--danger-foreground` | `fg-white` | text on danger |
| `--warning` | `fg-yellow` | warning state |
| `--warning-foreground` | `fg-black` | text on warning |
| `--warning-soft` | `fg-yellow-50` | soft warning background |
| `--warning-muted` | `fg-yellow-600` | warning text |
| `--focus` | `fg-blue` | focus ring |
| `--hover` | `fg-grey-100` | hover background |

## Dark mode

Set `data-theme="dark"` on `<html>` (or on any container; a nested `data-theme="light"` restores light). Dark mode redefines the grey, black and color primitives, so `bg-fg-grey-*`, `text-fg-black` and `text-fg-grey-*` keep working without changes.

- Surfaces (cards, panels, inputs, popovers): `bg-background`. Page background: `bg-fg-grey-50` or `bg-surface`. Do not use `bg-white` / `bg-fg-white` for surfaces — they stay white in dark.
- Keep `bg-white` only for things that must stay white on a colored fill (switch knob, dot inside a checked radio, white pill on a colored sidebar).
- `bg-fg-black` fills (dark buttons, tooltips, black cards) stay dark in dark mode via `--fg-black-fill`, so white text on them is fine. `text-fg-black` flips to the light ink.
- Colored text (`text-fg-blue`, `text-fg-green`…) switches to a lighter shade automatically; `bg-fg-*-50/100/200` tints become dark tints; 700–900 text steps become light.
- In CSS, never hard-code `#fff` / `white` as a background; use `var(--background)`. Mixing a tint: `color-mix(in srgb, var(--fg-blue) 8%, var(--background))`.
- Brand themes from forgeui.org/docs/theme include the matching dark scale.

## Shape + elevation

| Token | Value | Use |
|---|---|---|
| `--radius-card` | `20px` | card / modal corner |
| `--radius-xs` | `4px` | tight corner (input) |
| `--shadow-subtle` | `0px 4px 30px 0px rgba(102,112,133,0.03)` | whisper-soft |
| `--shadow-card` | `0px 4px 30px 0px rgba(77,84,100,0.05)` | default card |
| `--shadow-elevated` | `0px 4px 30px 0px rgba(77,84,100,0.20)` | popover / modal |

## Type

| Token | Value |
|---|---|
| `--font-sans` | Manrope (body) |
| `--font-display` | Plus Jakarta Sans (headings) |
| `--text-display-l` | `28px` |
| `--text-2xs` | `10px` |
| `--tracking-fg` | `0.5px` (standard letter-spacing for Forge) |

Tailwind utility for the standard letter-spacing: `tracking-fg`.

## 中文应用约定

先按文本、背景、边框、焦点语义选择 token；图表颜色保持指标语义一致，不用颜色制造无业务意义的分类。内容区跟随父容器，页面 padding 由 AppLayout 负责。

## 默认主题与名称映射

默认 accent/focus 是 **blue**，依据 core/src/styles/tokens.css:185–241；purple/black 是可选主题，不是所有页面的默认。7 个色族为 violet、blue、green、red、yellow、cyan、black，另有 grey 与 white。CSS token `fg-violet` 对应组件 color prop `"purple"`；二者是不同命名层，不要写 color="violet"。主题继承宿主，未授权不修改全局 Token。

---

Source: skills/forge-skill/references/workflow.md

# 页面工作流

1. 明确授权范围、用户、对象、任务与页面角色。
2. 选择真实 Screen；确认安装版本的 Components 和计划 Blocks 边界。
3. 按页面规范作结构/尺寸决策，再实现真实数据与操作，不编造后端成功。
4. 对能力缺口提出 FORGE-GAP，等待决定。
5. 按 [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md) 记录证据与未验证项。

规范入口是本包 SKILL.md；不依赖外部资产 registry 或维护者图册流水。

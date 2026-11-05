# 页面 Blocks（复制到项目）

17 类区块已实现为仓内源码与 registry-item，覆盖看板与业务模板；不是 core 包导出，也不意味着已发布或通过截图验收。

| 区块 | 导出名 | 源码目录 | 支持内容 |
|---|---|---|---|
| KPI 指标行 | KpiMetrics / FinanceMetricCard | blocks/kpi-metrics/ | metrics 或 children，compact 指标卡 |
| 最近记录表卡 | RecentRecords | blocks/recent-records/ | Panel + 泛型 DataTable，或 children |
| 趋势图表卡 | TrendChart | blocks/trend-chart/ | Panel + GroupedBarChart，或图域插槽 |
| 排行列表卡 | RankingList | blocks/ranking-list/ | ListGroup 的 items/tabs/action，默认 compact |
| 构成占比卡 | CompositionCard | blocks/composition-card/ | Panel + DonutChart，或 children |
| 页头 | DashboardHeader | blocks/dashboard-header/ | title/description/action 或原始标题内容 |
| 地区分布卡 | RegionDistribution | blocks/region-distribution/ | MapCard 的地区、范围、度量 |
| 成员列表 | MemberList | blocks/member-list/ | UserCard 成员数据或自定义 items |
| 目标进度列表 | GoalProgressList / WalletProgressPanel | blocks/goal-progress-list/ | WalletGoalCard 列表 / 财务储蓄面板 |
| 活动流 | ActivityFeed | blocks/activity-feed/ | ActivityCard 事件或自定义 items |
| 日程/甘特 | ScheduleCard / GanttSchedule | blocks/schedule-card/ | FullCalendar、六时段只读 GanttSchedule 或 children；不提供甘特编辑器 |
| 卡片轮播 | CardCarousel | blocks/card-carousel/ | CreditCard 数据、受控/非受控页码、可选翻页 |
| 客户经营摘要 | CrmSurface / CrmStat / DetailLine / CrmMetricCard | blocks/crm-summary/ | 客户分区、指标与趋势；业务文案和操作由宿主传入 |
| 财务工作区 | FinanceSurface / FieldLine / VisualCard / FinanceMetricCard / WalletProgressLine / FinanceGoalCell / FinanceTransactionCell / FinanceExpenseGauge / FinanceBudgetPanel | blocks/finance-workspace/ | 卡片主题、钱包进度、交易与预算，数据和回调由宿主提供 |
| 模板内容分区 | TemplateSurface | blocks/template-surface/ | 标题、说明、操作和内容；p-0 兼容原模板无内边距分区 |
| 对话标题栏 | ConversationHeader | blocks/conversation-header/ | 标题、工作区说明与操作插槽；不包含会话存储或流式请求 |
| 项目详情分区 | ProjectSection | blocks/project-section/ | 标题操作栏与紧凑内容区；className 从选定 Screen 保留 |

## 使用边界

- 画廊：`/blocks`（17 项均有预览）；公共 API 对照：`/cases/dashboard-kit`。来源为[完整 Screens](screens.md)。
- 源码只依赖 React、`@forge-ui-official/core` 及其公开 icons 子路径；配色只使用 fg-* Token（白色/透明基础色除外），不依赖站点私有组件。
- 生成：`corepack pnpm blocks:generate`；校验：`corepack pnpm blocks:check`。`public/r/index.json` 为目录，`public/r/<name>.json` 内嵌完整源码，安装目标为 `@components/blocks/<name>.tsx`（遵循用户 components.json 别名）。
- 依赖 core `^0.6.0`。本次只修改版本，不发布 npm 或网站；公网安装须等待发布授权。可先在本仓使用 workspace core、本地访问 registry。
- 本地示例：`npx shadcn@latest add http://localhost:3000/r/kpi-metrics.json`。宿主须已有 React 19、Tailwind 4、core 样式及 Token，复制后的文件由用户维护。沿用[安装说明](../SKILL.md)配置，不附带后台、数据请求、鉴权或持久化。
- API 以各目录 TSX 类型为准。插槽不会额外套内容容器；接入时保留 Screen 的轨道、className、图域高与 compact 密度。图片、文案、业务回调由宿主提供，未绑定回调不代表业务已实现。

## 公共组件决策

新增 `Panel`，不改变 `SurfaceCard`；dashboard 变体为圆角 24px/边框/padding16，template 变体兼容旧共享 Panel 的圆角 Token/outline/padding24。
`ChartHeader`、`ChartMetricRow`、`GroupedBarChart`、`DivergingBarChart` 归 charts；`WalletGoalCard` 归 core。
原 DashboardShell 只有 AppLayout 默认值，无独立抽象价值，Screens 直接用 AppLayout；财务轮播和特定储蓄面板归 Blocks，不扩大业务化 core API。

业务模板迁移新增 `FileInput` / `InfoRow` 及类型导出；Button 的 `unstyled` 不增加默认类名、图标或文字包装，适用于已验收的模板按钮。Panel 的 `custom` 保留原始几何，`as` 保留 section/aside/article 语义；`asChild` 仅允许 custom、单一子元素且无标题/页脚插槽，用于保留 Next Link 根节点。新页面应优先选标准变体，不以 custom 自由设计另一套卡片。Modal 的 `template` 保留标题和分割线，用共享 dialog 处理焦点与 Escape；窄屏最大宽高受视口约束，需单独比对。

## 验收状态

源码、类型、单测、registry 与构建检查分开记录；1440/375 的前后截图与像素 diff 是独立门禁。本次环境 Chromium 启动被 macOS sandbox MachPort 拒绝，不能把静态迁移或构建通过当成视觉一致性通过。重放脚本、基线源码和实际结果记录在 `/tmp/forge-impl/G-shots/`。

其余模板的 T 轮提供 81 条可访问路径作为外部基线输入；本轮未自行完成浏览器截图与像素验收。G 轮浏览器失败是历史记录，不代表本轮进行过同一尝试。图表和品牌演示色仅可保留在 mock 数据中；project 的品牌色集中在 `_mock-palette.ts`，不据此声称已完成视觉验收。

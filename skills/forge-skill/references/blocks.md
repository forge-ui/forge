# 页面组件（Blocks，复制到项目）

## 默认即 Screen 效果

以 ecommerce-2 为主对照时，KpiMetrics 数据入口默认首张 purple 主卡、其余白卡，并交替迷你折线/柱图；`visualization` 与 `data` 可逐指标替换，`variant="plain"` 才使用无图 StatCard。未提供 data 时迷你图仅是 core 的装饰性示意，不代表真实历史；生产数据须映射真实序列，不能从单个总数伪造趋势。

TrendChart 默认保留周期控件、带图标的指标行及 tooltip。`periods: [{label, chart?, countChart?}]` 每期传自己的真实数据，柱图与折线二选一；切换更新图、总数与 tooltip，受控模式由 activePeriod/onPeriodChange 管理。只传一个 chart 时只显示「本期」，不能伪造日/周/月切换；指标 value 可传业务口径，否则按输入序列求和。plain 才省略这些装饰。

RankingList 用 `entries: [{id,title,subtitle,value,avatar?,icon?,accent?}]`，未传 icon/accent 默认 Solar 商品图标与交替主题色；avatar 传首字母。默认 w-full，plain 为显式文字列表。items/children 是已验收 Screen 的完整插槽，不是推荐业务数据映射入口；使用插槽必须自行保留视觉元素，不能用 span 替代整张列表。

RegionDistribution 始终保留世界地图；地区传 name/salesLabel/value，可传 flag 图片或 ISO 两位 countryCode 自动生成旗帜；未知国家用名称缩写，不猜旗帜。中国大区等不对应国家的业务区域不要伪造国家映射。highlights 明确传入；默认高亮仅为展示示意，不代表地区业务统计。

CompositionCard 默认紫色起始配色与图例，segments 含 label/value，可覆盖颜色；plain 省略图例。DashboardHeader 保留 action/dateSelection/primaryAction 插槽，onExport 自动使用带下载图标的真实回调按钮；无授权或未接入操作时不显示假按钮，需在审计中注明原因。示例操作仅为接入边界，不声明导出已经实现。

最小配方见各单项生成文档与 `/r/index.json` 的 meta.example；结构化入口优先，其他 Screen 已验收的 children/items 插槽保持原输出。[表格列宽与数字对齐](component-selection/data-table.md) 适用于 RecentRecords。

74 个页面组件分为 11 类，已实现为仓内源码与 registry-item；不是 core 包导出，也不意味着已发布或通过截图验收。画廊 `/blocks` 可按分类筛选；每个 `/blocks/<name>` 提供同源 iframe 预览、1280px 桌面 / 390px 移动视口切换、完整代码、安装、用法、Props 与相关模板。预览路由 `/blocks/<name>/preview` 使用站点内的 AppLayout 外壳，按 registry.json 的 shell.menu / shell.active / shell.title 选择业务菜单、高亮项与顶栏标题；shell 为 none 时不显示后台外壳（认证类页面）；shell.with 指定窄卡页面并排展示的相关页面组件。菜单定义集中在站点 _shell.tsx，不进入安装源码。预览路由禁止索引，不进入 sitemap 与站内搜索；缩略图进入视口附近后才挂载。

| 分类 | 页面组件 | 导出名 | 源码目录 | 适用场景 |
|---|---|---|---|---|
| 看板首屏 | 经营概览 | OverviewDashboard | blocks/overview-dashboard/ | 将关键指标、收支趋势与收入构成集中在一个完整的经营首屏。 |
| 看板首屏 | 项目概览 | ProjectOverview | blocks/project-overview/ | 汇总项目进度、团队成员、里程碑与近期活动，掌握交付全貌。 |
| 看板首屏 | 财务概览 | FinanceOverview | blocks/finance-overview/ | 结合账户余额、收支趋势和储蓄目标，构建完整的财务工作台。 |
| 看板首屏 | 资产概览 | WealthOverview | blocks/wealth-overview/ | 总资产、现金与待收款趋势卡，配合企业卡与资金目标完成度。 |
| AI 与智能体 | 智能体工作台 | AiWorkspaceOverview | blocks/ai-workspace-overview/ | 智能体、知识库、工具与模型的资源概况，按 7/30/90 天切换的监控统计与用户、对话趋势。 |
| AI 与智能体 | 应用智能体目录 | AgentCatalog | blocks/agent-catalog/ | 左侧目录分组，按发布状态与复杂度筛选的智能体卡片，支持搜索、分页与从模板创建。 |
| AI 与智能体 | 智能体运行 | AgentRun | blocks/agent-run/ | 一次自主运行的实时过程：计划逐步推进、工具调用、发送前的人工确认与流式生成的草稿。 |
| AI 与智能体 | 任务执行详情 | TaskRunDetail | blocks/task-run-detail/ | 任务概要、带时间线的执行过程，以及可预览、下载、复制的结果产物。 |
| AI 与智能体 | 运行时管理 | RuntimeList | blocks/runtime-list/ | 智能体运行时的类型、在线状态与连接地址，支持单个检查与全部探测。 |
| AI 与智能体 | 消息渠道 | MessageChannels | blocks/message-channels/ | 把智能体接入企业微信、飞书、钉钉等渠道：渠道入口、已建连接卡片与绑定弹窗。 |
| AI 与智能体 | 自主智能体 | AutonomousAgents | blocks/autonomous-agents/ | 系统预置与我的自主智能体卡片，显示运行时与确认策略，一键运行并在最近任务中跟踪状态。 |
| AI 与智能体 | AI 助手首页 | AiAssistantHome | blocks/ai-assistant-home/ | 问候、已连接应用、带快捷操作的输入框与建议问题；提问后展示思考过程与流式回答。 |
| AI 与智能体 | 多智能体编排 | AgentOrchestration | blocks/agent-orchestration/ | 编排者拆分任务给多个子智能体：树状分工、调用时间线与选中智能体的调用明细，可回放。 |
| AI 与智能体 | 用量与成本 | AgentUsage | blocks/agent-usage/ | 本月花费对比预算、每日趋势，按项目或模型拆分成本，并列出值得关注的异常用量。 |
| AI 与智能体 | 提示词评测 | PromptEvals | blocks/prompt-evals/ | 按版本对比通过率、得分、延迟与成本，展示提示词改动和可筛选的测试用例结果。 |
| AI 与智能体 | 工作流编辑器 | WorkflowBuilder | blocks/workflow-builder/ | 左侧节点库、中间流程画布、右侧节点配置，可添加、编辑、删除节点并发布。 |
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
| 表单 | 商品编辑表单 | ProductForm | blocks/product-form/ | 基本信息、图片、价格、库存、规格与物流分区的商品表单，侧栏设置分类与上架状态。 |
| 表单 | 新建订单表单 | OrderForm | blocks/order-form/ | 商品、客户与配送三段式录单表单，带必填校验、金额实时计算与图片上传。 |
| 表单 | 新建发票表单 | InvoiceForm | blocks/invoice-form/ | 选择付款客户、填写收费明细，自动汇总优惠、税额与应收合计后发送发票。 |
| 协作与项目 | 成员列表 | MemberList | blocks/member-list/ | 展示团队成员、职位与在线状态，适用于项目和工作区。 |
| 协作与项目 | 活动流 | ActivityFeed | blocks/activity-feed/ | 汇总团队近期的任务、文件和项目动态，方便追踪协作进展。 |
| 协作与项目 | 日程与甘特容器 | ScheduleCard / GanttSchedule | blocks/schedule-card/ | 按日历或时间线安排会议与项目任务，掌握团队近期日程。 |
| 协作与项目 | 项目详情分区 | ProjectSection | blocks/project-section/ | 围绕项目或任务组织详情内容与操作，保持阅读层次清晰。 |
| 协作与项目 | 客户动态 | CrmActivity | blocks/crm-activity/ | 按团队成员勾选筛选的会议、电话与备注动态流，适合销售周会复盘。 |
| 协作与项目 | 任务看板 | KanbanBoard | blocks/kanban-board/ | 按阶段分列的任务看板，支持在列之间拖拽卡片、快速添加任务，显示优先级、子任务进度与负责人。 |
| 协作与项目 | 月历日程 | CalendarMonth | blocks/calendar-month/ | 月视图日历标注团队日程，侧栏列出近期安排，点击查看时间、地点与参会人。 |
| 协作与项目 | 即时会话 | ChatWorkspace | blocks/chat-workspace/ | 联系人列表与会话窗口，支持搜索联系人、切换会话、文件与语音消息以及发送新消息。 |
| 协作与项目 | 文件管理 | FileManager | blocks/file-manager/ | 按类型筛选的文件夹与文件卡片墙，支持搜索、多选、上传与删除确认。 |
| 协作与项目 | 智能体列表 | AgentDirectory | blocks/agent-directory/ | 按运行状态筛选的智能体卡片墙，显示职责、技能、任务数与最近运行，可直接对话或分配任务。 |
| 协作与项目 | 知识库 | KnowledgeLibrary | blocks/knowledge-library/ | 按分类与收藏浏览团队文档，支持搜索、收藏与新建文档。 |
| 协作与项目 | 项目总览 | ProjectPortfolio | blocks/project-portfolio/ | 整体任务进度、各状态项目分布与需要关注的事项，项目可按状态筛选并在卡片和表格间切换。 |
| 财务 | 目标进度列表 | GoalProgressList / WalletProgressPanel | blocks/goal-progress-list/ | 跟踪储蓄与预算目标，查看已积累金额和完成进度。 |
| 财务 | 卡片轮播 | CardCarousel | blocks/card-carousel/ | 以可切换的卡片展示多个账户，适用于钱包和财务首页。 |
| 财务 | 财务工作区 | FinanceSurface / FieldLine / VisualCard / FinanceMetricCard / WalletProgressLine / FinanceGoalCell / FinanceTransactionCell / FinanceExpenseGauge / FinanceBudgetPanel | blocks/finance-workspace/ | 整合账户余额、预算与费用明细，集中查看财务状况。 |
| 财务 | 交易流水 | TransactionsTable | blocks/transactions-table/ | 支出构成圆环、月度预算进度，配合按收支方向筛选与搜索的交易明细表。 |
| 财务 | 企业卡管理 | CardsManagement | blocks/cards-management/ | 企业卡列表与选中卡的额度、使用进度、临时冻结和最近消费。 |
| 财务 | 储蓄目标表 | SavingsGoalsTable | blocks/savings-goals-table/ | 资金目标的目标金额、存入进度与截止日期，支持多选和新建目标。 |
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
| 页面结构 | 看板页头 | DashboardHeader | blocks/dashboard-header/ | 为经营看板组织标题、统计周期与导出操作。 |
| 页面结构 | 模板内容分区 | TemplateSurface | blocks/template-surface/ | 为列表或详情组织独立内容分区，适用于后台业务页面。 |
| 页面结构 | 对话页标题栏 | ConversationHeader | blocks/conversation-header/ | 展示会话名称、参与者与常用操作，适用于团队对话页面。 |
| 认证 | 注册 | RegisterForm | blocks/register-form/ | 左图右表单的注册页，含第三方注册、邮箱与密码校验、协议勾选和成功反馈。 |
| 认证 | 找回密码 | PasswordRecovery | blocks/password-recovery/ | 邮箱验证、验证码与新密码三步找回流程，带进度提示与校验。 |
| 认证 | 引导流程 | OnboardingFlow | blocks/onboarding-flow/ | 首次使用的四步引导：创建工作区、连接工具、邀请成员、从模板创建第一个智能体。 |
| 认证 | 登录 | LoginForm | blocks/login-form/ | 邮箱密码与手机验证码两种登录方式，带记住登录、错误提示与企业单点登录入口。 |

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

- 画廊：`/blocks`（74 项共用完整预览数据）；详情：`/blocks/<name>`；公共 API 对照：`/cases/dashboard-kit`。来源为[完整 Screens](screens.md)。
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

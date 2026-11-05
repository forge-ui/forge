# Forge UI Kit

Package: @forge-ui-official/core@0.5.0
Source: this repository; forge-skill + generated core exports + real page routes
Source fingerprint: d082f16b2b214f216a07fe79adc067065a8dc31c0d612350570973eb245771e5

## Adopted rules / 采用规则

Screen → Blocks → Components. Start dashboards from a real Screen; 12 Blocks are implemented as copyable project source in blocks/ with public/r registry items, not core exports; core 0.5.0 and registry publication require separate approval; visual screenshot acceptance remains pending. Default status: soft StatusBadge; categories/roles use plain text. Default accent/focus: blue; purple/black optional. Icons: @forge-ui-official/core/icons. Missing capabilities: FORGE-GAP, ask before adding public primitives. In forge-starter use its host skills for routes, permission and data integration. Technical checks do not establish browser or production readiness.

---

Source: skills/forge-skill/SKILL.md

---
name: forge-skill
description: 使用 Forge / forge-ui 设计与实现看板、后台、管理系统及 starter 页面；按 Screen、Blocks、Components 复用模板和组件，核对 API、内容布局、交互与验收边界。
---

# Forge 页面设计与实施

## 先确定范围

只交付用户授权的页面或系统；单页请求不自动扩成工作台、多模块或治理系统。先说明用户、对象、任务、页面角色、数据来源及完成标准。在 forge-starter 内先走该仓的 quick-start / new-module / new-page / audit skills：主 skill 提供通用规范，starter 负责路由、权限、数据库与工程约定。

## Screen → Blocks → Components

1. **Screen**：先选同角色、同业务密度的真实模板，记录源码路径与版本。看板必须从 [10 个 Screen](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/screens.md) 起步，不从四张指标卡自由拼页。
2. **Blocks**：复用模板中职责明确的区块；[区块目录](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md) 列出 12 类已实现的可复制源码（blocks/ 与 public/r/），不是 core 导出；发布状态和截图验收另行核实。
3. **Components**：使用安装版本真实导出与 Props；查看 [生成 API](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/components/button.md) 和 [组件选型](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/component-recommended-standard.md)。不要猜测组件、图标、密度或交互参数。

缺失能力记录 **FORGE-GAP**：业务用途、已查组件与版本、缺口、影响、候选方案。标记并询问用户，不自行手搓公共原语或改 core。

## 模板和源码

- 看板：analytics、ecommerce-1、ecommerce-2、finance-1、finance-2、finance-3、project-1、project-2、crm、ecommerce-3；以 [Screen 目录](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/screens.md) 的实际路径为准。
- 业务模板：ecommerce、project-template、crm-template、finance-template、micellaneous-template、task-board、agent 等，以脚本枚举的实际路由为准，不把模板演示当后端能力。
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

按 [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md) 逐条记录通过、违规、不适用或未验证及证据。跑项目已有 typecheck、lint、测试和文档自检；需要数据库、浏览器、读屏器或实机而未执行的检查明确列出原因。不得把构建通过当视觉/真实操作验收。

接入专项：[Ask AI 宿主契约](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/ask-ai-host-contract.md)、[交互接入边界](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/interaction-adoption.md)。

---

Source: skills/forge-skill/references/audit-checklist.md

# Forge 统一审计清单

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
- **L5**（通用）：看板从 Screen 起步，记录轨道、列宽、gap、区块高与密度；同视口/侧栏并排截图，不仅核对排列。
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

# 看板 Blocks（复制到项目）

12 类候选已实现为仓内源码与 registry-item；不是 core 包导出，也不意味着已发布或通过截图验收。

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

## 使用边界

- 画廊：`/blocks`；公共 API 对照：`/cases/dashboard-kit`。来源为[10 个 Screens](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/screens.md)。
- 源码只依赖 React、`@forge-ui-official/core` 及其公开 icons 子路径；配色只使用 fg-* Token（白色/透明基础色除外），不依赖站点私有组件。
- 生成：`corepack pnpm blocks:generate`；校验：`corepack pnpm blocks:check`。`public/r/index.json` 为目录，`public/r/<name>.json` 内嵌完整源码，安装目标为 `@components/blocks/<name>.tsx`（遵循用户 components.json 别名）。
- 依赖 core `^0.5.0`。本次只修改版本，不发布 npm 或网站；公网安装须等待发布授权。可先在本仓使用 workspace core、本地访问 registry。
- 本地示例：`npx shadcn@latest add http://localhost:3000/r/kpi-metrics.json`。宿主须已有 React 19、Tailwind 4、core 样式及 Token，复制后的文件由用户维护。沿用[安装说明](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/SKILL.md)配置，不附带后台、数据请求、鉴权或持久化。
- API 以各目录 TSX 类型为准。插槽不会额外套内容容器；接入时保留 Screen 的轨道、className、图域高与 compact 密度。图片、文案、业务回调由宿主提供，未绑定回调不代表业务已实现。

## 公共组件决策

新增 `Panel`，不改变 `SurfaceCard`；dashboard 变体为圆角 24px/边框/padding16，template 变体兼容旧共享 Panel 的圆角 Token/outline/padding24。
`ChartHeader`、`ChartMetricRow`、`GroupedBarChart`、`DivergingBarChart` 归 charts；`WalletGoalCard` 归 core。
原 DashboardShell 只有 AppLayout 默认值，无独立抽象价值，Screens 直接用 AppLayout；财务轮播和特定储蓄面板归 Blocks，不扩大业务化 core API。

## 验收状态

源码、类型、单测、registry 与构建检查分开记录；1440/375 的前后截图与像素 diff 是独立门禁。本次环境 Chromium 启动被 macOS sandbox MachPort 拒绝，不能把静态迁移或构建通过当成视觉一致性通过。重放脚本、基线源码和实际结果记录在 `/tmp/forge-impl/G-shots/`。

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

---

Source: skills/forge-skill/references/motion.md

# 动效采用规则

依据 docs/design/motion-role-fusion.md 的角色契约：enter180ms、exit120ms、layout200ms、press80ms；缓动 cubic-bezier(.2,.8,.2,1)。这些是对应角色的声明值，不是所有组件强制统一时长，也不是实机测量。

退出短于进入；Overlay 用透明度，减少动态偏好时 dialog 不平移、保留必要透明度反馈，motion="none" 即时完成。重新打开取消未结束的关闭计时，避免旧回调误关新弹层。路由切换保留稳定壳，不用整页重挂制造动画。

优先现有组件能力。core 当前存在 motion 依赖，LiquidTabs/Calendar/Chat 等可使用它；不以此授权新增另一套动效库或宣称所有组件均由纯CSS实现。具体 Props 以生成目录为准。

reduced-motion、快速重复操作、退出期间重开和焦点归属必须实测；本次文档任务未完成这些浏览器验证。

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
| 页面区块间距 | 24px；窄空间可用16px | 区别于字段内部间距；不与已有外壳 padding 叠加成双份留白 |
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
| 看板区块纵向间距 | 外层 `flex flex-col gap-5`=20px | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:183`；`src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:135` |
| Grid内部行/列gap | 默认16px，不继承section的20px | `core/src/components/layouts/grid.tsx:43`；analytics的Grid未显式改gap，见`:194`、`:202`、`:238`、`:297` |
| KPI行 | base1列、sm2列、lg4等分；卡 `width="full"`、size=wide | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:194` 至`:198` |
| 主图+辅助块 | base依DOM顺序全宽堆叠；lg默认12轨道中的8:4 | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:202`、`:203`、`:214` |
| 次级三列 | base1列；lg3等分 | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:238` |
| 底部两列 | base1列；lg2等分 | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:297` |
| finance-3主结构 | base1列；lg4轨道，左span1、右span3；列gap16px | `src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:137`、`:139`、`:199` |
| finance-3右区内嵌行 | 独立3轨道，2:1；不是整页再次2:1 | `src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:251`、`:253`、`:277` |
| 标题型图表/表格卡壳 | `rounded-3xl bg-white border border-fg-grey-200 p-4 flex flex-col gap-4`；即padding16、卡内gap16、圆角24px（默认换算） | `src/app/templates/(dashboards)/dashboards/analytics/page.tsx:203`、`:298`、`:317`；`src/app/templates/(dashboards)/dashboards/finance-3/page.tsx:201` |
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

### 已实现的看板组件与区块

- 外壳：AppLayout；面板：Panel（dashboard/template），SurfaceCard 保持原 API。
- 密度：StatCard、ProgressStatCard、LineChartStatCard、BarChartStatCard、WheelChartStatCard、BalanceCard、ImageStatCard、HighlightCard、ListGroup 使用 density="compact"；不再依赖模板 !important。默认密度不变。
- 图表：ChartHeader、ChartMetricRow、GroupedBarChart、DivergingBarChart；目标：WalletGoalCard。
- 12 类可复制 Block 的实现名、目录和支持边界见 [Blocks](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md)，不要从 core import Block。
- 以上为实现状态；前后像素一致须独立验收，当前环境未完成截图，不将尺寸公式当实测。

---

Source: skills/forge-skill/references/screens.md

# 看板 Screen 目录

以下为仓内实际页面，不承诺样例数据具有业务后端。先选最接近任务的一个作风格基准，再改内容与路由。

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

具体布局与尺寸见 [页面规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md)；区块抽取状态见 [Blocks](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md)。

## 实现分层

十个页面已直接使用 AppLayout；卡壳用 Panel，区块从 blocks/ 复制。原 dashboard-density、DashboardShell、Figma 前缀图表与私有 WalletGoalCard 已删除；公共图表与密度 API 见 [Blocks](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/blocks.md)。

这是源码迁移状态，不是截图验收结论：须逐页比较 1440 与 375 两档、同字体/侧栏/固定数据的前后截图，记录不同尺寸或有意差异，不能用 build 代替。

---

Source: skills/forge-skill/references/status-presentation.md

# 状态表达

业务状态默认采用安装版本的 **soft StatusBadge**（variant="soft"），同时提供清楚的状态文字；颜色只辅助语义。成功/完成用 green，失败/危险用 red，待处理/警示用 yellow，进行中/信息用 blue，中性用 grey；精确可选值以生成 Props 为准。

分类、角色、渠道、标签默认普通文字，不把每列都做成彩色胶囊。单张表通常最多一个状态胶囊列；多个独立状态必须说明业务需要和主次关系。实体身份列优先可识别名称与真实详情入口。

不要用 solid 状态徽章、彩虹分类或自制圆角 pill 替代默认规范；特殊视觉需求先说明依据并获得确认。徽章不是可点击按钮，状态改变需要实际动作、权限和反馈。历史截图里的胶囊只记录现状，不自动成为推荐。

完整验收见 [V6、C5、H7](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)。

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

Dark theme overrides these via `[data-theme="dark"]` — toggle by setting that attribute on a parent element.

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

---
name: build-forge-app
description: 把 Product Design / Forge Design Handoff、Page Intent Specs、PRD 或功能描述转成可运行的 forge admin Next.js 项目（ForgeUI + 真组件 + mock 数据）。当已有 FORGE-DESIGN-HANDOFF.md，或用户明确要求「用 forge 做 X」「搭一个 admin 原型」「实现这个 Forge 原型」时唤起。
---

# build-forge-app

把自然语言需求转成完整可跑的 forge admin Next.js 项目。**lean skill：node 一键生成确定层 + LLM 边干边写业务页面 + eval+repair loop 自校验**。

This is the implementation skill inside the `forge-app-design` plugin. Resolve
the plugin root as two directories above this file:

```bash
FORGE_APP_DESIGN_ROOT="<path-to-plugin-root>"
FORGE_REPO="<path-to-forge-repo-containing-core-package>"
```

Use that root for `scaffold.mjs`, `samples/`, `eval/`, `schemas/`, and
`scripts/` commands. Use `FORGE_REPO` for Forge component source and cases. If
`FORGE_REPO` is not set, `scaffold.mjs` will try `--forge-repo`, then
`FORGE_REPO` / `FORGE_UI_REPO`, then walk up from the plugin path and current
working directory until it finds `core/package.json`.

## When to use

唤起这个 skill 的典型用户表达：

- 「用 forge 做一个 X 系统/后台/平台」
- 「帮我搭一个 X 管理后台」
- 「我想做一个 X 的 admin 原型」
- 用户给一段 PRD / 产品描述 / 功能列表后说「实现一下」
- 已有 `FORGE-DESIGN-HANDOFF.md` / `DESIGN-BRIEF.md` / `IA-ROUTE-MAP.json`，并要求用 ForgeUI 落地

**不要在以下情况唤起**：
- 用户只是问技术问题（"forge 的 DataTable 怎么用"）
- 用户改已有项目的某个页面（用 Read/Write 直接改即可）
- 用户问 forge 文档
- 用户仍在探索产品方向、视觉方向或页面意图，且没有 handoff；这时先交给 Product Design。

---

## Architecture

```
用户 PRD 或 Product Design handoff
    ↓
0. Stage preflight（有 handoff 直接消费；无 handoff 且仍是设计问题则先走 Product Design）
    ↓
0.1 Product Design context（读取本 skill 的 PRODUCT-DESIGN-CONTEXT / Design DNA / Component Registry / Field Rules / Block Catalog / ForgeUI gaps）
    ↓
1. 业务分析（LLM）→ entities / pages / flows / state machines
    ↓
1.3 IA route map（系统拆页 → <output>/IA-ROUTE-MAP.json）
   ├─ archetype / lifecycle model / route sequence
   ├─ primaryVerb / lifecycle / decisionQuestion / primaryDataObject
   ├─ linksOut / navigationRationale / businessDensity
   └─ antiPatterns: no all-in-one workspace / center / hub leaf routes
    ↓
1.4 Page pattern match（页面业务密度 → <output>/PAGE-PATTERN-MATCH.json）
   ├─ kpiCards / tableColumns / detailSections / workflowStates
   ├─ emptyStateCopy / linksOut / expectedForgeComponents
   └─ forbiddenShortcuts
    ↓
1.5 Product Design Brief（每页 Page Intent Spec → <output>/DESIGN-BRIEF.md）
    ├─ user_goal / primary_decision / primary_action / secondary_context
    ├─ user_context / realistic_ranges / anti_goals / design_references
    ├─ states_required: [empty, loading, saving, saved, error, hover]
    ├─ must_have_extras: [root_cause, impact, similar, sop, history]
    ├─ visual_density_plan: dashboard/list/detail/state surface requirements
    └─ custom_component_policy: ForgeUI-first / page-local helpers only / gap record
    ↓
2. 本地 artifact / pattern pack 匹配（快、可控）
   ├─ samples/ia/: 先按系统类型挑 IA archetype
   ├─ samples/page-patterns/: 再按页面角色挑业务密度 pattern
   ├─ samples/: 最后按视觉/组件挑可复用 pattern pack
   └─ 无匹配 sample → 直接用 LLM 通识 + Brief 写，不阻塞
    ↓
3. sample miss 处理（不查 wiki / 不读 deprecated corpus）
   ├─ 用 LLM 自身通用业务知识写
   └─ 记录缺口到 <output>/.corpus-gaps.log（留待离线 repo-intake 补）
    ↓
4. scaffold（node 一键，10 秒）→ 项目骨架 + 空占位 page
    ↓
5. 逐页 Write 真实业务 .tsx
    ↓
6. pnpm install
    ↓
7. quality-eval harness（L1+L2+IA+L3）→ repair loop（≤3 轮）→ final critical=0
    ↓
8. 起 dev server → browser screenshots → product-quality-audit（必要时 Protask visual audit）→ review packet
   └─ briefSpecs=0 / product-quality fail / missing browser evidence 时禁止宣称完成
    ↓
9. 用户看 → 微调（微调后重跑 Step 7-8）
```

---

## How to do it（必须严格按顺序执行）

### Step 0: Stage preflight（先判定设计阶段还是 Forge 实现阶段）

开始实现前先检查当前工作目录或目标输出目录是否已有以下任一 artifact：

- `FORGE-DESIGN-HANDOFF.md`
- `DESIGN-BRIEF.md`
- `IA-ROUTE-MAP.json`
- `PAGE-INTENT-SPECS.md`
- `VISUAL-DIRECTION.md`

路由规则：

1. **已有 handoff / Page Intent Specs**：把它们作为上游设计事实，进入 ForgeUI 实现。不要重新发明 IA、页面职责或首屏优先级；只在缺少 Forge 组件计划时补齐。
2. **没有 handoff，且用户仍在问“怎么设计 / 怎么拆页面 / 视觉方向 / 原型思路”**：停止实现，建议先使用 Product Design 的 `get-context` / `ideate` 产出 `FORGE-DESIGN-HANDOFF.md`。
3. **没有 handoff，但用户明确要求直接用 Forge 做**：允许继续，但必须先生成最小 `FORGE-DESIGN-HANDOFF.md`，并标注 `source: Forge-generated brief`；之后再 scaffold 和写代码。
4. **已有 runnable app / screenshots / reports**：这是 Forge 迭代阶段，直接修复、重跑 browser/product/visual/build gates。

Product Design 只负责上游产品/视觉/页面意图，不写最终 ForgeUI app；本 skill 负责把 handoff 落成 ForgeUI 代码并验收。

### Step 1: 引导问答（**当用户描述模糊时必须问，不要直接开干**）

开始前先快速读本 skill 的长期上下文：

- `PRODUCT-DESIGN-CONTEXT.md`：Codex-native prototype design 的设计系统、视觉基线、promoted patterns 和验收链路。
- `references/design-dna-lite.md`：第一版 Forge/Protask 视觉 DNA。生成前必须用它约束字号、密度、边距、border、filter、表格、profile、rail、mock data。
- `references/component-registry.json`：核心 ForgeUI 组件语义注册。用它判断什么时候用 `DataTable`、`SurfaceCard`、`StatCard`、`ButtonGroup`、`Label`、`ProgressBar`、`FileCard`、`HistoryItem`、form controls。
- `references/field-component-rules-lite.md`：字段语义到组件的映射。实体字段识别后、写代码前必须应用，避免 status/user/currency/date/risk/file/action 退化成普通文本。
- `references/block-catalog-lite.json`：页面区块目录。按 page role 先选 block，再写 JSX；不要直接套一个通用模板。
- `precedents/index.json`：已写好示例项目的轻量 precedent 索引。fresh run 前先选 0-2 个相关 precedent；只借鉴业务布局、字段密度、组件组合和反模式，不照抄源项目。
- `references/protask-forge-visual-baseline.md`：Protask CRM / Forge 原始实现 / 当前 fresh 截图的客观差异基线。生成 Protask 风格管理系统时必须读。
- `FORGEUI-GAPS.md`：ForgeUI 缺口登记，避免在业务 app 里手搓通用 primitive。
- `CODEX-PROTOTYPE-DESIGN-ROADMAP.md`：当前生态推进方向和 non-goals。

这些文件只提供默认约束；用户给了更新的 PRD、截图、Figma、URL 或明确反向要求时，以当前任务为准。

判定描述够不够：
- ✅ **够**：用户列出了 ≥3 个具体业务模块名词（如「客户列表、订单跟踪、合同管理」）
- ❌ **不够**：用户只说「客户管理后台」「订单系统」「ERP」这种宽泛词

**描述不够时，必须先问 2-4 个澄清问题**（每次最多 3 个），从以下挑最相关的：

1. **用户是谁**：员工内部用 / 客户自助 / 多角色（管理员+普通用户）
2. **核心业务模块**：请列具体的名词（如「订单、库存、客户」），不要泛泛词
3. **关键工作流**：是否需要审批 / 状态流转 / 多阶段 wizard
4. **数据规模**：几十行 / 几千行 / 上万行（影响是否需要 pagination / search）
5. **优先界面**：dashboard 概览 / list 主导 / detail-heavy
6. **是否要 login/auth**：默认不要（demo），需要时加 `--with-auth`

**不要超过 4 个问题。** 用户回答后即可分析。

---

### Step 2: 业务分析（在你心里完成，简短告诉用户）

基于用户描述 + 问答结果，推断：

1. **entities**：每个业务名词对应一个 entity。例如「订单跟踪」→ `Order` entity
2. **字段**（每个 entity 的 fields）：基于 PRD + LLM 通识业务知识推断（如 Customer 一定有 name/email/phone/tier/createdAt，Order 一定有 status/totalAmount/items）。不要凭空发明字段名
   - 字段确定后必须应用 `references/field-component-rules-lite.md`：status/priority/risk/owner/currency/datetime/file/action 等字段要映射到 ForgeUI 组件和显示策略。
3. **关系**（entity 之间）：1:n / n:m / 1:1。例如 Customer 1:n Order
4. **页面清单**：**页面数由业务决定，不要预设**——
   - 每个 entity 默认产生 list + detail 两页
   - **必须主动判断要不要 dashboard 总览页**：业务有 KPI 总览需求？多 entity 关联展示？→ 加 dashboard
   - **特殊 workflow 页**：审批多步 → 加 wizard 页；任务状态流 → 加 kanban 页
   - **不要锚定 N 页**，简单系统 3-5 页，复杂 10+ 页都正常
5. **每页选 scaffold layout**：这里只给 scaffold 一个结构占位，不是产品设计结论。真正的页面意图必须在 Step 2.5 用 `layout_intent` 声明：
   - `dashboard`：仪表盘占位
   - `list-with-drawer`：列表/队列占位
   - `detail`：详情页占位
   - `board`：看板/状态流占位
   - `wizard`：多步表单占位
   - `workspace`：分屏工作台占位
6. **每页选 block catalog**：用 `references/block-catalog-lite.json` 为 dashboard/list/detail/action/audit/workflow 选择页面区块。选中 block 后再写 component_plan 和 JSX。

**告诉用户分析结果**（简短，2-3 句），形式：
```
我准备这么搭：
  Entities: Customer, Order, Contract
  Pages: customer-list/detail, order-list/detail, contract-list/detail, dashboard (共 7 页)
  默认不带 auth (demo 模式)
开始生成。
```

---

### Step 2.3: IA Route Map（**必须先拆系统，再写页面**）

复杂管理系统必须先产出 `<output>/IA-ROUTE-MAP.json`。这一步解决“像不像真实系统”的第一层：系统应该有哪些页面，每页负责哪个业务动词，页面之间怎么流转。

**输入优先级**：

1. PRD 的显式业务流程
2. `samples/ia/*.json` 中最接近的 archetype
3. 本地 repo-intake 产物（仅离线参考，不在生成运行时调用 DeepWiki / CodeWiki / CodeGraph）
4. LLM 通识

**必填字段**（每页）：

- `route`
- `primaryVerb`
- `lifecycle`
- `decisionQuestion`
- `primaryDataObject`
- `layoutIntent`
- `surfaceRole`: `navigation` / `action` / `detail`
- `parentRoute`: action/detail 必填，指向承载入口的 navigation 页面
- `entryAffordance`: action/detail 必填，`primary_cta` / `row_action` / `toolbar` / `empty_state_cta`
- `linksOut`
- `navigationRationale`
- `businessDensity`

**硬规则**：

1. 不允许把复杂 PRD 压成 `/workspace` / `/center` / `/hub` / `/console` 这类万能 leaf route。
2. Dashboard 只负责优先级、风险聚合和导航，不承载完整工作流。
3. Detail page 可以有相关 read link，但不能拥有跨多个 lifecycle 的 write/admin 动作。
4. `quality-runs/[id]` 这类 event detail 只能诊断事件；修复 diff、报告预览、审计流必须拆到独立 route。
5. 每个非终端页面必须有 `linksOut` 指向下一步 lifecycle。
6. `route 存在` 不等于 `sidebar 可见`：只有 `surfaceRole="navigation"` 才能进 AppLayout 菜单。
7. `/new` / `/create` / `/edit` / `/import` / `/export` / `/bulk` 这类流程页必须是 `surfaceRole="action"`，并绑定 `parentRoute` 和 `entryAffordance`。
8. `[id]` 详情页必须是 `surfaceRole="detail"`，并通过父级 list/table 的 `row_action` 进入。

推荐文件结构：

```json
{
  "version": 1,
  "archetype": { "id": "quality-governance-control-tower" },
  "pages": [
    {
      "route": "/issues/[id]",
      "primaryVerb": "repair",
      "lifecycle": "operation",
      "decisionQuestion": "是否采用该修复策略并确认 before/after diff？",
      "primaryDataObject": "quality-issue",
      "layoutIntent": "split-pane-diff-repair",
      "surfaceRole": "detail",
      "parentRoute": "/issues",
      "entryAffordance": "row_action",
      "linksOut": ["/quality-runs/[id]", "/audit-logs"],
      "businessDensity": ["root cause", "impact scope", "diff", "rollback", "audit"]
    }
  ]
}
```

---

### Step 2.4: Page Pattern Match（**IA 必须配业务密度**）

IA 只解决“拆页对不对”，不能单独保证“页面像真实系统”。因此必须产出 `<output>/PAGE-PATTERN-MATCH.json`，把每页应有的业务密度写清楚。

从 `samples/page-patterns/*.json` 选择最接近的 pattern；找不到时，按当前 PRD 和行业常识手写，但必须记录到 `.corpus-gaps.log`。

**每个页面 pattern 必须声明**：

- `decisionQuestion`
- `primaryDataObject`
- `kpiCards`
- `tableColumns`
- `detailSections`
- `workflowStates`
- `emptyStateCopy`
- `requiredVisibleText`（用于 browser 首屏验收；不能只写 H1）
- `businessDensity`
- `visualBaseline`（typography / density / spacing / borders / profileRegion / tableFirstViewport / rightRail）
- `linksOut`
- `expectedForgeComponents`
- `forbiddenShortcuts`

**禁止**：

- 只写 “现代 dashboard / 简洁列表 / 高级详情” 这种视觉空话。
- 只按字段名生成表格列。
- 页面 pattern 和 IA route map 不一致。
- 因为 ForgeUI 缺组件就在业务页手搓通用 primitive。
- 让 visual/browser/build 分数替代 Protask/Forge 视觉基线。必须把字号、密度、边距、border、profile 区、表格首屏、右 rail 写进 pattern。

---

### Step 2.5: Product Design Brief（**必须先写再写代码** — 路径 D）

**为什么这一步存在**：C6a 验证发现，即使工程门 (critical=0) 通过，LLM 写的代码仍是「字段映射」而不是「产品设计」——所有 list 页长一样、detail 页只有 PRD 最小字段、没业务深度发散、没 empty/loading/saving state。Step 2.3 / 2.4 先解决系统 IA 和页面业务密度；Step 2.5 再把它们落成可写代码的 Page Intent Spec。

**Step 2.5 解法**：在 scaffold 之前，强制 LLM 先 Read `<output>/IA-ROUTE-MAP.json` 和 `<output>/PAGE-PATTERN-MATCH.json`，再把每页的**产品意图**写下来，落盘到 `<output>/DESIGN-BRIEF.md`。Step 4 写代码时 Read 这三个文件当指南。

#### Impeccable → Forge 适配原则（产品设计前置）

来自 `pbakaus/impeccable` 的可吸收部分不是“换一套视觉风格”，而是补齐设计思考顺序：先确认用户、任务、数据范围、约束、反目标，再写界面。Forge admin 属于 **product UI register**，所以适配时遵守：

- **熟悉不是缺点**：后台系统优先可信、可扫描、可重复操作；不要为了显得“设计感”发明奇怪控件。
- **设计决策必须有业务理由**：layout、detail surface、workflow link、empty/loading/error state 都要服务用户动作，不能只是卡片拼贴。
- **产品 UI 默认 restrained**：少量语义色服务状态、主操作、当前选择；不要渐变文字、过饱和装饰、营销式 hero。
- **ForgeUI-first**：Button / Table / Badge / Card / Form / Chart / Timeline / Avatar / File 等已有 primitive 必须用 Forge。缺组件先记录 gap，不在业务页造通用替代组件。
- **可本地 custom 的范围很窄**：只允许在 `./_components/` 里写领域组合块和微视觉 escape hatch；不允许在 `page.tsx` 总装散落 inline hex、通用卡片壳、raw button、手搓 chart/gauge。

如果用户需求本身是“先设计原型 / 探索产品方向”，先做 **Prototype Designer Mode**：问 2-3 个关键问题，产出 compact design brief，等用户确认后再进入 scaffold。若用户已经明确要求直接生成项目，则不要停在问答，但必须把缺失假设写进 `DESIGN-BRIEF.md` 的 `assumptions` / `anti_goals`。

---

#### 必须产出的文件

`<output>/DESIGN-BRIEF.md`，每页一个 block，结构如下：

```yaml
- id: issue-detail
  route: /issues/[id]
  layout_intent: split-pane-triage          # 意图导向，不是 generic primitive
  detail_surface: page                      # page | drawer | modal | split-pane | inline-expand
  design_register: product-admin            # 固定：Forge admin 是 product UI，不走 brand/landing register
  user_context: 数据工程师在值班窗口内处理高风险数据质量异常，目标是快速判断并关闭风险
  realistic_ranges: issues 0-500/day; related runs 0-30; comments 0-20; file evidence 0-8
  anti_goals:
    - 不做营销页 hero / 渐变大标题
    - 不把所有字段平铺成 CRUD detail
    - 不为一个状态操作弹 modal
  design_references: [Linear issue triage density, Stripe risk review side rail]
  user_goal: 数据工程师 5 分钟内决策这个 issue resolve / ignore / escalate
  primary_decision: root cause 是什么？影响范围？是否需要 escalate？
  primary_action: 改 status + 写 resolution + assign；resolved 后跳 /jobs?highlight=jobId 看相关 job 重跑
  secondary_context:
    - timeline (detected → assigned → resolved)
    - related runs（哪些 job 触发了这条 issue）
    - similar issues（同 rule / 同 source 近 30d）
    - SOP link（rule 有 runbook 时显示）
  states_required: [loading, saving, saved, error, empty, hover]
  must_have_extras: [root_cause, impact_scope, similar_issues, sop_link, change_history]
  visual_density_plan:
    shell: grouped nav + short app label + profile/action cluster; no raw slug branding
    dashboard: compact KPI row + trend/progress visual + recent work table + activity/risk rail
    list: row identity + secondary metadata + status + owner/action + pagination/filter surface
    detail: hero identity + context rail + activity/history + comments/attachments when applicable
    assets: deterministic avatars/logos/initials/file tiles; no external image dependency
    state_surfaces: filter, add/edit, confirmation, saved feedback, empty/loading
  component_plan:                           # 拆哪些子组件 + helper + local state
    components:
      - TriageMetaStrip                     # 顶部 meta 行
      - RootCausePanel
      - ImpactScopePanel
      - SimilarIssues
      - SopBlock
      - ChangeHistory
      - TriageRightForm                     # 右 sticky form 含 saveState
    helpers: [SOP_BY_CATEGORY map, DOWNSTREAM_BY_CATEGORY map]
    local_state: [saveState (idle/saving/saved/error), form, dirty (computed)]
  custom_component_policy:
    allowed:
      - RootCausePanel 作为领域组合块，内部继续使用 Forge SurfaceCard / Label / ProgressBar
    forbidden:
      - 自定义 Button / Table / Badge / 通用 SectionCard
      - page.tsx inline hex
    forgeui_gaps: []
```

#### 12 条硬规则（违反 = Brief 不合格，必须重写）

1. **每页必须有 Page Intent Spec**——不能省略，不能"写完代码再补"
2. **每页必须声明 4 项**：`user_goal` / `primary_decision` / `primary_action` / `secondary_context`
3. **detail / workflow 页必须补**这 5 个产品深度元素（即使 PRD 没列也主动加）：
   - `root_cause`：问题根因展示
   - `impact_scope`：影响范围（哪些下游、多少 row、关联 entities）
   - `similar_or_related`：相似 / 相关实体（近 30d 同 rule、同 source、同 assignee 的问题）
   - `sop_or_next_action`：处理 SOP 链接 / 下一步建议动作
   - `change_history`：状态 / 字段变更历史 timeline
4. **可操作页（含 form / kanban / triage）必须列**：`pending` / `saved` / `empty` / `loading` / `hover` state——Step 4 写代码时这些 state 不能漏
5. **相邻 list / detail 页禁止套同一模板**——必须声明区别（不能两个 list 都 `stat-toolbar-table`；不能两个 detail 都 `header-cards-tabs`）
6. **必须显式声明 `detail_surface`**（page / drawer / modal / split-pane / inline-expand）——detail 形态不能默认 page，要按业务决定（频繁切换 → drawer；深度阅读 → page；轻 actions → modal；并排操作 → split-pane）
7. **必须给出 `component_plan`**：列出 components（≥3 个独立子组件文件） / helpers / local_state。Step 4 会按这个 plan 在 `<route>/_components/` 下创建子组件文件。**page.tsx 总装目标 ≤100 行**
8. **中等/复杂 PRD 必须给出 `visual_density_plan`**：不要只写字段和卡片。必须明确 shell、dashboard、list、detail、assets、state_surfaces 六类视觉密度策略；简单 3-5 页 CRUD 可简化，但不能省略关键页面的视觉策略。
9. **Protask 级页面不能只有文字卡片，但必须 ForgeUI-first**：核心 dashboard / list / detail 至少各自包含一种强视觉结构（chart/gauge/progress/timeline/activity rail/attachment/file tile/avatar/logo/mini table/checklist）。优先使用 ForgeUI 已有组件（如 `SurfaceCard` / `ChartCard` / `BarChart` / `ProgressBar` / `HistoryItem` / `CommentItem` / `FileCard` / `Avatar` / `TaskCard` / `ProjectCard` / `ActivityCard`）。如果 Forge 组件没有现成 primitive，先用最接近的 Forge 组件或记录 ForgeUI gap；除非用户明确授权，不要在业务 app 里手搓替代组件或通用卡片壳。
10. **每页必须声明 product register 输入**：`design_register: product-admin`、`user_context`、`realistic_ranges`、`anti_goals`、`design_references`。references 必须是具体产品/模式名，不要写“现代、简洁、高级感”。
11. **稀疏 PRD 必须做 shape 决策**：如果缺用户角色、核心动作、数据范围、反目标中的任意两项，生成前先问 2-3 个问题；如果用户要求直接生成，则在 Brief 写 `assumptions`，并把风险记入 `.corpus-gaps.log` 或 `.forgeui-gaps.md`。
12. **custom component 必须受控**：Brief 里每个自定义子组件必须说明它是领域组合块还是 ForgeUI gap 临时表达；禁止把 `SectionCard` / `MiniCard` / `PanelCard` / `Button` / `Table` / `Badge` 这类通用 primitive 写成业务 app 私有组件。

#### Layout intent 词典（举例，不是封闭枚举）

不要用 generic primitive 名字（"list-with-drawer" / "detail"），要用**意图导向**命名：

| 意图 | 适用场景 |
|---|---|
| `hero-overview` | dashboard 顶部聚合 + 下面分块（不只是 stat+table）|
| `dashboard-control-tower-protask` | 控制塔首页，含 compact KPI、trend/risk/readiness visual、priority work、activity stream、workflow entry |
| `split-pane-triage` | 左侧 timeline / 右侧操作表单（issue / ticket triage 类）|
| `kanban-workflow-protask` | promoted workflow 看板，含状态 lane、lane count、可操作 TaskCard、空 lane、progress/status signal、diagnostic/detail link、local action feedback |
| `kanban-board-with-row-actions` | `kanban-workflow-protask` 的 legacy alias；只作为命名兼容，promoted 验收看 canonical artifact |
| `action-form-protask` | 单页创建 / 编辑 / 提交表单，左主表单 + 右状态 rail + Cancel/Save |
| `wizard-multi-step` | 多步表单 + 进度条 + 上一步 / 下一步 |
| `chat-workspace` | 对话流 + 右侧 context drawer |
| `tabbed-detail-with-related` | detail 带 tabs + 相关实体侧栏 |
| `rich-entity-list-protask` | 运营队列 / case list，含 row identity、owner、risk/SLA、evidence、insight rail |
| `list-with-filters-and-bulk` | 列表 + multi-filter + 批量操作 |
| `report-builder` | 时间范围 + 维度选择 + 图表区 |
| `settings-grouped` | 按 group 分块的配置页 |

如果你要写 `layout_intent: list-with-drawer` —— **重写**。

#### PRD 信号决策树（先选页面意图，再写组件）

Step 2.5 不能只按路由名套模板。先看 PRD 的动词、数据依赖和用户决策，再选 pattern：

1. **出现创建 / 新建 / 添加 / 编辑 / 保存 / 提交 / 发起 / 配置 / 导入等动作页信号**：
   - 单页可完成、字段约 6-14 个、决策彼此独立、核心动作是 Cancel/Save/Submit → `action-form-protask`
   - 需要按顺序完成 source → mapping → schedule → review，后一步依赖前一步 → `wizard-multi-step`
   - 是长期配置中心，多个 group 会持续保存和回滚 → `settings-grouped`
   - 需要边看证据 / 根因 / 历史边做 approve/reject/repair → `split-pane-triage`
2. **出现 queue / list / records / search / filter / bulk 信号**：
   - 运营队列 / case / ticket / approval / exception / incident，且需要 owner、status、risk/SLA、evidence、last activity、row action 一屏决策 → `rich-entity-list-protask`
   - 普通实体列表、低决策密度参考表 → `list-with-filters-and-bulk`
   - 新建入口是 toolbar/empty-state CTA，不能把 `/new` 放进 sidebar。
3. **出现 board / kanban / lane / stage / workflow / approve / deploy / incident progression 信号**：
   - 只有同时满足以下硬条件才选 `kanban-workflow-protask`：
     - 主实体有 ≥3 个互斥状态，且状态会单向或有向流转。
     - 用户主任务是扫 lane 找下一个动作，不是搜索、过滤、批量选择或深读字段。
     - 每张可见卡至少有一个直接写动作：advance / rerun / assign / approve / reject。
     - failed / blocked / risky 卡有显式 diagnostic 或 detail link。
     - 卡片数量级约 10-500；超过 500 选 `rich-entity-list-protask`。
   - 如果只是把列表按 status 分组但没有卡片动作，不能选 kanban；用 list 或 detail/action pattern。
4. **出现 dashboard / overview / monitor / control tower 信号**：
   - 中等复杂运营 / 风险 / SLA / 履约 / 合规 dashboard → `dashboard-control-tower-protask`
   - dashboard 只负责优先级和导航，不能承载创建表单或深度修复动作。
   - 禁止只做 4 张 KPI 卡；必须有趋势/风险/优先任务/活动流/入口。

`rich-entity-list-protask` 的硬要求：
- 只用于父级 navigation list / queue route；`/new`、`/edit`、`/bulk` 仍是 action route。
- 首屏优先级是 `PageTitle -> compact filters -> main DataTable rows`；桌面 review 截图必须能看到主队列表头、多个真实 row identity、以及至少一个 row action。
- workload summary 只能是紧凑横条、inline stats，或放进右侧 rail；不能用大 summary card 把主列表推到首屏下方。
- 表格行必须有 identity（avatar/logo/initials + secondary metadata）、owner/assignee、status、priority 或 risk、SLA 或 last activity、row action。
- 右侧 insight rail / drawer 显示证据、文件、活动历史、risk reason、next action 和 detail link；不能只是重复表格字段。
- `DataTable` 外层必须 `min-w-0 overflow-x-auto`；右侧 rail 使用 responsive `minmax` / `clamp` / max-width token，并在常见桌面宽度优先保证表格完整可读，不要硬并排挤压表格。
- `rich-entity-list-protask` 不要在 `lg` 宽度强制 table + right rail 并排；优先 inline stats、drawer、below-table rail，或到 `2xl` 再 side-by-side。
- 行 action 列最多一个 `Button size="sm"` 加一个 compact link / icon / menu；不要每行垂直堆 `Preview + Open + Review`，review/escalate/resolve 放到 selected-row rail、detail 或 action route。
- 不要用 `[&_table]:table-fixed` 解决列太多或 rail 太窄的问题。减少列、移动 secondary context、或让 table 横向 overflow，而不是把 identity/evidence 截成无意义片段。
- `DataTable` 已经自带白底细边框表面和可选 title/subtitle；不要再套一层大标题 `SurfaceCard` 形成嵌套 card/table shell。
- 用 Forge `SurfaceCard` / `DataTable` / `Avatar` / `Label` / `ProgressBar` / `FileCard` / `HistoryItem` / `Button` / `StyledLink`；不自造 Button / Table / Badge / SectionCard。

#### Forge starter / core adaptive-width contract

这条规则来自 clean Forge starter 的健身房会员管理验证：
`/Users/hesong/Desktop/tmp/forge-gym-member-admin`。结论是页面布局可以由
Product Design 根据业务自由发散，但 ForgeUI 的宽度、密度、颜色、字体和圆角
必须由组件和 parent grid 共同保证。

- 生产型 admin route 里，card-family components 默认填满父级 grid/flex column。
- 不要给 KPI / chart / progress / task / project / map / highlight / context
  card 写 `width="fixed"`、`w-64`、`w-80`、`w-96`。
- 有 card 间距不自然时，修 parent grid：`grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]`、
  `clamp(...)`、`items-start`、`min-w-0`、`overflow-x-auto`，而不是给 child
  card 固定宽度。
- right rail / status rail 在 `lg` 会挤压主表格或表单时必须 collapse、
  below-table、drawer，或延后到 `2xl`。
- `protask-visual-audit` 的 adaptive sizing gate 必须通过后才能说视觉基线通过。

`action-form-protask` 的硬要求：
- 标题区只保留 `Breadcrumbs + H1 + Cancel/Save`；不要 kicker/eyebrow，不写长说明。
- 主区域用 `minmax(0,1fr)` 加 responsive status rail；rail 使用 `minmax` / `clamp` / max-width token，左侧按业务分组表单，右侧显示状态、完成度、preflight、next workflow。
- 必须有 `editing/dirty/saving/saved/error/hover` 相关状态，Save 不能是空 onClick。
- `page.tsx` 只做总装和状态，字段组放进 `_components/`；不定义自造 Button / SectionCard / Table / Badge。
- 不使用 `CheckboxWithLabel`；当前 Forge core 版本会形成 button 嵌套 hydration 风险。用 `CheckboxControl` + 独立 `span` 文本组合。
- action route 是 `surfaceRole: action`，必须有 `parentRoute` 和 `entryAffordance`，不进 sidebar。

`kanban-workflow-protask` 的硬要求：
- 只用于 promoted board / workflow route；supporting task board 不能算完成 promoted pattern。
- 首屏必须能看到 lane 标题、lane count、至少一张 actionable card、一个直接动作按钮和一个 failed/blocked diagnostic/detail link。
- 每个 lane 都有 empty/loading 状态；不能用只读卡片或 status 分组表替代。
- 卡片必须包含 identity、owner/assignee、status/progress、SLA/due/last activity、next action。
- `DESIGN-BRIEF.md` 的 Page Intent Spec 必须写明 board 的 user_goal、primary_decision、primary_action、secondary_context、component_plan 和 visible acceptance。
- `browser-validate` 必须对 board route 配置 `requiredVisibleText`，至少覆盖一个 lane 标题、一个直接动作和一个 diagnostic/detail link。
- 用 Forge `SurfaceCard` / `TaskCard` / `Label` / `ProgressBar` / `Button` / `StyledLink`；不要自造 generic card shell、Button、Badge 或 read-only board。

#### Protask 三类页面 layout pattern contract

这些规则是视觉验收约束，不是组件清单。`quality-eval 0/0` 只能说明工程 gate 干净，不能替代截图验收。

#### Forge / Protask typography density

对齐 Forge CRM Figma / 源码基线时，管理系统页面应偏紧凑，而不是 hero 化：

- 页面 H1 默认使用 Forge admin typography token，通常不大于 `text-2xl font-semibold text-fg-black`；list / dashboard / detail / action 页都不应默认使用 `text-display-l`。
- `text-display-l` 在 Forge token 中是 28px，只保留给少数对象 hero 或极稀疏 workflow 首屏；不要在每个 route 的 PageTitle 重复使用。
- Dashboard 的重点数字可用 `text-3xl` 或 Forge stat 组件默认尺度；普通卡片标题、DataTable 标题、列表 rail 标题默认应接近侧边菜单尺度：`text-sm` + `font-medium/semibold` + `text-fg-black`，不要用 `text-lg` / `text-xl` 当常规卡片标题；表格主文本用 `text-sm`，辅助元信息和 filter label 用 `text-xs` / grey token。
- 桌面 review 截图如果出现“大标题 + 大卡片 + 少量信息”的营销页观感，先降低标题和 summary 尺度，再补业务密度。

1. **List / queue page**（`rich-entity-list-protask`）：
   - 首屏必须呈现 Protask 管理系统基线：浅灰内容区、白底细边框卡片、紧凑标题层级、紧凑 filter strip、主 `DataTable` 表头和前几行。
   - Summary 只能是 compact strip / inline stats / right rail，不能位于筛选区和主表格之间把表格顶出首屏。
   - 截图验收必须包含 row identity、risk/SLA/evidence、row action 的可见文本或按钮；`browser-validate` 应为主行或主操作配置 `requiredVisibleText`。
2. **Detail / triage page**（`split-pane-triage` / `entity-detail-activity-rail`）：
   - 页面要服务“证据 -> 状态 -> 动作闭环”，不能是字段详情表。首屏应看到 identity/status、evidence/root cause/impact/history，以及 resolution/action rail 或 panel。
   - Detail 的右侧上下文或 action panel 必须给出下一步、保存/解决反馈、审计或相关 workflow link。
   - 截图验收必须包含 evidence/root cause/resolution 或等价领域文案的 `requiredVisibleText`。
3. **Action / form page**（`action-form-protask`）：
- 页面结构遵循 `Breadcrumbs + H1 + Cancel/Save` 的优先级，左侧 grouped form，右侧 responsive status/preflight/context rail；不要套 list 的 PageHeader+Filter+Card+Table 模板。
   - 首屏必须看到第一个字段组和右侧状态 rail，Save/Submit 要有 local state feedback。
   - 截图验收必须包含字段组标题和 status/completion/preflight rail 的 `requiredVisibleText`。

#### 反例（自动 reject 的 Brief 写法）

❌ 太抽象：
```yaml
- id: issues
  layout_intent: list
  user_goal: 看 issues
```
缺 user_goal 具体性、primary_decision、secondary_context、states_required、must_have_extras。

❌ 套模板：
```yaml
- id: sources
  layout_intent: stat-toolbar-table   # 跟 rules / jobs / issues 一样
```
违反规则 5。

❌ 漏 state：
```yaml
- id: issue-detail
  states_required: [loading]   # 漏了 saving / saved / empty / error / hover
```
违反规则 4。

❌ 漏 detail_surface：
```yaml
- id: customer-detail
  route: /customers/[id]
  # 没声明 detail_surface
```
违反规则 6。

❌ component_plan 太抽象 / 太少：
```yaml
- id: dashboard
  component_plan:
    components: [DashboardContent]   # 只 1 个，page.tsx 还会 500 行
```
违反规则 7（dashboard 这种聚合页至少 4-6 个独立子组件：KpiRow / TrendChart / RiskSources / RecentStream / Heatmap 等）。

❌ visual_density_plan 缺失：
```yaml
- id: dashboard
  layout_intent: hero-overview
  component_plan:
    components: [KpiRow, RiskQueue, ActivityRail]
  # 没声明 dashboard 要包含哪些视觉结构，也没声明 list/detail/assets/state surfaces
```
违反规则 8。C11 实测工程 0 critical 但用户评分 60/100，原因就是页面干净但缺 Protask 级视觉密度。

#### 写完 Brief 后

1. Write 到 `<output>/DESIGN-BRIEF.md`
2. 简短告诉用户 Brief 摘要（每页 1 行 layout_intent）
3. 进入 Step 3（scaffold 用 Step 2 的 entities/pages，Brief 给 Step 4 用）

---

### Step 3: 跑 scaffold（确定层一键，10 秒）

```bash
node $FORGE_APP_DESIGN_ROOT/scaffold.mjs \
  --name "<app-slug>" \
  --entities-json '<entities JSON 数组>' \
  --pages-json '<pages JSON 数组>' \
  --domain "<CRM | ERP | IoT | DevOps | E-commerce | Workflow | Auth | CMS | Other>" \
  --output "./output/<app-slug>" \
  --forge-repo "$FORGE_REPO"
```

**entities-json 格式**：
```json
[
  {
    "name": "Customer",
    "fields": [
      { "key": "name", "type": "string", "required": true },
      { "key": "email", "type": "string" },
      { "key": "status", "type": "enum", "options": ["Active","Inactive","Prospect"] },
      { "key": "createdAt", "type": "date" }
    ]
  }
]
```

`type` 支持：`string` / `number` / `boolean` / `date` / `enum`(需要 options) / `ref`(需要 target)

**pages-json 格式**：
```json
[
  {
    "id": "customer-list",
    "route": "/customers",
    "layout": "list-with-drawer",
    "primaryEntity": "Customer",
    "title": "客户管理"
  }
]
```

---

### Step 4: 逐页写真实业务拼装（**核心步骤**）

scaffold 完后**每个 page.tsx 是占位**——你（LLM）必须为每页写真实代码。

**Vertical slice workflow 约束**：每组逻辑相关页面（如 issues + jobs + sources 是一个 vertical slice）**至少 1 条跨页 workflow link**，让用户能从 A 页跳到相关 B 页继续操作。例子：

- issue triage 提交 resolved → `router.push('/jobs?highlight=' + jobId)` 看 job 重跑
- dashboard 风险源 → `<Link href={\`/sources/${id}\`}>` 跳数据源详情
- jobs failed 卡片 → 跳 `/issues?source=...&status=new` 看错误明细
- similar issues 卡片 → 跳 `/issues/<id>` 跨问题对比

**page.tsx 行数控制**（quality-eval L1 会抓）：
- `> 250` 行 → warn"考虑拆 components"
- `> 320` 行且**无 `./_components/` 或 `./components/` import** → critical 强制拆

对每页**严格按这个流程**：

**4.0. 先 Read 当前页的 Page Intent Spec**（Step 2.5 产出的 `<output>/DESIGN-BRIEF.md`）：

```bash
grep -A 25 "^- id: <page-id>" <output>/DESIGN-BRIEF.md
```

按 Brief 的 `user_goal` / `primary_decision` / `primary_action` / `secondary_context` / `must_have_extras` / `states_required` 写代码。**Brief 是这页的 product designer 输入，所有 layout 选择、信息块组织、state 实现必须遵守 Brief**。

如果 Brief 里某个 must_have_extra 在 PRD entity 字段里没有原生支持（如 PRD 没列 `similar_issues`）——**主动加 mock 数据派生**（如从同 rule + 近 30d 过滤 issues 推出 similar），而不是省略 extra。

**4.0.5. 按 component_plan 创建子组件骨架**：

在 `<output>/app/<route>/_components/` 下，为 `component_plan.components` 每个名字创建一个独立 `.tsx` 文件。文件名 PascalCase（如 `RootCausePanel.tsx`）。

`_components` 前缀让 Next.js 不把目录当 route（私有目录约定）；用 `components/` 也行（非 page.tsx 文件不当 route），但 `_components/` 更显式。

**page.tsx 行数指引**（按页类型分档，不是硬卡）：
- 聚合 dashboard（无 form / 无单实体 fetch 链）：**~100-150 行**（readdy home 33 行是极简下限）
- 列表 / kanban：**~100 行**（数据源单一 + 简单 filter）
- detail / triage（含 fetch 链 + handleSubmit）：**~150-200 行**（fetch + state + workflow 跳转是自然下限）

超 250 行 → quality-eval warn；超 320 行无 `_components` import → critical。

**桌面视觉 fit 规则**：
- `DataTable` + 右侧 preview/detail 面板不要在常见桌面宽度硬并排；用 responsive `minmax` / `clamp` / max-width token，`xl` 宽度先让主表格完整可读。
- 如果确实要在 `xl` 并排，左列必须 `minmax(0,1fr)`，表格外层必须 `min-w-0 overflow-x-auto`，并在浏览器截图里确认关键列和主操作按钮没有被裁切。
- 对 `rich-entity-list-protask`，并排 insight rail 默认从 `2xl` 才启用；`lg/xl` 应保持 table-first。右 rail 一旦导致 action 列裁切、FileCard 标题截断、或 row identity 变成碎片，就必须 collapse below / drawer。
- 长状态文案（如 `Ready to submit` / `Pending documents`）不要直接塞进窄卡片右上角；用独立行的紧凑 pill，避免徽标覆盖标题或被挤成圆形。
- `ButtonGroup` 只适合短分段控制，单组不要超过 5 项。超过 5 项必须按业务语义拆组（如 active queue / terminal outcomes）或改用 `TabBar` / `FilterPanel`；不要只靠 `flex-wrap` 把 6-8 个筛选项硬塞进一个 segmented control。
- Forge 卡片家族默认自适应父级宽度。业务 app 不要给 `StatCard` / `ProgressStatCard` / `ProjectCard` / `TaskCard` / `ChartCard` / `ProgressCard` / `ImageStatCard` / `HighlightCard` / `MapCard` 等再加 `w-64` / `w-80` / `w-96` 或 `width="fixed"`；固定尺寸只用于 Forge 组件 showcase。

**Protask 视觉密度规则**（C11 用户评分 60/100 后新增）：
- **App shell**：不要把完整 slug 当品牌。使用短 app label；nav 要分组且 active state 清晰。团队/工作区型系统要有 workspace/team/profile/action cluster 的可见设计，不要只有裸 sidebar。
- **Dashboard**：禁止只用 KPI 卡 + 普通列表。中等复杂 dashboard 必须至少包含 3 类结构：compact KPI、trend/bar/line visual、gauge/progress visual、recent work table、activity/timeline rail、risk/priority stream。
- **Dashboard visual anchor**：首屏必须有 1 个高权重 Forge 视觉锚点，避免全白同质卡片。优先用非 white theme 的 `StatCard` / `ProgressStatCard` / `ImageStatCard` / `HighlightCard` / `ProjectCard`，或等价的 Forge chart/hero card；不要靠业务页手搓渐变壳。
- **List / queue**：表格行必须像业务对象，不是纯字段 dump。至少包含 identity（avatar/logo/initial/icon）、secondary metadata、status、owner/assignee 或 last activity、row action、filter/pagination/bulk surface 中的多项。
- **List row actions**：每行不能堆多个大按钮或垂直 action stack。Forge 表格参考是轻量 action：`CellActions` / icon cluster / kebab / one small button / one inline link。多步骤动作进入 preview rail 或 detail。
- **Detail / triage**：复杂对象详情默认要有 hero identity、tabs 或 section nav、left context rail、main narrative/action area、activity/history。协作/证据型业务要加 comments、attachments/file tiles 或 evidence cards。
- **Mock data**：业务支持时主动加 deterministic avatars/logos/initials/file tiles/thumbnails 字段；没有外部图片也要用本地 initials/icon/file-card fallback 表达视觉资产。页面可见的 root cause、impact、owner、status、risk、next action 等核心业务语义必须来自确定 fixture / normalizer，不要展示随机 lorem 或无业务含义的 scaffold fallback。
- **State surfaces**：CRUD/workflow 域至少给出 add/edit/delete/filter/detail/confirmation/saved feedback 中的若干表面；可以是 local-state 静态演示，但不能只给一个 happy path。

**Impeccable 反 AI 味规则（Forge admin 版）**：
- 产品页可以使用熟悉的单一 sans 字体和标准后台布局；不要把 brand/landing 的字体猎奇、hero 大字、装饰动效带进 admin。
- 禁止渐变文字、dark glow、装饰性左边框色条、重复 eyebrow/kicker、营销空话（如 seamless / empower / world-class / supercharge）作为页面主要表达。
- 交互动效只服务状态反馈，150-250ms 即可；不要 `transition-all` 覆盖 layout 属性，不要 bounce/elastic。
- 页面文案用业务名词和动词宾语，按钮要能独立表达动作（如 `Resolve issue`、`Run replay`），不要“开始 / 确认 / 了解更多”这种脱离上下文的泛按钮。
- 视觉 polish 必须先对齐 Forge 组件和 token。发现偏差时先分类：缺 token / 缺组件 / 一次性实现 / 信息架构错位，再决定修 skill、修 Forge core，还是只修当前页面。

**4a. 先查本地 pattern pack / golden app（如有）**：

```bash
find $FORGE_APP_DESIGN_ROOT/samples -maxdepth 2 -name README.md 2>/dev/null
find $FORGE_APP_DESIGN_ROOT/golden-apps -maxdepth 1 -name "*.md" 2>/dev/null
```

如果业务匹配某个 sample，先 Read 该 sample 的 `README.md` + `BRIEF.md` + `page.tsx` + `_components/`。把它当结构参考，**必须替换成当前 PRD 的业务实体、字段、状态和 workflow**；不要复制字面业务内容。

如果 PRD 是中等复杂度（约 6-12 页 / 多实体 / 多 workflow）且匹配某个 golden app，先 Read golden app note + 它的 `DESIGN-BRIEF.md` + 3-5 个代表页面。golden app 用于学习**整站级产品组织**：页面地图、跨页工作流、mock 数据真实性、状态处理、page split 策略。不要复制业务文本或字段。

当前可用 sample：
- `dashboard-risk-overview`：运营风险 / 控制塔 / 健康度首页
- `dashboard-control-tower-protask`（sample folder: `protask-compound-dashboard`）：Protask/Readdy 密度的控制塔首页，含 KPI、trend、progress/gauge、priority work、activity rail、workflow entry
- `rich-entity-list`：高信息密度队列 / entity list，含 filter、DataTable、row identity、preview panel、evidence/activity
- `rich-entity-list-protask`：Protask/Readdy 密度的运营队列，含 workload summary、DataTable row identity、risk/SLA、evidence、insight rail、reviewed state
- `entity-detail-activity-rail`：复杂详情页，含 hero、context rail、evidence、activity/comments、resolution panel
- `action-form-protask`：单页创建 / 编辑 / 提交表单，含 Breadcrumbs、Cancel/Save、分组表单、右侧状态 rail、preflight checks
- `kanban-workflow-protask`：Protask/Readdy 密度的 promoted 状态流看板，含 lane count、Forge `TaskCard`、直接动作、失败诊断/detail link、空 lane 和 local action feedback；legacy folder `kanban-status-workflow` 只作兼容 alias
- `detail-triage-workflow`：异常 / issue / approval / incident 处理详情
- `settings-grouped`：配置中心 / 策略设置 / 权限与保留策略
- `wizard-multi-step`：多步创建 / 导入 / onboarding / 审批提交
- `chat-workspace`：对话工作台 / agent console / support inbox

当前可用 golden app：
- `data-quality-control-tower`：数据质量 / 治理 / 监控类 10 页中等复杂后台，展示 dashboard + source/rule/job/issue/report 的整站组织。
- `fulfillment-ops-control-tower`：履约 / 供应链 / 运营控制塔，展示 dashboard 风险流、kanban 状态推进、exception triage、库存与承运风险页。
- `support-ticket-sla-center`：客服 / 工单 / SLA 运营后台，展示 queue + drawer、ticket detail、kanban board、escalation、SLA policy matrix。

sample miss 不阻塞，继续 4b。

**4a.1 A-tier repo-intake 离线补样规则**

400+ 开源项目只能作为离线产品结构参考，不允许在生成任务里全量 clone/install/逐字分析。

- 每批只处理 5-10 个 A-tier 项目。
- 不运行 package install / build / test；只做本地静态 route/component anatomy 扫描和人工产品复核。
- 每个项目只抽 4 类 artifact：IA artifact、page pattern、business workflow、ForgeUI gap。
- 目标优先补 `dashboard-control-tower-protask` 与 `split-pane-triage` 的产品设计深度：趋势、风险、优先任务、活动流、证据、根因、影响、历史、resolution、audit trail、next workflow link。
- 源码 clone 只保留到 artifact 完成复核；promote 到 `samples/ia/`、`samples/page-patterns/`、sample/BRIEF 或 gap 记录后必须删除 clone。
- 每沉淀 2-3 个 pattern 后，必须用 fresh PRD 做 browser screenshot 验证，确认 skill 自然产出更像真实管理系统，而不是只靠旧 demo 或文字报告通过。

推荐命令：

```bash
node $FORGE_APP_DESIGN_ROOT/scripts/repo-intake.mjs --repo /tmp/a-tier/<repo> --out /tmp/spec-to-forge-intake/<repo> --name <repo>
```

**4b. 找视觉真示例**（API 调用查询）：
根据本页要用的组件，从以下 forge cases 里 Read **真实代码示例**：

| 要用的组件 | Read 路径 |
|---|---|
| DataTable | `$FORGE_REPO/src/app/cases/table/page.tsx` |
| StatCard / ChartCard | `$FORGE_REPO/src/app/cases/card/page.tsx` |
| ListGroup / ListItem | `$FORGE_REPO/src/app/cases/list/page.tsx` |
| PageHeader | `$FORGE_REPO/src/app/cases/page-header/page.tsx` |
| Filter / FilterPanel | `$FORGE_REPO/src/app/cases/filter/page.tsx` |
| Toolbar | `$FORGE_REPO/src/app/cases/toolbar/page.tsx` |
| Modal / Drawer | `$FORGE_REPO/src/app/cases/modal/page.tsx` |
| Chat / 对话 | `$FORGE_REPO/src/app/cases/chat/page.tsx` |
| 表单输入 | `$FORGE_REPO/src/app/cases/input-field/page.tsx` |
| Calendar | `$FORGE_REPO/src/app/cases/calendar/page.tsx` |
| Tab | `$FORGE_REPO/src/app/cases/tab/page.tsx` |
| Chart (Donut / Bar / Line / Pie) | `$FORGE_REPO/src/app/cases/chart/page.tsx` |

**4c. 速查 props**（确保不发明 API）：
```bash
rg -n "export .*<ComponentName>|function <ComponentName>|const <ComponentName>" "$FORGE_REPO/core/src"
rg -n "<ComponentName>" "$FORGE_REPO/src/app/cases" "$FORGE_REPO/core/src"
```

**4d. Write 真实 page.tsx**：
- 从 `'use client'` 开始（含 useState/useEffect 拉 `/api/<entity>`）
- 引用 `from '@forge-ui-official/core'`
- 用本页 entity 的真实字段
- 视觉 token 严格用 forge: `text-fg-black` / `bg-fg-grey-50` / `rounded-card` / `fg-violet-*` / `fg-green-*` / etc

**4e. 跟用户简短同步**：
```
✓ customers/page.tsx 写完（DataTable + Filter，从 /api/customer 拉数据）
  下一页: customers/[id]
```

**重复 4a-4e 直到全部 page 写完。**

---

### Step 5: pnpm install

```bash
cd ./output/<app-slug>
export PATH="/Users/hesong/.nvm/versions/node/v22.20.0/bin:$PATH"  # node v22.13+
pnpm install --registry=https://registry.npmmirror.com
```

**用 `./node_modules/.bin/next` 而不是 `pnpm dev/build`**：pnpm 11 的 sharp build-script 检查会卡死。所有后续 next 调用都走 `./node_modules/.bin/next`。

如果 `pnpm install` 已经写入 `node_modules` 但因 `ERR_PNPM_IGNORED_BUILDS`（常见于 `sharp` build script policy）返回非 0，不要直接判定失败。继续进入 Step 6，用 `quality-eval` 的 L3 `./node_modules/.bin/next build` 作为最终工程门；只有 L3 build 失败才进入 repair / 环境排查。

---

### Step 6: quality-eval + repair loop（critical=0 才能进入下一步）

跑工程质量门（含 L1 grep + L2 narrow + L3 next build）：

```bash
node $FORGE_APP_DESIGN_ROOT/eval/quality-eval.mjs --target ./output/<app-slug>
```

输出：
- stdout 摘要 + exit code（0=pass, 1=critical>0）
- `<output>/quality-report.json` 机器可读
- `<output>/quality-report.md` 含 repair hint，repair loop 直接读这个

**critical = 0 → 跳到 Step 7**。warn 可保留（不阻塞）。

**critical > 0 → repair loop，最多 3 轮**：

1. Read `<output>/quality-report.md`
2. 对每个 critical 段：
   - 看 `**Locations:**` 拿 `file:line`
   - 看 `**Repair:**` 拿具体修法
   - **按 hint surgical 修**：只动出错位置，不重写整页、不动无关 props、不顺手 refactor
3. 改完**所有** critical 后重跑 quality-eval
4. 仍有 critical → 回到第 1 步（counter++）

**3 轮仍未 critical=0 → 停**。报告给用户：
- 剩余 critical 列表（每条带 file:line + repair hint）
- 已尝试轮数（3）
- 建议：人工介入，可能是 SKILL.md 规则需要新增 / 业务字段不可机械修

⚠️ **不要绕过这一步**。`pnpm install` 之后必须跑 quality-eval；critical>0 时**禁止**起 dev server 给用户看。视觉问题（kanban 不像 kanban、dashboard 空白）不在工程门范围，由用户在 Step 8 反馈。

---

### Step 7: 起 dev server + browser evidence

确认 quality-eval `critical=0`、L3 next build 已通过后：

```bash
nohup ./node_modules/.bin/next dev > /tmp/dev.log 2>&1 &
```

打开 http://localhost:3000（占用时 next dev 自动 :3001）让用户看。

对任何要作为“完成证据”的 fresh run，必须跑 browser validation，并把 report 和 screenshot 写到目标项目：

```bash
node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs \
  --config ./output/<app-slug>-browser-cases.json \
  --report-dir ./output/<app-slug> \
  --screenshots-dir ./output/<app-slug>/screenshots \
  --json
```

Browser report 必须覆盖核心 page roles：dashboard / list / detail / action 或 workflow。`requiredVisibleText` 不能只写 H1，必须覆盖页面首屏决策证据，例如 list 主行、detail evidence/resolution、action form 字段组和状态 rail。

---

### Step 8: final product acceptance audits（不能跳过）

`quality-eval`、browser、build 都通过，只说明工程和截图链路可用；不能替代产品设计闭环。最终宣称完成前必须跑：

```bash
node $FORGE_APP_DESIGN_ROOT/eval/product-quality-audit.mjs \
  --target ./output/<app-slug> \
  --browser-report ./output/<app-slug>/browser-report.json \
  --quality-report ./output/<app-slug>/quality-report.json \
  --json
```

硬门槛：
- `product-quality-report.json.pass` 必须是 `true`。
- `facts.briefSpecs` 必须大于 0，且每个 implemented page route 都有 Page Intent Spec。
- 每个 Page Intent Spec 必须包含 `user_goal` / `primary_decision` / `primary_action` / `secondary_context` / `component_plan`。
- `briefSpecs=0`、缺 route 覆盖、缺 required product fields 或缺 `component_plan` 时，禁止把项目宣称为完成，即使 visual/browser/build 全过。

中等复杂 Protask 目标还必须跑：

```bash
node $FORGE_APP_DESIGN_ROOT/eval/protask-visual-audit.mjs \
  --target ./output/<app-slug> \
  --browser-report ./output/<app-slug>/browser-report.json \
  --quality-report ./output/<app-slug>/quality-report.json \
  --json
```

最后生成 review packet：

```bash
node $FORGE_APP_DESIGN_ROOT/scripts/render-review-packet.mjs \
  --target ./output/<app-slug>
```

Review packet 必须能一页看到 route model、brief coverage、quality/browser/product/visual audit、screenshots 和 known gaps。参考 `REVIEW-PACKET-CHECKLIST.md`。

当前已阶段性通过的 promoted patterns 包括 `dashboard-control-tower-protask`、`rich-entity-list-protask`、`split-pane-triage-protask`、`action-form-protask`。`kanban-workflow-protask` 已有 promoted artifact 和 eval baseline，但后续仍要用独立 fresh PRD 做 screenshot acceptance；旧 fresh app 里的 `/workflow-board` 仍只算 supporting route，不能反推旧 demo 已完成 kanban 验收。

---

### Step 9: 微调

用户反馈"某页应该有 X / 没有 Y" 时：
- Read 对应 `app/<route>/page.tsx`
- 改 → Write
- 改完**重跑 Step 6 quality-eval + Step 7 browser evidence + Step 8 product audits**（避免微调引入工程、截图或产品闭环回归）
- 不需要重跑 scaffold（除非加新 entity / 新 page）

---

## ⚠️ Hard constraints（违反会破坏产物，永远不要做）

### A. 不引用 broken 代码
1. **不引用旧 composer / codegen 生成层**——broken composer 容易输出虚构 props；当前只以 Forge core 源码、cases 示例和本插件 pattern 为准
2. **不抄 forge cases page.tsx 的字面内容**——只学结构 / 调用方式，业务字段必须替换成 PRD 业务名词
3. **不发明 forge 组件 props**——Forge core 源码 / cases 示例里确认不了就不用

### B. 视觉一致性（C4 暴露的 6 个真问题，必须遵守）

4. **AppLayout 已含 topbar（Search/notification/profile）**——page.tsx **绝不**使用 `<PageHeader variant="search">`。业务页面顶部必须有 Forge `<Breadcrumbs>` 和清晰页面标题。不要把标题区包成内容卡片。`surfaceRole="action"` / form 页优先采用 `Breadcrumbs + 大标题 + Cancel/Save`；detail/drilldown 页可用返回按钮、breadcrumb 父链或 Cancel/Close，但必须有明确退出路径。
5. **内部设计/IA 文案不得泄漏到 UI**——`Artifact / Policy / Event / Operation`、`IA 约束`、`policy 生命周期`、`本页不做什么`、`不承载...`、`只负责...` 这类建模约束只能写在 `DESIGN-BRIEF.md` / route map / eval 里，不能出现在 PageTitle、SurfaceCard subtitle 或说明卡。用户可见文案必须短、具体、业务化，例如“查看扫描批次、执行状态和负责人”。
6. **Protask 风格标题区保持克制**——list/dashboard/detail 页可有一行短说明；action/form 页通常只保留 `H1 + Breadcrumbs + Cancel/Save`，不要加 eyebrow/kicker 和大段解释。标题尺寸优先使用 Forge CRM 后台 typography token（通常不大于 `text-2xl font-semibold`）；`text-display-l` 只给极少数对象 hero，不要作为 PageTitle 默认值。
7. **AppLayout 主内容区已经有 `p-6`**——page.tsx 的 `<main>` 不要再写 `p-6` / `p-8` / `lg:p-8`，否则内容和灰色背景边缘会出现双重边距。推荐 `<main className="w-full min-h-full space-y-6">`，页面内部卡片再自行控制 padding。
8. **StatCard 必须用主题色编码业务语义**：
   - 总数 / 容量 → `purple` / `blue` / `cyan`
   - 正向指标（活跃 / 已完成 / 成功）→ `green`
   - 负向指标（风险 / 已到期 / 失败）→ `red`
   - 待办 / 处理中 / 警告 → `yellow`
   - **禁止**多个 StatCard 全 `theme="white"`——失去视觉信息
   - 横排紧凑 KPI 用 `size="sm"`；重点指标用 `size="lg"`；需要填满流式网格列时用 `size="wide"`；`md/xl/xs` 都不存在

9. **按业务判断视觉密度，不要套同一模板**：

   IR corpus 表面统一是 Phase 5 migrator 强加的，不要被锚定。**真正业务页面应该按需选**：
   - 业务有 3-5 个独立 KPI 维度（如客户：总数/活跃/风险）→ StatCard 横排 ✓
   - 业务有状态分布（如订单：4 种状态占比）→ 单个 ChartCard + DonutChart 比 3 个 StatCard 强 ✓
   - 业务很轻（如合同档案 / 日志）→ inline 数字徽章（`<Label>` 在 title 旁）就够
   - 用户明确不要总览 → 直接 main 是 table

10. **DataTable prop 名是 `rows` 不是 `data`**；`onRowClick` 不存在（用第一列 render 包 button）
11. **ToolbarSearchInput 是展示型组件**（只 `placeholder` + `className`，没有 `value/onChange/onValueChange`）——受控搜索用原生 `<input>` + forge token 样式
12. **不要用 `CheckboxWithLabel`**；它在当前 Forge core 版本存在 button 嵌套 hydration 风险。表单 checkbox 行用 `CheckboxControl` + 文本 `span`，外层用 `inline-flex`。

### B+. 受控 escape hatch（visual fine-tuning）

forge 组件 props 表达不出来的微视觉细节，**允许在 page-level helper 文件**（即 `./_components/<Name>.tsx`）里用 inline style + Tailwind 混搭实现。但**禁止散落到 page.tsx 总装**或绕开 forge 组件。

✅ **允许**（仅在 `_components/` 子组件里）：
- 业务组合 wrapper：把 ForgeUI 组件组合成领域块（如 `CaseMetaStrip` 组合 `StatusBadge` + `ProgressBar` + `Avatar`），但 wrapper 内部仍必须优先调用 ForgeUI primitive
- `style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.02)' }}` 自定义阴影
- `style={{ background: '#f0fdf4' }}` 淡背景色（state 警示）
- hover/active/disabled 微色切换（inline style + state）
- 圆角微调（`rounded-2xl` 替代 forge 默认 `rounded-card`）
- 状态色编码（severity / healthScore）的特定 hex

❌ **禁止**（不论在哪个文件）：
- 绕过 forge 组件 props 手写 `<button>` 替代 `<Button>`
- 手搓 Forge 已有 primitive 的替代品：`Avatar` / `ProgressBar` / chart/gauge / `HistoryItem` timeline / `CommentItem` / `FileCard` / `TaskCard` / `ButtonGroup` / `TabBar` / `DataTable` 等必须从 `@forge-ui-official/core` 使用
- 自定义通用视觉卡片壳：不要在业务 app 里定义 `SectionCard` / `MiniCard` / `PanelCard` 并直接拼 `rounded-card border bg-white`；有标题面板优先用已安装 Forge core 的 `SurfaceCard`，图表用 `ChartCard`，实体小卡优先用 `TaskCard` / `ProjectCard` / `ActivityCard`。如果当前安装的 core 版本还没有 `SurfaceCard`，用最接近的 Forge 卡片降级并记录 ForgeUI gap。
- 为了追参考图而在业务页自画 SVG chart / gauge / timeline / file tile / avatar；这类缺口要记为 ForgeUI core gap，或用最接近的 Forge 组件降级表达
- 把 inline style hex 散落进 `page.tsx` 总装（应该藏在子组件里）
- 复制 readdy 或其他参考项目的字面 hex 值（业务色彩自定义需基于业务语义，不是抄外观）
- 大段 `<style>` 块或 CSS 文件（除 globals.css）

**缺组件处理**：如果 Protask / readdy 参考图需要 Forge 目前没有的 Drawer、Toast、dense shell、advanced chart 等能力，generated app 不应长期靠手搓补齐。先记录到 `<output>/.forgeui-gaps.md`，本轮用最近的 Forge 组件表达；确实必须补组件时，应该进入 Forge core，而不是业务页局部造轮子。

**Why**：forge token 是基线天花板，但生产级后台往往需要 5-10% 视觉细节超出 token。B+ 只负责微调视觉，不负责替代 ForgeUI 组件库。

---

### C. 通用约束

9. **每页必须能 SSR 渲染**——写完 mental check：所有 import 在 forge core export 了；所有 prop 有默认值
10. **forge core 包名是 `@forge-ui-official/core`**（不是 `@forge/core` 或 `@forgeui/core`）
11. **JSX 文本不要直接写 raw `<-` / `->`**——Turbopack 会 parse fail。用文字（`Back to queue` / `View issue`）或实体转义。
12. **mock data deterministic 类型推断**：
    - `name/title` → 领域实体名 + 序号，页面层可再 normalizer 成真实业务名称
    - `email/phone` → 稳定 demo 值，不用随机库
    - `date` → 稳定 ISO 日期
    - `enum` → 按 options 顺序轮转
    - `string`（其他） → 使用领域短语或 scaffold 的业务 fallback，禁止把 lorem 输出展示为业务解释
    - `number` → 按字段语义生成稳定区间值（risk/readiness/amount/exposure 等）
    - `boolean` → 稳定交替值
    - `ref` → 稳定 mock id

---

## 防 hallucinate 三层门（必须遵守，源于 C4/C5 实测踩坑）

LLM 直接写 .tsx 有 hallucinate 风险（虚构 prop / 引用不存在组件 / 错 import 名）。**必须三层门拦**：

### 写前: 查 forge ground truth

引用任何 forge 组件 / props / 图标前先 **verify 存在**：

```bash
# 查组件是否在 Forge core 导出或源码中存在
rg -n "export .*<ComponentName>|function <ComponentName>|const <ComponentName>" "$FORGE_REPO/core/src"

# 查真实用法和 props
rg -n "<ComponentName>" "$FORGE_REPO/src/app/cases" "$FORGE_REPO/core/src"

# 查 solar-icon-set 真实导出
grep -E "^export.*<IconName>" "$FORGE_REPO/node_modules/.pnpm/solar-icon-set@"*/node_modules/solar-icon-set/dist/index.d.ts
# 或在生成的项目里:
grep -oE "<IconName[A-Za-z]*>" ./node_modules/.pnpm/solar-icon-set@*/node_modules/solar-icon-set/dist/index.d.ts
```

### 写中: import + props mental scan

Write page.tsx 之前，**mental check**：
- 所有 `import { X } from '@forge-ui-official/core'` 的 X 是否在 registry？
- 所有 `import { Icon } from 'solar-icon-set'` 的 Icon 是否拼对？（`UserBoldDuotone` ≠ `UsersBoldDuotone`）
- 所有 prop name 是否在该组件 props schema？特别注意：
  - `DataTable` 用 `rows` 不是 `data`
  - `DataTable.columns[]` 用 `header` 不是 `label`
  - `StatusBadge` 用 `label` 不接 children
  - `StatCard` 用 `title` 不是 `label`，`value` 必须是 string，`size` 只接 `sm|lg|wide`
  - `Label color` 只接 `purple|blue|cyan|green|red|yellow|gray`
  - `ListGroup color` 只接 `purple|blue|black`
  - `ProgressStatCard` 用 `progressValue` 不是 `progress`
  - `ToolbarSearchInput` 无 `value/onChange/onValueChange`（受控搜索用原生 `<input>`）

### 写后: build + 坏模式扫描

每页 Write 完后（或一批写完后）跑：

```bash
cd ./output/<app-slug>
./node_modules/.bin/next build 2>&1 | tee /tmp/build.log

# 搜坏模式
grep -rE 'PLACEHOLDER|TODO:.*LLM|onRowClick|data=\{|<ToolbarSearchInput[^>]*(value|onChange|onValueChange)=' ./app/*/page.tsx
```

build 不过或 grep 命中 → 立即修对应 page.tsx，**不要遗留**。

---

## 可操作闭环（业务层质量门）

scaffold 完 + 全部页面写完后，必须确认**至少 1 条核心 workflow 真能跑通**。不是 button onClick 空函数，而是真的 fetch API + setState。

例子：
- CRM：列表点客户 → 详情页打开 → 改状态 → POST /api/customer/[id] → 列表 refetch 看到变化
- 工单：列表选工单 → 指派 → 状态 Open→Assigned → SLA 时间重算
- 库存：入库表单 → 提交 → POST /api/stock → 库存增加 → 告警阈值检查

**判定标准**：
- onClick 不是空函数（要么 `fetch('/api/...')` 要么 `setState`）
- API 路由真返回 data / 写入 mock store（不是 stub）
- 页面间跳转通过 `next/link` 真实导航

写完所有 page.tsx 后**用 markdown 告诉用户"这条 workflow 你可以试：[step by step]"**。

---

## Sample miss 处理（不查 wiki / 不读 deprecated corpus）

本地 samples 查不到相似业务时，**不要读取 deprecated corpus，也不要 WebFetch DeepWiki / CodeWiki / 任何外部 wiki**。原因：网络依赖会拖慢、影响可重现性，且 codex round 5 已把 wiki/codegraph/corpus intake 划归"离线 repo-intake 阶段"，不进 skill 运行时。

**正确处理**：

1. **用 LLM 自身的通用业务知识写**——常见业务（SLA / ITSM 状态机 / ERP 库存预警 / CRM pipeline 等）LLM 都见过，直接基于通识写代码
2. **记录缺口**到 `<output>/.corpus-gaps.log`，格式：
   ```
   {domain: "兽医诊所", reason: "samples 无相似 pattern", page: "/appointments", date: "2026-05-24"}
   ```
3. 缺失的业务样本由维护者在**离线 repo-intake 阶段**用 codegraph / 人工 page-tier 提炼成新的 pattern pack（不是 skill 运行时的事）
4. **业务规则真的不确定时优先问用户**（如某细分行业的特殊 workflow），不要去查 wiki

> 总原则：skill 运行时只读本地 samples + forge cases + registry；不读 deprecated corpus，不做任何外部 HTTP 调用。

---

## Files in this skill

- `SKILL.md` — 本文档
- `scaffold.mjs` — 一键脚手架工具（确定层），由 LLM 调用
- `samples/` — Pattern pack 库，含视觉密度多样的 `README.md` / `BRIEF.md` / `page.tsx` / `_components/`
- `golden-apps/` — 整站级 few-shot 索引，指向已验证的生产级 mini-app 输出

## Reference paths

- forge 主仓：`$FORGE_REPO`
  - src/app/cases/ — 23 个真实组件使用示例
  - core/src/ — Forge 组件源码和 props 真相
- 输出默认到用户 cwd 下的 `./output/<app-slug>/`

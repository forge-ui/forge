/**
 * L1 grep — known bad patterns at source-text level.
 * Each rule produces exactly one check result (pass / warn / critical).
 * `repairHint` is consumed by the repair loop — keep instructions surgical
 * (fix this specific issue, do NOT rewrite the file).
 */

import { readFileSync } from 'node:fs'
import { relative } from 'node:path'

const RULES = [
  {
    name: 'placeholder-leftover',
    description: 'scaffold placeholder still present — LLM forgot to write the page',
    // case-sensitive + word boundary: scaffold writes "PLACEHOLDER" (uppercase).
    // Avoids false-positive on HTML `placeholder="..."` and Tailwind `placeholder:`.
    pattern: /\bPLACEHOLDER\b|TODO:.*LLM/,
    status: 'critical',
    repairHint: 'Replace the PLACEHOLDER block with real forge component composition. Read forge/src/app/cases/<relevant>/page.tsx for examples first. DO NOT rewrite other unaffected parts of the file.',
  },
  {
    name: 'wrong-forge-import',
    description: 'forge package must be @forge-ui-official/core (not @forge-ui/*)',
    pattern: /from\s+['"]@forge-ui\//,
    status: 'critical',
    repairHint: 'Change `@forge-ui/...` to `@forge-ui-official/core` in the import path only. Do not change anything else.',
  },
  {
    name: 'empty-onclick',
    description: 'onClick handler is empty placeholder ({() => {}})',
    pattern: /onClick=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}/,
    status: 'critical',
    repairHint: 'Either write a real handler (state update, navigation, mock call) OR remove the onClick prop entirely if the button is decorative. Do not modify other props.',
  },
  {
    name: 'jsx-raw-arrow-text',
    description: 'raw <- or -> in JSX text breaks Turbopack parser',
    onlyFiles: file => /\.tsx$/.test(file),
    custom: (content) => {
      return content.split('\n').some(line => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('//')) return false
        return /^<-\s*\w/.test(trimmed) || /^[A-Za-z][A-Za-z0-9\s]+->\s*$/.test(trimmed)
      })
    },
    status: 'critical',
    repairHint: 'Replace raw JSX text arrows with words or escaped entities. For example, use `Back to list` instead of `<- List`, and `View issue` instead of `View issue ->`.',
  },
  {
    name: 'pageheader-search-variant',
    description: 'PageHeader variant="search" only valid on search-result pages',
    pattern: /<PageHeader\b[^>]*\svariant=["']search["']/,
    status: 'critical',
    repairHint: 'Remove `variant="search"` from the <PageHeader>. Keep all other props (title, subtitle, etc.) unchanged.',
  },
  {
    name: 'page-title-wrapper-has-breadcrumbs-actions',
    description: 'generated PageTitle wrapper must expose Forge breadcrumbs and page-level actions',
    onlyFiles: file => /\/app\/_components\/PageTitle\.tsx$/.test(file),
    custom: content => /export\s+function\s+PageTitle\b/.test(content)
      && (!/\bBreadcrumbs\b/.test(content) || !/\bButton\b/.test(content) || /rounded-card[^"']*border[^"']*bg-white/.test(content)),
    status: 'critical',
    repairHint: 'Update app/_components/PageTitle.tsx to render an open page title area with Forge `Breadcrumbs` and Forge `Button` actions. Do not wrap the page title area as a content card. Action/form pages should expose Cancel/Save or an equivalent explicit exit path.',
  },
  {
    name: 'action-form-missing-exit',
    description: 'action form routes must expose breadcrumbs/back/cancel, not trap the user in the form',
    onlyFiles: file => isActionFormRoute(file),
    custom: content => isLikelyActionFormContent(content) && !hasActionFormExit(content),
    status: 'critical',
    repairHint: 'Action/form routes (`/new`, `/create`, `/edit`, `/submit`, `/import`) need an explicit exit path. Add Forge `Breadcrumbs` plus Cancel/Back, or use a PageTitle wrapper with `breadcrumbs` and `secondaryActionLabel`/`showBackButton`. Do not hide cancel in a menu.',
  },
  {
    name: 'action-form-kicker-copy',
    description: 'action form titles should not use kicker/eyebrow copy',
    onlyFiles: file => isActionFormRoute(file),
    custom: content => isLikelyActionFormContent(content)
      && (/\bkicker\s*=/.test(content) || />\s*(?:Guided setup|Create flow|Action form|创建流程|操作表单|新建流程)\s*</i.test(content)),
    status: 'warn',
    repairHint: 'Remove kicker/eyebrow copy from action/form title areas. Protask-style action pages should use `Breadcrumbs + H1 + Cancel/Save`, with no extra eyebrow above the title.',
  },
  {
    name: 'action-form-long-description',
    description: 'action form title description should stay short; long instructions belong in field groups or preflight panels',
    onlyFiles: file => isActionFormRoute(file),
    custom: content => isLikelyActionFormContent(content) && hasLongActionDescription(content),
    status: 'warn',
    repairHint: 'Shorten the action/form title description or remove it. Put detailed guidance inside the relevant `SurfaceCard`, field helper text, or preflight checklist instead of the title area.',
  },
  {
    name: 'datatable-data-prop',
    description: 'DataTable takes rows=, not data=',
    pattern: /<DataTable\b[^>]*\sdata=/,
    status: 'critical',
    repairHint: 'Rename `data=` to `rows=` on <DataTable>. Keep the value identical.',
  },
  {
    name: 'datatable-onrowclick',
    description: 'DataTable has no onRowClick prop',
    pattern: /<DataTable\b[^>]*\sonRowClick=/,
    status: 'critical',
    repairHint: 'Remove `onRowClick=` from <DataTable> — it does not exist. For row interaction, use a render function inside a column (e.g. `render: (r) => <Link href={...}>...</Link>`).',
  },
  {
    name: 'rich-list-missing-row-identity',
    description: 'operational queue tables should include row identity, not plain field dumps',
    onlyFiles: file => isAppUiTsx(file),
    custom: content => hasOperationalQueueDataTable(content) && !hasRichListIdentitySignal(content),
    status: 'warn',
    repairHint: 'Operational list/queue pages should show row identity: Avatar/logo/initials plus secondary metadata, owner, status, risk/SLA, and evidence context. Use Forge `Avatar`, `DataTable`, `Label`, and `ProgressBar`; do not render only name/status/date columns.',
  },
  {
    name: 'rich-list-missing-row-action',
    description: 'operational queue tables should expose a row action or detail link',
    onlyFiles: file => isAppUiTsx(file),
    custom: content => hasOperationalQueueDataTable(content) && !hasRichListActionSignal(content),
    status: 'warn',
    repairHint: 'Add a visible row action or detail link for operational queues. Prefer a Forge `Button`, `StyledLink`, or Next `Link` inside a DataTable column that previews, opens detail, assigns, or marks the row reviewed.',
  },
  {
    name: 'toolbar-search-onchange',
    description: 'ToolbarSearchInput has no onChange; it is display-only',
    pattern: /<ToolbarSearchInput\b[^>]*\sonChange=/,
    status: 'critical',
    repairHint: 'Remove `onChange=` from <ToolbarSearchInput>. If the page needs controlled search, use a native `<input>` styled with forge tokens instead.',
  },
  {
    name: 'mock-delete-call',
    description: 'mock CRUD helper uses .remove(), not .delete()',
    pattern: /\b\w+s?\.delete\(/,
    onlyFiles: (file, content) => /from\s+['"]@\/mock['"]/.test(content),
    status: 'critical',
    repairHint: 'Rename `.delete(...)` to `.remove(...)` on the mock CRUD call. Keep the argument unchanged.',
  },
  {
    name: 'api-params-non-promise',
    description: 'Next 16 API [id] route params must be Promise<{id}>',
    pattern: /params:\s*\{\s*id:\s*string\s*\}/,
    onlyFiles: file => /app\/api\/.*\[id\]\/route\.ts$/.test(file),
    status: 'critical',
    repairHint: 'Change handler signature to `type RouteContext = { params: Promise<{ id: string }> }` and call `const { id } = await params` to extract the id.',
  },
  {
    name: 'statcard-all-white',
    description: '>=2 StatCard all theme="white" — loses semantic color encoding',
    custom: (content) => {
      const whiteHits = content.match(/<StatCard\b[^/>]*\stheme=["']white["']/g) ?? []
      const allHits = content.match(/<StatCard\b/g) ?? []
      return allHits.length >= 2 && whiteHits.length === allHits.length
    },
    status: 'warn',
    repairHint: 'Replace `theme="white"` on at least one StatCard with a semantic theme color: positive metrics → green, warnings → amber/orange, critical → red, neutral total → purple. Keep all other props unchanged.',
  },
  {
    name: 'forge-card-fixed-width',
    description: 'official Forge cards in app routes should fill their parent grid/flex column',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    custom: content => OFFICIAL_CARD_FIXED_WIDTH_RE.test(content),
    status: 'warn',
    repairHint: 'Remove fixed card width (`width="fixed"`, `size="4col|6col|8col"`, or `className="w-*"` on Forge cards). Let the parent grid/flex define columns; use `minmax(0,1fr)`, `gap-4/5`, and default Forge card width instead.',
  },
  {
    name: 'raw-tailwind-color-in-app',
    description: 'generated admin pages should use Forge fg-* tokens instead of Tailwind default color families',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    pattern: /\b(?:bg|text|border|outline|ring|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
    status: 'warn',
    repairHint: 'Replace Tailwind default color classes with Forge `fg-*` tokens or a Forge component prop. Keep `bg-white`, `text-white`, `bg-transparent`, and official Forge component internals unchanged.',
  },
  {
    name: 'over-rounded-admin-surface',
    description: 'large rounded surfaces make admin pages feel less Forge/Protask-like',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    custom: content => !hasCustomCardShell(content) && OVER_ROUNDED_SURFACE_RE.test(content),
    status: 'warn',
    repairHint: 'Use Forge radius tokens such as `rounded-card` for surfaces and `rounded-full` only for pills/avatars/buttons. Avoid large bespoke radii in generated admin app markup.',
  },
  {
    name: 'coarse-admin-density',
    description: 'large spacing or display-scale text usually breaks dense admin page rhythm',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    custom: content => COARSE_ADMIN_DENSITY_RE.test(stripMainClassNames(content)),
    status: 'warn',
    repairHint: 'Use compact Forge admin rhythm: `gap-4/5`, `p-4/5`, restrained headings, and route-specific hierarchy. Reserve larger spacing/type only for a deliberate dashboard visual anchor.',
  },
  {
    name: 'page-inline-hex',
    description: 'page.tsx 总装禁止散落 hex 字面 (B+ escape hatch 规则) — inline style 必须搬到 ./_components/',
    onlyFiles: file => /\/page\.tsx$/.test(file),
    // matches style={{ ...'#xxx'... }} or style={{ ...background: '#xxx'... }}
    pattern: /style=\{\{[^}]*['"]#[0-9a-fA-F]{3,8}['"]/,
    status: 'critical',
    repairHint: 'page.tsx 总装出现 inline style 含 hex 字面值（违反 B+ 受控 escape hatch）。把这块视觉代码抽到 ./_components/<Name>.tsx 子组件里，page.tsx 只保留总装、状态、workflow 跳转。',
  },
  {
    name: 'page-getting-long',
    description: 'page.tsx > 250 lines — consider splitting into ./components/',
    onlyFiles: file => /\/page\.tsx$/.test(file),
    custom: (content) => content.split('\n').length > 250,
    status: 'warn',
    repairHint: '考虑把 page.tsx 拆成总装（≤100 行）+ ./components/<Name>.tsx 多个独立子组件。readdy 标杆：home/page.tsx 33 行总装 + 5 个子组件文件。',
  },
  {
    name: 'page-too-long-no-split',
    description: 'page.tsx > 320 lines without ./components import — must split',
    onlyFiles: file => /\/page\.tsx$/.test(file),
    custom: (content) => {
      const lines = content.split('\n').length
      if (lines <= 320) return false
      // accept ./components/ OR ./_components/ (Next.js private folder convention)
      const hasComponentsImport = /from\s+['"]\.\/_?components\//.test(content)
      return !hasComponentsImport
    },
    status: 'critical',
    repairHint: 'page.tsx 超过 320 行且文件内没有 ./components/ 或 ./_components/ 的 import。必须拆分成 page.tsx 总装 + 独立子组件文件。每个子组件单文件，page.tsx 只做总装、状态管理和 workflow 跳转。',
  },
  {
    name: 'main-container-max-w',
    description: 'main container must not set max-w — AppLayout already controls content width',
    // Catches `max-w-[1600px]` / `max-w-screen-2xl` etc. on <main>. Tolerates
    // `max-w-full` / `max-w-none` which are explicit unbounded declarations.
    // L1 contract: `custom` returns boolean (file-level hit or not).
    custom: (content) => {
      const re = /<main\b[^>]*\sclassName=["']([^"']+)["']/g
      let m
      while ((m = re.exec(content)) !== null) {
        if (/\bmax-w-\[|\bmax-w-screen-/.test(m[1])) return true
      }
      return false
    },
    status: 'critical',
    repairHint: '删除 <main> 上的 max-w-[X] / max-w-screen-* 和配套的 mx-auto。AppLayout 已经控制了内容区域宽度，叠加 max-w 会在宽屏留大片空白。用 `w-full` 或省略宽度类。',
  },
  {
    name: 'main-container-double-padding',
    description: 'main container must not add p-6/p-8 because AppLayout already pads content',
    onlyFiles: file => /\/app\/.*\/?page\.tsx$/.test(file),
    custom: (content) => {
      const re = /<main\b[^>]*\sclassName=["']([^"']+)["']/g
      let m
      while ((m = re.exec(content)) !== null) {
        if (/\bp-(?:6|8)\b|\blg:p-8\b/.test(m[1])) return true
      }
      return false
    },
    status: 'critical',
    repairHint: '删除 <main> 上的 p-6 / p-8 / lg:p-8。AppLayout 主内容区已经有 p-6，页面 main 推荐 `w-full min-h-full space-y-6`，否则内容边距会翻倍。',
  },
  {
    name: 'raw-button-in-app',
    description: 'business app must use Forge <Button>/<ButtonGroup>, not raw <button>',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    pattern: /<button\b/,
    status: 'critical',
    repairHint: '业务 app 中出现 raw <button>。改用 `Button` / `IconButton` / `ButtonGroup` / `TabBar` 等 ForgeUI 组件；如果需要表格行动作，把交互放进 DataTable column render 里的 Forge <Button>。',
  },
  {
    name: 'checkbox-with-label-hydration',
    description: 'CheckboxWithLabel nests button semantics in current Forge core and can trigger React hydration errors',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    pattern: /\bCheckboxWithLabel\b/,
    status: 'critical',
    repairHint: '不要在 generated app 中使用 `CheckboxWithLabel`。改为 `CheckboxControl` + 独立 `span` 文本放在 `inline-flex` 容器里，避免 button 嵌套导致生产 hydration mismatch。',
  },
  {
    name: 'handrolled-visual-primitive',
    description: 'do not hand-roll Forge visual primitives in generated app pages',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    custom: (content) => {
      if (/<svg\b|<canvas\b/.test(content)) return true
      if (/\b(function|const)\s+(MiniBars?|MiniBarChart|Sparkline|GaugeRing|SegmentedGauge)\b/.test(content)) return true
      if (/style=\{\{[^}]*width:\s*`?\$\{[^}]+}%/.test(content)) return true
      return false
    },
    status: 'critical',
    repairHint: '不要在 generated app 里手搓 chart/gauge/progress/avatar/file/timeline 等 Forge 已有或应归 core 的视觉 primitive。优先改用 Forge `ChartCard`/`BarChart`/`HalfDonutChart`/`ProgressBar`/`Avatar`/`FileCard`/`HistoryItem`；确实缺组件时记录 `plugins/forge-app-design/FORGEUI-GAPS.md`，并用最接近的 Forge primitive 过渡，而不是业务页造轮子。',
  },
  {
    name: 'gradient-text-in-app',
    description: 'Forge admin app pages must not use gradient text',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    pattern: /\bbg-clip-text\b[\s\S]{0,160}\bbg-gradient-|\bbg-gradient-[^\s"']*[\s\S]{0,160}\bbg-clip-text\b|backgroundClip:\s*['"]text['"]|background-clip:\s*text/,
    status: 'critical',
    repairHint: '后台产品页禁止渐变文字。改成 Forge 语义色或普通 text-fg-* token；如果需要强调，用 StatCard/Label/Progress/Chart 等 Forge 组件表达业务状态，不要用 brand/landing 风格。',
  },
  {
    name: 'decorative-side-accent',
    description: 'rounded card with decorative left border accent tends to look AI-generated',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    pattern: /className=["'][^"']*\b(?:rounded-card|rounded-xl|rounded-2xl)\b[^"']*\bborder-l-(?:[3-9]|\[[^\]]+\])\b|className=["'][^"']*\bborder-l-(?:[3-9]|\[[^\]]+\])\b[^"']*\b(?:rounded-card|rounded-xl|rounded-2xl)\b/,
    status: 'warn',
    repairHint: '避免用 rounded 卡片左侧粗色条做装饰。优先用 Forge `StatusBadge` / `Label` / `ProgressBar` / `StatCard` 语义色表达状态；如果确实是日志/时间线结构，保留但确认不是装饰性重复样式。',
  },
  {
    name: 'marketing-buzzword-copy',
    description: 'admin UI copy should be concrete, not marketing buzzword copy',
    onlyFiles: file => isAppUiTsx(file),
    pattern: /\b(?:seamless|empower|empowers|empowering|supercharge|supercharges|world-class|cutting-edge|next-generation|revolutionary|unlock\s+(?:your\s+)?potential|delightful)\b/i,
    status: 'warn',
    repairHint: '把营销空话改成具体业务文案。后台页面应该说明对象、状态和动作，例如 `Resolve overdue SLA` / `Review failed syncs`，不要写 seamless / empower / supercharge 这类泛词。',
  },
  {
    name: 'internal-ia-copy-in-ui',
    description: 'internal IA/design constraints must not leak into visible admin UI copy',
    onlyFiles: file => isAppUiTsx(file),
    pattern: /\b(?:Artifact|Policy|Event|Operation|Overview)\s*\/|IA\s*约束|policy\s*生命周期|本页(?:只|不|独占|解释)|这里不(?:展示|处理|执行)|不(?:承载|直接确认|替代|承担)|只负责|万能(?:修复)?工作台|独立路由|dashboard\s*只做/i,
    status: 'critical',
    repairHint: '把内部 IA / lifecycle / anti-goal 文案从界面中移除，改成用户可见的业务文案。PageTitle、SurfaceCard subtitle、说明卡里不要展示 Artifact/Policy/Event/Operation、IA 约束、“本页不做什么”等调试式表达。',
  },
  {
    name: 'em-dash-copy',
    description: 'em dash in generated UI copy often signals unpolished AI prose',
    onlyFiles: file => isAppUiTsx(file),
    pattern: /—/,
    status: 'warn',
    repairHint: '把 em dash 文案改成更直接的短句、冒号或括号。后台产品文案优先清晰、短、可扫描。',
  },
  {
    name: 'transition-all-in-app',
    description: 'transition-all can animate layout properties and create product UI jank',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    pattern: /\btransition-all\b/,
    status: 'warn',
    repairHint: '不要默认使用 transition-all。改成具体属性，例如 `transition-colors` / `transition-opacity` / `transition-shadow`，并保持 150-250ms 的状态反馈动效。',
  },
  {
    name: 'custom-card-shell',
    description: 'business app must not define generic custom card shells when Forge card components fit',
    onlyFiles: file => /\/app\/.*\.tsx$/.test(file),
    custom: (content) => hasCustomCardShell(content),
    status: 'critical',
    repairHint: '业务 app 中出现自定义通用卡片壳（如 SectionCard / MiniCard / PanelCard）并直接拼 rounded/border/bg-white。优先换成 Forge `SurfaceCard` / `ChartCard` / `TaskCard` / `ProjectCard` / `ActivityCard` / `FileCard` / `ProgressCard` 等官方卡片族；如果当前 core 缺少匹配 primitive，先用最接近的 Forge 卡片并记录 `plugins/forge-app-design/FORGEUI-GAPS.md`，不要在业务页造视觉壳。',
  },
]

const CUSTOM_CARD_DECL_RE = /\b(?:export\s+)?(?:function|const)\s+(SectionCard|SurfaceCard|[A-Z][A-Za-z0-9]*(?:MiniCard|PanelCard|ShellCard|SummaryCard|InfoCard))\b/g
const OFFICIAL_CARD_FIXED_WIDTH_RE = /<(?:StatCard|ProgressStatCard|LineChartStatCard|WheelChartStatCard|BarChartStatCard|ProjectCard|TaskCard|UserCard|BalanceCard|ProgressCard|ImageStatCard|HighlightCard|MapCard|ChartCard)\b[^>]*(?:\bwidth=["']fixed["']|\bsize=["'](?:4col|6col|8col)["']|\bclassName=(?:["'`]|[{]\s*["'`])[^"'`>]*\bw-(?!(?:full|fit|auto|screen)\b)(?:\d+|\[[^\]]+\]))/
const CARD_SHELL_CLASS_RE = /className=["'][^"']*(?:rounded-card|rounded-xl|rounded-2xl)[^"']*(?:border|outline)[^"']*bg-white|className=["'][^"']*bg-white[^"']*(?:rounded-card|rounded-xl|rounded-2xl)[^"']*(?:border|outline)/
const OFFICIAL_CARD_RE = /<(?:SurfaceCard|ChartCard|TaskCard|ProjectCard|ActivityCard|FileCard|ProgressCard|HighlightCard|StatCard|ProgressStatCard|BarChartStatCard|ImageStatCard|MapCard)\b/
const OPERATIONAL_QUEUE_SIGNAL_RE = /\b(?:queue|Queue|review|Review|triage|Triage|case|Case|ticket|Ticket|approval|Approval|exception|Exception|incident|Incident|SLA|blocked|Blocked|owner|Owner|assignee|Assignee|priority|Priority|队列|复核|异常|工单|审批)\b/
const OVER_ROUNDED_SURFACE_RE = /\brounded-(?:2xl|3xl|\[[^\]]+\])\b/
const COARSE_ADMIN_DENSITY_RE = /\b(?:p|px|py|gap|space-y)-(?:7|8|10|12|16)\b|\btext-(?:3xl|4xl|5xl|6xl)\b/

function hasCustomCardShell(content) {
  let match
  while ((match = CUSTOM_CARD_DECL_RE.exec(content)) !== null) {
    const body = sliceDeclarationBody(content, match.index)
    if (CARD_SHELL_CLASS_RE.test(body) && !OFFICIAL_CARD_RE.test(body)) return true
  }
  return false
}

function stripMainClassNames(content) {
  return content.replace(/<main\b[^>]*\sclassName=["'][^"']+["'][^>]*>/g, '<main>')
}

function hasOperationalQueueDataTable(content) {
  return /<DataTable\b/.test(content)
    && /\bshowCheckbox\b|\bshowPagination\b/.test(content)
    && OPERATIONAL_QUEUE_SIGNAL_RE.test(content)
}

function hasRichListIdentitySignal(content) {
  return /<Avatar\b|<ProductRow\b|<UserCard\b|CellImageText|CellUser|\binitials\s*=|\bavatar\b|\blogo\b/i.test(content)
}

function hasRichListActionSignal(content) {
  return /<StyledLink\b|<Link\b|<Button\b[\s\S]{0,180}\bonClick=|<Button\b[\s\S]{0,180}\bhref=|\bhref\s*=/.test(content)
}

function isAppUiTsx(file) {
  return /\/app\/.*\.tsx$/.test(file) && !/\/app\/layout\.tsx$/.test(file)
}

function isActionFormRoute(file) {
  return /\/app\/.*(?:\/|^)(?:new|create|edit|submit|import)\/page\.tsx$/.test(file)
    || /\/app\/.*\/\[id\]\/edit\/page\.tsx$/.test(file)
}

function isLikelyActionFormContent(content) {
  return /<(?:TextField|TextArea|SelectOption|Checkbox|Datepicker|FileUpload|MediaUpload)\b/.test(content)
    || /\b(?:Save|Submit|Cancel|保存|提交|取消|创建|新建|编辑)\b/.test(content)
}

function hasActionFormExit(content) {
  return /<Breadcrumbs\b/.test(content)
    || /\bbreadcrumbs\s*=/.test(content)
    || /\bshowBackButton\b/.test(content)
    || /\bbackHref\s*=/.test(content)
    || /\bsecondaryActionLabel\s*=/.test(content)
    || />\s*(?:Cancel|Back|取消|返回)\s*</.test(content)
}

function hasLongActionDescription(content) {
  const attrRe = /\b(?:description|subtitle)=\s*(["'])([^"']{81,})\1/g
  if (attrRe.test(content)) return true

  const pageTitleRe = /<PageTitle\b[\s\S]{0,600}\/?>/g
  let match
  while ((match = pageTitleRe.exec(content)) !== null) {
    if (/\bdescription=\{`[^`]{81,}`\}/.test(match[0])) return true
  }
  const header = content.match(/<header\b[\s\S]{0,1400}<\/header>/)
  if (header && /<p\b[^>]*>\s*[^<]{100,}\s*<\/p>/.test(header[0])) return true
  return false
}

function sliceDeclarationBody(content, start) {
  const rest = content.slice(start + 1)
  const next = rest.search(/\n(?:export\s+)?(?:function|const)\s+[A-Z]/)
  if (next === -1) return content.slice(start)
  return content.slice(start, start + 1 + next)
}

function lineOf(content, index) {
  return content.slice(0, index).split('\n').length
}

export function checkL1Grep(targetDir, files) {
  const results = []
  for (const rule of RULES) {
    const hits = []
    for (const file of files) {
      let content
      try { content = readFileSync(file, 'utf8') } catch { continue }
      if (rule.onlyFiles && !rule.onlyFiles(file, content)) continue

      if (rule.custom) {
        if (rule.custom(content)) hits.push(relative(targetDir, file))
        continue
      }

      const flags = rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g'
      const pat = new RegExp(rule.pattern.source, flags)
      let m
      while ((m = pat.exec(content)) !== null) {
        hits.push(`${relative(targetDir, file)}:${lineOf(content, m.index)}`)
      }
    }
    results.push({
      level: 'L1',
      name: rule.name,
      description: rule.description,
      status: hits.length ? rule.status : 'pass',
      files: hits,
      repairHint: hits.length ? rule.repairHint : undefined,
    })
  }
  return results
}

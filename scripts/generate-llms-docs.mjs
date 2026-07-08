import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const corePackagePath = path.join(root, "core/package.json");
const forgeAppDesignRoot = resolveForgeAppDesignRoot();
const registryPath = forgeAppDesignRoot
  ? path.join(forgeAppDesignRoot, "references/component-registry-lite.json")
  : null;
const blockCatalogPath = forgeAppDesignRoot
  ? path.join(forgeAppDesignRoot, "references/block-catalog-lite.json")
  : null;

const corePackage = JSON.parse(readFileSync(corePackagePath, "utf8"));
const registry = readJsonOrDefault(registryPath, { components: [] });
const blockCatalog = readJsonOrDefault(blockCatalogPath, { blocks: [] });

const site = "https://forgeui.org";
const components = [...registry.components].sort((a, b) => a.name.localeCompare(b.name));
const blocks = [...blockCatalog.blocks].sort((a, b) => a.id.localeCompare(b.id));

function listPageRoutes(baseDir, urlPrefix) {
  const absBase = path.join(root, baseDir);
  if (!existsSync(absBase)) return [];
  const routes = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir).sort()) {
      const abs = path.join(dir, entry);
      const st = statSync(abs);
      if (st.isDirectory()) {
        visit(abs);
        continue;
      }
      if (entry !== "page.tsx") continue;
      const relDir = path.relative(absBase, path.dirname(abs)).split(path.sep).filter(Boolean);
      const route = relDir
        .filter((segment) => !segment.startsWith("(") || !segment.endsWith(")"))
        .join("/");
      routes.push(`${urlPrefix}${route ? `/${route}` : ""}`);
    }
  };
  visit(absBase);
  return routes;
}

const caseRoutes = listPageRoutes("src/app/cases", "/cases");
const templateRoutes = listPageRoutes("src/app/templates", "/templates");

function resolveForgeAppDesignRoot() {
  const candidates = [
    process.env.FORGE_APP_DESIGN_ROOT,
    path.resolve(root, "../forge-app-design"),
  ].filter(Boolean);

  return candidates.find((candidate) =>
    existsSync(path.join(candidate, "references/component-registry-lite.json")),
  );
}

function readJsonOrDefault(file, fallback) {
  if (!file || !existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, "utf8"));
}

function bulletList(items, limit = Infinity) {
  return items.slice(0, limit).map((item) => `- ${item}`).join("\n");
}

function componentLine(component) {
  const bestFor = component.recommendedFor || component.bestFor || [];
  const avoid = component.avoidFor || component.avoidWhen || [];
  return `- ${component.name} (${component.category}) — import { ${component.import?.name || component.name} } from "${component.import?.from || "@forge-ui-official/core"}"; best for: ${bestFor.join(", ") || "general Forge UI composition"}; avoid: ${avoid.join(", ") || "none recorded"}; source: ${component.source || "core/src/components"}`;
}

function componentMarkdown(component) {
  const bestFor = component.recommendedFor || component.bestFor || [];
  const avoid = component.avoidFor || component.avoidWhen || [];
  const required = component.requiredUsage || component.constraints || [];
  const forbidden = component.forbiddenUsage || [];
  return `## ${component.name}

- Category: ${component.category}
- Import: \`import { ${component.import?.name || component.name} } from "${component.import?.from || "@forge-ui-official/core"}"\`
- Responsive: ${component.responsive || "not recorded"}
- Density: ${component.density || "not recorded"}
- Source: \`${component.source || "core/src/components"}\`
- Purpose: ${component.purpose || "Forge UI component."}
- Best for: ${bestFor.join("; ") || "general Forge UI composition"}
- Avoid for: ${avoid.join("; ") || "none recorded"}
- Required usage: ${required.join("; ") || "use the component's props and Forge tokens before custom markup"}
- Forbidden usage: ${forbidden.join("; ") || "do not rebuild existing Forge primitives with ad hoc markup"}
`;
}

function blockMarkdown(block) {
  return `## ${block.id}

- Role: ${block.role}
- Intent: ${block.intent}
${block.pattern ? `- Pattern: ${block.pattern}\n` : ""}- Components: ${(block.components || []).join(", ")}
${block.firstViewportMustShow ? `- First viewport must show: ${block.firstViewportMustShow.join("; ")}\n` : ""}${block.inputs ? `- Inputs: ${block.inputs.join("; ")}\n` : ""}- Red lines: ${(block.redLines || []).join("; ") || "none recorded"}
`;
}

const componentSummary = components.map(componentLine).join("\n");
const componentDocs = components.map(componentMarkdown).join("\n");
const blockDocs = blocks.map(blockMarkdown).join("\n");

const llmsTxt = `# Forge UI Kit

> Forge UI Kit is a React 19 + Tailwind v4 component system for dense admin/SaaS prototypes. Use it with @forge-ui-official/core, Forge Starter, and forge-app-design guardrails.

Website: ${site}
Package: @forge-ui-official/core@${corePackage.version}
Framework: Next.js 16, React 19, Tailwind CSS v4

## Primary Agent Docs

- ${site}/llms-full.txt — full English-oriented Forge UI agent context.
- ${site}/llms-full.md — markdown mirror of the full English Forge UI agent context.
- ${site}/llms-full-cn.txt — full Chinese Forge UI agent context.
- ${site}/llms-full-cn.md — markdown mirror of the full Chinese Forge UI agent context.
- ${site}/llms-semantic.md — component semantics, page-role rules, and composition red lines.
- ${site}/llms-components.md — generated component catalog from forge-app-design component registry.
- ${site}/docs/ui-for-agents — UI for Agents guide and skill installation.
- ${site}/docs/agents-md — AGENTS.md prompt for Forge UI projects.
- ${site}/cases — component case gallery.
- ${site}/templates — admin/dashboard templates.

## Core Rules

- Import components only from @forge-ui-official/core.
- Import styles with @import "@forge-ui-official/core/styles.css" and Tailwind v4 @source for the package dist.
- Use fg-* design tokens; do not use Tailwind default colors for Forge surfaces.
- Use solar-icon-set for icons; pass size and color props directly.
- Use AppLayout for admin shells; do not rebuild sidebar, topbar, or profile areas.
- Design the business module, data flow, fields, actions, and page role before choosing components.
- Prefer existing cases, templates, precedents, component registry, and Forge Starter before freehand composition.

## Useful Source Paths

- core/src/components/ui — primitive and composite Forge UI components.
- core/src/components/layouts — AppLayout and layout shells.
- core/src/styles/tokens.css — fg-* tokens and Tailwind v4 theme.
- forge-app-design/references/component-registry.json — optional external full component usage registry.
- forge-app-design/references/block-catalog-lite.json — optional external page/block composition catalog.
- forge-app-design/references/protask-forge-visual-baseline.md — optional external visual density baseline.
- forge-app-design/references/dataset-recall-policy.md — optional external business corpus recall policy.
`;

const fullEn = `# Forge UI Kit Agent Context

Forge UI Kit is a component library for building operational admin systems with React 19, Next.js 16, Tailwind v4, and solar-icon-set. The package is \`@forge-ui-official/core@${corePackage.version}\`.

## When To Use

Use Forge UI Kit for SaaS dashboards, admin consoles, CRM/ERP/WMS/MES/IoT/AI operations surfaces, queue/list/detail/action workflows, and starter-based prototypes.

Do not use it as a marketing landing-page library or as permission to hand-roll UI. Forge UI provides the visual baseline and implementation primitives; product design still owns the business module map, user goal, data flow, field model, action design, and page intent.

## Install And Wire

\`\`\`css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../../node_modules/@forge-ui-official/core/dist";
\`\`\`

\`\`\`tsx
import { AppLayout, Button, DataTable, SurfaceCard } from "@forge-ui-official/core";
\`\`\`

Icons use \`solar-icon-set\`:

\`\`\`tsx
import { HomeLinear } from "solar-icon-set";

<HomeLinear size={20} color="#71717A" />
\`\`\`

## Non-Negotiable Rules

- Components: import from \`@forge-ui-official/core\` only.
- Colors: use \`fg-*\` tokens only. Avoid Tailwind default colors such as \`text-blue-500\`, \`bg-gray-100\`, or arbitrary hex in page markup.
- Icons: use \`solar-icon-set\`; pass \`size\` and \`color\` props. Do not rely on \`className="text-*"\` for icon color.
- Layout: use \`AppLayout\` for admin shells. Do not rebuild sidebar, topbar, or profile regions in route files.
- Density: keep operational pages compact and scannable. Avoid large decorative hero sections, oversized page titles, wide blank gaps, fixed card widths, and nested cards.
- Responsiveness: components should fill parent grid/flex tracks. Use parent layout constraints, not fixed component widths.
- Missing primitive: record a ForgeUI gap or ask the user. Do not hand-roll a reusable primitive inside a business page.

## Page Design Order

1. Define module map: business object, lifecycle, entry surface, route role, data reads/writes, fields, filters, actions, and next workflow closure.
2. Define Page Intent Spec: user_goal, primary_decision, primary_action, secondary_context, business_flow, data_flow, field_model, layout_decision, action_design, component_plan.
3. Recall precedents: cases, templates, Forge Starter, forge-app-design patterns, and dataset module contracts.
4. Choose layout pattern by role: dashboard, list, detail, action, workflow, settings, report, workspace.
5. Map fields to components with the registry.
6. Implement with ForgeUI, then verify typecheck/build/browser screenshot/visual/product-quality gates when building an app.

## Component Catalog Summary

${componentSummary}

## Case Routes

${bulletList(caseRoutes)}

## Template Routes

${bulletList(templateRoutes)}

## Composition Blocks

${blockDocs}
`;

const fullCn = `# Forge UI Kit Agent 上下文

Forge UI Kit 是面向后台管理系统和 SaaS 原型的 React 19 + Next.js 16 + Tailwind v4 组件库。核心包是 \`@forge-ui-official/core@${corePackage.version}\`。

## 使用边界

适合：后台管理、运营控制台、CRM/ERP/WMS/MES/IoT/AI 运维、dashboard/list/detail/action/workflow/settings/report/workspace 等业务页面。

不适合：营销落地页、纯装饰页面、用自由 CSS 重写组件库。ForgeUI 负责基础视觉和组件落地；业务模块地图、用户目标、数据流、字段、动作、页面意图仍然必须先设计清楚。

## 接入方式

\`\`\`css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../../node_modules/@forge-ui-official/core/dist";
\`\`\`

\`\`\`tsx
import { AppLayout, Button, DataTable, SurfaceCard } from "@forge-ui-official/core";
\`\`\`

Icon 使用 \`solar-icon-set\`：

\`\`\`tsx
import { HomeLinear } from "solar-icon-set";

<HomeLinear size={20} color="#71717A" />
\`\`\`

## 硬规则

- 组件只从 \`@forge-ui-official/core\` 导入。
- 颜色只用 \`fg-*\` token，不在业务页使用 Tailwind 默认色或裸 hex。
- Icon 用 \`solar-icon-set\`，通过 \`size\` / \`color\` prop 控制。
- 后台壳层用 \`AppLayout\`，不要在业务页重写 sidebar/topbar/profile。
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

${componentSummary}

## Case 路由

${bulletList(caseRoutes)}

## Template 路由

${bulletList(templateRoutes)}

## 页面组合块

${blockDocs}
`;

const semantic = `# Forge UI Semantic Guide For Agents

## Authority Order

1. Current user PRD and business objective.
2. Product Design handoff / Page Intent Specs.
3. forge-app-design dataset and pattern recall.
4. ForgeUI component registry and block catalog.
5. Forge cases/templates/starter precedents.
6. Route-local composition code.

Never invert this order. A component plan cannot replace business flow, data flow, field design, or action closure.

## Page Roles

- Dashboard: control tower with KPI strip, trend/risk view, priority work, activity, and entry points. Not just four KPI cards.
- List/queue: filters, density, first-screen rows/cards, identity, owner, risk/status, evidence, row/bulk actions.
- Detail/triage: identity header, status, evidence, root cause, impact, history, resolution, audit trail, next workflow.
- Action/form: grouped fields, right-side context, preflight/impact, guarded submit, pending/error/success feedback.
- Workflow/kanban: lanes, state transitions, card actions, progress, diagnostic links, empty states.
- Settings: grouped settings, owner/audit, test result, rollback/history, scope/impact.
- Report/analysis: metric/trend plus affected entity list and action handoff.
- Workspace/builder: artifact canvas, side inspector, validation/readiness rail, publish/rollback.

## Visual Baseline

- Use restrained typography. Routine admin titles should not look like landing-page hero text.
- Body and card text should prefer Forge defaults over route-local font overrides.
- Cards, tables, charts, rails, and profile regions should fill parent layout tracks instead of fixed pixel widths.
- Avoid nested cards, decorative gradients, saturated one-note palettes, and excessive blank gutters.
- Use compact summary strips or rails; do not push the primary table/queue below the first viewport.

## Field To Component Mapping

- Identity, owner, assignee: Avatar, ProfileCard, ContactItem, CellImageText.
- Status/risk/priority: Label, StatusBadge, ProgressBadge, NotificationBadge.
- Metrics: StatCard, ProgressStatCard, chart stat cards, ProgressBar.
- Tables/queues: DataTable, TableCell primitives, Toolbar, FilterGroup.
- Activity/history/audit: HistoryItem, HistoryGrouped, ActivityCard, NotificationItem.
- Forms/settings: TextField, TextArea, SelectOption, Datepicker, Checkbox, RadioButton, Toggle, FileUpload, ColorPicker.
- Navigation/shell: AppLayout, SidebarMenu, TopBar, PageHeader, Breadcrumbs, TabBar, ButtonGroup.

## Red Lines

- Do not rebuild existing Forge primitives with ad hoc div/span markup.
- Do not use Tailwind default color families in business pages.
- Do not hard-code card widths for normal responsive grid cards.
- Do not add generic subtitle text that repeats the title or obvious UI behavior.
- Do not copy source-project menu trees, field names, or visual structures from repo-intake. Recall, adapt, redesign.
- Do not claim a route is complete without Page Intent Specs and acceptance evidence in forge-app-design workflows.

## Block Catalog

${blockDocs}
`;

const componentCatalog = `# Forge UI Generated Component Catalog

Source: \`forge-app-design/references/component-registry-lite.json\`
Package: \`@forge-ui-official/core@${corePackage.version}\`

Use this file for quick component selection. For stricter generation, read the external \`forge-app-design/references/component-registry.json\`.

${componentDocs}
`;

const outputDirs = [publicDir];
for (const dir of outputDirs) mkdirSync(dir, { recursive: true });

const outputs = {
  "llms.txt": llmsTxt,
  "llms-full.txt": fullEn,
  "llms-full.md": fullEn,
  "llms-full-cn.txt": fullCn,
  "llms-full-cn.md": fullCn,
  "llms-semantic.md": semantic,
  "llms-components.md": componentCatalog,
};

for (const [name, content] of Object.entries(outputs)) {
  for (const dir of outputDirs) {
    writeFileSync(path.join(dir, name), `${content.trim()}\n`, "utf8");
  }
}

console.log(`Generated ${Object.keys(outputs).length} LLM docs in public/`);
for (const name of Object.keys(outputs)) {
  console.log(`- public/${name}`);
}

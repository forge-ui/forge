---
name: forge-skill
description: "Forge / forge-ui 页面设计与实施规范；用于看板、后台、starter、业务系统、React 组件选型和模板一致性审查。"
metadata:
  author: forge-ui
  version: "0.1.5"
  docs: "https://forgeui.org/"
---

# Forge UI Kit — React Development Guide

Forge UI Kit (`@forge-ui-official/core`) is a ToB-focused design system for Next.js 16 + React 19 + Tailwind v4 projects. Use it when you're building dashboards, admin consoles, ecommerce back-offices, or any page that needs a sidebar + topbar + data-dense content shell.

**Live docs**: https://forgeui.org/
**Package**: `@forge-ui-official/core` (MIT, public npm package)

---

## One-line install (this skill itself)

```bash
curl -fsSL https://forgeui.org/install-skill.sh | bash
```

Default target is `~/.claude/skills/forge-skill/`. For Codex, install into `~/.codex/skills/forge-skill/`:

```bash
curl -fsSL https://forgeui.org/install-skill.sh | FORGE_AGENT=codex bash
```

Use `FORGE_SKILLS_DIR=/path/to/skills` for any other agent. Re-run any time to update.

---

## 页面审查入口

业务页面完成或改版后，按 [视觉与交互审查](references/visual-interaction-audit.md)核对配色、圆角与外形、字体字号、布局密度、整体风格和交互反馈。组件导入仅是基础检查。仅设计任务检查结构与标注，不声称完成真实运行审计；实施任务按授权页面做浏览器验证。

## Critical — read before writing code

1. **Components come from `@forge-ui-official/core` first.** Do **not** hand-roll raw Tailwind recreations of Kit primitives such as cards, status badges, toolbars, dialogs, forms, tables, or app chrome. Composing Kit components into new business layouts is expected.
2. **Colors come from `fg-*` tokens.** Never use Tailwind's default palette (`text-blue-500`, `bg-gray-100`). Use `text-fg-violet`, `bg-fg-grey-100`, etc. When a shade doesn't exist, stop and ask before adding one.
3. **Icons come from `@forge-ui-official/core/icons`.** The stable Forge names end in `Linear` / `Bold` / `BoldDuotone` / `LineDuotone`, while the implementation uses Solar Icons (MIT React implementation; CC BY 4.0 artwork by 480 Design). Prefer explicit `size` and `color` props for deterministic rendering; `currentColor` inheritance is also supported. Common sizes are 14/16/18/20/24. Default muted icon color: `#71717A`.
4. **Layout uses `<AppLayout>`. For page columns, spans and responsive spacing, read [layout-grid](references/layout-grid.md) and inherit the closest template’s fixed/proportional columns, gaps and breakpoints before using `Grid` / `GridItem`. Preserve fixed rails with static CSS Grid/Flex; keep one-dimensional toolbars in Flex.** Don't assemble sidebar + topbar from scratch. Auth forms currently have no ready-made Forge template; compose them from `TextField`, `Checkbox`, `Button`, and `StyledLink`.
5. **When in doubt, read the matching case page** (`src/app/cases/<name>/page.tsx`). Cases show real prop combinations. Guessing props wastes everyone's time.
6. **Scope before workflow.** The authorized scope governs all contracts and checks below. Specification-only and single-page requests use Workflow for new features; complete-system implementation uses Strict Admin Mode. A business-module name alone does not authorize a broader system or implementation.
7. **`ConfirmationDialog` supports controlled `open` / `onOpenChange`.** Use that mode for a standalone confirmation; omitting `open` retains the inline content card for an existing host dialog. Do not add a second dialog shell around controlled mode. Confirm callbacks own async success and closing; cancellation requests `onOpenChange(false)`.
8. **Forge exports `Drawer`, `ToastProvider` and `useToast`.** `Drawer` uses controlled `open` / `onOpenChange`; `useToast` must run below `ToastProvider` and returns `toast`, `dismiss`, `update`. Reuse an existing host provider when appropriate; do not infer a `Sheet`, `Snackbar` or standalone `Toast` export. Check the installed package version before using these APIs.
9. **Status presentation:** read [status presentation](references/status-presentation.md). Preserve an explicit project convention; otherwise recommend plain status text (also this repository’s convention). Soft StatusBadge is a task-specific alternative requiring a business reason, not a mandatory choice before delivery. Categories and roles remain plain text. This recommendation does not record user acceptance.

---

## Installation (host project)

See https://forgeui.org/docs/quick-start/ for the full walk-through. Summary:

1. Install the package: `pnpm add @forge-ui-official/core`.
2. `app/globals.css`:
   ```css
   @import "tailwindcss";
   @import "@forge-ui-official/core/styles.css";
   @source "../../node_modules/@forge-ui-official/core/dist";
   ```

Peer deps (consumer-provided): `react>=19`, `react-dom>=19`, `tailwindcss^4`, `@solar-icons/react^2.3.2`, `next>=15` (optional, needed if you use `AppLayout` or any component that imports `next/link`). Import Forge icons from `@forge-ui-official/core/icons`, not directly from the peer package.

Tailwind v4 also needs the PostCSS plugin in real Next projects:

```bash
pnpm add -D tailwindcss @tailwindcss/postcss
```

`postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

Without `@tailwindcss/postcss`, Next can render the page but Tailwind/Forge utility classes won't compile correctly.

---

## Getting concrete component info (don't guess)

The Kit has 20+ component spec groups plus business templates and case pages. **Don't load all their docs into context up-front.** Use the scripts below to pull exactly what you need when you need it:

```bash
# List every component / case / template available
node scripts/list.mjs

# Read a component's spec page (props, variants, usage, API table)
node scripts/get-component.mjs button-link
node scripts/get-component.mjs table

# Read a case page — bigger example, shows color × size × variant matrices
node scripts/get-case.mjs button-link
node scripts/get-case.mjs table

# Read a template page — real business screen assembled from the Kit
node scripts/get-template.mjs ecommerce/products
node scripts/get-template.mjs dashboard-builder
```

Scripts read a local Forge checkout first when available, then fall back to `github.com/forge-ui/forge/main` over HTTPS.

Design tokens (colors, shadows, radii, typography) live in `references/tokens.md` — read it when you need exact hex values or shade names.

Page patterns for common admin screens live in `references/page-patterns.md` — read it when designing app shells, auth flows, dashboards, CRUD, analytics/reporting, settings, messages, calendar, profile, file manager, invoice/billing, team/member, audit/activity, stepper, card/kanban, or chat/agent pages.

Admin module product logic lives in `references/admin-module-playbook.md` — read it before building resource-management, workflow, settings, file, billing, team, or other back-office modules. Use it to identify business objects, resource contracts, states and transitions, page maps, actions, filters, dialogs/drawers/routes, permissions, URL state, and CRUD/workflow chains before composing UI.

Strict admin contracts live in `references/contracts/`:

- `system-brief.md` — required for systems, platforms, and multi-module admin products.
- `module-contract.md` — required for each core resource or workflow module.
- `page-flow.md` — required before routes, drawers, dialogs, and cross-module jumps.
- `component-mapping.md` — required before choosing Forge components.
- `verification.md` — required before completion.

Business blueprints live in `references/blueprints/`. Load the nearest one after choosing the archetype:

- `ecommerce.md` — products, orders, customers, inventory, refunds, sellers.
- `project-ops.md` — projects, tasks, files, members, clients, invoices.
- `crm.md` — deals, contacts, companies, activities, pipeline.
- `approval.md` — requests, reviews, approval queues, rules, audit.
- `data-ops.md` — datasets, reports, jobs, imports, exports.
- `support.md` — tickets, inbox, SLA, knowledge base, agents.
- `finance.md` — invoices, payments, refunds, exports, tax.
- `files.md` — files, folders, sharing, versions, recycle bin.
- `governance.md` — users, roles, permissions, audit, integrations.

---

## Conventions

### Colors — `fg-*` tokens only

8 color families × 10 shades (50–900), plus grey and white:

- `fg-violet` (brand accent, 500 is the primary)
- `fg-blue`, `fg-green`, `fg-red`, `fg-yellow`, `fg-cyan`
- `fg-black` (⚠ 500 = `#000A19`, not pure black)
- `fg-grey`
- `fg-white`

Usage: `bg-fg-violet-500`, `text-fg-grey-700`, `border-fg-grey-200`, `var(--fg-violet)` for CSS. Shades convention: 50/100 for pale backgrounds, 500 for primary, 700+ for deep backgrounds or high-contrast text.

See `references/tokens.md` for the full table and semantic aliases (`--accent`, `--text-muted`, `--border`, etc.).

### Icons — `@forge-ui-official/core/icons`

```tsx
import { BellBoldDuotone, MagniferLinear } from "@forge-ui-official/core/icons";

<MagniferLinear size={16} color="#71717A" />
<BellBoldDuotone size={24} color="var(--fg-violet)" />
```

Prefer `size={16}` and `color="..."` as the icon styling API. The compatibility layer also supports inherited `currentColor` and standard SVG props.

Icon names must exist in `@forge-ui-official/core/icons`. For add/create actions, prefer semantic names such as `AddCircleLinear`, `AddSquareLinear`, `CartPlusLinear`, or `UserPlusLinear`; `PlusLinear` is available for a generic add glyph.

### Layout — `<AppLayout>`

Sidebar + topbar + content shell. One component covers the whole admin chrome:

```tsx
import { AppLayout } from "@forge-ui-official/core";

<AppLayout
  mode="light"                   // light | dark
  accent="purple"                // purple | blue | black
  profilePosition="sidebar"      // sidebar | topbar
  teamName="Acme Inc"
  teamAvatar="/my-logo.svg"      // optional — falls back to Forge default
  menuItems={[
    { icon: <HomeLinear size={20} />, label: "Dashboard", href: "/dashboard" },
    { label: "Orders", href: "/orders", badge: 3 },
  ]}
  profile={{ avatar: "/me.jpg", name: "Jane Doe", role: "Admin" }}
  pageTitle="Orders"
  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Orders" }]}
  pageHeaderVariant="detail"     // home | detail
  primaryAction={{ label: "New" }}
>
  {/* your business content */}
</AppLayout>
```

For team switcher popover content, pass `teams={Team[]}` — if you don't, the popover just shows the current team and the create/invite actions.

`AppLayout` is a client component. In Server Components, pass serializable props only. If a header action needs `onClick`, put the `<AppLayout>` usage in a `"use client"` screen component and pass server-fetched data into that screen.

### Templates

Ready-made pages you can copy rather than build from scratch:

- `/templates/ecommerce/{products,orders,customers,sellers,categories}` — list + detail + new for each
- `/templates/project-template/{clients,files,invoices,members,overview,projects,tasks}` — operational modules with lists, detail tabs, dialogs, files, invoices, members, and tasks
- `/templates/protask/project` — project/task dashboard reference
- `/templates/dashboard-builder/[variant]` — 8 sidebar × accent shells to pick from

Use `scripts/get-template.mjs` to read the source.

Forge currently has no `/templates/auth/*` source. For auth screens, compose the form with the Kit primitives and cover loading, validation, error, disabled submit, secondary links, and success redirect.

---

## Strict Admin Mode

Use this full sequence only for an explicitly authorized complete-system implementation. Design-only, single-page and bounded module work use Workflow for new features and only relevant contracts. These scope rules take precedence over generic contract checklists. Do not infer implementation permission from “后台” or a module name.

1. **PRD Intake Mode**: for normal PRDs, extract requirements directly; for large Word/PDF documents, first extract structured requirements. Do not summarize away object fields, states, actions, permissions, pages, flows, or acceptance criteria.
2. Classify the archetype: `commerce-ops`, `project-ops`, `crm`, `approval`, `data-ops`, `support`, `finance`, `files`, `governance`, or `custom`.
3. Read `references/contracts/system-brief.md` and the nearest `references/blueprints/<archetype>.md`.
4. Produce a concise System Brief before implementation. Describe only the authorized system scope; do not add modules or an implementation slice to a design-only request.
5. For every core module you will implement, read `references/contracts/module-contract.md` and produce a Module Contract.
6. Read `references/contracts/page-flow.md` and define routes, entry points, exits, URL state, and mobile behavior.
7. Read `references/contracts/component-mapping.md`, then choose Forge components and templates.
8. Implement from the closest existing template when possible. Use `/templates/ecommerce/*` for commerce and `/templates/project-template/*` for project operations before building from scratch.
9. Before finishing, read `references/contracts/verification.md`, run the host project's typecheck/build, start the app when possible, and verify in browser with a screenshot.

PRD intake output must preserve:

- System positioning and business scope.
- Target users, roles, and permissions.
- Menus, modules, routes, and required pages.
- Core objects, fields, states, transitions, and row/bulk actions.
- CRUD, query, calculation, approval, export, import, and job flows.
- Feedback states: loading, success, failure, empty, no-results, permission denied.
- Acceptance criteria and viewport/layout constraints.

Optional contract check:

```bash
node scripts/check-brief.mjs path/to/brief.md
```

If a generated admin page feels like a report, stop and add the missing business loop: list or queue -> detail -> action -> feedback -> audit.

## Business page design with dimensional-drawing

For new pages, structural redesigns, or page specifications, read [page-design-dimensional](references/page-design-dimensional.md). For component sizing ownership, overflow, states and host responsibilities, read [component combination rules](references/component-recommended-standard.md). Start from the actual business task, research matching mature scaffold pages across languages, then use the installed `dimensional-drawing` skill to define slots, dimensions, responsive structure and evidence. Choose a template only after verifying task fit; product creation is not the default form layout. Reuse accepted designs and proceed within the user-authorized scope.

## Workflow for new features

1. Establish the authorized scope: specification only, one page, a module, or a complete system. Do not invent modules, audit feeds, dashboards or network integrations to satisfy a template.
2. Extract roles, objects, states, main task, fields, permissions and entry/return paths. For a whole admin system apply Strict Admin Mode; for one page use only relevant contracts.
3. Read `references/page-design-dimensional.md`. Select a page pattern from the task; inspect a matching Forge case/template and record why it fits. Research mature sources when needed, with evidence labels.
4. Produce slots, fixed/FLEX/HUG regions, gap ownership, overflow, responsive rules and relevant states. Separate recommended rules from implementation facts. Use dimensional-drawing for structural design.
5. Each TBD needs reason, impact, temporary usable rule, decision owner and revisit trigger. Keep implementation defects and optional platform tests separate from specification completion.
6. Before implementation, read real component props/case source. Compose existing Forge components; extend Core only within explicit authorization. Design-only work does not require building a business app.
7. Verify to the requested delivery level: document links/formulas/diagram readability for a specification; build/typecheck and actual browser flows when implementation is authorized. Record user review separately.
8. Deliver one review entry listing completed scope, recommended defaults, only genuinely blocking business choices, allowed TBDs, known implementation gaps and evidence limits. Do not require all historic defects or whole-library tests to pass for a standards deliverable.

---

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Kit components render as naked divs | Tailwind didn't scan `node_modules/@forge-ui-official/core/dist` | Add `@source "../../node_modules/@forge-ui-official/core/dist";` to `globals.css` |
| Tailwind utilities do not compile in Next | Missing Tailwind v4 PostCSS plugin | Install `@tailwindcss/postcss` and add it to `postcss.config.mjs` |
| `@forge-ui-official/core/icons` icon inherits an unexpected color | Parent `currentColor` is different from the intended semantic color | Use `color="#HEX"` or `color="var(--fg-violet)"` explicitly |
| `@forge-ui-official/core/icons` icon looks squished | Wrapper has `p-*` or fixed height | Wrap with a square `w-X h-X` box or `inline-flex items-center` |
| `Cannot find module "@forge-ui-official/core/styles.css"` | Package version too old (<0.1.0) | `pnpm update @forge-ui-official/core` |
| Confirmation appears inline unexpectedly | `open` was omitted, selecting compatibility content mode | Supply controlled `open` / `onOpenChange`, or intentionally keep inline mode inside one existing shell |
| Overlay API import fails | Installed package may differ from this checkout | Local source 0.4.7 exports Drawer, ToastProvider and useToast via the root UI barrel. Check installed exports/types; earliest supported release is not established here. Do not infer standalone Toast, Sheet or Snackbar |

---

## Pre-submit checklist

- [ ] No hand-rolled `<div>` reproductions of Kit components
- [ ] Composite components checked through their content layer using references/component-recommended-standard.md; table Cell* typography, row height, alignment and overflow compared with the installed case
- [ ] Status follows references/status-presentation.md and the explicitly adopted project style; no unapproved soft default or rainbow enums
- [ ] All colors are `fg-*` tokens, no bare Tailwind colors
- [ ] All icons come from `@forge-ui-official/core/icons`; semantic colors use an explicit `color` prop
- [ ] Layout uses `<AppLayout>` or an existing template
- [ ] Source template recorded; fixed rail widths and field density preserved; breakpoint changes have browser evidence
- [ ] Only authorized system implementation checks its required modules; design/single-page work does not invent dashboards, audit paths or modules
- [ ] List search/filter/sort/page state is in URL when the view should be shareable
- [ ] Detail pages include back/breadcrumbs, related data, and the next useful action
- [ ] Dangerous actions use controlled `ConfirmationDialog`, or inline mode inside one existing dialog shell
- [ ] Form errors map back to fields, not only toast
- [ ] For authorized implementation, host typecheck/build passes; design-only delivery checks rules, links and diagrams
- [ ] Screenshot compared against the design

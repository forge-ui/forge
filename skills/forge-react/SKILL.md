---
name: forge-react
description: "Forge UI Kit for ToB SaaS dashboards — Next.js 16 + React 19 + Tailwind v4 components. Use when building admin consoles, back-office, or ecommerce dashboards with @forge-ui-official/core: AppLayout sidebar shells, DataTable / StatCard / FileUpload / FormField / ChartCard family, fg-* color tokens, Forge auth or ecommerce templates. Keywords: Forge UI Kit, forge-ui, @forge-ui-official/core, AppLayout, fg-violet, fg-grey, Forge dashboard, Forge templates, Forge SaaS."
metadata:
  author: forge-ui
  version: "0.1.4"
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

Default target is `~/.claude/skills/forge-react/`. For Codex, install into `~/.codex/skills/forge-react/`:

```bash
curl -fsSL https://forgeui.org/install-skill.sh | FORGE_AGENT=codex bash
```

Use `FORGE_SKILLS_DIR=/path/to/skills` for any other agent. Re-run any time to update.

---

## Critical — read before writing code

1. **Components come from `@forge-ui-official/core` first.** Do **not** hand-roll raw Tailwind recreations of Kit primitives such as cards, status badges, toolbars, dialogs, forms, tables, or app chrome. Composing Kit components into new business layouts is expected.
2. **Colors come from `fg-*` tokens.** Never use Tailwind's default palette (`text-blue-500`, `bg-gray-100`). Use `text-fg-violet`, `bg-fg-grey-100`, etc. When a shade doesn't exist, stop and ask before adding one.
3. **Icons come from `solar-icon-set`.** Names end in `Linear` / `Bold` / `BoldDuotone` / `LineDuotone`. **Color must use the `color` prop, not `className`** — the library hard-codes `fill`, so `text-*` classes don't work. `size` must be a number; common sizes are 14/16/18/20/24. Default muted icon color: `#71717A`.
4. **Layout uses `<AppLayout>`.** Don't assemble sidebar + topbar from scratch. Auth forms currently have no ready-made Forge template; compose them from `TextField`, `Checkbox`, `Button`, and `StyledLink`.
5. **When in doubt, read the matching case page** (`src/app/cases/<name>/page.tsx`). Cases show real prop combinations. Guessing props wastes everyone's time.
6. **Strict Admin Mode: model the system before JSX.** If the request says system, platform, admin, back-office, 后台, 管理系统, or names a business module, produce the required contracts first: System Brief, Module Contract, Page Flow, Component Mapping, then implement. Use `references/contracts/*.md` and the closest `references/blueprints/*.md`.
7. **`ConfirmationDialog` is dialog content, not the overlay.** Wrap it with the host app's Radix/Headless UI dialog or native `<dialog>`; don't render it permanently in the page.
8. **Forge does not export Toast/Snackbar or Drawer/Sheet primitives.** Use the host app's existing toast/drawer system when present; if none exists, ask before adding one. Keep the content inside those shells built from Forge components.

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

Peer deps (consumer-provided): `react>=19`, `react-dom>=19`, `tailwindcss^4`, `solar-icon-set^2`, `next>=15` (optional, needed if you use `AppLayout` or any component that imports `next/link`).

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

### Icons — `solar-icon-set`

```tsx
import { BellBoldDuotone, MagniferLinear } from "solar-icon-set";

<MagniferLinear size={16} color="#71717A" />
<BellBoldDuotone size={24} color="var(--fg-violet)" />
```

Do not use `className="w-4 h-4 text-fg-..."` as the icon styling API. Set `size={16}` and `color="..."` directly.

Icon names must exist in `solar-icon-set`. For add/create actions, prefer names like `AddCircleLinear`, `AddSquareLinear`, `CartPlusLinear`, or `UserPlusLinear`; there is no generic `PlusLinear` export.

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

Use this mode when the task asks for a 后台, 管理系统, admin console, business platform, SaaS app, module, or operational workflow.

1. **PRD Intake Mode**: for normal PRDs, extract requirements directly; for large Word/PDF documents, first extract structured requirements. Do not summarize away object fields, states, actions, permissions, pages, flows, or acceptance criteria.
2. Classify the archetype: `commerce-ops`, `project-ops`, `crm`, `approval`, `data-ops`, `support`, `finance`, `files`, `governance`, or `custom`.
3. Read `references/contracts/system-brief.md` and the nearest `references/blueprints/<archetype>.md`.
4. Produce a concise System Brief before implementation. If the request is narrow, still state the broader system and the first slice you will implement.
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

## Workflow for new features

1. **Read the PRD**, extract: business objects, user roles, states, page list, main actions, data fields, permissions.
2. **Model the admin system**: if the task is a back-office product or business system, use Strict Admin Mode and produce contracts before UI: business domain, roles, navigation groups, module map, resource contracts, cross-module links, work queues, settings, permissions, audit, and success paths.
3. **Model each core module**: for every primary module, define list/detail/create/edit/delete, state transitions, top actions, filters/sorts, URL state, dialogs/drawers/routes, feedback states, and adjacent modules.
4. **Pick page patterns**: app shell / dashboard / list / detail / form / settings / messages / calendar / profile / files / billing / team / audit / stepper / cards / chat. Read `references/page-patterns.md` when the page type is not obvious.
5. **Pick skeletons**: operational system → start from `/templates/project-template/*`; commerce system → use `/templates/ecommerce/*`; custom → `<AppLayout>` plus a full navigation/module map. Do not make a single isolated CRUD page when the user asked for a system.
6. **Decompose → compose**: break the system into shell, workbench/dashboard, core resource module, detail surface, mutation flows, settings/permissions, and audit/activity. Before using unfamiliar components, run `node scripts/list.mjs`, then `node scripts/get-component.mjs <name>` or `node scripts/get-case.mjs <name>`.
7. **Colors = `fg-*`, icons = `solar-icon-set` + `color` prop.** No exceptions.
8. **Missing primitive = ask; missing layout = compose.** If the Kit lacks a primitive or token, ask before extending. If the need is a business layout, compose existing Kit components.
9. **Self-check**: run the project's typecheck/build command, start the project dev script, and verify in the browser with a screenshot. Check computed styles, not only DOM text.

---

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Kit components render as naked divs | Tailwind didn't scan `node_modules/@forge-ui-official/core/dist` | Add `@source "../../node_modules/@forge-ui-official/core/dist";` to `globals.css` |
| Tailwind utilities do not compile in Next | Missing Tailwind v4 PostCSS plugin | Install `@tailwindcss/postcss` and add it to `postcss.config.mjs` |
| `solar-icon-set` icon wrong color | `className="text-fg-*"` doesn't work (library hard-codes fill) | Use `color="#HEX"` or `color="var(--fg-violet)"` prop |
| `solar-icon-set` icon looks squished | Wrapper has `p-*` or fixed height | Wrap with a square `w-X h-X` box or `inline-flex items-center` |
| `Cannot find module "@forge-ui-official/core/styles.css"` | Package version too old (<0.1.0) | `pnpm update @forge-ui-official/core` |
| Dialog appears as a white card in the page | `ConfirmationDialog` is only the content card | Wrap it in Radix/Headless UI Dialog or native `<dialog>` |
| Code imports Toast, Snackbar, Drawer, or Sheet from Forge | Forge does not export these primitives | Use the host app's existing shell or ask before adding one |

---

## Pre-submit checklist

- [ ] No hand-rolled `<div>` reproductions of Kit components
- [ ] All colors are `fg-*` tokens, no bare Tailwind colors
- [ ] All icons from `solar-icon-set` with `color` prop (not `className`)
- [ ] Layout uses `<AppLayout>` or an existing template
- [ ] System requests include navigation, module map, dashboard/workbench, core resource modules, settings/permissions, and audit/activity paths
- [ ] List search/filter/sort/page state is in URL when the view should be shareable
- [ ] Detail pages include back/breadcrumbs, related data, and the next useful action
- [ ] Dangerous actions use `ConfirmationDialog` inside a real dialog shell
- [ ] Form errors map back to fields, not only toast
- [ ] `pnpm tsc --noEmit` passes
- [ ] Screenshot compared against the design

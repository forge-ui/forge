---
name: forge-react
description: "Forge UI Kit for ToB SaaS dashboards — Next.js 16 + React 19 + Tailwind v4 components. Use when building admin consoles, back-office, or ecommerce dashboards with @forge-ui/react: AppLayout sidebar shells, DataTable / StatCard / FileUpload / FormField / ChartCard family, fg-* color tokens, Forge auth or ecommerce templates. Keywords: Forge UI Kit, forge-ui, @forge-ui/react, AppLayout, fg-violet, fg-grey, Forge dashboard, Forge templates, Forge SaaS."
metadata:
  author: forge-ui
  version: "0.1.2"
  docs: "https://forge-ui.github.io/forge/"
---

# Forge UI Kit — React Development Guide

Forge UI Kit (`@forge-ui/react`) is a ToB-focused design system for Next.js 16 + React 19 + Tailwind v4 projects. Use it when you're building dashboards, admin consoles, ecommerce back-offices, or any page that needs a sidebar + topbar + data-dense content shell.

**Live docs**: https://forge-ui.github.io/forge/
**Package**: `@forge-ui/react` (GitHub Packages, private; requires `read:packages` scope)

---

## Critical — read before writing code

1. **Components come from `@forge-ui/react` only.** Do **not** hand-roll `<div className="bg-...">` to reproduce what the Kit already has. Kit doesn't have what you need → stop and ask; don't improvise.
2. **Colors come from `fg-*` tokens.** Never use Tailwind's default palette (`text-blue-500`, `bg-gray-100`). Use `text-fg-violet`, `bg-fg-grey-100`, etc. When a shade doesn't exist, stop and ask before adding one.
3. **Icons come from `solar-icon-set`.** Names end in `Linear` / `Bold` / `BoldDuotone` / `LineDuotone`. **Color must use the `color` prop, not `className`** — the library hard-codes `fill`, so `text-*` classes don't work. Default muted icon color: `#71717A`.
4. **Layout uses `<AppLayout>`.** Don't assemble sidebar + topbar from scratch. For auth pages, use the `/templates/auth/*` ready-made pages.
5. **When in doubt, read the matching case page** (`src/app/cases/<name>/page.tsx`). Cases show real prop combinations. Guessing props wastes everyone's time.

---

## Installation (host project)

See https://forge-ui.github.io/forge/docs/quick-start/ for the full walk-through. Summary:

1. Generate a classic GitHub PAT with `read:packages` scope.
2. Project root `.npmrc`:
   ```
   @forge-ui:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
3. `export GITHUB_TOKEN=ghp_xxx` in your shell, then `pnpm add @forge-ui/react`.
4. `app/globals.css`:
   ```css
   @import "tailwindcss";
   @import "@forge-ui/react/styles.css";
   @source "../../node_modules/@forge-ui/react/dist";
   ```

Peer deps (consumer-provided): `react>=19`, `react-dom>=19`, `tailwindcss^4`, `solar-icon-set^2`, `next>=15` (optional, needed if you use `AppLayout` or any component that imports `next/link`).

---

## Getting concrete component info (don't guess)

The Kit has ~75 components. **Don't load all their docs into context up-front.** Use the scripts below to pull exactly what you need when you need it:

```bash
# List every component / case / template available
node scripts/list.mjs

# Read a component's spec page (props, variants, usage, API table)
node scripts/get-component.mjs Button
node scripts/get-component.mjs DataTable

# Read a case page — bigger example, shows color × size × variant matrices
node scripts/get-case.mjs button-link
node scripts/get-case.mjs table

# Read a template page — real business screen assembled from the Kit
node scripts/get-template.mjs ecommerce/products
node scripts/get-template.mjs auth/sign-in
node scripts/get-template.mjs dashboard-builder
```

Scripts pull live source from `github.com/forge-ui/forge/main` over HTTPS — no auth needed for the public docs repo.

Design tokens (colors, shadows, radii, typography) live in `references/tokens.md` — read it when you need exact hex values or shade names.

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

### Layout — `<AppLayout>`

Sidebar + topbar + content shell. One component covers the whole admin chrome:

```tsx
import { AppLayout } from "@forge-ui/react";

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
  primaryAction={{ label: "New", onClick: () => {} }}
>
  {/* your business content */}
</AppLayout>
```

For team switcher popover content, pass `teams={Team[]}` — if you don't, the popover just shows the current team and the create/invite actions.

### Auth & ecommerce templates

Ready-made pages you can copy rather than build from scratch:

- `/templates/auth/{sign-in,sign-up,forgot-password,reset-password}` — auth quartet
- `/templates/ecommerce/{products,orders,customers,sellers,categories}` — list + detail + new for each
- `/templates/dashboard-builder/[variant]` — 8 sidebar × accent shells to pick from

Use `scripts/get-template.mjs` to read the source.

---

## Workflow for new features

1. **Read the PRD**, extract: page list, main actions per page, data fields, states, permissions.
2. **Pick a skeleton**: auth flow → `/templates/auth/*`; list+detail+new business → copy the closest `/templates/ecommerce/<module>`; custom → `<AppLayout>` wrapper.
3. **Decompose → compose**: break the page into sections; each section is a Kit component or a combination. Unsure about a prop? `node scripts/get-case.mjs <name>` and copy the pattern.
4. **Colors = `fg-*`, icons = `solar-icon-set` + `color` prop.** No exceptions.
5. **Missing component = stop and ask**, don't improvise.
6. **Self-check**: `pnpm tsc --noEmit`, then `pnpm dev --port 3456 --hostname 0.0.0.0` and screenshot.

---

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Kit components render as naked divs | Tailwind didn't scan `node_modules/@forge-ui/react/dist` | Add `@source "../../node_modules/@forge-ui/react/dist";` to `globals.css` |
| `solar-icon-set` icon wrong color | `className="text-fg-*"` doesn't work (library hard-codes fill) | Use `color="#HEX"` or `color="var(--fg-violet)"` prop |
| `solar-icon-set` icon looks squished | Wrapper has `p-*` or fixed height | Wrap with a square `w-X h-X` box or `inline-flex items-center` |
| `Cannot find module "@forge-ui/react/styles.css"` | Package version too old (<0.1.0) | `pnpm update @forge-ui/react` |
| 401/403 on `pnpm install` | Missing `read:packages` scope or not in `forge-ui` team | Check token scope; ask an admin to add you to the team |

---

## Pre-submit checklist

- [ ] No hand-rolled `<div>` reproductions of Kit components
- [ ] All colors are `fg-*` tokens, no bare Tailwind colors
- [ ] All icons from `solar-icon-set` with `color` prop (not `className`)
- [ ] Layout uses `<AppLayout>` or an existing template
- [ ] `pnpm tsc --noEmit` passes
- [ ] Screenshot compared against the design

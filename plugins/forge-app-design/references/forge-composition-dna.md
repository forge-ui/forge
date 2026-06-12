# Forge Composition DNA

Date: 2026-06-05

This file is the page-composition source of truth for `forge-app-design`. It
exists because the existing `design-dna-lite.md` only encodes visual red-lines
(typography, spacing, surfaces). That is necessary but not sufficient — when
the generator only knows red-lines, it composes pages by hand with `<div>`,
`<p>`, `Avatar`, and `Label`, and the result fails to feel like a Forge admin
prototype even when every red-line passes.

The rules here are derived from the actual Forge core exports under
`core/src/components/`. They are about **composition**: which Forge primitive
must own which slot, and which patterns must never be re-implemented as raw
JSX in a page.

When this file conflicts with a per-pattern rule under `samples/page-patterns/`,
this file wins. Per-pattern rules can add specificity but cannot opt out of
these primitives.

## In-repo Forge evidence

These rules are not derived from screenshots — they are derived from live Forge
showcase routes shipped in this repo. Every composition rule below traces back
to one of these files:

- `src/app/cases/table/page.tsx` — canonical DataTable showcase. Demonstrates
  the full set of cell primitives (`CellImageText`, `CellTextSubtitle`,
  `CellNumber`, `CellProgressBar`, `CellProgressValue`, `CellStatusDot`,
  `CellMuted`, `CellFile`, `CellCode`, `CellRating`, `CellActions`,
  `CellKebabMenu`, `CellLink`) wired into `DataTable` with `title`,
  `headerActions`, `showPagination`, `footerLeft/Right`. Any list/queue page
  must compose the table the way this case composes it.
- `src/app/cases/toolbar/page.tsx` and `src/app/cases/toolbar/_interactive-demo.tsx`
  — canonical Toolbar showcase. Demonstrates `Toolbar` composing
  `ToolbarSearchInput`, `ToolbarSelectDropdown`, `ToolbarDatepicker`,
  `ToolbarPillTabs`, `ToolbarShowSelect` as a single filter strip. No
  list/queue may re-implement search/select boxes in raw JSX.
- `src/app/templates/dashboard-builder/_variants.tsx` — the dashboard
  composition variants. Encodes the legal KPI strip / anchor / priority work /
  activity / workflow-entry combinations. Any new dashboard must map to one of
  these variants before deviating.
- `src/app/templates/(dashboard)/layout.tsx` — the in-repo AppLayout shell
  contract for dashboard templates. Defines how `profilePosition`,
  `menuItems`, `favoriteItems`, `teams`, `profile`, and
  `pageHeaderVariant` are wired in production showcase routes. Generated apps
  must mirror this wiring instead of re-building chrome.
- `plugins/forge-app-design/references/design-dna-lite.md` — the existing
  visual / red-line baseline (typography, spacing, fg-* tokens, surfaces).
  This composition DNA is its complement: lite covers *how it looks*; this
  doc covers *what owns each slot*. Both must pass; a page that passes one
  and fails the other is not a Forge page.

If a rule below cannot be traced back to one of these five anchors plus the
`core/src/components/` source files cited inline, that rule is unsupported and
must be removed or re-anchored.

## Why not just `Avatar + div + p + Label`

The Forge table cell primitives in
`core/src/components/ui/data-table.tsx` are not just convenience wrappers —
they encode the Forge table cell shape:

- `h-10` cell height with `flex items-center` vertical centering.
- `flex-1 inline-flex flex-col gap-1` two-line layout for title plus subtitle.
- `text-fg-black text-sm font-semibold leading-5 tracking-fg line-clamp-1`
  for the primary value.
- `text-fg-grey-700 text-xs font-normal leading-4 tracking-fg line-clamp-1`
  for the metadata line.
- Built-in `tracking-fg` (a Forge-specific letter-spacing token), built-in
  `line-clamp-1`, built-in icon sizing, built-in `ProgressBadge` and
  `StatusBadge` shapes.

When a worker writes:

```tsx
<div className="flex items-center gap-2">
  <Avatar initials={...} size="sm" />
  <span>{row.actor}</span>
</div>
```

the row loses:

- the `h-10` cell rhythm (rows now collapse to the inline content height);
- the `text-sm font-semibold leading-5 tracking-fg` primary text shape;
- the `text-xs leading-4` metadata slot (because there is no second line);
- `line-clamp-1` (so long names break the row height);
- the `gap-1` two-line spacing.

Multiply that across five cells in eight columns, and a generated DataTable no
longer reads as a Forge table. This is the root cause behind the persistent
"visual.pass=false" findings on golden-app generation runs even when product
quality and browser checks pass. See
`golden-apps/deployment-release-board.summary.json` lines 28–38 and the
hand-rolled cell in
`tmp/forge-app-design-output/deployment-release-board-codex/app/audit-log/page.tsx:29-32`
for the live failure mode.

The same logic applies to hand-rolled "rail item" cards. See
`tmp/forge-app-design-output/deployment-release-board-codex/app/dashboard/_components/PriorityReleaseRail.tsx:11-23`
— a nested `<div>` with `<p>` for title, `<p>` for metadata, and a `<Label>`
on the right. That slot belongs to `TaskCard`, `ProjectCard`, `ProfileCard`,
or `HistoryItem variant="profile"`, not to a raw card.

## Hard rule: never hand-roll a primitive when one exists

For every page, the generator must answer: which Forge component owns this
slot? If the answer is "I wrote my own `flex` + `Avatar` + `text-sm`
combination", that is a bug, not a style.

Allowed exceptions:

- The required Forge primitive does not exist (record in `FORGEUI-GAPS.md`).
- The page genuinely needs a one-off marketing or empty-state layout.
- The composition is documented as a Forge gap with a follow-up PR.

## AppLayout shell

Source: `core/src/components/layouts/app-layout.tsx`.

Required:

- All pages render inside one `AppLayout`. Do not re-build the sidebar, topbar,
  team switcher, profile, notifications, or messages panels in page code.
- Use `profilePosition="topbar"` for Protask/Forge-style admin apps. The
  sidebar in that mode owns navigation only.
- `menuItems` and `favoriteItems` are navigation links. Action routes
  (`/new`, `/edit`, `/import`, detail `[id]` routes, audit pages) do not enter
  `menuItems`.
- `teams` and `profile` are driven by `AppLayout` props, not by a custom
  topbar component. `teamLabels` is the only way to customize the team
  switcher copy.
- `pageHeaderVariant="home"` for landing dashboards and queues; `"detail"` for
  records and action pages. Use `breadcrumbs` on detail and action pages.
- When a route's primary action is "Save deployment" / "Create record",
  pass it through `primaryAction`, not as a button in page content.
- Use `hideHeader` only for chat/immersive surfaces; do not hide the header
  just to add a custom page H1 layout.

Forbidden:

- Wrapping the page in extra `max-w-*` / `p-6` / `p-8` shells. AppLayout
  already provides the grey shell padding.
- Mixing sidebar navigation with action-only routes (no `/new`, `/edit`,
  `[id]`, `/audit-log` items in `menuItems` unless they are landing routes).
- Re-implementing the team switcher with a custom dropdown.

## Dashboard composition

Required slots (a Forge dashboard must include at least three of these):

1. KPI strip — `StatCard` (and variants: `LineChartStatCard`,
   `WheelChartStatCard`, `BarChartStatCard`, `ProgressStatCard`).
2. High-emphasis visual anchor — `HighlightCard`, `ProjectCard`,
   `ImageStatCard`, or a colored-theme `StatCard size="wide"`.
3. Priority work list — `TaskCard` stack, `ProjectCard` stack, or a compact
   `DataTable` with cell primitives (never a bare `<div>`/`<p>` rail item).
4. Activity stream — `HistoryItem` list (regular / badge / profile variants),
   or `ActivityCard`.
5. Workflow entry surface — `StatCard` with `action`, or
   `SurfaceCard title=... action={<Button/>}`.

Source: `core/src/components/ui/stat-card.tsx` (StatCard variants),
`core/src/components/ui/history-item.tsx` (HistoryItem variants/colors),
`core/src/components/ui/index.ts:31` (TaskCard) and
`core/src/components/ui/index.ts:29` (ProjectCard).

Required:

- KPI rows use a consistent treatment. A mixed row of one saturated card plus
  three white cards is forbidden — promote the saturated card to its own
  surface or grid cell.
- Trend signals live on the StatCard (`trend`, `trendDirection`,
  `subtitle`). Do not write `<span className="text-fg-green-500">↑ 12%</span>`
  by hand.
- Priority work uses `TaskCard` / `ProjectCard` / `ProfileCard` when the row
  has identity. It uses a `DataTable` (with the cell primitives below) when
  the row is queue-shaped.

Forbidden:

- A "rail card" composed as `<div className="rounded-card border ..."><p>...</p><Label/></div>`.
  See the live failure in
  `tmp/forge-app-design-output/deployment-release-board-codex/app/dashboard/_components/PriorityReleaseRail.tsx:11-23`.
  Replace with `TaskCard`, `ProjectCard`, or `HistoryItem variant="profile"`.
- A red `StatCard` strip used to dramatize risk. Use a white `SurfaceCard` with
  a small red `Label` or `ProgressBar`. Only an incident-monitor product can
  surface a red `StatCard` as a top-of-page anchor.
- Three or four isolated white `StatCard`s with no anchor, no priority work,
  and no activity — that is not a Forge dashboard.

## List / table composition

Source: `core/src/components/ui/data-table.tsx` (lines 206–569 export the cell
primitives), `core/src/components/ui/toolbar.tsx` (Toolbar / ToolbarSearchInput
/ ToolbarSelectDropdown / ToolbarDatepicker / ToolbarPillTabs).

A Forge list/queue is composed as:

```
Toolbar (search + select + datepicker + ButtonGroup pill tabs)
DataTable (columns -> cell primitives) with title/subtitle/headerActions
```

### Required cell primitive per slot

| Row slot | Primitive | Notes |
|---|---|---|
| identity with image/logo | `CellImageText` | Owns avatar + title + subtitle layout. `rounded="full"` for people, `rounded="lg"` for org/product. |
| identity without image | `CellTextSubtitle` | Title + metadata in the Forge `flex-1 flex-col gap-1` slot. |
| primary text only | `CellText` | One-line `text-sm font-semibold tracking-fg line-clamp-1`. |
| muted text | `CellMuted` | `text-fg-grey-900 font-medium`. Use for non-decision metadata cells. |
| numeric value with optional trend/badge | `CellNumber` | Pass `trend` and/or `badge` instead of inline arrows. |
| value + small ProgressBadge | `CellProgressValue` | Use when the badge is an absolute change indicator. |
| progress bar with value | `CellProgressBar` | `size="sm"` is enforced. Do not call `ProgressBar` directly inside a cell. |
| status (semantic color) | `StatusBadge` | Solid-color pill. For 1-of-N status mapping. |
| status (dot + text) | `CellStatusDot` | When the label needs to stay readable beside a small color cue. |
| stage / change indicator | `ProgressBadge` | Outlined pill, green / red / grey only. |
| code/identifier | `CellCode` | Monospace-shape `text-sm font-semibold`. |
| file/attachment | `CellFile` | Owns the file-type icon + name + size layout. |
| rating | `CellRating` | Solar star icon + value, do not hand-roll. |
| actions cluster | `CellActions` | `actions={["mail","phone","chat"...]}` plus `showKebab`. |
| single kebab | `CellKebabMenu` | When the only action is a row menu. |
| inline link action | `CellLink` | Replaces `<StyledLink>` inside a table cell. |

### Header / toolbar / pagination

- `DataTable` already owns the table surface. Pass `title`, `subtitle`,
  `headerActions`, `showPagination`, `currentPage`, `totalPages`,
  `paginationLabel`, `footerLeft`, `footerRight` through props — do not wrap
  it in another `SurfaceCard` to add a title.
- Filter strip uses `Toolbar` with `ToolbarSearchInput`,
  `ToolbarSelectDropdown`, `ToolbarDatepicker`, `ToolbarPillTabs`,
  `ToolbarShowSelect`. Do not re-style search/select boxes by hand.
- `FullWidthTable` (`data-table.tsx:808`) is the variant for full-screen data
  management pages; it defaults `showCheckbox=true` and surfaces the
  "Show N" rows-per-page selector.

### Forbidden in list/table

- `onRowClick`. The row navigation belongs in a `CellLink` / `CellActions` /
  `StyledLink` cell.
- `<div className="flex items-center gap-2"><Avatar/><span>{name}</span></div>`
  inside a column `render`. Use `CellImageText` or `CellTextSubtitle`.
- `<Label color="gray">{time}</Label>` as the entire cell. Use `CellMuted` or
  `CellNumber`, and reserve `Label` for status enums.
- Stacking two text actions side by side (`Preview` + `Open`). One small
  command plus one `CellLink` / `CellKebabMenu`, maximum.
- Wrapping `DataTable` in a second `SurfaceCard` only to add a title.
- `[&_table]:table-fixed` to hide overflow. Reduce columns or move context to
  the rail / detail.

## Detail composition

Required shape:

```
<AppLayout pageHeaderVariant="detail" breadcrumbs={[...]} primaryAction={...} />
  <main className="space-y-5 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
    <section className="space-y-5">
      <IdentityStrip />        // ProfileCard or SurfaceCard with avatar + status
      <EvidencePanel />        // SurfaceCard with FileCard grid
      <RootCausePanel />       // SurfaceCard with TextArea-style paragraphs
      <ResolutionPanel />      // SurfaceCard with Button primary + StyledLink secondary
    </section>
    <aside className="space-y-5">
      <ImpactRail />           // StatCard / SurfaceCard with key numbers
      <HistoryRail />          // HistoryItem stream
    </aside>
  </main>
```

Required:

- Identity rail: `ProfileCard` (source `core/src/components/ui/profile-card.tsx`)
  or a `SurfaceCard` with an `Avatar`, status `Label`, and a one-line
  metadata strip. Never a bare `<div>` with `<p>` lines.
- Evidence: `FileCard` grid inside one `SurfaceCard padding="md"`. The page
  must show real file names; placeholder "Attachment 1.pdf" is forbidden.
- History/audit: `HistoryItem` or `HistoryGrouped`
  (`core/src/components/ui/history-grouped.tsx`). Do not render the audit feed
  as a `<ul><li>` list.
- Resolution: primary `Button` with semantic color; secondary `StyledLink`;
  optional `Label` showing the post-action state.

Forbidden:

- A detail page composed as a description list (`<dl><dt>...<dd>...`). Detail
  pages explain what happened, why, impact, evidence, next action.
- Pushing the identity rail and the right rail into the same column — the
  identity strip is part of the main column, not the right rail.
- Inventing a second top-level grey shell inside the detail page.

## Action / form composition

Required shape:

```
<AppLayout breadcrumbs primaryAction={{ label: 'Save deployment' }} secondaryAction={{ label: 'Cancel' }}>
  <main className="space-y-5 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
    <section className="space-y-5">
      <SurfaceCard title="Deployment fields"> grouped TextField / SelectOption </SurfaceCard>
      <SurfaceCard title="Rollout window"> grouped fields </SurfaceCard>
    </section>
    <aside className="space-y-5">
      <SurfaceCard title="Preflight"> CheckboxControl rows + status Label </SurfaceCard>
      <SurfaceCard title="Reviewers"> SelectOption + Avatar list </SurfaceCard>
    </aside>
  </main>
```

Required:

- Field controls come from `core/src/components/ui/forms/`: `TextField`,
  `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`, `MediaUpload`,
  `IconSelector`, `SelectionControl`.
- Grouping is done with `SurfaceCard` titles; do not invent custom group
  headers with `<h2 className="text-sm uppercase">`.
- Save/Submit feedback (`saving`, `saved`, `error`) lives in the right rail
  next to the primary action; never as a toast that disappears.
- Use `CheckboxControl` plus a separate label/span. `CheckboxWithLabel` is
  forbidden — its label-button semantics block screen readers and our
  preflight rail copy.

Forbidden:

- Free-floating `<input>` / `<select>` elements.
- A right rail that is empty or only contains a static "Help" panel. The right
  rail must carry preflight, validation, reviewer, or impact context.
- Marketing-style "Step 1 of 4" wizard chrome when the brief specifies a
  single action page.

## Patterns that always indicate a regression

If any of these appears in a generated app, the run is not promotable:

- Any column `render` that returns a raw `<div className="flex">` containing
  `Avatar` + `<span>`. Replace with `CellImageText` / `CellTextSubtitle`.
- Any `<Label color="gray">` as the entire cell content for a date / numeric /
  status string. Replace with `CellMuted` or `CellNumber`.
- A rail item written as `<div className="rounded-card border ..."><p>...</p></div>`
  instead of `TaskCard` / `ProjectCard` / `ProfileCard` / `HistoryItem`.
- A "filter card" wrapping search + select + datepicker in a second white
  shell — Forge filter controls already carry their own borders.
- A second titled `SurfaceCard` around a `DataTable` that already has a title.

## Source rule index

This DNA is anchored to specific files. When the DNA changes, the linked
sources must change with it.

- AppLayout: `core/src/components/layouts/app-layout.tsx:60-99` (props),
  `core/src/components/layouts/sidebar-popovers.tsx`.
- DataTable + cell primitives: `core/src/components/ui/data-table.tsx:206-569`,
  `core/src/components/ui/index.ts:260-296` (export surface).
- Toolbar: `core/src/components/ui/toolbar.tsx:24-415`.
- StatCard family: `core/src/components/ui/stat-card.tsx`,
  `core/src/components/ui/progress-stat-card.tsx`,
  `core/src/components/ui/line-chart-stat-card.tsx`,
  `core/src/components/ui/wheel-chart-stat-card.tsx`,
  `core/src/components/ui/bar-chart-stat-card.tsx`.
- Surfaces: `core/src/components/ui/surface-card.tsx`,
  `core/src/components/ui/profile-card.tsx`,
  `core/src/components/ui/task-card.tsx`,
  `core/src/components/ui/project-card.tsx`,
  `core/src/components/ui/highlight-card.tsx`,
  `core/src/components/ui/image-stat-card.tsx`.
- Activity/history: `core/src/components/ui/history-item.tsx`,
  `core/src/components/ui/history-grouped.tsx`,
  `core/src/components/ui/activity-card.tsx`.
- Form controls: `core/src/components/ui/forms/index.ts`.

If any of those files moves or renames, update both the path and the rule
that depends on it.

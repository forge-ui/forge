# Forge/Protask Design DNA Lite

This is the first-pass visual DNA for `forge-app-design`. It is intentionally
small and operational: use it before generating or repairing a Forge admin app.

## Goal

Generated Forge admin prototypes should feel like dense, restrained operating
software rather than generic CRUD pages. The target is close to the local
Protask CRM screenshots and Forge original implementations:

- `/Users/hesong/Downloads/protask-figma/crm/Customer.png`
- `/Users/hesong/Downloads/protask-figma/crm/Leads.png`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/screenshot/dashboard/CRM.png`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/screenshot/Full Width Table.png`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/screenshot/Filter.png`

## Shell

- Use Forge `AppLayout`; do not rebuild sidebar, topbar, profile, or workspace switcher.
- Rely on `AppLayout` for the grey content shell and compact content padding.
  Do not wrap every page in another `p-6`/`gap-8` scaffold to compensate for
  layout uncertainty.
- Keep the app label short. Avoid full slug names in the logo/team label.
- Sidebar contains only navigation routes. Action routes such as `/new`,
  `/edit`, `/import`, and detail `[id]` routes stay out of sidebar navigation.
- Content sits in the AppLayout grey shell. Do not add extra `max-w-*`,
  `p-6`, `p-8`, or `lg:p-8` wrappers around page roots.

## Typography

- Routine admin H1: `text-2xl font-semibold text-fg-black` or smaller.
- Prefer Forge `PageTitleToolbar` for routine dashboard/list/detail page titles
  when a local title bar is needed. Do not manually reintroduce
  `text-display-l` or `text-3xl` page titles after core has normalized the
  default title scale.
- Card/table/rail titles: default to `text-sm` with `font-medium` or `font-semibold`, close to sidebar menu scale, usually `text-fg-black`. Use `text-base` only for a strong section header; avoid routine `text-lg`/`text-xl` card headers.
- Table/card body: `text-sm`.
- Metadata/helper text: `text-xs`.
- `text-display-l`, `text-3xl`, and larger scales are not default admin page
  titles. Use larger numbers only inside stat cards or major dashboard signals.
- KPI/stat values must be visibly stronger than routine page text. In compact
  stat surfaces, values should be at least `text-3xl font-semibold`, and larger
  than the page H1 when they are the primary signal.
- Table headers use a clear but restrained hierarchy: `text-xs` or `text-sm`
  with `font-semibold` and `text-fg-grey-700`; row primary text usually stays
  `text-sm font-medium`, using `font-semibold` only for the one value that
  must dominate the row; metadata stays `text-xs`.
- No repeated kicker/eyebrow copy on every page. Action pages usually need only
  breadcrumbs, H1, and Cancel/Save.

## Spacing And Density

- Default page rhythm: `space-y-4` or `space-y-5`.
- Default grid gaps: `gap-4` or `gap-5`.
- `AppLayout` already provides compact page padding. Page code should usually
  start with a `flex flex-col gap-5` or equivalent workflow layout, not another
  outer padding container.
- Use `p-4`/`p-5` card bodies for operating surfaces; reserve `p-6` for one
  major dashboard panel, not every page section.
- First viewport must carry work: list pages show filters plus table rows;
  detail pages show identity, evidence, and action; action pages show first
  field group and status rail.
- Avoid fixed pixel dimensions for density. Prefer Forge size variants,
  truncation, `minmax`, `clamp`, and responsive layout changes.
- Forge card-family components fill their parent by default. In generated
  apps, do not add `w-64`, `w-80`, `w-96`, or `width="fixed"` to KPI,
  project/task, chart, progress, map, or highlight cards unless the route is
  explicitly a component showcase.

## Surfaces

- Use white Forge surfaces on the grey shell: `SurfaceCard`, `DataTable`,
  `TaskCard`, `ProfileCard`, `FileCard`, `HistoryItem`.
- Normal borders are `outline-fg-grey-200` or `border-fg-grey-200`.
- Avoid heavier grey borders except empty, drop, or error states.
- Keep surface nesting shallow: shell -> one table/card surface -> row dividers
  or compact child items.
- `DataTable` already owns the table surface. Do not wrap it in another large
  titled `SurfaceCard` unless the wrapper contains non-table context.
- Avoid alert billboards in routine admin dashboards. Red/yellow should appear
  as small labels, progress signals, or focused context inside a white surface,
  not as a large saturated risk card unless the whole product domain is an
  incident monitor and the card is the main task.

## Filters

- Filters are a compact toolbar/strip directly above the primary work surface.
- Search/date/filter/show controls should read as one row when space permits.
- Do not place a large "filter card" with empty whitespace above the table.
- Prefer individual Forge controls with their own borders. Do not wrap a
  search field plus segmented filters in an extra rounded white shell unless
  that shell also carries meaningful grouped filter content.
- `ButtonGroup` is for short segmented sets. One group should not exceed 5
  items; split long filters by business meaning or use select/filter panels.
- A list/queue page may use at most one 5-item `ButtonGroup` in the filter
  strip. A second high-cardinality dimension must use `SelectOption`,
  dropdown/filter panel, tabs, or overflow controls.
- Filter chrome, including inline stats directly above the table, must stay
  compact. If the filter area grows beyond one toolbar plus one short inline
  stats row, move stats below the table or into dashboard/detail context.

## Tables And Queues

- The table is the primary work surface for rich list pages.
- At common desktop review widths, do not force a right rail beside the table.
  Use inline stats, a drawer, a below-table rail, or defer side-by-side rails to
  `2xl` with adaptive `clamp`/`minmax` constraints.
- Rows should expose identity, secondary metadata, status, owner/assignee or
  last activity, risk/SLA/evidence when relevant, and a compact action.
- Rich queue rows may show one row action cluster only: one small primary
  command, or one compact link/icon/menu. Do not place two text actions such as
  `Preview` and `Open` side by side in every row.
- A table cell must not mix all risk representations at once. Do not put raw
  number, percentage, and `ProgressBar` in the same risk cell. Use one compact
  representation in the table, and move the fuller risk explanation to detail,
  drawer, or dashboard visual.
- Do not use `[&_table]:table-fixed` to hide too many columns. Reduce columns,
  move context into the rail/detail, or allow horizontal overflow.
- List-page selected-row context must not appear as an ordinary card below the
  table at common desktop widths. Use a drawer/dialog, a dedicated detail
  route, or a rail that is genuinely hidden until a wide viewport.
- Keep status palettes restrained. A single operational table should use no
  more than four saturated status families: neutral, warning, danger, success
  or equivalent domain mapping.
- Do not color every signal independently. If status already carries warning
  or danger, priority and risk-score labels should usually be neutral except
  for the highest severity tier.

## Detail Pages

- Detail pages are not description-list dumps. They must answer: what happened,
  why, impact, evidence, and next action.
- Use a clear identity/profile rail or strip, a main evidence/action surface,
  and a compact history/audit/context rail.
- First viewport should include evidence/root cause/impact or equivalent domain
  evidence plus the resolution/action surface.

## Action Pages

- Use `Breadcrumbs + H1 + Cancel/Save`.
- Main content is grouped fields; right side is status/preflight/context.
- Save/Submit must have local feedback (`saving`, `saved`, `error` where useful).
- Do not use `CheckboxWithLabel`; use `CheckboxControl` plus separate text.

## Dashboard Pages

- Do not ship four isolated KPI cards as a dashboard.
- A compact KPI row is acceptable only when it is followed by an actual work
  surface such as a queue table, trend/readiness panel, activity rail, or
  workflow entry in the first viewport.
- Include at least three of: compact KPI strip, trend/progress visual,
  risk/readiness visual, priority work table/list, activity stream, workflow
  entry link.
- Provide one high-emphasis Forge visual anchor using a colored `StatCard`,
  `ProgressStatCard`, `ImageStatCard`, `HighlightCard`, `ProjectCard`, or
  equivalent Forge visual surface.
- Do not mix one high-saturation anchor card into a row of otherwise white KPI
  cards. KPI/stat rows should use a consistent treatment; high-emphasis anchors
  get their own surface or grid position.
- For risk-heavy dashboards, a red `StatCard` is a last resort. Prefer a white
  `SurfaceCard` with a small red `Label` or `ProgressBar` so the dashboard
  keeps Forge/Protask management-system weight instead of alert-page weight.
- Dashboard title filters should not float awkwardly in the same visual row as
  the H1. Put filters in a compact toolbar or work-surface header when they
  need substantial horizontal space.

## Copy And Data

- UI text should use concrete business nouns and verb-object actions.
- Avoid marketing phrases and internal IA/design language in the app UI.
- Mock data must look operational: real names, owners, statuses, amounts,
  dates, file names, risk reasons, and next actions.
- Do not use lorem, "Example", "Placeholder", or scaffold fallback text.

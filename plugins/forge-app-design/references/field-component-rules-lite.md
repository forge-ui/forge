# Field-To-Component Rules Lite

Use these rules after the business blueprint identifies entity fields. They are
small by design and should be applied before writing page code.

Source rules:

- `references/forge-composition-dna.md` (composition source of truth).
- `references/component-registry.json` (generation priority list).
- `core/src/components/ui/data-table.tsx:206-569` (Forge cell primitives).

## Universal Rules

- **Cell-primitive-first**: for every `DataTable` / list / queue column, pick
  the matching Forge `Cell*` primitive FIRST. Hand-rolled `Avatar + div + p +
  Label` compositions inside a `columns[].render` are a composition defect,
  not a styling choice. The mapping table below is the authoritative
  field → primitive lookup; do not deviate without filing a gap.
- Every list row needs one identity cell. Use `CellImageText` when an
  avatar/logo/icon exists; `CellTextSubtitle` when it does not. Never
  hand-roll `<div className="flex items-center gap-2"><Avatar/><span>...</span></div>`
  inside a column `render`.
- Status, priority, risk, owner, money, dates, files, and actions should never
  appear as undifferentiated plain text when a Forge cell primitive fits.
- **Toolbar-primitive-first**: filter strips and search bars must be composed
  from `Toolbar` + `ToolbarSearchInput` + `ToolbarSelectDropdown` +
  `ToolbarDatepicker` + `ToolbarPillTabs` + `ToolbarShowSelect`. A custom
  `<div className="rounded-full border ...">` shell wrapping bare `<input>` /
  `<select>` is forbidden.
- List pages show only decision-critical fields. Secondary context moves to
  metadata, preview rail, detail page, or action route.
- Detail pages explain evidence and next action; they are not all-field dumps.
- Form pages group fields by business meaning and include save/cancel feedback.

## Field Mapping

| Field Type | List Page (DataTable cell) | Detail Page | Form/Action Page | Notes |
|---|---|---|---|---|
| `id` / code | `CellCode` (or `CellTextSubtitle` subtitle) | metadata in identity rail / `ProfileCard` subtitle | read-only `TextField` when generated | Do not make ID the only row identity. |
| `name` / title | `CellTextSubtitle` title (or `CellImageText` title when avatar exists) | H1 in main column; `ProfileCard` name on identity rail | `TextField` | `CellText` / `CellTextSubtitle` already apply `line-clamp-1`. |
| `customer` / merchant / organization | `CellImageText` with `rounded="lg"` | `ProfileCard` or identity rail | `SelectOption` or `TextField` | Initials are acceptable when the cell falls back to `CellTextSubtitle`. |
| `owner` / assignee / user | `CellImageText` with `rounded="full"` when primary; `CellMuted` when secondary | identity rail (`ProfileCard`), or `HistoryItem variant="profile"` | `SelectOption` | Avoid bare owner initials without name; never compose Avatar + span by hand in a DataTable cell. |
| `status` | `StatusBadge` (semantic color) or `CellStatusDot` | `StatusBadge` plus explanation/history | `ButtonGroup` or `SelectOption` | Never plain text only; never `<Label>` as the whole cell when the field is a status enum. |
| `priority` / severity | `StatusBadge` or `Label` size=sm | `Label` plus reason | `SelectOption` or `SelectionControl` | Critical/red, high/yellow, medium/purple or gray. |
| `risk` / score / percent | `CellProgressBar` (with label) or `CellNumber` + `ProgressBadge` | `ProgressBar` with risk reason | numeric input only when editable | Do not call `ProgressBar` directly inside a column; always use `CellProgressBar`. |
| `SLA` / due / age | `CellMuted` when neutral; pair with `StatusBadge` color="red" or "yellow" when urgent | status rail / history context | `Datepicker` or `SelectOption` by policy | Do not write `<Label color="gray">{due}</Label>` as the entire cell. |
| `amount` / currency | `CellNumber` right-aligned with `trend` and `badge` when applicable | impact/financial context | `TextField` with currency helper | Do not leave raw numbers. |
| `date` / `datetime` | `CellMuted` for compact format; `CellNumber` if numeric-only | full timestamp in audit/history | `Datepicker`; otherwise `TextField` | Use relative time in activity streams (HistoryItem `datetime`). |
| `file` / evidence / attachment | `CellFile` (file-type icon + name + size) | `FileCard` grid in `SurfaceCard` | `FileUpload` only if required | Evidence-heavy pages must show actual file names. |
| `boolean` | `Label` or `CellStatusDot` when read-only | status/preflight row | `CheckboxControl` + separate text | Do not use `CheckboxWithLabel`. |
| `enum` | `StatusBadge` for status-shaped enums; `Label` for tier-shaped enums | grouped metadata | `ButtonGroup` if ≤ 5 short options; otherwise `SelectOption` | Split long enum groups by business meaning. |
| `longText` / note / description | omit from table (or `CellMuted` truncated single line) | paragraph block inside `SurfaceCard` | `TextArea` | Never show long text as a full table cell. |
| `history` / activity | count/latest metadata or rail preview | `HistoryItem` or `HistoryGrouped` stream | not usually editable | Use `HistoryItem`, not generic paragraphs. |
| `action` | one `CellActions` + optional `CellLink` (or one `CellKebabMenu`) | primary `Button` plus secondary `StyledLink` | Save/Cancel via `AppLayout` primary/secondary actions | Do not stack two text-button actions inside a row; one inline link + one cluster only. |
| `code` / `release ID` / `ticket key` | `CellCode` | metadata in identity rail | read-only `TextField` | `CellCode` already encodes the Forge code typography. |

## When you may still use `Avatar` directly

`Avatar` (and `AvatarGroup`) is allowed outside `DataTable` columns:

- Inside `ProfileCard`, `TaskCard`, `ProjectCard`, `ContactItem`, `HistoryItem variant="profile"` — those components embed `Avatar` already; do not override.
- Inside non-row dashboard surfaces where the identity belongs to the surface
  as a whole (e.g. a "Top assignee" `SurfaceCard` with an `Avatar` + name +
  `Label`).
- In topbar/sidebar contexts owned by `AppLayout`.

`Avatar` is forbidden inside a `DataTable` column `render` — use
`CellImageText` instead. If you genuinely need a column shape that
`CellImageText` does not provide (e.g. avatar group + stage), file a Forge gap
in `FORGEUI-GAPS.md` rather than hand-rolling.

### Escape hatch: when a Forge cell primitive cannot express the field

Hand-rolled composition inside a `DataTable` column `render` is only allowed
when ALL of the following hold:

1. No `Cell*` primitive in [component-registry.json](component-registry.json)
   maps to the field shape (check the `DataTable.fieldRules` map, not just
   the name).
2. No combination of two `Cell*` primitives can express it (e.g.
   `CellImageText` for identity + `CellLink` for action is still primitive-first).
3. The gap is recorded in `FORGEUI-GAPS.md` with: field name, why every
   candidate primitive failed, and the minimum primitive that would close
   the gap.
4. The Avatar + custom block uses ForgeUI tokens (`fg-*` colors, Forge
   typography classes), never raw Tailwind grey/blue shades.

If any of those four fails, fix the column to use the primitive — do not ship
the hand-rolled cell.

## Page-Specific Rules

### List / Queue

- Required fields: identity, status, owner/assignee or last activity, one
  decision metric, and row action.
- Optional fields: priority, risk, SLA, evidence count, amount, segment.
- Max core columns: 6-8. If more are needed, move context to rail/detail.
- Action cell: one `CellActions` cluster OR one `CellLink`; not both unless
  there is a clear primary + contact split.
- Filter strip is composed with `Toolbar` + `ToolbarSearchInput` +
  `ToolbarSelectDropdown` + `ToolbarDatepicker` + `ToolbarPillTabs` only. No
  custom rounded white shell around the filter row.

### Detail / Triage

- Required sections: identity/status (via `ProfileCard` or identity
  `SurfaceCard`), evidence (`FileCard` grid), root cause or reason
  (`SurfaceCard` paragraph), impact (`StatCard` or `SurfaceCard`),
  history/audit (`HistoryItem` / `HistoryGrouped`), resolution/next action
  (`Button` primary + `StyledLink` secondary).
- Evidence should use `FileCard`; history should use `HistoryItem`.
- Root cause and impact should be readable paragraphs, not table columns.

### Action / Form

- Required sections: `AppLayout` breadcrumbs + H1 + primaryAction +
  secondaryAction, first field group inside `SurfaceCard`, status or preflight
  rail inside `SurfaceCard`, local save feedback.
- Use `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`,
  `CheckboxControl`.
- Put validation/readiness in a right rail `SurfaceCard`.

### Dashboard

- Required signals: KPI, trend/progress, risk/readiness, priority work,
  activity, and workflow entry.
- KPIs use `StatCard` (with semantic theme) or its chart variants
  (`LineChartStatCard`, `WheelChartStatCard`, `BarChartStatCard`,
  `ProgressStatCard`). Multiple all-white stat cards are not acceptable.
- Priority work rail items use `TaskCard`, `ProjectCard`, `ProfileCard`, or
  `HistoryItem variant="profile"`. A hand-rolled
  `<div className="rounded-card border ..."><p>...</p><Label/></div>` is
  forbidden.
- Activity streams use `HistoryItem` / `ActivityCard`, never `<ul><li>`.

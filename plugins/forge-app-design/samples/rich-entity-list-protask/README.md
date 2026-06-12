# rich-entity-list-protask

Use this pattern when a list route is an operational queue where users must decide priority, ownership, risk, evidence, and next action without opening every detail page.

Good matches:
- exception queues, case queues, tickets, approvals, incidents, claims
- entity lists with owner, status, risk, SLA, evidence, last activity, and row action
- parent list routes that launch `/new` actions from toolbar or empty-state CTA
- lists that benefit from a right-side insight rail or preview drawer

Do not use it for:
- low-decision reference tables
- settings matrices
- static lookup lists
- detail-heavy triage pages that need `split-pane-triage`

## PRD Signal Decision

- Use `rich-entity-list-protask` when the PRD mentions queue, records, list, search, filter, bulk, owner, status, SLA, risk, exception, approval, case, or ticket.
- Use `list-with-filters-and-bulk` when the page is a simple entity list with low decision density.
- Use `split-pane-triage` when every decision depends on reading evidence and history side by side.
- Use `action-form-protask` for `/new`, `/create`, `/edit`, `/submit`, or `/import` routes entered from this list.

## Files

- `BRIEF.md` — Page Intent Spec example for Step 2.5.
- `page.tsx` — local filter, selected row, and reviewed state orchestration.
- `utils.ts` — sample queue entity type, filters, colors, and summary helpers.
- `_components/QueueCommandBar.tsx` — scoped filters and primary action entry.
- `_components/QueueWorkloadSummary.tsx` — compact workload, risk, SLA, and throughput signals.
- `_components/EntityQueueTable.tsx` — Forge DataTable with row identity and actions.
- `_components/EntityInsightRail.tsx` — evidence, activity, next action, and detail link.

## Adaptation Rules

1. Use Forge `DataTable` with `rows=`, `columns=`, `showCheckbox`, and `showPagination` for decision queues.
2. Row identity must include more than the entity name: avatar/logo/initials, secondary metadata, owner, status, risk/SLA, and an action.
3. The insight rail must show evidence/files, activity/history, risk reason, and a real link to detail.
4. A list route may expose `/new` from the toolbar or empty state, but `/new` must stay `surfaceRole: action` and out of sidebar navigation.
5. First viewport priority is `PageTitle -> compact filters -> DataTable rows`. A common desktop review screenshot must show the queue table header and multiple real row identities/actions.
6. Workload summary must stay compact: inline stats, a single horizontal strip, or right-rail content. Do not place a large summary card between filters and the table.
7. Filter state can stay local for prototypes. Keep it scoped to status, segment, owner, risk, or SLA signals.
8. Do not define custom Button, Table, Badge, SectionCard, or generic card shells in the generated app.

## Acceptance

- Rows are decision-ready, not field dumps.
- The screenshot reads like a Protask admin queue: shallow grey content shell, subtle white card borders, compact filters, clear H1, and dense table rows.
- The page title follows Forge CRM density: use `text-2xl` for the H1; reserve `text-display-l` for rare object hero pages, not normal queue titles.
- First viewport shows filters plus the first queue rows; summary never pushes the table below the fold.
- `browser-validate` should include `requiredVisibleText` for multiple real row identities plus at least one row action visible in the desktop review viewport.
- The page has at least one visible action that changes local state or opens a workflow route.
- Preview/insight rail reduces page switching and shows evidence plus activity.
- Empty, hover, selected, saved/reviewed, and error-ready states are represented in the design brief.

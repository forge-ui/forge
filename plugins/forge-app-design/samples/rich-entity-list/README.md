# rich-entity-list

Use this pattern when the main page is an operational queue, not a flat CRUD table.

Good matches:
- case queues, tickets, approvals, incidents, claims, exceptions
- entity lists where the user needs owner, risk, status, evidence, and next action in one screen
- list pages that benefit from a right-side preview or insight drawer

Do not use it for:
- reference tables with low decision density
- static lookup pages
- settings pages

## Files

- `BRIEF.md` — Page Intent Spec example.
- `page.tsx` — filter state + selected row orchestration.
- `utils.ts` — sample entity types and filter helpers.
- `_components/QueueFilters.tsx`
- `_components/EntityQueueTable.tsx`
- `_components/EntityInsightPanel.tsx`

## Adaptation Rules

1. Use Forge `DataTable` with `rows=`, `columns=`, `showCheckbox`, and `showPagination`.
2. Row identity must include more than a name: initials/avatar/logo, secondary metadata, owner, status, risk, and action.
3. The preview panel should show evidence, files, activity/history, and a real link to detail.
4. Keep filter state local if the PRD does not require backend search.
5. Do not use raw `<button>` or handrolled progress bars.

## Acceptance

- List rows are decision-ready, not field dumps.
- Preview/detail surface reduces page switching.
- At least one action changes local state or opens a workflow route.

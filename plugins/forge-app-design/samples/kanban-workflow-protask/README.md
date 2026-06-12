# kanban-workflow-protask

Canonical layout intent: `kanban-workflow-protask`.

Use this pattern when the PRD has a status-driven workflow where users need to scan queues and act directly on cards.

## When To Pick

Use this as a promoted pattern only when all of these are true:

- The primary entity has 3 or more mutually exclusive states, and cards move through a directed workflow.
- The user's main job is to scan lanes and choose the next action, not search a large list or read a deep record.
- Every visible card has at least one direct write action, such as advance, rerun, assign, approve, or reject.
- Failed, blocked, or risky cards have a visible diagnostic or detail link.
- The expected card count is roughly 10-500. Above 500, prefer `rich-entity-list-protask` with filters and table density.

Good matches:
- job / task / pipeline / workflow runs
- tickets grouped by status
- approvals grouped by stage
- deployments / alerts / incident queues
- orders or fulfillment stages when each card has a next action

Do not use it for:
- read-only reports with no card action
- simple lists where status is only a filter
- detail-heavy pages where the primary work happens in a form or drawer
- high-volume queues where the primary operation is filtering, sorting, bulk selection, or search

## Files

- `BRIEF.md` — Page Intent Spec example for Step 2.5.
- `page.tsx` — route-level orchestration example. Keep this thin.
- `utils.ts` — status enum, theme map, helper functions, and the generic item type.
- `_components/StatusStrip.tsx` — compact status counts.
- `_components/KanbanColumn.tsx` — status lane and empty state.
- `_components/JobCard.tsx` — actionable workflow card.
- `_components/FailedJobsBanner.tsx` — attention banner for failed/error states.

## Adaptation Rules

1. Replace `WorkflowItem` with the PRD entity name, for example `CheckJob`, `Ticket`, `ApprovalRequest`, or `Deployment`.
2. Replace `API_ROUTE` with the generated scaffold route, for example `/api/check-job`.
3. Replace `relatedHref` with a real cross-page workflow link. Examples:
   - failed job to `/issues?source=${sourceId}&status=new`
   - blocked ticket to `/tickets/${id}`
   - approval request to `/approvals/${id}`
4. Keep `page.tsx` as orchestration only: fetch, state, handler, layout. Move card visuals into `_components/`.
5. Keep at least one real action: `PATCH` or `setState`, not an empty `onClick`.
6. Use Forge primitives before custom markup: `SurfaceCard`, `TaskCard`, `Label`, `ProgressBar`, `Button`, `StyledLink`, and `Breadcrumbs`.
7. The board is promoted only when browser screenshots show lanes, cards, direct action, and a diagnostic/detail link in the first viewport.

## Acceptance

- `page.tsx` imports `_components/` and stays under the page-type line budget.
- Lanes have empty states.
- Cards have one primary direct action.
- Failed/error lane has a cross-page diagnostic link.
- Trigger action shows pending state.
- `page.tsx` has no inline `style={{ ... }}` or hex literals.
- No generic custom card shell appears in the board or card components.
- `DESIGN-BRIEF.md` must mark this route with `layout_intent: kanban-workflow-protask` or an explicit alias to `kanban-board-with-row-actions`.
- `browser-validate` should include `requiredVisibleText` for at least one lane, one card action, and one diagnostic/detail link.

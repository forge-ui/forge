# Deployment Release Board

Use this as a historical `kanban-workflow-protask` fresh-run reference and
visual-regression fixture.

It covers a kanban-first release operations app where the board is the primary
workflow surface, not a supporting route. The fresh app was generated as
`deployment-release-board-codex`, but the stricter adaptive Protask/Forge visual
baseline now blocks it from being final golden evidence.

- summary: `deployment-release-board.summary.json`
- screenshot: `screenshots/deployment-release-board/deployments.webp`

## Route Model

| Route | Pattern | Product role |
|---|---|---|
| `/dashboard` | dashboard-control-tower-protask | Release readiness, blocked count, priority release rail, activity stream |
| `/deployments` | kanban-workflow-protask | Status lanes, lane counts, actionable cards, direct Advance action, Open diagnostics link |
| `/deployments/[id]` | split-pane-triage-protask | Evidence, root cause, impact scope, audit history, resolution action |
| `/deployments/new` | action-form-protask | Grouped deployment fields, preflight rail, Cancel/Save, next board workflow |
| `/audit-log` | audit stream | Actor, action, reason, related deployment link |

## Acceptance Evidence

- `quality-eval --skip-build --strict-ia`: 0 critical / 0 warn / 51 passed
- `browser-validate`: 1/1 case, 5/5 routes passed
- Board visible acceptance: `Canary`, `Advance`, `Open diagnostics`
- `product-quality-audit`: 87/100 pass, `briefSpecs=5`, `browserRoutes=5`
- `protask-visual-audit`: 97/100, blocked by stricter adaptive visual baseline
  on detail profile rail/spacing, board adaptive sizing, and action form
  typography/spacing
- `next build`: passed

## Pattern Lessons

- Promote kanban only when the board is the user's main decision surface.
- This app is not sufficient to declare `kanban-workflow-protask` complete under
  the current adaptive Protask/Forge baseline.
- A valid board needs at least 3 states, lane counts, card-level write actions,
  local action feedback, and diagnostic/detail links for blocked cards.
- A kanban-first PRD may not have a rich list route. Visual audit should then
  evaluate the board through workflow acceptance instead of forcing list checks.
- Detail and action pages still matter: the board must close into evidence,
  root cause, resolution, preflight, and audit routes.

## Do Not Copy

Do not copy business text literally. Reuse the route model, first-viewport
acceptance, and workflow closure pattern with the current PRD's entity names,
states, owners, and diagnostics.

# windmill-labs/windmill

- url: https://github.com/windmill-labs/windmill
- stars: 16644
- pushed_at: 2026-06-04T01:37:30Z
- category: kanban

## Evidence

- Public product: https://www.windmill.dev
- Repo description: scripts, webhooks, workflows, and UIs.
- Relevant UI class: workflow runs, scripts, approvals, execution history.

## IA Artifact

- Workflow overview links into runs, scripts, schedules, and failure detail.
- Run board/list owns execution state and retry/inspect actions.
- Detail owns logs, inputs, outputs, root cause, and rerun.

## Page Pattern

- Workflow surface needs state, owner, schedule, last run, retry/advance action.
- Failure cards should expose diagnostics before the user scrolls.
- Detail page should include logs/evidence and next workflow link.

## Business Workflow

- User sees failed run, opens diagnostics, patches input or reruns, and audits result.

## ForgeUI Gap

- Log/code output panels need better Forge examples.

## Borrow

- Run status board as promoted workflow route.
- Failed card diagnostic link.
- Rerun action with local feedback.

## Reject

- Do not copy workflow builder/editor complexity into ordinary admin PRDs.
- Do not require drag-drop to validate kanban pattern.

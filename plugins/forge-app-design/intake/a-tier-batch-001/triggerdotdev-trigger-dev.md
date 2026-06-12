# triggerdotdev/trigger.dev

- url: https://github.com/triggerdotdev/trigger.dev
- stars: 15208
- pushed_at: 2026-06-03T22:52:46Z
- category: kanban

## Evidence

- Public product: https://trigger.dev
- Repo description: managed agents and workflows.
- Relevant UI class: task runs, queues, deployments, retry workflows.

## IA Artifact

- Dashboard shows run health, failed tasks, throughput, and queue pressure.
- Task run list/board owns status scanning and retry/open-detail actions.
- Run detail owns logs, attempt history, payload, and replay.

## Page Pattern

- Kanban/workflow route should show queued/running/failed/succeeded lanes.
- Failed cards need retry action and diagnostics link.
- Detail page should show attempts and payload evidence.

## Business Workflow

- User scans failed queue, reruns a task, opens detail, reviews attempts, and confirms recovery.

## ForgeUI Gap

- Attempt timeline + log payload composition needs a reusable example.

## Borrow

- Queue pressure KPI linked to failed lane.
- Retry action directly on card.
- Attempts/history as detail evidence.

## Reject

- Do not copy developer-only language into business admin prototypes.
- Do not make retry a hidden detail-only action when board is primary.

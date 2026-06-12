# kestra-io/kestra

- url: https://github.com/kestra-io/kestra
- category: orchestration workflow operations
- metadata: public repo target selected on 2026-06-12; no clone/install.

## Evidence

- Public project category: orchestration and workflow platform.
- Relevant UI class: flows, executions, logs, task state, triggers,
  dependencies, namespaces, and retry operations.

## IA Artifact

- Dashboard routes summarize failed executions, delayed triggers, flow health,
  owner hotspots, and recovery backlog.
- List routes own flows, executions, triggers, and namespaces with status,
  owner, duration, next run, and action.
- Detail routes need run identity, task graph or step list, logs, inputs,
  outputs, retries, dependency impact, and audit.
- Action routes own retry, resume, pause, backfill, or trigger flows with
  right-side preflight.

## Page Pattern

- `dashboard-control-tower-protask` for orchestration health.
- `rich-entity-list-protask` for executions and flow catalogs.
- `split-pane-triage-protask` for failed execution detail.
- `action-form-protask` for backfill/retry/trigger workflows.

## Business Workflow

An operator filters failed executions, opens the affected run, reviews failed
task evidence and downstream dependency impact, retries or backfills, then
checks logs and audit.

## ForgeUI Gap

- Task graph summary rail and execution log evidence panel.

## Borrow

- Execution detail that pairs step evidence with recovery commands.
- Trigger/backfill forms that show blast radius before submit.

## Reject

- Do not show workflows as static diagrams without actionable run state.
- Do not hide logs behind a separate route when they are required for triage.

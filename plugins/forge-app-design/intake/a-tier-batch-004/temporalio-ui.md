# temporalio/ui

- url: https://github.com/temporalio/ui
- category: workflow execution observability
- metadata: public repo target selected on 2026-06-12; no clone/install.

## Evidence

- Public project category: workflow execution UI.
- Relevant UI class: namespaces, workflows, workflow runs, histories, tasks,
  retries, failures, and search/filter.

## IA Artifact

- Dashboard routes summarize workflow health, failure rate, backlog, retry
  pressure, and namespace hotspots.
- List routes own workflow executions with status, workflow type, start time,
  duration, retry count, search attributes, and action.
- Detail routes need execution identity, input/output, event history, failure
  evidence, retry/cancel/terminate actions, and related runs.
- Action routes should be guarded by confirmation and evidence context.

## Page Pattern

- `rich-entity-list-protask` for workflow execution queues.
- `split-pane-triage-protask` for failed workflow detail: history, error,
  retry path, impact, and audit.
- `kanban-workflow-protask` only when runs are actively moved between operator
  lanes; otherwise status grouping is not enough.

## Business Workflow

An operator filters failed or long-running executions, opens the run, reads the
event history and failure evidence, retries/cancels/terminates if safe, then
opens logs or related runs.

## ForgeUI Gap

- Execution event history panel with dense event rows, duration, error, retry,
  and copy/open-log actions.

## Borrow

- Failure evidence directly beside recovery actions.
- Search attributes and event history as first-class operational data.

## Reject

- Do not treat workflow status as a decorative label only.
- Do not count read-only grouped status lanes as promoted kanban.

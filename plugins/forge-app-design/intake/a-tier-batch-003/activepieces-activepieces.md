# activepieces/activepieces

- url: https://github.com/activepieces/activepieces
- category: automation workflow
- metadata: public repo target selected on 2026-06-11; GitHub API numeric metadata returned 403.

## Evidence

- Public project category: workflow automation.
- Relevant UI class: flows, triggers, runs, step history, failures, retries,
  and connections.

## IA Artifact

- Flow list owns status, owner, trigger, last run, failure rate, and actions.
- Run detail owns step timeline, input/output evidence, error payload,
  retry/cancel actions, and audit.
- Action routes own create/edit flow, connection setup, test run, and publish.

## Page Pattern

- Automation dashboards need failure/readiness trend plus priority failed runs.
- Run detail must be evidence-first: step timeline, payload, root cause, retry.
- Builder routes are specialized workflow/action pages and should not be
  treated as normal settings pages.

## Business Workflow

- Operator opens failed runs, checks which step failed and why, retries or
  disables the flow, then follows the audit trail.

## ForgeUI Gap

- Run/step timeline with payload evidence and retry feedback.

## Borrow

- Evidence-rich workflow detail.
- Direct retry/disable actions from failed run context.
- Dashboard entry into failed automation queue.

## Reject

- Do not build a full no-code flow editor for ordinary workflow PRDs.
- Do not represent failed runs as a flat status table only.

# getsentry/sentry

- url: https://github.com/getsentry/sentry
- category: split-pane triage
- metadata: public repo page reviewed on 2026-06-09; GitHub API numeric metadata was rate-limited.

## Evidence

- Public repo page describes developer-first error tracking and performance
  monitoring.
- Relevant UI class: issue triage, event evidence, release/environment context,
  ownership, and resolution.

## IA Artifact

- Issue list owns status, severity, frequency, affected users, owner, and
  last-seen evidence.
- Issue detail owns event timeline, stack/log evidence, tags, releases,
  suspects, similar events, and resolution actions.
- Workflow routes own assign, resolve, ignore, escalate, and link-to-task.

## Page Pattern

- Split-pane triage should keep the issue list or neighboring events visible
  while the detail pane shows root cause and impact.
- Detail pages must prioritize evidence and action closure over decorative
  summaries.
- Activity/audit trail should be compact and colocated with resolution state.

## Business Workflow

- Engineer or operator opens a high-impact issue, validates stack/event
  evidence, checks affected scope, assigns or resolves it, and leaves an audit
  trail.

## ForgeUI Gap

- Stack trace/log payload panel with collapsible frames and copy affordances.
- Error event timeline primitive with environment/release tags.

## Borrow

- Evidence-first detail layout for `split-pane-triage-protask`.
- Severity/frequency/affected-user fields for queue density.
- Resolution action grouped with audit feedback.

## Reject

- Do not copy Sentry's developer-specific issue taxonomy into non-observability
  admin products.
- Do not make ordinary detail pages look like code debuggers unless the domain
  actually needs logs or stack traces.

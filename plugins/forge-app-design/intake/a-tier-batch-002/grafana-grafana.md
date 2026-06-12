# grafana/grafana

- url: https://github.com/grafana/grafana
- category: observability control-tower
- metadata: public repo page reviewed on 2026-06-09; GitHub API numeric metadata was rate-limited.

## Evidence

- Public repo page describes an observability and data visualization platform
  for metrics, logs, traces, and multiple data sources.
- Relevant UI class: dashboard control tower, data source navigation,
  alert/rule workflow, and multi-panel analysis.

## IA Artifact

- Dashboard route owns variable filters, panel grid, time range, drill-downs,
  and alert context.
- Explore route owns query input, result visualization, logs/traces, and saved
  investigation state.
- Alert routes own rules, incidents, contact points, and evaluation history.

## Page Pattern

- Dashboard pages need adaptive panel grids and compact variables above the
  charts; filters must not feel like a large card.
- Explore pages need split result surfaces: query controls, visualization, log
  table, and inspector.
- Alert/rule detail pages need history, evaluation state, owner, and next
  workflow link.

## Business Workflow

- Operator detects an alert, opens the related dashboard or explore view,
  validates logs/traces, then changes rule state or opens a remediation task.

## ForgeUI Gap

- Dashboard variable/filter bar and multi-panel chart grid guidance.
- Log/trace evidence table with expandable payload rows.

## Borrow

- Time-range and variable controls as a compact toolbar pattern.
- Dashboard drill-down from trend to evidence detail.
- Alert rule history as a right rail or timeline.

## Reject

- Do not build a full dashboard editor for ordinary control-tower PRDs.
- Do not use chart density to hide missing decisions or actions.

# apache/superset

- url: https://github.com/apache/superset
- category: analytics workspace
- metadata: public repo page reviewed on 2026-06-09; GitHub API numeric metadata was rate-limited.

## Evidence

- Public repo page describes a data visualization and data exploration
  platform.
- Relevant UI class: dataset management, chart creation, dashboard assembly,
  SQL/explore workflow, and access governance.

## IA Artifact

- Dataset/list routes own source identity, freshness, owner, schema, and usage.
- Explore route owns metric/dimension selection, filters, chart type, result
  preview, and save.
- Dashboard route owns layout, native filters, chart cards, and edit/publish
  workflow.

## Page Pattern

- Dataset lists need rich entity rows: source, schema, owner, freshness, usage,
  risk, and action.
- Explore/action pages need grouped form controls with a right context panel
  for dataset, permissions, and preview state.
- Dashboard control towers need adaptive chart cards, not hard-coded columns.

## Business Workflow

- Data user selects a dataset, builds a chart, checks preview and governance
  context, saves it, then adds it to a dashboard.

## ForgeUI Gap

- Dataset/schema identity cells and field metadata panel.
- Explore builder with chart-type selector, metric/dimension chips, and
  preview validation.

## Borrow

- Action-page grouping for chart creation workflows.
- Dataset detail as evidence/context for analytics actions.
- Governance context rail for access and ownership.

## Reject

- Do not require SQL editor complexity in every data-admin prototype.
- Do not use dashboard edit mode as the default read-mode layout.

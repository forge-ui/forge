# appsmithorg/appsmith

- url: https://github.com/appsmithorg/appsmith
- category: internal app builder operations
- metadata: public repo target selected on 2026-06-12; no clone/install.

## Evidence

- Public project category: open-source internal application platform.
- Relevant UI class: workspace/app catalog, datasource/query management,
  deployment, permissions, and builder workflow.

## IA Artifact

- Dashboard routes summarize workspace health, recently changed apps,
  deployment state, and ownership.
- List routes own apps, datasources, queries, and users with owner, updated
  time, environment, and publish state.
- Detail routes should split identity, configuration, permissions, recent
  changes, and deploy/publish actions.
- Builder/canvas routes are specialized workflow routes and should stay out of
  generic admin templates.

## Page Pattern

- Use `dashboard-control-tower-protask` for workspace operations and stale
  deployment risk.
- Use `rich-entity-list-protask` for apps/datasources/users.
- Use `split-pane-triage-protask` for datasource or deployment incidents:
  evidence, affected apps, owner, recent change, and rollback/publish action.

## Business Workflow

An operator scans apps with failed deploys or stale owners, opens the affected
app/datasource, checks recent changes and dependent workflows, then publishes,
rolls back, or assigns the owner.

## ForgeUI Gap

- App dependency impact rail: app, datasource, query, environment, owner, and
  last publish state in one compact context surface.

## Borrow

- Workspace-level dashboard entry points into concrete app/datasource work.
- Split detail surfaces that distinguish configuration, permissions, and
  deployment state.

## Reject

- Do not copy the drag-and-drop editor into generic Forge admin prototypes.
- Do not promote widgets/canvas mechanics as ordinary page patterns.

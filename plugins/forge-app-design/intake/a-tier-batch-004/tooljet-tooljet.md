# ToolJet/ToolJet

- url: https://github.com/ToolJet/ToolJet
- category: internal tool builder operations
- metadata: public repo target selected on 2026-06-12; no clone/install.

## Evidence

- Public project category: open-source low-code platform.
- Relevant UI class: application catalog, data sources, workspace permissions,
  environment configuration, and app release workflow.

## IA Artifact

- Dashboard routes group recent apps, failed operations, datasource health, and
  user/team access changes.
- List routes own apps, tables, datasources, audit entries, and workspace users.
- Detail routes need operational state plus ownership and access context.
- Builder routes are high-interaction workflow surfaces and should be
  explicitly labeled as such.

## Page Pattern

- `rich-entity-list-protask` for apps/datasources/users because operators need
  owner, environment, status, last activity, and row action.
- `action-form-protask` for datasource setup or environment configuration.
- `split-pane-triage-protask` for failed query/deploy review.

## Business Workflow

The operator finds a failing app or datasource, checks environment and owner,
inspects recent activity, updates configuration, then publishes or routes the
issue to the app owner.

## ForgeUI Gap

- Environment-aware datasource status cells: environment, secret state, health,
  and last validation timestamp.

## Borrow

- Explicit separation between catalog, configuration, audit, and builder routes.
- Access and environment metadata as first-screen operational fields.

## Reject

- Do not turn every app page into a generic builder canvas.
- Do not hide deployment or access state behind plain settings tabs.

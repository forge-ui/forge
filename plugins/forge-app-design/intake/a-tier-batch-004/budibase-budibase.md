# Budibase/budibase

- url: https://github.com/Budibase/budibase
- category: low-code admin workflow
- metadata: public repo target selected on 2026-06-12; no clone/install.

## Evidence

- Public project category: open-source internal tool platform.
- Relevant UI class: app catalog, automations, data sources, users/roles,
  publish lifecycle, and audit events.

## IA Artifact

- Dashboard routes summarize apps, automation failures, publish readiness, and
  access risk.
- List routes own app records, automation runs, data tables, users, and roles.
- Detail routes need state, dependencies, recent runs, permission impact, and
  next publish/retry action.
- Action routes own grouped create/edit forms with validation and right-side
  preflight context.

## Page Pattern

- `dashboard-control-tower-protask` for workspace operations.
- `rich-entity-list-protask` for apps, automations, and users.
- `split-pane-triage-protask` for failed automation runs and permission review.
- `action-form-protask` for app publish, datasource setup, or role changes.

## Business Workflow

An admin reviews automation failures or pending publish changes, opens the
affected app, checks dependent data sources and role impact, retries or
publishes, then audits the resulting state.

## ForgeUI Gap

- Automation run mini-timeline plus dependency impact rail.

## Borrow

- Publish readiness as a dashboard signal, not just a button state.
- Role/access impact displayed beside the change action.

## Reject

- Do not reproduce low-code screen builder controls in ordinary operational
  prototypes.
- Do not bury automation run evidence in a generic recent activity feed.

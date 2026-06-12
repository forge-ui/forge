# directus/directus

- url: https://github.com/directus/directus
- category: data/content operations
- metadata: public repo target selected on 2026-06-12; no clone/install.

## Evidence

- Public project category: data platform and headless CMS.
- Relevant UI class: collection records, schema, files, roles, permissions,
  revisions, and content operations.

## IA Artifact

- Dashboard routes summarize collection health, pending review, recent edits,
  permission changes, and publish/revision risk.
- List routes own collection items with status, owner, updated time, locale,
  relation count, and review action.
- Detail routes need record identity, field groups, relations, revisions,
  permissions, comments, and publish/revert actions.
- Schema builder routes are specialized and should not pollute ordinary record
  detail pages.

## Page Pattern

- `rich-entity-list-protask` for collection records and files.
- `split-pane-triage-protask` for content review, revision comparison, and
  permission incidents.
- `action-form-protask` for create/edit record flows with publish preflight.

## Business Workflow

The operator filters pending or risky records, opens a record, checks field
changes, relations, revision history, and permission impact, then publishes,
reverts, or requests review.

## ForgeUI Gap

- Revision comparison rail and publish-state cell primitives.

## Borrow

- Revision and permission context as first-class detail evidence.
- Collection list density with status, owner, relation, and updated fields.

## Reject

- Do not make generic Forge apps schema-builder first.
- Do not collapse revision history into one paragraph of helper text.

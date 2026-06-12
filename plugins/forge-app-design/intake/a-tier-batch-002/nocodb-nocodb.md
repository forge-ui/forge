# nocodb/nocodb

- url: https://github.com/nocodb/nocodb
- category: data grid workflow
- metadata: public repo page reviewed on 2026-06-09; GitHub API numeric metadata was rate-limited.

## Evidence

- Public repo page describes a self-hostable Airtable-style alternative.
- Relevant UI class: table/grid workspace, field types, relational records,
  views, forms, and automation-like workflows.

## IA Artifact

- Base/workspace route owns table navigation, views, records, collaborators,
  and integration context.
- Grid route owns dense editable rows, field-type headers, filters, grouping,
  sorting, and bulk actions.
- Record detail route owns field groups, linked records, comments/activity,
  attachments, and save feedback.

## Page Pattern

- Data-grid pages need high-density rows and sticky controls; large cards or
  loose typography break the workflow.
- Record detail should be split-pane: editable fields on the left, linked
  records/activity/context on the right.
- Views are a first-class IA object and should be selectable from a compact bar.

## Business Workflow

- Operator chooses a saved view, edits or reviews records, follows linked
  context, saves changes, and audits who changed what.

## ForgeUI Gap

- Dense editable grid with field-type header affordances.
- Linked-record cell and record detail field-group pattern.

## Borrow

- View switcher as a compact toolbar primitive.
- Record detail with fields plus activity/context rail.
- Field type metadata for table density.

## Reject

- Do not turn Forge admin apps into full no-code database builders.
- Do not hand-roll spreadsheet primitives in business app pages; record as
  ForgeUI gap when needed.

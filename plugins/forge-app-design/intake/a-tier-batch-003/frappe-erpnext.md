# frappe/erpnext

- url: https://github.com/frappe/erpnext
- category: ERP operations
- metadata: public repo target selected on 2026-06-11; GitHub API numeric metadata returned 403.

## Evidence

- Public project category: open-source ERP.
- Relevant UI class: accounting, sales, inventory, purchasing, HR, and
  workflow-heavy business records.

## IA Artifact

- Dashboard routes summarize operational health by function: sales pipeline,
  receivables, inventory exceptions, purchasing, and tasks.
- List routes own searchable business records with status, owner, amount,
  date, and next action.
- Detail routes own document identity, ledger/stock impact, attachments,
  comments, and audit trail.
- Action routes own create/post/submit/amend flows and must stay out of
  sidebar navigation.

## Page Pattern

- ERP pages need `rich-entity-list-protask` for queues and
  `split-pane-triage-protask` for exception-heavy documents.
- Action pages must use grouped fields and a status/preflight rail, because
  posting or submitting a document has downstream accounting/inventory impact.
- Dashboard cards should connect to workflow entry, not only display totals.

## Business Workflow

- Operator filters a business document queue, opens a high-impact record,
  checks downstream ledger/stock/customer impact, submits or routes for
  approval, then reviews history.

## ForgeUI Gap

- Ledger/stock impact mini-table and compact approval trail examples.

## Borrow

- Multi-module dashboard entry points.
- Document lifecycle state as a first-class route concern.
- Detail pages that show downstream impact before action.

## Reject

- Do not clone ERPNext's full meta-model or form builder.
- Do not turn Forge apps into schema-driven enterprise CRUD generators.

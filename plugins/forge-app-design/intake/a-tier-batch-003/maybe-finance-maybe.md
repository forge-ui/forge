# maybe-finance/maybe

- url: https://github.com/maybe-finance/maybe
- category: finance control tower
- metadata: public repo target selected on 2026-06-11; GitHub API numeric metadata returned 403.

## Evidence

- Public project category: finance / money management.
- Relevant UI class: accounts, balances, transactions, categories, budgets,
  anomalies, and reconciliation.

## IA Artifact

- Dashboard route owns balance trend, cashflow, anomalies, upcoming bills, and
  transaction review entry.
- Transaction list owns account, merchant, category, amount, date, status,
  owner/reviewer, and action.
- Transaction detail owns receipt/evidence, category decision, account impact,
  history, and correction action.

## Page Pattern

- Finance dashboards need trend context plus work queue, not only big balance
  numbers.
- Transaction review is a rich list with compact identity, amount, category,
  evidence, and one row action.
- Detail/action routes should show before/after financial impact.

## Business Workflow

- Reviewer filters uncategorized or anomalous transactions, opens one, checks
  merchant/receipt/evidence, changes category or flags it, then sees the
  updated account impact.

## ForgeUI Gap

- Money/currency table cells with sign, category, account, and trend treatment.

## Borrow

- Dashboard trend plus actionable transaction queue.
- Financial impact visible before correction.
- Compact amount/category cells.

## Reject

- Do not turn finance prototypes into personal lifestyle dashboards.
- Do not use oversized numbers without queue/action context.

# A-tier Repo Intake Batch 003

Generated: 2026-06-11

Policy:

- No full clone.
- No package install.
- No local dev server.
- Keep artifact-level IA, page pattern, workflow, and ForgeUI gap only.
- Delete any temporary probe material after artifact writing.

GitHub API numeric metadata was not recorded because the public API returned
403 in this environment. This batch uses public repository URLs and avoids
stale star/freshness claims.

## Repos

| Repo | Category | Public Source | Artifact |
|---|---|---|---|
| frappe/erpnext | ERP operations | https://github.com/frappe/erpnext | `frappe-erpnext.md` |
| medusajs/medusa | commerce operations | https://github.com/medusajs/medusa | `medusajs-medusa.md` |
| chatwoot/chatwoot | support triage | https://github.com/chatwoot/chatwoot | `chatwoot-chatwoot.md` |
| documenso/documenso | document workflow | https://github.com/documenso/documenso | `documenso-documenso.md` |
| formbricks/formbricks | feedback control tower | https://github.com/formbricks/formbricks | `formbricks-formbricks.md` |
| activepieces/activepieces | automation workflow | https://github.com/activepieces/activepieces | `activepieces-activepieces.md` |
| Infisical/infisical | secrets/access operations | https://github.com/Infisical/infisical | `infisical-infisical.md` |
| maybe-finance/maybe | finance control tower | https://github.com/maybe-finance/maybe | `maybe-finance-maybe.md` |

## Batch-Level Borrow

- Business admin pages need route-specific workflow surfaces: invoices,
  fulfillment, support conversations, document signatures, survey responses,
  automation runs, access reviews, and transactions should not collapse into
  one generic list/detail template.
- Dashboards should expose operating priorities plus entry points into the
  workflow: overdue invoices, failed flows, high-risk conversations, blocked
  signatures, or anomalous transactions.
- Detail pages should combine identity, evidence, status, impact, history, and
  next action in one readable surface.
- Action pages need grouped fields plus right-side context: validation,
  completion, upstream record, next workflow link, and save feedback.

## Batch-Level ForgeUI Gaps

- Compact conversation/message split-pane pattern.
- Order/invoice/payment lifecycle cells and totals.
- Document signature progress rail with participant state.
- Automation run timeline and step evidence panels.
- Access review / environment-secret audit rail.
- Finance transaction categorization and reconciliation queue.

## Batch-Level Reject

- Do not copy each product's house style or navigation chrome.
- Do not import low-code builders, schema designers, or full editors into
  ordinary admin PRDs.
- Do not let a domain-rich product justify hand-rolled Button/Table/Badge/card
  primitives when ForgeUI already has the slot owner.

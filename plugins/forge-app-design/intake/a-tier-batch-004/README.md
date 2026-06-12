# A-tier Repo Intake Batch 004

Generated: 2026-06-12

Policy:

- No full clone.
- No package install.
- No local dev server.
- Keep artifact-level IA, page pattern, workflow, and ForgeUI gap only.
- Delete any temporary probe material after artifact writing.

This batch uses public repository URLs as lightweight reference anchors. It does
not record star counts or freshness metadata because those drift quickly and are
not needed for the design-pattern extraction.

## Repos

| Repo | Category | Public Source | Artifact |
|---|---|---|---|
| appsmithorg/appsmith | internal app builder operations | https://github.com/appsmithorg/appsmith | `appsmithorg-appsmith.md` |
| ToolJet/ToolJet | internal tool builder operations | https://github.com/ToolJet/ToolJet | `tooljet-tooljet.md` |
| Budibase/budibase | low-code admin workflow | https://github.com/Budibase/budibase | `budibase-budibase.md` |
| directus/directus | data/content operations | https://github.com/directus/directus | `directus-directus.md` |
| strapi/strapi | content/admin operations | https://github.com/strapi/strapi | `strapi-strapi.md` |
| saleor/saleor-dashboard | commerce dashboard | https://github.com/saleor/saleor-dashboard | `saleor-saleor-dashboard.md` |
| temporalio/ui | workflow execution observability | https://github.com/temporalio/ui | `temporalio-ui.md` |
| kestra-io/kestra | orchestration workflow operations | https://github.com/kestra-io/kestra | `kestra-io-kestra.md` |

## Batch-Level Borrow

- Builder-style products separate the object catalog from the work canvas. Forge
  admin prototypes should borrow the IA discipline, not the full visual editor.
- Data/content systems expose field schema, record state, permission, revision,
  and publish workflow as first-class detail context.
- Commerce dashboards combine order, payment, fulfillment, customer, and
  inventory impact before action; detail pages should not be flat CRUD forms.
- Workflow systems make run state, retry path, logs, inputs/outputs, and next
  recovery action visible in one triage surface.

## Batch-Level ForgeUI Gaps

- Compact run/execution timeline with retry and log anchors.
- Commerce order/payment/fulfillment lifecycle cell set.
- Record revision and publish-state rail.
- Builder object list plus selected object property inspector pattern.
- Permission/role matrix preview that does not become a full editor.
- Error log evidence panel with copy/open/retry actions.

## Batch-Level Reject

- Do not copy low-code drag-and-drop canvases into ordinary Forge admin apps.
- Do not build generic schema editors unless the PRD explicitly asks for a
  builder product.
- Do not make workflow dashboards read-only; expose retry, cancel, open logs,
  or assign next action when the domain supports it.
- Do not flatten commerce/content/workflow details into a single all-fields
  card; preserve state, evidence, impact, history, and action rails.

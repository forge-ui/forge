# fulfillment-ops-control-tower

## Purpose

This is the second golden mini-app for `forge-app-design`.

It shows how to turn an operations PRD into a workflow-heavy Forge admin app: dashboard triage, kanban status progression, exception resolution, inventory risk, and carrier lane monitoring.

## Output

- Path: `/Users/hesong/Desktop/output/fulfillment-ops-c7-codex`
- Domain: fulfillment operations / supply chain / control tower
- Pages: 6/6 implemented
- Entities: `FulfillmentOrder`, `FulfillmentWave`, `FulfillmentIssue`, `InventoryRisk`, `CarrierLane`
- Gate: `quality-eval` full run passed with `0 critical / 0 warn / 26 passed`

## Route Map

| Route | Shape | What to Learn |
|---|---|---|
| `/` | fulfillment risk dashboard | Health metrics + blocked wave panel + risk stream + lane health side panel |
| `/waves` | kanban workflow | 5 status lanes, inline advance action, blocked issue link, highlighted wave from query |
| `/issues` | exception queue | severity filtering, root-cause preview, wave/order context |
| `/issues/[id]` | split-pane triage | root cause, impact scope, similar issues, SOP, change history, resolution workflow |
| `/inventory-risks` | risk cards | shortage math, ETA context, warehouse impact |
| `/carrier-lanes` | lane monitor | delay rate, failed handoff, lane status, escalation context |

## Product Lessons

- Model operations pages around "what needs action now" rather than object CRUD.
- Use kanban only when cards can change state or lead to the next operational decision.
- Keep blocked/error states actionable: a blocked wave links to issue triage, and issue resolution links back to wave recovery.
- Use side panels and compact cards for operational context instead of repeating large tables.
- Preserve explicit local state for loading, saving, error, highlight, and advancing actions.
- Include route query handling (`?highlight=<id>`) when a previous workflow should focus the next page.

## Files Worth Reading

- `DESIGN-BRIEF.md`
- `app/page.tsx`
- `app/waves/page.tsx`
- `app/waves/_components/WaveColumn.tsx`
- `app/waves/_components/WaveCard.tsx`
- `app/issues/page.tsx`
- `app/issues/[id]/page.tsx`
- `app/issues/[id]/_components/ResolutionPanel.tsx`
- `app/inventory-risks/page.tsx`
- `app/carrier-lanes/page.tsx`
- `mock/*.ts`

## Known Limitation

This app has strong workflow coverage but fewer total pages than `data-quality-control-tower`. Use it as the reference for operations-heavy PRDs, not as the only reference for large multi-module platforms.

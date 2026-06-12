# detail-triage-workflow

Use this pattern when a PRD has an entity that must be investigated, decided, and resolved with business context.

Good matches:
- issue / exception / incident triage
- support ticket investigation
- approval request review
- risk alert handling
- failed workflow / failed payment / failed sync detail

Do not use it for:
- read-only profile pages
- shallow detail pages where the primary action is just edit/save fields
- list-heavy workflows where the main work happens on a board

## Files

- `BRIEF.md` — Page Intent Spec example for Step 2.5.
- `page.tsx` — detail route orchestration example. Keep this thin.
- `utils.ts` — status/severity/category labels, SOP map, related-item helper.
- `_components/TriageMetaStrip.tsx`
- `_components/RootCausePanel.tsx`
- `_components/ImpactScopePanel.tsx`
- `_components/SimilarRecords.tsx`
- `_components/SopBlock.tsx`
- `_components/ChangeHistory.tsx`
- `_components/ResolutionPanel.tsx`

## Adaptation Rules

1. Replace `TriageItem` with the PRD entity name, for example `FulfillmentIssue`, `Incident`, `Ticket`, `ApprovalRequest`, or `SyncFailure`.
2. Replace `API_ROUTE` with the generated scaffold route, for example `/api/fulfillment-issue`.
3. Keep the seven depth blocks unless the PRD explicitly rules them out:
   - evidence
   - root cause
   - impact scope
   - similar / related records
   - SOP / next action
   - change history
   - audit trail / downstream workflow link
4. Keep the primary workflow real: `PATCH` the item, update local state, then navigate to the next page in the workflow.
5. Put the primary resolution / approval / escalation controls immediately after the hero or meta strip, before secondary evidence panels. A triage detail page must be an action workspace, not a read-only dossier.
6. Put inline style and custom visual details inside `_components/`, not in `page.tsx`.
7. Do not reuse the dashboard/list template. Split-pane triage needs evidence and action closure in the desktop review viewport.

## Acceptance

- `page.tsx` imports `_components/` and stays within detail-page budget.
- The resolve/escalate action is not an empty `onClick`.
- Resolution controls are visible in the desktop review viewport.
- The resolved path links to another workflow page.
- Detail page includes evidence, root cause, impact, related records, SOP, history, audit trail, and next workflow link.
- Screenshot acceptance must show evidence/root cause or impact plus resolution/action controls in the desktop review viewport.
- `page.tsx` has no inline `style={{ ... }}` or hex literals.

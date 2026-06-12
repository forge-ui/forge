# dashboard-risk-overview

Use this pattern when the PRD needs an operational dashboard that helps users prioritize risk, not just view generic KPI cards.

Good matches:
- fulfillment / logistics control tower
- incident or alert overview
- data quality / pipeline health dashboard
- SLA / compliance / approval risk center
- inventory, carrier, finance, or security operations dashboard

Do not use it for:
- simple CRUD home pages with no cross-entity risk decision
- marketing analytics dashboards where charts are the primary object
- read-only report pages with no workflow links

## Files

- `BRIEF.md` — Page Intent Spec example for Step 2.5.
- `page.tsx` — route-level orchestration example. Keep this thin.
- `utils.ts` — risk color, status helpers, and generic types.
- `_components/HealthStats.tsx` — semantic KPI strip.
- `_components/RiskStreams.tsx` — critical records + contextual risks.
- `_components/BlockedWorkflowPanel.tsx` — high-attention workflow block.
- `_components/ContextHealthPanel.tsx` — secondary operational context.

## Adaptation Rules

1. Replace `PrimaryRecord`, `WorkflowRecord`, `RiskRecord`, and `ContextRecord` with PRD entities.
2. Replace API routes with generated scaffold routes.
3. Keep dashboard focused on one decision: what needs attention first.
4. Include at least two workflow links from dashboard to deeper pages.
5. Use semantic StatCard themes; do not render 3+ all-white cards.
6. Put custom background/shadow details inside `_components/`, not `page.tsx`.

## Acceptance

- `page.tsx` stays thin and imports `_components/`.
- Dashboard has semantic stats, not generic total/active/inactive only.
- At least one risk stream item links to a detail or triage page.
- At least one blocked workflow card links to a board or workflow page.
- `page.tsx` has no inline `style={{ ... }}` or hex literals.

# Golden Mini-Apps

Golden mini-apps are full generated Forge admin projects used as few-shot references for `forge-app-design`.

Use them when a PRD matches the app domain or page shape more closely than a single pattern pack. A worker should read:

1. the golden app note in this directory;
2. the app's `DESIGN-BRIEF.md`;
3. representative `app/**/page.tsx` files;
4. the app's route-level `_components/` files when the page uses them.

Do not copy business text literally. Reuse the product-design structure, route map, component split, workflow links, state handling, and density decisions.

## Promoted References

- `deployment-release-board.md` — canonical promoted `kanban-workflow-protask`
  evidence for board-first apps.

## Current Golden Apps

| ID | Domain | Summary | Status |
|---|---|---|---|
| `deployment-release-board` | Release operations / promoted kanban workflow | `deployment-release-board.summary.json` | **partial / visual blocked** — `0 critical / 0 warn / browser pass / product pass / next-build pass`, but `visual.pass=false` (see Visual Status below) |
| `data-quality-control-tower` | Data quality / governance / monitoring | n/a legacy note | verified `0 critical / 0 warn / next-build pass` |
| `fulfillment-ops-control-tower` | Fulfillment / supply chain / ops control tower | n/a legacy note | verified `0 critical / 0 warn / next-build pass` |
| `support-ticket-sla-center` | Support / ticketing / SLA operations | n/a legacy note | verified `0 critical / 0 warn / next-build pass` |

## Starter Validation Notes

These are not promoted golden apps. They record fresh starter behavior that
should influence ForgeUI and `forge-app-design` rules.

| ID | Domain | Evidence | Status |
|---|---|---|---|
| `gym-member-admin` | Gym membership / visits / classes / revenue admin | `gym-member-admin.md` and `screenshots/gym-member-admin/*.png` | Product Design + clean Forge starter validation; `typecheck` and `next build` pass; human review acceptable but below Protask parity |

## Verification Policy

Each golden app must have:

- `DESIGN-BRIEF.md` with no stale placeholder status;
- all planned route pages implemented;
- no scaffold placeholder text;
- `quality-eval` full gate `critical=0`;
- `next build` pass;
- a short note in this directory explaining what workers should learn from it.

Browser validation is still required for C8/C9/C10, but do not batch-run browser screenshots on a constrained machine.

## Visual Status

A golden app is only `visual pass` when its `*.summary.json` has
`scores.visual.pass === true` *and* an empty `visualBlockingIssues` array.
Apps with `visual.pass=false` are listed as **partial / blocked** in the table
above; the blocking issues must come straight from the summary.

### `deployment-release-board` — visual blocked

Source: `deployment-release-board.summary.json`
(`scores.visual.pass=false`, `visualBaselineVersion="adaptive-protask-forge-2026-06-04"`).

Blocking issues lifted verbatim from `visualBlockingIssues`:

- `split-pane-triage baseline failed: compact detail spacing and identity/profile rail`
- `kanban-workflow-protask baseline failed: adaptive layout sizing`
- `action-form-protask baseline failed: typography scale and compact action spacing`

Until these baselines pass, do not cite this app as the canonical visual
reference for split-pane, kanban-workflow, or action-form patterns. It is
still valid evidence for IA, route map, brief structure, and product-quality
acceptance — the engineering and product gates are clean. Track recovery
against the P0 "Forge composition DNA" and "visual audit screenshot-level
upgrade" items in `../CODEX-PROTOTYPE-DESIGN-ROADMAP.md`.

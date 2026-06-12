# data-quality-control-tower

## Purpose

This is the first production-grade golden mini-app for `forge-app-design`.

It shows how a medium-complexity PRD should become a 10-page Forge admin product instead of a set of field-mapped CRUD screens.

## Output

- Path: `/Users/hesong/Desktop/output/data-quality-golden-codex`
- Domain: data quality monitoring / governance
- Pages: 10/10 implemented
- Entities: `DataSource`, `QualityRule`, `CheckJob`, `Issue`, `Report`
- Gate: `quality-eval` full run passed with `0 critical / 0 warn / 26 passed`

## Route Map

| Route | Shape | What to Learn |
|---|---|---|
| `/` | risk dashboard | KPI row + risk source panel + critical stream + jobs preview |
| `/sources` | filtered source list | compact filters, source health, semantic status color |
| `/sources/[id]` | source detail | rule coverage, recent issues, drill-in links |
| `/rules` | category rule library | category tabs, enabled-only control, rule severity |
| `/rules/[id]` | rule spec editor | expression editor, save state, SOP, downstream consumers |
| `/jobs` | kanban workflow | status columns, failed-job path into issue triage |
| `/jobs/[id]` | job run detail | manual trigger, linked issue drill-in, redirect after action |
| `/issues` | triage queue | status/severity filters, affected-row prioritization |
| `/issues/[id]` | split-pane triage | root cause, impact, samples, similar issues, SOP, save workflow |
| `/reports` | reporting workspace | period selection, executive metrics, owner follow-up |

## Product Lessons

- Build around decisions and actions, not entity tables.
- Keep dashboard, list, detail, kanban, editor, and report pages visually distinct.
- Link workflows across pages:
  - dashboard risk cards to source / issue detail;
  - failed jobs to issue queue;
  - resolved issue to jobs board;
  - rule/source pages back to related issues.
- Use deterministic business mock data. Random faker rows are not good enough for golden references.
- Include local state for saving, filtering, manual trigger, and selected period.
- Keep page files under the current line-count thresholds; split deep pages with `_components/`.

## Files Worth Reading

- `DESIGN-BRIEF.md`
- `app/page.tsx`
- `app/jobs/page.tsx`
- `app/issues/[id]/page.tsx`
- `app/sources/page.tsx`
- `app/rules/[id]/page.tsx`
- `app/reports/page.tsx`
- `mock/*.ts`
- `app/_lib/quality.ts`

## Known Limitation

Browser visual validation was intentionally not completed in batch mode after local machine resource pressure. Use a single-route, low-load browser check for C8/C9/C10 instead of opening many pages at once.

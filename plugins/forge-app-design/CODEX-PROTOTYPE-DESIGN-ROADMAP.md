# Codex Prototype Design Roadmap

Date: 2026-06-03

## Goal

Build a Codex-native prototype design stack through skills, plugins, artifacts, and eval gates. This is not a Readdy-style SaaS builder. The product surface is Codex: local workspace access, real code, real design systems, repeatable audits, and reusable skills.

The long-range quality target is that `forge-app-design` can naturally produce
Forge admin prototypes close to the Protask/Forge original implementation
quality. Engineering, browser, and audit checks are sub-goals; they do not
replace screenshot-proven visual fit.

## Target Workflow

1. Load product design context.
2. Convert PRD, URL, screenshot, Figma, or existing code into a design brief.
3. If no visual target exists, produce three visual directions before building.
4. Generate IA route map and page-pattern artifacts.
5. Write one Page Intent Spec per implemented route in `DESIGN-BRIEF.md`.
6. Build a Forge admin prototype from promoted patterns and page-local components.
7. Validate with build, `quality-eval`, browser screenshots, `product-quality-audit`, and Protask visual audit when relevant.
8. Produce a review packet with screenshots, route map, brief coverage, audit results, and known gaps.
9. Promote reusable learnings back into samples, IA artifacts, page-patterns, eval rules, and ForgeUI gaps.

## Long-Range Repo Intake

The 400+ open-source admin/product repositories are a standing input pipeline,
not a one-time clone/install task. They feed the final goal by supplying real
IA, page-pattern, workflow, and component-gap evidence.

Policy:

- Process A-tier repos in small batches of 5-10.
- Do not full-clone, install, run, or line-by-line analyze the full corpus.
- Extract only artifact-level learning:
  - IA artifact
  - page pattern
  - business workflow
  - ForgeUI gap
- Keep the artifact and delete temporary probes.
- After every 2-3 promoted pattern updates, run a fresh PRD validation to
  verify that natural output improved.

Current status:

- Batch 001 exists under `intake/a-tier-batch-001`.
- Batch 002 exists under `intake/a-tier-batch-002` and adds product analytics,
  observability, BI/explore, and dense data-grid evidence without cloning or
  installing source projects.
- Batch 003 exists under `intake/a-tier-batch-003` and adds vertical business
  workflow evidence for ERP, commerce, support, document signing, feedback,
  automation, secrets/access, and finance operations.
- Future batches should prioritize the weakest current visual/product gaps:
  dense list/table workflows, identity/detail rails, compact activity rails,
  workflow boards, and dashboard control towers.

## Current Baseline

Stage-passed patterns:

- `dashboard-control-tower-protask`
- `rich-entity-list-protask`
- `split-pane-triage-protask`
- `action-form-protask`

New promoted pattern target:

- `kanban-workflow-protask`

Forge DNA / visual baseline — **partial**:

- `references/design-dna-lite.md` and `references/forge-composition-dna.md`
  exist and encode red-lines plus composition rules, but golden-app runs still
  fail visual baselines (see `golden-apps/deployment-release-board.summary.json`
  `visual.pass=false` with three blocking issues across split-pane, kanban,
  and action-form baselines).
- Cell-primitive usage is documented but not enforced; generated apps still
  hand-roll `Avatar + div + p + Label` in table rows and rail items.
- Visual audit currently scores at the rule-checklist level only; screenshot-
  level proof of fit against the in-repo `src/app/cases/*` and
  `src/app/templates/*` showcases is not yet part of the gate.
- Clean starter validation with `gym-member-admin` shows the preferred runtime
  chain: Product Design owns product/layout exploration, Forge starter/core
  owns the visual primitive baseline, and `forge-app-design` supplies context,
  handoff normalization, audits, and pattern/gap feedback. This reduces the
  risk of over-prescriptive page templates.

Acceptance gates:

- `quality-eval` must be `0 critical / 0 warn` for fresh evidence runs.
- Browser validation must cover implemented route roles and screenshots.
- `product-quality-audit` must pass and block `briefSpecs=0`, missing route specs, missing required product fields, and missing `component_plan`.
- Protask visual audit must pass for medium-complex Forge admin prototypes.
- Forge composition DNA must pass: no hand-rolled cell rows, no hand-rolled
  rail items, no second SurfaceCard around a titled DataTable, AppLayout
  chrome not re-built in page code. Currently advisory; promotion to blocking
  is tracked under P0 below.

## Near-Term Work

| Priority | Work | Output | Acceptance |
|---|---|---|---|
| P0 | Promote kanban/workflow pattern | sample, BRIEF, IA artifact, page-pattern, visual rule | IA artifact validates; visual audit can block weak kanban/workflow routes |
| P0 | Codex design context | `PRODUCT-DESIGN-CONTEXT.md` plus plugin-context source list | Future runs know Forge, Protask, promoted patterns, and acceptance chain |
| P0 | Forge composition DNA extraction | `references/forge-composition-dna.md` anchored to `src/app/cases/table/page.tsx`, `src/app/cases/toolbar/page.tsx`, `src/app/templates/dashboard-builder/_variants.tsx`, `src/app/templates/(dashboard)/layout.tsx`, and `references/design-dna-lite.md` | Every rule traces to one of the five in-repo evidence anchors; generator reads DNA before composing pages |
| P0 | Cell primitive registry | machine-readable registry mapping row slots to `CellImageText` / `CellTextSubtitle` / `CellNumber` / `CellProgressBar` / `CellStatusDot` / `CellMuted` / `CellFile` / `CellCode` / `CellActions` / `CellKebabMenu` / `CellLink`, sourced from `core/src/components/ui/data-table.tsx` | Visual audit can flag any column `render` that returns raw `<div>` + `Avatar` + `<span>` instead of a registered cell |
| P0 | Golden evidence reconciliation | reconcile `golden-apps/deployment-release-board.summary.json` (`visual.pass=false`, three blocking issues) with the README status table and golden-app notes | No golden app is listed as visual-pass when its summary fails; partial / blocked rows are explicit |
| P0 | Visual audit screenshot-level upgrade | promote visual audit from rule-checklist to screenshot diff against `src/app/cases/*` and `src/app/templates/*` reference frames | Visual gate produces per-route screenshot evidence; blocks promotion when DataTable rows, dashboard variants, or AppLayout chrome diverge from the in-repo showcase |
| P1 | Review packet mechanism | `REVIEW-PACKET-CHECKLIST.md` | Every fresh run can be reviewed from one packet, not scattered reports |
| P1 | ForgeUI gap ledger | `FORGEUI-GAPS.md` | Missing primitives are tracked instead of hand-rolled in generated apps |
| P1 | A-tier repo-intake batch 1 | 5-10 repo artifacts | Only IA, page pattern, workflow, and ForgeUI gap are retained |
| P1 | A-tier repo-intake continuing batches | 5-10 repo artifacts per batch | Every 2-3 pattern updates are followed by fresh PRD screenshot validation |
| P2 | Product-quality regression fixtures | bad brief / missing component_plan / route uncovered fixtures | Regression proves completion blockers stay active |

## Non-Goals

- Do not build a separate visual SaaS editor.
- Do not compete on generic landing-page generation.
- Do not full-clone, install, or deeply analyze hundreds of OSS repositories.
- Do not commit temporary generated demos unless explicitly promoted into fixtures or golden apps.

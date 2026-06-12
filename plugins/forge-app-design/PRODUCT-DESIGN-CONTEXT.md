# Product Design Context

Use this as the local context source for Codex-native prototype design work around `forge-app-design`.

## Operating Model

- Product Design owns page content, business workflow, interaction exploration,
  field modeling, and layout direction.
- ForgeUI owns base visual quality: tokens, typography, density, radius,
  component states, and adaptive composition.
- `forge-app-design` is the downstream Forge context provider, guardrail
  reviewer, implementation helper, and pattern/gap curator. It should not force
  a single PageHeader + Filter + Card + Table template across domains.
- Generated business layouts may diverge when the domain needs it, but they
  must keep ForgeUI primitives, token discipline, responsive card/grid
  behavior, and the acceptance chain below.
- Detailed chain contract:
  `references/product-design-forge-starter-chain.md`.

## Design System

- Primary implementation target: Forge admin apps using `@forge-ui-official/core`.
- Ground truth examples live in `$FORGE_REPO/src/app/cases`.
- Generated apps must prefer Forge primitives such as `SurfaceCard`, `DataTable`, `TaskCard`, `ProgressBar`, `Label`, `Avatar`, `FileCard`, `HistoryItem`, `Button`, `ButtonGroup`, and `StyledLink`.

## Visual Baseline

- Protask/Readdy-inspired management-system density is the quality target for admin prototypes.
- Local Protask CRM reference screenshots are under `/Users/hesong/Downloads/protask-figma/crm`.
- The target feel is restrained operational software: grey content shell, compact white panels, subtle borders, dense but readable tables, visible workflow actions, and no marketing hero treatment.
- Visual constraints should be responsive and token-driven. Prefer density
  outcomes, truncation strategy, compact variants, and `minmax` / `clamp`
  layout constraints over hard-coded component sizes.
- Forge card-family components should fill parent grid/flex columns by default.
  Use `width="fixed"` only for component showcase pages, not production-like
  admin prototypes.
- Parent layouts own width. If cards show unnatural gaps, fix the grid/flex
  tracks and alignment; do not hard-code card widths.
- First-pass Design DNA lives in `references/design-dna-lite.md`. Read it
  before generating or repairing screenshots; it is the lightweight rule source
  for typography, spacing, surfaces, filters, tables, details, action pages,
  dashboard composition, and mock data quality.

## Generation Semantics

- Component semantics live in `references/component-registry.json`.
  Generated apps should choose ForgeUI components by purpose, not by visual
  similarity alone.
- Field-to-component mapping lives in
  `references/field-component-rules-lite.md`. Apply it after extracting
  entities and fields, before writing list/detail/action code.
- Block selection lives in `references/block-catalog-lite.json`. Select a block
  by page role and intent before composing JSX.

## Promoted Patterns

- `dashboard-control-tower-protask`: compact KPI row, trend/risk/readiness visual, priority work, activity stream, workflow entry.
- `rich-entity-list-protask`: compact filters, first-viewport table rows, row identity, owner, risk/SLA, evidence, row action.
- `split-pane-triage-protask`: evidence, root cause, impact, history/audit, resolution, and next workflow link.
- `action-form-protask`: grouped form plus right status/preflight rail with save feedback.
- `kanban-workflow-protask`: status lanes, actionable cards, lane counts, empty states, progress/status signal, diagnostic/detail link, and local action feedback.

## Repo-Intake Pipeline

- 400+ open-source admin/product repos are a long-range evidence source.
- Process only A-tier batches of 5-10 repos at a time.
- Extract IA artifact, page pattern, business workflow, and ForgeUI gap only.
- Do not keep clones, full source snapshots, package installs, or generated
  screenshots from intake probes.
- Use every 2-3 pattern updates to trigger a fresh PRD validation run.
- Current local artifact batches: `intake/a-tier-batch-001`,
  `intake/a-tier-batch-002`, `intake/a-tier-batch-003`, and
  `intake/a-tier-batch-004`.

## Starter Validation

- Canonical starter source for future validation:
  `https://github.com/forge-ui/forge-starter`.
- Fresh validation should use a new local directory, not an old hand-polished
  demo. The starter must consume the latest published npm package for
  `@forge-ui-official/core` when proving a release; a local tarball is allowed
  only for pre-publish validation and must be called out as such.
- Validate starter runs with `pnpm typecheck`, `pnpm build`, and screenshots at
  common desktop width plus a wide desktop width when a right rail is expected.
- `golden-apps/gym-member-admin.md` records a clean Forge starter validation:
  Product Design produced the business/layout direction, Forge starter/core
  carried the visual baseline, and `forge-app-design` was intentionally not
  used.
- Conclusion: keep the chain short at runtime. Product Design should freely
  design the admin product within Forge constraints; ForgeUI should provide the
  visual primitives; `forge-app-design` should supply context, handoff rules,
  audits, and pattern/gap feedback rather than over-prescribing page templates.
- Latest fresh starter evidence:
  `golden-apps/fresh-starter-pharmacy-ops.md` validates the compact core
  defaults with a pharmacy refill operations dashboard consuming the published
  npm package `@forge-ui-official/core@0.1.4`.

## Acceptance Chain

Fresh evidence runs must include:

- `next build`
- `quality-eval`
- `browser-validate`
- `product-quality-audit`
- `protask-visual-audit` for medium-complex Forge admin prototypes

`DESIGN-BRIEF.md` must contain one Page Intent Spec per implemented route. `briefSpecs=0` is a blocker.

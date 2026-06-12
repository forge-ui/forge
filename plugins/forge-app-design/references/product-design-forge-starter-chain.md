# Product Design -> Forge Starter -> ForgeUI Chain

Status: active reference
Date: 2026-06-12

## Purpose

Keep the Codex prototype chain short enough to work:

1. Product Design explores the product and screen intent.
2. Forge starter provides the clean implementation workspace.
3. ForgeUI core supplies the visual system and component primitives.
4. `forge-app-design` supplies Forge-specific context, registry, patterns,
   audits, and feedback loops.

`forge-app-design` is not a second product designer. It should not freeze every
admin app into one template. Its job is to make Forge choices explicit and to
prevent generated pages from drifting away from Forge/Protask density.

## Stage Ownership

| Stage | Owner | Output |
|---|---|---|
| Product brief and target user | Product Design | product summary, operator role, workflow goal |
| IA and page intent | Product Design with Forge context | route map and one Page Intent Spec per route |
| Visual direction | Product Design | density, hierarchy, first-viewport priority, reference notes |
| Implementation workspace | Forge starter | clean Next app consuming `@forge-ui-official/core` |
| Component selection | ForgeUI registry + Codex | Forge primitives mapped to fields, blocks, and route roles |
| Acceptance | forge-app-design | build/typecheck, browser screenshots, product-quality, visual audit |
| Feedback | forge-app-design | registry/DNA/page-pattern/audit updates plus ForgeUI gaps |

## Required Handoff

A Product Design handoff is usable by Forge starter only when it includes:

- product name, domain, operator role, and primary job to be done;
- `IA-ROUTE-MAP.json` or an equivalent route-role table;
- one Page Intent Spec per implemented route;
- `component_plan` for every Page Intent Spec;
- first-viewport priority for each route;
- visual direction anchored to admin/product software, not a marketing page.

If no handoff exists, Codex should ask Product Design to produce the brief and
visual direction before writing the Forge app. If the user explicitly skips
Product Design, create a minimal Forge-generated handoff and label it as such.

## Forge Starter Rules

- Start from a fresh clone of `https://github.com/forge-ui/forge-starter` for
  release validation.
- Consume the latest published `@forge-ui-official/core` package for final
  release proof; local tarballs are only pre-publish evidence.
- Do not reuse old hand-polished demos as proof of natural output.
- Keep the generated page in normal starter routes so `pnpm typecheck`,
  `pnpm build`, and browser screenshots prove the real consuming path.

## ForgeUI Rules

- Core components own typography, radius, border, density, and adaptive width.
- Page code owns business content, parent grid/flex tracks, and route-specific
  workflow composition.
- Component widths should be parent-driven. Use fixed width only for component
  showcases or overlays with an explicit interaction reason.
- If a fresh starter page needs custom CSS to fight ForgeUI defaults, record the
  issue as a core or registry gap instead of baking the workaround into one demo.

## Acceptance

The chain is accepted only when:

- Product Design or a minimal labeled substitute produced Page Intent Specs.
- Forge starter uses ForgeUI primitives rather than custom Button/Table/Card
  shells.
- Screenshots show acceptable first-viewport hierarchy and density.
- `core:typecheck`, `core:build`, `core:audit`, and `forge-app-design:validate`
  pass in the Forge repo.
- The starter app passes `pnpm typecheck` and `pnpm build`.
- Findings are fed back into component registry, design DNA, page patterns, or
  audit rules.

## Current Evidence

- `golden-apps/gym-member-admin.md`: clean starter validation proving the
  Product Design + Forge starter approach can produce acceptable basic UI when
  `forge-app-design` does not over-prescribe the layout.
- `golden-apps/fresh-starter-pharmacy-ops.md`: pre-publish validation proving
  compact core defaults improve a fresh starter dashboard before npm release.

## Anti-Patterns

- Do not place `forge-app-design` inside Product Design or edit curated Product
  Design plugin files.
- Do not ask Product Design to write final Forge code.
- Do not let Forge starter drift into a separate component library.
- Do not treat a local tarball validation as final npm consumption proof.
- Do not declare completion from build/browser pass without Page Intent Specs
  and product-quality coverage.

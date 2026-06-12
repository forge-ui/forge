# Forge App Design P0-P5 Execution - 2026-06-12

Status: active - P0/P1/P2/P5 infrastructure closed; P3/P4 long-range evidence remains
Owner: Codex
Last updated: 2026-06-12 13:05 CST

## North Star

Make `forge-app-design` the Forge ecosystem skill for Codex-native admin
prototype design and implementation. Product Design may explore product and
interaction directions, while Forge App Design must turn that intent into a
Forge starter app using ForgeUI, a single component registry, page patterns,
precedent examples, and objective acceptance gates.

## P0 - Release Consumption And Registry Foundation

- [x] Publish `@forge-ui-official/core@0.1.3`.
- [x] Verify a clean starter can consume `@forge-ui-official/core@0.1.3` from npm, not workspace links.
- [x] Establish `plugins/forge-app-design/references/component-registry.json` as the single ForgeUI component registry.
- [x] Keep `component-registry-lite.json` as a compatibility mirror or pointer until all skill references migrate.
- [x] Add `plugins/forge-app-design/eval/validate-component-registry.mjs`.
- [x] Gate registry drift against `core/src/components/ui/index.ts` and `core/src/components/layouts/index.ts`.
- [x] Require every registry component to declare category, import path, responsive behavior, recommended uses, avoid cases, and constraints.

## P1 - Skill Workflow And Precedent Intake

- [x] Update skill docs to read `component-registry.json` before component selection.
- [x] Add an example project intake mechanism for already-written sample projects.
- [x] Store precedent metadata: source path, domain, page roles, screenshots, component combinations, reusable lessons, and anti-patterns.
- [x] Make fresh runs choose relevant precedent before writing IA, Page Intent Specs, and JSX.
- [x] Update Product Design context so it asks for ForgeUI as a design constraint without forcing a fixed layout template.

## P2 - Starter As The Standard Verification Harness

- [x] Decide and document the canonical local starter path.
- [x] Update starter dependencies to consume latest published ForgeUI core if needed.
- [x] Build starter with latest npm core.
- [x] Commit starter update separately if the starter repo has Git metadata.
- [x] Use starter, not old demo output, for future fresh-run validation.

## P3 - Promoted Pattern Completion

- [ ] Promote `kanban-workflow-protask` with independent fresh PRD screenshot acceptance.
- [x] Ensure workflow/kanban is no longer counted as complete when it is only a supporting route.
- [x] Add screenshot acceptance requirements for dashboard/list/detail/action/workflow separately.
- [x] Keep product-quality-audit as final gate with `briefSpecs > 0` and route coverage.

## P4 - Repo Intake And ForgeUI Gaps

- [x] Continue A-tier repo intake in batches of 5-10 projects.
- [x] Extract only IA artifact, page pattern, business workflow, and ForgeUI gap.
- [x] Do not clone/install/analyze 400 repos in bulk.
- [x] Delete temporary clones after each intake batch, keeping only artifacts.
- [ ] After every 2-3 promoted patterns, run a fresh PRD validation.

## P5 - Release Operations And Long-Term Quality

- [x] Resolve semantic alias warnings in core audit, or document the intentional token alias.
- [x] Add a repeatable release checklist for core npm publishes.
- [x] Prefer npm trusted publishing for long-term release automation.
- [x] Keep tokens out of repo and avoid global npmrc writes.
- [x] Add periodic drift checks between ForgeUI core exports, component registry, samples, and starter.

## Current Rule

Do not hand-score old demos. New quality claims must come from fresh generation
or a clean starter consuming the published npm package.

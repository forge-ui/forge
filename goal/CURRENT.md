# Forge App Design Current Goal

Status: active
Owner: Codex
Last updated: 2026-06-12 16:40 CST

## Final Goal

Make ForgeUI core, `forge-app-design`, Product Design handoff, and Forge starter
work together so Codex can naturally generate Forge admin prototypes that are
close to Protask/Forge original implementation quality in typography, density,
spacing, border, profile area, table first viewport, and right rail behavior.

## Non-Stop Task List

These are not optional follow-ups. Do not close the goal until all five are
done with evidence.

| ID | Task | Status | Evidence Required |
|---|---|---|---|
| T1 | Full core component visual audit and fixes | Done | `core-visual-audit-2026-06-12.md`, compact core defaults, `core:audit`, `core:typecheck`, `core:build`, npm `@forge-ui-official/core@0.1.4` |
| T2 | Clean starter fresh validation | Done | Fresh starter at `/Users/hesong/Desktop/forge-starter-fresh-validation-20260612-v2`, npm `0.1.4`, typecheck/build, screenshots at 1440/1680 |
| T3 | Feed findings back into forge-app-design | Done | Updated registry/DNA/baseline/page-pattern/block-catalog/audit rules, `forge-app-design:validate` |
| T4 | Product Design + Forge Starter chain | Done | `references/product-design-forge-starter-chain.md`, updated handoff/context docs, npm starter evidence |
| T5 | A-tier repo intake for product depth | Done | `intake/a-tier-batch-004`: 8 repo artifacts covering IA, page pattern, workflow, ForgeUI gaps |

## Current Execution Order

1. Run final repo validation after doc/evidence updates.
2. Apply Claude read-only review feedback if it finds blockers.
3. Commit and push Forge repo changes.
4. Commit and push Forge starter npm `0.1.4` validation update if accepted as starter baseline.

## Guardrail

Do not declare completion from npm publish, build, browser pass, or visual score
alone. Completion requires the five tasks above to be checked with evidence.

# Forge App Design Small Goal - 2026-06-11

Status: completed, except commit/npm publish pending explicit confirmation.

## Scope

1. Record the accepted gym member admin starter validation.
2. Fold core/starter adaptive-width findings into `forge-app-design` rules.
3. Start the next A-tier repo-intake artifact batch.
4. Prepare the modified Forge core for commit and npm publish.

## Done

- Added `plugins/forge-app-design/golden-apps/gym-member-admin.md`.
- Copied four validation screenshots under
  `plugins/forge-app-design/golden-apps/screenshots/gym-member-admin/`.
- Updated Product Design context, handoff contract, Protask/Forge visual
  baseline, `build-forge-app`, roadmap, and handoff notes with the
  Product Design + Forge starter operating model.
- Added an adaptive-width gate in
  `plugins/forge-app-design/eval/protask-visual-audit.mjs` for fixed
  component widths such as `width="fixed"` and `w-64` / `w-80` / `w-96`.
- Added `plugins/forge-app-design/intake/a-tier-batch-003` with eight
  artifact-level repo notes.

## Validation

- `node plugins/forge-app-design/eval/golden-summary-validate.mjs`: pass.
- `node plugins/forge-app-design/eval/run-regression.mjs --skip-build`: pass.
- `node plugins/forge-app-design/eval/ia-artifact-validate.mjs`: pass.
- `node plugins/forge-app-design/eval/kanban-pattern-audit.mjs`: pass.
- `pnpm -s core:audit`: pass with 17 existing semantic-alias warnings.
- `pnpm -s core:typecheck`: pass.
- `pnpm -s core:build`: pass.
- `pnpm -s typecheck`: pass.
- `pnpm -s build`: pass.
- `npm pack --dry-run` in `core`: pass.

## Pending Confirmation

- Bump `@forge-ui-official/core` from `0.1.1` to a publishable version,
  likely `0.1.2`.
- Stage and commit the intended core/plugin scope.
- Publish `@forge-ui-official/core` to npm.

Current npm auth check:

- `npm whoami`: failed with `E401 Unauthorized`, so publish will require
  logging in or providing a valid npm auth token before running `npm publish`.

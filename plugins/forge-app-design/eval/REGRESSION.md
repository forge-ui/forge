# PRD Regression Harness

This harness protects `forge-app-design` skill changes against regressions in
representative generated projects without depending on one developer's local
output folders.

## Default Smoke

`regression-cases.json` is intentionally portable. It points at the repo-owned
fixture root:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/run-regression.mjs --skip-build
```

By default, `${FORGE_DEMO_ROOT}` resolves to:

```text
$FORGE_APP_DESIGN_ROOT/eval/fixtures
```

The default `smoke-clean-app` case checks that `quality-eval` still runs cleanly
against a minimal ForgeUI page and that basic source invariants still work.

## Full Benchmark

Historical generated apps live in `regression-cases.full.json`. Run them only
when the benchmark corpus is available:

```bash
FORGE_DEMO_ROOT=/path/to/generated-corpus \
  node $FORGE_APP_DESIGN_ROOT/eval/run-regression.mjs \
  --config $FORGE_APP_DESIGN_ROOT/eval/regression-cases.full.json \
  --skip-build
```

Full benchmark cases include:

| ID | Output key | Purpose |
|---|---|---|
| `c5-ticket-system` | `ticket-system-v1` | Legacy ticket / SLA / escalation workflow baseline |
| `c6-data-quality-v4` | `data-quality-mon-v4-brief` | Product Design Brief + component split + workflow baseline |
| `c7-fulfillment-ops` | `fulfillment-ops-c7-codex` | Pattern pack migration baseline |
| `c12-prior-auth-ops-forgeui-first` | `prior-auth-ops-c12-protask` | ForgeUI-first Protask benchmark candidate |
| `c13-deployment-release-board-kanban` | `deployment-release-board-codex` | Promoted kanban/workflow board-first PRD |

These cases are marked `allowMissing: true`, so a machine without the corpus
will report them as skipped instead of failing the portable plugin smoke.

## Browser Cases

`browser-cases.json` uses `${FORGE_BROWSER_DEMO_ROOT}`. If unset, it falls back
to `${FORGE_DEMO_ROOT}`, then to the fixture root. Generated browser targets
must already have `node_modules` and `.next` unless `--no-start-server` is used.

```bash
FORGE_BROWSER_DEMO_ROOT=/path/to/generated-corpus \
  node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs
```

The browser validator uses `process.execPath` by default. Override only when
needed:

```bash
FORGE_NODE_BIN=/path/to/node \
FORGE_RUNTIME_NODE_MODULES=/path/to/node_modules \
  node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs
```

`FORGE_RUNTIME_NODE_MODULES` is only needed when Playwright is not resolvable
from the current Node environment.

Promoted kanban evidence is covered by C13. The `/deployments` route must keep
first-viewport visible checks for a lane title, direct `Advance` action, and
`Open diagnostics` link.

## Output

The harness writes:

- `regression-report.json`
- `regression-report.md`

Each case combines:

- `quality-eval` summary and failed checks
- required files
- minimum page/component file counts
- required text patterns that prove workflow / component-plan survival
- score from 0 to 100

## Policy

- Default regression must stay portable and should use repo-owned fixtures.
- Current baselines should target `0 critical / 0 warn`.
- Historical corpora should live in full benchmark configs and use env-based
  roots, not absolute developer-machine paths.
- Missing full-benchmark targets may be skipped only when the case explicitly
  sets `allowMissing: true`; fresh validation targets should not use that escape
  hatch.

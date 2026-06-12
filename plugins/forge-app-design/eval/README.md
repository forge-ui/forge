# quality-eval

Catches known forge admin generation issues before showing the user.
Designed to be called from `SKILL.md` step 6 after `Write` phase completes.

## Usage

```bash
node $FORGE_APP_DESIGN_ROOT/eval/quality-eval.mjs --target <project-dir>
```

Flags:
- `--skip-build` — skip L3 next build (faster, useful when iterating L1/L2)
- `--report-dir <dir>` — write `quality-report.*` outside the target app; use `/private/tmp/...` in restricted Codex runs
- `--strict-ia` — require and validate `<target>/IA-ROUTE-MAP.json`
- `--json` — emit full report to stdout (for piping into repair loop)

Exit code: `0` if `critical === 0`, else `1`.
Reports are written to `<target>/quality-report.json` and `<target>/quality-report.md`
unless `--report-dir` is provided.

## IA gate

New IA-first generations should run:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/quality-eval.mjs --target <project-dir> --strict-ia
```

The IA gate validates `IA-ROUTE-MAP.json`:
- every page has `route`, `primaryVerb`, `lifecycle`, `decisionQuestion`,
  `primaryDataObject`, `surfaceRole`, and `linksOut`
- `surfaceRole` is one of `navigation`, `action`, or `detail`
- action/detail routes have `parentRoute` plus `entryAffordance`, and their
  parent is a navigation page
- action-like routes such as `/new`, `/create`, `/edit`, `/import`, `/export`,
  and `/bulk` are not marked as navigation
- AppLayout sidebar contains navigation routes only
- leaf routes do not hide behind `workspace`, `center`, `hub`, `console`, or
  `all-in-one`
- one page does not own write/admin actions across multiple unrelated lifecycle
  stages
- implemented app routes are covered by the IA map
- `linksOut` points to known routes and non-terminal pages link onward

Without `--strict-ia`, this gate is backward-compatible: it only runs when
`IA-ROUTE-MAP.json` exists.

## IA artifact validation

Run this after changing `samples/ia/*.json`, `samples/page-patterns/*.json`, or
the IA gate:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/ia-artifact-validate.mjs
```

The validator checks repo-owned IA/page-pattern sample pairs and runs the IA gate
against a synthetic app route tree. It should stay at `0 issues`; warnings in
sample links are treated as sample drift and should be fixed before using the
artifact as a worker reference.

## Component registry validation

Run this after changing ForgeUI component exports, component registry semantics,
or generation priority:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/validate-component-registry.mjs
```

The validator treats `references/component-registry.json` as the source of
truth, requires `component-registry-lite.json` to remain an exact compatibility
mirror, checks required component semantics, and rejects registry entries that
do not exist in the Forge core export indexes.

Core exports that are not approved for direct page generation must be listed in
`exportCoverage.deferredExports`. A new ForgeUI export fails validation until it
is either promoted into `components` with generation semantics or explicitly
deferred with a reason.

## Core visual baseline audit

Run this after changing ForgeUI core defaults that can affect generated admin
page density:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/core-visual-baseline-audit.mjs
```

The audit is intentionally narrower than `core/scripts/audit-components.mjs`.
It guards the component defaults that directly shape generated business pages:

- `AppLayout` content padding/gap must stay compact.
- `PageTitleToolbar` must use admin H1 scale, not display/hero scale.
- `ListGroup`, `NotificationItem`, `FilterPanel`, and `DataTable` routine
  titles/chrome must stay close to Forge/Protask rail/table density.
- Large value typography, overlay widgets, logo text, chart center labels, and
  explicit showcase fixed-width maps are intentionally out of scope.

This audit is part of `pnpm forge-app-design:validate`.

## Example project intake

Use this to turn a local example project into a lightweight precedent artifact:

```bash
node $FORGE_APP_DESIGN_ROOT/scripts/example-project-intake.mjs --source <project-dir> --id <slug> --domain <domain>
```

The output lives under `precedents/<slug>/metadata.json` and updates
`precedents/index.json`. It records route roles, Forge component usage,
screenshots, reusable lessons, and anti-patterns without copying the full source
tree.

## Product-quality audit

Run this after `quality-eval` and browser validation when a generated app is being
used as evidence for readdy-level product quality:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/product-quality-audit.mjs --target <project-dir>
```

The audit scores repeatable non-engineering signals:
- Product Design Brief completeness and layout diversity
- component split and page length
- business-depth concepts such as root cause, impact scope, similar entities, evidence, and history
- workflow links, local state, and action feedback
- clean `quality-eval` plus browser screenshot coverage

By default, the audit reads `<target>/browser-report.json`. Pass
`--browser-report <path>` only when the browser evidence lives elsewhere.

Reports are written to `<target>/product-quality-report.json` and
`<target>/product-quality-report.md`.

`briefSpecs=0` is a hard failure. A generated app must not be declared complete
unless every implemented page route has a Page Intent Spec with
`user_goal`, `primary_decision`, `primary_action`, `secondary_context`, and
`component_plan`.

This is a machine pre-score only; final `80+` still requires user acceptance.

## Protask visual-density audit

Run this after `quality-eval`, browser validation, and product-quality audit when
a medium-complex app is being compared against Protask/Readdy:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/protask-visual-audit.mjs --target <project-dir>
```

The audit scores ForgeUI-first usage plus dashboard/list/detail/workflow visual
density. It catches the failure mode where an app is correct and componentized
but still too sparse for the benchmark.

By default, the audit reads `<target>/browser-report.json`. Pass
`--browser-report <path>` only when the browser evidence lives elsewhere.

Reports are written to `<target>/protask-visual-report.json` and
`<target>/protask-visual-report.md`.

This is also a machine pre-score only; final `80+` still requires user acceptance.

## Kanban pattern audit

Run this after changing `kanban-workflow-protask` samples, IA artifacts,
page-pattern artifacts, browser cases, or kanban anti-pattern fixtures:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/kanban-pattern-audit.mjs
```

The audit verifies that `kanban-workflow-protask` is treated as a promoted
pattern, not a supporting board route. It checks canonical sample ownership,
Page Intent Spec fields, first-viewport visible-text requirements, IA
anti-patterns, and the read-only/table-shaped bad fixtures.

## Review packet

After the machine gates pass, render a compact handoff packet:

```bash
node $FORGE_APP_DESIGN_ROOT/scripts/render-review-packet.mjs --target <project-dir>
```

The packet summarizes route model, brief coverage, quality/browser/product/visual
reports, screenshot evidence, blocking issues, and promoted-pattern status. It
does not rerun gates; rerun `quality-eval`, browser validation, product-quality
audit, and Protask visual audit first.

## Goal completion check

Run this when deciding whether the active v1 goal can be closed:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/goal-completion-check.mjs
```

Default mode verifies all objective evidence and reports whether final user
acceptance is still pending. It exits 0 when objective evidence is ready for
human acceptance. Objective evidence includes engineering regression, browser
validation, product-quality audit, Protask visual-density audit, and the C12
acceptance review package.

Use `--report-dir <dir>` to write `goal-completion-report.*` outside the
installed skill directory in restricted Codex runs.

The acceptance review package check verifies:
- `USER-ACCEPTANCE-PACKET.md`, `USER-ACCEPTANCE-GALLERY.html`, and `USER-ACCEPTANCE.example.json` exist
- the packet and gallery do not reference stale C11 screenshots or old manual scores
- all seven `C12-*.png` screenshots are present and referenced
- `/cases` browser report has visible `Preview` / `Triage` row-action assertions

The goal check also verifies freshness for key machine reports:
- `regression-report.json` must be newer than regression config, eval scripts, and C12 source inputs
- `browser-report.json` must be newer than browser config, browser validator, and C12 source inputs
- `product-quality-report.json` and `protask-visual-report.json` must be newer than the latest C12 `quality-report.json` and browser report

Strict mode requires a user acceptance file as well:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/goal-completion-check.mjs --strict
```

Recommended way to record human acceptance after review:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/record-user-acceptance.mjs --score 85 --yes --note "User reviewed C12 and accepts v1."
node $FORGE_APP_DESIGN_ROOT/eval/goal-completion-check.mjs --strict
```

The recorder writes the acceptance file to the C12 output directory and binds it
to `prior-auth-ops-c12-protask`, the C12 review packet, the C12 gallery, and the
active v1 goal. `goal-completion-check.mjs --strict` rejects acceptance files
that only contain a score without this binding.

After human review, create
`/Users/hesong/Desktop/output/prior-auth-ops-c12-protask/USER-ACCEPTANCE.json`:

```json
{
  "accepted": true,
  "score": 80,
  "note": "User reviewed C12 and accepts v1.",
  "target": "/Users/hesong/Desktop/output/prior-auth-ops-c12-protask",
  "artifact": "prior-auth-ops-c12-protask",
  "reviewPacket": "/Users/hesong/Desktop/output/prior-auth-ops-c12-protask/USER-ACCEPTANCE-PACKET.md",
  "reviewGallery": "/Users/hesong/Desktop/output/prior-auth-ops-c12-protask/USER-ACCEPTANCE-GALLERY.html",
  "goal": "forge-app-design readdy.ai-level generation v1"
}
```

Template:

```bash
/Users/hesong/Desktop/output/prior-auth-ops-c12-protask/USER-ACCEPTANCE.example.json
```

Reports are written to `goal-completion-report.json` and
`goal-completion-report.md`.

## Repair-loop validation

Run this after changing critical rules or repair hints:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/repair-loop-validate.mjs
```

The harness copies `fixtures/clean-app` to a temporary directory, injects known
repairable criticals, runs `quality-eval`, applies surgical repairs by rule name,
and re-runs until `critical=0` or the Step 6 retry budget is exhausted.

Current validation covers 9 source criticals:
- `wrong-forge-import`
- `empty-onclick`
- `pageheader-search-variant`
- `datatable-data-prop`
- `main-container-max-w`
- `statcard-bad-size`
- `statcard-label-prop`
- `statcard-numeric-value`
- `datatable-column-label`

Reports are written to `repair-loop-report.json` and `repair-loop-report.md`.

## PRD regression harness

Run this after changing `SKILL.md`, `scaffold.mjs`, Forge component API assumptions, or quality rules:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/run-regression.mjs
```

Fast source-only mode:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/run-regression.mjs --skip-build
```

Current baselines are configured in `regression-cases.json`:
- `c5-ticket-system`
- `c6-data-quality-v4`
- `c7-fulfillment-ops`
- `c12-prior-auth-ops-forgeui-first`

The C12 regression case includes the current Protask visual report plus the
acceptance packet/gallery/template, so stale C11 review artifacts and old manual
score expectations cannot silently pass.

Reports are written to `regression-report.json` and `regression-report.md`.
See `REGRESSION.md` for policy and case intent.

## Low-load browser validation

Run this after golden apps or regression targets already have a passing build:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs
```

Single-case mode:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs --case C8
```

Permission-safe mode for Codex runs:

```bash
node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs --report-dir /private/tmp/spec-to-forge-browser-report --screenshots-dir /private/tmp/spec-to-forge-browser-shots
```

Policy:
- uses `next start`, not `next dev`
- runs one app/server at a time
- supports multiple routes per case without restarting the server
- captures one viewport screenshot per route, not full-page screenshot batches
- stops the server before starting the next case

Current cases are configured in `browser-cases.json`:
- `C8` — data-quality golden dashboard
- `C9` — fulfillment ops waves board
- `C10` — support ticket queue
- `C12` — Protask-inspired prior authorization PRD app, 7 routes under one server

C12 `/cases` also uses `requiredVisibleText` for `Preview` / `Triage`, which checks that row actions are inside the desktop review viewport instead of merely present in DOM text.

Reports are written to `browser-report.json` and `browser-report.md`.
Single-case mode writes `browser-report.<CASE>.json` and
`browser-report.<CASE>.md` so a focused smoke check cannot overwrite the
canonical C8/C9/C10/C12 report used by the goal completion gate.
Use `--report-dir` and `--screenshots-dir` to keep focused or sandboxed checks
out of the installed skill directory.
Screenshots are written to `browser-screenshots/`.

## Three levels

| Level | Method | Examples |
|---|---|---|
| L1 grep | source-text patterns | `PLACEHOLDER`, wrong import, empty `onClick={() => {}}`, raw JSX `->` text, raw app `<button>`, handrolled visual primitive, gradient text / marketing copy slop |
| L2 narrow | enhanced regex on JSX (no AST dep) | `StatusBadge` children, `ProgressStatCard.progress=`, `StatCard label=`, `DataTable columns[].label` |
| L3 build | `./node_modules/.bin/next build` | catches type errors / missing exports |

## Verify the harness itself

```bash
cd $FORGE_APP_DESIGN_ROOT/eval
for d in fixtures/*/; do
  echo "=== $d ==="
  node quality-eval.mjs --target "$d" --skip-build
done
```

Expected:
- `clean-app` — `0 critical`
- critical `bad-*` fixtures — at least 1 critical matching the fixture's named bug
- warn-only `bad-*` fixtures — at least 1 warn matching the fixture's named bug
- current source checks: 34 (`23 L1 + 11 L2`; L3 build adds one more check when not skipped)

## Adding a rule

1. Pick the level (`l1-grep.mjs` if pure pattern; `l2-ast.mjs` if it needs JSX context)
2. Add an entry to the `RULES` array — set `pattern` *or* `custom(content)`, plus `status` (`critical` | `warn`)
3. Add a fixture `fixtures/bad-<rule-name>/app/page.tsx` triggering exactly that rule
4. Add the fixture to `clean-app` regression check (it must still pass after the new rule lands)

## Don't add (for now)

- AST-based analysis — defer until rule count >20 or scope analysis required
- Solar icon d.ts validation — separate concern, not bundled here
- Suppression comment syntax — keep rule count low, no escape hatches in v0

See `../CODEX-PROTOTYPE-DESIGN-ROADMAP.md` for product direction context.

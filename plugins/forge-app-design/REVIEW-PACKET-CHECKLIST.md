# Review Packet Checklist

Use this checklist before calling a fresh prototype complete.

## Required Files

- `IA-ROUTE-MAP.json`
- `PAGE-PATTERN-MATCH.json`
- `DESIGN-BRIEF.md`
- `quality-report.json`
- `browser-report.json`
- `product-quality-report.json`
- `protask-visual-report.json` for medium-complex Protask-targeted apps
- route screenshots under `screenshots/`

## Required Summary

- Route model: dashboard, list, detail, action/workflow.
- Page Intent Spec coverage: `briefSpecs` and implemented route coverage.
- Build and quality summary.
- Browser route and screenshot summary.
- Product-quality score and blocking issues.
- Visual audit score and blocking issues when applicable.
- Promoted pattern status: which pages are covered by promoted patterns, and which are only supporting routes.
- Known ForgeUI gaps.

## Completion Rule

Do not say "complete" when:

- `quality-eval` has critical or warning findings.
- Browser validation did not pass or screenshots are missing.
- `product-quality-audit` failed.
- `briefSpecs=0`.
- A page has no Page Intent Spec.
- A required pattern is only a supporting route.
- The run relies on `tmp/` output as if it were a committed fixture or golden app.

## Consistency Gate (cross-report)

Before claiming completion or promotion, verify that all of these tell the
SAME story:

- README / packet summary
- `quality-report.json`
- `product-quality-report.json`
- `protask-visual-report.json` (when applicable)
- `browser-report.json`

Block on any of these disagreements:

- README/summary calls the run a pass while any report has critical findings,
  `pass: false`, or non-empty `blockingIssues` / `visualBlockingIssues`.
- Visual report has `visual.pass=false` or non-empty `visualBlockingIssues`,
  yet the summary writes "visual pass" or omits the visual section.
- Browser report shows missing screenshots, console errors, or route failures
  that the summary does not mention.
- Product-quality report flags missing patterns or composition defects that
  the summary glosses over.

If reports disagree, fix the underlying artifact (regenerate, rerun audits,
or update the summary to match) — do not paper over by editing the summary
alone.

## Forge Composition Gate

Before promotion, sweep the generated app for the composition defects that
[`references/forge-composition-dna.md`](references/forge-composition-dna.md)
calls out:

- **DataTable columns**: every `columns[].render` must start from a
  `Cell*` primitive (`CellImageText`, `CellTextSubtitle`, `CellText`,
  `CellMuted`, `CellNumber`, `CellProgressValue`, `CellProgressBar`,
  `CellStatusDot`, `CellFile`, `CellCode`, `CellActions`, `CellKebabMenu`,
  `CellLink`, `StatusBadge`). Any raw `<div>` + `<Avatar>` + `<p>` /
  `<span>` / `<Label>` composition inside a column render is a blocker,
  unless an entry in `FORGEUI-GAPS.md` documents why no primitive fits.
- **Toolbars / filter strips**: every filter row must be composed from
  `Toolbar` + `ToolbarSearchInput` + `ToolbarSelectDropdown` +
  `ToolbarDatepicker` + `ToolbarPillTabs` + `ToolbarShowSelect`. Custom
  rounded shells around bare `<input>` / `<select>` are a blocker.
- **AppLayout shell**: no page re-implements sidebar / topbar / profile /
  breadcrumb in `page.tsx`.

A violation in any bucket above blocks both `complete` and `promotion`,
regardless of screenshot or quality-report status.

## Promotion Rule

Fresh output can be promoted to `golden-apps/` only when:

- The Consistency Gate above passes.
- The Forge Composition Gate above passes.
- `protask-visual-report.json` (when applicable) has `visual.pass=true` AND
  empty `visualBlockingIssues`. A `visual.pass=false` or any
  `visualBlockingIssues` entry MUST block promotion — never write "visual
  pass" in the summary while either is unresolved.
- A `<id>.summary.json` exists and passes `golden-summary-validate.mjs`.
- One representative screenshot is committed under `golden-apps/screenshots/<id>/`.
- The golden note references the summary and screenshot using relative paths.
- The diff contains no `tmp/` path and no copied `node_modules`, `.next`, reports directory, or full generated app.
- The promoted note says what to borrow and what not to copy.

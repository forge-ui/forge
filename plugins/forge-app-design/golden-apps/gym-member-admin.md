# Gym Member Admin Starter Validation

This is a starter validation note, not a promoted golden app.

- app: `/Users/hesong/Desktop/tmp/forge-gym-member-admin`
- starter: `/Users/hesong/Desktop/forge-starter-main 2`
- method: Product Design + clean Forge starter; `forge-app-design` was not used
- domain: Chinese gym membership / visits / classes / revenue admin
- review date: 2026-06-11

## Screenshots

- `screenshots/gym-member-admin/dashboard.png`
- `screenshots/gym-member-admin/members.png`
- `screenshots/gym-member-admin/member-detail.png`
- `screenshots/gym-member-admin/classes.png`

## Validation Notes

- `pnpm -s typecheck`: passed
- `pnpm -s build`: passed
- Human review: acceptable baseline, still below original Protask parity.

## What This Proves

- A clean Forge starter plus Product Design can produce a better baseline than
  over-constrained pattern generation when ForgeUI primitives carry the visual
  system.
- Product Design should own page content, domain workflow, field selection, and
  layout exploration.
- ForgeUI must own typography, color, radius, density, component states, and
  adaptive card/grid behavior.
- `forge-app-design` should provide Forge context, Page Intent handoff,
  component usage guardrails, visual/product audits, and reusable pattern/gap
  feedback. It should not force every list into one rigid template.

## Lessons To Fold Back

- Prefer parent-driven grids and `minmax` / `clamp` constraints. Do not set
  card-family components to fixed widths in production-like admin pages.
- Keep Chinese admin copy concrete and operational. Avoid abstract IA labels in
  the visible UI.
- Use AppLayout and Forge starter chrome as the baseline; do not rebuild the
  profile/team/header area.
- Page layouts can diverge by domain, but the ForgeUI token and primitive layer
  must stay consistent.

## Not Promoted

This app does not have `quality-eval`, `browser-validate`,
`product-quality-audit`, or `protask-visual-audit` reports. Do not cite it as a
golden app. Use it as evidence for the Product Design + Forge starter operating
model and the adaptive-width baseline.

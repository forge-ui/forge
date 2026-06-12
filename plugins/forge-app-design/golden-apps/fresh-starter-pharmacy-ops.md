# Fresh Starter Validation - Pharmacy Refill Ops

Status: accepted as T2 npm package validation evidence
Date: 2026-06-12

## Purpose

Validate whether the updated ForgeUI core defaults naturally produce a denser
Forge/Protask-like admin page in a clean Forge starter, without reusing the
previous restaurant demo or manually polishing an old generated app.

## Setup

- Fresh directory:
  `/Users/hesong/Desktop/forge-starter-fresh-validation-20260612-v2`
- Starter source:
  shallow clone of `https://github.com/forge-ui/forge-starter.git`
- Core package under test:
  published npm package `@forge-ui-official/core@0.1.4`.
- Page implemented:
  Chinese pharmacy refill operations control tower at `/dashboard`.

## Screenshots

- `golden-apps/screenshots/fresh-starter-pharmacy-ops/dashboard-1440.png`
- `golden-apps/screenshots/fresh-starter-pharmacy-ops/dashboard-1680.png`

## Objective Visual Findings

| Area | Result |
|---|---|
| H1 / title scale | `PageTitleToolbar` now renders routine admin heading at a compact `text-2xl` scale rather than display scale. |
| Shell density | `AppLayout` content default no longer injects `p-6 gap-8`; the first viewport carries work instead of whitespace. |
| KPI row | Four `StatCard` components fill parent grid columns without fixed-width gaps. |
| Filter-to-table rhythm | Search/filter controls sit directly above the main queue; no large filter card pushes the table down. |
| Table first viewport | At 1440px width, the screenshot shows filters, table header, five queue rows, row actions, and pagination. |
| Table readability | Status and action columns were widened after screenshot inspection so labels no longer truncate into `断...` / `预...`. |
| Right rail | At 1680px width, the risk rail appears beside the table without crushing the main queue. |
| Rail typography | `ListGroup` and `NotificationItem` titles now read as compact rail/list text rather than headline text. |

## Validation Commands

In the fresh starter directory:

- `pnpm --config.verify-deps-before-run=false typecheck`: pass
- `pnpm --config.verify-deps-before-run=false build`: pass

The explicit `verify-deps-before-run=false` is needed only because this evidence
was collected immediately after publishing `@forge-ui-official/core@0.1.4`;
pnpm 11's default minimum release-age policy blocks newly published packages
inside its pre-run dependency verification. The lockfile and install resolve the
real npm package, and direct `tsc --noEmit` also passes.

In the Forge repo after T1 fixes:

- `pnpm forge-app-design:core-visual`: pass
- `pnpm core:audit`: pass with the existing 17 semantic alias warnings
- `pnpm core:typecheck`: pass
- `pnpm core:build`: pass
- `pnpm forge-app-design:validate`: pass

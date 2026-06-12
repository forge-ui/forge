# Forge Core Visual Audit - 2026-06-12

Status: T1 accepted
Scope: exported ForgeUI core components plus Forge App Design generation surfaces

## Objective

Find component-level defaults that make generated admin pages look too large,
too dark, too loose, or too fixed-width compared with Forge/Protask source
examples. Fix component defaults only when the root cause is reusable core
behavior; otherwise record the issue as composition guidance or an audit rule.

## Evidence Sources

- `core/src/components/ui/index.ts`
- `core/src/components/layouts/index.ts`
- `plugins/forge-app-design/references/component-registry.json`
- `plugins/forge-app-design/references/protask-forge-visual-baseline.md`
- `/Users/hesong/Downloads/protask-figma/crm`
- `/Users/hesong/Documents/gihub_space/forge/figma-code`

## P0/P1 Core Defaults Fixed

| Component | Classification | Change | Reason |
|---|---|---|---|
| `AppLayout` | `core-default` | Content area default changed from `p-6 gap-8` to `p-4 sm:p-5 gap-5`. | Generated pages using the shell inherited loose vertical rhythm before page code even started. |
| `PageTitleToolbar` | `core-default` | Title changed from `text-display-l` to `text-2xl`; subtitle from `text-base` to `text-sm`; horizontal gap from `gap-6` to `gap-4`. | Routine admin headers should not default to hero/display scale. |
| `ListGroup` | `core-default` | Title changed from `text-xl` to `text-sm`; subtitle to `text-xs`; padding/body rhythm reduced to `px-5 py-5 gap-4`. | Right rails and activity streams were visually heavier than table/list content. |
| `NotificationItem` | `core-default` | Title changed from `text-base` to `text-sm`; body changed from `text-fg-grey-800 text-sm` to `text-fg-grey-700 text-xs`. | Reusable notification/activity rows should stay compact in rails. |
| `FilterPanel` | `core-default` | Title changed from `text-base` to `text-sm`. | Filter panels are supporting controls, not major sections. |
| `DataTable` / `FullWidthTable` | `core-default` | Footer and full-width header/footer reduced from `p-6` to `p-5`. | Table first-viewport density should not be lost to table chrome. |
| `PageHeader` title variant | `core-default` | Title header changed from `px-6 py-5 gap-6 text-xl` to `px-5 py-4 gap-4 text-lg`. | Older AppLayout title headers should not reintroduce the oversized/loose rhythm that `PageTitleToolbar` fixed. |

## Accepted Large Or Fixed Defaults

These are intentionally not changed.

| Area | Reason |
|---|---|
| `StatCard`, `ProgressStatCard`, `BalanceCard`, `ProgressCard`, chart value rows | Large type is the primary numeric signal, not a routine section title. |
| `AppLayout` logo and `SidebarMenu` brand title | Brand mark is shell identity, not page content. |
| `ConfirmationDialog` title/body spacing | Modal confirmation hierarchy is not the same as dashboard/list density. |
| `NotificationPanel`, `CalendarPopup`, dropdown/popover internals | Overlay widgets intentionally own bounded width and local hierarchy. |
| `Avatar` size map, chart center labels, donut/pie visual labels | Visual primitives need their own size scale. |
| `resolveCardWidthClass(width, "...")` maps | Fixed widths remain allowed only as explicit showcase/legacy opt-in; generated admin pages must not pass `width="fixed"`. |

## New Audit Gate

Added `plugins/forge-app-design/eval/core-visual-baseline-audit.mjs`.

The gate currently fails when generation-facing core surfaces regress to:

- `PageTitleToolbar` using `text-display-l`, `text-base` subtitle, or `gap-6`.
- `AppLayout` content area defaulting to `p-6 gap-8`.
- `ListGroup`, `NotificationItem`, `FilterPanel`, or `DataTable` using oversized routine titles or loose table chrome.
- `PageHeader` title variant regressing to `px-6/gap-6/text-xl`.
- Generated admin surface title lines using `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, or `text-display-l` where only compact card/table/rail titles should appear.

The gate is wired into `pnpm forge-app-design:validate`.

## Validation

- `pnpm forge-app-design:core-visual`: pass, `0 issues / 0 warnings`.
- `pnpm core:typecheck`: pass.
- `pnpm core:build`: pass.
- `pnpm forge-app-design:validate`: pass.
- `@forge-ui-official/core@0.1.4`: published to npm and consumed by the fresh
  Forge starter validation.

## Next Evidence Needed

- Any remaining visual mismatch should be classified as `core-default`,
  `composition-guidance`, `audit-rule`, or `acceptable` before further changes.

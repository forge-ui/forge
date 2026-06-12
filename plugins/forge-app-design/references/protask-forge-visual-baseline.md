# Protask/Forge Visual Baseline

This baseline is derived from existing local screenshots and Forge source, not
from manual polishing of a demo.

## Evidence Reviewed

Reference screenshots:

- `/Users/hesong/Downloads/protask-figma/crm/Customer.png`
- `/Users/hesong/Downloads/protask-figma/crm/Leads.png`
- `/Users/hesong/Downloads/protask-figma/crm/Customer Details_Activity.png`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/screenshot/Full Width Table.png`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/screenshot/Filter.png`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/screenshot/dashboard/CRM.png`

Current generated screenshots reviewed:

- `/Users/hesong/Documents/gihub_space/forge/tmp/forge-app-design-output/vendor-compliance-typography-fresh/screenshots/vendor-compliance-typography-fresh-vendors-list.png`
- `/Users/hesong/Documents/gihub_space/forge/tmp/forge-app-design-output/deployment-release-board-codex/screenshots/deployment-release-board-codex-deployments.png`
- `/Users/hesong/Documents/gihub_space/forge/tmp/forge-app-design-output/deployment-release-board-codex/screenshots/deployment-release-board-codex-deployment-detail.png`
- `/Users/hesong/Documents/gihub_space/forge/tmp/forge-app-design-output/refund-dispute-recovery-fresh/screenshots/refund-dispute-recovery-fresh-disputes.png`
- `/Users/hesong/Documents/gihub_space/forge/plugins/forge-app-design/golden-apps/screenshots/gym-member-admin/dashboard.png`
- `/Users/hesong/Documents/gihub_space/forge/plugins/forge-app-design/golden-apps/screenshots/gym-member-admin/members.png`
- `/Users/hesong/Documents/gihub_space/forge/plugins/forge-app-design/golden-apps/screenshots/gym-member-admin/member-detail.png`
- `/Users/hesong/Documents/gihub_space/forge/plugins/forge-app-design/golden-apps/screenshots/gym-member-admin/classes.png`

Forge source anchors:

- `/Users/hesong/Documents/gihub_space/forge/core/src/components/layouts/app-layout.tsx`
- `/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/page-header.tsx`
- `/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/data-table.tsx`
- `/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx`
- `/Users/hesong/Documents/gihub_space/forge/core/scripts/audit-components.mjs`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/table.md`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/filter.md`
- `/Users/hesong/Documents/gihub_space/forge/figma-code/list.md`

## Objective Differences

| Area | Protask/Forge reference | Current generated output | Rule to encode |
|---|---|---|---|
| Typography | Admin page titles sit around `text-2xl`; table/list text is mostly `text-sm` with `text-xs` metadata. Forge source uses `text-sm leading-5` and `text-xs leading-4` heavily. | Generated pages mostly use `text-2xl` titles, but some sections still feel headline-like because content blocks are large and sparse. | Keep admin H1 at `text-2xl` or below; default row/card text must be `text-sm` plus `text-xs` metadata; forbid `text-display-l` and routine `text-3xl` page headings. |
| Density | `Customer.png` first viewport shows stats, filters, and about 10 table rows in the high-resolution export; normalized to a common desktop viewport, list pages should still show filters plus multiple meaningful rows or cards. | `vendor-compliance` list shows filters and about 4 visible rows in the desktop capture; kanban board shows only first lane row plus partial second row. | List/table pages must expose filters plus enough first-viewport row identities/actions for fast scanning; board pages must expose multiple lanes and actionable cards without vertical scrolling. |
| Page margins | Protask content is a grey shell with a constrained inner grid and compact vertical rhythm. Forge AppLayout owns the shell. | Generated pages use correct AppLayout shell, but `space-y-6`, `gap-6`, and stacked cards make first screens too loose. | Page roots should prefer `space-y-4`/`space-y-5`; reserve `space-y-6`, `gap-6`, and `p-6` for major dashboard panels only, not queue/board/detail defaults. |
| Borders | Protask/Forge cards use white surfaces, `rounded-card`/20px radius, and subtle `outline-fg-grey-200`; table dividers are light. | Some generated board/detail surfaces mix many bordered cards and one heavier dashed border, increasing card weight. | Use `SurfaceCard`, `DataTable`, and `outline outline-1 outline-offset-[-1px] outline-fg-grey-200`; avoid heavy grey borders except empty/drop states. |
| Filter controls | Protask filter row is one compact strip: search/date/filter/show controls in a single horizontal band sized by Forge control tokens. | Generated list filter strip is acceptable structurally, but the title/header above it consumes too much vertical priority. | List pages must keep filters as a single compact strip directly above the main queue; no large "filter card" above table. |
| Profile region | Protask/Forge topbar profile uses AppLayout/PageHeader: compact avatar, `text-sm` name, `text-xs` role, low visual priority. Team switcher is compact and secondary. | Generated apps use Forge AppLayout but profile/team labels are generic and visually compete with the app brand in some screenshots. | Use native `AppLayout` profile, `profilePosition="topbar"`, realistic person+role, and no custom topbar/profile rebuild. Team switcher copy should be specific but secondary. |
| Table first screen | Protask list table keeps row identity, status, amount/owner, and kebab/action visible with many rows. | Generated vendor list has good columns but row height is too tall because each row carries multi-line action/progress controls. | Rich list rows should cap to two text lines per identity cell and one compact action cluster; use `Button size="sm"` and metadata truncation to maintain 5+ visible rows. |
| Main table width | Protask/Forge list pages keep the table as the full-width primary surface at common desktop widths. Context appears as compact toolbar/inline stats, drawer, or a side rail only when the viewport is wide enough. | `refund-dispute-recovery-fresh` forced a right rail at `lg` with `minmax(12rem,14rem)`, leaving the table cramped and the rail unreadable. | `rich-entity-list-protask` side rails must not be forced at `lg`; collapse below, use a drawer, or defer side-by-side rails to `2xl` with adaptive `clamp`/`minmax` constraints. |
| Row actions | Forge table references use light row actions: icon cluster, kebab, one inline link, or one small command. | The rejected list stacks `Preview`, `Open detail`, and `Review` vertically in every row, creating button noise and height pressure. | A queue row may show at most one small primary command plus one compact link/icon/menu. Secondary workflow actions belong in the preview rail or detail page. |
| Table readability | Forge table cells use readable identity columns and concise metadata; truncation preserves meaning. | The rejected list combines `table-fixed`, narrow clamp widths, and a side rail, truncating core identity/evidence text into fragments. | Do not use `table-fixed` on rich operational queues to compensate for too many concepts. Reduce columns, move secondary context to rail/detail, or let horizontal overflow preserve readable cells. |
| Right rail | Protask detail uses a strong left profile/identity rail and a main activity/evidence stream; dashboard right rail is compact activity/context, not card sprawl. | Generated detail uses right cards for history/similar items but lacks a Protask-like identity/profile rail and leaves large vertical gaps. | Detail pages need a dedicated identity/profile rail plus evidence/activity/action surface. Rails should use responsive min/max or clamp constraints, stay compact, and remain subordinate to the main decision surface. |
| Card/grid width | Forge starter behaves best when cards fill their parent grid column and the parent controls available width. | Earlier generated pages and some starter experiments used fixed card widths, creating unnatural gaps between cards and uneven dashboard rhythm. | Production-like admin pages must not set `width="fixed"` or `w-64`/`w-80`/`w-96` on card-family components. Use parent grid tracks, `minmax`, `clamp`, and `items-start` for rails. |

## Baseline Rules

These rules apply when a page pattern declares a Protask/Forge admin visual
baseline.

1. Typography:
   - Page H1: `text-2xl font-semibold` or smaller.
   - Card/table/rail title: `text-sm` with `font-medium` or `font-semibold`, close to sidebar menu scale, usually `text-fg-black`. Avoid routine `text-lg`/`text-xl` card headers.
   - Row/card body: `text-sm`; metadata and helper text: `text-xs`.
   - No `text-display-l` or routine `text-3xl` on admin pages.

2. Density:
   - List pages at a common desktop review viewport must show page heading,
     compact filters, table header, and enough row identities/actions for fast
     scanning when rows exist.
   - In `rich-entity-list-protask`, the table is the primary work surface.
     Do not force a right rail beside it at `lg` desktop widths. Use inline
     stats, a drawer, a below-table rail, or `2xl` side-by-side layout when
     the main table remains readable.
   - Board pages at a common desktop review viewport must show lane strip,
     multiple lanes, and multiple actionable cards.
   - Detail pages at a common desktop review viewport must show
     identity/profile context, evidence or activity, and the primary
     resolution/action surface.
   - Do not hard-code component heights to chase density. Use compact density
     variants, restrained padding, single-line truncation, and responsive
     min/max constraints so the layout adapts while preserving scan density.

3. Spacing:
   - Default page vertical rhythm: `space-y-4` or `space-y-5`.
   - Default grids: `gap-4` or `gap-5`.
   - `p-6`, `gap-6`, and `space-y-6` are reserved for large dashboard panels,
     not default queue, detail, form, or board layout.

4. Borders and surfaces:
   - Prefer Forge `SurfaceCard`, `DataTable`, `TaskCard`, `ProfileCard`,
     `HistoryItem`, `FileCard`, and `ProgressBar`.
   - Use `outline-fg-grey-200` / `border-fg-grey-200` as the normal surface
     edge. Avoid darker grey borders unless marking a drop/empty/error state.
   - Long tables use one table surface and row dividers. Do not turn each row
     into a nested card with its own rounded border or shadow.
   - Prefer the Forge `DataTable` surface itself for the table title/header.
     Do not wrap `DataTable` in another large titled `SurfaceCard` when that
     creates a nested card/table shell.

5. Profile and rails:
   - The shell profile must come from `AppLayout`, not a custom rebuilt topbar.
   - Detail profile/context rails should use responsive constraints such as
     `minmax`, `clamp`, or max-width tokens on desktop and should not replace
     the main evidence/action surface.
   - Right rails must contain compact activity/context items, not large cards
     that push main content below the fold.

6. Adaptive density red lines:
   - Do not set component dimensions to fixed pixel values just to match a
     screenshot. Use Forge size variants, density tokens, truncation, and
     responsive `minmax` / `clamp` constraints.
   - Forge card-family components should normally fill their parent grid/flex
     column. `width="fixed"` and classes such as `w-64`, `w-80`, or `w-96`
     are reserved for component showcases, not production-like admin pages.
   - Parent layouts own width. Dashboards and details should define adaptive
     grid tracks such as `minmax(0,1fr)` / `minmax(18rem,24rem)` / `clamp(...)`;
     child cards should not compensate with fixed widths.
   - Side rails should align with `items-start` and responsive max/min
     constraints, not stretch into oversized card blocks or force the table
     into unreadable columns.
   - Table cells should be single-line by default with `truncate` or
     `line-clamp-1`. Additional context belongs in metadata text, tooltip,
     preview rail, or detail route.
   - Row actions should be compact and low-noise. Avoid full-size primary
     buttons in every table row; prefer small actions, links, icon actions, or
     a row action menu when the action count grows.
   - Do not stack row actions vertically. A rich queue row may expose one
     `Button size="sm"` plus one compact link/icon/menu. Put review, resolve,
     escalate, and multi-step actions in the selected-row rail, drawer, detail,
     or action route.
   - Do not use `[&_table]:table-fixed` on rich queues to squeeze table and
     rail into the same desktop viewport. Preserve readable cells with fewer
     columns, adaptive column widths, overflow-x, or a collapsed rail.
   - Surface nesting should stay shallow: grey workspace, one white outlined
     table/card surface, then row dividers or compact child items.
   - Detail pages should preserve a responsive identity/context rail and a
     separate main evidence/action surface. Do not replace that topology with a
     loose grid of unrelated cards.

## Fresh-Run Acceptance

Do not judge this baseline by manually polishing an existing demo. Update the
pattern/audit rules, then validate with a fresh PRD run. Acceptance evidence
must include:

- Browser screenshot for every promoted list/detail/action/board route.
- `requiredVisibleText` that proves first-viewport rows/cards/actions are
  present.
- `protask-visual-audit` pass with visual baseline checks enabled.
- `product-quality-audit` pass with `briefSpecs > 0` and route coverage.

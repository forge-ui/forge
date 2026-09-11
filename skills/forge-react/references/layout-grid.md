# Forge layout grid

Read this before choosing page columns or adapting a page to a narrow viewport. APIs are exported from `@forge-ui-official/core`; see `/components/grid` and `/cases/grid` for runnable examples. Existing consumers need a Core version that actually exports Grid/GridItem; do not invent imports against an older installed package.

## Ownership

- `AppLayout` owns sidebar, topbar and page padding. Do not add the same padding again to Grid.
- `Grid` owns tracks and gaps; `GridItem` owns span and start. Cards own their content and adapt through existing APIs such as `width="full"`.
- Dashboards/tables normally use available width. Standalone forms should generally cap content at 960px; forms with an auxiliary area use a responsive main/aside layout.
- Use Flex for toolbars, button groups and other one-dimensional arrangements. Do not replace every div with Grid.

## API and defaults

`Grid`: `columns` (1–24, default 12), `gap` (default 16px), `rowGap`, `columnGap`, `alignItems` (`start | center | end | stretch | baseline`, default stretch).

`GridItem`: `span` (1–24 or `full`, default full), `start` (1–24 or `auto`, default auto). Full spans the whole row and ignores start. Use `auto` to reset a previous breakpoint's start. At every breakpoint ensure numeric spans and starts fit the parent tracks; otherwise native CSS Grid creates implicit tracks.

Columns, gaps, span and start accept either a scalar or `{ base, sm, md, lg, xl, "2xl" }`. Breakpoints are viewport widths 640/768/1024/1280/1536px; unspecified values inherit upward. Empty objects use defaults. This is not a container-query API: check available width with the sidebar expanded too.

Gap values are **pixels**, limited to 0/4/8/12/16/20/24/32/48. An explicit axis gap overrides `gap` from its first specified breakpoint onward. Before that it follows `gap`; `0` is a valid override.

Both components accept normal div attributes, className, style and ref and work in server components. Custom classes/style are explicit CSS overrides; prefer the layout props. Nested grids reset their own variables rather than inheriting their parent's settings.

## Composition

```tsx
import { Grid, GridItem, StatCard } from "@forge-ui-official/core";

// Plain direct children auto-place into one cell each.
<Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={16}>
  {metrics.map(metric => <StatCard key={metric.title} {...metric} width="full" />)}
</Grid>

// GridItem defaults to full-row placement. Specify spans for the wide layout.
<Grid gap={{ base: 16, xl: 24 }} alignItems="start">
  <GridItem span={{ base: "full", xl: 8 }}>Main content</GridItem>
  <GridItem span={{ base: "full", xl: 4 }}>Auxiliary content</GridItem>
</Grid>
```

Keep DOM order aligned with reading and keyboard order. Decide equal height per row, not globally; do not force all card grids to auto-rows-fr or fixed minimum heights. Charts need an intentional height. Long identifiers need wrapping/truncation chosen by content meaning; tables keep horizontal scrolling in their own container. `min-width: 0` permits shrinking but does not itself wrap long strings.

## Layout audit

- Capture before/after at 375, 768, 1024 and 1440px; also inspect the breakpoints used by the page on both sides.
- Test expanded/collapsed sidebar and mobile overlay. Check actual content width, not only viewport width.
- No duplicated page padding, unintended implicit columns, or new document-level horizontal scroll.
- No clipped text/controls; long content must remain accessible. Wide tables scroll locally.
- Confirm relevant buttons, menus, fields, tabs and dialogs still work. Preserve pre-existing mock behavior; do not claim data was saved when a template only opens a dialog.
- Retain URL, screenshot and operation result. Record pre-existing failures separately; technical checks do not constitute user acceptance.

References: [Ant Design](https://ant.design/components/grid-cn/), [MUI](https://mui.com/material-ui/react-grid/), [Chakra UI](https://chakra-ui.com/docs/components/grid).

# metabase/metabase

- url: https://github.com/metabase/metabase
- category: analytics explorer
- metadata: public repo page reviewed on 2026-06-09; GitHub API numeric metadata was rate-limited.

## Evidence

- Public repo page describes an open-source business intelligence and embedded
  analytics tool.
- Relevant UI class: question builder, dashboards, saved charts, filters,
  collections, and permissions.

## IA Artifact

- Dashboard route owns cards, dashboard filters, saved questions, and sharing.
- Explore/question route owns source selection, filter clauses, chart/table
  result, save action, and drill-through.
- Collection route owns saved artifacts, ownership, and access context.

## Page Pattern

- Analytics explorer should use a two-zone layout: query/control region and
  result region, with save/share actions visible.
- Dashboard cards should be adaptive and content-driven; avoid fixed card
  widths that create uneven gaps.
- Result tables need dense cells and column/field metadata without becoming a
  spreadsheet clone.

## Business Workflow

- Analyst asks a question, selects data and filters, reviews chart/table
  output, saves it, then adds it to a dashboard or shares it.

## ForgeUI Gap

- Query builder clause rows and saved-question toolbar.
- Chart/table toggle with result metadata and save/share action cluster.

## Borrow

- Saved question as a first-class artifact.
- Dashboard filters as compact global context.
- Result preview before commit/save.

## Reject

- Do not implement a full BI semantic model for Forge prototype validation.
- Do not turn every admin dashboard into a generic analytics builder.

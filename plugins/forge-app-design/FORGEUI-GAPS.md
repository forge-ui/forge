# ForgeUI Gaps

This ledger keeps prototype work honest: generated apps should not hand-roll generic primitives to hide missing ForgeUI capability.

## Current Gaps To Track

| Gap | Why It Matters | Current Workaround | Preferred Resolution |
|---|---|---|---|
| Dense app shell variants | Protask-style admin screens need compact sidebar/topbar/profile/workspace affordances | Use existing `AppLayout` and keep page content dense | Add documented dense shell tokens or shell variants in Forge core |
| Activity/right context rail | Detail and dashboard pages need compact history and next-action rails | Compose `SurfaceCard`, `HistoryItem`, `FileCard`, `Label` | Add rail layout guidance and dense history variants |
| Drawer/toast/save feedback | Product prototypes need low-friction action feedback | Use local state text, labels, and right rails | Add Forge drawer/toast or document sanctioned alternatives |
| Dense table and entity identity cells | Operational queues and CRM records need dense identity, risk/SLA, evidence, owner, action | Use `DataTable`, `Avatar`, `Label`, `ProgressBar`, `StyledLink`, and explicit `overflow-x-auto` | Add dense table examples with identity/action cells |
| Nested trace/run timeline and log payload | Observability and workflow apps need nested attempts, spans, logs, and payload evidence | Compose `HistoryItem`, `DataTable`, `SurfaceCard`, `TextArea`, and compact evidence panels | Add run/trace detail examples and scrollable log/payload guidance |
| Grouped or segmented chart composition | Attribution/control tower dashboards need segment breakdown beside trend context | Use `StatCard`, `ProgressBar`, and small tables until Forge chart examples cover segments | Add grouped chart examples for attribution, status mix, and segment deltas |
| Query/explore builder shell | BI, analytics, and product-analytics apps need source selection, filter clauses, result preview, and save/share actions | Compose `Toolbar`, `SurfaceCard`, `TextField`, `SelectOption`, `ChartCard`, and `DataTable` | Add an explore-builder pattern with compact clause rows, chart/table toggle, preview state, and saved-view actions |
| Observability evidence panels | Error/incident apps need stack trace, log payload, related events, environment tags, and release context | Compose `SurfaceCard`, `HistoryItem`, `DataTable`, `FileCard`, and scrollable token-styled blocks | Add stack/log/timeline examples with copy affordances and expandable evidence rows |
| Advanced table density | Airtable-like, analytics, and ops data apps need field-type headers, relational cells, inline edits, saved views, and audit feedback | Use `DataTable`, `Cell*` primitives, compact toolbars, and split record detail instead of spreadsheet primitives | Add editable-grid guidance or explicit non-goal rules so generated apps do not hand-roll spreadsheet widgets |
| Dashboard variable/filter bar | Observability and BI dashboards need time range, variables, source filters, and saved views without pushing panels down | Compose `Toolbar` controls above `ChartCard` grids | Add dashboard variable/filter bar examples with compact responsive behavior |

## Promoted App Patterns, Not Kit Gaps

| Pattern | Decision |
|---|---|
| Kanban lane/card composition | Covered by `kanban-workflow-protask` and `golden-apps/deployment-release-board.md`; do not request a new primitive until repeated apps prove the workaround is too costly. |
| Review packet gallery | Owned by `scripts/render-review-packet.mjs` and `REVIEW-PACKET-CHECKLIST.md`, not ForgeUI core. |
| Calendar/time-slot routing | Track as app IA/product pattern from `calcom-cal-com`; not a kit request yet. |
| Status/region mini-map | Track as app IA/product pattern from `openstatusHQ/openstatus`; not a kit request yet. |
| Full SQL/no-code editors | Track as domain workflow from `metabase`, `superset`, and `nocodb`; not a default Forge prototype requirement. |

## Rule

If a generated app needs one of these capabilities, use the closest Forge primitive and record the gap. Do not add a generic `SectionCard`, `PanelCard`, custom table, custom badge, custom kanban primitive, or raw button in business app code.

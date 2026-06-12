# dashboard-control-tower-protask

Use this pattern when a medium-complex PRD needs a first-screen control tower that feels closer to Protask/Readdy density while staying ForgeUI-first. The legacy sample folder is `protask-compound-dashboard`; the canonical layout intent is `dashboard-control-tower-protask`.

Good matches:
- prior authorization / approval operations
- compliance, finance, risk, fulfillment, data quality, or support operations dashboards
- any app where the dashboard must answer "what needs action now?"

Do not use it for:
- simple CRUD home pages
- purely analytical reports with no workflow links
- apps where a list or detail page is the main entry point

## Files

- `BRIEF.md` — Page Intent Spec example.
- `page.tsx` — thin route orchestration with filter state.
- `utils.ts` — generic dashboard entities.
- `_components/SignalHero.tsx` — compact KPI + bar-stat strip.
- `_components/TrendAndMixPanel.tsx` — chart/gauge/progress composition.
- `_components/PriorityWorkRail.tsx` — recent work and activity rail.

## Adaptation Rules

1. Replace `OperationalSignal`, `WorkItem`, and `ActivityEvent` with PRD entities.
2. Keep at least five first-screen surfaces: compact KPI/stat, trend chart, risk/readiness gauge, priority work table, activity stream, and clear workflow entry.
3. Use Forge `SurfaceCard`, `ProgressStatCard`, `BarChartStatCard`, `ChartCard`, `BarChart`, `HalfDonutChart`, `DataTable`, and `HistoryItem` before inventing custom primitives.
4. Keep `page.tsx` thin: state, filtering, and component orchestration only.
5. Include at least two workflow links into list/detail/workflow pages.
6. Do not stop at four KPI cards. The dashboard must answer what needs action now, why, and where to go next.
7. Keep page typography at Forge CRM admin scale: H1 should usually be `text-2xl`; use larger type for KPI values, not the page title.

## Acceptance

- No raw app buttons or handrolled chart/progress primitives.
- Neutral panels use `SurfaceCard`; `ChartCard` is reserved for actual chart/gauge surfaces.
- Dashboard has compact KPI, trend, progress/gauge, priority work, activity density, and visible workflow entry.
- The primary action path is visible above the fold.
- Screenshot acceptance must include a trend/risk visual, a priority work row, and an activity item in the desktop review viewport.

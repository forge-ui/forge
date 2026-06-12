# Page Intent Spec Example

```yaml
- id: dashboard
  route: /
  layout_intent: dashboard-control-tower-protask
  detail_surface: page
  user_goal: Operations lead decides which queue, account, workflow, or exception needs action first.
  primary_decision: Which operating segment is threatening SLA, revenue, compliance, or customer impact today?
  primary_action: Filter the operating slice, open the priority queue, then drill into the riskiest record.
  secondary_context:
    - compact KPI and trend cards
    - workload and readiness visual
    - priority work table
    - activity/history rail
    - workflow links to queue and task board
  states_required: [loading, empty, hover, saved, error]
  must_have_extras: [risk_source_summary, workflow_link, activity_rail, readiness_progress, recent_work]
  visual_density_plan:
    shell: short app label and grouped nav; no raw slug branding
    dashboard: compact KPI row + trend card + progress/gauge card + recent work table + activity rail
    list: link to queue with identity/status/action visible
    detail: link to deepest triage route for top risk records
    assets: initials/avatar/file or account tiles when available
    state_surfaces: filter, hover, saved feedback, empty/loading
  component_plan:
    components: [SignalHero, TrendAndMixPanel, PriorityWorkRail]
    helpers: [segmentOptions, riskTone, trendBars]
    local_state: [selectedSegment, visibleSignals, loading]
  screenshot_acceptance:
    viewport: desktop-review
    must_show: [compact_kpi, trend_or_risk_visual, priority_work_row, activity_stream, workflow_entry]
```

Replace the business vocabulary and routes with the current PRD. Do not copy the sample domain text.

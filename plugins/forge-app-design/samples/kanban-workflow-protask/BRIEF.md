# Page Intent Spec Example

```yaml
- id: jobs-kanban
  route: /jobs
  layout_intent: kanban-workflow-protask
  detail_surface: page
  design_register: product-admin
  user_context: Ops user scans status lanes during an active shift and advances work without opening every detail page.
  realistic_ranges: workflow items 0-500; status lanes 3-6; failed items 0-40; owners 1-50.
  anti_goals:
    - Do not make the board read-only.
    - Do not replace a detail-heavy triage page with a board.
    - Do not hand-roll generic card or badge primitives.
  design_references: [Linear board, Protask workflow lane, Fulfillment ops status board]
  user_goal: Ops user scans all scheduled work, spots blocked or failed items, and takes the next action without opening every detail page.
  primary_decision: Which status lane needs attention now? Which failed item should be investigated before rerun?
  primary_action: Trigger a rerun from the card; failed cards link to related diagnostic records.
  secondary_context:
    - status_count_strip: total / pending / running / success / failed
    - four kanban lanes with empty states
    - card metadata: owner, schedule, last run, next run, run count
    - failed lane attention banner
    - cross-page link to related issues / tickets / logs
  states_required: [loading, empty, hover, saving, saved, error]
  must_have_extras: [hover_action_reveal, inline_rerun, status_count_strip, failure_diagnostic_link]
  visual_density_plan:
    workflow: lane count strip, 3-6 status lanes, actionable TaskCard rows, empty states, failed diagnostics
    detail: every blocked or failed card links to a detail/diagnostic route
    assets: use Forge TaskCard, Label, ProgressBar, Button, and StyledLink; no custom card shell
    state_surfaces: loading columns, empty lanes, triggering state, error banner
  component_plan:
    components:
      - StatusStrip
      - FailedJobsBanner
      - KanbanColumn
      - JobCard
    helpers: [STATUS_COLUMNS, STATUS_THEME, humanizeSchedule, groupByStatus]
    local_state: [items, loading, triggeringId, error]
```

Replace names and fields with the PRD domain. Keep the workflow shape.

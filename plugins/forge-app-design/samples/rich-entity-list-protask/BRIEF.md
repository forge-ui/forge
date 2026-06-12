# Page Intent Spec Example

```yaml
- id: exception-queue
  route: /exceptions
  layout_intent: rich-entity-list-protask
  detail_surface: drawer
  design_register: product-admin
  user_context: Operations lead reviews high-risk exceptions during a daily SLA window and needs to route the next case quickly.
  realistic_ranges: cases 0-250/day; owners 3-12; evidence files 0-6/case; comments 0-20/case
  anti_goals:
    - Do not flatten the queue into name/status/date columns only
    - Do not hide row actions behind a generic menu
    - Do not put create/edit action routes in sidebar navigation
    - Do not force a right insight rail beside the table at common desktop widths
    - Do not stack Preview/Open/Review actions vertically in every table row
    - Do not use table-fixed to hide unreadable queue columns
  design_references: [Linear issue list density, Stripe risk review queue, Zendesk SLA views]
  user_goal: Review the next highest-risk entity and decide whether to open, assign, or mark it reviewed.
  primary_decision: Which entity has the highest risk, weakest evidence, or closest SLA breach?
  primary_action: Filter the queue, preview the selected entity, then open full detail or mark the row reviewed.
  secondary_context:
    - owner and last activity
    - status, priority, risk score, and SLA remaining
    - evidence file tiles
    - recent activity/history
    - parent route CTA into create/import action route when needed
  states_required: [loading, empty, hover, selected, saved, error]
  must_have_extras: [row_identity, owner, risk, sla, evidence, activity, row_action]
  visual_density_plan:
    shell: AppLayout nav shows only navigation routes; action routes stay out of sidebar
    dashboard: links into the queue with compact risk and workload signals
    list: first viewport order is page title, compact filters, then DataTable header plus first rows
    summary: compact inline stats or right rail; never a large card between filters and table
    rail_behavior: insight rail collapses below the table or becomes a drawer until 2xl width; table readability wins over side context
    row_actions: one small primary row command plus one compact detail link or icon/menu; secondary review actions move to selected-row rail
    detail: insight rail or drawer with evidence, activity, and full detail link
    assets: initials/avatar/file tiles, no external image dependency
    state_surfaces: filters, selected row, empty queue, reviewed feedback
  component_plan:
    components: [QueueCommandBar, QueueWorkloadSummary, EntityQueueTable, EntityInsightRail]
    helpers: [statusColor, priorityColor, filterCases, queueSummary]
    local_state: [statusFilter, segmentFilter, selectedId, reviewedIds]
  screenshot_acceptance:
    viewport: desktop-review
    must_show: [compact_filters, table_header, first_real_row_identity, row_action]
  custom_component_policy:
    allowed:
      - EntityInsightRail as a domain composition using Forge SurfaceCard, FileCard, HistoryItem, Label, and ProgressBar
    forbidden:
      - Custom Button, Table, Badge, SectionCard, MiniCard, or generic card shells
      - page.tsx inline hex or hand-rolled progress/chart primitives
    forgeui_gaps: []
```

Replace exception vocabulary, filters, route links, and evidence types with the current PRD.

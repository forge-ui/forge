# Page Intent Spec Example

```yaml
- id: entity-queue
  route: /entities
  layout_intent: rich-queue-with-insight-panel
  detail_surface: drawer
  user_goal: Operator triages the next highest-risk entity without opening every detail page.
  primary_decision: Which entity should be opened, escalated, or resolved first?
  primary_action: Filter the queue, preview the entity, then open full detail or assign the next workflow step.
  secondary_context:
    - owner and last activity
    - risk/progress meter
    - evidence or attachment tiles
    - recent activity/history
    - pagination and bulk affordance
  states_required: [loading, empty, hover, saved, error]
  must_have_extras: [owner, status, risk, evidence, activity, row_action]
  component_plan:
    components: [QueueFilters, EntityQueueTable, EntityInsightPanel]
    helpers: [statusColor, priorityRows, filterRows]
    local_state: [statusFilter, segmentFilter, selectedId]
```

Replace the entity vocabulary, filters, and route links with the current PRD.

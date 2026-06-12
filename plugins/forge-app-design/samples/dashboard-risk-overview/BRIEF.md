# Page Intent Spec Example

```yaml
- id: dashboard
  route: /
  layout_intent: hero-overview-with-risk-stream
  detail_surface: page
  user_goal: Operations lead decides what risk needs attention first within 2 minutes.
  primary_decision: Which workflow, source, lane, customer group, or system area threatens today's target?
  primary_action: Open the blocked workflow board or jump to a critical detail record.
  secondary_context:
    - semantic risk KPIs
    - blocked workflow panel
    - critical record stream
    - contextual health panel
  states_required: [loading, empty, hover, error]
  must_have_extras: [risk_source_summary, blocked_workflow_link, critical_detail_link, context_health]
  component_plan:
    components:
      - HealthStats
      - BlockedWorkflowPanel
      - RiskStreams
      - ContextHealthPanel
    helpers: [riskColor, statusColor, riskScore]
    local_state: [primaryRecords, workflowRecords, risks, contexts, loading]
```

Replace names and metrics with the PRD domain. Keep the dashboard decision-oriented.

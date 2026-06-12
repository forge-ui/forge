# Page Intent Spec Example

```yaml
- id: issue-detail
  route: /issues/[id]
  layout_intent: split-pane-triage
  detail_surface: split-pane
  user_goal: Operator decides whether the item can be resolved, ignored, or escalated within one focused workspace.
  primary_decision: What is the root cause, what is the impact scope, and what next action is safe?
  primary_action: Write resolution, PATCH status, then navigate to the next workflow page.
  secondary_context:
    - meta strip: severity / status / category / owner
    - first-viewport decision workbench: status outcome / resolution note / save-and-continue action
    - root cause evidence
    - impact scope
    - similar or related records
    - SOP / runbook steps
    - change history timeline
  states_required: [loading, empty, saving, saved, error, hover]
  must_have_extras: [root_cause, impact_scope, similar_issues, sop_link, change_history]
  component_plan:
    components:
      - TriageMetaStrip
      - ResolutionPanel
      - RootCausePanel
      - ImpactScopePanel
      - SimilarRecords
      - SopBlock
      - ChangeHistory
    helpers: [SOP_BY_CATEGORY, severityColor, statusColor, similarRecords]
    local_state: [item, resolution, saveState]
  screenshot_acceptance:
    viewport: desktop-review
    must_show: [identity/status, root_cause_or_evidence, impact_or_history, resolution_action]
```

Replace names and fields with the PRD domain. Keep the decision workflow shape and keep the primary resolution controls visible before the user scrolls.

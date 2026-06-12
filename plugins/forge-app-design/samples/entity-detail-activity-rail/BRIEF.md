# Page Intent Spec Example

```yaml
- id: entity-detail
  route: /entities/[id]
  layout_intent: detail-with-context-and-activity-rail
  detail_surface: page
  user_goal: Reviewer understands cause, impact, evidence, and next action before changing state.
  primary_decision: Should this entity be approved, resolved, escalated, or sent back for evidence?
  primary_action: Update status, write resolution note, save, then continue to the downstream workflow route.
  secondary_context:
    - hero identity and severity
    - left context rail
    - root cause and impact scope
    - attachments/evidence
    - activity and comments
  states_required: [loading, saving, saved, error, empty, hover]
  must_have_extras: [root_cause, impact_scope, evidence, comments, change_history, workflow_link]
  component_plan:
    components: [DetailHero, ContextRail, ActivityRail, ResolutionPanel]
    helpers: [statusColor, evidenceFiles, activityEvents]
    local_state: [status, note, saveState]
  screenshot_acceptance:
    viewport: desktop-review
    must_show: [identity_status, evidence_or_root_cause, activity_or_impact, resolution_action]
```

Replace labels, statuses, and downstream routes with the current PRD.

# Page Intent Spec Example

```yaml
- id: create-review-task
  route: /review-tasks/new
  layout_intent: action-form-protask
  detail_surface: page
  design_register: product-admin
  user_context: Operations lead creates one review task from a parent queue and must confirm owner, scope, policy, and readiness before saving.
  realistic_ranges: form fields 8-14; preflight checks 3-6; assignees 5-50; policy options 3-8
  anti_goals:
    - Do not turn the action page into a dashboard.
    - Do not put this action route in sidebar navigation.
    - Do not hide Cancel or Save inside a menu.
  design_references: [Protask add customer form, Stripe review request form]
  user_goal: Create a review task with enough context for the next owner to act without reopening the parent queue.
  primary_decision: Is the selected scope, policy, owner, and timing safe enough to save?
  primary_action: Save task, show saved state, then link to the created task detail or parent list.
  secondary_context:
    - parent queue breadcrumb
    - grouped scope and policy fields
    - right status rail with completion and readiness checks
    - preflight checklist
    - next workflow link after save
  states_required: [editing, dirty, saving, saved, error, empty, hover]
  must_have_extras: [explicit_exit_path, preflight_checks, status_rail, save_state, next_workflow_link]
  visual_density_plan:
    shell: AppLayout owns topbar and padding; action page starts with open title area
    dashboard: not applicable
    list: parent list owns discovery and filtering
    detail: next detail route owns audit history and deep evidence
    assets: optional avatar/logo/file tile only when PRD has owner, company, or attachment
    state_surfaces: inline validation, saving/saved feedback, preflight readiness
  component_plan:
    components:
      - ScopeFields
      - PolicyFields
      - PreflightChecklist
      - StatusRail
    helpers: [DEFAULT_ACTION_DRAFT, OWNER_OPTIONS, POLICY_OPTIONS, completionPercent, preflightChecks]
    local_state: [draft, saveState, dirty]
  screenshot_acceptance:
    viewport: desktop-review
    must_show: [breadcrumbs_h1_cancel_save, first_field_group, status_or_completion_rail, preflight_checks]
  custom_component_policy:
    allowed:
      - Domain field groups that compose Forge SurfaceCard and form primitives.
      - Micro visual density in child components only.
    forbidden:
      - Custom Button, Table, Badge, generic SectionCard, or page.tsx inline hex.
      - Kicker/eyebrow text above the action title.
```

Replace task names, routes, options, and validation rules with the PRD domain. Keep the action-form structure.

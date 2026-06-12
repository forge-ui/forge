# Page Intent Spec Example

```yaml
- id: import-wizard
  route: /imports/new
  layout_intent: guided-wizard-with-review-submit
  detail_surface: page
  user_goal: Operator creates a safe multi-step configuration without losing context or skipping validation.
  primary_decision: Is each setup decision valid enough to submit the workflow?
  primary_action: Complete required steps, review impact, and submit the job.
  secondary_context:
    - step rail with progress and validation state
    - source/configuration step
    - mapping/validation step
    - schedule/ownership step
    - review panel with warnings and next route link
  states_required: [editing, invalid, saving, saved, error, hover]
  must_have_extras: [step_validation, review_summary, submit_state, next_workflow_link]
  component_plan:
    components:
      - StepRail
      - StepShell
      - SourceStep
      - MappingStep
      - ScheduleStep
      - ReviewPanel
      - WizardFooter
    helpers: [WIZARD_STEPS, validateDraft, previewRows, progressForStep]
    local_state: [draft, activeStep, submitState, submittedId]
```

Replace fields and steps with the PRD domain. Keep the validation and submit workflow shape.

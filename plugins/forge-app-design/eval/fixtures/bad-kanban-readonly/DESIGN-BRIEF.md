# Bad Fixture: Read-Only Kanban

```yaml
- id: workflow-board
  route: /workflow-board
  layout_intent: kanban-workflow-protask
  user_goal: Ops user scans a board but cannot advance work.
  primary_decision: Which lane is blocked?
  primary_action: None.
  secondary_context:
    - status lanes
    - static cards
  component_plan:
    components: []
    helpers: []
    local_state: []
```

This fixture is intentionally invalid. It represents the `read-only-kanban`
anti-pattern: cards have no write action, no local feedback, and no diagnostic
or detail link.

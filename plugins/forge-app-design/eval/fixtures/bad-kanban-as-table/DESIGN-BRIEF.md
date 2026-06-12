# Bad Fixture: Board As Table

```yaml
- id: workflow-board
  route: /workflow-board
  layout_intent: kanban-workflow-protask
  user_goal: Ops user scans status grouped work.
  primary_decision: Which item needs attention?
  primary_action: Filter the table.
  secondary_context:
    - status column
    - owner column
  component_plan:
    components: []
    helpers: []
    local_state: []
```

This fixture is intentionally invalid. It represents the
`board-as-table-replacement` anti-pattern: the route claims kanban intent but
renders a table without lane decisions, card actions, or diagnostic links.

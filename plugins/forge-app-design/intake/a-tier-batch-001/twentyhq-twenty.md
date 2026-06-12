# twentyhq/twenty

- url: https://github.com/twentyhq/twenty
- stars: 49031
- pushed_at: 2026-06-04T06:31:57Z
- category: split-pane

## Evidence

- Public product: https://twenty.com
- Repo description: open alternative to Salesforce.
- Relevant UI class: CRM records, related objects, activity and field editing.

## IA Artifact

- Object list route owns filtering/search and row-level navigation.
- Record detail route owns identity, related records, activity, and edit actions.
- Create/update routes should be launched from toolbar, row action, or detail action.

## Page Pattern

- Detail pages need a strong record identity header plus side context.
- Related entities and activity should be adjacent to fields, not hidden in a generic report page.
- List rows need account/person identity, owner, status, last activity, and action affordance.

## Business Workflow

- User filters records, opens one, inspects context, edits fields, and follows related activity.
- Changes should produce visible saved/dirty feedback.

## ForgeUI Gap

- Forge DataTable supports rows, but CRM-style identity cells still need consistent examples.

## Borrow

- Record detail as evidence/activity workspace.
- Related object rail for decision context.
- Inline save feedback for operational edits.

## Reject

- Do not clone Twenty's object model or schema builder.
- Do not turn Forge detail pages into generic editable field dumps.

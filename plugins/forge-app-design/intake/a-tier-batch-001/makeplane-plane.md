# makeplane/plane

- url: https://github.com/makeplane/plane
- stars: 50252
- pushed_at: 2026-06-03T14:39:38Z
- category: kanban

## Evidence

- Public product: https://plane.so
- Repo description: project management with tasks, sprints, docs, and triage.
- Relevant UI class: board/list issue management, sprint workflow, triage queue.

## IA Artifact

- Workspace overview routes users into projects, cycles, modules, and issue views.
- Board/list surfaces are navigation pages; issue detail is a parent-entered detail surface.
- Creation/edit surfaces should be toolbar or row-action entry, not sidebar.

## Page Pattern

- Kanban lane is a primary operational surface, not decorative grouping.
- Cards need identity, priority/state, owner, due/sprint context, and direct transition or open-detail action.
- Useful first viewport contract: lane title, card title, assignee/priority, direct action, detail link.

## Business Workflow

- User scans lane, chooses next issue, changes state or opens detail.
- Detail page carries comments/activity/history and assignment context.
- Empty lanes still explain where work appears from the prior workflow step.

## ForgeUI Gap

- Forge lacks a first-class kanban lane/card composition. Current workaround:
  `SurfaceCard + TaskCard + Label + Button + StyledLink`.

## Borrow

- Board as primary decision surface.
- Lane count + status + owner visible before scrolling.
- Detail link for every blocked/high-priority card.

## Reject

- Do not copy Plane's full project navigation model.
- Do not promote all saved views into Forge sidebar.

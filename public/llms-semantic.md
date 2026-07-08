# Forge UI Semantic Guide For Agents

## Authority Order

1. Current user PRD and business objective.
2. Product Design handoff / Page Intent Specs.
3. forge-app-design dataset and pattern recall.
4. ForgeUI component registry and block catalog.
5. Forge cases/templates/starter precedents.
6. Route-local composition code.

Never invert this order. A component plan cannot replace business flow, data flow, field design, or action closure.

## Page Roles

- Dashboard: control tower with KPI strip, trend/risk view, priority work, activity, and entry points. Not just four KPI cards.
- List/queue: filters, density, first-screen rows/cards, identity, owner, risk/status, evidence, row/bulk actions.
- Detail/triage: identity header, status, evidence, root cause, impact, history, resolution, audit trail, next workflow.
- Action/form: grouped fields, right-side context, preflight/impact, guarded submit, pending/error/success feedback.
- Workflow/kanban: lanes, state transitions, card actions, progress, diagnostic links, empty states.
- Settings: grouped settings, owner/audit, test result, rollback/history, scope/impact.
- Report/analysis: metric/trend plus affected entity list and action handoff.
- Workspace/builder: artifact canvas, side inspector, validation/readiness rail, publish/rollback.

## Visual Baseline

- Use restrained typography. Routine admin titles should not look like landing-page hero text.
- Body and card text should prefer Forge defaults over route-local font overrides.
- Cards, tables, charts, rails, and profile regions should fill parent layout tracks instead of fixed pixel widths.
- Avoid nested cards, decorative gradients, saturated one-note palettes, and excessive blank gutters.
- Use compact summary strips or rails; do not push the primary table/queue below the first viewport.

## Field To Component Mapping

- Identity, owner, assignee: Avatar, ProfileCard, ContactItem, CellImageText.
- Status/risk/priority: Label, StatusBadge, ProgressBadge, NotificationBadge.
- Metrics: StatCard, ProgressStatCard, chart stat cards, ProgressBar.
- Tables/queues: DataTable, TableCell primitives, Toolbar, FilterGroup.
- Activity/history/audit: HistoryItem, HistoryGrouped, ActivityCard, NotificationItem.
- Forms/settings: TextField, TextArea, SelectOption, Datepicker, Checkbox, RadioButton, Toggle, FileUpload, ColorPicker.
- Navigation/shell: AppLayout, SidebarMenu, TopBar, PageHeader, Breadcrumbs, TabBar, ButtonGroup.

## Red Lines

- Do not rebuild existing Forge primitives with ad hoc div/span markup.
- Do not use Tailwind default color families in business pages.
- Do not hard-code card widths for normal responsive grid cards.
- Do not add generic subtitle text that repeats the title or obvious UI behavior.
- Do not copy source-project menu trees, field names, or visual structures from repo-intake. Recall, adapt, redesign.
- Do not claim a route is complete without Page Intent Specs and acceptance evidence in forge-app-design workflows.

## Block Catalog

## action-form-with-status-rail

- Role: action
- Intent: Create, edit, submit, or configure a record through grouped fields with save feedback and right context.
- Pattern: action-form-protask
- Components: Breadcrumbs, SurfaceCard, PageTitleToolbar, TextField, TextArea, SelectOption, CheckboxControl, ProgressBar, Label, Button, StyledLink, ListGroup
- First viewport must show: breadcrumbs or parent exit; H1; Cancel/Save; first field group; status/preflight rail
- Red lines: No action route in sidebar; No CheckboxWithLabel; No long hero copy above form

## app-shell

- Role: shell
- Intent: Provide Forge AppLayout with navigation-only sidebar and topbar profile.
- Components: AppLayout
- Inputs: navigation routes; app label; team profile; user profile
- Red lines: No custom page-level topbar; No action/detail routes in sidebar

## audit-activity-stream

- Role: audit
- Intent: Show who changed what, when, and which record is related.
- Pattern: audit-stream
- Components: SurfaceCard, HistoryItem, DataTable, StyledLink, Label
- First viewport must show: audit title; actor/action/target; timestamp; related record link
- Red lines: No write workflow inside audit page

## dashboard-control-tower

- Role: dashboard
- Intent: Prioritize operational work through KPI, trend/risk visual, priority work, activity, and workflow entry.
- Pattern: dashboard-control-tower-protask
- Components: StatCard, SurfaceCard, PageTitleToolbar, ProgressBar, DataTable, HistoryItem, ListGroup, NotificationItem, StyledLink, ButtonGroup
- First viewport must show: page title; KPI/stat strip; trend or risk visual; priority work or activity
- Red lines: Not just four KPI cards; No form workflow inside dashboard; No mixed saturated/white KPI row; No wide saturated red risk StatCard by default; KPI values must be visually stronger than page H1; No display-scale routine page titles

## kanban-workflow-board

- Role: workflow
- Intent: Move workflow items through lanes with direct actions and diagnostic links.
- Pattern: kanban-workflow-protask
- Components: SurfaceCard, TaskCard, Label, ProgressBar, Button, StyledLink
- First viewport must show: lane titles; lane counts; actionable cards; failed/blocked diagnostic link
- Red lines: Supporting route does not count as promoted kanban validation; No read-only status grouping pretending to be workflow

## rich-queue-list

- Role: list
- Intent: Let operators scan, filter, preview, and open the next row to act on.
- Pattern: rich-entity-list-protask
- Components: SurfaceCard, PageTitleToolbar, FilterPanel, DataTable, Avatar, Label, ProgressBar, Button, StyledLink, FileCard, HistoryItem, ListGroup, NotificationItem
- First viewport must show: compact filters; table header; multiple row identities; one row action
- Red lines: No lg side rail squeeze; No table-fixed; No vertical row action stack; No dual text actions in a row; No compound risk score/percent/bar cell; No redundant rounded filter shell; No noisy multi-color label row; No selected-row detail card below table; No two stacked 5-item ButtonGroups; No DataTable inside another large titled table card; No FilterPanel as the always-visible first-screen filter row

## settings-governance-panel

- Role: settings
- Intent: Change grouped configuration with owner, scope, test result, impact preview, rollback history, and audit evidence visible.
- Pattern: settings-grouped
- Components: SurfaceCard, PageTitleToolbar, TextField, TextArea, SelectOption, CheckboxControl, RadioButton, ProgressBar, Label, Button, StyledLink, HistoryItem, ListGroup
- First viewport must show: settings group identity; owner/scope; test or preflight result; save/disable/rollback action; audit or history rail
- Red lines: No flat static config dump; No high-risk setting without impact preview; No save action without pending/saved/error feedback; No missing rollback or audit context

## split-pane-triage-detail

- Role: detail
- Intent: Resolve a record by showing identity, evidence, root cause, impact, history, and action feedback.
- Pattern: split-pane-triage-protask
- Components: Breadcrumbs, SurfaceCard, PageTitleToolbar, Avatar, Label, ProgressBar, FileCard, HistoryItem, ListGroup, NotificationItem, TextArea, Button, StyledLink
- First viewport must show: identity/status; evidence or root cause; resolution/action; history or context
- Red lines: No all-field description dump; No loose unrelated card grid; No missing next workflow link

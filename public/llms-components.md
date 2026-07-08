# Forge UI Generated Component Catalog

Source: `forge-app-design/references/component-registry-lite.json`
Package: `@forge-ui-official/core@0.1.6`

Use this file for quick component selection. For stricter generation, read the external `forge-app-design/references/component-registry.json`.

## ActivityCard

- Category: timeline
- Import: `import { ActivityCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: standard
- Source: `core/src/components/ui/activity-card.tsx`
- Purpose: Compact activity card with title + datetime + body.
- Best for: dashboard activity column; team feed
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## AppLayout

- Category: layout
- Import: `import { AppLayout } from "@forge-ui-official/core"`
- Responsive: layout-shell
- Density: dense-operational
- Source: `core/src/components/layouts/app-layout.tsx`
- Purpose: Admin application shell with sidebar, topbar, team switcher, notifications, and profile.
- Best for: all generated Forge admin apps
- Avoid for: custom marketing pages; standalone auth-only pages
- Required usage: Use profilePosition="topbar" for Protask-style admin apps.; Only surfaceRole=navigation routes enter menuItems.; Use breadcrumbs + primaryAction + secondaryAction for detail and action pages.
- Forbidden usage: Do not rebuild sidebar/topbar/profile in page.tsx.; Do not add extra max-w-* / p-6 / p-8 wrappers around the page root.; Do not put /new, /edit, [id], or audit routes in menuItems.

## Avatar

- Category: identity
- Import: `import { Avatar } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/avatar.tsx`
- Purpose: Identity anchor for people, organizations, queues, and records.
- Best for: owner; assignee; customer; merchant; company; team
- Avoid for: DataTable identity cells (use CellImageText instead); decorative icons without identity meaning
- Required usage: When used in non-DataTable surfaces, pair with semantic Forge identity components (ProfileCard, HistoryItem variant=profile, ContactItem).
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## BarChartStatCard

- Category: metric-card
- Import: `import { BarChartStatCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/bar-chart-stat-card.tsx:36-106`
- Purpose: Metric card with small bar chart trend.
- Best for: dashboard distribution metric; short-term bar trend
- Avoid for: full chart analysis
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## Button

- Category: action
- Import: `import { Button } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/button.tsx`
- Purpose: Primary and secondary command button.
- Best for: primary page actions; form submit actions; short secondary actions; empty-state calls to action
- Avoid for: icon-only toolbar controls; dense row overflow actions; long labels that should be links or menu items
- Required usage: Use variant, color, and size props before custom button CSS.; Use IconButton for icon-only controls.; Keep primary actions singular per surface unless the workflow explicitly needs split actions.; Do not force fixed pixel width; allow parent layout or w-full form usage to control width.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ButtonGroup

- Category: control
- Import: `import { ButtonGroup } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/button-group.tsx`
- Purpose: Short segmented filter or mode switch.
- Best for: status filters; segment filters; dashboard scope toggles
- Avoid for: more than five options in one group; long option labels; multi-select filters
- Required usage: Forbidden: Do not rely on flex-wrap to cram 6-8 options into one segmented control.
- Forbidden usage: Do not rely on flex-wrap to cram 6-8 options into one segmented control.

## CellActions

- Category: table-cell
- Import: `import { CellActions } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:496-532`
- Purpose: Row action cluster (mail/phone/chat/eye/pen/trash) plus optional kebab.
- Best for: row actions; owner contact rows
- Avoid for: none recorded
- Required usage: Forbidden: Do not stack two text buttons (Preview + Open) in every row; use one CellLink plus CellActions.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: Do not stack two text buttons (Preview + Open) in every row; use one CellLink plus CellActions.

## CellCode

- Category: table-cell
- Import: `import { CellCode } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:422-430`
- Purpose: Monospaced-shape semibold code/identifier cell.
- Best for: release IDs; short codes
- Avoid for: long descriptive text
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellFile

- Category: table-cell
- Import: `import { CellFile } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:451-477`
- Purpose: File identity cell with file-type icon, name, and optional size.
- Best for: attachment rows; evidence tables; import logs
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellImageText

- Category: table-cell
- Import: `import { CellImageText } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:253-280`
- Purpose: Identity cell with avatar/logo plus title and subtitle in the Forge h-10 row.
- Best for: row identity with image; customer / org / product cells
- Avoid for: identity without image, use CellTextSubtitle instead
- Required usage: rounded="full" for people; rounded="lg" for org/product/file.
- Forbidden usage: Do not re-implement avatar + title + subtitle by hand inside a DataTable column.

## CellKebabMenu

- Category: table-cell
- Import: `import { CellKebabMenu } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:301-317`
- Purpose: Single kebab-menu action cell.
- Best for: row menus when no inline actions are needed
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellLink

- Category: table-cell
- Import: `import { CellLink } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:546-569`
- Purpose: Inline link-styled row action with arrow-up-right icon.
- Best for: Open detail; Open audit log; Go to record
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellMuted

- Category: table-cell
- Import: `import { CellMuted } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:241-251`
- Purpose: Muted text cell for secondary, non-decision values.
- Best for: date strings; owner names without avatar; low-emphasis metadata
- Avoid for: status enums (use Label); numeric KPIs (use CellNumber)
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellNumber

- Category: table-cell
- Import: `import { CellNumber } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:359-393`
- Purpose: Numeric cell with optional up/down trend arrow and ProgressBadge.
- Best for: amount; count; percent change with badge
- Avoid for: non-numeric values
- Required usage: Forbidden: Do not hand-render <span className="text-fg-green-500">↑ value</span>.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: Do not hand-render <span className="text-fg-green-500">↑ value</span>.

## CellProgressBar

- Category: table-cell
- Import: `import { CellProgressBar } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:399-420`
- Purpose: Compact progress bar cell with label and percentage; pinned to size=sm for row height.
- Best for: readiness; SLA pressure; completion in queue rows
- Avoid for: binary status
- Required usage: Forbidden: Do not call <ProgressBar/> directly inside a DataTable column; always wrap in CellProgressBar.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: Do not call <ProgressBar/> directly inside a DataTable column; always wrap in CellProgressBar.

## CellProgressValue

- Category: table-cell
- Import: `import { CellProgressValue } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:282-299`
- Purpose: Value plus small outlined ProgressBadge (green/red/grey) for delta indicators.
- Best for: amount + change pill; score + delta
- Avoid for: status enums
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellRating

- Category: table-cell
- Import: `import { CellRating } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:432-449`
- Purpose: Star icon plus rating value.
- Best for: rating cells; NPS rows
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellStatusDot

- Category: table-cell
- Import: `import { CellStatusDot } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:332-357`
- Purpose: Status cell rendered as a colored dot ring plus emphasis-controlled label.
- Best for: status enums that should not feel like a saturated pill; monitoring lists
- Avoid for: status that must read as a count badge
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellText

- Category: table-cell
- Import: `import { CellText } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:206-216`
- Purpose: Single-line primary cell value with Forge typography and line-clamp-1.
- Best for: primary text cells; action names; headers in feed lists
- Avoid for: muted/secondary values
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CellTextSubtitle

- Category: table-cell
- Import: `import { CellTextSubtitle } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:218-239`
- Purpose: Two-line text identity cell (title + subtitle) in the Forge h-10 row.
- Best for: row identity without image; name + code rows; name + role rows
- Avoid for: single-line text values
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ChartCard

- Category: chart
- Import: `import { ChartCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/charts/chart-card.tsx`
- Purpose: White outlined chart surface for trends, status mix, and dashboard analysis panels.
- Best for: dashboard trend panel; control tower chart; segment mix panel; analytics surface with footer stats
- Avoid for: non-chart summary cards; right rail activity; wrapping a DataTable
- Required usage: Default width fills the parent grid/flex column.; Use width="fixed" or size=4col/6col/8col only in component showcases, never generated app routes.; If width and size are both present, width is the authoritative layout mode; size is only a legacy fixed-width preset.; Let the parent grid define responsive column behavior with minmax(0,1fr), clamp rails, and gap-4/gap-5.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## CheckboxControl

- Category: form
- Import: `import { CheckboxControl } from "@forge-ui-official/core"`
- Responsive: fills-form-group
- Density: standard
- Source: `core/src/components/ui/checkbox.tsx`
- Purpose: Boolean or checklist input without nested label button semantics.
- Best for: boolean field; preflight checklist; policy toggles; single selection when paired with text
- Avoid for: using CheckboxWithLabel
- Required usage: Pair with a separate span/label text; do not use CheckboxWithLabel.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ContactItem

- Category: identity
- Import: `import { ContactItem } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/contact-item.tsx:14-71`
- Purpose: Compact contact row with avatar, name, metadata, and actions.
- Best for: right rail owner/contact context; support or team lists
- Avoid for: primary entity queue tables
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## DataTable

- Category: data-display
- Import: `import { DataTable } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: dense-operational
- Source: `core/src/components/ui/data-table.tsx:579-796`
- Purpose: Primary surface for business queues, entity lists, audit records, and priority work tables.
- Best for: paginated lists; filtered queues; bulk selection; row actions; audit tables
- Avoid for: single record detail; less than three static facts; kanban lane cards
- Required usage: Forbidden: Do not pass data=; use rows=.; Forbidden: Do not use onRowClick; navigation belongs in CellLink, CellActions, or StyledLink cell.; Forbidden: Do not use [&_table]:table-fixed on rich operational queues.; Forbidden: Do not wrap in a second large titled SurfaceCard.; Forbidden: Do not write <div className="flex items-center gap-2"><Avatar/><span>{name}</span></div> as a column render; use CellImageText.; Forbidden: Do not use <Label color="gray"> as the entire cell for a date or numeric value; use CellMuted or CellNumber.; Forbidden: Do not hand-roll <div><p>{title}</p><p className="text-fg-grey-500">{subtitle}</p></div>; use CellTextSubtitle.; Forbidden: Do not place a raw <ProgressBar/>, <Avatar/>, <Button/>, or <Label/> as the entire column render when a Cell* primitive exists for that field shape.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: Do not pass data=; use rows=.; Do not use onRowClick; navigation belongs in CellLink, CellActions, or StyledLink cell.; Do not use [&_table]:table-fixed on rich operational queues.; Do not wrap in a second large titled SurfaceCard.; Do not write <div className="flex items-center gap-2"><Avatar/><span>{name}</span></div> as a column render; use CellImageText.; Do not use <Label color="gray"> as the entire cell for a date or numeric value; use CellMuted or CellNumber.; Do not hand-roll <div><p>{title}</p><p className="text-fg-grey-500">{subtitle}</p></div>; use CellTextSubtitle.; Do not place a raw <ProgressBar/>, <Avatar/>, <Button/>, or <Label/> as the entire column render when a Cell* primitive exists for that field shape.

## Datepicker

- Category: form
- Import: `import { Datepicker } from "@forge-ui-official/core"`
- Responsive: fills-form-group
- Density: standard
- Source: `core/src/components/ui/forms/datepicker.tsx`
- Purpose: Inline date/datetime picker for forms.
- Best for: scheduled deployment time; due date; window start/end
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## FileCard

- Category: file
- Import: `import { FileCard } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/forms`
- Purpose: Evidence, attachment, document, import, and export file representation.
- Best for: evidence rails; detail attachments; audit packets; workflow documents
- Avoid for: plain text links with no file context
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## FileUpload

- Category: form
- Import: `import { FileUpload } from "@forge-ui-official/core"`
- Responsive: fills-form-group
- Density: standard
- Source: `core/src/components/ui/forms/file-upload.tsx`
- Purpose: Inline file uploader for action pages.
- Best for: evidence upload; attachment upload; import file
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## FilterPanel

- Category: filtering
- Import: `import { FilterPanel } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact-panel
- Source: `core/src/components/ui/filter-panel.tsx`
- Purpose: Compact advanced filter panel with reset, grouped controls, cancel, and apply actions.
- Best for: advanced filter popover; side filter drawer content; operational queue refinement panel
- Avoid for: always-visible first-screen list filters; simple two-control toolbar filters
- Required usage: Use ToolbarSearchInput, ToolbarSelectDropdown, ToolbarDatepicker, ToolbarPillTabs, or inline controls for first-screen filters before opening a FilterPanel.; Keep FilterPanel as an overlay or secondary refinement surface so it does not push the primary queue below the fold.; Do not use a fixed page-column card to imitate filters when a Toolbar pattern is enough.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## FullWidthTable

- Category: data-display
- Import: `import { FullWidthTable } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: dense-operational
- Source: `core/src/components/ui/data-table.tsx:801-993`
- Purpose: Full-screen data management variant of DataTable with built-in show-N rows selector.
- Best for: full-screen data management routes; audit logs
- Avoid for: narrow rail tables; embedded mini-tables
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## HighlightCard

- Category: metric-card
- Import: `import { HighlightCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: standard
- Source: `core/src/components/ui/highlight-card.tsx`
- Purpose: High-emphasis colored dashboard anchor.
- Best for: dashboard visual anchor; main signal of the day
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## HistoryGrouped

- Category: timeline
- Import: `import { HistoryGrouped } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/history-grouped.tsx`
- Purpose: Grouped HistoryItem stream with day/section separators.
- Best for: detail audit rail; long activity history
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## HistoryItem

- Category: timeline
- Import: `import { HistoryItem } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/history-item.tsx`
- Purpose: Timeline or activity stream item; variants: regular dot, badge icon, profile avatar.
- Best for: recent activity; audit trail; status changes; comments/events
- Avoid for: none recorded
- Required usage: Forbidden: Do not render the activity feed as a <ul><li> or hand-rolled card list.
- Forbidden usage: Do not render the activity feed as a <ul><li> or hand-rolled card list.

## IconSelector

- Category: form
- Import: `import { IconSelector } from "@forge-ui-official/core"`
- Responsive: fills-form-group
- Density: standard
- Source: `core/src/components/ui/forms/icon-selector.tsx`
- Purpose: Icon/color selector for configurable categories and visual labels.
- Best for: settings forms; category configuration
- Avoid for: freeform business data entry
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ImageStatCard

- Category: metric-card
- Import: `import { ImageStatCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/image-stat-card.tsx:30-102`
- Purpose: Stat card with image/media context.
- Best for: product or venue metric; visual entity KPI
- Avoid for: pure numeric dashboard rows
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## Label

- Category: status
- Import: `import { Label } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/badge.tsx`
- Purpose: Compact semantic badge for status, priority, counts, and readiness.
- Best for: status; priority; stage; risk tier; small count
- Avoid for: paragraph labels; large KPI values; entire date or numeric cell content
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## LineChartStatCard

- Category: metric-card
- Import: `import { LineChartStatCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/line-chart-stat-card.tsx:140-228`
- Purpose: Metric card with compact line trend visualization.
- Best for: dashboard trend KPI; revenue or risk movement
- Avoid for: large analytical chart panels
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ListGroup

- Category: grouped-list
- Import: `import { ListGroup } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/list-group.tsx`
- Purpose: Outlined compact grouped list with title, optional subtitle, badge, tabs, and action area.
- Best for: right rail grouped context; dashboard risk or activity rail; detail evidence or audit group
- Avoid for: primary entity queues that need sorting or pagination; large tabular datasets
- Required usage: Use ListGroup for compact secondary context, not as a replacement for the main DataTable queue.; Keep items concise; long operational rows belong in DataTable or a split-pane detail surface.; Do not wrap ListGroup in another SurfaceCard.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## MediaUpload

- Category: form
- Import: `import { MediaUpload } from "@forge-ui-official/core"`
- Responsive: fills-form-group
- Density: standard
- Source: `core/src/components/ui/forms/media-upload.tsx`
- Purpose: Media upload control for image/video inputs with Forge field styling.
- Best for: asset upload forms; profile or venue media
- Avoid for: simple text/file metadata rows
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## NotificationItem

- Category: timeline
- Import: `import { NotificationItem } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: dense-operational
- Source: `core/src/components/ui/notification-item.tsx`
- Purpose: Dense notification/activity item with tag, time, title, body, unread state, lead icon, and optional mark-read action.
- Best for: right rail activity stream; dashboard exception feed; detail audit or alert list
- Avoid for: toast notifications; primary table rows; long-form comments
- Required usage: Use inside ListGroup or another rail/list container; do not float standalone NotificationItem cards across the page.; Use title as a short operational signal and body as one-line supporting context.; For audit trails with connectors, prefer HistoryItem over NotificationItem.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## PageTitleToolbar

- Category: page-title
- Import: `import { PageTitleToolbar } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: dense-operational
- Source: `core/src/components/ui/toolbar.tsx`
- Purpose: Compact page-level title, subtitle, optional eyebrow, and left/right actions for Forge admin pages.
- Best for: dashboard page heading; list page heading with compact actions; detail or action page heading below AppLayout breadcrumbs
- Avoid for: replacing AppLayout topbar; repeating section titles inside cards
- Required usage: Use PageTitleToolbar once near the page root; nested cards and rails should use smaller component titles.; Do not use oversized hero typography for admin page titles; keep title close to sidebar/profile scale.; Do not add extra p-6 or p-8 wrappers around PageTitleToolbar when AppLayout already owns page padding.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ProfileCard

- Category: identity
- Import: `import { ProfileCard } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/profile-card.tsx`
- Purpose: Avatar + name + role identity surface for detail identity rails and team switchers.
- Best for: detail identity strip; owner/assignee rail; team picker rows
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ProgressBadge

- Category: status
- Import: `import { ProgressBadge } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:178-204`
- Purpose: Outlined small pill (green/red/grey) for change/stage indicators.
- Best for: up/down delta; stage advanced/blocked
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ProgressBar

- Category: status
- Import: `import { ProgressBar } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/progress-bar.tsx`
- Purpose: Compact visual for risk, readiness, progress, SLA pressure, or completion.
- Best for: risk score; completion; readiness; progress; SLA pressure
- Avoid for: binary status; decorative bars; inside a DataTable column (use CellProgressBar)
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ProgressStatCard

- Category: metric-card
- Import: `import { ProgressStatCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/progress-stat-card.tsx:41-146`
- Purpose: Metric card with progress visualization and delta emphasis.
- Best for: dashboard progress KPI; capacity/readiness metric
- Avoid for: row-level progress cells
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ProjectCard

- Category: work-card
- Import: `import { ProjectCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/project-card.tsx`
- Purpose: Identity-carrying project/work item card for dashboard rails and grids.
- Best for: dashboard priority work rail; project lists
- Avoid for: none recorded
- Required usage: Default width fills the parent grid/flex column; use width="fixed" only in component showcases.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## SelectOption

- Category: form
- Import: `import { SelectOption } from "@forge-ui-official/core"`
- Responsive: fills-form-group
- Density: standard
- Source: `core/src/components/ui/forms/select-option.tsx`
- Purpose: Select control for enum, owner, segment, scope, or configuration choices.
- Best for: more than four enum options; owner selector; segment selector; single or multiple scoped choices
- Avoid for: two or three binary choices that fit radio/checkbox; status filters better served by ButtonGroup
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## StatCard

- Category: metric-card
- Import: `import { StatCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/stat-card.tsx`
- Purpose: KPI card with semantic theme and optional icon/action.
- Best for: dashboard KPI strip; major status numbers; control tower top row
- Avoid for: low-frequency metadata; row-level values; detail description lists
- Required usage: Use non-white themes to encode semantics when multiple stat cards appear.; Default width fills the parent grid/flex column; use width="fixed" only in component showcases.; Use size=wide when the card needs the wide internal chart/icon layout.; Use trend / trendDirection / subtitle props instead of hand-rendered arrows.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## StatusBadge

- Category: status
- Import: `import { StatusBadge } from "@forge-ui-official/core"`
- Responsive: table-row-contained
- Density: compact
- Source: `core/src/components/ui/data-table.tsx:135-156`
- Purpose: Solid-color status pill for 1-of-N enums.
- Best for: status; severity; tier badges
- Avoid for: delta indicators (use ProgressBadge)
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## StyledLink

- Category: navigation
- Import: `import { StyledLink } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/link.tsx`
- Purpose: Low-noise navigation/action link.
- Best for: open detail; open audit log; back to parent; secondary row action
- Avoid for: primary destructive or write action; inside a DataTable column (use CellLink instead)
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## SurfaceCard

- Category: surface
- Import: `import { SurfaceCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/surface-card.tsx`
- Purpose: White outlined admin surface for grouped content, panels, rails, field groups, and compact summaries.
- Best for: field groups; right rails; evidence panels; activity panels; compact summary cards
- Avoid for: wrapping every table row; wrapping a DataTable only to add another table title
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## TaskCard

- Category: work-card
- Import: `import { TaskCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/task-card.tsx`
- Purpose: Compact task identity card with status, priority, and owner.
- Best for: dashboard priority work rail; kanban-like lane cards
- Avoid for: none recorded
- Required usage: Default width fills the parent lane/rail column; use width="fixed" only in component showcases.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## TextArea

- Category: form
- Import: `import { TextArea } from "@forge-ui-official/core"`
- Responsive: fills-form-group
- Density: standard
- Source: `core/src/components/ui/forms/text-area.tsx`
- Purpose: Long text input for notes, descriptions, resolution, and comments.
- Best for: resolution notes; root cause notes; description; comments; review notes
- Avoid for: short enum or status values
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## TextField

- Category: form
- Import: `import { TextField } from "@forge-ui-official/core"`
- Responsive: fills-form-group
- Density: standard
- Source: `core/src/components/ui/forms/text-field.tsx`
- Purpose: Single-line form input.
- Best for: name; email; phone; title; short codes; search when ToolbarSearchInput cannot be controlled
- Avoid for: long text; selectable enums; date ranges
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## Toggle

- Category: form
- Import: `import { Toggle } from "@forge-ui-official/core"`
- Responsive: content-sized
- Density: standard
- Source: `core/src/components/ui/forms/selection-control.tsx:20-58`
- Purpose: Binary switch control for enable/disable settings.
- Best for: settings toggles; boolean feature flags
- Avoid for: multi-choice radio groups
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## Toolbar

- Category: toolbar
- Import: `import { Toolbar } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact
- Source: `core/src/components/ui/toolbar.tsx:24-39`
- Purpose: Generic flex row for left/right toolbar slots above a DataTable.
- Best for: filter strip; page-title toolbar
- Avoid for: none recorded
- Required usage: Forbidden: Do not wrap the toolbar in a second SurfaceCard. Filter controls own their own borders.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: Do not wrap the toolbar in a second SurfaceCard. Filter controls own their own borders.

## ToolbarActions

- Category: toolbar
- Import: `import { ToolbarActions } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact
- Source: `core/src/components/ui/toolbar.tsx:306-320`
- Purpose: Right-aligned action container for toolbar buttons and icon controls.
- Best for: list primary actions; bulk actions; toolbar utilities
- Avoid for: form footer actions
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ToolbarDatepicker

- Category: toolbar
- Import: `import { ToolbarDatepicker } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact
- Source: `core/src/components/ui/toolbar.tsx:176-225`
- Purpose: Pill-shaped datepicker trigger for filter strips.
- Best for: list toolbar controls; queue filtering; audit/search controls
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ToolbarFilterButton

- Category: toolbar
- Import: `import { ToolbarFilterButton } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact
- Source: `core/src/components/ui/toolbar.tsx:230-273`
- Purpose: Filter trigger with Forge popover behavior for list and audit toolbars.
- Best for: advanced filters; queue filtering; audit log filters
- Avoid for: plain inline filter chips without disclosure
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ToolbarPillTabs

- Category: toolbar
- Import: `import { ToolbarPillTabs } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact
- Source: `core/src/components/ui/toolbar.tsx:371-413`
- Purpose: Segmented pill tabs (max 5) for short filter dimensions.
- Best for: list toolbar controls; queue filtering; audit/search controls
- Avoid for: none recorded
- Required usage: Forbidden: Do not cram more than 5 options; promote second high-cardinality dimension to ToolbarSelectDropdown.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: Do not cram more than 5 options; promote second high-cardinality dimension to ToolbarSelectDropdown.

## ToolbarSearchInput

- Category: toolbar
- Import: `import { ToolbarSearchInput } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact
- Source: `core/src/components/ui/toolbar.tsx:43-67`
- Purpose: Pill-shaped search input matching Forge filter strip.
- Best for: list toolbar controls; queue filtering; audit/search controls
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ToolbarSelectDropdown

- Category: toolbar
- Import: `import { ToolbarSelectDropdown } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact
- Source: `core/src/components/ui/toolbar.tsx:94-172`
- Purpose: Pill-shaped select dropdown used in filter strips.
- Best for: list toolbar controls; queue filtering; audit/search controls
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## ToolbarShowSelect

- Category: toolbar
- Import: `import { ToolbarShowSelect } from "@forge-ui-official/core"`
- Responsive: intrinsic-with-parent-wrap
- Density: compact
- Source: `core/src/components/ui/toolbar.tsx:275-304`
- Purpose: Show-N rows-per-page selector for full-screen data tables.
- Best for: list toolbar controls; queue filtering; audit/search controls
- Avoid for: none recorded
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

## WheelChartStatCard

- Category: metric-card
- Import: `import { WheelChartStatCard } from "@forge-ui-official/core"`
- Responsive: fills-parent
- Density: compact-panel
- Source: `core/src/components/ui/wheel-chart-stat-card.tsx:56-122`
- Purpose: Metric card with radial chart emphasis.
- Best for: dashboard share or completion metric; capacity mix
- Avoid for: dense list rows
- Required usage: Use Forge tokens, inherited parent width, and component props before custom markup.; Do not force fixed pixel width unless explicitly building a component showcase.
- Forbidden usage: do not rebuild existing Forge primitives with ad hoc markup

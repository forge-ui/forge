# support-ticket-sla-center

## Purpose

This is the third golden mini-app for `forge-app-design`.

It covers support operations: SLA dashboard, ticket queue, quick drawer, ticket detail workspace, kanban board, escalations, and SLA policy matrix.

## Output

- Path: `/Users/hesong/Desktop/output/ticket-system-v1`
- Domain: support / ticketing / SLA operations
- Pages: 6/6 implemented
- Entities: `Ticket`, `User`, `SLAPolicy`, `Escalation`
- Gate: `quality-eval` full run passed with `0 critical / 0 warn / 26 passed`

## Route Map

| Route | Shape | What to Learn |
|---|---|---|
| `/` | SLA command dashboard | KPI cards, priority distribution, SLA risk table |
| `/tickets` | filterable queue with drawer | multi-filter, DataTable, quick detail drawer, link to full detail |
| `/tickets/board` | ticket kanban | status lanes, SLA indicators, assignee context |
| `/tickets/[id]` | split ticket workspace | status flow, ticket context, comments, SLA right rail, quick actions |
| `/escalations` | escalation review table | escalation reason, owner context, linked tickets |
| `/sla-policies` | policy matrix | SLA thresholds by priority / category |

## Product Lessons

- Use a drawer when agents need quick context without leaving a queue.
- Keep the full detail route for deeper resolution work, comments, SLA progress, and quick actions.
- Dashboard should expose SLA risk and prioritization, not just raw counts.
- A support app benefits from both table and kanban views because agents and managers scan different dimensions.
- Page-length warnings should be treated as design feedback: extract drawer, timeline, and status-flow components.

## Files Worth Reading

- `DESIGN-BRIEF.md`
- `app/page.tsx`
- `app/tickets/page.tsx`
- `app/tickets/_components/TicketDrawer.tsx`
- `app/tickets/board/page.tsx`
- `app/tickets/[id]/page.tsx`
- `app/tickets/[id]/_components/StatusFlow.tsx`
- `app/tickets/[id]/_components/CommentsPanel.tsx`
- `app/escalations/page.tsx`
- `app/sla-policies/page.tsx`

## Known Limitation

This app is an upgraded legacy baseline. It is useful for support/SLA workflows, but its visual style is less dense than the data-quality and fulfillment golden apps.

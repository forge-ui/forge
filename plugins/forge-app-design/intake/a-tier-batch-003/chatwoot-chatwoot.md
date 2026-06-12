# chatwoot/chatwoot

- url: https://github.com/chatwoot/chatwoot
- category: support triage
- metadata: public repo target selected on 2026-06-11; GitHub API numeric metadata returned 403.

## Evidence

- Public project category: customer engagement / support inbox.
- Relevant UI class: conversation queue, contact context, SLA, assignments,
  messages, tags, and resolution.

## IA Artifact

- Inbox/list route owns queue filters, channel, assignee, priority, SLA,
  unread state, and latest message evidence.
- Conversation detail route owns message history, customer profile, related
  conversations, notes, tags, and resolution actions.
- Action routes own assign, snooze, macro/reply, close, and escalation.

## Page Pattern

- Support triage is a natural split-pane: queue on one side, conversation and
  customer context on the other.
- Right rail should show contact identity, SLA, history, related tickets, and
  next action.
- Row density matters more than decorative KPI cards.

## Business Workflow

- Agent filters priority conversations, opens one, checks customer context and
  message evidence, replies or escalates, and closes with audit feedback.

## ForgeUI Gap

- Compact conversation/message thread primitive and customer context rail.

## Borrow

- Queue + detail split-pane for fast triage.
- SLA and assignment as first-viewport signals.
- Message evidence beside resolution action.

## Reject

- Do not copy support-specific inbox chrome for every admin product.
- Do not turn non-chat detail pages into message timelines.

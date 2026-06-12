# chat-workspace

Use this pattern when the PRD has an operator/agent workspace with conversations, contextual records, and action artifacts.

Good matches:
- AI agent operations console
- support inbox with customer context
- incident war room
- approval discussion workspace
- analyst chat with generated artifacts

Do not use it for:
- simple notification feeds
- static audit logs
- CRUD detail pages where conversation is secondary

## Files

- `BRIEF.md` — Page Intent Spec example for Step 2.5.
- `page.tsx` — workspace orchestration and message state.
- `utils.ts` — conversation/message/context types and seed data.
- `_components/ConversationList.tsx` — left inbox with filters and badges.
- `_components/MessageThread.tsx` — message stream and system events.
- `_components/Composer.tsx` — input + send state.
- `_components/ContextPanel.tsx` — right-side record context and next action.
- `_components/ArtifactPanel.tsx` — generated summary/checklist/artifact block.

## Adaptation Rules

1. Replace `ConversationRecord` with the PRD domain, for example `SupportCase`, `IncidentRoom`, or `AgentSession`.
2. Keep three-pane density when the primary task needs conversation plus context.
3. Every message send must update local state or call a mock API; never leave send empty.
4. Context panel must link to another route or action surface.
5. Put custom visual details inside `_components/`, not in `page.tsx`.

## Acceptance

- User can switch conversations.
- User can send a message and see pending/sent state.
- Right panel shows business context, not placeholder text.
- At least one context action links to another route.
- `page.tsx` has no inline `style={{ ... }}` or hex literals.

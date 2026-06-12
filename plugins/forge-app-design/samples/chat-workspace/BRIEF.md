# Page Intent Spec Example

```yaml
- id: agent-workspace
  route: /workspace
  layout_intent: three-pane-chat-with-context-actions
  detail_surface: split-pane
  user_goal: Operator handles a conversation while keeping case context and generated artifacts visible.
  primary_decision: What reply or workflow action should happen next, given the latest context and artifacts?
  primary_action: Send a reply or open the linked workflow record.
  secondary_context:
    - conversation inbox with unread and priority signals
    - message thread with user / agent / system events
    - context panel with owner, SLA, status, and linked records
    - artifact panel with generated summary or checklist
  states_required: [loading, empty, hover, sending, sent, error]
  must_have_extras: [conversation_switching, send_state, context_action_link, generated_artifact]
  component_plan:
    components:
      - ConversationList
      - MessageThread
      - Composer
      - ContextPanel
      - ArtifactPanel
    helpers: [CONVERSATIONS, seedMessages, priorityColor, statusColor]
    local_state: [activeId, conversations, messagesByConversation, draft, sendState]
```

Replace conversation, context, and artifact fields with the PRD domain. Keep the three-pane workflow shape.

# Fresh PRD: AI Workflow Support Operations Console

## functional_module_map

- module_id: ops-control-tower
  entry_route: /fresh-prd-ai-workflow-support-ops-001/operations
  entry_surface: dashboard control tower
  primary_data_object: incident risk, provider route, workflow run, support ticket, evidence packet
  business_flow: source incident -> risk state transition -> linked workflow/support/evidence route -> next workflow closure
  data_flow: reads provider route logs, workflow run state, SLA tickets, datasource freshness; writes owner assignment, recovery action draft, audit note; derived risk, impact scope, readiness, evidence freshness; refresh_after_action updates risk queue and activity history
  field_model: KPI metric fields, risk queue fields, owner, state, impact, evidence, next_action, activity; actions open recovery, refresh evidence, advance run, open ticket
  next_workflow: operations risk -> workflow detail -> support ticket -> evidence packet -> recovery action
- module_id: workflow-recovery
  entry_route: /fresh-prd-ai-workflow-support-ops-001/workflows
  entry_surface: kanban workflow board
  primary_data_object: workflow run, draft version, active version, retry state, root cause, owner
  business_flow: run draft/active/failed/retrying lifecycle -> diagnostic detail -> guarded recovery action -> audit history
  data_flow: reads workflow graph state and run history; writes retry, advance, owner, recovery note; derived progress, root cause, retry readiness; refresh_after_action updates board cards and detail rail
  field_model: lane_fields, card_fields, status, owner, next_action, progress, diagnostic, detail_link; card_actions advance, open detail, retry
  next_workflow: failed card -> detail -> recovery action
- module_id: workflow-run-detail
  entry_route: /fresh-prd-ai-workflow-support-ops-001/workflows/[runId]
  entry_surface: split-pane detail
  primary_data_object: workflow run, root cause, impact, related ticket, evidence packet, timeline
  business_flow: failed run lifecycle -> identity/header diagnosis -> evidence/root cause/impact review -> support or recovery next workflow
  data_flow: reads run history, evidence packet, ticket relation, and audit events; writes comment, support link, recovery request, and audit note; derived impact scope and retry readiness refresh_after_action updates timeline and related routes
  field_model: detail_fields identity, header, sections, overview, root_cause, impact, evidence, related, history, timeline, audit, comments, attachments, next_workflow
  screen_contract: split_pane detail_sections with identity/header, evidence rail, root-cause section, impact section, timeline, audit trail, and next workflow actions
  next_workflow: detail diagnosis -> support ticket or guarded recovery action
- module_id: support-triage
  entry_route: /fresh-prd-ai-workflow-support-ops-001/support
  entry_surface: dense table queue
  primary_data_object: support ticket, customer, SLA, priority, stage, related workflow run
  business_flow: customer ticket intake -> assigned/waiting/resolved state -> related workflow evidence -> customer update
  data_flow: reads ticket queue and workflow relation; writes assignment, stage update, customer note; derived SLA risk and related run status; refresh_after_action updates table and audit
  field_model: table_fields ticket, customer, priority, SLA, stage, related run; filters priority/stage/SLA; row_actions open ticket, open related run
  next_workflow: high SLA ticket -> workflow detail or recovery action
- module_id: evidence-governance
  entry_route: /fresh-prd-ai-workflow-support-ops-001/evidence
  entry_surface: settings/evidence dashboard
  primary_data_object: evidence source, datasource sync task, export packet, freshness, owner
  business_flow: evidence source read -> freshness check -> export readiness -> packet audit
  data_flow: reads source status and freshness; writes refresh event and export packet; derived readiness, lagging source, export block reason; refresh_after_action updates card states and export eligibility
  field_model: setting fields source, freshness, state, owner, export status, audit; actions refresh evidence, export packet
  next_workflow: stale source -> recovery action
- module_id: recovery-action
  entry_route: /fresh-prd-ai-workflow-support-ops-001/recovery/new
  entry_surface: action form with right context
  primary_data_object: recovery action, fallback provider, SOP, support ticket, audit note, rollback
  business_flow: preflight impact -> guarded save -> workflow retry -> support notification -> rollback/audit closure
  data_flow: reads incident, provider capacity, ticket, evidence; writes recovery draft, audit event, retry request; derived preflight result and rollback scope; refresh_after_action updates operations, workflow, support, and evidence routes
  field_model: form_fields incident, owner, fallback provider, related ticket, SOP; right_context preflight, impact, confirmation, audit, rollback; actions save, cancel
  next_workflow: save recovery -> operations control tower

- id: ops-control-tower
  route: /fresh-prd-ai-workflow-support-ops-001/operations
  page_role: dashboard
  layout_intent: control-tower dashboard
  user_goal: See AI workflow support health, root cause risk, impact scope, evidence freshness, and next workflow in one operational surface.
  primary_decision: Decide which incident needs recovery based on risk state, downstream ticket impact, evidence freshness, and owner readiness.
  primary_action: Open recovery action or drill into linked workflow/support/evidence route.
  secondary_context: provider route log, workflow run state, support SLA, evidence packet, activity history, similar incident.
  business_flow: lifecycle source incident -> watchlisted/blocked/recovering status -> priority queue -> next workflow route; upstream provider/workflow/support/evidence signals and downstream recovery/support notification are visible.
  data_flow: reads provider route log, workflow run history, ticket SLA, datasource freshness; writes owner assignment, evidence refresh, recovery draft; derived risk score, impact scope, readiness, refresh_after_action on every action.
  field_model: fields KPI metric, trend, risk, priority, task, activity, entry queue, owner, status, evidence, next_action; dashboard queue fields include row identity and action buttons.
  layout_decision: dashboard first_viewport has KPI cards, risk queue table, activity rail, and drill entry links; no decorative hero or copied upstream menu.
  action_design: primary open recovery action and drill queue item; secondary refresh evidence, advance run, open ticket; feedback has saving, saved, pending, disabled and audit states.
  component_plan: AppLayout, StatCard, DataTable, StatusBadge, SurfaceCard, Button.
  precedent_refs:
    - ai-admin-operations-protask
    - dashboard-control-tower-protask
    - ai-gateway-operations
  reference_usage: Recall: reference-example tier plus AI admin operations and dashboard-control-tower density for layout-pattern, business-flow, field-model, and component-composition. Adapt: provider/route/dashboard control tower becomes this PRD incident risk queue, evidence freshness, and recovery entry. Avoid-copy: source routes, menus, labels, visuals, mock data, and source page hierarchy stay out.
  business_pattern_refs:
    - ai-gateway-model-routing
    - agent-collaboration-operations
  business_pattern_usage: Recall: QuantumNous/new-api channel provider list and request log replay plus bytedance/deer-flow agent run control tower screen contracts. Adapt: map fields, actions, data_flow, and screenContractRefs to incident risk, owner, evidence freshness, and recovery next workflow for this PRD. Avoid-copy: route names, chat layout, field names, mock data, menus, and visual structure.
  dataset_refs:
    - higress-group-higress
    - dataease-dataease
  module_contract_refs:
    - higress-group-higress__l3src-ai-provider
    - dataease-dataease__l3src-zh-1tc7832
  adaptation_notes: Map Higress AI provider and DataEase dashboard contracts to current PRD incident risk and evidence readiness; rename upstream objects and reshape dashboard queue for support operations.
  avoid_copy: Do not copy source project menus, route tree, field names, code, screenshots, chart layout, or visual structure.

- id: workflow-recovery-board
  route: /fresh-prd-ai-workflow-support-ops-001/workflows
  page_role: workflow
  layout_intent: kanban workflow board
  user_goal: Manage failed, retrying, active, and draft automation runs with next actions and diagnostics.
  primary_decision: Decide whether a run should advance, retry, open detail, or wait for evidence.
  primary_action: Advance run card or open diagnostic detail.
  secondary_context: root cause, owner, progress, related ticket, evidence, audit history.
  business_flow: lifecycle draft -> active -> failed/retrying -> recovered; upstream trigger is workflow run state and downstream is recovery action or support update.
  data_flow: reads workflow graph, run history, tool evidence; writes advance/retry/action note; derived progress and root cause; refresh_after_action updates lane and card state.
  field_model: fields lane_fields, card_fields, board_fields, status, owner, next_action, progress, diagnostic, root_cause; card_actions advance, retry, open detail.
  layout_decision: workflow board uses lanes, cards, progress, diagnostic text, detail links, and empty lane structure in first_viewport.
  action_design: primary advance run card; secondary open detail and retry; row/card actions open diagnostic, retry, and assign owner; bulk action stays disabled unless same-lane runs are selected; feedback shows loading, saved, error, success, guard, and audit note.
  component_plan: SurfaceCard lanes, ProgressBar, StatusBadge, Button, Link.
  precedent_refs:
    - ai-admin-operations-protask
    - kanban-workflow-protask
    - content-moderation-kanban-fresh-validation
  reference_usage: Recall: content-moderation-kanban-fresh-validation tier=fresh-validation-proof useFor=acceptance-proof plus kanban-workflow same-role pattern for lane/card density, progress signals, card actions, and validation evidence. Adapt: moderation board proof becomes AI workflow recovery lanes and diagnostic cards for the current PRD. Avoid-copy: source moderation labels, route tree, visual structure, and mock records.
  business_pattern_refs:
    - agent-collaboration-operations
  business_pattern_usage: Recall: bytedance/deer-flow run diagnostics detail, tool audit log, and agent run control tower screen contracts. Adapt: map screenContractRefs, lane_fields, card_fields, actions, and data_flow to automation run recovery in this PRD. Avoid-copy: DeerFlow chat layout, routes, fields, labels, mock data, and source navigation.
  dataset_refs:
    - n8n-io-n8n
    - github__github-com-activepieces-activepieces
  module_contract_refs:
    - n8n-io-n8n__l3src-zh-4ht6zo
    - github__github-com-activepieces-activepieces__l3src-zh-aunbhw
  adaptation_notes: Adapt dataset module contracts from n8n and Activepieces source projects to draft/active/failed/retrying board states with current PRD support recovery language.
  avoid_copy: Do not copy n8n or Activepieces canvas, menus, node UI, field names, route tree, mock data, or code.

- id: workflow-run-detail
  route: /fresh-prd-ai-workflow-support-ops-001/workflows/[runId]
  page_role: detail
  layout_intent: split-pane detail
  user_goal: Inspect one failed run with root cause, impact, related entities, evidence, timeline, and next workflow.
  primary_decision: Decide whether the run can retry with fallback or needs support/customer escalation.
  primary_action: Open linked support ticket or recovery action.
  secondary_context: evidence, missing items, root cause, impact, related ticket, history, audit, comments, attachments.
  business_flow: lifecycle failed run -> detail diagnosis -> evidence validation -> next workflow link; upstream run history and downstream support/recovery closure are shown.
  data_flow: reads run detail, evidence packet, ticket relation, audit history; writes comment, support link, recovery request; derived root cause, impact scope, next action; refresh_after_action updates timeline.
  field_model: fields detail_fields identity, header, sections, root_cause, impact, evidence, timeline, history, audit, comments, attachments, related, next_workflow.
  layout_decision: detail uses split_pane with identity/header, root cause sections, right_rail evidence, activity and comments, and next_workflow actions.
  action_design: primary open linked ticket; secondary open recovery, back to board, add comment; feedback includes loading, saved, error, success, audit.
  component_plan: SurfaceCard, Button, DetailRail, Link.
  precedent_refs:
    - ai-admin-operations-protask
    - split-pane-triage-protask
    - ai-gateway-operations
  reference_usage: Recall: ai-gateway-operations tier=reference-example useFor=layout-pattern plus AI admin operations and split-pane triage same-role patterns for evidence, root cause, impact, history, audit trail, and next workflow detail layout. Adapt: gateway evidence detail becomes failed workflow run diagnosis for this PRD. Avoid-copy: source page structure, routes, labels, trace UI, screenshots, and mock data.
  business_pattern_refs:
    - agent-collaboration-operations
  business_pattern_usage: Recall: bytedance/deer-flow run diagnostics detail, tool audit log, and generated artifact review screen contracts. Adapt: map screenContractRefs to current detail_fields, evidence sections, data_flow, next workflow actions, and audit trail. Avoid-copy: chat layout, source routes, raw trace UI, field labels, and mock data.
  dataset_refs:
    - n8n-io-n8n
    - github__github-com-activepieces-activepieces
  module_contract_refs:
    - n8n-io-n8n__l3src-zh-szgim2
    - github__github-com-activepieces-activepieces__l3src-webhook-trigger
  adaptation_notes: Adapt workflow execution history and run lifecycle contracts into support-focused diagnostics, not source canvas replication.
  avoid_copy: Do not copy upstream workflow node layout, route names, field labels, comments, code, or screenshots.

- id: support-triage-queue
  route: /fresh-prd-ai-workflow-support-ops-001/support
  page_role: list
  layout_intent: rich-entity-list support queue
  user_goal: Triage support tickets with SLA watch, customer context, linked workflow run, and next action.
  primary_decision: Decide which ticket should be assigned, escalated, updated, or linked to recovery.
  primary_action: Open ticket row or related workflow run.
  secondary_context: customer, priority, SLA, stage, related run, evidence, audit history, saved views.
  business_flow: lifecycle ticket new -> assigned -> waiting/resolved; upstream customer intake and downstream workflow/evidence/recovery links are visible.
  data_flow: reads ticket list and related workflow; writes stage/assignment/customer note; derived SLA risk and freshness; refresh_after_action updates table and history.
  field_model: fields list_fields table_fields columns row_identity customer priority SLA status risk evidence timestamp freshness row_action bulk action buttons filters search sort tabs saved_views.
  layout_decision: list uses dense table_or_card table, filters/search/sort, pagination, row actions, first_viewport SLA watch, and right rail context.
  action_design: primary row_action open ticket; secondary bulk assign, filter, open related run; feedback includes disabled, loading, saved, error, success.
  component_plan: DataTable, StatusBadge, Button, SurfaceCard, Link.
  precedent_refs:
    - ai-admin-operations-protask
    - rich-entity-list-protask
    - ai-gateway-operations
  reference_usage: Recall: ai-gateway-operations tier=reference-example useFor=field-model plus AI admin operations and rich-entity-list same-role density for compact filters, first-viewport queue rows, row identity, evidence, SLA/risk, and row actions. Adapt: operational queue density becomes support ticket triage for this PRD. Avoid-copy: source navigation, route tree, field labels, sample customers, and visual structure.
  business_pattern_refs:
    - agent-collaboration-operations
  business_pattern_usage: Recall: bytedance/deer-flow human-in-the-loop and trace diagnostics contractUse plus screen contracts. Adapt: map row fields, row actions, SLA state, related workflow run, and data_flow into the current support triage table. Avoid-copy: field names, chat structure, route tree, mock records, and source navigation.
  dataset_refs:
    - github__github-com-oca-helpdesk
    - n8n-io-n8n
  module_contract_refs:
    - github__github-com-oca-helpdesk__l3src-zh-1ucyypt
    - n8n-io-n8n__l3src-zh-4ht6zo
  adaptation_notes: Adapt OCA Helpdesk ticket lifecycle and n8n workflow relation into a compact support queue for this PRD.
  avoid_copy: Do not copy Odoo/OCA XML views, menus, exact field labels, route tree, source layout, or code.

- id: evidence-command-center
  route: /fresh-prd-ai-workflow-support-ops-001/evidence
  page_role: settings
  layout_intent: settings evidence governance
  user_goal: Validate datasource freshness, evidence readiness, export packet eligibility, and audit ownership.
  primary_decision: Decide whether evidence can be exported or which source needs refresh.
  primary_action: Refresh evidence or export packet.
  secondary_context: datasource sync, provider log, support comments, workflow history, owner, audit.
  business_flow: lifecycle source read -> freshness ready/lagging -> export packet ready/blocked -> audit closure; upstream sources and downstream recovery route are linked.
  data_flow: reads evidence source status and freshness; writes refresh event and export packet; derived readiness and blocked reason; refresh_after_action updates cards and export state.
  field_model: fields setting config policy credential scope audit source freshness state owner export_status data_flow refresh; actions refresh, export.
  layout_decision: settings page uses evidence cards, datasource freshness panel, export action area, audit context, and no copied BI canvas.
  action_design: primary export packet; secondary refresh evidence; feedback includes disabled, loading, saving, saved, error, success, confirmation.
  component_plan: SurfaceCard, StatusBadge, Button, evidence cards.
  precedent_refs:
    - ai-admin-operations-protask
    - action-form-protask
  reference_usage: Recall: AI admin operations plus settings same-role action-form precedent for governed configuration, audit context, readiness checks, and guarded actions. Adapt: evidence freshness and export readiness become this PRD settings/governance surface. Avoid-copy: source document layout, BI canvas, DataEase menus, route names, labels, screenshots, and mock data.
  business_pattern_refs:
    - rag-dataset-retrieval
  business_pattern_usage: Recall: 1Panel-dev/MaxKB Dataset ingestion, Chunk citation review, Retrieval testing, and Document vectorization diagnostics screen contracts. Adapt: map screenContractRefs to evidence source freshness, export readiness, owner, audit state, refresh action, and blocked reason for this PRD. Avoid-copy: MaxKB menus, routes, field names, mock data, and visual hierarchy.
  dataset_refs:
    - dataease-dataease
    - github__github-com-dataease-dataease
  module_contract_refs:
    - dataease-dataease__l3src-zh-876n4k
    - dataease-dataease__l3src-zh-5stzli
  adaptation_notes: Adapt DataEase datasource and dataset contracts to evidence governance for the current PRD; rename tables, snapshots, and sync states to source/evidence language.
  avoid_copy: Do not copy DataEase menus, package names, dashboard layout, field labels, source code, or screenshots.

- id: recovery-action-form
  route: /fresh-prd-ai-workflow-support-ops-001/recovery/new
  page_role: action
  layout_intent: action-form with right context
  user_goal: Create a guarded recovery action with fallback provider, SOP, related ticket, preflight impact, audit, and rollback.
  primary_decision: Decide if the recovery action is safe to save and execute.
  primary_action: Save recovery draft.
  secondary_context: incident, owner, fallback provider, related ticket, impact, confirmation, audit, rollback.
  business_flow: lifecycle preflight -> draft -> saved -> retry/support notification -> rollback/audit closure; upstream incident/evidence and downstream operations refresh are visible.
  data_flow: reads incident, provider capacity, ticket, evidence; writes recovery draft, audit event, retry request; derived preflight result and impact; refresh_after_action updates operations, workflow, support, evidence.
  field_model: fields action_fields form_fields input_fields required optional grouped sections incident owner fallback provider related ticket SOP; right_context preflight impact confirmation audit affected rollback.
  layout_decision: action form uses grouped form fields, right_context preflight/impact/confirmation/audit/rollback, save/cancel action footer.
  action_design: primary save recovery submit; secondary cancel and rollback context; feedback disabled, loading, saving, saved, error, success, confirm, preflight guard.
  component_plan: TextField, TextArea, Button, SurfaceCard.
  precedent_refs:
    - ai-admin-operations-protask
    - action-form-protask
    - ai-gateway-operations
  reference_usage: Recall: ai-gateway-operations tier=reference-example useFor=component-composition plus AI admin operations and action-form same-role precedent for grouped fields, right preflight rail, guarded submit feedback, and audit closure. Adapt: gateway fallback and policy action become current PRD recovery draft with provider, SOP, ticket, preflight, and rollback. Avoid-copy: source form labels, layout, route tree, menu order, and mock values.
  business_pattern_refs:
    - ai-gateway-model-routing
  business_pattern_usage: Recall: QuantumNous/new-api fallback policy, API key quota, request replay, and admin audit contracts. Adapt: map screenContractRefs to current recovery form fields, right_context, guarded save action, rollback, audit note, and data_flow. Avoid-copy: New API route names, menus, fields, mock data, source layout, and screenshots.
  dataset_refs:
    - higress-group-higress
    - github__github-com-activepieces-activepieces
  module_contract_refs:
    - higress-group-higress__l3src-ai-provider
    - github__github-com-activepieces-activepieces__l3src-zh-aunbhw
  adaptation_notes: Adapt provider fallback and workflow publication lifecycle into guarded recovery save flow for this PRD.
  avoid_copy: Do not copy Higress or Activepieces route tree, menu ordering, exact field names, code, visual layout, screenshots, or sample data.

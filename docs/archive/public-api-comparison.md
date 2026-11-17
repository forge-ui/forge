# 主分支与迁移版本 API 对照

基准 main：e9349f17bffbfb654144b9155d9c7a1455a470ed。当前 HEAD：1da58dc7fffb9592acdef1bb84b224bd20d5e474，包含本地未提交源码。

通过 TypeScript 编译器解析 core 根入口的公开组件与实际参数类型，包含继承属性。以下是静态接口核对，不代表行为、示例或浏览器验收通过。类型文字变化需人工判断是否为破坏性修改。

## 智能体与聊天相关组件

| 组件 | main 参数数 | 当前参数数 | 新增参数 | 删除参数 | 类型变化 |
|---|---:|---:|---|---|---|
| ChatBubble | 22 | 22 | — | — | — |
| ChatInputBar | 62 | 62 | — | — | — |
| TopBar | 3 | 3 | — | — | — |
| PageTitleToolbar | 13 | 13 | — | — | — |
| AppLayout | 50 | 50 | — | — | — |
| AskAi | 29 | 29 | — | — | — |
| ThinkingTrace | 11 | 11 | — | — | — |
| StreamingAnswer | 16 | 16 | — | — | — |
| ApprovalCard | 11 | 11 | — | — | — |
| ToolChips | 11 | 11 | — | — | — |
| AgentTaskRows | 5 | 5 | — | — | — |
| ContextCards | 6 | 6 | — | — | — |
| RecommendationCard | 12 | 12 | — | — | — |
| AgentDiffTable | 11 | 11 | — | — | — |
| AgentCodeBlock | 15 | 15 | — | — | — |
| InsightCards | 8 | 8 | — | — | — |
| CommandSearch | 12 | 12 | — | — | — |
| AgentFlowchart | 10 | 10 | — | — | — |
| Conversation | 6 | 6 | — | — | — |
| AgentMessage | 7 | 7 | — | — | — |
| MessageActions | 7 | 11 | versions, onEdit, feedbackReasons, onFeedbackReason | — | labels |
| PromptSuggestions | 5 | 5 | — | — | — |
| ArtifactCard | 9 | 9 | — | — | — |
| AgentParts | 8 | 8 | — | — | — |
| ThinkingIndicator | 0 | 7 | label, phases, phaseDuration, startedAt, locale, size, className | — | — |
| Reasoning | 0 | 12 | status, text, steps, startedAt, duration, label, doneLabel, open, onOpenChange, locale, size, className | — | — |
| ToolCall | 0 | 19 | name, title, summary, status, args, result, error, startedAt, duration, icon, onRetry, approvalReason, onApprove, onDeny, defaultOpen, variant, locale, size, className | — | — |
| ToolCallGroup | 0 | 7 | children, label, count, status, defaultOpen, locale, className | — | — |
| Question | 0 | 10 | questions, onSubmit, onCancel, answers, confirm, disabled, submitLabel, locale, size, className | — | — |
| ChoiceCard | 0 | 9 | title, options, multiple, allowText, disabled, answered, onAnswer, onCancel, locale | — | — |
| Approval | 0 | 19 | title, description, requester, risk, fields, preview, scopes, state, result, onApprove, onDeny, askDenyReason, expiresIn, onExpire, approveLabel, denyLabel, locale, size, className | — | — |
| ConfirmCard | 0 | 10 | title, fields, body, confirmLabel, cancelLabel, state, result, onConfirm, onCancel, locale | — | — |
| Citation | 0 | 4 | source, active, onActiveChange, locale | — | — |
| CitedAnswer | 0 | 6 | text, sources, hideSourceList, locale, size, className | — | — |
| PromptQueue | 0 | 7 | items, onRemove, onEdit, onSendNow, onMove, locale, className | — | — |
| RunControls | 0 | 12 | status, activity, startedAt, duration, error, onStop, onResume, onRetry, onDismiss, onSteer, locale, className | — | — |
| AttachmentList | 0 | 6 | items, onRemove, onRetry, onOpen, locale, className | — | — |
| AgentWelcome | 0 | 8 | title, description, icon, capabilities, onPick, footer, size, className | — | — |
| AgentPanel | 0 | 14 | title, open, onOpenChange, launcher, launcherLabel, empty, followKey, children, onNewChat, sessions, currentSessionId, onSelectSession, notice, composer | — | — |
| AgentPlan | 0 | 12 | title, description, steps, mode, onChange, onApprove, onCancel, onRetryFrom, approveLabel, locale, size, className | — | — |
| AgentTrail | 0 | 5 | title, steps, collapseAfter, locale, className | — | — |
| RunProgress | 0 | 2 | steps, locale | — | — |
| ChangeLedger | 0 | 5 | entries, title, onUndo, locale, className | — | — |
| AgentCheckpoints | 0 | 5 | checkpoints, currentId, onRewind, locale, className | — | — |
| AutonomySelector | 0 | 5 | value, onChange, actions, locale, className | — | — |
| AgentInbox | 0 | 8 | tasks, title, onApprove, onReject, onRetry, onOpen, locale, className | — | — |
| RunningNow | 0 | 4 | tasks, onOpen, locale, className | — | — |
| AwaySummary | 0 | 5 | awayFor, items, onDismiss, locale, className | — | — |
| ContextUsage | 0 | 9 | segments, limit, cost, currency, onRemove, onCompact, variant, locale, className | — | — |
| TraceWaterfall | 0 | 7 | spans, now, selectedId, onSelect, currency, locale, className | — | — |
| AgentTree | 0 | 6 | root, selectedId, onSelect, currency, locale, className | — | — |
| AgentLanes | 0 | 6 | lanes, blocks, now, onSelect, locale, className | — | — |

## 全部公开组件

| 组件 | main 参数数 | 当前参数数 | 新增参数 | 删除参数 | 类型变化 |
|---|---:|---:|---|---|---|
| NotificationBadge | 2 | 2 | — | — | — |
| Label | 4 | 4 | — | — | — |
| CircleIcon | 4 | 4 | — | — | — |
| ArtisticIcon | 3 | 3 | — | — | — |
| Button | 305 | 305 | — | — | — |
| PlusIcon | 1 | 1 | — | — | — |
| CloseIcon | 1 | 1 | — | — | — |
| CheckIcon | 1 | 1 | — | — | — |
| IconButton | 297 | 297 | — | — | — |
| StyledLink | 9 | 9 | — | — | — |
| ProgressBar | 14 | 14 | — | — | — |
| Checkbox | 289 | 289 | — | — | — |
| Checklist | 8 | 8 | — | — | — |
| ChecklistItem | 10 | 10 | — | — | — |
| Avatar | 6 | 6 | — | — | — |
| AvatarGroup | 2 | 2 | — | — | — |
| SurfaceCard | 287 | 287 | — | — | — |
| StatCard | 18 | 18 | — | — | — |
| ProjectCard | 13 | 13 | — | — | — |
| TaskCard | 14 | 14 | — | — | — |
| UserCard | 11 | 11 | — | — | — |
| ProgressStatCard | 15 | 15 | — | — | — |
| LineChartStatCard | 18 | 18 | — | — | — |
| WheelChartStatCard | 13 | 13 | — | — | — |
| BarChartStatCard | 12 | 12 | — | — | — |
| BalanceCard | 14 | 14 | — | — | — |
| DebitCard | 9 | 9 | — | — | — |
| CreditCard | 10 | 10 | — | — | — |
| ImageStatCard | 16 | 16 | — | — | — |
| HighlightCard | 8 | 8 | — | — | — |
| ProgressCard | 10 | 10 | — | — | — |
| ActivityCard | 8 | 8 | — | — | — |
| ContactItem | 11 | 11 | — | — | — |
| ChatBubble | 22 | 22 | — | — | — |
| ChatInputBar | 62 | 62 | — | — | — |
| CommentItem | 9 | 9 | — | — | — |
| ReviewItem | 14 | 14 | — | — | — |
| FilterGroup | 5 | 5 | — | — | — |
| FilterTrigger | 6 | 6 | — | — | — |
| FilterPanel | 10 | 10 | — | — | — |
| HistoryItem | 11 | 11 | — | — | — |
| HistoryGrouped | 8 | 8 | — | — | — |
| EventTag | 7 | 7 | — | — | — |
| CalendarDayCell | 9 | 9 | — | — | — |
| CalendarWeekRow | 3 | 3 | — | — | — |
| EventCard | 7 | 7 | — | — | — |
| SmallCalendar | 7 | 7 | — | — | — |
| SmallDailyCalendar | 7 | 7 | — | — | — |
| FullCalendar | 12 | 12 | — | — | — |
| MeterChart | 6 | 6 | — | — | — |
| HalfDonutChart | 7 | 7 | — | — | — |
| DashedHalfDonutChart | 7 | 7 | — | — | — |
| DonutChart | 14 | 14 | — | — | — |
| PieChart | 4 | 4 | — | — | — |
| MultilayerDonutChart | 10 | 10 | — | — | — |
| BubbleChart | 3 | 3 | — | — | — |
| BarChart | 19 | 19 | — | — | — |
| BarHorizontalChart | 15 | 15 | — | — | — |
| BarUpsideDownChart | 12 | 12 | — | — | — |
| SmoothLineChart | 18 | 18 | — | — | — |
| ChartTooltip | 2 | 2 | — | — | — |
| ChartCard | 10 | 10 | — | — | — |
| ChartListItem | 7 | 7 | — | — | — |
| ChartLegendItem | 5 | 5 | — | — | — |
| ChartValueRow | 5 | 5 | — | — | — |
| ChartStatFooter | 2 | 2 | — | — | — |
| ListItem | 12 | 12 | — | — | — |
| DescriptionItem | 5 | 5 | — | — | — |
| ListGroup | 13 | 13 | — | — | — |
| MapCard | 9 | 9 | — | — | — |
| MenuItem | 15 | 15 | — | — | — |
| DropdownPanel | 5 | 5 | — | — | — |
| IconTrigger | 15 | 15 | — | — | — |
| ProfileCard | 8 | 8 | — | — | — |
| NotificationItem | 10 | 10 | — | — | — |
| KebabMenu | 6 | 6 | — | — | — |
| SidebarMenu | 16 | 16 | — | — | — |
| TextField | 323 | 323 | — | — | — |
| TextArea | 301 | 301 | — | — | — |
| SelectOption | 15 | 15 | — | — | — |
| MediaUpload | 8 | 8 | — | — | — |
| ProfileImgUpload | 6 | 6 | — | — | — |
| FileUpload | 9 | 9 | — | — | — |
| FileCard | 6 | 6 | — | — | — |
| FileTypeIcon | 3 | 3 | — | — | — |
| Datepicker | 18 | 18 | — | — | — |
| Toggle | 10 | 10 | — | — | — |
| RadioButton | 5 | 5 | — | — | — |
| RadioWithLabel | 9 | 9 | — | — | — |
| CheckboxControl | 289 | 289 | — | — | — |
| CheckboxWithLabel | 11 | 11 | — | — | — |
| IconSelector | 8 | 8 | — | — | — |
| IconPicker | 6 | 6 | — | — | — |
| ColorPicker | 4 | 4 | — | — | — |
| TextFieldSelectSuffix | 5 | 5 | — | — | — |
| ConfirmationDialog | 13 | 13 | — | — | — |
| Tooltip | 8 | 8 | — | — | — |
| TooltipBubble | 3 | 3 | — | — | — |
| TooltipAnchor | 290 | 290 | — | — | — |
| TooltipGroup | 3 | 3 | — | — | — |
| PageDot | 5 | 5 | — | — | — |
| Pagination | 7 | 7 | — | — | — |
| Stepper | 9 | 9 | — | — | — |
| TabBar | 9 | 9 | — | — | — |
| ButtonGroup | 8 | 8 | — | — | — |
| TopBar | 3 | 3 | — | — | — |
| PageHeader | 56 | 56 | — | — | — |
| Breadcrumbs | 4 | 4 | — | — | — |
| Toolbar | 6 | 6 | — | — | — |
| ToolbarSearchInput | 7 | 7 | — | — | — |
| ToolbarSelectDropdown | 8 | 8 | — | — | — |
| ToolbarDatepicker | 5 | 5 | — | — | — |
| ToolbarFilterButton | 4 | 4 | — | — | — |
| ToolbarShowSelect | 5 | 5 | — | — | — |
| ToolbarActions | 2 | 2 | — | — | — |
| ToolbarKebabButton | 3 | 3 | — | — | — |
| ToolbarFavoriteButton | 2 | 2 | — | — | — |
| ToolbarPillTabs | 5 | 5 | — | — | — |
| PageTitleToolbar | 13 | 13 | — | — | — |
| CurrencyConverter | 20 | 20 | — | — | — |
| RatingStars | 11 | 11 | — | — | — |
| ImageGrid | 5 | 5 | — | — | — |
| ProductRow | 5 | 5 | — | — | — |
| TableCell | 10 | 10 | — | — | — |
| DataTable | 28 | 28 | — | — | — |
| FullWidthTable | 33 | 33 | — | — | — |
| StatusBadge | 3 | 3 | — | — | — |
| ProgressBadge | 2 | 2 | — | — | — |
| CellText | 1 | 1 | — | — | — |
| CellTextSubtitle | 2 | 2 | — | — | — |
| CellMuted | 1 | 1 | — | — | — |
| CellImageText | 4 | 4 | — | — | — |
| CellProgressValue | 4 | 4 | — | — | — |
| CellKebabMenu | 1 | 1 | — | — | — |
| CellStatusDot | 3 | 3 | — | — | — |
| CellNumber | 6 | 6 | — | — | — |
| CellProgressBar | 3 | 3 | — | — | — |
| CellCode | 1 | 1 | — | — | — |
| CellRating | 2 | 2 | — | — | — |
| CellFile | 3 | 3 | — | — | — |
| CellActions | 5 | 5 | — | — | — |
| CellLink | 3 | 3 | — | — | — |
| CardGlow | 1 | 1 | — | — | — |
| CardTrend | 4 | 4 | — | — | — |
| CardIconChip | 5 | 5 | — | — | — |
| CardKebabButton | 2 | 2 | — | — | — |
| CardAvatarGroup | 4 | 4 | — | — | — |
| StatCardShell | 16 | 16 | — | — | — |
| FinancialOrbs | 2 | 2 | — | — | — |
| ColorSwatch | 4 | 4 | — | — | — |
| ColorSection | 4 | 4 | — | — | — |
| TypefaceBlock | 2 | 2 | — | — | — |
| TypographyWeightSample | 3 | 3 | — | — | — |
| TypographySizeRow | 3 | 3 | — | — | — |
| AppLayout | 50 | 50 | — | — | — |
| AskAi | 29 | 29 | — | — | — |
| ThinkingTrace | 11 | 11 | — | — | — |
| StreamingAnswer | 16 | 16 | — | — | — |
| ApprovalCard | 11 | 11 | — | — | — |
| ToolChips | 11 | 11 | — | — | — |
| AgentTaskRows | 5 | 5 | — | — | — |
| ContextCards | 6 | 6 | — | — | — |
| RecommendationCard | 12 | 12 | — | — | — |
| AgentDiffTable | 11 | 11 | — | — | — |
| AgentCodeBlock | 15 | 15 | — | — | — |
| InsightCards | 8 | 8 | — | — | — |
| CommandSearch | 12 | 12 | — | — | — |
| AgentFlowchart | 10 | 10 | — | — | — |
| Conversation | 6 | 6 | — | — | — |
| AgentMessage | 7 | 7 | — | — | — |
| MessageActions | 7 | 11 | versions, onEdit, feedbackReasons, onFeedbackReason | — | labels |
| PromptSuggestions | 5 | 5 | — | — | — |
| ArtifactCard | 9 | 9 | — | — | — |
| AgentParts | 8 | 8 | — | — | — |
| ThinkingIndicator | 0 | 7 | label, phases, phaseDuration, startedAt, locale, size, className | — | — |
| Reasoning | 0 | 12 | status, text, steps, startedAt, duration, label, doneLabel, open, onOpenChange, locale, size, className | — | — |
| ToolCall | 0 | 19 | name, title, summary, status, args, result, error, startedAt, duration, icon, onRetry, approvalReason, onApprove, onDeny, defaultOpen, variant, locale, size, className | — | — |
| ToolCallGroup | 0 | 7 | children, label, count, status, defaultOpen, locale, className | — | — |
| Question | 0 | 10 | questions, onSubmit, onCancel, answers, confirm, disabled, submitLabel, locale, size, className | — | — |
| ChoiceCard | 0 | 9 | title, options, multiple, allowText, disabled, answered, onAnswer, onCancel, locale | — | — |
| Approval | 0 | 19 | title, description, requester, risk, fields, preview, scopes, state, result, onApprove, onDeny, askDenyReason, expiresIn, onExpire, approveLabel, denyLabel, locale, size, className | — | — |
| ConfirmCard | 0 | 10 | title, fields, body, confirmLabel, cancelLabel, state, result, onConfirm, onCancel, locale | — | — |
| Citation | 0 | 4 | source, active, onActiveChange, locale | — | — |
| CitedAnswer | 0 | 6 | text, sources, hideSourceList, locale, size, className | — | — |
| PromptQueue | 0 | 7 | items, onRemove, onEdit, onSendNow, onMove, locale, className | — | — |
| RunControls | 0 | 12 | status, activity, startedAt, duration, error, onStop, onResume, onRetry, onDismiss, onSteer, locale, className | — | — |
| AttachmentList | 0 | 6 | items, onRemove, onRetry, onOpen, locale, className | — | — |
| AgentWelcome | 0 | 8 | title, description, icon, capabilities, onPick, footer, size, className | — | — |
| AgentPanel | 0 | 14 | title, open, onOpenChange, launcher, launcherLabel, empty, followKey, children, onNewChat, sessions, currentSessionId, onSelectSession, notice, composer | — | — |
| AgentPlan | 0 | 12 | title, description, steps, mode, onChange, onApprove, onCancel, onRetryFrom, approveLabel, locale, size, className | — | — |
| AgentTrail | 0 | 5 | title, steps, collapseAfter, locale, className | — | — |
| RunProgress | 0 | 2 | steps, locale | — | — |
| ChangeLedger | 0 | 5 | entries, title, onUndo, locale, className | — | — |
| AgentCheckpoints | 0 | 5 | checkpoints, currentId, onRewind, locale, className | — | — |
| AutonomySelector | 0 | 5 | value, onChange, actions, locale, className | — | — |
| AgentInbox | 0 | 8 | tasks, title, onApprove, onReject, onRetry, onOpen, locale, className | — | — |
| RunningNow | 0 | 4 | tasks, onOpen, locale, className | — | — |
| AwaySummary | 0 | 5 | awayFor, items, onDismiss, locale, className | — | — |
| ContextUsage | 0 | 9 | segments, limit, cost, currency, onRemove, onCompact, variant, locale, className | — | — |
| TraceWaterfall | 0 | 7 | spans, now, selectedId, onSelect, currency, locale, className | — | — |
| AgentTree | 0 | 6 | root, selectedId, onSelect, currency, locale, className | — | — |
| AgentLanes | 0 | 6 | lanes, blocks, now, onSelect, locale, className | — | — |
| Modal | 12 | 12 | — | — | — |
| Drawer | 15 | 15 | — | — | — |
| Accordion | 6 | 6 | — | — | — |
| TabsContent | 12 | 12 | — | — | — |
| ToastProvider | 4 | 4 | — | — | — |
| OtpInput | 19 | 19 | — | — | — |
| CalendarCard | 11 | 11 | — | — | — |
| LiquidTabs | 14 | 14 | — | — | — |
| AddMember | 16 | 16 | — | — | — |
| Folder | 25 | 25 | — | — | — |
| FolderFloat | 6 | 6 | — | — | — |
| Panel | 285 | 285 | — | — | — |
| FileInput | 307 | 307 | — | — | — |
| WalletGoalCard | 14 | 14 | — | — | — |
| ChartHeader | 7 | 7 | — | — | — |
| ChartMetricRow | 1 | 1 | — | — | — |
| GroupedBarChart | 6 | 6 | — | — | — |
| DivergingBarChart | 9 | 9 | — | — | — |
| InfoRow | 3 | 3 | — | — | — |
| Grid | 285 | 285 | — | — | — |
| GridItem | 282 | 282 | — | — | — |
| AppSwitcherDropdown | 6 | 6 | — | — | — |

## 导出变化

删除：无。

新增：AGENT_PANEL_WIDTH, AgentCheckpoints, AgentCheckpointsProps, AgentInbox, AgentInboxProps, AgentLanes, AgentLanesProps, AgentPanel, AgentPanelProps, AgentPlan, AgentPlanProps, AgentSession, AgentStepStatus, AgentTaskState, AgentTrail, AgentTrailProps, AgentTree, AgentTreeProps, AgentWelcome, AgentWelcomeProps, Approval, ApprovalField, ApprovalProps, ApprovalRisk, ApprovalScope, ApprovalState, AttachmentItem, AttachmentKind, AttachmentList, AttachmentListProps, AutonomyAction, AutonomyLevel, AutonomySelector, AutonomySelectorProps, AwayItem, AwaySummary, AwaySummaryProps, ChangeLedger, ChangeLedgerProps, Checkpoint, ChoiceAnswer, ChoiceCard, ChoiceCardProps, ChoiceOption, Citation, CitationProps, CitationSource, CitedAnswer, CitedAnswerProps, ConfirmCard, ConfirmCardProps, ConfirmField, ContextSegment, ContextSegmentKind, ContextUsage, ContextUsageProps, InboxTask, LaneBlock, LedgerEntry, LedgerField, PlanStep, ProgressStep, PromptQueue, PromptQueueProps, Question, QuestionAnswer, QuestionItem, QuestionOption, QuestionProps, QueuedPrompt, Reasoning, ReasoningProps, ReasoningSource, ReasoningStatus, ReasoningStep, RunControls, RunControlsProps, RunProgress, RunStatus, RunningNow, RunningNowProps, ThinkingIndicator, ThinkingIndicatorProps, ToolCall, ToolCallGroup, ToolCallGroupProps, ToolCallProps, ToolCallStatus, TraceSpan, TraceWaterfall, TraceWaterfallProps, TrailStep, TrailSubstep, TreeAgent, TreeAgentStatus, WelcomeCapability。

## 智能体与聊天参数明细

### ChatBubble

源码：`core/src/components/ui/chat-bubble.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| type | `"sent" \| "received"` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| motion | `MotionPreference \| undefined` | 否 | "auto" |
| reactions | `ChatReaction[] \| undefined` | 否 | [] |
| reactionOptions | `ChatReactionOption[] \| undefined` | 否 | [] |
| onReaction | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onReply | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| replyTo | `ComposerReply \| undefined` | 否 | 未在参数解构处设置 |
| delivery | `"sent" \| "queued" \| "sending" \| "delivered" \| "failed" \| undefined` | 否 | 未在参数解构处设置 |
| variant | `"text" \| "voice" \| "file" \| "image" \| undefined` | 否 | "text" |
| color | `AccentColor \| undefined` | 否 | "blue" |
| content | `string \| undefined` | 否 | 未在参数解构处设置 |
| time | `string \| undefined` | 否 | 未在参数解构处设置 |
| avatar | `string \| undefined` | 否 | 未在参数解构处设置 |
| senderName | `string \| undefined` | 否 | 未在参数解构处设置 |
| images | `string[] \| undefined` | 否 | 未在参数解构处设置 |
| extraImageCount | `number \| undefined` | 否 | 未在参数解构处设置 |
| fileName | `string \| undefined` | 否 | 未在参数解构处设置 |
| fileSize | `string \| undefined` | 否 | 未在参数解构处设置 |
| onFileDownload | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| voiceDuration | `string \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | "" |

### ChatInputBar

源码：`core/src/components/ui/chat-input-bar.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| motion | `MotionPreference \| undefined` | 否 | "auto" |
| replyTo | `ComposerReply \| undefined` | 否 | 未在参数解构处设置 |
| onCancelReply | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| attachments | `ReactNode` | 否 | 未在参数解构处设置 |
| hasAttachments | `boolean \| undefined` | 否 | false |
| voiceState | `ComposerVoiceState \| undefined` | 否 | "idle" |
| voiceLevel | `number \| undefined` | 否 | 未在参数解构处设置 |
| onVoiceStart | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onVoiceEnd | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onVoiceCancel | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| quickActions | `ChatInputBarQuickAction[] \| undefined` | 否 | [] |
| quickActionsLabel | `string \| undefined` | 否 | "快捷操作" |
| hasMessages | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| defaultQuickActionsOpen | `boolean \| undefined` | 否 | true |
| removeQuickActionLabel | `string \| undefined` | 否 | "移除操作" |
| onQuickActionChange | `((action: ChatInputBarQuickAction \| null) => void) \| undefined` | 否 | 未在参数解构处设置 |
| commands | `ComposerCommand[] \| undefined` | 否 | [] |
| commandsLabel | `string \| undefined` | 否 | "命令" |
| emptyCommandsLabel | `string \| undefined` | 否 | "没有匹配的命令" |
| connectedLabel | `string \| undefined` | 否 | "已连接" |
| onDictate | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| dictateLabel | `string \| undefined` | 否 | "语音输入" |
| toolsMenuLabel | `string \| undefined` | 否 | "添加内容和工具" |
| permissions | `ComposerModel[] \| undefined` | 否 | [] |
| permission | `string \| undefined` | 否 | 未在参数解构处设置 |
| onPermissionChange | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| permissionMenuLabel | `string \| undefined` | 否 | "权限" |
| color | `AccentColor \| undefined` | 否 | 未在参数解构处设置 |
| status | `ComposerStatus \| undefined` | 否 | "idle" |
| onStop | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| stopLabel | `string \| undefined` | 否 | "停止生成" |
| stoppingLabel | `string \| undefined` | 否 | "正在停止…" |
| models | `ComposerModel[] \| undefined` | 否 | [] |
| model | `string \| undefined` | 否 | 未在参数解构处设置 |
| onModelChange | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| modelMenuLabel | `string \| undefined` | 否 | "Model" |
| placeholder | `string \| undefined` | 否 | "输入消息..." |
| value | `string \| undefined` | 否 | 未在参数解构处设置 |
| onChange | `((value: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onSend | `((message: string, action?: ChatInputBarQuickAction, context?: ChatInputBarSendContext) => void) \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | "" |
| multiline | `boolean \| undefined` | 否 | false |
| rows | `number \| undefined` | 否 | 3 |
| toggles | `ChatInputBarToggle[] \| undefined` | 否 | 未在参数解构处设置 |
| sendLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| showAttachment | `boolean \| undefined` | 否 | true |
| onAttach | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| attachLabel | `string \| undefined` | 否 | "添加附件" |
| sendOnEnter | `boolean \| undefined` | 否 | false |
| disabled | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| sendDisabled | `boolean \| undefined` | 否 | false |
| inputLabel | `string \| undefined` | 否 | "消息内容" |
| clearOnSend | `boolean \| undefined` | 否 | true |
| density | `"default" \| "compact" \| undefined` | 否 | "default" |
| sources | `ComposerSource[] \| undefined` | 否 | [] |
| selectedSources | `ComposerSource[] \| undefined` | 否 | 未在参数解构处设置 |
| defaultSelectedSources | `ComposerSource[] \| undefined` | 否 | [] |
| onSourcesChange | `((sources: ComposerSource[]) => void) \| undefined` | 否 | 未在参数解构处设置 |
| removeSourceLabel | `string \| undefined` | 否 | "移除提及" |
| sourcesLabel | `string \| undefined` | 否 | "提及" |
| emptySourcesLabel | `string \| undefined` | 否 | "没有匹配的提及对象" |

### TopBar

源码：`core/src/components/ui/topbar.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| value | `number \| undefined` | 否 | 0 |
| color | `"purple" \| "blue" \| "green" \| undefined` | 否 | "blue" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### PageTitleToolbar

源码：`core/src/components/ui/toolbar.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| variant | `"overview" \| "collection" \| "detail" \| "action" \| undefined` | 否 | 未在参数解构处设置 |
| subtitle | `string \| undefined \| undefined` | 否 | 未在参数解构处设置 |
| dateAction | `PageTitleToolbarDateAction \| undefined \| undefined` | 否 | 未在参数解构处设置 |
| primaryAction | `PageTitleToolbarAction \| undefined \| PageTitleToolbarAction` | 否 | 未在参数解构处设置 |
| secondaryAction | `undefined \| PageTitleToolbarAction \| undefined \| PageTitleToolbarAction` | 否 | 未在参数解构处设置 |
| menuAction | `undefined \| PageTitleToolbarMenuAction \| undefined` | 否 | 未在参数解构处设置 |
| askAi | `AskAiProps \| undefined` | 否 | 未在参数解构处设置 |
| title | `string` | 是 | 未在参数解构处设置 |
| breadcrumbItems | `BreadcrumbItem[]` | 否 | 未在参数解构处设置 |
| color | `ToolbarColor \| undefined` | 否 | 未在参数解构处设置 |
| breadcrumbs | `ReactNode` | 否 | 未在参数解构处设置 |
| actions | `ReactNode` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AppLayout

源码：`core/src/components/layouts/app-layout.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| motion | `MotionPreference \| undefined` | 否 | "auto" |
| mode | `AppLayoutMode \| undefined` | 否 | "light" |
| profilePosition | `AppLayoutProfilePosition \| undefined` | 否 | "topbar" |
| accent | `AppLayoutAccentColor \| undefined` | 否 | "blue" |
| children | `ReactNode` | 是 | 未在参数解构处设置 |
| logo | `ReactNode` | 否 | 未在参数解构处设置 |
| logoText | `string \| undefined` | 否 | "Forge" |
| appName | `string \| undefined` | 否 | 未在参数解构处设置 |
| appIcon | `string \| undefined` | 否 | 未在参数解构处设置 |
| appSubtitle | `string \| undefined` | 否 | 未在参数解构处设置 |
| apps | `AppSwitcherItem[] \| undefined` | 否 | 未在参数解构处设置 |
| onAppChange | `((app: AppSwitcherItem) => void) \| undefined` | 否 | 未在参数解构处设置 |
| teamName | `string \| undefined` | 否 | 未在参数解构处设置 |
| teamAvatar | `string \| undefined` | 否 | 未在参数解构处设置 |
| teamMemberCount | `number \| undefined` | 否 | 未在参数解构处设置 |
| teamSubtitle | `string \| undefined` | 否 | 未在参数解构处设置 |
| menuSectionLabel | `string \| undefined` | 否 | "主菜单" |
| favoriteSectionLabel | `string \| undefined` | 否 | "常用项目" |
| teams | `AppSwitcherItem[] \| undefined` | 否 | 未在参数解构处设置 |
| menuItems | `AppLayoutMenuItem[] \| undefined` | 否 | 未在参数解构处设置 |
| favoriteItems | `AppLayoutMenuItem[] \| undefined` | 否 | 未在参数解构处设置 |
| menuSections | `AppLayoutMenuSection[] \| undefined` | 否 | 未在参数解构处设置 |
| profile | `AppLayoutProfile \| undefined` | 否 | 未在参数解构处设置 |
| profileMenuItems | `ProfileMenuItem[] \| undefined` | 否 | 未在参数解构处设置 |
| notifications | `number \| undefined` | 否 | 未在参数解构处设置 |
| messages | `number \| undefined` | 否 | 未在参数解构处设置 |
| language | `LanguageCode \| undefined` | 否 | 未在参数解构处设置 |
| defaultLanguage | `LanguageCode \| undefined` | 否 | "zh-CN" |
| onLanguageChange | `((language: AppLayoutLanguage) => void) \| undefined` | 否 | 未在参数解构处设置 |
| pageHeaderVariant | `AppLayoutPageHeaderVariant \| undefined` | 否 | "home" |
| askAi | `AskAiProps \| undefined` | 否 | 未在参数解构处设置 |
| onBack | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| primaryAction | `{ label: string; onClick?: () => void; } \| undefined` | 否 | 未在参数解构处设置 |
| secondaryAction | `{ label: string; onClick?: () => void; } \| undefined` | 否 | 未在参数解构处设置 |
| searchPlaceholder | `string \| undefined` | 否 | "搜索..." |
| topbarLeftMode | `"search" \| "hamburger" \| undefined` | 否 | "search" |
| topbarAccent | `AppLayoutAccentColor \| undefined` | 否 | 未在参数解构处设置 |
| pageTitle | `string \| undefined` | 否 | 未在参数解构处设置 |
| breadcrumbs | `AppLayoutBreadcrumb[] \| undefined` | 否 | 未在参数解构处设置 |
| showDatePicker | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| showKebab | `boolean \| undefined` | 否 | true |
| showFavorite | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| hideHeader | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| sidebarSlot | `ReactNode` | 否 | 未在参数解构处设置 |
| sidebarWidth | `string \| undefined` | 否 | "16rem" |
| collapsedSidebarWidth | `string \| undefined` | 否 | "5rem" |
| defaultSidebarCollapsed | `boolean \| undefined` | 否 | false |
| hideSidebarWidgets | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| teamLabels | `TeamSwitcherLabels \| undefined` | 否 | 未在参数解构处设置 |
| showTeamActions | `boolean \| undefined` | 否 | false |

### AskAi

源码：`core/src/components/ui/ask-ai.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| color | `AccentColor \| undefined` | 否 | 未在参数解构处设置 |
| label | `string \| undefined` | 否 | "Ask AI" |
| suggestions | `string[] \| undefined` | 否 | DEFAULT_SUGGESTIONS |
| placeholder | `string \| undefined` | 否 | "输入问题…" |
| onSend | `(message: string, request: AskAiRequest) => string \| AskAiResponse \| Promise<string \| AskAiResponse>` | 是 | 未在参数解构处设置 |
| disabled | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |
| header | `ReactNode` | 否 | 未在参数解构处设置 |
| brand | `ReactNode` | 否 | 未在参数解构处设置 |
| session | `ReactNode` | 否 | 未在参数解构处设置 |
| messages | `ReactNode` | 否 | 未在参数解构处设置 |
| composer | `ReactNode` | 否 | 未在参数解构处设置 |
| fullscreen | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| defaultFullscreen | `boolean \| undefined` | 否 | false |
| onFullscreenChange | `((open: boolean) => void) \| undefined` | 否 | 未在参数解构处设置 |
| showFullscreenTrigger | `boolean \| undefined` | 否 | true |
| sessions | `AskAiSessionItem[] \| undefined` | 否 | 未在参数解构处设置 |
| currentSessionId | `string \| undefined` | 否 | 未在参数解构处设置 |
| onNewSession | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onSelectSession | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| searchQuery | `string \| undefined` | 否 | 未在参数解构处设置 |
| onSearchQueryChange | `((query: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| hasConversation | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| landingTitle | `string \| undefined` | 否 | 未在参数解构处设置 |
| landingDescription | `string \| undefined` | 否 | "告诉我你想了解什么，我来帮你梳理。" |
| headerLayout | `"brand" \| "session" \| undefined` | 否 | "brand" |
| panelMode | `"modal" \| "responsive" \| undefined` | 否 | "modal" |
| onDockedChange | `((docked: boolean) => void) \| undefined` | 否 | 未在参数解构处设置 |
| railLabel | `string \| undefined` | 否 | 未在参数解构处设置 |

### ThinkingTrace

源码：`core/src/components/ui/agent/thinking-trace.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| variant | `ThinkingVariant \| undefined` | 否 | "steps" |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| motion | `MotionPreference \| undefined` | 否 | "auto" |
| rows | `ThinkingRow[] \| undefined` | 否 | 未在参数解构处设置 |
| activeLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| doneLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| query | `string \| undefined` | 否 | 未在参数解构处设置 |
| settled | `boolean \| undefined` | 否 | false |
| play | `boolean \| undefined` | 否 | true |
| onSettled | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | "" |

### StreamingAnswer

源码：`core/src/components/ui/agent/streaming-answer.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| text | `string` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| streaming | `boolean \| undefined` | 否 | false |
| status | `StreamingAnswerStatus \| undefined` | 否 | 未在参数解构处设置 |
| format | `"plain" \| "markdown" \| undefined` | 否 | "plain" |
| animation | `"fade" \| "blur" \| undefined` | 否 | "fade" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| duration | `number \| undefined` | 否 | 500 |
| motion | `MotionPreference \| undefined` | 否 | "auto" |
| sources | `StreamingSource[] \| undefined` | 否 | [] |
| sourcesLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| followUps | `string[] \| undefined` | 否 | [] |
| followUpsLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| onFollowUp | `((text: string, index: number) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onDone | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | "" |

### ApprovalCard

源码：`core/src/components/ui/agent/approval-card.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| questions | `ApprovalQuestion[]` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| skipLabel | `string \| undefined` | 否 | locale === "zh" ? "跳过" : "Skip" |
| skipSubmitLabel | `string \| undefined` | 否 | locale === "zh" ? "跳过并提交" : "Skip and submit" |
| continueLabel | `string \| undefined` | 否 | locale === "zh" ? "继续" : "Continue" |
| sendLabel | `string \| undefined` | 否 | locale === "zh" ? "提交" : "Send" |
| sentLabel | `string \| undefined` | 否 | locale === "zh" ? "答案已提交" : "Answers sent" |
| onSubmitted | `((answers: Record<string, string[]>) => void) \| undefined` | 否 | 未在参数解构处设置 |
| previousQuestionLabel | `string \| undefined` | 否 | locale === "zh" ? "上一题" : "Previous question" |
| nextQuestionLabel | `string \| undefined` | 否 | locale === "zh" ? "下一题" : "Next question" |
| className | `string \| undefined` | 否 | "" |

### ToolChips

源码：`core/src/components/ui/agent/tool-chips.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| items | `ToolChipItem[]` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| motion | `MotionPreference \| undefined` | 否 | "auto" |
| state | `"idle" \| "success" \| "error" \| "running" \| "cancelled" \| undefined` | 否 | 未在参数解构处设置 |
| result | `ReactNode` | 否 | 未在参数解构处设置 |
| actions | `ReactNode` | 否 | 未在参数解构处设置 |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| defaultOpen | `boolean \| undefined` | 否 | true |
| diffs | `ToolDiffChip[] \| undefined` | 否 | [] |
| summary | `string \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | "" |

### AgentTaskRows

源码：`core/src/components/ui/agent/agent-task-rows.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| tasks | `AgentTask[]` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| variant | `"list" \| "capsules" \| undefined` | 否 | "list" |
| statusLabels | `Partial<Record<AgentTaskStatus, string>> \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | "" |

### ContextCards

源码：`core/src/components/ui/agent/context-cards.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| chunks | `ContextChunk[]` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| total | `number \| undefined` | 否 | 未在参数解构处设置 |
| allChunksLabel | `string \| undefined` | 否 | locale === "zh" ? "全部片段" : "All chunks" |
| charactersLabel | `string \| undefined` | 否 | locale === "zh" ? "字符" : "characters" |
| className | `string \| undefined` | 否 | "" |

### RecommendationCard

源码：`core/src/components/ui/agent/recommendation-card.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `string` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| body | `string` | 是 | 未在参数解构处设置 |
| confidence | `RecommendationConfidence \| undefined` | 否 | "high" |
| confidenceLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| alternatives | `RecommendationOption[] \| undefined` | 否 | [] |
| acceptLabel | `string \| undefined` | 否 | locale === "zh" ? "接受建议" : "Accept" |
| onAccept | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onSelectAlternative | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| confidenceLabels | `Partial<Record<RecommendationConfidence, string>> \| undefined` | 否 | 未在参数解构处设置 |
| alternativesLabel | `string \| undefined` | 否 | locale === "zh" ? "其他选项" : "Other options" |
| className | `string \| undefined` | 否 | "" |

### AgentDiffTable

源码：`core/src/components/ui/agent/agent-diff-table.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `string` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| columns | `AgentDiffColumn[]` | 是 | 未在参数解构处设置 |
| rows | `AgentDiffRow[]` | 是 | 未在参数解构处设置 |
| applyLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| appliedLabel | `string \| undefined` | 否 | locale === "zh" ? "项变更已应用" : "edits applied" |
| onApply | `((includedIds: string[]) => void) \| undefined` | 否 | 未在参数解构处设置 |
| toggleHint | `string \| undefined` | 否 | locale === "zh" ? "点击变更行可取消或重新选择" : "Click changed rows to toggle" |
| formatApplyLabel | `((count: number) => string) \| undefined` | 否 | 未在参数解构处设置 |
| formatAppliedLabel | `((count: number) => string) \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | "" |

### AgentCodeBlock

源码：`core/src/components/ui/agent/agent-code-block.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| filename | `string` | 是 | 未在参数解构处设置 |
| lines | `string[] \| undefined` | 否 | 未在参数解构处设置 |
| diff | `AgentCodeDiffRow[] \| undefined` | 否 | 未在参数解构处设置 |
| view | `"code" \| "diff" \| undefined` | 否 | 未在参数解构处设置 |
| onViewChange | `((view: "code" \| "diff") => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| codeLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| diffLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| copyLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| copiedLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| foldRanges | `AgentCodeFoldRange[] \| undefined` | 否 | [] |
| collapsedRangeIds | `string[] \| undefined` | 否 | 未在参数解构处设置 |
| defaultCollapsedRangeIds | `string[] \| undefined` | 否 | [] |
| onCollapsedRangeIdsChange | `((ids: string[]) => void) \| undefined` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | "" |

### InsightCards

源码：`core/src/components/ui/agent/insight-cards.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| cards | `InsightCard[]` | 是 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| index | `number \| undefined` | 否 | 未在参数解构处设置 |
| onIndexChange | `((index: number) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onAsk | `((prompt: string, card: InsightCard) => void) \| undefined` | 否 | 未在参数解构处设置 |
| previousInsightLabel | `string \| undefined` | 否 | locale === "zh" ? "上一条洞察" : "Previous insight" |
| nextInsightLabel | `string \| undefined` | 否 | locale === "zh" ? "下一条洞察" : "Next insight" |
| className | `string \| undefined` | 否 | "" |

### CommandSearch

源码：`core/src/components/ui/agent/command-search.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| items | `CommandSearchItem[]` | 是 | 未在参数解构处设置 |
| placeholder | `string \| undefined` | 否 | 未在参数解构处设置 |
| emptyLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| query | `string \| undefined` | 否 | 未在参数解构处设置 |
| onQueryChange | `((query: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onSelect | `((item: CommandSearchItem) => void) \| undefined` | 否 | 未在参数解构处设置 |
| groupLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| color | `AccentColor \| undefined` | 否 | "blue" |
| motion | `MotionPreference \| undefined` | 否 | "auto" |
| autoFocus | `boolean \| undefined` | 否 | false |
| className | `string \| undefined` | 否 | "" |

### AgentFlowchart

源码：`core/src/components/ui/agent/agent-flowchart.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `string \| undefined` | 否 | locale === "zh" ? "工作流程" : "Workflow" |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| nodes | `AgentFlowNode[]` | 是 | 未在参数解构处设置 |
| edges | `AgentFlowEdge[] \| undefined` | 否 | [] |
| selectedId | `string \| undefined` | 否 | 未在参数解构处设置 |
| onSelect | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| kindLabels | `Partial<Record<AgentFlowKind, string>> \| undefined` | 否 | 未在参数解构处设置 |
| selectedLabel | `string \| undefined` | 否 | locale === "zh" ? "当前节点" : "Selected" |
| nextLabel | `string \| undefined` | 否 | locale === "zh" ? "下一步" : "Next" |
| className | `string \| undefined` | 否 | "" |

### Conversation

源码：`core/src/components/ui/agent/agent-conversation.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| children | `ReactNode` | 是 | 未在参数解构处设置 |
| followKey | `unknown` | 否 | 未在参数解构处设置 |
| locale | `Locale \| undefined` | 否 | "zh" |
| latestLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| motion | `MotionPreference \| undefined` | 否 | "auto" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentMessage

源码：`core/src/components/ui/agent/agent-conversation.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| role | `AgentMessageRole` | 是 | 未在参数解构处设置 |
| children | `ReactNode` | 是 | 未在参数解构处设置 |
| name | `string \| undefined` | 否 | 未在参数解构处设置 |
| avatar | `ReactNode` | 否 | 未在参数解构处设置 |
| time | `string \| undefined` | 否 | 未在参数解构处设置 |
| actions | `ReactNode` | 否 | 未在参数解构处设置 |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### MessageActions

源码：`core/src/components/ui/agent/agent-conversation.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| copyText | `string \| undefined` | 否 | 未在参数解构处设置 |
| onRetry | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onFeedback | `((value: MessageFeedback) => void) \| undefined` | 否 | 未在参数解构处设置 |
| feedback | `MessageFeedback \| undefined` | 否 | 未在参数解构处设置 |
| versions | `{ current: number; total: number; onChange: (index: number) => void; } \| undefined` | 否 | 未在参数解构处设置 |
| onEdit | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| feedbackReasons | `string[] \| undefined` | 否 | [] |
| onFeedbackReason | `((reason: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `Locale \| undefined` | 否 | "zh" |
| labels | `Partial<Record<"next" \| "previous" \| "copy" \| "up" \| "down" \| "copied" \| "retry" \| "edit", string>> \| undefined` | 否 | {} |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### PromptSuggestions

源码：`core/src/components/ui/agent/agent-conversation.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| suggestions | `string[]` | 是 | 未在参数解构处设置 |
| onSelect | `(text: string, index: number) => void` | 是 | 未在参数解构处设置 |
| label | `string \| undefined` | 否 | 未在参数解构处设置 |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### ArtifactCard

源码：`core/src/components/ui/agent/agent-conversation.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `string` | 是 | 未在参数解构处设置 |
| kind | `ArtifactKind \| undefined` | 否 | "document" |
| meta | `string \| undefined` | 否 | 未在参数解构处设置 |
| status | `ArtifactStatus \| undefined` | 否 | "ready" |
| onOpen | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onDownload | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `Locale \| undefined` | 否 | "zh" |
| labels | `Partial<Record<"error" \| "open" \| "generating" \| "download", string>> \| undefined` | 否 | {} |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentParts

源码：`core/src/components/ui/agent/agent-parts.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| parts | `AgentMessagePart[]` | 是 | 未在参数解构处设置 |
| status | `"error" \| "streaming" \| "ready" \| "submitted" \| undefined` | 否 | "ready" |
| renderTool | `Record<string, (part: AgentToolPart) => ReactNode> \| undefined` | 否 | {} |
| onOpenFile | `((part: { url: string; filename?: string; mediaType: string; }) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onToolApproval | `((response: AgentToolApprovalResponse) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `"zh" \| "en" \| undefined` | 否 | "zh" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### ThinkingIndicator

源码：`core/src/components/ui/agent/thinking.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| label | `string \| undefined` | 否 | 未在参数解构处设置 |
| phases | `string[] \| undefined` | 否 | 未在参数解构处设置 |
| phaseDuration | `number \| undefined` | 否 | 2400 |
| startedAt | `number \| Date \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### Reasoning

源码：`core/src/components/ui/agent/thinking.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| status | `ReasoningStatus` | 是 | 未在参数解构处设置 |
| text | `string \| undefined` | 否 | 未在参数解构处设置 |
| steps | `ReasoningStep[] \| undefined` | 否 | [] |
| startedAt | `number \| Date \| undefined` | 否 | 未在参数解构处设置 |
| duration | `number \| undefined` | 否 | 未在参数解构处设置 |
| label | `ReactNode` | 否 | 未在参数解构处设置 |
| doneLabel | `ReactNode` | 否 | 未在参数解构处设置 |
| open | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| onOpenChange | `((open: boolean) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### ToolCall

源码：`core/src/components/ui/agent/tool-call.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| name | `string` | 是 | 未在参数解构处设置 |
| title | `ReactNode` | 否 | 未在参数解构处设置 |
| summary | `ReactNode` | 否 | 未在参数解构处设置 |
| status | `ToolCallStatus` | 是 | 未在参数解构处设置 |
| args | `unknown` | 否 | 未在参数解构处设置 |
| result | `unknown` | 否 | 未在参数解构处设置 |
| error | `string \| undefined` | 否 | 未在参数解构处设置 |
| startedAt | `number \| Date \| undefined` | 否 | 未在参数解构处设置 |
| duration | `number \| undefined` | 否 | 未在参数解构处设置 |
| icon | `ReactNode` | 否 | 未在参数解构处设置 |
| onRetry | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| approvalReason | `ReactNode` | 否 | 未在参数解构处设置 |
| onApprove | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onDeny | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| defaultOpen | `boolean \| undefined` | 否 | false |
| variant | `"row" \| "card" \| undefined` | 否 | "card" |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### ToolCallGroup

源码：`core/src/components/ui/agent/tool-call.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| children | `ReactNode` | 是 | 未在参数解构处设置 |
| label | `ReactNode` | 否 | 未在参数解构处设置 |
| count | `number \| undefined` | 否 | 未在参数解构处设置 |
| status | `"success" \| "error" \| "running" \| undefined` | 否 | "success" |
| defaultOpen | `boolean \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### Question

源码：`core/src/components/ui/agent/question.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| questions | `QuestionItem[]` | 是 | 未在参数解构处设置 |
| onSubmit | `(answers: Record<string, QuestionAnswer>) => void` | 是 | 未在参数解构处设置 |
| onCancel | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| answers | `Record<string, QuestionAnswer> \| undefined` | 否 | 未在参数解构处设置 |
| confirm | `boolean \| undefined` | 否 | false |
| disabled | `boolean \| undefined` | 否 | false |
| submitLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### ChoiceCard

源码：`core/src/components/ui/agent/question.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `string` | 是 | 未在参数解构处设置 |
| options | `ChoiceOption[]` | 是 | 未在参数解构处设置 |
| multiple | `boolean \| undefined` | 否 | false |
| allowText | `boolean \| undefined` | 否 | false |
| disabled | `boolean \| undefined` | 否 | false |
| answered | `ReactNode` | 否 | 未在参数解构处设置 |
| onAnswer | `(answer: ChoiceAnswer) => void` | 是 | 未在参数解构处设置 |
| onCancel | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |

### Approval

源码：`core/src/components/ui/agent/approval.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `ReactNode` | 是 | 未在参数解构处设置 |
| description | `ReactNode` | 否 | 未在参数解构处设置 |
| requester | `ReactNode` | 否 | 未在参数解构处设置 |
| risk | `ApprovalRisk \| undefined` | 否 | 未在参数解构处设置 |
| fields | `ApprovalField[] \| undefined` | 否 | [] |
| preview | `ReactNode` | 否 | 未在参数解构处设置 |
| scopes | `ApprovalScope[] \| undefined` | 否 | 未在参数解构处设置 |
| state | `ApprovalState \| undefined` | 否 | "pending" |
| result | `ReactNode` | 否 | 未在参数解构处设置 |
| onApprove | `((scope: ApprovalScope) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onDeny | `((reason?: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| askDenyReason | `boolean \| undefined` | 否 | false |
| expiresIn | `number \| undefined` | 否 | 未在参数解构处设置 |
| onExpire | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| approveLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| denyLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### ConfirmCard

源码：`core/src/components/ui/agent/approval.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `string` | 是 | 未在参数解构处设置 |
| fields | `ApprovalField[] \| undefined` | 否 | [] |
| body | `string \| undefined` | 否 | 未在参数解构处设置 |
| confirmLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| cancelLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| state | `"done" \| "cancelled" \| "pending" \| "working" \| undefined` | 否 | "pending" |
| result | `string \| undefined` | 否 | 未在参数解构处设置 |
| onConfirm | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onCancel | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |

### Citation

源码：`core/src/components/ui/agent/cited-answer.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| source | `CitationSource` | 是 | 未在参数解构处设置 |
| active | `boolean \| undefined` | 否 | false |
| onActiveChange | `((active: boolean) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |

### CitedAnswer

源码：`core/src/components/ui/agent/cited-answer.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| text | `string` | 是 | 未在参数解构处设置 |
| sources | `CitationSource[]` | 是 | 未在参数解构处设置 |
| hideSourceList | `boolean \| undefined` | 否 | false |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### PromptQueue

源码：`core/src/components/ui/agent/composer-parts.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| items | `QueuedPrompt[]` | 是 | 未在参数解构处设置 |
| onRemove | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onEdit | `((id: string, text: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onSendNow | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onMove | `((id: string, direction: -1 \| 1) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### RunControls

源码：`core/src/components/ui/agent/composer-parts.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| status | `RunStatus` | 是 | 未在参数解构处设置 |
| activity | `string \| undefined` | 否 | 未在参数解构处设置 |
| startedAt | `number \| Date \| undefined` | 否 | 未在参数解构处设置 |
| duration | `number \| undefined` | 否 | 未在参数解构处设置 |
| error | `string \| undefined` | 否 | 未在参数解构处设置 |
| onStop | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onResume | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onRetry | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onDismiss | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onSteer | `((note: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AttachmentList

源码：`core/src/components/ui/agent/composer-parts.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| items | `AttachmentItem[]` | 是 | 未在参数解构处设置 |
| onRemove | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onRetry | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onOpen | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentWelcome

源码：`core/src/components/ui/agent/agent-welcome.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `ReactNode` | 是 | 未在参数解构处设置 |
| description | `ReactNode` | 否 | 未在参数解构处设置 |
| icon | `ReactNode` | 否 | 未在参数解构处设置 |
| capabilities | `WelcomeCapability[] \| undefined` | 否 | [] |
| onPick | `((prompt: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| footer | `ReactNode` | 否 | 未在参数解构处设置 |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentPanel

源码：`core/src/components/ui/agent/agent-panel.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `string` | 是 | 未在参数解构处设置 |
| open | `boolean` | 是 | 未在参数解构处设置 |
| onOpenChange | `(open: boolean) => void` | 是 | 未在参数解构处设置 |
| launcher | `boolean \| undefined` | 否 | true |
| launcherLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| empty | `ReactNode` | 否 | 未在参数解构处设置 |
| followKey | `unknown` | 否 | 未在参数解构处设置 |
| children | `ReactNode` | 否 | 未在参数解构处设置 |
| onNewChat | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| sessions | `AgentSession[] \| undefined` | 否 | 未在参数解构处设置 |
| currentSessionId | `string \| undefined` | 否 | 未在参数解构处设置 |
| onSelectSession | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| notice | `ReactNode` | 否 | 未在参数解构处设置 |
| composer | `{ locale?: "zh" \| "en"; motion?: MotionPreference; replyTo?: ComposerReply; onCancelReply?: () => void; attachments?: ReactNode; hasAttachments?: boolean; voiceState?: ComposerVoiceState; voiceLevel?: number; onVoiceStart?: () => void; onVoiceEnd?: () => void; onVoiceCancel?: () => void; quickActions?: ChatInputBarQuickAction[]; quickActionsLabel?: string; hasMessages?: boolean; defaultQuickActionsOpen?: boolean; removeQuickActionLabel?: string; onQuickActionChange?: (action: ChatInputBarQuickAction \| null) => void; commands?: ComposerCommand[]; commandsLabel?: string; emptyCommandsLabel?: string; connectedLabel?: string; onDictate?: () => void; dictateLabel?: string; toolsMenuLabel?: string; permissions?: ComposerModel[]; permission?: string; onPermissionChange?: (id: string) => void; permissionMenuLabel?: string; color?: AccentColor; status?: ComposerStatus; onStop?: () => void; stopLabel?: string; stoppingLabel?: string; models?: ComposerModel[]; model?: string; onModelChange?: (id: string) => void; modelMenuLabel?: string; placeholder?: string; value?: string; onChange?: (value: string) => void; onSend?: (message: string, action?: ChatInputBarQuickAction, context?: ChatInputBarSendContext) => void; className?: string; multiline?: boolean; rows?: number; toggles?: ChatInputBarToggle[]; sendLabel?: string; showAttachment?: boolean; onAttach?: () => void; attachLabel?: string; sendOnEnter?: boolean; disabled?: boolean; sendDisabled?: boolean; inputLabel?: string; clearOnSend?: boolean; density?: "default" \| "compact"; sources?: ComposerSource[]; selectedSources?: ComposerSource[]; defaultSelectedSources?: ComposerSource[]; onSourcesChange?: (sources: ComposerSource[]) => void; removeSourceLabel?: string; sourcesLabel?: string; emptySourcesLabel?: string; }` | 是 | 未在参数解构处设置 |

### AgentPlan

源码：`core/src/components/ui/agent/agent-run.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `ReactNode` | 否 | 未在参数解构处设置 |
| description | `ReactNode` | 否 | 未在参数解构处设置 |
| steps | `PlanStep[]` | 是 | 未在参数解构处设置 |
| mode | `"done" \| "running" \| "review" \| undefined` | 否 | "review" |
| onChange | `((steps: PlanStep[]) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onApprove | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onCancel | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| onRetryFrom | `((stepId: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| approveLabel | `string \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| size | `"md" \| "sm" \| undefined` | 否 | "md" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentTrail

源码：`core/src/components/ui/agent/agent-run.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| title | `ReactNode` | 是 | 未在参数解构处设置 |
| steps | `TrailStep[]` | 是 | 未在参数解构处设置 |
| collapseAfter | `number \| undefined` | 否 | 4 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### RunProgress

源码：`core/src/components/ui/agent/agent-run.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| steps | `ProgressStep[]` | 是 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |

### ChangeLedger

源码：`core/src/components/ui/agent/agent-governance.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| entries | `LedgerEntry[]` | 是 | 未在参数解构处设置 |
| title | `ReactNode` | 否 | 未在参数解构处设置 |
| onUndo | `((id: string, alsoUndone: string[]) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentCheckpoints

源码：`core/src/components/ui/agent/agent-governance.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| checkpoints | `Checkpoint[]` | 是 | 未在参数解构处设置 |
| currentId | `string \| undefined` | 否 | 未在参数解构处设置 |
| onRewind | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AutonomySelector

源码：`core/src/components/ui/agent/agent-governance.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| value | `AutonomyLevel` | 是 | 未在参数解构处设置 |
| onChange | `(value: AutonomyLevel) => void` | 是 | 未在参数解构处设置 |
| actions | `AutonomyAction[] \| undefined` | 否 | [] |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentInbox

源码：`core/src/components/ui/agent/agent-ops.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| tasks | `InboxTask[]` | 是 | 未在参数解构处设置 |
| title | `ReactNode` | 否 | 未在参数解构处设置 |
| onApprove | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onReject | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onRetry | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onOpen | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### RunningNow

源码：`core/src/components/ui/agent/agent-ops.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| tasks | `InboxTask[]` | 是 | 未在参数解构处设置 |
| onOpen | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AwaySummary

源码：`core/src/components/ui/agent/agent-ops.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| awayFor | `number` | 是 | 未在参数解构处设置 |
| items | `AwayItem[]` | 是 | 未在参数解构处设置 |
| onDismiss | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### ContextUsage

源码：`core/src/components/ui/agent/agent-observe.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| segments | `ContextSegment[]` | 是 | 未在参数解构处设置 |
| limit | `number` | 是 | 未在参数解构处设置 |
| cost | `number \| undefined` | 否 | 未在参数解构处设置 |
| currency | `string \| undefined` | 否 | 未在参数解构处设置 |
| onRemove | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| onCompact | `(() => void) \| undefined` | 否 | 未在参数解构处设置 |
| variant | `"inline" \| "card" \| undefined` | 否 | "card" |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### TraceWaterfall

源码：`core/src/components/ui/agent/agent-observe.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| spans | `TraceSpan[]` | 是 | 未在参数解构处设置 |
| now | `number \| undefined` | 否 | 未在参数解构处设置 |
| selectedId | `string \| undefined` | 否 | 未在参数解构处设置 |
| onSelect | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| currency | `string \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentTree

源码：`core/src/components/ui/agent/agent-observe.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| root | `TreeAgent` | 是 | 未在参数解构处设置 |
| selectedId | `string \| undefined` | 否 | 未在参数解构处设置 |
| onSelect | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| currency | `string \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

### AgentLanes

源码：`core/src/components/ui/agent/agent-observe.tsx`。

| 参数 | 类型 | 是否必填 | 源码默认值 |
|---|---|---|---|
| lanes | `{ id: string; name: string; icon?: ReactNode; }[]` | 是 | 未在参数解构处设置 |
| blocks | `LaneBlock[]` | 是 | 未在参数解构处设置 |
| now | `number` | 是 | 未在参数解构处设置 |
| onSelect | `((id: string) => void) \| undefined` | 否 | 未在参数解构处设置 |
| locale | `AgentLocale \| undefined` | 否 | "zh" |
| className | `string \| undefined` | 否 | 未在参数解构处设置 |

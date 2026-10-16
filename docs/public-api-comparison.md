# 主分支与迁移版本 API 对照

基准 main：54598df83bfaa8a3580355d8952d558f79e24525。当前 HEAD：4f859e2b84171e1e7ce8cbf31b379c141caf710e，包含本地未提交源码。

通过 TypeScript 编译器解析 core 根入口的公开组件与实际参数类型，包含继承属性。以下是静态接口核对，不代表行为、示例或浏览器验收通过。类型文字变化需人工判断是否为破坏性修改。

## 智能体与聊天相关组件

| 组件 | main 参数数 | 当前参数数 | 新增参数 | 删除参数 | 类型变化 |
|---|---:|---:|---|---|---|
| ChatBubble | 14 | 22 | locale, motion, reactions, reactionOptions, onReaction, onReply, replyTo, delivery | — | — |
| ChatInputBar | 51 | 62 | locale, motion, replyTo, onCancelReply, attachments, hasAttachments, voiceState, voiceLevel, onVoiceStart, onVoiceEnd, onVoiceCancel | — | — |
| TopBar | 3 | 3 | — | — | color |
| PageTitleToolbar | 13 | 13 | — | — | — |
| AppLayout | 48 | 48 | — | — | — |
| AskAi | 25 | 29 | landingDescription, headerLayout, panelMode, onDockedChange | — | — |
| ThinkingTrace | 9 | 11 | locale, motion | — | — |
| StreamingAnswer | 14 | 15 | locale | — | — |
| ApprovalCard | 9 | 11 | locale, skipSubmitLabel | — | — |
| ToolChips | 4 | 9 | locale, motion, state, result, actions | — | — |
| AgentTaskRows | 4 | 5 | locale | — | — |
| ContextCards | 5 | 6 | locale | — | — |
| RecommendationCard | 11 | 12 | locale | — | — |
| AgentDiffTable | 10 | 11 | locale | — | — |
| AgentCodeBlock | 10 | 15 | locale, foldRanges, collapsedRangeIds, defaultCollapsedRangeIds, onCollapsedRangeIdsChange | — | — |
| InsightCards | 7 | 8 | locale | — | — |
| CommandSearch | 8 | 12 | locale, color, motion, autoFocus | — | — |
| AgentFlowchart | 9 | 10 | locale | — | — |

## 全部公开组件

| 组件 | main 参数数 | 当前参数数 | 新增参数 | 删除参数 | 类型变化 |
|---|---:|---:|---|---|---|
| NotificationBadge | 2 | 2 | — | — | color |
| Label | 4 | 4 | — | — | color |
| CircleIcon | 4 | 4 | — | — | color |
| ArtisticIcon | 3 | 3 | — | — | color |
| Button | 293 | 305 | holdDuration, onConfirm, onUndo, confirmed, locale, holdLabels, effect, loading, result, progress, loadingLabel, resultLabel | — | color |
| PlusIcon | 1 | 1 | — | — | — |
| CloseIcon | 1 | 1 | — | — | — |
| CheckIcon | 1 | 1 | — | — | — |
| IconButton | 292 | 297 | effect, active, loading, result, progress | — | color |
| StyledLink | 7 | 9 | effect, motion | — | color |
| ProgressBar | 8 | 14 | variant, indeterminate, motion, locale, children, className | — | color |
| Checkbox | 289 | 289 | — | — | color |
| Checklist | 7 | 8 | locale | — | — |
| ChecklistItem | 10 | 10 | — | — | — |
| Avatar | 6 | 6 | — | — | color |
| AvatarGroup | 2 | 2 | — | — | — |
| SurfaceCard | 10 | 287 | effect, motion, color, defaultChecked, defaultValue, suppressContentEditableWarning, suppressHydrationWarning, accessKey, autoCapitalize, autoFocus, contentEditable, contextMenu, dir, draggable, enterKeyHint, hidden, id, lang, nonce, slot, spellCheck, style, tabIndex, translate, radioGroup, role, about, content, datatype, inlist, prefix, property, rel, resource, rev, typeof, vocab, autoCorrect, autoSave, itemProp, itemScope, itemType, itemID, itemRef, results, security, unselectable, popover, popoverTargetAction, popoverTarget, inert, inputMode, is, exportparts, part, aria-activedescendant, aria-atomic, aria-autocomplete, aria-braillelabel, aria-brailleroledescription, aria-busy, aria-checked, aria-colcount, aria-colindex, aria-colindextext, aria-colspan, aria-controls, aria-current, aria-describedby, aria-description, aria-details, aria-disabled, aria-dropeffect, aria-errormessage, aria-expanded, aria-flowto, aria-grabbed, aria-haspopup, aria-hidden, aria-invalid, aria-keyshortcuts, aria-label, aria-labelledby, aria-level, aria-live, aria-modal, aria-multiline, aria-multiselectable, aria-orientation, aria-owns, aria-placeholder, aria-posinset, aria-pressed, aria-readonly, aria-relevant, aria-required, aria-roledescription, aria-rowcount, aria-rowindex, aria-rowindextext, aria-rowspan, aria-selected, aria-setsize, aria-sort, aria-valuemax, aria-valuemin, aria-valuenow, aria-valuetext, dangerouslySetInnerHTML, onCopy, onCopyCapture, onCut, onCutCapture, onPaste, onPasteCapture, onCompositionEnd, onCompositionEndCapture, onCompositionStart, onCompositionStartCapture, onCompositionUpdate, onCompositionUpdateCapture, onFocus, onFocusCapture, onBlur, onBlurCapture, onChange, onChangeCapture, onBeforeInput, onBeforeInputCapture, onInput, onInputCapture, onReset, onResetCapture, onSubmit, onSubmitCapture, onInvalid, onInvalidCapture, onLoad, onLoadCapture, onError, onErrorCapture, onKeyDown, onKeyDownCapture, onKeyPress, onKeyPressCapture, onKeyUp, onKeyUpCapture, onAbort, onAbortCapture, onCanPlay, onCanPlayCapture, onCanPlayThrough, onCanPlayThroughCapture, onDurationChange, onDurationChangeCapture, onEmptied, onEmptiedCapture, onEncrypted, onEncryptedCapture, onEnded, onEndedCapture, onLoadedData, onLoadedDataCapture, onLoadedMetadata, onLoadedMetadataCapture, onLoadStart, onLoadStartCapture, onPause, onPauseCapture, onPlay, onPlayCapture, onPlaying, onPlayingCapture, onProgress, onProgressCapture, onRateChange, onRateChangeCapture, onSeeked, onSeekedCapture, onSeeking, onSeekingCapture, onStalled, onStalledCapture, onSuspend, onSuspendCapture, onTimeUpdate, onTimeUpdateCapture, onVolumeChange, onVolumeChangeCapture, onWaiting, onWaitingCapture, onAuxClick, onAuxClickCapture, onClick, onClickCapture, onContextMenu, onContextMenuCapture, onDoubleClick, onDoubleClickCapture, onDrag, onDragCapture, onDragEnd, onDragEndCapture, onDragEnter, onDragEnterCapture, onDragExit, onDragExitCapture, onDragLeave, onDragLeaveCapture, onDragOver, onDragOverCapture, onDragStart, onDragStartCapture, onDrop, onDropCapture, onMouseDown, onMouseDownCapture, onMouseEnter, onMouseLeave, onMouseMove, onMouseMoveCapture, onMouseOut, onMouseOutCapture, onMouseOver, onMouseOverCapture, onMouseUp, onMouseUpCapture, onSelect, onSelectCapture, onTouchCancel, onTouchCancelCapture, onTouchEnd, onTouchEndCapture, onTouchMove, onTouchMoveCapture, onTouchStart, onTouchStartCapture, onPointerDown, onPointerDownCapture, onPointerMove, onPointerMoveCapture, onPointerUp, onPointerUpCapture, onPointerCancel, onPointerCancelCapture, onPointerEnter, onPointerLeave, onPointerOver, onPointerOverCapture, onPointerOut, onPointerOutCapture, onGotPointerCapture, onGotPointerCaptureCapture, onLostPointerCapture, onLostPointerCaptureCapture, onScroll, onScrollCapture, onScrollEnd, onScrollEndCapture, onWheel, onWheelCapture, onAnimationStart, onAnimationStartCapture, onAnimationEnd, onAnimationEndCapture, onAnimationIteration, onAnimationIterationCapture, onToggle, onBeforeToggle, onTransitionCancel, onTransitionCancelCapture, onTransitionEnd, onTransitionEndCapture, onTransitionRun, onTransitionRunCapture, onTransitionStart, onTransitionStartCapture | — | — |
| StatCard | 14 | 18 | animateValue, locale, numberFormat, motion | — | value |
| ProjectCard | 13 | 13 | — | — | — |
| TaskCard | 12 | 14 | locale, progressLabel | — | — |
| UserCard | 11 | 11 | — | — | initialsColor |
| ProgressStatCard | 15 | 15 | — | — | — |
| LineChartStatCard | 14 | 18 | animateValue, locale, numberFormat, motion | — | value |
| WheelChartStatCard | 13 | 13 | — | — | — |
| BarChartStatCard | 12 | 12 | — | — | — |
| BalanceCard | 14 | 14 | — | — | — |
| DebitCard | 7 | 9 | locale, balanceLabel | — | — |
| CreditCard | 7 | 10 | locale, cardNumberLabel, holderNameLabel | — | — |
| ImageStatCard | 16 | 16 | — | — | — |
| HighlightCard | 8 | 8 | — | — | — |
| ProgressCard | 10 | 10 | — | — | — |
| ActivityCard | 8 | 8 | — | — | — |
| ContactItem | 11 | 11 | — | — | — |
| ChatBubble | 14 | 22 | locale, motion, reactions, reactionOptions, onReaction, onReply, replyTo, delivery | — | — |
| ChatInputBar | 51 | 62 | locale, motion, replyTo, onCancelReply, attachments, hasAttachments, voiceState, voiceLevel, onVoiceStart, onVoiceEnd, onVoiceCancel | — | — |
| CommentItem | 8 | 9 | replyLabel | — | — |
| ReviewItem | 12 | 14 | ratingLabel, menuLabel | — | — |
| FilterGroup | 5 | 5 | — | — | — |
| FilterTrigger | 6 | 6 | — | — | — |
| FilterPanel | 10 | 10 | — | — | — |
| HistoryItem | 11 | 11 | — | — | color |
| HistoryGrouped | 8 | 8 | — | — | color |
| EventTag | 7 | 7 | — | — | color |
| CalendarDayCell | 9 | 9 | — | — | — |
| CalendarWeekRow | 3 | 3 | — | — | — |
| EventCard | 7 | 7 | — | — | — |
| SmallCalendar | 7 | 7 | — | — | — |
| SmallDailyCalendar | 7 | 7 | — | — | — |
| FullCalendar | 9 | 9 | — | — | — |
| MeterChart | 6 | 6 | — | — | — |
| HalfDonutChart | 7 | 7 | — | — | — |
| DashedHalfDonutChart | 7 | 7 | — | — | — |
| DonutChart | 8 | 14 | interactive, activeIndex, onActiveIndexChange, onSegmentToggle, motion, ariaLabel | — | — |
| PieChart | 4 | 4 | — | — | — |
| MultilayerDonutChart | 6 | 10 | sweep, motion, activeIndex, ariaLabel | — | — |
| BubbleChart | 3 | 3 | — | — | — |
| BarChart | 11 | 19 | onActiveIndexChange, onSelect, pinnedIndex, domain, referenceValue, referenceLabel, motion, ariaLabel | — | — |
| BarHorizontalChart | 10 | 15 | domain, target, targetLabel, ranges, motion | — | — |
| BarUpsideDownChart | 12 | 12 | — | — | — |
| SmoothLineChart | 10 | 18 | stacked, bands, motion, onActiveIndexChange, ariaLabel, interpolation, highlightToActive, markers | — | — |
| ChartTooltip | 2 | 2 | — | — | — |
| ChartCard | 10 | 10 | — | — | — |
| ChartListItem | 7 | 7 | — | — | — |
| ChartLegendItem | 5 | 5 | — | — | — |
| ChartValueRow | 5 | 5 | — | — | — |
| ChartStatFooter | 2 | 2 | — | — | — |
| ListItem | 9 | 12 | onSwipeAction, swipeActionLabel, motion | — | — |
| DescriptionItem | 5 | 5 | — | — | — |
| ListGroup | 13 | 13 | — | — | — |
| MapCard | 9 | 9 | — | — | — |
| MenuItem | 15 | 15 | — | — | — |
| DropdownPanel | 5 | 5 | — | — | — |
| IconTrigger | 13 | 15 | initialFocus, panelAlign | — | — |
| ProfileCard | 8 | 8 | — | — | — |
| NotificationItem | 10 | 10 | — | — | — |
| KebabMenu | 6 | 6 | — | — | — |
| SidebarMenu | 16 | 16 | — | — | — |
| TextField | 320 | 323 | labelPlacement, locale, activeTag | — | — |
| TextArea | 301 | 301 | — | — | — |
| SelectOption | 15 | 15 | — | — | — |
| MediaUpload | 8 | 8 | — | — | — |
| ProfileImgUpload | 6 | 6 | — | — | — |
| FileUpload | 8 | 9 | locale | — | — |
| FileCard | 4 | 6 | locale, color | — | — |
| FileTypeIcon | 3 | 3 | — | — | — |
| Datepicker | 12 | 18 | locale, confirmSelection, rangeLabels, inline, minDate, maxDate | — | — |
| Toggle | 7 | 10 | defaultChecked, draggable, thumbIcon | — | — |
| RadioButton | 5 | 5 | — | — | — |
| RadioWithLabel | 8 | 9 | tabIndex | — | — |
| CheckboxControl | 289 | 289 | — | — | color |
| CheckboxWithLabel | 11 | 11 | — | — | — |
| IconSelector | 8 | 8 | — | — | — |
| IconPicker | 6 | 6 | — | — | — |
| ColorPicker | 4 | 4 | — | — | — |
| TextFieldSelectSuffix | 5 | 5 | — | — | — |
| ConfirmationDialog | 13 | 13 | — | — | color |
| Tooltip | 7 | 8 | followCursor | — | — |
| TooltipBubble | 3 | 3 | — | — | — |
| TooltipAnchor | 290 | 290 | — | — | — |
| TooltipGroup | 3 | 3 | — | — | — |
| PageDot | 5 | 5 | — | — | color |
| Pagination | 5 | 7 | locale, motion | — | color |
| Stepper | 4 | 9 | items, onStepChange, motion, locale, indicator | — | total, color |
| TabBar | 7 | 9 | appearance, progress | — | color |
| ButtonGroup | 8 | 8 | — | — | color |
| TopBar | 3 | 3 | — | — | color |
| PageHeader | 56 | 56 | — | — | — |
| Breadcrumbs | 4 | 4 | — | — | color |
| Toolbar | 3 | 6 | selection, locale, motion | — | — |
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
| RatingStars | 5 | 11 | onChange, readOnly, disabled, locale, ariaLabel, motion | — | — |
| ImageGrid | 5 | 5 | — | — | — |
| ProductRow | 5 | 5 | — | — | — |
| TableCell | 10 | 10 | — | — | checkboxColor |
| DataTable | 28 | 28 | — | — | checkboxColor |
| FullWidthTable | 33 | 33 | — | — | checkboxColor |
| StatusBadge | 3 | 3 | — | — | color |
| ProgressBadge | 2 | 2 | — | — | — |
| CellText | 1 | 1 | — | — | — |
| CellTextSubtitle | 2 | 2 | — | — | — |
| CellMuted | 1 | 1 | — | — | — |
| CellImageText | 4 | 4 | — | — | — |
| CellProgressValue | 3 | 3 | — | — | — |
| CellKebabMenu | 1 | 1 | — | — | — |
| CellStatusDot | 3 | 3 | — | — | color |
| CellNumber | 5 | 5 | — | — | — |
| CellProgressBar | 3 | 3 | — | — | color |
| CellCode | 1 | 1 | — | — | — |
| CellRating | 2 | 2 | — | — | — |
| CellFile | 3 | 3 | — | — | — |
| CellActions | 5 | 5 | — | — | — |
| CellLink | 3 | 3 | — | — | color |
| CardGlow | 1 | 1 | — | — | — |
| CardTrend | 4 | 4 | — | — | — |
| CardIconChip | 5 | 5 | — | — | — |
| CardKebabButton | 2 | 2 | — | — | — |
| CardAvatarGroup | 4 | 4 | — | — | — |
| StatCardShell | 16 | 16 | — | — | value |
| FinancialOrbs | 2 | 2 | — | — | — |
| ColorSwatch | 4 | 4 | — | — | — |
| ColorSection | 4 | 4 | — | — | — |
| TypefaceBlock | 2 | 2 | — | — | — |
| TypographyWeightSample | 3 | 3 | — | — | — |
| TypographySizeRow | 3 | 3 | — | — | — |
| AppLayout | 48 | 48 | — | — | — |
| AskAi | 25 | 29 | landingDescription, headerLayout, panelMode, onDockedChange | — | — |
| ThinkingTrace | 9 | 11 | locale, motion | — | — |
| StreamingAnswer | 14 | 15 | locale | — | — |
| ApprovalCard | 9 | 11 | locale, skipSubmitLabel | — | — |
| ToolChips | 4 | 9 | locale, motion, state, result, actions | — | — |
| AgentTaskRows | 4 | 5 | locale | — | — |
| ContextCards | 5 | 6 | locale | — | — |
| RecommendationCard | 11 | 12 | locale | — | — |
| AgentDiffTable | 10 | 11 | locale | — | — |
| AgentCodeBlock | 10 | 15 | locale, foldRanges, collapsedRangeIds, defaultCollapsedRangeIds, onCollapsedRangeIdsChange | — | — |
| InsightCards | 7 | 8 | locale | — | — |
| CommandSearch | 8 | 12 | locale, color, motion, autoFocus | — | — |
| AgentFlowchart | 9 | 10 | locale | — | — |
| Modal | 7 | 9 | locale, closeLabel | — | — |
| Drawer | 8 | 12 | transition, revealOrigin, locale, closeLabel | — | — |
| Accordion | 6 | 6 | — | — | — |
| TabsContent | 7 | 12 | panels, onActiveKeyChange, onProgressChange, transition, direction | — | — |
| ToastProvider | 2 | 4 | locale, stacked | — | — |
| OtpInput | 17 | 19 | locale, clearOnError | — | — |
| CalendarCard | 11 | 11 | — | — | color |
| LiquidTabs | 14 | 14 | — | — | — |
| AddMember | 15 | 16 | accent | — | — |
| Grid | 285 | 285 | — | — | — |
| GridItem | 282 | 282 | — | — | — |
| AppSwitcherDropdown | 5 | 6 | locale | — | — |

## 导出变化

删除：无。

新增：AgentCodeFoldRange, ButtonEffect, ButtonHoldLabels, ButtonProps, ChatReaction, ChatReactionOption, ComposerReply, ComposerVoiceState, IconButtonEffect, StepperItem, ToggleProps, ToolbarProps, ToolbarSelectionOptions。

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

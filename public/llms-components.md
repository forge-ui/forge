# Forge UI Kit

Package: @forge-ui-official/core@0.6.0
Source: this repository; forge-skill + generated core exports + real page routes
Source fingerprint: e67e610c6703ac3b7c1de582d740e1adff3db5867db3df4d1385a75107acc917

## Adopted rules / 采用规则

Screen → Blocks → Components. Start dashboards from a real Screen; 17 Blocks are implemented as copyable project source in blocks/ with public/r registry items, not core exports; core 0.6.0 and registry publication require separate approval; visual screenshot acceptance remains pending. Default status: soft StatusBadge; categories/roles use plain text. Default accent/focus: blue; purple/black optional. Icons: @forge-ui-official/core/icons. Missing capabilities: FORGE-GAP, ask before adding public primitives. In forge-starter use its host skills for routes, permission and data integration. Technical checks do not establish browser or production readiness.

## Public exports (487, values and types distinguished)

- AccentColor [type] — core/src/components/ui/accent-utils.ts
- accentColors [value] — core/src/components/ui/accent-utils.ts
- AccentConfig [type] — core/src/components/ui/accent-utils.ts
- Accordion [value] — core/src/components/ui/accordion.tsx
- AccordionItem [type] — core/src/components/ui/accordion.tsx
- AccordionProps [type] — core/src/components/ui/accordion.tsx
- ActivityCard [value] — core/src/components/ui/activity-card.tsx
- AddMember [value] — core/src/components/ui/add-member.tsx
- AddMemberItem [type] — core/src/components/ui/add-member.tsx
- AddMemberLabels [type] — core/src/components/ui/add-member.tsx
- AddMemberProps [type] — core/src/components/ui/add-member.tsx
- AgentCodeBlock [value] — core/src/components/ui/agent/agent-code-block.tsx
- AgentCodeDiffRow [type] — core/src/components/ui/agent/agent-code-block.tsx
- AgentCodeDiffType [type] — core/src/components/ui/agent/agent-code-block.tsx
- AgentCodeFoldRange [type] — core/src/components/ui/agent/agent-code-block.tsx
- AgentCodePiece [type] — core/src/components/ui/agent/agent-code-block.tsx
- AgentDiffChange [type] — core/src/components/ui/agent/agent-diff-table.tsx
- AgentDiffColumn [type] — core/src/components/ui/agent/agent-diff-table.tsx
- AgentDiffRow [type] — core/src/components/ui/agent/agent-diff-table.tsx
- AgentDiffTable [value] — core/src/components/ui/agent/agent-diff-table.tsx
- AgentFlowchart [value] — core/src/components/ui/agent/agent-flowchart.tsx
- AgentFlowEdge [type] — core/src/components/ui/agent/agent-flowchart.tsx
- AgentFlowKind [type] — core/src/components/ui/agent/agent-flowchart.tsx
- AgentFlowNode [type] — core/src/components/ui/agent/agent-flowchart.tsx
- AgentTask [type] — core/src/components/ui/agent/agent-task-rows.tsx
- AgentTaskChild [type] — core/src/components/ui/agent/agent-task-rows.tsx
- AgentTaskRows [value] — core/src/components/ui/agent/agent-task-rows.tsx
- AgentTaskStatus [type] — core/src/components/ui/agent/agent-task-rows.tsx
- ALL_CARD_THEMES [value] — core/src/components/ui/card-utils.tsx
- AppLayout [value] — core/src/components/layouts/app-layout.tsx
- AppLayoutAccentColor [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutBreadcrumb [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutLanguage [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutMenuItem [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutMenuSection [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutMode [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutPageHeaderVariant [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutProfile [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutProfilePosition [type] — core/src/components/layouts/app-layout.tsx
- AppLayoutProps [type] — core/src/components/layouts/app-layout.tsx
- ApprovalCard [value] — core/src/components/ui/agent/approval-card.tsx
- ApprovalQuestion [type] — core/src/components/ui/agent/approval-card.tsx
- AppSwitcherDropdown [value] — core/src/components/layouts/sidebar-popovers.tsx
- AppSwitcherItem [type] — core/src/components/layouts/sidebar-popovers.tsx
- ArtisticIcon [value] — core/src/components/ui/badge.tsx
- ArtisticIconColor [type] — core/src/components/ui/badge.tsx
- ArtisticIconVariant [type] — core/src/components/ui/badge.tsx
- ASK_AI_FS_LAYER_ATTR [value] — core/src/internal/ask-ai-fullscreen.tsx
- ASK_AI_FULLSCREEN_RAIL_WIDTH [value] — core/src/internal/ask-ai-fullscreen.tsx
- AskAi [value] — core/src/components/ui/ask-ai.tsx
- AskAiLink [type] — core/src/internal/ask-ai-types.ts
- AskAiMessage [type] — core/src/internal/ask-ai-types.ts
- AskAiProps [type] — core/src/components/ui/ask-ai.tsx
- AskAiRequest [type] — core/src/internal/ask-ai-types.ts
- AskAiResponse [type] — core/src/internal/ask-ai-types.ts
- AskAiSessionItem [type] — core/src/internal/ask-ai-types.ts
- Avatar [value] — core/src/components/ui/avatar.tsx
- AvatarGroup [value] — core/src/components/ui/avatar.tsx
- AvatarInitialColor [type] — core/src/components/ui/avatar.tsx
- AvatarSize [type] — core/src/components/ui/avatar.tsx
- BalanceCard [value] — core/src/components/ui/balance-card.tsx
- BalanceCardProps [type] — core/src/components/ui/balance-card.tsx
- BarChart [value] — core/src/components/ui/charts/bar-chart.tsx
- BarChartStatCard [value] — core/src/components/ui/bar-chart-stat-card.tsx
- BarChartStatCardProps [type] — core/src/components/ui/bar-chart-stat-card.tsx
- BarColor [type] — core/src/components/ui/bar-chart-stat-card.tsx
- BarHorizontalChart [value] — core/src/components/ui/charts/bar-horizontal-chart.tsx
- BarUpsideDownChart [value] — core/src/components/ui/charts/bar-upside-down-chart.tsx
- BreadcrumbColor [type] — core/src/components/ui/breadcrumbs.tsx
- BreadcrumbItem [type] — core/src/components/ui/breadcrumbs.tsx
- Breadcrumbs [value] — core/src/components/ui/breadcrumbs.tsx
- BubbleChart [value] — core/src/components/ui/charts/bubble-chart.tsx
- Button [value] — core/src/components/ui/button.tsx
- ButtonColor [type] — core/src/components/ui/button.tsx
- ButtonEffect [type] — core/src/components/ui/button.tsx
- ButtonGroup [value] — core/src/components/ui/button-group.tsx
- ButtonGroupColor [type] — core/src/components/ui/button-group.tsx
- ButtonGroupItem [type] — core/src/components/ui/button-group.tsx
- ButtonGroupShape [type] — core/src/components/ui/button-group.tsx
- ButtonHoldLabels [type] — core/src/components/ui/button.tsx
- ButtonProps [type] — core/src/components/ui/button.tsx
- ButtonSize [type] — core/src/components/ui/button.tsx
- ButtonVariant [type] — core/src/components/ui/button.tsx
- CalendarCard [value] — core/src/components/ui/calendar-card.tsx
- CalendarCardLabels [type] — core/src/components/ui/calendar-card.tsx
- CalendarCardProps [type] — core/src/components/ui/calendar-card.tsx
- CalendarDayCell [value] — core/src/components/ui/calendar-day-cell.tsx
- CalendarEvent [type] — core/src/components/ui/full-calendar.tsx
- CalendarWeekRow [value] — core/src/components/ui/calendar-week-row.tsx
- CardAvatarGroup [value] — core/src/components/ui/card-utils.tsx
- CardBadgeVariant [type] — core/src/components/ui/card-utils.tsx
- CardDensity [type] — core/src/components/ui/card-utils.tsx
- CardGlow [value] — core/src/components/ui/card-utils.tsx
- CardIconChip [value] — core/src/components/ui/card-utils.tsx
- CardKebabButton [value] — core/src/components/ui/card-utils.tsx
- CardTheme [type] — core/src/components/ui/card-utils.tsx
- CardThemeConfig [type] — core/src/components/ui/card-utils.tsx
- cardThemes [value] — core/src/components/ui/card-utils.tsx
- CardTrend [value] — core/src/components/ui/card-utils.tsx
- CardWidth [type] — core/src/components/ui/card-utils.tsx
- CellActionKey [type] — core/src/components/ui/data-table.tsx
- CellActions [value] — core/src/components/ui/data-table.tsx
- CellCode [value] — core/src/components/ui/data-table.tsx
- CellContentType [type] — core/src/components/ui/data-table.tsx
- CellFile [value] — core/src/components/ui/data-table.tsx
- CellImageText [value] — core/src/components/ui/data-table.tsx
- CellKebabMenu [value] — core/src/components/ui/data-table.tsx
- CellLink [value] — core/src/components/ui/data-table.tsx
- CellLinkColor [type] — core/src/components/ui/data-table.tsx
- CellMuted [value] — core/src/components/ui/data-table.tsx
- CellNumber [value] — core/src/components/ui/data-table.tsx
- CellProgressBar [value] — core/src/components/ui/data-table.tsx
- CellProgressValue [value] — core/src/components/ui/data-table.tsx
- CellRating [value] — core/src/components/ui/data-table.tsx
- CellStatusDot [value] — core/src/components/ui/data-table.tsx
- CellText [value] — core/src/components/ui/data-table.tsx
- CellTextSubtitle [value] — core/src/components/ui/data-table.tsx
- ChartCard [value] — core/src/components/ui/charts/chart-card.tsx
- ChartHeader [value] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartHeaderProps [type] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartLegendItem [value] — core/src/components/ui/charts/chart-legend-item.tsx
- ChartListItem [value] — core/src/components/ui/charts/chart-list-item.tsx
- ChartMetricRow [value] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartMetricRowProps [type] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartMetricSeries [type] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartStatFooter [value] — core/src/components/ui/charts/chart-stat-footer.tsx
- ChartTooltip [value] — core/src/components/ui/charts/chart-tooltip.tsx
- ChartTrend [type] — core/src/components/ui/charts/dashboard-charts.tsx
- ChartValueRow [value] — core/src/components/ui/charts/chart-value-row.tsx
- ChatBubble [value] — core/src/components/ui/chat-bubble.tsx
- ChatInputBar [value] — core/src/components/ui/chat-input-bar.tsx
- ChatInputBarQuickAction [type] — core/src/components/ui/chat-input-bar.tsx
- ChatInputBarSendContext [type] — core/src/components/ui/chat-input-bar.tsx
- ChatInputBarToggle [type] — core/src/components/ui/chat-input-bar.tsx
- ChatReaction [type] — core/src/internal/chat-interactions.tsx
- ChatReactionOption [type] — core/src/internal/chat-interactions.tsx
- Checkbox [value] — core/src/components/ui/checkbox.tsx
- CheckboxColor [type] — core/src/components/ui/checkbox.tsx
- CheckboxControl [value] — core/src/components/ui/checkbox.tsx
- CheckboxWithLabel [value] — core/src/components/ui/forms/selection-control.tsx
- CheckIcon [value] — core/src/components/ui/plain-icons.tsx
- Checklist [value] — core/src/components/ui/checklist.tsx
- ChecklistColor [type] — core/src/components/ui/checklist.tsx
- ChecklistItem [value] — core/src/components/ui/checklist.tsx
- ChecklistSize [type] — core/src/components/ui/checklist.tsx
- ChecklistTask [type] — core/src/components/ui/checklist.tsx
- CircleIcon [value] — core/src/components/ui/badge.tsx
- CircleIconColor [type] — core/src/components/ui/badge.tsx
- CircleIconSize [type] — core/src/components/ui/badge.tsx
- CircleIconVariant [type] — core/src/components/ui/badge.tsx
- CloseIcon [value] — core/src/components/ui/plain-icons.tsx
- cn [value] — core/src/lib/utils.ts
- ColorPicker [value] — core/src/components/ui/forms/icon-selector.tsx
- ColorScaleStop [type] — core/src/components/ui/style-guide.tsx
- ColorSection [value] — core/src/components/ui/style-guide.tsx
- ColorSwatch [value] — core/src/components/ui/style-guide.tsx
- ColorSwatchSize [type] — core/src/components/ui/style-guide.tsx
- ColumnDef [type] — core/src/components/ui/data-table.tsx
- CommandSearch [value] — core/src/components/ui/agent/command-search.tsx
- CommandSearchItem [type] — core/src/components/ui/agent/command-search.tsx
- CommentData [type] — core/src/components/ui/comment-item.tsx
- CommentItem [value] — core/src/components/ui/comment-item.tsx
- CommentReply [type] — core/src/components/ui/comment-item.tsx
- ComposerCommand [type] — core/src/components/ui/chat-input-bar.tsx
- ComposerModel [type] — core/src/components/ui/composer-types.ts
- ComposerReply [type] — core/src/components/ui/composer-types.ts
- ComposerSource [type] — core/src/components/ui/chat-input-bar.tsx
- ComposerStatus [type] — core/src/components/ui/composer-types.ts
- ComposerVoiceState [type] — core/src/components/ui/composer-types.ts
- ConfirmationDialog [value] — core/src/components/ui/confirmation-dialog.tsx
- ConfirmationDialogColor [type] — core/src/components/ui/confirmation-dialog.tsx
- ConfirmationDialogLayout [type] — core/src/components/ui/confirmation-dialog.tsx
- ContactItem [value] — core/src/components/ui/contact-item.tsx
- ContextCards [value] — core/src/components/ui/agent/context-cards.tsx
- ContextChunk [type] — core/src/components/ui/agent/context-cards.tsx
- ControlColor [type] — core/src/components/ui/forms/selection-control.tsx
- CreditCard [value] — core/src/components/ui/credit-card.tsx
- CurrencyConverter [value] — core/src/components/ui/currency-converter.tsx
- CurrencyConverterColor [type] — core/src/components/ui/currency-converter.tsx
- DailyEvent [type] — core/src/components/ui/small-daily-calendar.tsx
- DashedHalfDonutChart [value] — core/src/components/ui/charts/dashed-half-donut-chart.tsx
- DataTable [value] — core/src/components/ui/data-table.tsx
- DataTableColor [type] — core/src/components/ui/data-table.tsx
- DataTableProps [type] — core/src/components/ui/data-table.tsx
- Datepicker [value] — core/src/components/ui/forms/datepicker.tsx
- DatepickerColor [type] — core/src/components/ui/forms/datepicker.tsx
- DatepickerMode [type] — core/src/components/ui/forms/datepicker.tsx
- DatepickerShape [type] — core/src/components/ui/forms/datepicker.tsx
- DatepickerState [type] — core/src/components/ui/forms/datepicker.tsx
- DebitCard [value] — core/src/components/ui/debit-card.tsx
- DescriptionItem [value] — core/src/components/ui/list-item.tsx
- DescriptionItemLead [type] — core/src/components/ui/list-item.tsx
- DivergingBarChart [value] — core/src/components/ui/charts/dashboard-charts.tsx
- DivergingBarChartProps [type] — core/src/components/ui/charts/dashboard-charts.tsx
- DonutChart [value] — core/src/components/ui/charts/donut-chart.tsx
- Drawer [value] — core/src/components/ui/drawer.tsx
- DrawerProps [type] — core/src/components/ui/drawer.tsx
- DropdownDivider [value] — core/src/components/ui/dropdown-panel.tsx
- DropdownPanel [value] — core/src/components/ui/dropdown-panel.tsx
- EventCard [value] — core/src/components/ui/event-card.tsx
- EventCardColor [type] — core/src/components/ui/event-card.tsx
- EventTag [value] — core/src/components/ui/event-tag.tsx
- EventTagColor [type] — core/src/components/ui/event-tag.tsx
- EventTagSize [type] — core/src/components/ui/event-tag.tsx
- EventTagVariant [type] — core/src/components/ui/event-tag.tsx
- FileCard [value] — core/src/components/ui/forms/file-upload.tsx
- FileInput [value] — core/src/components/ui/forms/file-input.tsx
- FileInputProps [type] — core/src/components/ui/forms/file-input.tsx
- FileItem [type] — core/src/components/ui/forms/file-upload.tsx
- FileState [type] — core/src/components/ui/forms/file-upload.tsx
- FileTypeIcon [value] — core/src/components/ui/forms/file-upload.tsx
- FileUpload [value] — core/src/components/ui/forms/file-upload.tsx
- FileUploadColor [type] — core/src/components/ui/forms/file-upload.tsx
- FilterGroup [value] — core/src/components/ui/filter-group.tsx
- FilterGroupCheckboxOption [type] — core/src/components/ui/filter-group.tsx
- FilterGroupColor [type] — core/src/components/ui/filter-group.tsx
- FilterGroupContent [type] — core/src/components/ui/filter-group.tsx
- FilterGroupRadioOption [type] — core/src/components/ui/filter-group.tsx
- FilterPanel [value] — core/src/components/ui/filter-panel.tsx
- FilterTrigger [value] — core/src/components/ui/filter-trigger.tsx
- FinancialOrbs [value] — core/src/components/ui/card-utils.tsx
- FinancialTheme [type] — core/src/components/ui/card-utils.tsx
- FinancialThemeConfig [type] — core/src/components/ui/card-utils.tsx
- financialThemes [value] — core/src/components/ui/card-utils.tsx
- FinancialVariant [type] — core/src/components/ui/card-utils.tsx
- Folder [value] — core/src/components/ui/folder.tsx
- FolderFloat [value] — core/src/components/ui/folder-float.tsx
- FolderFloatProps [type] — core/src/components/ui/folder-float.tsx
- FolderItem [type] — core/src/components/ui/folder.tsx
- FolderProps [type] — core/src/components/ui/folder.tsx
- FullCalendar [value] — core/src/components/ui/full-calendar.tsx
- FullWidthTable [value] — core/src/components/ui/data-table.tsx
- FullWidthTableProps [type] — core/src/components/ui/data-table.tsx
- Grid [value] — core/src/components/layouts/grid.tsx
- GridBreakpoint [type] — core/src/components/layouts/grid.tsx
- GridColumns [type] — core/src/components/layouts/grid.tsx
- GridGap [type] — core/src/components/layouts/grid.tsx
- GridItem [value] — core/src/components/layouts/grid.tsx
- GridItemProps [type] — core/src/components/layouts/grid.tsx
- GridProps [type] — core/src/components/layouts/grid.tsx
- GridResponsive [type] — core/src/components/layouts/grid.tsx
- GridSpan [type] — core/src/components/layouts/grid.tsx
- GroupedBarChart [value] — core/src/components/ui/charts/dashboard-charts.tsx
- GroupedBarChartProps [type] — core/src/components/ui/charts/dashboard-charts.tsx
- GroupedBarPoint [type] — core/src/components/ui/charts/dashboard-charts.tsx
- GroupedBarTooltipItem [type] — core/src/components/ui/charts/dashboard-charts.tsx
- HalfDonutChart [value] — core/src/components/ui/charts/half-donut-chart.tsx
- HighlightCard [value] — core/src/components/ui/highlight-card.tsx
- HighlightCardProps [type] — core/src/components/ui/highlight-card.tsx
- HistoryGrouped [value] — core/src/components/ui/history-grouped.tsx
- HistoryItem [value] — core/src/components/ui/history-item.tsx
- HistoryItemColor [type] — core/src/components/ui/history-item.tsx
- HistoryItemProps [type] — core/src/components/ui/history-item.tsx
- HistoryItemShowDatetime [type] — core/src/components/ui/history-item.tsx
- HistoryItemVariant [type] — core/src/components/ui/history-item.tsx
- IconButton [value] — core/src/components/ui/icon-button.tsx
- IconButtonColor [type] — core/src/components/ui/icon-button.tsx
- IconButtonEffect [type] — core/src/components/ui/icon-button.tsx
- IconButtonShape [type] — core/src/components/ui/icon-button.tsx
- IconButtonSize [type] — core/src/components/ui/icon-button.tsx
- IconButtonVariant [type] — core/src/components/ui/icon-button.tsx
- IconPicker [value] — core/src/components/ui/forms/icon-selector.tsx
- IconSelector [value] — core/src/components/ui/forms/icon-selector.tsx
- IconSelectorColor [type] — core/src/components/ui/forms/icon-selector.tsx
- IconTrigger [value] — core/src/components/ui/icon-trigger.tsx
- IconTriggerAccent [type] — core/src/components/ui/icon-trigger.tsx
- IconTriggerState [type] — core/src/components/ui/icon-trigger.tsx
- IconTriggerSurface [type] — core/src/components/ui/icon-trigger.tsx
- ImageGrid [value] — core/src/components/ui/image-grid.tsx
- ImageGridSize [type] — core/src/components/ui/image-grid.tsx
- ImageStatCard [value] — core/src/components/ui/image-stat-card.tsx
- ImageStatCardProps [type] — core/src/components/ui/image-stat-card.tsx
- InfoRow [value] — core/src/components/ui/info-row.tsx
- InfoRowProps [type] — core/src/components/ui/info-row.tsx
- InsightCard [type] — core/src/components/ui/agent/insight-cards.tsx
- InsightCards [value] — core/src/components/ui/agent/insight-cards.tsx
- InsightChart [type] — core/src/components/ui/agent/insight-cards.tsx
- InsightSeries [type] — core/src/components/ui/agent/insight-cards.tsx
- InsightTone [type] — core/src/components/ui/agent/insight-cards.tsx
- KebabMenu [value] — core/src/components/ui/kebab-menu.tsx
- KebabMenuAccent [type] — core/src/components/ui/kebab-menu.tsx
- KebabMenuItem [type] — core/src/components/ui/kebab-menu.tsx
- Label [value] — core/src/components/ui/badge.tsx
- LabelColor [type] — core/src/components/ui/badge.tsx
- LabelSize [type] — core/src/components/ui/badge.tsx
- LabelVariant [type] — core/src/components/ui/badge.tsx
- LegacyCardTheme [type] — core/src/components/ui/card-utils.tsx
- LineChartColor [type] — core/src/components/ui/line-chart-stat-card.tsx
- LineChartStatCard [value] — core/src/components/ui/line-chart-stat-card.tsx
- LineChartStatCardProps [type] — core/src/components/ui/line-chart-stat-card.tsx
- LinkColor [type] — core/src/components/ui/link.tsx
- LiquidTabs [value] — core/src/components/ui/liquid-tabs.tsx
- LiquidTabsItem [type] — core/src/components/ui/liquid-tabs.tsx
- LiquidTabsProps [type] — core/src/components/ui/liquid-tabs.tsx
- LiquidTabsTab [type] — core/src/components/ui/liquid-tabs.tsx
- ListGroup [value] — core/src/components/ui/list-group.tsx
- ListGroupProps [type] — core/src/components/ui/list-group.tsx
- ListGroupTab [type] — core/src/components/ui/list-group.tsx
- ListItem [value] — core/src/components/ui/list-item.tsx
- ListItemAvatarLead [type] — core/src/components/ui/list-item.tsx
- ListItemIconLead [type] — core/src/components/ui/list-item.tsx
- ListItemImageLead [type] — core/src/components/ui/list-item.tsx
- ListItemLead [type] — core/src/components/ui/list-item.tsx
- MapCard [value] — core/src/components/ui/map-card.tsx
- MapContinent [type] — core/src/components/ui/map-card.tsx
- MapRegion [type] — core/src/components/ui/map-card.tsx
- MapVariant [type] — core/src/components/ui/map-card.tsx
- MastercardLogo [value] — core/src/components/ui/card-utils.tsx
- MediaItem [type] — core/src/components/ui/forms/media-upload.tsx
- MediaUpload [value] — core/src/components/ui/forms/media-upload.tsx
- MediaUploadColor [type] — core/src/components/ui/forms/media-upload.tsx
- MenuItem [value] — core/src/components/ui/menu-item.tsx
- MenuItemAccent [type] — core/src/components/ui/menu-item.tsx
- MenuItemIntent [type] — core/src/components/ui/menu-item.tsx
- MenuItemKind [type] — core/src/components/ui/menu-item.tsx
- MenuItemLead [type] — core/src/components/ui/menu-item.tsx
- MenuItemState [type] — core/src/components/ui/menu-item.tsx
- MenuItemSurface [type] — core/src/components/ui/menu-item.tsx
- MeterChart [value] — core/src/components/ui/charts/meter-chart.tsx
- Modal [value] — core/src/components/ui/modal.tsx
- ModalProps [type] — core/src/components/ui/modal.tsx
- MotionPreference [type] — core/src/lib/motion.ts
- MultilayerDonutChart [value] — core/src/components/ui/charts/multilayer-donut-chart.tsx
- NotificationBadge [value] — core/src/components/ui/badge.tsx
- NotificationBadgeColor [type] — core/src/components/ui/badge.tsx
- NotificationItem [value] — core/src/components/ui/notification-item.tsx
- NotificationItemColor [type] — core/src/components/ui/notification-item.tsx
- OtpInput [value] — core/src/components/ui/otp-input.tsx
- OtpInputProps [type] — core/src/components/ui/otp-input.tsx
- PageDot [value] — core/src/components/ui/page-dot.tsx
- PageDotColor [type] — core/src/components/ui/page-dot.tsx
- PageHeader [value] — core/src/components/ui/page-header.tsx
- PageHeaderAction [type] — core/src/components/ui/page-header.tsx
- PageHeaderColor [type] — core/src/components/ui/page-header.tsx
- PageHeaderProfile [type] — core/src/components/ui/page-header.tsx
- PageHeaderProps [type] — core/src/components/ui/page-header.tsx
- PageHeaderVariant [type] — core/src/components/ui/page-header.tsx
- PageTitleToolbar [value] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarAction [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarDateAction [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarMenuAction [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarPresetProps [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarProps [type] — core/src/components/ui/toolbar.tsx
- PageTitleToolbarVariant [type] — core/src/components/ui/toolbar.tsx
- Pagination [value] — core/src/components/ui/pagination.tsx
- PaginationColor [type] — core/src/components/ui/pagination.tsx
- Panel [value] — core/src/components/ui/panel.tsx
- PanelProps [type] — core/src/components/ui/panel.tsx
- PieChart [value] — core/src/components/ui/charts/pie-chart.tsx
- PlusIcon [value] — core/src/components/ui/plain-icons.tsx
- ProductRow [value] — core/src/components/ui/product-row.tsx
- ProfileCard [value] — core/src/components/ui/profile-card.tsx
- ProfileCardState [type] — core/src/components/ui/profile-card.tsx
- ProfileCardSurface [type] — core/src/components/ui/profile-card.tsx
- ProfileImgUpload [value] — core/src/components/ui/forms/media-upload.tsx
- ProgressBadge [value] — core/src/components/ui/data-table.tsx
- ProgressBadgeColor [type] — core/src/components/ui/data-table.tsx
- ProgressBar [value] — core/src/components/ui/progress-bar.tsx
- ProgressBarColor [type] — core/src/components/ui/data-table.tsx
- ProgressCard [value] — core/src/components/ui/progress-card.tsx
- ProgressColor [type] — core/src/components/ui/progress-bar.tsx
- ProgressLabelSize [type] — core/src/components/ui/progress-bar.tsx
- ProgressLabelVariant [type] — core/src/components/ui/progress-bar.tsx
- ProgressSize [type] — core/src/components/ui/progress-bar.tsx
- ProgressStatCard [value] — core/src/components/ui/progress-stat-card.tsx
- ProgressStatCardProps [type] — core/src/components/ui/progress-stat-card.tsx
- ProjectCard [value] — core/src/components/ui/project-card.tsx
- ProjectCardColor [type] — core/src/components/ui/project-card.tsx
- RadioButton [value] — core/src/components/ui/forms/selection-control.tsx
- RadioWithLabel [value] — core/src/components/ui/forms/selection-control.tsx
- RatingStars [value] — core/src/components/ui/rating-stars.tsx
- RatingStarsSize [type] — core/src/components/ui/rating-stars.tsx
- RecommendationCard [value] — core/src/components/ui/agent/recommendation-card.tsx
- RecommendationConfidence [type] — core/src/components/ui/agent/recommendation-card.tsx
- RecommendationOption [type] — core/src/components/ui/agent/recommendation-card.tsx
- resolveCardTheme [value] — core/src/components/ui/card-utils.tsx
- resolveTableColumnAlign [value] — core/src/components/ui/data-table.tsx
- ReviewItem [value] — core/src/components/ui/review-item.tsx
- SelectOption [value] — core/src/components/ui/forms/select-option.tsx
- SelectOptionBgVariant [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionColor [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionItem [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionProps [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionShape [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionState [type] — core/src/components/ui/forms/select-option.tsx
- SelectOptionType [type] — core/src/components/ui/forms/select-option.tsx
- SidebarMenu [value] — core/src/components/ui/sidebar-menu.tsx
- SidebarMenuAccent [type] — core/src/components/ui/sidebar-menu.tsx
- SidebarMenuBgMode [type] — core/src/components/ui/sidebar-menu.tsx
- SidebarMenuItem [type] — core/src/components/ui/sidebar-menu.tsx
- SidebarMenuMode [type] — core/src/components/ui/sidebar-menu.tsx
- SmallCalendar [value] — core/src/components/ui/small-calendar.tsx
- SmallCalendarEvent [type] — core/src/components/ui/small-calendar.tsx
- SmallDailyCalendar [value] — core/src/components/ui/small-daily-calendar.tsx
- SmoothLineChart [value] — core/src/components/ui/charts/smooth-line-chart.tsx
- StatCard [value] — core/src/components/ui/stat-card.tsx
- StatCardProps [type] — core/src/components/ui/stat-card.tsx
- StatCardShell [value] — core/src/components/ui/card-utils.tsx
- StatCardSize [type] — core/src/components/ui/card-utils.tsx
- statCardSizes [value] — core/src/components/ui/card-utils.tsx
- StatusBadge [value] — core/src/components/ui/data-table.tsx
- StatusBadgeColor [type] — core/src/components/ui/data-table.tsx
- StatusBadgeVariant [type] — core/src/components/ui/data-table.tsx
- StatusDotColor [type] — core/src/components/ui/data-table.tsx
- Stepper [value] — core/src/components/ui/stepper.tsx
- StepperColor [type] — core/src/components/ui/stepper.tsx
- StepperItem [type] — core/src/components/ui/stepper.tsx
- StreamingAnswer [value] — core/src/components/ui/agent/streaming-answer.tsx
- StreamingAnswerProps [type] — core/src/components/ui/agent/streaming-answer.tsx
- StreamingAnswerStatus [type] — core/src/components/ui/agent/streaming-answer.tsx
- StreamingSource [type] — core/src/components/ui/agent/streaming-answer.tsx
- StyledLink [value] — core/src/components/ui/link.tsx
- SurfaceCard [value] — core/src/components/ui/surface-card.tsx
- SurfaceCardPadding [type] — core/src/components/ui/surface-card.tsx
- TabBar [value] — core/src/components/ui/tab-bar.tsx
- TabBarColor [type] — core/src/components/ui/tab-bar.tsx
- TabBarSurface [type] — core/src/components/ui/tab-bar.tsx
- TabItem [type] — core/src/components/ui/tab-bar.tsx
- TableCell [value] — core/src/components/ui/data-table.tsx
- TableCellProps [type] — core/src/components/ui/data-table.tsx
- TableCellVariant [type] — core/src/components/ui/data-table.tsx
- TableColumnAlign [type] — core/src/components/ui/data-table.tsx
- TableValueKind [type] — core/src/components/ui/data-table.tsx
- TabsContent [value] — core/src/components/ui/tabs-content.tsx
- TabsContentProps [type] — core/src/components/ui/tabs-content.tsx
- TaskCard [value] — core/src/components/ui/task-card.tsx
- TaskCardColor [type] — core/src/components/ui/task-card.tsx
- Team [type] — core/src/components/layouts/sidebar-popovers.tsx
- TeamSwitcherLabels [type] — core/src/components/layouts/sidebar-popovers.tsx
- TextArea [value] — core/src/components/ui/forms/text-area.tsx
- TextAreaColor [type] — core/src/components/ui/forms/text-area.tsx
- TextAreaProps [type] — core/src/components/ui/forms/text-area.tsx
- TextAreaShape [type] — core/src/components/ui/forms/text-area.tsx
- TextAreaState [type] — core/src/components/ui/forms/text-area.tsx
- TextField [value] — core/src/components/ui/forms/text-field.tsx
- TextFieldColor [type] — core/src/components/ui/forms/text-field.tsx
- TextFieldProps [type] — core/src/components/ui/forms/text-field.tsx
- TextFieldSelectSuffix [value] — core/src/components/ui/forms/text-field-select.tsx
- TextFieldShape [type] — core/src/components/ui/forms/text-field.tsx
- TextFieldState [type] — core/src/components/ui/forms/text-field.tsx
- ThinkingRow [type] — core/src/components/ui/agent/thinking-trace.tsx
- ThinkingTrace [value] — core/src/components/ui/agent/thinking-trace.tsx
- ThinkingVariant [type] — core/src/components/ui/agent/thinking-trace.tsx
- ToastApi [type] — core/src/components/ui/toast.tsx
- ToastOptions [type] — core/src/components/ui/toast.tsx
- ToastProvider [value] — core/src/components/ui/toast.tsx
- Toggle [value] — core/src/components/ui/forms/selection-control.tsx
- ToggleProps [type] — core/src/components/ui/forms/selection-control.tsx
- Toolbar [value] — core/src/components/ui/toolbar.tsx
- ToolbarActions [value] — core/src/components/ui/toolbar.tsx
- ToolbarColor [type] — core/src/components/ui/toolbar.tsx
- ToolbarDatepicker [value] — core/src/components/ui/toolbar.tsx
- ToolbarFavoriteButton [value] — core/src/components/ui/toolbar.tsx
- ToolbarFilterButton [value] — core/src/components/ui/toolbar.tsx
- ToolbarKebabButton [value] — core/src/components/ui/toolbar.tsx
- ToolbarPillTab [type] — core/src/components/ui/toolbar.tsx
- ToolbarPillTabs [value] — core/src/components/ui/toolbar.tsx
- ToolbarProps [type] — core/src/components/ui/toolbar.tsx
- ToolbarSearchInput [value] — core/src/components/ui/toolbar.tsx
- ToolbarSelectDropdown [value] — core/src/components/ui/toolbar.tsx
- ToolbarSelectionOptions [type] — core/src/components/ui/toolbar.tsx
- ToolbarShowSelect [value] — core/src/components/ui/toolbar.tsx
- ToolChipDetail [type] — core/src/components/ui/agent/tool-chips.tsx
- ToolChipItem [type] — core/src/components/ui/agent/tool-chips.tsx
- ToolChipKind [type] — core/src/components/ui/agent/tool-chips.tsx
- ToolChips [value] — core/src/components/ui/agent/tool-chips.tsx
- ToolDiffChip [type] — core/src/components/ui/agent/tool-chips.tsx
- Tooltip [value] — core/src/components/ui/tooltip.tsx
- TooltipAnchor [value] — core/src/components/ui/tooltip.tsx
- TooltipAnchorState [type] — core/src/components/ui/tooltip.tsx
- TooltipBubble [value] — core/src/components/ui/tooltip.tsx
- TooltipGroup [value] — core/src/components/ui/tooltip.tsx
- TooltipPosition [type] — core/src/components/ui/tooltip.tsx
- TooltipSize [type] — core/src/components/ui/tooltip.tsx
- TopBar [value] — core/src/components/ui/topbar.tsx
- TopBarColor [type] — core/src/components/ui/topbar.tsx
- TrendDirection [type] — core/src/components/ui/card-utils.tsx
- TypefaceBlock [value] — core/src/components/ui/style-guide.tsx
- TypographySizeRow [value] — core/src/components/ui/style-guide.tsx
- TypographyWeightSample [value] — core/src/components/ui/style-guide.tsx
- UserCard [value] — core/src/components/ui/user-card.tsx
- useToast [value] — core/src/components/ui/toast.tsx
- WalletGoalCard [value] — core/src/components/ui/wallet-goal-card.tsx
- WalletGoalCardProps [type] — core/src/components/ui/wallet-goal-card.tsx
- WheelChartStatCard [value] — core/src/components/ui/wheel-chart-stat-card.tsx
- WheelChartStatCardProps [type] — core/src/components/ui/wheel-chart-stat-card.tsx
- WheelColor [type] — core/src/components/ui/wheel-chart-stat-card.tsx

---

Source: skills/forge-skill/references/components/accent-utils.md

# accent-utils

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/accent-utils.ts`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AccentColor (type)

```ts
export type AccentColor = "purple" | "blue" | "black";
```

## accentColors (value)

```ts
Record<AccentColor, AccentConfig>
```

## AccentConfig (type)

```ts
export interface AccentConfig {
  /** Solid background (buttons, checked state, selected pill) */
  bg: string;
  /** Text color */
  text: string;
  /** Outline / border color */
  outline: string;
  /** Light tinted background (icon badges, tag bg, light button) */
  bgTint: string;
  /** Border class (for components using border instead of outline) */
  border: string;
  /** Secondary text that reads on top of accent.bg (e.g. subtitle on a solid accent card) */
  onAccentMuted: string;
  /** CSS color value matching `bg` — for SVG fill / stroke / icon color props that don't accept className */
  hex: string;
  /** Monochromatic shade ramp (deep → light), 5 stops. For multi-segment charts. */
  ramp: readonly [string, string, string, string, string];
  /** CSS color values matching `ramp` stops — for SVG conic gradients / stroke colors */
  rampHex: readonly [string, string, string, string, string];
}
```

---

Source: skills/forge-skill/references/components/accordion.md

# accordion

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/accordion.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Accordion (value)

```ts
({ items, value, defaultValue, onValueChange, motion, className }: AccordionProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `AccordionItem[]` |  |
| `value` | 否 | `string \| null \| undefined` |  |
| `defaultValue` | 否 | `string \| null \| undefined` |  |
| `onValueChange` | 否 | `((value: string \| null) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AccordionItem (type)

```ts
export interface AccordionItem { value: string; title: string; content: ReactNode; disabled?: boolean }
```

## AccordionProps (type)

```ts
export interface AccordionProps {
  items: AccordionItem[]; value?: string | null; defaultValue?: string | null;
  onValueChange?: (value: string | null) => void; motion?: MotionPreference; className?: string;
}
```

---

Source: skills/forge-skill/references/components/activity-card.md

# activity-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/activity-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ActivityCard (value)

```ts
({ icon, headerText, datetime, avatar, title, description, metadata, onMenuClick, }: { icon: ReactNode; headerText: string; datetime: string; avatar: string; title: string; description: string; metadata: { label: string; value: string | ReactNode; }[]; onMenuClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 是 | `ReactNode` |  |
| `headerText` | 是 | `string` |  |
| `datetime` | 是 | `string` |  |
| `avatar` | 是 | `string` |  |
| `title` | 是 | `string` |  |
| `description` | 是 | `string` |  |
| `metadata` | 是 | `{ label: string; value: string \| ReactNode; }[]` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |

## 选型

- 团队协作活动流 → `ActivityCard`
- 轻量时间线 → `HistoryItem` / `HistoryGrouped`
- 纯通知 → `NotificationItem`

---

Source: skills/forge-skill/references/components/add-member.md

# add-member

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/add-member.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AddMember (value)

```ts
({ members, accent, selectedIds, defaultSelectedIds, onSelectionChange, onAdd, clearOnAdd, open, defaultOpen, onOpenChange, rows, search, disabled, labels, motion: motionPreference, className }: AddMemberProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `members` | 是 | `AddMemberItem[]` |  |
| `accent` | 否 | `AccentColor \| undefined` | Optional Forge theme; omitted preserves the original panel colors. |
| `selectedIds` | 否 | `string[] \| undefined` |  |
| `defaultSelectedIds` | 否 | `string[] \| undefined` |  |
| `onSelectionChange` | 否 | `((ids: string[]) => void) \| undefined` |  |
| `onAdd` | 否 | `((ids: string[]) => void \| Promise<void>) \| undefined` | Resolving confirms success. Reject to retain the selection for retry. |
| `clearOnAdd` | 否 | `boolean \| undefined` |  |
| `open` | 否 | `boolean \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `rows` | 否 | `number \| undefined` |  |
| `search` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `labels` | 否 | `Partial<AddMemberLabels> \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AddMemberItem (type)

```ts
export type AddMemberItem = { id: string; name: string; role?: string; avatar?: string; status?: "online" | "idle" | "dnd" | "offline"; disabled?: boolean };
```

## AddMemberLabels (type)

```ts
export type AddMemberLabels = {
  title: string; search: string; empty: string; add: string; adding: string; added: string; error: string;
  select: string; remove: string; selected: string; viewAll: string; previous: string; next: string;
};
```

## AddMemberProps (type)

```ts
export type AddMemberProps = {
  members: AddMemberItem[];
  /** Optional Forge theme; omitted preserves the original panel colors. */
  accent?: AccentColor;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Resolving confirms success. Reject to retain the selection for retry. */
  onAdd?: (ids: string[]) => void | Promise<void>;
  clearOnAdd?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  rows?: number;
  search?: boolean;
  disabled?: boolean;
  labels?: Partial<AddMemberLabels>;
  motion?: MotionPreference;
  className?: string;
};
```

---

Source: skills/forge-skill/references/components/agent-code-block.md

# agent-code-block

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-code-block.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentCodeBlock (value)

```ts
({ filename, lines, diff, view: controlledView, onViewChange, locale, codeLabel, diffLabel, copyLabel, copiedLabel, foldRanges, collapsedRangeIds, defaultCollapsedRangeIds, onCollapsedRangeIdsChange, className, }: { filename: string; lines?: string[]; diff?: AgentCodeDiffRow[]; view?: "code" | "diff"; onViewChange?: (view: "code" | "diff") => void; locale?: "zh" | "en"; codeLabel?: string; diffLabel?: string; copyLabel?: string; copiedLabel?: string; foldRanges?: AgentCodeFoldRange[]; collapsedRangeIds?: string[]; defaultCollapsedRangeIds?: string[]; onCollapsedRangeIdsChange?: (ids: string[]) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `filename` | 是 | `string` |  |
| `lines` | 否 | `string[] \| undefined` |  |
| `diff` | 否 | `AgentCodeDiffRow[] \| undefined` |  |
| `view` | 否 | `"code" \| "diff" \| undefined` |  |
| `onViewChange` | 否 | `((view: "code" \| "diff") => void) \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `codeLabel` | 否 | `string \| undefined` |  |
| `diffLabel` | 否 | `string \| undefined` |  |
| `copyLabel` | 否 | `string \| undefined` |  |
| `copiedLabel` | 否 | `string \| undefined` |  |
| `foldRanges` | 否 | `AgentCodeFoldRange[] \| undefined` |  |
| `collapsedRangeIds` | 否 | `string[] \| undefined` |  |
| `defaultCollapsedRangeIds` | 否 | `string[] \| undefined` |  |
| `onCollapsedRangeIdsChange` | 否 | `((ids: string[]) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentCodeDiffRow (type)

```ts
export type AgentCodeDiffRow = {
  old: number | null;
  cur: number | null;
  type: AgentCodeDiffType;
  pieces: AgentCodePiece[];
};
```

## AgentCodeDiffType (type)

```ts
export type AgentCodeDiffType = "ctx" | "add" | "del";
```

## AgentCodeFoldRange (type)

```ts
export type AgentCodeFoldRange = {
  id: string;
  /** One-based header line; it stays visible while folded. */
  startLine: number;
  /** Last hidden line, inclusive. Ranges may nest but must not cross. */
  endLine: number;
  label?: string;
};
```

## AgentCodePiece (type)

```ts
export type AgentCodePiece = {
  text: string;
  change?: "add" | "del";
};
```

---

Source: skills/forge-skill/references/components/agent-diff-table.md

# agent-diff-table

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-diff-table.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentDiffChange (type)

```ts
export type AgentDiffChange = "keep" | "remove" | "add";
```

## AgentDiffColumn (type)

```ts
export type AgentDiffColumn = {
  key: string;
  label: string;
};
```

## AgentDiffRow (type)

```ts
export type AgentDiffRow = {
  id: string;
  cells: Record<string, string>;
  change: AgentDiffChange;
};
```

## AgentDiffTable (value)

```ts
({ title, locale, columns, rows, applyLabel, appliedLabel, onApply, toggleHint, formatApplyLabel, formatAppliedLabel, className, }: { title: string; locale?: "zh" | "en"; columns: AgentDiffColumn[]; rows: AgentDiffRow[]; applyLabel?: string; appliedLabel?: string; onApply?: (includedIds: string[]) => void; toggleHint?: string; formatApplyLabel?: (count: number) => string; formatAppliedLabel?: (count: number) => string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `columns` | 是 | `AgentDiffColumn[]` |  |
| `rows` | 是 | `AgentDiffRow[]` |  |
| `applyLabel` | 否 | `string \| undefined` |  |
| `appliedLabel` | 否 | `string \| undefined` |  |
| `onApply` | 否 | `((includedIds: string[]) => void) \| undefined` |  |
| `toggleHint` | 否 | `string \| undefined` |  |
| `formatApplyLabel` | 否 | `((count: number) => string) \| undefined` | Format the complete button text, including count and pluralization. |
| `formatAppliedLabel` | 否 | `((count: number) => string) \| undefined` | Format the complete completion text, including count. |
| `className` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/agent-flowchart.md

# agent-flowchart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-flowchart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentFlowchart (value)

```ts
({ locale, title, nodes, edges, selectedId: controlledId, onSelect, kindLabels, selectedLabel, nextLabel, className, }: { title?: string; locale?: "zh" | "en"; nodes: AgentFlowNode[]; edges?: AgentFlowEdge[]; selectedId?: string; onSelect?: (id: string) => void; kindLabels?: Partial<Record<AgentFlowNode["kind"], string>>; selectedLabel?: string; nextLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `nodes` | 是 | `AgentFlowNode[]` |  |
| `edges` | 否 | `AgentFlowEdge[] \| undefined` |  |
| `selectedId` | 否 | `string \| undefined` |  |
| `onSelect` | 否 | `((id: string) => void) \| undefined` |  |
| `kindLabels` | 否 | `Partial<Record<AgentFlowKind, string>> \| undefined` |  |
| `selectedLabel` | 否 | `string \| undefined` |  |
| `nextLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentFlowEdge (type)

```ts
export type AgentFlowEdge = {
  from: string;
  to: string;
  label?: string;
};
```

## AgentFlowKind (type)

```ts
export type AgentFlowKind = "trigger" | "action" | "condition";
```

## AgentFlowNode (type)

```ts
export type AgentFlowNode = {
  id: string;
  kind: AgentFlowKind;
  title: string;
  body?: string;
  x?: number;
  y?: number;
};
```

---

Source: skills/forge-skill/references/components/agent-task-rows.md

# agent-task-rows

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-task-rows.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentTask (type)

```ts
export type AgentTask = {
  id: string;
  title: string;
  status: AgentTaskStatus;
  meta?: string;
  children?: AgentTaskChild[];
};
```

## AgentTaskChild (type)

```ts
export type AgentTaskChild = {
  label: string;
  value?: string;
  status?: AgentTaskStatus;
};
```

## AgentTaskRows (value)

```ts
({ tasks, locale, variant, statusLabels, className, }: { tasks: AgentTask[]; locale?: "zh" | "en"; variant?: "list" | "capsules"; statusLabels?: Partial<Record<AgentTaskStatus, string>>; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tasks` | 是 | `AgentTask[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `variant` | 否 | `"list" \| "capsules" \| undefined` |  |
| `statusLabels` | 否 | `Partial<Record<AgentTaskStatus, string>> \| undefined` | Translations for task states in both layouts. Missing entries use the selected locale. |
| `className` | 否 | `string \| undefined` |  |

## AgentTaskStatus (type)

```ts
export type AgentTaskStatus = "running" | "failed" | "completed";
```

---

Source: skills/forge-skill/references/components/app-layout.md

# app-layout

自动生成；请勿编辑 API 部分。来源：`core/src/components/layouts/app-layout.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AppLayout (value)

```ts
({ motion, mode, profilePosition, accent, children, logo, logoText, appName, appIcon, appSubtitle, apps, onAppChange, teamName: legacyTeamName, teamAvatar: legacyTeamAvatar, teamMemberCount, teamSubtitle: legacyTeamSubtitle, menuSectionLabel, favoriteSectionLabel, teams: legacyTeams, menuItems, favoriteItems, menuSections, profile, notifications, messages, language, defaultLanguage, onLanguageChange, searchPlaceholder, topbarLeftMode, topbarAccent, pageTitle, breadcrumbs, pageHeaderVariant, askAi, onBack, primaryAction, secondaryAction, showDatePicker, showKebab, showFavorite, hideHeader, sidebarSlot, sidebarWidth, collapsedSidebarWidth, hideSidebarWidgets, teamLabels, showTeamActions, }: AppLayoutProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `motion` | 否 | `MotionPreference \| undefined` | Motion for the navigation shell and its nested menu branches. |
| `mode` | 否 | `AppLayoutMode \| undefined` |  |
| `profilePosition` | 否 | `AppLayoutProfilePosition \| undefined` |  |
| `accent` | 否 | `AppLayoutAccentColor \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `logo` | 否 | `ReactNode` |  |
| `logoText` | 否 | `string \| undefined` |  |
| `appName` | 否 | `string \| undefined` |  |
| `appIcon` | 否 | `string \| undefined` |  |
| `appSubtitle` | 否 | `string \| undefined` |  |
| `apps` | 否 | `AppSwitcherItem[] \| undefined` |  |
| `onAppChange` | 否 | `((app: AppSwitcherItem) => void) \| undefined` | Called on selection; the consumer controls the current application. |
| `teamName` | 否 | `string \| undefined` |  |
| `teamAvatar` | 否 | `string \| undefined` |  |
| `teamMemberCount` | 否 | `number \| undefined` |  |
| `teamSubtitle` | 否 | `string \| undefined` | 自定义 team switcher 下面那行副标题；不传则 fallback 到 `${teamMemberCount} 名成员` |
| `menuSectionLabel` | 否 | `string \| undefined` | 自定义 sidebar 主菜单分组标题 |
| `favoriteSectionLabel` | 否 | `string \| undefined` | 自定义 sidebar 收藏分组标题 |
| `teams` | 否 | `AppSwitcherItem[] \| undefined` |  |
| `menuItems` | 否 | `AppLayoutMenuItem[] \| undefined` | 默认 sidebar 主菜单。如果传了 menuSections 或 sidebarSlot，这个会被忽略 |
| `favoriteItems` | 否 | `AppLayoutMenuItem[] \| undefined` |  |
| `menuSections` | 否 | `AppLayoutMenuSection[] \| undefined` | 按顺序渲染的侧栏分组。传入后忽略旧的菜单项和分组标题；sidebarSlot 优先级更高。 |
| `profile` | 否 | `AppLayoutProfile \| undefined` |  |
| `notifications` | 否 | `number \| undefined` |  |
| `messages` | 否 | `number \| undefined` |  |
| `language` | 否 | `LanguageCode \| undefined` |  |
| `defaultLanguage` | 否 | `LanguageCode \| undefined` |  |
| `onLanguageChange` | 否 | `((language: AppLayoutLanguage) => void) \| undefined` |  |
| `pageHeaderVariant` | 否 | `AppLayoutPageHeaderVariant \| undefined` |  |
| `askAi` | 否 | `AskAiProps \| undefined` | Optional Ask AI conversation drawer for every header variant. |
| `onBack` | 否 | `(() => void) \| undefined` |  |
| `primaryAction` | 否 | `{ label: string; onClick?: () => void; } \| undefined` |  |
| `secondaryAction` | 否 | `{ label: string; onClick?: () => void; } \| undefined` |  |
| `searchPlaceholder` | 否 | `string \| undefined` |  |
| `topbarLeftMode` | 否 | `"search" \| "hamburger" \| undefined` |  |
| `topbarAccent` | 否 | `AppLayoutAccentColor \| undefined` |  |
| `pageTitle` | 否 | `string \| undefined` |  |
| `breadcrumbs` | 否 | `AppLayoutBreadcrumb[] \| undefined` |  |
| `showDatePicker` | 否 | `boolean \| undefined` | 是否在 page header 显示日期选择器（默认：home variant 显示，detail variant 不显示） |
| `showKebab` | 否 | `boolean \| undefined` | 是否在 page header 显示三点菜单（默认 true） |
| `showFavorite` | 否 | `boolean \| undefined` | 是否在 page header 显示收藏操作（默认：home variant 不显示，detail variant 显示） |
| `hideHeader` | 否 | `boolean \| undefined` | 完全隐藏 page header 区（标题 / 按钮 / 边框）。chat / 沉浸式页面用 |
| `sidebarSlot` | 否 | `ReactNode` | 完全自定义 sidebar 主体，优先于 menuSections 和旧的两个菜单分组。 |
| `sidebarWidth` | 否 | `string \| undefined` | Expanded sidebar width. Accepts any CSS length; default keeps the Forge starter density. |
| `collapsedSidebarWidth` | 否 | `string \| undefined` | Collapsed sidebar rail width. Accepts any CSS length; default keeps the Forge starter density. |
| `hideSidebarWidgets` | 否 | `boolean \| undefined` | 隐藏 sidebar 底部那一排 widget icon（语言、日历、通知、消息），profile 卡保留 |
| `teamLabels` | 否 | `TeamSwitcherLabels \| undefined` | 自定义 team switcher 下拉里 invite / settings / createNew 按钮的文案 |
| `showTeamActions` | 否 | `boolean \| undefined` | Team switcher 是否显示邀请 / 设置 / 新建。 false = 仅当前工作区标题 + teams 列表（应用切换器用）。默认 false。 |

## AppLayoutAccentColor (type)

```ts
export type AppLayoutAccentColor = "purple" | "blue" | "black";
```

## AppLayoutBreadcrumb (type)

```ts
export interface AppLayoutBreadcrumb {
  label: string;
  href?: string;
}
```

## AppLayoutLanguage (type)

```ts
export type AppLayoutLanguage = LanguageCode;
```

## AppLayoutMenuItem (type)

```ts
export type AppLayoutMenuItem =
  | (AppLayoutMenuItemBase & {
      href: string;
      children?: AppLayoutMenuItem[];
    })
  | (AppLayoutMenuItemBase & {
      href?: undefined;
      children: AppLayoutMenuItem[];
    });
```

## AppLayoutMenuSection (type)

```ts
export type AppLayoutMenuSection = {
  /** 空字符串或省略时不渲染标题行 */
  label?: string;
  items: AppLayoutMenuItem[];
};
```

## AppLayoutMode (type)

```ts
export type AppLayoutMode = "light" | "dark";
```

## AppLayoutPageHeaderVariant (type)

```ts
export type AppLayoutPageHeaderVariant = "home" | "detail";
```

## AppLayoutProfile (type)

```ts
export interface AppLayoutProfile {
  avatar: string;
  name: string;
  role: string;
}
```

## AppLayoutProfilePosition (type)

```ts
export type AppLayoutProfilePosition = "sidebar" | "topbar";
```

## AppLayoutProps (type)

```ts
export interface AppLayoutProps {
  /** Motion for the navigation shell and its nested menu branches. */
  motion?: MotionPreference;
  mode?: AppLayoutMode;
  profilePosition?: AppLayoutProfilePosition;
  accent?: AppLayoutAccentColor;
  children: ReactNode;
  logo?: ReactNode;
  logoText?: string;
  appName?: string;
  appIcon?: string;
  appSubtitle?: string;
  apps?: AppSwitcherItem[];
  /** Called on selection; the consumer controls the current application. */
  onAppChange?: (app: AppSwitcherItem) => void;
  /** @deprecated Use appName. */
  teamName?: string;
  teamAvatar?: string;
  teamMemberCount?: number;
  /** 自定义 team switcher 下面那行副标题；不传则 fallback 到 `${teamMemberCount} 名成员` */
  teamSubtitle?: string;
  /** 自定义 sidebar 主菜单分组标题 */
  menuSectionLabel?: string;
  /** 自定义 sidebar 收藏分组标题 */
  favoriteSectionLabel?: string;
  teams?: Team[];
  /** 默认 sidebar 主菜单。如果传了 menuSections 或 sidebarSlot，这个会被忽略 */
  menuItems?: AppLayoutMenuItem[];
  favoriteItems?: AppLayoutMenuItem[];
  /** 按顺序渲染的侧栏分组。传入后忽略旧的菜单项和分组标题；sidebarSlot 优先级更高。 */
  menuSections?: AppLayoutMenuSection[];
  profile?: AppLayoutProfile;
  notifications?: number;
  messages?: number;
  language?: AppLayoutLanguage;
  defaultLanguage?: AppLayoutLanguage;
  onLanguageChange?: (language: AppLayoutLanguage) => void;
  pageHeaderVariant?: AppLayoutPageHeaderVariant;
  /** Optional Ask AI conversation drawer for every header variant. */
  askAi?: AskAiProps;
  onBack?: () => void;
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  searchPlaceholder?: string;
  topbarLeftMode?: "search" | "hamburger";
  topbarAccent?: AppLayoutAccentColor;
  pageTitle?: string;
  breadcrumbs?: AppLayoutBreadcrumb[];
  /** 是否在 page header 显示日期选择器（默认：home variant 显示，detail variant 不显示） */
  showDatePicker?: boolean;
  /** 是否在 page header 显示三点菜单（默认 true） */
  showKebab?: boolean;
  /** 是否在 page header 显示收藏操作（默认：home variant 不显示，detail variant 显示） */
  showFavorite?: boolean;
  /** 完全隐藏 page header 区（标题 / 按钮 / 边框）。chat / 沉浸式页面用 */
  hideHeader?: boolean;
  /** 完全自定义 sidebar 主体，优先于 menuSections 和旧的两个菜单分组。 */
  sidebarSlot?: ReactNode;
  /** Expanded sidebar width. Accepts any CSS length; default keeps the Forge starter density. */
  sidebarWidth?: string;
  /** Collapsed sidebar rail width. Accepts any CSS length; default keeps the Forge starter density. */
  collapsedSidebarWidth?: string;
  /** 隐藏 sidebar 底部那一排 widget icon（语言、日历、通知、消息），profile 卡保留 */
  hideSidebarWidgets?: boolean;
  /** 自定义 team switcher 下拉里 invite / settings / createNew 按钮的文案 */
  teamLabels?: TeamSwitcherLabels;
  /**
   * Team switcher 是否显示邀请 / 设置 / 新建。
   * false = 仅当前工作区标题 + teams 列表（应用切换器用）。默认 false。
   */
  showTeamActions?: boolean;
}
```

## 选型建议

| 场景 | 配置 |
|---|---|
| 首页 / Dashboard | `pageHeaderVariant="home"`，无 breadcrumbs，`profilePosition="topbar"` |
| 列表页 | `pageHeaderVariant="home"`，`primaryAction="New"` |
| 详情页 | `pageHeaderVariant="detail"` + `onBack` + `breadcrumbs` |
| 深色品牌 | `mode="dark"` 或 `accent="black"` |

---

Source: skills/forge-skill/references/components/approval-card.md

# approval-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/approval-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ApprovalCard (value)

```ts
({ questions, locale, skipLabel, skipSubmitLabel, continueLabel, sendLabel, sentLabel, onSubmitted, previousQuestionLabel, nextQuestionLabel, className, }: { questions: ApprovalQuestion[]; locale?: "zh" | "en"; skipLabel?: string; skipSubmitLabel?: string; continueLabel?: string; sendLabel?: string; sentLabel?: string; onSubmitted?: (answers: Record<string, string[]>) => void; previousQuestionLabel?: string; nextQuestionLabel?: string; className?: string; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `questions` | 是 | `ApprovalQuestion[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `skipLabel` | 否 | `string \| undefined` |  |
| `skipSubmitLabel` | 否 | `string \| undefined` |  |
| `continueLabel` | 否 | `string \| undefined` |  |
| `sendLabel` | 否 | `string \| undefined` |  |
| `sentLabel` | 否 | `string \| undefined` |  |
| `onSubmitted` | 否 | `((answers: Record<string, string[]>) => void) \| undefined` |  |
| `previousQuestionLabel` | 否 | `string \| undefined` |  |
| `nextQuestionLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ApprovalQuestion (type)

```ts
export type ApprovalQuestion = {
  id: string;
  prompt: string;
  type?: "radio" | "check";
  options: { id: string; label: string }[];
};
```

---

Source: skills/forge-skill/references/components/ask-ai.md

# ask-ai

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/ask-ai.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AskAi (value)

```ts
({ color, label, suggestions, placeholder, onSend, disabled, className, header, brand, session, messages: messagesSlot, composer, fullscreen, defaultFullscreen, onFullscreenChange, showFullscreenTrigger, sessions, currentSessionId, onNewSession, onSelectSession, searchQuery, onSearchQueryChange, hasConversation, landingTitle, landingDescription, headerLayout, panelMode, onDockedChange, railLabel, }: AskAiProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `color` | 否 | `AccentColor \| undefined` | Overrides the surrounding accent. Omit to follow the nearest data-accent, or the kit default. |
| `label` | 否 | `string \| undefined` |  |
| `suggestions` | 否 | `string[] \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `onSend` | 是 | `(message: string, request: AskAiRequest) => string \| AskAiResponse \| Promise<string \| AskAiResponse>` | Return plain text or text with business links. At most two safe links are shown. |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `header` | 否 | `ReactNode` | Replace the entire drawer header (brand, session, tools). |
| `brand` | 否 | `ReactNode` | Replace the Ask mark + title in the drawer header and fullscreen rail. |
| `session` | 否 | `ReactNode` | Replace session chrome (drawer header extras / fullscreen history). |
| `messages` | 否 | `ReactNode` | Replace the conversation / empty-state body. Fullscreen: content-only, natural height; no h-full, flex-1 or vertical overflow container. Core owns [data-ask-ai-fs-scroll], follow and jump-to-latest. Use currentSessionId to reset follow when switching external transcripts. |
| `composer` | 否 | `ReactNode` | Replace the default composer (textarea + 发送). Fullscreen: content-only, no outer bottom padding/margin or fixed positioning. Core owns the bottom gap (16px or safe-area, whichever is larger). Consumers sharing slots with the drawer should branch on fullscreen state. |
| `fullscreen` | 否 | `boolean \| undefined` | Controlled fullscreen layer. Independent of the drawer — not a stretched dialog. |
| `defaultFullscreen` | 否 | `boolean \| undefined` | Uncontrolled initial fullscreen when `fullscreen` is omitted. |
| `onFullscreenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `showFullscreenTrigger` | 否 | `boolean \| undefined` | Drawer header control that opens the fullscreen layer. Default true. |
| `sessions` | 否 | `AskAiSessionItem[] \| undefined` | Session list for the default fullscreen rail. Displayed as given; core does not filter. |
| `currentSessionId` | 否 | `string \| undefined` |  |
| `onNewSession` | 否 | `(() => void) \| undefined` |  |
| `onSelectSession` | 否 | `((id: string) => void) \| undefined` |  |
| `searchQuery` | 否 | `string \| undefined` |  |
| `onSearchQueryChange` | 否 | `((query: string) => void) \| undefined` |  |
| `hasConversation` | 否 | `boolean \| undefined` | Force fullscreen landing vs chat layout. Defaults to the built-in conversation length (or chat layout when `messages` is passed). |
| `landingTitle` | 否 | `string \| undefined` |  |
| `landingDescription` | 否 | `string \| undefined` | Supporting copy below the empty-state heading. |
| `headerLayout` | 否 | `"brand" \| "session" \| undefined` | Opt-in session-first panel header with a dedicated new-chat action. |
| `panelMode` | 否 | `"modal" \| "responsive" \| undefined` | Non-modal side panel at >=1440px; falls back to the modal drawer below that. |
| `onDockedChange` | 否 | `((docked: boolean) => void) \| undefined` | Reserve 460px in the host layout while true. Released on close/fullscreen/unmount. |
| `railLabel` | 否 | `string \| undefined` | Fullscreen rail title when `brand` is omitted. |

## AskAiProps (type)

```ts
export interface AskAiProps {
  /** Overrides the surrounding accent. Omit to follow the nearest data-accent, or the kit default. */
  color?: AccentColor;
  label?: string;
  suggestions?: string[];
  placeholder?: string;
  /** Return plain text or text with business links. At most two safe links are shown. */
  onSend: (message: string, request: AskAiRequest) => string | AskAiResponse | Promise<string | AskAiResponse>;
  disabled?: boolean;
  className?: string;
  /** Replace the entire drawer header (brand, session, tools). */
  header?: ReactNode;
  /** Replace the Ask mark + title in the drawer header and fullscreen rail. */
  brand?: ReactNode;
  /** Replace session chrome (drawer header extras / fullscreen history). */
  session?: ReactNode;
  /** Replace the conversation / empty-state body.
   * Fullscreen: content-only, natural height; no h-full, flex-1 or vertical
   * overflow container. Core owns [data-ask-ai-fs-scroll], follow and jump-to-latest.
   * Use currentSessionId to reset follow when switching external transcripts.
   */
  messages?: ReactNode;
  /**
   * Replace the default composer (textarea + 发送).
   * Fullscreen: content-only, no outer bottom padding/margin or fixed positioning.
   * Core owns the bottom gap (16px or safe-area, whichever is larger).
   * Consumers sharing slots with the drawer should branch on fullscreen state.
   */
  composer?: ReactNode;
  /** Controlled fullscreen layer. Independent of the drawer — not a stretched dialog. */
  fullscreen?: boolean;
  /** Uncontrolled initial fullscreen when `fullscreen` is omitted. */
  defaultFullscreen?: boolean;
  onFullscreenChange?: (open: boolean) => void;
  /** Drawer header control that opens the fullscreen layer. Default true. */
  showFullscreenTrigger?: boolean;
  /** Session list for the default fullscreen rail. Displayed as given; core does not filter. */
  sessions?: AskAiSessionItem[];
  currentSessionId?: string;
  onNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  /**
   * Force fullscreen landing vs chat layout.
   * Defaults to the built-in conversation length (or chat layout when `messages` is passed).
   */
  hasConversation?: boolean;
  landingTitle?: string;
  /** Supporting copy below the empty-state heading. */
  landingDescription?: string;
  /** Opt-in session-first panel header with a dedicated new-chat action. */
  headerLayout?: "brand" | "session";
  /** Non-modal side panel at >=1440px; falls back to the modal drawer below that. */
  panelMode?: "modal" | "responsive";
  /** Reserve 460px in the host layout while true. Released on close/fullscreen/unmount. */
  onDockedChange?: (docked: boolean) => void;
  /** Fullscreen rail title when `brand` is omitted. */
  railLabel?: string;
}
```

---

Source: skills/forge-skill/references/components/ask-ai-fullscreen.md

# ask-ai-fullscreen

自动生成；请勿编辑 API 部分。来源：`core/src/internal/ask-ai-fullscreen.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ASK_AI_FS_LAYER_ATTR (value)

```ts
"data-ask-ai-fs-layer"
```

## ASK_AI_FULLSCREEN_RAIL_WIDTH (value)

```ts
"16rem"
```

---

Source: skills/forge-skill/references/components/ask-ai-types.md

# ask-ai-types

自动生成；请勿编辑 API 部分。来源：`core/src/internal/ask-ai-types.ts`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AskAiLink (type)

```ts
export interface AskAiLink {
  label: string;
  href: string;
}
```

## AskAiMessage (type)

```ts
export interface AskAiMessage {
  role: "user" | "assistant";
  content: string;
  links?: AskAiLink[];
}
```

## AskAiRequest (type)

```ts
export interface AskAiRequest {
  messages: AskAiMessage[];
  signal: AbortSignal;
}
```

## AskAiResponse (type)

```ts
export interface AskAiResponse {
  text: string;
  links?: AskAiLink[];
}
```

## AskAiSessionItem (type)

```ts
export interface AskAiSessionItem {
  id: string;
  title: string;
}
```

---

Source: skills/forge-skill/references/components/avatar.md

# avatar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/avatar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Avatar (value)

```ts
({ src, initials, size, color, alt, online, }: { src?: string; initials?: string; size?: AvatarSize; color?: AvatarInitialColor; alt?: string; online?: boolean; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `src` | 否 | `string \| undefined` |  |
| `initials` | 否 | `string \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| "xs" \| "2xl" \| "xl" \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| undefined` |  |
| `alt` | 否 | `string \| undefined` |  |
| `online` | 否 | `boolean \| undefined` |  |

## AvatarGroup (value)

```ts
({ children, overflowCount, }: { children: ReactNode; overflowCount?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `overflowCount` | 否 | `number \| undefined` |  |

## AvatarInitialColor (type)

```ts
export type AvatarInitialColor = keyof typeof avatarInitialColors;
```

## AvatarSize (type)

```ts
export type AvatarSize = keyof typeof avatarSizes;
```

## 选型

- 用户列表 / 评论 / 顶部 profile → `Avatar` `md` 或 `sm`
- 项目协作者多人堆叠 → `AvatarGroup`
- Hero 大头像展示 → `xl` / `2xl`

---

Source: skills/forge-skill/references/components/badge.md

# badge

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/badge.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ArtisticIcon (value)

```ts
({ children, color, variant, }: { children: ReactNode; color?: ArtisticIconColor; variant?: ArtisticIconVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| undefined` |  |
| `variant` | 否 | `ArtisticIconVariant \| undefined` |  |

## ArtisticIconColor (type)

```ts
export type ArtisticIconColor = keyof typeof artisticShells;
```

## ArtisticIconVariant (type)

```ts
export type ArtisticIconVariant = "gradient" | "orbs";
```

## CircleIcon (value)

```ts
({ children, color, size, variant, }: { children: ReactNode; color?: CircleIconColor; size?: CircleIconSize; variant?: CircleIconVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| "xs" \| undefined` |  |
| `variant` | 否 | `"solid" \| "light" \| "neutral" \| undefined` |  |

## CircleIconColor (type)

```ts
export type CircleIconColor = keyof typeof circleIconVariants.solid;
```

## CircleIconSize (type)

```ts
export type CircleIconSize = keyof typeof circleIconSizes;
```

## CircleIconVariant (type)

```ts
export type CircleIconVariant = keyof typeof circleIconVariants;
```

## Label (value)

```ts
({ children, color, size, variant, }: { children: ReactNode; color?: LabelColor; size?: LabelSize; variant?: LabelVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "red" \| "gray" \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `variant` | 否 | `LabelVariant \| undefined` |  |

## LabelColor (type)

```ts
export type LabelColor = keyof typeof labelColors;
```

## LabelSize (type)

```ts
export type LabelSize = keyof typeof labelSizes;
```

## LabelVariant (type)

```ts
export type LabelVariant = "outline" | "solid";
```

## NotificationBadge (value)

```ts
({ children, color, }: { children: ReactNode; color?: NotificationBadgeColor; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| undefined` |  |

## NotificationBadgeColor (type)

```ts
export type NotificationBadgeColor = keyof typeof notificationColors;
```

## 选型

| 场景 | 采用 |
|---|---|
| 铃铛未读数/角标 | NotificationBadge |
| 业务生命周期状态 | StatusBadge，variant="soft"，文字与语义色同时呈现 |
| 分类/角色/渠道 | 普通文字，不做彩虹胶囊 |
| 表格状态列 | 默认 soft StatusBadge，通常最多一个状态胶囊列 |
| 明确要求的营销强调 | Label 的真实变体，先确认视觉需求，不替代业务状态规则 |

完整规范见 [状态表达](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/status-presentation.md)。

---

Source: skills/forge-skill/references/components/balance-card.md

# balance-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/balance-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BalanceCard (value)

```ts
({ title, balance, trend, trendDirection, subtitle, theme, balanceHidden, cardNumber, cardIcon, onTransfer, onRequest, density, width, className, }: { title?: string; balance: string; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: BalanceCardTheme; balanceHidden?: boolean; cardNumber?: string; cardIcon?: string; onTransfer?: () => void; onRequest?: () => void; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `balance` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `BalanceCardTheme \| undefined` |  |
| `balanceHidden` | 否 | `boolean \| undefined` |  |
| `cardNumber` | 否 | `string \| undefined` |  |
| `cardIcon` | 否 | `string \| undefined` |  |
| `onTransfer` | 否 | `(() => void) \| undefined` |  |
| `onRequest` | 否 | `(() => void) \| undefined` |  |
| `density` | 否 | `CardDensity \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## BalanceCardProps (type)

```ts
export type BalanceCardProps = Parameters<typeof BalanceCard>[0];
```

## 选型

- 账户 / 钱包主卡 → `BalanceCard`
- 支付卡展示（借记 / 信用） → `DebitCard` / `CreditCard`
- 纯金额指标 → `StatCard`（`labelVariant="value"`）

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

---

Source: skills/forge-skill/references/components/bar-chart.md

# bar-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/bar-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BarChart (value)

```ts
({ data, onActiveIndexChange, onSelect, pinnedIndex, domain, referenceValue, referenceLabel, motion, ariaLabel, accent, activeIndex, color, inactiveColor, barWidth, showLabels, showTooltip, tooltipValue, tooltipTrend, height, }: BarChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `data` | 是 | `BarChartDataItem[]` |  |
| `onActiveIndexChange` | 否 | `((index: number \| undefined) => void) \| undefined` |  |
| `onSelect` | 否 | `((index: number) => void) \| undefined` |  |
| `pinnedIndex` | 否 | `number \| undefined` |  |
| `domain` | 否 | `[number, number] \| undefined` |  |
| `referenceValue` | 否 | `number \| undefined` |  |
| `referenceLabel` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `color` | 否 | `string \| undefined` | Override bar color (Tailwind bg-* class). Defaults to accent.bg. |
| `inactiveColor` | 否 | `string \| undefined` | Override inactive bar color. Defaults to same as active. |
| `barWidth` | 否 | `"wide" \| "thin" \| undefined` |  |
| `showLabels` | 否 | `boolean \| undefined` |  |
| `showTooltip` | 否 | `boolean \| undefined` |  |
| `tooltipValue` | 否 | `string \| undefined` |  |
| `tooltipTrend` | 否 | `"up" \| "down" \| undefined` |  |
| `height` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/bar-chart-stat-card.md

# bar-chart-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/bar-chart-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BarChartStatCard (value)

```ts
({ title, value, trend, trendDirection, subtitle, theme, size, density, barColor, bars, width, className, }: { title: string; value: string; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: BarChartStatCardTheme; size?: StatCardSize; density?: "default" | "compact"; barColor?: BarColor; bars?: number[]; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `BarChartStatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `density` | 否 | `"default" \| "compact" \| undefined` |  |
| `barColor` | 否 | `BarColor \| undefined` |  |
| `bars` | 否 | `number[] \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## BarChartStatCardProps (type)

```ts
export type BarChartStatCardProps = Parameters<typeof BarChartStatCard>[0];
```

## BarColor (type)

```ts
export type BarColor = "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";
```

## 选型

- 离散周期对比（周销售 / 日访问） → `BarChartStatCard`
- 连续趋势 → `LineChartStatCard`
- 完成度占比 → `WheelChartStatCard`
- 多维图表 → 用 `charts/` 下的 `BarChart`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

---

Source: skills/forge-skill/references/components/bar-horizontal-chart.md

# bar-horizontal-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/bar-horizontal-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BarHorizontalChart (value)

```ts
({ data, domain, target, targetLabel, ranges, motion, accent, activeIndex, color, inactiveColor, barWidth, showLabels, showTooltip, tooltipValue, tooltipTrend, }: BarHorizontalChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `data` | 是 | `BarHorizontalChartDataItem[]` |  |
| `domain` | 否 | `[number, number] \| undefined` |  |
| `target` | 否 | `number \| undefined` |  |
| `targetLabel` | 否 | `string \| undefined` |  |
| `ranges` | 否 | `{ to: number; color?: string; }[] \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `inactiveColor` | 否 | `string \| undefined` |  |
| `barWidth` | 否 | `"wide" \| "thin" \| undefined` |  |
| `showLabels` | 否 | `boolean \| undefined` |  |
| `showTooltip` | 否 | `boolean \| undefined` |  |
| `tooltipValue` | 否 | `string \| undefined` |  |
| `tooltipTrend` | 否 | `"up" \| "down" \| undefined` |  |

---

Source: skills/forge-skill/references/components/bar-upside-down-chart.md

# bar-upside-down-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/bar-upside-down-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BarUpsideDownChart (value)

```ts
({ data, accent, activeIndex, upperColor, lowerColor, barWidth, showLabels, showTooltip, tooltipUpperValue, tooltipLowerValue, tooltipTrend, height, }: BarUpsideDownChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `data` | 是 | `BarUpsideDownChartDataItem[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `upperColor` | 否 | `string \| undefined` | Upper bar color override. Defaults to accent.bg. |
| `lowerColor` | 否 | `string \| undefined` | Lower bar color override. Defaults to accent.ramp[2] (mid-light shade). |
| `barWidth` | 否 | `"wide" \| "thin" \| undefined` |  |
| `showLabels` | 否 | `boolean \| undefined` |  |
| `showTooltip` | 否 | `boolean \| undefined` |  |
| `tooltipUpperValue` | 否 | `string \| undefined` |  |
| `tooltipLowerValue` | 否 | `string \| undefined` |  |
| `tooltipTrend` | 否 | `"up" \| "down" \| undefined` |  |
| `height` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/breadcrumbs.md

# breadcrumbs

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/breadcrumbs.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BreadcrumbColor (type)

```ts
export type BreadcrumbColor = keyof typeof breadcrumbColors;
```

## BreadcrumbItem (type)

```ts
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}
```

## Breadcrumbs (value)

```ts
({ items, color, className, ariaLabel, }: { items: BreadcrumbItem[]; color?: BreadcrumbColor; className?: string; ariaLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `BreadcrumbItem[]` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |

## 选型

- 详情页顶部标识路径 — 配合 `<DocHeader>` 或 `<PageHeader>`
- 三级以上路径推荐自动中间截断（业务自己处理）

---

Source: skills/forge-skill/references/components/bubble-chart.md

# bubble-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/bubble-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BubbleChart (value)

```ts
({ bubbles, accent, height }: BubbleChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `bubbles` | 是 | `Bubble[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `height` | 否 | `number \| undefined` | Container height. Default 240. |

---

Source: skills/forge-skill/references/components/button.md

# button

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/button.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Button (value)

```ts
({ children, color, variant, size, type, disabled, motion, iconLeft, iconRight, className, holdDuration, onConfirm, onUndo, confirmed, locale, holdLabels, effect, loading, result, progress, loadingLabel, resultLabel, ...props }: ButtonProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 否 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "black" \| "red" \| "dark" \| "grey" \| "blue-dark" \| undefined` |  |
| `variant` | 否 | `ButtonVariant \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `iconLeft` | 否 | `ReactNode` |  |
| `iconRight` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `holdDuration` | 否 | `number \| undefined` | Only used by variant="hold"; milliseconds. |
| `onConfirm` | 否 | `(() => void) \| undefined` |  |
| `onUndo` | 否 | `(() => void) \| undefined` |  |
| `confirmed` | 否 | `boolean \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `holdLabels` | 否 | `ButtonHoldLabels \| undefined` |  |
| `effect` | 否 | `ButtonEffect \| undefined` |  |
| `loading` | 否 | `boolean \| undefined` |  |
| `result` | 否 | `ActionResult \| undefined` |  |
| `progress` | 否 | `number \| undefined` | Controlled progress, from 0 to 100. |
| `loadingLabel` | 否 | `ReactNode` |  |
| `resultLabel` | 否 | `ReactNode` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `formAction` | 否 | `string \| ((formData: FormData) => void \| Promise<void>) \| undefined` |  |
| `formEncType` | 否 | `string \| undefined` |  |
| `formMethod` | 否 | `string \| undefined` |  |
| `formNoValidate` | 否 | `boolean \| undefined` |  |
| `formTarget` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `type` | 否 | `"submit" \| "reset" \| "button" \| undefined` |  |
| `value` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLButtonElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLButtonElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |

## ButtonColor (type)

```ts
export type ButtonColor = keyof typeof buttonVariants;
```

## ButtonEffect (type)

```ts
export type ButtonEffect = "glass" | "magnetic" | "ripple" | "roll";
```

## ButtonHoldLabels (type)

```ts
export type ButtonHoldLabels = { idle?: string; done?: string; undo?: string };
```

## ButtonProps (type)

```ts
export type ButtonProps = {
  children?: ReactNode; color?: ButtonColor; variant?: ButtonVariant; size?: ButtonSize;
  motion?: MotionPreference; iconLeft?: ReactNode; iconRight?: ReactNode; className?: string;
  /** Only used by variant="hold"; milliseconds. */
  holdDuration?: number; onConfirm?: () => void; onUndo?: () => void;
  confirmed?: boolean; locale?: "zh" | "en"; holdLabels?: ButtonHoldLabels;
  effect?: ButtonEffect; loading?: boolean; result?: ActionResult;
  /** Controlled progress, from 0 to 100. */
  progress?: number; loadingLabel?: ReactNode; resultLabel?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">;
```

## ButtonSize (type)

```ts
export type ButtonSize = keyof typeof buttonSizes;
```

## ButtonVariant (type)

```ts
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "hold" | "unstyled";
```

## 选型建议

| 场景 | 选 |
|---|---|
| 页面主 CTA | `color="blue" variant="primary"` |
| 次要动作（取消 / 返回） | `color="grey" variant="tertiary"` |
| 危险操作（删除 / 登出） | `color="red"` |
| 成功确认（保存 / 发布） | `color="green"` 或 `blue` |
| 深色品牌底 | `color="dark"` / `blue-dark`（底色 violet-800 / blue-800） |

---

Source: skills/forge-skill/references/components/button-group.md

# button-group

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/button-group.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ButtonGroup (value)

```ts
({ items, activeIndex, color, shape, onChange, className, motion, ariaLabel, }: { items: ButtonGroupItem[]; activeIndex?: number; color?: ButtonGroupColor; shape?: ButtonGroupShape; onChange?: (index: number) => void; className?: string; motion?: MotionPreference; ariaLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `ButtonGroupItem[]` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `shape` | 否 | `ButtonGroupShape \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |

## ButtonGroupColor (type)

```ts
export type ButtonGroupColor = keyof typeof activeItemColors;
```

## ButtonGroupItem (type)

```ts
export interface ButtonGroupItem {
  label: string;
}
```

## ButtonGroupShape (type)

```ts
export type ButtonGroupShape = "rounded" | "pill";
```

## 选型

- **ButtonGroup vs TabBar**：
  - ButtonGroup 更紧凑（外框内切分），适合过滤 / 时间区间 / 视图切换（卡片视图 / 列表视图）
  - TabBar 有下划线 + 底部延伸，适合页面级 tab
- pill 形状看起来更轻，rounded 更正式

---

Source: skills/forge-skill/references/components/calendar-card.md

# calendar-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/calendar-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CalendarCard (value)

```ts
({ size, variant, color, value, defaultDate, locale, labels, disabled, motion: motionPreference, className, onChange }: CalendarCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `size` | 否 | `"default" \| "compact" \| undefined` | Default preserves the original card geometry; compact uses form typography. |
| `variant` | 否 | `"card" \| "plain" \| undefined` | Plain removes both decorative card surfaces and their padding. |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "black" \| "red" \| "dark" \| "grey" \| "blue-dark" \| undefined` |  |
| `value` | 否 | `Date \| undefined` |  |
| `defaultDate` | 否 | `Date \| undefined` |  |
| `onChange` | 否 | `((date: Date) => void) \| undefined` |  |
| `locale` | 否 | `string \| undefined` |  |
| `labels` | 否 | `Partial<CalendarCardLabels> \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CalendarCardLabels (type)

```ts
export type CalendarCardLabels = { changeMonth: string; previousMonth: string; nextMonth: string; previousYear: string; nextYear: string };
```

## CalendarCardProps (type)

```ts
export type CalendarCardProps = {
  /** Default preserves the original card geometry; compact uses form typography. */
  size?: "default" | "compact";
  /** Plain removes both decorative card surfaces and their padding. */
  variant?: "card" | "plain";
  color?: ButtonColor;
  value?: Date;
  defaultDate?: Date;
  onChange?: (date: Date) => void;
  locale?: string;
  labels?: Partial<CalendarCardLabels>;
  disabled?: boolean;
  motion?: MotionPreference;
  className?: string;
};
```

---

Source: skills/forge-skill/references/components/calendar-day-cell.md

# calendar-day-cell

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/calendar-day-cell.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CalendarDayCell (value)

```ts
({ day, isToday, isSelected, isOtherMonth, events, maxVisible, moreAvatar, onMoreClick, className, }: { day: number; isToday?: boolean; isSelected?: boolean; isOtherMonth?: boolean; events?: { label: string; color: EventTagColor; avatar?: string; }[]; maxVisible?: number; moreAvatar?: string; onMoreClick?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `day` | 是 | `number` |  |
| `isToday` | 否 | `boolean \| undefined` |  |
| `isSelected` | 否 | `boolean \| undefined` |  |
| `isOtherMonth` | 否 | `boolean \| undefined` |  |
| `events` | 否 | `{ label: string; color: EventTagColor; avatar?: string; }[] \| undefined` |  |
| `maxVisible` | 否 | `number \| undefined` | Max visible event tags before showing "+N More" (default 3) |
| `moreAvatar` | 否 | `string \| undefined` | Avatar shown next to "+N More..." text |
| `onMoreClick` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/calendar-week-row.md

# calendar-week-row

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/calendar-week-row.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CalendarWeekRow (value)

```ts
({ time, events, className, }: { time: string; events?: { label: string; color: EventTagColor; span?: number; }[]; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `time` | 是 | `string` |  |
| `events` | 否 | `{ label: string; color: EventTagColor; span?: number; }[] \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/card-utils.md

# card-utils

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/card-utils.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ALL_CARD_THEMES (value)

```ts
readonly CardTheme[]
```

## CardAvatarGroup (value)

```ts
({ avatars, theme, size, max, }: { avatars: string[]; theme: CardThemeConfig; size?: number; max?: number; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `avatars` | 是 | `string[]` |  |
| `theme` | 是 | `CardThemeConfig` |  |
| `size` | 否 | `number \| undefined` |  |
| `max` | 否 | `number \| undefined` | Maximum avatars to show before collapsing into a "+N" chip |

## CardBadgeVariant (type)

```ts
export type CardBadgeVariant = "default" | "greyBg" | "solid" | "opacity" | "white";
```

## CardDensity (type)

```ts
export type CardDensity = "default" | "compact";
```

## CardGlow (value)

```ts
({ theme }: { theme: CardThemeConfig; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `theme` | 是 | `CardThemeConfig` |  |

## CardIconChip (value)

```ts
({ icon, theme, themeKey, variant, size, }: { icon: ReactNode; theme: CardThemeConfig; themeKey?: CardTheme; variant?: CardBadgeVariant; size?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 是 | `ReactNode` |  |
| `theme` | 是 | `CardThemeConfig` |  |
| `themeKey` | 否 | `CardTheme \| undefined` | The CardTheme key — needed to resolve badge color variants |
| `variant` | 否 | `CardBadgeVariant \| undefined` |  |
| `size` | 否 | `number \| undefined` |  |

## CardKebabButton (value)

```ts
({ theme, onClick, }: { theme: CardThemeConfig; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `theme` | 是 | `CardThemeConfig` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |

## CardTheme (type)

```ts
export type CardTheme = "white" | "black" | "purple" | "blue" | "green" | "red" | "yellow" | "cyan";
```

## CardThemeConfig (type)

```ts
export interface CardThemeConfig {
  /** Outer wrapper background + outline */
  bg: string;
  /** Primary text (value/number) color */
  valueColor: string;
  /** Title / label color */
  titleColor: string;
  /** Trend text color (badge-like indicator next to subtitle) */
  trendColor: string;
  /** Secondary text color (subtitle/helper) */
  subtextColor: string;
  /** Accent background for icon chip (used in Icon variant) */
  iconChipBg: string;
  /** Accent text/stroke for icon chip */
  iconChipText: string;
  /** Avatar border color (should match card bg so stacked avatars
   * have a visual gap in the card's own color) */
  avatarBorder: string;
  /** Decorative glow gradient (bottom-right blob) */
  glowFrom?: string;
  /** Decorative glow gradient (top-left blob) */
  glowTo?: string;
}
```

## cardThemes (value)

```ts
Record<CardTheme, CardThemeConfig>
```

## CardTrend (value)

```ts
({ trend, direction, subtitle, theme, }: { trend?: string; direction?: TrendDirection; subtitle?: string; theme: CardThemeConfig; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `trend` | 否 | `string \| undefined` |  |
| `direction` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 是 | `CardThemeConfig` |  |

## CardWidth (type)

```ts
export type CardWidth = "full" | "fixed";
```

## FinancialOrbs (value)

```ts
({ theme, variant, }: { theme: FinancialThemeConfig; variant: FinancialVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `theme` | 是 | `FinancialThemeConfig` |  |
| `variant` | 是 | `FinancialVariant` |  |

## FinancialTheme (type)

```ts
export type FinancialTheme = "dark" | "purple" | "blue" | "yellow" | "cyan" | "green" | "orange" | "red";
```

## FinancialThemeConfig (type)

```ts
export interface FinancialThemeConfig {
  bg: string;
  textColor: string;
  labelColor: string;
  /** Two blurred orb backgrounds — used in "glow" variant */
  glowOrbs: [string, string];
  /** Two gradient orbs — used in "gradient" variant */
  gradientOrbs: [string, string];
}
```

## financialThemes (value)

```ts
Record<FinancialTheme, FinancialThemeConfig>
```

## FinancialVariant (type)

```ts
export type FinancialVariant = "glow" | "gradient" | "flat";
```

## LegacyCardTheme (type)

```ts
export type LegacyCardTheme = "dark" | "orange";
```

## MastercardLogo (value)

```ts
() => JSX.Element
```

## resolveCardTheme (value)

```ts
(t: CardTheme | LegacyCardTheme) => CardTheme
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `toString` | 是 | `() => string` | Returns a string representation of a string. |
| `charAt` | 是 | `(pos: number) => string` | Returns the character at the specified index. |
| `charCodeAt` | 是 | `(index: number) => number` | Returns the Unicode value of the character at the specified location. |
| `concat` | 是 | `(...strings: string[]) => string` | Returns a string that contains the concatenation of two or more strings. |
| `indexOf` | 是 | `(searchString: string, position?: number) => number` | Returns the position of the first occurrence of a substring. |
| `lastIndexOf` | 是 | `(searchString: string, position?: number) => number` | Returns the last occurrence of a substring in the string. |
| `localeCompare` | 是 | `{ (that: string): number; (that: string, locales?: string \| string[], options?: Intl.CollatorOptions): number; (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number; }` | Determines whether two strings are equivalent in the current locale. Determines whether two strings are equivalent in the current or specified locale. |
| `match` | 是 | `{ (regexp: string \| RegExp): RegExpMatchArray \| null; (matcher: { [Symbol.match](string: string): RegExpMatchArray \| null; }): RegExpMatchArray \| null; }` | Matches a string with a regular expression, and returns an array containing the results of that search. Matches a string or an object that supports being matched against, and returns an array containing the results of that search, or null if no matches are found. |
| `replace` | 是 | `{ (searchValue: string \| RegExp, replaceValue: string): string; (searchValue: string \| RegExp, replacer: (substring: string, ...args: any[]) => string): string; (searchValue: { [Symbol.replace](string: string, replaceValue: string): string; }, replaceValue: string): string; (searchValue: { [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string; }, replacer: (substring: string, ...args: any[]) => string): string; }` | Replaces text in a string, using a regular expression or search string. Passes a string and {@linkcode replaceValue} to the `[Symbol.replace]` method on {@linkcode searchValue}. This method is expected to implement its own replacement algorithm. Replaces text in a string, using an object that supports replacement within a string. |
| `search` | 是 | `{ (regexp: string \| RegExp): number; (searcher: { [Symbol.search](string: string): number; }): number; }` | Finds the first substring match in a regular expression search. |
| `slice` | 是 | `(start?: number, end?: number) => string` | Returns a section of a string. |
| `split` | 是 | `{ (separator: string \| RegExp, limit?: number): string[]; (splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number): string[]; }` | Split a string into substrings using the specified separator and return them as an array. |
| `substring` | 是 | `(start: number, end?: number) => string` | Returns the substring at the specified location within a String object. |
| `toLowerCase` | 是 | `() => string` | Converts all the alphabetic characters in a string to lowercase. |
| `toLocaleLowerCase` | 是 | `{ (locales?: string \| string[]): string; (locales?: Intl.LocalesArgument): string; }` | Converts all alphabetic characters to lowercase, taking into account the host environment's current locale. |
| `toUpperCase` | 是 | `() => string` | Converts all the alphabetic characters in a string to uppercase. |
| `toLocaleUpperCase` | 是 | `{ (locales?: string \| string[]): string; (locales?: Intl.LocalesArgument): string; }` | Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale. |
| `trim` | 是 | `() => string` | Removes the leading and trailing white space and line terminator characters from a string. |
| `length` | 是 | `number` | Returns the length of a String object. |
| `substr` | 是 | `(from: number, length?: number) => string` | Gets a substring beginning at the specified location and having the specified length. |
| `valueOf` | 是 | `() => string` | Returns the primitive value of the specified object. |
| `codePointAt` | 是 | `(pos: number) => number \| undefined` | Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point value of the UTF-16 encoded code point starting at the string element at position pos in the String resulting from converting this object to a String. If there is no element at that position, the result is undefined. If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos. |
| `includes` | 是 | `(searchString: string, position?: number) => boolean` | Returns true if searchString appears as a substring of the result of converting this object to a String, at one or more positions that are greater than or equal to position; otherwise, returns false. |
| `endsWith` | 是 | `(searchString: string, endPosition?: number) => boolean` | Returns true if the sequence of elements of searchString converted to a String is the same as the corresponding elements of this object (converted to a String) starting at endPosition – length(this). Otherwise returns false. |
| `normalize` | 是 | `{ (form: "NFC" \| "NFD" \| "NFKC" \| "NFKD"): string; (form?: string): string; }` | Returns the String value result of normalizing the string into the normalization form named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms. |
| `repeat` | 是 | `(count: number) => string` | Returns a String value that is made from count copies appended together. If count is 0, the empty string is returned. |
| `startsWith` | 是 | `(searchString: string, position?: number) => boolean` | Returns true if the sequence of elements of searchString converted to a String is the same as the corresponding elements of this object (converted to a String) starting at position. Otherwise returns false. |
| `anchor` | 是 | `(name: string) => string` | Returns an `<a>` HTML anchor element and sets the name attribute to the text value |
| `big` | 是 | `() => string` | Returns a `<big>` HTML element |
| `blink` | 是 | `() => string` | Returns a `<blink>` HTML element |
| `bold` | 是 | `() => string` | Returns a `<b>` HTML element |
| `fixed` | 是 | `() => string` | Returns a `<tt>` HTML element |
| `fontcolor` | 是 | `(color: string) => string` | Returns a `<font>` HTML element and sets the color attribute value |
| `fontsize` | 是 | `{ (size: number): string; (size: string): string; }` | Returns a `<font>` HTML element and sets the size attribute value |
| `italics` | 是 | `() => string` | Returns an `<i>` HTML element |
| `link` | 是 | `(url: string) => string` | Returns an `<a>` HTML element and sets the href attribute value |
| `small` | 是 | `() => string` | Returns a `<small>` HTML element |
| `strike` | 是 | `() => string` | Returns a `<strike>` HTML element |
| `sub` | 是 | `() => string` | Returns a `<sub>` HTML element |
| `sup` | 是 | `() => string` | Returns a `<sup>` HTML element |
| `padStart` | 是 | `(maxLength: number, fillString?: string) => string` | Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length. The padding is applied from the start (left) of the current string. |
| `padEnd` | 是 | `(maxLength: number, fillString?: string) => string` | Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length. The padding is applied from the end (right) of the current string. |
| `trimEnd` | 是 | `() => string` | Removes the trailing white space and line terminator characters from a string. |
| `trimStart` | 是 | `() => string` | Removes the leading white space and line terminator characters from a string. |
| `trimLeft` | 是 | `() => string` | Removes the leading white space and line terminator characters from a string. |
| `trimRight` | 是 | `() => string` | Removes the trailing white space and line terminator characters from a string. |
| `matchAll` | 是 | `(regexp: RegExp) => RegExpStringIterator<RegExpExecArray>` | Matches a string with a regular expression, and returns an iterable of matches containing the results of that search. |
| `replaceAll` | 是 | `{ (searchValue: string \| RegExp, replaceValue: string): string; (searchValue: string \| RegExp, replacer: (substring: string, ...args: any[]) => string): string; }` | Replace all instances of a substring in a string, using a regular expression or search string. |
| `at` | 是 | `(index: number) => string \| undefined` | Returns a new String consisting of the single UTF-16 code unit located at the specified index. |
| `isWellFormed` | 是 | `() => boolean` | Returns true if all leading surrogates and trailing surrogates appear paired and in order. |
| `toWellFormed` | 是 | `() => string` | Returns a string where all lone or out-of-order surrogates have been replaced by the Unicode replacement character (U+FFFD). |
| `__@iterator@34` | 是 | `() => StringIterator<string>` | Iterator |

## StatCardShell (value)

```ts
({ title, value, trend, trendDirection, subtitle, theme, themeKey, size, icon, iconVariant, action, chartSlot, footerSlot, density, width, className, }: { title: string; value: ReactNode; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme: CardThemeConfig; themeKey?: CardTheme; size?: StatCardSize; icon?: ReactNode; iconVariant?: CardBadgeVariant; action?: ReactNode; chartSlot?: ReactNode; footerSlot?: ReactNode; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `ReactNode` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 是 | `CardThemeConfig` |  |
| `themeKey` | 否 | `CardTheme \| undefined` | Required when icon is rendered as a colored badge (size="wide" or iconVariant !== "default"). |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `iconVariant` | 否 | `CardBadgeVariant \| undefined` |  |
| `action` | 否 | `ReactNode` |  |
| `chartSlot` | 否 | `ReactNode` |  |
| `footerSlot` | 否 | `ReactNode` |  |
| `density` | 否 | `CardDensity \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## StatCardSize (type)

```ts
export type StatCardSize = keyof typeof statCardSizes;
```

## statCardSizes (value)

```ts
{ readonly sm: { readonly wrapper: "p-5"; readonly fixedWidth: "w-64"; readonly value: "text-3xl leading-9"; }; readonly lg: { readonly wrapper: "p-6"; readonly fixedWidth: "w-90"; readonly value: "text-5xl leading-[60px]"; }; readonly wide: { readonly wrapper: "p-6"; readonly fixedWidth: ""; readonly value: "text-3xl leading-9"; }; }
```

## TrendDirection (type)

```ts
export type TrendDirection = "up" | "down";
```

## 何时用

**业务代码里不用**。这些是**扩卡片家族**（比如做一个新业务卡）时的 building block：

```tsx
import { StatCardShell, CardIconChip, CardTrend, cardThemes } from "@forge-ui-official/core";

export function MyCustomCard({ theme = "blue" }) {
  const t = cardThemes[theme];
  return (
    <StatCardShell theme={t}>
      <CardIconChip theme={t}><IconX /></CardIconChip>
      <h4>Metric</h4>
      <CardTrend direction="up" value="+12%" />
    </StatCardShell>
  );
}
```

业务直接用 → `StatCard` / `ProgressStatCard` 等封装好的组件。

---

Source: skills/forge-skill/references/components/chart-card.md

# chart-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartCard (value)

```ts
({ title, subtitle, children, footer, action, onMenuClick, size, width, minHeight, className, }: ChartCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `size` | 否 | `ChartCardSize \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Omitted/full fills the parent (dashboard/grid column). Use fixed only for Figma-size showcases. Takes precedence over `size`. |
| `minHeight` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/chart-legend-item.md

# chart-legend-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-legend-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartLegendItem (value)

```ts
({ color, accent, shade, label, value }: ChartLegendItemProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `color` | 否 | `string \| undefined` | Tailwind bg-* class override. When omitted, uses `accent` + `shade` index into ramp. |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `shade` | 否 | `0 \| 2 \| 1 \| 3 \| 4 \| undefined` | Ramp index (0 = deepest, 4 = lightest). Default 0. |
| `label` | 是 | `string` |  |
| `value` | 是 | `string` |  |

---

Source: skills/forge-skill/references/components/chart-list-item.md

# chart-list-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-list-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartListItem (value)

```ts
({ icon: Icon, accent, title, subtitle, value, trend, trendDirection, }: ChartListItemProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 否 | `IconComponent \| undefined` | Forge icon component reference (e.g. `WalletLinear`). Accent drives its color + bg. |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |

---

Source: skills/forge-skill/references/components/chart-stat-footer.md

# chart-stat-footer

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-stat-footer.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartStatFooter (value)

```ts
({ items, accent }: ChartStatFooterProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `ChartStatFooterItem[]` |  |
| `accent` | 否 | `AccentColor \| undefined` | When item.color is omitted, derives dot color from this accent's ramp. |

---

Source: skills/forge-skill/references/components/chart-tooltip.md

# chart-tooltip

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-tooltip.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartTooltip (value)

```ts
({ items, className }: ChartTooltipProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `ChartTooltipItem[]` |  |
| `className` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/chart-value-row.md

# chart-value-row

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-value-row.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartValueRow (value)

```ts
({ value, trend, trendDirection, color, label, }: ChartValueRowProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `color` | 否 | `string \| undefined` | Optional dot color + label on the left |
| `label` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/chat-bubble.md

# chat-bubble

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/chat-bubble.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChatBubble (value)

```ts
({ type, locale, motion, reactions, reactionOptions, onReaction, onReply, replyTo, delivery, variant, color, content, time, avatar, senderName, images, extraImageCount, fileName, fileSize, onFileDownload, voiceDuration, className, }: { type: "sent" | "received"; locale?: "zh" | "en"; motion?: MotionPreference; reactions?: ChatReaction[]; reactionOptions?: ChatReactionOption[]; onReaction?: (id: string) => void; onReply?: () => void; replyTo?: ComposerReply; delivery?: "queued" | "sending" | "sent" | "delivered" | "failed"; variant?: "text" | "voice" | "file" | "image"; color?: AccentColor; content?: string; time?: string; avatar?: string; senderName?: string; images?: string[]; extraImageCount?: number; fileName?: string; fileSize?: string; onFileDownload?: () => void; voiceDuration?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `type` | 是 | `"sent" \| "received"` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `reactions` | 否 | `ChatReaction[] \| undefined` |  |
| `reactionOptions` | 否 | `ChatReactionOption[] \| undefined` |  |
| `onReaction` | 否 | `((id: string) => void) \| undefined` |  |
| `onReply` | 否 | `(() => void) \| undefined` |  |
| `replyTo` | 否 | `ComposerReply \| undefined` |  |
| `delivery` | 否 | `"sent" \| "queued" \| "sending" \| "delivered" \| "failed" \| undefined` |  |
| `variant` | 否 | `"text" \| "voice" \| "file" \| "image" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `time` | 否 | `string \| undefined` |  |
| `avatar` | 否 | `string \| undefined` |  |
| `senderName` | 否 | `string \| undefined` |  |
| `images` | 否 | `string[] \| undefined` |  |
| `extraImageCount` | 否 | `number \| undefined` |  |
| `fileName` | 否 | `string \| undefined` |  |
| `fileSize` | 否 | `string \| undefined` |  |
| `onFileDownload` | 否 | `(() => void) \| undefined` | Renders an actionable download button for received file messages. |
| `voiceDuration` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 消息列表 → `ChatBubble` 按 sent/received 方向自动对齐
- 输入框 → 搭配 `ChatInputBar`
- 联系人行 → `ContactItem`

---

Source: skills/forge-skill/references/components/chat-input-bar.md

# chat-input-bar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/chat-input-bar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChatInputBar (value)

```ts
({ locale, motion: motionPreference, replyTo, onCancelReply, attachments, hasAttachments, voiceState, voiceLevel, onVoiceStart, onVoiceEnd, onVoiceCancel, quickActions, quickActionsLabel, defaultQuickActionsOpen, hasMessages, removeQuickActionLabel, onQuickActionChange, placeholder, value: controlledValue, onChange, onSend, className, multiline, rows, toggles, sendLabel, showAttachment, onAttach, attachLabel, sendOnEnter, disabled, status, onStop, stopLabel, stoppingLabel, models, model, onModelChange, modelMenuLabel, sendDisabled, inputLabel, clearOnSend, density, sources, selectedSources: controlledSources, defaultSelectedSources, onSourcesChange, removeSourceLabel, sourcesLabel, commands, commandsLabel, emptyCommandsLabel, connectedLabel, onDictate, dictateLabel, toolsMenuLabel, permissions, permission, onPermissionChange, permissionMenuLabel, color, emptySourcesLabel, }: { locale?: "zh" | "en"; motion?: MotionPreference; replyTo?: ComposerReply; onCancelReply?: () => void; attachments?: ReactNode; hasAttachments?: boolean; voiceState?: ComposerVoiceState; voiceLevel?: number; onVoiceStart?: () => void; onVoiceEnd?: () => void; onVoiceCancel?: () => void; quickActions?: ChatInputBarQuickAction[]; quickActionsLabel?: string; hasMessages?: boolean; defaultQuickActionsOpen?: boolean; removeQuickActionLabel?: string; onQuickActionChange?: (action: ChatInputBarQuickAction | null) => void; commands?: ComposerCommand[]; commandsLabel?: string; emptyCommandsLabel?: string; connectedLabel?: string; onDictate?: () => void; dictateLabel?: string; toolsMenuLabel?: string; permissions?: ComposerModel[]; permission?: string; onPermissionChange?: (id: string) => void; permissionMenuLabel?: string; color?: AccentColor; status?: ComposerStatus; onStop?: () => void; stopLabel?: string; stoppingLabel?: string; models?: ComposerModel[]; model?: string; onModelChange?: (id: string) => void; modelMenuLabel?: string; placeholder?: string; value?: string; onChange?: (value: string) => void; onSend?: (message: string, action?: ChatInputBarQuickAction, context?: ChatInputBarSendContext) => void; className?: string; multiline?: boolean; rows?: number; toggles?: ChatInputBarToggle[]; sendLabel?: string; showAttachment?: boolean; onAttach?: () => void; attachLabel?: string; sendOnEnter?: boolean; disabled?: boolean; sendDisabled?: boolean; inputLabel?: string; clearOnSend?: boolean; density?: "default" | "compact"; sources?: ComposerSource[]; selectedSources?: ComposerSource[]; defaultSelectedSources?: ComposerSource[]; onSourcesChange?: (sources: ComposerSource[]) => void; removeSourceLabel?: string; sourcesLabel?: string; emptySourcesLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `replyTo` | 否 | `ComposerReply \| undefined` |  |
| `onCancelReply` | 否 | `(() => void) \| undefined` |  |
| `attachments` | 否 | `ReactNode` | Controlled attachment queue, rendered inside the composer surface. |
| `hasAttachments` | 否 | `boolean \| undefined` | Whether the host has sendable attachments. Combine with sendDisabled while uploading. |
| `voiceState` | 否 | `ComposerVoiceState \| undefined` | Recording/transcription remains owned by the host; no microphone access is requested. |
| `voiceLevel` | 否 | `number \| undefined` |  |
| `onVoiceStart` | 否 | `(() => void) \| undefined` |  |
| `onVoiceEnd` | 否 | `(() => void) \| undefined` |  |
| `onVoiceCancel` | 否 | `(() => void) \| undefined` |  |
| `quickActions` | 否 | `ChatInputBarQuickAction[] \| undefined` | Optional animated action cards, opened from the plus menu. |
| `quickActionsLabel` | 否 | `string \| undefined` |  |
| `hasMessages` | 否 | `boolean \| undefined` | Whether the conversation already contains messages. Omit to infer after the first send. |
| `defaultQuickActionsOpen` | 否 | `boolean \| undefined` | Automatically show configured cards in an empty conversation. |
| `removeQuickActionLabel` | 否 | `string \| undefined` |  |
| `onQuickActionChange` | 否 | `((action: ChatInputBarQuickAction \| null) => void) \| undefined` |  |
| `commands` | 否 | `ComposerCommand[] \| undefined` |  |
| `commandsLabel` | 否 | `string \| undefined` |  |
| `emptyCommandsLabel` | 否 | `string \| undefined` |  |
| `connectedLabel` | 否 | `string \| undefined` |  |
| `onDictate` | 否 | `(() => void) \| undefined` |  |
| `dictateLabel` | 否 | `string \| undefined` |  |
| `toolsMenuLabel` | 否 | `string \| undefined` |  |
| `permissions` | 否 | `ComposerModel[] \| undefined` | Permission choices are owned and enforced by the caller. |
| `permission` | 否 | `string \| undefined` |  |
| `onPermissionChange` | 否 | `((id: string) => void) \| undefined` |  |
| `permissionMenuLabel` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `status` | 否 | `ComposerStatus \| undefined` |  |
| `onStop` | 否 | `(() => void) \| undefined` | Request cancellation; caller confirms stopping, then idle. |
| `stopLabel` | 否 | `string \| undefined` |  |
| `stoppingLabel` | 否 | `string \| undefined` |  |
| `models` | 否 | `ComposerModel[] \| undefined` |  |
| `model` | 否 | `string \| undefined` |  |
| `onModelChange` | 否 | `((id: string) => void) \| undefined` |  |
| `modelMenuLabel` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| undefined` | Controlled value. Pass with onChange to manage external state. |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onSend` | 否 | `((message: string, action?: ChatInputBarQuickAction, context?: ChatInputBarSendContext) => void) \| undefined` | message may be empty for attachment-only sends when hasAttachments is true. |
| `className` | 否 | `string \| undefined` |  |
| `multiline` | 否 | `boolean \| undefined` | Render a textarea instead of a single-line input |
| `rows` | 否 | `number \| undefined` | Textarea row count (multiline only) |
| `toggles` | 否 | `ChatInputBarToggle[] \| undefined` | Footer toggle chips (e.g. Deep think, Web search). Attachment and context actions remain in the plus menu. |
| `sendLabel` | 否 | `string \| undefined` | When given, send button renders as a labeled pill (label + arrow). Otherwise circular icon-only. |
| `showAttachment` | 否 | `boolean \| undefined` | Whether to include attachments in the plus menu. Defaults to true. |
| `onAttach` | 否 | `(() => void) \| undefined` |  |
| `attachLabel` | 否 | `string \| undefined` |  |
| `sendOnEnter` | 否 | `boolean \| undefined` | Multiline Enter sends when enabled; Shift+Enter inserts a newline. |
| `disabled` | 否 | `boolean \| undefined` | Disable editing and tool selection; active generation remains stoppable. |
| `sendDisabled` | 否 | `boolean \| undefined` | Disable sending while keeping the draft editable. |
| `inputLabel` | 否 | `string \| undefined` |  |
| `clearOnSend` | 否 | `boolean \| undefined` | Controlled async callers can clear only after success. |
| `density` | 否 | `"default" \| "compact" \| undefined` |  |
| `sources` | 否 | `ComposerSource[] \| undefined` | Mention suggestions displayed above the composer, inserted at the caret. |
| `selectedSources` | 否 | `ComposerSource[] \| undefined` |  |
| `defaultSelectedSources` | 否 | `ComposerSource[] \| undefined` |  |
| `onSourcesChange` | 否 | `((sources: ComposerSource[]) => void) \| undefined` |  |
| `removeSourceLabel` | 否 | `string \| undefined` |  |
| `sourcesLabel` | 否 | `string \| undefined` |  |
| `emptySourcesLabel` | 否 | `string \| undefined` |  |

## ChatInputBarQuickAction (type)

```ts
export type ChatInputBarQuickAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Built-in animated illustration and card treatment. */
  kind?: "image" | "note" | "event" | "voice" | "docs";
  /** Hint shown while this operation is selected; never inserted into the draft. */
  placeholder?: string;
  onClick?: () => void;
};
```

## ChatInputBarSendContext (type)

```ts
export type ChatInputBarSendContext = { sources: ComposerSource[]; replyTo?: ComposerReply };
```

## ChatInputBarToggle (type)

```ts
export type ChatInputBarToggle = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};
```

## ComposerCommand (type)

```ts
export type ComposerCommand = { id: string; label: string; description?: string };
```

## ComposerSource (type)

```ts
export type ComposerSource = {
  id: string; label: string; description?: string; connected?: boolean;
  /** Typed objects render as removable context chips; untyped sources retain text insertion. */
  kind?: "agent" | "skill" | "tool";
  icon?: ReactNode;
  /** Agent avatar shown beside its name in the picker and selected chip. */
  avatarSrc?: string;
  placeholder?: string;
};
```

## 选型

- 聊天页底部 → `ChatInputBar`
- 评论输入 → 用 `TextArea` + 自定义 Submit
- 搜索输入 → `ToolbarSearchInput`

---

Source: skills/forge-skill/references/components/chat-interactions.md

# chat-interactions

自动生成；请勿编辑 API 部分。来源：`core/src/internal/chat-interactions.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChatReaction (type)

```ts
export type ChatReaction = { id: string; label: string; content: ReactNode; count: number; selected?: boolean };
```

## ChatReactionOption (type)

```ts
export type ChatReactionOption = Pick<ChatReaction, "id" | "label" | "content">;
```

---

Source: skills/forge-skill/references/components/checkbox.md

# checkbox

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/checkbox.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Checkbox (value)

```ts
({ checked, color, onChange, disabled, motion, className, onClick, "aria-label": ariaLabel, ...props }: { checked?: boolean; color?: CheckboxColor; onChange?: (checked: boolean) => void; motion?: MotionPreference; } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "onChange" | "type">) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "black" \| "red" \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `formAction` | 否 | `string \| ((formData: FormData) => void \| Promise<void>) \| undefined` |  |
| `formEncType` | 否 | `string \| undefined` |  |
| `formMethod` | 否 | `string \| undefined` |  |
| `formNoValidate` | 否 | `boolean \| undefined` |  |
| `formTarget` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLButtonElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |

## CheckboxColor (type)

```ts
export type CheckboxColor = keyof typeof checkboxColors;
```

## CheckboxControl (value)

```ts
({ checked, color, onChange, disabled, motion, className, onClick, "aria-label": ariaLabel, ...props }: { checked?: boolean; color?: CheckboxColor; onChange?: (checked: boolean) => void; motion?: MotionPreference; } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "onChange" | "type">) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "black" \| "red" \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `formAction` | 否 | `string \| ((formData: FormData) => void \| Promise<void>) \| undefined` |  |
| `formEncType` | 否 | `string \| undefined` |  |
| `formMethod` | 否 | `string \| undefined` |  |
| `formNoValidate` | 否 | `boolean \| undefined` |  |
| `formTarget` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLButtonElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |

## 选型

- 纯勾选原子（表格头 / 批量选择） → `Checkbox`
- 带文字标签 → `CheckboxWithLabel`（核对安装版本的生成 API）
- 单选 → `RadioButton`
- 开关语义 → `Toggle`

---

Source: skills/forge-skill/references/components/checklist.md

# checklist

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/checklist.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Checklist (value)

```ts
({ tasks, locale, defaultTasks, size, color, onTasksChange, className, motion, }: { tasks?: ChecklistTask[]; locale?: "zh" | "en"; defaultTasks?: ChecklistTask[]; size?: ChecklistSize; color?: ChecklistColor; onTasksChange?: (tasks: ChecklistTask[]) => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tasks` | 否 | `ChecklistTask[] \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `defaultTasks` | 否 | `ChecklistTask[] \| undefined` |  |
| `size` | 否 | `ChecklistSize \| undefined` |  |
| `color` | 否 | `ChecklistColor \| undefined` |  |
| `onTasksChange` | 否 | `((tasks: ChecklistTask[]) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ChecklistColor (type)

```ts
export type ChecklistColor = Exclude<CheckboxColor, "orange">;
```

## ChecklistItem (value)

```ts
({ label, checked, defaultChecked, size, color, onCheckedChange, onSettled, onReverted, className, motion, }: { label: string; checked?: boolean; defaultChecked?: boolean; size?: ChecklistSize; color?: ChecklistColor; onCheckedChange?: (checked: boolean) => void; onSettled?: () => void; onReverted?: () => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `size` | 否 | `ChecklistSize \| undefined` |  |
| `color` | 否 | `ChecklistColor \| undefined` |  |
| `onCheckedChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `onSettled` | 否 | `(() => void) \| undefined` |  |
| `onReverted` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ChecklistSize (type)

```ts
export type ChecklistSize = "sm" | "md";
```

## ChecklistTask (type)

```ts
export type ChecklistTask = {
  id: string;
  label: string;
  done?: boolean;
};
```

---

Source: skills/forge-skill/references/components/command-search.md

# command-search

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/command-search.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CommandSearch (value)

```ts
({ items, placeholder, emptyLabel, query: controlledQuery, onQueryChange, onSelect, groupLabel, locale, color, motion, autoFocus, className, }: { items: CommandSearchItem[]; placeholder?: string; emptyLabel?: string; query?: string; onQueryChange?: (query: string) => void; onSelect?: (item: CommandSearchItem) => void; groupLabel?: string; locale?: "zh" | "en"; color?: AccentColor; motion?: MotionPreference; autoFocus?: boolean; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `CommandSearchItem[]` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `emptyLabel` | 否 | `string \| undefined` |  |
| `query` | 否 | `string \| undefined` |  |
| `onQueryChange` | 否 | `((query: string) => void) \| undefined` |  |
| `onSelect` | 否 | `((item: CommandSearchItem) => void) \| undefined` |  |
| `groupLabel` | 否 | `string \| undefined` | Heading for items without an explicit group. |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CommandSearchItem (type)

```ts
export type CommandSearchItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: string[];
  /** Optional leading icon, typically from the Solar icon collection. */
  icon?: ReactNode;
  /** Display only; the consumer owns shortcut registration. */
  shortcut?: string;
};
```

---

Source: skills/forge-skill/references/components/comment-item.md

# comment-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/comment-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CommentData (type)

```ts
export type CommentData = CommentReply & {
  images?: string[];
  replies?: CommentReply[];
  className?: string;
};
```

## CommentItem (value)

```ts
({ avatar, name, date, content, images, onReply, replyLabel, replies, className, }: CommentData) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `avatar` | 是 | `string` |  |
| `name` | 是 | `string` |  |
| `date` | 是 | `string` |  |
| `content` | 是 | `string` |  |
| `onReply` | 否 | `(() => void) \| undefined` |  |
| `replyLabel` | 否 | `string \| undefined` |  |
| `images` | 否 | `string[] \| undefined` |  |
| `replies` | 否 | `CommentReply[] \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CommentReply (type)

```ts
export type CommentReply = {
  avatar: string;
  name: string;
  date: string;
  content: string;
  onReply?: () => void;
  replyLabel?: string;
};
```

## 选型

- 讨论区 / 评论列表 → `CommentItem`
- 打分评价 → `ReviewItem`（带 rating）
- 活动日志 → `ActivityCard`

---

Source: skills/forge-skill/references/components/composer-types.md

# composer-types

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/composer-types.ts`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ComposerModel (type)

```ts
export type ComposerModel = { id: string; label: string };
```

## ComposerReply (type)

```ts
export type ComposerReply = { id: string; name: string; content: string };
```

## ComposerStatus (type)

```ts
export type ComposerStatus = "idle" | "running" | "stopping";
```

## ComposerVoiceState (type)

```ts
export type ComposerVoiceState = "idle" | "recording" | "processing";
```

---

Source: skills/forge-skill/references/components/confirmation-dialog.md

# confirmation-dialog

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/confirmation-dialog.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ConfirmationDialog (value)

```ts
({ title, description, confirmLabel, cancelLabel, color, icon, layout, onConfirm, onCancel, className, open, onOpenChange, motion, }: { title: string; description: string; confirmLabel?: string; cancelLabel?: string; color: ConfirmationDialogColor; icon?: ReactNode; layout?: ConfirmationDialogLayout; onConfirm?: () => void; onCancel?: () => void; className?: string; open?: boolean; onOpenChange?: (open: boolean) => void; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `description` | 是 | `string` |  |
| `confirmLabel` | 否 | `string \| undefined` |  |
| `cancelLabel` | 否 | `string \| undefined` |  |
| `color` | 是 | `"purple" \| "blue" \| "green" \| "yellow" \| "red"` |  |
| `icon` | 否 | `ReactNode` |  |
| `layout` | 否 | `ConfirmationDialogLayout \| undefined` |  |
| `onConfirm` | 否 | `(() => void) \| undefined` |  |
| `onCancel` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `open` | 否 | `boolean \| undefined` | Omit open for the existing inline card. |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ConfirmationDialogColor (type)

```ts
export type ConfirmationDialogColor = keyof typeof confirmBgColors;
```

## ConfirmationDialogLayout (type)

```ts
export type ConfirmationDialogLayout = "spread" | "right";
```

## 选型

| 场景 | color |
|---|---|
| 删除 / 移除 / 登出 | `red` |
| 发布 / 提交成功确认 | `green` |
| 谨慎操作警告 | `yellow` |
| 普通业务确认 | `blue` / `blue` |

---

Source: skills/forge-skill/references/components/contact-item.md

# contact-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/contact-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ContactItem (value)

```ts
({ type, color, avatar, initials, name, message, online, active, unreadCount, time, className, }: { type?: "person" | "team"; color?: AccentColor; avatar?: string; initials?: string; name: string; message?: string; online?: boolean; active?: boolean; unreadCount?: number; time?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `type` | 否 | `"person" \| "team" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `avatar` | 否 | `string \| undefined` |  |
| `initials` | 否 | `string \| undefined` |  |
| `name` | 是 | `string` |  |
| `message` | 否 | `string \| undefined` |  |
| `online` | 否 | `boolean \| undefined` |  |
| `active` | 否 | `boolean \| undefined` |  |
| `unreadCount` | 否 | `number \| undefined` |  |
| `time` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 消息列表 / 联系人行 → `ContactItem`
- 通用头像行（不含消息） → `ListItem` lead="avatar"
- 评论头像 → `Avatar` 原子

---

Source: skills/forge-skill/references/components/context-cards.md

# context-cards

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/context-cards.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ContextCards (value)

```ts
({ chunks, locale, total, allChunksLabel, charactersLabel, className, }: { chunks: ContextChunk[]; locale?: "zh" | "en"; total?: number; allChunksLabel?: string; charactersLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `chunks` | 是 | `ContextChunk[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `total` | 否 | `number \| undefined` |  |
| `allChunksLabel` | 否 | `string \| undefined` |  |
| `charactersLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ContextChunk (type)

```ts
export type ContextChunk = {
  id: string;
  title: string;
  body: string;
  sourceLabel?: string;
  sourceKind?: string;
  charCount?: number;
};
```

---

Source: skills/forge-skill/references/components/credit-card.md

# credit-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/credit-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CreditCard (value)

```ts
({ locale, cardNumberLabel, holderNameLabel, cardNumber, holderName, expiry, theme, variant, width, className, }: { locale?: "zh" | "en"; cardNumberLabel?: string; holderNameLabel?: string; cardNumber?: string; holderName?: string; expiry?: string; theme?: FinancialTheme; variant?: FinancialVariant; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `cardNumberLabel` | 否 | `string \| undefined` |  |
| `holderNameLabel` | 否 | `string \| undefined` |  |
| `cardNumber` | 否 | `string \| undefined` |  |
| `holderName` | 否 | `string \| undefined` |  |
| `expiry` | 否 | `string \| undefined` |  |
| `theme` | 否 | `FinancialTheme \| undefined` |  |
| `variant` | 否 | `FinancialVariant \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 信用卡管理页 → `CreditCard`
- 借记卡（需要余额显示） → `DebitCard`
- 账户余额卡片（带操作） → `BalanceCard`

---

Source: skills/forge-skill/references/components/currency-converter.md

# currency-converter

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/currency-converter.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CurrencyConverter (value)

```ts
({ title, subtitle, color, fromValue, fromCurrency, fromPlaceholder, toValue, toCurrency, toPlaceholder, exchangeRateText, convertLabel, convertIcon, onMenuClick, onConvert, onFromChange, onToChange, onFromCurrencyChange, onToCurrencyChange, width, className, }: CurrencyConverterProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `CurrencyConverterColor \| undefined` |  |
| `fromValue` | 否 | `string \| undefined` |  |
| `fromCurrency` | 否 | `string \| undefined` |  |
| `fromPlaceholder` | 否 | `string \| undefined` |  |
| `toValue` | 否 | `string \| undefined` |  |
| `toCurrency` | 否 | `string \| undefined` |  |
| `toPlaceholder` | 否 | `string \| undefined` |  |
| `exchangeRateText` | 否 | `string \| undefined` |  |
| `convertLabel` | 否 | `string \| undefined` |  |
| `convertIcon` | 否 | `ReactNode` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `onConvert` | 否 | `(() => void) \| undefined` |  |
| `onFromChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onToChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onFromCurrencyChange` | 否 | `(() => void) \| undefined` |  |
| `onToCurrencyChange` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## CurrencyConverterColor (type)

```ts
export type CurrencyConverterColor = "purple" | "blue" | "dark";
```

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/dashboard-charts.md

# dashboard-charts

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/dashboard-charts.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartHeader (value)

```ts
({ title, subtitle, tabs, activeTab, defaultTab, onTabChange, action, }: { title: string; subtitle?: string; tabs?: string[]; activeTab?: string; defaultTab?: string; onTabChange?: (tab: string) => void; action?: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `tabs` | 否 | `string[] \| undefined` |  |
| `activeTab` | 否 | `string \| undefined` |  |
| `defaultTab` | 否 | `string \| undefined` |  |
| `onTabChange` | 否 | `((tab: string) => void) \| undefined` |  |
| `action` | 否 | `ReactNode` |  |

## ChartHeaderProps (type)

```ts
export type ChartHeaderProps = Parameters<typeof ChartHeader>[0];
```

## ChartMetricRow (value)

```ts
({ series }: { series: ChartMetricSeries[]; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `series` | 是 | `ChartMetricSeries[]` |  |

## ChartMetricRowProps (type)

```ts
export type ChartMetricRowProps = Parameters<typeof ChartMetricRow>[0];
```

## ChartMetricSeries (type)

```ts
export type ChartMetricSeries = {
  label: string;
  colorClass: string;
  value?: string;
  trend?: ChartTrend;
  trendValue?: string;
};
```

## ChartTrend (type)

```ts
export type ChartTrend = "up" | "down";
```

## DivergingBarChart (value)

```ts
({ data, upperColor, lowerColor, activeIndex, tooltipUpperValue, tooltipLowerValue, heightClass, upperLabel, lowerLabel, }: { upperLabel?: string; lowerLabel?: string; data: { label: string; upperValue: number; lowerValue: number; }[]; upperColor?: string; lowerColor?: string; activeIndex?: number; tooltipUpperValue?: string; tooltipLowerValue?: string; heightClass?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `upperLabel` | 否 | `string \| undefined` |  |
| `lowerLabel` | 否 | `string \| undefined` |  |
| `data` | 是 | `{ label: string; upperValue: number; lowerValue: number; }[]` |  |
| `upperColor` | 否 | `string \| undefined` |  |
| `lowerColor` | 否 | `string \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `tooltipUpperValue` | 否 | `string \| undefined` |  |
| `tooltipLowerValue` | 否 | `string \| undefined` |  |
| `heightClass` | 否 | `string \| undefined` |  |

## DivergingBarChartProps (type)

```ts
export type DivergingBarChartProps = Parameters<typeof DivergingBarChart>[0];
```

## GroupedBarChart (value)

```ts
({ data, series, activeIndex, tooltipItems, yAxisLabels, heightClass, }: { data: GroupedBarPoint[]; series: ChartMetricSeries[]; activeIndex?: number; tooltipItems?: GroupedBarTooltipItem[]; yAxisLabels?: string[]; heightClass?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `data` | 是 | `GroupedBarPoint[]` |  |
| `series` | 是 | `ChartMetricSeries[]` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `tooltipItems` | 否 | `GroupedBarTooltipItem[] \| undefined` |  |
| `yAxisLabels` | 否 | `string[] \| undefined` |  |
| `heightClass` | 否 | `string \| undefined` |  |

## GroupedBarChartProps (type)

```ts
export type GroupedBarChartProps = Parameters<typeof GroupedBarChart>[0];
```

## GroupedBarPoint (type)

```ts
export type GroupedBarPoint = {
  label: string;
  values: number[];
};
```

## GroupedBarTooltipItem (type)

```ts
export type GroupedBarTooltipItem = {
  label: string;
  value: string;
  colorClass: string;
  trend?: ChartTrend;
};
```

## 选型建议

ChartHeader 为可控/非可控页签标题；ChartMetricRow 为指标与趋势；GroupedBarChart 为多系列分组柱；DivergingBarChart 为上下柱。均保留模板样式，非交互图形编辑器。数据、颜色、轴与趋势文案由调用方提供；示例见 /cases/dashboard-kit。

导入自 `@forge-ui-official/core`；交互示例 `/cases/dashboard-kit`，Blocks 画廊 `/blocks`。源码实现不等于截图验收或 npm 已发布。

---

Source: skills/forge-skill/references/components/dashed-half-donut-chart.md

# dashed-half-donut-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/dashed-half-donut-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DashedHalfDonutChart (value)

```ts
({ segments, accent, centerValue, trend, trendDirection, subtitle, trackColor, }: DashedHalfDonutChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `DashedHalfDonutSegment[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `centerValue` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `trackColor` | 否 | `string \| undefined` | Optional track color. Defaults to accent's lightest ramp stop. |

---

Source: skills/forge-skill/references/components/data-table.md

# data-table

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/data-table.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CellActionKey (type)

```ts
export type CellActionKey =
  | "mail"
  | "phone"
  | "chat"
  | "eye"
  | "pen"
  | "trash";
```

## CellActions (value)

```ts
({ actions, showKebab, iconColor, onAction, onKebab, }: { actions?: CellActionKey[]; showKebab?: boolean; iconColor?: string; onAction?: (key: CellActionKey) => void; onKebab?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `actions` | 否 | `CellActionKey[] \| undefined` |  |
| `showKebab` | 否 | `boolean \| undefined` |  |
| `iconColor` | 否 | `string \| undefined` |  |
| `onAction` | 否 | `((key: CellActionKey) => void) \| undefined` |  |
| `onKebab` | 否 | `(() => void) \| undefined` |  |

## CellCode (value)

```ts
({ code }: { code: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `code` | 是 | `string` |  |

## CellContentType (type)

```ts
export type CellContentType =
  | "text"
  | "text-subtitle"
  | "image-text"
  | "image-text-subtitle"
  | "user"
  | "user-subtitle"
  | "badge-icon"
  | "badge-icon-subtitle"
  | "avatar-group"
  | "status-badge"
  | "progress-badge"
  | "kebab-menu"
  | "custom";
```

## CellFile (value)

```ts
({ name, size, icon, }: { name: string; size?: string; icon?: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `name` | 是 | `string` |  |
| `size` | 否 | `string \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |

## CellImageText (value)

```ts
({ src, title, subtitle, rounded, }: { src: string; title: string; subtitle?: string; rounded?: "lg" | "full"; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `src` | 是 | `string` |  |
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `rounded` | 否 | `"lg" \| "full" \| undefined` |  |

## CellKebabMenu (value)

```ts
({ onClick, }: { onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `onClick` | 否 | `(() => void) \| undefined` |  |

## CellLink (value)

```ts
({ label, color, onClick, }: { label: string; color?: CellLinkColor; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "black" \| "red" \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |

## CellLinkColor (type)

```ts
export type CellLinkColor = keyof typeof cellLinkColors;
```

## CellMuted (value)

```ts
({ children }: { children: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |

## CellNumber (value)

```ts
({ value, trend, badge, badgeColor, subdued, align, }: { value: string; trend?: "up" | "down"; badge?: string; badgeColor?: ProgressBadgeColor; subdued?: boolean; align?: TableColumnAlign; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `trend` | 否 | `"up" \| "down" \| undefined` |  |
| `badge` | 否 | `string \| undefined` |  |
| `badgeColor` | 否 | `"green" \| "red" \| "grey" \| undefined` |  |
| `subdued` | 否 | `boolean \| undefined` |  |
| `align` | 否 | `TableColumnAlign \| undefined` | 表格数字默认右对齐（`--forge-table-align-number`）。 左对齐必须显式传入 `align="left"`，并在列上填写 `alignOverrideReason`。 |

## CellProgressBar (value)

```ts
({ value, percent, color, }: { value: string; percent: number; color?: ProgressBarColor; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `percent` | 是 | `number` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "gray" \| undefined` |  |

## CellProgressValue (value)

```ts
({ value, badge, badgeColor, align, }: { value: string; badge: string; badgeColor?: ProgressBadgeColor; align?: TableColumnAlign; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `badge` | 是 | `string` |  |
| `badgeColor` | 否 | `"green" \| "red" \| "grey" \| undefined` |  |
| `align` | 否 | `TableColumnAlign \| undefined` | 表格内的数量、金额、百分比默认右对齐。左对齐须显式传入。 |

## CellRating (value)

```ts
({ score, color, }: { score: string | number; color?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `score` | 是 | `string \| number` |  |
| `color` | 否 | `string \| undefined` |  |

## CellStatusDot (value)

```ts
({ label, color, emphasis, }: { label: string; color?: StatusDotColor; emphasis?: "strong" | "subtle"; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "grey" \| undefined` |  |
| `emphasis` | 否 | `"strong" \| "subtle" \| undefined` |  |

## CellText (value)

```ts
({ children }: { children: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |

## CellTextSubtitle (value)

```ts
({ title, subtitle, }: { title: string; subtitle?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |

## ColumnDef (type)

```ts
export type ColumnDef<T> = ColumnDefBase<T> & ColumnDefAlign;
```

## DataTable (value)

```ts
<T>({ title, subtitle, badge, columns, rows, headerActions, color, showCheckbox, checkboxColor, selectedRowKeys, onSelectedRowKeysChange, selectedRows, onSelectRow, onSelectAll, onSort, sortColumnKey, sortDirection, getRowKey, emptyState, footerLeft, footerRight, showPagination, currentPage, totalPages, onPageChange, paginationLabel, tableMinWidth, className, }: DataTableProps<T>) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `badge` | 否 | `ReactNode` |  |
| `columns` | 是 | `ColumnDef<T>[]` |  |
| `rows` | 是 | `T[]` |  |
| `headerActions` | 否 | `ReactNode` |  |
| `color` | 否 | `DataTableColor \| undefined` |  |
| `showCheckbox` | 否 | `boolean \| undefined` |  |
| `checkboxColor` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "black" \| "red" \| undefined` |  |
| `selectedRowKeys` | 否 | `ReadonlySet<Key> \| undefined` | Stable selected row identities. Pair with getRowKey for sort/filter-safe selection. |
| `onSelectedRowKeysChange` | 否 | `((keys: Set<Key>) => void) \| undefined` | Receives a new Set after a stable-key selection change. The input Set is never mutated. |
| `selectedRows` | 否 | `Set<number> \| undefined` |  |
| `onSelectRow` | 否 | `((index: number, checked: boolean) => void) \| undefined` |  |
| `onSelectAll` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `onSort` | 否 | `((columnKey: string) => void) \| undefined` |  |
| `sortColumnKey` | 否 | `string \| undefined` |  |
| `sortDirection` | 否 | `"asc" \| "desc" \| undefined` |  |
| `getRowKey` | 否 | `((row: T, index: number) => Key) \| undefined` |  |
| `emptyState` | 否 | `ReactNode` |  |
| `footerLeft` | 否 | `ReactNode` |  |
| `footerRight` | 否 | `ReactNode` |  |
| `showPagination` | 否 | `boolean \| undefined` |  |
| `currentPage` | 否 | `number \| undefined` |  |
| `totalPages` | 否 | `number \| undefined` |  |
| `onPageChange` | 否 | `((page: number) => void) \| undefined` |  |
| `paginationLabel` | 否 | `string \| undefined` |  |
| `tableMinWidth` | 否 | `Property.MinWidth<string \| number> \| undefined` | Minimum width of the table content. Overflow stays inside the component. |
| `className` | 否 | `string \| undefined` |  |

## DataTableColor (type)

```ts
export type DataTableColor = "purple" | "blue" | "black";
```

## DataTableProps (type)

```ts
export type DataTableProps<T> = {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  columns: ColumnDef<T>[];
  rows: T[];
  headerActions?: ReactNode;
  color?: DataTableColor;
  showCheckbox?: boolean;
  checkboxColor?: CheckboxColor;
  /** Stable selected row identities. Pair with getRowKey for sort/filter-safe selection. */
  selectedRowKeys?: ReadonlySet<Key>;
  /** Receives a new Set after a stable-key selection change. The input Set is never mutated. */
  onSelectedRowKeysChange?: (keys: Set<Key>) => void;
  /** @deprecated Prefer selectedRowKeys for selection that survives sorting and filtering. */
  selectedRows?: Set<number>;
  onSelectRow?: (index: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onSort?: (columnKey: string) => void;
  sortColumnKey?: string;
  sortDirection?: "asc" | "desc";
  getRowKey?: (row: T, index: number) => Key;
  emptyState?: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  paginationLabel?: string;
  /** Minimum width of the table content. Overflow stays inside the component. */
  tableMinWidth?: CSSProperties["minWidth"];
  className?: string;
};
```

## FullWidthTable (value)

```ts
<T>({ title, subtitle, badge, columns, rows, headerActions, color, showCheckbox, checkboxColor, selectedRowKeys, onSelectedRowKeysChange, selectedRows, onSelectRow, onSelectAll, onSort, sortColumnKey, sortDirection, getRowKey, emptyState, footerLeft, footerRight, showPagination, currentPage, totalPages, onPageChange, paginationLabel, tableMinWidth, showRowCount, rowCountOptions, currentRowCount, onRowCountChange, totalRows, className, }: FullWidthTableProps<T>) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `badge` | 否 | `ReactNode` |  |
| `columns` | 是 | `ColumnDef<T>[]` |  |
| `rows` | 是 | `T[]` |  |
| `headerActions` | 否 | `ReactNode` |  |
| `color` | 否 | `DataTableColor \| undefined` |  |
| `showCheckbox` | 否 | `boolean \| undefined` |  |
| `checkboxColor` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "black" \| "red" \| undefined` |  |
| `selectedRowKeys` | 否 | `ReadonlySet<Key> \| undefined` | Stable selected row identities. Pair with getRowKey for sort/filter-safe selection. |
| `onSelectedRowKeysChange` | 否 | `((keys: Set<Key>) => void) \| undefined` | Receives a new Set after a stable-key selection change. The input Set is never mutated. |
| `selectedRows` | 否 | `Set<number> \| undefined` |  |
| `onSelectRow` | 否 | `((index: number, checked: boolean) => void) \| undefined` |  |
| `onSelectAll` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `onSort` | 否 | `((columnKey: string) => void) \| undefined` |  |
| `sortColumnKey` | 否 | `string \| undefined` |  |
| `sortDirection` | 否 | `"asc" \| "desc" \| undefined` |  |
| `getRowKey` | 否 | `((row: T, index: number) => Key) \| undefined` |  |
| `emptyState` | 否 | `ReactNode` |  |
| `footerLeft` | 否 | `ReactNode` |  |
| `footerRight` | 否 | `ReactNode` |  |
| `showPagination` | 否 | `boolean \| undefined` |  |
| `currentPage` | 否 | `number \| undefined` |  |
| `totalPages` | 否 | `number \| undefined` |  |
| `onPageChange` | 否 | `((page: number) => void) \| undefined` |  |
| `paginationLabel` | 否 | `string \| undefined` |  |
| `tableMinWidth` | 否 | `Property.MinWidth<string \| number> \| undefined` | Minimum width of the table content. Overflow stays inside the component. |
| `className` | 否 | `string \| undefined` |  |
| `showRowCount` | 否 | `boolean \| undefined` |  |
| `rowCountOptions` | 否 | `number[] \| undefined` |  |
| `currentRowCount` | 否 | `number \| undefined` |  |
| `onRowCountChange` | 否 | `((count: number) => void) \| undefined` |  |
| `totalRows` | 否 | `number \| undefined` | Exact total record count. Omit it when the data source does not provide one. |

## FullWidthTableProps (type)

```ts
export type FullWidthTableProps<T> = DataTableProps<T> & {
  showRowCount?: boolean;
  rowCountOptions?: number[];
  currentRowCount?: number;
  onRowCountChange?: (count: number) => void;
  /** Exact total record count. Omit it when the data source does not provide one. */
  totalRows?: number;
};
```

## ProgressBadge (value)

```ts
({ label, color, }: { label: string; color?: ProgressBadgeColor; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"green" \| "red" \| "grey" \| undefined` |  |

## ProgressBadgeColor (type)

```ts
export type ProgressBadgeColor = keyof typeof progressBadgeColors;
```

## ProgressBarColor (type)

```ts
export type ProgressBarColor = ProgressColor;
```

## resolveTableColumnAlign (value)

```ts
<T>(column: Pick<ColumnDef<T>, "key" | "valueKind" | "align" | "alignOverrideReason">) => TableColumnAlign
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `key` | 是 | `string` |  |
| `valueKind` | 否 | `"number" \| "identifier" \| undefined` | 省略或 identifier：标识与普通文本，默认左对齐。列头与内容同向。 金额、数量、单价、百分比及同类可比较数值。省略 align 即右对齐。 |
| `align` | 否 | `TableColumnAlign \| undefined` | 数字列离开默认右对齐。必须同时填写非空 `alignOverrideReason`。 漏写原因会在运行时警告，并标上 `data-forge-align-violation`。 |
| `alignOverrideReason` | 否 | `string \| undefined` | 标识列一般不需要。数字列禁止用这个字段代替 `valueKind: "number"`。 |

## StatusBadge (value)

```ts
({ label, color, variant, }: { label: string; color?: StatusBadgeColor; variant?: StatusBadgeVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "red" \| "grey" \| undefined` |  |
| `variant` | 否 | `StatusBadgeVariant \| undefined` |  |

## StatusBadgeColor (type)

```ts
export type StatusBadgeColor = keyof typeof statusBadgeSolidColors;
```

## StatusBadgeVariant (type)

```ts
export type StatusBadgeVariant = "soft" | "solid";
```

## StatusDotColor (type)

```ts
export type StatusDotColor = keyof typeof statusDotColors;
```

## TableCell (value)

```ts
({ variant, children, className, sortable, onSort, checkbox, checked, onCheckedChange, checkboxColor, leadIcon, }: TableCellProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `TableCellVariant \| undefined` |  |
| `children` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `sortable` | 否 | `boolean \| undefined` |  |
| `onSort` | 否 | `(() => void) \| undefined` |  |
| `checkbox` | 否 | `boolean \| undefined` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `onCheckedChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `checkboxColor` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "black" \| "red" \| undefined` |  |
| `leadIcon` | 否 | `ReactNode` |  |

## TableCellProps (type)

```ts
export type TableCellProps = {
  variant?: TableCellVariant;
  children?: ReactNode;
  className?: string;
  sortable?: boolean;
  onSort?: () => void;
  checkbox?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkboxColor?: CheckboxColor;
  leadIcon?: ReactNode;
};
```

## TableCellVariant (type)

```ts
export type TableCellVariant = "header" | "body";
```

## TableColumnAlign (type)

```ts
export type TableColumnAlign = "left" | "right";
```

## TableValueKind (type)

```ts
export type TableValueKind = "number" | "identifier";
```

## 选型

| 场景 | 选 |
|---|---|
| 后台列表（订单 / 客户 / 商品） | `DataTable` 6-8 列 |
| 全宽铺满页 | `FullWidthTable` |
| 行内编辑菜单 | 最后一列放 `CellKebabMenu` |
| 状态列 | `StatusBadge` 或 `CellStatusDot` |
| 进度列 | `CellProgressValue` / `CellProgressBar` |
| 操作列 | `CellActions` / `CellKebabMenu` / `CellLink` |
| 文件列 | `CellFile` |

## 列宽预算与数字对齐

`flex: true` 是身份列标记，不是 CSS 剩余空间分配比例；默认预算为 240px，内容最大宽 280px。未设 width 的首列也按身份列计算。其他列默认 128px，操作列 88px，复选列 56px；例如 1 个身份列 + 4 个普通列 + 操作列 + 复选列的默认表宽下限为 896px。窄容器在表格区域内横滚，不挤压全页。

显式 `width: "w-[180px]"` 不会参与 JS 数值解析；需要精确预算时同时设 `minWidth: 180`（正数 px），它既参与 `getDefaultTableMinWidth`，也设置该列单元格的 CSS min-width。身份列的 minWidth 不应高于 280px 上限。整表 `tableMinWidth` 只覆盖总预算，不替各列分配宽度。

金额、件数、单价、百分比列在 ColumnDef 上设 `valueKind: "number"`，表头和内容一起默认右对齐；不能只在 render 里把 CellNumber 或文本右对齐，否则表头仍是左对齐。订单号、日期、电话是 identifier，默认左对齐。数字列确需左对齐时须同时提供 `align: "left"` 和非空 `alignOverrideReason`，单元格同向。

---

Source: skills/forge-skill/references/components/datepicker.md

# datepicker

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/datepicker.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Datepicker (value)

```ts
({ value, rangeStart, rangeEnd, locale, placeholder, confirmSelection, rangeLabels, inline, minDate, maxDate, state, shape, color, mode, label, onChange, onRangeChange, className, }: { value?: Date; locale?: "zh" | "en"; confirmSelection?: boolean; rangeLabels?: [string, string]; inline?: boolean; minDate?: Date; maxDate?: Date; rangeStart?: Date; rangeEnd?: Date; placeholder?: string; state?: DatepickerState; shape?: DatepickerShape; color?: DatepickerColor; mode?: DatepickerMode; label?: string; onChange?: (date: Date) => void; onRangeChange?: (start: Date, end: Date | null) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `Date \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `confirmSelection` | 否 | `boolean \| undefined` | Keep the range in a draft until the user applies it. |
| `rangeLabels` | 否 | `[string, string] \| undefined` | Optional separate start/end triggers. |
| `inline` | 否 | `boolean \| undefined` |  |
| `minDate` | 否 | `Date \| undefined` |  |
| `maxDate` | 否 | `Date \| undefined` |  |
| `rangeStart` | 否 | `Date \| undefined` |  |
| `rangeEnd` | 否 | `Date \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `state` | 否 | `DatepickerState \| undefined` |  |
| `shape` | 否 | `DatepickerShape \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `mode` | 否 | `DatepickerMode \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((date: Date) => void) \| undefined` |  |
| `onRangeChange` | 否 | `((start: Date, end: Date \| null) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## DatepickerColor (type)

```ts
export type DatepickerColor = FormAccentColor;
```

## DatepickerMode (type)

```ts
export type DatepickerMode = "single" | "range";
```

## DatepickerShape (type)

```ts
export type DatepickerShape = "rounded" | "pill";
```

## DatepickerState (type)

```ts
export type DatepickerState = "idle" | "focus" | "filled" | "disabled" | "error";
```

---

Source: skills/forge-skill/references/components/debit-card.md

# debit-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/debit-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DebitCard (value)

```ts
({ locale, balanceLabel, balance, cardNumber, expiry, theme, variant, width, className, }: { balance?: string; locale?: "zh" | "en"; balanceLabel?: string; cardNumber?: string; expiry?: string; theme?: FinancialTheme; variant?: FinancialVariant; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `balance` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `balanceLabel` | 否 | `string \| undefined` |  |
| `cardNumber` | 否 | `string \| undefined` |  |
| `expiry` | 否 | `string \| undefined` |  |
| `theme` | 否 | `FinancialTheme \| undefined` |  |
| `variant` | 否 | `FinancialVariant \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 物理实体卡展示（支付页 / 钱包卡片列表） → `DebitCard` / `CreditCard`
- 账户余额 + 操作按钮 → `BalanceCard`
- 纯数字指标 → `StatCard`

---

Source: skills/forge-skill/references/components/donut-chart.md

# donut-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/donut-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DonutChart (value)

```ts
({ segments, interactive, activeIndex, onActiveIndexChange, onSegmentToggle, motion, ariaLabel, accent, centerValue, trend, trendDirection, subtitle, size, trackColor, }: DonutChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `DonutSegment[]` |  |
| `interactive` | 否 | `boolean \| undefined` | Individually focusable segments normalized to the included total. |
| `activeIndex` | 否 | `number \| undefined` |  |
| `onActiveIndexChange` | 否 | `((index: number \| undefined) => void) \| undefined` |  |
| `onSegmentToggle` | 否 | `((index: number) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` | Accent color drives segment colors when not explicitly set. Default "blue". |
| `centerValue` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `trackColor` | 否 | `string \| undefined` | Optional track color for unfilled remainder. Defaults to gray (fg-grey-200). |

---

Source: skills/forge-skill/references/components/drawer.md

# drawer

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/drawer.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Drawer (value)

```ts
({ open, onOpenChange, title, children, footer, motion, side, className, locale, closeLabel, transition, revealOrigin }: DrawerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `side` | 否 | `"left" \| "right" \| undefined` |  |
| `transition` | 否 | `"slide" \| "reveal" \| undefined` |  |
| `revealOrigin` | 否 | `{ x: number; y: number; } \| undefined` |  |
| `open` | 是 | `boolean` |  |
| `onOpenChange` | 是 | `(open: boolean) => void` |  |
| `title` | 是 | `string` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `variant` | 否 | `"default" \| "template" \| undefined` |  |
| `width` | 否 | `string \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `closeLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## DrawerProps (type)

```ts
export interface DrawerProps extends ModalProps { side?: "left" | "right"; transition?: "slide" | "reveal"; /** Viewport coordinates of the trigger center. */ revealOrigin?: { x: number; y: number } }
```

---

Source: skills/forge-skill/references/components/dropdown-panel.md

# dropdown-panel

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/dropdown-panel.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DropdownDivider (value)

```ts
() => JSX.Element
```

## DropdownPanel (value)

```ts
({ children, width, padding, className, motion, }: { children: ReactNode; width?: string; padding?: string; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `width` | 否 | `string \| undefined` |  |
| `padding` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## 选型

- 用户菜单 / profile 下拉 / kebab 展开 → `DropdownPanel`
- 列表分组 → 中间插 `DropdownDivider`
- 带触发器的完整下拉 → 配合 `IconTrigger` + 自己管理 open state

---

Source: skills/forge-skill/references/components/event-card.md

# event-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/event-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## EventCard (value)

```ts
({ title, timeRange, color, avatars, overflowCount, width, className, }: { title: string; timeRange?: string; color?: EventCardColor; avatars?: string[]; overflowCount?: number; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `timeRange` | 否 | `string \| undefined` | e.g. "10:00-11:00" |
| `color` | 否 | `EventCardColor \| undefined` |  |
| `avatars` | 否 | `string[] \| undefined` |  |
| `overflowCount` | 否 | `number \| undefined` | Number to show in "+N" overflow chip. If omitted, no chip is shown. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill calendar/list columns. Use fixed only for compact standalone showcases. |
| `className` | 否 | `string \| undefined` |  |

## EventCardColor (type)

```ts
export type EventCardColor = AccentColor | "red" | "yellow" | "green" | "cyan" | "orange";
```

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/event-tag.md

# event-tag

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/event-tag.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## EventTag (value)

```ts
({ label, color, size, variant, avatar, block, className, }: { label: string; color?: EventTagColor; size?: EventTagSize; variant?: EventTagVariant; avatar?: string; block?: boolean; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `variant` | 否 | `EventTagVariant \| undefined` |  |
| `avatar` | 否 | `string \| undefined` | Small circular avatar shown before the label (Figma Month cell style) |
| `block` | 否 | `boolean \| undefined` | Use block-level flex (fills parent width). Default inline-flex. |
| `className` | 否 | `string \| undefined` |  |

## EventTagColor (type)

```ts
export type EventTagColor = keyof typeof solidColors;
```

## EventTagSize (type)

```ts
export type EventTagSize = keyof typeof sizes;
```

## EventTagVariant (type)

```ts
export type EventTagVariant = "solid" | "outline";
```

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/file-input.md

# file-input

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/file-input.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FileInput (value)

```ts
ForwardRefExoticComponent<FileInputProps & RefAttributes<HTMLInputElement>>
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `color` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `formAction` | 否 | `string \| ((formData: FormData) => void \| Promise<void>) \| undefined` |  |
| `formEncType` | 否 | `string \| undefined` |  |
| `formMethod` | 否 | `string \| undefined` |  |
| `formNoValidate` | 否 | `boolean \| undefined` |  |
| `formTarget` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLInputElement, HTMLInputElement> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLInputElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLInputElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLInputElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLInputElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `list` | 否 | `string \| undefined` |  |
| `step` | 否 | `string \| number \| undefined` |  |
| `src` | 否 | `string \| undefined` |  |
| `size` | 否 | `number \| undefined` |  |
| `accept` | 否 | `string \| undefined` |  |
| `alt` | 否 | `string \| undefined` |  |
| `autoComplete` | 否 | `HTMLInputAutoCompleteAttribute \| undefined` |  |
| `capture` | 否 | `boolean \| "user" \| "environment" \| undefined` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `height` | 否 | `string \| number \| undefined` |  |
| `max` | 否 | `string \| number \| undefined` |  |
| `maxLength` | 否 | `number \| undefined` |  |
| `min` | 否 | `string \| number \| undefined` |  |
| `minLength` | 否 | `number \| undefined` |  |
| `multiple` | 否 | `boolean \| undefined` |  |
| `pattern` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `readOnly` | 否 | `boolean \| undefined` |  |
| `required` | 否 | `boolean \| undefined` |  |
| `width` | 否 | `string \| number \| undefined` |  |
| `ref` | 否 | `Ref<HTMLInputElement> \| undefined` | Allows getting a ref to the component instance. Once the component unmounts, React will set `ref.current` to `null` (or call the ref with `null` if you passed a callback ref). |
| `key` | 否 | `Key \| null \| undefined` |  |

## FileInputProps (type)

```ts
export type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue">;
```

---

Source: skills/forge-skill/references/components/file-upload.md

# file-upload

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/file-upload.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FileCard (value)

```ts
({ file, onRemove, onRetry, locale, color, className, }: { file: FileItem; locale?: "zh" | "en"; color?: FileUploadColor; onRemove?: (id: string) => void; onRetry?: (id: string) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `file` | 是 | `FileItem` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `onRetry` | 否 | `((id: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FileItem (type)

```ts
export interface FileItem {
  id: string;
  name: string;
  size: string;
  state?: FileState;
  /** Upload progress supplied by the caller, from 0 to 100. */
  progress?: number;
  uploadedBytes?: number;
  totalBytes?: number;
}
```

## FileState (type)

```ts
export type FileState = "uploaded" | "success" | "uploading" | "error";
```

## FileTypeIcon (value)

```ts
({ fileName, dim, className }: { fileName: string; dim?: boolean; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `fileName` | 是 | `string` |  |
| `dim` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FileUpload (value)

```ts
({ files, label, buttonLabel, locale, color, onUpload, onRemove, onRetry, className, }: { files?: FileItem[]; label?: string; buttonLabel?: string; locale?: "zh" | "en"; color?: FileUploadColor; onUpload?: (files: FileList) => void; onRemove?: (id: string) => void; onRetry?: (id: string) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `files` | 否 | `FileItem[] \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `buttonLabel` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `onUpload` | 否 | `((files: FileList) => void) \| undefined` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `onRetry` | 否 | `((id: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FileUploadColor (type)

```ts
export type FileUploadColor = AccentColor;
```

---

Source: skills/forge-skill/references/components/filter-group.md

# filter-group

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/filter-group.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FilterGroup (value)

```ts
({ title, color, content, defaultOpen, hasSelection, }: { title?: string; color?: FilterGroupColor; content?: FilterGroupContent; defaultOpen?: boolean; hasSelection?: boolean; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `content` | 否 | `FilterGroupContent \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `hasSelection` | 否 | `boolean \| undefined` |  |

## FilterGroupCheckboxOption (type)

```ts
export type FilterGroupCheckboxOption = {
  value: string;
  label: string;
  checked?: boolean;
  colorDot?: string;
};
```

## FilterGroupColor (type)

```ts
export type FilterGroupColor = AccentColor;
```

## FilterGroupContent (type)

```ts
export type FilterGroupContent =
  | { type: "empty" }
  | {
      type: "checkbox";
      options: FilterGroupCheckboxOption[];
      onToggle?: (value: string, checked: boolean) => void;
    }
  | {
      type: "radio";
      options: FilterGroupRadioOption[];
      onSelect?: (value: string) => void;
    }
  | {
      type: "range";
      minLabel?: string;
      maxLabel?: string;
      minPlaceholder?: string;
      maxPlaceholder?: string;
      minValue?: string;
      maxValue?: string;
      onMinChange?: (value: string) => void;
      onMaxChange?: (value: string) => void;
    };
```

## FilterGroupRadioOption (type)

```ts
export type FilterGroupRadioOption = {
  value: string;
  label: string;
  checked?: boolean;
};
```

## 选型

- 侧边筛选器分组（多个 FilterGroup 叠起来）→ 每个一个 `FilterGroup`
- 外层触发按钮 → `FilterTrigger`
- 整个筛选面板 → `FilterPanel`

---

Source: skills/forge-skill/references/components/filter-panel.md

# filter-panel

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/filter-panel.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FilterPanel (value)

```ts
({ title, color, children, onReset, onCancel, onApply, applyLabel, cancelLabel, resetLabel, className, }: { title?: string; color?: AccentColor; children: ReactNode; onReset?: () => void; onCancel?: () => void; onApply?: () => void; applyLabel?: string; cancelLabel?: string; resetLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `onReset` | 否 | `(() => void) \| undefined` |  |
| `onCancel` | 否 | `(() => void) \| undefined` |  |
| `onApply` | 否 | `(() => void) \| undefined` |  |
| `applyLabel` | 否 | `string \| undefined` |  |
| `cancelLabel` | 否 | `string \| undefined` |  |
| `resetLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/filter-trigger.md

# filter-trigger

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/filter-trigger.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FilterTrigger (value)

```ts
({ label, color, count, open: openProp, onClick, panel, }: { label?: string; color?: AccentColor; count?: number; open?: boolean; onClick?: () => void; panel?: FilterTriggerPanel; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `count` | 否 | `number \| undefined` |  |
| `open` | 否 | `boolean \| undefined` | Controlled open state. If set, internal state is ignored. |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in popover). |
| `panel` | 否 | `FilterTriggerPanel` | Optional panel content. `ReactNode` or `(close) => ReactNode` so inner Apply/Cancel can close it. |

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/folder.md

# folder

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/folder.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Folder (value)

```ts
({ label, items, color, size, open, defaultOpen, onOpenChange, onItemClick, disabled, className, mode, variant, layout, paperColor, tabPosition, openOn, frost, tilt, speed, bounce, peek, intro, draggable, zoomOnClick, theme }: FolderProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `items` | 否 | `FolderItem[] \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `mode` | 否 | `"flap" \| "book" \| undefined` |  |
| `variant` | 否 | `"solid" \| "glass" \| "matte" \| undefined` |  |
| `layout` | 否 | `"row" \| "spread" \| "stack" \| undefined` |  |
| `paperColor` | 否 | `string \| undefined` |  |
| `tabPosition` | 否 | `"left" \| "right" \| "center" \| undefined` |  |
| `openOn` | 否 | `"hover" \| "click" \| undefined` |  |
| `frost` | 否 | `number \| undefined` |  |
| `tilt` | 否 | `number \| undefined` |  |
| `speed` | 否 | `number \| undefined` |  |
| `bounce` | 否 | `number \| undefined` |  |
| `peek` | 否 | `boolean \| undefined` |  |
| `intro` | 否 | `boolean \| undefined` |  |
| `draggable` | 否 | `boolean \| undefined` |  |
| `zoomOnClick` | 否 | `boolean \| undefined` |  |
| `theme` | 否 | `"light" \| "dark" \| undefined` |  |
| `size` | 否 | `number \| "lg" \| "md" \| "sm" \| undefined` |  |
| `open` | 否 | `boolean \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `onItemClick` | 否 | `((item: FolderItem, index: number) => void) \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FolderItem (type)

```ts
export type FolderItem = { id?: string; label?: string; title?: string; image?: string; alt?: string; description?: string; content?: ReactNode };
```

## FolderProps (type)

```ts
export type FolderProps = {
  label: string;
  items?: FolderItem[];
  color?: string;
  mode?: "flap" | "book";
  variant?: "solid" | "glass" | "matte";
  layout?: "spread" | "stack" | "row";
  paperColor?: string;
  tabPosition?: "left" | "center" | "right";
  openOn?: "click" | "hover";
  frost?: number;
  tilt?: number;
  speed?: number;
  bounce?: number;
  peek?: boolean;
  intro?: boolean;
  draggable?: boolean;
  zoomOnClick?: boolean;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (item: FolderItem, index: number) => void;
  disabled?: boolean;
  className?: string;
};
```

---

Source: skills/forge-skill/references/components/folder-float.md

# folder-float

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/folder-float.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FolderFloat (value)

```ts
({ label, items, trigger, color, onSelect, className }: FolderFloatProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `items` | 是 | `{ id: string; label: string; }[]` |  |
| `trigger` | 否 | `"hover" \| "click" \| undefined` |  |
| `color` | 否 | `"blue" \| "green" \| "violet" \| undefined` |  |
| `onSelect` | 否 | `((id: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FolderFloatProps (type)

```ts
export type FolderFloatProps = {
  label: string;
  items: { id: string; label: string }[];
  trigger?: "hover" | "click";
  color?: "violet" | "blue" | "green";
  onSelect?: (id: string) => void;
  className?: string;
};
```

---

Source: skills/forge-skill/references/components/full-calendar.md

# full-calendar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/full-calendar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CalendarEvent (type)

```ts
export interface CalendarEvent {
  day: number;
  label: string;
  color: EventTagColor;
  avatar?: string;
  hour?: number;
}
```

## FullCalendar (value)

```ts
({ view, color, year: yearProp, month: monthProp, day: dayProp, events, detailPanel, onCloseDetail, onViewChange, onEdit, onMore, className, }: { view?: CalendarView; color?: AccentColor; year?: number; month?: number; day?: number; events?: CalendarEvent[]; detailPanel?: ReactNode; onCloseDetail?: () => void; onViewChange?: (view: CalendarView) => void; onEdit?: () => void; onMore?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `view` | 否 | `CalendarView \| undefined` | Controlled when onViewChange is set; otherwise the select keeps its own view after the first change. |
| `color` | 否 | `AccentColor \| undefined` |  |
| `year` | 否 | `number \| undefined` | Shown until the user moves the calendar. |
| `month` | 否 | `number \| undefined` |  |
| `day` | 否 | `number \| undefined` |  |
| `events` | 否 | `CalendarEvent[] \| undefined` |  |
| `detailPanel` | 否 | `ReactNode` | Floating detail overlay. Pass ReactNode to show, omit to hide. |
| `onCloseDetail` | 否 | `(() => void) \| undefined` |  |
| `onViewChange` | 否 | `((view: CalendarView) => void) \| undefined` |  |
| `onEdit` | 否 | `(() => void) \| undefined` |  |
| `onMore` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/grid.md

# grid

自动生成；请勿编辑 API 部分。来源：`core/src/components/layouts/grid.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Grid (value)

```ts
({ columns, gap, rowGap, columnGap, alignItems, className, style, ...props }: GridProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `columns` | 否 | `GridResponsive<GridColumns> \| undefined` |  |
| `gap` | 否 | `GridResponsive<GridGap> \| undefined` | Pixel presets, not Tailwind spacing units. |
| `rowGap` | 否 | `GridResponsive<GridGap> \| undefined` |  |
| `columnGap` | 否 | `GridResponsive<GridGap> \| undefined` |  |
| `alignItems` | 否 | `"center" \| "start" \| "end" \| "stretch" \| "baseline" \| undefined` |  |
| `ref` | 否 | `Ref<HTMLDivElement> \| undefined` | Allows getting a ref to the component instance. Once the component unmounts, React will set `ref.current` to `null` (or call the ref with `null` if you passed a callback ref). |
| `key` | 否 | `Key \| null \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLDivElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLDivElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLDivElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLDivElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLDivElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLDivElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |

## GridBreakpoint (type)

```ts
export type GridBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
```

## GridColumns (type)

```ts
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
```

## GridGap (type)

```ts
export type GridGap = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 48;
```

## GridItem (value)

```ts
({ span, start, className, style, ...props }: GridItemProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `span` | 否 | `GridResponsive<GridSpan> \| undefined` |  |
| `start` | 否 | `GridResponsive<"auto" \| GridColumns> \| undefined` | One-based column start. `auto` resets a previous breakpoint's start. |
| `ref` | 否 | `Ref<HTMLDivElement> \| undefined` | Allows getting a ref to the component instance. Once the component unmounts, React will set `ref.current` to `null` (or call the ref with `null` if you passed a callback ref). |
| `key` | 否 | `Key \| null \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLDivElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLDivElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLDivElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLDivElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLDivElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLDivElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |

## GridItemProps (type)

```ts
export interface GridItemProps extends ComponentPropsWithRef<"div"> {
  span?: GridResponsive<GridSpan>;
  /** One-based column start. `auto` resets a previous breakpoint's start. */
  start?: GridResponsive<GridColumns | "auto">;
}
```

## GridProps (type)

```ts
export interface GridProps extends ComponentPropsWithRef<"div"> {
  columns?: GridResponsive<GridColumns>;
  /** Pixel presets, not Tailwind spacing units. */
  gap?: GridResponsive<GridGap>;
  rowGap?: GridResponsive<GridGap>;
  columnGap?: GridResponsive<GridGap>;
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
}
```

## GridResponsive (type)

```ts
export type GridResponsive<T> = T | Partial<Record<GridBreakpoint, T>>;
```

## GridSpan (type)

```ts
export type GridSpan = GridColumns | "full";
```

---

Source: skills/forge-skill/references/components/half-donut-chart.md

# half-donut-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/half-donut-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## HalfDonutChart (value)

```ts
({ segments, accent, centerValue, trend, trendDirection, subtitle, trackColor, }: HalfDonutChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `HalfDonutSegment[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `centerValue` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `trackColor` | 否 | `string \| undefined` | Optional track color for unfilled remainder. Defaults to accent's lightest ramp stop. |

---

Source: skills/forge-skill/references/components/highlight-card.md

# highlight-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/highlight-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## HighlightCard (value)

```ts
({ title, theme, image, annotations, products, density, width, className, }: { title: string; theme?: HighlightCardTheme; image: string; annotations?: Annotation[]; products?: Product[]; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `theme` | 否 | `HighlightCardTheme \| undefined` |  |
| `image` | 是 | `string` |  |
| `annotations` | 否 | `Annotation[] \| undefined` |  |
| `products` | 否 | `Product[] \| undefined` |  |
| `density` | 否 | `CardDensity \| undefined` | Use compact inside dense dashboards while preserving the default showcase scale. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## HighlightCardProps (type)

```ts
export type HighlightCardProps = Parameters<typeof HighlightCard>[0];
```

## 选型

- 运营 / 营销展示 → `HighlightCard`（非数据型）
- 单纯指标 → 用 `StatCard` 家族
- 产品卡列表 → 用 `ProductRow`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

---

Source: skills/forge-skill/references/components/history-grouped.md

# history-grouped

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/history-grouped.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## HistoryGrouped (value)

```ts
({ title, subtitle, badge, items, action, progressHeight, color, className, }: { title: string; subtitle?: string; badge?: ReactNode; items: HistoryItemProps[]; action?: ReactNode; progressHeight?: string; color?: HistoryItemColor; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `badge` | 否 | `ReactNode` |  |
| `items` | 是 | `HistoryItemProps[]` |  |
| `action` | 否 | `ReactNode` |  |
| `progressHeight` | 否 | `string \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "gray" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 订单进度 / 流程追踪 → `HistoryGrouped`
- 单条时间轴（无卡） → 直接 `HistoryItem` 列表
- 活动流 → `ActivityCard`

---

Source: skills/forge-skill/references/components/history-item.md

# history-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/history-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## HistoryItem (value)

```ts
({ variant, color, title, description, datetime, showDatetime, tags, icon, avatar, showConnector, className, }: HistoryItemProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `HistoryItemVariant \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "gray" \| undefined` |  |
| `title` | 是 | `string` |  |
| `description` | 否 | `ReactNode` |  |
| `datetime` | 否 | `string \| undefined` |  |
| `showDatetime` | 否 | `HistoryItemShowDatetime \| undefined` |  |
| `tags` | 否 | `ReactNode` |  |
| `icon` | 否 | `ReactNode` |  |
| `avatar` | 否 | `string \| undefined` |  |
| `showConnector` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## HistoryItemColor (type)

```ts
export type HistoryItemColor = keyof typeof historyItemColors;
```

## HistoryItemProps (type)

```ts
export interface HistoryItemProps {
  variant?: HistoryItemVariant;
  color?: HistoryItemColor;
  title: string;
  description?: ReactNode;
  datetime?: string;
  showDatetime?: HistoryItemShowDatetime;
  tags?: ReactNode;
  icon?: ReactNode;
  avatar?: string;
  showConnector?: boolean;
  className?: string;
}
```

## HistoryItemShowDatetime (type)

```ts
export type HistoryItemShowDatetime = "inline" | "bottom";
```

## HistoryItemVariant (type)

```ts
export type HistoryItemVariant = "regular" | "badge" | "profile";
```

## 选型

- 操作日志时间轴 → `HistoryItem variant="regular"`
- 状态变更（icon 明确） → `variant="badge"`
- 人物动态 → `variant="profile"`
- 分组按日期 → 外层包 `HistoryGrouped`

---

Source: skills/forge-skill/references/components/icon-button.md

# icon-button

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/icon-button.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## IconButton (value)

```ts
({ children, color, variant, size, shape, type, disabled, motion, className, effect, active, loading, result, progress, ...props }: { children: ReactNode; color?: IconButtonColor; variant?: IconButtonVariant; size?: IconButtonSize; shape?: IconButtonShape; motion?: MotionPreference; className?: string; effect?: IconButtonEffect; active?: boolean; loading?: boolean; result?: ActionResult; progress?: number; } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "black" \| "red" \| "dark" \| "grey" \| "blue-dark" \| undefined` |  |
| `variant` | 否 | `IconButtonVariant \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `shape` | 否 | `"circle" \| "square" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `effect` | 否 | `IconButtonEffect \| undefined` |  |
| `active` | 否 | `boolean \| undefined` |  |
| `loading` | 否 | `boolean \| undefined` |  |
| `result` | 否 | `ActionResult \| undefined` |  |
| `progress` | 否 | `number \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `formAction` | 否 | `string \| ((formData: FormData) => void \| Promise<void>) \| undefined` |  |
| `formEncType` | 否 | `string \| undefined` |  |
| `formMethod` | 否 | `string \| undefined` |  |
| `formNoValidate` | 否 | `boolean \| undefined` |  |
| `formTarget` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `type` | 否 | `"submit" \| "reset" \| "button" \| undefined` |  |
| `value` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLButtonElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLButtonElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |

## IconButtonColor (type)

```ts
export type IconButtonColor = keyof typeof iconButtonVariants;
```

## IconButtonEffect (type)

```ts
export type IconButtonEffect = "send" | "morph" | "bookmark" | "burst";
```

## IconButtonShape (type)

```ts
export type IconButtonShape = keyof typeof iconButtonShapes;
```

## IconButtonSize (type)

```ts
export type IconButtonSize = keyof typeof iconButtonSizes;
```

## IconButtonVariant (type)

```ts
export type IconButtonVariant = "primary" | "secondary" | "tertiary" | "ghost";
```

## 选型建议

| 场景 | 选 |
|---|---|
| 表格行内操作（编辑 / 删除 / 更多） | `size="sm"` + `color="grey" variant="tertiary"` |
| 工具栏 icon 操作 | `size="md"` + `color="grey"` / `"blue"` |
| 浮动 FAB（悬浮添加按钮） | `size="lg"` + `color="blue" variant="primary"` |
| 批量选中后的操作 | `color="red"` / `"green"` + `variant="secondary"` |

---

Source: skills/forge-skill/references/components/icon-selector.md

# icon-selector

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/icon-selector.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ColorPicker (value)

```ts
({ colors, selectedIndex, onChange, className, }: { colors?: string[]; selectedIndex?: number; onChange?: (index: number) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `colors` | 否 | `string[] \| undefined` |  |
| `selectedIndex` | 否 | `number \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## IconPicker (value)

```ts
({ icons, labels, selectedIndex, onChange, color, className, }: { icons: ReactNode[]; labels?: string[]; selectedIndex?: number; onChange?: (index: number) => void; color?: IconSelectorColor; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icons` | 是 | `ReactNode[]` |  |
| `labels` | 否 | `string[] \| undefined` |  |
| `selectedIndex` | 否 | `number \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## IconSelector (value)

```ts
({ icons, selectedIndex, onChange, labels, label, color, searchPlaceholder, className, }: { icons: ReactNode[]; selectedIndex?: number; onChange?: (index: number) => void; labels?: string[]; label?: string; color?: IconSelectorColor; searchPlaceholder?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icons` | 是 | `ReactNode[]` |  |
| `selectedIndex` | 否 | `number \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `labels` | 否 | `string[] \| undefined` | Searchable accessible names aligned with `icons`. Without labels, search leaves all icons visible. |
| `label` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `searchPlaceholder` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## IconSelectorColor (type)

```ts
export type IconSelectorColor = FormAccentColor;
```

---

Source: skills/forge-skill/references/components/icon-trigger.md

# icon-trigger

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/icon-trigger.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## IconTrigger (value)

```ts
({ icon, accent, state: stateProp, surface, badge, tooltip, tooltipPosition, onClick, ariaLabel, className, motion, panel, panelPlacement, initialFocus, panelAlign, }: { icon: ReactNode; accent?: IconTriggerAccent; state?: IconTriggerState; surface?: IconTriggerSurface; badge?: number; tooltip?: string; tooltipPosition?: TooltipPosition; onClick?: () => void; ariaLabel?: string; className?: string; motion?: MotionPreference; panel?: IconTriggerPanel; panelPlacement?: IconTriggerPanelPlacement; initialFocus?: "first" | "selected" | false; panelAlign?: "center" | "start" | "end"; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 是 | `ReactNode` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `state` | 否 | `IconTriggerState \| undefined` |  |
| `surface` | 否 | `IconTriggerSurface \| undefined` |  |
| `badge` | 否 | `number \| undefined` |  |
| `tooltip` | 否 | `string \| undefined` |  |
| `tooltipPosition` | 否 | `TooltipPosition \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in popover). |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `panel` | 否 | `IconTriggerPanel` | Optional panel. `ReactNode` or `(close) => ReactNode` so inner elements can close it. |
| `panelPlacement` | 否 | `IconTriggerPanelPlacement \| undefined` |  |
| `initialFocus` | 否 | `false \| "first" \| "selected" \| undefined` |  |
| `panelAlign` | 否 | `"center" \| "start" \| "end" \| undefined` |  |

## IconTriggerAccent (type)

```ts
export type IconTriggerAccent = AccentColor;
```

## IconTriggerState (type)

```ts
export type IconTriggerState = "idle" | "hover" | "open";
```

## IconTriggerSurface (type)

```ts
export type IconTriggerSurface = "default" | "onColoredBg";
```

## 选型

- topbar 功能 icon → `IconTrigger` + `tooltip` + `badge`
- 带下拉的 icon 触发器 → `panel` prop
- 纯操作按钮（无 popover） → `IconButton`

---

Source: skills/forge-skill/references/components/image-grid.md

# image-grid

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/image-grid.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ImageGrid (value)

```ts
({ images, size, overflowCount, overflowClassName, className, }: { images: string[]; size?: ImageGridSize; overflowCount?: number; overflowClassName?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `images` | 是 | `string[]` |  |
| `size` | 否 | `ImageGridSize \| undefined` |  |
| `overflowCount` | 否 | `number \| undefined` |  |
| `overflowClassName` | 否 | `string \| undefined` | Customize the +N overflow chip background & text color. Default: Forge blue. |
| `className` | 否 | `string \| undefined` |  |

## ImageGridSize (type)

```ts
export type ImageGridSize = "sm" | "md" | "lg";
```

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/image-stat-card.md

# image-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/image-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ImageStatCard (value)

```ts
({ title, subtitle, value, trend, trendDirection, trendSubtitle, theme, size, action, onKebabClick, avatars, backgroundImage, backgroundImageAlt, density, width, className, }: { title: string; subtitle?: string; value: string; trend?: string; trendDirection?: TrendDirection; trendSubtitle?: string; theme?: ImageStatCardTheme; size?: ImageStatCardSize; action?: ReactNode; onKebabClick?: () => void; avatars?: string[]; backgroundImage?: string; backgroundImageAlt?: string; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` | Secondary text below the title (e.g. date range "2 Jul - Today") |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `trendSubtitle` | 否 | `string \| undefined` | Secondary text next to trend (e.g. "+$150 today") |
| `theme` | 否 | `ImageStatCardTheme \| undefined` |  |
| `size` | 否 | `ImageStatCardSize \| undefined` |  |
| `action` | 否 | `ReactNode` | Custom action slot (e.g. external-link button). Takes priority over onKebabClick. |
| `onKebabClick` | 否 | `(() => void) \| undefined` |  |
| `avatars` | 否 | `string[] \| undefined` | Bottom-right overlapping avatar group. Hidden when `backgroundImage` is set. |
| `backgroundImage` | 否 | `string \| undefined` | Subject photo source (e.g. team-of-the-month portrait). Pinned to the card's bottom-right; text content stays in the left half above it. |
| `backgroundImageAlt` | 否 | `string \| undefined` |  |
| `density` | 否 | `CardDensity \| undefined` | Use compact inside dense dashboards while preserving the default Figma showcase scale. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## ImageStatCardProps (type)

```ts
export type ImageStatCardProps = Parameters<typeof ImageStatCard>[0];
```

## 选型

- 项目 / 团队摘要卡（需要展示责任人头像） → `ImageStatCard`
- 日期范围的汇总指标 → 用 `subtitle` 标注期间
- 纯数字指标不需要头像 → `StatCard lg`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

---

Source: skills/forge-skill/references/components/info-row.md

# info-row

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/info-row.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## InfoRow (value)

```ts
({ icon, label, children, }: InfoRowProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 是 | `ReactNode` |  |
| `label` | 是 | `string` |  |
| `children` | 是 | `ReactNode` |  |

## InfoRowProps (type)

```ts
export interface InfoRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}
```

---

Source: skills/forge-skill/references/components/insight-cards.md

# insight-cards

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/insight-cards.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## InsightCard (type)

```ts
export type InsightCard = {
  id: string;
  title: string;
  body: string;
  prompt?: string;
  chart?: InsightChart;
};
```

## InsightCards (value)

```ts
({ cards, locale, index: controlledIndex, onIndexChange, onAsk, previousInsightLabel, nextInsightLabel, className, }: { cards: InsightCard[]; locale?: "zh" | "en"; index?: number; onIndexChange?: (index: number) => void; onAsk?: (prompt: string, card: InsightCard) => void; previousInsightLabel?: string; nextInsightLabel?: string; className?: string; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `cards` | 是 | `InsightCard[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `index` | 否 | `number \| undefined` |  |
| `onIndexChange` | 否 | `((index: number) => void) \| undefined` |  |
| `onAsk` | 否 | `((prompt: string, card: InsightCard) => void) \| undefined` |  |
| `previousInsightLabel` | 否 | `string \| undefined` |  |
| `nextInsightLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## InsightChart (type)

```ts
export type InsightChart =
  | { kind: "spark"; series: InsightSeries[] }
  | { kind: "bars"; values: number[] }
  | { kind: "segments"; items: { label: string; pct: number; tone?: InsightTone }[] };
```

## InsightSeries (type)

```ts
export type InsightSeries = {
  name: string;
  values: number[];
  tone?: InsightTone;
};
```

## InsightTone (type)

```ts
export type InsightTone = "violet" | "green" | "yellow" | "blue";
```

---

Source: skills/forge-skill/references/components/kebab-menu.md

# kebab-menu

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/kebab-menu.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## KebabMenu (value)

```ts
({ items, accent, surface, align, className, motion, }: { items: KebabMenuItem[]; accent?: KebabMenuAccent; surface?: IconTriggerSurface; align?: "left" | "right"; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `KebabMenuItem[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `surface` | 否 | `IconTriggerSurface \| undefined` |  |
| `align` | 否 | `"left" \| "right" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## KebabMenuAccent (type)

```ts
export type KebabMenuAccent = AccentColor;
```

## KebabMenuItem (type)

```ts
export type KebabMenuItem = {
  icon?: ReactNode;
  label: string;
  onSelect?: () => void;
  danger?: boolean;
};
```

## 选型

- 表格行尾、卡片右上角的"更多"菜单 → `KebabMenu`
- 自定义触发器 + 自定义面板 → `IconTrigger` + `DropdownPanel` 组合
- 纯 icon 按钮（无菜单） → `IconButton`

---

Source: skills/forge-skill/references/components/line-chart-stat-card.md

# line-chart-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/line-chart-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## LineChartColor (type)

```ts
export type LineChartColor =
  | "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";
```

## LineChartStatCard (value)

```ts
({ title, value, animateValue, locale, numberFormat, motion, trend, trendDirection, subtitle, theme, size, chartColor, chartDirection, series, icon, density, width, className, }: { title: string; value: ReactNode; animateValue?: boolean; locale?: string; numberFormat?: Intl.NumberFormatOptions; motion?: MotionPreference; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: LineChartStatCardTheme; size?: StatCardSize; chartColor?: LineChartColor; chartDirection?: "up" | "down"; series?: number[]; icon?: ReactNode; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `ReactNode` |  |
| `animateValue` | 否 | `boolean \| undefined` | Roll numeric values when they change. Strings and custom content stay unchanged. |
| `locale` | 否 | `string \| undefined` | Locale for numeric values when animation or numberFormat is enabled. |
| `numberFormat` | 否 | `Intl.NumberFormatOptions \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `LineChartStatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `chartColor` | 否 | `LineChartColor \| undefined` |  |
| `chartDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `series` | 否 | `number[] \| undefined` | Optional data points for the wide-mode line chart. Ignored when size !== "wide". |
| `icon` | 否 | `ReactNode` | Icon for the top-right chip (only rendered in size="wide"). |
| `density` | 否 | `CardDensity \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## LineChartStatCardProps (type)

```ts
export type LineChartStatCardProps = Parameters<typeof LineChartStatCard>[0];
```

## 选型

- 有时间序列 / 持续波动的指标（DAU / 流量 / 销售额） → `LineChartStatCard`
- 单值指标 → `StatCard`
- 带百分比进度 → `ProgressStatCard`
- 多数据对比 → `BarChartStatCard`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

---

Source: skills/forge-skill/references/components/link.md

# link

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/link.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## LinkColor (type)

```ts
export type LinkColor = keyof typeof linkColors;
```

## StyledLink (value)

```ts
({ children, href, color, disabled, iconLeft, iconRight, className, effect, motion, }: { children: ReactNode; href: string; color?: LinkColor; disabled?: boolean; iconLeft?: ReactNode; iconRight?: ReactNode; className?: string; effect?: "magnetic" | "roll"; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `href` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "red" \| "gray" \| "dark" \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `iconLeft` | 否 | `ReactNode` |  |
| `iconRight` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `effect` | 否 | `"magnetic" \| "roll" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## 选型

- 正文内的跳转链接 → `StyledLink`
- 整块可点卡片 / 按钮 → `Button` 或 `IconButton`
- 纯 URL 跳转（无需样式） → 直接用 `<Link>`

---

Source: skills/forge-skill/references/components/liquid-tabs.md

# liquid-tabs

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/liquid-tabs.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## LiquidTabs (value)

```ts
({ tabs, value, defaultValue, onValueChange, onSelect, visibleCount, rows, corner, label, moreLabel, emptyLabel, disabled, motion: motionPreference, className }: LiquidTabsProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tabs` | 是 | `LiquidTabsTab[]` |  |
| `value` | 否 | `string \| undefined` |  |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onValueChange` | 否 | `((id: string) => void) \| undefined` |  |
| `onSelect` | 否 | `((item: LiquidTabsItem, tabId: string) => void) \| undefined` |  |
| `visibleCount` | 否 | `number \| undefined` |  |
| `rows` | 否 | `number \| undefined` |  |
| `corner` | 否 | `number \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `moreLabel` | 否 | `string \| undefined` |  |
| `emptyLabel` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## LiquidTabsItem (type)

```ts
export type LiquidTabsItem = { id: string; title: string; subtitle?: string; time?: string; icon?: ReactNode; disabled?: boolean };
```

## LiquidTabsProps (type)

```ts
export type LiquidTabsProps = {
  tabs: LiquidTabsTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  onSelect?: (item: LiquidTabsItem, tabId: string) => void;
  visibleCount?: number;
  rows?: number;
  corner?: number;
  label?: string;
  moreLabel?: string;
  emptyLabel?: string;
  disabled?: boolean;
  motion?: MotionPreference;
  className?: string;
};
```

## LiquidTabsTab (type)

```ts
export type LiquidTabsTab = { id: string; label: string; items: LiquidTabsItem[]; disabled?: boolean };
```

---

Source: skills/forge-skill/references/components/list-group.md

# list-group

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/list-group.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ListGroup (value)

```ts
({ title, subtitle, color, badge, items, action, tabs, activeTab, onTabChange, closable, onClose, density, className, }: { title: string; subtitle?: string; color?: AccentColor; badge?: ReactNode; items: ReactNode; action?: ReactNode; tabs?: ListGroupTab[]; activeTab?: string; onTabChange?: (value: string) => void; closable?: boolean; onClose?: () => void; density?: CardDensity; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `badge` | 否 | `ReactNode` |  |
| `items` | 是 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `tabs` | 否 | `ListGroupTab[] \| undefined` |  |
| `activeTab` | 否 | `string \| undefined` |  |
| `onTabChange` | 否 | `((value: string) => void) \| undefined` |  |
| `closable` | 否 | `boolean \| undefined` |  |
| `onClose` | 否 | `(() => void) \| undefined` |  |
| `density` | 否 | `CardDensity \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ListGroupProps (type)

```ts
export type ListGroupProps = Parameters<typeof ListGroup>[0];
```

## ListGroupTab (type)

```ts
export type ListGroupTab = { value: string; label: string };
```

## 选型

- 聚合卡片展示列表数据 → `ListGroup`
- 纯列表无卡外框 → 直接用一串 `ListItem`
- 带 tab 切换数据源 → `tabs` + `activeTab`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

---

Source: skills/forge-skill/references/components/list-item.md

# list-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/list-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DescriptionItem (value)

```ts
({ lead, label, content, actions, className, }: { lead?: DescriptionItemLead; label: string; content: ReactNode; actions?: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `lead` | 否 | `DescriptionItemLead \| undefined` |  |
| `label` | 是 | `string` |  |
| `content` | 是 | `ReactNode` |  |
| `actions` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## DescriptionItemLead (type)

```ts
export type DescriptionItemLead = ListItemIconLead | ListItemImageLead;
```

## ListItem (value)

```ts
({ lead, title, subtitle, value, trend, trendDirection, tailSubtext, trailing, className, onSwipeAction, swipeActionLabel, motion, }: { lead?: ListItemLead; title: string; subtitle?: string; value?: string; trend?: string; trendDirection?: "up" | "down"; tailSubtext?: string; trailing?: ReactNode; className?: string; onSwipeAction?: () => void; swipeActionLabel?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `lead` | 否 | `ListItemLead \| undefined` |  |
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `tailSubtext` | 否 | `string \| undefined` |  |
| `trailing` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `onSwipeAction` | 否 | `(() => void) \| undefined` |  |
| `swipeActionLabel` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ListItemAvatarLead (type)

```ts
export type ListItemAvatarLead = {
  kind: "avatar";
  src?: string;
  initials?: string;
  alt?: string;
  online?: boolean;
  size?: AvatarSize;
};
```

## ListItemIconLead (type)

```ts
export type ListItemIconLead = {
  kind: "icon";
  icon: ReactNode;
  color?: CircleIconColor;
  variant?: CircleIconVariant;
  size?: CircleIconSize;
};
```

## ListItemImageLead (type)

```ts
export type ListItemImageLead = {
  kind: "image";
  src: string;
  alt?: string;
};
```

## ListItemLead (type)

```ts
export type ListItemLead =
  | ListItemIconLead
  | ListItemAvatarLead
  | ListItemImageLead;
```

## 选型

- 收入 / 账单 / 交易行 → `ListItem` lead=icon
- 用户行 → `ListItem` lead=avatar
- 商品行（方图） → `ListItem` lead=image 或 `ProductRow`
- 详情页字段 → `DescriptionItem`

---

Source: skills/forge-skill/references/components/map-card.md

# map-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/map-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MapCard (value)

```ts
({ title, subtitle, color, variant, regions, highlights, onMenuClick, width, className, }: { title?: string; subtitle?: string; color?: AccentColor; variant?: MapVariant; regions?: MapRegion[]; highlights?: MapContinent[]; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `variant` | 否 | `MapVariant \| undefined` |  |
| `regions` | 否 | `MapRegion[] \| undefined` |  |
| `highlights` | 否 | `MapContinent[] \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## MapContinent (type)

```ts
export type MapContinent =
  | "north-america"
  | "south-america"
  | "europe"
  | "africa"
  | "asia"
  | "oceania";
```

## MapRegion (type)

```ts
export interface MapRegion {
  name: string;
  /** Square flag image URL (44×44) */
  flag: string;
  /** e.g. "340 Sales" */
  salesLabel: string;
  /** e.g. "$17,678" */
  value: string;
}
```

## MapVariant (type)

```ts
export type MapVariant = "sm" | "md" | "lg";
```

## 选型

- 全球业务 dashboard → `MapCard variant="md"` + 区域 top 5
- 全屏地图背景 → `variant="lg"`
- 只看主要数据不要地图 → 直接用 `DataTable` + 国旗列

---

Source: skills/forge-skill/references/components/media-upload.md

# media-upload

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/media-upload.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MediaItem (type)

```ts
export interface MediaItem {
  id: string;
  src: string;
  state?: "success" | "uploading" | "error";
  progress?: number;
}
```

## MediaUpload (value)

```ts
({ items, label, buttonLabel, message, color, onUpload, onRemove, className, }: { items?: MediaItem[]; label?: string; buttonLabel?: string; message?: string; color?: MediaUploadColor; onUpload?: (files: FileList) => void; onRemove?: (id: string) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 否 | `MediaItem[] \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `buttonLabel` | 否 | `string \| undefined` |  |
| `message` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `onUpload` | 否 | `((files: FileList) => void) \| undefined` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## MediaUploadColor (type)

```ts
export type MediaUploadColor = FormAccentColor;
```

## ProfileImgUpload (value)

```ts
({ src, label, linkLabel, color, onUpload, className, }: { src?: string; label?: string; linkLabel?: string; color?: MediaUploadColor; onUpload?: (files: FileList) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `src` | 否 | `string \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `linkLabel` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `onUpload` | 否 | `((files: FileList) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/menu-item.md

# menu-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/menu-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MenuItem (value)

```ts
({ accent, surface, intent, kind, state, active, lead, label, badge, href, ariaLabel, expanded, className, motion, onClick, }: { accent?: MenuItemAccent; surface?: MenuItemSurface; intent?: MenuItemIntent; kind?: MenuItemKind; state?: MenuItemState; active?: boolean; lead?: MenuItemLead; label?: string; badge?: number; href?: string; ariaLabel?: string; expanded?: boolean; className?: string; motion?: MotionPreference; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `accent` | 否 | `AccentColor \| undefined` |  |
| `surface` | 否 | `MenuItemSurface \| undefined` |  |
| `intent` | 否 | `MenuItemIntent \| undefined` |  |
| `kind` | 否 | `MenuItemKind \| undefined` |  |
| `state` | 否 | `MenuItemState \| undefined` |  |
| `active` | 否 | `boolean \| undefined` | shortcut for state='active' |
| `lead` | 否 | `MenuItemLead \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `badge` | 否 | `number \| undefined` |  |
| `href` | 否 | `string \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `expanded` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |

## MenuItemAccent (type)

```ts
export type MenuItemAccent = AccentColor;
```

## MenuItemIntent (type)

```ts
export type MenuItemIntent = "default" | "danger";
```

## MenuItemKind (type)

```ts
export type MenuItemKind = "single" | "submenu" | "dropdown";
```

## MenuItemLead (type)

```ts
export type MenuItemLead =
  | { kind: "icon"; icon: ReactNode }
  | { kind: "image"; src: string; alt?: string };
```

## MenuItemState (type)

```ts
export type MenuItemState = "idle" | "hover" | "active" | "disabled";
```

## MenuItemSurface (type)

```ts
export type MenuItemSurface = "default" | "onColoredBg";
```

## 选型

- sidebar 菜单项 → `MenuItem kind="dropdown|submenu"` + `lead="icon"`
- dropdown 列表项 → `MenuItem kind="single"`
- 危险菜单项 → `intent="danger"`（红色文字）
- 业务自定义菜单 → 直接用 `MenuItem`，自行组合

---

Source: skills/forge-skill/references/components/meter-chart.md

# meter-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/meter-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MeterChart (value)

```ts
({ segments, accent, trend, trendDirection, subtitle, height, }: MeterChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `MeterSegment[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `height` | 否 | `string \| undefined` | Meter bar height class. Default h-24 (96px) per figma. |

---

Source: skills/forge-skill/references/components/modal.md

# modal

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/modal.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Modal (value)

```ts
({ open, onOpenChange, title, ariaLabel, variant, width, children, footer, motion, locale, closeLabel, className }: ModalProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `open` | 是 | `boolean` |  |
| `onOpenChange` | 是 | `(open: boolean) => void` |  |
| `title` | 是 | `string` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `variant` | 否 | `"default" \| "template" \| undefined` |  |
| `width` | 否 | `string \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `closeLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ModalProps (type)

```ts
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  ariaLabel?: string;
  variant?: "default" | "template";
  width?: string;
  children: ReactNode;
  footer?: ReactNode;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  closeLabel?: string;
  className?: string;
}
```

---

Source: skills/forge-skill/references/components/motion.md

# motion

自动生成；请勿编辑 API 部分。来源：`core/src/lib/motion.ts`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MotionPreference (type)

```ts
export type MotionPreference = "auto" | "none";
```

---

Source: skills/forge-skill/references/components/multilayer-donut-chart.md

# multilayer-donut-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/multilayer-donut-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MultilayerDonutChart (value)

```ts
({ layers, sweep, motion, activeIndex, ariaLabel, accent, centerValue, trend, trendDirection, subtitle, }: MultilayerDonutChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `layers` | 是 | `DonutLayer[]` |  |
| `sweep` | 否 | `270 \| 360 \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `centerValue` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/notification-item.md

# notification-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/notification-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## NotificationItem (value)

```ts
({ tag, time, title, body, unread, color, onMarkRead, actionLabel, className, leadIcon, }: { tag?: string; time?: string; title: string; body?: string; unread?: boolean; color?: NotificationItemColor; onMarkRead?: () => void; actionLabel?: string; className?: string; leadIcon?: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tag` | 否 | `string \| undefined` |  |
| `time` | 否 | `string \| undefined` |  |
| `title` | 是 | `string` |  |
| `body` | 否 | `string \| undefined` |  |
| `unread` | 否 | `boolean \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `onMarkRead` | 否 | `(() => void) \| undefined` |  |
| `actionLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `leadIcon` | 否 | `ReactNode` |  |

## NotificationItemColor (type)

```ts
export type NotificationItemColor = AccentColor;
```

## 选型

- 通知中心 panel 条目 → `NotificationItem`
- 实时 toast 提示 → 用第三方库（如 `sonner` / `react-hot-toast`）
- 业务活动记录 → `ActivityCard`

---

Source: skills/forge-skill/references/components/otp-input.md

# otp-input

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/otp-input.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## OtpInput (value)

```ts
({ length, locale, value: controlled, defaultValue, onChange, onComplete, verify, onSuccess, disabled, autoFocus, name, inputLabel, hint, verifyingLabel, clearOnError, successLabel, errorLabel, motion: motionPreference, className }: OtpInputProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `length` | 否 | `number \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `value` | 否 | `string \| undefined` |  |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onComplete` | 否 | `((value: string) => void) \| undefined` |  |
| `verify` | 否 | `((value: string) => boolean \| Promise<boolean>) \| undefined` | Check on the server. No built-in passcode or simulated verification. |
| `onSuccess` | 否 | `((value: string) => void) \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `inputLabel` | 否 | `string \| undefined` |  |
| `hint` | 否 | `ReactNode` |  |
| `verifyingLabel` | 否 | `string \| undefined` |  |
| `successLabel` | 否 | `string \| undefined` |  |
| `errorLabel` | 否 | `string \| undefined` |  |
| `clearOnError` | 否 | `boolean \| undefined` | Clear a rejected code after its error animation. Set false to keep it for editing. |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## OtpInputProps (type)

```ts
export type OtpInputProps = {
  length?: number;
  locale?: "zh" | "en";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Check on the server. No built-in passcode or simulated verification. */
  verify?: (value: string) => boolean | Promise<boolean>;
  onSuccess?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  inputLabel?: string;
  hint?: ReactNode;
  verifyingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  /** Clear a rejected code after its error animation. Set false to keep it for editing. */
  clearOnError?: boolean;
  motion?: MotionPreference;
  className?: string;
};
```

---

Source: skills/forge-skill/references/components/page-dot.md

# page-dot

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/page-dot.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PageDot (value)

```ts
({ children, color, active, onClick, className, }: { children: ReactNode; color?: PageDotColor; active?: boolean; onClick?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `active` | 否 | `boolean \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## PageDotColor (type)

```ts
export type PageDotColor = keyof typeof activeColors;
```

## 选型

- 业务里用 `<Pagination>`，别自己拼 PageDot
- 自定义轮播指示器、数字导航时才直接用 PageDot

---

Source: skills/forge-skill/references/components/page-header.md

# page-header

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/page-header.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PageHeader (value)

```ts
(props: PageHeaderProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `PageHeaderVariant \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `askAi` | 否 | `AskAiProps \| undefined` | Optional AI conversation drawer; the application supplies the response handler. |
| `leftMode` | 否 | `"search" \| "hamburger" \| undefined` | "search" renders search input (default), "hamburger" renders compact menu button. |
| `onHamburgerClick` | 否 | `(() => void) \| undefined` |  |
| `showMobileMenuButton` | 否 | `boolean \| undefined` | Show a mobile-only menu button before the search/title content. |
| `hamburgerAriaLabel` | 否 | `string \| undefined` |  |
| `hamburgerExpanded` | 否 | `boolean \| undefined` |  |
| `hamburgerControls` | 否 | `string \| undefined` |  |
| `searchPlaceholder` | 否 | `string \| undefined` |  |
| `onSearch` | 否 | `((value: string) => void) \| undefined` |  |
| `showCalendar` | 否 | `boolean \| undefined` |  |
| `onCalendarClick` | 否 | `(() => void) \| undefined` |  |
| `calendarExpanded` | 否 | `boolean \| undefined` |  |
| `calendarButtonClassName` | 否 | `string \| undefined` |  |
| `notifications` | 否 | `number \| undefined` |  |
| `onNotificationsClick` | 否 | `(() => void) \| undefined` |  |
| `notificationsExpanded` | 否 | `boolean \| undefined` |  |
| `notificationsButtonClassName` | 否 | `string \| undefined` |  |
| `messages` | 否 | `number \| undefined` |  |
| `onMessagesClick` | 否 | `(() => void) \| undefined` |  |
| `messagesExpanded` | 否 | `boolean \| undefined` |  |
| `messagesButtonClassName` | 否 | `string \| undefined` |  |
| `onLanguageClick` | 否 | `(() => void) \| undefined` |  |
| `languageExpanded` | 否 | `boolean \| undefined` |  |
| `languageButtonClassName` | 否 | `string \| undefined` |  |
| `languageFlag` | 否 | `ReactNode` |  |
| `showAddButton` | 否 | `boolean \| undefined` |  |
| `onAddClick` | 否 | `(() => void) \| undefined` |  |
| `showProfile` | 否 | `boolean \| undefined` |  |
| `profile` | 否 | `PageHeaderProfile \| undefined` |  |
| `onProfileClick` | 否 | `(() => void) \| undefined` |  |
| `profileExpanded` | 否 | `boolean \| undefined` |  |
| `profileButtonClassName` | 否 | `string \| undefined` |  |
| `profileNameClassName` | 否 | `string \| undefined` |  |
| `profileRoleClassName` | 否 | `string \| undefined` |  |
| `profileChevronClassName` | 否 | `string \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `showBackButton` | 否 | `boolean \| undefined` |  |
| `onBack` | 否 | `(() => void) \| undefined` |  |
| `titleAvatar` | 否 | `string \| undefined` |  |
| `showDatePicker` | 否 | `boolean \| undefined` |  |
| `datePickerLabel` | 否 | `string \| undefined` |  |
| `onDatePickerClick` | 否 | `(() => void) \| undefined` |  |
| `showFilters` | 否 | `boolean \| undefined` |  |
| `filtersLabel` | 否 | `string \| undefined` |  |
| `onFiltersClick` | 否 | `(() => void) \| undefined` |  |
| `showKebab` | 否 | `boolean \| undefined` |  |
| `onKebabClick` | 否 | `(() => void) \| undefined` |  |
| `showFavorite` | 否 | `boolean \| undefined` |  |
| `onFavoriteClick` | 否 | `(() => void) \| undefined` |  |
| `secondaryAction` | 否 | `PageHeaderAction \| undefined` |  |
| `primaryAction` | 否 | `PageHeaderAction \| undefined` |  |
| `actions` | 否 | `ReactNode` |  |
| `children` | 否 | `ReactNode` |  |

## PageHeaderAction (type)

```ts
export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
}
```

## PageHeaderColor (type)

```ts
export type PageHeaderColor = AccentColor;
```

## PageHeaderProfile (type)

```ts
export interface PageHeaderProfile {
  name: string;
  role: string;
  avatar: string;
}
```

## PageHeaderProps (type)

```ts
export interface PageHeaderProps {
  variant?: PageHeaderVariant;
  color?: PageHeaderColor;
  className?: string;

  /** Optional AI conversation drawer; the application supplies the response handler. */
  askAi?: AskAiProps;

  // --- Search variant props ---
  /** "search" renders search input (default), "hamburger" renders compact menu button. */
  leftMode?: "search" | "hamburger";
  onHamburgerClick?: () => void;
  /** Show a mobile-only menu button before the search/title content. */
  showMobileMenuButton?: boolean;
  hamburgerAriaLabel?: string;
  hamburgerExpanded?: boolean;
  hamburgerControls?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showCalendar?: boolean;
  onCalendarClick?: () => void;
  calendarExpanded?: boolean;
  calendarButtonClassName?: string;
  notifications?: number;
  onNotificationsClick?: () => void;
  notificationsExpanded?: boolean;
  notificationsButtonClassName?: string;
  messages?: number;
  onMessagesClick?: () => void;
  messagesExpanded?: boolean;
  messagesButtonClassName?: string;
  onLanguageClick?: () => void;
  languageExpanded?: boolean;
  languageButtonClassName?: string;
  languageFlag?: ReactNode;
  showAddButton?: boolean;
  onAddClick?: () => void;
  showProfile?: boolean;
  profile?: PageHeaderProfile;
  onProfileClick?: () => void;
  profileExpanded?: boolean;
  profileButtonClassName?: string;
  profileNameClassName?: string;
  profileRoleClassName?: string;
  profileChevronClassName?: string;

  // --- Title variant props ---
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  titleAvatar?: string;
  showDatePicker?: boolean;
  datePickerLabel?: string;
  onDatePickerClick?: () => void;
  showFilters?: boolean;
  filtersLabel?: string;
  onFiltersClick?: () => void;
  showKebab?: boolean;
  onKebabClick?: () => void;
  showFavorite?: boolean;
  onFavoriteClick?: () => void;
  secondaryAction?: PageHeaderAction;
  primaryAction?: PageHeaderAction;
  actions?: ReactNode;
  children?: ReactNode;
}
```

## PageHeaderVariant (type)

```ts
export type PageHeaderVariant = "search" | "title";
```

## 选型

| 场景 | variant |
|---|---|
| 首页 / 列表页（需要搜索 + 通知区） | `search` |
| 详情页（有返回 + 单一主 action） | `title` |
| 业务页统一布局 | 用 `AppLayout`，不直接 render PageHeader |

---

Source: skills/forge-skill/references/components/pagination.md

# pagination

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/pagination.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Pagination (value)

```ts
({ totalPages, currentPage, onPageChange, color, className, locale, motion, }: { totalPages: number; currentPage: number; onPageChange?: (page: number) => void; color?: PaginationColor; className?: string; locale?: "zh" | "en"; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `totalPages` | 是 | `number` |  |
| `currentPage` | 是 | `number` |  |
| `onPageChange` | 否 | `((page: number) => void) \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` | 无障碍标签的语言，默认中文。 |
| `motion` | 否 | `MotionPreference \| undefined` | auto 跟随系统的减弱动效设置。 |

## PaginationColor (type)

```ts
export type PaginationColor = PageDotColor;
```

## 选型

- 后台列表底部翻页 — 配合 `DataTable` 使用
- 深色底用 `color="black"` 或 `"blue"`

---

Source: skills/forge-skill/references/components/panel.md

# panel

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/panel.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Panel (value)

```ts
({ title, subtitle, action, footer, children, variant, as: Element, asChild, gap, className, ...props }: PanelProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `ReactNode` |  |
| `subtitle` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `children` | 是 | `ReactNode` |  |
| `variant` | 否 | `"template" \| "dashboard" \| "custom" \| undefined` |  |
| `as` | 否 | `"article" \| "div" \| "section" \| "aside" \| undefined` |  |
| `asChild` | 否 | `boolean \| undefined` |  |
| `gap` | 否 | `"md" \| "sm" \| "none" \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLDivElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLDivElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLDivElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLDivElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLDivElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLDivElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |

## PanelProps (type)

```ts
export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  variant?: "dashboard" | "template" | "custom";
  as?: "div" | "section" | "aside" | "article";
  asChild?: boolean;
  gap?: "none" | "sm" | "md";
}
```

## 选型建议

模板风格标题容器用 Panel；dashboard 为圆角24px、边框、padding16，template 兼容原共享容器。SurfaceCard 原有分区内容容器不变，不做全局替换。title/subtitle/action/footer 为插槽；无插槽时只渲染 children。

导入自 `@forge-ui-official/core`；交互示例 `/cases/dashboard-kit`，Blocks 画廊 `/blocks`。源码实现不等于截图验收或 npm 已发布。

---

Source: skills/forge-skill/references/components/pie-chart.md

# pie-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/pie-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PieChart (value)

```ts
({ segments, accent, size, trackColor }: PieChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `PieSegment[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `trackColor` | 否 | `string \| undefined` | Optional track color for unfilled remainder. Defaults to gray (fg-grey-200). |

---

Source: skills/forge-skill/references/components/plain-icons.md

# plain-icons

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/plain-icons.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CheckIcon (value)

```ts
({ size }: { size?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `size` | 否 | `number \| undefined` |  |

## CloseIcon (value)

```ts
({ size }: { size?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `size` | 否 | `number \| undefined` |  |

## PlusIcon (value)

```ts
({ size }: { size?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `size` | 否 | `number \| undefined` |  |

---

Source: skills/forge-skill/references/components/product-row.md

# product-row

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/product-row.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProductRow (value)

```ts
({ image, imageSlot, title, subtitle, className, }: { image?: string; imageSlot?: ReactNode; title: string; subtitle?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `image` | 否 | `string \| undefined` |  |
| `imageSlot` | 否 | `ReactNode` |  |
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/profile-card.md

# profile-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/profile-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProfileCard (value)

```ts
({ avatar, name, subtitle, state, accent, surface, className, onClick, }: { avatar: string; name: string; subtitle?: string; state?: ProfileCardState; accent?: AccentColor; surface?: ProfileCardSurface; className?: string; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `avatar` | 是 | `string` |  |
| `name` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `state` | 否 | `ProfileCardState \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `surface` | 否 | `ProfileCardSurface \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |

## ProfileCardState (type)

```ts
export type ProfileCardState = "idle" | "hover" | "selected";
```

## ProfileCardSurface (type)

```ts
export type ProfileCardSurface = "default" | "onColoredBg";
```

## 选型

- sidebar 底部 profile → `ProfileCard surface="default"`
- 彩色 sidebar 内 → `ProfileCard surface="onColoredBg"`
- 深度用户卡（大头像 + stats） → `UserCard`
- 评论 / 提及用户 → `ContactItem`

---

Source: skills/forge-skill/references/components/progress-bar.md

# progress-bar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/progress-bar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProgressBar (value)

```ts
({ value, color, size, label, labelVariant, labelSize, showPercentage, onDark, variant, indeterminate, motion, locale, children, className, }: { value?: number; color?: ProgressColor; size?: ProgressSize; label?: string; labelVariant?: ProgressLabelVariant; labelSize?: ProgressLabelSize; showPercentage?: boolean; onDark?: boolean; variant?: "linear" | "ring"; indeterminate?: boolean; motion?: MotionPreference; locale?: "zh" | "en"; children?: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `number \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "gray" \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `labelVariant` | 否 | `ProgressLabelVariant \| undefined` |  |
| `labelSize` | 否 | `ProgressLabelSize \| undefined` |  |
| `showPercentage` | 否 | `boolean \| undefined` |  |
| `onDark` | 否 | `boolean \| undefined` |  |
| `variant` | 否 | `"linear" \| "ring" \| undefined` |  |
| `indeterminate` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `children` | 否 | `ReactNode` | Content centered in a ring, such as a remaining-time label. |
| `className` | 否 | `string \| undefined` |  |

## ProgressColor (type)

```ts
export type ProgressColor = keyof typeof progressColors;
```

## ProgressLabelSize (type)

```ts
export type ProgressLabelSize = "xs" | "sm";
```

## ProgressLabelVariant (type)

```ts
export type ProgressLabelVariant = "default" | "value";
```

## ProgressSize (type)

```ts
export type ProgressSize = keyof typeof progressSizes;
```

## 选型

- 任务进度 / 上传进度 → `default` label + showPercentage
- 数字量化展示（金额 / 配额 / 容量） → `labelVariant="value"`
- 在深色卡片 / dark mode → `onDark`
- 需要 label 在顶部（而非同行） → 外层自己布局

---

Source: skills/forge-skill/references/components/progress-card.md

# progress-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/progress-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProgressCard (value)

```ts
({ title, value, subtitle, theme, progress, progressColor, items, action, width, className, }: { title: string; value: string; subtitle: string; theme?: ProgressCardTheme; progress: number; progressColor: string; items: { label: string; value: string; color: string; }[]; action?: ReactNode; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `string` |  |
| `subtitle` | 是 | `string` |  |
| `theme` | 否 | `ProgressCardTheme \| undefined` |  |
| `progress` | 是 | `number` | 0-100 |
| `progressColor` | 是 | `string` | CSS color for the conic-gradient fill (e.g. "var(--fg-violet)") |
| `items` | 是 | `{ label: string; value: string; color: string; }[]` |  |
| `action` | 否 | `ReactNode` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 多分类进度可视化 → `ProgressCard`
- 单进度 → `ProgressStatCard` / `ProgressBar`
- 完整数据图表 → `DonutChart`（charts/）

---

Source: skills/forge-skill/references/components/progress-stat-card.md

# progress-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/progress-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProgressStatCard (value)

```ts
({ title, value, trend, trendDirection, subtitle, theme, size, progressValue, progressColor, icon, action, onKebabClick, density, width, className, }: { title: string; value: string; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: ProgressStatCardTheme; size?: StatCardSize; progressValue?: number; progressColor?: ProgressFillColor; icon?: ReactNode; action?: ReactNode; onKebabClick?: () => void; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `ProgressStatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `progressValue` | 否 | `number \| undefined` | 0-100 |
| `progressColor` | 否 | `ProgressFillColor \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `onKebabClick` | 否 | `(() => void) \| undefined` |  |
| `density` | 否 | `CardDensity \| undefined` | Use compact inside dense dashboards while preserving the default Figma showcase scale. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## ProgressStatCardProps (type)

```ts
export type ProgressStatCardProps = Parameters<typeof ProgressStatCard>[0];
```

## 选型

- 有百分比的指标（完成率 / 使用率 / 容量） → `ProgressStatCard`
- 纯数字指标 → `StatCard`
- 带小图 sparkline 的 → `LineChartStatCard`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

---

Source: skills/forge-skill/references/components/project-card.md

# project-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/project-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProjectCard (value)

```ts
({ logo, title, description, labelText, labelColor, progress, progressColor, avatars, overflowCount, date, onMenuClick, width, className, }: { logo?: string; title: string; description?: string; labelText?: string; labelColor?: ProjectCardColor; progress?: number; progressColor?: ProjectCardColor; avatars?: string[]; overflowCount?: number; date?: string; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `logo` | 否 | `string \| undefined` |  |
| `title` | 是 | `string` |  |
| `description` | 否 | `string \| undefined` |  |
| `labelText` | 否 | `string \| undefined` |  |
| `labelColor` | 否 | `ProjectCardColor \| undefined` |  |
| `progress` | 否 | `number \| undefined` |  |
| `progressColor` | 否 | `ProjectCardColor \| undefined` |  |
| `avatars` | 否 | `string[] \| undefined` |  |
| `overflowCount` | 否 | `number \| undefined` |  |
| `date` | 否 | `string \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## ProjectCardColor (type)

```ts
export type ProjectCardColor =
  | "purple" | "blue" | "green" | "red" | "yellow" | "cyan" | "gray";
```

## 选型

- 项目 / 看板卡 → `ProjectCard`
- 单任务 → `TaskCard`
- 活动流 → `ActivityCard`

---

Source: skills/forge-skill/references/components/rating-stars.md

# rating-stars

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/rating-stars.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## RatingStars (value)

```ts
({ value, total, showValue, size, className, onChange, readOnly, disabled, locale, ariaLabel, motion }: { value: number; total?: number; showValue?: boolean; size?: RatingStarsSize; className?: string; onChange?: (value: number) => void; readOnly?: boolean; disabled?: boolean; locale?: "zh" | "en"; ariaLabel?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `number` |  |
| `total` | 否 | `number \| undefined` |  |
| `showValue` | 否 | `boolean \| undefined` |  |
| `size` | 否 | `RatingStarsSize \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: number) => void) \| undefined` | Omit to keep the original read-only rating. |
| `readOnly` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## RatingStarsSize (type)

```ts
export type RatingStarsSize = "sm" | "md" | "lg";
```

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/recommendation-card.md

# recommendation-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/recommendation-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## RecommendationCard (value)

```ts
({ title, locale, body, confidence, confidenceLabel, alternatives, acceptLabel, onAccept, onSelectAlternative, confidenceLabels, alternativesLabel, className, }: { title: string; locale?: "zh" | "en"; body: string; confidence?: RecommendationConfidence; confidenceLabel?: string; alternatives?: RecommendationOption[]; acceptLabel?: string; onAccept?: () => void; onSelectAlternative?: (id: string) => void; confidenceLabels?: Partial<Record<RecommendationConfidence, string>>; alternativesLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `body` | 是 | `string` |  |
| `confidence` | 否 | `RecommendationConfidence \| undefined` |  |
| `confidenceLabel` | 否 | `string \| undefined` |  |
| `alternatives` | 否 | `RecommendationOption[] \| undefined` |  |
| `acceptLabel` | 否 | `string \| undefined` |  |
| `onAccept` | 否 | `(() => void) \| undefined` |  |
| `onSelectAlternative` | 否 | `((id: string) => void) \| undefined` |  |
| `confidenceLabels` | 否 | `Partial<Record<RecommendationConfidence, string>> \| undefined` |  |
| `alternativesLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## RecommendationConfidence (type)

```ts
export type RecommendationConfidence = "high" | "review" | "none";
```

## RecommendationOption (type)

```ts
export type RecommendationOption = {
  id: string;
  label: string;
  hint?: string;
  confidence?: RecommendationConfidence;
};
```

---

Source: skills/forge-skill/references/components/review-item.md

# review-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/review-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ReviewItem (value)

```ts
(props: ReviewItemRegular | ReviewItemCard) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `"regular" \| "card" \| undefined` |  |
| `avatar` | 是 | `string` |  |
| `name` | 是 | `string` |  |
| `date` | 是 | `string` |  |
| `rating` | 是 | `number` |  |
| `content` | 是 | `string` |  |
| `ratingLabel` | 否 | `string \| undefined` |  |
| `images` | 否 | `string[] \| undefined` |  |
| `overflowImageCount` | 否 | `number \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 产品评论 / 星级打分 → `ReviewItem`
- 纯文字评论 → `CommentItem`
- 简单活动记录 → `ActivityCard`

---

Source: skills/forge-skill/references/components/select-option.md

# select-option

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/select-option.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SelectOption (value)

```ts
(props: SelectOptionProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `options` | 是 | `SelectOptionItem[]` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `state` | 否 | `SelectOptionState \| undefined` |  |
| `shape` | 否 | `SelectOptionShape \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `type` | 否 | `"image" \| "single" \| "multiple" \| "general" \| undefined` |  |
| `bgVariant` | 否 | `SelectOptionBgVariant \| undefined` |  |
| `width` | 否 | `string \| undefined` | Trigger width. Defaults: single=200px, multiple=248px. Accepts any CSS width (e.g. "320px", "100%"). |
| `className` | 否 | `string \| undefined` |  |
| `headerAction` | 否 | `ReactNode` |  |
| `value` | 否 | `string \| string[] \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| ((value: string[]) => void) \| undefined` |  |

## SelectOptionBgVariant (type)

```ts
export type SelectOptionBgVariant = "white" | "grey";
```

## SelectOptionColor (type)

```ts
export type SelectOptionColor = FormAccentColor;
```

## SelectOptionItem (type)

```ts
export interface SelectOptionItem {
  value: string;
  label: string;
  image?: string;
  /** 图标建议使用 Solar；image 类型传入 image 时优先显示图片。 */
  icon?: ReactNode;
  /** 菜单项与单选触发器中的辅助说明。 */
  description?: string;
}
```

## SelectOptionProps (type)

```ts
export type SelectOptionProps = SingleProps | MultipleProps;
```

## SelectOptionShape (type)

```ts
export type SelectOptionShape = "rounded" | "pill";
```

## SelectOptionState (type)

```ts
export type SelectOptionState = "idle" | "focus" | "disabled" | "error";
```

## SelectOptionType (type)

```ts
export type SelectOptionType = "general" | "single" | "multiple" | "image";
```

---

Source: skills/forge-skill/references/components/selection-control.md

# selection-control

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/selection-control.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CheckboxWithLabel (value)

```ts
({ checked, motion, onChange, label, color, checkboxPosition, icon, avatar, dotColor, disabled, className, }: { checked?: boolean; motion?: MotionPreference; onChange?: (checked: boolean) => void; label: string; color?: ControlColor; checkboxPosition?: "left" | "right"; icon?: ReactNode; avatar?: string; dotColor?: string; disabled?: boolean; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `label` | 是 | `string` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `checkboxPosition` | 否 | `"left" \| "right" \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `avatar` | 否 | `string \| undefined` |  |
| `dotColor` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ControlColor (type)

```ts
export type ControlColor = FormAccentColor;
```

## RadioButton (value)

```ts
({ checked, onChange, color, disabled, ariaLabel, }: { checked?: boolean; onChange?: (checked: boolean) => void; color?: ControlColor; disabled?: boolean; ariaLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |

## RadioWithLabel (value)

```ts
({ checked, onChange, label, color, radioPosition, dotColor, disabled, className, tabIndex, }: { checked?: boolean; onChange?: (checked: boolean) => void; label: string; color?: ControlColor; radioPosition?: "left" | "right"; dotColor?: string; disabled?: boolean; className?: string; tabIndex?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `label` | 是 | `string` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `radioPosition` | 否 | `"left" \| "right" \| undefined` |  |
| `dotColor` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |

## Toggle (value)

```ts
({ checked, defaultChecked, motion, onChange, color, disabled, size, ariaLabel, draggable, thumbIcon, }: ToggleProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` | Initial value when checked is not supplied. |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `boolean \| undefined` | Allow dragging the thumb; clicking and keyboard activation remain available. |
| `thumbIcon` | 否 | `ReactNode` |  |

## ToggleProps (type)

```ts
export type ToggleProps = {
  checked?: boolean;
  /** Initial value when checked is not supplied. */
  defaultChecked?: boolean;
  motion?: MotionPreference;
  onChange?: (checked: boolean) => void;
  color?: ControlColor;
  disabled?: boolean;
  size?: "sm" | "md";
  ariaLabel?: string;
  /** Allow dragging the thumb; clicking and keyboard activation remain available. */
  draggable?: boolean;
  thumbIcon?: ReactNode;
};
```

---

Source: skills/forge-skill/references/components/sidebar-menu.md

# sidebar-menu

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/sidebar-menu.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SidebarMenu (value)

```ts
({ logo, logoText, teamName, teamAvatar, teamMemberCount, mainMenuItems, favoriteItems, profile, accent, mode, bgMode, width, railWidth, onMenuCollapse, className, motion, }: { logo?: ReactNode; logoText?: string; teamName?: string; teamAvatar?: string; teamMemberCount?: number; mainMenuItems: SidebarMenuItem[]; favoriteItems?: SidebarMenuItem[]; profile?: { avatar: string; name: string; role: string; }; accent?: SidebarMenuAccent; mode?: SidebarMenuMode; bgMode?: SidebarMenuBgMode; width?: string; railWidth?: string; onMenuCollapse?: () => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `logo` | 否 | `ReactNode` |  |
| `logoText` | 否 | `string \| undefined` |  |
| `teamName` | 否 | `string \| undefined` |  |
| `teamAvatar` | 否 | `string \| undefined` |  |
| `teamMemberCount` | 否 | `number \| undefined` |  |
| `mainMenuItems` | 是 | `SidebarMenuItem[]` |  |
| `favoriteItems` | 否 | `SidebarMenuItem[] \| undefined` |  |
| `profile` | 否 | `{ avatar: string; name: string; role: string; } \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `mode` | 否 | `SidebarMenuMode \| undefined` |  |
| `bgMode` | 否 | `SidebarMenuBgMode \| undefined` |  |
| `width` | 否 | `string \| undefined` | Expanded sidebar width. Accepts any CSS length; default keeps the Forge starter density. |
| `railWidth` | 否 | `string \| undefined` | Minimized sidebar rail width. Accepts any CSS length; default keeps the Forge starter density. |
| `onMenuCollapse` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## SidebarMenuAccent (type)

```ts
export type SidebarMenuAccent = AccentColor;
```

## SidebarMenuBgMode (type)

```ts
export type SidebarMenuBgMode = "white" | "colored";
```

## SidebarMenuItem (type)

```ts
export type SidebarMenuItem = {
  icon?: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  expanded?: boolean;
  badge?: number;
  children?: SidebarMenuItem[];
};
```

## SidebarMenuMode (type)

```ts
export type SidebarMenuMode = "full" | "minimized";
```

## 选型

| 场景 | 配置 |
|---|---|
| 默认后台 | `mode="full"`, `bgMode="white"` |
| 紧凑（只 icon 轨道） | `mode="minimized"` |
| 品牌色强化 | `bgMode="colored"`（按 accent 填满 sidebar） |
| 业务页统一 | 用 `AppLayout`，别直接 render SidebarMenu |

---

Source: skills/forge-skill/references/components/sidebar-popovers.md

# sidebar-popovers

自动生成；请勿编辑 API 部分。来源：`core/src/components/layouts/sidebar-popovers.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AppSwitcherDropdown (value)

```ts
({ locale, appName, appIcon, appSubtitle, apps, onAppChange, }: { locale?: "zh" | "en"; appName: string; appIcon?: string; appSubtitle?: string; apps?: AppSwitcherItem[]; onAppChange?: (app: AppSwitcherItem) => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `appName` | 是 | `string` |  |
| `appIcon` | 否 | `string \| undefined` |  |
| `appSubtitle` | 否 | `string \| undefined` |  |
| `apps` | 否 | `AppSwitcherItem[] \| undefined` |  |
| `onAppChange` | 否 | `((app: AppSwitcherItem) => void) \| undefined` |  |

## AppSwitcherItem (type)

```ts
export type AppSwitcherItem = {
  id: string;
  name: string;
  avatar?: string;
  active?: boolean;
};
```

## Team (type)

```ts
export type Team = AppSwitcherItem;
```

## TeamSwitcherLabels (type)

```ts
export type TeamSwitcherLabels = {
  invite?: string;
  settings?: string;
  createNew?: string;
};
```

---

Source: skills/forge-skill/references/components/small-calendar.md

# small-calendar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/small-calendar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SmallCalendar (value)

```ts
({ title, subtitle, color, events, onMenuClick, width, className, }: { title?: string; subtitle?: string; color?: AccentColor; events?: SmallCalendarEvent[]; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `events` | 否 | `SmallCalendarEvent[] \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## SmallCalendarEvent (type)

```ts
export interface SmallCalendarEvent {
  day: number;
  title: string;
  timeRange: string;
  color?: EventCardColor;
  avatars?: string[];
  overflowCount?: number;
}
```

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/small-daily-calendar.md

# small-daily-calendar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/small-daily-calendar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DailyEvent (type)

```ts
export interface DailyEvent {
  title: string;
  timeRange: string;
  /** Start hour (0-23) */
  startHour: number;
  /** Duration in hours (can be fractional) */
  duration: number;
  /** Color for EventCard bottom bar */
  color?: EventCardColor;
  avatars?: string[];
  overflowCount?: number;
}
```

## SmallDailyCalendar (value)

```ts
({ title, subtitle, color, events, nowHour, onMenuClick, className, }: { title?: string; subtitle?: string; color?: AccentColor; events?: DailyEvent[]; nowHour?: number; onMenuClick?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `events` | 否 | `DailyEvent[] \| undefined` |  |
| `nowHour` | 否 | `number \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/smooth-line-chart.md

# smooth-line-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/smooth-line-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SmoothLineChart (value)

```ts
({ series, stacked, bands, motion, onActiveIndexChange, ariaLabel, interpolation, highlightToActive, markers, accent, activeIndex, showTooltip, tooltipItems, showYAxis, yAxisLabels, xAxisLabels, yDomain, height, }: SmoothLineChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `series` | 是 | `LineSeries[]` |  |
| `stacked` | 否 | `boolean \| undefined` |  |
| `bands` | 否 | `{ lower: number[]; upper: number[]; color?: string; }[] \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `onActiveIndexChange` | 否 | `((index: number \| undefined) => void) \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `interpolation` | 否 | `"linear" \| "smooth" \| undefined` |  |
| `highlightToActive` | 否 | `boolean \| undefined` |  |
| `markers` | 否 | `{ index: number; label: string; }[] \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `showTooltip` | 否 | `boolean \| undefined` |  |
| `tooltipItems` | 否 | `ChartTooltipItem[] \| undefined` |  |
| `showYAxis` | 否 | `boolean \| undefined` |  |
| `yAxisLabels` | 否 | `string[] \| undefined` |  |
| `xAxisLabels` | 否 | `string[] \| undefined` |  |
| `yDomain` | 否 | `[number, number] \| undefined` | Optional [min, max] for y-axis. Default: auto from data. |
| `height` | 否 | `string \| undefined` |  |

---

Source: skills/forge-skill/references/components/stat-card.md

# stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## StatCard (value)

```ts
({ title, value, animateValue, locale, numberFormat, motion, trend, trendDirection, subtitle, theme, size, icon, badgeVariant, action, onKebabClick, density, width, className, }: { title: string; value: ReactNode; animateValue?: boolean; locale?: string; numberFormat?: Intl.NumberFormatOptions; motion?: MotionPreference; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: StatCardTheme; size?: StatCardSize; icon?: ReactNode; badgeVariant?: CardBadgeVariant; action?: ReactNode; onKebabClick?: () => void; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `ReactNode` |  |
| `animateValue` | 否 | `boolean \| undefined` | Roll numeric values when they change. Strings and custom content stay unchanged. |
| `locale` | 否 | `string \| undefined` | Locale for numeric values when animation or numberFormat is enabled. |
| `numberFormat` | 否 | `Intl.NumberFormatOptions \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `StatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `badgeVariant` | 否 | `CardBadgeVariant \| undefined` | Badge style for the icon chip. Defaults to the theme's iconChipBg in sm/lg, and to "opacity" (themed 10% bg + colored icon) in wide. |
| `action` | 否 | `ReactNode` | Custom action slot (e.g. button). Takes priority over onKebabClick. |
| `onKebabClick` | 否 | `(() => void) \| undefined` | If set, renders the built-in kebab-menu button. |
| `density` | 否 | `CardDensity \| undefined` | Use compact inside dense dashboards while preserving the default Figma showcase scale. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## StatCardProps (type)

```ts
export type StatCardProps = Parameters<typeof StatCard>[0];
```

## 选型

- Dashboard 首页的主要指标 → `size="sm"`，多张排网格，默认填满列宽
- 重点强调的单指标 → `size="lg"` + `theme` 品牌色 + icon
- 需要强视觉横向锚点 → `size="wide"`
- 需要右上菜单 → `onKebabClick`，或传 `action` 自定义
- 需要图表的指标 → 用 `ProgressStatCard` / `LineChartStatCard` 等变体

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

---

Source: skills/forge-skill/references/components/stepper.md

# stepper

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/stepper.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Stepper (value)

```ts
({ total, current, color, className, items, onStepChange, motion, locale, indicator, }: { total?: number; current?: number; color?: StepperColor; className?: string; items?: StepperItem[]; onStepChange?: (current: number) => void; motion?: MotionPreference; locale?: "zh" | "en"; indicator?: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `total` | 否 | `number \| undefined` |  |
| `current` | 否 | `number \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `items` | 否 | `StepperItem[] \| undefined` |  |
| `onStepChange` | 否 | `((current: number) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `indicator` | 否 | `ReactNode` | A single moving marker, for example the vehicle in a delivery tracker. |

## StepperColor (type)

```ts
export type StepperColor = keyof typeof onColors;
```

## StepperItem (type)

```ts
export type StepperItem = { id: string; label: string; description?: string; icon?: ReactNode };
```

## 选型

- Onboarding / 新手引导底部指示器
- 多步表单顶部进度
- 图片轮播的位置提示

---

Source: skills/forge-skill/references/components/streaming-answer.md

# streaming-answer

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/streaming-answer.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## StreamingAnswer (value)

```ts
({ text, locale, streaming, status, format, animation, duration, motion, sources, sourcesLabel, followUps, followUpsLabel, onFollowUp, onDone, className, }: StreamingAnswerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `text` | 是 | `string` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `streaming` | 否 | `boolean \| undefined` | Replay a complete string. For a live response, use status instead. |
| `status` | 否 | `StreamingAnswerStatus \| undefined` | Transport state. Complete drains the display buffer; stopped freezes it. |
| `format` | 否 | `"plain" \| "markdown" \| undefined` | Plain preserves literal text and whitespace; Markdown is opt-in. |
| `animation` | 否 | `"fade" \| "blur" \| undefined` |  |
| `duration` | 否 | `number \| undefined` | Fade duration in milliseconds; zero shows incoming content immediately. |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `sources` | 否 | `StreamingSource[] \| undefined` |  |
| `sourcesLabel` | 否 | `string \| undefined` |  |
| `followUps` | 否 | `string[] \| undefined` |  |
| `followUpsLabel` | 否 | `string \| undefined` |  |
| `onFollowUp` | 否 | `((text: string, index: number) => void) \| undefined` |  |
| `onDone` | 否 | `(() => void) \| undefined` | Called once per completed answer after its final fade, never on stop. |
| `className` | 否 | `string \| undefined` |  |

## StreamingAnswerProps (type)

```ts
export type StreamingAnswerProps = {
  text: string;
  locale?: "zh" | "en";
  /** Replay a complete string. For a live response, use status instead. */
  streaming?: boolean;
  /** Transport state. Complete drains the display buffer; stopped freezes it. */
  status?: StreamingAnswerStatus;
  /** Plain preserves literal text and whitespace; Markdown is opt-in. */
  format?: "plain" | "markdown";
  animation?: "fade" | "blur";
  /** Fade duration in milliseconds; zero shows incoming content immediately. */
  duration?: number;
  motion?: MotionPreference;
  sources?: StreamingSource[];
  sourcesLabel?: string;
  followUps?: string[];
  followUpsLabel?: string;
  onFollowUp?: (text: string, index: number) => void;
  /** Called once per completed answer after its final fade, never on stop. */
  onDone?: () => void;
  className?: string;
};
```

## StreamingAnswerStatus (type)

```ts
export type StreamingAnswerStatus = "streaming" | "complete" | "stopped";
```

## StreamingSource (type)

```ts
export type StreamingSource = {
  name: string;
  domain?: string;
  href?: string;
};
```

---

Source: skills/forge-skill/references/components/style-guide.md

# style-guide

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/style-guide.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ColorScaleStop (type)

```ts
export interface ColorScaleStop {
  shade: string; // "50", "100", ..., "900"
  hex: string;
}
```

## ColorSection (value)

```ts
({ title, scale, darkLabelUntil, swatchSize, }: { title: string; scale: ColorScaleStop[]; darkLabelUntil: number; swatchSize?: ColorSwatchSize; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `scale` | 是 | `ColorScaleStop[]` |  |
| `darkLabelUntil` | 是 | `number` | Shades ≤ this value get dark text; above get white text. |
| `swatchSize` | 否 | `ColorSwatchSize \| undefined` |  |

## ColorSwatch (value)

```ts
({ label, hex, tone, size, }: { label: string; hex: string; tone: "dark" | "light"; size?: ColorSwatchSize; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `hex` | 是 | `string` |  |
| `tone` | 是 | `"light" \| "dark"` |  |
| `size` | 否 | `ColorSwatchSize \| undefined` |  |

## ColorSwatchSize (type)

```ts
export type ColorSwatchSize = "sm" | "md" | "lg";
```

## TypefaceBlock (value)

```ts
({ name, sample, }: { name: string; sample?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `name` | 是 | `string` |  |
| `sample` | 否 | `string \| undefined` |  |

## TypographySizeRow (value)

```ts
({ label, text, sizeClass, }: { label: string; text: string; sizeClass: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `text` | 是 | `string` |  |
| `sizeClass` | 是 | `string` |  |

## TypographyWeightSample (value)

```ts
({ text, weight, sizeClass, }: { text: string; weight: FontWeight; sizeClass: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `text` | 是 | `string` |  |
| `weight` | 是 | `FontWeight` |  |
| `sizeClass` | 是 | `string` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->

---

Source: skills/forge-skill/references/components/surface-card.md

# surface-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/surface-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SurfaceCard (value)

```ts
({ title, subtitle, action, children, footer, padding, className, headerClassName, contentClassName, footerClassName, effect, motion, ...props }: { title?: ReactNode; subtitle?: ReactNode; action?: ReactNode; children: ReactNode; footer?: ReactNode; padding?: SurfaceCardPadding; className?: string; headerClassName?: string; contentClassName?: string; footerClassName?: string; effect?: "tilt" | "layered"; motion?: MotionPreference; } & Omit<HTMLAttributes<HTMLElement>, "title">) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `ReactNode` |  |
| `subtitle` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `children` | 是 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `padding` | 否 | `SurfaceCardPadding \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `headerClassName` | 否 | `string \| undefined` |  |
| `contentClassName` | 否 | `string \| undefined` |  |
| `footerClassName` | 否 | `string \| undefined` |  |
| `effect` | 否 | `"tilt" \| "layered" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |

## SurfaceCardPadding (type)

```ts
export type SurfaceCardPadding = "none" | "sm" | "md" | "lg";
```

## 选型

当前已导出的 SurfaceCard 提供中性内容容器；API 以本页生成部分为准。它不自动证明计划中的模板风格标题 Panel 已完成。先对照 Screen；需要新增公共契约时用 FORGE-GAP 请求决定。

---

Source: skills/forge-skill/references/components/tab-bar.md

# tab-bar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/tab-bar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TabBar (value)

```ts
({ tabs, color, surface, appearance, progress, onChange, className, motion, ariaLabel, }: { tabs: TabItem[]; color?: TabBarColor; surface?: TabBarSurface; appearance?: "underline" | "dock"; progress?: number; onChange?: (index: number) => void; className?: string; motion?: MotionPreference; ariaLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tabs` | 是 | `TabItem[]` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `surface` | 否 | `TabBarSurface \| undefined` |  |
| `appearance` | 否 | `"underline" \| "dock" \| undefined` |  |
| `progress` | 否 | `number \| undefined` | Fractional panel index for a scroll-linked indicator. |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |

## TabBarColor (type)

```ts
export type TabBarColor = keyof typeof tabActiveColors;
```

## TabBarSurface (type)

```ts
export type TabBarSurface = "inline" | "page";
```

## TabItem (type)

```ts
export interface TabItem {
  label: string;
  active?: boolean;
  badge?: number;
  icon?: ReactNode;
  /** Optional association with the matching TabsContent panel. */
  id?: string;
  controls?: string;
}
```

## 选型

- 页面内部分 tab 切换（详情页的多视图、设置页的多分组）
- **ButtonGroup 是另一个选项** — 胶囊分段样式，适合紧凑空间
- tab 多（> 5）且需要 icon 时，考虑自己封装一层

---

Source: skills/forge-skill/references/components/tabs-content.md

# tabs-content

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/tabs-content.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TabsContent (value)

```ts
({ transition, ...props }: TabsContentProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `activeKey` | 是 | `string \| number` | Changing this key remounts content. Keep form state above this component. |
| `children` | 否 | `ReactNode` |  |
| `panels` | 否 | `{ key: string \| number; content: ReactNode; id?: string; labelledBy?: string; ariaLabel?: string; }[] \| undefined` | Optional full panel set enables native touch scrolling and mouse dragging. |
| `onActiveKeyChange` | 否 | `((key: string \| number) => void) \| undefined` |  |
| `onProgressChange` | 否 | `((fractionalIndex: number) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `transition` | 否 | `"fade" \| "slide" \| undefined` | Fade preserves the existing entry-only behavior. Slide also animates exit and height. |
| `direction` | 否 | `"forward" \| "backward" \| undefined` | Slide direction. Omit for automatic numeric-key ordering; string keys default to forward. |
| `id` | 否 | `string \| undefined` |  |
| `labelledBy` | 否 | `string \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TabsContentProps (type)

```ts
export interface TabsContentProps {
  /** Changing this key remounts content. Keep form state above this component. */
  activeKey: string | number;
  children?: ReactNode;
  /** Optional full panel set enables native touch scrolling and mouse dragging. */
  panels?: { key: string | number; content: ReactNode; id?: string; labelledBy?: string; ariaLabel?: string }[];
  onActiveKeyChange?: (key: string | number) => void;
  onProgressChange?: (fractionalIndex: number) => void;
  motion?: MotionPreference;
  /** Fade preserves the existing entry-only behavior. Slide also animates exit and height. */
  transition?: "fade" | "slide";
  /** Slide direction. Omit for automatic numeric-key ordering; string keys default to forward. */
  direction?: "forward" | "backward";
  id?: string;
  labelledBy?: string;
  ariaLabel?: string;
  className?: string;
}
```

---

Source: skills/forge-skill/references/components/task-card.md

# task-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/task-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TaskCard (value)

```ts
({ title, description, labelText, labelColor, progress, progressColor, locale, progressLabel, avatars, overflowCount, date, onMenuClick, width, className, }: { title: string; description?: string; labelText?: string; labelColor?: TaskCardColor; progress?: number; progressColor?: TaskCardColor; locale?: "zh" | "en"; progressLabel?: string; avatars?: string[]; overflowCount?: number; date?: string; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `description` | 否 | `string \| undefined` |  |
| `labelText` | 否 | `string \| undefined` |  |
| `labelColor` | 否 | `TaskCardColor \| undefined` |  |
| `progress` | 否 | `number \| undefined` |  |
| `progressColor` | 否 | `TaskCardColor \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `progressLabel` | 否 | `string \| undefined` |  |
| `avatars` | 否 | `string[] \| undefined` |  |
| `overflowCount` | 否 | `number \| undefined` |  |
| `date` | 否 | `string \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## TaskCardColor (type)

```ts
export type TaskCardColor =
  | "purple" | "blue" | "green" | "red" | "yellow" | "cyan" | "gray";
```

## 选型

| 场景 | 选 |
|---|---|
| 看板卡 / Todo 项 | `TaskCard` |
| 有 logo 的项目卡 | `ProjectCard` |
| 活动记录卡 | `ActivityCard` |

---

Source: skills/forge-skill/references/components/text-area.md

# text-area

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/text-area.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TextArea (value)

```ts
ForwardRefExoticComponent<{ state?: TextAreaState; shape?: TextAreaShape; color?: TextAreaColor; label?: string; errorMessage?: string; autoGrow?: boolean; headerAction?: ReactNode; onChange?: (value: string) => void; className?: string; textareaClassName?: string; } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color" | "onChange"> & RefAttributes<HTMLTextAreaElement>>
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `state` | 否 | `FieldState \| undefined` |  |
| `shape` | 否 | `FieldShape \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `autoGrow` | 否 | `boolean \| undefined` |  |
| `headerAction` | 否 | `ReactNode` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `textareaClassName` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLTextAreaElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `autoComplete` | 否 | `string \| undefined` |  |
| `maxLength` | 否 | `number \| undefined` |  |
| `minLength` | 否 | `number \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `readOnly` | 否 | `boolean \| undefined` |  |
| `required` | 否 | `boolean \| undefined` |  |
| `cols` | 否 | `number \| undefined` |  |
| `dirName` | 否 | `string \| undefined` |  |
| `rows` | 否 | `number \| undefined` |  |
| `wrap` | 否 | `string \| undefined` |  |
| `ref` | 否 | `Ref<HTMLTextAreaElement> \| undefined` | Allows getting a ref to the component instance. Once the component unmounts, React will set `ref.current` to `null` (or call the ref with `null` if you passed a callback ref). |
| `key` | 否 | `Key \| null \| undefined` |  |

## TextAreaColor (type)

```ts
export type TextAreaColor = FieldColor;
```

## TextAreaProps (type)

```ts
export type TextAreaProps = {
  state?: TextAreaState;
  shape?: TextAreaShape;
  color?: TextAreaColor;
  label?: string;
  errorMessage?: string;
  autoGrow?: boolean;
  headerAction?: ReactNode;
  onChange?: (value: string) => void;
  className?: string;
  textareaClassName?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color" | "onChange">;
```

## TextAreaShape (type)

```ts
export type TextAreaShape = FieldShape;
```

## TextAreaState (type)

```ts
export type TextAreaState = FieldState;
```

---

Source: skills/forge-skill/references/components/text-field.md

# text-field

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/text-field.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TextField (value)

```ts
ForwardRefExoticComponent<{ state?: TextFieldState; shape?: TextFieldShape; color?: TextFieldColor; label?: string; labelPlacement?: "outside" | "floating"; locale?: "zh" | "en"; activeTag?: string; errorMessage?: string; headerAction?: ReactNode; iconLeft?: ReactNode; iconRight?: ReactNode; suffix?: ReactNode; tags?: TextFieldTag[]; onRemoveTag?: (value: string) => void; onChange?: (value: string) => void; className?: string; inputClassName?: string; } & Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "onChange" | "size"> & RefAttributes<HTMLInputElement>>
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `state` | 否 | `FieldState \| undefined` |  |
| `shape` | 否 | `FieldShape \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `labelPlacement` | 否 | `"outside" \| "floating" \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `activeTag` | 否 | `string \| undefined` | Tag highlighted before removal, controlled by the caller. |
| `errorMessage` | 否 | `string \| undefined` |  |
| `headerAction` | 否 | `ReactNode` |  |
| `iconLeft` | 否 | `ReactNode` |  |
| `iconRight` | 否 | `ReactNode` |  |
| `suffix` | 否 | `ReactNode` |  |
| `tags` | 否 | `TextFieldTag[] \| undefined` |  |
| `onRemoveTag` | 否 | `((value: string) => void) \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `inputClassName` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `formAction` | 否 | `string \| ((formData: FormData) => void \| Promise<void>) \| undefined` |  |
| `formEncType` | 否 | `string \| undefined` |  |
| `formMethod` | 否 | `string \| undefined` |  |
| `formNoValidate` | 否 | `boolean \| undefined` |  |
| `formTarget` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `type` | 否 | `HTMLInputTypeAttribute \| undefined` |  |
| `value` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLInputElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLInputElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLInputElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLInputElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `list` | 否 | `string \| undefined` |  |
| `step` | 否 | `string \| number \| undefined` |  |
| `src` | 否 | `string \| undefined` |  |
| `accept` | 否 | `string \| undefined` |  |
| `alt` | 否 | `string \| undefined` |  |
| `autoComplete` | 否 | `HTMLInputAutoCompleteAttribute \| undefined` |  |
| `capture` | 否 | `boolean \| "user" \| "environment" \| undefined` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `height` | 否 | `string \| number \| undefined` |  |
| `max` | 否 | `string \| number \| undefined` |  |
| `maxLength` | 否 | `number \| undefined` |  |
| `min` | 否 | `string \| number \| undefined` |  |
| `minLength` | 否 | `number \| undefined` |  |
| `multiple` | 否 | `boolean \| undefined` |  |
| `pattern` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `readOnly` | 否 | `boolean \| undefined` |  |
| `required` | 否 | `boolean \| undefined` |  |
| `width` | 否 | `string \| number \| undefined` |  |
| `ref` | 否 | `Ref<HTMLInputElement> \| undefined` | Allows getting a ref to the component instance. Once the component unmounts, React will set `ref.current` to `null` (or call the ref with `null` if you passed a callback ref). |
| `key` | 否 | `Key \| null \| undefined` |  |

## TextFieldColor (type)

```ts
export type TextFieldColor = FieldColor;
```

## TextFieldProps (type)

```ts
export type TextFieldProps = {
  state?: TextFieldState;
  shape?: TextFieldShape;
  color?: TextFieldColor;
  label?: string;
  labelPlacement?: "outside" | "floating";
  locale?: "zh" | "en";
  /** Tag highlighted before removal, controlled by the caller. */
  activeTag?: string;
  errorMessage?: string;
  headerAction?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  suffix?: ReactNode;
  tags?: TextFieldTag[];
  onRemoveTag?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "onChange">;
```

## TextFieldShape (type)

```ts
export type TextFieldShape = FieldShape;
```

## TextFieldState (type)

```ts
export type TextFieldState = FieldState;
```

---

Source: skills/forge-skill/references/components/text-field-select.md

# text-field-select

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/text-field-select.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TextFieldSelectSuffix (value)

```ts
({ value, options, onChange, color, motion, }: { value: string; options: string[]; onChange?: (value: string) => void; color?: FormAccentColor; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `options` | 是 | `string[]` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

---

Source: skills/forge-skill/references/components/thinking-trace.md

# thinking-trace

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/thinking-trace.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ThinkingRow (type)

```ts
export type ThinkingRow = {
  primary: string;
  secondary?: string;
  mono?: boolean;
  add?: number;
  del?: number;
  href?: string;
};
```

## ThinkingTrace (value)

```ts
({ variant, locale, motion, rows, activeLabel, doneLabel, query, settled, play, onSettled, className, }: { variant?: ThinkingVariant; locale?: "zh" | "en"; motion?: MotionPreference; rows?: ThinkingRow[]; activeLabel?: string; doneLabel?: string; query?: string; settled?: boolean; play?: boolean; onSettled?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `ThinkingVariant \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `rows` | 否 | `ThinkingRow[] \| undefined` |  |
| `activeLabel` | 否 | `string \| undefined` |  |
| `doneLabel` | 否 | `string \| undefined` |  |
| `query` | 否 | `string \| undefined` |  |
| `settled` | 否 | `boolean \| undefined` | Skip the reveal animation and show the finished trace. |
| `play` | 否 | `boolean \| undefined` | Auto-advance through rows. Turn off when the host drives visibility. |
| `onSettled` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ThinkingVariant (type)

```ts
export type ThinkingVariant = "steps" | "reasoning" | "search" | "coding";
```

---

Source: skills/forge-skill/references/components/toast.md

# toast

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/toast.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ToastApi (type)

```ts
export interface ToastApi { toast: (options: ToastOptions) => string; dismiss: (id: string) => void; update: (id: string, options: Partial<ToastOptions>) => void }
```

## ToastOptions (type)

```ts
export interface ToastOptions { title: string; description?: string; /** Milliseconds; 0 keeps the notification until dismissed. */ duration?: number; status?: "loading" | "success" | "error"; action?: { label: string; onClick: () => void }; }
```

## ToastProvider (value)

```ts
({ children, motion, locale, stacked }: { children: ReactNode; motion?: MotionPreference; locale?: "zh" | "en"; stacked?: boolean; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `stacked` | 否 | `boolean \| undefined` |  |

## useToast (value)

```ts
() => ToastApi
```

---

Source: skills/forge-skill/references/components/tool-chips.md

# tool-chips

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/tool-chips.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ToolChipDetail (type)

```ts
export type ToolChipDetail = {
  text: string;
  tone?: "add" | "del" | "plain";
};
```

## ToolChipItem (type)

```ts
export type ToolChipItem = {
  id: string;
  kind: ToolChipKind;
  label: string;
  chip: string;
  mono?: boolean;
  detail?: ToolChipDetail[];
  status?: "pending" | "running" | "complete" | "error" | "cancelled";
};
```

## ToolChipKind (type)

```ts
export type ToolChipKind = "think" | "write" | "run" | "read" | "edit";
```

## ToolChips (value)

```ts
({ items, locale, motion, state, result, actions, diffs, summary, className, }: { items: ToolChipItem[]; locale?: "zh" | "en"; motion?: MotionPreference; state?: "idle" | "running" | "success" | "error" | "cancelled"; result?: ReactNode; actions?: ReactNode; diffs?: ToolDiffChip[]; summary?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `ToolChipItem[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `state` | 否 | `"idle" \| "success" \| "error" \| "running" \| "cancelled" \| undefined` |  |
| `result` | 否 | `ReactNode` |  |
| `actions` | 否 | `ReactNode` |  |
| `diffs` | 否 | `ToolDiffChip[] \| undefined` |  |
| `summary` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolDiffChip (type)

```ts
export type ToolDiffChip = {
  file: string;
  add: number;
  del?: number;
};
```

---

Source: skills/forge-skill/references/components/toolbar.md

# toolbar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/toolbar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PageTitleToolbar (value)

```ts
(props: PageTitleToolbarProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `"overview" \| "collection" \| "detail" \| "action" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `askAi` | 否 | `AskAiProps \| undefined` | Optional Ask AI action, with the same configuration as PageHeader. |
| `title` | 是 | `string` |  |

## PageTitleToolbarAction (type)

```ts
export interface PageTitleToolbarAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  form?: string;
  ariaLabel?: string;
  testId?: string;
}
```

## PageTitleToolbarDateAction (type)

```ts
export interface PageTitleToolbarDateAction {
  label?: string;
  onClick?: () => void;
  enablePopover?: boolean;
}
```

## PageTitleToolbarMenuAction (type)

```ts
export interface PageTitleToolbarMenuAction {
  onClick?: () => void;
  ariaLabel?: string;
}
```

## PageTitleToolbarPresetProps (type)

```ts
export type PageTitleToolbarPresetProps =
  | PageTitleToolbarOverviewProps
  | PageTitleToolbarCollectionProps
  | PageTitleToolbarDetailProps
  | PageTitleToolbarActionProps;
```

## PageTitleToolbarProps (type)

```ts
export type PageTitleToolbarProps = PageTitleToolbarPresetProps | PageTitleToolbarLegacyProps;
```

## PageTitleToolbarVariant (type)

```ts
export type PageTitleToolbarVariant = "overview" | "collection" | "detail" | "action";
```

## Toolbar (value)

```ts
({ left, right, className, selection, locale, motion, }: ToolbarProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `left` | 否 | `ReactNode` |  |
| `right` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `selection` | 否 | `ToolbarSelectionOptions \| undefined` | Replaces the normal toolbar while count is greater than zero. Keep this configuration present and set count to zero to exit without remounting normal inputs. |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ToolbarActions (value)

```ts
({ children, className, }: { children: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolbarColor (type)

```ts
export type ToolbarColor = "purple" | "blue" | "black";
```

## ToolbarDatepicker (value)

```ts
({ label, onClick, enablePopover, accentBg, className, }: { label?: string; onClick?: () => void; enablePopover?: boolean; accentBg?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 否 | `string \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in calendar). |
| `enablePopover` | 否 | `boolean \| undefined` | Opt-in to built-in calendar popup on click (only when `onClick` is not set). |
| `accentBg` | 否 | `string \| undefined` | Accent bg class for today's highlight in built-in calendar. |
| `className` | 否 | `string \| undefined` |  |

## ToolbarFavoriteButton (value)

```ts
({ onClick, className, }: { onClick?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolbarFilterButton (value)

```ts
({ label, onClick, panel, className, }: { label?: string; onClick?: () => void; panel?: ToolbarFilterPanel; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 否 | `string \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in popover). |
| `panel` | 否 | `ToolbarFilterPanel` | Optional panel. `ReactNode` or `(close) => ReactNode` so inner Apply/Cancel can close it. |
| `className` | 否 | `string \| undefined` |  |

## ToolbarKebabButton (value)

```ts
({ onClick, ariaLabel, className, }: { onClick?: () => void; ariaLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolbarPillTab (type)

```ts
export interface ToolbarPillTab {
  label: string;
  active?: boolean;
}
```

## ToolbarPillTabs (value)

```ts
({ tabs, color, onChange, className, motion, }: { tabs: ToolbarPillTab[]; color?: ToolbarColor; onChange?: (index: number) => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tabs` | 是 | `ToolbarPillTab[]` |  |
| `color` | 否 | `ToolbarColor \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ToolbarProps (type)

```ts
export type ToolbarProps = {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
  /** Replaces the normal toolbar while count is greater than zero. Keep this configuration present and set count to zero to exit without remounting normal inputs. */
  selection?: ToolbarSelectionOptions;
  locale?: "zh" | "en";
  motion?: MotionPreference;
};
```

## ToolbarSearchInput (value)

```ts
({ placeholder, value, defaultValue, onChange, onSubmit, ariaLabel, className, }: { placeholder?: string; value?: string; defaultValue?: string; onChange?: (value: string) => void; onSubmit?: (value: string) => void; ariaLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `placeholder` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| undefined` |  |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onSubmit` | 否 | `((value: string) => void) \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolbarSelectDropdown (value)

```ts
({ placeholder, value, fixedWidth, onClick, options, onChange, className, motion, }: { placeholder?: string; value?: string; fixedWidth?: boolean; onClick?: () => void; options?: ToolbarSelectOption[]; onChange?: (value: string) => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `placeholder` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| undefined` |  |
| `fixedWidth` | 否 | `boolean \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in dropdown). |
| `options` | 否 | `ToolbarSelectOption[] \| undefined` | Data-driven options. When set (and `onClick` not set), clicking pops the list. |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ToolbarSelectionOptions (type)

```ts
export type ToolbarSelectionOptions = {
  /** Selected item count, controlled by the consumer. Non-finite and negative values become zero. */
  count: number;
  onClear: () => void;
  actions: ReactNode;
  label?: string;
  clearLabel?: string;
};
```

## ToolbarShowSelect (value)

```ts
({ value, onClick, options, onChange, className, }: { value?: string; onClick?: () => void; options?: ToolbarSelectOption[]; onChange?: (value: string) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `string \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `options` | 否 | `ToolbarSelectOption[] \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

| 场景 | 组合 |
|---|---|
| 列表页顶部搜索 + 筛选 + 新建 | `ToolbarSearchInput` + `ToolbarSelectDropdown` + `ToolbarFilterButton` + `ToolbarActions` |
| 按 tab 切数据视图 | `ToolbarPillTabs` + 右侧操作 |
| 带大 title 的工具栏 | `PageTitleToolbar` |
| 多操作汇聚（分享 / 导出 / 更多） | `ToolbarActions` + `ToolbarKebabButton` |

---

Source: skills/forge-skill/references/components/tooltip.md

# tooltip

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/tooltip.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Tooltip (value)

```ts
({ content, position, size, open, children, motion, delay, followCursor, }: { content: string; position?: TooltipPosition; size?: TooltipSize; open?: boolean; children: ReactNode; motion?: MotionPreference; delay?: number; followCursor?: boolean; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `content` | 是 | `string` |  |
| `position` | 否 | `TooltipPosition \| undefined` |  |
| `size` | 否 | `TooltipSize \| undefined` |  |
| `open` | 否 | `boolean \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `delay` | 否 | `number \| undefined` | Initial pointer delay in milliseconds. Focus always opens immediately. |
| `followCursor` | 否 | `boolean \| undefined` | Follow a pointer while keeping the bubble within the viewport. Focus remains anchored. |

## TooltipAnchor (value)

```ts
({ icon, state, className, onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: ReactNode; state?: TooltipAnchorState; className?: string; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `formAction` | 否 | `string \| ((formData: FormData) => void \| Promise<void>) \| undefined` |  |
| `formEncType` | 否 | `string \| undefined` |  |
| `formMethod` | 否 | `string \| undefined` |  |
| `formNoValidate` | 否 | `boolean \| undefined` |  |
| `formTarget` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `type` | 否 | `"submit" \| "reset" \| "button" \| undefined` |  |
| `value` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLButtonElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLButtonElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLButtonElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLButtonElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onClick` | 否 | `(MouseEventHandler<HTMLButtonElement> & (() => void)) \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLButtonElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLButtonElement> \| undefined` |  |
| `icon` | 是 | `ReactNode` |  |
| `state` | 否 | `TooltipAnchorState \| undefined` |  |

## TooltipAnchorState (type)

```ts
export type TooltipAnchorState = "idle" | "active";
```

## TooltipBubble (value)

```ts
({ content, position, size, }: { content: string; position?: TooltipPosition; size?: TooltipSize; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `content` | 是 | `string` |  |
| `position` | 否 | `TooltipPosition \| undefined` |  |
| `size` | 否 | `TooltipSize \| undefined` |  |

## TooltipGroup (value)

```ts
({ children, delay, warmWindow }: { children: ReactNode; delay?: number; warmWindow?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `delay` | 否 | `number \| undefined` |  |
| `warmWindow` | 否 | `number \| undefined` |  |

## TooltipPosition (type)

```ts
export type TooltipPosition = "top" | "bottom" | "left" | "right";
```

## TooltipSize (type)

```ts
export type TooltipSize = "sm" | "lg";
```

## 选型

| 场景 | 选 |
|---|---|
| Icon 按钮的说明 | `Tooltip` + `IconButton` |
| 表单字段问号说明 | `Tooltip` + 小 `InfoCircleLinear` |
| 纯视觉展示（case 页） | `TooltipBubble`（静态） |
| 自己控制显示 | `TooltipAnchor` |

---

Source: skills/forge-skill/references/components/topbar.md

# topbar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/topbar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TopBar (value)

```ts
({ value, color, className, }: { value?: number; color?: TopBarColor; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `number \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TopBarColor (type)

```ts
export type TopBarColor = keyof typeof topbarColors;
```

## 选型

- 路由切换 loading → 配 next/navigation 的 loading hook
- 下载 / 大文件进度 → 优先用 `ProgressBar`（有 label），顶部 `TopBar` 只做粗略全局提示
- 不要混用 `TopBar` 和 `ProgressBar` 做同一任务

---

Source: skills/forge-skill/references/components/user-card.md

# user-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/user-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## UserCard (value)

```ts
({ avatar, initials, initialsColor, name, badge, subtitle, stats, checked, onMenuClick, width, className, }: { avatar?: string; initials?: string; initialsColor?: "purple" | "blue" | "green" | "orange"; name: string; badge?: ReactNode; subtitle?: ReactNode; stats?: { label: string; value: string; }[]; checked?: boolean; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `avatar` | 否 | `string \| undefined` |  |
| `initials` | 否 | `string \| undefined` |  |
| `initialsColor` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| undefined` |  |
| `name` | 是 | `string` |  |
| `badge` | 否 | `ReactNode` |  |
| `subtitle` | 否 | `ReactNode` |  |
| `stats` | 否 | `{ label: string; value: string; }[] \| undefined` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 团队成员网格 / 选人 → `UserCard`
- 水平用户行（如评论头像） → `ContactItem`
- Profile 下拉菜单项 → `ProfileCard`

---

Source: skills/forge-skill/references/components/utils.md

# utils

自动生成；请勿编辑 API 部分。来源：`core/src/lib/utils.ts`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## cn (value)

```ts
(...classes: (string | undefined | null | false)[]) => string
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `length` | 是 | `number` | Gets or sets the length of the array. This is a number one higher than the highest index in the array. |
| `toString` | 是 | `() => string` | Returns a string representation of an array. |
| `toLocaleString` | 是 | `{ (): string; (locales: string \| string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string; }` | Returns a string representation of an array. The elements are converted to string using their toLocaleString methods. |
| `pop` | 是 | `() => string \| false \| null \| undefined` | Removes the last element from an array and returns it. If the array is empty, undefined is returned and the array is not modified. |
| `push` | 是 | `(...items: (string \| false \| null \| undefined)[]) => number` | Appends new elements to the end of an array, and returns the new length of the array. |
| `concat` | 是 | `{ (...items: ConcatArray<string \| false \| null \| undefined>[]): (string \| false \| null \| undefined)[]; (...items: (string \| false \| ConcatArray<string \| false \| null \| undefined> \| null \| undefined)[]): (string \| false \| null \| undefined)[]; }` | Combines two or more arrays. This method returns a new array without modifying any existing arrays. |
| `join` | 是 | `(separator?: string) => string` | Adds all the elements of an array into a string, separated by the specified separator string. |
| `reverse` | 是 | `() => (string \| false \| null \| undefined)[]` | Reverses the elements in an array in place. This method mutates the array and returns a reference to the same array. |
| `shift` | 是 | `() => string \| false \| null \| undefined` | Removes the first element from an array and returns it. If the array is empty, undefined is returned and the array is not modified. |
| `slice` | 是 | `(start?: number, end?: number) => (string \| false \| null \| undefined)[]` | Returns a copy of a section of an array. For both start and end, a negative index can be used to indicate an offset from the end of the array. For example, -2 refers to the second to last element of the array. |
| `sort` | 是 | `(compareFn?: ((a: string \| false \| null \| undefined, b: string \| false \| null \| undefined) => number) \| undefined) => (string \| false \| null \| undefined)[]` | Sorts an array in place. This method mutates the array and returns a reference to the same array. |
| `splice` | 是 | `{ (start: number, deleteCount?: number): (string \| false \| null \| undefined)[]; (start: number, deleteCount: number, ...items: (string \| false \| null \| undefined)[]): (string \| false \| null \| undefined)[]; }` | Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements. |
| `unshift` | 是 | `(...items: (string \| false \| null \| undefined)[]) => number` | Inserts new elements at the start of an array, and returns the new length of the array. |
| `indexOf` | 是 | `(searchElement: string \| false \| null \| undefined, fromIndex?: number) => number` | Returns the index of the first occurrence of a value in an array, or -1 if it is not present. |
| `lastIndexOf` | 是 | `(searchElement: string \| false \| null \| undefined, fromIndex?: number) => number` | Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present. |
| `every` | 是 | `{ <S extends string \| false \| null \| undefined>(predicate: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => value is S, thisArg?: any): this is S[]; (predicate: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => unknown, thisArg?: any): boolean; }` | Determines whether all the members of an array satisfy the specified test. |
| `some` | 是 | `(predicate: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => unknown, thisArg?: any) => boolean` | Determines whether the specified callback function returns true for any element of an array. |
| `forEach` | 是 | `(callbackfn: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => void, thisArg?: any) => void` | Performs the specified action for each element in an array. |
| `map` | 是 | `<U>(callbackfn: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => U, thisArg?: any) => U[]` | Calls a defined callback function on each element of an array, and returns an array that contains the results. |
| `filter` | 是 | `{ <S extends string \| false \| null \| undefined>(predicate: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => value is S, thisArg?: any): S[]; (predicate: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => unknown, thisArg?: any): (string \| false \| null \| undefined)[]; }` | Returns the elements of an array that meet the condition specified in a callback function. |
| `reduce` | 是 | `{ (callbackfn: (previousValue: string \| false \| null \| undefined, currentValue: string \| false \| null \| undefined, currentIndex: number, array: (string \| false \| null \| undefined)[]) => string \| false \| null \| undefined): string \| false \| null \| undefined; (callbackfn: (previousValue: string \| false \| null \| undefined, currentValue: string \| false \| null \| undefined, currentIndex: number, array: (string \| false \| null \| undefined)[]) => string \| false \| null \| undefined, initialValue: string \| false \| null \| undefined): string \| false \| null \| undefined; <U>(callbackfn: (previousValue: U, currentValue: string \| false \| null \| undefined, currentIndex: number, array: (string \| false \| null \| undefined)[]) => U, initialValue: U): U; }` | Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. |
| `reduceRight` | 是 | `{ (callbackfn: (previousValue: string \| false \| null \| undefined, currentValue: string \| false \| null \| undefined, currentIndex: number, array: (string \| false \| null \| undefined)[]) => string \| false \| null \| undefined): string \| false \| null \| undefined; (callbackfn: (previousValue: string \| false \| null \| undefined, currentValue: string \| false \| null \| undefined, currentIndex: number, array: (string \| false \| null \| undefined)[]) => string \| false \| null \| undefined, initialValue: string \| false \| null \| undefined): string \| false \| null \| undefined; <U>(callbackfn: (previousValue: U, currentValue: string \| false \| null \| undefined, currentIndex: number, array: (string \| false \| null \| undefined)[]) => U, initialValue: U): U; }` | Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. |
| `find` | 是 | `{ <S extends string \| false \| null \| undefined>(predicate: (value: string \| false \| null \| undefined, index: number, obj: (string \| false \| null \| undefined)[]) => value is S, thisArg?: any): S \| undefined; (predicate: (value: string \| false \| null \| undefined, index: number, obj: (string \| false \| null \| undefined)[]) => unknown, thisArg?: any): string \| false \| null \| undefined; }` | Returns the value of the first element in the array where predicate is true, and undefined otherwise. |
| `findIndex` | 是 | `(predicate: (value: string \| false \| null \| undefined, index: number, obj: (string \| false \| null \| undefined)[]) => unknown, thisArg?: any) => number` | Returns the index of the first element in the array where predicate is true, and -1 otherwise. |
| `fill` | 是 | `(value: string \| false \| null \| undefined, start?: number, end?: number) => (string \| false \| null \| undefined)[]` | Changes all array elements from `start` to `end` index to a static `value` and returns the modified array |
| `copyWithin` | 是 | `(target: number, start: number, end?: number) => (string \| false \| null \| undefined)[]` | Returns the this object after copying a section of the array identified by start and end to the same array starting at position target |
| `entries` | 是 | `() => ArrayIterator<[number, string \| false \| null \| undefined]>` | Returns an iterable of key, value pairs for every entry in the array |
| `keys` | 是 | `() => ArrayIterator<number>` | Returns an iterable of keys in the array |
| `values` | 是 | `() => ArrayIterator<string \| false \| null \| undefined>` | Returns an iterable of values in the array |
| `includes` | 是 | `(searchElement: string \| false \| null \| undefined, fromIndex?: number) => boolean` | Determines whether an array includes a certain element, returning true or false as appropriate. |
| `flatMap` | 是 | `<U, This = undefined>(callback: (this: This, value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => U \| readonly U[], thisArg?: This \| undefined) => U[]` | Calls a defined callback function on each element of an array. Then, flattens the result into a new array. This is identical to a map followed by flat with depth 1. |
| `flat` | 是 | `<A, D extends number = 1>(this: A, depth?: D \| undefined) => FlatArray<A, D>[]` | Returns a new array with all sub-array elements concatenated into it recursively up to the specified depth. |
| `at` | 是 | `(index: number) => string \| false \| null \| undefined` | Returns the item located at the specified index. |
| `findLast` | 是 | `{ <S extends string \| false \| null \| undefined>(predicate: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => value is S, thisArg?: any): S \| undefined; (predicate: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => unknown, thisArg?: any): string \| false \| null \| undefined; }` | Returns the value of the last element in the array where predicate is true, and undefined otherwise. |
| `findLastIndex` | 是 | `(predicate: (value: string \| false \| null \| undefined, index: number, array: (string \| false \| null \| undefined)[]) => unknown, thisArg?: any) => number` | Returns the index of the last element in the array where predicate is true, and -1 otherwise. |
| `toReversed` | 是 | `() => (string \| false \| null \| undefined)[]` | Returns a copy of an array with its elements reversed. |
| `toSorted` | 是 | `(compareFn?: ((a: string \| false \| null \| undefined, b: string \| false \| null \| undefined) => number) \| undefined) => (string \| false \| null \| undefined)[]` | Returns a copy of an array with its elements sorted. |
| `toSpliced` | 是 | `{ (start: number, deleteCount: number, ...items: (string \| false \| null \| undefined)[]): (string \| false \| null \| undefined)[]; (start: number, deleteCount?: number): (string \| false \| null \| undefined)[]; }` | Copies an array and removes elements and, if necessary, inserts new elements in their place. Returns the copied array. Copies an array and removes elements while returning the remaining elements. |
| `with` | 是 | `(index: number, value: string \| false \| null \| undefined) => (string \| false \| null \| undefined)[]` | Copies an array, then overwrites the value at the provided index with the given value. If the index is negative, then it replaces from the end of the array. |
| `__@iterator@34` | 是 | `() => ArrayIterator<string \| false \| null \| undefined>` | Iterator |
| `__@unscopables@36` | 是 | `{ [x: number]: boolean \| undefined; length?: boolean \| undefined; toString?: boolean \| undefined; toLocaleString?: boolean \| undefined; pop?: boolean \| undefined; push?: boolean \| undefined; concat?: boolean \| undefined; join?: boolean \| undefined; reverse?: boolean \| undefined; shift?: boolean \| undefined; slice?: boolean \| undefined; sort?: boolean \| undefined; splice?: boolean \| undefined; unshift?: boolean \| undefined; indexOf?: boolean \| undefined; lastIndexOf?: boolean \| undefined; every?: boolean \| undefined; some?: boolean \| undefined; forEach?: boolean \| undefined; map?: boolean \| undefined; filter?: boolean \| undefined; reduce?: boolean \| undefined; reduceRight?: boolean \| undefined; find?: boolean \| undefined; findIndex?: boolean \| undefined; fill?: boolean \| undefined; copyWithin?: boolean \| undefined; entries?: boolean \| undefined; keys?: boolean \| undefined; values?: boolean \| undefined; includes?: boolean \| undefined; flatMap?: boolean \| undefined; flat?: boolean \| undefined; at?: boolean \| undefined; findLast?: boolean \| undefined; findLastIndex?: boolean \| undefined; toReversed?: boolean \| undefined; toSorted?: boolean \| undefined; toSpliced?: boolean \| undefined; with?: boolean \| undefined; [Symbol.iterator]?: boolean \| undefined; readonly [Symbol.unscopables]?: boolean \| undefined; }` | Is an object whose properties have the value 'true' when they will be absent when used in a 'with' statement. |

---

Source: skills/forge-skill/references/components/wallet-goal-card.md

# wallet-goal-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/wallet-goal-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## WalletGoalCard (value)

```ts
({ title, date, amount, progress, progressColor, showActions, onEdit, onTopUp, onWithdraw, topUpLabel, withdrawLabel, editLabel, iconBg, icon, }: WalletGoalCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `date` | 是 | `string` |  |
| `amount` | 是 | `string` |  |
| `progress` | 是 | `number` |  |
| `progressColor` | 是 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "red"` |  |
| `showActions` | 否 | `boolean \| undefined` |  |
| `onEdit` | 否 | `(() => void) \| undefined` |  |
| `onTopUp` | 否 | `(() => void) \| undefined` |  |
| `onWithdraw` | 否 | `(() => void) \| undefined` |  |
| `topUpLabel` | 否 | `string \| undefined` |  |
| `withdrawLabel` | 否 | `string \| undefined` |  |
| `editLabel` | 否 | `string \| undefined` |  |
| `iconBg` | 否 | `string \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |

## WalletGoalCardProps (type)

```ts
export interface WalletGoalCardProps {
  title: string;
  date: string;
  amount: string;
  progress: number;
  progressColor: "purple" | "green" | "blue" | "red" | "orange" | "yellow" | "cyan";
  showActions?: boolean;
  onEdit?: () => void;
  onTopUp?: () => void;
  onWithdraw?: () => void;
  topUpLabel?: string;
  withdrawLabel?: string;
  editLabel?: string;
  iconBg?: string;
  icon?: ReactNode;
}
```

## 选型建议

目标金额、日期、进度与可选操作用 WalletGoalCard；列表组合用可复制 GoalProgressList，财务特定储蓄外观用 WalletProgressPanel。onEdit/onTopUp/onWithdraw 由业务方实现；不附带资金操作后台。

导入自 `@forge-ui-official/core`；交互示例 `/cases/dashboard-kit`，Blocks 画廊 `/blocks`。源码实现不等于截图验收或 npm 已发布。

---

Source: skills/forge-skill/references/components/wheel-chart-stat-card.md

# wheel-chart-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/wheel-chart-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## WheelChartStatCard (value)

```ts
({ title, value, trend, trendDirection, subtitle, theme, size, density, wheelColor, wheelPercent, icon, width, className, }: { title: string; value: string; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: WheelChartStatCardTheme; size?: StatCardSize; density?: "default" | "compact"; wheelColor?: WheelColor; wheelPercent?: number; icon?: ReactNode; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `WheelChartStatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `density` | 否 | `"default" \| "compact" \| undefined` |  |
| `wheelColor` | 否 | `WheelColor \| undefined` |  |
| `wheelPercent` | 否 | `number \| undefined` |  |
| `icon` | 否 | `ReactNode` | Icon for the top-right chip (only rendered in size="wide"). |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## WheelChartStatCardProps (type)

```ts
export type WheelChartStatCardProps = Parameters<typeof WheelChartStatCard>[0];
```

## WheelColor (type)

```ts
export type WheelColor = "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";
```

## 选型

- 单指标完成度展示（使用率 / 满意度 / 目标达成） → `WheelChartStatCard`
- 线性进度 → `ProgressStatCard`
- 多指标对比环 → `DonutChart`（`charts/`）

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。

# Changelog

## 0.3.8

- Replace the default team menu with an application switcher: current application, selectable applications, and active selection. Team management actions are hidden by default.
- Add AppSwitcherDropdown, AppSwitcherItem and AppLayout appName/appIcon/appSubtitle/apps/onAppChange. Selection closes the layout menu and calls the consumer callback; current application is controlled by the consumer.
- Preserve legacy Team props and explicit showTeamActions opt-in, including the member-count subtitle.

## 0.3.7

- Add translation overrides for AgentTaskRows states, code actions, workflow kinds, context labels, command groups, recommendation confidence, PromptBar controls, and navigation accessible names.
- Add count formatters and a translated toggle hint to AgentDiffTable. Preserve all existing defaults; translations update with props.

## 0.3.6

- Add `PromptBar.sourcesLabel` and `commandsLabel` to translate toolbar buttons, picker titles and accessible names. Labels update when the application language changes; English defaults remain compatible.

## 0.3.4

- Add smooth buffered playback and a 500ms linear fade to `StreamingAnswer`, with explicit streaming, complete, and stopped states. Keep the existing full-text replay API.
- Add optional Markdown rendering through Streamdown, preserve Unicode grapheme clusters, and support reduced motion and server hydration.
- Export `StreamingAnswerProps` and `StreamingAnswerStatus`. Completion waits for the final fade; stopping preserves the visible answer.
- Add interactive Chinese and English examples to the Agent showcase, plus streaming regression tests and Next.js 15/16 package-consumer checks.
- Stabilize generated `TextField` declarations so package API checks do not depend on inferred union ordering; its props and behavior are unchanged.

## 0.3.3

- Add `AppLayout.menuSections` and export `AppLayoutMenuSection` for any number of ordered sidebar groups. The same active-item, nested-menu, collapsed, and mobile behaviors apply across all groups.
- Keep the legacy two-group layout when `menuSections` is omitted. Empty labels no longer render an empty title container, and empty new sections are skipped.

## 0.3.2

- Restore original Solar artwork across all 187 Forge icon exports, including the sidebar calendar and mail buttons, using `@solar-icons/react` 2.3.2.
- Replace the Phosphor peer with `@solar-icons/react` ^2.3.2. Import paths and icon names remain unchanged; icon props now follow Solar rather than Phosphor.
- Include attribution for Solar artwork by 480 Design (CC BY 4.0) and the MIT React implementation.

## 0.3.1

- Anchor the PromptBar model menu above the model button with right alignment, viewport collision handling, and a bounded width and height. Hide scrollbars while retaining scrolling and keyboard access.
- Show the selected model with a trailing check and support keyboard navigation, outside dismissal, Escape, and focus restoration. Add optional modelMenuLabel for accessible naming.
- Use native Popover top-layer rendering to preserve host theme and focus scope while escaping ancestor clipping. Full clipping protection requires Popover API support.
- Let nested menus consume Escape before the AskAi fullscreen host. Keep Sources and Commands as input suggestion panels.
- Add regression tests and a case covering ordinary pages, AskAi drawer/fullscreen, narrow viewports, and long model lists.

## 0.3.0

- Add Modal and Drawer with native modal semantics, keyboard focus cycling, Escape/backdrop dismissal and animated entry/exit.
- Add controlled or uncontrolled single-section Accordion with keyboard navigation.
- Add TabsContent entry transitions, and ToastProvider/useToast with dismissal, paused timers and animated stacking.
- ConfirmationDialog keeps its inline-card API; optional open/onOpenChange enables modal behavior.
- Enable consistent interaction motion on buttons, menus, select controls, sidebars, tabs, tooltips, toggles and checkboxes. Components support motion="none" and the system reduced-motion preference.
- Add TooltipGroup to share pointer-delay timing across nearby triggers.
- Complete the MIT Phosphor icon migration for Agent and Ask AI components while retaining their icon names.
- Add Motion documentation and interaction examples to the repository showcase.

TabsContent remounts children when activeKey changes; keep persistent form state in its parent. Toast timers are paused while hovered or focused; duration=0 requires explicit dismissal.

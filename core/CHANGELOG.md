# Changelog

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

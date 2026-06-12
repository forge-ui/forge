# entity-detail-activity-rail

Use this pattern when a detail page must support deep investigation, collaboration, and a clear resolution action.

Good matches:
- approval/case/ticket/incident detail
- compliance or audit record review
- entity pages with attachments, comments, history, and related work

Do not use it for:
- shallow profile pages
- simple edit forms
- detail pages where a drawer preview is enough

## Files

- `BRIEF.md` — Page Intent Spec example.
- `page.tsx` — route orchestration and local resolution state.
- `utils.ts` — sample detail entity and helper data.
- `_components/DetailHero.tsx`
- `_components/ContextRail.tsx`
- `_components/ActivityRail.tsx`
- `_components/ResolutionPanel.tsx`

## Adaptation Rules

1. Keep the page shape: hero identity, left context rail, main investigation panels, right action panel.
2. Include root cause, impact scope, similar/related items, attachments, activity/history, and comments when the domain supports them.
3. Use Forge `Avatar`, `StatusBadge`, `ProgressBar`, `FileCard`, `HistoryItem`, `CommentItem`, `ButtonGroup`, `TextArea`, and `Button`.
4. Resolution must update local state and show saving/saved/error feedback.
5. Link to another workflow route after save when the PRD has downstream work.
6. Do not reuse a list-page header/filter/table stack. Detail pages must foreground evidence, status, and action closure.

## Acceptance

- Detail page is not a flat field list.
- Collaboration and evidence are visible without opening another page.
- The desktop review screenshot shows evidence/root cause/impact context and a resolution/action surface; configure `requiredVisibleText` for those labels.
- The primary action has real local state and feedback.

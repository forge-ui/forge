# action-form-protask

Use this pattern when a PRD asks for a focused create/edit/submit page that should feel like a real admin form instead of a dashboard card pile.

Good matches:
- create customer / lead / order / policy / scan / review task
- edit an entity with grouped fields and a status side rail
- submit a request that needs preflight checks before save
- start a workflow where decisions are mostly independent

Do not use it for:
- strict multi-step flows where later decisions depend on earlier choices
- broad settings pages with persistent grouped configuration
- evidence-heavy triage pages that need split-pane review
- list, detail, dashboard, or kanban routes

## PRD Signal Decision

- Use `action-form-protask` when the route is `/new`, `/create`, `/edit`, `/import`, or `/submit` and the PRD has one main save/submit action.
- Use `wizard-multi-step` instead when the PRD mentions sequential setup, mapping, review step, onboarding, or step-by-step validation.
- Use `settings-grouped` instead when the page edits many persistent settings groups.
- Use `split-pane-triage` instead when the page decides a case after reading evidence, history, or related records.

## Files

- `BRIEF.md` — Page Intent Spec example for Step 2.5.
- `page.tsx` — route-level state, page title, breadcrumbs, and actions.
- `utils.ts` — draft shape, options, completion and preflight helpers.
- `_components/ScopeFields.tsx` — primary object and ownership fields.
- `_components/PolicyFields.tsx` — policy, priority, notes, and boolean controls.
- `_components/PreflightChecklist.tsx` — readiness checks before save.
- `_components/StatusRail.tsx` — status side rail, completion, save state, and next route.

## Adaptation Rules

1. Keep the title area open: `Breadcrumbs + H1 + Cancel/Save`; no kicker and no long description.
2. Keep `page.tsx` thin. It owns local state, patch helpers, save simulation, and route-level actions.
3. Put field groups into domain-named child components. Do not define `SectionCard`, `MiniCard`, or a custom Button.
4. The right rail must explain readiness: status, completion, validation/preflight, owner, next route.
5. Save must have at least idle/saving/saved/error state. It cannot be an empty click handler.
6. Action routes are not sidebar routes. They are entered from parent list/detail CTAs.
7. Do not reuse the list page template. Action pages need grouped form sections on the left and status/preflight/context on the right.

## Acceptance

- `page.tsx` has `Breadcrumbs`, `Cancel`, and `Save`.
- Main content uses `minmax(0,1fr)` plus a responsive side rail based on `clamp`, `minmax`, or max-width tokens; do not hard-code a fixed rail width.
- At least two grouped form sections use Forge `TextField`, `TextArea`, `SelectOption`, `Checkbox`, `SurfaceCard`, `Label`, and `ProgressBar`.
- The right rail shows completion and preflight checks.
- Screenshot acceptance must show the first field group plus the status/completion/preflight rail in the desktop review viewport; configure `requiredVisibleText` for both.
- Save action updates visible state and links to the next workflow route.
- No inline hex in `page.tsx`; no raw `<button>`; no generic custom card shell.

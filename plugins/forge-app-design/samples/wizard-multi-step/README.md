# wizard-multi-step

Use this pattern when the PRD requires a guided multi-step setup, import, onboarding, approval, or policy creation workflow.

Good matches:
- data import / connector setup
- campaign or rule creation
- approval submission flow
- onboarding checklist
- bulk operation preview and submit

Do not use it for:
- simple create/edit forms
- read-only detail pages
- workflows where users must compare many records side by side

## Files

- `BRIEF.md` — Page Intent Spec example for Step 2.5.
- `page.tsx` — route-level state machine and submit flow.
- `utils.ts` — step metadata, draft type, validation, preview rows.
- `_components/StepRail.tsx` — progress and step navigation.
- `_components/StepShell.tsx` — step card container.
- `_components/SourceStep.tsx` — first-step input surface.
- `_components/MappingStep.tsx` — field mapping / validation surface.
- `_components/ScheduleStep.tsx` — timing / owner / policy controls.
- `_components/ReviewPanel.tsx` — review and submit preview.
- `_components/WizardFooter.tsx` — back/next/submit controls.

## Adaptation Rules

1. Replace `WizardDraft` with the PRD domain, for example `ImportJobDraft`, `CampaignDraft`, or `PolicyDraft`.
2. Keep steps decision-oriented. Avoid generic "Step 1 / Step 2" labels in final output.
3. Each step must have a validation reason or preview, not just empty form fields.
4. Submit must update state, call mock API or emit a final result state, then link to the next workflow page.
5. Put custom density and inline style inside `_components/`, not in `page.tsx`.

## Acceptance

- User can move forward/back without losing draft state.
- At least one step has validation errors or warnings.
- Review step summarizes all prior decisions.
- Submit action has saving/success/error state.
- Final success links to another route.
- `page.tsx` has no inline `style={{ ... }}` or hex literals.

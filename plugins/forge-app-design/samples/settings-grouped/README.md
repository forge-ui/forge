# settings-grouped

Use this pattern when the PRD has admin configuration split into logical groups with save/review workflow.

Good matches:
- integration settings
- SLA / alert policy settings
- workspace / tenant preferences
- role and access configuration
- billing or compliance controls

Do not use it for:
- one-off edit forms
- detail pages where settings are secondary metadata
- wizard flows where configuration must happen in strict order

## Files

- `BRIEF.md` — Page Intent Spec example for Step 2.5.
- `page.tsx` — route-level orchestration example. Keep this thin.
- `utils.ts` — group metadata, row type, defaults, validation helpers.
- `_components/SettingsNav.tsx` — left group navigation and changed counts.
- `_components/SettingsGroup.tsx` — grouped setting rows.
- `_components/SettingRow.tsx` — row renderer for toggle/text/select/number controls.
- `_components/DangerZone.tsx` — destructive/reset controls with explicit confirmation state.
- `_components/SaveBar.tsx` — sticky changed-state action bar.

## Adaptation Rules

1. Replace `SettingRecord` with the PRD domain, for example `SlaPolicy`, `IntegrationConfig`, or `WorkspacePolicy`.
2. Keep groups semantic: alerting / routing / retention / permissions, not generic group A/B/C.
3. Keep one real save workflow: update local dirty state, call PATCH or mock save, then show saved/error state.
4. Put custom row density and inline style in `_components/`, not in `page.tsx`.
5. Keep danger actions explicit: staged confirmation state, never an empty click handler.

## Acceptance

- `page.tsx` imports `_components/` and stays thin.
- Groups have changed badges or validation status.
- User can edit at least two setting types.
- Save/reset actions update local state.
- Danger zone is visually separated and requires confirmation.
- `page.tsx` has no inline `style={{ ... }}` or hex literals.

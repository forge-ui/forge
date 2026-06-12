# Page Intent Spec Example

```yaml
- id: settings
  route: /settings
  layout_intent: grouped-settings-with-sticky-save
  detail_surface: page
  user_goal: Admin reviews configuration groups, changes safe controls, and understands which changes are pending before saving.
  primary_decision: Which policy group needs adjustment, and is the resulting configuration safe to apply?
  primary_action: Edit settings and save the changed group set.
  secondary_context:
    - left group nav with dirty counts
    - grouped rows with helper text and current status
    - validation summary
    - danger zone separated from normal controls
  states_required: [loading, empty, dirty, saving, saved, error, confirming]
  must_have_extras: [dirty_state, grouped_nav, validation_summary, danger_zone, sticky_save_bar]
  component_plan:
    components:
      - SettingsNav
      - SettingsGroup
      - SettingRow
      - DangerZone
      - SaveBar
    helpers: [SETTING_GROUPS, DEFAULT_SETTINGS, changedKeys, validateSettings]
    local_state: [settings, baseline, activeGroup, saveState, confirmReset]
```

Replace names and settings with the PRD domain. Keep the decision and save workflow shape.

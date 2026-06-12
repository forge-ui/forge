export type SettingType = 'toggle' | 'text' | 'select' | 'number'
export type SettingGroupId = 'alerting' | 'routing' | 'retention'

export type SettingRecord = {
  key: string
  group: SettingGroupId
  type: SettingType
  label: string
  helper: string
  value: string | number | boolean
  options?: string[]
  required?: boolean
  risk?: 'normal' | 'sensitive'
}

export const SETTING_GROUPS: Array<{ id: SettingGroupId; label: string; description: string }> = [
  { id: 'alerting', label: 'Alerting', description: 'Who gets notified and when escalation starts.' },
  { id: 'routing', label: 'Routing', description: 'How work moves across teams and queues.' },
  { id: 'retention', label: 'Retention', description: 'How long records stay queryable and auditable.' },
]

export const DEFAULT_SETTINGS: SettingRecord[] = [
  { key: 'criticalAlerts', group: 'alerting', type: 'toggle', label: 'Critical alerts', helper: 'Notify owners when high-risk records are created.', value: true },
  { key: 'digestEmail', group: 'alerting', type: 'text', label: 'Digest email', helper: 'Daily summary recipient for this workspace.', value: 'ops@example.com', required: true },
  { key: 'slaMinutes', group: 'routing', type: 'number', label: 'SLA minutes', helper: 'Default time before a record becomes at risk.', value: 240, required: true },
  { key: 'defaultQueue', group: 'routing', type: 'select', label: 'Default queue', helper: 'Fallback team when ownership cannot be inferred.', value: 'operations', options: ['operations', 'support', 'platform'] },
  { key: 'auditDays', group: 'retention', type: 'number', label: 'Audit retention', helper: 'Days to keep workflow event history.', value: 180, required: true, risk: 'sensitive' },
  { key: 'archiveResolved', group: 'retention', type: 'toggle', label: 'Archive resolved records', helper: 'Move completed records out of active queues.', value: false },
]

export function changedKeys(current: SettingRecord[], baseline: SettingRecord[]) {
  return current
    .filter(setting => baseline.find(item => item.key === setting.key)?.value !== setting.value)
    .map(setting => setting.key)
}

export function changedCountByGroup(current: SettingRecord[], baseline: SettingRecord[]) {
  const changed = new Set(changedKeys(current, baseline))
  return SETTING_GROUPS.reduce<Record<SettingGroupId, number>>((acc, group) => {
    acc[group.id] = current.filter(setting => setting.group === group.id && changed.has(setting.key)).length
    return acc
  }, { alerting: 0, routing: 0, retention: 0 })
}

export function validateSettings(settings: SettingRecord[]) {
  return settings.filter(setting => setting.required && (setting.value === '' || setting.value == null))
}

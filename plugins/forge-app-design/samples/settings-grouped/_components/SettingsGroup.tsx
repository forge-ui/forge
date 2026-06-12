'use client'

import { SettingRow } from './SettingRow'
import { SETTING_GROUPS, type SettingGroupId, type SettingRecord } from '../utils'

export function SettingsGroup({
  groupId,
  settings,
  changedKeys,
  invalidKeys,
  onChange,
}: {
  groupId: SettingGroupId
  settings: SettingRecord[]
  changedKeys: Set<string>
  invalidKeys: Set<string>
  onChange: (key: string, value: string | number | boolean) => void
}) {
  const group = SETTING_GROUPS.find(item => item.id === groupId)!
  const rows = settings.filter(setting => setting.group === groupId)

  return (
    <section className="rounded-card border border-fg-grey-200 bg-fg-grey-50 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-fg-black">{group.label}</h2>
          <p className="mt-1 text-sm text-fg-grey-600">{group.description}</p>
        </div>
        {invalidKeys.size > 0 && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            {invalidKeys.size} invalid
          </span>
        )}
      </div>
      <div className="space-y-3">
        {rows.map(setting => (
          <SettingRow
            key={setting.key}
            setting={setting}
            changed={changedKeys.has(setting.key)}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  )
}

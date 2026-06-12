'use client'

import { Label } from '@forge-ui-official/core'
import { SETTING_GROUPS, type SettingGroupId } from '../utils'

export function SettingsNav({
  activeGroup,
  changedCounts,
  onSelect,
}: {
  activeGroup: SettingGroupId
  changedCounts: Record<SettingGroupId, number>
  onSelect: (group: SettingGroupId) => void
}) {
  return (
    <aside className="rounded-card bg-white border border-fg-grey-200 p-3 h-fit lg:sticky lg:top-6">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fg-grey-500">Settings groups</p>
      <div className="space-y-1">
        {SETTING_GROUPS.map(group => {
          const active = group.id === activeGroup
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onSelect(group.id)}
              className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${active ? 'bg-fg-violet-100' : 'hover:bg-fg-grey-50'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-semibold ${active ? 'text-fg-violet' : 'text-fg-black'}`}>{group.label}</span>
                {changedCounts[group.id] > 0 && <Label color="purple" size="sm">{changedCounts[group.id]} changed</Label>}
              </div>
              <p className="mt-1 text-xs leading-5 text-fg-grey-600">{group.description}</p>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

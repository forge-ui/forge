'use client'

import { Label } from '@forge-ui-official/core'
import type { SettingRecord } from '../utils'

export function SettingRow({
  setting,
  changed,
  onChange,
}: {
  setting: SettingRecord
  changed: boolean
  onChange: (key: string, value: string | number | boolean) => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-fg-grey-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-fg-black">{setting.label}</h3>
          {changed && <Label color="blue" size="sm">Unsaved</Label>}
          {setting.risk === 'sensitive' && <Label color="yellow" size="sm">Sensitive</Label>}
        </div>
        <p className="mt-1 text-xs leading-5 text-fg-grey-600">{setting.helper}</p>
      </div>
      <div className="shrink-0 md:min-w-56">
        {setting.type === 'toggle' && (
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-fg-grey-100 p-1">
            <input
              type="checkbox"
              checked={Boolean(setting.value)}
              onChange={event => onChange(setting.key, event.target.checked)}
              className="sr-only"
            />
            <span className={`h-7 w-12 rounded-full p-1 transition-colors ${setting.value ? 'bg-fg-violet' : 'bg-fg-grey-300'}`}>
              <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${setting.value ? 'translate-x-5' : 'translate-x-0'}`} />
            </span>
            <span className="pr-2 text-xs font-semibold text-fg-grey-700">{setting.value ? 'On' : 'Off'}</span>
          </label>
        )}
        {setting.type === 'text' && (
          <input
            value={String(setting.value)}
            onChange={event => onChange(setting.key, event.target.value)}
            className="w-full rounded-xl border border-fg-grey-200 bg-fg-grey-50 px-3 py-2 text-sm text-fg-black outline-none focus:border-fg-violet-400"
          />
        )}
        {setting.type === 'number' && (
          <input
            type="number"
            value={Number(setting.value)}
            onChange={event => onChange(setting.key, Number(event.target.value))}
            className="w-full rounded-xl border border-fg-grey-200 bg-fg-grey-50 px-3 py-2 text-sm text-fg-black outline-none focus:border-fg-violet-400"
          />
        )}
        {setting.type === 'select' && (
          <select
            value={String(setting.value)}
            onChange={event => onChange(setting.key, event.target.value)}
            className="w-full rounded-xl border border-fg-grey-200 bg-fg-grey-50 px-3 py-2 text-sm text-fg-black outline-none focus:border-fg-violet-400"
          >
            {setting.options?.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        )}
      </div>
    </div>
  )
}

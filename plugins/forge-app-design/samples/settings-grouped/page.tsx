'use client'

import { useMemo, useState } from 'react'
import { DangerZone } from './_components/DangerZone'
import { SaveBar } from './_components/SaveBar'
import { SettingsGroup } from './_components/SettingsGroup'
import { SettingsNav } from './_components/SettingsNav'
import {
  DEFAULT_SETTINGS,
  changedCountByGroup,
  changedKeys,
  validateSettings,
  type SettingGroupId,
  type SettingRecord,
} from './utils'

export default function GroupedSettingsPage() {
  const [settings, setSettings] = useState<SettingRecord[]>(DEFAULT_SETTINGS)
  const [baseline, setBaseline] = useState<SettingRecord[]>(DEFAULT_SETTINGS)
  const [activeGroup, setActiveGroup] = useState<SettingGroupId>('alerting')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [confirmReset, setConfirmReset] = useState(false)

  const changed = useMemo(() => new Set(changedKeys(settings, baseline)), [settings, baseline])
  const invalid = useMemo(() => new Set(validateSettings(settings).map(setting => setting.key)), [settings])
  const changedCounts = useMemo(() => changedCountByGroup(settings, baseline), [settings, baseline])

  function updateSetting(key: string, value: string | number | boolean) {
    setSaveState('idle')
    setSettings(current => current.map(setting => (setting.key === key ? { ...setting, value } : setting)))
  }

  async function saveSettings() {
    setSaveState('saving')
    await new Promise(resolve => setTimeout(resolve, 300))
    setBaseline(settings)
    setSaveState('saved')
  }

  function discardChanges() {
    setSettings(baseline)
    setSaveState('idle')
    setConfirmReset(false)
  }

  function resetDefaults() {
    setSettings(DEFAULT_SETTINGS)
    setConfirmReset(false)
    setSaveState('idle')
  }

  return (
    <main className="w-full min-h-screen bg-fg-grey-50 p-6 lg:p-8 space-y-6">
      <header>
        <p className="text-sm font-semibold text-fg-violet-600">Admin settings</p>
        <h1 className="mt-1 text-2xl font-bold text-fg-black">Workspace policy controls</h1>
        <p className="mt-1 text-sm text-fg-grey-600">
          Review grouped controls, edit operational policy, and save only validated changes.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[clamp(15rem,20vw,19rem)_minmax(0,1fr)]">
        <SettingsNav activeGroup={activeGroup} changedCounts={changedCounts} onSelect={setActiveGroup} />
        <div className="space-y-5">
          <SettingsGroup
            groupId={activeGroup}
            settings={settings}
            changedKeys={changed}
            invalidKeys={invalid}
            onChange={updateSetting}
          />
          <DangerZone
            confirming={confirmReset}
            onStartConfirm={() => setConfirmReset(true)}
            onCancel={() => setConfirmReset(false)}
            onReset={resetDefaults}
          />
          <SaveBar
            changedCount={changed.size}
            invalidCount={invalid.size}
            saveState={saveState}
            onSave={saveSettings}
            onDiscard={discardChanges}
          />
        </div>
      </div>
    </main>
  )
}

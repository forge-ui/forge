'use client'

import { StepShell } from './StepShell'
import type { WizardDraft } from '../utils'

export function ScheduleStep({
  draft,
  onChange,
}: {
  draft: WizardDraft
  onChange: (patch: Partial<WizardDraft>) => void
}) {
  return (
    <StepShell eyebrow="Step schedule" title="Choose owner and cadence" description="Make ownership explicit before the setup can run unattended.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-fg-grey-600">Owner</span>
          <input
            value={draft.owner}
            onChange={event => onChange({ owner: event.target.value })}
            className="mt-2 w-full rounded-xl border border-fg-grey-200 bg-fg-grey-50 px-3 py-2 text-sm text-fg-black outline-none focus:border-fg-violet-400"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-fg-grey-600">Cadence</span>
          <select
            value={draft.schedule}
            onChange={event => onChange({ schedule: event.target.value as WizardDraft['schedule'] })}
            className="mt-2 w-full rounded-xl border border-fg-grey-200 bg-fg-grey-50 px-3 py-2 text-sm text-fg-black outline-none focus:border-fg-violet-400"
          >
            <option value="manual">manual</option>
            <option value="hourly">hourly</option>
            <option value="daily">daily</option>
          </select>
        </label>
      </div>
      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-fg-grey-50 px-3 py-2">
        <input
          type="checkbox"
          checked={draft.notifyOnFailure}
          onChange={event => onChange({ notifyOnFailure: event.target.checked })}
        />
        <span className="text-sm font-medium text-fg-black">Notify owner on failure</span>
      </label>
    </StepShell>
  )
}

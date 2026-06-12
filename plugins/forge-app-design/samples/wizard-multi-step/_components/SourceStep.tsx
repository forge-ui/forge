'use client'

import { StepShell } from './StepShell'
import type { WizardDraft } from '../utils'

export function SourceStep({
  draft,
  onChange,
}: {
  draft: WizardDraft
  onChange: (patch: Partial<WizardDraft>) => void
}) {
  return (
    <StepShell eyebrow="Step source" title="Describe the source" description="Capture the object being onboarded before mapping and scheduling.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-fg-grey-600">Source name</span>
          <input
            value={draft.sourceName}
            onChange={event => onChange({ sourceName: event.target.value })}
            className="mt-2 w-full rounded-xl border border-fg-grey-200 bg-fg-grey-50 px-3 py-2 text-sm text-fg-black outline-none focus:border-fg-violet-400"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-fg-grey-600">Source type</span>
          <select
            value={draft.sourceType}
            onChange={event => onChange({ sourceType: event.target.value as WizardDraft['sourceType'] })}
            className="mt-2 w-full rounded-xl border border-fg-grey-200 bg-fg-grey-50 px-3 py-2 text-sm text-fg-black outline-none focus:border-fg-violet-400"
          >
            <option value="database">database</option>
            <option value="file">file</option>
            <option value="api">api</option>
          </select>
        </label>
      </div>
    </StepShell>
  )
}

'use client'

import { Label } from '@forge-ui-official/core'
import { StepShell } from './StepShell'
import type { WizardDraft } from '../utils'

export function MappingStep({
  draft,
  onChange,
}: {
  draft: WizardDraft
  onChange: (patch: Partial<WizardDraft>) => void
}) {
  return (
    <StepShell eyebrow="Step mapping" title="Validate field mapping" description="Show why the workflow can or cannot continue.">
      <div className="rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-fg-black">Required fields</p>
            <p className="mt-1 text-xs text-fg-grey-600">Primary id, timestamp, owner, and status must be mapped.</p>
          </div>
          <Label color={draft.requiredFieldsMapped ? 'green' : 'red'} size="sm">
            {draft.requiredFieldsMapped ? 'Mapped' : 'Blocked'}
          </Label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['automatic', 'manual'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ mappingMode: mode })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${draft.mappingMode === mode ? 'bg-fg-violet text-white' : 'bg-white text-fg-grey-700'}`}
            >
              {mode}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange({ requiredFieldsMapped: !draft.requiredFieldsMapped })}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-fg-grey-700"
          >
            Toggle validation state
          </button>
        </div>
      </div>
    </StepShell>
  )
}

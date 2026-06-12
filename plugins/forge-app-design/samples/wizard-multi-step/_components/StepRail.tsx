'use client'

import { Label, ProgressBar } from '@forge-ui-official/core'
import { WIZARD_STEPS, progressForStep, type WizardStepId } from '../utils'

export function StepRail({
  activeStep,
  invalid,
  onSelect,
}: {
  activeStep: WizardStepId
  invalid: boolean
  onSelect: (step: WizardStepId) => void
}) {
  const progress = progressForStep(activeStep)

  return (
    <aside className="rounded-card border border-fg-grey-200 bg-white p-4 h-fit lg:sticky lg:top-6">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-fg-black">Setup progress</p>
          <Label color={invalid ? 'yellow' : 'green'} size="sm">{invalid ? 'Needs review' : 'Ready'}</Label>
        </div>
        <div className="mt-3">
          <ProgressBar value={progress} color={invalid ? 'yellow' : 'purple'} showPercentage />
        </div>
      </div>
      <div className="space-y-1">
        {WIZARD_STEPS.map(step => {
          const active = step.id === activeStep
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(step.id)}
              className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${active ? 'bg-fg-violet-100' : 'hover:bg-fg-grey-50'}`}
            >
              <p className={`text-sm font-semibold ${active ? 'text-fg-violet' : 'text-fg-black'}`}>{step.label}</p>
              <p className="mt-1 text-xs leading-5 text-fg-grey-600">{step.description}</p>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

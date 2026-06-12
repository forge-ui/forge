'use client'

import { useMemo, useState } from 'react'
import { MappingStep } from './_components/MappingStep'
import { ReviewPanel } from './_components/ReviewPanel'
import { ScheduleStep } from './_components/ScheduleStep'
import { SourceStep } from './_components/SourceStep'
import { StepRail } from './_components/StepRail'
import { WizardFooter } from './_components/WizardFooter'
import {
  DEFAULT_DRAFT,
  WIZARD_STEPS,
  validateDraft,
  type SubmitState,
  type WizardDraft,
  type WizardStepId,
} from './utils'

export default function MultiStepWizardPage() {
  const [draft, setDraft] = useState<WizardDraft>(DEFAULT_DRAFT)
  const [activeStep, setActiveStep] = useState<WizardStepId>('source')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const issues = useMemo(() => validateDraft(draft), [draft])

  function patchDraft(patch: Partial<WizardDraft>) {
    setSubmitState('idle')
    setDraft(current => ({ ...current, ...patch }))
  }

  function move(delta: number) {
    const index = WIZARD_STEPS.findIndex(step => step.id === activeStep)
    const next = WIZARD_STEPS[Math.min(Math.max(index + delta, 0), WIZARD_STEPS.length - 1)]
    setActiveStep(next.id)
  }

  async function submitDraft() {
    setSubmitState('saving')
    await new Promise(resolve => setTimeout(resolve, 350))
    setSubmittedId(`setup-${Date.now().toString().slice(-5)}`)
    setSubmitState('saved')
  }

  return (
    <main className="w-full min-h-screen bg-fg-grey-50 p-6 lg:p-8 space-y-6">
      <header>
        <p className="text-sm font-semibold text-fg-violet-600">Guided setup</p>
        <h1 className="mt-1 text-2xl font-bold text-fg-black">Create monitored workflow</h1>
        <p className="mt-1 text-sm text-fg-grey-600">
          Move through source, mapping, schedule, and review before submitting the workflow.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[clamp(16rem,22vw,20rem)_minmax(0,1fr)]">
        <StepRail activeStep={activeStep} invalid={issues.length > 0} onSelect={setActiveStep} />
        <div className="space-y-4">
          {activeStep === 'source' && <SourceStep draft={draft} onChange={patchDraft} />}
          {activeStep === 'mapping' && <MappingStep draft={draft} onChange={patchDraft} />}
          {activeStep === 'schedule' && <ScheduleStep draft={draft} onChange={patchDraft} />}
          {activeStep === 'review' && (
            <ReviewPanel draft={draft} issues={issues} submitState={submitState} submittedId={submittedId} />
          )}
          <WizardFooter
            activeStep={activeStep}
            canSubmit={issues.length === 0}
            submitState={submitState}
            onBack={() => move(-1)}
            onNext={() => move(1)}
            onSubmit={submitDraft}
          />
        </div>
      </div>
    </main>
  )
}

'use client'

import { Button } from '@forge-ui-official/core'
import { WIZARD_STEPS, type SubmitState, type WizardStepId } from '../utils'

export function WizardFooter({
  activeStep,
  canSubmit,
  submitState,
  onBack,
  onNext,
  onSubmit,
}: {
  activeStep: WizardStepId
  canSubmit: boolean
  submitState: SubmitState
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}) {
  const index = WIZARD_STEPS.findIndex(step => step.id === activeStep)
  const last = index === WIZARD_STEPS.length - 1

  return (
    <footer className="rounded-card border border-fg-grey-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <Button color="grey" variant="secondary" size="sm" disabled={index === 0 || submitState === 'saving'} onClick={onBack}>
          Back
        </Button>
        {last ? (
          <Button color="purple" variant="primary" size="sm" disabled={!canSubmit || submitState === 'saving'} onClick={onSubmit}>
            {submitState === 'saving' ? 'Submitting...' : 'Submit setup'}
          </Button>
        ) : (
          <Button color="purple" variant="primary" size="sm" onClick={onNext}>
            Next step
          </Button>
        )}
      </div>
    </footer>
  )
}

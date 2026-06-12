export type WizardStepId = 'source' | 'mapping' | 'schedule' | 'review'
export type SubmitState = 'idle' | 'saving' | 'saved' | 'error'

export type WizardDraft = {
  sourceName: string
  sourceType: 'database' | 'file' | 'api'
  owner: string
  mappingMode: 'automatic' | 'manual'
  requiredFieldsMapped: boolean
  schedule: 'manual' | 'hourly' | 'daily'
  notifyOnFailure: boolean
}

export const WIZARD_STEPS: Array<{ id: WizardStepId; label: string; description: string }> = [
  { id: 'source', label: 'Source', description: 'Connect or describe the source.' },
  { id: 'mapping', label: 'Mapping', description: 'Validate required fields.' },
  { id: 'schedule', label: 'Schedule', description: 'Set owner, run cadence, and alerts.' },
  { id: 'review', label: 'Review', description: 'Confirm impact before submit.' },
]

export const DEFAULT_DRAFT: WizardDraft = {
  sourceName: 'customer-events-prod',
  sourceType: 'database',
  owner: 'data-ops',
  mappingMode: 'automatic',
  requiredFieldsMapped: true,
  schedule: 'daily',
  notifyOnFailure: true,
}

export function validateDraft(draft: WizardDraft) {
  const issues: string[] = []
  if (!draft.sourceName.trim()) issues.push('Source name is required.')
  if (!draft.owner.trim()) issues.push('Owner is required before scheduling.')
  if (!draft.requiredFieldsMapped) issues.push('Required fields are not fully mapped.')
  return issues
}

export function progressForStep(step: WizardStepId) {
  const index = WIZARD_STEPS.findIndex(item => item.id === step)
  return Math.round(((index + 1) / WIZARD_STEPS.length) * 100)
}

export function previewRows(draft: WizardDraft) {
  return [
    { label: 'Source', value: `${draft.sourceName} · ${draft.sourceType}` },
    { label: 'Mapping', value: draft.requiredFieldsMapped ? `${draft.mappingMode} · ready` : `${draft.mappingMode} · blocked` },
    { label: 'Schedule', value: `${draft.schedule} · owner ${draft.owner || 'unassigned'}` },
    { label: 'Failure alerts', value: draft.notifyOnFailure ? 'enabled' : 'disabled' },
  ]
}

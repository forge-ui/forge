export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export type ActionFormDraft = {
  name: string
  owner: string
  department: string
  scope: string
  policy: string
  priority: string
  dueWindow: string
  note: string
  notifyOwner: boolean
  dryRunFirst: boolean
}

export const OWNER_OPTIONS = [
  { label: 'Mina Chen', value: 'mina' },
  { label: 'Ravi Patel', value: 'ravi' },
  { label: 'Nora Smith', value: 'nora' },
]

export const DEPARTMENT_OPTIONS = [
  { label: 'Risk operations', value: 'risk-ops' },
  { label: 'Data platform', value: 'data-platform' },
  { label: 'Finance control', value: 'finance-control' },
]

export const SCOPE_OPTIONS = [
  { label: 'Current filtered queue', value: 'current-filter' },
  { label: 'Selected high-risk records', value: 'selected-high-risk' },
  { label: 'Full monthly batch', value: 'monthly-batch' },
]

export const POLICY_OPTIONS = [
  { label: 'Standard review policy', value: 'standard-review' },
  { label: 'High-risk escalation', value: 'high-risk' },
  { label: 'Audit-only review', value: 'audit-only' },
]

export const PRIORITY_OPTIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Due today', value: 'today' },
  { label: 'Escalated', value: 'escalated' },
]

export const DEFAULT_ACTION_DRAFT: ActionFormDraft = {
  name: 'High-risk records review',
  owner: 'mina',
  department: 'risk-ops',
  scope: 'selected-high-risk',
  policy: 'high-risk',
  priority: 'today',
  dueWindow: 'Today 18:00',
  note: 'Review records with failed policy checks before report submission.',
  notifyOwner: true,
  dryRunFirst: true,
}

export function completionPercent(draft: ActionFormDraft) {
  const required = [draft.name, draft.owner, draft.department, draft.scope, draft.policy, draft.priority, draft.dueWindow]
  const filled = required.filter(Boolean).length
  return Math.round((filled / required.length) * 100)
}

export function preflightChecks(draft: ActionFormDraft) {
  return [
    {
      label: 'Owner selected',
      pass: Boolean(draft.owner),
      detail: 'Task has a named accountable owner.',
    },
    {
      label: 'Policy locked',
      pass: Boolean(draft.policy),
      detail: 'Review policy is selected before save.',
    },
    {
      label: 'Scope confirmed',
      pass: draft.scope !== '',
      detail: 'The action is bound to a clear record scope.',
    },
    {
      label: 'Notification ready',
      pass: draft.notifyOwner,
      detail: 'Owner will receive the saved task context.',
    },
  ]
}

export function saveStateLabel(state: SaveState) {
  if (state === 'saving') return 'Saving'
  if (state === 'saved') return 'Saved'
  if (state === 'error') return 'Needs fix'
  return 'Draft'
}

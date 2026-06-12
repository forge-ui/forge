export type DetailStatus = 'Open' | 'In review' | 'Resolved' | 'Escalated'

export type DetailEntity = {
  id: string
  name: string
  owner: string
  status: DetailStatus
  severity: 'Low' | 'Medium' | 'High'
  risk: number
  rootCause: string
  impactScope: string
  nextAction: string
}

export const detailEntity: DetailEntity = {
  id: 'ENT-301',
  name: 'Northline review packet',
  owner: 'Maya Chen',
  status: 'In review',
  severity: 'High',
  risk: 91,
  rootCause: 'Required evidence is missing from the packet and the payer rule match is stricter for this segment.',
  impactScope: '$128k value, 4 linked tasks, 2 downstream approvals, same-day SLA.',
  nextAction: 'Collect missing evidence, save resolution, then open the review task board.',
}

export const evidenceFiles = [
  { id: 'clinical-note', name: 'clinical-note.pdf', size: 'Provider fax · OCR 78%' },
  { id: 'policy-rule', name: 'payer-policy.doc', size: 'Rule reference' },
]

export const activityEvents = [
  { title: 'Risk score changed', detail: 'Policy match moved the record into high-risk review.', at: '12m', tone: 'red' as const },
  { title: 'Evidence reviewed', detail: 'Reviewer confirmed the missing packet sections.', at: '38m', tone: 'yellow' as const },
  { title: 'Task linked', detail: 'Downstream board item created for follow-up.', at: '1h', tone: 'purple' as const },
]

export function statusColor(status: DetailStatus) {
  if (status === 'Escalated') return 'red'
  if (status === 'In review') return 'yellow'
  if (status === 'Resolved') return 'green'
  return 'purple'
}

export type TriageStatus = 'new' | 'investigating' | 'waiting' | 'resolved' | 'escalated'
export type TriageSeverity = 'low' | 'medium' | 'high' | 'critical'
export type TriageCategory = 'inventory' | 'address' | 'carrier' | 'payment' | 'quality'

export type TriageItem = {
  id: string
  code: string
  title: string
  status: TriageStatus
  severity: TriageSeverity
  category: TriageCategory
  owner?: string
  sourceRef?: string
  workflowRef?: string
  rootCause?: string
  impactScope?: string
  detectedAt?: string
  resolution?: string
}

export const STATUS_LABEL: Record<TriageStatus, string> = {
  new: 'New',
  investigating: 'Investigating',
  waiting: 'Waiting',
  resolved: 'Resolved',
  escalated: 'Escalated',
}

export const SEVERITY_LABEL: Record<TriageSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export function severityColor(severity: TriageSeverity): 'grey' | 'yellow' | 'red' {
  if (severity === 'critical' || severity === 'high') return 'red'
  if (severity === 'medium') return 'yellow'
  return 'grey'
}

export function statusColor(status: TriageStatus): 'grey' | 'yellow' | 'cyan' | 'green' | 'red' {
  if (status === 'resolved') return 'green'
  if (status === 'escalated') return 'red'
  if (status === 'investigating') return 'cyan'
  if (status === 'waiting') return 'yellow'
  return 'grey'
}

export const SOP_BY_CATEGORY: Record<TriageCategory, string[]> = {
  inventory: ['Confirm available vs reserved quantity.', 'Freeze affected workflow until replenishment ETA is known.', 'Escalate when impact exceeds the local threshold.'],
  address: ['Run validation against customer profile history.', 'Request customer confirmation for missing fields.', 'Do not release until confidence recovers.'],
  carrier: ['Check carrier handoff and alternate capacity.', 'Upgrade time-sensitive records when the first scan is at risk.', 'Notify customer operations.'],
  payment: ['Request billing approval.', 'Release only after risk review clears.', 'Append hold reason to the timeline.'],
  quality: ['Attach evidence.', 'Confirm replacement capacity.', 'Escalate for refund or replacement decision.'],
}

export function similarRecords(item: TriageItem, items: TriageItem[]) {
  return items
    .filter(candidate => candidate.id !== item.id)
    .filter(candidate => candidate.category === item.category || candidate.workflowRef === item.workflowRef)
    .slice(0, 3)
}

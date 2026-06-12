export type QueueStatus = 'New' | 'In review' | 'Blocked' | 'Ready'
export type QueuePriority = 'Low' | 'Medium' | 'High'
export type QueueSegment = 'Fraud' | 'Logistics' | 'Billing'

export type QueueCase = {
  id: string
  name: string
  account: string
  segment: QueueSegment
  owner: string
  status: QueueStatus
  priority: QueuePriority
  risk: number
  slaMinutes: number
  lastActivity: string
  evidenceCount: number
  nextAction: string
  riskReason: string
  route: string
}

export const statusOptions = ['All', 'New', 'In review', 'Blocked', 'Ready'] as const
export const segmentOptions = ['All', 'Fraud', 'Logistics', 'Billing'] as const

export const queueCases: QueueCase[] = [
  {
    id: 'CASE-4318',
    name: 'Refund spike review',
    account: 'Northstar Retail',
    segment: 'Fraud',
    owner: 'Maya',
    status: 'Blocked',
    priority: 'High',
    risk: 92,
    slaMinutes: 38,
    lastActivity: 'Evidence packet updated 12m ago',
    evidenceCount: 4,
    nextAction: 'Request payment logs before approving the refund batch.',
    riskReason: 'Three refunds share the same payout destination.',
    route: '/exceptions/CASE-4318',
  },
  {
    id: 'CASE-4321',
    name: 'Carrier delay exception',
    account: 'Aster Foods',
    segment: 'Logistics',
    owner: 'Owen',
    status: 'In review',
    priority: 'Medium',
    risk: 71,
    slaMinutes: 96,
    lastActivity: 'Owner reassigned 38m ago',
    evidenceCount: 2,
    nextAction: 'Confirm carrier ETA and notify the warehouse lead.',
    riskReason: 'Delay affects two replenishment waves.',
    route: '/exceptions/CASE-4321',
  },
  {
    id: 'CASE-4330',
    name: 'Invoice policy mismatch',
    account: 'Careline Clinics',
    segment: 'Billing',
    owner: 'Iris',
    status: 'Ready',
    priority: 'Low',
    risk: 36,
    slaMinutes: 240,
    lastActivity: 'Checklist completed 1h ago',
    evidenceCount: 3,
    nextAction: 'Mark reviewed after final policy acknowledgement.',
    riskReason: 'Policy mismatch is documented and below escalation threshold.',
    route: '/exceptions/CASE-4330',
  },
]

export function statusColor(status: QueueStatus) {
  if (status === 'Blocked') return 'red'
  if (status === 'In review') return 'yellow'
  if (status === 'Ready') return 'green'
  return 'purple'
}

export function priorityColor(priority: QueuePriority) {
  if (priority === 'High') return 'red'
  if (priority === 'Medium') return 'yellow'
  return 'green'
}

export function filterCases(
  rows: QueueCase[],
  statusFilter: (typeof statusOptions)[number],
  segmentFilter: (typeof segmentOptions)[number],
) {
  return rows.filter(item => {
    const statusMatch = statusFilter === 'All' || item.status === statusFilter
    const segmentMatch = segmentFilter === 'All' || item.segment === segmentFilter
    return statusMatch && segmentMatch
  })
}

export function queueSummary(rows: QueueCase[]) {
  const blocked = rows.filter(item => item.status === 'Blocked').length
  const highRisk = rows.filter(item => item.risk >= 80).length
  const slaAtRisk = rows.filter(item => item.slaMinutes <= 60).length
  const ready = rows.filter(item => item.status === 'Ready').length

  return { blocked, highRisk, slaAtRisk, ready }
}

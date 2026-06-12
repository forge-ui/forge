export type OperationalSignal = {
  id: string
  segment: string
  title: string
  owner: string
  status: 'Healthy' | 'Watch' | 'Blocked'
  risk: number
  value: string
  trend: string
  due: string
}

export type WorkItem = {
  id: string
  name: string
  segment: string
  owner: string
  status: 'Ready' | 'Reviewing' | 'Blocked'
  risk: number
  route: string
}

export type ActivityEvent = {
  title: string
  detail: string
  at: string
  tone: 'purple' | 'blue' | 'green' | 'yellow' | 'red'
}

export const segmentOptions = ['All', 'Enterprise', 'Mid-market', 'SMB'] as const

export const signals: OperationalSignal[] = [
  { id: 'SIG-101', segment: 'Enterprise', title: 'Revenue at risk', owner: 'Maya', status: 'Blocked', risk: 91, value: '$428k', trend: '+18%', due: 'Today' },
  { id: 'SIG-102', segment: 'Mid-market', title: 'Evidence readiness', owner: 'Owen', status: 'Watch', risk: 73, value: '82%', trend: '-6%', due: '4h' },
  { id: 'SIG-103', segment: 'SMB', title: 'Automation coverage', owner: 'Iris', status: 'Healthy', risk: 38, value: '94%', trend: '+5%', due: 'Stable' },
]

export const workItems: WorkItem[] = [
  { id: 'WRK-211', name: 'High-risk queue review', segment: 'Enterprise', owner: 'Maya', status: 'Blocked', risk: 92, route: '/cases' },
  { id: 'WRK-212', name: 'Policy exception triage', segment: 'Mid-market', owner: 'Owen', status: 'Reviewing', risk: 76, route: '/cases/WRK-212' },
  { id: 'WRK-213', name: 'Packet validation batch', segment: 'SMB', owner: 'Iris', status: 'Ready', risk: 45, route: '/tasks' },
]

export const activityEvents: ActivityEvent[] = [
  { title: 'Risk threshold crossed', detail: 'Enterprise queue moved into escalation after three linked blockers.', at: '12m', tone: 'red' },
  { title: 'Evidence uploaded', detail: 'Two missing packet files are now ready for review.', at: '34m', tone: 'yellow' },
  { title: 'Automation recovered', detail: 'Retry policy cleared the SMB backlog.', at: '1h', tone: 'green' },
]

export function statusColor(status: OperationalSignal['status'] | WorkItem['status']) {
  if (status === 'Blocked') return 'red'
  if (status === 'Watch' || status === 'Reviewing') return 'yellow'
  if (status === 'Ready' || status === 'Healthy') return 'green'
  return 'purple'
}

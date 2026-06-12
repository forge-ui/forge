export type QueueEntity = {
  id: string
  name: string
  segment: string
  owner: string
  status: 'New' | 'In review' | 'Blocked' | 'Ready'
  priority: 'Low' | 'Medium' | 'High'
  risk: number
  nextAction: string
  lastActivity: string
  route: string
}

export const statusOptions = ['All', 'New', 'In review', 'Blocked', 'Ready'] as const
export const segmentOptions = ['All', 'Clinical', 'Finance', 'Operations'] as const

export const queueEntities: QueueEntity[] = [
  { id: 'ENT-301', name: 'Northline review packet', segment: 'Clinical', owner: 'Maya', status: 'Blocked', priority: 'High', risk: 91, nextAction: 'Request missing evidence and keep escalation open.', lastActivity: 'Risk changed 12m ago', route: '/entities/ENT-301' },
  { id: 'ENT-302', name: 'Aster policy exception', segment: 'Finance', owner: 'Owen', status: 'In review', priority: 'Medium', risk: 72, nextAction: 'Confirm threshold override before submission.', lastActivity: 'Owner updated 38m ago', route: '/entities/ENT-302' },
  { id: 'ENT-303', name: 'Care plan ready batch', segment: 'Operations', owner: 'Iris', status: 'Ready', priority: 'Low', risk: 34, nextAction: 'Submit after final checklist approval.', lastActivity: 'Checklist completed 1h ago', route: '/entities/ENT-303' },
]

export function statusColor(status: QueueEntity['status']) {
  if (status === 'Blocked') return 'red'
  if (status === 'In review') return 'yellow'
  if (status === 'Ready') return 'green'
  return 'purple'
}

export function priorityColor(priority: QueueEntity['priority']) {
  if (priority === 'High') return 'red'
  if (priority === 'Medium') return 'yellow'
  return 'green'
}

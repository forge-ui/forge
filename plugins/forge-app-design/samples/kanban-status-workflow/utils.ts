export type WorkflowStatus = 'pending' | 'running' | 'success' | 'failed'

export type WorkflowItem = {
  id: string
  title: string
  owner?: string
  status: WorkflowStatus
  schedule?: string
  lastRun?: string
  nextRun?: string
  runCount?: number
  relatedHref?: string
}

export const STATUS_COLUMNS: WorkflowStatus[] = ['pending', 'running', 'success', 'failed']

export const STATUS_THEME: Record<
  WorkflowStatus,
  { label: string; labelColor: 'gray' | 'cyan' | 'green' | 'red'; progressColor: 'gray' | 'cyan' | 'green' | 'red' }
> = {
  pending: { label: 'Pending', labelColor: 'gray', progressColor: 'gray' },
  running: { label: 'Running', labelColor: 'cyan', progressColor: 'cyan' },
  success: { label: 'Success', labelColor: 'green', progressColor: 'green' },
  failed: { label: 'Failed', labelColor: 'red', progressColor: 'red' },
}

export function statusProgress(status: WorkflowStatus): number {
  if (status === 'pending') return 20
  if (status === 'running') return 62
  if (status === 'success') return 100
  return 78
}

export function humanizeSchedule(value: string | undefined): string {
  if (!value) return 'no schedule'
  const map: Record<string, string> = {
    '* * * * *': 'every minute',
    '*/5 * * * *': 'every 5 min',
    '*/15 * * * *': 'every 15 min',
    '0 * * * *': 'hourly',
    '0 0 * * *': 'daily',
    '0 9 * * *': 'daily at 09:00',
    '0 0 * * 0': 'weekly',
  }
  return map[value] ?? value
}

export function groupByStatus(items: WorkflowItem[]): Record<WorkflowStatus, WorkflowItem[]> {
  const grouped: Record<WorkflowStatus, WorkflowItem[]> = {
    pending: [],
    running: [],
    success: [],
    failed: [],
  }
  for (const item of items) grouped[item.status ?? 'pending'].push(item)
  return grouped
}

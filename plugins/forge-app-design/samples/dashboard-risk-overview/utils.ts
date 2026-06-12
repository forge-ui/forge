export type PrimaryRecord = {
  id: string
  status?: string
  priority?: string
  slaMinutesLeft?: number
}

export type WorkflowRecord = {
  id: string
  code: string
  title: string
  status: 'queued' | 'running' | 'healthy' | 'blocked' | 'done'
  progress?: number
  exceptionCount?: number
  nextAction?: string
  href: string
}

export type RiskRecord = {
  id: string
  code: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  summary: string
  href: string
}

export type ContextRecord = {
  id: string
  title: string
  status: 'healthy' | 'degraded' | 'blocked'
  subtitle: string
  metric: string
  href: string
}

export function severityColor(severity: RiskRecord['severity']): 'grey' | 'yellow' | 'red' {
  if (severity === 'critical' || severity === 'high') return 'red'
  if (severity === 'medium') return 'yellow'
  return 'grey'
}

export function contextColor(status: ContextRecord['status']): 'green' | 'yellow' | 'red' {
  if (status === 'blocked') return 'red'
  if (status === 'degraded') return 'yellow'
  return 'green'
}

export function blockedWorkflows(records: WorkflowRecord[]) {
  return records.filter(record => record.status === 'blocked' || (record.exceptionCount ?? 0) > 0)
}

export function atRiskPrimary(records: PrimaryRecord[]) {
  return records.filter(record => (record.slaMinutesLeft ?? 9999) < 240 || record.status === 'exception')
}

'use client'

import { StatCard } from '@forge-ui-official/core'
import { atRiskPrimary, blockedWorkflows, type PrimaryRecord, type RiskRecord, type WorkflowRecord } from '../utils'

export function HealthStats({
  primaryRecords,
  workflowRecords,
  riskRecords,
}: {
  primaryRecords: PrimaryRecord[]
  workflowRecords: WorkflowRecord[]
  riskRecords: RiskRecord[]
}) {
  const atRisk = atRiskPrimary(primaryRecords).length
  const blocked = blockedWorkflows(workflowRecords).length
  const critical = riskRecords.filter(record => record.severity === 'critical').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="At-risk records" value={String(atRisk)} theme="red" size="sm" subtitle="Needs decision today" />
      <StatCard title="Blocked workflows" value={String(blocked)} theme="yellow" size="sm" subtitle="Cannot progress automatically" />
      <StatCard title="Critical signals" value={String(critical)} theme="purple" size="sm" subtitle="Open severity critical" />
    </div>
  )
}

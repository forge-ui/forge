import { Label, ProgressBar, SurfaceCard } from '@forge-ui-official/core'
import { queueSummary, type QueueCase } from '../utils'

export function QueueWorkloadSummary({ rows }: { rows: QueueCase[] }) {
  const summary = queueSummary(rows)
  const riskShare = rows.length === 0 ? 0 : Math.round((summary.highRisk / rows.length) * 100)

  return (
    <SurfaceCard title="Workload signal" subtitle="Compact context only; keep table rows visible first." padding="sm">
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
        <SummaryMetric label="Blocked" value={`${summary.blocked}`} tone="red" />
        <SummaryMetric label="High risk" value={`${summary.highRisk}`} tone="yellow" />
        <SummaryMetric label="SLA under 60m" value={`${summary.slaAtRisk}`} tone="purple" />
        <SummaryMetric label="Ready" value={`${summary.ready}`} tone="green" />
      </div>
      <div className="mt-4">
        <ProgressBar value={riskShare} color={riskShare >= 60 ? 'red' : 'purple'} label="High-risk share" showPercentage />
      </div>
    </SurfaceCard>
  )
}

function SummaryMetric({ label, value, tone }: { label: string; value: string; tone: 'red' | 'yellow' | 'purple' | 'green' }) {
  return (
    <div className="min-w-0 rounded-card bg-fg-grey-50 px-4 py-3 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-fg-grey-600">{label}</p>
        <Label color={tone}>{value}</Label>
      </div>
    </div>
  )
}

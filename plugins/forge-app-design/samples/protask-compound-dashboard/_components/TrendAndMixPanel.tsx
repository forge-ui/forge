import { BarChart, ChartCard, HalfDonutChart, ProgressBar } from '@forge-ui-official/core'
import type { OperationalSignal, WorkItem } from '../utils'

export function TrendAndMixPanel({ signals, workItems }: { signals: OperationalSignal[]; workItems: WorkItem[] }) {
  const readiness = Math.max(12, 100 - Math.round(signals.reduce((sum, item) => sum + item.risk, 0) / Math.max(1, signals.length)))
  const blocked = workItems.filter(item => item.status === 'Blocked').length

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(clamp(16rem,24vw,22rem),0.65fr)]">
      <ChartCard title="Risk trend" subtitle="Operating risk by recent interval.">
        <BarChart
          data={[38, 44, 51, 49, 63, 72, 66, 81].map((value, index) => ({ value, label: `P${index + 1}` }))}
          accent="purple"
          activeIndex={7}
          barWidth="wide"
          showLabels
          showTooltip
          tooltipValue="81"
          tooltipTrend="up"
          height="h-56"
        />
      </ChartCard>

      <ChartCard title="Readiness mix" subtitle="Ready work before escalation.">
        <HalfDonutChart segments={[{ value: readiness }]} centerValue={`${readiness}%`} trend="ready" trendDirection={readiness >= 80 ? 'up' : 'down'} subtitle="Ready to proceed" />
        <div className="mt-5 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs text-fg-grey-500"><span>Blocked workflows</span><span>{blocked}</span></div>
            <ProgressBar value={blocked * 28} color={blocked > 0 ? 'red' : 'green'} size="sm" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-fg-grey-500"><span>Ready queue</span><span>{workItems.length - blocked}</span></div>
            <ProgressBar value={readiness} color={readiness >= 80 ? 'green' : 'yellow'} size="sm" />
          </div>
        </div>
      </ChartCard>
    </div>
  )
}

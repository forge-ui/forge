import { BarChartStatCard, ProgressStatCard } from '@forge-ui-official/core'
import type { OperationalSignal } from '../utils'

export function SignalHero({ signals }: { signals: OperationalSignal[] }) {
  const blocked = signals.filter(item => item.status === 'Blocked').length
  const averageRisk = Math.round(signals.reduce((sum, item) => sum + item.risk, 0) / Math.max(1, signals.length))
  const highRisk = signals.filter(item => item.risk >= 70).length

  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
      <ProgressStatCard
        title="Protected value"
        value={signals[0]?.value ?? '$0'}
        subtitle={`${signals.length} active operating signals`}
        trend={signals[0]?.trend ?? 'flat'}
        trendDirection={averageRisk >= 70 ? 'down' : 'up'}
        theme={averageRisk >= 80 ? 'red' : 'purple'}
        size="lg"
        progressValue={Math.max(0, 100 - averageRisk)}
        progressColor={averageRisk >= 80 ? 'red' : 'purple'}
      />
      <BarChartStatCard title="High risk" value={String(highRisk)} subtitle="Needs same-day review" trend="+3" theme="yellow" size="sm" barColor="yellow" bars={[8, 10, 7, 12, 14]} />
      <BarChartStatCard title="Blocked" value={String(blocked)} subtitle="Workflow cannot proceed" trend="+1" theme={blocked > 0 ? 'red' : 'green'} size="sm" barColor={blocked > 0 ? 'red' : 'green'} bars={[1, 2, 1, 3, blocked + 1]} />
    </div>
  )
}

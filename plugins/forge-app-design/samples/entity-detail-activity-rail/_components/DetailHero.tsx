import { Avatar, Button, ProgressBar, StatusBadge } from '@forge-ui-official/core'
import type { DetailEntity } from '../utils'
import { statusColor } from '../utils'

export function DetailHero({ item, onOpenWorkflow }: { item: DetailEntity; onOpenWorkflow: () => void }) {
  return (
    <section className="rounded-card border border-fg-grey-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <Avatar initials={item.name.slice(0, 2).toUpperCase()} alt={item.name} size="lg" color={item.risk >= 80 ? 'orange' : 'purple'} />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-violet-600">{item.id}</p>
            <h1 className="mt-1 text-3xl font-semibold text-fg-grey-950">{item.name}</h1>
            <p className="mt-2 text-sm leading-6 text-fg-grey-600">Owner {item.owner} · {item.impactScope}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={item.status} color={statusColor(item.status)} />
          <StatusBadge label={item.severity} color={item.severity === 'High' ? 'red' : item.severity === 'Medium' ? 'yellow' : 'green'} />
          <Button size="sm" color="purple" onClick={onOpenWorkflow}>Open workflow</Button>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-1 flex justify-between text-xs text-fg-grey-500"><span>Risk score</span><span>{item.risk}</span></div>
        <ProgressBar value={item.risk} color={item.risk >= 80 ? 'red' : 'yellow'} size="sm" />
      </div>
    </section>
  )
}

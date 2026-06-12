import Link from 'next/link'
import { Button, FileCard, HistoryItem, ProgressBar, StatusBadge } from '@forge-ui-official/core'
import type { QueueEntity } from '../utils'
import { priorityColor, statusColor } from '../utils'

export function EntityInsightPanel({ item }: { item: QueueEntity | undefined }) {
  if (!item) {
    return (
      <aside className="rounded-card border border-dashed border-fg-grey-300 bg-white p-5">
        <p className="text-sm font-semibold text-fg-grey-950">No rows match this filter</p>
        <p className="mt-2 text-sm text-fg-grey-500">Relax a filter or create a new review item.</p>
      </aside>
    )
  }

  return (
    <aside className="rounded-card border border-fg-violet-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fg-grey-950">{item.name}</h2>
          <p className="mt-1 text-xs text-fg-grey-500">{item.id} · owner {item.owner}</p>
        </div>
        <StatusBadge label={item.status} color={statusColor(item.status)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge label={item.priority} color={priorityColor(item.priority)} />
        <span className="rounded-full bg-fg-grey-100 px-3 py-1 text-xs font-semibold text-fg-grey-700">{item.segment}</span>
      </div>
      <div className="mt-5">
        <div className="mb-1 flex justify-between text-xs text-fg-grey-500"><span>Risk score</span><span>{item.risk}</span></div>
        <ProgressBar value={item.risk} color={item.risk >= 80 ? 'red' : 'yellow'} size="sm" />
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold text-fg-grey-950">Next action</p>
        <p className="mt-1 text-sm leading-6 text-fg-grey-600">{item.nextAction}</p>
      </div>
      <div className="mt-5 space-y-2">
        <FileCard file={{ id: `${item.id}-evidence`, name: `${item.id}-evidence.pdf`, size: 'Evidence packet' }} />
        <FileCard file={{ id: `${item.id}-policy`, name: `${item.segment}-policy.doc`, size: 'Rule reference' }} />
      </div>
      <div className="mt-5 space-y-3">
        <HistoryItem variant="regular" color="yellow" title="Preview opened" description={item.lastActivity} datetime="now" showDatetime="inline" showConnector />
        <HistoryItem variant="regular" color="purple" title="Workflow ready" description={item.nextAction} datetime="12m" showDatetime="inline" />
      </div>
      <Link href={item.route} className="mt-5 block">
        <Button size="md" color="purple">Open full detail</Button>
      </Link>
    </aside>
  )
}

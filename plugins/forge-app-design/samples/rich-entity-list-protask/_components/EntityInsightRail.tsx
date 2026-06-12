import { Button, FileCard, HistoryItem, Label, ProgressBar, StyledLink, SurfaceCard } from '@forge-ui-official/core'
import { priorityColor, statusColor, type QueueCase } from '../utils'

export function EntityInsightRail({
  item,
  reviewed,
  onMarkReviewed,
}: {
  item: QueueCase | undefined
  reviewed: boolean
  onMarkReviewed: (id: string) => void
}) {
  if (!item) {
    return (
      <SurfaceCard title="No matching rows" subtitle="Relax a filter or create a new exception from the toolbar." padding="lg">
        <StyledLink href="/exceptions/new">Create exception</StyledLink>
      </SurfaceCard>
    )
  }

  return (
    <aside className="space-y-4">
      <SurfaceCard
        title={item.name}
        subtitle={`${item.id} · ${item.account}`}
        action={<Label color={reviewed ? 'green' : statusColor(item.status)}>{reviewed ? 'Reviewed' : item.status}</Label>}
        padding="lg"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Label color={priorityColor(item.priority)}>{item.priority}</Label>
            <Label color={item.slaMinutes <= 60 ? 'red' : 'purple'}>{item.slaMinutes}m SLA</Label>
            <Label color="gray">{item.segment}</Label>
          </div>
          <ProgressBar value={item.risk} color={item.risk >= 80 ? 'red' : 'yellow'} label="Risk score" showPercentage />
          <div>
            <p className="text-sm font-semibold text-fg-black">Risk reason</p>
            <p className="mt-1 text-sm leading-6 text-fg-grey-700">{item.riskReason}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-fg-black">Next action</p>
            <p className="mt-1 text-sm leading-6 text-fg-grey-700">{item.nextAction}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button color="purple" variant="primary" disabled={reviewed} onClick={() => onMarkReviewed(item.id)}>
              {reviewed ? 'Reviewed' : 'Mark reviewed'}
            </Button>
            <StyledLink href={item.route}>Open full detail</StyledLink>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard title="Evidence" subtitle="Files and policy context used for the row decision." padding="lg">
        <div className="space-y-3">
          <FileCard file={{ id: `${item.id}-timeline`, name: `${item.id}-timeline.pdf`, size: 'Evidence packet' }} />
          <FileCard file={{ id: `${item.id}-policy`, name: `${item.segment}-policy.doc`, size: 'Rule reference' }} />
        </div>
      </SurfaceCard>

      <SurfaceCard title="Activity" subtitle="Recent changes that explain row priority." padding="lg">
        <div className="space-y-1">
          <HistoryItem variant="regular" color="yellow" title="Queue priority changed" description={item.lastActivity} datetime="now" showDatetime="inline" showConnector />
          <HistoryItem variant="regular" color="purple" title="Next workflow ready" description={item.nextAction} datetime="12m" showDatetime="inline" />
        </div>
      </SurfaceCard>
    </aside>
  )
}

import Link from 'next/link'
import { Button, DataTable, HistoryItem, StatusBadge, SurfaceCard } from '@forge-ui-official/core'
import type { ColumnDef } from '@forge-ui-official/core'
import type { ActivityEvent, WorkItem } from '../utils'
import { statusColor } from '../utils'

export function PriorityWorkRail({ workItems, activityEvents }: { workItems: WorkItem[]; activityEvents: ActivityEvent[] }) {
  const priorityPreview = workItems.slice(0, 2)
  const columns: ColumnDef<WorkItem>[] = [
    { key: 'name', header: 'Work', width: 'w-[clamp(13rem,24vw,18rem)]', render: item => <div><p className="font-semibold text-fg-grey-950">{item.name}</p><p className="text-xs text-fg-grey-500">{item.id} · {item.segment}</p></div> },
    { key: 'owner', header: 'Owner', width: 'w-[clamp(7rem,10vw,9rem)]', render: item => <span className="text-sm text-fg-grey-700">{item.owner}</span> },
    { key: 'status', header: 'Status', width: 'w-[clamp(8rem,11vw,10rem)]', render: item => <StatusBadge label={item.status} color={statusColor(item.status)} /> },
    { key: 'risk', header: 'Risk', width: 'w-[clamp(5rem,8vw,7rem)]', render: item => <span className="font-semibold text-fg-grey-950">{item.risk}</span> },
    { key: 'action', header: '', width: 'w-[clamp(6rem,10vw,8rem)]', render: item => <Link href={item.route}><Button size="sm" color="purple">Open</Button></Link> },
  ]

  return (
    <aside className="space-y-4">
      <SurfaceCard
        title="Priority work"
        subtitle="Rows include identity, status, owner, risk, and a real workflow link."
        padding="sm"
      >
        <DataTable rows={priorityPreview} columns={columns} className="[&_td]:px-4 [&_td]:py-2 [&_th]:px-4 [&_th]:py-2" />
      </SurfaceCard>

      <SurfaceCard title="Live activity" padding="sm">
        <div className="space-y-0">
          {activityEvents.map((item, index) => (
            <HistoryItem key={item.title} variant="badge" color={item.tone} title={item.title} description={item.detail} datetime={item.at} showDatetime="inline" showConnector={index < activityEvents.length - 1} />
          ))}
        </div>
      </SurfaceCard>
    </aside>
  )
}

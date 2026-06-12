import Link from 'next/link'
import { Avatar, Button, DataTable, ProgressBar, StatusBadge } from '@forge-ui-official/core'
import type { ColumnDef } from '@forge-ui-official/core'
import type { QueueEntity } from '../utils'
import { priorityColor, statusColor } from '../utils'

export function EntityQueueTable({ rows, onSelect }: { rows: QueueEntity[]; onSelect: (id: string) => void }) {
  const columns: ColumnDef<QueueEntity>[] = [
    {
      key: 'name',
      header: 'Entity',
      width: 'w-[clamp(14rem,24vw,20rem)]',
      render: item => (
        <div className="flex items-center gap-3">
          <Avatar initials={item.name.slice(0, 2).toUpperCase()} alt={item.name} size="md" color={item.risk >= 80 ? 'orange' : 'purple'} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-fg-grey-950">{item.name}</p>
            <p className="mt-1 text-xs text-fg-grey-500">{item.id} · {item.segment} · {item.lastActivity}</p>
          </div>
        </div>
      ),
    },
    { key: 'status', header: 'Status', width: 'w-[clamp(8rem,11vw,10rem)]', render: item => <StatusBadge label={item.status} color={statusColor(item.status)} /> },
    { key: 'priority', header: 'Priority', width: 'w-[clamp(7rem,9vw,9rem)]', render: item => <StatusBadge label={item.priority} color={priorityColor(item.priority)} /> },
    { key: 'owner', header: 'Owner', width: 'w-[clamp(7rem,9vw,9rem)]', render: item => <span className="text-sm font-medium text-fg-grey-800">{item.owner}</span> },
    { key: 'risk', header: 'Risk', width: 'w-[clamp(9rem,12vw,11rem)]', render: item => <div><p className="mb-1 text-xs font-semibold text-fg-grey-700">{item.risk}</p><ProgressBar value={item.risk} color={item.risk >= 80 ? 'red' : item.risk >= 65 ? 'yellow' : 'green'} size="sm" /></div> },
    { key: 'action', header: '', width: 'w-[clamp(9rem,12vw,12rem)]', render: item => <div className="flex gap-2"><Button size="sm" variant="secondary" color="purple" onClick={() => onSelect(item.id)}>Preview</Button><Link href={item.route}><Button size="sm" color="black">Open</Button></Link></div> },
  ]

  return (
    <section className="min-w-0 rounded-card border border-fg-grey-200 bg-white p-4 shadow-sm">
      <DataTable rows={rows} columns={columns} showCheckbox showPagination currentPage={1} totalPages={2} />
    </section>
  )
}

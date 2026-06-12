import { Avatar, Button, DataTable, Label, ProgressBar, StyledLink } from '@forge-ui-official/core'
import type { ColumnDef } from '@forge-ui-official/core'
import { priorityColor, statusColor, type QueueCase } from '../utils'

export function EntityQueueTable({
  rows,
  selectedId,
  onSelect,
}: {
  rows: QueueCase[]
  selectedId: string | undefined
  onSelect: (id: string) => void
}) {
  const columns: ColumnDef<QueueCase>[] = [
    {
      key: 'identity',
      header: 'Case',
      width: 'w-[clamp(13rem,24vw,17rem)]',
      render: item => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar initials={item.account.slice(0, 2).toUpperCase()} alt={item.account} size="md" color={item.risk >= 80 ? 'orange' : 'purple'} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-fg-black">{item.name}</p>
            <p className="mt-1 truncate text-xs text-fg-grey-700">{item.id} · {item.account} · {item.evidenceCount} files · {item.lastActivity}</p>
          </div>
        </div>
      ),
    },
    { key: 'status', header: 'Status', width: 'w-[clamp(5.5rem,9vw,7rem)]', render: item => <Label color={statusColor(item.status)}>{item.status}</Label> },
    { key: 'priority', header: 'Priority', width: 'w-[clamp(5rem,8vw,6.5rem)]', render: item => <Label color={priorityColor(item.priority)}>{item.priority}</Label> },
    { key: 'owner', header: 'Owner', width: 'w-[clamp(5rem,8vw,7rem)]', render: item => <span className="text-sm font-semibold text-fg-grey-800">{item.owner}</span> },
    {
      key: 'risk',
      header: 'Risk',
      width: 'w-[clamp(7rem,11vw,9rem)]',
      render: item => (
        <div>
          <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold text-fg-grey-700">
            <span>{item.risk}</span>
            <span>{item.slaMinutes}m SLA</span>
          </div>
          <ProgressBar value={item.risk} color={item.risk >= 80 ? 'red' : item.risk >= 65 ? 'yellow' : 'green'} size="sm" />
        </div>
      ),
    },
    {
      key: 'action',
      header: '',
      width: 'w-[clamp(7rem,12vw,10rem)]',
      render: item => (
        <div className="flex h-10 items-center justify-end gap-2">
          <Button size="sm" variant={selectedId === item.id ? 'primary' : 'secondary'} color="purple" onClick={() => onSelect(item.id)}>
            Preview
          </Button>
          <StyledLink href={item.route} color="gray">Open</StyledLink>
        </div>
      ),
    },
  ]

  return (
    <div className="min-w-0 overflow-x-auto">
      <DataTable
        title="Decision queue"
        subtitle="Rows carry identity, owner, risk, evidence, and action."
        rows={rows}
        columns={columns}
        showCheckbox
        showPagination
        currentPage={1}
        totalPages={2}
        className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3"
      />
    </div>
  )
}

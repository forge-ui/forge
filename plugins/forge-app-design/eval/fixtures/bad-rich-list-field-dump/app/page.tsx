import { DataTable } from '@forge-ui-official/core'

const rows = [
  { id: 'EX-1', name: 'Refund exception', status: 'Blocked', owner: 'Maya', priority: 'High' },
]

export default function Page() {
  return (
    <main className="w-full min-h-full space-y-6">
      <h1 className="text-display-l font-semibold tracking-fg text-fg-black">Exception queue</h1>
      <DataTable
        rows={rows}
        showCheckbox
        showPagination
        columns={[
          { key: 'name', header: 'Name', render: row => row.name },
          { key: 'status', header: 'Status', render: row => row.status },
          { key: 'owner', header: 'Owner', render: row => row.owner },
          { key: 'priority', header: 'Priority', render: row => row.priority },
        ]}
      />
    </main>
  )
}

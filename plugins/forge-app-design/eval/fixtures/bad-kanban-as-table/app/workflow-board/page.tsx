import { DataTable, StatusBadge } from '@forge-ui-official/core'

const rows = [
  { id: 'WF-1', name: 'Policy sync', status: 'queued', owner: 'Ops' },
  { id: 'WF-2', name: 'Claims replay', status: 'blocked', owner: 'Risk' },
]

export default function BoardAsTableFixture() {
  return (
    <main className="w-full min-h-full space-y-6">
      <h1 className="text-2xl font-semibold text-fg-black">Workflow board</h1>
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', header: 'Name', render: row => row.name },
          { key: 'owner', header: 'Owner', render: row => row.owner },
          { key: 'status', header: 'Status', render: row => <StatusBadge label={row.status} color="gray" /> },
        ]}
      />
    </main>
  )
}

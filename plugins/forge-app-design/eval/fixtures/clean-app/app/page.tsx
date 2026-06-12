'use client'

import { PageHeader, DataTable, StatCard, StatusBadge } from '@forge-ui-official/core'

type Row = { id: string; name: string; status: string }

const rows: Row[] = [
  { id: '1', name: 'Acme Inc', status: 'active' },
  { id: '2', name: 'Beta Co', status: 'paused' },
]

export default function Page() {
  return (
    <main className="w-full min-h-full space-y-6">
      <PageHeader title="Customers" subtitle="120 total" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total" value="120" theme="purple" />
        <StatCard title="Active" value="98" theme="green" />
        <StatCard title="Churned" value="22" theme="red" />
      </div>

      <DataTable
        rows={rows}
        columns={[
          { key: 'name', header: 'Name', render: (r: Row) => r.name },
          {
            key: 'status',
            header: 'Status',
            render: (r: Row) => <StatusBadge label={r.status} color="green" />,
          },
        ]}
      />
    </main>
  )
}

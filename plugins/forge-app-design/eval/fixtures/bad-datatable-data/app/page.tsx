'use client'

import { DataTable } from '@forge-ui-official/core'

export default function Page() {
  return (
    <main className="p-8">
      <DataTable data={[]} columns={[{ key: 'name', header: 'Name', render: () => 'Name' }]} />
    </main>
  )
}

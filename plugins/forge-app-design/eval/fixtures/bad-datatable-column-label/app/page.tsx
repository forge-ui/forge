'use client'

import { DataTable } from '@forge-ui-official/core'

export default function Page() {
  return (
    <main>
      <DataTable rows={[]} columns={[{ key: 'name', label: 'Name', render: () => 'Name' }]} />
    </main>
  )
}

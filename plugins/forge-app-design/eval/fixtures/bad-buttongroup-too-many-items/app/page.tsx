'use client'

import { ButtonGroup } from '@forge-ui-official/core'

const statuses = ['All', 'New', 'In review', 'Pending documents', 'Escalated', 'Denied', 'Approved'] as const

export default function Page() {
  return (
    <main className="p-8">
      <ButtonGroup
        items={statuses.map(status => ({ label: status }))}
        activeIndex={0}
        color="purple"
        shape="pill"
      />
    </main>
  )
}

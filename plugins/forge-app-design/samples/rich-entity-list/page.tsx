'use client'

import { useMemo, useState } from 'react'
import { EntityInsightPanel } from './_components/EntityInsightPanel'
import { EntityQueueTable } from './_components/EntityQueueTable'
import { QueueFilters } from './_components/QueueFilters'
import { queueEntities, segmentOptions, statusOptions } from './utils'

export default function RichEntityListSample() {
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All')
  const [segmentFilter, setSegmentFilter] = useState<(typeof segmentOptions)[number]>('All')
  const [selectedId, setSelectedId] = useState(queueEntities[0]?.id)
  const rows = useMemo(() => {
    return queueEntities.filter(item => {
      const statusMatch = statusFilter === 'All' || item.status === statusFilter
      const segmentMatch = segmentFilter === 'All' || item.segment === segmentFilter
      return statusMatch && segmentMatch
    })
  }, [segmentFilter, statusFilter])
  const selected = queueEntities.find(item => item.id === selectedId) ?? rows[0]

  return (
    <main className="w-full min-h-screen bg-fg-grey-50 p-6">
      <div className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-fg-violet-600">Operational queue</p>
          <h1 className="mt-1 text-3xl font-semibold text-fg-grey-950">Entity review queue</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-fg-grey-600">
            Filter, preview, and open high-risk entities without losing table context.
          </p>
        </header>

        <QueueFilters
          statusFilter={statusFilter}
          segmentFilter={segmentFilter}
          onStatusFilterChange={setStatusFilter}
          onSegmentFilterChange={setSegmentFilter}
        />

        <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_clamp(18rem,24vw,24rem)]">
          <EntityQueueTable rows={rows} onSelect={setSelectedId} />
          <EntityInsightPanel item={selected} />
        </div>
      </div>
    </main>
  )
}

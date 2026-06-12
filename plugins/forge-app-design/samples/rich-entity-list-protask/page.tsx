'use client'

import { useMemo, useState } from 'react'
import { EntityInsightRail } from './_components/EntityInsightRail'
import { EntityQueueTable } from './_components/EntityQueueTable'
import { QueueCommandBar } from './_components/QueueCommandBar'
import { QueueWorkloadSummary } from './_components/QueueWorkloadSummary'
import { filterCases, queueCases, segmentOptions, statusOptions } from './utils'

export default function RichEntityListProtaskSample() {
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All')
  const [segmentFilter, setSegmentFilter] = useState<(typeof segmentOptions)[number]>('All')
  const [selectedId, setSelectedId] = useState(queueCases[0]?.id)
  const [reviewedIds, setReviewedIds] = useState<string[]>([])

  const rows = useMemo(() => filterCases(queueCases, statusFilter, segmentFilter), [segmentFilter, statusFilter])
  const selected = rows.find(item => item.id === selectedId) ?? rows[0]

  function markReviewed(id: string) {
    setReviewedIds(current => (current.includes(id) ? current : [...current, id]))
  }

  return (
    <main className="w-full min-h-full space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-fg-black">Exception queue</h1>
        <p className="max-w-3xl text-sm leading-6 text-fg-grey-700">
          Review risk, owner, evidence, SLA, and next action before opening the full case.
        </p>
      </header>

      <QueueCommandBar
        statusFilter={statusFilter}
        segmentFilter={segmentFilter}
        onStatusFilterChange={setStatusFilter}
        onSegmentFilterChange={setSegmentFilter}
      />

      <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_clamp(18rem,24vw,24rem)]">
        <EntityQueueTable rows={rows} selectedId={selected?.id} onSelect={setSelectedId} />
        <div className="space-y-4">
          <QueueWorkloadSummary rows={rows} />
          <EntityInsightRail item={selected} reviewed={Boolean(selected && reviewedIds.includes(selected.id))} onMarkReviewed={markReviewed} />
        </div>
      </div>
    </main>
  )
}

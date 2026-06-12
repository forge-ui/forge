import { ButtonGroup } from '@forge-ui-official/core'
import { segmentOptions, statusOptions } from '../utils'

export function QueueFilters({
  statusFilter,
  segmentFilter,
  onStatusFilterChange,
  onSegmentFilterChange,
}: {
  statusFilter: (typeof statusOptions)[number]
  segmentFilter: (typeof segmentOptions)[number]
  onStatusFilterChange: (value: (typeof statusOptions)[number]) => void
  onSegmentFilterChange: (value: (typeof segmentOptions)[number]) => void
}) {
  return (
    <section className="rounded-card border border-fg-grey-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-2">
        <ButtonGroup items={statusOptions.map(item => ({ label: item }))} activeIndex={statusOptions.indexOf(statusFilter)} color="purple" shape="pill" onChange={index => onStatusFilterChange(statusOptions[index])} className="max-w-full flex-wrap" />
        <ButtonGroup items={segmentOptions.map(item => ({ label: item }))} activeIndex={segmentOptions.indexOf(segmentFilter)} color="blue" shape="pill" onChange={index => onSegmentFilterChange(segmentOptions[index])} className="max-w-full flex-wrap" />
      </div>
    </section>
  )
}

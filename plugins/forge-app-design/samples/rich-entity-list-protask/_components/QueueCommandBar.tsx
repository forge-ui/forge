import { ButtonGroup, StyledLink, SurfaceCard } from '@forge-ui-official/core'
import { segmentOptions, statusOptions } from '../utils'

export function QueueCommandBar({
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
    <SurfaceCard padding="sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-[min(18rem,100%)] flex-1">
          <p className="mb-2 text-xs font-semibold text-fg-grey-600">Status</p>
          <ButtonGroup
            items={statusOptions.map(item => ({ label: item }))}
            activeIndex={statusOptions.indexOf(statusFilter)}
            color="purple"
            shape="pill"
            onChange={index => onStatusFilterChange(statusOptions[index])}
          />
        </div>
        <div className="min-w-[min(16rem,100%)] flex-1">
          <p className="mb-2 text-xs font-semibold text-fg-grey-600">Segment</p>
          <ButtonGroup
            items={segmentOptions.map(item => ({ label: item }))}
            activeIndex={segmentOptions.indexOf(segmentFilter)}
            color="blue"
            shape="pill"
            onChange={index => onSegmentFilterChange(segmentOptions[index])}
          />
        </div>
        <div className="shrink-0 pb-2">
          <StyledLink href="/exceptions/new">Create exception</StyledLink>
        </div>
      </div>
    </SurfaceCard>
  )
}

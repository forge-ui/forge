'use client'

import { Label, SurfaceCard } from '@forge-ui-official/core'
import { JobCard } from './JobCard'
import { STATUS_THEME, type WorkflowItem, type WorkflowStatus } from '../utils'

export function KanbanColumn({
  status,
  items,
  loading,
  triggeringId,
  onTrigger,
}: {
  status: WorkflowStatus
  items: WorkflowItem[]
  loading: boolean
  triggeringId: string | null
  onTrigger: (id: string) => void
}) {
  const theme = STATUS_THEME[status]

  if (loading) {
    return (
      <SurfaceCard padding="sm" className="min-h-[min(24rem,60vh)] animate-pulse">
        <div className="min-h-[10rem] rounded-card bg-fg-grey-100" />
      </SurfaceCard>
    )
  }

  return (
    <SurfaceCard
      title={theme.label}
      action={<Label color={theme.labelColor}>{items.length}</Label>}
      padding="sm"
      className="min-h-[min(24rem,60vh)]"
    >
      {items.length === 0 ? (
        <div className="rounded-card border border-dashed border-fg-grey-300 bg-fg-grey-50 p-6 text-center">
          <p className="text-sm text-fg-grey-500">No items in this status</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <JobCard
              key={item.id}
              item={item}
              triggering={triggeringId === item.id}
              onTrigger={() => onTrigger(item.id)}
            />
          ))}
        </div>
      )}
    </SurfaceCard>
  )
}

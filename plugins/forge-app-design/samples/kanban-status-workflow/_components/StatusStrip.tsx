'use client'

import { Label, SurfaceCard } from '@forge-ui-official/core'
import { STATUS_COLUMNS, STATUS_THEME, type WorkflowItem } from '../utils'

export function StatusStrip({ items }: { items: WorkflowItem[] }) {
  return (
    <SurfaceCard padding="sm">
      <div className="flex flex-wrap items-center gap-2">
        <Label color="gray">Total {items.length}</Label>
        {STATUS_COLUMNS.map(status => {
          const theme = STATUS_THEME[status]
          const count = items.filter(item => item.status === status).length
          return <Label key={status} color={theme.labelColor}>{theme.label} {count}</Label>
        })}
      </div>
    </SurfaceCard>
  )
}

'use client'

import { Button, StyledLink, TaskCard } from '@forge-ui-official/core'
import { PlayCircleBoldDuotone, RefreshSquareBoldDuotone } from 'solar-icon-set'
import { humanizeSchedule, statusProgress, STATUS_THEME, type WorkflowItem } from '../utils'

export function JobCard({
  item,
  triggering,
  onTrigger,
}: {
  item: WorkflowItem
  triggering: boolean
  onTrigger: () => void
}) {
  const failed = item.status === 'failed'
  const theme = STATUS_THEME[item.status]

  return (
    <div className="space-y-3">
      <TaskCard
        title={item.title}
        description={`${humanizeSchedule(item.schedule)} · owner ${item.owner ?? 'unassigned'} · last ${item.lastRun ?? '-'}`}
        labelText={theme.label}
        labelColor={failed ? 'red' : item.status === 'success' ? 'green' : 'purple'}
        progress={statusProgress(item.status)}
        progressColor={theme.progressColor}
        date={item.nextRun ? `Next ${item.nextRun}` : 'Paused'}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          color={failed ? 'red' : 'purple'}
          iconLeft={
            triggering ? (
              <RefreshSquareBoldDuotone size={14} color="currentColor" />
            ) : (
              <PlayCircleBoldDuotone size={14} color="currentColor" />
            )
          }
          onClick={onTrigger}
        >
          {triggering ? 'Triggering...' : failed ? 'Re-run' : 'Run now'}
        </Button>
        {failed && item.relatedHref && (
          <StyledLink href={item.relatedHref} color="red">
            View errors
          </StyledLink>
        )}
      </div>
    </div>
  )
}

import { Label, ProgressBar, StyledLink, SurfaceCard } from '@forge-ui-official/core'
import type { ActionFormDraft, SaveState } from '../utils'
import { completionPercent, preflightChecks, saveStateLabel } from '../utils'

export function StatusRail({
  draft,
  saveState,
}: {
  draft: ActionFormDraft
  saveState: SaveState
}) {
  const completion = completionPercent(draft)
  const checks = preflightChecks(draft)
  const ready = checks.filter(check => check.pass).length

  return (
    <aside className="flex w-full flex-shrink-0 flex-col gap-4 xl:w-[clamp(18rem,24vw,24rem)]">
      <SurfaceCard
        title="Status"
        subtitle="Draft readiness"
        action={<Label color={saveState === 'saved' ? 'green' : saveState === 'error' ? 'red' : 'gray'}>{saveStateLabel(saveState)}</Label>}
        padding="lg"
      >
        <div className="space-y-4">
          <ProgressBar value={completion} color={completion >= 90 ? 'green' : 'purple'} label="Completion" showPercentage />
          <div className="grid gap-3">
            <RailMetric label="Owner" value={draft.owner || 'Not set'} />
            <RailMetric label="Priority" value={draft.priority || 'Not set'} />
            <RailMetric label="Ready checks" value={`${ready}/${checks.length}`} />
          </div>
          {saveState === 'saved' ? (
            <div className="rounded-card bg-fg-grey-50 p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
              <p className="text-sm font-semibold text-fg-black">Next workflow</p>
              <p className="mt-1 text-xs leading-5 text-fg-grey-700">Open the created task detail to review audit trail and activity.</p>
              <div className="mt-3">
                <StyledLink href="/review-tasks/task-1042">Open task detail</StyledLink>
              </div>
            </div>
          ) : null}
        </div>
      </SurfaceCard>
    </aside>
  )
}

function RailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-card bg-white px-4 py-3 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
      <span className="text-xs font-semibold text-fg-grey-600">{label}</span>
      <span className="text-sm font-semibold text-fg-black">{value}</span>
    </div>
  )
}

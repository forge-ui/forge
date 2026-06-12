import { Label, SurfaceCard } from '@forge-ui-official/core'
import type { ActionFormDraft } from '../utils'
import { preflightChecks } from '../utils'

export function PreflightChecklist({ draft }: { draft: ActionFormDraft }) {
  const checks = preflightChecks(draft)

  return (
    <SurfaceCard title="Preflight checks" subtitle="Show readiness inline instead of hiding validation in a toast." padding="lg">
      <div className="grid gap-3 md:grid-cols-2">
        {checks.map(check => (
          <div key={check.label} className="rounded-card bg-fg-grey-50 px-4 py-3 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-fg-black">{check.label}</p>
              <Label color={check.pass ? 'green' : 'yellow'}>{check.pass ? 'Ready' : 'Check'}</Label>
            </div>
            <p className="mt-1 text-xs leading-5 text-fg-grey-700">{check.detail}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  )
}

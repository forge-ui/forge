'use client'

import { Label, SurfaceCard } from '@forge-ui-official/core'

export function FailedJobsBanner({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <SurfaceCard padding="sm" action={<Label color="red">Failed</Label>}>
      <p className="text-sm font-semibold text-fg-black">{count} failed item{count > 1 ? 's' : ''}</p>
      <p className="mt-1 text-xs text-fg-grey-700">Open diagnostics before advancing the lane.</p>
    </SurfaceCard>
  )
}

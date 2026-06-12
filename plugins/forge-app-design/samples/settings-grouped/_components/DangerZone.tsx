'use client'

import { Button } from '@forge-ui-official/core'

export function DangerZone({
  confirming,
  onStartConfirm,
  onCancel,
  onReset,
}: {
  confirming: boolean
  onStartConfirm: () => void
  onCancel: () => void
  onReset: () => void
}) {
  return (
    <section
      className="rounded-card border p-5"
      style={{ background: '#fef2f2', borderColor: '#fecaca', boxShadow: '0 1px 3px rgba(220,38,38,0.06)' }}
    >
      <h2 className="text-base font-semibold text-fg-black">Danger zone</h2>
      <p className="mt-1 text-sm text-red-700">
        Resetting settings affects workflow routing immediately after save.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {confirming ? (
          <>
            <Button color="red" variant="primary" size="sm" onClick={onReset}>Confirm reset</Button>
            <Button color="grey" variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
          </>
        ) : (
          <Button color="red" variant="secondary" size="sm" onClick={onStartConfirm}>Reset to defaults</Button>
        )}
      </div>
    </section>
  )
}

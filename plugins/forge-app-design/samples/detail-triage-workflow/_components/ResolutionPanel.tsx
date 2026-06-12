'use client'

import { Button, TextArea } from '@forge-ui-official/core'

export function ResolutionPanel({
  value,
  saveState,
  onChange,
  onResolve,
  onEscalate,
}: {
  value: string
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  onChange: (value: string) => void
  onResolve: () => void
  onEscalate: () => void
}) {
  return (
    <aside className="rounded-card border border-fg-violet-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[clamp(14rem,20vw,18rem)_minmax(0,1fr)_clamp(14rem,20vw,18rem)] xl:items-start">
        <div>
          <h2 className="text-base font-semibold text-fg-black">Resolution workbench</h2>
          <p className="mt-1 text-sm leading-6 text-fg-grey-600">
            Capture the decision before moving this item to the next workflow surface.
          </p>
          {saveState === 'saved' && <p className="mt-3 text-xs font-medium text-green-700">Saved. Redirecting to the workflow page.</p>}
          {saveState === 'error' && <p className="mt-3 text-xs font-medium text-red-700">Save failed. Check the mock API.</p>}
        </div>

        <TextArea
          value={value}
          onChange={onChange}
          rows={3}
          placeholder="Write the decision, owner, and next action."
        />

        <div className="rounded-card bg-fg-grey-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-grey-500">Next workflow</p>
          <p className="mt-2 text-sm leading-5 text-fg-grey-700">
            Resolution updates the record and opens the next workflow surface.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Button color="green" variant="primary" size="md" disabled={saveState === 'saving'} onClick={onResolve}>
              {saveState === 'saving' ? 'Saving...' : 'Resolve and continue'}
            </Button>
            <Button color="red" variant="secondary" size="md" disabled={saveState === 'saving'} onClick={onEscalate}>
              Escalate
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

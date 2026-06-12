'use client'

import { Button, Label } from '@forge-ui-official/core'

export function SaveBar({
  changedCount,
  invalidCount,
  saveState,
  onSave,
  onDiscard,
}: {
  changedCount: number
  invalidCount: number
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  onSave: () => void
  onDiscard: () => void
}) {
  if (changedCount === 0 && saveState !== 'saved' && saveState !== 'error') return null

  return (
    <div className="sticky bottom-4 z-10 rounded-card border border-fg-grey-200 bg-white px-4 py-3 shadow-subtle">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-fg-black">{changedCount} pending change{changedCount === 1 ? '' : 's'}</p>
          {invalidCount > 0 && <Label color="red" size="sm">{invalidCount} invalid</Label>}
          {saveState === 'saved' && <Label color="green" size="sm">Saved</Label>}
          {saveState === 'error' && <Label color="red" size="sm">Save failed</Label>}
        </div>
        <div className="flex gap-2">
          <Button color="grey" variant="secondary" size="sm" onClick={onDiscard}>Discard</Button>
          <Button color="purple" variant="primary" size="sm" disabled={invalidCount > 0 || saveState === 'saving'} onClick={onSave}>
            {saveState === 'saving' ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

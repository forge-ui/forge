import { Button, ButtonGroup, TextArea } from '@forge-ui-official/core'
import type { DetailStatus } from '../utils'

const statuses: DetailStatus[] = ['Open', 'In review', 'Resolved', 'Escalated']

export function ResolutionPanel({
  status,
  note,
  saveState,
  onStatusChange,
  onNoteChange,
  onSave,
}: {
  status: DetailStatus
  note: string
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  onStatusChange: (value: DetailStatus) => void
  onNoteChange: (value: string) => void
  onSave: () => void
}) {
  return (
    <aside className="sticky top-6 rounded-card border border-fg-grey-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-fg-grey-950">Resolution</h2>
      <p className="mt-1 text-xs leading-5 text-fg-grey-500">Update the state, record a note, and continue the downstream workflow.</p>
      <ButtonGroup items={statuses.map(item => ({ label: item }))} activeIndex={Math.max(0, statuses.indexOf(status))} color="purple" onChange={index => onStatusChange(statuses[index])} className="mt-4 max-w-full flex-wrap" />
      <TextArea value={note} onChange={onNoteChange} rows={6} className="mt-4" placeholder="Resolution note" />
      <Button size="md" color="purple" disabled={saveState === 'saving'} onClick={onSave}>
        {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved, open workflow' : 'Save resolution'}
      </Button>
      {saveState === 'error' ? <p className="mt-3 text-xs text-fg-red-600">Save failed. Keep the note and retry.</p> : null}
    </aside>
  )
}

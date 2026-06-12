import { Checkbox, Label, SelectOption, SurfaceCard, TextArea, TextField } from '@forge-ui-official/core'
import { POLICY_OPTIONS, PRIORITY_OPTIONS, type ActionFormDraft } from '../utils'

export function PolicyFields({
  draft,
  onChange,
}: {
  draft: ActionFormDraft
  onChange: (patch: Partial<ActionFormDraft>) => void
}) {
  return (
    <SurfaceCard title="Policy and timing" subtitle="Keep action-specific decisions on this page; deep audit belongs to the detail route." padding="lg">
      <div className="grid gap-4 md:grid-cols-2">
        <SelectOption
          label="Policy"
          width="100%"
          value={draft.policy}
          options={POLICY_OPTIONS}
          shape="pill"
          onChange={policy => onChange({ policy })}
        />
        <SelectOption
          label="Priority"
          width="100%"
          value={draft.priority}
          options={PRIORITY_OPTIONS}
          shape="pill"
          onChange={priority => onChange({ priority })}
        />
        <TextField
          label="Due window"
          value={draft.dueWindow}
          shape="pill"
          onChange={dueWindow => onChange({ dueWindow })}
        />
        <div className="flex items-end gap-3 pb-3">
          <Checkbox checked={draft.notifyOwner} onChange={notifyOwner => onChange({ notifyOwner })} />
          <div>
            <p className="text-sm font-semibold text-fg-black">Notify owner</p>
            <p className="text-xs leading-5 text-fg-grey-700">Send the saved context to the assigned owner.</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <TextArea
            label="Review note"
            value={draft.note}
            rows={4}
            shape="rounded"
            onChange={note => onChange({ note })}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-card bg-fg-grey-50 px-4 py-3 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        <Checkbox checked={draft.dryRunFirst} color="green" onChange={dryRunFirst => onChange({ dryRunFirst })} />
        <Label color={draft.dryRunFirst ? 'green' : 'yellow'}>{draft.dryRunFirst ? 'Dry run first' : 'Direct save'}</Label>
        <p className="text-sm leading-5 text-fg-grey-700">Dry run helps catch scope or policy issues before the task is visible to the queue.</p>
      </div>
    </SurfaceCard>
  )
}

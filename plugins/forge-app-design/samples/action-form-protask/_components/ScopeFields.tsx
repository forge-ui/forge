import { SelectOption, SurfaceCard, TextField } from '@forge-ui-official/core'
import { DEPARTMENT_OPTIONS, OWNER_OPTIONS, SCOPE_OPTIONS, type ActionFormDraft } from '../utils'

export function ScopeFields({
  draft,
  onChange,
}: {
  draft: ActionFormDraft
  onChange: (patch: Partial<ActionFormDraft>) => void
}) {
  return (
    <SurfaceCard title="Scope" subtitle="Define what this action creates and who owns the next step." padding="lg">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Task name"
          value={draft.name}
          shape="pill"
          onChange={name => onChange({ name })}
        />
        <SelectOption
          label="Owner"
          width="100%"
          value={draft.owner}
          options={OWNER_OPTIONS}
          shape="pill"
          onChange={owner => onChange({ owner })}
        />
        <SelectOption
          label="Department"
          width="100%"
          value={draft.department}
          options={DEPARTMENT_OPTIONS}
          shape="pill"
          onChange={department => onChange({ department })}
        />
        <SelectOption
          label="Record scope"
          width="100%"
          value={draft.scope}
          options={SCOPE_OPTIONS}
          shape="pill"
          onChange={scope => onChange({ scope })}
        />
      </div>
    </SurfaceCard>
  )
}

import { Breadcrumbs, Button, SurfaceCard, TextField } from '@forge-ui-official/core'

export default function Page() {
  return (
    <main className="w-full min-h-full space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-fg-violet-600">Guided setup</p>
          <h1 className="text-display-l font-semibold text-fg-black">Create task</h1>
          <Breadcrumbs color="purple" items={[{ label: 'Tasks', href: '/tasks' }, { label: 'Create task' }]} />
          <p className="mt-2 text-sm text-fg-grey-700">This action form explains every possible setup decision in the page title area before the user has reached the relevant field group, causing a long unreadable header.</p>
        </div>
        <div className="flex gap-3">
          <Button color="grey" variant="tertiary">Cancel</Button>
          <Button color="purple" variant="primary">Save</Button>
        </div>
      </header>
      <SurfaceCard title="Scope" padding="lg">
        <TextField label="Task name" value="Risk review" />
      </SurfaceCard>
    </main>
  )
}

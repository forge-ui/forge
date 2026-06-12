import { SurfaceCard, TextField } from '@forge-ui-official/core'

export default function Page() {
  return (
    <main className="w-full min-h-full space-y-6">
      <h1 className="text-display-l font-semibold text-fg-black">Create task</h1>
      <SurfaceCard title="Scope" padding="lg">
        <TextField label="Task name" value="Risk review" />
      </SurfaceCard>
    </main>
  )
}

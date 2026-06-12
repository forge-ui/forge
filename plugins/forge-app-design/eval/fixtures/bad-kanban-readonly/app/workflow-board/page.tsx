import { SurfaceCard } from '@forge-ui-official/core'

const lanes = [
  { title: 'Queued', cards: ['Policy sync', 'Daily export'] },
  { title: 'Running', cards: ['Eligibility batch'] },
  { title: 'Blocked', cards: ['Claims replay'] },
]

export default function ReadOnlyKanbanFixture() {
  return (
    <main className="w-full min-h-full space-y-6">
      <h1 className="text-2xl font-semibold text-fg-black">Workflow board</h1>
      <div className="grid grid-cols-3 gap-4">
        {lanes.map(lane => (
          <SurfaceCard key={lane.title} title={lane.title} padding="sm">
            <div className="space-y-3">
              {lane.cards.map(card => (
                <div key={card} className="rounded-card border border-fg-grey-200 bg-white p-3">
                  <p className="text-sm font-medium text-fg-black">{card}</p>
                  <p className="text-xs text-fg-grey-500">Static status card</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        ))}
      </div>
    </main>
  )
}

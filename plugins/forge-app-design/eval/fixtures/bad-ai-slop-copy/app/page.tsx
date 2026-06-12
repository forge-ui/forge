'use client'

import { Button, StatCard } from '@forge-ui-official/core'

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-fg-black">World-class operations</h1>
      <p className="mt-2 text-sm text-fg-grey-600">
        Supercharge your workflow — seamless insights for every team.
      </p>
      <div className="mt-6 rounded-card border border-l-4 border-fg-grey-200 border-l-fg-violet-500 bg-white p-4 transition-all">
        <StatCard title="Risk queue" value="24" theme="yellow" />
      </div>
      <Button className="mt-4">Unlock potential</Button>
    </main>
  )
}

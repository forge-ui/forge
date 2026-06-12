'use client'

import { StatCard } from '@forge-ui-official/core'

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-3xl font-semibold text-transparent">
        Operational command center
      </h1>
      <StatCard title="Open issues" value="18" theme="red" />
    </main>
  )
}

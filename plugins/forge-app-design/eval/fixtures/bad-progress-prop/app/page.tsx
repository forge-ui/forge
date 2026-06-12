'use client'

import { ProgressStatCard } from '@forge-ui-official/core'

export default function Page() {
  return (
    <main className="p-8">
      <ProgressStatCard label="Onboarding" value={80} progress={0.8} />
    </main>
  )
}

'use client'

import { Button } from '@forge-ui-official/core'

export default function Page() {
  return (
    <main className="p-8">
      <div
        style={{ background: '#ecfeff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        className="p-4 rounded-card"
      >
        <h1 style={{ color: '#111827' }}>Inline hex in page.tsx 总装 — should trigger page-inline-hex</h1>
      </div>
      <Button>Submit</Button>
    </main>
  )
}

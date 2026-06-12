'use client'

import type { TriageItem } from '../utils'

export function ChangeHistory({ item }: { item: TriageItem }) {
  const rows = [
    { label: 'Detected', value: item.detectedAt ?? 'Today', note: 'Signal created by monitor' },
    { label: 'Assigned', value: item.owner ?? 'Queue', note: 'Owner accepted triage responsibility' },
    { label: item.status === 'resolved' ? 'Resolved' : 'Current', value: item.status, note: item.resolution || 'Resolution pending' },
  ]

  return (
    <section className="rounded-card bg-white border border-fg-grey-200 p-5">
      <h2 className="text-base font-semibold text-fg-black mb-3">Change history</h2>
      <div className="space-y-3">
        {rows.map(row => (
          <div key={row.label} className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-fg-violet-500" />
            <div>
              <p className="text-sm font-semibold text-fg-black">{row.label} · {row.value}</p>
              <p className="text-xs text-fg-grey-600">{row.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

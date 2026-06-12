'use client'

import type { TriageItem } from '../utils'

export function ImpactScopePanel({ item }: { item: TriageItem }) {
  return (
    <section
      className="rounded-card border p-5"
      style={{ background: '#fff7ed', borderColor: '#fed7aa', boxShadow: '0 1px 3px rgba(234,88,12,0.06)' }}
    >
      <h2 className="text-base font-semibold text-fg-black mb-3">Impact scope</h2>
      <p className="text-sm leading-6 text-fg-grey-800">{item.impactScope || 'Impact is still being assessed.'}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-white px-2.5 py-1 font-medium text-fg-grey-700">Customer-visible</span>
        <span className="rounded-full bg-white px-2.5 py-1 font-medium text-fg-grey-700">Workflow {item.workflowRef ?? '-'}</span>
        <span className="rounded-full bg-white px-2.5 py-1 font-medium text-fg-grey-700">Decision required</span>
      </div>
    </section>
  )
}

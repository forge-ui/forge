'use client'

import type { TriageItem } from '../utils'

export function RootCausePanel({ item }: { item: TriageItem }) {
  return (
    <section className="rounded-card bg-white border border-fg-grey-200 p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-base font-semibold text-fg-black">Root cause</h2>
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
          Evidence required
        </span>
      </div>
      <p className="text-sm leading-6 text-fg-grey-700">{item.rootCause || 'No root cause recorded yet.'}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-fg-grey-50 p-3">
          <p className="text-fg-grey-500">Source</p>
          <p className="mt-1 font-semibold text-fg-black">{item.sourceRef ?? '-'}</p>
        </div>
        <div className="rounded-xl bg-fg-grey-50 p-3">
          <p className="text-fg-grey-500">Workflow</p>
          <p className="mt-1 font-semibold text-fg-black">{item.workflowRef ?? '-'}</p>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { StatusBadge } from '@forge-ui-official/core'
import { severityColor, type TriageItem } from '../utils'

export function SimilarRecords({ items }: { items: TriageItem[] }) {
  return (
    <section className="rounded-card bg-white border border-fg-grey-200 p-5">
      <h2 className="text-base font-semibold text-fg-black mb-3">Similar or related</h2>
      {items.length === 0 ? (
        <p className="text-sm text-fg-grey-500">No similar records in the current queue.</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Link key={item.id} href={`./${item.id}`} className="block rounded-xl border border-fg-grey-200 p-3 hover:bg-fg-grey-50">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-fg-black">{item.code}</p>
                <StatusBadge label={item.severity} color={severityColor(item.severity)} />
              </div>
              <p className="mt-1 text-xs text-fg-grey-600">{item.workflowRef} · {item.rootCause}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

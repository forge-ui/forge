'use client'

import Link from 'next/link'
import { StatusBadge } from '@forge-ui-official/core'
import { contextColor, type ContextRecord } from '../utils'

export function ContextHealthPanel({ contexts }: { contexts: ContextRecord[] }) {
  return (
    <section className="rounded-card bg-white border border-fg-grey-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-fg-black">Context health</h2>
          <p className="text-sm text-fg-grey-600">Secondary signals that influence the main decision.</p>
        </div>
        <Link href="/contexts" className="text-sm font-semibold text-fg-violet-600 hover:underline">All context</Link>
      </div>
      <div className="space-y-3">
        {contexts.map(context => (
          <Link key={context.id} href={context.href} className="block rounded-xl border border-fg-grey-200 p-3 hover:bg-fg-grey-50">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-fg-black">{context.title}</p>
              <StatusBadge label={context.status} color={contextColor(context.status)} />
            </div>
            <p className="mt-1 text-xs text-fg-grey-600">{context.subtitle} · {context.metric}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

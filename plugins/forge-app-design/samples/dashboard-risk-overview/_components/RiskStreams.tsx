'use client'

import Link from 'next/link'
import { StatusBadge } from '@forge-ui-official/core'
import { severityColor, type RiskRecord } from '../utils'

export function RiskStreams({ risks }: { risks: RiskRecord[] }) {
  return (
    <section className="rounded-card bg-white border border-fg-grey-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-fg-black">Risk stream</h2>
          <p className="text-sm text-fg-grey-600">Open records that explain why the dashboard is red.</p>
        </div>
        <Link href="/issues" className="text-sm font-semibold text-fg-violet-600 hover:underline">Open queue</Link>
      </div>
      <div className="space-y-3">
        {risks.slice(0, 5).map(risk => (
          <Link key={risk.id} href={risk.href} className="block rounded-xl border border-fg-grey-200 p-3 hover:bg-fg-grey-50">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-fg-black">{risk.code} · {risk.title}</p>
              <StatusBadge label={risk.severity} color={severityColor(risk.severity)} />
            </div>
            <p className="mt-1 text-xs text-fg-grey-600">{risk.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

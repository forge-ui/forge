'use client'

import Link from 'next/link'
import { ProgressBar, StatusBadge } from '@forge-ui-official/core'
import { blockedWorkflows, type WorkflowRecord } from '../utils'

export function BlockedWorkflowPanel({ workflows }: { workflows: WorkflowRecord[] }) {
  const blocked = blockedWorkflows(workflows)

  return (
    <section
      className="rounded-card border p-5"
      style={{ background: '#fef2f2', borderColor: '#fecaca', boxShadow: '0 1px 3px rgba(220,38,38,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-fg-black">Blocked workflows</h2>
          <p className="text-sm text-red-700">These records explain where action is required.</p>
        </div>
        <Link href="/workflow-board" className="text-sm font-semibold text-red-700 hover:underline">Open board</Link>
      </div>
      <div className="space-y-3">
        {blocked.length === 0 ? (
          <p className="text-sm text-fg-grey-600">No blocked workflows.</p>
        ) : blocked.map(record => (
          <Link key={record.id} href={record.href} className="block rounded-xl bg-white border border-red-100 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-fg-black">{record.code} · {record.title}</p>
              <StatusBadge label={`${record.exceptionCount ?? 0} issues`} color="red" />
            </div>
            <div className="mt-2">
              <ProgressBar value={Math.min(record.progress ?? 0, 100)} color="red" showPercentage />
            </div>
            <p className="mt-2 text-xs text-fg-grey-700">{record.nextAction}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

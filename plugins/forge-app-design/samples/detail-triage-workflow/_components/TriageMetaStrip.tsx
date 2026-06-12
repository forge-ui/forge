'use client'

import { StatusBadge } from '@forge-ui-official/core'
import { SEVERITY_LABEL, severityColor, STATUS_LABEL, statusColor, type TriageItem } from '../utils'

export function TriageMetaStrip({ item }: { item: TriageItem }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="rounded-xl bg-white border border-fg-grey-200 p-4">
        <p className="text-xs text-fg-grey-500">Severity</p>
        <div className="mt-2">
          <StatusBadge label={SEVERITY_LABEL[item.severity]} color={severityColor(item.severity)} />
        </div>
      </div>
      <div className="rounded-xl bg-white border border-fg-grey-200 p-4">
        <p className="text-xs text-fg-grey-500">Status</p>
        <div className="mt-2">
          <StatusBadge label={STATUS_LABEL[item.status]} color={statusColor(item.status)} />
        </div>
      </div>
      <div className="rounded-xl bg-white border border-fg-grey-200 p-4">
        <p className="text-xs text-fg-grey-500">Category</p>
        <p className="mt-2 text-sm font-semibold text-fg-black">{item.category}</p>
      </div>
      <div className="rounded-xl bg-white border border-fg-grey-200 p-4">
        <p className="text-xs text-fg-grey-500">Owner</p>
        <p className="mt-2 text-sm font-semibold text-fg-black">{item.owner ?? 'Unassigned'}</p>
      </div>
    </div>
  )
}

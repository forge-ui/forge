'use client'

import Link from 'next/link'
import { Button, Label, StatusBadge } from '@forge-ui-official/core'
import { priorityColor, statusColor, type ConversationRecord } from '../utils'

export function ContextPanel({ conversation }: { conversation: ConversationRecord }) {
  return (
    <aside className="rounded-card border border-fg-grey-200 bg-white p-5 h-fit lg:sticky lg:top-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-grey-500">Context</p>
          <h2 className="mt-1 text-lg font-semibold text-fg-black">{conversation.title}</h2>
          <p className="mt-1 text-sm text-fg-grey-600">{conversation.subtitle}</p>
        </div>
        <Label color={priorityColor(conversation.priority)} size="sm">{conversation.priority}</Label>
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-fg-grey-500">Status</dt>
          <dd><StatusBadge label={conversation.status} color={statusColor(conversation.status)} /></dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-fg-grey-500">Owner</dt>
          <dd className="font-semibold text-fg-black">{conversation.owner}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-fg-grey-500">SLA</dt>
          <dd className="font-semibold text-fg-black">{conversation.slaLabel}</dd>
        </div>
      </dl>
      <div className="mt-5">
        <Link href={conversation.linkedHref}>
          <Button color="purple" variant="secondary" size="sm">Open linked record</Button>
        </Link>
      </div>
    </aside>
  )
}

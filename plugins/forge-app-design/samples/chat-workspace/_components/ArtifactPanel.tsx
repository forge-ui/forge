'use client'

import { Label } from '@forge-ui-official/core'
import type { ConversationRecord } from '../utils'

export function ArtifactPanel({ conversation }: { conversation: ConversationRecord }) {
  const checklist = [
    'Confirm current owner and SLA state.',
    'Summarize latest blocker in one response.',
    'Open linked record before promising resolution.',
  ]

  return (
    <section
      className="rounded-card border p-5"
      style={{ background: '#f8fafc', borderColor: '#e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-fg-black">Generated artifact</h2>
        <Label color="blue" size="sm">summary</Label>
      </div>
      <p className="mt-3 text-sm leading-6 text-fg-grey-700">
        {conversation.title} is owned by {conversation.owner}. Priority is {conversation.priority}, and the next response should reference the linked workflow record.
      </p>
      <ol className="mt-4 space-y-2">
        {checklist.map((item, index) => (
          <li key={item} className="flex gap-2 text-xs text-fg-grey-700">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white font-semibold text-fg-black">{index + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

'use client'

import { Label } from '@forge-ui-official/core'
import type { MessageRecord } from '../utils'

const ROLE_LABEL: Record<MessageRecord['role'], string> = {
  operator: 'You',
  customer: 'Requester',
  agent: 'Agent',
  system: 'System',
}

export function MessageThread({ messages }: { messages: MessageRecord[] }) {
  if (messages.length === 0) {
    return (
      <section className="rounded-card border border-dashed border-fg-grey-300 bg-white p-8 text-center">
        <p className="text-sm text-fg-grey-500">No messages yet.</p>
      </section>
    )
  }

  return (
    <section className="rounded-card border border-fg-grey-200 bg-white p-5">
      <div className="space-y-4">
        {messages.map(message => {
          const mine = message.role === 'operator'
          const system = message.role === 'system'
          return (
            <article key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-2xl border px-4 py-3 ${mine ? 'bg-fg-violet text-white' : system ? 'bg-fg-grey-50 text-fg-grey-700' : 'bg-white text-fg-black'}`}
                style={{
                  borderColor: mine ? '#7239EA' : '#e4e4e7',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className={`text-xs font-semibold ${mine ? 'text-white' : 'text-fg-grey-600'}`}>{ROLE_LABEL[message.role]}</span>
                  {system && <Label color="gray" size="sm">event</Label>}
                  <span className={`text-xs ${mine ? 'text-white/70' : 'text-fg-grey-500'}`}>{message.time}</span>
                </div>
                <p className="text-sm leading-6">{message.body}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

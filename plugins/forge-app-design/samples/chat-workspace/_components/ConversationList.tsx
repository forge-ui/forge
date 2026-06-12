'use client'

import { Label, StatusBadge } from '@forge-ui-official/core'
import { priorityColor, statusColor, type ConversationRecord } from '../utils'

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: ConversationRecord[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <aside className="rounded-card border border-fg-grey-200 bg-white p-4 h-fit lg:sticky lg:top-6">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-fg-grey-500">Inbox</p>
        <h2 className="mt-1 text-lg font-semibold text-fg-black">Active conversations</h2>
      </div>
      <div className="space-y-2">
        {conversations.map(conversation => {
          const active = conversation.id === activeId
          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelect(conversation.id)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${active ? 'border-fg-violet bg-fg-violet-100' : 'border-fg-grey-200 hover:bg-fg-grey-50'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg-black">{conversation.title}</p>
                  <p className="mt-1 truncate text-xs text-fg-grey-600">{conversation.subtitle}</p>
                </div>
                {conversation.unread > 0 && <Label color="purple" size="sm">{conversation.unread}</Label>}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge label={conversation.status} color={statusColor(conversation.status)} />
                <Label color={priorityColor(conversation.priority)} size="sm">{conversation.priority}</Label>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

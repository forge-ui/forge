'use client'

import { useMemo, useState } from 'react'
import { ArtifactPanel } from './_components/ArtifactPanel'
import { Composer } from './_components/Composer'
import { ContextPanel } from './_components/ContextPanel'
import { ConversationList } from './_components/ConversationList'
import { MessageThread } from './_components/MessageThread'
import {
  CONVERSATIONS,
  INITIAL_MESSAGES,
  messagesFor,
  type ConversationRecord,
  type MessageRecord,
} from './utils'

export default function ChatWorkspacePage() {
  const [conversations, setConversations] = useState<ConversationRecord[]>(CONVERSATIONS)
  const [messages, setMessages] = useState<MessageRecord[]>(INITIAL_MESSAGES)
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id)
  const [draft, setDraft] = useState('')
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const active = conversations.find(conversation => conversation.id === activeId) ?? conversations[0]
  const activeMessages = useMemo(() => messagesFor(active.id, messages), [active.id, messages])

  function selectConversation(id: string) {
    setActiveId(id)
    setDraft('')
    setSendState('idle')
    setConversations(current => current.map(item => (item.id === id ? { ...item, unread: 0 } : item)))
  }

  async function sendMessage() {
    if (!draft.trim()) return
    setSendState('sending')
    await new Promise(resolve => setTimeout(resolve, 250))
    const next: MessageRecord = {
      id: `m-${Date.now()}`,
      conversationId: active.id,
      role: 'operator',
      author: 'You',
      body: draft.trim(),
      time: 'now',
    }
    setMessages(current => [...current, next])
    setDraft('')
    setSendState('sent')
  }

  return (
    <main className="w-full min-h-screen bg-fg-grey-50 p-6 lg:p-8 space-y-6">
      <header>
        <p className="text-sm font-semibold text-fg-violet-600">Workspace</p>
        <h1 className="mt-1 text-2xl font-bold text-fg-black">Conversation operations</h1>
        <p className="mt-1 text-sm text-fg-grey-600">
          Handle active conversations with context, generated artifacts, and linked workflow actions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[clamp(16rem,22vw,20rem)_minmax(0,1fr)_clamp(18rem,24vw,24rem)]">
        <ConversationList conversations={conversations} activeId={active.id} onSelect={selectConversation} />
        <div className="space-y-4">
          <MessageThread messages={activeMessages} />
          <Composer value={draft} sendState={sendState} onChange={setDraft} onSend={sendMessage} />
        </div>
        <div className="space-y-4">
          <ContextPanel conversation={active} />
          <ArtifactPanel conversation={active} />
        </div>
      </div>
    </main>
  )
}

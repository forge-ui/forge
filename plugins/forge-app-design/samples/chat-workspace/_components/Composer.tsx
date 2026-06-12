'use client'

import { Button } from '@forge-ui-official/core'

export function Composer({
  value,
  sendState,
  onChange,
  onSend,
}: {
  value: string
  sendState: 'idle' | 'sending' | 'sent' | 'error'
  onChange: (value: string) => void
  onSend: () => void
}) {
  return (
    <section className="rounded-card border border-fg-grey-200 bg-white p-4">
      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        className="min-h-24 w-full resize-none rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-3 text-sm text-fg-black outline-none focus:border-fg-violet-400"
        placeholder="Write a response or next action note."
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-fg-grey-500">
          {sendState === 'sent' ? 'Message sent.' : sendState === 'error' ? 'Send failed.' : 'Draft stays local until sent.'}
        </p>
        <Button color="purple" variant="primary" size="sm" disabled={!value.trim() || sendState === 'sending'} onClick={onSend}>
          {sendState === 'sending' ? 'Sending...' : 'Send reply'}
        </Button>
      </div>
    </section>
  )
}

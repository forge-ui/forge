'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Breadcrumbs, Button } from '@forge-ui-official/core'
import { PolicyFields } from './_components/PolicyFields'
import { PreflightChecklist } from './_components/PreflightChecklist'
import { ScopeFields } from './_components/ScopeFields'
import { StatusRail } from './_components/StatusRail'
import { DEFAULT_ACTION_DRAFT, type ActionFormDraft, type SaveState } from './utils'

export default function ActionFormProtaskPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<ActionFormDraft>(DEFAULT_ACTION_DRAFT)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  function patchDraft(patch: Partial<ActionFormDraft>) {
    setDraft(current => ({ ...current, ...patch }))
    setSaveState('idle')
  }

  async function saveDraft() {
    setSaveState('saving')
    await new Promise(resolve => setTimeout(resolve, 350))
    setSaveState('saved')
  }

  return (
    <main className="w-full min-h-full space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-fg text-fg-black">Create review task</h1>
          <Breadcrumbs
            color="purple"
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Review tasks', href: '/review-tasks' },
              { label: 'Create review task' },
            ]}
            className="mt-1.5"
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Button color="grey" variant="tertiary" onClick={() => router.push('/review-tasks')}>
            Cancel
          </Button>
          <Button color="purple" variant="primary" disabled={saveState === 'saving'} onClick={saveDraft}>
            {saveState === 'saving' ? 'Saving' : 'Save task'}
          </Button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_clamp(18rem,24vw,24rem)]">
        <div className="min-w-0 space-y-4">
          <ScopeFields draft={draft} onChange={patchDraft} />
          <PolicyFields draft={draft} onChange={patchDraft} />
          <PreflightChecklist draft={draft} />
        </div>
        <StatusRail draft={draft} saveState={saveState} />
      </div>
    </main>
  )
}

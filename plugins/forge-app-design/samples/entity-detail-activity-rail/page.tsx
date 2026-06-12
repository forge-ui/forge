'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActivityRail } from './_components/ActivityRail'
import { ContextRail } from './_components/ContextRail'
import { DetailHero } from './_components/DetailHero'
import { ResolutionPanel } from './_components/ResolutionPanel'
import { detailEntity } from './utils'
import type { DetailStatus } from './utils'

export default function EntityDetailActivityRailSample() {
  const router = useRouter()
  const [status, setStatus] = useState<DetailStatus>(detailEntity.status)
  const [note, setNote] = useState(`Root cause reviewed: ${detailEntity.rootCause}`)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const handleSave = async () => {
    setSaveState('saving')
    try {
      await Promise.resolve({ status, note })
      setSaveState('saved')
      window.setTimeout(() => router.push('/tasks'), 450)
    } catch {
      setSaveState('error')
    }
  }

  return (
    <main className="w-full min-h-screen bg-fg-grey-50 p-4 lg:p-5">
      <div className="space-y-5">
        <DetailHero item={{ ...detailEntity, status }} onOpenWorkflow={() => router.push('/tasks')} />
        <div className="grid min-w-0 gap-5 xl:grid-cols-[clamp(16rem,22vw,20rem)_minmax(0,1fr)]">
          <ContextRail item={detailEntity} />
          <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_clamp(18rem,24vw,24rem)]">
            <ActivityRail item={detailEntity} />
            <ResolutionPanel status={status} note={note} saveState={saveState} onStatusChange={setStatus} onNoteChange={setNote} onSave={handleSave} />
          </div>
        </div>
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChangeHistory } from './_components/ChangeHistory'
import { ImpactScopePanel } from './_components/ImpactScopePanel'
import { ResolutionPanel } from './_components/ResolutionPanel'
import { RootCausePanel } from './_components/RootCausePanel'
import { SimilarRecords } from './_components/SimilarRecords'
import { SopBlock } from './_components/SopBlock'
import { TriageMetaStrip } from './_components/TriageMetaStrip'
import { similarRecords, SOP_BY_CATEGORY, type TriageItem } from './utils'

const API_ROUTE = '/api/triage-item'
const RETURN_ROUTE = '/workflow-board'

export default function TriageDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [item, setItem] = useState<TriageItem | null>(null)
  const [items, setItems] = useState<TriageItem[]>([])
  const [resolution, setResolution] = useState('')
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    Promise.all([
      fetch(`${API_ROUTE}/${params.id}`).then(res => res.json()),
      fetch(API_ROUTE).then(res => res.json()),
    ])
      .then(([itemRow, itemRows]) => {
        setItem(itemRow)
        setItems(itemRows)
        setResolution(itemRow.resolution ?? '')
      })
      .finally(() => setLoading(false))
  }, [params.id])

  async function saveItem(status: 'resolved' | 'escalated') {
    if (!item) return
    setSaveState('saving')
    try {
      const res = await fetch(`${API_ROUTE}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolution }),
      })
      if (!res.ok) throw new Error('save failed')
      const updated = (await res.json()) as TriageItem
      setItem(updated)
      setSaveState('saved')
      if (status === 'resolved') {
        setTimeout(() => router.push(`${RETURN_ROUTE}?highlight=${updated.workflowRef ?? updated.id}`), 450)
      }
    } catch {
      setSaveState('error')
    }
  }

  if (loading) return <main className="w-full min-h-screen bg-fg-grey-50 p-4 lg:p-5">Loading triage...</main>
  if (!item) return <main className="w-full min-h-screen bg-fg-grey-50 p-4 lg:p-5">Record not found.</main>

  return (
    <main className="w-full min-h-screen bg-fg-grey-50 p-4 lg:p-5 space-y-5">
      <header className="flex flex-col gap-2">
        <Link href=".." className="text-sm font-medium text-fg-grey-600 hover:text-fg-black">
          Back to queue
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-fg-black">{item.code} triage</h1>
          <p className="text-sm text-fg-grey-600 mt-1">
            Decide root cause, impact scope, and safe next action before continuing the workflow.
          </p>
        </div>
      </header>

      <TriageMetaStrip item={item} />

      <ResolutionPanel
        value={resolution}
        saveState={saveState}
        onChange={setResolution}
        onResolve={() => saveItem('resolved')}
        onEscalate={() => saveItem('escalated')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_clamp(18rem,24vw,24rem)] gap-5">
        <div className="space-y-5">
          <RootCausePanel item={item} />
          <ImpactScopePanel item={item} />
        </div>
        <div className="space-y-5">
          <SimilarRecords items={similarRecords(item, items)} />
          <SopBlock steps={SOP_BY_CATEGORY[item.category]} />
        </div>
      </div>

      <ChangeHistory item={item} />
    </main>
  )
}

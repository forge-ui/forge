'use client'

import { useEffect, useState } from 'react'
import { Breadcrumbs } from '@forge-ui-official/core'
import { FailedJobsBanner } from './_components/FailedJobsBanner'
import { KanbanColumn } from './_components/KanbanColumn'
import { StatusStrip } from './_components/StatusStrip'
import { groupByStatus, STATUS_COLUMNS, type WorkflowItem } from './utils'

const API_ROUTE = '/api/workflow-item'

export default function WorkflowKanbanPage() {
  const [items, setItems] = useState<WorkflowItem[]>([])
  const [loading, setLoading] = useState(true)
  const [triggeringId, setTriggeringId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(API_ROUTE)
      .then(res => res.json())
      .then(setItems)
      .catch(() => setError('Failed to load workflow items'))
      .finally(() => setLoading(false))
  }, [])

  async function handleTrigger(id: string) {
    setTriggeringId(id)
    setError(null)
    try {
      const res = await fetch(`${API_ROUTE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'running',
          lastRun: new Date().toISOString().split('T')[0],
        }),
      })
      if (!res.ok) throw new Error('trigger failed')
      const updated = (await res.json()) as WorkflowItem
      setItems(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)))
    } catch {
      setError('Could not trigger workflow item')
    } finally {
      setTriggeringId(null)
    }
  }

  const failedCount = items.filter(item => item.status === 'failed').length
  const grouped = groupByStatus(items)

  return (
    <main className="w-full min-h-full space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Workflow board' }]} />
          <h1 className="mt-3 text-2xl font-semibold tracking-fg text-fg-black">Workflow board</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-fg-grey-700">
            Scan status lanes, open failed diagnostics, and trigger the next workflow run.
          </p>
        </div>
        <FailedJobsBanner count={failedCount} />
      </header>

      <StatusStrip items={items} />

      {error && (
        <div className="rounded-card border border-fg-red bg-fg-red/10 px-4 py-3 text-sm text-fg-red">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            items={grouped[status]}
            loading={loading}
            triggeringId={triggeringId}
            onTrigger={handleTrigger}
          />
        ))}
      </div>
    </main>
  )
}

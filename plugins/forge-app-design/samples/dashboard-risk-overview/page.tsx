'use client'

import { useEffect, useState } from 'react'
import { BlockedWorkflowPanel } from './_components/BlockedWorkflowPanel'
import { ContextHealthPanel } from './_components/ContextHealthPanel'
import { HealthStats } from './_components/HealthStats'
import { RiskStreams } from './_components/RiskStreams'
import type { ContextRecord, PrimaryRecord, RiskRecord, WorkflowRecord } from './utils'

const PRIMARY_API = '/api/primary-record'
const WORKFLOW_API = '/api/workflow-record'
const RISK_API = '/api/risk-record'
const CONTEXT_API = '/api/context-record'

export default function RiskOverviewDashboard() {
  const [primaryRecords, setPrimaryRecords] = useState<PrimaryRecord[]>([])
  const [workflowRecords, setWorkflowRecords] = useState<WorkflowRecord[]>([])
  const [risks, setRisks] = useState<RiskRecord[]>([])
  const [contexts, setContexts] = useState<ContextRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(PRIMARY_API).then(res => res.json()),
      fetch(WORKFLOW_API).then(res => res.json()),
      fetch(RISK_API).then(res => res.json()),
      fetch(CONTEXT_API).then(res => res.json()),
    ])
      .then(([primaryRows, workflowRows, riskRows, contextRows]) => {
        setPrimaryRecords(primaryRows)
        setWorkflowRecords(workflowRows)
        setRisks(riskRows)
        setContexts(contextRows)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="w-full min-h-screen bg-fg-grey-50 p-6 lg:p-8 space-y-6">
      <header>
        <p className="text-sm font-semibold text-fg-violet-600">Operations dashboard</p>
        <h1 className="text-2xl font-bold text-fg-black mt-1">Risk overview and workflow recovery</h1>
        <p className="text-sm text-fg-grey-600 mt-1">
          Prioritize blocked workflows, critical records, and degraded context signals.
        </p>
      </header>

      {loading ? (
        <div className="rounded-card bg-white border border-fg-grey-200 p-8 text-sm text-fg-grey-500">
          Loading operational telemetry...
        </div>
      ) : (
        <>
          <HealthStats primaryRecords={primaryRecords} workflowRecords={workflowRecords} riskRecords={risks} />
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_clamp(20rem,28vw,28rem)] gap-5">
            <div className="space-y-5">
              <BlockedWorkflowPanel workflows={workflowRecords} />
              <RiskStreams risks={risks} />
            </div>
            <ContextHealthPanel contexts={contexts} />
          </div>
        </>
      )}
    </main>
  )
}

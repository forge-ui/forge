'use client'

import { useMemo, useState } from 'react'
import { ButtonGroup } from '@forge-ui-official/core'
import { PriorityWorkRail } from './_components/PriorityWorkRail'
import { SignalHero } from './_components/SignalHero'
import { TrendAndMixPanel } from './_components/TrendAndMixPanel'
import { activityEvents, segmentOptions, signals, workItems } from './utils'

export default function ProtaskCompoundDashboardSample() {
  const [selectedSegment, setSelectedSegment] = useState<(typeof segmentOptions)[number]>('All')
  const visibleSignals = useMemo(
    () => selectedSegment === 'All' ? signals : signals.filter(item => item.segment === selectedSegment),
    [selectedSegment],
  )
  const visibleWork = useMemo(
    () => selectedSegment === 'All' ? workItems : workItems.filter(item => item.segment === selectedSegment),
    [selectedSegment],
  )

  return (
    <main className="w-full min-h-screen bg-fg-grey-50 p-4 lg:p-5">
      <div className="space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-fg-violet-600">Operations control tower</p>
            <h1 className="mt-1 text-2xl font-semibold text-fg-grey-950">Risk, workload, and recovery</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-fg-grey-600">
              A dense first screen for deciding where to open the queue, resolve a blocker, or escalate a workflow.
            </p>
          </div>
          <ButtonGroup
            items={segmentOptions.map(segment => ({ label: segment }))}
            activeIndex={segmentOptions.indexOf(selectedSegment)}
            color="purple"
            shape="pill"
            onChange={index => setSelectedSegment(segmentOptions[index])}
            className="max-w-full flex-wrap"
          />
        </header>

        <SignalHero signals={visibleSignals} />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(clamp(18rem,28vw,26rem),0.85fr)]">
          <TrendAndMixPanel signals={visibleSignals} workItems={visibleWork} />
          <PriorityWorkRail workItems={visibleWork} activityEvents={activityEvents} />
        </div>
      </div>
    </main>
  )
}

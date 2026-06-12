import { FileCard, ProgressBar } from '@forge-ui-official/core'
import type { DetailEntity } from '../utils'
import { evidenceFiles } from '../utils'

export function ContextRail({ item }: { item: DetailEntity }) {
  return (
    <aside className="space-y-5">
      <section className="rounded-card border border-fg-grey-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-fg-grey-950">Context</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="text-fg-grey-500">Owner</dt><dd className="font-semibold text-fg-grey-950">{item.owner}</dd></div>
          <div><dt className="text-fg-grey-500">Impact</dt><dd className="font-semibold text-fg-grey-950">{item.impactScope}</dd></div>
          <div><dt className="text-fg-grey-500">Readiness</dt><dd className="mt-1"><ProgressBar value={100 - item.risk} color={item.risk >= 80 ? 'red' : 'yellow'} size="sm" /></dd></div>
        </dl>
      </section>
      <section className="rounded-card border border-fg-grey-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-fg-grey-950">Evidence</h2>
        <div className="mt-4 space-y-2">
          {evidenceFiles.map(file => <FileCard key={file.id} file={file} />)}
        </div>
      </section>
    </aside>
  )
}

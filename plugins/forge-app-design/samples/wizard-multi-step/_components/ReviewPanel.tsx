'use client'

import Link from 'next/link'
import { Label } from '@forge-ui-official/core'
import { previewRows, type SubmitState, type WizardDraft } from '../utils'

export function ReviewPanel({
  draft,
  issues,
  submitState,
  submittedId,
}: {
  draft: WizardDraft
  issues: string[]
  submitState: SubmitState
  submittedId: string | null
}) {
  return (
    <section className="rounded-card border border-fg-grey-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-violet">Review</p>
          <h2 className="mt-2 text-xl font-semibold text-fg-black">Submit setup</h2>
          <p className="mt-1 text-sm text-fg-grey-600">Confirm decisions and warnings before creating the workflow.</p>
        </div>
        <Label color={issues.length ? 'yellow' : 'green'} size="sm">{issues.length ? 'Warnings' : 'Ready'}</Label>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {previewRows(draft).map(row => (
          <div key={row.label} className="rounded-xl bg-fg-grey-50 p-4">
            <dt className="text-xs text-fg-grey-500">{row.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-fg-black">{row.value}</dd>
          </div>
        ))}
      </dl>
      {issues.length > 0 && (
        <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-semibold text-fg-black">Resolve before submit</p>
          <ul className="mt-2 space-y-1 text-xs text-yellow-700">
            {issues.map(issue => <li key={issue}>{issue}</li>)}
          </ul>
        </div>
      )}
      {submitState === 'saved' && submittedId && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700">Setup created: {submittedId}</p>
          <Link href={`/jobs?highlight=${submittedId}`} className="mt-2 inline-block text-sm font-semibold text-green-700 hover:underline">
            Open workflow board
          </Link>
        </div>
      )}
      {submitState === 'error' && <p className="mt-4 text-sm font-semibold text-red-700">Submit failed. Retry after checking validation.</p>}
    </section>
  )
}

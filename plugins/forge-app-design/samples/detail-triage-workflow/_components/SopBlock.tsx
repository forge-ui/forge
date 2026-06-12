'use client'

export function SopBlock({ steps }: { steps: string[] }) {
  return (
    <section className="rounded-card bg-white border border-fg-grey-200 p-5">
      <h2 className="text-base font-semibold text-fg-black mb-3">SOP next actions</h2>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm text-fg-grey-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fg-grey-100 text-xs font-semibold text-fg-black">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

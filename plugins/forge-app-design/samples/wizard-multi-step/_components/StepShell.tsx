'use client'

import type { ReactNode } from 'react'

export function StepShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-card border border-fg-grey-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-fg-violet">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold text-fg-black">{title}</h2>
      <p className="mt-1 text-sm text-fg-grey-600">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

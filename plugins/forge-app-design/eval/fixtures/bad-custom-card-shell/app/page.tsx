'use client'

type SectionCardProps = {
  title: string
  children: React.ReactNode
}

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="rounded-card border border-fg-grey-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-fg-grey-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function Page() {
  return (
    <main className="p-8">
      <SectionCard title="Hand-rolled panel">
        <p className="text-sm text-fg-grey-600">This should use a Forge card family component instead.</p>
      </SectionCard>
    </main>
  )
}

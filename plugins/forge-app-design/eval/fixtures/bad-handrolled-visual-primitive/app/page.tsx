'use client'

export default function Page() {
  return (
    <main className="p-8">
      <GaugeRing value={72} />
    </main>
  )
}

function GaugeRing({ value }: { value: number }) {
  return (
    <svg viewBox="0 0 120 120" aria-label={`${value}%`}>
      <circle cx="60" cy="60" r="48" stroke="#7c3aed" fill="none" />
    </svg>
  )
}

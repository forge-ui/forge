'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <main className="p-8">
      <Link href="/issues">
        View issue ->
      </Link>
    </main>
  )
}

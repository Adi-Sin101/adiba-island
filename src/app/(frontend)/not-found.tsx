import Link from 'next/link'

import { PennySvg } from '@/components/PennySvg'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[linear-gradient(180deg,#bfe6ff,#ffe6f2)] p-6 text-center">
      <div>
        <PennySvg className="mx-auto w-64 max-w-[70vw]" />
        <p className="kicker mt-6">Error 404</p>
        <h1 className="font-display text-4xl text-ink">Shh… Penny is napping on this page</h1>
        <p className="mx-auto mt-2 max-w-sm text-ink/70">It doesn’t exist (or she’s sitting on it). Let’s head back before she wakes up.</p>
        <Link href="/" className="toy-btn mt-6">
          🏝️ Back to the island
        </Link>
      </div>
    </main>
  )
}

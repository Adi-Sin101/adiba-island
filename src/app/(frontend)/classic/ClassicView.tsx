'use client'

import Lenis from 'lenis'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ZONES } from '@/components/island/zones'
import { PennySvg } from '@/components/PennySvg'
import { ZoneContent } from '@/components/sections/ZoneContent'
import type { SiteContent } from '@/lib/types'

export function ClassicView({ content }: { content: SiteContent }) {
  const [awake, setAwake] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 })
    return () => lenis.destroy()
  }, [])

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#bfe6ff_0,#fffaf2_520px)]">
      <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <a href="#welcome" className="font-display text-2xl text-ink">
            {content.profile.name.split(' ')[0]}
            <span className="text-pink">.</span>
          </a>
          <nav className="hidden gap-1 md:flex" aria-label="Sections">
            {ZONES.map((z) => (
              <a key={z.id} href={`#${z.id}`} className="rounded-full px-2.5 py-1 text-sm font-bold text-ink/70 hover:bg-white hover:text-ink">
                {z.blurb}
              </a>
            ))}
          </nav>
          <Link href="/" className="toy-btn !py-1.5 text-sm">
            🏝️ 3D island
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-16 px-4 py-12">
        {ZONES.map((z, i) => (
          <motion.div
            key={z.id}
            id={z.id}
            className="scroll-mt-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className={i === 0 ? '' : 'toy-card p-5 sm:p-8'}>
              <ZoneContent zone={z.id} content={content} />
            </div>
          </motion.div>
        ))}
      </main>

      <footer className="border-t-[3px] border-ink bg-white py-8 text-center text-sm text-ink/60">
        Made with 💖, seafood and a sleepy cat · © {new Date().getFullYear()} {content.profile.name}
      </footer>

      {/* Penny cameo: naps in the corner, wakes up when you hover */}
      <button
        type="button"
        className="fixed bottom-3 right-3 z-30 w-28 transition-transform hover:-translate-y-1 sm:w-36"
        onMouseEnter={() => setAwake(true)}
        onMouseLeave={() => setAwake(false)}
        onClick={() => document.getElementById('hammock')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Penny the cat. Click to meet her."
      >
        <PennySvg awake={awake} />
      </button>
    </div>
  )
}

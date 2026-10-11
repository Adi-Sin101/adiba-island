'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { PennySvg } from '@/components/PennySvg'

const LINES = ['Inflating the beach balls…', 'Waking up Boop…', 'Tiptoeing past Penny…', 'Grilling the shrimp…', 'Polishing the toys…']

export function Loader({ done }: { done: boolean }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % LINES.length), 1100)
    return () => clearInterval(t)
  }, [])
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="loader" exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.7, ease: 'easeInOut' }} role="status" aria-live="polite">
          <PennySvg className="w-56 max-w-[60vw]" />
          <p className="mt-4 font-display text-2xl text-ink">Sailing to the island</p>
          <AnimatePresence mode="wait">
            <motion.p key={i} className="mt-1 text-ink/60" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {LINES[i]}
            </motion.p>
          </AnimatePresence>
          <div className="loader__bar" aria-hidden>
            <span />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { motion } from 'motion/react'

import type { Skill } from '@/lib/types'
import { SectionHeading } from './ui'

const GROUPS: { id: string; label: string; emoji: string; color: string }[] = [
  { id: 'web', label: 'Web', emoji: '🕸️', color: '#dcecff' },
  { id: 'mobile', label: 'Mobile', emoji: '📱', color: '#ffe0f0' },
  { id: 'languages', label: 'Languages', emoji: '🔤', color: '#fff3c4' },
  { id: 'ai', label: 'AI & Data', emoji: '🧠', color: '#e6dcff' },
  { id: 'tools', label: 'Tools', emoji: '🛠️', color: '#d8f5e0' },
  { id: 'soft', label: 'People skills', emoji: '💖', color: '#ffe4d6' },
]

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section>
      <SectionHeading emoji="🧱" kicker="Block Tower" title="My toolbox">
        Stacked one block at a time. More dots = more comfy.
      </SectionHeading>
      <div className="space-y-5">
        {GROUPS.map((g) => {
          const list = skills.filter((s) => s.group === g.id)
          if (!list.length) return null
          return (
            <div key={g.id}>
              <h3 className="mb-2 font-display text-lg text-ink">
                <span aria-hidden>{g.emoji}</span> {g.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {list.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 12, rotate: -4 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18, delay: i * 0.025 }}
                    whileHover={{ y: -4, rotate: i % 2 ? 3 : -3 }}
                    className="skill-block"
                    style={{ background: g.color }}
                  >
                    <span className="font-bold">{s.name}</span>
                    <span className="flex gap-0.5" aria-label={`${s.level} out of 5`}>
                      {Array.from({ length: 5 }).map((_, d) => (
                        <span key={d} className={`size-1.5 rounded-full ${d < s.level ? 'bg-ink' : 'bg-ink/15'}`} />
                      ))}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

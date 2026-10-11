'use client'

import { motion } from 'motion/react'

import type { Achievement, Experience as Exp } from '@/lib/types'
import { Empty, Pill, SectionHeading } from './ui'

const KIND: Record<string, { label: string; emoji: string; color: string }> = {
  work: { label: 'Work', emoji: '💻', color: '#dcecff' },
  leadership: { label: 'Leadership', emoji: '🎤', color: '#ffe0f0' },
  research: { label: 'Research', emoji: '🔬', color: '#e6dcff' },
  volunteer: { label: 'Volunteer', emoji: '🤝', color: '#d8f5e0' },
  education: { label: 'Education', emoji: '🎓', color: '#fff3c4' },
}

const MEDAL: Record<string, string> = { gold: '🥇', silver: '🥈', bronze: '🥉', star: '⭐' }

export function Experience({ experiences, achievements }: { experiences: Exp[]; achievements: Achievement[] }) {
  return (
    <section className="space-y-8">
      <div>
        <SectionHeading emoji="🎤" kicker="Events Stage" title="Experience & leadership">
          Building products by day, running the show on stage by night.
        </SectionHeading>
        {!experiences.length && <Empty emoji="🎭">The stage is being set up.</Empty>}
        <ol className="relative space-y-4 border-l-4 border-dashed border-lilac pl-6">
          {experiences.map((e, i) => {
            const kind = KIND[e.kind] ?? KIND.work
            return (
              <motion.li key={e.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative">
                <span className="absolute -left-[38px] top-3 grid size-7 place-items-center rounded-full border-[3px] border-ink bg-white text-sm" aria-hidden>
                  {kind.emoji}
                </span>
                <div className="toy-card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg leading-tight text-ink">{e.role}</h3>
                    <span className="text-xs font-bold text-ink/60">{e.period}</span>
                  </div>
                  <p className="font-semibold text-blue">{e.url ? <a href={e.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">{e.organization}</a> : e.organization}</p>
                  {e.location && <p className="text-xs text-ink/50">{e.location}</p>}
                  {e.summary && <p className="mt-2 text-sm leading-relaxed text-ink/75">{e.summary}</p>}
                  {e.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {e.highlights.map((h) => (
                        <li key={h} className="flex gap-2 text-sm text-ink/80">
                          <span aria-hidden className="text-pink">✦</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Pill color={kind.color} className="mt-3">{kind.label}</Pill>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>

      {achievements.length > 0 && (
        <div>
          <h3 className="mb-3 font-display text-2xl text-ink">🏆 Trophy shelf</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {achievements.map((a) => (
              <li key={a.id} className="toy-card flex gap-3 p-4">
                <span className="text-3xl" aria-hidden>
                  {MEDAL[a.medal] ?? '⭐'}
                </span>
                <div>
                  <p className="font-display text-lg leading-tight text-ink">{a.title}</p>
                  <p className="text-sm text-ink/70">
                    {a.event}
                    {a.year && ` · ${a.year}`}
                  </p>
                  {a.description && <p className="mt-1 text-xs text-ink/60">{a.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

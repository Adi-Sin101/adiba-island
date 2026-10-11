'use client'

import { motion } from 'motion/react'
import { useMemo, useState } from 'react'

import type { TimelineItem, TimelineKind } from '@/lib/types'
import { Chip, Empty, SectionHeading } from './ui'

const FILTERS: { id: 'all' | TimelineKind[]; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: ['education'], label: '🎓 School' },
  { id: ['work', 'leadership', 'volunteer', 'research'], label: '💼 Roles' },
  { id: ['project'], label: '🧸 Projects' },
  { id: ['award', 'paper'], label: '🏆 Wins & papers' },
  { id: ['life'], label: '✨ Life' },
]

const KIND_COLOR: Record<TimelineKind, string> = {
  education: '#fff3c4',
  work: '#dcecff',
  leadership: '#ffe0f0',
  research: '#e6dcff',
  volunteer: '#d8f5e0',
  project: '#ffe9d6',
  award: '#fff0b3',
  paper: '#e3f6ff',
  life: '#f1efff',
}

const month = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

function when(item: TimelineItem) {
  if (item.ongoing) return `${month(item.date)} – now`
  if (item.end && item.end.slice(0, 7) !== item.date.slice(0, 7)) return `${month(item.date)} – ${month(item.end)}`
  return month(item.date)
}

export function Timeline({ items, onProject }: { items: TimelineItem[]; onProject?: (slug: string) => void }) {
  const [filter, setFilter] = useState(0)
  const [newestFirst, setNewestFirst] = useState(false)

  const years = useMemo(() => {
    const f = FILTERS[filter].id
    const list = items.filter((i) => f === 'all' || f.includes(i.kind))
    if (newestFirst) list.reverse()
    const groups = new Map<string, TimelineItem[]>()
    for (const item of list) {
      const y = item.date.slice(0, 4)
      groups.set(y, [...(groups.get(y) ?? []), item])
    }
    return [...groups.entries()]
  }, [items, filter, newestFirst])

  return (
    <section>
      <SectionHeading emoji="🚂" kicker="Memory Lane" title="My journey so far">
        From school exams to NASA Space Apps, all aboard the toy train, in order.
      </SectionHeading>
      <div className="mb-3 flex flex-wrap gap-2">
        {FILTERS.map((f, i) => (
          <Chip key={f.label} active={filter === i} onClick={() => setFilter(i)}>
            {f.label}
          </Chip>
        ))}
      </div>
      <button type="button" className="mb-5 text-sm font-bold text-blue underline-offset-4 hover:underline" onClick={() => setNewestFirst((v) => !v)}>
        {newestFirst ? '↓ Showing newest first' : '↑ Showing oldest first'} (flip)
      </button>
      {!years.length && <Empty emoji="🚂">No stops on this line yet.</Empty>}
      <ol className="space-y-6">
        {years.map(([year, list]) => (
          <li key={year}>
            <p className="year-badge">{year}</p>
            <ol className="mt-3 space-y-3 border-l-4 border-dashed border-ink/20 pl-5">
              {list.map((item, i) => {
                const clickable = Boolean(item.project && onProject)
                const body = (
                  <>
                    <span className="timeline-dot" aria-hidden>
                      {item.emoji}
                    </span>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-ink/50">{when(item)}</p>
                    <p className="font-display text-lg leading-tight text-ink">{item.title}</p>
                    {item.subtitle && <p className="text-sm text-ink/70">{item.subtitle}</p>}
                    {clickable && <p className="mt-1 text-xs font-bold text-blue">Open in the workshop →</p>}
                  </>
                )
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    className="relative"
                  >
                    {clickable ? (
                      <button type="button" onClick={() => onProject!(item.project!)} className="toy-card toy-card--hover block w-full px-4 py-3 text-left" style={{ background: KIND_COLOR[item.kind] }}>
                        {body}
                      </button>
                    ) : item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer" className="toy-card toy-card--hover block px-4 py-3" style={{ background: KIND_COLOR[item.kind] }}>
                        {body}
                      </a>
                    ) : (
                      <div className="toy-card px-4 py-3" style={{ background: KIND_COLOR[item.kind] }}>
                        {body}
                      </div>
                    )}
                  </motion.li>
                )
              })}
            </ol>
          </li>
        ))}
      </ol>
    </section>
  )
}

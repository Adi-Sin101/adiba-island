'use client'

import { useState } from 'react'

import type { Publication } from '@/lib/types'
import { Empty, LinkButton, Pill, SectionHeading } from './ui'

const STATUS: Record<string, { label: string; color: string }> = {
  published: { label: 'Published', color: '#c9f2d0' },
  review: { label: 'Under review', color: '#fff3c4' },
  preprint: { label: 'Preprint', color: '#dcecff' },
  progress: { label: 'In progress', color: '#ffe0f0' },
}

function Authors({ authors }: { authors: string }) {
  const parts = authors.split(',').map((a) => a.trim()).filter(Boolean)
  return (
    <p className="text-sm text-ink/70">
      {parts.map((a, i) => {
        const me = /tahsin/i.test(a)
        return (
          <span key={a}>
            {me ? <mark className="rounded bg-pink/30 px-1 font-bold text-ink">{a}</mark> : a}
            {i < parts.length - 1 && ', '}
          </span>
        )
      })}
    </p>
  )
}

export function Research({ publications }: { publications: Publication[] }) {
  const [open, setOpen] = useState<string | null>(publications[0]?.id ?? null)
  return (
    <section>
      <SectionHeading emoji="🗼" kicker="Research Lighthouse" title="Research & papers">
        Shining a light on safe, useful AI for real people.
      </SectionHeading>
      {!publications.length && <Empty emoji="📄">Papers are being written as we speak.</Empty>}
      <ul className="space-y-4">
        {publications.map((p) => {
          const status = STATUS[p.status] ?? STATUS.published
          const expanded = open === p.id
          return (
            <li key={p.id} className="toy-card p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Pill color={status.color}>{status.label}</Pill>
                {p.venue && <Pill>{p.venue}</Pill>}
                {p.year && <span className="text-sm font-semibold text-ink/60">{p.year}</span>}
              </div>
              <h3 className="font-display text-xl leading-snug text-ink">{p.title}</h3>
              {p.authors && <Authors authors={p.authors} />}
              {p.abstract && (
                <>
                  <button type="button" className="mt-3 text-sm font-bold text-blue underline-offset-4 hover:underline" onClick={() => setOpen(expanded ? null : p.id)} aria-expanded={expanded}>
                    {expanded ? 'Hide abstract ▲' : 'Read abstract ▼'}
                  </button>
                  {expanded && <p className="mt-2 leading-relaxed text-ink/80">{p.abstract}</p>}
                </>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {p.links.paper && <LinkButton href={p.links.paper}>📄 Paper</LinkButton>}
                {p.links.demo && <LinkButton href={p.links.demo} variant="ghost">🌐 Demo</LinkButton>}
                {p.links.code && <LinkButton href={p.links.code} variant="ghost">🐙 Code</LinkButton>}
                {p.links.scholar && <LinkButton href={p.links.scholar} variant="ghost">🎓 Scholar</LinkButton>}
              </div>
              {typeof p.citations === 'number' && p.citations > 0 && <p className="mt-3 text-sm text-ink/60">Cited by {p.citations}</p>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

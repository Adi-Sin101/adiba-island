'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'

import type { Project } from '@/lib/types'
import { Chip, Empty, LinkButton, Photo, Pill, SectionHeading, formatDate } from './ui'

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All toys',
  web: 'Web',
  mobile: 'Mobile',
  ai: 'AI / ML',
  systems: 'Systems',
  graphics: 'Graphics',
  research: 'Research',
  other: 'Other',
}

const TOY_EMOJI: Record<string, string> = {
  rocket: '🚀',
  robot: '🤖',
  car: '🏎️',
  teddy: '🧸',
  duck: '🦆',
  top: '🪀',
  gift: '🎁',
  blocks: '🧱',
}

const LANG_COLORS = ['#2a6bf2', '#ff7eb6', '#ffd23f', '#2fc4c9', '#ff6f61', '#b79cff']

function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const total = entries.reduce((s, [, v]) => s + v, 0)
  if (!total) return null
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full border-2 border-ink">
        {entries.map(([name, v], i) => (
          <span key={name} style={{ width: `${(v / total) * 100}%`, background: LANG_COLORS[i] }} title={name} />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/70">
        {entries.map(([name, v], i) => (
          <li key={name} className="flex items-center gap-1">
            <span className="size-2.5 rounded-full border border-ink" style={{ background: LANG_COLORS[i] }} />
            {name} {Math.round((v / total) * 100)}%
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const { links, github } = project
  return (
    <motion.article initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
      <button type="button" onClick={onBack} className="chip">
        ← Back to the shelf
      </button>
      <div>
        <p className="kicker">
          <span aria-hidden>{TOY_EMOJI[project.toy] ?? '🧸'}</span> {CATEGORY_LABELS[project.category] ?? 'Project'}
          {project.year && ` · ${project.year}`}
        </p>
        <h2 className="font-display text-4xl leading-tight text-ink">{project.title}</h2>
        {project.tagline && <p className="mt-1 text-lg text-ink/70">{project.tagline}</p>}
      </div>
      {project.cover && (
        <div className="toy-card overflow-hidden">
          <Photo img={project.cover} />
        </div>
      )}
      {project.role && <Pill color="#fff3c4">👩‍💻 {project.role}</Pill>}
      {project.description && <p className="leading-relaxed text-ink/80">{project.description}</p>}
      {project.highlights.length > 0 && (
        <ul className="space-y-2">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-ink/85">
              <span aria-hidden className="text-pink">✦</span>
              {h}
            </li>
          ))}
        </ul>
      )}
      {project.tech.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t}>
              <Pill>{t}</Pill>
            </li>
          ))}
        </ul>
      )}
      {github.languages && <LanguageBar languages={github.languages} />}
      <div className="flex flex-wrap gap-3 text-sm text-ink/60">
        {typeof github.stars === 'number' && github.stars > 0 && <span>⭐ {github.stars}</span>}
        {github.pushedAt && <span>Updated {formatDate(github.pushedAt)}</span>}
        {github.private && <span>🔒 Private repository</span>}
      </div>
      <div className="flex flex-wrap gap-3">
        {links.live && <LinkButton href={links.live}>🌐 Live demo</LinkButton>}
        {links.store && <LinkButton href={links.store}>📱 Get the app</LinkButton>}
        {links.repo && <LinkButton href={links.repo} variant="ghost">🐙 Code</LinkButton>}
        {links.paper && <LinkButton href={links.paper} variant="ghost">📄 Paper</LinkButton>}
        {links.video && <LinkButton href={links.video} variant="ghost">🎬 Video</LinkButton>}
      </div>
      {project.gallery.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {project.gallery.map((g) => (
            <div key={g.url} className="toy-card overflow-hidden">
              <Photo img={g} variant="thumb" />
            </div>
          ))}
        </div>
      )}
    </motion.article>
  )
}

export function Projects({
  projects,
  selected,
  onSelect,
}: {
  projects: Project[]
  selected?: string | null
  onSelect?: (slug: string | null) => void
}) {
  const [localSelected, setLocalSelected] = useState<string | null>(null)
  const current = selected !== undefined ? selected : localSelected
  const select = onSelect ?? setLocalSelected
  const [filter, setFilter] = useState('all')

  const categories = useMemo(() => ['all', ...new Set(projects.map((p) => p.category))], [projects])
  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter)
  const active = projects.find((p) => p.slug === current)

  if (!projects.length) return <Empty emoji="🧸">The shelves are empty for now. New toys coming soon!</Empty>

  return (
    <AnimatePresence mode="wait">
      {active ? (
        <ProjectDetail key={active.id} project={active} onBack={() => select(null)} />
      ) : (
        <motion.section key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SectionHeading emoji="🧸" kicker="Toy Workshop" title="Things I’ve built">
            Every toy on the shelf is a real project. Pick one up!
          </SectionHeading>
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
                {CATEGORY_LABELS[c] ?? c}
              </Chip>
            ))}
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {shown.map((p, i) => (
              <motion.li key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.4) }}>
                <button type="button" onClick={() => select(p.slug)} className="toy-card toy-card--hover group flex h-full w-full flex-col gap-2 p-4 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl transition-transform group-hover:-rotate-12 group-hover:scale-110" aria-hidden>
                      {TOY_EMOJI[p.toy] ?? '🧸'}
                    </span>
                    <div className="flex gap-1">
                      {p.featured && <Pill color="#ffd23f">★ Fave</Pill>}
                      {p.github.private && <Pill color="#eee">🔒</Pill>}
                    </div>
                  </div>
                  <h3 className="font-display text-xl leading-tight text-ink">{p.title}</h3>
                  <p className="text-sm text-ink/70">{p.tagline || p.description}</p>
                  <p className="mt-auto pt-2 text-xs font-semibold text-blue">{p.tech.slice(0, 4).join(' · ')}</p>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

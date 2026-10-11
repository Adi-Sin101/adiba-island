'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { FoodEntry, Look, PennyData, Place, PostCard } from '@/lib/types'
import { Lightbox } from './Lightbox'
import { Chip, Empty, Photo, Pill, SectionHeading, formatDate } from './ui'

/* ----------------------------------------------------------------- food */

const KIND_EMOJI: Record<string, string> = { seafood: '🦐', street: '🌮', dessert: '🍰', drinks: '🧋', other: '🍽️' }

export function Food({ food }: { food: FoodEntry[] }) {
  const [tab, setTab] = useState<'tried' | 'wishlist'>(food.some((f) => f.status === 'tried') ? 'tried' : 'wishlist')
  const shown = food.filter((f) => f.status === tab)
  return (
    <section>
      <SectionHeading emoji="🦐" kicker="Seafood Shack" title="Food diary">
        New food is my favourite kind of adventure. Seafood especially.
      </SectionHeading>
      <div className="mb-4 flex gap-2">
        <Chip active={tab === 'tried'} onClick={() => setTab('tried')}>
          😋 Tried it
        </Chip>
        <Chip active={tab === 'wishlist'} onClick={() => setTab('wishlist')}>
          ✨ Want to try
        </Chip>
      </div>
      {!shown.length && (
        <Empty emoji="🍽️">{tab === 'tried' ? 'Penny ate all the entries. New tasting notes coming soon!' : 'The wishlist is empty… for now.'}</Empty>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {shown.map((f, i) => (
          <motion.li key={f.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="toy-card overflow-hidden">
            {f.photo ? (
              <div className="aspect-[4/3] overflow-hidden border-b-[3px] border-ink">
                <Photo img={f.photo} variant="card" sizes="(max-width: 640px) 90vw, 260px" />
              </div>
            ) : (
              <div className="grid aspect-[4/3] place-items-center border-b-[3px] border-ink bg-[repeating-linear-gradient(45deg,#ffe9d6_0_14px,#fff6ec_14px_28px)] text-6xl" aria-hidden>
                {KIND_EMOJI[f.kind] ?? '🍽️'}
              </div>
            )}
            <div className="p-4">
              <h3 className="font-display text-lg leading-tight text-ink">{f.dish}</h3>
              {(f.place || f.city) && <p className="text-sm text-ink/70">📍 {[f.place, f.city].filter(Boolean).join(', ')}</p>}
              {f.rating ? (
                <p className="mt-1" aria-label={`${f.rating} out of 5 shells`}>
                  {'🐚'.repeat(f.rating)}
                  <span className="opacity-25">{'🐚'.repeat(5 - f.rating)}</span>
                </p>
              ) : null}
              {f.notes && <p className="mt-2 text-sm text-ink/75">{f.notes}</p>}
              {f.date && <p className="mt-2 text-xs text-ink/50">{formatDate(f.date)}</p>}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------------- fashion */

const VIBES: Record<string, string> = { all: 'All looks', traditional: 'Traditional', party: 'Party', casual: 'Casual', adventure: 'Adventure', formal: 'Formal' }

export function Fashion({ looks }: { looks: Look[] }) {
  const [vibe, setVibe] = useState('all')
  const [index, setIndex] = useState<number | null>(null)
  const vibes = useMemo(() => ['all', ...new Set(looks.map((l) => l.vibe))], [looks])
  const shown = looks.filter((l) => l.photo && (vibe === 'all' || l.vibe === vibe))
  return (
    <section>
      <SectionHeading emoji="👗" kicker="Diva Boutique" title="The lookbook">
        Outfits, moods and main-character moments.
      </SectionHeading>
      <div className="mb-4 flex flex-wrap gap-2">
        {vibes.map((v) => (
          <Chip key={v} active={vibe === v} onClick={() => setVibe(v)}>
            {VIBES[v] ?? v}
          </Chip>
        ))}
      </div>
      {!shown.length && <Empty emoji="👠">The boutique is restocking.</Empty>}
      <ul className="columns-2 gap-3 [&>li]:mb-3">
        {shown.map((l, i) => (
          <motion.li key={l.id} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="break-inside-avoid">
            <button type="button" onClick={() => setIndex(i)} className="polaroid block w-full text-left transition-transform hover:-rotate-1 hover:scale-[1.02]" style={{ rotate: `${(i % 3) - 1}deg` }}>
              <div className="overflow-hidden rounded-lg">
                <Photo img={l.photo!} variant="card" sizes="(max-width: 640px) 45vw, 240px" className="!h-auto" />
              </div>
              <p className="mt-2 font-display text-sm leading-tight text-ink">{l.title}</p>
            </button>
          </motion.li>
        ))}
      </ul>
      <Lightbox images={shown.map((l) => l.photo!)} captions={shown.map((l) => [l.title, l.caption].filter(Boolean).join(' · '))} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </section>
  )
}

/* --------------------------------------------------------------- travel */

export function Travel({ places }: { places: Place[] }) {
  const [tab, setTab] = useState<'visited' | 'bucket'>('visited')
  const [viewer, setViewer] = useState<{ place: string; index: number } | null>(null)
  const shown = places.filter((p) => p.status === tab)
  const current = places.find((p) => p.id === viewer?.place)
  return (
    <section>
      <SectionHeading emoji="🌏" kicker="Travel Dock" title="Places & adventures">
        Tea gardens, rivers, waterfalls and seaside skies. Pins on the globe are places I’ve been.
      </SectionHeading>
      <div className="mb-4 flex gap-2">
        <Chip active={tab === 'visited'} onClick={() => setTab('visited')}>
          🧳 Been there
        </Chip>
        <Chip active={tab === 'bucket'} onClick={() => setTab('bucket')}>
          🗺️ Bucket list
        </Chip>
      </div>
      {!shown.length && <Empty emoji="✈️">{tab === 'bucket' ? 'The bucket list is being drafted.' : 'Bags are packed. Stories coming soon.'}</Empty>}
      <ul className="space-y-4">
        {shown.map((p, i) => (
          <motion.li key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="toy-card overflow-hidden sm:flex">
            {!p.photos[0] && (
              <div
                className="grid aspect-[4/3] shrink-0 place-items-center border-b-[3px] border-ink bg-[repeating-linear-gradient(45deg,#dff6f7_0_14px,#f3fbfc_14px_28px)] text-6xl sm:aspect-auto sm:w-48 sm:border-b-0 sm:border-r-[3px]"
                aria-hidden
              >
                {p.status === 'bucket' ? '✈️' : '🧳'}
              </div>
            )}
            {p.photos[0] && (
              <button type="button" onClick={() => setViewer({ place: p.id, index: 0 })} className="block aspect-[4/3] shrink-0 overflow-hidden border-b-[3px] border-ink sm:aspect-auto sm:w-48 sm:border-b-0 sm:border-r-[3px]">
                <Photo img={p.photos[0]} variant="card" sizes="(max-width: 640px) 90vw, 200px" className="transition-transform duration-500 hover:scale-105" />
              </button>
            )}
            <div className="p-4">
              <h3 className="font-display text-xl leading-tight text-ink">{p.name}</h3>
              {p.location && <p className="text-sm font-bold text-blue">📍 {p.location}</p>}
              <p className="text-sm text-ink/60">{[p.country, p.when].filter(Boolean).join(' · ')}</p>
              {p.story && <p className="mt-2 text-ink/80">{p.story}</p>}
              {p.photos.length > 1 && <Pill className="mt-3">📸 {p.photos.length} photos</Pill>}
            </div>
          </motion.li>
        ))}
      </ul>
      <Lightbox images={current?.photos ?? []} index={viewer ? viewer.index : null} onClose={() => setViewer(null)} onIndex={(index) => viewer && setViewer({ ...viewer, index })} />
    </section>
  )
}

/* ----------------------------------------------------------------- blog */

export function Blog({ posts }: { posts: PostCard[] }) {
  return (
    <section>
      <SectionHeading emoji="📖" kicker="Story Cabin" title="Stories & blog">
        Trip diaries, food reviews and notes from things I build.
      </SectionHeading>
      {!posts.length && <Empty emoji="✍️">The first story is still in the oven.</Empty>}
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/blog/${p.slug}`} className="toy-card toy-card--hover flex overflow-hidden">
              {p.cover && (
                <div className="w-28 shrink-0 overflow-hidden border-r-[3px] border-ink sm:w-36">
                  <Photo img={p.cover} variant="thumb" sizes="150px" />
                </div>
              )}
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-ink/50">{formatDate(p.publishedAt)}</p>
                <h3 className="font-display text-xl leading-tight text-ink">{p.title}</h3>
                {p.excerpt && <p className="mt-1 text-sm text-ink/70">{p.excerpt}</p>}
                <p className="mt-2 text-sm font-bold text-blue">Read the story →</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- penny */

export function Penny({ penny }: { penny: PennyData }) {
  const [index, setIndex] = useState<number | null>(null)
  const [meow, setMeow] = useState<string | null>(null)
  return (
    <section>
      <SectionHeading emoji="🐱" kicker="Penny’s Hammock" title="Meet Penny">
        {penny.intro}
      </SectionHeading>
      <div className="mb-5 grid grid-cols-2 gap-3">
        {penny.photos.map((p, i) => (
          <button key={p.url} type="button" onClick={() => setIndex(i)} className="polaroid transition-transform hover:scale-[1.03]" style={{ rotate: `${i % 2 ? 2 : -2}deg` }}>
            <div className="aspect-square overflow-hidden rounded-lg">
              <Photo img={p} variant="thumb" sizes="200px" />
            </div>
          </button>
        ))}
      </div>
      {penny.facts.length > 0 && (
        <dl className="toy-card divide-y-2 divide-dashed divide-ink/15 px-4">
          {penny.facts.map((f) => (
            <div key={f.label} className="flex justify-between gap-4 py-2 text-sm">
              <dt className="font-bold text-ink/60">{f.label}</dt>
              <dd className="text-right font-semibold text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {penny.meows.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="toy-btn" onClick={() => setMeow(penny.meows[Math.floor(Math.random() * penny.meows.length)])}>
            🐾 Pet Penny
          </button>
          {meow && (
            <motion.p key={meow} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="speech !static">
              {meow}
            </motion.p>
          )}
        </div>
      )}
      <Lightbox images={penny.photos} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </section>
  )
}

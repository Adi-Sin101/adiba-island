'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import type { ProfileData } from '@/lib/types'
import { LinkButton, Photo, Socials } from './ui'

function RotatingRole({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (roles.length < 2) return
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2400)
    return () => clearInterval(t)
  }, [roles.length])
  if (!roles.length) return null
  return (
    <span className="relative inline-flex h-[1.4em] min-w-[12ch] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="whitespace-nowrap text-blue"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function About({ profile, onContact }: { profile: ProfileData; onContact?: () => void }) {
  return (
    <section aria-labelledby="about-title" className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {profile.avatar && (
          <div className="polaroid w-40 shrink-0 -rotate-3 self-center sm:self-auto">
            <div className="aspect-square overflow-hidden rounded-xl">
              <Photo img={profile.avatar} variant="thumb" sizes="160px" priority />
            </div>
            <p className="mt-2 text-center font-display text-sm text-ink/70">{profile.nickname} ✨</p>
          </div>
        )}
        <div>
          <p className="kicker">
            <span aria-hidden>🌺</span> {profile.greeting}
          </p>
          <h2 id="about-title" className="font-display text-4xl leading-none text-ink sm:text-5xl">
            I&apos;m {profile.name.split(' ')[0]}
            <span className="text-pink">.</span>
          </h2>
          <p className="mt-2 text-lg font-semibold text-ink/80">
            <RotatingRole roles={profile.roles} />
          </p>
          {profile.tagline && <p className="mt-1 text-sm font-bold text-ink/70">{profile.tagline}</p>}
          {profile.nickname && (
            <p className="mt-1 text-sm text-ink/60">
              a.k.a. <strong className="text-ink">{profile.nickname}</strong>, and yes, the pun is the brand.
            </p>
          )}
        </div>
      </div>

      {profile.headline && <p className="text-lg leading-relaxed text-ink">{profile.headline}</p>}
      {profile.bio && <p className="leading-relaxed text-ink/75">{profile.bio}</p>}

      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          ['Now', profile.currentlyAt],
          ['Based in', profile.location],
          ['Open to', profile.openTo],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="toy-card px-4 py-3">
              <dt className="text-xs font-bold uppercase tracking-widest text-ink/50">{k}</dt>
              <dd className="mt-1 font-semibold text-ink">{v}</dd>
            </div>
          ))}
      </dl>

      {profile.funFacts.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {profile.funFacts.map((f, i) => (
            <li key={f.text} className="sticker" style={{ rotate: `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` }}>
              <span aria-hidden>{f.emoji}</span> {f.text}
            </li>
          ))}
        </ul>
      )}

      {profile.education.length > 0 && (
        <div>
          <h3 className="mb-2 font-display text-xl text-ink">🎓 School days</h3>
          <ol className="space-y-2">
            {profile.education.map((e) => (
              <li key={e.degree} className="toy-card px-4 py-3">
                <p className="font-bold text-ink">{e.degree}</p>
                <p className="text-sm text-ink/70">{e.school}</p>
                <p className="text-xs font-semibold text-blue">
                  {[e.period, e.grade].filter(Boolean).join(' · ')}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {profile.cvUrl && <LinkButton href={profile.cvUrl}>📄 Download CV</LinkButton>}
        {onContact ? (
          <button type="button" className="toy-btn toy-btn--ghost" onClick={onContact}>
            💌 Say hello
          </button>
        ) : (
          profile.email && <LinkButton href={`mailto:${profile.email}`} variant="ghost">💌 Say hello</LinkButton>
        )}
      </div>
      <Socials socials={profile.socials} />
    </section>
  )
}

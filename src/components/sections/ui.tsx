'use client'

import clsx from 'clsx'
import Image from 'next/image'
import type { ReactNode } from 'react'

import type { Img } from '@/lib/types'

export function SectionHeading({ emoji, kicker, title, children }: { emoji: string; kicker: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-5">
      <p className="kicker">
        <span aria-hidden>{emoji}</span> {kicker}
      </p>
      <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      {children && <p className="mt-2 text-ink/70">{children}</p>}
    </header>
  )
}

export function Pill({ children, color, className }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span className={clsx('pill', className)} style={color ? { background: color } : undefined}>
      {children}
    </span>
  )
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={clsx('chip', active && 'chip--on')} aria-pressed={active}>
      {children}
    </button>
  )
}

export function Photo({
  img,
  sizes = '(max-width: 768px) 90vw, 420px',
  className,
  variant = 'card',
  priority,
}: {
  img: Img
  sizes?: string
  className?: string
  variant?: 'thumb' | 'card' | 'large'
  priority?: boolean
}) {
  const src = (variant === 'thumb' ? img.thumb : variant === 'large' ? img.large : img.card) ?? img.url
  return (
    <Image
      src={src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      sizes={sizes}
      priority={priority}
      className={clsx('h-full w-full object-cover', className)}
    />
  )
}

export function LinkButton({ href, children, variant = 'solid' }: { href: string; children: ReactNode; variant?: 'solid' | 'ghost' }) {
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      className={clsx('toy-btn', variant === 'ghost' && 'toy-btn--ghost')}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export function Empty({ emoji, children }: { emoji: string; children: ReactNode }) {
  return (
    <div className="toy-card flex flex-col items-center gap-2 p-8 text-center text-ink/70">
      <span className="text-4xl" aria-hidden>
        {emoji}
      </span>
      {children}
    </div>
  )
}

export const SOCIAL_META: Record<string, { label: string; emoji: string; color: string }> = {
  github: { label: 'GitHub', emoji: '🐙', color: '#ece8ff' },
  linkedin: { label: 'LinkedIn', emoji: '💼', color: '#dcecff' },
  instagram: { label: 'Instagram', emoji: '📸', color: '#ffe0f0' },
  facebook: { label: 'Facebook', emoji: '👋', color: '#e2ebff' },
  scholar: { label: 'Scholar', emoji: '🎓', color: '#fff3c4' },
  x: { label: 'X', emoji: '✖️', color: '#eeeeee' },
  youtube: { label: 'YouTube', emoji: '▶️', color: '#ffe1e1' },
  website: { label: 'Website', emoji: '🌐', color: '#dff8f0' },
}

export function Socials({ socials }: { socials: { platform: string; url: string; handle?: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {socials.map((s) => {
        const meta = SOCIAL_META[s.platform] ?? SOCIAL_META.website
        return (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer" className="social" style={{ background: meta.color }}>
              <span aria-hidden>{meta.emoji}</span> {meta.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export { formatDate } from '@/lib/format'

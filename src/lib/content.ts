import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Media } from '@/payload-types'
import { buildTimeline } from './timeline'
import type { Img, SiteContent } from './types'

const str = (v: unknown) => (typeof v === 'string' ? v : '')

// Payload returns absolute URLs when serverURL is set; keep same-origin media relative for next/image.
const rel = (url?: string | null) => (url ? url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '') : undefined)

export function toImg(m: unknown): Img | null {
  if (!m || typeof m !== 'object') return null
  const media = m as Media
  if (!media.url) return null
  return {
    url: rel(media.url)!,
    alt: media.alt ?? '',
    width: media.width ?? 1200,
    height: media.height ?? 1200,
    thumb: rel(media.sizes?.thumb?.url),
    card: rel(media.sizes?.card?.url),
    large: rel(media.sizes?.large?.url),
  }
}

const DEFAULT_SONG = 'https://www.youtube.com/watch?v=cKs83ZQxYKA'

/** Accepts watch, youtu.be, embed and shorts links (or a bare 11-character id). */
function youtubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) ?? url.match(/^([\w-]{11})$/)
  return m ? m[1] : null
}

const imgs = (list: unknown) => (Array.isArray(list) ? list.map(toImg).filter((x): x is Img => x !== null) : [])

const visible = { visible: { not_equals: false } } as const

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const payload = await getPayload({ config })
  const all = { depth: 1, limit: 200, pagination: false } as const

  const [profile, penny, projects, publications, experiences, achievements, skills, looks, places, food, posts, milestones, radio] =
    await Promise.all([
      payload.findGlobal({ slug: 'profile', depth: 1 }),
      payload.findGlobal({ slug: 'penny', depth: 1 }),
      payload.find({ collection: 'projects', where: visible, sort: 'order', ...all }),
      payload.find({ collection: 'publications', where: visible, sort: 'order', ...all }),
      payload.find({ collection: 'experiences', where: visible, sort: 'order', ...all }),
      payload.find({ collection: 'achievements', where: visible, sort: 'order', ...all }),
      payload.find({ collection: 'skills', sort: 'order', ...all }),
      payload.find({ collection: 'looks', where: visible, sort: 'order', ...all }),
      payload.find({ collection: 'places', where: visible, sort: 'order', ...all }),
      payload.find({ collection: 'food', where: visible, sort: 'order', ...all }),
      payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        sort: '-publishedAt',
        depth: 1,
        limit: 50,
      }),
      payload.find({ collection: 'milestones', where: visible, sort: 'date', ...all }),
      payload.findGlobal({ slug: 'radio', depth: 1 }),
    ])

  const base: Omit<SiteContent, 'timeline'> = {
    radio: {
      enabled: radio.enabled !== false,
      title: radio.title === undefined ? 'Dard-e-Disco · Om Shanti Om' : str(radio.title),
      // fall back to the default song until the Radio settings are saved once in the admin
      youtubeId: youtubeId(radio.youtubeUrl === undefined ? DEFAULT_SONG : radio.youtubeUrl),
      audioUrl: toImg(radio.audio)?.url ?? null,
      volume: Math.min(100, Math.max(1, radio.volume ?? 15)),
      waves: radio.waves !== false,
    },
    profile: {
      name: str(profile.name) || 'Adiba Tahsin',
      nickname: str(profile.nickname),
      greeting: str(profile.greeting) || 'Aloha!',
      roles: (profile.roles ?? []).map((r) => r.text),
      headline: str(profile.headline),
      bio: str(profile.bio),
      funFacts: (profile.funFacts ?? []).map((f) => ({ emoji: str(f.emoji), text: f.text })),
      avatar: toImg(profile.avatar),
      currentlyAt: str(profile.currentlyAt),
      location: str(profile.location),
      tagline: str(profile.tagline),
      openTo: str(profile.openTo),
      email: str(profile.email),
      socials: (profile.socials ?? []).map((s) => ({ platform: s.platform, url: s.url, handle: str(s.handle) })),
      cvUrl: toImg(profile.cv)?.url ?? null,
      education: (profile.education ?? []).map((e) => ({
        degree: e.degree,
        school: e.school,
        period: str(e.period),
        grade: str(e.grade),
        startDate: e.startDate ?? undefined,
      })),
    },
    penny: {
      intro: str(penny.intro),
      facts: (penny.facts ?? []).map((f) => ({ label: f.label, value: f.value })),
      meows: (penny.meows ?? []).map((m) => m.text),
      photos: imgs(penny.photos),
    },
    projects: projects.docs.map((p) => ({
      id: String(p.id),
      slug: str(p.slug),
      title: p.title,
      tagline: str(p.tagline),
      description: str(p.description),
      highlights: (p.highlights ?? []).map((h) => h.text),
      category: str(p.category) || 'other',
      toy: str(p.toy) || 'blocks',
      year: str(p.year),
      role: str(p.role),
      tech: (p.tech ?? []).map((t) => t.name),
      cover: toImg(p.cover),
      gallery: imgs(p.gallery),
      links: {
        repo: p.showRepoLink === false ? undefined : (p.links?.repo ?? undefined),
        live: p.links?.live ?? undefined,
        paper: p.links?.paper ?? undefined,
        video: p.links?.video ?? undefined,
        store: p.links?.store ?? undefined,
      },
      github: {
        fullName: p.showRepoLink === false ? undefined : (p.github?.fullName ?? undefined),
        private: p.github?.private ?? undefined,
        stars: p.github?.stars ?? undefined,
        languages: (p.github?.languages as Record<string, number> | undefined) ?? undefined,
        pushedAt: p.github?.pushedAt ?? undefined,
      },
      featured: Boolean(p.featured),
      date: p.date ?? undefined,
    })),
    publications: publications.docs.map((p) => ({
      id: String(p.id),
      title: p.title,
      authors: str(p.authors),
      venue: str(p.venue),
      year: str(p.year),
      status: str(p.status),
      abstract: str(p.abstract),
      links: {
        paper: p.links?.paper ?? undefined,
        scholar: p.links?.scholar ?? undefined,
        code: p.links?.code ?? undefined,
        demo: p.links?.demo ?? undefined,
      },
      citations: p.citations ?? undefined,
    })),
    experiences: experiences.docs.map((e) => ({
      id: String(e.id),
      role: e.role,
      organization: e.organization,
      kind: str(e.kind),
      period: str(e.period),
      location: str(e.location),
      summary: str(e.summary),
      highlights: (e.highlights ?? []).map((h) => h.text),
      url: e.url ?? undefined,
      startDate: e.startDate ?? undefined,
      endDate: e.endDate ?? undefined,
    })),
    achievements: achievements.docs.map((a) => ({
      id: String(a.id),
      title: a.title,
      event: str(a.event),
      year: str(a.year),
      description: str(a.description),
      medal: str(a.medal) || 'star',
    })),
    skills: skills.docs.map((s) => ({ id: String(s.id), name: s.name, group: str(s.group), level: s.level ?? 3 })),
    looks: looks.docs.map((l) => ({
      id: String(l.id),
      title: l.title,
      vibe: str(l.vibe),
      caption: str(l.caption),
      photo: toImg(l.photo),
    })),
    places: places.docs.map((p) => ({
      id: String(p.id),
      name: p.name,
      location: str(p.location),
      country: str(p.country),
      status: str(p.status),
      lat: p.lat ?? undefined,
      lng: p.lng ?? undefined,
      when: str(p.when),
      story: str(p.story),
      photos: imgs(p.photos),
    })),
    food: food.docs.map((f) => ({
      id: String(f.id),
      dish: f.dish,
      place: str(f.place),
      city: str(f.city),
      status: str(f.status),
      kind: str(f.kind),
      rating: f.rating ?? undefined,
      date: f.date ?? undefined,
      notes: str(f.notes),
      photo: toImg(f.photo),
    })),
    posts: posts.docs.map((p) => ({
      id: String(p.id),
      slug: str(p.slug),
      title: p.title,
      excerpt: str(p.excerpt),
      cover: toImg(p.cover),
      tags: (p.tags ?? []) as string[],
      publishedAt: p.publishedAt ?? undefined,
    })),
  }

  const timeline = buildTimeline(base, {
    achievements: achievements.docs.map((a) => ({ id: String(a.id), title: a.title, event: str(a.event), date: a.date ?? undefined })),
    publications: publications.docs.map((p) => ({ id: String(p.id), title: p.title, venue: str(p.venue), date: p.date ?? undefined })),
    milestones: milestones.docs.map((m) => ({
      id: String(m.id),
      title: m.title,
      emoji: str(m.emoji) || '✨',
      date: m.date,
      description: str(m.description),
      link: m.link ?? undefined,
    })),
  })

  return { ...base, timeline }
})

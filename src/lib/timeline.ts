import type { SiteContent, TimelineItem, TimelineKind } from './types'

type Extra = {
  achievements: { id: string; title: string; event: string; date?: string }[]
  publications: { id: string; title: string; venue: string; date?: string }[]
  milestones: { id: string; title: string; emoji: string; date: string; description: string; link?: string }[]
}

const EXPERIENCE_EMOJI: Record<string, string> = {
  work: '💻',
  leadership: '🎤',
  research: '🔬',
  volunteer: '🤝',
  education: '🎓',
}

/**
 * Merges school, jobs, projects, awards, papers and custom milestones into one
 * oldest-first list. Anything without a date stays off the timeline.
 */
export function buildTimeline(content: Omit<SiteContent, 'timeline'>, extra: Extra): TimelineItem[] {
  const items: TimelineItem[] = []

  for (const [i, e] of content.profile.education.entries()) {
    if (!e.startDate) continue
    items.push({ id: `edu-${i}`, date: e.startDate, kind: 'education', title: e.degree, subtitle: [e.school, e.grade].filter(Boolean).join(' · '), emoji: '🎓' })
  }

  for (const e of content.experiences) {
    if (!e.startDate) continue
    items.push({
      id: `exp-${e.id}`,
      date: e.startDate,
      end: e.endDate,
      ongoing: !e.endDate && /present/i.test(e.period),
      kind: (['work', 'leadership', 'research', 'volunteer', 'education'].includes(e.kind) ? e.kind : 'work') as TimelineKind,
      title: e.role,
      subtitle: e.organization,
      emoji: EXPERIENCE_EMOJI[e.kind] ?? '💼',
    })
  }

  for (const p of content.projects) {
    if (!p.date) continue
    items.push({ id: `proj-${p.id}`, date: p.date, kind: 'project', title: p.title, subtitle: p.tagline, emoji: '🧸', project: p.slug })
  }

  for (const a of extra.achievements) {
    if (!a.date) continue
    items.push({ id: `award-${a.id}`, date: a.date, kind: 'award', title: a.title, subtitle: a.event, emoji: '🏆' })
  }

  for (const p of extra.publications) {
    if (!p.date) continue
    items.push({ id: `paper-${p.id}`, date: p.date, kind: 'paper', title: p.title, subtitle: p.venue, emoji: '📄' })
  }

  for (const m of extra.milestones) {
    items.push({ id: `life-${m.id}`, date: m.date, kind: 'life', title: m.title, subtitle: m.description, emoji: m.emoji, link: m.link })
  }

  return items.sort((a, b) => a.date.localeCompare(b.date))
}

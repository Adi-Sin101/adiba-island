'use client'

import type { ZoneId } from '@/components/island/zones'
import type { SiteContent } from '@/lib/types'
import { About } from './About'
import { Contact } from './Contact'
import { Experience } from './Experience'
import { Blog, Fashion, Food, Penny, Travel } from './Lifestyle'
import { Projects } from './Projects'
import { Research } from './Research'
import { Skills } from './Skills'
import { Timeline } from './Timeline'

export function ZoneContent({
  zone,
  content,
  selectedProject,
  onSelectProject,
  onContact,
  onProject,
}: {
  zone: ZoneId
  content: SiteContent
  selectedProject?: string | null
  onSelectProject?: (slug: string | null) => void
  onContact?: () => void
  onProject?: (slug: string) => void
}) {
  switch (zone) {
    case 'welcome':
      return <About profile={content.profile} onContact={onContact} />
    case 'timeline':
      return <Timeline items={content.timeline} onProject={onProject} />
    case 'workshop':
      return <Projects projects={content.projects} selected={selectedProject} onSelect={onSelectProject} />
    case 'blocks':
      return <Skills skills={content.skills} />
    case 'lighthouse':
      return <Research publications={content.publications} />
    case 'stage':
      return <Experience experiences={content.experiences} achievements={content.achievements} />
    case 'boutique':
      return <Fashion looks={content.looks} />
    case 'shack':
      return <Food food={content.food} />
    case 'dock':
      return <Travel places={content.places} />
    case 'cabin':
      return <Blog posts={content.posts} />
    case 'hammock':
      return <Penny penny={content.penny} />
    case 'mailbox':
      return <Contact profile={content.profile} />
  }
}

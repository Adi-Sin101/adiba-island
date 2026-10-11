// Plain, serialisable shapes passed from the server to the island (client) components.

export type Img = {
  url: string
  alt: string
  width: number
  height: number
  thumb?: string
  card?: string
  large?: string
}

export type Social = { platform: string; url: string; handle?: string }

export type ProfileData = {
  name: string
  nickname: string
  greeting: string
  roles: string[]
  headline: string
  bio: string
  funFacts: { emoji: string; text: string }[]
  avatar: Img | null
  currentlyAt: string
  location: string
  tagline: string
  openTo: string
  email: string
  socials: Social[]
  cvUrl: string | null
  education: { degree: string; school: string; period: string; grade: string; startDate?: string }[]
}

export type PennyData = {
  intro: string
  facts: { label: string; value: string }[]
  meows: string[]
  photos: Img[]
}

export type Project = {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  highlights: string[]
  category: string
  toy: string
  year: string
  role: string
  tech: string[]
  cover: Img | null
  gallery: Img[]
  links: { repo?: string; live?: string; paper?: string; video?: string; store?: string }
  github: { fullName?: string; private?: boolean; stars?: number; languages?: Record<string, number>; pushedAt?: string }
  featured: boolean
  date?: string
}

export type Publication = {
  id: string
  title: string
  authors: string
  venue: string
  year: string
  status: string
  abstract: string
  links: { paper?: string; scholar?: string; code?: string; demo?: string }
  citations?: number
}

export type Experience = {
  id: string
  role: string
  organization: string
  kind: string
  period: string
  location: string
  summary: string
  highlights: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export type Achievement = { id: string; title: string; event: string; year: string; description: string; medal: string }

export type Skill = { id: string; name: string; group: string; level: number }

export type Look = { id: string; title: string; vibe: string; caption: string; photo: Img | null }

export type Place = {
  id: string
  name: string
  country: string
  status: string
  lat?: number
  lng?: number
  when: string
  story: string
  photos: Img[]
}

export type FoodEntry = {
  id: string
  dish: string
  place: string
  city: string
  status: string
  kind: string
  rating?: number
  date?: string
  notes: string
  photo: Img | null
}

export type PostCard = {
  id: string
  slug: string
  title: string
  excerpt: string
  cover: Img | null
  tags: string[]
  publishedAt?: string
}

export type TimelineKind = 'education' | 'work' | 'leadership' | 'research' | 'volunteer' | 'project' | 'award' | 'paper' | 'life'

export type TimelineItem = {
  id: string
  date: string
  end?: string
  ongoing?: boolean
  kind: TimelineKind
  title: string
  subtitle: string
  emoji: string
  /** Project slug, for jumping to the project in the workshop. */
  project?: string
  link?: string
}

export type SiteContent = {
  profile: ProfileData
  penny: PennyData
  projects: Project[]
  publications: Publication[]
  experiences: Experience[]
  achievements: Achievement[]
  skills: Skill[]
  looks: Look[]
  places: Place[]
  food: FoodEntry[]
  posts: PostCard[]
  timeline: TimelineItem[]
}

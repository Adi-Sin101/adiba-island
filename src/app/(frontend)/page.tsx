import { IslandApp } from '@/components/island/IslandApp'
import { getSiteContent } from '@/lib/content'

export const revalidate = 3600

export default async function HomePage() {
  const content = await getSiteContent()
  const { profile } = content

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.nickname,
    jobTitle: profile.roles[0],
    description: profile.headline,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location,
    alumniOf: profile.education.map((e) => e.school),
    sameAs: profile.socials.map((s) => s.url),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Text version of the island for search engines and screen readers. */}
      <div className="sr-only">
        <h1>
          {profile.name} ({profile.nickname})
        </h1>
        <p>{profile.headline}</p>
        <p>{profile.bio}</p>
        <h2>Projects</h2>
        <ul>
          {content.projects.map((p) => (
            <li key={p.id}>
              {p.title}: {p.tagline || p.description}
            </li>
          ))}
        </ul>
        <h2>Research</h2>
        <ul>
          {content.publications.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
        <h2>Experience</h2>
        <ul>
          {content.experiences.map((e) => (
            <li key={e.id}>
              {e.role}, {e.organization}
            </li>
          ))}
        </ul>
        <p>
          <a href="/classic">Open the classic, text-first version of this portfolio</a>
        </p>
      </div>
      <IslandApp content={content} />
    </>
  )
}

import Link from 'next/link'

export function Logo() {
  return (
    <div className="adiba-logo">
      <span className="adiba-logo__badge">🏝️</span>
      <span>
        <strong>Adiba&apos;s Island</strong>
        <small>Headquarters</small>
      </span>
    </div>
  )
}

export function Icon() {
  return <span className="adiba-icon">🏝️</span>
}

const shortcuts = [
  { href: '/admin/collections/projects', emoji: '🧸', label: 'Projects', hint: 'Workshop toys' },
  { href: '/admin/collections/posts/create', emoji: '📖', label: 'Write a story', hint: 'Story Cabin' },
  { href: '/admin/collections/food/create', emoji: '🦐', label: 'Log a dish', hint: 'Seafood Shack' },
  { href: '/admin/collections/looks/create', emoji: '👗', label: 'Add a look', hint: 'Diva Boutique' },
  { href: '/admin/collections/places/create', emoji: '🌏', label: 'Pin a place', hint: 'Travel Dock' },
  { href: '/admin/globals/penny', emoji: '🐱', label: 'Penny', hint: 'Hammock album' },
  { href: '/admin/collections/messages', emoji: '💌', label: 'Inbox', hint: 'Mailbox notes' },
  { href: '/admin/globals/profile', emoji: '✨', label: 'Profile', hint: 'Intro, socials, CV' },
]

export function Welcome() {
  return (
    <section className="adiba-welcome">
      <div className="adiba-welcome__hero">
        <div>
          <h2>Aloha, Diva! 🌺</h2>
          <p>Everything on your island lives here. Change it, save it, and the site updates by itself.</p>
        </div>
        <Link href="/" target="_blank" className="adiba-welcome__visit">
          Visit the island ↗
        </Link>
      </div>
      <div className="adiba-welcome__grid">
        {shortcuts.map((s) => (
          <Link key={s.href} href={s.href} className="adiba-welcome__card">
            <span className="adiba-welcome__emoji">{s.emoji}</span>
            <strong>{s.label}</strong>
            <small>{s.hint}</small>
          </Link>
        ))}
      </div>
    </section>
  )
}

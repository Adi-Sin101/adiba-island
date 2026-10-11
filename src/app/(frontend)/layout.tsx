import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import type { ReactNode } from 'react'

import { getSiteContent } from '@/lib/content'
import './globals.css'

const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka', weight: ['500', '600', '700'] })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteContent()
  const title = `${profile.name} · ${profile.nickname || 'Portfolio'}`
  const description =
    profile.headline || 'Full-stack developer and CSE student at KUET. Explore my projects on a 3D toy island.'
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${profile.name}` },
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: profile.avatar ? [{ url: profile.avatar.card ?? profile.avatar.url }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
    icons: { icon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏝️</text></svg>` },
  }
}

export const viewport: Viewport = {
  themeColor: '#8fd3ff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  )
}

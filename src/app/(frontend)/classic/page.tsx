import type { Metadata } from 'next'

import { getSiteContent } from '@/lib/content'
import { ClassicView } from './ClassicView'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Classic view',
  description: 'The quick, text-first version of the portfolio: projects, research, experience and more.',
}

export default async function ClassicPage() {
  const content = await getSiteContent()
  return <ClassicView content={content} />
}

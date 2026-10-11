import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import { formatDate } from '@/lib/format'
import { toImg } from '@/lib/content'

export const revalidate = 3600

const getPost = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 100, depth: 0 })
  return res.docs.map((p) => ({ slug: p.slug as string }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  const cover = toImg(post.cover)
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined, images: cover ? [cover.card ?? cover.url] : undefined },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug)
  if (!post) notFound()
  const cover = toImg(post.cover)

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#d8f5e0_0,#fffaf2_420px)]">
      <article className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/" className="chip">
          ← Back to the island
        </Link>
        <p className="kicker mt-8">📖 Story Cabin · {formatDate(post.publishedAt ?? undefined)}</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-3 text-lg text-ink/70">{post.excerpt}</p>}
        {cover && (
          <div className="polaroid mt-8 -rotate-1">
            <Image src={cover.large ?? cover.url} alt={cover.alt} width={cover.width} height={cover.height} className="w-full rounded-lg" sizes="(max-width: 700px) 92vw, 640px" priority />
          </div>
        )}
        {post.content && (
          <div className="prose-toy mt-8 text-ink">
            <RichText data={post.content} />
          </div>
        )}
        <div className="mt-12 flex justify-center">
          <Link href="/" className="toy-btn">
            🏝️ Explore the island
          </Link>
        </div>
      </article>
    </div>
  )
}

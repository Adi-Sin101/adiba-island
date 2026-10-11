/**
 * Fills the database with Adiba's starting content.
 * Run with `npm run seed`. Re-running wipes and recreates the seeded collections
 * (but never touches users or the contact inbox).
 */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'
import { fileURLToPath } from 'url'

import * as data from './data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const asset = (file: string) => path.join(dirname, 'assets', file)

const SEEDED = ['projects', 'publications', 'experiences', 'achievements', 'skills', 'food', 'looks', 'places', 'posts', 'milestones', 'media'] as const

async function upload(payload: Payload, file: string, alt: string) {
  const buffer = fs.readFileSync(asset(file))
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      name: file,
      size: buffer.length,
      mimetype: file.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
    },
  })
  return doc.id
}

const paragraph = (text: string) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }],
})

async function seed() {
  const payload = await getPayload({ config })
  const log = (msg: string) => payload.logger.info(`🌴 ${msg}`)

  for (const collection of SEEDED) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
  log('Cleared seeded collections')

  // Admin account (only created once). Password comes from .env so it never lands in git.
  const email = process.env.SEED_ADMIN_EMAIL || data.profile.email
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (!existing.docs.length) {
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!password) throw new Error('Set SEED_ADMIN_PASSWORD in .env before seeding.')
    await payload.create({ collection: 'users', data: { email, password, name: data.profile.name } })
    log(`Created admin user ${email}`)
  }

  const avatar = await upload(payload, 'photo-03.jpg', 'Adiba smiling in an emerald dress')
  const cv = await upload(payload, 'Adiba-Tahsin-CV.pdf', 'Adiba Tahsin CV')
  const og = await upload(payload, 'photo-00.jpg', 'Adiba in a pink gingham dress on a beach log')

  await payload.updateGlobal({
    slug: 'profile',
    data: {
      ...data.profile,
      roles: data.profile.roles.map((text) => ({ text })),
      socials: data.profile.socials as never,
      avatar,
      cv,
      ogImage: og,
    },
  })
  log('Profile ready')

  const pennyPhotos: number[] = []
  for (const [i, file] of data.penny.photos.entries()) {
    pennyPhotos.push(await upload(payload, file, `Penny the cat napping, photo ${i + 1}`))
  }
  await payload.updateGlobal({
    slug: 'penny',
    data: {
      intro: data.penny.intro,
      facts: data.penny.facts,
      meows: data.penny.meows.map((text) => ({ text })),
      photos: pennyPhotos,
    },
  })
  log('Penny is napping in her hammock')

  for (const [i, p] of data.projects.entries()) {
    const images: number[] = []
    for (const file of p.images) images.push(await upload(payload, `projects/${file}`, `${p.title} preview`))
    await payload.create({
      collection: 'projects',
      data: {
        title: p.title,
        tagline: p.tagline,
        description: p.description,
        highlights: p.highlights?.map((text) => ({ text })),
        category: p.category,
        toy: p.toy,
        year: p.date.slice(0, 4),
        role: p.role,
        tech: p.tech.map((name) => ({ name })),
        links: p.links ?? {},
        github: p.github ? { fullName: p.github, private: Boolean(p.private) } : undefined,
        date: p.date,
        cover: images[0],
        gallery: images.slice(1),
        showRepoLink: !p.private,
        featured: Boolean(p.featured),
        visible: true,
        order: (i + 1) * 10,
      },
    })
  }
  log(`${data.projects.length} projects on the workshop shelves`)

  for (const [i, pub] of data.publications.entries()) {
    await payload.create({ collection: 'publications', data: { ...pub, order: i } })
  }
  for (const [i, e] of data.experiences.entries()) {
    const { highlights, ...rest } = e as typeof e & { highlights?: string[] }
    await payload.create({ collection: 'experiences', data: { ...rest, highlights: highlights?.map((text) => ({ text })), order: i } })
  }
  for (const m of data.milestones) {
    await payload.create({ collection: 'milestones', data: m })
  }
  for (const [i, a] of data.achievements.entries()) {
    await payload.create({ collection: 'achievements', data: { ...a, order: i } })
  }
  for (const [i, s] of data.skills.entries()) {
    await payload.create({ collection: 'skills', data: { ...s, group: s.group as never, order: i } })
  }
  log('Experience, papers, awards and skills added')

  for (const [i, look] of data.looks.entries()) {
    const photo = await upload(payload, look.file, `Adiba wearing: ${look.title}`)
    await payload.create({ collection: 'looks', data: { title: look.title, vibe: look.vibe as never, photo, order: i } })
  }
  for (const [i, place] of data.places.entries()) {
    const photos: number[] = []
    for (const file of place.files) photos.push(await upload(payload, file, `Adiba at ${place.name}`))
    await payload.create({
      collection: 'places',
      data: { name: place.name, location: place.location, lat: place.lat, lng: place.lng, story: place.story, photos, order: i },
    })
  }
  for (const [i, dish] of data.food.entries()) {
    await payload.create({ collection: 'food', data: { ...dish, kind: dish.kind as never, status: 'wishlist', order: i } })
  }
  log('Lookbook, travel and food diary stocked')

  await payload.create({
    collection: 'posts',
    data: {
      title: data.welcomePost.title,
      excerpt: data.welcomePost.excerpt,
      tags: data.welcomePost.tags as never,
      cover: og,
      _status: 'published',
      publishedAt: new Date().toISOString(),
      content: {
        root: {
          type: 'root',
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          children: data.welcomePost.paragraphs.map(paragraph),
        },
      },
    },
  })
  log('First story published. Island seeded! 🏝️')
  process.exit(0)
}

await seed()

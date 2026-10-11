// Syncs the Travel map with src/seed/data.ts without wiping anything:
// existing places (matched by name) get their location, pin, status and story updated
// (photos untouched); places that don't exist yet are created with their photos.
//   npm run places:apply        → local database
//   npm run places:apply:prod   → live database
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'

import { places } from '../src/seed/data'

const assets = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/seed/assets')
const payload = await getPayload({ config })

for (const [order, place] of places.entries()) {
  const fields = {
    location: place.location ?? null,
    lat: place.lat ?? null,
    lng: place.lng ?? null,
    story: place.story,
    status: place.status ?? 'visited',
    country: place.country ?? 'Bangladesh',
    order,
  }
  const { docs } = await payload.find({ collection: 'places', where: { name: { equals: place.name } }, limit: 1 })

  if (docs[0]) {
    await payload.update({ collection: 'places', id: docs[0].id, data: fields })
    payload.logger.info(`Updated ${place.name}`)
    continue
  }

  const photos: number[] = []
  for (const file of place.files) {
    const data = fs.readFileSync(path.join(assets, file))
    const media = await payload.create({
      collection: 'media',
      data: { alt: `Adiba at ${place.name}` },
      file: { data, name: file, size: data.length, mimetype: 'image/jpeg' },
    })
    photos.push(media.id)
  }
  await payload.create({ collection: 'places', data: { name: place.name, ...fields, photos } })
  payload.logger.info(`Created ${place.name}`)
}
process.exit(0)

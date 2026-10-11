// Copies place locations, globe coordinates and stories from src/seed/data.ts onto
// existing Travel entries (matched by name) without touching their photos.
//   npm run places:apply        → local database
//   npm run places:apply:prod   → live database
import config from '@payload-config'
import { getPayload } from 'payload'

import { places } from '../src/seed/data'

const payload = await getPayload({ config })
for (const place of places) {
  const { docs } = await payload.find({ collection: 'places', where: { name: { equals: place.name } }, limit: 1 })
  if (!docs[0]) {
    payload.logger.warn(`No place named "${place.name}"`)
    continue
  }
  await payload.update({
    collection: 'places',
    id: docs[0].id,
    data: { location: place.location ?? null, lat: place.lat ?? null, lng: place.lng ?? null, story: place.story },
  })
  payload.logger.info(`Updated ${place.name}`)
}
process.exit(0)

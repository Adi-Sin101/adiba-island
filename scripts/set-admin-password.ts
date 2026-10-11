// Sets the admin password from SEED_ADMIN_PASSWORD: `npm run admin:password`
import config from '@payload-config'
import { getPayload } from 'payload'

const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD
if (!email || !password) throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD first.')

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (docs[0]) {
  await payload.update({ collection: 'users', id: docs[0].id, data: { password } })
  payload.logger.info(`Password updated for ${email}`)
} else {
  await payload.create({ collection: 'users', data: { email, password, name: 'Adiba Tahsin' } })
  payload.logger.info(`Admin ${email} created`)
}
process.exit(0)

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Achievements } from './collections/Achievements'
import { Experiences } from './collections/Experiences'
import { FoodEntries } from './collections/FoodEntries'
import { Looks } from './collections/Looks'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { Milestones } from './collections/Milestones'
import { Places } from './collections/Places'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Publications } from './collections/Publications'
import { Skills } from './collections/Skills'
import { Users } from './collections/Users'
import { githubSyncEndpoint } from './endpoints/githubSync'
import { Penny } from './globals/Penny'
import { Profile } from './globals/Profile'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · Adiba's Island HQ" },
    components: {
      graphics: {
        Logo: '@/components/admin/Brand#Logo',
        Icon: '@/components/admin/Brand#Icon',
      },
      beforeDashboard: ['@/components/admin/Brand#Welcome'],
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [
    Projects,
    Publications,
    Experiences,
    Achievements,
    Skills,
    Posts,
    FoodEntries,
    Looks,
    Places,
    Milestones,
    Messages,
    Media,
    Users,
  ],
  globals: [Profile, Penny],
  endpoints: [githubSyncEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Uploads go to Vercel Blob in production; locally they stay on disk.
    // alwaysInsertFields keeps the database schema identical with or without the token.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      alwaysInsertFields: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})

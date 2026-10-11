// CLI version of the admin "Sync GitHub" button: `npm run sync:github`
import config from '@payload-config'
import { getPayload } from 'payload'
import { syncGithub } from '../src/endpoints/githubSync'

const token = process.env.GITHUB_TOKEN
if (!token) throw new Error('Set GITHUB_TOKEN first.')
const payload = await getPayload({ config })
const result = await syncGithub(payload, token)
payload.logger.info(`GitHub sync: ${result.created.length} new (hidden), ${result.updated.length} refreshed, ${result.skipped} forks/archived skipped`)
process.exit(0)

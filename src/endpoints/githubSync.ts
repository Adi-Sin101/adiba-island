import type { Endpoint, Payload } from 'payload'
import { slugify } from '../fields/slug'

type GithubRepo = {
  name: string
  full_name: string
  private: boolean
  fork: boolean
  archived: boolean
  description: string | null
  homepage: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  pushed_at: string
  created_at: string
}

const API = 'https://api.github.com'

async function gh<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${path}`)
  return res.json() as Promise<T>
}

async function listRepos(token: string): Promise<GithubRepo[]> {
  const repos: GithubRepo[] = []
  for (let page = 1; page < 20; page++) {
    const batch = await gh<GithubRepo[]>(
      `/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator,organization_member`,
      token,
    )
    repos.push(...batch)
    if (batch.length < 100) break
  }
  return repos
}

const prettyTitle = (name: string) =>
  name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())

export type SyncResult = { created: string[]; updated: string[]; skipped: number }

/**
 * Pull every repo the token can see. Known projects only get fresh metadata
 * (stars, languages, last push); new repos are added hidden so they can be reviewed first.
 */
export async function syncGithub(payload: Payload, token: string): Promise<SyncResult> {
  const repos = await listRepos(token)
  const result: SyncResult = { created: [], updated: [], skipped: 0 }

  for (const repo of repos) {
    if (repo.fork || repo.archived) {
      result.skipped++
      continue
    }
    const languages = await gh<Record<string, number>>(`/repos/${repo.full_name}/languages`, token).catch(
      () => ({}),
    )
    const github = {
      fullName: repo.full_name,
      private: repo.private,
      stars: repo.stargazers_count,
      language: repo.language,
      pushedAt: repo.pushed_at,
      languages,
    }

    const existing = await payload.find({
      collection: 'projects',
      where: { 'github.fullName': { equals: repo.full_name } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs[0]) {
      await payload.update({ collection: 'projects', id: existing.docs[0].id, data: { github } })
      result.updated.push(repo.full_name)
    } else {
      await payload.create({
        collection: 'projects',
        data: {
          title: prettyTitle(repo.name),
          slug: slugify(repo.full_name.replace('/', '-')),
          description: repo.description ?? undefined,
          year: repo.created_at.slice(0, 4),
          tech: Object.keys(languages)
            .slice(0, 5)
            .map((name) => ({ name })),
          links: { repo: repo.html_url, live: repo.homepage || undefined },
          github,
          showRepoLink: !repo.private,
          visible: false,
          order: 500,
        },
      })
      result.created.push(repo.full_name)
    }
  }
  return result
}

export const githubSyncEndpoint: Endpoint = {
  path: '/github-sync',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Please log in first.' }, { status: 401 })
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return Response.json(
        { error: 'GITHUB_TOKEN is not set. Add a GitHub token to the environment variables.' },
        { status: 400 },
      )
    }
    try {
      const result = await syncGithub(req.payload, token)
      return Response.json(result)
    } catch (err) {
      req.payload.logger.error(err)
      return Response.json({ error: (err as Error).message }, { status: 502 })
    }
  },
}

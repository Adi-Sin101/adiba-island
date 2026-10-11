'use client'

import { Button, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SyncGithubButton() {
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function sync() {
    setBusy(true)
    try {
      const res = await fetch('/api/github-sync', { method: 'POST', credentials: 'include' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'Sync failed')
      toast.success(
        `GitHub synced: ${body.created.length} new (hidden until you tick "visible"), ${body.updated.length} refreshed.`,
      )
      router.refresh()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adiba-sync">
      <div>
        <strong>GitHub sync</strong>
        <p>Pull in new repos and refresh stars, languages and last-updated dates.</p>
      </div>
      <Button onClick={sync} disabled={busy} buttonStyle="primary" size="small">
        {busy ? 'Syncing…' : 'Sync GitHub'}
      </Button>
    </div>
  )
}

'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { Resend } from 'resend'
import { z } from 'zod'

export type ContactState = { ok: boolean; message: string; errors?: Record<string, string> }

const schema = z.object({
  name: z.string().trim().min(2, 'Tell me your name').max(80),
  email: z.email('That email looks off').max(160),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, 'A little longer, please (10+ characters)').max(4000),
})

// Very small in-memory throttle: 3 messages per address per 10 minutes per server instance.
const recent = new Map<string, number[]>()
function throttled(key: string) {
  const now = Date.now()
  const hits = (recent.get(key) ?? []).filter((t) => now - t < 10 * 60_000)
  hits.push(now)
  recent.set(key, hits)
  return hits.length > 3
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Bots fill the hidden "website" field; quietly pretend it worked.
  if (form.get('website')) return { ok: true, message: 'Thanks! Your note is in the mailbox.' }

  const parsed = schema.safeParse({
    name: form.get('name'),
    email: form.get('email'),
    subject: form.get('subject') || undefined,
    message: form.get('message'),
  })
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message
    return { ok: false, message: 'Almost there, check the highlighted fields.', errors }
  }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (throttled(ip)) return { ok: false, message: 'Whoa, that’s a lot of mail! Please try again in a few minutes.' }

  const { name, email, subject, message } = parsed.data
  const payload = await getPayload({ config })
  await payload.create({ collection: 'messages', data: { name, email, subject, message } })

  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (key && to) {
    try {
      await new Resend(key).emails.send({
        from: process.env.CONTACT_FROM_EMAIL || 'Adiba’s Island <onboarding@resend.dev>',
        to,
        replyTo: email,
        subject: `🏝️ ${subject || 'New message'} from ${name}`,
        html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) wrote:</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      })
    } catch (err) {
      payload.logger.error({ err }, 'Contact email failed (message is still saved in the admin inbox)')
    }
  }

  return { ok: true, message: 'Mahalo! Your note landed in my mailbox. I’ll write back soon 💌' }
}

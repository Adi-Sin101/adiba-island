'use client'

import { motion } from 'motion/react'
import { useActionState } from 'react'

import { sendMessage, type ContactState } from '@/app/(frontend)/actions'
import type { ProfileData } from '@/lib/types'
import { SectionHeading, Socials } from './ui'

const initial: ContactState = { ok: false, message: '' }

function Field({ label, name, error, textarea, ...rest }: { label: string; name: string; error?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `contact-${name}`
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-bold text-ink">{label}</span>
      {textarea ? (
        <textarea id={id} name={name} rows={5} className="field" aria-invalid={Boolean(error)} required={rest.required} placeholder={rest.placeholder} />
      ) : (
        <input id={id} name={name} className="field" aria-invalid={Boolean(error)} {...rest} />
      )}
      {error && <span className="mt-1 block text-sm font-semibold text-coral">{error}</span>}
    </label>
  )
}

export function Contact({ profile }: { profile: ProfileData }) {
  const [state, action, pending] = useActionState(sendMessage, initial)
  return (
    <section>
      <SectionHeading emoji="💌" kicker="Mailbox" title="Say hello">
        Collabs, internships, hackathon teams, seafood recommendations: all welcome.
      </SectionHeading>
      {state.ok ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="toy-card bg-[#e7f9ec] p-6 text-center">
          <p className="text-5xl" aria-hidden>
            📬
          </p>
          <p className="mt-2 font-display text-xl text-ink">{state.message}</p>
        </motion.div>
      ) : (
        <form action={action} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" name="name" autoComplete="name" required error={state.errors?.name} />
            <Field label="Email" name="email" type="email" autoComplete="email" required error={state.errors?.email} />
          </div>
          <Field label="Subject" name="subject" placeholder="Let's build something!" error={state.errors?.subject} />
          <Field label="Message" name="message" textarea required error={state.errors?.message} />
          {/* honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          {state.message && !state.ok && <p className="font-semibold text-coral" role="alert">{state.message}</p>}
          <button type="submit" className="toy-btn w-full justify-center sm:w-auto" disabled={pending}>
            {pending ? '✉️ Sending…' : '💌 Drop it in the mailbox'}
          </button>
        </form>
      )}
      <div className="mt-8 space-y-3">
        {profile.email && (
          <p className="text-ink/70">
            Prefer email? <a className="font-bold text-blue underline-offset-4 hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        )}
        <Socials socials={profile.socials} />
      </div>
    </section>
  )
}

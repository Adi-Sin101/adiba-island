// Fails the Vercel build early with a readable message when required settings are missing.
const missing = ['DATABASE_URL', 'PAYLOAD_SECRET'].filter((name) => !process.env[name])

if (missing.length) {
  console.error(`\n✖ Missing environment variable(s): ${missing.join(', ')}\n`)
  if (missing.includes('DATABASE_URL')) {
    console.error('  Connect a database first: Vercel project → Storage → Create → Neon (Postgres) → Connect.')
    console.error('  Vercel then adds DATABASE_URL automatically. Redeploy afterwards.\n')
  }
  if (missing.includes('PAYLOAD_SECRET')) {
    console.error('  Add PAYLOAD_SECRET (any long random string) in Settings → Environment Variables.\n')
  }
  process.exit(1)
}

if (/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)) {
  console.error('\n✖ DATABASE_URL points at localhost. Use the Neon connection string on Vercel.\n')
  process.exit(1)
}

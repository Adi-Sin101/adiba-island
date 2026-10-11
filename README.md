# Adiba's Island 🏝️

Portfolio of **Adiba Tahsin** (a.k.a. *A Diva*): a toy-scale 3D tropical island where every building is a section of her life, plus a full admin dashboard so content can be changed without touching code.

- **Welcome Beach** (about), **Memory Lane** toy train (timeline from school to now), **Toy Workshop** (projects), **Block Tower** (skills), **Research Lighthouse** (papers), **Events Stage** (experience & awards), **Diva Boutique** (lookbook), **Seafood Shack** (food diary), **Travel Dock** (places + globe), **Story Cabin** (blog), **Penny's Hammock** (Penny the cat 🐱) and the **Mailbox** (contact form).
- Boop, an original blue alien buddy, can be driven around in **Play mode** (`P`, WASD / on-screen joystick, `E` to enter a building).
- `/classic` is a fast, text-first version of everything (also the fallback when WebGL is unavailable).

## Stack

| Layer | Tech |
| --- | --- |
| App | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| 3D | three.js, React Three Fiber, drei (all models are procedural, no asset downloads) |
| Motion | Motion (Framer Motion), Lenis smooth scroll |
| Styling | Tailwind CSS v4 |
| CMS / admin | Payload CMS 3 (runs inside the same Next.js app at `/admin`) |
| Database | PostgreSQL (Docker locally, Neon in production) |
| Media | Local disk in dev, Vercel Blob in production |
| Email | Resend (optional; messages are always saved in the admin inbox) |

## Run it locally

Requirements: Node 20+, Docker Desktop.

```bash
cp .env.example .env          # then fill in PAYLOAD_SECRET and SEED_ADMIN_PASSWORD
npm install --legacy-peer-deps
npm run db:up                 # Postgres on localhost:5433
npm run seed                  # loads CV, projects, photos, Penny, timeline…
npm run dev                   # http://localhost:3000  ·  admin at /admin
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run sync:github` | Same as the admin "Sync GitHub" button (needs `GITHUB_TOKEN`) |
| `npm run admin:password` | Sets the admin password from `SEED_ADMIN_PASSWORD` |
| `npm run migrate:create <name>` | Creates a DB migration after changing collections/fields |
| `npm run generate:types` | Regenerates `src/payload-types.ts` |

## Editing content (no code needed)

Log in at `/admin`. The dashboard has shortcuts for everything:

- **Projects**: each one becomes a toy on the workshop shelves. *Sync GitHub* pulls in new repos as **hidden** drafts; tick **Visible** to publish, **Featured** to put it on the shelf, untick **Show repo link** for private repos.
- **Experiences / Achievements / Publications / Milestones**: anything with a date shows up on the **Memory Lane** timeline automatically.
- **Food diary / Lookbook / Travel map / Blog stories / Penny / Profile**: upload photos, write stories, set lat/lng to drop pins on the globe.
- Saving anything refreshes the public site immediately.

## Deploying (Neon + Vercel)

1. **Push this repo to GitHub** (already set up for `Adi-Sin101`).
2. **Create the Vercel project**: vercel.com → *Add New → Project* → import the repo. Framework is detected as Next.js; keep the defaults (the `vercel-build` script runs DB migrations, then builds).
3. **Add a database**: in the Vercel project → *Storage → Create → Neon (Postgres)*. It adds `DATABASE_URL` for you. (Or create one on neon.tech and paste its pooled connection string as `DATABASE_URL`.)
4. **Add Blob storage**: *Storage → Create → Blob*. It adds `BLOB_READ_WRITE_TOKEN`.
5. **Environment variables** (Project → Settings → Environment Variables):
   - `PAYLOAD_SECRET`: a long random string (different from local)
   - `NEXT_PUBLIC_SITE_URL`: e.g. `https://adiba-island.vercel.app`
   - `GITHUB_TOKEN`: fine-grained token with read-only *Metadata* + *Contents* on your repos (for the Sync button)
   - optional `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
6. **Deploy.** Then seed production once from your computer, pointing at Neon and Blob:
   ```bash
   DATABASE_URL="<neon url>" BLOB_READ_WRITE_TOKEN="<blob token>" SEED_ADMIN_PASSWORD="<your password>" npm run seed
   ```
7. Open `https://<your-site>/admin`, log in, and change the password if you used a temporary one.

When you later change collections or fields: run `npm run migrate:create <name>` locally, commit the new file in `src/migrations`, and push. Vercel applies it on the next deploy.

## Project layout

```
src/
  app/(frontend)/      public site: island, /classic, /blog/[slug], contact server action
  app/(payload)/       Payload admin + REST/GraphQL API (generated)
  collections/ globals/ Payload schema (what the admin can edit)
  components/island/   3D scene: Scene, Structures, Characters, Adiba outfits, colliders, StaticMerge…
  components/sections/ content panels shared by the island and /classic
  lib/                 content loading, timeline builder, types
  seed/                starting content + photos
  migrations/          production database migrations
docs/CV/               CV (HTML source + PDF)
```

Performance notes: static meshes are merged per material at runtime (`StaticMerge`), shadows re-render at ~20 fps, device pixel ratio adapts via `PerformanceMonitor`, and every 3D label shares one DOM layer.

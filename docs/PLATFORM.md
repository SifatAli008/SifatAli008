# Sifat Ali - Personal Brand Platform

Production-grade personal site for **Sifat Ali** - AI Engineer, Full Stack Developer, Educator, and Community Leader. Built with **Next.js 14**, **Firebase**, and a **Neo-Brutalist Editorial** front end (cream canvas, ink borders, accent orange, hard shadows).

## Highlights

- **Landing**: Hero with portrait, impact metrics (incl. LeetCode 100+), 3D social links, featured LinkedIn posts, projects, skills, experience, writing, contact
- **Featured**: 6 LinkedIn posts in a **3-column grid** with live embeds (or local screenshots)
- **Public pages**: Projects, case studies, blog, archive, contact
- **Admin dashboard**: Firebase Auth + content CRUD
- **Firebase**: Firestore, Auth, Storage + security rules
- **SEO**: Metadata, JSON-LD, sitemap, robots.txt, ISR
- **Offline fallback**: Seed data when Firebase is not configured

## Design System

| Token | Value | Usage |
|-------|--------|--------|
| Cream | `#F5F0E8` | Page background |
| Ink | `#0A0A0A` | Text, borders |
| Accent | `#FF3B00` | CTAs, badges, highlights |

**Typography**: Bebas Neue (display), Space Grotesk (sans), JetBrains Mono (labels), DM Serif Display (accent copy).

**UI patterns**: 3px borders, offset hard shadows (`6–8px`), no border-radius, `btn-3d` / `Icon3D` components.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 App Router, TypeScript |
| Styling | Tailwind CSS, Framer Motion, Lucide icons |
| Backend | Firebase Firestore, Auth, Storage |
| Deploy | Vercel (recommended) |

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill Firebase client + admin credentials (optional for local preview)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site runs with baked-in seed data if Firebase is empty.

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web app config |
| `FIREBASE_ADMIN_*` | Service account (seed script only) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO |

**Never commit** `.env.local` or `serviceAccountKey.json`.

## Featured LinkedIn Posts

Posts are defined in `src/lib/data/featured.ts`. Each card:

- Embeds the post via `src/lib/linkedin-embed.ts` (activity URN from the URL)
- Or shows a **local image** if you set `image: "/assets/linkedin/your-file.jpg"`

Add screenshots under `public/assets/linkedin/` (see `public/assets/linkedin/README.md`) when embeds are blocked or you want faster loads.

## Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication** (Google + Email/Password).
3. Create **Firestore** and **Storage**.
4. Deploy rules:

```bash
firebase deploy --only firestore:rules,storage
```

5. Create an admin user for `/dashboard/login`.

## Seed Script

```bash
npm run seed
```

Writes profile, projects, skills, experience, achievements, and blog drafts to Firestore. Requires admin env vars.

## Folder Structure

```
src/
├── app/
│   ├── (site)/              # Public site
│   ├── (dashboard)/dashboard/
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── site/                # hero, featured-section, linkedin-post-card, …
│   ├── dashboard/
│   ├── motion/
│   └── ui/
├── lib/
│   ├── data/                # seed-data.ts, featured.ts
│   ├── firebase/
│   └── linkedin-embed.ts
└── types/
public/assets/
├── images/
├── linkedin/
└── pixel art/
scripts/seed.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run seed` | Populate Firestore |

If build fails with stale `.next` errors, delete `.next` and run `npm run build` again.

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing (hero, featured, projects, …) |
| `/projects` | Portfolio grid |
| `/projects/[slug]` | Case study |
| `/blog` | Blog index |
| `/blog/[slug]` | Article |
| `/archive` | Timeline |
| `/contact` | Contact form |
| `/dashboard` | Admin (auth required) |
| `/dashboard/login` | Sign in |

## Customization

- **Profile & resume content**: `src/lib/data/seed-data.ts`
- **Featured posts**: `src/lib/data/featured.ts`
- **Portrait**: `public/assets/images/profile-image.jpeg`
- **Production URL**: `NEXT_PUBLIC_SITE_URL` in `.env.local`

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add `NEXT_PUBLIC_*` env vars and `NEXT_PUBLIC_SITE_URL`.
4. Deploy (`npm run build` runs automatically).

## License

Private - © Sifat Ali

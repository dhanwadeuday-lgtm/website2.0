# SnickyLink Website — Vercel Deploy

Cinematic journey site (Three.js + Vite) in `apps/website`.

## Option 1 — Vercel Dashboard (easiest)

1. Push this repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → **Import** the repo.
3. In **Root Directory**, set: `apps/website`
   - Vercel auto-detects `framework: vite` from `vercel.json`.
4. Click **Deploy**. Done.

## Option 2 — Vercel CLI

```bash
npm i -g vercel
cd apps/website
vercel          # preview deploy
vercel --prod   # production deploy
```

## Notes

- `vercel.json` handles the build (`vite build`), output dir (`dist`), immutable caching
  for hashed `/assets/*`, and a rewrite of all routes to `index.html`.
- Logo/OG assets (`/icon-32.png`, `/icon-192.png`, `/apple-touch-icon.png`,
  `/logo-web.png`, `/og.png`) are served from `public/` with 1-day cache.
- Custom domain: Vercel Dashboard → Project → **Settings → Domains** → Add.
- No backend needed — the site is fully static. Waitlist submissions currently
  stay client-side; wire them to the backend API later if desired.

## Local production check

```bash
npm run build -w apps/website
npm run preview -w apps/website
```

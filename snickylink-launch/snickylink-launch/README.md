# Snickylink

TanStack Start + React + Three.js site, configured for **Vercel**.

## Deploy on Vercel

1. Push this folder to a GitHub repo and import it in Vercel (Framework preset: auto-detected as Nitro / "Other").
2. Build command `bun run build` (or `npm run build`), no output directory needed — Nitro writes `.vercel/output`.
3. Add the domain `www.snickylink.com` in Vercel → Settings → Domains.

Or via CLI: `npx vercel` then `npx vercel --prod`.

## Local

```sh
bun install   # or npm i
bun run dev
```

## Before going live

- Replace `public/snickylink-logo.png` with the real logo (keep it small, ~100 KB or less; it is shown at 128 px).
- Replace `public/og.png` (1200×630) if you want a custom social preview.
- After deploy, submit `https://www.snickylink.com/sitemap.xml` in Google Search Console.

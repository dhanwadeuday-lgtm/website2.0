# Deploying Snickylink on Vercel

1. Push this folder to a GitHub repo (the old `.git` pointer was removed, run `git init` first).
2. Vercel > Add New Project > import the repo. Framework preset: **Other**. `vercel.json` sets the build command.
3. Project Settings > Environment Variables, add:
   - `VITE_SITE_URL` = your live domain, e.g. `https://snickylink.com` (no trailing slash)
4. **Add your logo:** copy `snickylink-logo.png` into `public/`. The Lovable-hosted asset link no longer works outside Lovable. Compress it first (the original is about 2.2 MB; aim for under 150 KB, 512x512 is plenty).
5. Deploy. After deploy, check:
   - `/robots.txt` and `/sitemap.xml` show your real domain
   - View Source on `/` shows the title, canonical, og tags, and JSON-LD
   - Paste the URL into https://www.opengraph.xyz to preview the share card
6. Google Search Console: add the domain, submit `/sitemap.xml`, then request indexing for `/`.

## What changed
- `vercel.json`: builds with the Vercel Nitro preset + basic security headers
- `src/lib/seo.ts`: one place for title, description, domain, JSON-LD
- Root head: canonical, Open Graph, Twitter card (removed the `@Lovable` handle), theme-color, JSON-LD, manifest
- Root shell: short crawlable text summary with an `h1` (the home route is client-rendered, so crawlers would otherwise see an empty body)
- `scripts/generate-seo-files.mjs`: writes `robots.txt` + `sitemap.xml` before every build using your domain
- `public/og-image.png` (1200x630), `public/site.webmanifest`
- `Overlay.tsx`: logo now loads from `/snickylink-logo.png`
- Removed `tsconfig.tsbuildinfo` and the stale `.git` pointer

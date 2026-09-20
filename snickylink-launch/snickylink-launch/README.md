# SNICKYLINK — Landing Page

Static site, no build step needed. Ready to deploy on Vercel.

## What's included
- `index.html`, `styles.css`, `app.js`, `rose.js` — the site
- `assets/` — logo, favicons, app icons, and the social-share image (generated from your uploaded logo)
- `site.webmanifest` — PWA manifest
- `robots.txt`, `sitemap.xml` — SEO
- `vercel.json` — caching + security headers for Vercel

## Deploy to Vercel
**Option A — Vercel CLI**
```
npm i -g vercel
cd <this folder>
vercel
```
Follow the prompts (any framework preset — it's picked up as a static site automatically).

**Option B — Vercel Dashboard**
1. Push this folder to a GitHub repo.
2. Go to vercel.com → **Add New Project** → import the repo.
3. Framework preset: **Other** (static). No build command / output directory needed.
4. Deploy.

## Before you go live
1. **Domain**: the meta tags (`og:url`, `canonical`, `sitemap.xml`) are set to `https://snickylink.co/`. Update every occurrence to your real domain once you have one (find-and-replace `snickylink.co`), or update after connecting your custom domain on Vercel.
2. **Waitlist form**: the waitlist section embeds your Google Form directly:
   `https://docs.google.com/forms/d/e/1FAIpQLSfpvXYWIAXUl2ggcyJYrHn5ZOgUr8Z3Xm-Sjvn4GtPEJkLUug/viewform`
   Responses land in the linked Google Sheet the same way they would on the form's own page. If you ever change the form, swap the URL in the `<iframe>` and the fallback link in `index.html` (search for `docs.google.com/forms`).
3. **Search Console**: once live, submit `https://yourdomain.com/sitemap.xml` in Google Search Console for faster indexing.

## SEO already set up
- Title, meta description, keywords
- Open Graph + Twitter Card tags (with the generated `assets/og-image.jpg`)
- JSON-LD structured data (`SoftwareApplication`)
- `robots.txt` + `sitemap.xml`
- Favicons + app icons for all major sizes + web manifest

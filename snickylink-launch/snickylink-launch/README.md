# SnickyLink — website (Vercel-ready)

Plain static HTML/CSS/JS. No build step, nothing to install.

## What changed from your upload
Your file `SNICKYLINK.html` was renamed to **`index.html`** — Vercel (and every static
host) needs a file with that exact name at the project root to know what to
serve at `/`. Everything else (`styles.css`, `site.js`, `assets/`) is untouched
and still linked correctly. The `.srcmap.json` and `.thumbnail.jpg` files from
your export weren't needed for the live site, so they were left out.

## Deploy to Vercel

**Option A — Vercel dashboard (drag & drop, no CLI)**
1. Go to vercel.com → **Add New → Project**
2. Choose **"Deploy without Git"** and drag this folder's contents (or the
   unzipped folder) onto the page
3. Framework preset: **Other**. Leave the build command and output directory
   empty
4. Click **Deploy**

**Option B — Vercel CLI**
```
npm i -g vercel
cd snickylink-project
vercel
```
Accept the defaults (no build step needed) and it goes live.

## Local preview
Open `index.html` directly in a browser, or serve it locally:
```
cd snickylink-project
python3 -m http.server 8080
```
then visit http://localhost:8080

## Structure
```
index.html
styles.css
site.js
assets/bridge-couple.png
vercel.json
robots.txt
sitemap.xml
```

## Note
Fonts (Instrument Serif, Inter, JetBrains Mono) load from Google Fonts at
runtime, so the deployed site needs internet — which any Vercel visitor will
have. Everything else is self-contained.

## SEO — what was added
- **Meta description, keywords, robots tag** in `<head>`
- **Open Graph + Twitter Card tags** so links preview nicely on WhatsApp,
  iMessage, Facebook, LinkedIn, X/Twitter — uses `assets/bridge-couple.png`
  as the preview image
- **JSON-LD structured data** (`MobileApplication` schema) so Google can
  understand what SnickyLink is
- **Canonical URL, theme-color, favicon**
- **`robots.txt`** and **`sitemap.xml`** at the root

### ⚠️ One thing you must do before this fully works
Every one of those tags currently points at `https://www.snickylink.com/` as
a placeholder, since the domain isn't registered yet. Once you register the
real domain and it's live on Vercel:
1. Open `index.html` and replace every `https://www.snickylink.com` with
   your actual domain (search for it — it appears ~8 times: canonical, og:url,
   og:image, twitter:image, and the JSON-LD block)
2. Do the same in `robots.txt` and `sitemap.xml`
3. Re-deploy

Until then the site works fine — link previews and the sitemap will just
point at a placeholder domain rather than your live one.

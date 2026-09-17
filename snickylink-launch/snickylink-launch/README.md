# SnickyLink (Vercel-native)

Landing page + waitlist API, rebuilt to deploy cleanly on Vercel —
serverless functions instead of a persistent Express server, and
Redis (Vercel KV / Upstash) instead of a JSON file, so data actually
survives between requests.

## Why this version instead of the Express one
The previous version ran a single long-lived Express server and wrote
signups to a local JSON file. That doesn't work on Vercel:
- Vercel runs your code as short-lived serverless functions, not a
  persistent process — an `app.listen()` server isn't the deployment
  model it expects.
- Vercel's filesystem is **read-only** at runtime except `/tmp`, and
  `/tmp` doesn't persist between requests — so file-based storage
  silently loses every signup.

This version fixes both: plain serverless functions under `/api`, and
a small Redis database for storage.

## Project structure
```
snickylink/
├── index.html            # Landing page (served as a static file)
├── js/main.js            # Wires the invite form to the API
├── api/
│   ├── _lib/
│   │   └── waitlistStore.js   # Redis read/write logic (shared)
│   └── waitlist/
│       ├── index.js           # POST /api/waitlist
│       └── count.js           # GET  /api/waitlist/count
├── package.json
├── .env.example
├── .gitignore
└── README.md
```
No `vercel.json` needed — Vercel auto-detects the static files at the
root and the functions in `/api` with zero config.

## 1. Set up a free Redis database
Pick one:

**Option A — Vercel KV (easiest, same dashboard)**
1. Vercel dashboard → your project → **Storage** tab → **Create Database** → **KV**
2. Once created, click **Connect Project** and select this project.
   Vercel automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   to your project's environment variables — no manual copy-paste.

**Option B — Standalone Upstash Redis**
1. Go to [upstash.com](https://upstash.com) → free account → **Create Database**
2. Copy the **REST URL** and **REST Token** from the database details page
3. Add them to your Vercel project → **Settings → Environment Variables**
   as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

## 2. Run locally
```bash
npm install
npm i -g vercel        # one-time, if you don't have the CLI
cp .env.example .env   # fill in your Redis credentials
vercel dev
```
Open the URL it prints (usually `http://localhost:3000`).

## 3. Push to Git
```bash
git init
git add .
git commit -m "Initial commit — SnickyLink (Vercel serverless)"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 4. Deploy on Vercel
1. Vercel dashboard → **Add New → Project** → import this repo
2. **Root Directory:** leave it as `./` (this repo's files are at the
   repo root — this is what fixes the "Root Directory does not exist"
   build error from before)
3. Make sure the Redis env vars from step 1 are present under
   **Settings → Environment Variables** for the Production environment
4. Deploy

## API
### `POST /api/waitlist`
```json
// request
{ "email": "you@example.com" }

// response (200)
{ "position": 42, "ticket": "SNK-7712-PAIR" }

// response (400)
{ "error": "Please enter a valid email address." }

// response (429)
{ "error": "Too many requests. Please try again later." }
```
Rate-limited to 10 requests per IP per 15 minutes (tracked in Redis, so
it works correctly across serverless invocations).

### `GET /api/waitlist/count`
```json
{ "count": 42 }
```

## About this update
`index.html` now uses the new "Velvet & Ember" redesign (the Stitch
export from `stitch_snickylink_interactive_brand_redesign__6_.zip`),
wired into this project's real waitlist backend instead of the static
demo markup it shipped with:
- The invite form now collects **your email + your partner's email**
  and POSTs both to `POST /api/waitlist`.
- `api/waitlist/index.js` and `api/_lib/waitlistStore.js` accept an
  optional `partnerEmail` field, validate it, and store it alongside
  the signup entry in Redis.
- `js/main.js` was rewritten to match the new form's field IDs
  (`email-self` / `email-partner`) and to populate the real ticket
  number + queue position returned by the API into the success card.
- All the page's other interactive bits (ambient audio toggle, partner
  presence simulator, the format-unlock sequence) are unchanged —
  they're cosmetic demo scripts local to `index.html` and don't touch
  the backend.

## Known follow-ups (not yet done)
- Images in `index.html` are currently hosted on Google's temporary
  `lh3.googleusercontent.com` CDN (from the Stitch export) — these can
  expire. Download them and reference local files (e.g. `/assets/`)
  before relying on this in production.
- Tailwind is loaded via CDN (`cdn.tailwindcss.com`) for simplicity —
  fine for a quick launch, but compile it properly for production
  performance.
- No transactional email is wired up — signups are stored, but no
  activation email is actually sent yet. Add a provider (Resend,
  Postmark, SES) inside `api/waitlist/index.js` once you're ready.

# SnickyLink — Launch Site (Website 2.0 design + real pairing backend)

This is the "Website 2.0" cinematic redesign (`website2_0-main-redesigned.zip`
— scroll-driven storytelling, the growing vine/bloom motif, the 4-Snick
preview, and the secret-code pairing flow), deployed on Vercel with the
same real-backend approach used throughout this project: static
frontend + Vercel serverless functions + Upstash Redis, no build step.

## What changed from the original design bundle

The original bundle (`index.html` / `styles.css` / `app.js`) was a
**design prototype**: high-fidelity visuals and motion, but the
"create code" / "join code" pairing flow only worked via
`localStorage`, which only works across two browser tabs on the
*same* device — not two different partners on two different phones.
The code even had a comment marking where a real backend call should
go (`// swap the marked line below for a real fetch()`).

That's now wired up for real:

### New API endpoints (`api/pair/*`)
- **`POST /api/pair/create`** — `{ name, email }` → generates a unique
  pairing code (e.g. `SNKX2A`), stores it in Redis, returns `{ code, position }`.
- **`POST /api/pair/join`** — `{ code, name, email }` → looks up the
  code; if found and not already paired, records person 2 and marks
  the pair as connected. Returns `{ person1Name, code }`.
- **`GET /api/pair/status?code=XXX`** — read-only lookup, used two ways:
  1. By the **join** form, to check a code exists and show "Rahul is
     waiting for you" before the joiner commits.
  2. By the **create** side, polled every 3s, to detect the moment
     person 2 joins and trigger the "you're both in" reveal — without
     needing WebSockets.
- Storage lives in `api/_lib/pairStore.js` (Redis hash `snickylink:pairs`,
  keyed by code), with the same small IP rate-limiter pattern used
  elsewhere in this project.

### Frontend changes (`app.js`, `index.html`)
- `createForm` now calls `/api/pair/create` instead of `genCode()` +
  `localStorage`, and polls `/api/pair/status` instead of listening
  for the `storage` event.
- The join flow previously only asked for a code and hard-coded the
  joiner's name as `"you"` — it never actually captured person 2's
  name or email. Added **name + email fields** to the join form
  (`#p2Name`, `#p2Email`) so the real join call has real data, and
  wired the "Join Their Experience" button to `POST /api/pair/join`.
- Added inline error messages (`#createError`, `#joinError`,
  `#pairError`) for validation and API failures (bad code, code
  already used, network errors) — the prototype had no error states
  for these.
- Everything else — the vine/bloom growth animation, scroll
  storytelling (hero → story → "but" → mystery → reveal), the 4-Snick
  lock/unlock sequence, GSAP/Lenis motion — is untouched.

### The "locked until registered" mechanism (carried over from the
previous v8 design's requirement) — **already built into this design**
This design already had the exact behavior asked for: every Snick
card renders as `is-mystery`/`is-locked` on load, and
`unlockToIndex(0)` is only ever called from inside `becomeConnected()`
— i.e. after a real pairing succeeds. No changes were needed here
beyond making pairing itself real; the lock/unlock logic in
`app.js` (`renderSnickStates`, `unlockToIndex`) was left as-is.

### Kept as a design prototype, not rebuilt in Next.js
The bundle included a `design_handoff_snickylink_launch/README.md`
recommending a full Next.js/React rewrite for production. This
project intentionally stays a static HTML/CSS/JS site with Vercel
serverless functions instead — consistent with the rest of this
project and far faster to ship. Say the word if you do want the
Next.js rebuild later.

## SEO
`index.html`, `robots.txt`, and `sitemap.xml` use the placeholder
domain `https://snickylink.vercel.app`. Once you have your real
Vercel URL or custom domain, find-and-replace it in those three files
and redeploy. Meta description, Open Graph tags, Twitter Card tags,
canonical URL, and JSON-LD `Organization` schema are already in place
(this design's og:image points at the real logo asset — no expiring
temporary CDN link this time).

## Deploying on Vercel
1. Push this folder to a GitHub repo (or run `vercel` from inside it).
2. Vercel dashboard → **Add New Project** → import the repo. Root
   directory: `./`.
3. **Environment variables** (see `.env.example`): add your Upstash
   Redis / Vercel KV `URL` + `TOKEN` pair before deploying, or the
   `/api/pair/*` calls will fail. Vercel's Storage tab can provision a
   free Upstash Redis database for you in one click.
4. Deploy.

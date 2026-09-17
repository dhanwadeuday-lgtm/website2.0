# SnickyLink

Landing page + waitlist API for SnickyLink — "a ritual for two."

## Stack
- **Frontend:** static HTML + Tailwind (via CDN) + vanilla JS — `public/`
- **Backend:** Node.js + Express — `server.js`, `src/`
- **Storage:** simple JSON file (`data/waitlist.json`) for waitlist signups.
  Good enough for a pre-launch waitlist; swap for a real database
  (Postgres/MongoDB) before you need to scale past a few thousand signups.

## Project structure
```
snickylink/
├── server.js               # Express entrypoint — serves frontend + API
├── src/
│   ├── waitlistRoute.js     # POST /api/waitlist, GET /api/waitlist/count
│   └── waitlistStore.js     # File-backed storage logic
├── public/
│   ├── index.html           # The landing page
│   └── js/main.js           # Wires the invite form to the API
├── data/
│   └── waitlist.json        # Created automatically on first signup (gitignored)
├── .env.example
├── .gitignore
└── package.json
```

## Run locally
```bash
npm install
cp .env.example .env
npm run dev        # nodemon, auto-restarts on change
# or
npm start           # plain node
```
Open **http://localhost:3000** — the form on the page posts to `/api/waitlist`
on the same origin, so there's no CORS setup needed.

## API
### `POST /api/waitlist`
```json
// request
{ "email": "you@example.com" }

// response (200)
{ "position": 42, "ticket": "SNK-7712-PAIR" }

// response (400)
{ "error": "Please enter a valid email address." }
```
Rate-limited to 10 requests per IP per 15 minutes.

### `GET /api/waitlist/count`
```json
{ "count": 42 }
```

## Push to Git
```bash
cd snickylink
git init
git add .
git commit -m "Initial commit — SnickyLink landing page + waitlist API"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Deploy
This is a single Node app (frontend + backend together), so it deploys
cleanly to any Node host without extra config:
- **Render / Railway:** connect the repo, set start command `npm start`,
  add a `PORT` env var if the platform doesn't inject one automatically.
- **Vercel/Netlify:** these are built for serverless/static — this app
  is a long-running Express server, so Render/Railway/Fly.io/a VPS is a
  better fit unless you refactor the API into serverless functions.

⚠️ **Before scaling past a demo:** the JSON file storage is not safe for
concurrent writes at real traffic — move to a proper database first.

## Known follow-ups (not yet done)
- Images in `index.html` are currently hosted on Google's temporary
  `lh3.googleusercontent.com` CDN (from the Stitch export) — these links
  can expire. Download them and reference local files in `public/assets/`
  before you rely on this in production.
- Tailwind is loaded via CDN (`cdn.tailwindcss.com`) for simplicity — fine
  for a quick deploy, but for production performance you should compile
  Tailwind properly (`npx tailwindcss init` + a build step) instead of
  shipping the JIT compiler to the browser.
- No email-sending is wired up yet — signups are only stored. Add a
  transactional email service (Resend, Postmark, SES) in
  `src/waitlistRoute.js` when you're ready to actually send activation keys.

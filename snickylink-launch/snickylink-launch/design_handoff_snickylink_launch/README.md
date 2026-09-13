# Handoff: Snickylink Launch Website

## Overview

**Snickylink** is a private, playful experience for two people to connect, play, and grow together — positioned as "a secret little world for two."

This handoff covers the **launch / teaser website** (single-page, scroll-driven storytelling) built to introduce the campaign concept **"Not more than a chat."** The site walks a visitor through the emotional problem (modern relationships trapped in chat boxes) and ends with a product reveal, the 4 "Snicks" preview, and a couple-registration code moment.

The site is **not** a dating app, feed, or SaaS landing page — it's a cinematic, curiosity-driven campaign. Motion, mystery, and typography carry the experience.

---

## About the Design Files

The files in this bundle are **design references created in HTML/CSS/JS**. They are working prototypes showing the intended look, motion language, and behavior — **not production code to ship as-is**.

The task is to **recreate these designs in the target codebase's existing environment** (Next.js + React, Nuxt, SvelteKit, Astro, etc.) using its established patterns, component conventions, and animation libraries. If no environment exists yet, **Next.js (App Router) + React + TypeScript + Tailwind + GSAP + Lenis** is the recommended stack — it's a close match to what the prototype uses.

Copy the visual language, typography, motion timings, and micro-interactions faithfully. Do not copy the raw class names or DOM structure unless it makes sense for the target framework.

---

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, and motion are locked in this prototype. The developer should recreate pixel-perfectly, matching the exact hex values, font families/weights, easing curves, and stagger timings documented below.

---

## Page Structure & Screens

The site is a **single continuous vertical scroll** composed of 10 stacked sections. The user experiences it as one seamless narrative, but each section is a distinct "beat."

### 1. Hero — `01 Hero`
**Purpose:** Set the mystery. Show the campaign line "Not more than a chat." and hint that something is coming.

**Layout:**
- Full viewport height, centered content column (max-width 1200px, 6vw side padding)
- Background: Blush White `#FBF4F1` with subtle noise/grain overlay (SVG turbulence filter, opacity 0.35, mix-blend multiply)
- 4 corner registration marks (mono type, 10px, letter-spacing 0.24em, tiny L-shaped border marks)
- 2 vertical side rails (mono, writing-mode vertical-rl, small dashes at ends)
- Spinning circular campaign stamp in top-right: 140×140px, orbiting SVG textPath "A CAMPAIGN FOR TWO · MORE THAN A CHAT · SNICKYLINK ·", inner 76px coral disc with "coming SOON — for two only"
- 2 floating cursor-tracked dots ("you" coral, "them" wine) at ~38vh/52vh
- 5 rotated chat bubble "scraps" scattered around the title ("u up?", "lol yeah", "😂😂", "seen this?", "omg"), rotated ±3–8°, parallax with cursor
- Eyebrow row with 3 pills: "a campaign — chapter one", "08.31.26", pulsing red "live tease" dot
- **Main title:** "Not more than a chat." — serif, 56–180px clamp, italic "chat" in coral, coral period
- Strike-through list under title: ~~not another dating app~~ ~~not another group chat~~ ~~not another feed~~ **something for two** (strikes animate in one by one)
- Descriptive line (serif italic): "Move your cursor. Notice the two little things. *they're already looking for each other.*"
- 2 CTAs: "See what's coming →" (coral pill), "First, the truth ↓" (ghost pill)
- 4-cell proof strip separated by dashed lines: **2** people · **4** snicks · **0** feeds · **∞** reasons
- Bottom infinite ticker: "MORE THAN A CHAT ✦ BRING YOUR PERSON ✦ DON'T SPOIL IT ✦…"
- "scroll · slowly" hint at bottom

**Motion:**
- Title reveal: mask-clip with `yPercent: 110 → 0`, stagger 0.08s, `power3.out`, 1.1s
- Corner marks: fade in, staggered 0.1s, delay 0.4s
- Stamp: scale-in with `back.out(1.8)` at 0.9s, then continuous slow bob + rotating textPath ring
- Scraps: fade in staggered from 1.3s, then subtle cursor-parallax (scraps translate `--px/--py` based on cursor position)
- Strike-through lines animate `scaleX 0 → 1` at 1.7s / 2.0s / 2.3s
- CTAs + proof cells cascade in from 1.9s / 2.2s
- Cursor glow: 520px radial peach gradient follows pointer with 12% lerp, mix-blend-multiply on light bg, mix-blend-screen on dark bg
- Two hero dots ease toward cursor position + gentle sine drift

### 2. Story Beats — `02 Story`
**Purpose:** Show the mundane texting cycle. The user recognizes themselves.

**Layout:** 4 stacked beats, alternating left/right alignment. Each beat is ~78vh min-height with 12vh padding, mono kicker + huge serif line + optional supporting visual/aside.

**The 4 beats:**
1. **Left** — kicker "1 — a normal tuesday" · line "You *text*." · aside "little grey bubbles. read receipts. the usual soft dopamine."
2. **Right** — kicker "2 — around 4pm" · line "You send *reels*." · extras: two tilted `reel-card` mockups (180×280 and 150×230, gradient coral→wine, play button, mono "@you 0:12" / "@them 0:07" meta)
3. **Left** — kicker "3 — sometime later" · line 'You say *"wyd?"*' · extras: three chat bubbles (you: "wyd?", them: "nothing.", you-muted: "…same")
4. **Right** — kicker "4 — 11:47pm" · line 'You say *"goodnight ❤"*' · aside "and then you both keep scrolling for another 40 minutes. alone."

**Motion:**
- Each beat's italic emphasis word does mask-clip reveal on ScrollTrigger `start: 'top 78%'` (once)
- Kicker fades from y=14, aside from y=18
- Reel cards / bubbles fade + rise + slight rotate (±4°) with 0.15s stagger
- Whole beat has a gentle -6% parallax `yPercent` scrubbed across its scroll range

### 3. Campaign Marquee Strip
**Purpose:** Callback / breather between the story and the emotional pivot.

**Layout:** Full-width horizontal band, 22px vertical padding, top+bottom 1px dashed borders. Content: giant italic serif "MORE THAN A CHAT ✦" repeated 6× scrolling left at 30s per loop. Color changes based on surrounding section (blush → wine when body has `.dark` class).

Font: Fraunces italic, clamp(48px, 8vw, 110px), coral asterisks.

### 4. "But" Sticky Moment — `03 But`
**Purpose:** Dramatic pause. The whole story pivots here.

**Layout:** 150vh section with sticky 100vh inner. Center: single italic serif word "but" at clamp(140px, 28vw, 420px), color Wine `#6B2B3C`, with coral "…" appended. Small serif italic "wait for it…" at the bottom.

Background: `linear-gradient(180deg, #FBF4F1 0%, #F3DFD3 55%, #6B2B3C 100%)` — the light-to-wine transition happens visually here.

**Motion:** As user scrolls through the section:
- First half: "but" scales from 0.6 → 1.15, opacity 0.2 → 1, letter-spacing 0em → -0.04em (scrubbed)
- Second half: scales to 1.4, opacity fades to 0.15 (scrubbed) — the word "grows and dissolves"

### 5. Mystery Section — `04 Mystery`
**Purpose:** Emotional confrontation. Deliver the pivot.

**Background:** Muted Wine `#6B2B3C`, text `#fbeee4`. Body gains `.dark` class here (cursor glow flips blend mode). Two large blurred radial glows (peach + coral) drift parallax across the section.

**3 beats stacked:**
1. **Left** — kicker "a serious question" · Line: "When was the last time you *actually* did something together?" · Aside: "not 'sent each other something.' did something. as a duo. with your bodies."
2. **Right** — kicker "the uncomfortable part" · Line: "A relationship shouldn't live inside a *chat box.*" · Extra: a caged chatbox mockup with 6 muted bubbles, a mono label "a relationship" at top, subtle grid pattern (linear gradients 40×40) representing "bars"
3. **Left** — kicker "the pivot" · Line: "Let's *change* that."

Same reveal motion as Story beats.

### 6. Reveal Section — `05 Reveal`
**Purpose:** The product enters.

**Background:** Ink Wine `#1E0E13`, text `#fbeee4`.

**Content, top to bottom, centered:**
- Eyebrow (peach): "okay… you're both here"
- Campaign callback line (serif italic, 18–26px): "~~Not~~ *more* than a chat." — "Not" has a strike-through, "more" is peach
- Serif line: "Meet"
- **Connect visualization** (640×200): a coral dot on the left and peach dot on the right slide inward, connected by a horizontal peach gradient line that draws left-to-right; when they meet at center, a white spark bursts and fades outward
- Logo image: `assets/snickylink-logo.png` — 360px max, fades in with scale 0.92 → 1, peach drop-shadow
- Tag line (serif italic): "a secret little world for two people. connect · play · grow together."
- 2 CTAs: primary coral "Start your first Snick →" scrolling to `.pair`, ghost "Peek inside ↓" scrolling to `.snicks`

**Motion (single timeline, triggered at `top 60%`):**
1. Eyebrow fades in (y:20)
2. "Meet" reveals via mask
3. Coral dot slides in from x:-80 (0.8s), peach dot from x:+80 simultaneously
4. Both dots animate `left` from 0% and 100% toward 50% over 1.1s `power2.inOut`
5. Line `scaleX 0 → 1` in parallel
6. White spark scales 0 → 1 (0.4s), then scales to 3 and fades out (0.9s)
7. Logo fades + scales in (1.2s, `power3.out`)
8. Tag line + CTA row cascade in

### 7. Four Snicks — `06 Snicks`
**Purpose:** Preview the product's core loop.

**Background:** Ink-2 `#140A0E`. Header: eyebrow "four little unlocks", serif h2 "Start with *4 Snicks.*" (peach "4 Snicks."), italic sub "Small missions. Real moments. Tap a card to unlock — but you'll need your person for the real thing."

**4 cards in a grid** (4-col desktop, 2-col ≤1000px, 1-col ≤600px). Each card:
- Aspect ratio 3:4, radius 22px, dark gradient bg, 1px `rgba(232,185,156,0.14)` border, 22px padding
- Top-left: mono "SNICK · 01" + pill tag ("warm-up", "confess", "go outside", "?????")
- Top-right absolute: 32×32 circular lock icon (peach on 10% peach bg, 1px 25% peach border)
- Bottom body: mono status line + serif title + italic hint
- Peach spotlight glow follows cursor position (`--gx/--gy` CSS vars from pointermove)
- Peach light-sweep beam sweeps across card left-to-right on hover (skewed linear gradient translating `-120% → 120%`)

**The 4 Snicks:**
1. `SNICK · 01` — warm-up — "locked · tap to open" — "A silly photo, on the count of 3." — "no filters. no re-takes. proof that this is real."
2. `SNICK · 02` — confess — "locked · needs person 2" — "One thing you never told me." — "small confession. no big deal. (yes it is a big deal.)"
3. `SNICK · 03` — go outside — "locked · 15 min irl" — "Find something the exact color of us." — "hunt outside. bring evidence back. we'll decide together."
4. `SNICK · 04` — ????? — "locked · don't spoil it" — "You'll see this when you get here." — "no peeking. the fourth one is a surprise for a reason."

**Unlock interaction (click):**
- Card gets `.unlocked` class
- Lock icon SVG swaps to checkmark; background flips to solid peach, icon color to ink
- Card does a subtle `rotateY: ±6°` shake yoyo×3 (0.18s each, `sine.inOut`)
- Peach box-shadow blooms
- Status line text changes to "okay… you earned this" (peach color)

**Entry animation:** `ScrollTrigger.batch` — cards rise 40px, fade in, alternate ±3° rotation, 0.12s stagger.

### 8. Pair / Registration — `07 Pair`
**Purpose:** Show how it works — needs a person.

**Background:** Ink `#1E0E13`.

**Content:**
- Mono kicker "but first…" (peach 60%)
- Serif h2: "You'll *need* your *person.*" (italic "need" and "person"; "person" in peach)
- Italic sub: "one of you starts. the other joins with a code. no accounts. no feed. no strangers."
- **Avatar pair visualization:** two 120×120 circles with dashed rotating rings around them
  - Left: coral gradient, letter "y", label "you · person 1", initially at `translateX(-120px)`
  - Right: peach gradient, letter "t", label "them · person 2", initially at `translateX(120px)` with `opacity: 0.4`
  - When section enters (`top 55%`), body toggles `.connected` — both animate to `translateX(±20px)` and opacity 1 over 1.2s `cubic-bezier(.2,.9,.3,1.4)`
- **Code card** (520px max, 26px radius, peach-tint gradient background, 22% peach border):
  - Label: "send this to your person"
  - Massive mono code: `SNK7X2` (clamp 48–72px, letter-spacing 0.18em, 40px peach text-shadow glow)
  - Animated shimmer sweeps across every 4s (linear gradient translating `-120% → 120%`)
  - Hint: "it only works for the two of you. it expires when you finish Snick 01."
  - "copy code" button — on click, `navigator.clipboard.writeText('SNK7X2')`, text becomes "copied ✓" for 1.6s
- Bottom italic: "when they join, the first Snick unlocks itself. we'll take it from there."

### 9. Footer — `08 Foot`
**Purpose:** Final whisper.

**Background:** Ink-2 `#140A0E`.

**Content:**
- Mono label "the last thing"
- Giant serif italic: "Don't worry. It gets *better*." (mask reveal, "better" in peach)
- Meta row: "© 2026 snickylink" · "connect · play · grow together" · "made for two" (mono 10px)

---

## Interactions & Behavior Summary

| Interaction | Trigger | Behavior |
|---|---|---|
| Hero title reveal | Page load | Mask-clip words animate up, staggered |
| Cursor glow | Pointermove anywhere | 520px peach radial follows with 12% lerp |
| Hero dots | Pointermove | Coral + wine dots ease toward opposite quadrants |
| Chat scraps | Pointermove | Subtle parallax translate based on cursor |
| Story beats | ScrollTrigger top 78% | Kicker fade, italic word mask-reveals, extras rise |
| Beat parallax | Scroll | Each beat scrubs -6% yPercent |
| "But" scale | Scroll (sticky) | Word grows then dissolves |
| Mystery glows | Scroll | Two radial glows drift opposite directions |
| Reveal timeline | ScrollTrigger top 60% | Dots meet → spark → logo fades in → CTAs cascade |
| Snick hover | Pointermove on card | Peach spotlight follows cursor; light-sweep beam |
| Snick click | Click | Lock → check icon, shake, glow bloom, status text change |
| Pair avatars | ScrollTrigger top 55% | Circles slide inward, peach one fades to full opacity |
| Copy code | Click "copy code" | Clipboard write + temporary "copied ✓" state |
| Marquee | Continuous | 30s infinite horizontal scroll, direction stable |
| Ticker | Continuous | 40s infinite scroll with edge mask fade |
| Whisper tags | Every 3.8s | Small serif italic tag pops in at random hero position, fades in ~2.5s cycle |

**Progress bar:** 2px fixed top bar. Fills with coral→peach gradient based on total scroll progress (ScrollTrigger `onUpdate` sets CSS var `--p`).

**Dark mode swap:** `body.dark` class toggles when body enters mystery / reveal / snicks / pair / footer sections. Flips cursor-glow blend mode and adjusts eyebrow/pill colors.

---

## State Management

Minimal client-side state — this is a marketing site, not an app.

| State | Type | Notes |
|---|---|---|
| `unlockedSnicks` | Set<string> | Which Snick cards have been clicked. Not persisted in the prototype; consider `localStorage` in prod. |
| `bodyDarkMode` | boolean | Driven by ScrollTrigger enter/leave on dark sections. |
| `copiedCode` | boolean (transient 1.6s) | For the SNK code copy button label swap. |
| `progress` | number 0–1 | Scroll progress for the top bar. |

No data fetching. No auth. No routing beyond in-page anchors from CTAs.

---

## Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `--blush` | `#FBF4F1` | Hero, story background |
| `--peach` | `#E8B99C` | Highlights, glow, dark-mode accents |
| `--peach-soft` | `#F0CDB4` | Softer peach variants |
| `--coral` | `#E9765B` | Primary accent, CTAs, italic emphasis on light bg |
| `--wine` | `#6B2B3C` | Muted wine — Mystery section bg, primary text on light |
| `--wine-deep` | `#3A1620` | Deep wine — "But" sticky text color |
| `--ink` | `#1E0E13` | Reveal + Pair backgrounds |
| `--ink-2` | `#140A0E` | Snicks + Footer backgrounds |
| `--text` | `#2A1218` | Default text on light bg |
| `--text-mute` | `rgba(42,18,24,0.55)` | Muted text on light |
| Dark text | `#fbeee4` | Text on wine/ink backgrounds |
| Dark text mute | `rgba(251,238,228,0.55)` | Muted text on dark |

### Typography
| Family | Import | Usage |
|---|---|---|
| **Fraunces** (serif) | Google Fonts, weights 300/400/500, italics | All display text, italic emphasis, marquees |
| **Space Grotesk** (sans) | Google Fonts, 300–700 | Body copy, buttons, hero sub |
| **JetBrains Mono** (mono) | Google Fonts, 400/500 | Kickers, eyebrows, code, tickers, meta labels |
| **Bricolage Grotesque** | Google Fonts, 500/700 | Brand mark in nav |

**Type scale:**
- Hero title: `clamp(56px, 11.5vw, 180px)`, serif, weight 400, line-height 0.92, letter-spacing -0.02em
- Beat line: `clamp(48px, 9vw, 132px)`, serif, weight 400, line-height 1, letter-spacing -0.02em
- Section h2: `clamp(44px, 7vw, 96px)`
- Body: `clamp(15px, 1.4vw, 19px)`, serif italic
- Kicker / eyebrow: 11px mono, letter-spacing 0.28–0.32em, uppercase
- Marquee: `clamp(48px, 8vw, 110px)`, serif italic
- "But" word: `clamp(140px, 28vw, 420px)`, serif italic

### Spacing
Free-form — uses vw/vh and clamp for responsive scaling. Section vertical rhythm: 120–220px top/bottom padding. Beat internal padding: 12vh vertical.

### Radius
- Cards: 22px (Snick cards, code card, cage)
- Bubbles: 22px + 6px on the "tail" side (bubble--them: bottom-left, bubble--you: bottom-right)
- Pills / small buttons: 100px (fully rounded)
- Reel card: 22px

### Shadows
- Card default: `0 8px 24px rgba(60,20,30,0.08)` on bubbles, `0 30px 60px -20px rgba(60,20,30,0.25)` on reel cards
- Primary CTA: `0 20px 40px -12px rgba(233,118,91,0.5)`
- Snick unlocked glow: `0 30px 80px -20px rgba(232,185,156,0.35)`
- Stamp core: `0 12px 30px -8px rgba(233,118,91,0.45)`

### Motion
| Kind | Duration | Easing |
|---|---|---|
| Text mask reveal | 0.9–1.1s | `power3.out` (cubic-bezier equivalent: `.215,.61,.355,1`) |
| Card hover lift | 0.3s | `cubic-bezier(.2,.9,.3,1.4)` |
| Stagger | 0.06–0.12s between siblings | — |
| Sticky "but" scrub | scroll-linked (100vh) | linear |
| Connect dots meet | 1.1s | `power2.inOut` |
| Snick unlock shake | 0.18s × 3 yoyo | `sine.inOut` |
| Cursor glow lerp | 12% per frame | — |
| Marquee | 30s linear infinite | — |
| Ticker | 40s linear infinite | — |
| Stamp orbit ring | 22s linear infinite | — |
| Avatar dashed ring | 20s linear infinite | — |
| Shimmer sweep | 4s ease-in-out infinite | — |
| Blink dots | 1.4–2.4s infinite | — |

---

## Assets

| Asset | Path in bundle | Source / notes |
|---|---|---|
| Snickylink logo (rasterized) | `assets/snickylink-logo.png` | Provided by user (1024×1024 PNG). Full-color illustration of two hands cradling a sprout above the wordmark. Use as-is or ship a cleaner SVG in prod. |

**Not bundled — generate from CSS/SVG in-code (already inline):**
- Grain noise (SVG turbulence filter, inline data URI)
- Reel card mockups (gradient + pseudo-elements)
- Snick lock/check icons (inline SVG paths)
- Corner marks (CSS pseudo-elements)
- Stamp SVG orbiting text (inline SVG with `<textPath>`)

---

## Files in This Bundle

| File | Role |
|---|---|
| `index.html` | Root document with full DOM structure and section markup |
| `styles.css` | All CSS — tokens, layout, motion, responsive breakpoints |
| `app.js` | GSAP + ScrollTrigger + Lenis boot, all scroll-linked motion, cursor tracking, unlock interactions, clipboard |
| `assets/snickylink-logo.png` | Brand logo |

**External libraries used (via CDN in the prototype — pin these versions in prod):**
- GSAP 3.12.5 + ScrollTrigger
- Lenis 1.1.13 (smooth scroll)
- Google Fonts: Fraunces, Space Grotesk, JetBrains Mono, Bricolage Grotesque

**Recommended implementation stack for production:**
- Next.js App Router + React + TypeScript
- Tailwind CSS with the tokens above extended in `tailwind.config.ts`
- `@gsap/react` for hooks, `gsap` + `gsap/ScrollTrigger`, `lenis/react` or `@studio-freight/react-lenis`
- Ship logo as SVG (request from design)
- Persist unlocked Snicks in `localStorage`

---

## Notes for the Developer

1. **The Lenis + GSAP integration is fragile.** In this prototype we use a standalone RAF loop that calls `lenis.raf(time)` + `ScrollTrigger.update()` + `requestAnimationFrame(...)`, and separately call `gsap.ticker.wake()`. Don't try to feed Lenis via `gsap.ticker.add` — it caused the global timeline to freeze during development.
2. **All text reveals must set both `yPercent` AND `y`** on the fromTo tween (start and end) plus `clearProps: 'y'` on the end state. Otherwise GSAP caches a residual pixel offset and the words never fully return to `translateY(0)`.
3. **Pre-hide state should be CSS-gated on `body:not(.js-ready)`.** JavaScript adds `.js-ready` right after `gsap.set(...)` runs so the CSS fallback stops applying — this prevents FOUC without letting CSS `%` transforms fight GSAP's `yPercent`.
4. **Respect `prefers-reduced-motion`.** The prototype dampens the global timeline; in prod you should replace scroll-driven scrubs with instant reveals and skip continuous loops (marquee, ticker, spinning stamp).
5. **Accessibility.** Every mask-reveal `<span>` group has an `aria-label` on the parent that spells out the full sentence for screen readers. The nested spans are `aria-hidden` by proxy (visual only). Keep this pattern.
6. **The visual journey (blush → wine → ink) is emotional pacing.** Don't lighten the "But" or "Mystery" sections — the mood shift is the whole point.

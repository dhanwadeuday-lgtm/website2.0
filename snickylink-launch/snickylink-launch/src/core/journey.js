import { clamp, lerp, smoothstep } from './util.js';

// ─────────────────────────────────────────────────────────────────────────────
// Journey state — pure numbers and booleans, zero visuals.
// p: global scroll progress 0..1 across the whole story.
// Chapters ride inside it; each chapter has [start, end] and helpers.
// Real user interactions (snick cards, join) set `done[n]` / `joined` —
// scroll NEVER completes a checkpoint. This rule is the product.
// ─────────────────────────────────────────────────────────────────────────────

export const CH = {
  spark:   [0.000, 0.080],  // opening — the map reveals, "MORE THAN A CHAT"
  intro:   [0.080, 0.125],  // four checkpoints, two people
  join:    [0.125, 0.170],  // partner joins (real interaction)
  cp1:     [0.170, 0.290],  // THE FIRST SPARK · NOTICE
  cp1lit:  [0.290, 0.325],
  cp2:     [0.325, 0.445],  // PLAYGROUND · PLAY
  cp2lit:  [0.445, 0.480],
  cp3:     [0.480, 0.600],  // DEEPER WATERS · CONNECT (bridge crossing)
  cp3lit:  [0.600, 0.630],
  cp4:     [0.630, 0.745],  // MEMORY PEAK · CREATE (the climb)
  cp4lit:  [0.745, 0.775],
  arena:   [0.775, 0.825],  // locked preview (phase 3)
  board:   [0.825, 0.870],  // flex board teaser (honest sample)
  next:    [0.870, 0.930],  // fogged future worlds
  finale:  [0.930, 0.985],  // wide pull-back over the traveled path
};

export class Journey {
  constructor() {
    this.p = 0;          // smoothed progress
    this.raw = 0;        // raw scroll target
    this.vel = 0;
    this.done = [false, false, false, false];  // checkpoint completion (real interactions only)
    this.joined = false; // partner joined (real interaction)
    this.score = 87;
    this.tag = 'THE OBSERVER 👀';
    this.tagline = 'You two notice the little things.';
    this.initials = 'A + M';
    this.onCompleteCallbacks = [];
  }

  chapterProgress(name) {
    const [a, b] = CH[name];
    return clamp((this.p - a) / (b - a || 1e-6), 0, 1);
  }
  inside(name) {
    const [a, b] = CH[name];
    return this.p >= a && this.p < b;
  }

  // How far along the path the two markers have walked (0..1). Scroll = travel;
  // completion is separate. Markers only "light" their checkpoint via done[].
  travel() { return clamp(this.p / 0.985, 0, 1); }

  // Path glow: 0 until the partner joins, then brightens with each shared
  // checkpoint — the trail literally lights up behind the pair.
  syncLevel() {
    const lit = this.done.filter(Boolean).length;
    return (this.joined ? 0.35 : 0) + (lit / 4) * 0.65;
  }

  // Number of checkpoints lit — drives rail dots and announcements.
  litCount() { return this.done.filter(Boolean).length; }

  completeSnick(i) {
    if (this.done[i]) return;
    this.done[i] = true;
    for (const cb of this.onCompleteCallbacks) cb(i);
  }
  joinPartner() {
    if (this.joined) return;
    this.joined = true;
  }
}

export const journey = new Journey();

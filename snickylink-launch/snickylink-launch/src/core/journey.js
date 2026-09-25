import { clamp, lerp, smoothstep } from './util.js';

// ─────────────────────────────────────────────────────────────────────────────
// Journey state
// p: global scroll progress 0..1 across the whole story.
// Chapters ride inside it; each chapter has [start, end] and helpers.
// Real user interactions (snick cards) set `done[n]` — scroll NEVER completes a
// snick; blooms only open when the matching snick is actually done.
// ─────────────────────────────────────────────────────────────────────────────

export const CH = {
  seed:    [0.000, 0.100],
  water:   [0.100, 0.200],
  stem:    [0.200, 0.300],
  water2:  [0.300, 0.400],
  brand:   [0.400, 0.460],
  snicks:  [0.460, 0.520],
  join:    [0.520, 0.560],
  snick1:  [0.560, 0.620],
  bloom1:  [0.620, 0.680],
  snick2:  [0.680, 0.740],
  bloom2:  [0.740, 0.790],
  snick3:  [0.780, 0.830],
  bloom3:  [0.830, 0.870],
  snick4:  [0.870, 0.910],
  bloom4:  [0.910, 0.940],
  hero:    [0.940, 0.965],
  score:   [0.965, 0.985],
  finale:  [0.985, 1.001],
};

const all = Object.values(CH);

export class Journey {
  constructor() {
    this.p = 0;          // smoothed progress
    this.raw = 0;        // raw scroll target
    this.vel = 0;
    this.done = [false, false, false, false];  // snick completion (real interactions only)
    this.joined = false; // partner joined (real interaction)
    this.bloom = [0, 0, 0, 0]; // eased open amount per flower
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
  enterT(name) {
    // 0→1 across the chapter's first 18% — for text entrance opacity
    const cp = this.chapterProgress(name);
    return smoothstep(0, 0.18, cp);
  }
  exitT(name) {
    const cp = this.chapterProgress(name);
    return 1 - smoothstep(0.86, 1, cp);
  }
  peakT(name) {
    return Math.min(this.enterT(name), this.exitT(name));
  }

  // Camera angle in degrees, smooth and organic (not mechanical).
  cameraAngle() {
    const p = this.p;
    // gentle easing around anchor points
    const anchors = [0, 38, 74, 112, 150, 188, 224, 252, 272];
    const stops = [0, 0.18, 0.36, 0.5, 0.66, 0.8, 0.9, 0.96, 1];
    let i = 0;
    while (i < stops.length - 2 && p > stops[i + 1]) i++;
    const t = clamp((p - stops[i]) / (stops[i + 1] - stops[i] || 1e-6), 0, 1);
    const eased = t * t * (3 - 2 * t);
    return lerp(anchors[i], anchors[i + 1], eased);
  }

  // Growth stages driven by scroll — but blooms gated by real completion.
  growth() {
    let g = 0;
    g += smoothstep(0.10, 0.30, this.p) * 0.22;   // stem emerges after first water
    g += smoothstep(0.30, 0.50, this.p) * 0.16;   // second water → taller
    g += smoothstep(0.50, 0.62, this.p) * 0.06;   // first snick
    g += smoothstep(0.62, 0.74, this.p) * 0.12;   // bloom 1
    g += smoothstep(0.74, 0.86, this.p) * 0.14;   // blooms 2–3
    g += smoothstep(0.86, 0.94, this.p) * 0.12;   // bloom 4
    g += smoothstep(0.94, 1.0, this.p) * 0.18;    // final stretch
    return clamp(g, 0, 1);
  }

  // Helix path visibility / sync
  helixReveal() {
    return smoothstep(0.28, 0.5, this.p) * 0.45 + smoothstep(0.52, 0.62, this.p) * 0.3 + smoothstep(0.9, 1.0, this.p) * 0.25;
  }
  helixSync() {
    // 0 = separated paths, 1 = synchronized orbit
    return smoothstep(0.52, 0.6, this.p) * 0.55 + smoothstep(0.62, 0.94, this.p) * 0.45;
  }

  // The two partner dots
  youPos()  { return this.helixPoint(0, this.p, 0); }
  themPos() { return this.helixPoint(1, this.p, this.joined ? 0 : 0.42); }

  // Parametric helix point for path n (0=you, 1=them)
  helixPoint(n, p, lag = 0) {
    const a = n === 0 ? 0 : Math.PI;
    const turns = 2.15;
    const q = clamp(p - lag * 0.14, 0, 1);
    const ang = a + q * turns * Math.PI * 2 * 0.92;
    const r = 2.3 * this.tight();
    return { ang, r };
  }

  tight() { return this.mobileTight || 1; }

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

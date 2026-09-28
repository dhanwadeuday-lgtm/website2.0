export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;

// 0 before a, 1 after b, smooth between.
export const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

// Triangular fade: 0 → 1 → 0 across [a,b] peaking at mid.
export const fadePeak = (a, b, v) => {
  if (v <= a || v >= b) return 0;
  const mid = (a + b) / 2;
  return v < mid ? smoothstep(a, mid, v) : 1 - smoothstep(mid, b, v);
};

// Frame-rate independent exponential smoothing.
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

// Organic wobble for ambient motion.
export const wobble = (time, seed, freq = 1.7, amp = 0.05) =>
  Math.sin(time * freq + seed * 12.9898) * amp +
  Math.sin(time * freq * 0.63 + seed * 78.233) * amp * 0.55;

export const device = (() => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
  const small = w < 820;
  const mobile = small || coarse;
  return {
    mobile,
    touch: coarse,
    // particle counts & segment tiers
    particles: mobile ? 260 : 900,
    growthParticles: mobile ? 90 : 220,
    stemSegs: mobile ? 44 : 80, // curve segments for smooth paths
    envQuality: mobile ? 'low' : 'high',
    dprCap: mobile ? 1.7 : 2,
    cameraAmplitude: mobile ? 0.62 : 1, // gentler camera travel on phones
  };
})();

export const fmt = (n) => n.toLocaleString('en-US');

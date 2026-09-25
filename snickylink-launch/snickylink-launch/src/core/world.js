import * as THREE from 'three';
import { damp, lerp, smoothstep, clamp, device } from './util.js';
import { journey } from './journey.js';
import { BRAND } from './tokens.js';
import { WorldMap } from './worldmap.js';

// World — Three.js scene/camera/renderer. Reads `journey` each frame, never
// writes it. The camera flies a CatmullRom spline through the map, varying
// elevation/banking per checkpoint. Fog IS the lock: unrevealed regions hide
// in wine/deep-ink haze.

const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function webglSupported() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.reduced = REDUCED;

    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: !device.mobile, alpha: false, powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, device.dprCap));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = false; // stylized night map: light comes from emissives
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(BRAND.ink);
    this.scene.fog = new THREE.FogExp2(BRAND.ink, 0.017);
    this.camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 260);

    // moonlight key + cool fill; accents come from markers/beacons (worldmap)
    this.keyLight = new THREE.DirectionalLight(0xe8d5c8, 1.15);
    this.keyLight.position.set(-30, 46, 18);
    this.fillLight = new THREE.HemisphereLight(0x3a1620, 0x0a0507, 1.0);
    this.scene.add(this.keyLight, this.fillLight);

    // the map
    this.map = new WorldMap(this.scene);

    // camera spline — rides above the travel path, but cinematic (wider, higher)
    const camPts = [
      new THREE.Vector3(-52, 6.5, 16),
      new THREE.Vector3(-36, 5.2, 6),
      this.map.cpPos[0].clone().add(new THREE.Vector3(4, 3.4, 9)),   // low & intimate at cp1
      this.map.cpPos[1].clone().add(new THREE.Vector3(3, 4.2, 10)),  // playground sweep
      this.map.cpPos[2].clone().add(new THREE.Vector3(-2, 2.6, 7)),  // skim the water
      this.map.cpPos[3].clone().add(new THREE.Vector3(-4, 3.2, 8)),  // climb beside the peak
      new THREE.Vector3(44, 12, -52),                                 // arena overview
      new THREE.Vector3(50, 16, -60),                                 // board / next
      this.map.finalePos.clone().add(new THREE.Vector3(2, 17, 20)),  // wide pull-back
    ];
    this.camCurve = new THREE.CatmullRomCurve3(camPts, false, 'catmullrom', 0.4);
    this.camPos = new THREE.Vector3();
    this.camLook = new THREE.Vector3();
    this.camCur = this.camCurve.getPoint(0);
    this.lookCur = this.map.cpPos[0].clone().setY(1.5);
    this._lookBase = new THREE.Vector3();
    this._tmp = new THREE.Vector3();
    this._cTmpA = new THREE.Color();
    this._cTmpB = new THREE.Color();

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Where the camera should look at a given progress — rides ahead of the
  // travellers, easing into each checkpoint as we approach it.
  _lookTarget(p) {
    const m = this.map;
    if (p < 0.125) return m.cpPos[0].clone().setY(1.6);
    if (p < 0.170) return this._tmp.copy(m.cpPos[0]).lerp(m.cpPos[1], (p - 0.125) / 0.045).setY(1.6).clone();
    if (p < 0.290) return m.cpPos[1].clone().setY(1.8);
    if (p < 0.325) return this._tmp.copy(m.cpPos[1]).lerp(m.cpPos[2], (p - 0.290) / 0.035).setY(1.6).clone();
    if (p < 0.480) return m.cpPos[2].clone().setY(1.6);
    if (p < 0.600) return this._tmp.copy(m.cpPos[2]).lerp(m.cpPos[3], (p - 0.480) / 0.12).setY(2.0).clone();
    if (p < 0.775) return m.cpPos[3].clone().setY(2.4);
    if (p < 0.825) {
      // arena: swing the gaze out to the pillar ring
      const k = Math.min(1, ((p - 0.775) / 0.05) * 1.4);
      return this._tmp.copy(m.cpPos[3]).lerp(m.landmarks.arena, k).setY(2.0).clone();
    }
    if (p < 0.870) {
      // flex board: pan across the water to the great slab
      const k = Math.min(1, ((p - 0.825) / 0.045) * 1.3);
      return this._tmp.copy(m.landmarks.arena).lerp(m.landmarks.board, k).setY(2.2).clone();
    }
    if (p < 0.930) {
      // the fog gate, then a slow gaze tour: right worlds → gate → the far glint
      const k = Math.min(1, ((p - 0.870) / 0.06) * 1.4);
      const W = m.worlds;
      const tour = this._tmp.copy(m.landmarks.board).lerp(m.landmarks.gate, k);
      const t3 = smoothstep(0.895, 0.928, p); // tour sweeps as the chapters name each world
      return tour.lerp(W.glade.c, t3 * 0.4).lerp(W.orbit.c, t3 * 0.3).lerp(W.celestial.c, t3 * 0.25).setY(2.0).clone();
    }
    // finale: look back along the traveled path
    const back = m.curve.getPoint(Math.max(0, journey.travel() - 0.18));
    return this._tmp.copy(back).lerp(m.finalePos, 0.5).setY(1.8).clone();
  }

  // Fog density/color per progress — the "locked region" language.
  _mood(p) {
    // reveals: each checkpoint approach thins the fog locally in time
    const reveals =
      smoothstep(0.10, 0.20, p) * 0.22 +
      smoothstep(0.26, 0.36, p) * 0.2 +
      smoothstep(0.42, 0.52, p) * 0.2 +
      smoothstep(0.57, 0.67, p) * 0.2 +
      smoothstep(0.88, 0.96, p) * 0.18;
    const density = lerp(0.022, 0.0085, clamp(reveals, 0, 1));
    // finale warms toward deep wine, then the celebration breathes peach
    const col = this._cTmpA.set(BRAND.ink).lerp(this._cTmpB.set(BRAND.deepWine), smoothstep(0.75, 0.98, p) * 0.85);
    col.lerp(this._cTmpB.set(BRAND.peach), smoothstep(0.93, 0.985, p) * 0.22);
    return { density, col };
  }

  update(dt, time) {
    const j = journey;
    const prev = j.p;
    j.p = damp(j.p, j.raw, 5.2, dt);
    j.vel = j.raw - j.p;

    this.map.update(dt, time);
    this._updateCamera(dt, time);
    this._updateMood(dt, prev);
  }

  _updateCamera(dt, time) {
    const j = journey;
    const p = j.p;

    // base spline position
    const t = clamp(p / 0.985, 0, 1);
    const target = this.camCurve.getPoint(t);
    this.camPos.copy(target);

    // gentle lateral sway + banking through curves (skip if reduced motion)
    if (!this.reduced) {
      const sway = Math.sin(time * 0.4) * 0.35 + Math.sin(time * 0.23) * 0.22;
      this.camPos.x += sway;
      this.camPos.y += Math.sin(time * 0.5) * 0.14;
    }

    // per-chapter cinematic adjustments
    if (p < 0.08) {
      // opening: slow push-in from high
      const local = clamp(p / 0.08, 0, 1);
      this.camPos.y += lerp(3.2, 0, local);
      this.camPos.z += lerp(6, 0, local);
    }
    if (j.inside('cp3')) {
      // bridge crossing: skim low over the water
      const local = j.chapterProgress('cp3');
      this.camPos.y -= Math.sin(local * Math.PI) * 1.4;
    }
    if (j.inside('cp4')) {
      // the climb: tilt up toward the peak
      const local = j.chapterProgress('cp4');
      this.camPos.y += Math.sin(local * Math.PI) * 1.2;
    }
    if (p > 0.930) {
      // finale: extra slow drift outward
      const local = clamp((p - 0.930) / 0.055, 0, 1);
      this.camPos.y += local * 2.2;
      this.camPos.z += local * 3.4;
    }

    // look target with damping
    this._lookBase.copy(this._lookTarget(p));
    this.lookCur.lerp(this._lookBase, 1 - Math.exp(-3.0 * dt));
    this.camCur.lerp(this.camPos, 1 - Math.exp(-3.4 * dt));

    this.camera.position.copy(this.camCur);
    this.camera.lookAt(this.lookCur);

    // subtle roll (banking) from horizontal curvature
    if (!this.reduced) {
      const ahead = this.camCurve.getPoint(clamp(t + 0.02, 0, 1));
      const dx = ahead.x - this.camCur.x;
      this.camera.rotation.z = clamp(-dx * 0.012, -0.05, 0.05);
    }
  }

  _updateMood(dt, prevP) {
    const j = journey;
    const { density, col } = this._mood(j.p);
    // fog pulse when the pair completes — the world exhales
    this.joinGlow = damp(this.joinGlow ?? 0, j.joined ? 1 : 0, 1.6, dt);
    const joined = 0.011 * this.joinGlow;
    this.scene.fog.density = Math.max(0.004, density - joined);
    this.scene.fog.color.copy(col);
    this.scene.background.lerp(col, 0.06);

    // velocity kick: fast scrolling widens the lens, settling tightens it
    const targetFov = 46 + clamp(Math.abs(j.vel) * 220, 0, 7);
    this.fovCur = lerp(this.fovCur ?? 46, targetFov, 1 - Math.exp(-4.5 * dt));
    if (Math.abs(this.camera.fov - this.fovCur) > 0.01) {
      this.camera.fov = this.fovCur;
      this.camera.updateProjectionMatrix();
    }
    void prevP;
  }
}

// Static fallback if WebGL is unavailable: gradient + silhouettes via CSS,
// content remains fully usable.
export function mountStaticFallback() {
  document.body.classList.add('no-webgl');
  const el = document.createElement('div');
  el.className = 'static-bg';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="static-stars"></div>
    <div class="static-hills">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#3A1620" d="M0,224 C240,160 420,288 720,224 C1020,160 1200,256 1440,192 L1440,320 L0,320 Z" opacity="0.8"></path>
        <path fill="#241016" d="M0,256 C300,208 560,304 860,256 C1120,214 1280,272 1440,240 L1440,320 L0,320 Z"></path>
      </svg>
    </div>`;
  document.body.prepend(el);
}

// Worldmap — the stylized 3/4-perspective world two people travel through.
// Low-poly terrain, spline path, bridges, campfires, fireflies, sine water.
// Everything reads journey state; nothing here mutates it.
import * as THREE from 'three';
import { lerp, smoothstep, clamp, wobble, damp, device } from './util.js';
import { journey } from './journey.js';
import { BRAND } from './tokens.js';

const TERRAIN_SEG = device.mobile ? 56 : 92;      // plane segments per side
const PATH_POINTS = device.mobile ? 120 : 220;    // path tube resolution
const TERRAIN_SIZE = 130;

// ── materials (shared, cheap) ────────────────────────────────────────────────
function landMaterial(base, emissive = 0x000000) {
  return new THREE.MeshLambertMaterial({ color: base, emissive });
}

export class WorldMap {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);

    // checkpoint world positions (also used by the camera path)
    this.cpPos = [
      new THREE.Vector3(-26, 0.4, -6),    // 1 spark
      new THREE.Vector3(-6, 0.8, -30),    // 2 playground
      new THREE.Vector3(16, 0.5, -44),    // 3 deeper waters (bridge island)
      new THREE.Vector3(34, 3.2, -60),    // 4 memory peak (hilltop)
    ];
    this.finalePos = new THREE.Vector3(52, 1.0, -78);

    this._terrain();
    this._water();
    this._path();
    this._markers();
    this._checkpoints();
    this._fireflies();
    this._clouds();
    this._monuments();
  }

  // ── terrain: two headlands + far shore, displaced by layered sine noise ────
  _terrain() {
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE * 0.8, TERRAIN_SEG, Math.round(TERRAIN_SEG * 0.8));
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const cp = this.cpPos;
    const finale = this.finalePos;

    const height = (x, z) => {
      let h = 0;
      h += Math.sin(x * 0.055) * Math.cos(z * 0.062) * 1.5;
      h += Math.sin(x * 0.16 + 1.7) * Math.sin(z * 0.14) * 0.55;
      h += Math.sin(x * 0.42) * Math.cos(z * 0.39 + 2.1) * 0.16;
      // flatten pads under each checkpoint
      for (const c of cp) {
        const d = Math.hypot(x - c.x, z - c.z);
        const flat = 1 - smoothstep(3.2, 8.5, d);
        h = lerp(h, c.y - 0.25, flat);
      }
      const dF = Math.hypot(x - finale.x, z - finale.z);
      h = lerp(h, finale.y - 0.25, 1 - smoothstep(3.2, 9, dF));
      // raise the memory-peak headland
      const dPeak = Math.hypot(x - cp[3].x, z - cp[3].z);
      h += (1 - smoothstep(4, 16, dPeak)) * 3.4;
      // sink everything away from land (islands)
      const near = Math.min(...cp.map(c => Math.hypot(x - c.x, z - c.z)),
        Math.hypot(x - finale.x, z - finale.z));
      const land = 1 - smoothstep(11, 24, near);
      h = lerp(-2.2, h, land);
      return h;
    };

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setY(i, height(x, z));
    }
    geo.computeVertexNormals();

    // vertex colors: deep-ink shores → wine meadows → copper heights
    const colors = new Float32Array(pos.count * 3);
    const cLow = new THREE.Color(0x241016);
    const cMid = new THREE.Color(0x4a2230);
    const cHigh = new THREE.Color(0x6b2b3c);
    const cPeak = new THREE.Color(0x8a3a46);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const h = pos.getY(i);
      if (h < 0.1) c.copy(cLow);
      else if (h < 1.4) c.copy(cMid).lerp(cLow, 1 - smoothstep(0.1, 1.4, h));
      else if (h < 3.2) c.copy(cHigh).lerp(cMid, 1 - smoothstep(1.4, 3.2, h));
      else c.copy(cPeak).lerp(cHigh, 1 - smoothstep(3.2, 5.4, h));
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.terrain = new THREE.Mesh(geo, mat);
    this.terrain.position.set(6, 0, -34);
    this.terrain.receiveShadow = !device.mobile;
    this.group.add(this.terrain);
  }

  // ── water: one big sine-displaced plane between the islands ────────────────
  _water() {
    const segs = device.mobile ? 40 : 72;
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE * 1.4, TERRAIN_SIZE * 1.2, segs, segs);
    geo.rotateX(-Math.PI / 2);
    this._waterBase = geo.attributes.position.array.slice();
    const mat = new THREE.MeshPhongMaterial({
      color: 0x2a1219, emissive: 0x160a0e, shininess: 90, specular: 0x5a2a33,
      transparent: true, opacity: 0.94,
    });
    this.water = new THREE.Mesh(geo, mat);
    this.water.position.set(6, -0.35, -34);
    this.group.add(this.water);
  }

  // ── the path: glowing tube through the four checkpoints ────────────────────
  _path() {
    const through = [...this.cpPos.map(v => v.clone().setY(v.y + 0.05)), this.finalePos.clone().setY(this.finalePos.y + 0.05)];
    // gentle pre/post handles so the curve breathes instead of cornering
    const pts = [];
    const first = through[0].clone().add(new THREE.Vector3(-14, 0, 10));
    const last = through[through.length - 1].clone().add(new THREE.Vector3(14, 0, -10));
    pts.push(first, ...through, last);
    this.curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.35);

    const mat = new THREE.MeshBasicMaterial({
      color: BRAND.peach, transparent: true, opacity: 0.0, // opacity driven per-frame
    });
    // dashed-lite: series of small dots along the curve (cheaper & prettier than a solid tube)
    const dotGeo = new THREE.SphereGeometry(0.09, 6, 5);
    this.pathDots = new THREE.InstancedMesh(dotGeo, mat.clone(), PATH_POINTS);
    this.pathDots.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    const m = new THREE.Matrix4();
    const hidden = new THREE.Vector3(0, -50, 0);
    this._dotT = [];
    for (let i = 0; i < PATH_POINTS; i++) {
      const t = i / (PATH_POINTS - 1);
      this._dotT.push(t);
      m.setPosition(hidden);
      this.pathDots.setMatrixAt(i, m);
    }
    this.pathDots.frustumCulled = false;
    this.group.add(this.pathDots);
  }

  // ── two travelling markers ─────────────────────────────────────────────────
  _markers() {
    const mk = (color, hollow) => {
      const g = new THREE.Group();
      const geo = new THREE.SphereGeometry(0.34, 16, 12);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: hollow ? 0.25 : 0.95 });
      const core = new THREE.Mesh(geo, mat);
      g.add(core);
      if (hollow) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.46, 0.045, 8, 24),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 }),
        );
        ring.rotation.x = Math.PI / 2;
        g.add(ring);
      }
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 12, 10),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.14, depthWrite: false }),
      );
      g.add(halo);
      g.userData.core = core; g.userData.halo = halo;
      return g;
    };
    this.you = mk(BRAND.blush, false);
    this.them = mk(BRAND.peach, true);
    this.group.add(this.you, this.them);
    this.youLight = new THREE.PointLight(BRAND.blush, 1.6, 9, 2);
    this.themLight = new THREE.PointLight(BRAND.peach, 0, 9, 2);
    this.group.add(this.youLight, this.themLight);
  }

  // ── checkpoint islands: monument + beacon + ring + snick portal ───────────
  _checkpoints() {
    this.checkpoints = this.cpPos.map((pos, i) => {
      const g = new THREE.Group();
      g.position.copy(pos);

      // monument — distinct silhouette per checkpoint
      let mon;
      if (i === 0) {
        mon = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.6, 5), landMaterial(0x5a2431));
        mon.position.y = 1.15;
      } else if (i === 1) {
        mon = new THREE.Group();
        const swingA = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.09, 8, 24), landMaterial(0x5a2431));
        swingA.position.y = 2.0; swingA.rotation.x = Math.PI / 2.4;
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3.1, 6), landMaterial(0x3a1620));
        post.position.y = 1.55;
        mon.add(swingA, post);
      } else if (i === 2) {
        mon = new THREE.Group();
        const arch = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.13, 8, 24, Math.PI), landMaterial(0x5a2431));
        arch.position.y = 0.05; arch.rotation.z = 0; arch.rotation.y = Math.PI / 2;
        const pool = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.22, 20),
          new THREE.MeshPhongMaterial({ color: 0x33161f, emissive: 0x1c0d12, shininess: 80 }));
        pool.position.y = 0.1;
        mon.add(arch, pool);
      } else {
        mon = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.25, 0.9, 6), landMaterial(0x5a2431));
        base.position.y = 0.45;
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.7, 6),
          new THREE.MeshBasicMaterial({ color: 0xe8b99c, transparent: true, opacity: 0.92 }));
        flame.position.y = 1.85;
        mon.add(base, flame);
        g.userData.flame = flame;
      }
      g.add(mon);

      // beacon — the "is it done?" light (lit only via journey.done[i])
      const beacon = new THREE.PointLight(i === 3 ? BRAND.copper : BRAND.peach, 0, 16, 2);
      beacon.position.set(0, 2.6, 0);
      g.add(beacon);

      // ring on the ground — activation state ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.5, 0.05, 6, 40),
        new THREE.MeshBasicMaterial({ color: BRAND.peach, transparent: true, opacity: 0.16 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.06;
      g.add(ring);

      // snick portal — two small monoliths (chips UI floats over this in DOM)
      const portal = new THREE.Group();
      const stone = landMaterial(0x3a1620);
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.9, 0.5), stone);
      a.position.set(-0.85, 0.95, 1.9); a.rotation.y = 0.5;
      const b = a.clone(); b.position.x = 0.85; b.rotation.y = -0.5;
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.32, 0.55), stone);
      lintel.position.set(0, 2.0, 1.9); lintel.rotation.y = 0;
      portal.add(a, b, lintel);
      g.add(portal);

      this.group.add(g);
      return { group: g, beacon, ring, pos, lit: 0 };
    });
  }

  // ── fireflies: instanced drifting lights ───────────────────────────────────
  _fireflies() {
    const N = device.particles;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const seedArr = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // clustered around the path corridor
      const t = Math.random();
      const base = this.curve.getPoint(t);
      pos[i * 3] = base.x + (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = 0.4 + Math.random() * 5.5;
      pos[i * 3 + 2] = base.z + (Math.random() - 0.5) * 16;
      seedArr[i] = Math.random() * Math.PI * 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xe8b99c, size: 0.09, transparent: true, opacity: 0.5,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    this.fireflies = new THREE.Points(geo, mat);
    this.fireflies.frustumCulled = false;
    this._ffSeed = seedArr;
    this.group.add(this.fireflies);
  }

  // ── drifting fog planes (clouds) ───────────────────────────────────────────
  _clouds() {
    const N = device.mobile ? 7 : 13;
    const mat = new THREE.MeshBasicMaterial({
      color: 0x241016, transparent: true, opacity: 0.32, depthWrite: false,
    });
    this.clouds = [];
    for (let i = 0; i < N; i++) {
      const w = 10 + Math.random() * 22;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.32), mat.clone());
      const t = Math.random();
      const base = this.curve.getPoint(t);
      mesh.position.set(base.x + (Math.random() - 0.5) * 30, 6.5 + Math.random() * 5, base.z + (Math.random() - 0.5) * 30);
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.x = -Math.PI / 2.6; // tilt toward camera
      mesh.userData.drift = 0.2 + Math.random() * 0.5;
      this.group.add(mesh);
      this.clouds.push(mesh);
    }
  }

  // ── per-frame update ───────────────────────────────────────────────────────
  // ── monuments (phase 2): the result lives in the world, not in flat cards ──
  // Three monuments rise on the finale island — score obelisk, tag arch,
  // story stele — plus fogged far landmarks: arena, flex board, fog gate.
  _monuments() {
    const F = this.finalePos;
    this.monuments = [];

    const stone = () => landMaterial(0x5a2431);
    const glowMat = (color, intensity = 0.08) =>
      new THREE.MeshLambertMaterial({ color: 0x3a1620, emissive: color, emissiveIntensity: intensity });

    // small island pads for landmarks that sit beyond the terrain
    const pad = (x, z, r) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.18, 0.55, 9), landMaterial(0x3a1620));
      m.position.set(x, -0.22, z);
      this.group.add(m);
    };

    // 1) SCORE OBELISK — tall tapered spire, the number made physical
    {
      const g = new THREE.Group();
      g.position.set(F.x + 3.2, F.y, F.z - 4.5);
      const mat = glowMat(BRAND.peach);
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.85, 6.4, 5), mat);
      spire.position.y = 3.2;
      const capMat = glowMat(BRAND.blush, 0.35);
      const cap = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), capMat);
      cap.position.y = 6.9;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.6, 0.5, 6), stone());
      base.position.y = 0.25;
      g.add(spire, cap, base);
      this.group.add(g);
      this.monuments.push({ id: 'score', mats: [mat, capMat], glow: 0 });
    }

    // 2) TAG ARCH — the identity portal
    {
      const g = new THREE.Group();
      g.position.set(F.x - 4.2, F.y, F.z - 3.2);
      g.rotation.y = 0.7;
      const mat = glowMat(BRAND.peach);
      const legGeo = new THREE.CylinderGeometry(0.22, 0.3, 3.4, 6);
      const a = new THREE.Mesh(legGeo, mat); a.position.set(-1.5, 1.7, 0);
      const b = new THREE.Mesh(legGeo, mat); b.position.set(1.5, 1.7, 0);
      const lintelMat = glowMat(BRAND.copper, 0.1);
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.42, 0.6), lintelMat);
      lintel.position.y = 3.55;
      const keyMat = glowMat(BRAND.blush, 0.3);
      const keystone = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), keyMat);
      keystone.position.y = 4.05;
      g.add(a, b, lintel, keystone);
      this.group.add(g);
      this.monuments.push({ id: 'tag', mats: [mat, lintelMat, keyMat], glow: 0 });
    }

    // 3) STORY STELE — a 9:16 standing stone holding the share card
    {
      const g = new THREE.Group();
      g.position.set(F.x + 0.4, F.y, F.z + 4.8);
      const mat = glowMat(BRAND.peach);
      const stele = new THREE.Mesh(new THREE.BoxGeometry(1.7, 3.1, 0.28), mat);
      stele.position.set(0, 1.55, 0.06); stele.rotation.y = -0.15;
      const frameMat = glowMat(BRAND.copper, 0.12);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.95, 3.35, 0.16), frameMat);
      frame.position.y = 1.55; frame.rotation.y = -0.15;
      g.add(frame, stele);
      this.group.add(g);
      this.monuments.push({ id: 'story', mats: [mat, frameMat], glow: 0 });
    }

    // ── far landmarks, teased in fog from the finale pull-back (phase 3) ──

    // THE CHALLENGE ARENA — a ring of pillars, locked until streaks exist
    {
      const ax = 64, az = -94;
      pad(ax, az, 7);
      const g = new THREE.Group();
      g.position.set(ax, 0, az);
      const pilMat = glowMat(BRAND.copper, 0.06);
      const pilGeo = new THREE.BoxGeometry(0.7, 3.4, 0.7);
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const p = new THREE.Mesh(pilGeo, pilMat);
        p.position.set(Math.cos(ang) * 5.2, 1.7, Math.sin(ang) * 5.2);
        p.rotation.y = ang;
        g.add(p);
      }
      const ringMat = glowMat(BRAND.peach, 0.1);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.16, 6, 36), ringMat);
      ring.rotation.x = Math.PI / 2; ring.position.y = 3.5;
      g.add(ring);
      this.group.add(g);
      this.arena = { mats: [pilMat, ringMat], glow: 0 };
    }

    // THE FLEX BOARD — a great slab wall across the water
    {
      const bx = 74, bz = -86;
      pad(bx, bz, 6);
      const g = new THREE.Group();
      g.position.set(bx, 0, bz);
      g.rotation.y = -0.6;
      const mat = glowMat(BRAND.peach, 0.07);
      const slab = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.6, 0.4), mat);
      slab.position.y = 2.6;
      const postGeo = new THREE.CylinderGeometry(0.18, 0.24, 2.2, 6);
      const p1 = new THREE.Mesh(postGeo, stone()); p1.position.set(-2.4, 1.0, 0);
      const p2 = new THREE.Mesh(postGeo, stone()); p2.position.set(2.4, 1.0, 0);
      g.add(slab, p1, p2);
      this.group.add(g);
      this.board = { mats: [mat], glow: 0 };
    }

    // THE FOG GATE — the arch into whatever comes next
    {
      const nx = 58, nz = -100;
      pad(nx, nz, 5);
      const g = new THREE.Group();
      g.position.set(nx, 0, nz);
      const mat = glowMat(BRAND.blush, 0.1);
      const arch = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.22, 8, 26, Math.PI), mat);
      arch.position.y = 0.4;
      const legGeo = new THREE.CylinderGeometry(0.26, 0.34, 1.4, 6);
      const a = new THREE.Mesh(legGeo, stone()); a.position.set(-2.1, 0.7, 0);
      const b = new THREE.Mesh(legGeo, stone()); b.position.set(2.1, 0.7, 0);
      g.add(arch, a, b);
      this.group.add(g);
      this.gate = { mats: [mat], glow: 0 };
    }

    // world-space centers for the camera's gaze pans (world.js)
    this.landmarks = {
      arena: new THREE.Vector3(64, 1.7, -94),
      board: new THREE.Vector3(74, 2.3, -86),
      gate: new THREE.Vector3(58, 1.5, -100),
    };
  }

  update(dt, time) {
    const j = journey;
    const t = j.travel();

    // markers walk the path; "them" lags until joined
    const youT = clamp(t, 0, 0.985);
    const themT = clamp(j.joined ? t : t * 0.55 - 0.06, 0, 0.985);
    const pYou = this.curve.getPoint(youT);
    const pThem = this.curve.getPoint(themT);
    this.you.position.copy(pYou).y += 0.55 + wobble(time, 3, 1.3, 0.06);
    this.them.position.copy(pThem).y += 0.55 + wobble(time, 7, 1.5, 0.06);
    this.youLight.position.copy(this.you.position);
    this.themLight.position.copy(this.them.position);
    this.youLight.intensity = lerp(1.4, 2.6, j.syncLevel());
    this.themLight.intensity = j.joined ? lerp(1.2, 2.4, j.syncLevel()) : 0;
    const haloP = 0.14 + 0.1 * Math.sin(time * 2.1);
    this.you.userData.halo.material.opacity = haloP;
    this.them.userData.halo.material.opacity = j.joined ? haloP : 0.06;

    // path dots: reveal behind the pair, brightness = sync level
    const sync = j.syncLevel();
    const revealHead = Math.max(youT, themT);
    const m = new THREE.Matrix4();
    const dotBase = this.pathDots.material;
    dotBase.opacity = clamp(0.14 + sync * 0.6, 0, 0.85);
    for (let i = 0; i < PATH_POINTS; i++) {
      const dt2 = this._dotT[i];
      const pt = this.curve.getPoint(dt2);
      const behind = dt2 <= revealHead + 0.02;
      if (behind || dt2 < revealHead + 0.09) {
        const lit = behind ? 1 : 0.35;
        const s = 0.75 + lit * 0.5 + Math.sin(time * 2 + dt2 * 40) * 0.12;
        m.makeScale(s, s, s);
        m.setPosition(pt.x, pt.y + 0.12, pt.z);
      } else {
        m.setPosition(0, -50, 0); // hidden ahead
      }
      this.pathDots.setMatrixAt(i, m);
    }
    this.pathDots.instanceMatrix.needsUpdate = true;

    // checkpoints: beacon/ring respond only to REAL completion
    this.checkpoints.forEach((c, i) => {
      c.lit = clamp(c.lit + ((j.done[i] ? 1 : 0) - c.lit) * Math.min(1, dt * 2.2), 0, 1);
      c.beacon.intensity = c.lit * (2.6 + Math.sin(time * 2.2 + i) * 0.5);
      c.ring.material.opacity = 0.12 + c.lit * 0.5;
      c.ring.rotation.z = time * (0.1 + c.lit * 0.25);
      if (c.group.userData.flame) {
        c.group.userData.flame.scale.y = 0.9 + c.lit * 0.35 + Math.sin(time * 7 + i) * 0.06;
      }
    });

    // water: gentle two-axis sine displacement
    const wpos = this.water.geometry.attributes.position;
    const base = this._waterBase;
    for (let i = 0; i < wpos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      wpos.setY(i, Math.sin(x * 0.32 + time * 1.1) * 0.1 + Math.cos(z * 0.27 + time * 0.9) * 0.1);
    }
    wpos.needsUpdate = true;

    // fireflies drift
    const fpos = this.fireflies.geometry.attributes.position;
    for (let i = 0; i < fpos.count; i++) {
      const s = this._ffSeed[i];
      fpos.setY(i, fpos.getY(i) + Math.sin(time * 0.7 + s) * 0.0035);
      fpos.setX(i, fpos.getX(i) + Math.cos(time * 0.4 + s) * 0.002);
    }
    fpos.needsUpdate = true;

    // clouds drift
    for (const cl of this.clouds) {
      cl.position.x += cl.userData.drift * dt;
      if (cl.position.x > 70) cl.position.x = -70;
    }

    // ── monuments & far landmarks: glow tracks the chapter they belong to ──
    const p = j.p;
    // rise with the finale, stay lit through the DOM acts
    const finaleGlow = smoothstep(0.9, 0.985, p);
    this.monuments.forEach((mon, i) => {
      mon.glow = damp(mon.glow, finaleGlow, 2.2, dt);
      const breathe = 0.78 + 0.22 * Math.sin(time * 1.25 + i * 2.1);
      mon.mats.forEach((m, k) => {
        m.emissiveIntensity = 0.08 + mon.glow * (k === 0 ? 0.6 : 0.42) * breathe;
      });
    });
    // teaser landmarks: lit only while their chapter is on screen (fog does the rest)
    const band = (a, b, oa, ob) => smoothstep(a, b, p) * (1 - smoothstep(oa, ob, p));
    const teaser = (obj, a, b, oa, ob, base, amp) => {
      obj.glow = damp(obj.glow, band(a, b, oa, ob) + smoothstep(0.985, 1, p) * 0.55, 2.4, dt);
      obj.mats.forEach(m => { m.emissiveIntensity = base + obj.glow * amp; });
    };
    teaser(this.arena, 0.775, 0.81, 0.84, 0.88, 0.06, 0.75);
    teaser(this.board, 0.825, 0.852, 0.872, 0.915, 0.06, 0.75);
    teaser(this.gate, 0.87, 0.905, 0.935, 0.97, 0.08, 0.85);
  }
}

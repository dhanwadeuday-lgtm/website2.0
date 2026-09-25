// Procedural plant: soil patch, seed, stem, leaves, water droplet, and the rose.
// Goal: organic, softly stylized-editorial — not low-poly, not cartoonish.
import * as THREE from 'three';
import { lerp, smoothstep, clamp, wobble } from './util.js';

// ── soil ─────────────────────────────────────────────────────────────────────
export function makeSoil() {
  const group = new THREE.Group();

  // soft mound
  const moundGeo = new THREE.SphereGeometry(2.1, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
  const mound = new THREE.Mesh(
    moundGeo,
    new THREE.MeshStandardMaterial({ color: 0x2b1a1c, roughness: 0.95, metalness: 0.02 }),
  );
  mound.scale.set(1, 0.32, 1);
  mound.position.y = -0.55;
  mound.receiveShadow = true;
  group.add(mound);

  // darker under-disc (ground shadow anchor)
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(4.6, 40),
    new THREE.MeshStandardMaterial({ color: 0x1a0d10, roughness: 1, metalness: 0 }),
  );
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = -0.56;
  group.add(disc);

  // scattered pebbles for texture
  const pebbleMat = new THREE.MeshStandardMaterial({ color: 0x3d2726, roughness: 0.9 });
  for (let i = 0; i < 26; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.03 + Math.random() * 0.05, 6, 5), pebbleMat);
    const a = Math.random() * Math.PI * 2;
    const r = 0.5 + Math.random() * 1.35;
    p.position.set(Math.cos(a) * r, -0.5 + Math.random() * 0.05, Math.sin(a) * r * 0.6);
    p.scale.y = 0.55;
    p.castShadow = false;
    group.add(p);
  }

  const wetMat = mound.material;
  return {
    group,
    // setWet: soil darkens + slight sheen when watered
    setWet(w, time) {
      wetMat.color.setRGB(0.17 + w * 0.07, 0.1 + w * 0.05, 0.11 + w * 0.05);
      wetMat.roughness = lerp(0.95, 0.55, w);
    },
  };
}

// ── seed ─────────────────────────────────────────────────────────────────────
export function makeSeed() {
  const geo = new THREE.SphereGeometry(0.075, 24, 18);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x6b4a33, roughness: 0.5, metalness: 0.05,
    emissive: 0x2a1608, emissiveIntensity: 0.5, transparent: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return { mesh, mat };
}

// ── stem ─────────────────────────────────────────────────────────────────────
export function makeStem() {
  const SEG = 64;
  const mat = new THREE.MeshStandardMaterial({
    color: 0x4c7a45, roughness: 0.62, metalness: 0.02, side: THREE.DoubleSide,
  });
  const geo = new THREE.CylinderGeometry(0.028, 0.05, 1, 7, SEG, true);
  geo.translate(0, 0.5, 0); // grow from base
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.scale.y = 0.001;

  return {
    mesh,
    setGrowth(g, time) {
      const h = clamp(g, 0, 1);
      mesh.scale.y = Math.max(0.001, h);
      // subtle organic lean near the top
      mesh.rotation.z = Math.sin(time * 0.6) * 0.008 * h;
    },
  };
}

// ── leaf ─────────────────────────────────────────────────────────────────────
const leafGeoCache = new Map();
function leafGeo(len, wid) {
  const key = `${len}:${wid}`;
  if (leafGeoCache.has(key)) return leafGeoCache.get(key);
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(len * 0.25, wid * 0.9, len * 0.75, wid * 0.75, len, 0);
  shape.bezierCurveTo(len * 0.75, -wid * 0.6, len * 0.25, -wid * 0.85, 0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.01, bevelSegments: 2, curveSegments: 12 });
  geo.translate(-len * 0.5, 0, -0.006);
  leafGeoCache.set(key, geo);
  return geo;
}

export function makeLeaf(i) {
  const mat = new THREE.MeshStandardMaterial({
    color: i % 2 ? 0x47713f : 0x527f49, roughness: 0.58, metalness: 0.02, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(leafGeo(0.62, 0.2), mat);
  mesh.castShadow = true;
  const side = i % 2 === 0 ? 1 : -1;
  const height = 0.35 + (i >> 1) * 0.9; // pairs at heights
  mesh.visible = false;

  return {
    mesh,
    update(g, time, H) {
      // each leaf unfolds once growth passes its height
      const leafH = height * 4.5; // in growth units
      const local = smoothstep(leafH * 0.72, leafH, g);
      mesh.visible = local > 0.01;
      const t = clamp(local, 0, 1);
      mesh.scale.setScalar(clamp(0.12 + t * 0.88, 0.01, 1.05));
      const y = clamp(0.18 + (height / 4.5) * H, 0.18, H - 0.05);
      mesh.position.set(side * 0.05, y, 0);
      mesh.rotation.y = side * (0.5 + t * 0.5) + wobble(time, i, 0.8, 0.03);
      mesh.rotation.z = side * (0.45 - t * 0.25) + wobble(time, i + 5, 1.1, 0.02);
      mesh.rotation.x = 0.15 + wobble(time, i + 9, 0.9, 0.02);
    },
  };
}

// ── water droplet ────────────────────────────────────────────────────────────
export function makeDroplet() {
  const geo = new THREE.SphereGeometry(0.09, 20, 16);
  geo.scale(1, 1.35, 1);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xbfe0e8, roughness: 0.05, metalness: 0,
    transmission: 0.92, thickness: 0.5, ior: 1.33,
    transparent: true, opacity: 1, emissive: 0x224444, emissiveIntensity: 0.25,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.visible = false;
  return { mesh, mat };
}

// ── rose ─────────────────────────────────────────────────────────────────────
// Layered petals on a small calyx. setOpen(0..1) unfolds petals with stagger.
export function makeRose(flower, index) {
  const group = new THREE.Group();
  const petalMat = new THREE.MeshPhysicalMaterial({
    color: flower.color,
    roughness: 0.42, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.5,
    sheen: 0.6, sheenColor: new THREE.Color(flower.accent),
    transmission: 0.12, thickness: 0.35, ior: 1.35,
    side: THREE.DoubleSide,
  });

  // calyx
  const calyx = new THREE.Mesh(
    new THREE.SphereGeometry(0.085, 14, 10),
    new THREE.MeshStandardMaterial({ color: 0x3f6b3a, roughness: 0.7 }),
  );
  calyx.scale.set(1, 0.8, 1);
  group.add(calyx);

  const petals = [];
  const LAYERS = [
    { n: 6, r: 0.2, tilt: 1.05, size: 1.5 },
    { n: 5, r: 0.14, tilt: 0.72, size: 1.2 },
    { n: 4, r: 0.09, tilt: 0.42, size: 0.95 },
    { n: 3, r: 0.05, tilt: 0.2, size: 0.72 },
  ];
  let pid = 0;
  for (const L of LAYERS) {
    for (let k = 0; k < L.n; k++) {
      const shape = new THREE.Shape();
      const w = 0.13 * L.size, h = 0.2 * L.size;
      shape.moveTo(0, 0);
      shape.bezierCurveTo(w * 0.7, h * 0.25, w * 0.9, h * 0.85, 0, h);
      shape.bezierCurveTo(-w * 0.9, h * 0.85, -w * 0.7, h * 0.25, 0, 0);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.014, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.012, bevelSegments: 2, curveSegments: 10,
      });
      const m = new THREE.Mesh(geo, petalMat);
      const ang = (k / L.n) * Math.PI * 2 + pid * 0.35;
      const pivot = new THREE.Group();
      pivot.rotation.y = ang;
      m.position.x = L.r * 0.4;
      m.rotation.x = -L.tilt; // closed = vertical fold; open = splay outward
      m.castShadow = true;
      pivot.add(m);
      group.add(pivot);
      petals.push({ pivot, m, baseTilt: L.tilt, order: pid / 18 });
      pid++;
    }
  }

  // tiny emissive heart that glows on full bloom
  const heart = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 12, 10),
    new THREE.MeshStandardMaterial({
      color: flower.color, emissive: flower.color, emissiveIntensity: 0, roughness: 0.4,
    }),
  );
  heart.position.y = 0.05;
  group.add(heart);

  group.visible = false;

  function setOpen(t, time) {
    const open = clamp(t, 0, 1);
    for (const p of petals) {
      const o = clamp((open - p.order * 0.45) / 0.55, 0, 1); // stagger by layer
      const eased = o * o * (3 - 2 * o);
      p.m.rotation.x = -lerp(0.06, p.baseTilt, eased);
      p.m.rotation.y = Math.sin(time * 0.6 + p.order * 9) * 0.02;
      const s = lerp(0.75, 1, eased);
      p.m.scale.set(s, s, 1);
    }
    heart.material.emissiveIntensity = open * 1.4 + Math.sin(time * 2) * 0.1 * open;
    heart.scale.setScalar(1 + open * 0.25 + Math.sin(time * 1.4) * 0.04 * open);
  }

  return { group, setOpen };
}

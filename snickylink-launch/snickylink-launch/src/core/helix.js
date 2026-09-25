// Helix — the motion language of the site. Two glowing paths (YOU / YOUR PERSON)
// spiral around the central axis. They inspire camera and content placement; they
// never overpower the plant. They separate at first, synchronize after the
// partner joins, and complete a calm orbit at the finale.
//
// Implementation note: path B "re-phasing" is done by rotating the tube around Y
// — shifting every azimuth by a constant is exactly a Y rotation, so no vertex
// rewrites are needed. GPU-friendly.
import * as THREE from 'three';
import { lerp, smoothstep, clamp } from './util.js';
import { BRAND, FLOWERS } from './tokens.js';

const TURNS = 1.85;
const RADIUS = 2.35;
const TOP = 6.2;
const CH_START = [0.56, 0.68, 0.78, 0.87];

function pathPoint(n, t, spread, out) {
  // n: 0 = you, 1 = your person. spread: 1 = opposite sides, ~0 = together.
  const base = n * Math.PI * spread;
  const phase = base + t * TURNS * Math.PI * 2;
  const r = RADIUS * (1 - 0.25 * t);
  out.set(Math.cos(phase) * r, 0.25 + t * TOP, Math.sin(phase) * r * 0.72);
  return out;
}

export function makeHelix(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const ptsA = [];
  const ptsB = [];
  const N = 160;
  const v = new THREE.Vector3();
  for (let i = 0; i <= N; i++) {
    ptsA.push(pathPoint(0, i / N, 1, new THREE.Vector3()).clone());
    ptsB.push(pathPoint(1, i / N, 1, new THREE.Vector3()).clone());
  }

  const curveA = new THREE.CatmullRomCurve3(ptsA);
  const curveB = new THREE.CatmullRomCurve3(ptsB);

  const matA = new THREE.MeshBasicMaterial({
    color: BRAND.peach, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const matB = new THREE.MeshBasicMaterial({
    color: 0xffd9e0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  });

  const tubeA = new THREE.Mesh(new THREE.TubeGeometry(curveA, 150, 0.012, 5, false), matA);
  const tubeB = new THREE.Mesh(new THREE.TubeGeometry(curveB, 150, 0.012, 5, false), matB);
  group.add(tubeA, tubeB);

  // partner orbs
  const orbGeo = new THREE.SphereGeometry(0.09, 16, 12);
  const orbA = new THREE.Mesh(orbGeo, new THREE.MeshBasicMaterial({ color: 0xffe9d2, transparent: true, opacity: 0 }));
  const orbB = new THREE.Mesh(orbGeo, new THREE.MeshBasicMaterial({ color: 0xffd3dd, transparent: true, opacity: 0 }));
  const haloGeo = new THREE.SphereGeometry(0.17, 16, 12);
  const haloA = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ color: 0xffe9d2, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  const haloB = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ color: 0xffd3dd, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  group.add(orbA, orbB, haloA, haloB);

  // connection thread between the two of you
  const threadGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const threadMat = new THREE.LineBasicMaterial({ color: 0xffdcc0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const thread = new THREE.Line(threadGeo, threadMat);
  group.add(thread);

  // glowing snick markers along the helix
  const snickGeo = new THREE.OctahedronGeometry(0.06, 0);
  const snicks = [];
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(snickGeo, new THREE.MeshBasicMaterial({
      color: BRAND.peach, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    m.userData.t = 0.3 + i * 0.16;
    group.add(m);
    snicks.push(m);
  }

  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  const vTmp = new THREE.Vector3();

  const dampTo = (cur, target, dt, lambda) => lerp(cur, target, 1 - Math.exp(-lambda * dt));

  function update(time, dt, j) {
    const reveal = j.helixReveal();
    const sync = j.helixSync();
    const spread = lerp(1, 0.1, sync);

    // re-phase path B by rotating it around Y (equivalent to azimuth shift)
    tubeB.rotation.y = -Math.PI * (1 - spread);

    matA.opacity = reveal * 0.5;
    matB.opacity = reveal * (0.16 + sync * 0.36);

    // orbs ride their paths at the story's current height
    const tRide = clamp(j.p, 0, 1);
    curveA.getPoint(tRide, vA);
    orbA.position.copy(vA);
    orbA.material.opacity = dampTo(orbA.material.opacity, reveal * 0.95, dt, 2.5);
    haloA.material.opacity = dampTo(haloA.material.opacity, reveal * 0.16 + Math.sin(time * 2) * 0.03, dt, 2.5);
    haloA.position.copy(vA);

    if (j.joined) {
      pathPoint(1, tRide, spread, vB);
    } else {
      pathPoint(1, clamp(tRide - 0.3, 0, 1), spread, vB);
    }
    orbB.position.copy(vB);
    haloB.position.copy(vB);
    orbB.material.opacity = dampTo(orbB.material.opacity, j.joined ? reveal : reveal * 0.26, dt, 2.2);
    haloB.material.opacity = dampTo(haloB.material.opacity, j.joined ? reveal * 0.16 : 0, dt, 2.2);

    threadGeo.setFromPoints([vA, vB]);
    threadMat.opacity = j.joined ? reveal * (0.3 + Math.sin(time * 2.2) * 0.08) : reveal * 0.08;

    // snick markers glow in as their chapters approach; take flower color when done
    for (let i = 0; i < snicks.length; i++) {
      const m = snicks[i];
      pathPoint(0, m.userData.t, 1, vTmp);
      m.position.copy(vTmp);
      m.rotation.y = time * (0.5 + i * 0.1);
      const approach = smoothstep(CH_START[i] - 0.06, CH_START[i] + 0.03, j.p);
      m.material.opacity = approach * (j.done[i] ? 0.95 : 0.32);
      m.material.color.set(j.done[i] ? FLOWERS[i].color : BRAND.peach);
      m.scale.setScalar(j.done[i] ? 1.5 + Math.sin(time * 3 + i) * 0.15 : 1);
    }
  }

  return { update };
}

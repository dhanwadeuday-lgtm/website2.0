import * as THREE from 'three';
import { damp, lerp, smoothstep, clamp, wobble, device } from './util.js';
import { journey } from './journey.js';
import { BRAND, FLOWERS } from './tokens.js';
import { makeRose, makeStem, makeLeaf, makeSoil, makeSeed, makeDroplet } from './plant.js';
import { makeHelix } from './helix.js';

// World — the living scene. One canvas, one camera, everything driven by
// `journey` state each frame. Cinematic but GPU-friendly.

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: !device.mobile, alpha: false, powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, device.dprCap));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !device.mobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(BRAND.deepWine, 0.03);
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 120);

    // lights
    const key = new THREE.DirectionalLight(0xffe6cf, 2.6);
    key.position.set(4, 8, 5);
    key.castShadow = !device.mobile;
    if (key.castShadow) {
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -6; key.shadow.camera.right = 6;
      key.shadow.camera.top = 9; key.shadow.camera.bottom = -2;
      key.shadow.camera.far = 30; key.shadow.bias = -0.0006; key.shadow.radius = 5;
    }
    this.keyLight = key;
    this.rimLight = new THREE.DirectionalLight(0xe8b99c, 1.15);
    this.rimLight.position.set(-6, 3, -4);
    this.fillLight = new THREE.HemisphereLight(0x2a1219, 0x0a0507, 0.9);
    this.coreGlow = new THREE.PointLight(0xffd9b0, 0, 16, 2);
    this.coreGlow.position.set(0, 1.6, 0);
    this.scene.add(key, this.rimLight, this.fillLight, this.coreGlow);

    // ground, plant, water
    this.soil = makeSoil();
    this.scene.add(this.soil.group);

    this.plant = new THREE.Group();
    this.scene.add(this.plant);

    this.seed = makeSeed();
    this.plant.add(this.seed.mesh);

    this.stem = makeStem();
    this.plant.add(this.stem.mesh);

    this.leaves = [];
    for (let i = 0; i < 6; i++) {
      const leaf = makeLeaf(i);
      this.leaves.push(leaf);
      this.plant.add(leaf.mesh);
    }

    this.roses = FLOWERS.map((f, i) => {
      const r = makeRose(f, i);
      this.plant.add(r.group);
      return r;
    });

    this.droplet = makeDroplet();
    this.scene.add(this.droplet.mesh);

    this.helix = makeHelix(this.scene);
    this._makeParticles();

    // camera state
    this.camAngle = 0;
    this.camPos = new THREE.Vector3(0, 2.1, 8.5);
    this.camLook = new THREE.Vector3(0, 1.2, 0);
    this.camTarget = new THREE.Vector3(0, 1.2, 0);
    this._cTmp = new THREE.Color();

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _makeParticles() {
    const N = device.particles;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const spd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = 3 + Math.random() * 9;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.random() * 10 - 1;
      pos[i * 3 + 2] = Math.sin(a) * r * 0.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xe8b99c, size: 0.04, transparent: true, opacity: 0.32,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    this._particleSpeeds = spd;
    this.scene.add(pts);
    this.particles = pts;
  }

  update(dt, time) {
    const j = journey;
    j.p = damp(j.p, j.raw, 5.2, dt);
    j.vel = j.raw - j.p;

    // blooms — gated by REAL snick completion only
    for (let i = 0; i < 4; i++) {
      j.bloom[i] = damp(j.bloom[i], j.done[i] ? 1 : 0, 1.5, dt);
      this.roses[i].setOpen(j.bloom[i], time);
    }

    this._updatePlant(j.growth(), time);
    this._updateSoilSeedWater(time, dt);
    this.helix.update(time, dt, j);
    this._updateParticles(dt, time);
    this._updateCamera(dt, time);
    this._updateMood();
  }

  _updatePlant(g, time) {
    const growH = 0.15 + g * 4.35;
    this.stem.setGrowth(g, time);

    // seed dissolves into the soil once the stem takes over
    const seedFade = 1 - smoothstep(0.05, 0.14, g);
    this.seed.mesh.visible = seedFade > 0.02;
    this.seed.mat.opacity = seedFade;
    this.seed.mesh.position.y = 0.16;

    this.plant.rotation.z = wobble(time, 0.4, 0.7, 0.012) * (0.4 + g);
    this.plant.rotation.x = wobble(time, 1.1, 0.5, 0.008) * (0.4 + g);

    // four roses at height fractions of the stem
    const fracs = [0.4, 0.56, 0.73, 0.96];
    for (let i = 0; i < 4; i++) {
      const R = this.roses[i];
      const born = smoothstep(0.4, 0.52, g + i * 0.14);
      R.group.visible = born > 0.01;
      R.group.scale.setScalar(clamp(born, 0.001, 1) * (1 + i * 0.08));
      R.group.position.set(
        (i % 2 === 0 ? 0.05 : -0.06) + wobble(time, i, 0.9, 0.012),
        lerp(0.35, growH, fracs[i]),
        (i % 2 ? -0.1 : 0.08),
      );
      R.group.rotation.y = i * 1.9 + time * 0.02 * (i % 2 ? -1 : 1);
      R.group.rotation.z = wobble(time, i + 2, 1.1, 0.02);
    }

    for (const leaf of this.leaves) leaf.update(g, time, growH);
  }

  _updateSoilSeedWater(time, dt) {
    const j = journey;
    const D = this.droplet;
    // two watering moments: during 'water' and 'water2' chapters
    let t = -1;
    if (j.inside('water')) t = j.chapterProgress('water');
    else if (j.inside('water2')) t = j.chapterProgress('water2');
    else if (j.inside('snick2')) t = j.chapterProgress('snick2') * 0.8;

    if (t >= 0 && t < 0.62) {
      // fall from above into the soil
      const f = smoothstep(0.08, 0.55, t);
      D.mesh.visible = true;
      D.mesh.position.set(0.32, 5.6 - f * 5.35, 0.15);
      D.mat.opacity = 1 - smoothstep(0.5, 0.62, t);
      D.mesh.scale.setScalar(1 - smoothstep(0.5, 0.62, t) * 0.6);
    } else {
      D.mesh.visible = false;
    }

    // soil drinks: subtle darken/shine response near watering moments
    const drink = (j.inside('water') ? smoothstep(0.4, 0.9, j.chapterProgress('water')) : 0)
      + (j.inside('water2') ? smoothstep(0.4, 0.9, j.chapterProgress('water2')) : 0);
    this.soil.setWet(clamp(drink, 0, 1), time);
  }

  _updateParticles(dt, time) {
    const arr = this.particles.geometry.attributes.position.array;
    const n = arr.length / 3;
    for (let i = 0; i < n; i++) {
      arr[i * 3 + 1] += (0.1 + this._particleSpeeds[i] * 0.08) * dt;
      arr[i * 3] += Math.sin(time * 0.4 + i) * 0.02 * dt;
      if (arr[i * 3 + 1] > 9.5) arr[i * 3 + 1] = -1.2;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  _updateCamera(dt, time) {
    const j = journey;
    const amp = device.cameraAmplitude;
    const targetAngle = (j.cameraAngle() * Math.PI / 180) * amp;
    this.camAngle = damp(this.camAngle, targetAngle, 3.2, dt);

    const g = j.growth();
    const focusY = 0.55 + g * 3.55;
    let dist = 8.8 - smoothstep(0, 0.5, j.p) * 2.7 + smoothstep(0.85, 1, j.p) * 1.4;
    if (j.inside('seed')) dist = 7.6; // intimate opening
    const camR = Math.max(4.9, dist) * (device.mobile ? 1.12 : 1);

    // hero moment: extra slow cinematic orbit on top of scroll angle
    if (j.inside('hero')) {
      this.camAngle += dt * 0.14 * j.chapterProgress('hero');
    }

    const bob = Math.sin(time * 0.35) * 0.07;
    this.camPos.set(
      Math.sin(this.camAngle) * camR,
      0.9 + focusY * 0.62 + bob,
      Math.cos(this.camAngle) * camR,
    );
    this.camTarget.set(0, focusY * 0.85 + 0.3, 0);

    this.camera.position.lerp(this.camPos, 1 - Math.exp(-3.4 * dt));
    this.camLook.lerp(this.camTarget, 1 - Math.exp(-3.4 * dt));
    this.camera.lookAt(this.camLook);
    this.coreGlow.position.set(0, focusY, 0);
  }

  _updateMood() {
    const j = journey;
    const p = j.p;
    // ink → deep wine → blush as the story warms up
    const warmth = smoothstep(0.34, 0.56, p) * 0.55 + smoothstep(0.93, 1.0, p) * 0.45;
    const col = this._cTmp.set(BRAND.ink).lerp(new THREE.Color(BRAND.deepWine), clamp(warmth, 0, 1));
    col.lerp(new THREE.Color(BRAND.blush), smoothstep(0.965, 1.0, p) * 0.9);
    this.scene.background = col;
    this.scene.fog.color.copy(col);
    this.scene.fog.density = lerp(0.03, 0.011, warmth);

    this.keyLight.intensity = lerp(2.5, 3.5, warmth);
    this.rimLight.intensity = lerp(1.0, 1.7, warmth);
    this.fillLight.intensity = lerp(0.85, 1.25, warmth);
    this.coreGlow.intensity = smoothstep(0.9, 1.0, p) * 4 + j.bloom[3] * 2;
  }
}

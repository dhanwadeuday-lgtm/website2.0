import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { IGNITION, ignitionElapsed, worldState } from "@/lib/journey";

export const PLAYER_EMBER = new THREE.Vector3(-0.28, 1.05, 0);
export const PARTNER_START = new THREE.Vector3(5.8, 2.4, -3.2);
const PARTNER_END = new THREE.Vector3(0.28, 1.05, 0);

/** Smoothed pointer (-1..1), eased toward the real pointer each frame. */
export const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

export function usePointerTracking() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const tilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      pointer.tx = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      pointer.ty = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("deviceorientation", tilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("deviceorientation", tilt);
    };
  }, []);
}

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

// Cheap smooth value noise for calm drift.
const n1 = (t: number, s: number) => Math.sin(t * 0.37 + s) * 0.6 + Math.sin(t * 0.71 + s * 2.1) * 0.4;

/** Heartbeat flicker: two quick dips, then ~1.7s of waiting. Returns 0..1 brightness. */
function heartbeat(t: number) {
  const cycle = 2.3;
  const x = t % cycle;
  const dip = (c: number) => {
    const d = Math.abs(x - c);
    return d < 0.1 ? 1 - d / 0.1 : 0;
  };
  return 1 - Math.max(dip(0.1), dip(0.42)) * 0.85;
}

export function PlayerEmber({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef<THREE.Sprite>(null);
  const light = useRef<THREE.PointLight>(null);
  const tex = useGlowTexture();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const amp = still ? 0.06 : 0.15;
    const breath = 0.85 + Math.sin((t / 2.75) * Math.PI * 2) * amp; // ~0.7–1.0
    const drift = still ? 0 : 1;
    group.current?.position.set(
      PLAYER_EMBER.x + n1(t, 1.3) * 0.08 * drift,
      PLAYER_EMBER.y + n1(t, 4.7) * 0.06 * drift,
      PLAYER_EMBER.z + n1(t, 8.1) * 0.05 * drift,
    );
    if (core.current) core.current.opacity = breath;
    if (glow.current) glow.current.scale.setScalar(1.1 * breath);
    if (light.current) light.current.intensity = 3.5 * breath;
  });

  return (
    <group ref={group} position={PLAYER_EMBER}>
      <mesh>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshBasicMaterial ref={core} color="#F2C9AE" transparent toneMapped={false} />
      </mesh>
      <sprite ref={glow}>
        <spriteMaterial map={tex} color="#E8B99C" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      <pointLight ref={light} color="#E8B99C" distance={5} />
    </group>
  );
}

export function PartnerEmber({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef<THREE.SpriteMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const join = useRef(worldState.partner);
  const tex = useGlowTexture();

  useFrame(({ clock }, raw) => {
    void raw;
    // Only the duo-join event moves this ember: ease-in cubic, "let loose".
    const goal = worldState.visual;
    join.current = !goal ? 0 : still ? 1 : Math.min(1, ignitionElapsed() / IGNITION.approach);
    const k = join.current * join.current * join.current;
    group.current?.position.lerpVectors(PARTNER_START, PARTNER_END, k);
    group.current?.scale.setScalar(THREE.MathUtils.lerp(0.6, 1, k));
    const beat = still || goal ? 1 : heartbeat(clock.elapsedTime);
    const opacity = THREE.MathUtils.lerp(0.26 * beat, 1, k);
    if (core.current) core.current.opacity = opacity;
    if (glow.current) glow.current.opacity = opacity * 0.9;
    if (light.current) light.current.intensity = THREE.MathUtils.lerp(0.6 * beat, 3, k);
  });

  return (
    <group ref={group} position={PARTNER_START}>
      <mesh>
        <sphereGeometry args={[0.15, 18, 18]} />
        <meshBasicMaterial ref={core} color="#FBF4F1" transparent toneMapped={false} />
      </mesh>
      <sprite scale={1}>
        <spriteMaterial ref={glow} map={tex} color="#E8B99C" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      <pointLight ref={light} color="#FBF4F1" distance={4} />
    </group>
  );
}

const smokeShader = {
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    varying vec2 vUv; uniform float uTime; uniform float uOpacity; uniform float uSeed; uniform vec3 uColor;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*n(p); p*=2.03; a*=0.5; } return v; }
    void main(){
      vec2 p = vUv*3.0 + vec2(uTime*0.02 + uSeed, uSeed*0.3);
      float s = fbm(p + fbm(p*0.7));
      float edge = smoothstep(0.0,0.35,vUv.x)*smoothstep(1.0,0.65,vUv.x)*smoothstep(0.0,0.35,vUv.y)*smoothstep(1.0,0.65,vUv.y);
      gl_FragColor = vec4(uColor, s*s*edge*uOpacity);
    }`,
};

/**
 * Three parallax depth layers, parented to the camera so they read as the
 * void around the viewer. Fades back once the world is born.
 */
export function DepthLayers({ still, lite }: { still: boolean; lite: boolean }) {
  const root = useRef<THREE.Group>(null);
  const mid = useRef<THREE.Group>(null);
  const fore = useRef<THREE.Group>(null);
  const tex = useGlowTexture();
  const starCount = lite ? 110 : 260;
  const foreCount = lite ? 18 : 34;

  const stars = useMemo(() => {
    const a = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      a[i * 3] = (Math.random() - 0.5) * 90;
      a[i * 3 + 1] = (Math.random() - 0.5) * 60;
      a[i * 3 + 2] = -40 - Math.random() * 20;
    }
    return a;
  }, [starCount]);
  const motes = useMemo(() => {
    const a = new Float32Array(foreCount * 3);
    for (let i = 0; i < foreCount; i++) {
      a[i * 3] = (Math.random() - 0.5) * 9;
      a[i * 3 + 1] = (Math.random() - 0.5) * 6;
      a[i * 3 + 2] = -3 - Math.random() * 5;
    }
    return a;
  }, [foreCount]);
  const moteBase = useMemo(() => motes.slice(), [motes]);
  const moteGeo = useRef<THREE.BufferGeometry>(null);
  const planes = useMemo(
    () =>
      [0, 1, 2].map((i) => ({
        pos: [(i - 1) * 9, (i % 2 ? 2 : -2), -15 - i * 5] as [number, number, number],
        speed: 0.12 + i * 0.07,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0.08 },
          uSeed: { value: i * 7.3 },
          uColor: { value: new THREE.Color(i === 1 ? "#6B2B3C" : "#8a4a52") },
        },
      })),
    [],
  );
  const starMat = useRef<THREE.PointsMaterial>(null);
  const moteMat = useRef<THREE.PointsMaterial>(null);

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    const ease = still ? 1 : 0.04;
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    const px = still ? 0 : pointer.x;
    const py = still ? 0 : pointer.y;
    if (root.current) {
      root.current.position.copy(camera.position);
      root.current.quaternion.copy(camera.quaternion);
    }
    const fade = 1 - worldState.visual * 0.65;
    if (mid.current) mid.current.position.set(-px * 1.2, py * 0.8, 0);
    if (fore.current) fore.current.position.set(-px * 1.1, py * 0.7, 0);
    planes.forEach((pl, i) => {
      pl.uniforms.uTime.value = still ? 0 : t * pl.speed * 10;
      pl.uniforms.uOpacity.value = 0.09 * fade;
      const m = mid.current?.children[i];
      if (m && !still) m.position.x = pl.pos[0] + Math.sin(t * 0.03 * (i + 1)) * 3;
    });
    if (starMat.current) starMat.current.opacity = 0.14 * (1 - worldState.visual * 0.3);
    if (moteMat.current) moteMat.current.opacity = 0.75 * fade;
    const geo = moteGeo.current;
    if (geo && !still) {
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < foreCount; i++) {
        arr[i * 3] = (moteBase[i * 3] ?? 0) + n1(t * 0.6, i * 3.1) * 0.5;
        arr[i * 3 + 1] = (moteBase[i * 3 + 1] ?? 0) + n1(t * 0.5, i * 5.7) * 0.4;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={root}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial ref={starMat} map={tex} size={0.35} color="#FBF4F1" transparent opacity={0.14} depthWrite={false} fog={false} />
      </points>
      <group ref={mid}>
        {!lite &&
          planes.map((pl, i) => (
            <mesh key={i} position={pl.pos}>
              <planeGeometry args={[26, 16]} />
              <shaderMaterial args={[smokeShader]} uniforms={pl.uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
            </mesh>
          ))}
      </group>
      <group ref={fore}>
        <points>
          <bufferGeometry ref={moteGeo}>
            <bufferAttribute attach="attributes-position" args={[motes, 3]} />
          </bufferGeometry>
          <pointsMaterial ref={moteMat} map={tex} size={0.07} color="#E8B99C" transparent blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
        </points>
      </group>
    </group>
  );
}

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { Html } from "@react-three/drei";
import { IGNITION, ignitionElapsed, scrollState, worldState } from "@/lib/journey";
import { DepthLayers, PartnerEmber, PlayerEmber } from "./Act1";

const PEACH = "#E8B99C";
const COPPER = "#B8654A";
const BLUSH = "#FBF4F1";
const WINE = "#6B2B3C";
const INK = "#17090e";

function glowTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,240,230,0.6)");
  grad.addColorStop(1, "rgba(255,200,170,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const easeOut = (x: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(x, 0, 1), 3);

/** Act 2: collision flash + world-birth ring. Later Snick pulses reuse the ring. */
function Ignition({ still }: { still: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.Sprite>(null);
  const flashLight = useRef<THREE.PointLight>(null);
  const thread = useRef<THREE.Mesh>(null);
  const tex = useMemo(glowTex, []);
  const seenPulse = useRef(worldState.pulse);
  const pulse = useRef(1);
  const { camera } = useThree();

  useFrame(({ clock }, raw) => {
    const dt = Math.min(raw, 0.05);
    const R = worldState.radius;
    const e = worldState.visual ? (still ? 99 : ignitionElapsed()) : -1;
    const ringStart = IGNITION.approach + 0.1;
    let ringR = 0;
    let ringO = 0;

    if (e >= 0 && e < IGNITION.total) {
      // Ignition cutscene
      const f = (e - IGNITION.approach) / IGNITION.flash;
      const fl = f >= 0 && f < 1.4 ? (f < 0.3 ? f / 0.3 : Math.max(0, 1 - (f - 0.3) / 1.1)) : 0;
      if (flash.current) {
        flash.current.scale.setScalar(0.5 + Math.min(1, Math.max(0, f)) * 7);
        (flash.current.material as THREE.SpriteMaterial).opacity = fl;
      }
      if (flashLight.current) flashLight.current.intensity = fl * 40;
      // Impact punch (~100ms)
      if (f >= 0 && f < 0.4 && !still) {
        const a = (1 - f / 0.4) * 0.12;
        camera.position.x += (Math.random() - 0.5) * a;
        camera.position.y += (Math.random() - 0.5) * a;
      }
      const rp = (e - ringStart) / IGNITION.ring;
      ringR = easeOut(rp) * R;
      ringO = rp > 0 ? Math.max(0, 1 - Math.max(0, rp - 0.7) / 0.3) * 0.9 : 0;
      worldState.reveal = ringR;
      // Faint thread between embers during approach
      if (thread.current) {
        const a = e < IGNITION.approach ? (e / IGNITION.approach) * 0.35 * (0.7 + Math.random() * 0.3) : 0;
        (thread.current.material as THREE.MeshBasicMaterial).opacity = a;
        const k = Math.pow(Math.min(1, e / IGNITION.approach), 3);
        const x0 = -0.28, y0 = 1.05, z0 = 0;
        const x1 = THREE.MathUtils.lerp(5.8, 0.28, k), y1 = THREE.MathUtils.lerp(2.4, 1.05, k), z1 = THREE.MathUtils.lerp(-3.2, 0, k);
        const len = Math.hypot(x1 - x0, y1 - y0, z1 - z0);
        thread.current.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
        thread.current.scale.set(1, len, 1);
        thread.current.lookAt(x1, y1, z1);
        thread.current.rotateX(Math.PI / 2);
      }
      seenPulse.current = worldState.pulse;
    } else {
      if (thread.current) (thread.current.material as THREE.MeshBasicMaterial).opacity = 0;
      if (flash.current) (flash.current.material as THREE.SpriteMaterial).opacity = 0;
      if (flashLight.current) flashLight.current.intensity = 0;
      worldState.reveal += (R - worldState.reveal) * (1 - Math.exp(-2 * dt));
      // Snick pulses: smaller rings from the origin
      if (worldState.pulse !== seenPulse.current) {
        seenPulse.current = worldState.pulse;
        pulse.current = still ? 1 : 0;
      }
      pulse.current = Math.min(1, pulse.current + dt * 0.55);
      ringR = 0.3 + easeOut(pulse.current) * R;
      ringO = worldState.visual ? (1 - pulse.current) * 0.7 : 0;
    }
    void clock;
    if (ring.current) {
      ring.current.scale.setScalar(Math.max(0.01, ringR));
      (ring.current.material as THREE.MeshBasicMaterial).opacity = ringO;
    }
  });

  return (
    <group>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <ringGeometry args={[0.93, 1, 128]} />
        <meshBasicMaterial color={PEACH} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <sprite ref={flash} position={[0, 1.05, 0]}>
        <spriteMaterial map={tex} color="#FFE9DA" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      <pointLight ref={flashLight} position={[0, 1.2, 0]} color="#FFD9C2" intensity={0} distance={20} />
      <mesh ref={thread}>
        <cylinderGeometry args={[0.008, 0.008, 1, 4, 1, true]} />
        <meshBasicMaterial color={PEACH} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Campfire at the ignition point: layered flicker sprites + warm light. */
function Campfire({ still, lite }: { still: boolean; lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const flames = useRef<THREE.Sprite[]>([]);
  const light = useRef<THREE.PointLight>(null);
  const tex = useMemo(glowTex, []);
  const count = lite ? 1 : 4;
  useFrame(({ clock }) => {
    const on = THREE.MathUtils.smoothstep(worldState.reveal, 0.8, 2.5);
    if (group.current) group.current.visible = on > 0.01;
    const t = clock.elapsedTime;
    const amp = still ? 0.3 : 1;
    flames.current.forEach((s, i) => {
      if (!s) return;
      const f = 1 + (Math.sin(t * (7 + i * 2.3)) * 0.12 + Math.sin(t * (13 + i)) * 0.08) * amp;
      s.scale.set(0.55 * f - i * 0.08, (0.9 + i * 0.12) * f, 1);
      s.position.y = 0.35 + i * 0.12 + (still ? 0 : Math.sin(t * 3 + i) * 0.03);
      (s.material as THREE.SpriteMaterial).opacity = on * (0.85 - i * 0.15) * f;
    });
    if (light.current) light.current.intensity = on * (3 + Math.sin(t * 9) * 0.5 * amp + Math.sin(t * 23) * 0.3 * amp);
  });
  return (
    <group ref={group} visible={false}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`log-${i}`} position={[Math.cos(i * 1.26) * 0.28, 0.06, Math.sin(i * 1.26) * 0.28]} rotation={[0, i * 1.26, Math.PI / 2 - 0.25]}>
          <cylinderGeometry args={[0.04, 0.05, 0.5, 5]} />
          <meshStandardMaterial color="#3a1c18" roughness={1} />
        </mesh>
      ))}
      {Array.from({ length: count }).map((_, i) => (
        <sprite key={i} ref={(el) => { if (el) flames.current[i] = el; }}>
          <spriteMaterial map={tex} color={i % 2 ? "#E8B99C" : "#D9794F"} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </sprite>
      ))}
      <pointLight ref={light} position={[0, 0.6, 0]} color="#F0A77E" intensity={0} distance={9} castShadow={false} />
    </group>
  );
}

/** A few fireflies drifting inside the Glade. */
function Fireflies({ still, lite }: { still: boolean; lite: boolean }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const n = lite ? 2 : 3;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const on = THREE.MathUtils.smoothstep(worldState.reveal, 3, 6);
    refs.current.forEach((m, i) => {
      if (!m) return;
      const r = 2 + i * 1.3;
      const a = (still ? 0 : t * 0.12) + i * 2.1;
      m.position.set(Math.cos(a) * r, 1 + i * 0.3 + (still ? 0 : Math.sin(t * 0.9 + i) * 0.25), Math.sin(a) * r);
      (m.material as THREE.MeshBasicMaterial).opacity = on * (0.6 + Math.sin(t * 2 + i * 1.7) * 0.4);
    });
  });
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#FFE3C9" transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/** Two simple silhouettes near the Glade edge, present from ignition. */
function EdgeTrees() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    group.current?.children.forEach((c) => {
      const d = Math.hypot(c.position.x, c.position.z);
      c.scale.setScalar(Math.max(0.001, THREE.MathUtils.smoothstep(worldState.reveal, d - 1, d + 0.6)));
    });
  });
  return (
    <group ref={group}>
      {([[-5.2, 0, 2.6], [3.6, 0, 5]] as [number, number, number][]).map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.07, 0.11, 1, 5]} /><meshLambertMaterial color="#2c1318" /></mesh>
          <mesh position={[0, 1.5, 0]}><coneGeometry args={[0.6, 1.6, 5]} /><meshLambertMaterial color="#3d1a22" flatShading /></mesh>
          <mesh position={[0, 2.2, 0]}><coneGeometry args={[0.42, 1.1, 5]} /><meshLambertMaterial color="#4a2029" flatShading /></mesh>
        </group>
      ))}
    </group>
  );
}

/** Snick 1 checkpoint: a lantern-post by the fire, lit with its flora on completion. */
function Lantern() {
  const group = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const lit = useRef(0);
  useFrame((_, raw) => {
    lit.current += ((worldState.done[0] ? 1 : 0) - lit.current) * (1 - Math.exp(-2.5 * Math.min(raw, 0.05)));
    if (group.current) group.current.visible = worldState.reveal > 1.6;
    if (lamp.current) lamp.current.color.set("#3a2220").lerp(new THREE.Color("#FFD9B8"), lit.current);
    if (light.current) light.current.intensity = lit.current * 2.5;
  });
  return (
    <group ref={group} position={[-1.6, 0, 0.9]} visible={false}>
      <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.04, 0.06, 1.2, 6]} /><meshLambertMaterial color="#2c1318" /></mesh>
      <mesh position={[0, 1.28, 0]}><octahedronGeometry args={[0.13, 0]} /><meshBasicMaterial ref={lamp} color="#3a2220" toneMapped={false} /></mesh>
      <pointLight ref={light} position={[0, 1.3, 0]} color="#FFC9A0" intensity={0} distance={4} />
    </group>
  );
}

function GladeGround({ lite }: { lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const scale = useRef(0);
  const geometry = useMemo(() => {
    const segments = lite ? 34 : 62;
    const geo = new THREE.CircleGeometry(18.5, segments, 0, Math.PI * 2);
    geo.rotateX(-Math.PI / 2);
    const positions = geo.attributes["position"] as THREE.BufferAttribute;
    const colors: number[] = [];
    const low = new THREE.Color("#32141d");
    const high = new THREE.Color("#70413e");
    const color = new THREE.Color();
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const distance = Math.hypot(x, z);
      const y = Math.sin(x * 0.55) * 0.12 + Math.cos(z * 0.45) * 0.1 - distance * 0.008;
      positions.setY(i, y);
      color.copy(low).lerp(high, THREE.MathUtils.clamp(1 - distance / 20, 0, 1));
      colors.push(color.r, color.g, color.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [lite]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    void dt;
    scale.current = Math.max(0.001, worldState.reveal / 18);
    if (group.current) {
      group.current.visible = worldState.reveal > 0.05;
      group.current.scale.setScalar(scale.current);
    }
  });

  return (
    <group ref={group} scale={0.001}>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[18.5, 16.5, 0.5, lite ? 34 : 62]} />
        <meshStandardMaterial color="#250e15" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

const TREE_POSITIONS: [number, number, number][] = [[-4, 0, -1], [-5.5, 0, -3.5], [-3, 0, -5], [-7, 0, -0.5], [-6, 0, 2.5], [-3.8, 0, 3.8]];

function LightGrove() {
  const group = useRef<THREE.Group>(null);
  const amount = useRef(0);
  useFrame((_, raw) => {
    amount.current += ((worldState.done[0] ? 1 : 0) - amount.current) * (1 - Math.exp(-2.5 * Math.min(raw, 0.05)));
    if (group.current) group.current.scale.setScalar(Math.max(0.001, amount.current));
  });
  return (
    <group ref={group} scale={0.001}>
      {TREE_POSITIONS.map((position, index) => (
        <group key={position.join("-")} position={position} rotation-y={index * 0.7}>
          <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.13, 0.22, 1.6, 6]} /><meshStandardMaterial color="#44221e" /></mesh>
          <mesh position={[0, 2, 0]} castShadow><icosahedronGeometry args={[0.9 + (index % 2) * 0.25, 1]} /><meshStandardMaterial color="#6d4540" emissive={WINE} emissiveIntensity={0.24} flatShading /></mesh>
          <pointLight position={[0, 1.8, 0]} color={PEACH} intensity={1.3} distance={4} />
        </group>
      ))}
    </group>
  );
}

const BRIDGE_LIT = new THREE.Color("#B8654A");

function Bridge() {
  const group = useRef<THREE.Group>(null);
  const amount = useRef(0);
  useFrame((_, raw) => {
    amount.current += ((worldState.done[1] ? 1 : 0) - amount.current) * (1 - Math.exp(-2.5 * Math.min(raw, 0.05)));
    if (!group.current) return;
    const shown = THREE.MathUtils.smoothstep(worldState.reveal, 3.5, 5.5);
    group.current.visible = shown > 0.01;
    group.current.scale.set(1, Math.max(0.001, shown), 1);
    mats.current.forEach((m) => { if (m) { m.emissiveIntensity = amount.current * 0.9; m.color.set("#2a1416").lerp(BRIDGE_LIT, amount.current); } });
  });
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  return (
    <group ref={group} position={[4.8, 0.1, 0.5]} rotation-y={-0.45} scale={[1, 0.001, 1]} visible={false}>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[0, Math.sin((index / 8) * Math.PI) * 0.3, -2 + index * 0.5]} castShadow>
          <boxGeometry args={[1.45, 0.09, 0.38]} /><meshStandardMaterial ref={(el) => { if (el) mats.current[index] = el; }} map={null} color={index % 2 ? "#774538" : COPPER} emissive={COPPER} emissiveIntensity={0} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function LakeVault({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const water = useRef<THREE.Mesh>(null);
  const amount = useRef(0);
  useFrame(({ clock }, raw) => {
    amount.current += ((worldState.done[2] ? 1 : 0) - amount.current) * (1 - Math.exp(-2.5 * Math.min(raw, 0.05)));
    if (group.current) group.current.scale.setScalar(Math.max(0.001, amount.current));
    if (!still && water.current) water.current.rotation.z = Math.sin(clock.elapsedTime * 0.35) * 0.025;
  });
  return (
    <group ref={group} position={[1.5, 0.05, -6]} scale={0.001}>
      <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[3.8, 48]} /><meshStandardMaterial color="#441d2b" emissive={WINE} emissiveIntensity={0.65} metalness={0.55} roughness={0.18} transparent opacity={0.92} /></mesh>
      <group position={[-3.7, 0, 0]}>
        {[-0.75, 0.75].map((x) => <mesh key={x} position={[x, 1.1, 0]}><boxGeometry args={[0.32, 2.2, 0.35]} /><meshStandardMaterial color="#75473f" /></mesh>)}
        <mesh position={[0, 2.2, 0]}><boxGeometry args={[1.85, 0.3, 0.35]} /><meshStandardMaterial color={COPPER} emissive={WINE} emissiveIntensity={0.4} /></mesh>
      </group>
    </group>
  );
}

function MemoryMonument() {
  const group = useRef<THREE.Group>(null);
  const amount = useRef(0);
  useFrame((_, raw) => {
    amount.current += ((worldState.done[3] ? 1 : 0) - amount.current) * (1 - Math.exp(-2 * Math.min(raw, 0.05)));
    if (group.current) {
      group.current.scale.setScalar(Math.max(0.001, amount.current));
      group.current.rotation.y += Math.min(raw, 0.05) * 0.1 * amount.current;
    }
  });
  return (
    <group ref={group} position={[0, 0.2, 0]} scale={0.001}>
      <mesh position={[0, 1.25, 0]} castShadow><octahedronGeometry args={[0.65, 0]} /><meshStandardMaterial color={BLUSH} emissive={PEACH} emissiveIntensity={1.8} toneMapped={false} /></mesh>
      {[0, 1, 2, 3].map((index) => {
        const angle = index * Math.PI / 2;
        return <mesh key={index} position={[Math.cos(angle) * 1.3, 0.45, Math.sin(angle) * 1.3]}><icosahedronGeometry args={[0.22, 0]} /><meshBasicMaterial color={PEACH} toneMapped={false} /></mesh>;
      })}
      <pointLight position={[0, 2, 0]} color={PEACH} intensity={5} distance={12} />
    </group>
  );
}

const FOG_NAMES = ["🔥 Synchronous Orbit", "🗝️ Vulnerability Dungeon", "✨ Celestial Resonance"];

function DistantSilhouettes() {
  const group = useRef<THREE.Group>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const amount = useRef(0);
  useFrame((_, raw) => {
    amount.current += ((worldState.visual ? 1 : 0) - amount.current) * (1 - Math.exp(-1.4 * Math.min(raw, 0.05)));
    if (group.current) {
      group.current.visible = amount.current > 0.02;
      group.current.children.forEach((child) => child.scale.setScalar(Math.max(0.001, amount.current)));
    }
    const named = worldState.done.every(Boolean) ? THREE.MathUtils.smoothstep(scrollState.p, 0.8, 0.9) : 0;
    labels.current.forEach((el, i) => { if (el) el.style.opacity = String(named * (i === 2 ? 0.35 : 0.8)); });
  });
  return (
    <group ref={group} visible={false}>
      {[-2.2, -0.6, 1.1].map((angle, index) => (
        <group key={angle} position={[Math.cos(angle) * (25 + index * 3), -0.5, Math.sin(angle) * (25 + index * 3)]}>
          <mesh position={[0, 2 + index, 0]}><dodecahedronGeometry args={[2.2 + index, 0]} /><meshBasicMaterial color="#32141d" transparent opacity={0.28} /></mesh>
          <Html position={[0, 6 + index * 1.5, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <div ref={(el) => { labels.current[index] = el; }} style={{ opacity: 0, transition: "opacity 1.2s" }} className={`whitespace-nowrap font-display text-lg text-blush ${index === 2 ? "blur-[1.5px]" : "blur-[0.3px]"}`}>{FOG_NAMES[index]}</div>
          </Html>
        </group>
      ))}
    </group>
  );
}

function FutureWorlds() {
  const group = useRef<THREE.Group>(null);
  const amount = useRef(0);
  useFrame((_, raw) => {
    const target = worldState.done.every(Boolean) ? 1 : 0;
    amount.current += (target - amount.current) * (1 - Math.exp(-1.8 * Math.min(raw, 0.05)));
    if (group.current) group.current.visible = amount.current > 0.02;
    group.current?.children.forEach((child) => { child.scale.setScalar(Math.max(0.001, amount.current)); });
  });
  return (
    <group ref={group} visible={false}>
      {[[22, 0, -9], [-20, 0, -16], [8, 0, -28]].map((position, index) => (
        <group key={index} position={position as [number, number, number]}>
          <mesh position={[0, 3.5, 0]}><torusGeometry args={[2.3, 0.22, 8, 28, Math.PI]} /><meshStandardMaterial color={index === 0 ? COPPER : index === 1 ? WINE : BLUSH} emissive={WINE} emissiveIntensity={0.6} transparent opacity={0.55} /></mesh>
        </group>
      ))}
    </group>
  );
}

function SparkMarker() {
  const marker = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!marker.current) return;
    marker.current.visible = Boolean(worldState.waitlisted);
    const scale = 0.85 + Math.sin(clock.elapsedTime * 2) * 0.12;
    marker.current.scale.setScalar(scale);
  });
  return (
    <group ref={marker} position={[14.5, 0.8, 2]} visible={false}>
      <mesh><sphereGeometry args={[0.22, 18, 18]} /><meshBasicMaterial color={BLUSH} toneMapped={false} /></mesh>
      <pointLight color={PEACH} intensity={4} distance={7} />
    </group>
  );
}

export function World({ still, lite }: { still: boolean; lite: boolean }) {
  return (
    <>
      <GladeGround lite={lite} />
      <DistantSilhouettes />
      <LightGrove />
      <Bridge />
      <LakeVault still={still} />
      <MemoryMonument />
      <FutureWorlds />
      <SparkMarker />
      <DepthLayers still={still} lite={lite} />
      <PlayerEmber still={still} />
      <PartnerEmber still={still} />
      <Ignition still={still} />
      <Campfire still={still} lite={lite} />
      <Fireflies still={still} lite={lite} />
      <EdgeTrees />
      <Lantern />
    </>
  );
}
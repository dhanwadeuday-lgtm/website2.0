import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { IGNITION, ignitionElapsed, scrollState, worldState } from "@/lib/journey";
import { PLAYER_EMBER, pointer, usePointerTracking } from "./Act1";
import { World } from "./World";

function CameraRig({ still, mobile }: { still: boolean; mobile: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const intimate = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookA = useMemo(() => new THREE.Vector3(), []);
  const vel = useRef({ last: scrollState.p, shake: 0, born: worldState.visual });
  usePointerTracking();

  useFrame(({ clock }, raw) => {
    const dt = Math.min(raw, 0.05);
    const t = clock.elapsedTime;
    const p = scrollState.p;
    const completed = worldState.done.reduce((sum, value) => sum + value, 0);

    // World-scale rig (after ignition)
    const orbit = p * Math.PI * 0.72 - 0.55;
    const finalLift = THREE.MathUtils.smoothstep(p, 0.72, 1);
    const distance = (mobile ? 10.5 : 9) + p * 4 + finalLift * 8;
    const height = 3.2 + p * 3 + finalLift * 9 + completed * 0.3;
    target.set(Math.sin(orbit) * distance, height, Math.cos(orbit) * distance);
    look.set(0, finalLift ? 0.3 : 0.8, -finalLift * 2);

    // Act 1 intimate rig: close to your ember, dolly out on scroll (0–15%).
    const a = THREE.MathUtils.smoothstep(p, 0, 0.15);
    const idle = still ? 0 : 1;
    intimate.set(
      PLAYER_EMBER.x + a * 1.6 + Math.sin(t * 0.11) * 0.12 * idle + pointer.x * 0.15 * idle,
      PLAYER_EMBER.y + 0.15 + a * 0.9 + Math.cos(t * 0.09) * 0.08 * idle - pointer.y * 0.1 * idle,
      PLAYER_EMBER.z + (mobile ? 3 : 2.3) + a * (mobile ? 8 : 6.5),
    );
    lookA.set(PLAYER_EMBER.x + a * 2.4, PLAYER_EMBER.y + a * 0.6, PLAYER_EMBER.z - a * 1.2);

    // Scroll-velocity wobble, heavily smoothed.
    const v = Math.abs(p - vel.current.last) / Math.max(dt, 0.001);
    vel.current.last = p;
    vel.current.shake += (Math.min(v, 1.5) - vel.current.shake) * (1 - Math.exp(-4 * dt));
    const wob = still ? 0 : vel.current.shake * 0.06;
    intimate.x += Math.sin(t * 7.1) * wob;
    intimate.y += Math.cos(t * 6.3) * wob;

    // The visual story moves out of the void independently of duo pairing.
    const e = worldState.visual ? ignitionElapsed() : -1;
    if (e >= 0 && e < IGNITION.approach && !still) intimate.z -= Math.pow(e / IGNITION.approach, 2) * 0.8; // push-in
    const goal = worldState.visual && (still || e > IGNITION.approach + 0.4) ? 1 : 0;
    vel.current.born = still ? goal : vel.current.born + (goal - vel.current.born) * (1 - Math.exp(-0.9 * dt));
    const b = THREE.MathUtils.smoothstep(vel.current.born, 0, 1);
    target.lerpVectors(intimate, target, b);
    look.lerpVectors(lookA, look, b);

    const damping = still ? 1 : 1 - Math.exp(-3.5 * dt);
    camera.position.lerp(target, damping);
    camera.lookAt(look);
    const cam = camera as THREE.PerspectiveCamera;
    const fov = THREE.MathUtils.lerp(38, mobile ? 58 : 48, b);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

export default function WorldCanvas({ still, mobile }: { still: boolean; mobile: boolean }) {
  return (
    <Canvas
      shadows={!mobile}
      dpr={[1, mobile ? 1.25 : 1.65]}
      camera={{ position: [4, 3.2, 9], fov: mobile ? 58 : 48, near: 0.1, far: 100 }}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#080407"]} />
      <fogExp2 attach="fog" args={["#220c14", 0.032]} />
      <ambientLight intensity={0.32} color="#7b4a56" />
      <hemisphereLight args={["#E8B99C", "#12070b", 0.42]} />
      <directionalLight position={[8, 12, 7]} intensity={0.75} color="#FBF4F1" castShadow={!mobile} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Environment resolution={64}>
        <Lightformer intensity={1.1} color="#E8B99C" position={[0, 7, 1]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={0.5} color="#6B2B3C" position={[-7, 2, -2]} rotation-y={Math.PI / 2} scale={[14, 3, 1]} />
      </Environment>
      <CameraRig still={still} mobile={mobile} />
      <World still={still} lite={mobile} />
    </Canvas>
  );
}
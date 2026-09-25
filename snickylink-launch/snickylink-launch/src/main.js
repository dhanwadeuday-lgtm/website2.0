// SnickyLink — interactive map-journey site. Entry point.
// Three.js + the world are lazy-loaded so first paint (hero text) is not
// blocked by the 3D payload. If WebGL is missing, a static CSS/SVG fallback
// takes over and all content remains usable.
import { journey } from './core/journey.js';
import { initScroll } from './core/scroll.js';
import { initOverlay } from './core/overlay.js';

// exposed for debugging / automated testing in the console
window.__sl = { journey };

const canvas = document.getElementById('scene');
const overlay = document.getElementById('overlay');
const ui = document.getElementById('ui');

initScroll();
const overlayHandle = initOverlay(overlay, ui);
window.__sl.frame = overlayHandle.frame; // testability: drive frames manually when RAF is paused

async function boot() {
  let webgl = false;
  try {
    const { webglSupported } = await import('./core/world.js');
    webgl = webglSupported();
  } catch { webgl = false; }

  if (webgl) {
    try {
      const { World } = await import('./core/world.js');
      const world = new World(canvas);
      window.__sl.world = world; // testability
      canvas.style.display = 'block';
      // render loop
      const THREE = await import('three');
      const clock = new THREE.Clock();
      let hidden = false;
      document.addEventListener('visibilitychange', () => { hidden = document.hidden; });
      (function loop() {
        requestAnimationFrame(loop);
        const dt = Math.min(clock.getDelta(), 0.05);
        if (hidden) return;
        const t = clock.elapsedTime;
        world.update(dt, t);
        world.renderer.render(world.scene, world.camera);
      })();
    } catch (err) {
      console.warn('3D world failed to start, using static fallback:', err);
      const { mountStaticFallback } = await import('./core/world.js');
      mountStaticFallback();
    }
  } else {
    const { mountStaticFallback } = await import('./core/world.js');
    mountStaticFallback();
  }

  document.body.classList.add('world-ready');
}

boot();

// rehydrate checkpoint state if the user reloaded mid-journey
try {
  const savedDone = JSON.parse(sessionStorage.getItem('sl-done') || '[]');
  const savedJoined = sessionStorage.getItem('sl-joined') === '1';
  savedDone.forEach((d, i) => { if (d) journey.done[i] = true; });
  if (savedJoined) { journey.joined = true; document.body.classList.add('joined'); }
} catch { /* fresh */ }

// persist completion state (session only)
setInterval(() => {
  try {
    sessionStorage.setItem('sl-progress', String(journey.raw / 0.985));
    sessionStorage.setItem('sl-done', JSON.stringify(journey.done));
    sessionStorage.setItem('sl-joined', journey.joined ? '1' : '0');
  } catch { /* private mode */ }
}, 2500);

// loader out
window.addEventListener('load', () => {
  setTimeout(() => document.body.classList.add('loader-gone'), 450);
});
setTimeout(() => document.body.classList.add('loader-gone'), 2500);

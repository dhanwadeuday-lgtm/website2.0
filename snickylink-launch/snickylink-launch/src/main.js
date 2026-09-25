// SnickyLink — interactive journey site. Entry point.
import * as THREE from 'three';
import { World } from './core/world.js';
import { initScroll } from './core/scroll.js';
import { initOverlay } from './core/overlay.js';
import { journey } from './core/journey.js';
import { device } from './core/util.js';

// exposed for debugging / automated testing in the console
window.__sl = { journey };

const canvas = document.getElementById('scene');
const overlay = document.getElementById('overlay');
const ui = document.getElementById('ui');

// build the world
const world = new World(canvas);
initScroll();
initOverlay(overlay, ui);

// rehydrate flower state if the user reloaded mid-journey
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

// render loop
const clock = new THREE.Clock();
let hidden = false;
document.addEventListener('visibilitychange', () => { hidden = document.hidden; });

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (hidden) return;
  const t = clock.elapsedTime;
  world.update(dt, t);
  world.renderer.render(world.scene, world.camera);
}
requestAnimationFrame(loop);

// loader out
window.addEventListener('load', () => {
  setTimeout(() => document.body.classList.add('loader-gone'), 450);
});
setTimeout(() => document.body.classList.add('loader-gone'), 2500);

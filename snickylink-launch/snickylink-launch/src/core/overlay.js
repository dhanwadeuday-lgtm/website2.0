// Overlay controller — the bridge between journey state and the DOM.
// Every frame: show the active chapter, fade by entrance/exit, mark progress.
// Snick cards and the join button write REAL state (journey.done / journey.joined);
// scrolling never does.
import { journey, CH } from './journey.js';
import { clamp, smoothstep, fmt } from './util.js';
import { CSS, FLOWERS } from './tokens.js';

export function initOverlay(overlay, ui) {
  const chapters = buildOverlay(overlay, ui); // overlay = story layers, ui = DOM acts
  const snickLiveEls = [...overlay.querySelectorAll('.snick-live')];
  const snickGridEls = [...overlay.querySelectorAll('#snickGrid .snick-card')];

  // ── snick interactions ─────────────────────────────────────────────────
  snickLiveEls.forEach((el) => {
    const idx = Number(el.dataset.i);
    const chips = [...el.querySelectorAll('.partner-chip')];
    const line = el.querySelector('.progress-line span');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('on')) return;
        chip.classList.add('on');
        const doneCount = chips.filter(c => c.classList.contains('on')).length;
        line.style.width = `${(doneCount / 2) * 100}%`;
        if (doneCount === 2) {
          setTimeout(() => {
            journey.completeSnick(idx);
            el.classList.add('completed');
            el.querySelector('.micro').textContent = 'SNICK COMPLETE · +20 XP';
            // unlock the snick grid card too
            const gridCard = snickGridEls[idx];
            if (gridCard) {
              gridCard.classList.remove('blurred');
              gridCard.classList.add('done');
              gridCard.querySelector('.snick-state').textContent = '✦ UNLOCKED';
            }
            // bloom text chapter rides the bloom window; open the flower:
            // journey.bloom is driven by done[] in world.update — nothing else to do.
          }, 350);
        }
      });
    });
  });

  // ── join button ────────────────────────────────────────────────────────
  const joinBtn = overlay.querySelector('#joinBtn');
  joinBtn.addEventListener('click', () => {
    journey.joinPartner();
    journey.raw = Math.min(journey.raw, 0.555); // hold the moment briefly
    joinBtn.textContent = '✦ YOUR PERSON IS IN';
    joinBtn.disabled = true;
    document.body.classList.add('joined');
  });

  // ── progress rail (right edge) ─────────────────────────────────────────
  const rail = document.createElement('div');
  rail.className = 'rail';
  rail.innerHTML = `
    <span class="rail-label" id="railLabel">THE SEED</span>
    <div class="rail-track"><div class="rail-fill"></div></div>
    <div class="rail-flowers">${FLOWERS.map(f => `<span data-f="${f.id}">${f.emoji}</span>`).join('')}</div>
  `;
  document.body.appendChild(rail);

  // ── skip / resume control ───────────────────────────────────────────────
  const skip = document.createElement('button');
  skip.className = 'skip-btn';
  skip.textContent = 'SKIP TO THE END ↓';
  skip.addEventListener('click', () => {
    journey.jumpTo(1);
    document.body.classList.add('in-dom');
  });
  document.body.appendChild(skip);

  // ── per-frame update ───────────────────────────────────────────────────
  const chapterMeta = chapters;
  let activeId = null;

  function frame() {
    const p = journey.p;

    // DOM handoff at the very end (epsilon below the raw cap so damping reaches it)
    const atEnd = p >= 0.9815;
    document.body.classList.toggle('in-dom', atEnd);

    for (const c of chapterMeta) {
      const [a, b] = c.range;
      const visible = p >= a - 0.012 && p < b + 0.012;
      if (visible) {
        const local = clamp((p - a) / (b - a || 1e-6), 0, 1);
        const enter = smoothstep(0, 0.22, local);
        const exit = 1 - smoothstep(0.8, 1, local);
        c.el.style.opacity = String(Math.min(enter, exit));
        c.el.style.transform = `translateY(${(1 - enter) * 34 - (1 - exit) * 26}px)`;
        c.el.style.pointerEvents = c.mode === 'snick' || c.id === 'join' ? 'auto' : 'none';
        c.el.classList.add('active');
      } else {
        c.el.classList.remove('active');
        c.el.style.opacity = '0';
        c.el.style.pointerEvents = 'none';
      }
    }

    // rail
    const fill = rail.querySelector('.rail-fill');
    fill.style.height = `${p * 100}%`;
    const label = rail.querySelector('#railLabel');
    label.textContent = railLabel(p);
    for (const fEl of rail.querySelectorAll('.rail-flowers span')) {
      const i = Number(fEl.dataset.f);
      fEl.classList.toggle('on', journey.done[i]);
    }

    // skip button only during the story
    skip.classList.toggle('show', p > 0.02 && p < 0.97);

    // snick live cards: gentle pulse while waiting for both partners
    for (const el of snickLiveEls) {
      const i = Number(el.dataset.i);
      const [a, b] = CH[`snick${i + 1}`];
      const inWindow = p >= a && p < b + 0.02;
      el.classList.toggle('waiting', inWindow && !journey.done[i]);
      // auto-scroll hint: if the user scrolls past without completing, the
      // chapter still passes (scroll = presentation; completion = flowers).
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { chapters };
}

function railLabel(p) {
  if (p < 0.10) return 'THE SEED';
  if (p < 0.20) return 'FIRST WATER';
  if (p < 0.30) return 'THE STEM';
  if (p < 0.40) return 'SECOND WATER';
  if (p < 0.46) return 'SNICKYLINK';
  if (p < 0.52) return 'FOUR SNICKS';
  if (p < 0.56) return 'TWO BECOME ONE';
  if (p < 0.62) return 'SNICK 01 · NOTICE';
  if (p < 0.68) return 'WHITE BLOOM';
  if (p < 0.74) return 'SNICK 02 · PLAY';
  if (p < 0.79) return 'YELLOW BLOOM';
  if (p < 0.83) return 'SNICK 03 · CONNECT';
  if (p < 0.87) return 'PINK BLOOM';
  if (p < 0.91) return 'SNICK 04 · CREATE';
  if (p < 0.94) return 'WINE ROSE';
  if (p < 0.965) return 'THE HERO MOMENT';
  return 'THE RESULT';
}

import { buildOverlay } from './chapters.js';

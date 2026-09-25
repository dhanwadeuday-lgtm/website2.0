// Overlay controller — the bridge between journey state and the DOM.
// Every frame: show the active chapter, fade by entrance/exit, mark progress.
// Snick cards and the join button write REAL state (journey.done / journey.joined);
// scrolling never does.
import { journey, CH } from './journey.js';
import { clamp, smoothstep } from './util.js';
import { CHECKPOINTS } from './tokens.js';
import { buildOverlay } from './chapters.js';

export function initOverlay(overlay, ui) {
  const chapters = buildOverlay(overlay, ui); // overlay = story layers, ui = DOM acts
  const snickLiveEls = [...overlay.querySelectorAll('.snick-live')];
  const cpRows = [...overlay.querySelectorAll('.cp-row')];

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
            // light the map list row too
            const row = cpRows[idx];
            if (row) {
              row.querySelector('.cp-state').textContent = '✦ LIT';
              row.classList.add('done');
            }
          }, 350);
        }
      });
    });
  });

  // ── join button ────────────────────────────────────────────────────────
  const joinBtn = overlay.querySelector('#joinBtn');
  joinBtn.addEventListener('click', () => {
    journey.joinPartner();
    journey.raw = Math.min(journey.raw, 0.168); // hold the moment briefly
    joinBtn.textContent = '✦ YOUR PERSON IS ON THE PATH';
    joinBtn.disabled = true;
    document.body.classList.add('joined');
  });

  // ── progress rail (right edge) — checkpoint dots ───────────────────────
  const rail = document.createElement('div');
  rail.className = 'rail';
  rail.innerHTML = `
    <span class="rail-label" id="railLabel">THE TRAILHEAD</span>
    <div class="rail-track"><div class="rail-fill"></div></div>
    <div class="rail-cps">${CHECKPOINTS.map(f => `<span data-f="${f.id}" title="Checkpoint 0${f.id + 1} · ${f.name}">${f.id + 1}</span>`).join('')}</div>
  `;
  document.body.appendChild(rail);

  // ── screen-reader progress announcements ───────────────────────────────
  const srProgress = document.createElement('div');
  srProgress.className = 'sr-progress';
  srProgress.setAttribute('aria-live', 'polite');
  srProgress.setAttribute('role', 'status');
  document.body.appendChild(srProgress);
  let lastAnnounced = null;

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
    const lbl = railLabel(p);
    label.textContent = lbl;
    for (const el of rail.querySelectorAll('.rail-cps span')) {
      const i = Number(el.dataset.f);
      el.classList.toggle('on', journey.done[i]);
    }

    // sr announcements: only when the named checkpoint changes
    if (lbl !== lastAnnounced) {
      lastAnnounced = lbl;
      srProgress.textContent = `Checkpoint: ${lbl}`;
    }

    // skip button only during the story
    skip.classList.toggle('show', p > 0.02 && p < 0.97);

    // snick live cards: gentle pulse while waiting for both partners
    for (const el of snickLiveEls) {
      const i = Number(el.dataset.i);
      const [a, b] = CH[`cp${i + 1}`];
      const inWindow = p >= a && p < b + 0.02;
      el.classList.toggle('waiting', inWindow && !journey.done[i]);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { chapters, frame };
}

function railLabel(p) {
  if (p < 0.08) return 'THE TRAILHEAD';
  if (p < 0.125) return 'THE MAP';
  if (p < 0.170) return 'YOUR PERSON JOINS';
  if (p < 0.290) return 'CHECKPOINT 01 · THE FIRST SPARK · NOTICE';
  if (p < 0.325) return 'WALKING ON · CHECKPOINT 02 AHEAD';
  if (p < 0.445) return 'CHECKPOINT 02 · PLAYGROUND · PLAY';
  if (p < 0.480) return 'WALKING ON · CHECKPOINT 03 AHEAD';
  if (p < 0.600) return 'CHECKPOINT 03 · DEEPER WATERS · CONNECT';
  if (p < 0.630) return 'WALKING ON · CHECKPOINT 04 AHEAD';
  if (p < 0.745) return 'CHECKPOINT 04 · MEMORY PEAK · CREATE';
  if (p < 0.825) return 'THE CHALLENGE ARENA · LOCKED';
  if (p < 0.870) return 'THE FLEX BOARD · AHEAD';
  if (p < 0.930) return "REGIONS BEYOND THE FOG";
  return 'THE LIT PATH';
}

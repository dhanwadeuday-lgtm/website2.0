// Overlay controller — the bridge between journey state and the DOM.
// Every frame: show the active chapter, fade by entrance/exit, mark progress.
// Snick cards and the join button write REAL state (journey.done / journey.joined);
// scrolling never does.
import { journey, CH } from './journey.js';
import { clamp, smoothstep } from './util.js';
import { CHECKPOINTS } from './tokens.js';
import { buildOverlay, flash } from './chapters.js';

export function initOverlay(overlay, ui) {
  const chapters = buildOverlay(overlay, ui); // overlay = story layers, ui = DOM acts
  const snickLiveEls = [...overlay.querySelectorAll('.snick-live')];
  const cpRows = [...overlay.querySelectorAll('.cp-row')];

  // ── HUD: shared XP + player state (top-left, always visible) ────────────
  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = `
    <div class="hud-xp"><b id="hudXp">0</b><span>SHARED XP</span></div>
    <div class="hud-players" id="hudPlayers">● YOU · ○ YOUR PERSON — OUTSIDE THE WORLD</div>
  `;
  document.body.appendChild(hud);
  const hudXp = hud.querySelector('#hudXp');
  const hudPlayers = hud.querySelector('#hudPlayers');
  let shownXp = -1;

  // ── world notice: the cinematic announcement layer ─────────────────────
  const notice = document.createElement('div');
  notice.className = 'world-notice';
  notice.setAttribute('aria-live', 'polite');
  document.body.appendChild(notice);
  let noticeTimer = 0;
  const announce = (lines, hold = 2600) => {
    notice.innerHTML = lines.map((l, i) => `<${i === 0 ? 'b' : 'span'}>${l}</${i === 0 ? 'b' : 'span'}>`).join('');
    notice.classList.add('show');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => notice.classList.remove('show'), hold);
  };

  // ── snick interactions ─────────────────────────────────────────────────
  snickLiveEls.forEach((el) => {
    const idx = Number(el.dataset.i);
    const chips = [...el.querySelectorAll('.partner-chip')];
    const line = el.querySelector('.progress-line span');
    const tw = el.querySelector('.two-way');
    const twOut = el.querySelector('.tw-revealed');
    let mine = '';

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('on') || journey.snickState(idx).state !== 'live') return;
        chip.classList.add('on');
        const doneCount = chips.filter(c => c.classList.contains('on')).length;
        line.style.width = `${(doneCount / 2) * 100}%`;
        if (doneCount === 2) {
          setTimeout(() => {
            journey.completeSnick(idx);
            el.classList.add('completed');
            // two-way lock snick: reveal panel replaces the chips
            if (tw) {
              tw.hidden = false;
              tw.querySelector('.tw-input').focus({ preventScroll: true });
            }
            if (!tw) el.querySelector('.micro').textContent = 'SNICK COMPLETE · +20 XP';
            announce(['+20 XP', `CHECKPOINT 0${idx + 1} ACTIVATED`], 2200);
            const row = cpRows[idx];
            if (row) {
              row.querySelector('.cp-state').textContent = '✦ LIT';
              row.classList.add('done');
            }
          }, 350);
        }
      });
    });

    // two-way lock: seal → partner “locks” → simultaneous reveal
    if (tw) {
      const input = tw.querySelector('.tw-input');
      const lockBtn = tw.querySelector('[data-tw="lock"]');
      const revealBtn = tw.querySelector('[data-tw="reveal"]');
      const note = tw.querySelector('.tw-note');
      lockBtn?.addEventListener('click', () => {
        mine = (input.value || '').trim() || '(left it unspoken)';
        input.disabled = true; lockBtn.disabled = true;
        lockBtn.textContent = 'SEALED 🔒';
        note.textContent = 'YOUR PERSON HAS LOCKED IN. SUBMIT YOUR ANSWER TO REVEAL BOTH.';
        revealBtn.hidden = false;
        revealBtn.focus({ preventScroll: true });
      });
      revealBtn?.addEventListener('click', () => {
        if (!mine) return;
        const theirs = '“…the night we walked nowhere in particular, and it was everything.”';
        if (twOut) {
          twOut.hidden = false;
          twOut.querySelector('[data-tw="mine"]').textContent = mine;
          twOut.querySelector('[data-tw="theirs"]').textContent = theirs;
        }
        revealBtn.hidden = true; note.hidden = true;
        twOut?.classList.add('unmask');
        el.querySelector('.micro').textContent = 'DUAL UNMASK · +20 XP';
      });
    }
  });

  // ── duo code: generate + copy ─────────────────────────────────────────
  const pairStep1 = overlay.querySelector('#pairStep1');
  const pairStep2 = overlay.querySelector('#pairStep2');
  const pairName = overlay.querySelector('#pairName');
  const pairEmail = overlay.querySelector('#pairEmail');
  const pairBtn = overlay.querySelector('#pairBtn');
  const pairErr = overlay.querySelector('#pairErr');
  const duoCode = overlay.querySelector('#duoCode');
  const duoCopy = overlay.querySelector('#duoCopy');
  const showPairErr = (msg) => {
    if (!pairErr) return;
    pairErr.hidden = false;
    pairErr.textContent = msg;
  };
  pairBtn?.addEventListener('click', () => {
    const email = (pairEmail?.value || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showPairErr('A real email, please — it\u2019s how your person finds you.');
      pairEmail?.focus();
      return;
    }
    journey.startPairing(email, pairName?.value || 'A');
    duoCode.textContent = journey.duoCode.split('').join(' ');
    if (pairStep1) pairStep1.hidden = true;
    if (pairStep2) pairStep2.hidden = false;
    duoCopy?.focus({ preventScroll: true });
  });
  pairEmail?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); pairBtn?.click(); } });
  pairName?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); pairEmail?.focus(); } });
  duoCopy?.addEventListener('click', async () => {
    const code = (duoCode?.textContent || '').replace(/\s/g, '');
    if (!code || code === '····') return;
    try { await navigator.clipboard.writeText(code); duoCopy.textContent = 'COPIED ✦'; }
    catch { duoCopy.textContent = code; }
    setTimeout(() => { duoCopy.textContent = 'COPY CODE'; }, 1800);
  });

  // ── join: the first real unlock ─────────────────────────────────────────
  const joinBtn = overlay.querySelector('#joinBtn');
  const demoBtn = overlay.querySelector('#demoJoin');
  const refreshIdentity = () => {    const paired = !journey.isObserver;
    const obsScore = document.getElementById('scoreObserver');
    const pairedScore = document.getElementById('scorePaired') ;
    const obsStory = document.getElementById('storyObserver');
    const pairedStory = document.getElementById('storyPaired');
    if (obsScore) obsScore.hidden = paired;
    if (pairedScore) pairedScore.hidden = !paired;
    if (obsStory) obsStory.hidden = paired;
    if (pairedStory) pairedStory.hidden = !paired;
    if (paired) {
      const si = document.getElementById('scInitials'); if (si) si.textContent = journey.initials;
      const st = document.getElementById('scTag'); if (st) st.textContent = journey.tag;
      const sq = document.getElementById('scQuote'); if (sq) sq.textContent = `"${journey.tagline}"`;
      const ss = document.getElementById('scScore'); if (ss) ss.textContent = String(journey.score);
    }
  };
  const doJoin = () => {
    if (journey.joined) return;
    journey.confirmJoin();
    journey.raw = Math.min(journey.raw, 0.168); // hold the moment briefly
    if (joinBtn) { joinBtn.textContent = '✦ YOUR PERSON IS ON THE PATH'; joinBtn.disabled = true; }
    if (demoBtn) demoBtn.hidden = true;
    document.body.classList.add('joined');
    refreshIdentity();
    announce(['BOTH OF YOU ARE IN. ✦', 'THE WORLD CAN BEGIN.'], 3400);
    window.__sl?.world?.fx?.joinPulse?.();
  };
  joinBtn?.addEventListener('click', doJoin);
  demoBtn?.addEventListener('click', doJoin);
  refreshIdentity();
  // restored pairing state (reload mid-story) reopens the code step
  if (journey.pairState === 'paired' && duoCode) {
    duoCode.textContent = journey.duoCode.split('').join(' ');
    if (pairStep1) pairStep1.hidden = true;
    if (pairStep2) pairStep2.hidden = false;
  }
  document.getElementById('obsBring')?.addEventListener('click', () => {
    document.body.classList.remove('in-dom');
    journey.jumpTo(0.14);
  });
  document.getElementById('finalBring')?.addEventListener('click', () => {
    document.body.classList.remove('in-dom');
    journey.jumpTo(0.14);
  });
  document.getElementById('nextWorld')?.addEventListener('click', () => {
    flash('The next world opens when the map grows. 🗝️');
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
  const flags = { join: false, cp1: false, arena: false, board: false, next: false, finale: false };

  // ── DOM acts: reveal-on-scroll + card tilt (Nova-style motion) ──────
  const actEls = document.querySelectorAll('#dom-acts .act');
  actEls.forEach((el) => el.classList.add('rv'));
  if ('IntersectionObserver' in window) {
    const rvIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); rvIO.unobserve(e.target); }
      }
    }, { threshold: 0.16 });
    actEls.forEach((el) => rvIO.observe(el));
  } else actEls.forEach((el) => el.classList.add('in'));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.snick-live').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

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

    // HUD: shared XP + player line
    const xp = journey.xp;
    if (xp !== shownXp) {
      shownXp = xp;
      hudXp.textContent = String(xp);
      hudXp.classList.remove('pop');
      void hudXp.offsetWidth; // restart the pop animation
      hudXp.classList.add('pop');
      document.body.classList.toggle('has-xp', xp > 0);
      const xt = document.getElementById('xpTotal');
      if (xt) xt.textContent = `${xp} XP`;
    }
    const playersLine = journey.joined ? '● YOU —— ● YOUR PERSON' : '● YOU · ○ YOUR PERSON — OUTSIDE THE WORLD';
    if (hudPlayers.textContent !== playersLine) hudPlayers.textContent = playersLine;

    // snick cards: live vs locked face, driven only by REAL state
    snickLiveEls.forEach((el) => {
      const i = Number(el.dataset.i);
      const st = journey.snickState(i);
      const lock = el.querySelector('.snick-lock');
      const body = el.querySelector('.snick-body');
      const CH_KEY = `cp${i + 1}`;
      const [a, b] = CH[CH_KEY];
      const inWindow = p >= a && p < b + 0.02;
      if (lock && body) {
        const showLock = st.state === 'locked';
        lock.hidden = !showLock;
        body.hidden = showLock;
        if (showLock) {
          lock.querySelector('.lock-reason').textContent = st.reason;
        }
      }
      el.classList.toggle('waiting', inWindow && st.state === 'live');
    });

    // world moments: each gate/region speaks once when the gaze reaches it
    if (p >= 0.125 && !flags.join) { flags.join = true; if (!journey.joined) announce(['ONE PLAYER DETECTED', 'BRING YOUR PERSON.'], 2600); }
    if (p >= 0.170 && !flags.cp1) { flags.cp1 = true; if (!journey.joined) announce(['SNICK 01 · LOCKED 🔒', 'IT OPENS WHEN TWO SHOW UP.'], 2800); }
    if (p >= 0.775 && !flags.arena) { flags.arena = true; announce(["THE CHALLENGE ARENA · LOCKED", "YOUR JOURNEY HASN'T REACHED HERE."], 3000); }
    if (p >= 0.825 && !flags.board) { flags.board = true; announce(['THE FLEX BOARD · AHEAD', 'KEEP SHOWING UP.'], 2600); }
    if (p >= 0.870 && !flags.next) { flags.next = true; announce(['SOMETHING IS WAITING BEYOND THE FOG.', 'TWO PEOPLE. MORE DISTANCE.'], 3000); }
    if (p >= 0.930 && !flags.finale) { flags.finale = true; announce(['THE WORLD CAN BE SEEN.', 'THE EXPERIENCE ONLY OPENS WHEN TWO PEOPLE SHOW UP.'], 3200); }

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

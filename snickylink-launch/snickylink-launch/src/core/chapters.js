// Chapter content + DOM overlay construction.
// Cinematic text rides over the canvas, alternating sides following the path.
// Interactive cards (snicks, join, waitlist) are real UI: they set journey state.
import { journey, CH } from './journey.js';
import { clamp } from './util.js';
import { CHECKPOINTS, CSS } from './tokens.js';

export function buildOverlay(overlay, ui) {
  const chapters = [];

  const side = (n) => (n % 2 === 0 ? 'left' : 'right');

  // ── chapter shell helper ────────────────────────────────────────────────
  function chapter(id, range, html, opts = {}) {
    const el = document.createElement('section');
    el.className = `chapter side-${opts.side ?? side(chapters.length)} ${opts.cls || ''}`;
    el.dataset.range = range.join(',');
    el.innerHTML = html;
    overlay.appendChild(el);
    chapters.push({ id, el, range, mode: opts.mode || 'text', ...opts });
    return el;
  }

  // ── 01 OPENING — the map fades in through fog ────────────────────────────
  chapter('spark', CH.spark, `
    <div class="ch-inner">
      <p class="kicker">SNICKYLINK</p>
      <h1>MORE THAN<br>A CHAT.</h1>
      <p class="sub">A secret little world for two.</p>
      <p class="hint">scroll to set out ↓</p>
    </div>
  `, { side: 'left' });

  // ── 02 THE MAP — four checkpoints, two travellers ────────────────────────
  chapter('intro', CH.intro, `
    <div class="ch-inner">
      <p class="kicker">THE MAP</p>
      <h2>FOUR CHECKPOINTS.<br>ONE PATH. TWO PEOPLE.</h2>
      <p class="sub">Each one hides a Snick — a tiny challenge you both complete together.</p>
      <div class="cp-list">
        ${CHECKPOINTS.map((c, i) => `
          <div class="cp-row" data-i="${i}">
            <span class="cp-dot"></span>
            <b>0${i + 1} · ${c.name}</b>
            <span class="cp-state">🔒 FOGGED</span>
          </div>
        `).join('')}
      </div>
    </div>
  `, { side: 'right' });

  // ── 03 JOIN — partner steps onto the path ─────────────────────────────────
  chapter('join', CH.join, `
    <div class="ch-inner center">
      <p class="kicker">YOUR PERSON JOINS</p>
      <h2>THE PATH LIGHTS<br>ONLY FOR TWO. ✦</h2>
      <p class="sub">One marker is waiting at the trailhead.</p>
      <button class="cta" id="joinBtn">BRING YOUR PERSON IN →</button>
    </div>
  `, { side: 'center' });

  // ── 04–07 SNICK CHECKPOINTS ───────────────────────────────────────────────
  const snicks = [
    { emoji: '👀', name: 'NOTICE', task: '“Find one tiny thing about them that you genuinely love — and tell them.”' },
    { emoji: '🎈', name: 'PLAY', task: '“Make each other laugh in 60 seconds.”' },
    { emoji: '💭', name: 'CONNECT', task: '“Ask something you’ve always wanted to do together.”' },
    { emoji: '📸', name: 'CREATE', task: '“Create one tiny memory together.”' },
  ];
  const cpMeta = [
    { key: 'cp1', place: 'THE FIRST SPARK', lit: 'cp1lit' },
    { key: 'cp2', place: 'PLAYGROUND', lit: 'cp2lit' },
    { key: 'cp3', place: 'DEEPER WATERS', lit: 'cp3lit' },
    { key: 'cp4', place: 'MEMORY PEAK', lit: 'cp4lit' },
  ];

  snicks.forEach((s, i) => {
    const m = cpMeta[i];
    chapter(m.key, CH[m.key], `
      <div class="ch-inner">
        <p class="kicker">CHECKPOINT 0${i + 1} · ${m.place}</p>
        <div class="snick-live" data-i="${i}">
          <div class="snick-top">SNICK 0${i + 1} · ${s.emoji} ${s.name}</div>
          <h3>${s.task}</h3>
          <div class="partners">
            <button class="partner-chip" data-partner="you">YOU ✓</button>
            <button class="partner-chip" data-partner="them">YOUR PERSON ✓</button>
          </div>
          <div class="progress-line"><span></span></div>
          <p class="micro">Both of you complete it. That's the rule.</p>
        </div>
      </div>
    `, { side: i % 2 ? 'right' : 'left', mode: 'snick', index: i });

    // the lit moment after completion
    chapter(m.lit, CH[m.lit], `
      <div class="ch-inner center">
        <p class="kicker">+20 XP · CHECKPOINT 0${i + 1} LIT</p>
        <h2>${m.place} IS AWAKE.</h2>
        <p class="sub">The beacon burns for you two.</p>
      </div>
    `, { side: 'center' });
  });

  // ── 08 ARENA — locked preview (no interaction; phase 3 scope) ────────────
  chapter('arena', CH.arena, `
    <div class="ch-inner center">
      <p class="kicker">AHEAD · LOCKED IN FOG</p>
      <h2>THE CHALLENGE ARENA.</h2>
      <p class="sub">Streaks, XP goals, and trials for two. Not yet — keep showing up.</p>
      <div class="locked-tag">🔒 UNLOCKS WITH YOUR STREAK</div>
    </div>
  `, { side: 'center' });

  // ── 09 BOARD — honest teaser ──────────────────────────────────────────────
  chapter('board', CH.board, `
    <div class="ch-inner center">
      <p class="kicker">FURTHER ON · A GLIMPSE</p>
      <h2>THE FLEX BOARD.</h2>
      <p class="sub">Where showing-up streaks get celebrated. A sample preview lives at the end of this trail — no real couples yet.</p>
    </div>
  `, { side: 'center' });

  // ── 10 WHAT'S NEXT — fogged future worlds ─────────────────────────────────
  chapter('next', CH.next, `
    <div class="ch-inner center">
      <p class="kicker">BEYOND THE FOG</p>
      <h2>THE MAP KEEPS GOING.</h2>
      <p class="sub">New regions appear as you two do. The first ones are already sketched.</p>
    </div>
  `, { side: 'center' });

  // ── 11 FINALE — wide pull-back over the lit path ──────────────────────────
  chapter('finale', CH.finale, `
    <div class="ch-inner center">
      <h1 class="hero-line">FOUR CHECKPOINTS.<br>ONE LIT PATH.</h1>
      <p class="sub">You walked it together.</p>
      <div class="cp-strip">${CHECKPOINTS.map(f => `<span>${f.emoji}</span>`).join('<i>→</i>')}</div>
    </div>
  `, { side: 'center' });

  // ── DOM acts (score, worlds, waitlist) live below in normal scroll ────────
  buildDomActs(ui);

  return chapters;
}

// DOM acts after the story: score, personality, story card, sample board,
// future worlds, waitlist. These use normal scrolling.
function buildDomActs(ui) {
  const score = journey.score;
  const initials = journey.initials;
  const tag = journey.tag;
  const tagline = journey.tagline;

  const acts = document.createElement('div');
  acts.id = 'dom-acts';
  acts.innerHTML = `
    <section class="act score-act">
      <p class="kicker">YOUR RESULT</p>
      <h2>HOW IN-SYNC ARE YOU TWO?</h2>
      <p class="at">AT THE SCORE OBELISK · FINALE ISLAND</p>
      <div class="score-num" id="scoreNum">0</div>
      <div class="bars">
        ${[['COMMUNICATION', 8], ['PLAY', 9], ['EFFORT', 8], ['TRUST', 9], ['EMOTIONAL SYNC', 8]].map(([label, v]) => `
          <div class="bar-row">
            <span class="bar-label">${label}</span>
            <span class="bar"><i style="--w:${v}0%"></i></span>
          </div>
        `).join('')}
      </div>
      <p class="micro">A playful SnickyLink metric — not science, and this one's a sample preview. Your real score comes from actually showing up together.</p>
    </section>

    <section class="act tag-act">
      <p class="kicker">YOUR COUPLE TAG</p>
      <h2 class="tag-name">${tag}</h2>
      <p class="at">CARVED INTO THE TAG ARCH</p>
      <p class="quote">"${tagline}"</p>
      <div class="share-hint">A sample tag — yours gets written when you two play.</div>
    </section>

    <section class="act story-act">
      <p class="kicker">9:16 · MADE FOR SHARING</p>
      <p class="at">HELD BY THE STORY STELE</p>
      <div class="story-card" id="storyCard">
        <img class="sc-logo" src="/logo.webp" alt="SnickyLink moon logo" width="34" height="34" loading="lazy" />
        <div class="sc-brand">SNICKYLINK</div>
        <div class="sc-initials">${initials}</div>
        <div class="sc-score" id="scScore">${score}</div>
        <h3 class="sc-tag">${tag}</h3>
        <p class="sc-quote">"${tagline}"</p>
        <div class="sc-row">4 SNICKS · 4 MOMENTS · 1 CONNECTION</div>
        <div class="sc-cps">${CHECKPOINTS.map(f => `<span>${f.emoji}</span>`).join('<i>→</i>')}</div>
        <div class="sc-foot">CONNECT · PLAY · GROW</div>
        <div class="sc-date">${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}</div>
      </div>
      <div class="story-ctas">
        <button class="cta primary" id="shareBtn">SHARE YOUR MAP 🫶</button>
        <button class="cta ghost" id="downloadBtn">SAVE AS IMAGE ↓</button>
      </div>
    </section>

    <section class="act campaign-act">
      <p class="kicker">A GLIMPSE OF WHAT'S COMING</p>
      <h2>COUPLES WILL POST THEIR MAPS.</h2>
      <div class="float-cards">
        <div class="float-card c1"><b>87 — THE OBSERVER</b><span>👀</span><i>SAMPLE</i></div>
        <div class="float-card c2"><b>94 — THE UNSTOPPABLES</b><span>🔥</span><i>SAMPLE</i></div>
        <div class="float-card c3"><b>14 DAY STREAK</b><span>A + M</span><i>SAMPLE</i></div>
        <div class="float-card c4"><b>DEEPER WATERS REACHED</b><span>✦ R + S</span><i>SAMPLE</i></div>
        <div class="float-card c5"><b>4 SNICKS COMPLETE</b><span>✦</span><i>SAMPLE</i></div>
      </div>
      <p class="micro">Sample cards — these become real the moment couples start walking their maps.</p>
    </section>

    <section class="act worlds-act">
      <p class="kicker">YOUR MAP HAS ONLY JUST STARTED</p>
      <h2>REGIONS BEYOND THE FOG.</h2>
      <div class="world-grid">
        <div class="world open"><span class="w-emoji">🏕️</span><b>THE FOUR CHECKPOINTS</b><span class="w-state">OPEN NOW</span></div>
        <div class="world"><span class="w-emoji">🔒</span><b>CHALLENGE ARENA</b><span class="w-state">SOON</span></div>
        <div class="world"><span class="w-emoji">🔒</span><b>THE FLEX BOARD</b><span class="w-state">SOON</span></div>
        <div class="world"><span class="w-emoji">🔒</span>MEMORY WALL<b></b><span class="w-state">SOON</span></div>
      </div>
    </section>

    <section class="act board-act">
      <p class="kicker">SAMPLE BOARD · ILLUSTRATIVE PLAYERS</p>
      <p class="at">SEEN ACROSS THE WATER · THE REAL BOARD WAITS BEYOND THE FOG</p>
      <h2>WHO'S SHOWING UP?</h2>
      <div class="board">
        <div class="row"><span class="medal">🥇</span><b>A + M</b><span>1,842 XP</span><span class="streak">🔥 21 DAY STREAK</span></div>
        <div class="row"><span class="medal">🥈</span><b>R + S</b><span>1,790 XP</span><span class="streak">🔥 18</span></div>
        <div class="row"><span class="medal">🥉</span><b>K + P</b><span>1,641 XP</span><span class="streak">🔥 14</span></div>
      </div>
      <p class="micro">Illustrative sample data — no real couples yet. Can you two make the first real board?</p>
    </section>

    <section class="act waitlist-act" id="waitlist">
      <p class="kicker">THE NEXT REGION</p>
      <h2>BE THERE WHEN<br>THE FOG LIFTS.</h2>
      <p class="sub">"The first four checkpoints were only the beginning."</p>
      <form class="waitlist" id="waitlistForm">
        <label class="sr-only" for="wl-name">Your name</label>
        <input type="text" id="wl-name" name="name" placeholder="Your name" autocomplete="name" required />
        <label class="sr-only" for="wl-email">Your email address</label>
        <input type="email" id="wl-email" name="email" placeholder="you@together.com" autocomplete="email" required />
        <button class="cta primary" type="submit">JOIN THE WAITLIST →</button>
      </form>
      <p class="micro">Bring your person. We'll take it from there. 🫶</p>
    </section>

    <footer class="act footer-act">
      <img class="footer-logo" src="/logo.webp" alt="SnickyLink moon logo" width="88" height="88" loading="lazy" />
      <h2 class="footer-brand">SNICKYLINK</h2>
      <p class="sub">CONNECT. PLAY. GROW TOGETHER.</p>
      <p class="micro">© ${new Date().getFullYear()} SnickyLink — a little world for two.</p>
    </footer>
  `;
  ui.appendChild(acts);

  // ── score count-up animation ───────────────────────────────────────────
  const scoreNum = acts.querySelector('#scoreNum');
  let started = false;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !started) {
        started = true;
        animateScore(scoreNum, journey.score);
      }
    }
  }, { threshold: 0.4 });
  io.observe(scoreNum);

  // bars grow on reveal
  const barsIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        acts.querySelector('.bars').classList.add('grown');
        barsIO.disconnect();
      }
    }
  }, { threshold: 0.3 });
  barsIO.observe(acts.querySelector('.bars'));

  // ── waitlist submit → Google Form (with honest error state) ───────────
  const WAITLIST_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSfpvXYWIAXUl2ggcyJYrHn5ZOgUr8Z3Xm-Sjvn4GtPEJkLUug/formResponse';
  const WAITLIST_ENTRIES = { name: 'entry.1906209180', email: 'entry.646925955' };
  const form = acts.querySelector('#waitlistForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.dataset.busy) return;
    const data = new FormData(form);
    const params = new URLSearchParams();
    params.set(WAITLIST_ENTRIES.name, String(data.get('name') || ''));
    params.set(WAITLIST_ENTRIES.email, String(data.get('email') || ''));
    const btn = form.querySelector('button[type="submit"]');
    form.dataset.busy = '1';
    if (btn) { btn.disabled = true; btn.textContent = 'JOINING…'; }
    const oldErr = form.querySelector('.wl-error');
    if (oldErr) oldErr.remove();

    // no-cors responses are opaque (status unreadable) and can hang — race a timeout
    const attempt = fetch(WAITLIST_FORM, { method: 'POST', mode: 'no-cors', body: params });
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 9000));

    Promise.race([attempt, timeout]).then(() => {
      form.innerHTML = `<div class="joined-msg"><h2>YOU'RE IN. ✦</h2><p>Now go find your person.</p></div>`;
      document.body.classList.add('joined');
      journey.raw = Math.min(journey.raw, 0.984); // settle the camera
    }).catch(() => {
      delete form.dataset.busy;
      if (btn) { btn.disabled = false; btn.textContent = 'JOIN THE WAITLIST →'; }
      const msg = document.createElement('p');
      msg.className = 'wl-error';
      msg.setAttribute('role', 'alert');
      msg.textContent = "Couldn't reach the waitlist just now — check your connection and try again. 🫶";
      form.appendChild(msg);
    });
  });

  // ── share (best-effort, no backend) ───────────────────────────────────
  acts.querySelector('#shareBtn').addEventListener('click', async () => {
    const text = `${journey.initials} — ${journey.score} — ${journey.tag}\n4 SNICKS · 4 MOMENTS · 1 CONNECTION ✦\nSNICKYLINK`;
    if (navigator.share) {
      try { await navigator.share({ text, title: 'Our SnickyLink Map' }); } catch { /* cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(text); flash('Copied. Paste it anywhere. 🫶'); }
      catch { flash('Sharing is blocked in this browser — screenshot instead 📸'); }
    }
  });
  acts.querySelector('#downloadBtn').addEventListener('click', () => {
    flash('Screenshot the card — it was made for that. 📸');
  });
}

function animateScore(el, target) {
  const dur = 1600;
  const start = performance.now();
  const tick = (now) => {
    const t = clamp((now - start) / dur, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * target);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function flash(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => t.classList.remove('show'), 2400);
  setTimeout(() => t.remove(), 2800);
}

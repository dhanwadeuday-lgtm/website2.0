/* SNICKYLINK — interactive Snick experience */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================
     SCREEN NAVIGATION
     ===================================================== */
  const screens = $$('.screen');
  function goTo(name){
    screens.forEach(s => s.classList.toggle('is-active', s.dataset.screen === name));
  }

  /* =====================================================
     SCREEN 1 — HOOK: orbiting dots that react to the cursor
     ===================================================== */
  const orbit = $('#orbit');
  const dotA = $('.orbit__dot--a'), dotB = $('.orbit__dot--b');
  if (!reduceMotion && dotA && dotB) {
    let mx = innerWidth/2, my = innerHeight/2;
    const state = {ax:0,ay:0,bx:0,by:0};
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; });
    (function raf(){
      const cx = innerWidth/2, cy = innerHeight/2;
      const nx = (mx-cx)/cx, ny = (my-cy)/cy;
      state.ax += ((nx*30) - state.ax) * 0.06;
      state.ay += ((ny*18) - state.ay) * 0.06;
      state.bx += ((-nx*30) - state.bx) * 0.06;
      state.by += ((-ny*18) - state.by) * 0.06;
      dotA.style.transform = `translate(${state.ax}px,${state.ay}px)`;
      dotB.style.transform = `translate(${state.bx}px,${state.by}px)`;
      requestAnimationFrame(raf);
    })();
  }
  const startBtn = $('#startBtn');
  if (startBtn && orbit) {
    startBtn.addEventListener('pointerenter', () => orbit.classList.add('is-linked'));
    startBtn.addEventListener('pointerleave', () => orbit.classList.remove('is-linked'));
    startBtn.addEventListener('click', () => goTo('person'));
  }

  /* =====================================================
     SCREEN 2 — CHOOSE YOUR PERSON
     ===================================================== */
  let chosenPerson = null;
  const personGrid = $('#personGrid');
  const personHint = $('#personHint');
  const personGoBtn = $('#personGoBtn');
  if (personGrid) {
    personGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.person-pill');
      if (!btn) return;
      $$('.person-pill', personGrid).forEach(p => { p.classList.remove('is-selected'); p.setAttribute('aria-checked','false'); });
      btn.classList.add('is-selected'); btn.setAttribute('aria-checked','true');
      chosenPerson = btn.dataset.person;
      personHint.classList.add('is-shown');
      personGoBtn.disabled = false;
    });
  }
  if (personGoBtn) personGoBtn.addEventListener('click', () => { resetSnick(); goTo('snick'); });

  /* =====================================================
     SCREEN 3 — THE SNICK: mixed interactive activities
     ===================================================== */
  const ACTIVITIES = [
    { id:1, type:'CHOOSE', paired:true,
      prompt:"Who's more likely to start unnecessary drama?", options:['Me','Them'] },
    { id:2, type:'GUESS', paired:true,
      prompt:"Pick the movie genre they'd secretly love.", options:['Horror','Rom-com','Sci-fi','Documentary'] },
    { id:3, type:'REACT', paired:true, reaction:true,
      prompt:"Immediate reaction to: 3am texts", emojis:['😍','😂','😬','🙄','😴'] },
    { id:4, type:'CHALLENGE', timed:10,
      prompt:"One word for your friendship. You've got 10 seconds." },
    { id:5, type:'MEMORY',
      prompt:"Pick the vibe that reminds you of them.",
      options:['🌊 spontaneous trip','🍜 late-night food run','🎧 comfortable silence','🔥 chaotic energy'] },
    { id:6, type:'CREATE',
      prompt:"Give them a nickname based on this Snick." },
  ];
  const MICRO = ['interesting choice…','okay, we see you.','that was suspicious.','you really think that?',"let's find out.",'no cheating 👀'];

  const activityEl = $('#activity');
  const snickCount = $('#snickCount');
  const snickFill = $('#snickFill');
  const snickMicro = $('#snickMicro');
  const passOverlay = $('#passOverlay');
  const passName = $('#passName');
  const passReadyBtn = $('#passReadyBtn');

  let idx = 0;
  let answers = {};
  let pendingPairedValue = null;
  let microTimer = null;

  function resetSnick(){
    idx = 0; answers = {};
    renderActivity();
  }

  function updateBar(){
    const n = ACTIVITIES.length;
    snickCount.textContent = `SNICK ${String(idx+1).padStart(2,'0')} — ${String(n).padStart(2,'0')}`;
    snickFill.style.width = (idx / n * 100) + '%';
    if (idx % 2 === 1) {
      snickMicro.textContent = MICRO[Math.floor(Math.random()*MICRO.length)];
      snickMicro.classList.add('is-shown');
      clearTimeout(microTimer);
      microTimer = setTimeout(() => snickMicro.classList.remove('is-shown'), 2200);
    } else {
      snickMicro.classList.remove('is-shown');
    }
  }

  function nextActivity(){
    idx++;
    if (idx >= ACTIVITIES.length) { showReveal(); return; }
    renderActivity();
  }

  function renderActivity(){
    updateBar();
    const a = ACTIVITIES[idx];
    if (a.paired) { pendingPairedValue = null; renderTurn(a, 'a'); }
    else renderSolo(a);
  }

  function renderTurn(a, turn){
    activityEl.innerHTML = `
      <p class="activity__type">${a.type}${a.reaction ? '' : ' · match?'}</p>
      <p class="activity__prompt">${a.prompt}</p>
      ${a.emojis
        ? `<div class="emoji-row">${a.emojis.map(em => `<button class="emoji-btn" data-v="${em}">${em}</button>`).join('')}</div>`
        : `<div class="activity__options">${a.options.map(o => `<button class="opt-btn" data-v="${o}">${o}</button>`).join('')}</div>`}
    `;
    const picker = a.emojis ? $$('.emoji-btn', activityEl) : $$('.opt-btn', activityEl);
    picker.forEach(btn => btn.addEventListener('click', () => {
      picker.forEach(b => b.classList.remove('is-picked'));
      btn.classList.add('is-picked');
      const val = btn.dataset.v;
      setTimeout(() => onTurnAnswered(a, turn, val), 260);
    }));
  }

  function onTurnAnswered(a, turn, val){
    answers[a.id] = answers[a.id] || {};
    answers[a.id][turn] = val;
    if (turn === 'a') {
      passName.textContent = chosenPerson ? `Pass the phone to your ${chosenPerson.toLowerCase()} 👀` : 'Pass the phone to them 👀';
      passOverlay.hidden = false;
      passReadyBtn.onclick = () => { passOverlay.hidden = true; renderTurn(a, 'b'); };
    } else {
      renderPairedReveal(a);
    }
  }

  function renderPairedReveal(a){
    const {a: va, b: vb} = answers[a.id];
    if (a.reaction) {
      activityEl.innerHTML = `
        <p class="activity__type">REVEAL</p>
        <div class="reveal-pair">
          <div class="reveal-pair__cell"><span>${va}</span><small>you</small></div>
          <div class="reveal-pair__cell"><span>${vb}</span><small>them</small></div>
        </div>
        <p class="reveal-result__sub" style="margin-top:18px">${va === vb ? 'same wavelength 👀' : 'wildly different reactions'}</p>
        <button class="btn btn--primary activity__confirm" id="advBtn">Next <span class="arrow">→</span></button>
      `;
    } else {
      const match = va === vb;
      activityEl.innerHTML = `
        <p class="activity__type">REVEAL</p>
        <p class="reveal-result__word ${match ? 'is-match':'is-diff'}">${match ? 'MATCH' : 'DIFFERENT'}</p>
        <p class="reveal-result__sub">you: ${va} · them: ${vb}</p>
        <button class="btn btn--primary activity__confirm" id="advBtn">Next <span class="arrow">→</span></button>
      `;
    }
    $('#advBtn').addEventListener('click', nextActivity);
  }

  function renderSolo(a){
    if (a.type === 'CHALLENGE') {
      activityEl.innerHTML = `
        <p class="activity__type">CHALLENGE</p>
        <p class="activity__prompt">${a.prompt}</p>
        <div class="timer" id="timerNum">${a.timed}</div>
        <input type="text" id="soloInput" maxlength="24" placeholder="type it…" autocomplete="off">
        <button class="btn btn--primary activity__confirm" id="advBtn">Lock it in <span class="arrow">→</span></button>
      `;
      const timerNum = $('#timerNum');
      let t = a.timed;
      const iv = setInterval(() => {
        t--; timerNum.textContent = t >= 0 ? t : "time's up";
        if (t <= 0) clearInterval(iv);
      }, 1000);
      $('#advBtn').addEventListener('click', () => {
        clearInterval(iv);
        answers[a.id] = { value: ($('#soloInput').value.trim() || 'iykyk') };
        nextActivity();
      });
    } else if (a.type === 'MEMORY') {
      activityEl.innerHTML = `
        <p class="activity__type">MEMORY</p>
        <p class="activity__prompt">${a.prompt}</p>
        <div class="activity__options">${a.options.map(o => `<button class="opt-btn" data-v="${o}">${o}</button>`).join('')}</div>
      `;
      $$('.opt-btn', activityEl).forEach(btn => btn.addEventListener('click', () => {
        answers[a.id] = { value: btn.dataset.v };
        btn.classList.add('is-picked');
        setTimeout(nextActivity, 280);
      }));
    } else if (a.type === 'CREATE') {
      activityEl.innerHTML = `
        <p class="activity__type">CREATE</p>
        <p class="activity__prompt">${a.prompt}</p>
        <input type="text" id="soloInput" maxlength="20" placeholder="e.g. Chaos Gremlin" autocomplete="off">
        <button class="btn btn--primary activity__confirm" id="advBtn">Done <span class="arrow">→</span></button>
      `;
      const input = $('#soloInput');
      const submit = () => { answers[a.id] = { value: input.value.trim() || 'The Usual Suspect' }; nextActivity(); };
      $('#advBtn').addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    }
  }

  /* =====================================================
     SCREEN 4 — REVEAL: score + personality tag
     ===================================================== */
  const scoreNum = $('#scoreNum');
  const tagWord = $('#tagWord');
  const tagDesc = $('#tagDesc');
  const tagFlex = $('#tagFlex');

  const TAGS = [
    { min:92, word:'MIND READERS', desc:'You two basically share one brain.' },
    { min:80, word:'CHAOS PARTNERS', desc:'Zero normal conversations. Maximum fun.' },
    { min:65, word:'INSIDE JOKE FACTORY', desc:'You probably have way too many.' },
    { min:50, word:'PLOT TWIST PARTNERS', desc:"You never really know what's coming next." },
    { min:30, word:'QUESTIONABLE DUO', desc:'You know each other… apparently.' },
    { min:0,  word:'STILL FIGURING IT OUT', desc:'Interesting. Very interesting.' },
  ];

  let result = { score: 0, tag: TAGS[TAGS.length-1], snickNum: 0, nickname: '', mood: '', word: '' };

  function computeResult(){
    let score = 50 + (Math.random()*8 - 4);
    ACTIVITIES.forEach(a => {
      const ans = answers[a.id];
      if (!ans) return;
      if (a.paired) {
        const match = ans.a === ans.b;
        score += a.reaction ? (match ? 10 : 4) : (match ? 16 : 6);
      }
    });
    score = Math.max(6, Math.min(99, Math.round(score)));
    const tag = TAGS.find(t => score >= t.min);
    result = {
      score, tag,
      snickNum: 100 + Math.floor(Math.random()*900),
      nickname: (answers[6] && answers[6].value) || '',
      mood: (answers[5] && answers[5].value) || '',
      word: (answers[4] && answers[4].value) || '',
    };
  }

  function flexLine(score){
    if (score >= 80) return 'Okay, you two are showing off.';
    if (score < 30) return "Maybe don't show them this one. 💀";
    return "You can't keep this score to yourself. 👀";
  }

  function showReveal(){
    computeResult();
    goTo('reveal');
    scoreNum.innerHTML = `0<span class="score__pct">%</span>`;
    tagWord.textContent = '—';
    tagDesc.textContent = '';
    tagFlex.textContent = '';
    if (reduceMotion) {
      scoreNum.innerHTML = `${result.score}<span class="score__pct">%</span>`;
    } else {
      const dur = 900, start = performance.now();
      requestAnimationFrame(function tick(t){
        const p = Math.min(1, (t-start)/dur);
        const val = Math.round(result.score * (1 - Math.pow(1-p,3)));
        scoreNum.innerHTML = `${val}<span class="score__pct">%</span>`;
        if (p < 1) requestAnimationFrame(tick);
      });
    }
    setTimeout(() => {
      tagWord.textContent = result.tag.word;
      tagDesc.textContent = result.tag.desc;
      tagFlex.textContent = flexLine(result.score);
    }, reduceMotion ? 0 : 500);
  }

  $('#toCardBtn').addEventListener('click', () => { goTo('card'); drawStoryCard(); });

  /* =====================================================
     SCREEN 5 — STORY CARD (canvas, 1080x1920 / 9:16)
     ===================================================== */
  const canvas = $('#storyCanvas');
  const ctx = canvas.getContext('2d');
  const logoImg = new Image();
  logoImg.src = 'snickylink-logo.png';

  function wrapText(context, text, x, y, maxWidth, lineHeight){
    const words = text.split(' ');
    let line = '', lines = [];
    words.forEach(w => {
      const test = line ? line + ' ' + w : w;
      if (context.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
      else line = test;
    });
    if (line) lines.push(line);
    lines.forEach((l, i) => context.fillText(l, x, y + i*lineHeight));
    return lines.length;
  }

  function drawStoryCard(){
    const W = canvas.width, H = canvas.height;
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,'#6B2B3C'); grad.addColorStop(0.55,'#3A1620'); grad.addColorStop(1,'#1E0E13');
    ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

    // soft glow
    const glow = ctx.createRadialGradient(W*0.5,H*0.32,40,W*0.5,H*0.32,W*0.7);
    glow.addColorStop(0,'rgba(232,185,156,.28)'); glow.addColorStop(1,'rgba(232,185,156,0)');
    ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);

    ctx.textAlign = 'center';

    // wordmark
    ctx.fillStyle = 'rgba(251,238,228,.75)';
    ctx.font = '600 30px "Space Grotesk", sans-serif';
    ctx.fillText('SNICKYLINK', W/2, 150);

    ctx.fillStyle = 'rgba(232,185,156,.7)';
    ctx.font = '400 26px "JetBrains Mono", monospace';
    ctx.fillText(`SNICK #${result.snickNum}`, W/2, 200);

    // score
    ctx.fillStyle = '#E8B99C';
    ctx.font = 'italic 400 260px "Fraunces", serif';
    ctx.fillText(`${result.score}%`, W/2, 620);

    ctx.fillStyle = 'rgba(251,238,228,.55)';
    ctx.font = '400 28px "JetBrains Mono", monospace';
    ctx.fillText('VIBE SCORE', W/2, 680);

    // tag
    ctx.fillStyle = '#FBF4F1';
    ctx.font = 'italic 400 74px "Fraunces", serif';
    ctx.fillText(result.tag.word, W/2, 820);

    ctx.fillStyle = 'rgba(251,238,228,.7)';
    ctx.font = 'italic 400 34px "Fraunces", serif';
    wrapText(ctx, `"${result.tag.desc}"`, W/2, 890, W*0.72, 46);

    // personalized chips
    let y = 1080;
    if (result.nickname) {
      ctx.fillStyle = 'rgba(232,185,156,.65)';
      ctx.font = '400 24px "JetBrains Mono", monospace';
      ctx.fillText('NICKNAME EARNED', W/2, y);
      ctx.fillStyle = '#FBF4F1';
      ctx.font = 'italic 400 44px "Fraunces", serif';
      ctx.fillText(result.nickname, W/2, y+58);
      y += 130;
    }
    if (result.mood) {
      ctx.fillStyle = 'rgba(251,238,228,.55)';
      ctx.font = '400 30px "Space Grotesk", sans-serif';
      ctx.fillText(result.mood, W/2, y);
      y += 90;
    }

    // footer
    ctx.fillStyle = 'rgba(232,185,156,.55)';
    ctx.font = '400 24px "JetBrains Mono", monospace';
    ctx.fillText('· · ·', W/2, H-190);

    ctx.fillStyle = '#FBF4F1';
    ctx.font = '700 40px "Space Grotesk", sans-serif';
    ctx.fillText('WE SNICKED.', W/2, H-120);

    ctx.fillStyle = 'rgba(232,185,156,.75)';
    ctx.font = '400 28px "JetBrains Mono", monospace';
    ctx.fillText('@snickylink', W/2, H-72);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if ($('.screen--card').classList.contains('is-active')) drawStoryCard(); });
  }

  /* ---------- share / download / copy ---------- */
  const toast = $('#toast');
  function showToast(text){
    toast.textContent = text; toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-shown'));
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove('is-shown');
      setTimeout(() => toast.hidden = true, 400);
    }, 2200);
  }

  $('#shareBtn').addEventListener('click', async () => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'snickylink-story.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'We Snicked.', text: 'We Snicked. 👀' });
          return;
        } catch(_) { /* user cancelled — fall through */ }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'snickylink-story.png'; a.click();
      URL.revokeObjectURL(url);
      showToast('Saved — post it to your Story 👀');
    }, 'image/png');
  });

  $('#downloadBtn').addEventListener('click', () => {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href = url; a.download = 'snickylink-story.png'; a.click();
    showToast('Downloaded.');
  });

  $('#copyResultBtn').addEventListener('click', () => {
    const text = `SNICKYLINK\nSNICK #${result.snickNum}\n${result.score}% — ${result.tag.word}\n"${result.tag.desc}"\nWE SNICKED. @snickylink`;
    navigator.clipboard?.writeText(text).then(() => showToast('Result copied.')).catch(() => showToast('Could not copy — try again.'));
  });

  $('#copyLinkBtn').addEventListener('click', () => {
    navigator.clipboard?.writeText(location.href).then(() => showToast('Link copied.')).catch(() => showToast('Could not copy — try again.'));
  });

  $('#againBtn').addEventListener('click', () => { resetSnick(); goTo('snick'); });

})();

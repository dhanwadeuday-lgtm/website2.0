/* SNICKYLINK — motion & mystery */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const {gsap} = window;
  gsap.registerPlugin(ScrollTrigger);

  // Pre-hide all mask spans via GSAP so CSS % transforms don't fight yPercent
  gsap.set('.hero__title .word > span', {yPercent: 110});
  gsap.set('.beat__line .fx > span', {yPercent: 105});
  gsap.set('.foot__big .fx > span, .pair__head h2 .fx > span, .reveal .fx > span', {yPercent: 105});
  // Now hand control to JS — CSS fallback rules stop applying
  document.body.classList.add('js-ready');

  // ---------- Lenis smooth scroll (standalone RAF; GSAP ticker independent) ----------
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  function lenisRaf(time){ lenis.raf(time); ScrollTrigger.update(); requestAnimationFrame(lenisRaf); }
  requestAnimationFrame(lenisRaf);
  // Make sure GSAP's own ticker is awake (independent from Lenis)
  gsap.ticker.wake();

  // ---------- progress bar + persistent two-person thread ----------
  const progress = $('.progress');
  const thread = $('.thread');
  const threadLine = $('.thread__line i');
  const threadA = $('.thread__dot--a');
  const threadB = $('.thread__dot--b');
  let threadJoined = false;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      progress.style.setProperty('--p', (self.progress * 100) + '%');
      // dots "meet" by roughly the reveal section (~55% of the page)
      const meetProgress = Math.min(1, self.progress / 0.55);
      threadLine.style.setProperty('--tp', meetProgress);
      threadA.style.transform = `translateX(${meetProgress * 22}px)`;
      threadB.style.transform = `translateX(${-meetProgress * 22}px)`;
      if (meetProgress >= 1 && !threadJoined) {
        threadJoined = true;
        thread.classList.add('is-joined');
      } else if (meetProgress < 1 && threadJoined) {
        threadJoined = false;
        thread.classList.remove('is-joined');
      }
    },
  });

  // ---------- cursor glow ----------
  const glow = $('.cursor-glow');
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let gx = mx, gy = my;
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    glow.classList.add('on');
  });
  window.addEventListener('pointerleave', () => glow.classList.remove('on'));
  function glowRaf() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%)`;
    requestAnimationFrame(glowRaf);
  }
  glowRaf();

  // ---------- switch to dark body class based on section colors ----------
  const darkSections = $$('.mystery, .reveal, .snicks, .pair, .moment, .foot, .but');
  darkSections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 40%',
      end: 'bottom 40%',
      onToggle: (self) => {
        // Only apply dark from wine onwards (skip .but which does its own gradient)
        if (sec.classList.contains('but')) return;
        document.body.classList.toggle('dark', self.isActive);
      },
    });
  });

  // ---------- HERO — masked title reveal ----------
  const heroWords = $$('.hero__title .word > span');
  gsap.fromTo(heroWords,
    {yPercent: 110},
    {yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.2});
  gsap.from('.hero__eyebrow', {opacity: 0, y: 20, duration: 1, delay: 0.6});
  gsap.from('.hero__sub', {opacity: 0, y: 20, duration: 1, delay: 1.1});
  gsap.from('.hero__strike .strike', {opacity: 0, y: 10, duration: .6, stagger: .08, delay: 1.5, ease:'power2.out'});
  gsap.from('.hero__cta .btn', {opacity: 0, y: 16, duration: .7, stagger: .1, delay: 1.9, ease:'power2.out'});
  gsap.from('.proof__cell', {opacity: 0, y: 24, duration: .8, stagger: .09, delay: 2.2, ease:'power3.out'});
  gsap.from('.corner', {opacity: 0, duration: 1.2, stagger: .1, delay: 0.4});
  gsap.from('.side-rail', {opacity: 0, duration: 1.2, delay: 0.7});
  gsap.from('.stamp', {opacity: 0, scale: 0.6, duration: 1.2, delay: 0.9, ease:'back.out(1.8)', clearProps:'transform'});
  gsap.from('.scrap', {opacity: 0, duration: 1, stagger: .12, delay: 1.3, ease:'power3.out'});
  gsap.from('.ticker', {opacity: 0, y: 20, duration: 1, delay: 2.4, ease:'power2.out'});
  gsap.from('.hero__hint', {opacity: 0, duration: 1, delay: 2.6});

  // scraps drift subtly with cursor (parallax)
  window.addEventListener('pointermove', (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5);
    const ny = (e.clientY / window.innerHeight - 0.5);
    document.querySelectorAll('.scrap').forEach((el, i) => {
      const d = 12 + (i % 3) * 6;
      el.style.setProperty('--px', (nx * d) + 'px');
      el.style.setProperty('--py', (ny * d) + 'px');
    });
  });

  // hero dots follow cursor slightly + attract to each other
  const dotA = $('.pdot--a'), dotB = $('.pdot--b');
  const dotState = { ax:0, ay:0, bx:0, by:0, tax:0, tay:0, tbx:0, tby:0 };
  function dotsRaf(){
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const nx = (mx - cx) / cx; // -1..1
    const ny = (my - cy) / cy;
    // A follows cursor slightly and drifts toward B (right)
    dotState.tax = nx * 40 + Math.sin(performance.now()*0.001)*6;
    dotState.tay = ny * 24 + Math.cos(performance.now()*0.0013)*6;
    dotState.tbx = -nx * 40 + Math.cos(performance.now()*0.0009)*6;
    dotState.tby = -ny * 24 + Math.sin(performance.now()*0.0011)*6;
    dotState.ax += (dotState.tax - dotState.ax) * 0.06;
    dotState.ay += (dotState.tay - dotState.ay) * 0.06;
    dotState.bx += (dotState.tbx - dotState.bx) * 0.06;
    dotState.by += (dotState.tby - dotState.by) * 0.06;
    if (dotA) dotA.style.transform = `translate(${dotState.ax}px,${dotState.ay}px)`;
    if (dotB) dotB.style.transform = `translate(${dotState.bx}px,${dotState.by}px)`;
    requestAnimationFrame(dotsRaf);
  }
  dotsRaf();

  // ---------- Story beats — mask reveal ----------
  $$('.beat').forEach((beat) => {
    const spans = $$('.fx > span', beat);
    const kicker = $('.beat__kicker', beat);
    const aside = $('.beat__aside', beat);
    const extras = $$('.beat__extra', beat);
    ScrollTrigger.create({
      trigger: beat,
      start: 'top 78%',
      onEnter: () => {
        if (kicker) gsap.from(kicker, {opacity: 0, y: 14, duration: .7, ease: 'power2.out'});
        gsap.fromTo(spans, {yPercent: 105, y: 0}, {yPercent: 0, y: 0, duration: 1, ease: 'power3.out', stagger: 0.06, clearProps: 'y'});
        if (aside) gsap.from(aside, {opacity: 0, y: 18, duration: 1, delay: 0.3, ease: 'power2.out'});
        if (extras.length) gsap.from(extras, {opacity: 0, y: 30, rotate: (i)=>i%2?4:-4, duration: 1, delay: 0.2, stagger: 0.15, ease:'power3.out'});
      },
      once: true,
    });
    // gentle parallax
    gsap.to(beat, {
      yPercent: -6, ease: 'none',
      scrollTrigger: {trigger: beat, start:'top bottom', end:'bottom top', scrub:true},
    });
  });

  // ---------- BUT sticky moment ----------
  const butText = $('.but__text');
  if (butText) {
    gsap.fromTo(butText,
      {scale: 0.6, opacity: 0.2, letterSpacing: '0em'},
      {
        scale: 1.15, opacity: 1, letterSpacing: '-0.04em', ease: 'none',
        scrollTrigger: {
          trigger: '.but',
          start: 'top top',
          end: '+=100%',
          scrub: 0.5,
        },
      });
    gsap.to(butText, {
      opacity: 0.15, scale: 1.4, ease: 'none',
      scrollTrigger: {
        trigger: '.but',
        start: 'center top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }

  // ---------- MYSTERY dot chase (two cursors) ----------
  const mystSec = $('.mystery');
  if (mystSec) {
    gsap.to('.mystery__glow--a', {
      x: 160, y: 80, ease:'none',
      scrollTrigger:{trigger: mystSec, scrub:true, start:'top bottom', end:'bottom top'}
    });
    gsap.to('.mystery__glow--b', {
      x: -140, y: -60, ease:'none',
      scrollTrigger:{trigger: mystSec, scrub:true, start:'top bottom', end:'bottom top'}
    });
  }

  // ---------- CAGE bubbles fade + shake ----------
  const cage = $('.cage');
  if (cage) {
    gsap.from(cage, {
      opacity: 0, y: 30, duration: 1, ease:'power2.out',
      scrollTrigger:{trigger: cage, start: 'top 80%'},
    });
    ScrollTrigger.create({
      trigger: cage,
      start: 'top 60%',
      onEnter: () => {
        const bubbles = $$('.bubble', cage);
        gsap.from(bubbles, {opacity: 0, y: 12, duration: .8, stagger: 0.15, ease:'power2.out'});
      },
    });
  }

  // ---------- REVEAL — two dots meet -> spark -> logo ----------
  const revealSec = $('.reveal');
  if (revealSec) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: revealSec,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });
    tl.from('.reveal .eyebrow', {opacity: 0, y: 20, duration: .7})
      .fromTo('.reveal .fx > span', {yPercent: 105, y: 0}, {yPercent: 0, y: 0, duration: .9, stagger: 0.06, ease:'power3.out', clearProps:'y'}, '<0.2')
      .from('.cv-dot--a', {x: -80, opacity: 0, duration: .8, ease:'power2.out'}, '+=0.2')
      .from('.cv-dot--b', {x: 80, opacity: 0, duration: .8, ease:'power2.out'}, '<')
      .to('.cv-dot--a', {left: '50%', duration: 1.1, ease:'power2.inOut'}, '+=0.3')
      .to('.cv-dot--b', {left: '50%', duration: 1.1, ease:'power2.inOut'}, '<')
      .to('.cv-line', {scaleX: 1, duration: 1.1, ease:'power2.inOut'}, '<')
      .to('.cv-spark', {scale: 1, opacity: 1, duration: 0.4, ease:'power2.out'}, '-=0.1')
      .to('.cv-spark', {scale: 3, opacity: 0, duration: 0.9, ease:'power2.out'}, '+=0.1')
      .to('.logo-reveal img', {opacity: 1, scale: 1, duration: 1.2, ease:'power3.out'}, '-=0.7')
      .from('.reveal__tag', {opacity: 0, y: 16, duration: .8}, '-=0.5')
      .from('.reveal__cta-row .btn', {opacity: 0, y: 20, duration: .7, stagger: 0.12}, '-=0.3');
  }

  // ---------- SNICKS glow follow (hover spotlight, all cards) ----------
  $$('.snick').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--gx', x+'%');
      card.style.setProperty('--gy', y+'%');
    });
  });
  // reveal snick cards on scroll (entrance only — lock state handled separately)
  ScrollTrigger.batch('.snick', {
    start: 'top 85%',
    onEnter: (els) => gsap.from(els, {y: 40, opacity: 0, rotate: (i)=>i%2?3:-3, duration: 1, stagger: 0.12, ease:'power3.out'}),
    once: true,
  });

  // =====================================================
  // PAIR — secret-code couple registration
  // =====================================================
  const pair = $('.pair');
  const pairTabs = $('#pairTabs');
  const createView = document.querySelector('.pair__view[data-view="create"]');
  const joinView = document.querySelector('.pair__view[data-view="join"]');
  const pairConnected = $('#pairConnected');
  const codeCard = $('#codeCard');
  const codeCardValue = $('#codeCardValue');
  const waitingLine = $('#waitingLine');

  function genCode(){
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = 'SNK';
    for (let i=0;i<3;i++) out += letters[Math.floor(Math.random()*letters.length)];
    return out;
  }
  function storeKey(code){ return 'snicklink:code:' + code; }

  // ---- lead capture: currently persists locally; swap the marked line below
  // for a real fetch() once the backend endpoint (see design brief, section 5) is live.
  const LEADS_KEY = 'snicklink:leads';
  function submitLead(payload){
    let leads = [];
    try { leads = JSON.parse(localStorage.getItem(LEADS_KEY)) || []; } catch(_){ leads = []; }
    const already = leads.some(l => l.email.toLowerCase() === payload.email.toLowerCase());
    if (!already) {
      leads.push({ ...payload, created_at: new Date().toISOString() });
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    }
    // --- when the backend endpoint is ready, replace the block above with:
    // fetch('/api/v1/waitlist', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(payload)
    // }).catch(() => {}); // fail silently — never block the reveal on network issues
    return !already;
  }

  let myCode = null, myName = null, partnerName = null;

  if (pairTabs){
    pairTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.pair__tab');
      if (!btn) return;
      $$('.pair__tab', pairTabs).forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');
      const tab = btn.dataset.tab;
      createView.hidden = tab !== 'create';
      joinView.hidden = tab !== 'join';
    });
  }

  const createForm = $('#createForm');
  if (createForm){
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      myName = $('#p1Name').value.trim() || 'your person';
      const myEmail = $('#p1Email').value.trim();
      myCode = genCode();
      submitLead({ name: myName, email: myEmail, code: myCode, role: 'creator', source: 'website-pair-flow' });
      localStorage.setItem(storeKey(myCode), JSON.stringify({name: myName, email: myEmail, joined: false}));
      createForm.hidden = true;
      codeCard.hidden = false;
      codeCardValue.textContent = myCode;
      $('#avatarALabel').textContent = `${myName} · person 1`;
      $('#avatarAInitial').textContent = myName[0].toUpperCase();
      gsap.from(codeCard, {opacity: 0, y: 20, duration: .8, ease: 'power3.out'});
      // watch for the other person joining (works across tabs on this browser)
      window.addEventListener('storage', (ev) => {
        if (ev.key === storeKey(myCode)) {
          try {
            const data = JSON.parse(ev.newValue);
            if (data && data.joined) becomeConnected(data.partnerName || 'them');
          } catch(_){}
        }
      });
      // also poll, in case the other tab already joined moments ago
      const poll = setInterval(() => {
        try {
          const data = JSON.parse(localStorage.getItem(storeKey(myCode)));
          if (data && data.joined) { clearInterval(poll); becomeConnected(data.partnerName || 'them'); }
        } catch(_){}
      }, 1500);
    });
  }

  const joinForm = $('#joinForm');
  const pairFound = $('#pairFound');
  const pairError = $('#pairError');
  let foundCode = null;
  if (joinForm){
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = $('#joinCodeInput').value.trim().toUpperCase();
      const raw = localStorage.getItem(storeKey(code));
      pairError.hidden = true; pairFound.hidden = true;
      if (raw){
        try {
          const data = JSON.parse(raw);
          foundCode = code;
          $('#foundName').textContent = data.name || 'your person';
          pairFound.hidden = false;
          gsap.from(pairFound, {opacity:0, y:16, duration:.6});
        } catch(_) { pairError.hidden = false; }
      } else {
        pairError.hidden = false;
      }
    });
  }
  const joinBtn = $('#joinExperienceBtn');
  if (joinBtn){
    joinBtn.addEventListener('click', () => {
      if (!foundCode) return;
      const raw = localStorage.getItem(storeKey(foundCode));
      let data = {};
      try { data = JSON.parse(raw) || {}; } catch(_){}
      myName = 'you';
      data.joined = true;
      data.partnerName = myName;
      localStorage.setItem(storeKey(foundCode), JSON.stringify(data));
      $('#avatarBLabel').textContent = `${data.name || 'them'} · person 2`;
      becomeConnected(data.name || 'them');
    });
  }

  function becomeConnected(otherName){
    partnerName = otherName;
    pair.classList.add('connected');
    createView.hidden = true; joinView.hidden = true;
    if (waitingLine) waitingLine.textContent = `${otherName} joined. you're both in.`;
    pairConnected.hidden = false;
    gsap.from(pairConnected, {opacity:0, y:24, duration:.9, ease:'power3.out'});
    // unlock the couple's first Snick
    unlockToIndex(0);
  }

  if (pair){
    gsap.from('.pair__head .kicker', {opacity: 0, y: 12, duration:.8, scrollTrigger:{trigger:pair,start:'top 70%'}});
    gsap.fromTo('.pair__head h2 .fx > span', {yPercent: 105, y: 0}, {yPercent: 0, y: 0, duration:1, stagger:.06, ease:'power3.out', clearProps:'y', scrollTrigger:{trigger:pair,start:'top 70%'}});
    gsap.from('.pair__head p', {opacity: 0, y: 20, duration:.9, scrollTrigger:{trigger:pair,start:'top 65%'}});
    gsap.from('.pair__panel', {opacity: 0, y: 30, duration:1, ease:'power3.out', scrollTrigger:{trigger:'.pair__panel',start:'top 80%'}});
  }
  const copyBtn = $('#copyCodeBtn');
  if (copyBtn){
    copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(codeCardValue.textContent.trim()).catch(()=>{});
      const orig = copyBtn.textContent;
      copyBtn.textContent = 'copied ✓';
      setTimeout(()=>copyBtn.textContent = orig, 1600);
    });
  }
  const shareBtn = $('#shareCodeBtn');
  if (shareBtn){
    shareBtn.addEventListener('click', async () => {
      const code = codeCardValue.textContent.trim();
      const text = `come be my person on Snickylink 👀 use code ${code}`;
      if (navigator.share) { try { await navigator.share({text}); return; } catch(_){} }
      navigator.clipboard?.writeText(text).catch(()=>{});
      const orig = shareBtn.textContent;
      shareBtn.textContent = 'copied ✓';
      setTimeout(()=>shareBtn.textContent = orig, 1600);
    });
  }

  // reveal-hero CTA -> show the playful hint, then scroll
  const startBtn = $('#startExperienceBtn');
  const needPersonHint = $('#needPersonHint');
  if (startBtn && needPersonHint){
    startBtn.addEventListener('click', () => {
      needPersonHint.classList.add('is-shown');
      setTimeout(() => {
        document.querySelector('.pair').scrollIntoView({behavior:'smooth', block:'start'});
      }, 1100);
    });
  }

  // =====================================================
  // SNICKS — sequential unlockable secrets + task modal
  // =====================================================
  const SNICKS = [
    {
      eyebrow: 'SNICK · 01 — notice', title: 'Notice Something',
      prompt: "Look at your partner for a moment. Find one little thing about them that you genuinely love. Tell them.",
      done: "Sometimes the smallest things are the ones we remember.",
      toast: "one down.",
      body: () => `<label><span>the little thing you noticed</span><textarea id="snickInput0" rows="3" placeholder="the way you…"></textarea></label>`,
      canComplete: () => ($('#snickInput0')?.value.trim().length || 0) > 0,
    },
    {
      eyebrow: 'SNICK · 02 — play', title: 'Make Them Laugh',
      prompt: "You have 60 seconds. Make your partner laugh without using the same joke, meme, or pickup line you've used before.",
      done: "Okay… that was actually fun.",
      toast: "okay… that was cute.",
      body: () => `<div class="modal-timer" id="snickTimer">60</div><button type="button" class="modal-timer-btn" id="startTimerBtn">start the clock</button>`,
      afterRender: () => {
        const timerEl = $('#snickTimer');
        const btn = $('#startTimerBtn');
        if (!btn) return;
        btn.addEventListener('click', () => {
          let t = 60; btn.disabled = true; btn.style.opacity = .4;
          const iv = setInterval(() => {
            t--; if (timerEl) timerEl.textContent = t;
            if (t <= 0) { clearInterval(iv); if (timerEl) timerEl.textContent = "time's up 😂"; }
          }, 1000);
        });
      },
      canComplete: () => true,
    },
    {
      eyebrow: 'SNICK · 03 — connect', title: 'Ask Something Real',
      prompt: "Ask each other: What's something you've always wanted us to do together?",
      done: "Now you know a little more about each other.",
      toast: "you two are getting good at this.",
      body: () => `
        <label><span>you said</span><input type="text" id="snickInput2a" placeholder="I've always wanted us to…"></label>
        <label><span>they said</span><input type="text" id="snickInput2b" placeholder="they've always wanted us to…"></label>`,
      canComplete: () => ($('#snickInput2a')?.value.trim().length || 0) > 0 && ($('#snickInput2b')?.value.trim().length || 0) > 0,
    },
    {
      eyebrow: 'SNICK · 04 — create', title: 'Make A Moment',
      prompt: "Take one photo together. Don't pose. Don't make it perfect. Just capture this moment.",
      done: "YOU MADE A MOMENT.",
      toast: null,
      body: () => `
        <div class="modal-file">
          <div id="snickFilePreview"></div>
          <input type="file" accept="image/*" id="snickFileInput">
          <span style="font-family:var(--serif);font-style:italic;color:rgba(251,238,228,.5);font-size:13px">optional — but it's more fun with proof.</span>
        </div>`,
      afterRender: () => {
        const input = $('#snickFileInput');
        if (!input) return;
        input.addEventListener('change', () => {
          const file = input.files && input.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => { momentPhotoDataUrl = reader.result; $('#snickFilePreview').innerHTML = `<img src="${reader.result}" alt="">`; };
          reader.readAsDataURL(file);
        });
      },
      canComplete: () => true,
    },
  ];

  let currentSnick = 0; // index of the next snick to complete
  let momentPhotoDataUrl = null;
  const snickCards = $$('.snick');
  const spDots = $$('.sp-dot');

  function renderSnickStates(){
    snickCards.forEach((card, i) => {
      card.classList.remove('is-locked','is-mystery','is-current','unlocked');
      const status = card.querySelector('.status-line');
      const lockSvg = card.querySelector('.snick__lock svg');
      if (i < currentSnick){
        card.classList.add('unlocked');
        if (lockSvg) lockSvg.innerHTML = '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        if (status) status.textContent = 'okay… you earned this';
      } else if (i === currentSnick){
        card.classList.add('is-current');
        if (status) status.textContent = 'unlocked · tap to open';
      } else {
        card.classList.add('is-mystery','is-locked');
        if (status) status.textContent = `locked · needs #0${i}`;
      }
    });
    spDots.forEach((d,i) => {
      d.classList.toggle('is-done', i < currentSnick);
      d.classList.toggle('is-current', i === currentSnick);
    });
  }
  // before the couple connects, every snick stays mysterious
  renderSnickStates();
  snickCards.forEach(c => { c.classList.add('is-mystery','is-locked'); c.classList.remove('is-current'); });

  function unlockToIndex(i){
    currentSnick = i;
    snickCards.forEach(c => c.classList.remove('is-mystery','is-locked'));
    renderSnickStates();
  }

  // modal wiring
  const modal = $('#snickModal');
  const modalBackdrop = $('#snickModalBackdrop');
  const modalClose = $('#snickModalClose');
  const modalEyebrow = $('#modalEyebrow');
  const modalTitle = $('#modalTitle');
  const modalPrompt = $('#modalPrompt');
  const modalBody = $('#modalBody');
  const modalCompleteBtn = $('#modalCompleteBtn');
  const modalDoneLine = $('#modalDoneLine');

  function openSnickModal(index){
    const s = SNICKS[index];
    if (!s) return;
    modalEyebrow.textContent = s.eyebrow;
    modalTitle.textContent = s.title;
    modalPrompt.textContent = s.prompt;
    modalBody.innerHTML = s.body();
    modalDoneLine.hidden = true;
    modalCompleteBtn.hidden = false;
    modalCompleteBtn.textContent = 'Done →';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (s.afterRender) s.afterRender();
    modalCompleteBtn.onclick = () => completeSnick(index);
  }
  function closeSnickModal(){
    modal.hidden = true;
    document.body.style.overflow = '';
  }
  if (modalClose) modalClose.addEventListener('click', closeSnickModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeSnickModal);

  function completeSnick(index){
    const s = SNICKS[index];
    if (s.canComplete && !s.canComplete()) return;
    modalDoneLine.textContent = s.done;
    modalDoneLine.hidden = false;
    modalCompleteBtn.hidden = true;
    setTimeout(() => {
      closeSnickModal();
      const card = snickCards[index];
      // unlock animation on the just-completed card
      card.classList.add('unlocked');
      card.classList.remove('is-current');
      const lockSvg = card.querySelector('.snick__lock svg');
      if (lockSvg) lockSvg.innerHTML = '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      const status = card.querySelector('.status-line');
      if (status) status.textContent = 'okay… you earned this';
      gsap.fromTo(card, {rotateY: 0}, {rotateY: 6, duration: 0.18, yoyo: true, repeat: 3, ease:'sine.inOut', onComplete:()=>gsap.to(card,{rotateY:0,duration:.2})});
      gsap.fromTo(card, {boxShadow: '0 0 0 rgba(232,185,156,0)'}, {boxShadow: '0 30px 80px -20px rgba(232,185,156,.35)', duration: .8});

      if (index < SNICKS.length - 1){
        if (s.toast) showToast(s.toast);
        setTimeout(() => unlockToIndex(index + 1), 500);
      } else {
        // final snick done — cinematic final moment
        showToast("don't worry, it gets better.");
        setTimeout(() => revealFinalMoment(), 900);
      }
    }, 1500);
  }

  snickCards.forEach((card) => {
    card.addEventListener('click', () => {
      const i = Number(card.dataset.snick);
      if (card.classList.contains('is-current')) openSnickModal(i);
    });
    card.addEventListener('keypress', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && card.classList.contains('is-current')) openSnickModal(Number(card.dataset.snick));
    });
  });

  // small floating toast, reused for snick microcopy
  function showToast(text){
    const el = document.createElement('div');
    el.className = 'tag-float';
    el.textContent = text;
    el.style.cssText = 'left:50%;top:14px;transform:translateX(-50%);position:fixed;z-index:210;opacity:0';
    document.body.appendChild(el);
    gsap.timeline()
      .to(el, {opacity:1, y:8, duration:.5, ease:'power2.out'})
      .to(el, {opacity:0, y:-6, duration:.6, delay:1.6, ease:'power2.in', onComplete:()=>el.remove()});
  }

  // ---------- FINAL MOMENT cinematic ----------
  function revealFinalMoment(){
    document.querySelector('.moment').scrollIntoView({behavior:'smooth', block:'start'});
    if (momentPhotoDataUrl){
      $('#momentPhotoImg').src = momentPhotoDataUrl;
      $('#momentPhotoImg').hidden = false;
      $('#momentPhotoEmpty').style.display = 'none';
    }
    const tl = gsap.timeline({delay: .6});
    tl.from('.moment__photo', {opacity: 0, y: 30, duration: 1, ease:'power3.out'})
      .from('.moment__line--1', {opacity: 0, y: 20, duration: .9}, '+=0.3')
      .from('.moment__line--2', {opacity: 0, y: 20, duration: .9}, '+=0.9')
      .from('.moment__line--3', {opacity: 0, y: 20, duration: .9}, '+=0.9')
      .to('.moment__logo img', {opacity: 1, scale: 1, duration: 1.1, ease:'power3.out'}, '+=0.4')
      .from('.moment__tag', {opacity: 0, y: 12, duration: .8}, '-=0.4')
      .from('.moment__cta', {opacity: 0, y: 16, duration: .7}, '-=0.3');
  }

  // ---------- FLOAT DOODLES gentle drift ----------
  $$('.doodle, .tag-float').forEach((el, i) => {
    gsap.to(el, {
      y: (i%2?18:-18), x: (i%2?-10:10),
      duration: 3 + (i%3), repeat: -1, yoyo: true, ease: 'sine.inOut',
      delay: i*0.15,
    });
  });

  // ---------- FOOTER big text reveal ----------
  gsap.fromTo('.foot__big .fx > span', {yPercent: 105, y: 0}, {
    yPercent: 0, y: 0, duration: 1, stagger: 0.08, ease:'power3.out', clearProps:'y',
    scrollTrigger:{trigger:'.foot', start:'top 70%'}
  });

  // ---------- Tiny gen-z whispers — random tag pop-ins ----------
  const whispers = ['psst…','you two 👀','okay this is cute','don\'t spoil it','ready?','not yet','shhh'];
  const whisperHost = $('.hero');
  if (whisperHost){
    let i = 0;
    setInterval(() => {
      const el = document.createElement('div');
      el.className = 'tag-float';
      el.textContent = whispers[i++ % whispers.length];
      el.style.cssText += `left:${8+Math.random()*82}%;top:${20+Math.random()*60}%;opacity:0`;
      whisperHost.appendChild(el);
      gsap.timeline()
        .to(el,{opacity:1,y:-8,duration:.6,ease:'power2.out'})
        .to(el,{opacity:0,y:-24,duration:.8,delay:1.4,ease:'power2.in',
                onComplete:()=>el.remove()});
    }, 3800);
  }

  // ---------- respect prefers-reduced-motion ----------
  if (matchMedia('(prefers-reduced-motion: reduce)').matches){
    gsap.globalTimeline.timeScale(0.001);
  }
})();

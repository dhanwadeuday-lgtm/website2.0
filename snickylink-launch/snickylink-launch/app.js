/* ============================================================
   SNICKYLINK — app logic
   scroll engine · helix camera · snick interactions · story card · waitlist
   ============================================================ */

(function(){
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const lerp = (a,b,t) => a + (b-a)*t;
  const clamp = (v, min=0, max=1) => Math.min(max, Math.max(min, v));
  const easeInOut = t => t<.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;

  // ---------- Scroll progress ----------
  const stage = $("#stage");
  const cam   = $("#cam");
  const scrollRoot = $("#scroll");
  const railBar = $("#railBar");
  const railPct = $("#railPct");
  const chapterLabel = $("#chapterLabel");
  const dotYou = $("#dotYou"), dotThem = $("#dotThem"), thread = $("#thread");
  const chapters = $$(".ch");

  let progress = 0, chapterName = "SEED";

  // Chapter to scroll % mapping (rough)
  const CHAPTER_ORDER = [
    ["SEED", 0.00, 0.10],
    ["WATER · STEM", 0.10, 0.24],
    ["FOUR SNICKS · LOCKED", 0.24, 0.36],
    ["SNICK 01 · NOTICE", 0.36, 0.48],
    ["SNICK 02 · PLAY", 0.48, 0.60],
    ["SNICK 03 · CONNECT", 0.60, 0.72],
    ["SNICK 04 · CREATE", 0.72, 0.84],
    ["THE BLOOM", 0.84, 1.00],
  ];

  function computeProgress(){
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress = clamp(window.scrollY / Math.max(1, total));
    // update css var
    document.documentElement.style.setProperty("--p", progress.toFixed(4));
    // rail
    railBar.style.setProperty("--p", progress.toFixed(4));
    railPct.textContent = String(Math.round(progress*100)).padStart(2,"0");
    // chapter label
    const cur = CHAPTER_ORDER.find(c => progress >= c[1] && progress < c[2]) || CHAPTER_ORDER[CHAPTER_ORDER.length-1];
    if (cur[0] !== chapterName){
      chapterName = cur[0];
      chapterLabel.textContent = cur[0];
    }
    // helix camera — subtle rotation as user scrolls
    const rot = Math.sin(progress * Math.PI * 2.2) * 8; // deg
    const tx  = Math.cos(progress * Math.PI * 2.2) * 12; // px
    // scale rose down slightly as we head into payoff so text has room
    const camZ = progress * 20;
    cam.style.transform = `perspective(1400px) rotateY(${rot.toFixed(2)}deg) translateX(${tx.toFixed(1)}px) translateZ(${camZ}px)`;
    // helix glow ramp
    document.documentElement.style.setProperty("--helix-glow", (progress).toFixed(3));

    // ----- rose stem + leaves driven by SCROLL (until snick chapter) -----
    // stem grows 0 -> 1 across 0.05 .. 0.32
    const stemP = clamp((progress - 0.05) / (0.32 - 0.05));
    if (window.Rose) window.Rose.setStem(stemP);
    // leaves 0 -> 1 across 0.12 .. 0.40
    const leafP = clamp((progress - 0.12) / (0.40 - 0.12));
    if (window.Rose) window.Rose.setLeaves(leafP);

    // stage opacity — fade out slightly at the very bottom so waitlist reads
    const stageOpacity = 1 - clamp((progress - 0.92) / 0.08) * 0.3;
    stage.style.opacity = stageOpacity;
  }

  // scroll listener throttled with rAF
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking){
      requestAnimationFrame(() => { computeProgress(); ticking = false; });
      ticking = true;
    }
  }, {passive:true});
  window.addEventListener("resize", computeProgress);

  // ---------- IntersectionObserver — chapter reveal + side effects ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add("in");
        const cname = e.target.dataset.chapter;
        // water trigger at "WATER · STEM"
        if (cname === "WATER · STEM" && !e.target.dataset.watered){
          e.target.dataset.watered = "1";
          setTimeout(() => window.Rose && window.Rose.playWater(), 400);
          setTimeout(() => window.Rose && window.Rose.playWater(), 2200);
        }
      }
    });
  }, {threshold: 0.18});
  chapters.forEach(c => io.observe(c));

  // ---------- Snicks — locked orbit unlock ----------
  const dualConfirm = $("#dualConfirm");
  const lockedOrbit = $("#lockedOrbit");
  const joinerLine  = $("#joinerLine");
  const unlockedMsg = $("#unlockedMsg");
  const partnerState = { you:false, them:false };
  const chips = $$(".snick-chip", lockedOrbit);

  function checkUnlock(){
    if (partnerState.you && partnerState.them){
      $(".joiner").classList.add("lit");
      // dots + thread in top rail
      dotYou.classList.add("on");
      dotThem.classList.add("on");
      thread.classList.add("lit");
      // stagger unlock chips
      chips.forEach((c,i) => setTimeout(()=> c.classList.add("unlocked"), 250 + i*180));
      unlockedMsg.hidden = false;
      // small water celebration
      setTimeout(() => window.Rose && window.Rose.playWater(), 800);
    }
  }

  $$(".side-btn", dualConfirm).forEach(btn => {
    btn.addEventListener("click", () => {
      const r = btn.dataset.role;
      btn.classList.add("on");
      partnerState[r] = true;
      checkUnlock();
    });
  });

  // ---------- HUD ----------
  const hud = $("#hud");
  const hudXp = $("#hudXp"), hudSnicks = $("#hudSnicks"), hudStreak = $("#hudStreak");
  let xp = 0, snicksDone = 0, streak = 0;
  function updateHud(){
    hud.hidden = false;
    hudXp.textContent = xp;
    hudSnicks.innerHTML = `${snicksDone}<i>/4</i>`;
    hudStreak.textContent = `${streak} 🔥`;
  }

  // ---------- Snick cards ----------
  const SNICK_META = {
    "1": { label: "SNICK 01", bloom: 1 },
    "2": { label: "SNICK 02", bloom: 2 },
    "3": { label: "SNICK 03", bloom: 3 },
    "4": { label: "SNICK 04", bloom: 4 },
  };

  $$(".snick-card").forEach(card => {
    const n = card.dataset.snick;
    const partners = { you:false, them:false };
    const btns = $$(".mini-btn", card);
    btns.forEach(b => {
      b.addEventListener("click", () => {
        const r = b.dataset.role;
        if (partners[r]) return;
        partners[r] = true;
        b.classList.add("done");
        if (partners.you && partners.them){
          completeSnick(n, card);
        }
      });
    });
  });

  function completeSnick(n, card){
    // reveal footer
    const rev = $(".reveal", card);
    if (rev) rev.hidden = false;
    // mark chip in locked orbit as complete
    const chip = $(`.snick-chip[data-i="${n}"]`, lockedOrbit);
    if (chip) { chip.classList.add("complete"); chip.classList.add("unlocked"); }
    // open matching bloom
    if (window.Rose) window.Rose.openBloom(Number(n));
    // xp + snicks
    xp += 20;
    snicksDone += 1;
    if (Number(n) === 2) streak = 1;
    updateHud();
    // small water for bloom
    setTimeout(() => window.Rose && window.Rose.playWater(), 300);
  }

  // ---------- Snick 02 timer ----------
  const timerBtn = $("#timerBtn");
  const timerVal = $("#timerVal");
  if (timerBtn){
    let running=false, remaining=60, iv=null;
    const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
    timerBtn.addEventListener("click", () => {
      if (running) return;
      running = true;
      timerBtn.classList.add("running");
      $(".t-lbl", timerBtn).textContent = "GO!";
      iv = setInterval(() => {
        remaining -= 1;
        timerVal.textContent = fmt(Math.max(0, remaining));
        if (remaining <= 0){
          clearInterval(iv);
          $(".t-lbl", timerBtn).textContent = "TIME'S UP";
          timerBtn.classList.remove("running");
          running = false;
        }
      }, 1000);
    });
  }

  // ---------- Snick 04 chips ----------
  $$("#memoryPick .chip").forEach(c => {
    c.addEventListener("click", () => {
      $$("#memoryPick .chip").forEach(x => x.classList.remove("picked"));
      c.classList.add("picked");
    });
  });

  // ---------- Score animate ----------
  const scoreNum = $("#scoreNum");
  let scoreAnimated = false;
  const scoreIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !scoreAnimated){
        scoreAnimated = true;
        const target = 87;
        const start = performance.now();
        const dur = 1600;
        (function tick(now){
          const t = clamp((now - start) / dur);
          scoreNum.textContent = Math.round(target * easeInOut(t));
          if (t < 1) requestAnimationFrame(tick);
          else scoreNum.textContent = String(target);
        })(start);
      }
    });
  }, {threshold: 0.5});
  const scoreEl = $(".ch-score");
  if (scoreEl) scoreIo.observe(scoreEl);

  // ---------- Story card inputs ----------
  const initA = $("#initA"), initB = $("#initB");
  const scA = $("#scA"), scB = $("#scB"), scDate = $("#scDate");
  const storyDate = $("#storyDate");
  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  function fmtDate(d){
    const dt = d instanceof Date ? d : new Date(d);
    return `${MONTHS[dt.getMonth()]} · ${dt.getFullYear()}`;
  }
  // default date = today
  const today = new Date();
  const iso = today.toISOString().slice(0,10);
  if (storyDate) storyDate.value = iso;
  if (scDate) scDate.textContent = fmtDate(today);

  function syncStoryCard(){
    if (scA) scA.textContent = (initA.value || "A").slice(0,2).toUpperCase();
    if (scB) scB.textContent = (initB.value || "M").slice(0,2).toUpperCase();
    if (storyDate && storyDate.value) scDate.textContent = fmtDate(storyDate.value);
  }
  [initA, initB, storyDate].forEach(el => el && el.addEventListener("input", syncStoryCard));

  // ---------- Story card PNG download (canvas rendering) ----------
  $("#dlStory") && $("#dlStory").addEventListener("click", () => {
    renderStoryPNG().then(dataUrl => {
      const a = document.createElement("a");
      a.href = dataUrl;
      const A = (initA.value || "A").toUpperCase();
      const B = (initB.value || "M").toUpperCase();
      a.download = `snickylink-${A}+${B}-bloom.png`;
      document.body.appendChild(a); a.click(); a.remove();
    });
  });

  async function renderStoryPNG(){
    const W = 1080, H = 1920;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const g = cv.getContext("2d");

    // Background gradient — blush -> peach with warm radial
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#FBF4F1");
    grad.addColorStop(.55, "#F6E1D2");
    grad.addColorStop(1, "#E8B99C");
    g.fillStyle = grad;
    g.fillRect(0,0,W,H);
    // top radial
    const rgrad = g.createRadialGradient(W/2, 0, 40, W/2, 0, W*.9);
    rgrad.addColorStop(0, "rgba(232,185,156,.35)");
    rgrad.addColorStop(1, "rgba(232,185,156,0)");
    g.fillStyle = rgrad;
    g.fillRect(0,0,W,H*.6);

    // Inner frame
    g.strokeStyle = "rgba(58,22,32,.18)";
    g.lineWidth = 3;
    roundRect(g, 48, 48, W-96, H-96, 64); g.stroke();

    // Top row: mark + date
    g.fillStyle = "#6B2B3C";
    g.font = "500 34px 'JetBrains Mono', monospace";
    g.textBaseline = "top";
    g.textAlign = "left";
    g.fillText("✦ SNICKYLINK", 100, 110);
    g.textAlign = "right";
    g.fillStyle = "#B8654A";
    g.fillText(scDate.textContent, W-100, 110);

    // Initials block (center-ish)
    const A = (initA.value || "A").toUpperCase().slice(0,2);
    const B = (initB.value || "M").toUpperCase().slice(0,2);
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#6B2B3C";
    g.font = "italic 260px 'Instrument Serif', serif";
    const initY = H * 0.34;
    g.fillText(A, W/2 - 180, initY);
    g.fillText(B, W/2 + 180, initY);
    // plus
    g.fillStyle = "#B8654A";
    g.font = "italic 120px 'Instrument Serif', serif";
    g.fillText("+", W/2, initY + 20);

    // Score
    g.fillStyle = "#6B2B3C";
    g.font = "italic 320px 'Instrument Serif', serif";
    g.fillText("87", W/2, H * 0.58);
    g.font = "500 26px 'JetBrains Mono', monospace";
    g.fillStyle = "#B8654A";
    g.fillText("CONNECTION SCORE", W/2, H * 0.68);

    // Tag
    g.fillStyle = "#3A1620";
    g.font = "500 74px 'Instrument Serif', serif";
    g.fillText("THE OBSERVER 👀", W/2, H * 0.76);
    g.fillStyle = "#6B2B3C";
    g.font = "italic 42px 'Instrument Serif', serif";
    g.fillText("\"You two notice the little things.\"", W/2, H * 0.81);

    // Blooms row
    const by = H * 0.87;
    const spacing = 90;
    const colors = ["#FBF4F1", "#F2C94C", "#F5B8C7", "#6B2B3C"];
    const sizes  = [28, 28, 28, 40];
    const cx0 = W/2 - spacing * 1.5;
    for (let i=0;i<4;i++){
      g.beginPath();
      g.fillStyle = colors[i];
      g.arc(cx0 + i*spacing, by, sizes[i], 0, Math.PI*2);
      g.fill();
      g.strokeStyle = "rgba(58,22,32,.15)";
      g.lineWidth = 2;
      g.stroke();
      if (i < 3){
        g.fillStyle = "#B8654A";
        g.font = "500 22px 'JetBrains Mono', monospace";
        g.fillText("→", cx0 + i*spacing + spacing/2, by);
      }
    }

    // Footer
    g.fillStyle = "#6B2B3C";
    g.font = "500 24px 'JetBrains Mono', monospace";
    g.fillText("4 SNICKS · 4 MOMENTS · 1 CONNECTION", W/2, H * 0.93);
    g.fillStyle = "#B8654A";
    g.font = "500 22px 'JetBrains Mono', monospace";
    g.fillText("CONNECT · PLAY · GROW", W/2, H * 0.955);

    return cv.toDataURL("image/png");
  }

  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y,   x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x,   y+h, r);
    ctx.arcTo(x,   y+h, x,   y,   r);
    ctx.arcTo(x,   y,   x+w, y,   r);
    ctx.closePath();
  }

  // ---------- Floating social cards ----------
  const floatCards = $("#floatCards");
  if (floatCards){
    const items = [
      { A:"A", B:"M", score:87, tag:"THE OBSERVER 👀", streak:14, tone:0 },
      { A:"R", B:"S", score:91, tag:"THE SOFTIES 🫶", streak:23, tone:1 },
      { A:"K", B:"P", score:78, tag:"THE CHAOS DUO 😂", streak:9,  tone:2 },
      { A:"J", B:"L", score:84, tag:"THE MIDNIGHTERS 🌙", streak:31, tone:0 },
      { A:"N", B:"E", score:95, tag:"THE UNSTOPPABLES 🔥", streak:44, tone:1 },
      { A:"T", B:"O", score:82, tag:"THE ADVENTURERS ✨", streak:12, tone:2 },
    ];
    const positions = [
      { x: "8%",  y: "10%", r: -8, d: 0 },
      { x: "24%", y: "48%", r:  5, d: 1.2 },
      { x: "40%", y: "5%",  r: -3, d: 2.4 },
      { x: "58%", y: "45%", r:  7, d: 3.6 },
      { x: "72%", y: "8%",  r: -6, d: 4.8 },
      { x: "86%", y: "48%", r:  4, d: 6 },
    ];
    const tones = [
      "linear-gradient(180deg,#FBF4F1,#E8B99C)",
      "linear-gradient(180deg,#FBF4F1,#F5B8C7)",
      "linear-gradient(180deg,#FBF4F1,#F2C94C)",
    ];
    items.forEach((it, i) => {
      const p = positions[i];
      const el = document.createElement("div");
      el.className = "fc";
      el.style.left = p.x;
      el.style.top  = p.y;
      el.style.setProperty("--r", p.r + "deg");
      el.style.animationDelay = p.d + "s";
      el.style.background = tones[it.tone];
      el.innerHTML = `
        <div>
          <div class="fc-mark">✦ SNICKYLINK</div>
          <div style="margin-top:8px; font-family:'Instrument Serif',serif; font-size:16px; letter-spacing:.03em; color:#6B2B3C">${it.A} + ${it.B}</div>
        </div>
        <div>
          <b>${it.score}</b>
          <div class="fc-tag" style="margin-top:4px">${it.tag}</div>
        </div>
        <div class="fc-streak">🔥 ${it.streak} DAY STREAK</div>
      `;
      floatCards.appendChild(el);
    });
  }

  // ---------- Waitlist — embedded Google Form ----------
  // The waitlist is now the live Google Form embedded via iframe (#waitEmbed).
  // A subtle "bloom" pulse plays once the section scrolls into view.
  const waitEmbed = $("#waitEmbed");
  if (waitEmbed && "IntersectionObserver" in window){
    const waitObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting){
          window.Rose && window.Rose.playWater && window.Rose.playWater();
          waitObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    waitObserver.observe(waitEmbed);
  }

  // ---------- Particles (soft floating dots inside the stage) ----------
  const particles = $("#particles");
  if (particles){
    for (let i=0; i<18; i++){
      const el = document.createElement("i");
      el.style.left = Math.random()*100 + "%";
      el.style.setProperty("--dx", (Math.random()*40-20)+"vw");
      el.style.animationDuration = (10 + Math.random()*14) + "s";
      el.style.animationDelay = (Math.random()*10) + "s";
      particles.appendChild(el);
    }
  }

  // ---------- kick ----------
  computeProgress();
})();

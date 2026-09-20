/* ============================================================
   SNICKYLINK — the rose (SVG builder)
   All animation controlled via JS setters exposed on window.Rose
   ============================================================ */

(function(){
  const NS = "http://www.w3.org/2000/svg";
  const wrap = document.getElementById("rose");
  if (!wrap) return;

  // Build a rose flower group — editorial rose anatomy
  function bloomGroup(id, color, cx, cy, tilt, opts){
    const g = document.createElementNS(NS, "g");
    g.setAttribute("id", id);
    g.classList.add("bloom");
    // Data for later transforms
    g.dataset.cx = cx; g.dataset.cy = cy; g.dataset.tilt = tilt;

    g.innerHTML = `
      <g class="bloom-inner">
        <!-- shadow -->
        <ellipse class="petal-shadow" cx="0" cy="10" rx="34" ry="8" fill="rgba(0,0,0,.35)" opacity=".6"/>

        <!-- outer petals -->
        <g class="ring outer">
          ${[0,72,144,216,288].map(a => `
            <path transform="rotate(${a})"
              d="M0 -6 C 26 -18, 40 -6, 34 14 C 22 30, -22 30, -34 14 C -40 -6, -26 -18, 0 -6 Z"
              fill="${opts.dark}" opacity=".9"/>
          `).join("")}
        </g>

        <!-- mid petals -->
        <g class="ring mid">
          ${[36,108,180,252,324].map(a => `
            <path transform="rotate(${a})"
              d="M0 -4 C 18 -14, 30 -4, 24 12 C 14 22, -14 22, -24 12 C -30 -4, -18 -14, 0 -4 Z"
              fill="${color}"/>
          `).join("")}
        </g>

        <!-- inner cup -->
        <g class="ring inner">
          ${[0,90,180,270].map(a => `
            <path transform="rotate(${a})"
              d="M0 -3 C 10 -10, 18 -3, 14 8 C 8 14, -8 14, -14 8 C -18 -3, -10 -10, 0 -3 Z"
              fill="${opts.light}" opacity=".95"/>
          `).join("")}
        </g>

        <!-- heart -->
        <g class="ring core">
          <circle r="6" fill="${opts.dark}"/>
          <circle r="3" cx="-1" cy="-1" fill="${opts.light}" opacity=".8"/>
        </g>

        <!-- highlight -->
        <ellipse cx="-8" cy="-10" rx="8" ry="4" fill="rgba(255,255,255,.35)" opacity=".55"/>
      </g>
    `;

    // Position at start with scale 0
    g.setAttribute("transform", `translate(${cx} ${cy}) rotate(${tilt}) scale(0)`);
    g.style.opacity = "0";
    return g;
  }

  function stemPath(){
    return "M200 500 C 210 440, 180 380, 195 320 C 210 260, 180 200, 200 140 C 215 110, 200 100, 200 90";
  }

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 400 600");
  svg.setAttribute("preserveAspectRatio", "xMidYMax meet");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <defs>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="soilGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#3a2018"/>
        <stop offset="60%" stop-color="#22110d"/>
        <stop offset="100%" stop-color="#120806"/>
      </radialGradient>
      <radialGradient id="ambient" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="rgba(232,185,156,.16)"/>
        <stop offset="100%" stop-color="rgba(232,185,156,0)"/>
      </radialGradient>
      <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6a8a5a"/>
        <stop offset="80%" stop-color="#3a5a35"/>
        <stop offset="100%" stop-color="#2a3f28"/>
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7fa16a"/>
        <stop offset="100%" stop-color="#3a5a35"/>
      </linearGradient>
    </defs>

    <rect width="400" height="600" fill="url(#ambient)"/>

    <g class="soil">
      <ellipse cx="200" cy="520" rx="150" ry="30" fill="url(#soilGrad)"/>
      <ellipse cx="200" cy="510" rx="140" ry="20" fill="#2a1610" opacity=".7"/>
      ${Array.from({length:26}).map(()=>{
        const x = 60 + Math.random()*280, y = 500 + Math.random()*24, r = .5+Math.random()*1.5;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#4a2818" opacity="${(.2+Math.random()*.5).toFixed(2)}"/>`;
      }).join("")}
      <circle cx="130" cy="522" r="3" fill="#3a2418"/>
      <circle cx="270" cy="524" r="2.5" fill="#2a1a10"/>
      <circle cx="80" cy="515" r="2" fill="#3a2418"/>
      <circle cx="310" cy="516" r="2.2" fill="#2a1a10"/>
    </g>

    <g class="seed" id="seed">
      <ellipse cx="200" cy="500" rx="8" ry="11" fill="#3a2418" transform="rotate(-6 200 500)"/>
      <ellipse cx="200" cy="500" rx="5" ry="9" fill="#4a2f22" transform="rotate(-6 200 500)"/>
      <ellipse cx="198" cy="497" rx="2" ry="3" fill="#6a4a35" opacity=".7"/>
      <path class="seed-crack" id="seedCrack" d="M198 493 Q 200 500 202 508" stroke="#f0c493" stroke-width="1" fill="none" opacity="0"/>
    </g>

    <g class="drop" id="drop" style="opacity:0">
      <path id="dropShape" d="M200 100 C 208 108, 212 118, 200 124 C 188 118, 192 108, 200 100 Z"
            fill="#b8dcee" opacity=".9" filter="url(#glow)"/>
    </g>
    <g class="ripple" id="ripple" style="opacity:0">
      <ellipse cx="200" cy="510" rx="10" ry="3" fill="none" stroke="#b8dcee" stroke-width="1.2"/>
    </g>

    <path id="stem"
      d="${stemPath()}"
      stroke="url(#stemGrad)"
      stroke-width="6"
      stroke-linecap="round"
      fill="none"
      pathLength="1"
      stroke-dasharray="1 1"
      stroke-dashoffset="1"
    />

    <g class="leaves">
      <g class="leaf leaf-1" id="leaf1" style="opacity:0" transform="translate(200 400) scale(0)">
        <path d="M0 0 C -30 -10, -60 -4, -70 10 C -60 20, -30 22, 0 10 Z" fill="url(#leafGrad)"/>
        <path d="M0 5 C -25 4, -50 8, -68 12" stroke="#2a3f28" stroke-width=".8" fill="none" opacity=".5"/>
      </g>
      <g class="leaf leaf-2" id="leaf2" style="opacity:0" transform="translate(200 300) scale(0)">
        <path d="M0 0 C 28 -12, 55 -8, 66 6 C 55 18, 28 20, 0 8 Z" fill="url(#leafGrad)"/>
        <path d="M0 3 C 22 3, 44 6, 62 10" stroke="#2a3f28" stroke-width=".8" fill="none" opacity=".5"/>
      </g>
      <g class="leaf leaf-3" id="leaf3" style="opacity:0" transform="translate(200 210) scale(0)">
        <path d="M0 0 C -18 -8, -36 -4, -42 6 C -36 14, -18 16, 0 8 Z" fill="url(#leafGrad)"/>
      </g>
    </g>

    <g class="buds">
      <g class="bud" id="bud1" style="opacity:0" transform="translate(160 220) scale(0)">
        <ellipse cx="0" cy="0" rx="7" ry="9" fill="#4a5a3a"/>
        <ellipse cx="0" cy="-2" rx="4" ry="6" fill="#6a7a4a" opacity=".8"/>
      </g>
      <g class="bud" id="bud2" style="opacity:0" transform="translate(245 190) scale(0)">
        <ellipse cx="0" cy="0" rx="7" ry="9" fill="#4a5a3a"/>
        <ellipse cx="0" cy="-2" rx="4" ry="6" fill="#6a7a4a" opacity=".8"/>
      </g>
      <g class="bud" id="bud3" style="opacity:0" transform="translate(155 140) scale(0)">
        <ellipse cx="0" cy="0" rx="7" ry="9" fill="#4a5a3a"/>
        <ellipse cx="0" cy="-2" rx="4" ry="6" fill="#6a7a4a" opacity=".8"/>
      </g>
      <g class="bud" id="bud4" style="opacity:0" transform="translate(200 90) scale(0)">
        <ellipse cx="0" cy="0" rx="9" ry="11" fill="#4a5a3a"/>
        <ellipse cx="0" cy="-2" rx="5" ry="8" fill="#6a7a4a" opacity=".9"/>
      </g>
    </g>

    <g id="blooms"></g>

    <ellipse id="groundGlow" cx="200" cy="530" rx="180" ry="14" fill="rgba(232,185,156,.28)" opacity="0"/>
  `;
  wrap.appendChild(svg);

  // Add petal transitions
  const style = document.createElement("style");
  style.textContent = `
    #stem{ transition: stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1); }
    .leaf{ transition: transform 1s cubic-bezier(.2,.7,.2,1), opacity .8s ease; }
    .bud{ transition: transform .8s cubic-bezier(.2,.7,.2,1), opacity .5s ease; }
    .bloom{ transition: transform 1.6s cubic-bezier(.2,.7,.2,1), opacity 1.2s ease; }
    .bloom .ring{ transform-box: fill-box; transform-origin: center; transition: transform 1.1s cubic-bezier(.2,.7,.2,1), opacity 1s; }
    .bloom .ring.outer{ transform: scale(.4); opacity:.4; }
    .bloom .ring.mid  { transform: scale(.35); opacity:.5; }
    .bloom .ring.inner{ transform: scale(.3); opacity:.6; }
    .bloom.open .ring.outer{ transform: scale(1); opacity:.95; transition-delay: 0s; }
    .bloom.open .ring.mid  { transform: scale(1); opacity:1;   transition-delay: .12s; }
    .bloom.open .ring.inner{ transform: scale(1); opacity:1;   transition-delay: .22s; }
    #bloom-4.open{ filter: drop-shadow(0 0 30px rgba(107,43,60,.7)) drop-shadow(0 0 60px rgba(184,101,74,.4)); }
    #groundGlow{ transition: opacity 1.6s ease; }
    .seed{ transition: opacity 1s ease; }
    #seedCrack{ transition: opacity .8s ease; }
  `;
  document.head.appendChild(style);

  const blooms = svg.querySelector("#blooms");
  blooms.appendChild(bloomGroup("bloom-1", "#f6ede5", 160, 220, -8, {dark:"#d9c9bc", light:"#ffffff"}));
  blooms.appendChild(bloomGroup("bloom-2", "#F2C94C", 245, 190,  6, {dark:"#c88e1a", light:"#fff2b8"}));
  blooms.appendChild(bloomGroup("bloom-3", "#F5B8C7", 155, 140, -6, {dark:"#c67a8e", light:"#ffe0e8"}));
  blooms.appendChild(bloomGroup("bloom-4", "#6B2B3C", 200,  90,  0, {dark:"#3A1620", light:"#B8654A"}));

  // -------- Rose controller --------
  const $ = id => document.getElementById(id);
  const els = {
    stem: $("stem"),
    seed: $("seed"),
    seedCrack: $("seedCrack"),
    leaf1: $("leaf1"), leaf2: $("leaf2"), leaf3: $("leaf3"),
    bud1: $("bud1"), bud2: $("bud2"), bud3: $("bud3"), bud4: $("bud4"),
    bloom1: $("bloom-1"), bloom2: $("bloom-2"), bloom3: $("bloom-3"), bloom4: $("bloom-4"),
    drop: $("drop"), dropShape: $("dropShape"),
    ripple: $("ripple"),
    groundGlow: $("groundGlow"),
  };

  const state = { stem: 0, leaf: 0 };

  function setStem(p){ // 0..1
    state.stem = p;
    els.stem.style.strokeDashoffset = String(1 - p);
    if (p > .1) els.seedCrack.style.opacity = "1";
    els.seed.style.opacity = String(Math.max(0, 1 - p * 2.5));
  }
  function setLeaves(p){ // 0..1
    state.leaf = p;
    // stagger
    [els.leaf1, els.leaf2, els.leaf3].forEach((leaf, i) => {
      const local = Math.min(1, Math.max(0, (p - i * 0.25) * 2));
      leaf.style.opacity = String(local);
      const cur = leaf.getAttribute("transform").replace(/scale\([^)]*\)/, "").trim();
      leaf.setAttribute("transform", `${cur} scale(${local})`);
    });
    // buds
    const buds = [els.bud1, els.bud2, els.bud3, els.bud4];
    buds.forEach((bud, i) => {
      const local = Math.min(1, Math.max(0, (p - 0.15 - i * 0.15) * 3));
      // don't override if bloom is open (we hide bud in openBloom)
      if (bud.dataset.hidden !== "1") {
        bud.style.opacity = String(local);
        const cur = bud.getAttribute("transform").replace(/scale\([^)]*\)/, "").trim();
        bud.setAttribute("transform", `${cur} scale(${local})`);
      }
    });
  }

  function openBloom(n){
    const bloom = els["bloom" + n];
    const bud = els["bud" + n];
    if (!bloom || bloom.dataset.open === "1") return;
    bloom.dataset.open = "1";
    const cx = bloom.dataset.cx, cy = bloom.dataset.cy, tilt = bloom.dataset.tilt;
    // small overshoot pop
    bloom.style.opacity = "1";
    bloom.setAttribute("transform", `translate(${cx} ${cy}) rotate(${tilt}) scale(1.15)`);
    bloom.classList.add("open");
    // hide bud
    if (bud) {
      bud.dataset.hidden = "1";
      bud.style.transition = "opacity .5s ease, transform .5s";
      bud.style.opacity = "0";
      const t = bud.getAttribute("transform").replace(/scale\([^)]*\)/, "");
      bud.setAttribute("transform", `${t} scale(0.4)`);
    }
    // settle to 1
    setTimeout(() => {
      bloom.setAttribute("transform", `translate(${cx} ${cy}) rotate(${tilt}) scale(1)`);
    }, 700);
    // final glow when all 4 open
    if (n === 4) {
      setTimeout(() => { els.groundGlow.style.opacity = "1"; }, 500);
    }
  }

  // Water drop animation — falls, then ripple
  let dropInFlight = false;
  function playWater(){
    if (dropInFlight) return;
    dropInFlight = true;
    const d = els.drop, r = els.ripple;
    // reset
    d.style.transition = "none";
    d.style.opacity = "0";
    d.style.transform = "translate(0px, -280px)";
    r.style.transition = "none";
    r.style.opacity = "0";
    r.setAttribute("transform", "translate(0,0) scale(0.2, 0.2)");
    // start
    requestAnimationFrame(() => {
      d.style.transition = "transform 1.1s cubic-bezier(.6,0,.9,.5), opacity .3s";
      d.style.opacity = "1";
      d.style.transform = "translate(0px, 380px)";
      setTimeout(() => {
        d.style.transition = "opacity .3s";
        d.style.opacity = "0";
        // ripple
        r.style.transition = "opacity .3s";
        r.style.opacity = ".9";
        r.style.transformOrigin = "200px 510px";
        r.style.transformBox = "fill-box";
        setTimeout(() => {
          r.style.transition = "transform 1.2s ease-out, opacity 1.2s ease-out";
          r.setAttribute("transform", "translate(0,0)");
          r.querySelector("ellipse").setAttribute("rx", "80");
          r.querySelector("ellipse").setAttribute("ry", "16");
          r.style.opacity = "0";
        }, 50);
        setTimeout(() => { dropInFlight = false; }, 1400);
      }, 1080);
    });
  }

  window.Rose = { setStem, setLeaves, openBloom, playWater };

  // Auto-tick idle: micro breath (very subtle bloom scale wobble)
  let t0 = performance.now();
  function breath(){
    const t = (performance.now() - t0) / 1000;
    [els.bloom1, els.bloom2, els.bloom3, els.bloom4].forEach((b, i) => {
      if (b.dataset.open === "1") {
        const cx = b.dataset.cx, cy = b.dataset.cy, tilt = b.dataset.tilt;
        const s = 1 + Math.sin(t * 0.8 + i) * 0.015;
        b.style.transition = "";
        b.setAttribute("transform", `translate(${cx} ${cy}) rotate(${tilt}) scale(${s})`);
      }
    });
    requestAnimationFrame(breath);
  }
  requestAnimationFrame(breath);
})();

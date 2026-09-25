const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/world-BQ64XrVh.js","assets/three.module-BT1pP-6r.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const p of c.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&o(p)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}})();const Z="modulepreload",z=function(e){return"/"+e},q={},W=function(t,s,o){let n=Promise.resolve();if(s&&s.length>0){let p=function(r){return Promise.all(r.map(h=>Promise.resolve(h).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const E=document.querySelector("meta[property=csp-nonce]"),i=(E==null?void 0:E.nonce)||(E==null?void 0:E.getAttribute("nonce"));n=p(s.map(r=>{if(r=z(r),r in q)return;q[r]=!0;const h=r.endsWith(".css"),m=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${m}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":Z,h||(d.as="script"),d.crossOrigin="",d.href=r,i&&d.setAttribute("nonce",i),document.head.appendChild(d),h)return new Promise((w,g)=>{d.addEventListener("load",w),d.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${r}`)))})}))}function c(p){const E=new Event("vite:preloadError",{cancelable:!0});if(E.payload=p,window.dispatchEvent(E),!E.defaultPrevented)throw p}return n.then(p=>{for(const E of p||[])E.status==="rejected"&&c(E.reason);return t().catch(c)})},M=(e,t,s)=>Math.min(s,Math.max(t,e)),ee=(e,t,s)=>e+(t-e)*s,_=(e,t,s)=>{const o=M((s-e)/(t-e||1e-6),0,1);return o*o*(3-2*o)},ue=(e,t,s,o)=>ee(e,t,1-Math.exp(-s*o)),Ee=(e,t,s=1.7,o=.05)=>Math.sin(e*s+t*12.9898)*o+Math.sin(e*s*.63+t*78.233)*o*.55,me=(()=>{const e=typeof window<"u"?window.innerWidth:1280,t=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,o=e<820||t;return{mobile:o,touch:t,particles:o?260:900,growthParticles:o?90:220,stemSegs:o?44:80,envQuality:o?"low":"high",dprCap:o?1.7:2,cameraAmplitude:o?.62:1}})(),L={spark:[0,.08],intro:[.08,.125],join:[.125,.17],cp1:[.17,.29],cp1lit:[.29,.325],cp2:[.325,.445],cp2lit:[.445,.48],cp3:[.48,.6],cp3lit:[.6,.63],cp4:[.63,.745],cp4lit:[.745,.775],arena:[.775,.825],board:[.825,.87],next:[.87,.93],finale:[.93,.985]};class te{constructor(){this.p=0,this.raw=0,this.vel=0,this.done=[!1,!1,!1,!1],this.joined=!1,this.score=87,this.tag="THE OBSERVER 👀",this.tagline="You two notice the little things.",this.initials="A + M",this.onCompleteCallbacks=[]}chapterProgress(t){const[s,o]=L[t];return M((this.p-s)/(o-s||1e-6),0,1)}inside(t){const[s,o]=L[t];return this.p>=s&&this.p<o}travel(){return M(this.p/.985,0,1)}syncLevel(){const t=this.done.filter(Boolean).length;return(this.joined?.35:0)+t/4*.65}litCount(){return this.done.filter(Boolean).length}get xp(){return this.done.filter(Boolean).length*20}snickState(t){const s=this.done.slice(0,t).every(Boolean);return this.done[t]?{state:"done"}:this.joined?s?{state:"live"}:{state:"locked",reason:"COMPLETE THE LAST SNICK FIRST"}:{state:"locked",reason:t===0?"YOUR PERSON IS MISSING":"REQUIRES TWO PLAYERS"}}completeSnick(t){if(!this.done[t]){this.done[t]=!0;for(const s of this.onCompleteCallbacks)s(t)}}joinPartner(){this.joined||(this.joined=!0)}}const l=new te,X=.985;function se(){let e=0;const t=i=>{e=M(i,0,1),l.raw=e*X},s=Number(sessionStorage.getItem("sl-progress")||0);s>0&&s<1&&(l.raw=s*X,l.p=l.raw);const o=i=>{document.body.classList.contains("in-dom")||(i.preventDefault(),t(e+i.deltaY*72e-6))};let n=0;const c=i=>{n=i.touches[0].clientY},p=i=>{if(!document.body.classList.contains("in-dom")){i.preventDefault();const r=n-i.touches[0].clientY;n=i.touches[0].clientY,t(e+r*34e-5)}},E=i=>{document.body.classList.contains("in-dom")||(["ArrowDown","PageDown"," ","ArrowRight"].includes(i.key)?(i.preventDefault(),t(e+.012)):["ArrowUp","PageUp","ArrowLeft"].includes(i.key)&&(i.preventDefault(),t(e-.012)))};return window.addEventListener("wheel",o,{passive:!1}),window.addEventListener("touchstart",c,{passive:!1}),window.addEventListener("touchmove",p,{passive:!1}),window.addEventListener("keydown",E),l.jumpTo=i=>t(i),{get ratio(){return e}}}const he={deepWine:3806752,peach:15251868,blush:16512241,copper:12084554,ink:1969683},$=[{id:0,name:"NOTICE",emoji:"👀",css:"#E8B99C"},{id:1,name:"PLAY",emoji:"🎈",css:"#E8B99C"},{id:2,name:"CONNECT",emoji:"💭",css:"#E8B99C"},{id:3,name:"CREATE",emoji:"📸",css:"#B8654A"}];function ne(e,t){const s=[],o=i=>i%2===0?"left":"right";function n(i,r,h,m={}){const d=document.createElement("section");return d.className=`chapter side-${m.side??o(s.length)} ${m.cls||""}`,d.dataset.range=r.join(","),d.innerHTML=h,e.appendChild(d),s.push({id:i,el:d,range:r,mode:m.mode||"text",...m}),d}n("spark",L.spark,`
    <div class="ch-inner">
      <p class="kicker">SNICKYLINK</p>
      <h1>MORE THAN<br>A CHAT.</h1>
      <p class="sub">A secret little world for two.</p>
      <p class="hint">scroll to set out ↓</p>
    </div>
  `,{side:"left"}),n("intro",L.intro,`
    <div class="ch-inner">
      <p class="kicker">THE MAP</p>
      <h2>FOUR CHECKPOINTS.<br>ONE PATH. TWO PEOPLE.</h2>
      <p class="sub">Each one hides a Snick — a tiny challenge you both complete together.</p>
      <div class="cp-list">
        ${$.map((i,r)=>`
          <div class="cp-row" data-i="${r}">
            <span class="cp-dot"></span>
            <b>0${r+1} · ${i.name}</b>
            <span class="cp-state">🔒 FOGGED</span>
          </div>
        `).join("")}
      </div>
    </div>
  `,{side:"right"}),n("join",L.join,`
    <div class="ch-inner center">
      <p class="kicker">ONE PLAYER DETECTED</p>
      <h2>THE PATH LIGHTS<br>ONLY FOR TWO. ✦</h2>
      <p class="sub">You're at the trailhead. Your person is still outside the world — the ghost marker on the path is theirs.</p>
      <div class="duo-box">
        <div class="duo-head">
          <span class="duo-title">DUO CODE</span>
          <span class="duo-wait">WAITING FOR YOUR PERSON…</span>
        </div>
        <div class="duo-code-row">
          <div class="duo-code-row">
          <code class="duo-code" id="duoCode">· · · ·</code>
          <div class="duo-actions">
            <button class="cta mini" id="duoGen">GET CODE</button>
            <button class="cta mini ghost" id="duoCopy">COPY</button>
          </div>
        </div>
        <button class="cta" id="joinBtn">BRING YOUR PERSON →</button>
        <button class="cta ghost demo" id="demoJoin">SIMULATE: THEY JOINED</button>
        <p class="micro">Sharing the code brings them in for real — the demo is just a preview of the moment.</p>
      </div>
    </div>
  `,{side:"center"});const c=[{emoji:"👀",name:"NOTICE",task:"“Find one tiny thing about them that you genuinely love — and tell them.”"},{emoji:"🎈",name:"PLAY",task:"“Make each other laugh in 60 seconds.”"},{emoji:"💭",name:"CONNECT",task:"“Ask something you’ve always wanted to do together.”"},{emoji:"📸",name:"CREATE",task:"“Create one tiny memory together.”"}],p=[{key:"cp1",place:"THE FIRST SPARK",lit:"cp1lit"},{key:"cp2",place:"PLAYGROUND",lit:"cp2lit"},{key:"cp3",place:"DEEPER WATERS",lit:"cp3lit"},{key:"cp4",place:"MEMORY PEAK",lit:"cp4lit"}];c.forEach((i,r)=>{const h=p[r];n(h.key,L[h.key],`
      <div class="ch-inner">
        <p class="kicker">CHECKPOINT 0${r+1} · ${h.place}</p>
        <div class="snick-live" data-i="${r}">
          <div class="snick-top">SNICK 0${r+1} · ${i.emoji} ${i.name}</div>

          <div class="snick-lock" aria-hidden="true">
            <div class="lock-glyph">🔒</div>
            <b class="lock-word">LOCKED</b>
            <span class="lock-reason">YOUR PERSON IS MISSING</span>
            <span class="lock-shimmer">?????? ??? ??? ???????</span>
          </div>

          <div class="snick-body" hidden>
            <h3>${i.task}</h3>
            <div class="partners">
              <button class="partner-chip" data-partner="you">YOU ✓</button>
              <button class="partner-chip" data-partner="them">YOUR PERSON ✓</button>
            </div>
            <div class="progress-line"><span></span></div>
            <p class="micro">Both of you complete it. That's the rule.</p>
            ${r===2?`
            <div class="two-way" hidden>
              <div class="tw-step">
                <input type="text" class="tw-input" maxlength="90" placeholder="Write your answer…" aria-label="Your secret answer" />
                <button class="cta mini" data-tw="lock">LOCK IN 🔒</button>
              </div>
              <p class="tw-note">The other side only sees “your person has locked in”. No preview. No peeking. Both reveal together.</p>
              <button class="cta mini" data-tw="reveal" hidden>DUAL UNMASK →</button>
            </div>
            <div class="tw-revealed" hidden>
              <div class="tw-col"><b>YOU</b><span data-tw="mine">—</span></div>
              <div class="tw-col"><b>YOUR PERSON</b><span data-tw="theirs">—</span></div>
            </div>
            <p class="micro" data-tw="done">Never alone. Always together. · +20 XP</p>
            `:""}
          </div>
        </div>
      </div>
    `,{side:r%2?"right":"left",mode:"snick",index:r}),n(h.lit,L[h.lit],`
      <div class="ch-inner center">
        <p class="kicker">+20 XP · CHECKPOINT 0${r+1} LIT</p>
        <h2>${h.place} IS AWAKE.</h2>
        <p class="sub">The beacon burns for you two.</p>
      </div>
    `,{side:"center"})}),n("arena",L.arena,`
    <div class="ch-inner center">
      <p class="kicker">AHEAD · LOCKED IN FOG</p>
      <h2>THE CHALLENGE ARENA.</h2>
      <p class="sub">Trials for two, carved as gates. Each one waits for a flame that only grows by showing up.</p>
      <div class="gate-list">
        <div class="gate-row"><span class="gate-flame">🔒</span><div><b>7 DAY FLAME</b><i>Keep showing up together.</i></div></div>
        <div class="gate-row"><span class="gate-flame">🔒</span><div><b>14 DAY FLAME</b><i>The fire wants feeding.</i></div></div>
        <div class="gate-row"><span class="gate-flame">🔒</span><div><b>1000 XP</b><i>The map remembers effort.</i></div></div>
        <div class="gate-row"><span class="gate-flame">🔒</span><div><b>100 SNICKS</b><i>Not yet. Not alone.</i></div></div>
      </div>
      <div class="locked-tag">THERE'S MORE OUT THERE.</div>
    </div>
  `,{side:"center"}),n("board",L.board,`
    <div class="ch-inner center">
      <p class="kicker">FURTHER ON · A GLIMPSE</p>
      <h2>THE FLEX BOARD.</h2>
      <p class="sub">Where showing-up streaks get celebrated. A sample preview lives at the end of this trail — no real couples yet.</p>
    </div>
  `,{side:"center"});const E=[{e:"🌿",n:"WORLD 01 · THE HONEYMOON GLADE",s:"KEEP SHOWING UP."},{e:"🔥",n:"WORLD 02 · SYNCHRONOUS ORBIT",s:"UNLOCKS WITH SHARED XP."},{e:"🗝️",n:"WORLD 03 · VULNERABILITY DUNGEON",s:"DEEPER CONNECTION REQUIRED."},{e:"✨",n:"WORLD 04 · CELESTIAL RESONANCE",s:"FAR BEYOND THE FOG."}];return n("next",L.next,`
    <div class="ch-inner center">
      <p class="kicker">BEYOND THE FOG · THE FIRST SKETCHES</p>
      <h2>SOMETHING IS WAITING<br>BEYOND THE FOG.</h2>
      <p class="sub">Four regions are already on the map. This path opens later — for the two of you.</p>
      <div class="world-tease">
        ${E.map(i=>`
          <div class="wt-row">
            <span class="wt-e" aria-hidden="true">${i.e}</span>
            <b>${i.n}</b><span class="wt-s">${i.s}</span>
          </div>`).join("")}
      </div>
    </div>
  `,{side:"center"}),n("finale",L.finale,`
    <div class="ch-inner center">
      <h1 class="hero-line">FOUR CHECKPOINTS.<br>ONE LIT PATH.</h1>
      <p class="sub">You walked it together.</p>
      <div class="cp-strip">${$.map(i=>`<span>${i.emoji}</span>`).join("<i>→</i>")}</div>
    </div>
  `,{side:"center"}),ae(t),s}function ae(e){var w,g;const t=l.score,s=l.initials,o=l.tag,n=l.tagline,c=document.createElement("div");c.id="dom-acts",c.innerHTML=`
    <section class="act score-act">
      <p class="kicker">YOUR RESULT</p>
      <h2>HOW IN-SYNC ARE YOU TWO?</h2>
      <p class="at">AT THE SCORE OBELISK · FINALE ISLAND</p>
      <div class="score-num" id="scoreNum">0</div>
      <div class="bars">
        ${[["COMMUNICATION",8],["PLAY",9],["EFFORT",8],["TRUST",9],["EMOTIONAL SYNC",8]].map(([f,S])=>`
          <div class="bar-row">
            <span class="bar-label">${f}</span>
            <span class="bar"><i style="--w:${S}0%"></i></span>
          </div>
        `).join("")}
      </div>
      <p class="micro">A playful SnickyLink metric — not science, and this one's a sample preview. Your real score comes from actually showing up together.</p>
    </section>

    <section class="act tag-act">
      <p class="kicker">YOUR COUPLE TAG</p>
      <h2 class="tag-name">${o}</h2>
      <p class="at">CARVED INTO THE TAG ARCH</p>
      <p class="quote">"${n}"</p>
      <div class="share-hint">A sample tag — yours gets written when you two play.</div>
    </section>

    <section class="act story-act">
      <p class="kicker">9:16 · MADE FOR SHARING</p>
      <p class="at">HELD BY THE STORY STELE</p>
      <div class="story-card" id="storyCard">
        <img class="sc-logo" src="/logo.webp" alt="SnickyLink moon logo" width="34" height="34" loading="lazy" />
        <div class="sc-brand">SNICKYLINK</div>
        <div class="sc-initials">${s}</div>
        <div class="sc-score" id="scScore">${t}</div>
        <h3 class="sc-tag">${o}</h3>
        <p class="sc-quote">"${n}"</p>
        <div class="sc-row">4 SNICKS · 4 MOMENTS · 1 CONNECTION</div>
        <div class="sc-cps">${$.map(f=>`<span>${f.emoji}</span>`).join("<i>→</i>")}</div>
        <div class="sc-foot">CONNECT · PLAY · GROW</div>
        <div class="sc-date">${new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase()}</div>
      </div>
      <div class="story-ctas">
        <button class="cta primary" id="shareBtn">SHARE YOUR MAP 🫶</button>
        <button class="cta ghost" id="downloadBtn">SAVE AS IMAGE ↓</button>
      </div>
    </section>

    <section class="act finale-act">
      <p class="kicker">THE FIRST MAP · <b id="xpTotal">${l.xp} XP</b></p>
      <h2>THIS IS JUST<br>THE FIRST MAP.</h2>
      <p class="sub">There are more places to discover — the gate behind you leads to worlds you can't see yet.</p>
      <div class="final-ctas">
        <button class="cta primary" id="finalBring">BRING YOUR PERSON →</button>
        <button class="cta ghost" id="nextWorld">ENTER THE NEXT WORLD →</button>
      </div>
      <p class="micro">A map for two that grows as you do.</p>
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
        <div class="world open"><span class="w-emoji">🏕️</span><b>THE FIRST MAP</b><span class="w-state">OPEN NOW</span></div>
        <div class="world"><span class="w-emoji">🌿</span><b>WORLD 01 · THE HONEYMOON GLADE</b><span class="w-state">LOCKED</span></div>
        <div class="world"><span class="w-emoji">🔥</span><b>WORLD 02 · SYNCHRONOUS ORBIT</b><span class="w-state">REQUIRES SHARED XP</span></div>
        <div class="world"><span class="w-emoji">🗝️</span><b>WORLD 03 · VULNERABILITY DUNGEON</b><span class="w-state">DEEPER CONNECTION</span></div>
        <div class="world"><span class="w-emoji">✨</span><b>WORLD 04 · CELESTIAL RESONANCE</b><span class="w-state">FAR BEYOND THE FOG</span></div>
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
        <div class="row you-row"><span class="medal">—</span><b>YOU + YOUR PERSON</b><span>0 XP</span><span class="streak">YOUR FLAME STARTS HERE</span></div>
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
  `,e.appendChild(c);const p=c.querySelector("#scoreNum");let E=!1;new IntersectionObserver(f=>{for(const S of f)S.isIntersecting&&!E&&(E=!0,oe(p,l.score))},{threshold:.4}).observe(p);const r=new IntersectionObserver(f=>{for(const S of f)S.isIntersecting&&(c.querySelector(".bars").classList.add("grown"),r.disconnect())},{threshold:.3});r.observe(c.querySelector(".bars"));const h="https://docs.google.com/forms/d/e/1FAIpQLSfpvXYWIAXUl2ggcyJYrHn5ZOgUr8Z3Xm-Sjvn4GtPEJkLUug/formResponse",m={name:"entry.1906209180",email:"entry.646925955"},d=c.querySelector("#waitlistForm");d.addEventListener("submit",f=>{if(f.preventDefault(),d.dataset.busy)return;const S=new FormData(d),Y=new URLSearchParams;Y.set(m.name,String(S.get("name")||"")),Y.set(m.email,String(S.get("email")||""));const N=d.querySelector('button[type="submit"]');d.dataset.busy="1",N&&(N.disabled=!0,N.textContent="JOINING…");const I=d.querySelector(".wl-error");I&&I.remove();const j=fetch(h,{method:"POST",mode:"no-cors",body:Y}),P=new Promise((k,T)=>setTimeout(()=>T(new Error("timeout")),9e3));Promise.race([j,P]).then(()=>{d.innerHTML=`<div class="joined-msg"><h2>YOU'RE IN. ✦</h2><p>Now go find your person.</p></div>`,document.body.classList.add("joined"),l.raw=Math.min(l.raw,.984)}).catch(()=>{delete d.dataset.busy,N&&(N.disabled=!1,N.textContent="JOIN THE WAITLIST →");const k=document.createElement("p");k.className="wl-error",k.setAttribute("role","alert"),k.textContent="Couldn't reach the waitlist just now — check your connection and try again. 🫶",d.appendChild(k)})}),c.querySelector("#shareBtn").addEventListener("click",async()=>{const f=`${l.initials} — ${l.score} — ${l.tag}
4 SNICKS · 4 MOMENTS · 1 CONNECTION ✦
SNICKYLINK`;if(navigator.share)try{await navigator.share({text:f,title:"Our SnickyLink Map"})}catch{}else try{await navigator.clipboard.writeText(f),F("Copied. Paste it anywhere. 🫶")}catch{F("Sharing is blocked in this browser — screenshot instead 📸")}}),c.querySelector("#downloadBtn").addEventListener("click",()=>{F("Screenshot the card — it was made for that. 📸")}),(w=c.querySelector("#finalBring"))==null||w.addEventListener("click",()=>{document.body.classList.remove("in-dom"),l.jumpTo(.14)}),(g=c.querySelector("#nextWorld"))==null||g.addEventListener("click",()=>{F("The next world opens when the map grows. 🗝️")})}function oe(e,t){const o=performance.now(),n=c=>{const p=M((c-o)/1600,0,1),E=1-Math.pow(1-p,3);e.textContent=Math.round(E*t),p<1&&requestAnimationFrame(n)};requestAnimationFrame(n)}function F(e){const t=document.createElement("div");t.className="toast",t.textContent=e,document.body.appendChild(t),setTimeout(()=>t.classList.add("show"),10),setTimeout(()=>t.classList.remove("show"),2400),setTimeout(()=>t.remove(),2800)}function ie(e,t){const s=ne(e,t),o=[...e.querySelectorAll(".snick-live")],n=[...e.querySelectorAll(".cp-row")],c=document.createElement("div");c.className="hud",c.innerHTML=`
    <div class="hud-xp"><b id="hudXp">0</b><span>SHARED XP</span></div>
    <div class="hud-players" id="hudPlayers">● YOU · ○ YOUR PERSON — OUTSIDE THE WORLD</div>
  `,document.body.appendChild(c);const p=c.querySelector("#hudXp"),E=c.querySelector("#hudPlayers");let i=-1;const r=document.createElement("div");r.className="world-notice",r.setAttribute("aria-live","polite"),document.body.appendChild(r);let h=0;const m=(a,y=2600)=>{r.innerHTML=a.map((R,C)=>`<${C===0?"b":"span"}>${R}</${C===0?"b":"span"}>`).join(""),r.classList.add("show"),clearTimeout(h),h=setTimeout(()=>r.classList.remove("show"),y)};o.forEach(a=>{const y=Number(a.dataset.i),R=[...a.querySelectorAll(".partner-chip")],C=a.querySelector(".progress-line span"),b=a.querySelector(".two-way"),A=a.querySelector(".tw-revealed");let U="";if(R.forEach(u=>{u.addEventListener("click",()=>{if(u.classList.contains("on")||l.snickState(y).state!=="live")return;u.classList.add("on");const O=R.filter(v=>v.classList.contains("on")).length;C.style.width=`${O/2*100}%`,O===2&&setTimeout(()=>{l.completeSnick(y),a.classList.add("completed"),b&&(b.hidden=!1,b.querySelector(".tw-input").focus({preventScroll:!0})),b||(a.querySelector(".micro").textContent="SNICK COMPLETE · +20 XP"),m(["+20 XP",`CHECKPOINT 0${y+1} ACTIVATED`],2200);const v=n[y];v&&(v.querySelector(".cp-state").textContent="✦ LIT",v.classList.add("done"))},350)})}),b){const u=b.querySelector(".tw-input"),O=b.querySelector('[data-tw="lock"]'),v=b.querySelector('[data-tw="reveal"]'),H=b.querySelector(".tw-note");O==null||O.addEventListener("click",()=>{U=(u.value||"").trim()||"(left it unspoken)",u.disabled=!0,O.disabled=!0,O.textContent="SEALED 🔒",H.textContent="YOUR PERSON HAS LOCKED IN. SUBMIT YOUR ANSWER TO REVEAL BOTH.",v.hidden=!1,v.focus({preventScroll:!0})}),v==null||v.addEventListener("click",()=>{if(!U)return;const D="“…the night we walked nowhere in particular, and it was everything.”";A&&(A.hidden=!1,A.querySelector('[data-tw="mine"]').textContent=U,A.querySelector('[data-tw="theirs"]').textContent=D),v.hidden=!0,H.hidden=!0,A==null||A.classList.add("unmask"),a.querySelector(".micro").textContent="DUAL UNMASK · +20 XP"})}});const d=e.querySelector("#duoCode"),w=e.querySelector("#duoGen"),g=e.querySelector("#duoCopy");w==null||w.addEventListener("click",()=>{if(d.dataset.set)return;const a="ABCDEFGHJKMNPQRSTUVWXYZ23456789",y=Array.from({length:4},()=>a[Math.floor(Math.random()*a.length)]).join("");d.textContent=y.split("").join(" "),d.dataset.set="1",w.textContent="YOUR CODE",w.disabled=!0}),g==null||g.addEventListener("click",async()=>{const a=((d==null?void 0:d.textContent)||"").replace(/\s/g,"");if(!a||a==="····"){w==null||w.click();return}try{await navigator.clipboard.writeText(a),g.textContent="COPIED ✦"}catch{g.textContent=a}setTimeout(()=>{g.textContent="COPY"},1800)});const f=e.querySelector("#joinBtn"),S=e.querySelector("#demoJoin"),Y=()=>{var a,y,R,C;l.joined||(l.joinPartner(),l.raw=Math.min(l.raw,.168),f.textContent="✦ YOUR PERSON IS ON THE PATH",f.disabled=!0,S&&(S.hidden=!0),document.body.classList.add("joined"),m(["BOTH OF YOU ARE IN. ✦","THE WORLD CAN BEGIN."],3400),(C=(R=(y=(a=window.__sl)==null?void 0:a.world)==null?void 0:y.fx)==null?void 0:R.joinPulse)==null||C.call(R))};f.addEventListener("click",Y),S==null||S.addEventListener("click",Y);const N=document.createElement("div");N.className="rail",N.innerHTML=`
    <span class="rail-label" id="railLabel">THE TRAILHEAD</span>
    <div class="rail-track"><div class="rail-fill"></div></div>
    <div class="rail-cps">${$.map(a=>`<span data-f="${a.id}" title="Checkpoint 0${a.id+1} · ${a.name}">${a.id+1}</span>`).join("")}</div>
  `,document.body.appendChild(N);const I=document.createElement("div");I.className="sr-progress",I.setAttribute("aria-live","polite"),I.setAttribute("role","status"),document.body.appendChild(I);let j=null;const P=document.createElement("button");P.className="skip-btn",P.textContent="SKIP TO THE END ↓",P.addEventListener("click",()=>{l.jumpTo(1),document.body.classList.add("in-dom")}),document.body.appendChild(P);const k=s,T={join:!1,cp1:!1,arena:!1,board:!1,next:!1,finale:!1};function B(){const a=l.p,y=a>=.9815;document.body.classList.toggle("in-dom",y);for(const u of k){const[O,v]=u.range;if(a>=O-.012&&a<v+.012){const D=M((a-O)/(v-O||1e-6),0,1),x=_(0,.22,D),K=1-_(.8,1,D);u.el.style.opacity=String(Math.min(x,K)),u.el.style.transform=`translateY(${(1-x)*34-(1-K)*26}px)`,u.el.style.pointerEvents=u.mode==="snick"||u.id==="join"?"auto":"none",u.el.classList.add("active")}else u.el.classList.remove("active"),u.el.style.opacity="0",u.el.style.pointerEvents="none"}const R=N.querySelector(".rail-fill");R.style.height=`${a*100}%`;const C=N.querySelector("#railLabel"),b=ce(a);C.textContent=b;for(const u of N.querySelectorAll(".rail-cps span")){const O=Number(u.dataset.f);u.classList.toggle("on",l.done[O])}b!==j&&(j=b,I.textContent=`Checkpoint: ${b}`),P.classList.toggle("show",a>.02&&a<.97);const A=l.xp;if(A!==i){i=A,p.textContent=String(A),p.classList.remove("pop"),p.offsetWidth,p.classList.add("pop"),document.body.classList.toggle("has-xp",A>0);const u=document.getElementById("xpTotal");u&&(u.textContent=`${A} XP`)}const U=l.joined?"● YOU —— ● YOUR PERSON":"● YOU · ○ YOUR PERSON — OUTSIDE THE WORLD";E.textContent!==U&&(E.textContent=U),o.forEach(u=>{const O=Number(u.dataset.i),v=l.snickState(O),H=u.querySelector(".snick-lock"),D=u.querySelector(".snick-body"),x=`cp${O+1}`,[K,V]=L[x],Q=a>=K&&a<V+.02;if(H&&D){const G=v.state==="locked";H.hidden=!G,D.hidden=G,G&&(H.querySelector(".lock-reason").textContent=v.reason)}u.classList.toggle("waiting",Q&&v.state==="live")}),a>=.125&&!T.join&&(T.join=!0,l.joined||m(["ONE PLAYER DETECTED","BRING YOUR PERSON."],2600)),a>=.17&&!T.cp1&&(T.cp1=!0,l.joined||m(["SNICK 01 · LOCKED 🔒","IT OPENS WHEN TWO SHOW UP."],2800)),a>=.775&&!T.arena&&(T.arena=!0,m(["THE CHALLENGE ARENA · LOCKED","YOUR JOURNEY HASN'T REACHED HERE."],3e3)),a>=.825&&!T.board&&(T.board=!0,m(["THE FLEX BOARD · AHEAD","KEEP SHOWING UP."],2600)),a>=.87&&!T.next&&(T.next=!0,m(["SOMETHING IS WAITING BEYOND THE FOG.","TWO PEOPLE. MORE DISTANCE."],3e3)),a>=.93&&!T.finale&&(T.finale=!0,m(["THE WORLD CAN BE SEEN.","THE EXPERIENCE ONLY OPENS WHEN TWO PEOPLE SHOW UP."],3200)),requestAnimationFrame(B)}return requestAnimationFrame(B),{chapters:s,frame:B}}function ce(e){return e<.08?"THE TRAILHEAD":e<.125?"THE MAP":e<.17?"YOUR PERSON JOINS":e<.29?"CHECKPOINT 01 · THE FIRST SPARK · NOTICE":e<.325?"WALKING ON · CHECKPOINT 02 AHEAD":e<.445?"CHECKPOINT 02 · PLAYGROUND · PLAY":e<.48?"WALKING ON · CHECKPOINT 03 AHEAD":e<.6?"CHECKPOINT 03 · DEEPER WATERS · CONNECT":e<.63?"WALKING ON · CHECKPOINT 04 AHEAD":e<.745?"CHECKPOINT 04 · MEMORY PEAK · CREATE":e<.825?"THE CHALLENGE ARENA · LOCKED":e<.87?"THE FLEX BOARD · AHEAD":e<.93?"REGIONS BEYOND THE FOG":"THE LIT PATH"}window.__sl={journey:l};const J=document.getElementById("scene"),re=document.getElementById("overlay"),le=document.getElementById("ui");se();const de=ie(re,le);window.__sl.frame=de.frame;async function pe(){let e=!1;try{const{webglSupported:t}=await W(async()=>{const{webglSupported:s}=await import("./world-BQ64XrVh.js");return{webglSupported:s}},__vite__mapDeps([0,1]));e=t()}catch{e=!1}if(e)try{const{World:t}=await W(async()=>{const{World:p}=await import("./world-BQ64XrVh.js");return{World:p}},__vite__mapDeps([0,1])),s=new t(J);window.__sl.world=s,J.style.display="block";const o=await W(()=>import("./three.module-BT1pP-6r.js"),[]),n=new o.Clock;let c=!1;document.addEventListener("visibilitychange",()=>{c=document.hidden}),(function p(){requestAnimationFrame(p);const E=Math.min(n.getDelta(),.05);if(c)return;const i=n.elapsedTime;s.update(E,i),s.renderer.render(s.scene,s.camera)})()}catch(t){console.warn("3D world failed to start, using static fallback:",t);const{mountStaticFallback:s}=await W(async()=>{const{mountStaticFallback:o}=await import("./world-BQ64XrVh.js");return{mountStaticFallback:o}},__vite__mapDeps([0,1]));s()}else{const{mountStaticFallback:t}=await W(async()=>{const{mountStaticFallback:s}=await import("./world-BQ64XrVh.js");return{mountStaticFallback:s}},__vite__mapDeps([0,1]));t()}document.body.classList.add("world-ready")}pe();try{const e=JSON.parse(sessionStorage.getItem("sl-done")||"[]"),t=sessionStorage.getItem("sl-joined")==="1";e.forEach((s,o)=>{s&&(l.done[o]=!0)}),t&&(l.joined=!0,document.body.classList.add("joined"))}catch{}setInterval(()=>{try{sessionStorage.setItem("sl-progress",String(l.raw/.985)),sessionStorage.setItem("sl-done",JSON.stringify(l.done)),sessionStorage.setItem("sl-joined",l.joined?"1":"0")}catch{}},2500);window.addEventListener("load",()=>{setTimeout(()=>document.body.classList.add("loader-gone"),450)});setTimeout(()=>document.body.classList.add("loader-gone"),2500);export{he as B,ue as a,M as c,me as d,l as j,ee as l,_ as s,Ee as w};

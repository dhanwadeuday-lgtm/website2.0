const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/world-kTEu_rim.js","assets/three.module-BT1pP-6r.js"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const c of o)if(c.type==="childList")for(const u of c.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function a(o){const c={};return o.integrity&&(c.integrity=o.integrity),o.referrerPolicy&&(c.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?c.credentials="include":o.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(o){if(o.ep)return;o.ep=!0;const c=a(o);fetch(o.href,c)}})();const de="modulepreload",pe=function(t){return"/"+t},ne={},K=function(s,a,i){let o=Promise.resolve();if(a&&a.length>0){let u=function(l){return Promise.all(l.map(f=>Promise.resolve(f).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const E=document.querySelector("meta[property=csp-nonce]"),r=(E==null?void 0:E.nonce)||(E==null?void 0:E.getAttribute("nonce"));o=u(a.map(l=>{if(l=pe(l),l in ne)return;ne[l]=!0;const f=l.endsWith(".css"),v=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${v}`))return;const p=document.createElement("link");if(p.rel=f?"stylesheet":de,f||(p.as="script"),p.crossOrigin="",p.href=l,r&&p.setAttribute("nonce",r),document.head.appendChild(p),f)return new Promise((O,T)=>{p.addEventListener("load",O),p.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${l}`)))})}))}function c(u){const E=new Event("vite:preloadError",{cancelable:!0});if(E.payload=u,window.dispatchEvent(E),!E.defaultPrevented)throw u}return o.then(u=>{for(const E of u||[])E.status==="rejected"&&c(E.reason);return s().catch(c)})},x=(t,s,a)=>Math.min(a,Math.max(s,t)),ue=(t,s,a)=>t+(s-t)*a,ae=(t,s,a)=>{const i=x((a-t)/(s-t||1e-6),0,1);return i*i*(3-2*i)},ge=(t,s,a,i)=>ue(t,s,1-Math.exp(-a*i)),Le=(t,s,a=1.7,i=.05)=>Math.sin(t*a+s*12.9898)*i+Math.sin(t*a*.63+s*78.233)*i*.55,Ae=(()=>{const t=typeof window<"u"?window.innerWidth:1280,s=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,i=t<820||s;return{mobile:i,touch:s,particles:i?260:900,growthParticles:i?90:220,stemSegs:i?44:80,envQuality:i?"low":"high",dprCap:i?1.7:2,cameraAmplitude:i?.62:1}})(),I={spark:[0,.08],intro:[.08,.125],join:[.125,.17],cp1:[.17,.29],cp1lit:[.29,.325],cp2:[.325,.445],cp2lit:[.445,.48],cp3:[.48,.6],cp3lit:[.6,.63],cp4:[.63,.745],cp4lit:[.745,.775],arena:[.775,.815],board:[.815,.85],next:[.85,.9],finale:[.9,.985]},Ee=[.17,.325,.48,.63];class me{constructor(){this.p=0,this.raw=0,this.vel=0,this.done=[!1,!1,!1,!1],this.joined=!1,this.pairState="unpaired",this.yourEmail="",this.duoCode="",this.partnerEmail="",this.yourName="A",this.partnerName="M",this.score=87,this.tag="THE OBSERVER 👀",this.tagline="You two notice the little things.",this.initials="A + M",this.onCompleteCallbacks=[]}startPairing(s,a="A"){this.yourEmail=String(s||"").trim(),this.yourName=String(a||"A").trim().slice(0,12)||"A",this.pairState="paired";const i="ABCDEFGHJKMNPQRSTUVWXYZ23456789";this.duoCode=Array.from({length:4},()=>i[Math.floor(Math.random()*i.length)]).join("")}confirmJoin(){this.joined=!0,this.pairState="joined",this.partnerName=this.partnerName==="A"?"M":this.partnerName,this.initials=`${this.yourName} + ${this.partnerName}`}chapterProgress(s){const[a,i]=I[s];return x((this.p-a)/(i-a||1e-6),0,1)}inside(s){const[a,i]=I[s];return this.p>=a&&this.p<i}travel(){return x(this.p/.985,0,1)}syncLevel(){const s=this.done.filter(Boolean).length;return(this.joined?.35:0)+s/4*.65}litCount(){return this.done.filter(Boolean).length}get isObserver(){return!this.joined}get xp(){return this.done.filter(Boolean).length*20}snickState(s){const a=this.done.slice(0,s).every(Boolean);return this.done[s]?{state:"done"}:this.joined?a?{state:"live"}:{state:"locked",reason:"COMPLETE THE LAST SNICK FIRST"}:{state:"locked",reason:s===0?"YOUR PERSON IS MISSING":"REQUIRES TWO PLAYERS"}}completeSnick(s){if(!this.done[s]){this.done[s]=!0;for(const a of this.onCompleteCallbacks)a(s)}}joinPartner(){this.joined||(this.joined=!0)}}const n=new me,ie=.985;function he(){let t=0;const s=r=>{t=x(r,0,1),n.raw=t*ie},a=Number(sessionStorage.getItem("sl-progress")||0);a>0&&a<1&&(n.raw=a*ie,n.p=n.raw);const i=r=>{document.body.classList.contains("in-dom")||(r.preventDefault(),s(t+r.deltaY*15e-5))};let o=0;const c=r=>{o=r.touches[0].clientY},u=r=>{if(!document.body.classList.contains("in-dom")){r.preventDefault();const l=o-r.touches[0].clientY;o=r.touches[0].clientY,s(t+l*45e-5)}},E=r=>{document.body.classList.contains("in-dom")||(["ArrowDown","PageDown"," ","ArrowRight"].includes(r.key)?(r.preventDefault(),s(t+.018)):["ArrowUp","PageUp","ArrowLeft"].includes(r.key)&&(r.preventDefault(),s(t-.018)))};return window.addEventListener("wheel",i,{passive:!1}),window.addEventListener("touchstart",c,{passive:!1}),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("keydown",E),n.jumpTo=r=>s(r),{get ratio(){return t}}}const Ie={deepWine:3806752,peach:15251868,blush:16512241,copper:12084554,ink:1969683},G=[{id:0,name:"NOTICE",emoji:"👀",css:"#E8B99C"},{id:1,name:"PLAY",emoji:"🎈",css:"#E8B99C"},{id:2,name:"CONNECT",emoji:"💭",css:"#E8B99C"},{id:3,name:"CREATE",emoji:"📸",css:"#B8654A"}];function ve(t,s){const a=[],i=r=>r%2===0?"left":"right";function o(r,l,f,v={}){const p=document.createElement("section");return p.className=`chapter side-${v.side??i(a.length)} ${v.cls||""}`,p.dataset.range=l.join(","),p.innerHTML=f,t.appendChild(p),a.push({id:r,el:p,range:l,mode:v.mode||"text",...v}),p}o("spark",I.spark,`
    <div class="ch-inner">
      <p class="kicker">SNICKYLINK</p>
      <h1>MORE THAN<br>A CHAT.</h1>
      <p class="sub">A secret little world for two.</p>
      <p class="hint">scroll to set out ↓</p>
    </div>
  `,{side:"left"}),o("intro",I.intro,`
    <div class="ch-inner">
      <p class="kicker">THE MAP</p>
      <h2>FOUR CHECKPOINTS.<br>ONE PATH. TWO PEOPLE.</h2>
      <p class="sub">Each one hides a Snick — a tiny challenge you both complete together.</p>
      <div class="cp-list">
        ${G.map((r,l)=>`
          <div class="cp-row" data-i="${l}">
            <span class="cp-dot"></span>
            <b>0${l+1} · ${r.name}</b>
            <span class="cp-state">🔒 FOGGED</span>
          </div>
        `).join("")}
      </div>
    </div>
  `,{side:"right"}),o("join",I.join,`
    <div class="ch-inner center">
      <p class="kicker">ONE PLAYER DETECTED</p>
      <h2>THE PATH LIGHTS<br>ONLY FOR TWO. ✦</h2>
      <p class="sub">Enter your email to claim your marker — we'll hand you a duo code. When your person joins with it, the world opens.</p>
      <div class="duo-box" id="duoBox">
        <div class="pair-step" id="pairStep1">
          <label class="sr-only" for="pairName">Your name</label>
          <input type="text" id="pairName" maxlength="12" placeholder="Your name" autocomplete="given-name" />
          <label class="sr-only" for="pairEmail">Your email</label>
          <input type="email" id="pairEmail" placeholder="you@together.com" autocomplete="email" required />
          <button class="cta" id="pairBtn">CONNECT ME →</button>
          <p class="pair-err" id="pairErr" role="alert" hidden></p>
          <p class="micro">No spam, ever. Just your marker, your code, and your person.</p>
        </div>
        <div class="pair-step" id="pairStep2" hidden>
          <div class="duo-head">
            <span class="duo-title">YOUR DUO CODE</span>
            <span class="duo-wait">WAITING FOR YOUR PERSON…</span>
          </div>
          <div class="duo-code-row">
            <code class="duo-code" id="duoCode">· · · ·</code>
            <div class="duo-actions">
              <button class="cta mini" id="duoCopy">COPY CODE</button>
            </div>
          </div>
          <p class="duo-note" id="duoNote">Send this to your person. The moment they enter it, their marker lights up beside yours.</p>
          <button class="cta" id="joinBtn">THEY'VE ENTERED THE CODE →</button>
          <button class="cta ghost demo" id="demoJoin">SIMULATE: THEY JOINED</button>
          <p class="micro">The demo is a preview of the moment — in the app, the join is real.</p>
        </div>
      </div>
    </div>
  `,{side:"center"});const c=[{emoji:"👀",name:"NOTICE",task:"“Find one tiny thing about them that you genuinely love — and tell them.”"},{emoji:"🎈",name:"PLAY",task:"“Make each other laugh in 60 seconds.”"},{emoji:"💭",name:"CONNECT",task:"“Ask something you’ve always wanted to do together.”"},{emoji:"📸",name:"CREATE",task:"“Create one tiny memory together.”"}],u=[{key:"cp1",place:"THE FIRST SPARK",lit:"cp1lit"},{key:"cp2",place:"PLAYGROUND",lit:"cp2lit"},{key:"cp3",place:"DEEPER WATERS",lit:"cp3lit"},{key:"cp4",place:"MEMORY PEAK",lit:"cp4lit"}];c.forEach((r,l)=>{const f=u[l];o(f.key,I[f.key],`
      <div class="ch-inner">
        <p class="kicker">CHECKPOINT 0${l+1} · ${f.place}</p>
        <div class="snick-live" data-i="${l}">
          <div class="snick-top">SNICK 0${l+1} · ${r.emoji} ${r.name}</div>

          <div class="snick-lock" aria-hidden="true">
            <div class="lock-glyph">🔒</div>
            <b class="lock-word">LOCKED</b>
            <span class="lock-reason">YOUR PERSON IS MISSING</span>
            <span class="lock-shimmer">?????? ??? ??? ???????</span>
          </div>

          <div class="snick-body" hidden>
            <h3>${r.task}</h3>
            <div class="partners">
              <button class="partner-chip" data-partner="you">YOU ✓</button>
              <button class="partner-chip" data-partner="them">YOUR PERSON ✓</button>
            </div>
            <div class="progress-line"><span></span></div>
            <p class="micro">Both of you complete it. That's the rule.</p>
            ${l===2?`
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
    `,{side:l%2?"right":"left",mode:"snick",index:l}),o(f.lit,I[f.lit],`
      <div class="ch-inner center">
        <p class="kicker">+20 XP · CHECKPOINT 0${l+1} LIT</p>
        <h2>${f.place} IS AWAKE.</h2>
        <p class="sub">The beacon burns for you two.</p>
      </div>
    `,{side:"center"})}),o("arena",I.arena,`
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
  `,{side:"center"}),o("board",I.board,`
    <div class="ch-inner center">
      <p class="kicker">FURTHER ON · A GLIMPSE</p>
      <h2>THE FLEX BOARD.</h2>
      <p class="sub">Where showing-up streaks get celebrated. A sample preview lives at the end of this trail — no real couples yet.</p>
    </div>
  `,{side:"center"});const E=[{e:"🌿",n:"WORLD 01 · THE HONEYMOON GLADE",s:"KEEP SHOWING UP."},{e:"🔥",n:"WORLD 02 · SYNCHRONOUS ORBIT",s:"UNLOCKS WITH SHARED XP."},{e:"🗝️",n:"WORLD 03 · VULNERABILITY DUNGEON",s:"DEEPER CONNECTION REQUIRED."},{e:"✨",n:"WORLD 04 · CELESTIAL RESONANCE",s:"FAR BEYOND THE FOG."}];return o("next",I.next,`
    <div class="ch-inner center">
      <p class="kicker">BEYOND THE FOG · THE FIRST SKETCHES</p>
      <h2>SOMETHING IS WAITING<br>BEYOND THE FOG.</h2>
      <p class="sub">Four regions are already on the map. This path opens later — for the two of you.</p>
      <div class="world-tease">
        ${E.map(r=>`
          <div class="wt-row">
            <span class="wt-e" aria-hidden="true">${r.e}</span>
            <b>${r.n}</b><span class="wt-s">${r.s}</span>
          </div>`).join("")}
      </div>
    </div>
  `,{side:"center"}),o("finale",I.finale,`
    <div class="ch-inner center">
      <h1 class="hero-line">FOUR CHECKPOINTS.<br>ONE LIT PATH.</h1>
      <p class="sub">You walked it together.</p>
      <div class="cp-strip">${G.map(r=>`<span>${r.emoji}</span>`).join("<i>→</i>")}</div>
    </div>
  `,{side:"center"}),fe(s),a}function fe(t){const s=n.score,a=n.initials,i=n.tag,o=n.tagline,c=document.createElement("div");c.id="dom-acts",c.innerHTML=`
    <div class="marquee peach-band" aria-hidden="true">
      <div class="marquee-track">
        ${"<span>TWO PEOPLE</span><i>✦</i><span>ONE CONNECTION</span><i>✦</i><span>ONE THING THAT GROWS</span><i>✦</i><span>MORE THAN A CHAT</span><i>✦</i>".repeat(2)}
      </div>
    </div>

    <section class="act score-act">
      <p class="kicker">YOUR RESULT</p>
      <h2>HOW IN-SYNC ARE YOU TWO?</h2>
      <p class="at">AT THE SCORE OBELISK · FINALE ISLAND</p>
      <div id="scorePaired">
        <div class="score-num" id="scoreNum">0</div>
        <div class="bars">
          ${[["COMMUNICATION",8],["PLAY",9],["EFFORT",8],["TRUST",9],["EMOTIONAL SYNC",8]].map(([O,T])=>`
            <div class="bar-row">
              <span class="bar-label">${O}</span>
              <span class="bar"><i style="--w:${T}0%"></i></span>
            </div>
          `).join("")}
        </div>
      </div>
      <div id="scoreObserver" class="obs-block" hidden>
        <div class="obs-glyph" aria-hidden="true">👀</div>
        <h3 class="obs-line">YOU'RE STILL AN OBSERVER.</h3>
        <p class="sub">Your number, your tag, your story card — all of it unlocks when your person steps into the world.</p>
        <button class="cta primary" id="obsBring">BRING YOUR PERSON →</button>
      </div>
      <p class="micro">A playful SnickyLink metric — not science. Your real score comes from actually showing up together.</p>
    </section>

    <section class="act tag-act">
      <p class="kicker">YOUR COUPLE TAG</p>
      <h2 class="tag-name">${i}</h2>
      <p class="at">CARVED INTO THE TAG ARCH</p>
      <p class="quote">"${o}"</p>
      <div class="share-hint">A sample tag — yours gets written when you two play.</div>
    </section>

    <section class="act story-act">
      <p class="kicker">9:16 · MADE FOR SHARING</p>
      <p class="at">HELD BY THE STORY STELE</p>
      <div id="storyPaired">
        <div class="story-card" id="storyCard">
          <img class="sc-logo" src="/logo.webp" alt="SnickyLink moon logo" width="34" height="34" loading="lazy" />
          <div class="sc-brand">SNICKYLINK</div>
          <div class="sc-initials" id="scInitials">${a}</div>
          <div class="sc-score" id="scScore">${s}</div>
          <h3 class="sc-tag" id="scTag">${i}</h3>
          <p class="sc-quote" id="scQuote">"${o}"</p>
          <div class="sc-row">4 SNICKS · 4 MOMENTS · 1 CONNECTION</div>
          <div class="sc-cps">${G.map(O=>`<span>${O.emoji}</span>`).join("<i>→</i>")}</div>
          <div class="sc-foot">CONNECT · PLAY · GROW</div>
          <div class="sc-date">${new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase()}</div>
        </div>
      </div>
      <div id="storyObserver" hidden>
        <div class="story-card observing">
          <img class="sc-logo" src="/logo.webp" alt="SnickyLink moon logo" width="34" height="34" loading="lazy" />
          <div class="sc-brand">SNICKYLINK</div>
          <div class="sc-initials">YOU, SO FAR</div>
          <div class="obs-glyph big" aria-hidden="true">👀</div>
          <h3 class="sc-tag">STILL AN OBSERVER</h3>
          <p class="sc-quote">"Four Snicks are waiting. None of them open for one."</p>
          <div class="sc-row">BRING YOUR PERSON TO UNLOCK YOURS</div>
          <div class="sc-cps"><span>👀</span><i>→</i><span>🎈</span><i>→</i><span>💭</span><i>→</i><span>📸</span></div>
          <div class="sc-foot">CONNECT · PLAY · GROW</div>
          <div class="sc-date">PREVIEW</div>
        </div>
      </div>
      <div class="story-ctas">
        <button class="cta primary" id="shareBtn">SHARE YOUR MAP 🫶</button>
        <button class="cta ghost" id="downloadBtn">SAVE AS IMAGE ↓</button>
      </div>
    </section>

    <div class="marquee wine-band" aria-hidden="true">
      <div class="marquee-track">
        ${"<span>CONNECT</span><i>✦</i><span>PLAY</span><i>✦</i><span>GROW TOGETHER</span><i>✦</i><span>SNICKYLINK</span><i>✦</i>".repeat(2)}
      </div>
    </div>

    <section class="act finale-act">
      <p class="kicker">THE FIRST MAP · <b id="xpTotal">${n.xp} XP</b></p>
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
  `,t.appendChild(c);const u=c.querySelector("#scoreNum");let E=!1;new IntersectionObserver(O=>{for(const T of O)T.isIntersecting&&!E&&(E=!0,Se(u,n.score))},{threshold:.4}).observe(u);const l=new IntersectionObserver(O=>{for(const T of O)T.isIntersecting&&(c.querySelector(".bars").classList.add("grown"),l.disconnect())},{threshold:.3});l.observe(c.querySelector(".bars"));const f="https://docs.google.com/forms/d/e/1FAIpQLSfpvXYWIAXUl2ggcyJYrHn5ZOgUr8Z3Xm-Sjvn4GtPEJkLUug/formResponse",v={name:"entry.1906209180",email:"entry.646925955"},p=c.querySelector("#waitlistForm");p.addEventListener("submit",O=>{if(O.preventDefault(),p.dataset.busy)return;const T=new FormData(p),N=new URLSearchParams;N.set(v.name,String(T.get("name")||"")),N.set(v.email,String(T.get("email")||""));const L=p.querySelector('button[type="submit"]');p.dataset.busy="1",L&&(L.disabled=!0,L.textContent="JOINING…");const M=p.querySelector(".wl-error");M&&M.remove();const k=fetch(f,{method:"POST",mode:"no-cors",body:N}),R=new Promise((D,P)=>setTimeout(()=>P(new Error("timeout")),9e3));Promise.race([k,R]).then(()=>{p.innerHTML=`<div class="joined-msg"><h2>YOU'RE IN. ✦</h2><p>Now go find your person.</p></div>`,document.body.classList.add("joined"),n.raw=Math.min(n.raw,.984)}).catch(()=>{delete p.dataset.busy,L&&(L.disabled=!1,L.textContent="JOIN THE WAITLIST →");const D=document.createElement("p");D.className="wl-error",D.setAttribute("role","alert"),D.textContent="Couldn't reach the waitlist just now — check your connection and try again. 🫶",p.appendChild(D)})}),c.querySelector("#shareBtn").addEventListener("click",async()=>{const O=`${n.initials} — ${n.score} — ${n.tag}
4 SNICKS · 4 MOMENTS · 1 CONNECTION ✦
SNICKYLINK`;if(navigator.share)try{await navigator.share({text:O,title:"Our SnickyLink Map"})}catch{}else try{await navigator.clipboard.writeText(O),F("Copied. Paste it anywhere. 🫶")}catch{F("Sharing is blocked in this browser — screenshot instead 📸")}}),c.querySelector("#downloadBtn").addEventListener("click",()=>{F("Screenshot the card — it was made for that. 📸")})}function Se(t,s){const i=performance.now(),o=c=>{const u=x((c-i)/1600,0,1),E=1-Math.pow(1-u,3);t.textContent=Math.round(E*s),u<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}function F(t){const s=document.createElement("div");s.className="toast",s.textContent=t,document.body.appendChild(s),setTimeout(()=>s.classList.add("show"),10),setTimeout(()=>s.classList.remove("show"),2400),setTimeout(()=>s.remove(),2800)}function Oe(t,s){var ee,te,se;const a=ve(t,s),i=[...t.querySelectorAll(".snick-live")],o=[...t.querySelectorAll(".cp-row")],c=document.createElement("div");c.className="hud",c.innerHTML=`
    <div class="hud-xp"><b id="hudXp">0</b><span>SHARED XP</span></div>
    <div class="hud-players" id="hudPlayers">● YOU · ○ YOUR PERSON — OUTSIDE THE WORLD</div>
    <a class="hud-brand" href="#top" aria-label="SNICKYLINK — back to top"><img src="/logo.webp" alt="" width="22" height="22">SNICKYLINK</a>
  `,document.body.appendChild(c);const u=c.querySelector("#hudXp"),E=c.querySelector("#hudPlayers");let r=-1;c.querySelector(".hud-brand").addEventListener("click",e=>{e.preventDefault(),n.jumpTo(0),document.body.classList.remove("in-dom")});const l=document.createElement("div");l.className="world-notice",l.setAttribute("aria-live","polite"),document.body.appendChild(l);let f=0;const v=(e,m=2600)=>{l.innerHTML=e.map((h,g)=>`<${g===0?"b":"span"}>${h}</${g===0?"b":"span"}>`).join(""),l.classList.add("show"),clearTimeout(f),f=setTimeout(()=>l.classList.remove("show"),m)};i.forEach(e=>{const m=Number(e.dataset.i),h=[...e.querySelectorAll(".partner-chip")],g=e.querySelector(".progress-line span"),y=e.querySelector(".two-way"),w=e.querySelector(".tw-revealed");let C="";if(h.forEach(d=>{d.addEventListener("click",()=>{if(d.classList.contains("on")||n.snickState(m).state!=="live")return;d.classList.add("on");const S=h.filter(b=>b.classList.contains("on")).length;g.style.width=`${S/2*100}%`,S===2&&setTimeout(()=>{n.completeSnick(m),e.classList.add("completed"),y&&(y.hidden=!1,y.querySelector(".tw-input").focus({preventScroll:!0})),y||(e.querySelector(".micro").textContent="SNICK COMPLETE · +20 XP"),v(["+20 XP",`CHECKPOINT 0${m+1} ACTIVATED`],2200);const b=o[m];b&&(b.querySelector(".cp-state").textContent="✦ LIT",b.classList.add("done"))},350)})}),y){const d=y.querySelector(".tw-input"),S=y.querySelector('[data-tw="lock"]'),b=y.querySelector('[data-tw="reveal"]'),Y=y.querySelector(".tw-note");S==null||S.addEventListener("click",()=>{C=(d.value||"").trim()||"(left it unspoken)",d.disabled=!0,S.disabled=!0,S.textContent="SEALED 🔒",Y.textContent="YOUR PERSON HAS LOCKED IN. SUBMIT YOUR ANSWER TO REVEAL BOTH.",b.hidden=!1,b.focus({preventScroll:!0})}),b==null||b.addEventListener("click",()=>{if(!C)return;const U="“…the night we walked nowhere in particular, and it was everything.”";w&&(w.hidden=!1,w.querySelector('[data-tw="mine"]').textContent=C,w.querySelector('[data-tw="theirs"]').textContent=U),b.hidden=!0,Y.hidden=!0,w==null||w.classList.add("unmask"),e.querySelector(".micro").textContent="DUAL UNMASK · +20 XP"})}});const p=t.querySelector("#pairStep1"),O=t.querySelector("#pairStep2"),T=t.querySelector("#pairName"),N=t.querySelector("#pairEmail"),L=t.querySelector("#pairBtn"),M=t.querySelector("#pairErr"),k=t.querySelector("#duoCode"),R=t.querySelector("#duoCopy"),D=e=>{M&&(M.hidden=!1,M.textContent=e)};L==null||L.addEventListener("click",()=>{const e=((N==null?void 0:N.value)||"").trim();if(!e||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){D("A real email, please — it’s how your person finds you."),N==null||N.focus();return}n.startPairing(e,(T==null?void 0:T.value)||"A"),k.textContent=n.duoCode.split("").join(" "),p&&(p.hidden=!0),O&&(O.hidden=!1),R==null||R.focus({preventScroll:!0})}),N==null||N.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),L==null||L.click())}),T==null||T.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),N==null||N.focus())}),R==null||R.addEventListener("click",async()=>{const e=((k==null?void 0:k.textContent)||"").replace(/\s/g,"");if(!(!e||e==="····")){try{await navigator.clipboard.writeText(e),R.textContent="COPIED ✦"}catch{R.textContent=e}setTimeout(()=>{R.textContent="COPY CODE"},1800)}});const P=t.querySelector("#joinBtn"),j=t.querySelector("#demoJoin"),V=()=>{const e=!n.isObserver,m=document.getElementById("scoreObserver"),h=document.getElementById("scorePaired"),g=document.getElementById("storyObserver"),y=document.getElementById("storyPaired");if(m&&(m.hidden=e),h&&(h.hidden=!e),g&&(g.hidden=e),y&&(y.hidden=!e),e){const w=document.getElementById("scInitials");w&&(w.textContent=n.initials);const C=document.getElementById("scTag");C&&(C.textContent=n.tag);const d=document.getElementById("scQuote");d&&(d.textContent=`"${n.tagline}"`);const S=document.getElementById("scScore");S&&(S.textContent=String(n.score))}},Q=()=>{var e,m,h,g;n.joined||(n.confirmJoin(),n.raw=Math.min(n.raw,.168),P&&(P.textContent="✦ YOUR PERSON IS ON THE PATH",P.disabled=!0),j&&(j.hidden=!0),document.body.classList.add("joined"),V(),v(["BOTH OF YOU ARE IN. ✦","THE WORLD CAN BEGIN."],3400),(g=(h=(m=(e=window.__sl)==null?void 0:e.world)==null?void 0:m.fx)==null?void 0:h.joinPulse)==null||g.call(h))};P==null||P.addEventListener("click",Q),j==null||j.addEventListener("click",Q),V(),n.pairState==="paired"&&k&&(k.textContent=n.duoCode.split("").join(" "),p&&(p.hidden=!0),O&&(O.hidden=!1)),(ee=document.getElementById("obsBring"))==null||ee.addEventListener("click",()=>{document.body.classList.remove("in-dom"),n.jumpTo(.14)}),(te=document.getElementById("finalBring"))==null||te.addEventListener("click",()=>{document.body.classList.remove("in-dom"),n.jumpTo(.14)}),(se=document.getElementById("nextWorld"))==null||se.addEventListener("click",()=>{F("The next world opens when the map grows. 🗝️")});const H=document.createElement("div");H.className="rail",H.innerHTML=`
    <span class="rail-label" id="railLabel">THE TRAILHEAD</span>
    <div class="rail-track"><div class="rail-fill"></div></div>
    <div class="rail-cps">${G.map((e,m)=>`<span data-jump="${Ee[m]}" data-f="${e.id}" role="button" tabindex="0" aria-label="Jump to Checkpoint 0${e.id+1} · ${e.name}" title="Checkpoint 0${e.id+1} · ${e.name} — click to jump">${e.id+1}</span>`).join("")}</div>
  `,document.body.appendChild(H);const z=e=>{const m=e.target.closest(".rail-cps span");m&&(n.jumpTo(Number(m.dataset.jump)),document.body.classList.remove("in-dom"))};H.querySelector(".rail-cps").addEventListener("click",z),H.querySelector(".rail-cps").addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),z(e))});const W=document.createElement("div");W.className="sr-progress",W.setAttribute("aria-live","polite"),W.setAttribute("role","status"),document.body.appendChild(W);let Z=null;const B=document.createElement("button");B.className="skip-btn",B.textContent="SKIP TO THE END ↓",B.addEventListener("click",()=>{n.jumpTo(1),document.body.classList.add("in-dom")}),document.body.appendChild(B);const re=a,A={join:!1,cp1:!1,arena:!1,board:!1,next:!1,finale:!1},_=document.querySelectorAll("#dom-acts .act");if(_.forEach(e=>e.classList.add("rv")),"IntersectionObserver"in window){const e=new IntersectionObserver(m=>{for(const h of m)h.isIntersecting&&(h.target.classList.add("in"),e.unobserve(h.target))},{threshold:.16});_.forEach(m=>e.observe(m))}else _.forEach(e=>e.classList.add("in"));window.matchMedia("(prefers-reduced-motion: reduce)").matches||document.querySelectorAll(".snick-live").forEach(e=>{e.addEventListener("pointermove",m=>{const h=e.getBoundingClientRect(),g=(m.clientX-h.left)/h.width-.5,y=(m.clientY-h.top)/h.height-.5;e.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(g*7).toFixed(2)}deg)`}),e.addEventListener("pointerleave",()=>{e.style.transform=""})});function X(){const e=n.p,m=e>=.9815;document.body.classList.toggle("in-dom",m);for(const d of re){const[S,b]=d.range;if(e>=S-.012&&e<b+.012){const U=x((e-S)/(b-S||1e-6),0,1),$=ae(0,.22,U),q=1-ae(.8,1,U);d.el.style.opacity=String(Math.min($,q)),d.el.style.transform=`translateY(${(1-$)*34-(1-q)*26}px)`,d.el.style.pointerEvents=d.mode==="snick"||d.id==="join"?"auto":"none",d.el.classList.add("active")}else d.el.classList.remove("active"),d.el.style.opacity="0",d.el.style.pointerEvents="none"}const h=H.querySelector(".rail-fill");h.style.height=`${e*100}%`;const g=H.querySelector("#railLabel"),y=ye(e);g.textContent=y;for(const d of H.querySelectorAll(".rail-cps span")){const S=Number(d.dataset.f);d.classList.toggle("on",n.done[S]),d.classList.toggle("reached",e>=Number(d.dataset.jump))}y!==Z&&(Z=y,W.textContent=`Checkpoint: ${y}`),B.classList.toggle("show",e>.02&&e<.97);const w=n.xp;if(w!==r){r=w,u.textContent=String(w),u.classList.remove("pop"),u.offsetWidth,u.classList.add("pop"),document.body.classList.toggle("has-xp",w>0);const d=document.getElementById("xpTotal");d&&(d.textContent=`${w} XP`)}const C=n.joined?"● YOU —— ● YOUR PERSON":"● YOU · ○ YOUR PERSON — OUTSIDE THE WORLD";E.textContent!==C&&(E.textContent=C),i.forEach(d=>{const S=Number(d.dataset.i),b=n.snickState(S),Y=d.querySelector(".snick-lock"),U=d.querySelector(".snick-body"),$=`cp${S+1}`,[q,ce]=I[$],le=e>=q&&e<ce+.02;if(Y&&U){const J=b.state==="locked";Y.hidden=!J,U.hidden=J,J&&(Y.querySelector(".lock-reason").textContent=b.reason)}d.classList.toggle("waiting",le&&b.state==="live")}),e>=.125&&!A.join&&(A.join=!0,n.joined||v(["ONE PLAYER DETECTED","BRING YOUR PERSON."],2600)),e>=.17&&!A.cp1&&(A.cp1=!0,n.joined||v(["SNICK 01 · LOCKED 🔒","IT OPENS WHEN TWO SHOW UP."],2800)),e>=.775&&!A.arena&&(A.arena=!0,v(["THE CHALLENGE ARENA · LOCKED","YOUR JOURNEY HASN'T REACHED HERE."],3e3)),e>=.825&&!A.board&&(A.board=!0,v(["THE FLEX BOARD · AHEAD","KEEP SHOWING UP."],2600)),e>=.87&&!A.next&&(A.next=!0,v(["SOMETHING IS WAITING BEYOND THE FOG.","TWO PEOPLE. MORE DISTANCE."],3e3)),e>=.93&&!A.finale&&(A.finale=!0,v(["THE WORLD CAN BE SEEN.","THE EXPERIENCE ONLY OPENS WHEN TWO PEOPLE SHOW UP."],3200)),requestAnimationFrame(X)}return requestAnimationFrame(X),{chapters:a,frame:X}}function ye(t){return t<.08?"THE TRAILHEAD":t<.125?"THE MAP":t<.17?"YOUR PERSON JOINS":t<.29?"CHECKPOINT 01 · THE FIRST SPARK · NOTICE":t<.325?"WALKING ON · CHECKPOINT 02 AHEAD":t<.445?"CHECKPOINT 02 · PLAYGROUND · PLAY":t<.48?"WALKING ON · CHECKPOINT 03 AHEAD":t<.6?"CHECKPOINT 03 · DEEPER WATERS · CONNECT":t<.63?"WALKING ON · CHECKPOINT 04 AHEAD":t<.745?"CHECKPOINT 04 · MEMORY PEAK · CREATE":t<.825?"THE CHALLENGE ARENA · LOCKED":t<.87?"THE FLEX BOARD · AHEAD":t<.93?"REGIONS BEYOND THE FOG":"THE LIT PATH"}window.__sl={journey:n};const oe=document.getElementById("scene"),be=document.getElementById("overlay"),Te=document.getElementById("ui");he();const Ne=Oe(be,Te);window.__sl.frame=Ne.frame;async function we(){let t=!1;try{const{webglSupported:s}=await K(async()=>{const{webglSupported:a}=await import("./world-kTEu_rim.js");return{webglSupported:a}},__vite__mapDeps([0,1]));t=s()}catch{t=!1}if(t)try{const{World:s}=await K(async()=>{const{World:u}=await import("./world-kTEu_rim.js");return{World:u}},__vite__mapDeps([0,1])),a=new s(oe);window.__sl.world=a,oe.style.display="block";const i=await K(()=>import("./three.module-BT1pP-6r.js"),[]),o=new i.Clock;let c=!1;document.addEventListener("visibilitychange",()=>{c=document.hidden}),(function u(){requestAnimationFrame(u);const E=Math.min(o.getDelta(),.05);if(c)return;const r=o.elapsedTime;a.update(E,r),a.renderer.render(a.scene,a.camera)})()}catch(s){console.warn("3D world failed to start, using static fallback:",s);const{mountStaticFallback:a}=await K(async()=>{const{mountStaticFallback:i}=await import("./world-kTEu_rim.js");return{mountStaticFallback:i}},__vite__mapDeps([0,1]));a()}else{const{mountStaticFallback:s}=await K(async()=>{const{mountStaticFallback:a}=await import("./world-kTEu_rim.js");return{mountStaticFallback:a}},__vite__mapDeps([0,1]));s()}document.body.classList.add("world-ready")}we();try{const t=JSON.parse(sessionStorage.getItem("sl-done")||"[]"),s=sessionStorage.getItem("sl-joined")==="1";t.forEach((i,o)=>{i&&(n.done[o]=!0)}),s&&(n.joined=!0,document.body.classList.add("joined"));const a=JSON.parse(sessionStorage.getItem("sl-pair")||"null");a&&(n.pairState=a.pairState||"unpaired",n.yourEmail=a.yourEmail||"",n.duoCode=a.duoCode||"",n.yourName=a.yourName||"A",n.partnerName=a.partnerName||"M",n.joined&&(n.pairState="joined",n.initials=`${n.yourName} + ${n.partnerName}`))}catch{}setInterval(()=>{try{sessionStorage.setItem("sl-progress",String(n.raw/.985)),sessionStorage.setItem("sl-done",JSON.stringify(n.done)),sessionStorage.setItem("sl-joined",n.joined?"1":"0"),sessionStorage.setItem("sl-pair",JSON.stringify({pairState:n.pairState,yourEmail:n.yourEmail,duoCode:n.duoCode,yourName:n.yourName,partnerName:n.partnerName}))}catch{}},2500);window.addEventListener("load",()=>{setTimeout(()=>document.body.classList.add("loader-gone"),450)});setTimeout(()=>document.body.classList.add("loader-gone"),2500);export{Ie as B,ge as a,x as c,Ae as d,n as j,ue as l,ae as s,Le as w};

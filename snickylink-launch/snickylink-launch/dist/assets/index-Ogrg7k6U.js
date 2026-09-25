const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/world-BUGjO290.js","assets/three.module-BT1pP-6r.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();const M="modulepreload",Y=function(e){return"/"+e},k={},g=function(t,s,a){let n=Promise.resolve();if(s&&s.length>0){let l=function(d){return Promise.all(d.map(f=>Promise.resolve(f).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),i=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=l(s.map(d=>{if(d=Y(d),d in k)return;k[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const c=document.createElement("link");if(c.rel=f?"stylesheet":M,f||(c.as="script"),c.crossOrigin="",c.href=d,i&&c.setAttribute("nonce",i),document.head.appendChild(c),f)return new Promise((h,v)=>{c.addEventListener("load",h),c.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(l){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=l,window.dispatchEvent(o),!o.defaultPrevented)throw l}return n.then(l=>{for(const o of l||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},A=(e,t,s)=>Math.min(s,Math.max(t,e)),D=(e,t,s)=>e+(t-e)*s,R=(e,t,s)=>{const a=A((s-e)/(t-e||1e-6),0,1);return a*a*(3-2*a)},X=(e,t,s,a)=>D(e,t,1-Math.exp(-s*a)),J=(e,t,s=1.7,a=.05)=>Math.sin(e*s+t*12.9898)*a+Math.sin(e*s*.63+t*78.233)*a*.55,V=(()=>{const e=typeof window<"u"?window.innerWidth:1280,t=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,a=e<820||t;return{mobile:a,touch:t,particles:a?260:900,growthParticles:a?90:220,stemSegs:a?44:80,envQuality:a?"low":"high",dprCap:a?1.7:2,cameraAmplitude:a?.62:1}})(),S={spark:[0,.08],intro:[.08,.125],join:[.125,.17],cp1:[.17,.29],cp1lit:[.29,.325],cp2:[.325,.445],cp2lit:[.445,.48],cp3:[.48,.6],cp3lit:[.6,.63],cp4:[.63,.745],cp4lit:[.745,.775],arena:[.775,.825],board:[.825,.87],next:[.87,.93],finale:[.93,.985]};class j{constructor(){this.p=0,this.raw=0,this.vel=0,this.done=[!1,!1,!1,!1],this.joined=!1,this.score=87,this.tag="THE OBSERVER 👀",this.tagline="You two notice the little things.",this.initials="A + M",this.onCompleteCallbacks=[]}chapterProgress(t){const[s,a]=S[t];return A((this.p-s)/(a-s||1e-6),0,1)}inside(t){const[s,a]=S[t];return this.p>=s&&this.p<a}travel(){return A(this.p/.985,0,1)}syncLevel(){const t=this.done.filter(Boolean).length;return(this.joined?.35:0)+t/4*.65}litCount(){return this.done.filter(Boolean).length}completeSnick(t){if(!this.done[t]){this.done[t]=!0;for(const s of this.onCompleteCallbacks)s(t)}}joinPartner(){this.joined||(this.joined=!0)}}const p=new j,P=.985;function K(){let e=0;const t=i=>{e=A(i,0,1),p.raw=e*P},s=Number(sessionStorage.getItem("sl-progress")||0);s>0&&s<1&&(p.raw=s*P,p.p=p.raw);const a=i=>{document.body.classList.contains("in-dom")||(i.preventDefault(),t(e+i.deltaY*72e-6))};let n=0;const r=i=>{n=i.touches[0].clientY},l=i=>{if(!document.body.classList.contains("in-dom")){i.preventDefault();const d=n-i.touches[0].clientY;n=i.touches[0].clientY,t(e+d*34e-5)}},o=i=>{document.body.classList.contains("in-dom")||(["ArrowDown","PageDown"," ","ArrowRight"].includes(i.key)?(i.preventDefault(),t(e+.012)):["ArrowUp","PageUp","ArrowLeft"].includes(i.key)&&(i.preventDefault(),t(e-.012)))};return window.addEventListener("wheel",a,{passive:!1}),window.addEventListener("touchstart",r,{passive:!1}),window.addEventListener("touchmove",l,{passive:!1}),window.addEventListener("keydown",o),p.jumpTo=i=>t(i),{get ratio(){return e}}}const z={deepWine:3806752,peach:15251868,blush:16512241,copper:12084554,ink:1969683},L=[{id:0,name:"NOTICE",emoji:"👀",css:"#E8B99C"},{id:1,name:"PLAY",emoji:"🎈",css:"#E8B99C"},{id:2,name:"CONNECT",emoji:"💭",css:"#E8B99C"},{id:3,name:"CREATE",emoji:"📸",css:"#B8654A"}];function $(e,t){const s=[],a=o=>o%2===0?"left":"right";function n(o,i,d,f={}){const m=document.createElement("section");return m.className=`chapter side-${f.side??a(s.length)} ${f.cls||""}`,m.dataset.range=i.join(","),m.innerHTML=d,e.appendChild(m),s.push({id:o,el:m,range:i,mode:f.mode||"text",...f}),m}n("spark",S.spark,`
    <div class="ch-inner">
      <p class="kicker">SNICKYLINK</p>
      <h1>MORE THAN<br>A CHAT.</h1>
      <p class="sub">A secret little world for two.</p>
      <p class="hint">scroll to set out ↓</p>
    </div>
  `,{side:"left"}),n("intro",S.intro,`
    <div class="ch-inner">
      <p class="kicker">THE MAP</p>
      <h2>FOUR CHECKPOINTS.<br>ONE PATH. TWO PEOPLE.</h2>
      <p class="sub">Each one hides a Snick — a tiny challenge you both complete together.</p>
      <div class="cp-list">
        ${L.map((o,i)=>`
          <div class="cp-row" data-i="${i}">
            <span class="cp-dot"></span>
            <b>0${i+1} · ${o.name}</b>
            <span class="cp-state">🔒 FOGGED</span>
          </div>
        `).join("")}
      </div>
    </div>
  `,{side:"right"}),n("join",S.join,`
    <div class="ch-inner center">
      <p class="kicker">YOUR PERSON JOINS</p>
      <h2>THE PATH LIGHTS<br>ONLY FOR TWO. ✦</h2>
      <p class="sub">One marker is waiting at the trailhead.</p>
      <button class="cta" id="joinBtn">BRING YOUR PERSON IN →</button>
    </div>
  `,{side:"center"});const r=[{emoji:"👀",name:"NOTICE",task:"“Find one tiny thing about them that you genuinely love — and tell them.”"},{emoji:"🎈",name:"PLAY",task:"“Make each other laugh in 60 seconds.”"},{emoji:"💭",name:"CONNECT",task:"“Ask something you’ve always wanted to do together.”"},{emoji:"📸",name:"CREATE",task:"“Create one tiny memory together.”"}],l=[{key:"cp1",place:"THE FIRST SPARK",lit:"cp1lit"},{key:"cp2",place:"PLAYGROUND",lit:"cp2lit"},{key:"cp3",place:"DEEPER WATERS",lit:"cp3lit"},{key:"cp4",place:"MEMORY PEAK",lit:"cp4lit"}];return r.forEach((o,i)=>{const d=l[i];n(d.key,S[d.key],`
      <div class="ch-inner">
        <p class="kicker">CHECKPOINT 0${i+1} · ${d.place}</p>
        <div class="snick-live" data-i="${i}">
          <div class="snick-top">SNICK 0${i+1} · ${o.emoji} ${o.name}</div>
          <h3>${o.task}</h3>
          <div class="partners">
            <button class="partner-chip" data-partner="you">YOU ✓</button>
            <button class="partner-chip" data-partner="them">YOUR PERSON ✓</button>
          </div>
          <div class="progress-line"><span></span></div>
          <p class="micro">Both of you complete it. That's the rule.</p>
        </div>
      </div>
    `,{side:i%2?"right":"left",mode:"snick",index:i}),n(d.lit,S[d.lit],`
      <div class="ch-inner center">
        <p class="kicker">+20 XP · CHECKPOINT 0${i+1} LIT</p>
        <h2>${d.place} IS AWAKE.</h2>
        <p class="sub">The beacon burns for you two.</p>
      </div>
    `,{side:"center"})}),n("arena",S.arena,`
    <div class="ch-inner center">
      <p class="kicker">AHEAD · LOCKED IN FOG</p>
      <h2>THE CHALLENGE ARENA.</h2>
      <p class="sub">Streaks, XP goals, and trials for two. Not yet — keep showing up.</p>
      <div class="locked-tag">🔒 UNLOCKS WITH YOUR STREAK</div>
    </div>
  `,{side:"center"}),n("board",S.board,`
    <div class="ch-inner center">
      <p class="kicker">FURTHER ON · A GLIMPSE</p>
      <h2>THE FLEX BOARD.</h2>
      <p class="sub">Where showing-up streaks get celebrated. A sample preview lives at the end of this trail — no real couples yet.</p>
    </div>
  `,{side:"center"}),n("next",S.next,`
    <div class="ch-inner center">
      <p class="kicker">BEYOND THE FOG</p>
      <h2>THE MAP KEEPS GOING.</h2>
      <p class="sub">New regions appear as you two do. The first ones are already sketched.</p>
    </div>
  `,{side:"center"}),n("finale",S.finale,`
    <div class="ch-inner center">
      <h1 class="hero-line">FOUR CHECKPOINTS.<br>ONE LIT PATH.</h1>
      <p class="sub">You walked it together.</p>
      <div class="cp-strip">${L.map(o=>`<span>${o.emoji}</span>`).join("<i>→</i>")}</div>
    </div>
  `,{side:"center"}),F(t),s}function F(e){const t=p.score,s=p.initials,a=p.tag,n=p.tagline,r=document.createElement("div");r.id="dom-acts",r.innerHTML=`
    <section class="act score-act">
      <p class="kicker">YOUR RESULT</p>
      <h2>HOW IN-SYNC ARE YOU TWO?</h2>
      <p class="at">AT THE SCORE OBELISK · FINALE ISLAND</p>
      <div class="score-num" id="scoreNum">0</div>
      <div class="bars">
        ${[["COMMUNICATION",8],["PLAY",9],["EFFORT",8],["TRUST",9],["EMOTIONAL SYNC",8]].map(([h,v])=>`
          <div class="bar-row">
            <span class="bar-label">${h}</span>
            <span class="bar"><i style="--w:${v}0%"></i></span>
          </div>
        `).join("")}
      </div>
      <p class="micro">A playful SnickyLink metric — not science, and this one's a sample preview. Your real score comes from actually showing up together.</p>
    </section>

    <section class="act tag-act">
      <p class="kicker">YOUR COUPLE TAG</p>
      <h2 class="tag-name">${a}</h2>
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
        <h3 class="sc-tag">${a}</h3>
        <p class="sc-quote">"${n}"</p>
        <div class="sc-row">4 SNICKS · 4 MOMENTS · 1 CONNECTION</div>
        <div class="sc-cps">${L.map(h=>`<span>${h.emoji}</span>`).join("<i>→</i>")}</div>
        <div class="sc-foot">CONNECT · PLAY · GROW</div>
        <div class="sc-date">${new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase()}</div>
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
  `,e.appendChild(r);const l=r.querySelector("#scoreNum");let o=!1;new IntersectionObserver(h=>{for(const v of h)v.isIntersecting&&!o&&(o=!0,U(l,p.score))},{threshold:.4}).observe(l);const d=new IntersectionObserver(h=>{for(const v of h)v.isIntersecting&&(r.querySelector(".bars").classList.add("grown"),d.disconnect())},{threshold:.3});d.observe(r.querySelector(".bars"));const f="https://docs.google.com/forms/d/e/1FAIpQLSfpvXYWIAXUl2ggcyJYrHn5ZOgUr8Z3Xm-Sjvn4GtPEJkLUug/formResponse",m={name:"entry.1906209180",email:"entry.646925955"},c=r.querySelector("#waitlistForm");c.addEventListener("submit",h=>{if(h.preventDefault(),c.dataset.busy)return;const v=new FormData(c),T=new URLSearchParams;T.set(m.name,String(v.get("name")||"")),T.set(m.email,String(v.get("email")||""));const b=c.querySelector('button[type="submit"]');c.dataset.busy="1",b&&(b.disabled=!0,b.textContent="JOINING…");const u=c.querySelector(".wl-error");u&&u.remove();const E=fetch(f,{method:"POST",mode:"no-cors",body:T}),O=new Promise((w,y)=>setTimeout(()=>y(new Error("timeout")),9e3));Promise.race([E,O]).then(()=>{c.innerHTML=`<div class="joined-msg"><h2>YOU'RE IN. ✦</h2><p>Now go find your person.</p></div>`,document.body.classList.add("joined"),p.raw=Math.min(p.raw,.984)}).catch(()=>{delete c.dataset.busy,b&&(b.disabled=!1,b.textContent="JOIN THE WAITLIST →");const w=document.createElement("p");w.className="wl-error",w.setAttribute("role","alert"),w.textContent="Couldn't reach the waitlist just now — check your connection and try again. 🫶",c.appendChild(w)})}),r.querySelector("#shareBtn").addEventListener("click",async()=>{const h=`${p.initials} — ${p.score} — ${p.tag}
4 SNICKS · 4 MOMENTS · 1 CONNECTION ✦
SNICKYLINK`;if(navigator.share)try{await navigator.share({text:h,title:"Our SnickyLink Map"})}catch{}else try{await navigator.clipboard.writeText(h),N("Copied. Paste it anywhere. 🫶")}catch{N("Sharing is blocked in this browser — screenshot instead 📸")}}),r.querySelector("#downloadBtn").addEventListener("click",()=>{N("Screenshot the card — it was made for that. 📸")})}function U(e,t){const a=performance.now(),n=r=>{const l=A((r-a)/1600,0,1),o=1-Math.pow(1-l,3);e.textContent=Math.round(o*t),l<1&&requestAnimationFrame(n)};requestAnimationFrame(n)}function N(e){const t=document.createElement("div");t.className="toast",t.textContent=e,document.body.appendChild(t),setTimeout(()=>t.classList.add("show"),10),setTimeout(()=>t.classList.remove("show"),2400),setTimeout(()=>t.remove(),2800)}function B(e,t){const s=$(e,t),a=[...e.querySelectorAll(".snick-live")],n=[...e.querySelectorAll(".cp-row")];a.forEach(c=>{const h=Number(c.dataset.i),v=[...c.querySelectorAll(".partner-chip")],T=c.querySelector(".progress-line span");v.forEach(b=>{b.addEventListener("click",()=>{if(b.classList.contains("on"))return;b.classList.add("on");const u=v.filter(E=>E.classList.contains("on")).length;T.style.width=`${u/2*100}%`,u===2&&setTimeout(()=>{p.completeSnick(h),c.classList.add("completed"),c.querySelector(".micro").textContent="SNICK COMPLETE · +20 XP";const E=n[h];E&&(E.querySelector(".cp-state").textContent="✦ LIT",E.classList.add("done"))},350)})})});const r=e.querySelector("#joinBtn");r.addEventListener("click",()=>{p.joinPartner(),p.raw=Math.min(p.raw,.168),r.textContent="✦ YOUR PERSON IS ON THE PATH",r.disabled=!0,document.body.classList.add("joined")});const l=document.createElement("div");l.className="rail",l.innerHTML=`
    <span class="rail-label" id="railLabel">THE TRAILHEAD</span>
    <div class="rail-track"><div class="rail-fill"></div></div>
    <div class="rail-cps">${L.map(c=>`<span data-f="${c.id}" title="Checkpoint 0${c.id+1} · ${c.name}">${c.id+1}</span>`).join("")}</div>
  `,document.body.appendChild(l);const o=document.createElement("div");o.className="sr-progress",o.setAttribute("aria-live","polite"),o.setAttribute("role","status"),document.body.appendChild(o);let i=null;const d=document.createElement("button");d.className="skip-btn",d.textContent="SKIP TO THE END ↓",d.addEventListener("click",()=>{p.jumpTo(1),document.body.classList.add("in-dom")}),document.body.appendChild(d);const f=s;function m(){const c=p.p,h=c>=.9815;document.body.classList.toggle("in-dom",h);for(const u of f){const[E,O]=u.range;if(c>=E-.012&&c<O+.012){const y=A((c-E)/(O-E||1e-6),0,1),C=R(0,.22,y),I=1-R(.8,1,y);u.el.style.opacity=String(Math.min(C,I)),u.el.style.transform=`translateY(${(1-C)*34-(1-I)*26}px)`,u.el.style.pointerEvents=u.mode==="snick"||u.id==="join"?"auto":"none",u.el.classList.add("active")}else u.el.classList.remove("active"),u.el.style.opacity="0",u.el.style.pointerEvents="none"}const v=l.querySelector(".rail-fill");v.style.height=`${c*100}%`;const T=l.querySelector("#railLabel"),b=W(c);T.textContent=b;for(const u of l.querySelectorAll(".rail-cps span")){const E=Number(u.dataset.f);u.classList.toggle("on",p.done[E])}b!==i&&(i=b,o.textContent=`Checkpoint: ${b}`),d.classList.toggle("show",c>.02&&c<.97);for(const u of a){const E=Number(u.dataset.i),[O,w]=S[`cp${E+1}`],y=c>=O&&c<w+.02;u.classList.toggle("waiting",y&&!p.done[E])}requestAnimationFrame(m)}return requestAnimationFrame(m),{chapters:s,frame:m}}function W(e){return e<.08?"THE TRAILHEAD":e<.125?"THE MAP":e<.17?"YOUR PERSON JOINS":e<.29?"CHECKPOINT 01 · THE FIRST SPARK · NOTICE":e<.325?"WALKING ON · CHECKPOINT 02 AHEAD":e<.445?"CHECKPOINT 02 · PLAYGROUND · PLAY":e<.48?"WALKING ON · CHECKPOINT 03 AHEAD":e<.6?"CHECKPOINT 03 · DEEPER WATERS · CONNECT":e<.63?"WALKING ON · CHECKPOINT 04 AHEAD":e<.745?"CHECKPOINT 04 · MEMORY PEAK · CREATE":e<.825?"THE CHALLENGE ARENA · LOCKED":e<.87?"THE FLEX BOARD · AHEAD":e<.93?"REGIONS BEYOND THE FOG":"THE LIT PATH"}window.__sl={journey:p};const H=document.getElementById("scene"),_=document.getElementById("overlay"),G=document.getElementById("ui");K();const x=B(_,G);window.__sl.frame=x.frame;async function q(){let e=!1;try{const{webglSupported:t}=await g(async()=>{const{webglSupported:s}=await import("./world-BUGjO290.js");return{webglSupported:s}},__vite__mapDeps([0,1]));e=t()}catch{e=!1}if(e)try{const{World:t}=await g(async()=>{const{World:l}=await import("./world-BUGjO290.js");return{World:l}},__vite__mapDeps([0,1])),s=new t(H);window.__sl.world=s,H.style.display="block";const a=await g(()=>import("./three.module-BT1pP-6r.js"),[]),n=new a.Clock;let r=!1;document.addEventListener("visibilitychange",()=>{r=document.hidden}),(function l(){requestAnimationFrame(l);const o=Math.min(n.getDelta(),.05);if(r)return;const i=n.elapsedTime;s.update(o,i),s.renderer.render(s.scene,s.camera)})()}catch(t){console.warn("3D world failed to start, using static fallback:",t);const{mountStaticFallback:s}=await g(async()=>{const{mountStaticFallback:a}=await import("./world-BUGjO290.js");return{mountStaticFallback:a}},__vite__mapDeps([0,1]));s()}else{const{mountStaticFallback:t}=await g(async()=>{const{mountStaticFallback:s}=await import("./world-BUGjO290.js");return{mountStaticFallback:s}},__vite__mapDeps([0,1]));t()}document.body.classList.add("world-ready")}q();try{const e=JSON.parse(sessionStorage.getItem("sl-done")||"[]"),t=sessionStorage.getItem("sl-joined")==="1";e.forEach((s,a)=>{s&&(p.done[a]=!0)}),t&&(p.joined=!0,document.body.classList.add("joined"))}catch{}setInterval(()=>{try{sessionStorage.setItem("sl-progress",String(p.raw/.985)),sessionStorage.setItem("sl-done",JSON.stringify(p.done)),sessionStorage.setItem("sl-joined",p.joined?"1":"0")}catch{}},2500);window.addEventListener("load",()=>{setTimeout(()=>document.body.classList.add("loader-gone"),450)});setTimeout(()=>document.body.classList.add("loader-gone"),2500);export{z as B,X as a,A as c,V as d,p as j,D as l,R as s,J as w};

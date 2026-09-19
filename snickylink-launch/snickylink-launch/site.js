/* SNICKYLINK — interactive layer */

// ============= NAV: dark section detection =============
const nav = document.getElementById('topnav');
const darkSections = document.querySelectorAll('.pair-section, .worlds-section, .story-section, .final-section');
const navObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const r = e.target.getBoundingClientRect();
      if(r.top < 80 && r.bottom > 80) nav.classList.add('dark');
    }
  });
},{threshold:[0,1], rootMargin:'-70px 0px 0px 0px'});
// simpler: check scroll
window.addEventListener('scroll', ()=>{
  let onDark = false;
  darkSections.forEach(s=>{
    const r = s.getBoundingClientRect();
    if(r.top <= 80 && r.bottom >= 80) onDark = true;
  });
  nav.classList.toggle('dark', onDark);
});

// ============= HERO: mouse-follow thread =============
const stage = document.getElementById('hero-stage');
const youDot = document.getElementById('youDot');
const themDot = document.getElementById('themDot');
const youGlow = document.getElementById('youGlow');
const themGlow = document.getElementById('themGlow');
const thread = document.getElementById('thread');
const thread2 = document.getElementById('thread2');

let mouseX = 0.5, mouseY = 0.5;
let cx = 250, cy = 300;

stage.addEventListener('mousemove', (e)=>{
  const rect = stage.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) / rect.width;
  mouseY = (e.clientY - rect.top) / rect.height;
});
stage.addEventListener('mouseleave', ()=>{ mouseX = 0.7; mouseY = 0.6; });

function animateHero(){
  // ease the "control point" of the thread toward mouse
  const targetX = 100 + mouseX * 300;
  const targetY = 100 + mouseY * 300;
  cx += (targetX - cx) * 0.08;
  cy += (targetY - cy) * 0.08;

  // Also move "your person" dot subtly toward mouse when close
  const linked = stage.classList.contains('linked');
  const themX = linked ? 350 : (330 + (mouseX - 0.7) * 40);
  const themY = linked ? 300 : (300 + (mouseY - 0.5) * 30);

  thread.setAttribute('d', `M 150 300 Q ${cx} ${cy} ${themX} ${themY}`);
  thread2.setAttribute('d', `M 150 300 Q ${cx} ${cy} ${themX} ${themY}`);
  themDot.setAttribute('cx', themX);
  themDot.setAttribute('cy', themY);
  themGlow.setAttribute('cx', themX);
  themGlow.setAttribute('cy', themY);

  // opacity of thread grows as they get closer (visually)
  const dx = (mouseX - 0.7), dy = (mouseY - 0.5);
  const dist = Math.sqrt(dx*dx + dy*dy);
  const closeness = Math.max(0, 1 - dist * 2);
  thread.setAttribute('stroke-width', 0.8 + closeness * 1.5);
  thread.setAttribute('opacity', 0.4 + closeness * 0.5);

  requestAnimationFrame(animateHero);
}
animateHero();

// ============= PAIR UNLOCK MECHANIC =============
const inviteBtn = document.getElementById('invite-btn');
const threadWrap = document.getElementById('thread-wrap');
const pcThem = document.getElementById('pc-them');
const pairMsg = document.getElementById('pair-msg');
const pairPathOn = document.getElementById('pairPathOn');
const revealSnick = document.getElementById('reveal-snick');
const snickCards = document.querySelectorAll('.snick-card');
const pairStatus = document.getElementById('pair-status');
const pairLabel = document.getElementById('pair-label');

// Restore state
let linked = localStorage.getItem('snick_linked') === '1';
function applyLinked(instant = false){
  if(linked){
    threadWrap.classList.remove('linking');
    threadWrap.classList.add('linked');
    pcThem.classList.remove('waiting');
    pcThem.querySelector('.avatar').textContent = 'M';
    pcThem.querySelector('.label').textContent = '● Your person';
    pcThem.querySelector('.status').textContent = 'Connected';
    pairPathOn.style.opacity = '1';
    inviteBtn.textContent = 'Both in ✦';
    pairMsg.innerHTML = 'Both of you are here. <em style="color:var(--blush); font-style:italic;">Something just opened.</em>';
    revealSnick.classList.add('show');
    stage.classList.add('linked');
    // Unblur snicks (leave last one — mystery)
    snickCards.forEach((c, i) => {
      if(i < 5){
        setTimeout(()=>{
          c.classList.remove('locked');
          c.classList.add('unlocked');
        }, instant ? 0 : i * 200);
      }
    });
    // Nav pair
    pairStatus.classList.add('linked');
    pairLabel.textContent = '2 of 2 · linked';
  }
}
applyLinked(true);

inviteBtn.addEventListener('click', ()=>{
  if(linked) return;
  threadWrap.classList.add('linking');
  inviteBtn.textContent = 'sending invite…';
  // fake progress
  setTimeout(()=>{ inviteBtn.textContent = 'them ringing…'; }, 900);
  setTimeout(()=>{ inviteBtn.textContent = 'they accepted ✓'; }, 1800);
  setTimeout(()=>{
    linked = true;
    localStorage.setItem('snick_linked', '1');
    applyLinked();
    // pulse effect on avatars
    document.querySelectorAll('.person-card .avatar').forEach(a=>{
      a.animate([
        {transform:'scale(1)', boxShadow:'0 0 40px rgba(232,185,156,.4)'},
        {transform:'scale(1.1)', boxShadow:'0 0 80px rgba(232,185,156,.9)'},
        {transform:'scale(1)', boxShadow:'0 0 40px rgba(232,185,156,.4)'}
      ], {duration: 1200, easing:'ease-out'});
    });
  }, 2600);
});

// Also let a "reset" gesture on the pair area — double click the invite label
document.querySelector('.invite-link').addEventListener('dblclick', ()=>{
  localStorage.removeItem('snick_linked');
  location.reload();
});

// ============= CHAT FADE ============
const chatSection = document.querySelector('.chat-section');
const chatMsgs = document.querySelectorAll('[data-chat]');
const chatReveal = document.getElementById('chat-reveal');

const chatObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      // stagger fade
      chatMsgs.forEach((m, i)=>{
        setTimeout(()=> m.classList.add('fade'), 800 + i * 250);
      });
      setTimeout(()=> chatReveal.classList.add('show'), 800 + chatMsgs.length * 250 + 200);
    }
  });
},{threshold:.35});
chatObs.observe(chatSection);

// ============= GARDEN SCROLL GROWTH =============
const gardenVisual = document.getElementById('garden-visual');
const gardenStages = document.querySelectorAll('.garden-stages .stage');
const growthNum = document.getElementById('growth-num');
const seed = document.getElementById('seed');
const stemPath = document.getElementById('stemPath');
const leaves = document.getElementById('leaves');
const branches = document.getElementById('branches');
const blooms = document.getElementById('blooms');
const fruit = document.getElementById('fruit');
const canopy = document.getElementById('canopy');
const bgGlow = document.getElementById('bgGlow');

function updateGarden(){
  const rect = gardenVisual.getBoundingClientRect();
  const vh = window.innerHeight;
  // progress from when top hits bottom of viewport to top leaves viewport
  const total = vh + rect.height;
  const progressed = vh - rect.top;
  let p = Math.max(0, Math.min(1, progressed / total));

  // 6 stages
  const stage = Math.min(5, Math.floor(p * 6));

  // Stem grows: from y=470 up to y=200 max
  const stemTopY = 470 - p * 270;
  stemPath.setAttribute('d', `M 200 470 L 200 ${stemTopY}`);
  stemPath.setAttribute('stroke-width', 2 + p * 3);

  // Seed shrinks after first stage
  seed.setAttribute('opacity', Math.max(0.2, 1 - p * 1.5));

  // BG glow expands
  bgGlow.setAttribute('r', p * 180);

  // Elements fade in progressively
  leaves.setAttribute('opacity', Math.min(1, Math.max(0, (p - 0.1) * 3)));
  branches.setAttribute('opacity', Math.min(1, Math.max(0, (p - 0.35) * 3)));
  blooms.setAttribute('opacity', Math.min(1, Math.max(0, (p - 0.55) * 3)));
  fruit.setAttribute('opacity', Math.min(1, Math.max(0, (p - 0.75) * 4)));
  canopy.setAttribute('opacity', Math.min(1, Math.max(0, (p - 0.85) * 6)));

  // Update side list active state
  gardenStages.forEach((s, i)=>{
    s.classList.toggle('active', i <= stage);
  });

  // Growth number
  growthNum.innerHTML = String(stage + 1).padStart(2,'0') + '<sup>/06</sup>';
}
window.addEventListener('scroll', updateGarden);
updateGarden();

// ============= SCORE CARD ANIMATE ============
const scoreCard = document.getElementById('score-card');
const bigScore = document.getElementById('bigScore');
const scoreObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      scoreCard.classList.add('animate');
      // count up
      let n = 0;
      const target = 87;
      const step = ()=>{
        n += 2;
        if(n >= target){ bigScore.innerHTML = target + '<span class="out-of">/100</span>'; return; }
        bigScore.innerHTML = n + '<span class="out-of">/100</span>';
        requestAnimationFrame(step);
      };
      step();
      scoreObs.disconnect();
    }
  });
},{threshold:.35});
scoreObs.observe(scoreCard);

// ============= IG STORY GENERATOR ============
const iniA = document.getElementById('ini-a');
const iniB = document.getElementById('ini-b');
const tagSel = document.getElementById('tag-sel');
const snickTitleIn = document.getElementById('snick-title-in');
const scoreSlider = document.getElementById('score-slider');
const scoreVal = document.getElementById('score-val');
const snickSlider = document.getElementById('snick-slider');
const snickVal = document.getElementById('snick-val');

const cCouple = document.getElementById('c-couple');
const cTag = document.getElementById('c-tag');
const cTitle = document.getElementById('c-title');
const cScore = document.getElementById('c-score');
const cNum = document.getElementById('c-num');
const cDate = document.getElementById('c-date');

const quoteByTag = {
  'The Observers': 'You two notice\nthe little things.',
  'The Chaos Duo': 'You break each other.\nIn the best way.',
  'The Late Nighters': 'Best conversations\nhappen past midnight.',
  'The Slow Burners': 'Nothing rushed.\nEverything true.',
  'The Quiet Storms': 'Loud on the inside.\nCalm on the outside.',
  'The Beginners': 'Something is starting.\nYou can feel it.'
};

function updateStory(){
  cCouple.textContent = (iniA.value || 'A') + ' + ' + (iniB.value || 'M');
  cTag.textContent = tagSel.value;
  cTitle.textContent = snickTitleIn.value || 'The Observer';
  const s = scoreSlider.value;
  cScore.textContent = s;
  scoreVal.textContent = s;
  scoreSlider.style.setProperty('--pct', ((s - 60) / 40 * 100) + '%');
  const n = String(snickSlider.value).padStart(2,'0');
  cNum.textContent = n;
  snickVal.textContent = n;
  snickSlider.style.setProperty('--pct', ((snickSlider.value - 1) / 47 * 100) + '%');
  // quote
  const q = quoteByTag[tagSel.value] || 'You two show up.';
  document.querySelector('#story-card .quote').innerHTML = '"' + q.replace('\n','<br/>') + '"';
  // date
  const d = new Date();
  cDate.textContent = d.getDate() + ' · SEP · 2026';
}
[iniA, iniB, tagSel, snickTitleIn, scoreSlider, snickSlider].forEach(el=>{
  el.addEventListener('input', updateStory);
  el.addEventListener('change', updateStory);
});
updateStory();

// ============= SHARE WALL POPULATE =============
const wallData = [
  {v:'87', tag:'THE OBSERVER', bg:'wine', foot:'A + M · SNICK 07'},
  {v:'14', tag:'DAY STREAK 🔥', bg:'peach', foot:'J + K · WEEK 2'},
  {v:'92', tag:'THE CHAOS DUO 😂', bg:'copper', foot:'D + L · SNICK 12'},
  {v:'7', tag:'DAYS. WE DID IT.', bg:'wine', foot:'S + R'},
  {v:'ORBIT', tag:'WE MADE IT TO WORLD 02', bg:'blush', foot:'E + N'},
  {v:'#42', tag:'GLOBAL RANK', bg:'copper', foot:'A + M'},
  {v:'96', tag:'LATE NIGHT ANSWER', bg:'wine', foot:'T + P · 2:14 AM'},
  {v:'42', tag:'MEMORIES PLANTED', bg:'peach', foot:'C + V'},
  {v:'✦', tag:'FIRST SNICK COMPLETE', bg:'blush', foot:'M + O'},
  {v:'21', tag:'DAY STREAK 🔥', bg:'copper', foot:'H + Y'},
  {v:'89', tag:'THE SLOW BURNERS', bg:'wine', foot:'B + Z'},
  {v:'∞', tag:'MOMENTS TOGETHER', bg:'peach', foot:'A + M'}
];

function makeMini(d){
  const el = document.createElement('div');
  el.className = 'mini-story ' + d.bg;
  el.innerHTML = `
    <div class="ms-brand">SNICKYLINK</div>
    <div>
      <div class="ms-big">${d.v}</div>
      <div class="ms-tag">${d.tag}</div>
    </div>
    <div class="ms-foot">${d.foot}</div>`;
  return el;
}
const r1 = document.getElementById('wall-r1');
const r2 = document.getElementById('wall-r2');
// Double for infinite scroll
const doubled = [...wallData, ...wallData];
doubled.slice(0, 12).forEach(d=> r1.appendChild(makeMini(d)));
doubled.slice(6, 18).forEach(d=> r2.appendChild(makeMini(d)));

// ============= SNICK CARD HOVER MICRO ============
snickCards.forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    if(!card.classList.contains('locked')) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = '';
  });
});

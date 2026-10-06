import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/snickylink-couple-logo.png";

const SNICKS = [
  { n: "01", icon: "👀", name: "NOTICE", prompt: "Find one tiny thing you genuinely love about your person." },
  { n: "02", icon: "😂", name: "PLAY", prompt: "Make each other laugh in 60 seconds." },
  { n: "03", icon: "💭", name: "CONNECT", prompt: "Something you've always wanted to do together?" },
  { n: "04", icon: "📸", name: "CREATE", prompt: "Create one tiny memory together." },
] as const;
const WORLDS = [
  ["01", "🌿", "The Honeymoon Glade", "Your first world."],
  ["02", "🔥", "Synchronous Orbit", "Keep going together."],
  ["03", "🗝️", "Vulnerability Dungeon", "Go a little deeper."],
  ["04", "✨", "Celestial Resonance", "The endgame."],
] as const;
const THEMES = ["wine", "peach", "noir"] as const;
type Theme = (typeof THEMES)[number];
type SheetState = { index: number; complete: boolean } | null;

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Lock({ open = false }: { open?: boolean }) {
  return <span aria-hidden="true" className={`duo-lock ${open ? "open" : ""}`} />;
}

function SnickCard({ index, state }: { index: number; state: "locked" | "unlocked" | "active" | "complete" }) {
  const snick = SNICKS[index];
  if (!snick) return null;
  const label = state === "locked" ? "SEALED" : state === "complete" ? "✓ COMPLETE" : state === "active" ? "PLAY NOW" : "UNLOCKED";
  return <article className={`duo-card ${state}`}>
    <span className="duo-shine" />
    <div className="duo-card-num"><span>SNICK {snick.n}</span><span>+20</span></div>
    <div className="duo-card-icon">{snick.icon}</div>
    <strong>{snick.name}</strong>
    {state === "locked" ? <div className="duo-mask"><i/><i/><i/></div> : <p>{snick.prompt}</p>}
    <div className="duo-card-state">{label} {state !== "complete" && <Lock open={state !== "locked"}/>}</div>
  </article>;
}

function Section({ id, light = false, narrow = false, children }: { id: string; light?: boolean; narrow?: boolean; children: React.ReactNode }) {
  return <section id={id} className={`duo-section ${light ? "light" : "dark"}`}><div className={`duo-wrap ${narrow ? "narrow" : ""}`}>{children}</div></section>;
}

function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = performance.now(); let frame = 0;
    const tick = (now: number) => { const p = Math.min(1, (now - start) / 1000); setShown(Math.round(value * (1 - (1 - p) ** 3))); if (p < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{shown}</>;
}

export function DuoGame() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [created, setCreated] = useState(false);
  const [paired, setPaired] = useState(false);
  const [done, setDone] = useState([false, false, false, false]);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [checks, setChecks] = useState([false, false]);
  const [notice, setNotice] = useState("");
  const [memory, setMemory] = useState("");
  const [timer, setTimer] = useState(60);
  const [running, setRunning] = useState(false);
  const [answers, setAnswers] = useState(["", ""]);
  const [locked, setLocked] = useState([false, false]);
  const [theme, setTheme] = useState<Theme>("wine");
  const [joinCode, setJoinCode] = useState("");
  const [toast, setToast] = useState("");
  const me = nameA.trim() || "Uday";
  const them = nameB.trim() || "Ria";
  const duo = `${me.toUpperCase()} × ${them.toUpperCase()}`;
  const completed = done.filter(Boolean).length;
  const xp = completed * 20;
  const current = done.findIndex((item) => !item);
  const allDone = completed === 4;
  const code = "SNK7X2";
  const month = useMemo(() => new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date()).toUpperCase(), []);

  useEffect(() => { if (!running || timer <= 0) return; const id = window.setInterval(() => setTimer((v) => v - 1), 1000); return () => window.clearInterval(id); }, [running, timer]);
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(""), 2200); return () => window.clearTimeout(id); }, [toast]);
  useEffect(() => { document.body.style.overflow = sheet ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [sheet]);

  const createDuo = (event: FormEvent) => { event.preventDefault(); setNameA(me); setNameB(them); setCreated(true); window.setTimeout(() => jump("locked"), 120); };
  const pair = () => { setPaired(true); setToast("You're both in ✦"); window.setTimeout(() => jump("locked"), 180); };
  const openSnick = (index: number) => { if (index === 2) { jump("lock2"); return; } setChecks([false, false]); setSheet({ index, complete: false }); };
  const complete = (index: number) => {
    setDone((old) => old.map((value, i) => i === index ? true : value));
    if (index === 2) { setToast("+20 XP · CREATE unlocked"); window.setTimeout(() => jump("board"), 300); }
    else setSheet({ index, complete: true });
  };
  const nextFromSheet = () => { const index = sheet?.index ?? 0; setSheet(null); window.setTimeout(() => jump(index === 3 ? "result" : index === 1 ? "lock2" : "board"), 120); };
  const copy = async (text: string, message: string) => { try { await navigator.clipboard.writeText(text); } catch { /* clipboard may be unavailable */ } setToast(message); };
  const shareInvite = async () => { const text = `${me} wants to play SNICKYLINK with you 🫶 Our duo code: ${code}`; if (navigator.share) { try { await navigator.share({ title: "SNICKYLINK", text }); return; } catch { return; } } await copy(text, "Invite copied — send it ✦"); };
  const join = (event: FormEvent) => { event.preventDefault(); if (joinCode.trim().toUpperCase().startsWith("SNK") && joinCode.trim().length === 6) pair(); else setToast("That code doesn't look right"); };

  const downloadStory = async (share = false) => {
    const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1920; const ctx = canvas.getContext("2d"); if (!ctx) return;
    const css = getComputedStyle(document.documentElement); const val = (key: string) => css.getPropertyValue(key).trim();
    const palette: [string, string, string] = theme === "peach" ? [val("--blush"), val("--peach"), val("--deep-wine")] : theme === "noir" ? [val("--ink"), val("--deep-wine"), val("--peach")] : [val("--wine"), val("--deep-wine"), val("--blush")];
    const [backgroundStart, backgroundEnd, foreground] = palette;
    const g = ctx.createLinearGradient(0, 0, 1080, 1920); g.addColorStop(0, backgroundStart); g.addColorStop(1, backgroundEnd); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); ctx.textAlign = "center"; ctx.fillStyle = foreground;
    const write = (text: string, y: number, size: number, family = "Nunito") => { ctx.font = `800 ${size}px ${family}`; ctx.fillText(text, 540, y, 900); };
    write("✦ SNICKYLINK", 150, 34); write(duo, 640, 72); write("87", 1040, 400); write("DUO SYNC SCORE", 1110, 28); write("THE CHAOS DUO 😂", 1260, 64); write("4 SNICKS COMPLETE", 1390, 32); write(`${xp} XP · BRONZE LEAGUE`, 1450, 32); write("MORE THAN A CHAT.", 1690, 58, "Fraunces"); write("CONNECT · PLAY · GROW", 1770, 28);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png")); if (!blob) return; const file = new File([blob], `snickylink-${me.toLowerCase()}-x-${them.toLowerCase()}.png`, { type: "image/png" });
    if (share && navigator.canShare?.({ files: [file] })) { try { await navigator.share({ files: [file], title: "SNICKYLINK" }); return; } catch { return; } }
    const href = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = href; link.download = file.name; link.click(); window.setTimeout(() => URL.revokeObjectURL(href), 1000); setToast("Story card saved ✦");
  };
  const reset = () => { setNameA(""); setNameB(""); setCreated(false); setPaired(false); setDone([false, false, false, false]); setAnswers(["", ""]); setLocked([false, false]); setSheet(null); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <main className="duo-page">



    <Section id="hero"><div className="duo-hero"><div className="duo-hero-copy"><div className="duo-hero-brand"><img src={logo} alt=""/><span>SNICKYLINK</span></div><p className="duo-label">BETWEEN US ONLY.</p><h1><span>A PRIVATE</span><span>WORLD</span><span>FOR YOU</span><em>+ yours.</em></h1><p>Daily dares for two. Collect memories.<br/>Climb the duo league.</p><Button className="duo-btn peach" onClick={() => jump("setup")}>CLAIM OUR SPACE <span aria-hidden="true">→</span></Button></div><div className="duo-hero-deck" aria-hidden="true">{SNICKS.slice(0, 3).map((_, i) => <SnickCard key={i} index={i} state="locked" />)}<div className="duo-card mystery"><span className="duo-mystery-mark">?</span><strong>?</strong><small>UNSEAL ME</small></div></div></div></Section>

    <Section id="setup" light narrow><p className="duo-step">STEP 1 · THE LINK</p><h2>Who's <em>playing?</em></h2><form className="duo-setup" onSubmit={createDuo}><label>YOUR NAME<input value={nameA} onChange={(e) => setNameA(e.target.value)} maxLength={14} placeholder="Uday" /></label><span>×</span><label>YOUR PERSON'S NAME<input value={nameB} onChange={(e) => setNameB(e.target.value)} maxLength={14} placeholder="Ria" /></label><Button className="duo-btn wine" type="submit">CREATE OUR DUO →</Button></form>{created && <p className="duo-created">✦ Duo created: <b>{duo}</b></p>}</Section>

    <Section id="locked"><p className="duo-step">STEP 2 · THE RITUALS</p><h2>{paired ? <><span>4</span> Snicks <em>unlocked.</em></> : <>Our secrets are <em>whispering.</em> 🔒</>}</h2><p className="duo-sub">Locked rituals only open when you both arrive.</p><div className="duo-deck">{SNICKS.map((_, i) => <SnickCard key={i} index={i} state={!paired ? "locked" : done[i] ? "complete" : i === current ? "active" : "unlocked"} />)}</div><div className="duo-center"><p className="duo-whisper"><i/>{paired ? "YOU'RE BOTH IN. ❤️" : "THE DOOR STAYS LOCKED UNTIL YOU LINK."}</p>{!paired && <Button className="duo-btn peach" onClick={() => jump("connect")}>INVITE YOUR PERSON →</Button>}</div></Section>

    <Section id="connect" light narrow><p className="duo-step">STEP 3 · PAIR UP</p><h2>Link your <em>person.</em></h2>{!created ? <div className="duo-locked-panel"><Lock/><b>Name your duo first.</b><span>THEN WE'LL MAKE YOUR CODE</span><Button variant="link" onClick={() => jump("setup")}>← WHO'S PLAYING?</Button></div> : <><div className="duo-code-box"><span>SEND THIS CODE TO {them.toUpperCase()}</span><strong>{code}</strong><div><Button className="duo-btn peach" onClick={() => copy(code, "Code copied ✦")}>COPY CODE</Button><Button className="duo-btn ghost" onClick={shareInvite}>SHARE INVITE</Button></div></div><p className="duo-or">I HAVE A CODE</p><form className="duo-join" onSubmit={join}><input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={6} placeholder="SNK···" aria-label="Duo code"/><Button className="duo-btn wine" type="submit">JOIN</Button></form><p className="duo-hint">Got a code from your person? Pop it in.</p><div className={`duo-pair ${paired ? "joined" : ""}`}><span>{me[0]?.toUpperCase()}</span><i/><span>{paired ? them[0]?.toUpperCase() : "?"}</span></div><p className="duo-pair-status">{paired ? "YOU'RE BOTH IN. ❤️" : "WAITING FOR YOUR PERSON…"}</p>{!paired && <Button variant="link" className="duo-demo" onClick={pair}>demo: {them} joins now</Button>}</>}</Section>

    {paired && <Section id="board"><div className="duo-in"><p className="duo-step">STEP 4 · PLAY</p><h2>You're both <em>in.</em> ❤️</h2><p>{4 - completed} TO PLAY · {completed} COMPLETE</p></div>{current >= 0 ? <article className="duo-now"><header><span>SNICK {SNICKS[current]?.n} · UP NEXT</span><b>+20 XP</b></header><h3>{SNICKS[current]?.name} {SNICKS[current]?.icon}</h3><p>“{SNICKS[current]?.prompt}”</p><Button className="duo-btn wine" onClick={() => openSnick(current)}>PLAY SNICK →</Button></article> : <div className="duo-allclear"><p>All four Snicks, done. ✦</p><Button className="duo-btn peach" onClick={() => jump("result")}>SEE YOUR RESULT →</Button></div>}<div className="duo-track">{SNICKS.map((s, i) => <span key={s.n} className={done[i] || i === current ? "on" : ""}>{done[i] ? "✓ " : ""}{s.name}</span>)}</div></Section>}

    {paired && done[0] && done[1] && <Section id="lock2" light narrow><p className="duo-step">SNICK 03 · CONNECT 💭 · +20 XP</p><h2>Don't <em>peek.</em> 😉</h2><div className="duo-peek"><span><b>1</b>You answer.</span><span><b>2</b>Your person answers.</span><span><b>3</b>Then both reveal together.</span></div><p className="duo-question">“{SNICKS[2].prompt}”</p><div className="duo-answers">{[me, them].map((name, i) => <article key={i} className={i ? "person" : "you"}><strong><i>{name[0]?.toUpperCase()}</i>{name}</strong>{locked.every(Boolean) ? <blockquote>“{answers[i]}”</blockquote> : locked[i] ? <div className="duo-sealed"><Lock/><span>LOCKED IN</span><small>NO PEEKING</small></div> : <><textarea value={answers[i]} onChange={(e) => setAnswers((old) => old.map((v, x) => x === i ? e.target.value : v))} placeholder={i ? "learn to make pasta…" : "road trip to the sea…"}/><Button disabled={!answers[i]?.trim()} onClick={() => setLocked((old) => old.map((v, x) => x === i ? true : v))}>LOCK MY ANSWER 🔒</Button></>}</article>)}</div><div className="duo-reveal">{locked.every(Boolean) ? <><span>DUAL REVEAL ✦</span>{!done[2] && <Button className="duo-btn wine" onClick={() => complete(2)}>CLAIM +20 XP →</Button>}</> : <p>{locked.some(Boolean) ? "ONE LOCKED · WAITING ON THE OTHER" : "BOTH ANSWERS STAY HIDDEN UNTIL BOTH LOCK"}</p>}</div></Section>}

    {completed > 0 && <><Section id="xp" narrow><p className="duo-step">SHARED PROGRESS</p><h2>Your duo <em>XP</em></h2><div className="duo-xp"><CountUp value={xp}/><small>XP</small></div><p className="duo-xp-copy">{completed} SNICK{completed === 1 ? "" : "S"} COMPLETE</p><div className="duo-bar"><i style={{ width: `${Math.round(xp / 150 * 100)}%` }}/></div><div className="duo-bar-meta"><span>{duo}</span><span>{xp} / 150 → SILVER</span></div><div className="duo-pips">{SNICKS.map((s, i) => <span key={s.n} className={done[i] ? "on" : ""}>{s.icon}</span>)}</div></Section>
    <Section id="league" light narrow><p className="duo-step">THE LEAGUE</p><h2>Your duo <em>league</em></h2><div className="duo-badge"><span>🥉</span><div><small>BRONZE LEAGUE</small><b>{duo}</b><em>{xp} XP</em></div><div className="duo-bar"><i style={{ width: `${Math.round(xp / 150 * 100)}%` }}/></div><div className="duo-bar-meta"><span>NEXT: 🥈 SILVER</span><span>{150 - xp} XP TO GO</span></div></div><ul className="duo-standing">{[["A + M",120],["R + S",95],[duo,xp],["K + P",70],["J + L",45]].sort((a,b) => Number(b[1])-Number(a[1])).map((row,i) => <li key={String(row[0])} className={row[0] === duo ? "me" : ""}><span>{String(i+1).padStart(2,"0")}</span><b>{row[0]}{row[0] === duo && <small>THAT'S YOU TWO</small>}</b><strong>{row[1]}</strong></li>)}</ul><p className="duo-league-note">TOP 3 MOVE UP ON SUNDAY ↑</p></Section></>}

    <Section id="worlds"><p className="duo-step">THE MAP</p><h2>There's more to <em>discover.</em></h2><div className="duo-worlds">{WORLDS.map((w, i) => <article key={w[0]} className={i === 0 ? "on" : "off"}><header><span>WORLD {w[0]}</span><span>{i === 0 ? "● YOU ARE HERE" : "🔒 LOCKED"}</span></header><div>{w[1]}</div><b>{w[2]}</b><em>{w[3]}</em></article>)}</div></Section>

    <Section id="result" light narrow>{allDone ? <div className="duo-result"><p className="duo-step">THE RESULT</p><h2>You two <em>did it.</em> ✦</h2><p>{duo}</p><strong><CountUp value={87}/></strong><small>DUO SYNC SCORE</small><h3>THE CHAOS DUO 😂</h3><em>“You two turn anything into a bit.”</em><div><span><b>4</b>SNICKS</span><span><b>{xp}</b>SHARED XP</span><span><b>🥉</b>BRONZE</span></div><p className="duo-disclaimer">A playful SNICKYLINK metric — not science.</p></div> : <><p className="duo-step">THE RESULT</p><h2>Your duo <em>result</em></h2><div className="duo-locked-panel"><Lock/><b>Finish all 4 Snicks to see it.</b><span>{completed} / 4 COMPLETE</span></div></>}</Section>

    <Section id="flex">{allDone ? <><p className="duo-step">THE TROPHY</p><h2>You two deserve a <em>flex.</em> ✦</h2><div className="duo-flex"><article className={`duo-story ${theme}`}><header><span>✦ SNICKYLINK</span><span>{month}</span></header><p>{duo}</p><strong>87</strong><small>DUO SYNC SCORE</small><h3>THE CHAOS DUO 😂</h3><div>4 SNICKS COMPLETE<br/>{xp} XP · BRONZE LEAGUE</div><footer><em>More than a chat.</em><span>CONNECT · PLAY · GROW</span><small>@SNICKYLINK</small></footer></article><div className="duo-flex-controls"><span>CARD STYLE</span><div>{THEMES.map((item) => <Button key={item} variant="outline" aria-pressed={theme === item} onClick={() => setTheme(item)}><i className={item}/>{item === "wine" ? "MUTED WINE" : item === "peach" ? "PEACH WARM" : "WINE NOIR"}</Button>)}</div><Button className="duo-btn peach" onClick={() => downloadStory(true)}>CREATE INSTAGRAM STORY</Button><Button className="duo-btn ghost" onClick={() => downloadStory()}>SAVE STORY CARD</Button></div></div></> : <><p className="duo-step">THE TROPHY</p><h2>Your <em>flex card</em></h2><div className="duo-locked-panel dark"><Lock/><b>Earned, not given.</b><span>COMPLETE ALL 4 SNICKS TO UNLOCK</span></div></>}</Section>

    <Section id="final" light narrow><div className="duo-final"><p className="duo-step">TO BE CONTINUED</p><h2>That was just the <em>beginning.</em></h2><ol>{WORLDS.map((w, i) => <li key={w[0]} className={i === 0 ? "on" : ""}><span>{w[0]}</span><b>{w[2]}</b>{i === 0 ? <small>✓ CLEARED</small> : <Lock/>}</li>)}</ol><p>What's behind the next gate?</p><Button className="duo-btn wine" onClick={() => !created ? jump("setup") : !paired ? jump("connect") : shareInvite()}>BRING YOUR PERSON →</Button></div></Section>

    <footer className="duo-footer"><button onClick={() => jump("hero")} aria-label="SNICKYLINK — back to top"><img src={logo} alt=""/><span>SNICKYLINK</span></button><p>CONNECT · PLAY · GROW</p><Button variant="link" onClick={reset}>reset demo</Button></footer>

    {sheet && <><button className="duo-sheet-bg" aria-label="Close challenge" onClick={() => setSheet(null)}/><aside className="duo-sheet" role="dialog" aria-modal="true" aria-label={`Snick ${SNICKS[sheet.index]?.n}`}><i className="duo-grab"/><Button variant="ghost" size="icon" className="duo-sheet-close" onClick={() => setSheet(null)} aria-label="Close">×</Button>{sheet.complete ? <div className="duo-complete"><i>✓</i><h3>Snick complete</h3><b>+20 XP</b><p>{sheet.index === 3 ? "That's all four. You two did it. ✦" : `${SNICKS[sheet.index + 1]?.name} ${SNICKS[sheet.index + 1]?.icon} just unlocked.`}</p><Button className="duo-btn wine" onClick={nextFromSheet}>{sheet.index === 3 ? "SEE YOUR RESULT →" : "KEEP GOING →"}</Button></div> : <SnickSheet index={sheet.index} me={me} them={them} notice={notice} setNotice={setNotice} memory={memory} setMemory={setMemory} timer={timer} running={running} setRunning={setRunning} checks={checks} setChecks={setChecks} onComplete={() => complete(sheet.index)}/>}</aside></>}
    {toast && <div className="duo-toast" role="status">{toast}</div>}
  </main>;
}

function SnickSheet({ index, me, them, notice, setNotice, memory, setMemory, timer, running, setRunning, checks, setChecks, onComplete }: { index: number; me: string; them: string; notice: string; setNotice: (v:string)=>void; memory:string; setMemory:(v:string)=>void; timer:number; running:boolean; setRunning:(v:boolean)=>void; checks:boolean[]; setChecks:React.Dispatch<React.SetStateAction<boolean[]>>; onComplete:()=>void }) {
  const snick = SNICKS[index]; if (!snick) return null;
  const ready = index === 0 ? notice.trim().length > 0 : index === 3 ? memory.length > 0 : true;
  useEffect(() => { if (!checks.every(Boolean) || !ready) return undefined; const id = window.setTimeout(onComplete, 300); return () => window.clearTimeout(id); }, [checks, ready, onComplete]);
  return <div className="duo-sheet-body"><p className="duo-step">SNICK {snick.n} · +20 XP</p><h3>{snick.name} {snick.icon}</h3><p className="duo-sheet-prompt">“{snick.prompt}”</p>{index === 0 && <textarea value={notice} onChange={(e)=>setNotice(e.target.value)} maxLength={140} placeholder="the way they hum when they cook…"/>}{index === 1 && <div className="duo-timer"><strong>00:{String(timer).padStart(2,"0")}</strong><Button onClick={() => setRunning(true)}>{running ? timer > 0 ? "GO GO GO" : "TIME!" : "START"}</Button></div>}{index === 3 && <div className="duo-memory">{["📸 a photo","🎙 a voice note","🎧 a song","✎ a doodle"].map((item)=><Button key={item} variant="outline" aria-pressed={memory===item} onClick={()=>setMemory(item)}>{item}</Button>)}</div>}<p className="duo-tap">BOTH OF YOU TAP WHEN DONE</p><div className="duo-checks">{[me,them].map((name,i)=><Button key={name} variant="outline" disabled={!ready} aria-pressed={checks[i]} onClick={()=>setChecks((old)=>old.map((v,x)=>x===i?!v:v))}><i>{name[0]?.toUpperCase()}</i><span>{name}<small>TAP · DONE</small></span></Button>)}</div></div>;
}

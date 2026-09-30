import { LitText } from "./LitText";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { IGNITION, skipIgnition, startVisualIgnition, COUPLE_TAGS, SNICKS, WORLD_CHANGES, useJourney, type SnickId } from "@/lib/journey";
const LOGO_URL = "/snickylink-logo.png";
import { Button } from "@/components/ui/button";
import { Chapter, Reveal } from "./Reveal";
import { SnickCard } from "./SnickCard";
import { LOOKS, StoryCard, type CardLook } from "./StoryCard";

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfpvXYWIAXUl2ggcyJYrHn5ZOgUr8Z3Xm-Sjvn4GtPEJkLUug/formResponse";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach";
const primaryBtn = `h-auto rounded-sm bg-wine px-7 py-3.5 text-xs tracking-[0.26em] uppercase text-blush hover:bg-copper ${focus}`;

function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-4xl leading-[1.05] md:text-6xl">{children}</h2>;
}

function Line({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-lg leading-relaxed text-blush/70">{children}</p>;
}

function DuoPanel() {
  const { duoCode, partnerJoined, joinPartner } = useJourney();
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(duoCode);
      toast("Duo code copied — send it to your person.");
    } catch {
      toast(`Your duo code is ${duoCode}`);
    }
  };

  if (partnerJoined) {
    return (
      <div className="mx-auto mt-9 max-w-md border-y border-peach/25 py-7 text-center">
        <p className="eyebrow">● You · ● Your person</p>
        <p className="mt-4 font-display text-3xl">YOUR SPARKS FOUND EACH OTHER.</p>
      </div>
    );
  }

  return (
    <div id="duo" className="glass-panel mx-auto mt-9 max-w-md rounded-sm p-7 text-left">
      <div className="flex items-center gap-3"><span className="eyebrow">● You</span><span className="h-px flex-1 bg-gradient-to-r from-peach/45 to-transparent" /><span className="eyebrow opacity-35">○ Them</span></div>
      <p className="mt-6 text-[0.65rem] tracking-[0.3em] uppercase text-peach">Your duo code</p>
      <div className="mt-2 flex items-center gap-3">
        <span className="font-display text-4xl tracking-[0.15em]">{duoCode || "···-···"}</span>
        <Button type="button" variant="outline" onClick={copy} className={`h-auto rounded-sm px-3 py-2 text-[0.65rem] tracking-[0.2em] uppercase ${focus}`}>Copy</Button>
      </div>
      <p className="mt-4 text-sm text-blush/55">Share it with your person. Connecting unlocks the activities you complete together.</p>
      <Button type="button" onClick={joinPartner} className={`${primaryBtn} mt-6 w-full`}>Your person is here — join →</Button>
      {codeOpen ? (
        <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (/^[A-Z0-9]{3}-?[A-Z0-9]{3}$/i.test(code.trim())) joinPartner(); else setError("Use six letters or numbers, like ABC-123."); }}>
          <label htmlFor="duo-code" className="sr-only">Duo code</label>
          <input id="duo-code" value={code} onChange={(event) => { setCode(event.target.value); setError(""); }} placeholder="ABC-123" className={`min-w-0 flex-1 rounded-sm border border-input bg-transparent px-3 py-2.5 text-sm tracking-[0.2em] uppercase ${focus}`} />
          <Button type="submit" variant="outline" className={`h-auto rounded-sm px-4 text-xs tracking-[0.2em] uppercase ${focus}`}>Enter</Button>
        </form>
      ) : <Button type="button" variant="ghost" onClick={() => setCodeOpen(true)} className={`mt-3 h-auto w-full text-xs tracking-[0.22em] uppercase text-blush/60 ${focus}`}>I have a duo code →</Button>}
      {error && <p role="alert" className="mt-2 text-xs text-peach">{error}</p>}
    </div>
  );
}

function IgnitionMoment({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"idle" | "run" | "text" | "done">("idle");
  const [announce, setAnnounce] = useState("");
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    startVisualIgnition();
    setPhase("run");
    const flashAt = (IGNITION.approach + IGNITION.flash) * 1000;
    const timers = [
      window.setTimeout(() => { setPhase("text"); setAnnounce("The two sparks met. Your world has begun."); }, flashAt + 250),
      window.setTimeout(() => setPhase("done"), IGNITION.total * 1000 + 1800),
      window.setTimeout(() => setAnnounce("You've entered the Honeymoon Glade. There's more waiting in the fog beyond it."), IGNITION.total * 1000 + 2400),
    ];
    const skip = () => { timers.forEach(clearTimeout); setPhase("done"); setAnnounce("The two sparks met. Your world has begun."); };
    window.addEventListener("snicky-ignition-skip", skip);
    return () => { timers.forEach(clearTimeout); window.removeEventListener("snicky-ignition-skip", skip); };
  }, [active]);
  const running = phase === "run" || phase === "text";
  useEffect(() => {
    if (!running) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); skipIgnition(); } };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [running]);
  return (
    <>
      <div className="sr-only" aria-live="polite">{announce}</div>
      {running && (
        <button type="button" onClick={skipIgnition} aria-label="Skip the ignition animation" className="fixed inset-0 z-40 flex cursor-default items-center justify-center bg-transparent">
          <span className="absolute bottom-8 text-[0.55rem] tracking-[0.4em] uppercase text-blush/35">Tap or press Enter to skip</span>
        </button>
      )}
    </>
  );
}

function ExpansionNote({ id }: { id: SnickId }) {
  const { you, them, partnerJoined } = useJourney();
  const done = you[id] && them[id];
  return (
    <Reveal>
      <span className="eyebrow">World expansion 0{id + 1}</span>
      <Title>{done ? SNICKS[id]?.momentLine ?? "THE WORLD CHANGED." : "THE DARKNESS HOLDS."}</Title>
      <Line>{done ? WORLD_CHANGES[id] : partnerJoined ? "You can look ahead. Only both of you can complete the next shared moment." : "The Glade is alive. Bring your person to unlock this shared moment."}</Line>
    </Reveal>
  );
}

function Waitlist() {
  const { waitlisted, setWaitlisted, names, setNames } = useJourney();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  if (waitlisted) return (
    <Reveal>
      <p className="eyebrow">● A new light at the Glade's edge</p>
      <Title>YOUR SPARK IS NOW PART OF THIS WORLD.</Title>
      <img src={LOGO_URL} alt="Snickylink logo" width={128} height={128} loading="lazy" decoding="async" className="mx-auto mt-12 w-32 opacity-90 mix-blend-screen" />
      <p className="mt-8 font-display text-3xl uppercase">Snickylink</p>
      <p className="eyebrow mt-3">Connect · Play · Grow</p>
    </Reveal>
  );
  const input = `mt-2 w-full rounded-sm border border-input bg-transparent px-4 py-3 text-sm placeholder:text-blush/30 focus:border-peach/70 ${focus}`;
  return (
    <Reveal>
      <span className="eyebrow">Beyond the fog</span>
      <Title>YOUR NEXT ADVENTURE IS STILL HIDDEN.</Title>
      <Line>Leave your spark here. We'll call you both when the next world opens.</Line>
      <form className="mx-auto mt-10 max-w-sm space-y-4 text-left" onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        const person = String(data.get("person") || "").trim();
        setStatus("sending");
        try {
          await fetch(FORM_URL, { method: "POST", mode: "no-cors", body: new URLSearchParams({ "entry.1906209180": person ? `${name} (+ ${person})` : name, "entry.646925955": email }) });
          setNames(name.charAt(0).toUpperCase() || "A", person.charAt(0).toUpperCase() || names.b);
          setWaitlisted(true);
        } catch { setStatus("error"); }
      }}>
        <div><label htmlFor="wl-name" className="eyebrow">Your name</label><input id="wl-name" name="name" required autoComplete="name" className={input} /></div>
        <div><label htmlFor="wl-email" className="eyebrow">Your email</label><input id="wl-email" name="email" type="email" required autoComplete="email" className={input} /></div>
        <div><label htmlFor="wl-person" className="eyebrow">Your person's name (optional)</label><input id="wl-person" name="person" className={input} /></div>
        <Button type="submit" disabled={status === "sending"} className={`${primaryBtn} w-full py-4`}>{status === "sending" ? "Sending…" : "Enter the next world →"}</Button>
        {status === "error" && <p role="alert" className="text-sm text-peach">That didn't go through. Check your connection and try again.</p>}
      </form>
    </Reveal>
  );
}

export function Overlay({ act }: { act: number }) {
  const { you, them, nickname, setNickname, memoryPhoto, partnerJoined } = useJourney();
  const [look, setLook] = useState<CardLook>("noir");
  const completed = you.filter((value, index) => value && them[index]).length;
  const score = 65 + completed * 8;
  const identity = useMemo(() => COUPLE_TAGS[(nickname.length + completed) % COUPLE_TAGS.length] ?? COUPLE_TAGS[0]!, [nickname, completed]);

  const share = async () => {
    const text = `${nickname} scored ${score} on Snickylink — ${identity.tag}`;
    try {
      if (navigator.share) await navigator.share({ title: "Snickylink", text, url: window.location.href });
      else { await navigator.clipboard.writeText(`${text} ${window.location.href}`); toast("Copied. Screenshot your card to post it as a Story."); }
    } catch { toast("Screenshot your card to share it as a Story."); }
  };

  return (
    <div className="relative z-10">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="font-display text-sm tracking-[0.3em] uppercase">Snickylink</span>
        <span className="eyebrow hidden md:inline">Act 0{act + 1} · {completed}/4 pulses · {completed * 20} XP</span>
      </header>

      <Chapter align="center" className="items-end pb-[18vh]"><LitText text="You're here." className="font-display text-4xl text-blush md:text-6xl" /><p className="mt-6 text-[0.6rem] tracking-[0.4em] uppercase text-blush/35">Scroll into the dark</p></Chapter>
      <Chapter align="left"><LitText as="h2" text="Someone else is out there too." className="font-display text-3xl leading-tight text-blush md:text-5xl" /></Chapter>
      <Chapter align="center">
        <LitText as="h2" text="But sparks don't find each other on their own." className="font-display text-3xl leading-tight text-blush md:text-5xl" />
        <button
          type="button"
          aria-label="Bring them closer — invite your person"
          onClick={() => { const el = document.getElementById("duo"); el?.scrollIntoView({ behavior: "smooth", block: "center" }); el?.querySelector<HTMLElement>("button, input")?.focus({ preventScroll: true }); }}
          className={`mt-10 border border-peach/40 px-7 py-4 text-xs tracking-[0.35em] uppercase text-peach/85 transition hover:border-peach hover:text-peach ${focus}`}
        >
          Bring them closer →
        </button>
      </Chapter>
      <Chapter align="center"><Reveal><Line>The world keeps moving. Its shared moments wake up when both of you arrive.</Line><DuoPanel /></Reveal></Chapter>

      <Chapter align="left"><LitText as="h2" text="This is as far as your spark reaches. For now." className="font-display text-3xl leading-tight text-blush md:text-5xl" /></Chapter>

      {SNICKS.map((snick, index) => (
        <div key={snick.id}>
          <Chapter align={index % 2 ? "right" : "left"}><Reveal><span className="eyebrow">Pulse 0{index + 1} · {snick.emoji} {snick.title}</span><SnickCard id={snick.id} /></Reveal></Chapter>
          <Chapter align={index % 2 ? "left" : "right"}><ExpansionNote id={snick.id} /></Chapter>
        </div>
      ))}

      {completed < 4 ? (
        <Chapter align="center"><Reveal><span className="eyebrow">The Glade is still forming</span><Title>{completed === 0 ? "YOUR WORLD IS WAITING." : `${completed} OF 4 PULSES SENT.`}</Title><Line>Complete every Snick together to raise your flex from the ignition.</Line><div className="mx-auto mt-8 flex max-w-xs gap-2">{[0, 1, 2, 3].map((index) => <span key={index} className={`h-1 flex-1 ${index < completed ? "bg-peach shadow-[0_0_12px_var(--color-peach)]" : "bg-blush/15"}`} />)}</div></Reveal></Chapter>
      ) : (
        <>
          <Chapter align="center"><span className="eyebrow">The Glade, seen from above</span><LitText as="h2" text="You made this. Together." className="mt-4 font-display text-4xl text-blush md:text-6xl" /><span className="sr-only" aria-live="polite">Your world is complete.</span></Chapter>
          <Chapter align="center">
            <Reveal>
              <span className="eyebrow">Name your duo</span>
              <label htmlFor="couple-nickname" className="sr-only">Your couple nickname</label>
              <input id="couple-nickname" value={nickname} maxLength={28} onChange={(event) => setNickname(event.target.value)} className={`mx-auto mt-4 block w-full max-w-sm border-b border-peach/35 bg-transparent px-2 py-3 text-center font-display text-2xl uppercase text-blush focus:border-peach ${focus}`} />
              <p className="mt-3 text-xs text-blush/45">This is the name shown on your Story card.</p>
              <div className="card-emerge mt-10"><StoryCard key={look} score={score} tag={identity.tag} line={identity.line} completed={completed} look={look} /></div>
              <div className="mt-6 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Story card look">{LOOKS.map((item) => <Button key={item.id} type="button" variant="outline" role="radio" aria-checked={look === item.id} onClick={() => setLook(item.id)} className={`h-auto rounded-sm px-3 py-2 text-[0.6rem] tracking-[0.16em] uppercase ${look === item.id ? "border-peach text-peach" : "border-border text-blush/55"}`}>{item.label}</Button>)}</div>
              <p className="mt-10 font-display text-2xl text-blush">You didn't just play. You built something.</p>
              <Button type="button" onClick={share} className={`${primaryBtn} mt-8`}>Flex your duo →</Button>
              <p className="mt-3 text-xs text-blush/45">Screenshot the 9:16 card for Instagram Stories.</p>
            </Reveal>
          </Chapter>
          <Chapter align="right"><Reveal><span className="eyebrow">The fog has names now</span><Title>THIS WAS ONLY THE FIRST WORLD.</Title><span className="sr-only" aria-live="polite">Three more worlds await, still hidden.</span><ul className="mt-8 space-y-6 text-left">{[["🔥", "Synchronous Orbit"], ["🗝️", "Vulnerability Dungeon"], ["✨", "Celestial Resonance"]].map(([emoji, name], index) => <li key={name} className="border-b border-border pb-4" style={{ opacity: 1 - index * 0.2 }}><p className="font-display text-2xl">{emoji} {name}</p><p className="mt-1 text-[0.6rem] tracking-[0.25em] uppercase text-peach">Locked beyond the Glade</p></li>)}</ul></Reveal></Chapter>
        </>
      )}

      <Chapter align="center" className="pb-40"><div id="waitlist" className="scroll-mt-24"><Waitlist /></div></Chapter>
      <IgnitionMoment active={act >= 1} />
      {memoryPhoto && <span className="sr-only">One shared memory added.</span>}
    </div>
  );
}
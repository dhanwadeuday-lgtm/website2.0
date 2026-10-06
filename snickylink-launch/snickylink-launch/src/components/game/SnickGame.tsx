import { useEffect, useRef, useState, type ReactNode } from "react";
import logo from "@/assets/snickylink-logo.png.asset.json";

const btn =
  "min-h-12 rounded-full bg-peach px-7 py-3 font-sans text-sm font-bold tracking-[0.18em] uppercase text-deep-wine shadow-[var(--shadow-bloom)] transition hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-peach disabled:opacity-40";
const ghost =
  "min-h-12 rounded-full border border-peach/40 px-7 py-3 text-sm font-bold tracking-[0.18em] uppercase text-peach transition hover:bg-peach/10 focus-visible:outline-2 focus-visible:outline-peach";
const h = "font-display text-4xl leading-[1.08] text-blush md:text-5xl";

function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setSeen(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** 0..1 progress of a tall section through the viewport. */
function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      setP(Math.min(1, Math.max(0, span > 0 ? -r.top / span : r.top < 0 ? 1 : 0)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return [ref, p] as const;
}

function Screen({ id, children, dark, className = "" }: { id: string; children: ReactNode; dark?: boolean; className?: string }) {
  const [ref, seen] = useInView<HTMLElement>(0.25);
  return (
    <section
      id={id}
      ref={ref}
      className={`relative flex min-h-[82svh] flex-col items-center justify-center px-6 py-16 text-center transition-all duration-1000 motion-reduce:transition-none md:min-h-[88svh] md:py-20 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${dark ? "bg-ink/60" : ""} ${className}`}
    >
      <div className="mx-auto w-full max-w-md">{children}</div>
    </section>
  );
}

function XP({ n, className = "" }: { n: number; className?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      setV(Math.round(n * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, n]);
  return <span ref={ref} className={`font-display text-peach ${className}`}>+{v} XP</span>;
}

function Particles({ count = 18, burst = false }: { count?: number; burst?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const d = burst ? 140 + (i % 4) * 30 : 0;
        return (
          <span
            key={i}
            className={`absolute left-1/2 top-1/2 size-1.5 rounded-full bg-peach ${burst ? "sl-burst" : "sl-float"}`}
            style={{
              ["--dx" as string]: `${Math.cos(a) * d}px`,
              ["--dy" as string]: `${Math.sin(a) * d}px`,
              left: burst ? "50%" : `${(i * 37) % 100}%`,
              top: burst ? "50%" : `${(i * 53) % 100}%`,
              animationDelay: `${burst ? 0 : (i % 7) * 0.6}s`,
              opacity: burst ? 1 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

const PILLARS = [
  { e: "💬", n: "Communication", t: "Say what you usually leave unsaid." },
  { e: "❤️", n: "Emotional Connection", t: "Make them feel seen." },
  { e: "🤝", n: "Effort", t: "Do something small without being asked." },
  { e: "🔐", n: "Trust", t: "Keep one promise today." },
];

/* 1 — HOOK */
function Hook({ onEnter }: { onEnter: () => void }) {
  const [going, setGoing] = useState(false);
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Particles count={26} />
      <svg className="pointer-events-none absolute inset-0 size-full opacity-30" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="50%" y1="50%" x2={`${20 + i * 15}%`} y2={i % 2 ? "15%" : "85%"} stroke="var(--peach)" strokeWidth="0.6" className="sl-dash" />
        ))}
      </svg>
      <div className={`sl-seed relative z-10 size-5 rounded-full bg-peach transition-transform duration-[1400ms] ease-in ${going ? "scale-[60] opacity-0" : ""}`} />
      <p className="sl-in mt-14 font-display text-3xl leading-snug text-blush md:text-4xl" style={{ animationDelay: "0.6s" }}>
        Some things are better
        <br />
        when you play them together.
      </p>
      <img src={logo.url} alt="SNICKYLINK" className="sl-in mt-10 w-28 mix-blend-screen" style={{ animationDelay: "1.8s" }} />
      <p className="sl-in mt-4 font-display text-xl tracking-[0.35em] text-peach" style={{ animationDelay: "2s" }}>SNICKYLINK</p>
      <button
        className={`sl-in mt-10 ${btn}`}
        style={{ animationDelay: "2.6s" }}
        onClick={() => {
          setGoing(true);
          setTimeout(onEnter, 900);
        }}
      >
        Enter the game →
      </button>
    </section>
  );
}

/* 2 — STORY */
function Story() {
  const [ref, p] = useSectionProgress<HTMLElement>();
  const k = Math.min(1, p / 0.7);
  const joined = k >= 1;
  return (
    <section id="story" ref={ref} className="relative h-[165svh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center px-6 text-center">
        <h2 className={h}>Every relationship has a story.</h2>
        <div className="relative mt-16 h-24 w-full max-w-sm">
          <svg className="absolute inset-0 size-full" aria-hidden="true">
            <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="var(--peach)" strokeWidth="2" style={{ opacity: joined ? 1 : 0, filter: "drop-shadow(0 0 6px var(--peach))", transition: "opacity .6s" }} />
          </svg>
          {[
            ["YOU", -1],
            ["YOUR PERSON", 1],
          ].map(([l, s]) => (
            <div key={l as string} className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center" style={{ left: `calc(50% + ${(s as number) * (1 - k) * 38}% - 8px)` }}>
              <span className="sl-seed size-4 rounded-full bg-peach" />
              <span className="mt-3 whitespace-nowrap text-[0.65rem] font-bold tracking-[0.25em] text-blush/70">{l}</span>
            </div>
          ))}
        </div>
        <div className={`mt-12 transition-opacity duration-700 ${joined ? "opacity-100" : "opacity-0"}`}>
          <p className="font-display text-2xl text-peach">Connection starts with one small moment.</p>
          <a href="#snick" className={`mt-8 inline-block ${ghost}`}>See what happens next →</a>
        </div>
        {!joined && <p className="mt-10 text-xs tracking-[0.3em] text-blush/50 uppercase">Scroll</p>}
      </div>
    </section>
  );
}

/* 3 — TODAY'S SNICK */
function FlipCard({ front, back, flipped, onFlip, label }: { front: ReactNode; back: ReactNode; flipped: boolean; onFlip: () => void; label: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <button
      aria-label={label}
      aria-pressed={flipped}
      onClick={onFlip}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -12, y: ((e.clientX - r.left) / r.width - 0.5) * 12 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="mx-auto block aspect-[5/7] w-64 [perspective:1200px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-peach md:w-72"
    >
      <div
        className="relative size-full transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (flipped ? 180 : 0)}deg)` }}
      >
        <div className="sl-card absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-6 [backface-visibility:hidden]">{front}</div>
        <div className="sl-card absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </div>
    </button>
  );
}

function TodaysSnick({ onDone }: { onDone: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <Screen id="snick">
      <p className="eyebrow">The game</p>
      <div className="mt-8">
        <FlipCard
          label="Today's Snick, tap to reveal"
          flipped={flipped}
          onFlip={() => setFlipped(true)}
          front={
            <>
              <span className="text-4xl">✨</span>
              <p className="mt-6 font-display text-2xl tracking-[0.12em] text-blush">TODAY'S SNICK</p>
              <p className="mt-4 text-xs tracking-[0.3em] text-peach/80 uppercase">Tap to reveal</p>
            </>
          }
          back={
            <>
              <p className="font-display text-2xl leading-snug text-blush">Tell your person one thing you've never thanked them for.</p>
              <p className="mt-6 font-display text-xl text-peach">+50 XP</p>
              <p className="mt-2 text-[0.65rem] tracking-[0.25em] text-blush/70 uppercase">💬 Communication</p>
            </>
          }
        />
      </div>
      <div className={`mt-10 transition-opacity ${flipped ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {done ? (
          <p className="font-display text-2xl text-peach">Snick done. ✓</p>
        ) : (
          <button className={btn} onClick={() => { setDone(true); onDone(); document.getElementById("board")?.scrollIntoView({ behavior: "smooth" }); }}>
            Do the Snick →
          </button>
        )}
      </div>
    </Screen>
  );
}

/* 4 — GAME LOOP */
function Board({ unlocked, onThird }: { unlocked: boolean; onThird: () => void }) {
  const [count, setCount] = useState(2);
  const cards = [
    { n: "Snick 01", p: PILLARS[0] },
    { n: "Snick 02", p: PILLARS[1] },
    { n: "Snick 03", p: PILLARS[2] },
  ];
  return (
    <Screen id="board">
      <p className="eyebrow">Today</p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {cards.map((c, i) => {
          const done = i < count;
          return (
            <button
              key={c.n}
              disabled={done}
              onClick={() => { setCount(3); setTimeout(onThird, 700); }}
              className={`sl-card flex aspect-[4/5] flex-col items-center justify-center rounded-2xl p-3 transition ${done ? "" : "sl-pulse hover:scale-[1.03]"}`}
            >
              <span className="text-3xl">{done ? "✓" : "○"}</span>
              <span className="mt-3 font-display text-lg text-blush">{c.n}</span>
              <span className="mt-2 text-xs text-blush/70">{c.p?.e} {c.p?.n}</span>
              {!done && <span className="mt-2 text-[0.6rem] tracking-[0.2em] text-peach uppercase">Tap to play</span>}
            </button>
          );
        })}
        <a
          href={unlocked ? "#mystery" : undefined}
          aria-disabled={!unlocked}
          className={`sl-card flex aspect-[4/5] flex-col items-center justify-center rounded-2xl p-3 transition-all duration-700 ${unlocked ? "sl-glow" : "blur-[2px] opacity-60"}`}
        >
          <span className="text-3xl">{unlocked ? "🔐" : "?"}</span>
          <span className="mt-3 font-display text-lg text-blush">Mystery</span>
          <span className="mt-2 text-xs text-peach">{unlocked ? "Unlocked →" : "Locked"}</span>
        </a>
      </div>
      <p className="mt-8 text-sm text-blush/70">Complete 3 Snicks to unlock the mystery.</p>
      <div className="mx-auto mt-4 h-2 w-56 overflow-hidden rounded-full bg-blush/10">
        <div className="h-full rounded-full bg-peach transition-all duration-700" style={{ width: `${(count / 3) * 100}%` }} />
      </div>
      <p className="mt-3 text-xs font-bold tracking-[0.3em] text-peach" aria-live="polite">{count} / 3 COMPLETE</p>
    </Screen>
  );
}

/* 5 — MYSTERY */
function Mystery({ unlocked }: { unlocked: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Screen id="mystery" dark className="overflow-hidden">
      {open && <Particles count={28} burst />}
      <div className={`sl-card sl-floaty relative mx-auto flex aspect-[5/7] w-64 flex-col items-center justify-center rounded-3xl p-6 transition-all duration-700 ${open ? "sl-glow scale-105" : ""}`}>
        {open ? (
          <div className="sl-in">
            <p className="text-[0.6rem] font-bold tracking-[0.3em] text-peach uppercase">Mystery unlocked</p>
            <p className="mt-6 font-display text-2xl leading-snug text-blush">Plan one tiny surprise for your person today.</p>
            <p className="mt-6 font-display text-2xl text-peach">+100 XP</p>
          </div>
        ) : (
          <>
            <p className="font-display text-2xl tracking-[0.1em] text-blush">MYSTERY SNICK</p>
            <p className="mt-4 text-sm text-blush/70">Something special is waiting…</p>
          </>
        )}
      </div>
      {!open && (
        <button className={`mt-10 ${btn}`} disabled={!unlocked} onClick={() => setOpen(true)}>
          {unlocked ? "Reveal" : "Finish Snick 03 first"}
        </button>
      )}
    </Screen>
  );
}

/* Flower */
const BLOOM = ["var(--bloom-white)", "var(--bloom-yellow)", "var(--bloom-pink)", "var(--bloom-wine)"];
function Flower({ g }: { g: number }) {
  const stem = Math.min(1, g / 0.5);
  const bloom = Math.max(0, (g - 0.55) / 0.45);
  const ci = Math.min(3, Math.floor(bloom * 3.99));
  const petal = bloom > 0 ? BLOOM[ci] : "var(--peach)";
  return (
    <svg viewBox="0 0 200 260" className="mx-auto h-72 w-56" aria-hidden="true">
      <ellipse cx="100" cy="246" rx="60" ry="8" fill="var(--peach)" opacity="0.12" />
      <circle cx="100" cy="240" r={6 - stem * 3} fill="var(--peach)" className="sl-seed" />
      <path d={`M100 240 Q ${100 - 14 * stem} ${240 - 70 * stem} 100 ${240 - 140 * stem}`} stroke="var(--copper)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {stem > 0.4 && (
        <>
          <path d="M100 200 q -30 -6 -38 -26 q 26 2 38 26" fill="var(--copper)" opacity={Math.min(1, (stem - 0.4) * 3)} />
          <path d="M100 175 q 30 -6 38 -26 q -26 2 -38 26" fill="var(--copper)" opacity={Math.min(1, (stem - 0.6) * 3)} />
        </>
      )}
      <g transform={`translate(100 ${240 - 140 * stem})`}>
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse
            key={i}
            rx={4 + 14 * bloom}
            ry={7 + 22 * bloom}
            cy={-(6 + 20 * bloom)}
            fill={petal}
            opacity={g > 0.45 ? 0.92 : 0}
            transform={`rotate(${i * 60})`}
            style={{ transition: "fill 1s" }}
          />
        ))}
        {g > 0.45 && <circle r={4 + 6 * bloom} fill="var(--peach)" />}
      </g>
    </svg>
  );
}

/* 6 — GROWTH */
function Growth() {
  const [ref, p] = useSectionProgress<HTMLElement>();
  const stage = ["Seed", "Sprout", "Stem", "Bud", "Flower"][Math.min(4, Math.floor(p * 5))];
  return (
    <section ref={ref} className="relative h-[190svh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow">{stage}</p>
        <Flower g={p} />
        <h2 className="mt-6 font-display text-3xl leading-snug text-blush md:text-4xl">
          Your connection grows
          <br />
          one little effort at a time.
        </h2>
        <div className={`mt-6 transition-opacity duration-700 ${p > 0.85 ? "opacity-100" : "opacity-0"}`}>
          <p className="font-display text-3xl text-peach">+250 XP</p>
          <p className="mt-2 text-sm text-blush/70">3 Snicks completed · Connection growing…</p>
        </div>
      </div>
    </section>
  );
}

/* 7 — PILLARS */
function Pillars() {
  const [sel, setSel] = useState<number | null>(null);
  const pos = [
    "left-1/2 top-0 -translate-x-1/2",
    "right-0 top-1/2 -translate-y-1/2",
    "left-1/2 bottom-0 -translate-x-1/2",
    "left-0 top-1/2 -translate-y-1/2",
  ];
  return (
    <Screen id="pillars">
      <p className="eyebrow">Relationship stats</p>
      <div className="relative mx-auto mt-8 size-80">
        <div className="absolute inset-0 flex items-center justify-center scale-50"><Flower g={1} /></div>
        {PILLARS.map((pl, i) => (
          <button
            key={pl.n}
            onMouseEnter={() => setSel(i)}
            onFocus={() => setSel(i)}
            onClick={() => setSel(i)}
            aria-pressed={sel === i}
            className={`sl-pulse absolute flex size-20 flex-col items-center justify-center rounded-full border border-peach/40 bg-ink/60 backdrop-blur ${pos[i]} ${sel === i ? "sl-glow" : ""}`}
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <span className="text-2xl">{pl.e}</span>
            <span className="mt-1 text-[0.55rem] font-bold leading-tight tracking-wide text-blush">{pl.n}</span>
          </button>
        ))}
      </div>
      <p className="mt-8 min-h-16 font-display text-2xl text-peach" aria-live="polite">
        {sel === null ? "Tap a stat." : `“${PILLARS[sel]?.t}”`}
      </p>
    </Screen>
  );
}

/* 8 — PAIR */
function Avatar({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 60 80" className="h-24 w-16" aria-hidden="true">
        <circle cx="30" cy="20" r="13" fill="var(--blush)" opacity="0.85" />
        <path d="M6 80 q 0 -40 24 -40 q 24 0 24 40z" fill="var(--blush)" opacity="0.85" />
      </svg>
      <span className="mt-2 text-[0.65rem] font-bold tracking-[0.25em] text-blush/70">{label}</span>
    </div>
  );
}
function Pair({ paired, onPair }: { paired: boolean; onPair: () => void }) {
  return (
    <Screen id="pair">
      <p className="text-sm text-blush/70">SNICKYLINK is played together.</p>
      <div className="relative mt-10 flex items-end justify-center">
        <div className="transition-transform duration-1000" style={{ transform: `translateX(${paired ? 0 : -50}px)` }}><Avatar label="YOU" /></div>
        <div className={`mx-2 mb-16 h-0.5 bg-peach transition-all duration-1000 ${paired ? "w-12 opacity-100 shadow-[0_0_12px_var(--peach)]" : "w-0 opacity-0"}`} />
        <div className="transition-transform duration-1000" style={{ transform: `translateX(${paired ? 0 : 50}px)` }}><Avatar label="YOUR PERSON" /></div>
        {paired && <span className="sl-in absolute -top-6 text-3xl">❤️</span>}
      </div>
      <div className="mt-12" aria-live="polite">
        {paired ? (
          <div className="sl-in">
            <p className="font-display text-3xl text-blush">PAIR COMPLETE ❤️</p>
            <p className="mt-3 text-blush/70">Now your Snicks become shared.</p>
          </div>
        ) : (
          <button className={btn} onClick={onPair}>Connect your person</button>
        )}
      </div>
    </Screen>
  );
}

/* 9 — ACTIVITY */
function Activity({ paired }: { paired: boolean }) {
  const [ping, setPing] = useState(false);
  const [ref, seen] = useInView<HTMLDivElement>(0.5);
  useEffect(() => {
    if (seen && paired) {
      const t = setTimeout(() => setPing(true), 900);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [seen, paired]);
  return (
    <Screen id="activity">
      <div ref={ref} className="sl-card rounded-3xl p-6 text-left">
        <p className="eyebrow">Your progress</p>
        <ul className="mt-4 space-y-3 font-display text-xl text-blush">
          <li>🔥 3 day streak</li>
          <li>⭐ 420 XP</li>
          <li>🌱 Connection Level 04</li>
        </ul>
        <p className="eyebrow mt-8">Partner activity</p>
        <div className={`mt-4 rounded-2xl border border-peach/30 bg-peach/10 p-4 transition-all duration-700 ${ping ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} aria-live="polite">
          <p className="text-blush">Your person completed a Snick!</p>
          <p className="mt-1 font-display text-lg text-peach">+50 XP</p>
        </div>
        {!paired && <p className="mt-4 text-sm text-blush/60">Connect your person to see their moves.</p>}
      </div>
    </Screen>
  );
}

/* 10 — MAP */
function GameMap() {
  const nodes = ["START", "FIRST SPARK", "PLAYFUL", "CONNECTED", "DEEP CONNECTION", "????"];
  const reached = 2;
  return (
    <Screen id="map">
      <p className="eyebrow">🔥 3 · ⭐ 420 XP</p>
      <ol className="relative mx-auto mt-8 flex w-64 flex-col-reverse gap-6">
        {nodes.map((n, i) => (
          <li key={n} className="flex items-center gap-4" style={{ transform: `translateX(${i % 2 ? 40 : -40}px)` }}>
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-full border text-sm ${i <= reached ? "border-peach bg-peach text-deep-wine" : "border-blush/20 text-blush/40"} ${i === reached ? "sl-glow" : ""}`}>
              {i < reached ? "✓" : i === reached ? "✦" : "🔒"}
            </span>
            <span className={`text-xs font-bold tracking-[0.2em] ${i <= reached ? "text-blush" : "text-blush/40"}`}>{n}</span>
          </li>
        ))}
      </ol>
      <p className="mt-10 font-display text-xl text-peach">Complete Snicks together to move forward.</p>
    </Screen>
  );
}

/* 11 — COUNTDOWN */
function Countdown() {
  const [s, setS] = useState(1 * 3600 + 42 * 60 + 18);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const f = (n: number) => String(n).padStart(2, "0");
  return (
    <Screen id="moment">
      <p className="font-display text-2xl text-blush">Your Snick is waiting.</p>
      <div className="sl-card sl-pulse mx-auto mt-8 rounded-3xl px-8 py-10">
        <p className="font-display text-6xl tabular-nums text-peach" aria-label="Time left">
          {f(Math.floor(s / 3600))}:{f(Math.floor((s % 3600) / 60))}:{f(s % 60)}
        </p>
        <p className="mt-4 text-sm text-blush/70">Every Snick gets its moment.</p>
      </div>
      <button className={`mt-10 ${btn}`} onClick={() => { setStarted(true); document.getElementById("payoff")?.scrollIntoView({ behavior: "smooth" }); }}>
        {started ? "Started ✓" : "Start Snick"}
      </button>
    </Screen>
  );
}

/* 12 — PAYOFF */
function Payoff() {
  return (
    <Screen id="payoff">
      <div className="sl-story relative mx-auto flex aspect-[9/16] w-64 flex-col items-center justify-between overflow-hidden rounded-3xl p-7 md:w-72">
        <img src={logo.url} alt="" className="w-12 mix-blend-screen" />
        <p className="text-xs font-bold tracking-[0.4em] text-blush">SNICKYLINK</p>
        <p className="font-display text-4xl leading-[1.05] text-blush">TODAY WE<br />PLAYED.</p>
        <XP n={250} className="text-3xl" />
        <p className="text-xs font-bold tracking-[0.3em] text-blush/80">CONNECTION<br />LEVEL 04</p>
        <p className="font-display text-lg italic text-peach">“MORE THAN A CHAT.”</p>
        <p className="tracking-[0.5em] text-peach">✦ ✦ ✦</p>
      </div>
      <div className="mt-10 flex flex-col items-center gap-3">
        <a href="#final" className={btn}>Make your own story →</a>
        <a href="#final" className={ghost}>Start playing SNICKYLINK</a>
      </div>
    </Screen>
  );
}

/* 13 — FINAL */
function Final() {
  return (
    <Screen id="final" className="overflow-hidden">
      <Particles count={14} />
      <div className="flex items-end justify-center gap-2">
        <Avatar label="YOU" />
        <Flower g={1} />
        <Avatar label="YOUR PERSON" />
      </div>
      <h2 className={`mt-6 ${h}`}>Your relationship already has a story.</h2>
      <p className="mt-4 font-display text-3xl text-peach">Give it a game.</p>
      <p className="mt-10 font-display text-xl tracking-[0.35em] text-blush">SNICKYLINK</p>
      <p className="mt-2 text-sm text-blush/70">Connect. Play. Grow Together.</p>
      <div className="mt-10 flex flex-col items-center gap-3">
        <a href="#snick" className={btn}>Start your story →</a>
        <a href="#story" className={ghost}>See how it works</a>
      </div>
    </Screen>
  );
}

export function SnickGame() {
  const [entered, setEntered] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [paired, setPaired] = useState(false);
  useEffect(() => {
    if (entered) document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  }, [entered]);
  return (
    <main className="sl-bg relative min-h-svh overflow-x-hidden font-sans text-blush">
      <div className="sl-grain pointer-events-none fixed inset-0 z-50" aria-hidden="true" />
      <Hook onEnter={() => setEntered(true)} />
      {entered && (
        <>
          <Story />
          <TodaysSnick onDone={() => {}} />
          <Board unlocked={unlocked} onThird={() => setUnlocked(true)} />
          <Mystery unlocked={unlocked} />
          <Growth />
          <Pillars />
          <Pair paired={paired} onPair={() => setPaired(true)} />
          <Activity paired={paired} />
          <GameMap />
          <Countdown />
          <Payoff />
          <Final />
        </>
      )}
    </main>
  );
}

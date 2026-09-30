import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useJourney } from "@/lib/journey";

function useCountUp(target: number, run: boolean, delay: number, still: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (still) { setV(target); return; }
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const x = Math.min(1, Math.max(0, (now - t0) / 1200));
      setV(Math.round(target * (1 - Math.pow(1 - x, 3))));
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, delay, still]);
  return v;
}

export type CardLook = "wine" | "peach" | "noir";

export const LOOKS: { id: CardLook; label: string; bg: string }[] = [
  { id: "wine", label: "Muted Wine", bg: "linear-gradient(180deg, oklch(0.63 0.08 43) 0%, oklch(0.38 0.11 7) 42%, oklch(0.16 0.04 8) 100%)" },
  { id: "peach", label: "Peach Warm", bg: "linear-gradient(180deg, oklch(0.86 0.07 57) 0%, oklch(0.61 0.1 32) 48%, oklch(0.31 0.08 8) 100%)" },
  { id: "noir", label: "Wine Noir", bg: "linear-gradient(180deg, oklch(0.57 0.07 31) 0%, oklch(0.32 0.1 7) 40%, oklch(0.11 0.025 8) 100%)" },
];

export function StoryCard({ score, tag, line, look = "noir" }: { score: number; tag: string; line: string; completed: number; look?: CardLook }) {
  const nickname = useJourney((state) => state.nickname);
  const background = LOOKS.find((item) => item.id === look)?.bg ?? LOOKS[2]?.bg;
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setRun(true); }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const shownScore = useCountUp(score, run, 700, still);
  const xp = useCountUp(80, run, 2600, still);
  const stage = (ms: number, bounce = false): CSSProperties => ({
    opacity: run ? 1 : 0,
    transform: run || still ? "none" : bounce ? "scale(0.7) translateY(8px)" : "translateY(8px)",
    transition: still ? "opacity 400ms" : `opacity 700ms ease ${ms}ms, transform ${bounce ? "650ms cubic-bezier(0.34,1.8,0.5,1)" : "700ms ease"} ${ms}ms`,
  });
  const month = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date()).toUpperCase();

  return (
    <div ref={ref} id="story-card" role="img" aria-label={`${nickname}. Connection score ${score} out of 100. ${tag}. 4 Snicks complete, 80 shared XP. @SNICKYLINK.`} className="flex-card story-speckle relative mx-auto aspect-[9/16] w-full max-w-[350px] overflow-hidden border border-peach/25 px-7 py-8 text-center shadow-[var(--shadow-bloom)]" style={{ background }}>
      <div className="relative flex h-full flex-col items-center">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-peach/80">Snickylink.</p>
        <p style={stage(0)} className="mt-10 max-w-full break-words font-display text-4xl leading-none text-blush">{nickname}</p>

        <p style={stage(500)} className="mt-12 font-display text-[7rem] leading-[0.78] text-peach tabular-nums">{shownScore}</p>
        <p style={stage(500)} className="mt-5 text-xs font-semibold uppercase text-blush/55">How in-sync you two are</p>

        <div className="mt-12" style={stage(2000, true)}>
          <h4 className="font-display text-3xl leading-tight text-blush">{tag}</h4>
          <p className="mt-4 font-display text-lg italic text-peach/80">“{line}”</p>
        </div>

        <div className="mt-auto">
          <p style={stage(2600)} className="mb-4 text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-blush/70">4 Snicks complete · {xp} shared XP</p>
          <p className="text-xl tracking-[0.38em]" aria-label="Notice, play, connect, create">👀 → 🎈 → 💭 → 📸</p>
          <p className="mt-4 text-xs font-semibold uppercase text-blush/55">4 Snicks · 4 moments · 1 connection</p>
          <div style={stage(3400)}><p className="mt-14 text-xs font-semibold uppercase text-peach/75">@snickylink · Connect · Play · Grow</p>
          <p className="mt-5 text-[0.65rem] uppercase text-blush/45">{month}</p>
          <div className="mx-auto mt-5 grid size-9 place-items-center rounded-full border border-peach/40 text-sm text-peach">✦</div></div>
        </div>
      </div>
    </div>
  );
}
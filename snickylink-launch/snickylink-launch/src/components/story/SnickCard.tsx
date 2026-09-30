import { useEffect, useState } from "react";
import { Check, Lock } from "lucide-react";

import { SNICKS, isAvailable, useJourney, type Side, type SnickId } from "@/lib/journey";
import { cn } from "@/lib/utils";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach";

const LOCKED_LINE = ["YOUR PERSON IS MISSING", "REQUIRES TWO PLAYERS", "WAITING FOR YOUR PERSON", "GRAND MILESTONE"];
const CIPHER = ["▚▞ ▖▘▝ ▗▚ ?? ▞▚▖ ▘▝▗▚", "▞▚▖ ▘▝ ▗▚▞ ?? ▚▞▘", "▘▝▗ ▚▞ ▖?? ▞▚", "▚▞▖ ▘▝▗ ▚?? ▞▚▖ ▘▝"];

function SideButtons({ id }: { id: SnickId }) {
  const { you, them, mark } = useJourney();
  return (
    <div className="mt-6 grid grid-cols-2 gap-3" role="group" aria-label={`Mark Snick ${id + 1} done`}>
      {(["you", "them"] as const).map((side) => {
        const active = side === "you" ? you[id] : them[id];
        return (
          <button
            key={side}
            type="button"
            aria-pressed={active}
            onClick={() => mark(id, side)}
            className={cn(
              "rounded-sm border px-3 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300",
              focus,
              active
                ? "border-peach/50 bg-peach text-ink"
                : "border-border text-foreground hover:border-peach/60 hover:bg-peach/10",
            )}
          >
            {active ? "● " : "○ "}
            {side === "you" ? "We did it — me" : "We did it — them"}
          </button>
        );
      })}
    </div>
  );
}

function TwoWayLock() {
  const { answers, sealed, lockAnswer } = useJourney();
  const [draft, setDraft] = useState({ you: "", them: "" });
  const both = sealed.you && sealed.them;

  if (both) {
    return (
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {(["you", "them"] as const).map((side, i) => (
          <div
            key={side}
            className="soft-rise rounded-sm border border-peach/40 bg-peach/10 p-4"
            style={{ animationDelay: `${i * 0}ms` }}
          >
            <p className="text-[0.6rem] tracking-[0.26em] uppercase text-peach">
              {side === "you" ? "● You" : "● Your person"}
            </p>
            <p className="mt-2 text-sm text-blush">{answers[side]}</p>
          </div>
        ))}
        <p className="text-xs tracking-[0.24em] uppercase text-peach md:col-span-2">Dual unmasking ✦</p>
      </div>
    );
  }

  const panel = (side: Side) => {
    const other: Side = side === "you" ? "them" : "you";
    const id = `lock-${side}`;
    return (
      <div key={side} className="rounded-sm border border-border p-4">
        <label htmlFor={id} className="text-[0.6rem] tracking-[0.26em] uppercase text-blush/60">
          {side === "you" ? "● You write" : "○ Your person writes"}
        </label>
        {sealed[side] ? (
          <p className="mt-3 text-sm text-peach">🔮 Sealed orb placed in the vault. No peeking.</p>
        ) : (
          <>
            {sealed[other] && (
              <p className="mt-2 text-xs text-peach">
                YOUR PERSON HAS LOCKED IN. SUBMIT YOUR ANSWER TO REVEAL BOTH.
              </p>
            )}
            <textarea
              id={id}
              rows={3}
              value={draft[side]}
              onChange={(e) => setDraft((d) => ({ ...d, [side]: e.target.value }))}
              className={`mt-2 w-full resize-none rounded-sm border border-input bg-transparent p-3 text-sm ${focus}`}
              placeholder="Something real…"
            />
            <button
              type="button"
              disabled={!draft[side].trim()}
              onClick={() => lockAnswer(side, draft[side])}
              className={`mt-2 w-full rounded-sm bg-wine px-3 py-2.5 text-xs tracking-[0.22em] uppercase text-blush hover:bg-copper disabled:opacity-40 ${focus}`}
            >
              Lock in 🔒
            </button>
          </>
        )}
      </div>
    );
  };

  return <div className="mt-6 grid gap-3 md:grid-cols-2">{panel("you")}{panel("them")}</div>;
}

let noticeKept = { you: "", them: "" };

function PrivateNotes() {
  const { you, them, mark } = useJourney();
  const [draft, setDraft] = useState({ you: "", them: "" });
  const [kept, setKeptState] = useState(noticeKept);
  const setKept = (f: (k: typeof noticeKept) => typeof noticeKept) => setKeptState((k) => (noticeKept = f(k)));
  const both = you[0] && them[0];
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-2">
      {(["you", "them"] as const).map((side) => {
        const sent = side === "you" ? you[0] : them[0];
        const id = `notice-${side}`;
        return (
          <div key={side} className="rounded-[1.4rem_0.3rem] border border-peach/30 bg-peach/[0.06] p-4 shadow-[0_0_24px_-10px_var(--color-peach)]">
            <label htmlFor={id} className="text-[0.6rem] tracking-[0.26em] uppercase text-blush/60">{side === "you" ? "● Your leaf" : "○ Their leaf"}</label>
            {both ? <p className="soft-rise mt-2 text-sm text-blush">{kept[side] || "(said out loud)"}</p> : sent ? (
              <p className="mt-2 text-sm text-peach">✦ Written. Hidden until you both finish.</p>
            ) : (
              <>
                <textarea id={id} rows={2} value={draft[side]} onChange={(e) => setDraft((d) => ({ ...d, [side]: e.target.value }))} placeholder="One tiny thing…" className={`mt-2 w-full resize-none border-b border-peach/30 bg-transparent p-1 text-sm ${focus}`} />
                <button type="button" disabled={!draft[side].trim()} onClick={() => { setKept((k) => ({ ...k, [side]: draft[side].trim() })); mark(0, side); }} className={`mt-2 w-full rounded-sm bg-wine px-3 py-2 text-xs tracking-[0.22em] uppercase text-blush hover:bg-copper disabled:opacity-40 ${focus}`}>Tell them ✦</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LaughTimer() {
  const { you, them, mark } = useJourney();
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (left === null || left <= 0) return;
    const t = setTimeout(() => setLeft((v) => (v ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  if (left === null) {
    return <button type="button" onClick={() => setLeft(60)} className={`mt-6 w-full rounded-sm bg-wine px-4 py-3.5 text-xs tracking-[0.26em] uppercase text-blush hover:bg-copper ${focus}`}>We're both ready — start 60s</button>;
  }
  if (left > 0) {
    return (
      <div className="mt-6 text-center" role="timer" aria-live="off">
        <p className="font-display text-6xl text-peach tabular-nums">{left}</p>
        <div className="mt-3 h-1 bg-blush/10"><div className="h-full bg-peach transition-all duration-1000 ease-linear" style={{ width: `${(left / 60) * 100}%` }} /></div>
        <button type="button" onClick={() => setLeft(0)} className={`mt-4 text-[0.6rem] tracking-[0.3em] uppercase text-blush/50 hover:text-peach ${focus}`}>We're done laughing →</button>
      </div>
    );
  }
  return (
    <div className="mt-6">
      <p className="text-xs tracking-[0.24em] uppercase text-blush/60">Did it work? 😂 You tried it together.</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {(["you", "them"] as const).map((side) => {
          const sent = side === "you" ? you[1] : them[1];
          return (
            <div key={side} className="grid gap-2" role="group" aria-label={side === "you" ? "Your answer" : "Your person's answer"}>
              <span className="text-[0.6rem] tracking-[0.26em] uppercase text-blush/50">{side === "you" ? "● You" : "○ Them"}</span>
              {sent ? <span className="text-xs text-peach">✓ Answered</span> : (["Yes 😂", "Not quite"] as const).map((label) => (
                <button key={label} type="button" onClick={() => mark(1, side)} className={`rounded-sm border border-border px-2 py-2 text-xs uppercase tracking-[0.18em] hover:border-peach/60 hover:bg-peach/10 ${focus}`}>{label}</button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MemoryDrop() {
  const { memoryPhoto, setMemoryPhoto } = useJourney();
  return (
    <div className="mt-6">
      <label
        htmlFor="memory-photo"
        className={`flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-dashed border-peach/40 text-xs tracking-[0.2em] uppercase text-blush/60 focus-within:outline focus-within:outline-2 focus-within:outline-peach`}
      >
        {memoryPhoto ? (
          <img src={memoryPhoto} alt="Your shared memory" className="h-full w-full object-cover" />
        ) : (
          "📸 Add your tiny memory (stays on this device)"
        )}
        <input
          id="memory-photo"
          capture="environment"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setMemoryPhoto(URL.createObjectURL(f));
          }}
        />
      </label>
      <label htmlFor="memory-note" className="sr-only">Describe the moment</label>
      <input id="memory-note" placeholder="Describe the moment (optional)" className={`mt-3 w-full border-b border-peach/30 bg-transparent p-2 text-sm ${focus}`} />
    </div>
  );
}

export function SnickCard({ id }: { id: SnickId }) {
  const snick = SNICKS[id]!;
  const state = useJourney();
  const { partnerJoined, you, them } = state;
  const done = you[id] && them[id];
  const available = isAvailable(state, id);
  const [entered, setEntered] = useState(false);
  const open = available && (entered || done);

  const status = !partnerJoined ? LOCKED_LINE[id]! : !available ? "NOT YET. KEEP SHOWING UP." : null;

  return (
    <div
      className={cn(
        "glass-panel relative w-full max-w-md rounded-sm p-7 transition-all duration-700",
        done && "shadow-[var(--shadow-bloom)] border-peach/40",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">
          0{id + 1} · {snick.title}
        </span>
        <span className="eyebrow flex items-center gap-1.5">
          {done ? (
            <>
              <Check className="size-3" /> Activated
            </>
          ) : available ? (
            "Open"
          ) : (
            <>
              <Lock className="size-3" /> Locked
            </>
          )}
        </span>
      </div>

      {status ? (
        <div className="mt-6">
          <p className="text-4xl">🔒</p>
          <p className="mt-3 font-display text-2xl">LOCKED</p>
          <p className="mt-1 text-xs tracking-[0.26em] uppercase text-peach">{status}</p>
          <p aria-hidden className="mt-5 select-none text-sm tracking-[0.3em] text-blush/30 blur-[1.5px]">
            SNICK 0{id + 1} · {CIPHER[id]}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-5 text-[0.65rem] tracking-[0.3em] uppercase text-blush/50">
            Snick 0{id + 1} · {snick.emoji} {snick.title}
          </p>
          <p className="mt-3 font-display text-2xl leading-snug">{snick.prompt}</p>
          {!open && (
            <button
              type="button"
              onClick={() => setEntered(true)}
              className={`mt-6 w-full rounded-sm bg-wine px-4 py-3.5 text-xs tracking-[0.26em] uppercase text-blush hover:bg-copper ${focus}`}
            >
              Enter Snick →
            </button>
          )}
          {open && !done && (
            <>
              {id === 0 ? <PrivateNotes /> : id === 1 ? <LaughTimer /> : id === 2 ? <TwoWayLock /> : <><MemoryDrop /><SideButtons id={id} /></>}
              {id === 3 && (you[id] || them[id]) && (
                <p className="mt-4 text-xs text-blush/60">Waiting for the other half…</p>
              )}
            </>
          )}
          {done && id === 0 && <PrivateNotes />}
          {done && id === 2 && <TwoWayLock />}
          {done && id === 3 && state.memoryPhoto && <MemoryDrop />}
          {done && (
            <p className="soft-rise mt-5 text-xs tracking-[0.22em] uppercase text-peach">
              +20 shared XP · Pulse 0{id + 1} complete
            </p>
          )}
        </>
      )}
    </div>
  );
}

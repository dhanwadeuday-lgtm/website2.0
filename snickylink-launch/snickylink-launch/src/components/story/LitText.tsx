import { useEffect, useRef, useState } from "react";

/** Characters "light up" one by one as they enter view; reverse on exit. */
export function LitText({ text, className, as: Tag = "p", fast = false }: { text: string; className?: string; as?: "p" | "h2"; fast?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(!!e?.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chars = [...text];
  const step = fast ? 30 : 45;
  let idx = 0;
  const words = text.split(/(\s+)/);
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((w, wi) => /^\s+$/.test(w) ? " " : (
        <span key={wi} className="inline-block whitespace-nowrap">
        {[...w].map((c) => { const i = idx++; return (
        <span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          style={{
            opacity: on ? 1 : 0,
            filter: still ? undefined : on ? "blur(0)" : "blur(8px)",
            textShadow: on ? "0 0 18px color-mix(in oklab, var(--color-peach) 45%, transparent)" : "none",
            transition: still ? "opacity 600ms ease" : "opacity 520ms ease, filter 620ms ease, text-shadow 900ms ease",
            transitionDelay: still ? "0ms" : `${(on ? i : chars.length - i) * step}ms`,
          }}
        >
          {c}
        </span>
        ); })}
        </span>
      ))}
    </Tag>
  );
}

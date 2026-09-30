import { createFileRoute } from "@tanstack/react-router";
import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";

import { actAt, scrollState, useJourney } from "@/lib/journey";
import { Overlay } from "@/components/story/Overlay";
import { Toaster } from "@/components/ui/sonner";
import { SEO, absoluteUrl } from "@/lib/seo";

const WorldCanvas = lazy(() => import("@/components/scene/WorldCanvas"));

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: SEO.title },
      { name: "description", content: SEO.description },
      { property: "og:title", content: SEO.ogTitle },
      { property: "og:description", content: SEO.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});

function useScrollDriver(still: boolean) {
  const [act, setAct] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.target = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    const loop = () => {
      scrollState.p = still
        ? scrollState.target
        : scrollState.p + (scrollState.target - scrollState.p) * 0.08;
      const c = actAt(scrollState.target);
      if (c !== last) {
        last = c;
        setAct(c);
      }
      raf = requestAnimationFrame(loop);
    };
    onScroll();
    scrollState.p = scrollState.target;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [still]);
  return act;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class GLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { err: boolean }> {
  override state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  override render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
}

const StaticBackdrop = () => (
  <div
    className="absolute inset-0"
    style={{
      background:
        "radial-gradient(ellipse at 50% 70%, oklch(0.38 0.1 8.5) 0%, oklch(0.23 0.07 9) 45%, oklch(0.15 0.03 5) 100%)",
    }}
  />
);

function Experience() {
  const [env, setEnv] = useState<{ still: boolean; mobile: boolean; gl: boolean } | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile =
      window.matchMedia("(max-width: 768px)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;
    setEnv({ still: mq.matches, mobile, gl: hasWebGL() });
    useJourney.getState().initCode();
    const on = () => setEnv((e) => (e ? { ...e, still: mq.matches } : e));
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const act = useScrollDriver(env?.still ?? false);

  return (
    <main className="relative bg-background">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <StaticBackdrop />
        {env?.gl && (
          <GLBoundary fallback={null}>
            <Suspense fallback={null}>
              <WorldCanvas still={env.still} mobile={env.mobile} />
            </Suspense>
          </GLBoundary>
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-payoff)" }}
        />
      </div>
      <div className="sr-only" aria-live="polite">
        Act {act + 1} of 6.
      </div>
      <Overlay act={act} />
      <Toaster />
    </main>
  );
}

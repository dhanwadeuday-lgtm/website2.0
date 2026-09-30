import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShown(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-[6px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Chapter({
  align = "left",
  children,
  className,
}: {
  align?: "left" | "right" | "center";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex min-h-screen items-center px-6 py-24 md:px-[8vw]",
        align === "left" && "justify-start",
        align === "right" && "justify-end",
        align === "center" && "justify-center",
        className,
      )}
    >
      <div className={cn("w-full max-w-md", align === "center" && "max-w-2xl text-center")}>
        {children}
      </div>
    </section>
  );
}

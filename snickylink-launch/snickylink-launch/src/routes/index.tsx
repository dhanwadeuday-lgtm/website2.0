import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Heart, Lock, UserX, ShieldCheck, Sparkles, ArrowRight, Plus, Play, Gamepad2, Sprout, Map, Star, Trophy, Image as ImageIcon, Globe2, Award } from "lucide-react";
import hero from "@/assets/hero.jpg";
import portal from "@/assets/portal.jpg";
import world from "@/assets/world.jpg";
import journey from "@/assets/journey.jpg";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnickyLink — More than a chat. A secret world for two." },
      { name: "description", content: "SnickyLink is a privacy-first, gamified space for couples. Play Snicks, earn XP and grow together." },
      { property: "og:title", content: "SnickyLink — A secret world for two" },
      { property: "og:description", content: "Play • Connect • Grow Together. Join the waitlist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const eyebrow = "text-xs font-semibold uppercase tracking-[0.25em] text-peach";
const h2 = "font-display text-4xl md:text-6xl leading-[1.05]";
const btn = "hover:-translate-y-0.5 hover:shadow-[0_15px_50px_-10px_var(--primary)] active:scale-95 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_var(--primary)] transition hover:brightness-110";

function Waitlist({ compact }: { compact?: boolean }) {
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setDone(true); };
  if (done) return <p className="font-hand text-2xl text-peach">You're on the list. See you in our world ♡</p>;
  return (
    <form onSubmit={submit} className={`flex w-full ${compact ? "max-w-md" : "max-w-lg"} overflow-hidden rounded-lg border border-border`}>
      <input required type="email" placeholder="your@email.com" className="min-w-0 flex-1 bg-foreground px-4 py-3 text-sm text-background outline-none" />
      <button className="flex items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground">Join Waitlist <ArrowRight className="h-4 w-4" /></button>
    </form>
  );
}

function Index() {
  const [y, setY] = useState(0);
  const [m, setM] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const mv = (e: MouseEvent) => setM({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    window.addEventListener("mousemove", mv);
    return () => { io.disconnect(); window.removeEventListener("mousemove", mv); };
  }, []);
  useEffect(() => { const f = () => setY(window.scrollY); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);

  return (
    <main className="overflow-x-hidden bg-background">
      <Particles />
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2 font-bold tracking-wide"><img src={logo} alt="SnickyLink logo" width={36} height={36} className="h-9 w-9 rounded-full" />SNICKYLINK</a>
          <div className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <a href="#about" className="hover:text-foreground">About</a><a href="#how" className="hover:text-foreground">How it works</a><a href="#world" className="hover:text-foreground">The world</a><a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
          <a href="#join" className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">Join Waitlist</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="relative flex min-h-screen items-center">
        <img src={hero} alt="Two people on a cliff watching glowing floating islands" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover animate-drift" style={{ transform: `translate(${m.x * -20}px, ${y * 0.3 + m.y * -20}px) scale(${1.05 + y * 0.0003})`, transition: "transform .3s ease-out" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-24" style={{ opacity: Math.max(0, 1 - y / 600) }}>
          <p className={`${eyebrow} animate-rise`}>Two people. One world.</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.95] md:text-8xl">
            <span className="block animate-rise [animation-delay:.2s]">MORE THAN</span>
            <span className="block text-shimmer animate-rise [animation-delay:.4s]">A CHAT.</span>
          </h1>
          <p className="mt-6 text-xl animate-rise [animation-delay:.6s]">A secret little world for two.</p>
          <p className="mt-3 max-w-md text-muted-foreground animate-rise [animation-delay:.7s]">Turn everyday moments into meaningful adventures. Play together, grow closer, and make your relationship a story worth remembering.</p>
          <div className="mt-8 animate-rise [animation-delay:.85s]"><Waitlist /></div>
          <p className="mt-3 text-xs text-muted-foreground">Be the first to explore. No spam, just launch updates.</p>
          <a href="#about" className="mt-6 inline-flex items-center gap-2 text-sm text-peach"><Play className="h-4 w-4" /> Explore our world</a>
        </div>
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse text-[10px] tracking-[0.3em] text-muted-foreground">SCROLL TO BEGIN YOUR JOURNEY</p>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-28 md:grid-cols-2">
        <div className="reveal">
          <p className={eyebrow}>The problem</p>
          <h2 className={`${h2} mt-4`}>You talk every day.<br />But when did you last <em className="text-peach">truly</em> connect?</h2>
          <p className="mt-6 max-w-md text-muted-foreground">Between hectic days and endless chats, the little moments often get lost.</p>
        </div>
        <div className="relative flex items-center justify-between gap-6 reveal [transition-delay:.2s]">
          <div className="glass w-full max-w-xs animate-floaty space-y-3 rounded-2xl p-5 -rotate-3">
            {["Heyy ❤️", "How was your day?", "Good", "Okayy", "Gn ❤️"].map((m, i) => (
              <div key={i} className={`w-fit rounded-xl px-3 py-1.5 text-sm ${i % 2 ? "ml-auto bg-secondary text-secondary-foreground" : "bg-muted"}`}>{m}</div>
            ))}
          </div>
          <p className="shrink-0 font-hand text-3xl leading-tight text-peach/80 rotate-6">Same chats<br />Same routine<br />Same distance?</p>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="about" className="relative overflow-hidden py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-[1fr_1.3fr_auto]">
          <div>
            <p className={eyebrow}>The solution</p>
            <h2 className={`${h2} mt-4`}>Welcome to<br /><span className="text-primary text-glow">SNICKYLINK</span></h2>
            <p className="mt-6 text-muted-foreground">A playful, meaningful space for couples to connect, grow and create memories together — one Snick at a time.</p>
            <a href="#join" className={`${btn} mt-8`}>Join Waitlist <ArrowRight className="h-4 w-4" /></a>
          </div>
          <img src={portal} alt="Couple walking toward a glowing portal" style={{ transform: `translate(${m.x * 15}px, ${m.y * 15}px)` }} loading="lazy" width={1280} height={960} className="reveal rounded-3xl transition-transform duration-300 shadow-[0_0_80px_-20px_var(--primary)]" />
          <ul className="reveal [transition-delay:.3s] glass space-y-2 rounded-2xl p-4 text-sm">
            {[[Gamepad2, "Play together"], [Sprout, "Grow together"], [Map, "Unlock new worlds"], [Lock, "Just between you two"]].map(([I, t]: any) => (
              <li key={t} className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:translate-x-2 hover:bg-muted"><I className="h-4 w-4 text-peach" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="py-28">
        <div className="reveal mx-auto max-w-7xl px-6">
          <p className={eyebrow}>How it works</p>
          <h2 className={`${h2} mt-4`}>A simple journey.<br />A deeper you.</h2>
          <p className="mt-4 text-muted-foreground">Four checkpoints. Four Snicks. A stronger bond.</p>
        </div>
        <img src={journey} alt="Four floating islands linked by a glowing path" loading="lazy" width={1920} height={720} className="mt-10 w-full [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
        <div className="mx-auto -mt-8 relative grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[["Snick", "Fun, engaging couple activities"], ["Reflect", "Meaningful conversations"], ["Grow", "Build new habits together"], ["Unlock", "New worlds, milestones and more"]].map(([t, d], i) => (
            <div key={t} className="reveal text-center" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-peach bg-background font-display text-xl text-peach animate-glowpulse">0{i + 1}</div>
              <h3 className="mt-3 text-sm font-bold uppercase tracking-widest">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-28 md:grid-cols-2">
        <div className="reveal">
          <p className={eyebrow}>Explore a Snick (demo)</p>
          <h2 className={`${h2} mt-4`}>Small moments.<br />Big connections.</h2>
          <p className="mt-6 text-muted-foreground">Fun challenges, thoughtful prompts and cute experiences designed just for the two of you.</p>
        </div>
        <div className="reveal animate-floaty"><SnickCard /></div>
      </section>

      {/* WORLD */}
      <section id="world" className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-28 md:grid-cols-2">
        <div className="reveal">
          <p className={eyebrow}>Your couple universe</p>
          <h2 className={`${h2} mt-4`}>Every little moment moves your story forward.</h2>
          <p className="mt-6 text-muted-foreground">Explore a beautiful world, collect memories, unlock new places and see your journey together grow.</p>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[[Trophy, "XP & Levels"], [ImageIcon, "Memories"], [Globe2, "New Worlds"], [Award, "Milestones"]].map(([I, t]: any) => (
              <div key={t} className="group"><I className="h-6 w-6 text-gold transition group-hover:scale-125 group-hover:rotate-12" /><p className="mt-2 text-sm font-semibold">{t}</p></div>
            ))}
          </div>
        </div>
        <div className="relative reveal">
          <img src={world} alt="Miniature floating world map" loading="lazy" width={1280} height={960} className="w-full rounded-3xl [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_75%)]" style={{ transform: `translate(${m.x * 25}px, ${Math.sin(y / 300) * 10 + m.y * 25}px)` }} />
          <div className="glass animate-floaty absolute left-6 top-6 flex items-center gap-3 rounded-xl px-4 py-2 text-sm">
            <Star className="h-5 w-5 fill-gold text-gold" /><div><p className="font-semibold">Our World</p><p className="text-xs text-gold">Level 3 · 720 XP</p></div>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <p className={eyebrow}>Just between you two</p>
        <h2 className={`${h2} mt-4`}>A safe, private space for your story.</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[[Lock, "Private by design", "Your space, your rules"], [UserX, "No public profiles", "Just the two of you"], [ShieldCheck, "Secure & encrypted", "Your data stays safe"], [Heart, "Meaningful by default", "Built for deeper connection"]].map(([I, t, d]: any) => (
            <div key={t} className="reveal glass rounded-2xl p-6 text-center transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-20px_var(--primary)]">
              <I className="mx-auto h-7 w-7 text-primary" /><p className="mt-4 font-semibold">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <blockquote className="reveal glass mx-auto mt-16 max-w-2xl rounded-2xl p-8">
          <p className="font-display text-2xl leading-snug">"SnickyLink makes our simple days feel special again. The Snicks are fun, but the conversations we have because of them are even better."</p>
          <footer className="mt-4 text-sm text-muted-foreground">— A & R, long distance couple</footer>
        </blockquote>
      </section>

      {/* JOIN */}
      <section id="join" className="relative overflow-hidden py-32">
        <img src={hero} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
        <div className="reveal relative mx-auto max-w-2xl px-6 text-center">
          <p className={eyebrow}>Be part of the first chapter</p>
          <h2 className={`${h2} mt-4`}>Join the waitlist.</h2>
          <p className="mt-4 text-muted-foreground">Be the first to explore SnickyLink and get early access, launch updates and special surprises.</p>
          <div className="mt-8 flex justify-center"><Waitlist /></div>
          <p className="mt-8 font-hand text-3xl text-peach">A brighter us ahead ♡</p>
        </div>
      </section>

      <FAQ />

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2 font-bold text-foreground"><img src={logo} alt="" width={28} height={28} className="h-7 w-7 rounded-full" />SNICKYLINK</span>
          <span>Play • Connect • Grow Together</span>
          <span className="font-hand text-2xl text-peach">Better together, always</span>
        </div>
      </footer>
    </main>
  );
}

const snicks = [
  ["The 60-Second Laugh Challenge", "Make your partner laugh in just 60 seconds. No jokes from the internet!"],
  ["Memory Lane", "Each share one tiny moment from your first month that the other forgot."],
  ["Secret Compliment", "Leave a hidden compliment in the app for your partner to find tonight."],
  ["Future Postcard", "Write a postcard to the two of you, one year from now."],
];
function SnickCard() {
  const [i, setI] = useState(0);
  const [t, d] = snicks[i]!;
  return (
    <div className="glass relative rounded-3xl p-8 shadow-[0_0_80px_-30px_var(--primary)]">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-primary/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">Daily Snick</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-gold"><Sparkles className="h-4 w-4" />+50 XP</span>
      </div>
      <h3 key={t} className="mt-6 font-display text-4xl animate-rise">{t}</h3>
      <p className="mt-3 text-muted-foreground">{d}</p>
      <div className="mt-8 flex items-center justify-between">
        <button className={btn}>Start Demo <ArrowRight className="h-4 w-4" /></button>
        <div className="flex items-center gap-3 text-sm">
          <button aria-label="Previous" onClick={() => setI((i + 3) % 4)} className="h-9 w-9 rounded-full border border-border hover:bg-muted">‹</button>
          {i + 1} / 4
          <button aria-label="Next" onClick={() => setI((i + 1) % 4)} className="h-9 w-9 rounded-full border border-border hover:bg-muted">›</button>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  ["What is SnickyLink?", "A private, gamified space for couples to play Snicks, build memories and grow together."],
  ["Is it really private?", "Yes. No public profiles, no feeds — just the two of you."],
  ["When is it launching?", "Soon. Waitlist members get first access."],
  ["Will there be a mobile app?", "Yes, SnickyLink is designed mobile-first."],
  ["Can long distance couples use it?", "Absolutely — Snicks work wherever you both are."],
];
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className={eyebrow}>Frequently asked questions</p>
      <h2 className={`${h2} mt-4`}>Got questions?<br />We've got you.</h2>
      <div className="mt-10 space-y-3 text-left">
        {faqs.map(([q, a], i) => (
          <div key={q} className="reveal glass rounded-xl" style={{ transitionDelay: `${i * 0.08}s` }}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium">
              {q}<Plus className={`h-4 w-4 transition ${open === i ? "rotate-45" : ""}`} />
            </button>
            {open === i && <p className="animate-rise px-5 pb-4 text-sm text-muted-foreground">{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Particles() {
  const [ps, setPs] = useState<{ l: number; s: number; d: number; dl: number }[]>([]);
  useEffect(() => setPs(Array.from({ length: 28 }, () => ({ l: Math.random() * 100, s: 2 + Math.random() * 3, d: 10 + Math.random() * 14, dl: Math.random() * -20 }))), []);
  return <>{ps.map((p, i) => <span key={i} className="particle" style={{ left: `${p.l}%`, width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.dl}s` }} />)}</>;
}

import { create } from "zustand";

/** Mutable scroll singleton: scroll controls framing only, never progression. */
export const scrollState = { p: 0, target: 0 };

export type SnickId = 0 | 1 | 2 | 3;
export type Side = "you" | "them";

export interface SnickDef {
  id: SnickId;
  title: string;
  emoji: string;
  prompt: string;
  momentLine: string;
}

export const SNICKS: SnickDef[] = [
  { id: 0, title: "NOTICE", emoji: "👀", prompt: "Find one little thing you love about your person.", momentLine: "ONE DOWN. KEEP GOING." },
  { id: 1, title: "PLAY", emoji: "😂", prompt: "Make each other laugh in 60 seconds.", momentLine: "TWO DOWN. KEEP GOING." },
  { id: 2, title: "CONNECT", emoji: "💭", prompt: "Ask something you've always wanted to do together.", momentLine: "THREE DOWN. ONE TO GO." },
  { id: 3, title: "CREATE", emoji: "📸", prompt: "Create one tiny memory together.", momentLine: "1 WORLD COMPLETE." },
];

export const WORLD_CHANGES = [
  "Your spark reached the trees. A new light cluster is alive.",
  "Another pulse crossed the Glade. The bridge is active.",
  "The lake emerged from the dark. Your two-way vault is open.",
  "The largest pulse yet. Your memory monument now stands at the ignition.",
];

export const COUPLE_TAGS = [
  { tag: "THE OBSERVERS 👀", line: "You two notice the little things." },
  { tag: "THE CHAOS DUO 😂", line: "Nothing stays quiet when you two show up." },
  { tag: "THE SOFTIES 🫶", line: "Small gestures, enormous meaning." },
  { tag: "THE ADVENTURERS ✦", line: "Every map looks smaller once you two start walking." },
];

const makeCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let i = 0; i < 6; i += 1) value += chars[Math.floor(Math.random() * chars.length)];
  return `${value.slice(0, 3)}-${value.slice(3)}`;
};

interface JourneyState {
  duoCode: string;
  partnerJoined: boolean;
  you: boolean[];
  them: boolean[];
  answers: { you: string; them: string };
  sealed: { you: boolean; them: boolean };
  memoryPhoto: string | null;
  waitlisted: boolean;
  names: { a: string; b: string };
  nickname: string;
  joinPartner: () => void;
  mark: (id: SnickId, side: Side) => void;
  lockAnswer: (side: Side, text: string) => void;
  setMemoryPhoto: (url: string | null) => void;
  setWaitlisted: (value: boolean) => void;
  setNames: (a: string, b: string) => void;
  setNickname: (nickname: string) => void;
  initCode: () => void;
}

export const isAvailable = (state: Pick<JourneyState, "partnerJoined" | "you" | "them">, id: number) =>
  state.partnerJoined && state.you.slice(0, id).every((value, index) => value && state.them[index]);

export const useJourney = create<JourneyState>((set) => ({
  duoCode: "",
  partnerJoined: false,
  you: [false, false, false, false],
  them: [false, false, false, false],
  answers: { you: "", them: "" },
  sealed: { you: false, them: false },
  memoryPhoto: null,
  waitlisted: false,
  names: { a: "A", b: "M" },
  nickname: "YOU + YOUR PERSON",
  joinPartner: () => set({ partnerJoined: true }),
  mark: (id, side) => set((state) => {
    if (!isAvailable(state, id)) return {};
    const next = [...state[side]];
    next[id] = true;
    return { [side]: next } as Partial<JourneyState>;
  }),
  lockAnswer: (side, text) => set((state) => {
    if (!isAvailable(state, 2) || !text.trim()) return {};
    const answers = { ...state.answers, [side]: text.trim() };
    const sealed = { ...state.sealed, [side]: true };
    if (sealed.you && sealed.them) {
      const you = [...state.you];
      const them = [...state.them];
      you[2] = true;
      them[2] = true;
      return { answers, sealed, you, them };
    }
    return { answers, sealed };
  }),
  setMemoryPhoto: (memoryPhoto) => set({ memoryPhoto }),
  setWaitlisted: (waitlisted) => set({ waitlisted }),
  setNames: (a, b) => set({ names: { a, b } }),
  setNickname: (nickname) => set({ nickname: nickname.trim().slice(0, 28) || "YOU + YOUR PERSON" }),
  initCode: () => set((state) => (state.duoCode ? {} : { duoCode: makeCode() })),
}));

export const doneList = (you: boolean[], them: boolean[]): number[] => you.map((value, index) => (value && them[index] ? 1 : 0));

/** Interaction-owned values read directly by the 3D frame loop. */
export const worldState = {
  done: [0, 0, 0, 0],
  partner: 0,
  /** Presentation-only world birth. It is intentionally independent of pairing. */
  visual: 0,
  radius: 0,
  pulse: 0,
  waitlisted: 0,
  /** Radius the ground is currently revealed to (driven by the ignition ring). */
  reveal: 0,
};

/** Internal world identity — not rendered until the Act 5 reveal. */
export const WORLD = { name: "THE HONEYMOON GLADE 🌿", baseRadius: 7 };

/** Ignition cutscene clock. Fires once when the visitor reaches the world-birth chapter. */
export const IGNITION = { approach: 1.8, flash: 0.25, ring: 2.5, total: 4.55 };
export const ignition = { start: -1e9 };
const nowS = () => (typeof performance === "undefined" ? 0 : performance.now() / 1000);
export const ignitionElapsed = () => nowS() - ignition.start;
export const ignitionRunning = () => worldState.visual === 1 && ignitionElapsed() < IGNITION.total;
export function startVisualIgnition() {
  if (worldState.visual) return;
  worldState.visual = 1;
  worldState.radius = 7 + worldState.done.reduce((sum, value) => sum + value, 0) * 2.75;
  ignition.start = nowS();
}
export function skipIgnition() {
  if (!ignitionRunning()) return;
  ignition.start = nowS() - IGNITION.total;
  window.dispatchEvent(new Event("snicky-ignition-skip"));
}

useJourney.subscribe((state, previous) => {
  const done = doneList(state.you, state.them);
  const previousDone = doneList(previous.you, previous.them);
  const completed = done.reduce((sum, value) => sum + value, 0);
  const previousCompleted = previousDone.reduce((sum, value) => sum + value, 0);
  worldState.done = done;
  worldState.partner = state.partnerJoined ? 1 : 0;
  worldState.radius = worldState.visual ? 7 + completed * 2.75 : 0;
  if (completed > previousCompleted) worldState.pulse += 1;
  worldState.waitlisted = state.waitlisted ? 1 : 0;
});

export const actAt = (p: number) => Math.min(5, Math.max(0, Math.floor(p * 6)));
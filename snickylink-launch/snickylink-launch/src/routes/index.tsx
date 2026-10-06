import { createFileRoute } from "@tanstack/react-router";
import { DuoGame } from "@/components/game/DuoGame";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "SNICKYLINK — A little game for you + your person" },
      { name: "description", content: "A game couples play together through small daily challenges called Snicks. Connect. Play. Grow Together." },
      { property: "og:title", content: "SNICKYLINK — A little game for you + your person" },
      { property: "og:description", content: "Do tiny challenges together. Earn XP. Climb the league. Flex your duo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DuoGame,
});

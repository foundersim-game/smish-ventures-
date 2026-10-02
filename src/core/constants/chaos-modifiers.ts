import { ChaosModifier } from "../types/chaos-events.types";

export const CHAOS_MODIFIERS: ChaosModifier[] = [
  {
    id: "speed_debate",
    title: "SPEED DEBATE",
    icon: "⚡",
    tagline: "CLOCK IS TICKING!",
    description: "Discussion timer is cut to 30 seconds! Make your pitch fast or get left behind.",
    badgeColor: "bg-amber-500 text-black",
    durationAdjustmentSeconds: 30,
  },
  {
    id: "anonymous_discussion",
    title: "GHOST WHISPERS",
    icon: "👻",
    tagline: "DECEPTION MODE",
    description: "All discussion buzzers and reactions are anonymous this round. Trust no one!",
    badgeColor: "bg-purple-600 text-white",
  },
  {
    id: "double_blame",
    title: "DOUBLE BLAME TAX",
    icon: "🔥",
    tagline: "HIGH STAKES!",
    description: "Blame point penalties are DOUBLED this round (-300 pts). Choose your scapegoat carefully!",
    badgeColor: "bg-rose-600 text-white",
  },
  {
    id: "hot_seat",
    title: "THE HOT SEAT",
    icon: "📢",
    tagline: "INTERROGATION TIME",
    description: "One player is in the hot seat! The group must grill them on their initial vote.",
    badgeColor: "bg-yellow-400 text-purple-950",
  },
  {
    id: "reverse_psychology",
    title: "REVERSE PSYCHOLOGY",
    icon: "🌀",
    tagline: "FLIP TO SURVIVE",
    description: "Changing your mind grants +100 bonus chaos points this round. Being stubborn earns 0!",
    badgeColor: "bg-cyan-500 text-black",
  },
  {
    id: "silent_treatment",
    title: "SILENT TABLE",
    icon: "🤫",
    tagline: "NO TALKING ALLOWED",
    description: "Zero spoken words allowed! Communicate only through table buzzers and facial expressions.",
    badgeColor: "bg-emerald-600 text-white",
  },
];

export function getRandomChaosModifier(): ChaosModifier {
  return CHAOS_MODIFIERS[Math.floor(Math.random() * CHAOS_MODIFIERS.length)];
}

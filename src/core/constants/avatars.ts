import { AvatarKey } from "../types/player.types";

export interface AvatarDefinition {
  key: AvatarKey;
  label: string;
  emoji: string;
  gradient: string;
  borderClass: string;
  glowColor: string;
}

export const AVATAR_CATALOG: AvatarDefinition[] = [
  {
    key: "crown",
    label: "The Boss",
    emoji: "👑",
    gradient: "from-amber-500 to-yellow-300",
    borderClass: "border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.6)]",
    glowColor: "rgba(251,191,36,0.6)",
  },
  {
    key: "fire",
    label: "Firebrand",
    emoji: "🔥",
    gradient: "from-rose-600 via-orange-500 to-amber-400",
    borderClass: "border-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.6)]",
    glowColor: "rgba(244,63,94,0.6)",
  },
  {
    key: "sunglasses",
    label: "Cool Head",
    emoji: "🕶️",
    gradient: "from-cyan-500 to-blue-600",
    borderClass: "border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.6)]",
    glowColor: "rgba(6,182,212,0.6)",
  },
  {
    key: "devil",
    label: "Provocateur",
    emoji: "😈",
    gradient: "from-purple-600 to-pink-600",
    borderClass: "border-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.6)]",
    glowColor: "rgba(168,85,247,0.6)",
  },
  {
    key: "brain",
    label: "Mastermind",
    emoji: "🧠",
    gradient: "from-fuchsia-500 to-purple-700",
    borderClass: "border-fuchsia-400 shadow-[0_0_14px_rgba(217,70,239,0.6)]",
    glowColor: "rgba(217,70,239,0.6)",
  },
  {
    key: "skull",
    label: "Chaos Agent",
    emoji: "💀",
    gradient: "from-slate-700 via-zinc-800 to-stone-900",
    borderClass: "border-gray-400 shadow-[0_0_14px_rgba(156,163,175,0.6)]",
    glowColor: "rgba(156,163,175,0.6)",
  },
  {
    key: "wolf",
    label: "Lone Wolf",
    emoji: "🐺",
    gradient: "from-indigo-600 to-slate-800",
    borderClass: "border-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.6)]",
    glowColor: "rgba(129,140,248,0.6)",
  },
  {
    key: "lightning",
    label: "Wildcard",
    emoji: "⚡",
    gradient: "from-yellow-400 to-amber-600",
    borderClass: "border-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.6)]",
    glowColor: "rgba(250,204,21,0.6)",
  },
  {
    key: "target",
    label: "Sniper",
    emoji: "🎯",
    gradient: "from-red-600 to-rose-700",
    borderClass: "border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.6)]",
    glowColor: "rgba(239,68,68,0.6)",
  },
  {
    key: "mask",
    label: "Drama Queen",
    emoji: "🎭",
    gradient: "from-violet-600 to-purple-900",
    borderClass: "border-violet-400 shadow-[0_0_14px_rgba(167,139,250,0.6)]",
    glowColor: "rgba(167,139,250,0.6)",
  },
  {
    key: "lion",
    label: "Alpha",
    emoji: "🦁",
    gradient: "from-amber-600 to-orange-700",
    borderClass: "border-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.6)]",
    glowColor: "rgba(245,158,11,0.6)",
  },
  {
    key: "snake",
    label: "The Serpent",
    emoji: "🐍",
    gradient: "from-emerald-500 to-teal-700",
    borderClass: "border-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.6)]",
    glowColor: "rgba(52,211,153,0.6)",
  },
  {
    key: "diamond",
    label: "High Roller",
    emoji: "💎",
    gradient: "from-sky-400 via-cyan-300 to-blue-500",
    borderClass: "border-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.7)]",
    glowColor: "rgba(103,232,249,0.7)",
  },
  {
    key: "party",
    label: "Party Animal",
    emoji: "🍕",
    gradient: "from-pink-500 to-rose-500",
    borderClass: "border-pink-400 shadow-[0_0_14px_rgba(244,114,182,0.6)]",
    glowColor: "rgba(244,114,182,0.6)",
  },
  {
    key: "clown",
    label: "Wild Jester",
    emoji: "🤡",
    gradient: "from-orange-500 via-red-500 to-yellow-400",
    borderClass: "border-orange-400 shadow-[0_0_14px_rgba(251,146,60,0.6)]",
    glowColor: "rgba(251,146,60,0.6)",
  },
  {
    key: "alien",
    label: "Impostor",
    emoji: "👾",
    gradient: "from-lime-500 to-green-700",
    borderClass: "border-lime-400 shadow-[0_0_14px_rgba(163,230,53,0.6)]",
    glowColor: "rgba(163,230,53,0.6)",
  },
];

export function getAvatarDefinition(key?: AvatarKey): AvatarDefinition {
  const found = AVATAR_CATALOG.find((a) => a.key === key);
  return found || AVATAR_CATALOG[0];
}

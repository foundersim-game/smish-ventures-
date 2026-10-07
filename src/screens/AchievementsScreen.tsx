import React, { useState } from "react";
import {
  ChevronLeft,
  Trophy,
  Award,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Eye,
  Crown,
  Heart,
  Lock,
  CheckCircle2,
  BarChart3,
  User,
  ShoppingCart,
} from "lucide-react";
import { PlayerStorage } from "../services/storage/player-storage";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface AchievementsScreenProps {
  onBack: () => void;
  onOpenHome: () => void;
  onOpenProfile: () => void;
  onOpenStore: () => void;
}

interface AchievementItem {
  id: string;
  title: string;
  category: "chaos" | "loyalty" | "social" | "mastery";
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  xpReward: number;
  badgeColor: string;
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "instigator",
    title: "The Instigator",
    category: "chaos",
    description: "Successfully flipped the table vote during the Final Vote phase.",
    icon: "🔥",
    progress: 4,
    total: 5,
    unlocked: false,
    xpReward: 350,
    badgeColor: "from-rose-500 to-red-600",
  },
  {
    id: "ghost_saboteur",
    title: "Ghost Saboteur",
    category: "chaos",
    description: "Executed a secret mission without receiving a single blame vote.",
    icon: "🕵️",
    progress: 3,
    total: 3,
    unlocked: true,
    xpReward: 500,
    badgeColor: "from-purple-500 to-indigo-600",
  },
  {
    id: "same_brain",
    title: "Same Brain",
    category: "social",
    description: "Voted with 100% consensus alongside your squad in a round.",
    icon: "🧠",
    progress: 1,
    total: 1,
    unlocked: true,
    xpReward: 250,
    badgeColor: "from-cyan-500 to-blue-600",
  },
  {
    id: "party_monarch",
    title: "Party Monarch",
    category: "mastery",
    description: "Host 5 completed multiplayer games with at least 4 players.",
    icon: "👑",
    progress: 3,
    total: 5,
    unlocked: false,
    xpReward: 600,
    badgeColor: "from-amber-400 to-yellow-600",
  },
  {
    id: "chaos_overlord",
    title: "Chaos Overlord",
    category: "chaos",
    description: "Triggered a 100% maxed-out Chaos Meter on Halftime or Report.",
    icon: "💣",
    progress: 1,
    total: 1,
    unlocked: true,
    xpReward: 400,
    badgeColor: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "unshakable",
    title: "Unshakable",
    category: "loyalty",
    description: "Refused to change your initial vote across 5 consecutive rounds.",
    icon: "🧱",
    progress: 5,
    total: 5,
    unlocked: true,
    xpReward: 300,
    badgeColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "buzzer_master",
    title: "Buzzer Master",
    category: "social",
    description: "Called BULLSHIT right before the debate timer ran out.",
    icon: "🚨",
    progress: 7,
    total: 10,
    unlocked: false,
    xpReward: 200,
    badgeColor: "from-red-500 to-rose-700",
  },
  {
    id: "high_roller",
    title: "High Roller",
    category: "mastery",
    description: "Preserved over $30,000 in squad balance through round 10.",
    icon: "💰",
    progress: 1,
    total: 1,
    unlocked: true,
    xpReward: 450,
    badgeColor: "from-amber-400 to-emerald-500",
  },
  {
    id: "peacemaker",
    title: "The Peacemaker",
    category: "loyalty",
    description: "Resolved 3 sudden-death tie-breaker showdowns without blood.",
    icon: "🕊️",
    progress: 2,
    total: 3,
    unlocked: false,
    xpReward: 350,
    badgeColor: "from-blue-400 to-indigo-500",
  },
];

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  onBack,
  onOpenHome,
  onOpenProfile,
  onOpenStore,
}) => {
  const profile = PlayerStorage.getProfile();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "chaos" | "social" | "mastery">("all");

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const totalXp = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  const filteredAchievements =
    selectedFilter === "all"
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === selectedFilter);

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between px-3.5 py-2 bg-[#090310] select-none overflow-hidden">
      {/* Top Header */}
      <header className="relative w-full max-w-sm mx-auto flex items-center justify-between z-10 flex-shrink-0 pt-1 pb-2">
        <button
          onClick={() => {
            audio.play("click");
            onBack();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-200 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h1 className="font-display font-black text-lg text-white tracking-tight uppercase">
            ACHIEVEMENTS
          </h1>
          <span className="text-[10px] font-bold text-yellow-400 tracking-wider">
            {unlockedCount} OF {totalCount} UNLOCKED
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-yellow-400 font-display font-black text-xs shadow-[0_0_12px_rgba(250,204,21,0.3)]">
          ★
        </div>
      </header>

      {/* Scrollable Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar w-full max-w-sm mx-auto space-y-3 pb-2">
        {/* Level & Rank Summary Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#2E0F3E] via-[#1D0830] to-[#120422] border-2 border-purple-500/50 shadow-[0_0_24px_rgba(168,85,247,0.25)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider block">
                  CHAOS RANK
                </span>
                <h3 className="font-display font-black text-white text-base leading-tight">
                  LEVEL 4 • INSTIGATOR
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="font-display font-black text-yellow-400 text-sm">
                {totalXp} XP
              </span>
              <span className="text-[9px] text-gray-400 block font-medium">Career Score</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-300">
              <span>Next Rank: Master Traitor</span>
              <span>1,850 / 2,500 XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden p-0.5 border border-purple-500/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-amber-400 to-yellow-300 transition-all duration-500"
                style={{ width: "74%" }}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(
            [
              { id: "all", label: "ALL" },
              { id: "chaos", label: "🔥 CHAOS" },
              { id: "social", label: "🧠 SOCIAL" },
              { id: "mastery", label: "👑 MASTERY" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                audio.play("click");
                setSelectedFilter(tab.id);
              }}
              className={`px-3 py-1 rounded-full text-[10px] font-display font-black tracking-wider transition-all flex-shrink-0 cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md"
                  : "bg-purple-950/50 border border-purple-800/40 text-purple-300 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievement Badges List */}
        <div className="space-y-2">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all ${
                item.unlocked
                  ? "bg-[#1C0D2F]/90 border-purple-500/50 shadow-[0_0_16px_rgba(168,85,247,0.2)]"
                  : "bg-[#140822]/80 border-purple-900/30 opacity-75"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Badge Icon */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md flex-shrink-0 bg-gradient-to-br ${
                    item.unlocked ? item.badgeColor : "from-gray-800 to-gray-900 border border-gray-700"
                  }`}
                >
                  {item.unlocked ? item.icon : <Lock className="w-4 h-4 text-gray-400" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                      <span>{item.title}</span>
                      {item.unlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </h4>
                    <span className="text-[10px] font-display font-black text-yellow-400">
                      +{item.xpReward} XP
                    </span>
                  </div>

                  <p className="text-gray-300 text-[11px] leading-snug mt-0.5">
                    {item.description}
                  </p>

                  {/* Progress Meter */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-black/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.unlocked
                            ? "bg-emerald-400"
                            : "bg-gradient-to-r from-purple-500 to-pink-500"
                        }`}
                        style={{
                          width: `${Math.min(100, (item.progress / item.total) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[9.5px] font-bold text-gray-400 flex-shrink-0">
                      {item.progress} / {item.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Frosted Glass Dock */}
      <footer className="relative z-20 w-full max-w-sm mx-auto px-4 pb-2 pt-1 flex-shrink-0">
        <div className="w-full bg-[#1A0B2E]/90 backdrop-blur-md rounded-2xl border border-purple-500/30 px-3 py-2 flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => {
              audio.play("click");
              onOpenHome();
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <BarChart3 className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">Home</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              onOpenProfile();
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <User className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">My Player</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
            }}
            className="flex flex-col items-center text-white transition-colors cursor-pointer group"
          >
            <Trophy className="w-5 h-5 text-[#FF2A6D] mb-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wide text-white">Achievements</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              onOpenStore();
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <ShoppingCart className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">Store</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

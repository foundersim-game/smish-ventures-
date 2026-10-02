import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Users, Heart, Lock, Sparkles } from "lucide-react";
import { GameMode } from "../core/types/room.types";
import { ChaosButton } from "../components/atoms/ChaosButton";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface ModeSelectScreenProps {
  onBack: () => void;
  onSelectMode: (mode: GameMode) => void;
  initialMode?: GameMode;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onBack,
  onSelectMode,
  initialMode = "party",
}) => {
  // Always lock to party mode since couples mode is coming soon
  const [selectedMode, setSelectedMode] = useState<GameMode>("party");
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  const handleSelect = (mode: GameMode) => {
    if (mode === "couples") {
      audio.play("invalid");
      haptics.trigger("warning");
      setComingSoonToast("💖 Couples Mode is coming soon! Enjoy Party Mode with your crew.");
      setTimeout(() => setComingSoonToast(null), 3000);
      return;
    }
    setSelectedMode("party");
    audio.play("click");
    haptics.trigger("light");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-5 pt-8 pb-6 bg-[#090310] select-none">
      {/* Top Navigation & Step Indicator */}
      <header className="relative w-full flex items-center justify-between z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 4-Dash Step Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 rounded-full bg-amber-400" />
          <div className="w-8 h-1.5 rounded-full bg-white/20" />
          <div className="w-8 h-1.5 rounded-full bg-white/20" />
          <div className="w-8 h-1.5 rounded-full bg-white/20" />
        </div>

        <span className="text-xs font-bold text-gray-400">1 / 4</span>
      </header>

      {/* Title Header */}
      <div className="mt-8 text-center">
        <span className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
          CREATE GAME
        </span>
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mt-1 leading-tight">
          WHAT ARE WE <br />
          <span className="text-yellow-400">PLAYING?</span>
        </h1>
        <p className="text-gray-300 text-xs mt-2">
          Choose a mode to get started.
        </p>
      </div>

      {/* Floating Toast Notification for Coming Soon */}
      {comingSoonToast && (
        <div className="mx-auto max-w-sm w-full -mb-2 mt-2 z-20 animate-bounce">
          <div className="bg-gradient-to-r from-pink-950 via-purple-900 to-pink-950 border border-pink-500/60 rounded-2xl px-4 py-2.5 text-center shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            <span className="text-pink-300 text-xs font-bold">
              {comingSoonToast}
            </span>
          </div>
        </div>
      )}

      {/* Selectable Mode Cards */}
      <div className="grid grid-cols-2 gap-3.5 my-auto max-w-sm mx-auto w-full py-4">
        {/* PARTY MODE CARD */}
        <div
          onClick={() => handleSelect("party")}
          className={`
            p-4 rounded-3xl flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-200 min-h-[300px] border
            ${
              selectedMode === "party"
                ? "bg-gradient-to-b from-[#2B0F4C] via-[#3B1238] to-[#160624] border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-[1.02]"
                : "bg-[#180E2B]/90 border-purple-800/40 hover:bg-[#20123A]"
            }
          `}
        >
          <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 mb-2">
            <Users className="w-9 h-9 fill-amber-400 text-amber-300" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              <span>ACTIVE</span>
            </div>
            <h3 className="font-display font-black text-2xl text-white tracking-tight">
              PARTY
            </h3>
            <span className="text-xs font-bold text-yellow-300">
              4 – 10 players
            </span>
            <p className="text-gray-300 text-[11px] mt-2 leading-tight">
              Friends. Arguments. 10 crazy connected rounds.
            </p>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center mt-3 border ${
              selectedMode === "party"
                ? "bg-amber-400 text-purple-950 border-amber-300 shadow-md"
                : "border-purple-500/50 bg-[#120822]"
            }`}
          >
            {selectedMode === "party" && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
        </div>

        {/* COUPLES MODE CARD (COMING SOON) */}
        <div
          onClick={() => handleSelect("couples")}
          className="relative p-4 rounded-3xl flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-200 min-h-[300px] border border-pink-500/30 bg-[#150a24]/90 hover:border-pink-500/50 group"
        >
          {/* Glowing Coming Soon Pill */}
          <div className="absolute -top-3 px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(236,72,153,0.7)] border border-pink-400/50 flex items-center gap-1.5 animate-pulse">
            <Lock className="w-3 h-3 text-pink-200" />
            <span>COMING SOON</span>
          </div>

          <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400/60 mb-2 group-hover:scale-105 transition-transform mt-1">
            <Heart className="w-9 h-9 fill-pink-500/50 text-pink-400/50" />
          </div>

          <div className="opacity-75 group-hover:opacity-90 transition-opacity">
            <h3 className="font-display font-black text-2xl text-white tracking-tight">
              COUPLES
            </h3>
            <span className="text-xs font-bold text-pink-400/80">
              2 players
            </span>
            <p className="text-gray-400 text-[11px] mt-2 leading-tight">
              Deep questions & dilemmas for two. Arriving soon!
            </p>
          </div>

          <div className="w-7 h-7 rounded-full flex items-center justify-center mt-3 border border-pink-500/30 bg-pink-950/40 text-pink-400/50">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="w-full max-w-sm mx-auto">
        <ChaosButton
          variant="primary"
          size="lg"
          rightIcon={<ChevronRight className="w-5 h-5 text-white/90" />}
          onClick={() => onSelectMode("party")}
        >
          CONTINUE TO SCENARIOS
        </ChaosButton>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { ScenarioOption } from "../../core/types/scenario.types";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface ChaosCoinTossProps {
  tiedOptions: ScenarioOption[];
  winnerOptionId: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const ChaosCoinToss: React.FC<ChaosCoinTossProps> = ({
  tiedOptions,
  winnerOptionId,
  onComplete,
  autoStart = true,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);

  const optA = tiedOptions[0] || { id: "A", label: "Option A" };
  const optB = tiedOptions[1] || { id: "B", label: "Option B" };
  const winnerOpt = tiedOptions.find((o) => o.id === winnerOptionId) || optA;

  const startFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setHasLanded(false);
    audio.play("coin_flip");
    haptics.trigger("heavy");

    // Coin spins in air for 2.2 seconds
    setTimeout(() => {
      setIsFlipping(false);
      setHasLanded(true);
      audio.play("coin_land");
      audio.play("fanfare", 0.5);
      haptics.trigger("chaos_moment");

      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.45 },
          colors: ["#FBBF24", "#F59E0B", "#00D2FF", "#FF3B8A"],
        });
      } catch {
        // Ignored
      }

      if (onComplete) {
        setTimeout(onComplete, 2200);
      }
    }, 2200);
  };

  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(startFlip, 400);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  // If winner is optA (face 1), end angle is 1800deg (multiples of 360).
  // If winner is optB (face 2), end angle is 1980deg (1800 + 180).
  const targetRotation = winnerOptionId === optA.id ? 1800 : 1980;

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center justify-center p-4 bg-[#140827]/95 border-2 border-amber-500/60 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.35)] select-none my-2 overflow-hidden">
      {/* Ambient Gold Radial Flare */}
      <div className="absolute -top-12 inset-x-0 h-40 bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-xl pointer-events-none" />

      {/* Top Deadlock Pill */}
      <div className="relative z-10 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400 text-amber-300 text-[10px] font-black tracking-widest uppercase shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center gap-1.5 mb-1 animate-pulse">
        <span>⚖️ 50/50 DEADLOCK</span>
      </div>

      <h3 className="relative z-10 font-display font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight text-center">
        CHAOS COIN TOSS
      </h3>
      <p className="relative z-10 text-[11px] font-medium text-gray-300 text-center mb-3">
        {hasLanded
          ? `The coin has spoken! Option ${winnerOptionId} broke the tie!`
          : isFlipping
          ? "Coin is spinning in mid-air..."
          : "Flipping coin to break the deadlock..."}
      </p>

      {/* ============================================================== */}
      {/* 2 TIED OPTIONS FACING OFF (VS BATTLE)                         */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full grid grid-cols-2 gap-2 mb-4">
        {/* Left Tied Option */}
        <div
          className={`p-2.5 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border ${
            hasLanded && winnerOptionId === optA.id
              ? "bg-[#0E2A47] border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.7)] scale-[1.03]"
              : "bg-[#1C0E33] border-purple-800/40 opacity-80"
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#FF2B85] to-[#C026D3] text-white flex items-center justify-center font-display font-black text-sm mb-1 shadow">
            {optA.id}
          </div>
          <span className="text-[10px] font-bold text-white leading-tight break-words text-center min-h-[28px] flex items-center justify-center">
            {optA.label}
          </span>
          {hasLanded && winnerOptionId === optA.id && (
            <span className="mt-1 px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 text-[9px] font-black uppercase border border-cyan-400/50">
              🪙 Winner!
            </span>
          )}
        </div>

        {/* Right Tied Option */}
        <div
          className={`p-2.5 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border ${
            hasLanded && winnerOptionId === optB.id
              ? "bg-[#0E2A47] border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.7)] scale-[1.03]"
              : "bg-[#1C0E33] border-purple-800/40 opacity-80"
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#00D2FF] to-[#0070FF] text-white flex items-center justify-center font-display font-black text-sm mb-1 shadow">
            {optB.id}
          </div>
          <span className="text-[10px] font-bold text-white leading-tight break-words text-center min-h-[28px] flex items-center justify-center">
            {optB.label}
          </span>
          {hasLanded && winnerOptionId === optB.id && (
            <span className="mt-1 px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 text-[9px] font-black uppercase border border-cyan-400/50">
              🪙 Winner!
            </span>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3D GOLDEN COIN IN MID-AIR                                      */}
      {/* ============================================================== */}
      <div
        className="relative w-full h-[120px] flex flex-col items-center justify-center my-1"
        style={{ perspective: "1000px" }}
      >
        {/* Dynamic Floor Shadow */}
        <div
          className={`absolute bottom-2 w-16 h-3 rounded-full bg-black/60 blur-xs transition-all duration-700 ${
            isFlipping ? "scale-50 opacity-30" : "scale-100 opacity-80"
          }`}
        />

        {/* 3D Rotating Coin */}
        <div
          className="relative w-20 h-20 transition-all duration-[2200ms]"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipping
              ? `rotateY(${targetRotation + 720}deg) translateY(-35px) scale(1.15)`
              : hasLanded
              ? `rotateY(${targetRotation}deg) translateY(0px) scale(1)`
              : "rotateY(0deg) translateY(0px)",
            transitionTimingFunction: "cubic-bezier(0.12, 0.95, 0.25, 1)",
          }}
        >
          {/* FACE 1: OPTION A (Front Face) */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-[0_0_25px_rgba(251,191,36,0.9),inset_0_2px_6px_rgba(255,255,255,0.9)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background:
                "radial-gradient(circle at 35% 35%, #FFF9C4 0%, #FBBF24 45%, #D97706 75%, #B45309 100%)",
            }}
          >
            {/* Inner milled coin ring */}
            <div className="w-15 h-15 rounded-full border-2 border-amber-800/40 flex items-center justify-center shadow-inner">
              <span className="font-display font-black text-4xl text-amber-950 drop-shadow-[0_2px_1px_rgba(255,255,255,0.8)] leading-none select-none">
                {optA.id}
              </span>
            </div>
          </div>

          {/* FACE 2: OPTION B (Back Face, rotated 180deg) */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-[0_0_25px_rgba(251,191,36,0.9),inset_0_2px_6px_rgba(255,255,255,0.9)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background:
                "radial-gradient(circle at 35% 35%, #FFF9C4 0%, #FBBF24 45%, #D97706 75%, #B45309 100%)",
            }}
          >
            {/* Inner milled coin ring */}
            <div className="w-15 h-15 rounded-full border-2 border-amber-800/40 flex items-center justify-center shadow-inner">
              <span className="font-display font-black text-4xl text-amber-950 drop-shadow-[0_2px_1px_rgba(255,255,255,0.8)] leading-none select-none">
                {optB.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Action / Replay Button */}
      <div className="relative z-10 mt-2 w-full flex items-center justify-center">
        {hasLanded ? (
          <div className="w-full flex flex-col items-center gap-1.5">
            <div className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-display font-black text-xs uppercase tracking-wider shadow-md animate-bounce">
              🪙 Option {winnerOptionId} Won the Toss!
            </div>
            <button
              onClick={startFlip}
              className="text-[10px] text-amber-300/80 hover:text-amber-200 underline font-semibold mt-1"
            >
              🔄 Flip Again
            </button>
          </div>
        ) : (
          <button
            onClick={startFlip}
            disabled={isFlipping}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-display font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-transform"
          >
            {isFlipping ? "🪙 Flipping..." : "🪙 Flip Now"}
          </button>
        )}
      </div>
    </div>
  );
};

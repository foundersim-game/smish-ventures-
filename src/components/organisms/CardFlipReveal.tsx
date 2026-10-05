import React from "react";

interface CardFlipRevealProps {
  isFlipped: boolean;
  isShaking: boolean;
  winningOptionId?: string;
  winningOptionLabel?: string;
  isTie?: boolean;
}

export const CardFlipReveal: React.FC<CardFlipRevealProps> = ({
  isFlipped,
  isShaking,
  winningOptionId = "B",
  winningOptionLabel = "Go clubbing",
  isTie = false,
}) => {
  return (
    <div className="relative w-full max-w-[340px] h-[210px] mx-auto select-none flex flex-col items-center justify-center my-2">
      {/* Ambient Party Floor Glow */}
      <div
        className="absolute bottom-1 w-[260px] h-[36px] rounded-[100%] pointer-events-none transition-all duration-700"
        style={{
          background: isFlipped
            ? "radial-gradient(ellipse 65% 45% at 50% 50%, rgba(0, 210, 255, 0.45) 0%, rgba(192, 38, 211, 0.25) 50%, transparent 75%)"
            : "radial-gradient(ellipse 65% 45% at 50% 50%, rgba(255, 43, 133, 0.45) 0%, rgba(147, 51, 234, 0.25) 50%, transparent 75%)",
          filter: "blur(6px)",
        }}
      />

      {/* 3D Perspective Stage Container */}
      <div
        className={`relative w-[280px] md:w-[300px] h-[165px] md:h-[175px] transition-transform ${
          isShaking ? "animate-shake-case" : isFlipped ? "animate-float-card" : ""
        }`}
        style={{
          perspective: "1200px",
        }}
      >
        {/* Flip Card Inner Wrapper with 3D Rotation */}
        <div
          className="relative w-full h-full rounded-3xl transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            WebkitTransform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ============================================================== */}
          {/* 1. BACK FACE: MYSTERY CARD (Hidden when flipped)              */}
          {/* ============================================================== */}
          <div
            className="absolute inset-0 rounded-3xl p-3 flex flex-col items-center justify-between border-3 border-[#FF2B85] shadow-[0_0_30px_rgba(255,43,133,0.65),inset_0_0_18px_rgba(255,43,133,0.3)] transition-opacity duration-300"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg) translateZ(1px)",
              WebkitTransform: "rotateY(0deg) translateZ(1px)",
              opacity: isFlipped ? 0 : 1,
              pointerEvents: isFlipped ? "none" : "auto",
              visibility: isFlipped ? "hidden" : "visible",
              background:
                "linear-gradient(135deg, #1A062C 0%, #3B0D4C 50%, #6B114D 100%)",
            }}
          >
            {/* Glossy Diagonal Party Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-3xl" />

            {/* Inner Dashed Border Frame */}
            <div className="absolute inset-2 rounded-2xl border border-dashed border-pink-400/40 pointer-events-none" />

            {/* Top Corner Stars */}
            <div className="relative z-10 w-full flex items-center justify-between px-2 pt-1 text-pink-300/80 text-xs">
              <span>★</span>
              <span className="text-[9px] font-black tracking-widest uppercase">
                CHAOS CARD
              </span>
              <span>★</span>
            </div>

            {/* Center Mystery Brand Seal */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF2B85] to-[#FF8A00] p-0.5 shadow-[0_0_18px_rgba(255,43,133,0.8)] flex items-center justify-center animate-pulse">
                <div className="w-full h-full rounded-[14px] bg-[#1F0833] flex flex-col items-center justify-center">
                  <span className="text-2xl filter drop-shadow">🔥</span>
                </div>
              </div>

              <span className="font-display font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-rose-400 mt-1">
                CHAOS
              </span>
            </div>

            {/* Bottom Status Pill */}
            <div className="relative z-10 px-3 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/50 text-[9px] font-black text-pink-300 uppercase tracking-widest shadow">
              {isShaking ? "REVEALING..." : "DECISION LOCKED"}
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. FRONT FACE: THE WINNING ANSWER (Visible when flipped)      */}
          {/* ============================================================== */}
          <div
            className="absolute inset-0 rounded-3xl p-3 flex flex-col items-center justify-center text-center border-3 border-[#38BDF8] shadow-[0_0_35px_rgba(0,210,255,0.85),inset_0_1px_4px_rgba(255,255,255,0.9)] transition-opacity duration-300"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)",
              WebkitTransform: "rotateY(180deg) translateZ(1px)",
              opacity: isFlipped ? 1 : 0,
              pointerEvents: isFlipped ? "auto" : "none",
              visibility: isFlipped ? "visible" : "hidden",
              background:
                "linear-gradient(180deg, #00D2FF 0%, #0284C7 55%, #0369A1 100%)",
            }}
          >
            {/* Top-Half Translucent Glass Sheen Reflection */}
            <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/35 via-white/10 to-transparent rounded-t-3xl pointer-events-none" />

            {/* Option Letter Badge */}
            <div className="relative z-10 w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-b from-white via-sky-50 to-sky-100 border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center font-display font-black text-2xl md:text-3xl text-sky-950 mb-1 drop-shadow flex-shrink-0">
              {winningOptionId}
            </div>

            {/* Winning Option Label - Clear, Auto-Scaling Font without overlap */}
            <span
              className={`relative z-10 font-display font-black text-white uppercase tracking-tight leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] px-2 w-full text-center break-words ${
                winningOptionLabel.length > 36
                  ? "text-[11px] md:text-xs"
                  : winningOptionLabel.length > 22
                  ? "text-xs md:text-sm"
                  : "text-sm md:text-base"
              }`}
            >
              {winningOptionLabel}
            </span>

            {/* Deadlock Tiebreaker Pill Badge */}
            {isTie && (
              <div className="relative z-10 mt-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 text-amber-950 font-display font-black text-[9px] md:text-[10px] tracking-wider uppercase shadow-[0_0_12px_rgba(251,191,36,0.9)] border border-white/70 animate-pulse flex-shrink-0 flex items-center gap-1">
                <span>🪙</span>
                <span>Coin Toss Winner</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute -top-1 left-8 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#FDE047] animate-sparkle-1 pointer-events-none" />
      <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_10px_#F472B6] animate-sparkle-2 pointer-events-none" />
      <div className="absolute -bottom-2 right-12 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67E8F9] animate-sparkle-3 pointer-events-none" />
    </div>
  );
};

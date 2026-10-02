import React, { useState } from "react";
import { Eye, EyeOff, ShieldAlert, Award } from "lucide-react";
import { SecretMission } from "../../core/types/mission.types";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface SecretMissionCardProps {
  mission: SecretMission;
}

export const SecretMissionCard: React.FC<SecretMissionCardProps> = ({ mission }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleStartPeek = () => {
    setIsRevealed(true);
    audio.play("click");
    haptics.trigger("medium");
  };

  const handleEndPeek = () => {
    setIsRevealed(false);
  };

  return (
    <div className="w-full my-2.5 rounded-2xl bg-gradient-to-r from-[#211100] via-[#2A1502] to-[#1E0D00] border-2 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)] p-3.5 select-none text-left">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{mission.badge}</span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block font-display">
              TOP SECRET MISSION
            </span>
            <h4 className="font-display font-black text-sm text-white tracking-wide">
              {mission.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-black">
          <Award className="w-3.5 h-3.5" />
          <span>+{mission.rewardPoints} PTS</span>
        </div>
      </div>

      {/* Sensitive Mission Intel (Blurred by default for Couch Privacy) */}
      <div className="relative mt-2">
        <div
          className={`transition-all duration-200 ${
            isRevealed ? "filter-none opacity-100" : "blur-md select-none opacity-40"
          }`}
        >
          <div className="bg-black/50 rounded-xl p-2.5 border border-amber-500/20">
            <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block mb-0.5">
              YOUR SECRET OBJECTIVE:
            </span>
            <p className="text-white text-xs font-bold leading-snug">
              {mission.objective}
            </p>
            {mission.secretHint && (
              <p className="text-amber-200/80 text-[11px] font-medium italic mt-1.5 leading-tight">
                💡 Hint: {mission.secretHint}
              </p>
            )}
          </div>
        </div>

        {/* Hold to Peek Action Overlay when hidden */}
        {!isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-amber-500/90 text-black font-display font-black text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-pulse">
              <Eye className="w-3.5 h-3.5" />
              <span>HOLD TO PEEK</span>
            </div>
          </div>
        )}
      </div>

      {/* Hold Button / Touch Handler */}
      <div className="mt-2.5 flex items-center justify-between">
        <button
          type="button"
          onMouseDown={handleStartPeek}
          onMouseUp={handleEndPeek}
          onMouseLeave={handleEndPeek}
          onTouchStart={handleStartPeek}
          onTouchEnd={handleEndPeek}
          className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:bg-amber-500/40 border border-amber-400/40 text-amber-300 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>RELEASE TO CONCEAL INTEL</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>PRESS & HOLD TO READ</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-300/60 justify-center">
        <ShieldAlert className="w-3 h-3" />
        <span>Keep confidential. Don't let adjacent players see!</span>
      </div>
    </div>
  );
};

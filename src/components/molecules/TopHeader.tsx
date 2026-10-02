import React, { useState, useEffect } from "react";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface TopHeaderProps {
  currentRound?: number;
  totalRounds?: number;
  onLeave?: () => void;
  showRoundPill?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRound = 1,
  totalRounds = 6,
  onLeave,
  showRoundPill = true,
}) => {
  const [isMusicOn, setIsMusicOn] = useState<boolean>(true);

  useEffect(() => {
    setIsMusicOn(audio.getMusicEnabled());
  }, []);

  const handleLeaveClick = () => {
    audio.play("click");
    onLeave?.();
  };

  const handleMusicToggle = () => {
    const nextState = audio.toggleMusic();
    setIsMusicOn(nextState);
    audio.play("click");
    haptics.trigger("light");
  };

  return (
    <header className="relative w-full flex items-center justify-between px-4 py-3 select-none z-30">
      {/* Leave Button */}
      {onLeave ? (
        <button
          onClick={handleLeaveClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-chaos-card/80 border border-purple-500/30 text-white text-xs font-bold active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-4 h-4 text-purple-300" />
          <span>Leave</span>
        </button>
      ) : (
        <div className="w-16" />
      )}

      {/* Brand Header with Transparent 3D Logo */}
      <div className="flex items-center justify-center">
        <img
          src="/logo-transparent.png"
          alt="CHAOS"
          className="h-9 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(255,0,56,0.6)] active:scale-95 transition-transform"
        />
      </div>

      {/* Right controls: Music Toggle & Round Indicator Pill */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleMusicToggle}
          title={isMusicOn ? "Mute Background Music" : "Unmute Background Music"}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
            isMusicOn
              ? "bg-purple-900/70 border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
              : "bg-purple-950/60 border-purple-800/40 text-gray-500"
          }`}
        >
          {isMusicOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {showRoundPill ? (
          <div className="px-3 py-1.5 rounded-full bg-[#1F1238] border border-purple-500/40 text-xs font-extrabold shadow-inner flex items-center gap-1">
            <span className="text-gray-300 font-sans">Round</span>
            <span className="text-yellow-400 font-display text-sm">{currentRound}</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-300 font-display text-sm">{totalRounds}</span>
          </div>
        ) : null}
      </div>
    </header>
  );
};

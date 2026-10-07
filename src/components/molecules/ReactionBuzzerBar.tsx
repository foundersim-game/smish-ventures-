import React, { useRef } from "react";
import { ReactionBuzzerType } from "../../core/types/events.types";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface ReactionBuzzerBarProps {
  onBuzzer: (type: ReactionBuzzerType) => void;
  disabled?: boolean;
}

export const ReactionBuzzerBar: React.FC<ReactionBuzzerBarProps> = ({
  onBuzzer,
  disabled = false,
}) => {
  const lastBuzzRef = useRef<number>(0);

  const handlePress = (type: ReactionBuzzerType) => {
    const now = Date.now();
    // Anti-spam debounce of 250ms allows repeated hilarious buzzing without flooding
    if (disabled || now - lastBuzzRef.current < 250) return;
    lastBuzzRef.current = now;

    // Meme audio plays ONLY on the sender's phone!
    if (type === "bullshit") {
      audio.playBullshitBuzzer();
      haptics.trigger("heavy");
    } else if (type === "cap") {
      audio.playCapSound();
      haptics.trigger("medium");
    } else if (type === "not_moving") {
      audio.playNoMoveAnvil();
      haptics.trigger("lock");
    }

    onBuzzer(type);
  };

  return (
    <div className="w-full flex items-center justify-center gap-2.5 px-4 py-2 select-none">
      <button
        onClick={() => handlePress("bullshit")}
        disabled={disabled}
        className="flex-1 py-2.5 px-2 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(239,68,68,0.3)] active:scale-95 transition-all cursor-pointer"
      >
        <span>🚨</span>
        <span>BULLSHIT!</span>
      </button>

      <button
        onClick={() => handlePress("cap")}
        disabled={disabled}
        className="flex-1 py-2.5 px-2 rounded-xl bg-amber-950/80 border border-yellow-500/50 text-yellow-200 text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(245,158,11,0.3)] active:scale-95 transition-all cursor-pointer"
      >
        <span>🧢</span>
        <span>CAP!</span>
      </button>

      <button
        onClick={() => handlePress("not_moving")}
        disabled={disabled}
        className="flex-1 py-2.5 px-2 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-200 text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(168,85,247,0.3)] active:scale-95 transition-all cursor-pointer"
      >
        <span>🧱</span>
        <span>NO MOVE</span>
      </button>
    </div>
  );
};


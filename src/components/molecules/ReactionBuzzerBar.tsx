import React, { useState } from "react";
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
  const [buzzCount, setBuzzCount] = useState(0);

  const handlePress = (type: ReactionBuzzerType) => {
    if (disabled || buzzCount >= 4) return;
    setBuzzCount((prev) => prev + 1);

    if (type === "bullshit") {
      audio.play("buzzer_bullshit");
      haptics.trigger("heavy");
    } else if (type === "cap") {
      audio.play("buzzer_cap");
      haptics.trigger("medium");
    } else if (type === "not_moving") {
      audio.play("buzzer_anvil");
      haptics.trigger("lock");
    }

    onBuzzer(type);
  };

  return (
    <div className="w-full flex items-center justify-center gap-2.5 px-4 py-2 select-none">
      <button
        onClick={() => handlePress("bullshit")}
        disabled={disabled || buzzCount >= 4}
        className="flex-1 py-2.5 px-2 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(239,68,68,0.3)] active:scale-95 transition-all"
      >
        <span>🚨</span>
        <span>BULLSHIT!</span>
      </button>

      <button
        onClick={() => handlePress("cap")}
        disabled={disabled || buzzCount >= 4}
        className="flex-1 py-2.5 px-2 rounded-xl bg-amber-950/80 border border-yellow-500/50 text-yellow-200 text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(245,158,11,0.3)] active:scale-95 transition-all"
      >
        <span>🧢</span>
        <span>CAP!</span>
      </button>

      <button
        onClick={() => handlePress("not_moving")}
        disabled={disabled || buzzCount >= 4}
        className="flex-1 py-2.5 px-2 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-200 text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(168,85,247,0.3)] active:scale-95 transition-all"
      >
        <span>🧱</span>
        <span>NO MOVE</span>
      </button>
    </div>
  );
};

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { GamePhase } from "../../core/types/room.types";
import { RoundVoteResolution } from "../../core/types/vote.types";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";
import { CardFlipReveal } from "./CardFlipReveal";

interface MysteryBoxStageProps {
  phase: GamePhase;
  resolution?: RoundVoteResolution;
}

export const MysteryBoxStage: React.FC<MysteryBoxStageProps> = ({
  phase,
  resolution,
}) => {
  const isShake = phase === "reveal_beat_2";
  const isFlipped = [
    "reveal_beat_3",
    "reveal_beat_4",
    "reveal_beat_5",
    "reveal_beat_6",
    "consequence",
    "round_wrap",
  ].includes(phase);
  const showResult = [
    "reveal_beat_4",
    "reveal_beat_5",
    "reveal_beat_6",
    "consequence",
    "round_wrap",
  ].includes(phase);

  useEffect(() => {
    if (phase === "reveal_beat_2") {
      audio.play("reveal_bgm");
      haptics.trigger("heavy");
    } else if (phase === "reveal_beat_3") {
      haptics.trigger("chaos_moment");
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.4 },
          colors: ["#FF3B8A", "#FFD23F", "#00D2FF", "#C084FC"],
        });
      } catch {
        // Ignored
      }
    }
  }, [phase]);

  const winningId = resolution?.winningOptionId || "B";
  const winningLabel = resolution?.winningOptionLabel || "Go clubbing";
  const winningVotes = resolution?.voteTally[winningId]?.voteCount || 4;
  const totalVotes = resolution?.totalVotes || 6;

  const maxVoteCount = Math.max(
    ...Object.values(resolution?.voteTally || {}).map((t) => t.voteCount),
    0
  );
  const isDeadlockTie = Boolean(
    resolution?.isTie ||
      (maxVoteCount > 0 &&
        Object.values(resolution?.voteTally || {}).filter(
          (t) => t.voteCount === maxVoteCount
        ).length > 1)
  );

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-1">
      {/* 3D Card Flip Reveal */}
      <CardFlipReveal
        isFlipped={isFlipped}
        isShaking={isShake}
        winningOptionId={winningId}
        winningOptionLabel={winningLabel}
        isTie={isDeadlockTie}
      />

      {/* Pill Badge with Vote Count (Beat 4+) */}
      {showResult && (
        <div className="mt-2 px-4 py-1 rounded-full bg-[#180A2E]/90 border border-purple-500/50 text-xs font-display font-black text-white shadow-lg flex items-center gap-1.5">
          <span className="text-yellow-400 font-extrabold">{winningVotes}</span>
          <span className="text-gray-400"> / </span>
          <span>{totalVotes} votes</span>
          {isDeadlockTie && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-400/25 text-amber-300 text-[10px] font-black border border-amber-400/50 flex items-center gap-0.5">
              🪙 Coin Toss Winner
            </span>
          )}
        </div>
      )}
    </div>
  );
};

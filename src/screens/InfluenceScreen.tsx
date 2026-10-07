import React, { useState } from "react";
import { UserCheck, Sparkles, Shield, ArrowRight, Check } from "lucide-react";
import { PlayerSession } from "../core/types/player.types";
import { RoomSession } from "../core/types/room.types";
import { TopHeader } from "../components/molecules/TopHeader";
import { AvatarBadge } from "../components/atoms/AvatarBadge";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface InfluenceScreenProps {
  room: RoomSession;
  currentPlayer: PlayerSession;
  players: PlayerSession[];
  onSubmitInfluence: (targetPlayerId: string | null, reason?: string) => Promise<void>;
  onContinue: () => void;
  onLeave: () => void;
}

export const InfluenceScreen: React.FC<InfluenceScreenProps> = ({
  room,
  currentPlayer,
  players,
  onSubmitInfluence,
  onContinue,
  onLeave,
}) => {
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [isSelfConvinced, setIsSelfConvinced] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(currentPlayer.hasSubmittedInfluence);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if player actually changed their mind
  const hasChangedMind =
    currentPlayer.initialVoteOptionId &&
    currentPlayer.finalVoteOptionId &&
    currentPlayer.initialVoteOptionId !== currentPlayer.finalVoteOptionId;

  // Other players who could have persuaded this player
  const candidateInfluencers = players.filter((p) => p.id !== currentPlayer.id);

  const handleSelectInfluencer = (id: string) => {
    if (isSubmitted) return;
    audio.play("click");
    haptics.trigger("selection");
    setSelectedInfluencerId(id);
    setIsSelfConvinced(false);
  };

  const handleSelectSelf = () => {
    if (isSubmitted) return;
    audio.play("click");
    haptics.trigger("selection");
    setSelectedInfluencerId(null);
    setIsSelfConvinced(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    audio.play("lock");
    haptics.trigger("heavy");

    try {
      await onSubmitInfluence(isSelfConvinced ? null : selectedInfluencerId);
      setIsSubmitted(true);
    } catch (e) {
      console.error("Failed to submit influence:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between px-3.5 py-1.5 sm:py-2 bg-[#080210] select-none overflow-hidden">
      {/* Top Header */}
      <TopHeader
        currentRound={room.currentRoundIndex}
        totalRounds={room.totalRounds}
        onLeave={onLeave}
      />

      {/* Main Content */}
      <div className="flex-1 min-h-0 my-auto w-full max-w-sm mx-auto flex flex-col items-center text-center py-1 overflow-y-auto no-scrollbar">
        {hasChangedMind ? (
          <>
            {/* Mind Change Alert Banner */}
            <div className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/50 text-pink-300 font-display font-black text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>YOU CHANGED YOUR VOTE!</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight bg-gradient-to-r from-[#FF3B8A] via-[#FF7A70] to-[#FFD23F] bg-clip-text text-transparent">
              WHO GOT TO YOU?
            </h1>

            <p className="text-gray-300 text-[11px] mt-1 mb-3 max-w-xs leading-tight">
              During the discussion, who made the argument that persuaded you to switch?
            </p>

            {/* Voting Switch Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#180A2E]/90 border border-purple-500/40 mb-3 shadow-lg">
              <span className="text-gray-400 text-[11px] font-bold">Your Flip:</span>
              <span className="w-5 h-5 rounded-md bg-pink-600 text-white font-display font-black text-xs flex items-center justify-center">
                {currentPlayer.initialVoteOptionId}
              </span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span className="w-5 h-5 rounded-md bg-cyan-600 text-white font-display font-black text-xs flex items-center justify-center">
                {currentPlayer.finalVoteOptionId}
              </span>
            </div>

            {/* Candidate Influencers Grid (Symmetric 2x1 / 2x2 for 1-2 candidates) */}
            <div
              className={`grid ${
                candidateInfluencers.length <= 2 ? "grid-cols-2 max-w-[260px]" : "grid-cols-3"
              } gap-2 w-full mb-3 mx-auto`}
            >
              {candidateInfluencers.map((p) => {
                const isSelected = selectedInfluencerId === p.id;
                return (
                  <button
                    key={p.id}
                    disabled={isSubmitted}
                    onClick={() => handleSelectInfluencer(p.id)}
                    className={`
                      p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border cursor-pointer
                      ${
                        isSelected
                          ? "bg-purple-900/80 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.5)] scale-[1.03]"
                          : "bg-[#180C2E]/80 border-purple-800/40 hover:bg-[#20103C]"
                      }
                      ${isSubmitted ? "opacity-75 cursor-default" : "active:scale-95"}
                    `}
                  >
                    <AvatarBadge
                      name={p.name}
                      avatarKey={p.avatar}
                      size="sm"
                      showLabel={false}
                    />
                    <span className="font-display font-black text-xs text-white mt-1.5 text-center leading-tight break-words max-w-[100px]">
                      {p.name}
                    </span>
                    {isSelected && (
                      <span className="mt-1 text-[10px] text-pink-300 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Convinced me
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Option: Nobody / Self */}
            <button
              disabled={isSubmitted}
              onClick={handleSelectSelf}
              className={`
                w-full p-3 rounded-2xl flex items-center justify-between transition-all duration-200 border mb-4 cursor-pointer
                ${
                  isSelfConvinced
                    ? "bg-purple-900/80 border-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.4)]"
                    : "bg-[#180C2E]/80 border-purple-800/40 hover:bg-[#20103C]"
                }
                ${isSubmitted ? "opacity-75 cursor-default" : "active:scale-98"}
              `}
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 text-lg">
                  🧠
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs">Nobody / I changed my mind myself</h4>
                  <p className="text-gray-400 text-[10px]">No one persuaded me, I just had a realization.</p>
                </div>
              </div>
              {isSelfConvinced && <Check className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Action CTA */}
            {!isSubmitted ? (
              <button
                disabled={(!selectedInfluencerId && !isSelfConvinced) || isSubmitting}
                onClick={handleSubmit}
                className={`
                  w-full py-4 rounded-3xl font-display font-black text-base uppercase tracking-wider transition-all
                  ${
                    selectedInfluencerId || isSelfConvinced
                      ? "bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] text-white shadow-[0_8px_30px_rgba(255,0,56,0.6)] border-2 border-red-400/60 active:scale-98 cursor-pointer"
                      : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
                  }
                `}
              >
                {isSubmitting ? "LOCKING..." : "LOCK INFLUENCE"}
              </button>
            ) : (
              <div className="w-full flex flex-col gap-2">
                <div className="p-3 rounded-2xl bg-green-500/20 border border-green-400/50 text-green-300 text-xs font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Influence credit recorded!</span>
                </div>
                <button
                  onClick={onContinue}
                  className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#C026D3] via-[#A21CAF] to-[#701A75] text-white font-display font-black text-sm uppercase tracking-wider shadow-lg border-2 border-pink-400/50 active:scale-98 cursor-pointer"
                >
                  SEE CONSEQUENCES
                </button>
              </div>
            )}
          </>
        ) : (
          /* Case: Player did NOT change their mind (The Wall) */
          <>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-pink-600 p-0.5 flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.5)] mb-2">
              <div className="w-full h-full rounded-[14px] bg-[#1A0B2E] flex items-center justify-center">
                <span className="text-2xl sm:text-3xl filter drop-shadow">🧱</span>
              </div>
            </div>

            <div className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-display font-black text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span>💪 ZERO MIND FLIP</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight bg-gradient-to-r from-[#FF3B8A] via-[#FF7A70] to-[#FFD23F] bg-clip-text text-transparent">
              YOU HELD THE LINE!
            </h1>

            <p className="text-gray-300 text-[11px] mt-1 mb-3 max-w-xs leading-tight">
              You locked your initial answer{" "}
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-b from-[#00D2FF] to-[#0070FF] text-white font-display font-black text-xs mx-0.5 align-middle shadow">
                {currentPlayer.finalVoteOptionId}
              </span>{" "}
              and refused to budge despite all the debate!
            </p>

            <div className="w-full p-3 rounded-2xl bg-gradient-to-b from-[#2A103D]/95 via-[#180A2E]/95 to-[#10031C] border-2 border-purple-500/40 text-left mb-3 shadow-xl">
              <div className="flex items-center gap-1.5 text-[#FFD23F] text-[11px] font-bold mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Unshakeable Conviction ✨</span>
              </div>
              <p className="text-gray-300 text-[10px] leading-tight">
                Players who flipped their votes are currently confessing who persuaded them. Let's find out how the squad's decisions played out!
              </p>
            </div>

            <button
              onClick={onContinue}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#C026D3] via-[#A21CAF] to-[#701A75] text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_6px_24px_rgba(192,38,211,0.6)] border-2 border-pink-400/50 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>SEE CONSEQUENCES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

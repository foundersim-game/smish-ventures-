import React, { useState } from "react";
import { Lock, Info, Clock, Signal } from "lucide-react";
import { PlayerSession } from "../core/types/player.types";
import { RoomSession } from "../core/types/room.types";
import { ScenarioRound } from "../core/types/scenario.types";
import { OptionCard } from "../components/molecules/OptionCard";
import { PhaseStepper } from "../components/molecules/PhaseStepper";
import { TopHeader } from "../components/molecules/TopHeader";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface FinalVoteScreenProps {
  room: RoomSession;
  round: ScenarioRound;
  currentPlayer: PlayerSession;
  onLockFinalVote: (optionId: string) => void;
  onLeave: () => void;
}

export const FinalVoteScreen: React.FC<FinalVoteScreenProps> = ({
  room,
  round,
  currentPlayer,
  onLockFinalVote,
  onLeave,
}) => {
  const initialVoteId = currentPlayer.initialVoteOptionId || "B";
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    currentPlayer.finalVoteOptionId || initialVoteId
  );

  const isLocked = currentPlayer.hasLockedFinalVote;
  const initialOption =
    round.options.find((o) => o.id === initialVoteId) || round.options[1] || round.options[0];

  const handleSelect = (id: string) => {
    if (isLocked) return;
    setSelectedOptionId(id);
  };

  const handleLock = () => {
    if (isLocked) return;
    audio.play("lock");
    haptics.trigger("heavy");
    onLockFinalVote(selectedOptionId);
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between px-3.5 py-1.5 sm:py-2.5 bg-[#080210] select-none overflow-hidden">
      {/* Top Header (Screen 12) */}
      <TopHeader
        currentRound={room.currentRoundIndex}
        totalRounds={room.totalRounds}
        onLeave={onLeave}
      />

      {/* 4-Step Stepper (Step 3 Final Vote Active - Screen 12) */}
      <PhaseStepper currentPhase="final_vote" />

      {/* Scrollable Dilemma, Previous Vote & Options Content Container */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar w-full max-w-sm mx-auto py-1.5 space-y-2.5">
        {/* Scenario Dilemma Card (Screen 12) */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#2E0F3E]/95 via-[#1D0830]/95 to-[#120422] border-2 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-display font-black uppercase tracking-wider text-pink-400">
              {(round.category || "PARTY").toUpperCase().replace("_", " ")}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
              <Signal className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{round.difficulty ? round.difficulty.toUpperCase() : "NORMAL"}</span>
            </div>
          </div>

          <h2 className="font-display font-black text-base sm:text-lg md:text-xl text-white tracking-tight leading-snug">
            {round.prompt}
          </h2>

          {round.question && (
            <p className="text-gray-300 text-[11px] sm:text-xs mt-1.5 font-medium leading-relaxed">
              {round.question}
            </p>
          )}

          {/* Dynamic Squad Resource Balance */}
          {Boolean(
            typeof room.resourceState?.balance === "number" &&
            (round.highlightedText?.includes("$") ||
             round.highlightedText?.includes("₹") ||
             round.prompt.includes("$") ||
             round.prompt.includes("₹") ||
             round.question?.includes("$") ||
             round.question?.includes("₹") ||
             room.scenarioId === "night_out_01" ||
             room.scenarioId === "travel_chaos" ||
             room.scenarioId === "quick_chaos" ||
             room.scenarioId === "goa_weekend" ||
             room.scenarioId === "college_chaos" ||
             room.scenarioId === "wedding_chaos")
          ) && (
            <div className="mt-2 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-400/40 inline-flex items-center gap-1.5">
              <span className="text-gray-300 text-[10px] font-semibold">Squad Balance:</span>
              <span className="font-display font-black text-[#FFD23F] text-xs">
                ${room.resourceState.balance?.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* YOUR PREVIOUS VOTE Card (Screen 12) */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-[#180A2E]/95 border border-purple-600/40 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#0284C7] text-white flex items-center justify-center font-display font-black text-base shadow-sm flex-shrink-0">
              {initialOption?.id}
            </span>
            <div>
              <span className="text-[8.5px] uppercase font-black tracking-wider text-purple-300 block">
                YOUR PREVIOUS VOTE
              </span>
              <span className="text-white text-[11px] font-bold font-sans block">
                {initialOption?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[9.5px] text-pink-300 font-semibold bg-pink-950/50 px-2 py-1 rounded-lg border border-pink-500/40 flex-shrink-0">
            <Info className="w-3 h-3 text-pink-400" />
            <span>Can change vote</span>
          </div>
        </div>

        {/* 4 Option Cards (Screen 12) */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {round.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              subtitle={opt.subtitle}
              badgeColor={opt.badgeColor}
              isSelected={selectedOptionId === opt.id}
              onSelect={() => handleSelect(opt.id)}
              disabled={isLocked}
            />
          ))}
        </div>
      </div>

      {/* Pinned Bottom Action CTA Button */}
      <div className="flex-shrink-0 w-full max-w-sm mx-auto pt-1 pb-1 z-20">
        <button
          onClick={handleLock}
          disabled={isLocked}
          className={`
            w-full py-3.5 rounded-2xl font-display font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer
            ${
              isLocked
                ? "bg-[#1F0C2C] border border-purple-800 text-purple-300 shadow-none"
                : "bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] text-white shadow-[0_6px_24px_rgba(255,0,56,0.6)] border-2 border-red-400/60 active:scale-[0.98]"
            }
          `}
        >
          <Lock className="w-4 h-4 fill-white text-white" />
          <span>{isLocked ? "FINAL VOTE LOCKED" : "LOCK MY FINAL VOTE"}</span>
        </button>

        <p className="flex items-center justify-center gap-1 text-gray-400 text-[10px] text-center mt-1 font-medium">
          <Clock className="w-3 h-3 text-gray-500" />
          <span>Everyone must lock their vote to continue.</span>
        </p>
      </div>
    </div>
  );
};

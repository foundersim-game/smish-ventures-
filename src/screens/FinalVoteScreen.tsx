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
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 pt-5 pb-8 bg-[#080210] select-none overflow-y-auto overflow-x-hidden">
      {/* Top Header (Screen 12) */}
      <TopHeader
        currentRound={room.currentRoundIndex}
        totalRounds={room.totalRounds}
        onLeave={onLeave}
      />

      {/* 4-Step Stepper (Step 3 Final Vote Active - Screen 12) */}
      <PhaseStepper currentPhase="final_vote" />

      {/* Scenario Dilemma Card (Screen 12) */}
      <div className="mt-2 w-full max-w-sm mx-auto">
        <div className="p-4 rounded-3xl bg-gradient-to-b from-[#2E0F3E]/95 via-[#1D0830]/95 to-[#120422] border-2 border-pink-500/50 shadow-[0_0_24px_rgba(236,72,153,0.35)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-pink-400">
              {(round.category || "PARTY").toUpperCase().replace("_", " ")}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
              <Signal className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{round.difficulty ? round.difficulty.toUpperCase() : "NORMAL"}</span>
            </div>
          </div>

          <h2 className="font-display font-black text-2xl text-white tracking-tight leading-tight">
            {round.prompt}
          </h2>

          {round.question && (
            <p className="text-gray-300 text-xs mt-2 font-medium">
              {round.question}
            </p>
          )}

          {/* Dynamic Squad Resource Balance (Only for rounds/scenarios tracking money) */}
          {Boolean(
            typeof room.resourceState?.balance === "number" &&
            (round.highlightedText?.includes("₹") ||
             round.prompt.includes("₹") ||
             round.question?.includes("₹") ||
             room.scenarioId === "night_out_01" ||
             room.scenarioId === "travel_chaos" ||
             room.scenarioId === "goa_weekend")
          ) && (
            <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-black/40 border border-amber-400/40 inline-flex items-center gap-2">
              <span className="text-gray-300 text-xs font-semibold">Squad Balance:</span>
              <span className="font-display font-black text-[#FFD23F] text-sm">
                ₹{room.resourceState.balance?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Center Form (Screen 12) */}
      <div className="flex flex-col gap-2.5 my-auto w-full max-w-sm mx-auto py-2">
        {/* YOUR PREVIOUS VOTE Card (Screen 12) */}
        <div className="p-3 rounded-2xl bg-[#180A2E]/95 border border-purple-600/40 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D2FF] to-[#0284C7] text-white flex items-center justify-center font-display font-black text-lg shadow-sm">
              {initialOption?.id}
            </span>
            <div>
              <span className="text-[9px] uppercase font-black tracking-wider text-purple-300 block">
                YOUR PREVIOUS VOTE
              </span>
              <span className="text-white text-xs font-bold font-sans">
                {initialOption?.label}
              </span>
              <p className="text-gray-400 text-[10px] leading-tight">
                {initialOption?.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-pink-300 font-semibold bg-pink-950/50 px-2.5 py-1.5 rounded-xl border border-pink-500/40 flex-shrink-0">
            <Info className="w-3 h-3 text-pink-400" />
            <span>You can change your vote.</span>
          </div>
        </div>

        {/* 4 Option Cards (Screen 12) */}
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

        {/* Action Button (Screen 12) */}
        <div className="w-full mt-2">
          <button
            onClick={handleLock}
            disabled={isLocked}
            className={`
              w-full py-4 rounded-3xl font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer
              ${
                isLocked
                  ? "bg-[#1F0C2C] border border-purple-800 text-purple-300 shadow-none"
                  : "bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] text-white shadow-[0_8px_30px_rgba(255,0,56,0.6)] border-2 border-red-400/60 active:scale-[0.98]"
              }
            `}
          >
            <Lock className="w-5 h-5 fill-white text-white" />
            <span>{isLocked ? "FINAL VOTE LOCKED" : "LOCK MY FINAL VOTE"}</span>
          </button>

          <p className="flex items-center justify-center gap-1.5 text-gray-400 text-xs text-center mt-2.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Everyone must lock their vote to continue.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

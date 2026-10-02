import React, { useState } from "react";
import { Lock, Signal } from "lucide-react";
import { PlayerSession } from "../core/types/player.types";
import { RoomSession } from "../core/types/room.types";
import { ScenarioRound } from "../core/types/scenario.types";
import { AvatarBadge } from "../components/atoms/AvatarBadge";
import { OptionCard } from "../components/molecules/OptionCard";
import { PhaseStepper } from "../components/molecules/PhaseStepper";
import { TopHeader } from "../components/molecules/TopHeader";
import { SecretMissionCard } from "../components/molecules/SecretMissionCard";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface InitialVoteScreenProps {
  room: RoomSession;
  round: ScenarioRound;
  players: PlayerSession[];
  currentPlayer: PlayerSession;
  onLockVote: (optionId: string) => void;
  onLeave: () => void;
}

export const InitialVoteScreen: React.FC<InitialVoteScreenProps> = ({
  room,
  round,
  players,
  currentPlayer,
  onLockVote,
  onLeave,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    currentPlayer.initialVoteOptionId
  );

  const isLocked = currentPlayer.hasLockedInitialVote;
  const lockedCount = players.filter((p) => p.hasLockedInitialVote).length;
  const totalCount = players.length;

  const handleSelect = (id: string) => {
    if (isLocked) return;
    setSelectedOptionId(id);
  };

  const handleLock = () => {
    if (!selectedOptionId || isLocked) return;
    audio.play("lock");
    haptics.trigger("heavy");
    onLockVote(selectedOptionId);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 pt-5 pb-8 bg-[#080210] select-none overflow-y-auto overflow-x-hidden">
      {/* Top Header (Screen 8 & 10) */}
      <TopHeader
        currentRound={room.currentRoundIndex}
        totalRounds={room.totalRounds}
        onLeave={onLeave}
      />

      {/* 4-Step Stepper (Step 1 Active - Screen 8 & 10) */}
      <PhaseStepper currentPhase="initial_vote" />

      {/* Scenario Dilemma Card (Screens 8, 9, 10) */}
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

          {/* Asymmetric Secret Mission (GDD Section 8 & Secret Missions) */}
          {currentPlayer.secretMission && (
            <SecretMissionCard mission={currentPlayer.secretMission} />
          )}

          {/* Secret Intel Rule (GDD Section 8) */}
          {round.secretIntelRule && !currentPlayer.secretMission && (
            <div className="mt-3 p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex items-start gap-2 text-left">
              <span className="text-base flex-shrink-0">🕵️</span>
              <div>
                <span className="text-amber-300 font-display font-black text-[10px] uppercase tracking-wider block">
                  CONFIDENTIAL INTEL (YOU ONLY)
                </span>
                <p className="text-white text-xs font-medium leading-snug">
                  {round.secretIntelRule.intelMessage}
                </p>
                {round.secretIntelRule.secretGoal && (
                  <p className="text-amber-200 text-[11px] font-bold mt-1">
                    Secret Goal: {round.secretIntelRule.secretGoal}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW A: UNLOCKED STATE - 4 OPTIONS (Screens 8 & 9) */}
      {!isLocked && (
        <div className="flex flex-col gap-2.5 my-auto w-full max-w-sm mx-auto py-3">
          {round.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              subtitle={opt.subtitle}
              badgeColor={opt.badgeColor}
              isSelected={selectedOptionId === opt.id}
              onSelect={() => handleSelect(opt.id)}
            />
          ))}

          {/* Privacy Pill (Screen 8 & 9) */}
          <div className="p-2.5 rounded-2xl bg-[#180A2E]/80 border border-purple-500/30 flex items-center justify-center gap-2 text-center mt-1">
            <Lock className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-[11px] text-gray-300 font-medium">
              Your choice is secret. No one will see your answer (yet).
            </span>
          </div>

          {/* Bottom Action CTA Button (Screen 8 & 9) */}
          <div className="w-full mt-2">
            {selectedOptionId ? (
              <button
                onClick={handleLock}
                className="w-full py-4 rounded-3xl bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] text-white font-display font-black text-base uppercase tracking-wider shadow-[0_8px_30px_rgba(255,0,56,0.6)] border-2 border-red-400/60 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Lock className="w-5 h-5 fill-white text-white" />
                <span>LOCK MY ANSWER</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4 rounded-3xl bg-[#1C0E33] border border-purple-900/40 text-gray-500 font-display font-black text-xs uppercase tracking-wider cursor-not-allowed"
              >
                SELECT AN OPTION TO CONTINUE
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW B: ANSWER LOCKED WAITING STATE (Screen 10) */}
      {isLocked && (
        <div className="flex flex-col items-center justify-center my-auto w-full max-w-sm mx-auto text-center py-4">
          {/* Glowing Radiant Padlock with Soundwave Rays (Screen 10) */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Outer pink soundwave rays */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-80">
              <div className="w-4 h-0.5 bg-pink-400 rounded-full transform -rotate-12" />
              <div className="w-5 h-0.5 bg-pink-400 rounded-full" />
              <div className="w-4 h-0.5 bg-pink-400 rounded-full transform rotate-12" />
            </div>
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-80">
              <div className="w-4 h-0.5 bg-pink-400 rounded-full transform rotate-12" />
              <div className="w-5 h-0.5 bg-pink-400 rounded-full" />
              <div className="w-4 h-0.5 bg-pink-400 rounded-full transform -rotate-12" />
            </div>

            {/* Glowing Padlock Circle */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#9333EA] to-[#EC4899] p-1 flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.85)] animate-pulse">
              <div className="w-full h-full rounded-full bg-[#18082E] flex items-center justify-center">
                <Lock className="w-12 h-12 text-[#FF3B8A] stroke-[2.5]" />
              </div>
            </div>
          </div>

          <h2 className="font-display font-black text-3xl text-white tracking-tight leading-none mt-2">
            ANSWER <span className="text-[#FF3B8A]">LOCKED!</span>
          </h2>
          <p className="text-gray-300 text-xs mt-1.5 mb-5">
            Waiting for everyone to lock their answer...
          </p>

          {/* Locked Players Row Card (Screen 10) */}
          <div className="w-full p-4 rounded-3xl bg-[#180A2E]/95 border-2 border-purple-500/40 shadow-xl mb-4">
            <div className="grid grid-cols-6 gap-1 items-center justify-center">
              {players.map((p) => (
                <AvatarBadge
                  key={p.id}
                  name={p.name}
                  avatarKey={p.avatar}
                  isHost={p.isHost}
                  isReady={p.hasLockedInitialVote}
                  isThinking={!p.hasLockedInitialVote}
                  isYou={p.id === currentPlayer.id}
                  size="sm"
                  showLabel={true}
                />
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-purple-900/60 text-xs font-bold text-gray-300">
              <span className="text-[#FFD23F] text-base font-display font-black">
                {lockedCount}
              </span>{" "}
              of {totalCount} locked
            </div>
          </div>

          {/* Privacy Card (Screen 10) */}
          <div className="p-3.5 rounded-2xl bg-purple-950/70 border border-purple-800/40 flex items-center gap-3 text-left w-full">
            <div className="w-9 h-9 rounded-xl bg-purple-900/80 flex items-center justify-center text-purple-300 flex-shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">Your answer is secret</h5>
              <p className="text-gray-300 text-[11px] leading-snug">
                No one will see your choice until the discussion ends.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

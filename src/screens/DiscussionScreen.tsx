import React, { useEffect, useState } from "react";
import { Users, Eye, Plus, SkipForward } from "lucide-react";
import { RoomSession } from "../core/types/room.types";
import { SecretMission } from "../core/types/mission.types";
import { PhaseStepper } from "../components/molecules/PhaseStepper";
import { RadialCountdown } from "../components/molecules/RadialCountdown";
import { TopHeader } from "../components/molecules/TopHeader";
import { ReactionBuzzerBar } from "../components/molecules/ReactionBuzzerBar";
import { TableEmojiBar } from "../components/molecules/TableEmojiBar";
import { SecretMissionCard } from "../components/molecules/SecretMissionCard";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";
import { ReactionBuzzerType } from "../core/types/events.types";

import { ChaosModifier } from "../core/types/chaos-events.types";

interface DiscussionScreenProps {
  room: RoomSession;
  currentPlayerId: string;
  isHost?: boolean;
  activeModifier?: ChaosModifier | null;
  secretMission?: SecretMission | null;
  onTimeUp: () => void;
  onExtendDiscussion?: () => void;
  onSkipDiscussion?: () => void;
  onBuzzer?: (type: ReactionBuzzerType) => void;
  onSendEmoji?: (emoji: string) => void;
  onLeave: () => void;
}

export const DiscussionScreen: React.FC<DiscussionScreenProps> = ({
  room,
  currentPlayerId,
  isHost = false,
  activeModifier,
  secretMission,
  onTimeUp,
  onExtendDiscussion,
  onSkipDiscussion,
  onBuzzer,
  onSendEmoji,
  onLeave,
}) => {
  const [showMission, setShowMission] = useState(false);

  useEffect(() => {
    audio.play("phones_down");
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 pt-5 pb-6 bg-[#080210] select-none overflow-y-auto overflow-x-hidden">
      {/* Top Header */}
      <TopHeader
        currentRound={room.currentRoundIndex}
        totalRounds={room.totalRounds}
        onLeave={onLeave}
      />

      {/* 4-Step Stepper (Step 2 Discussion Active) */}
      <PhaseStepper currentPhase="discussion" />

      {/* Active Chaos Modifier Banner (In-Flow, Never Overlapping Navigation Header) */}
      {activeModifier && (
        <div className="w-full max-w-sm mx-auto my-1.5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/90 via-black/90 to-amber-950/90 border border-yellow-400/60 shadow-[0_0_18px_rgba(250,204,21,0.25)] text-white backdrop-blur-sm animate-fade-in text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeModifier.icon}</span>
              <div>
                <span className="text-[9px] font-black uppercase text-yellow-300 tracking-wider block">
                  CHAOS MODIFIER: {activeModifier.tagline}
                </span>
                <span className="font-display font-black text-sm text-white">
                  {activeModifier.title}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-extrabold text-yellow-400 px-2 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40">
              RULE IN PLAY
            </span>
          </div>
          <p className="text-gray-200 text-xs mt-1.5 pl-7 font-medium leading-snug">
            👉 {activeModifier.description}
          </p>
        </div>
      )}

      {/* Center Theatrical Section */}
      <div className="flex flex-col items-center text-center my-auto w-full max-w-sm mx-auto py-1">
        {/* Pink Gradient Megaphone with Sound Waves (Screen 11) */}
        <div className="relative mb-2 flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9333EA] to-[#EC4899] p-2 flex items-center justify-center shadow-[0_0_24px_rgba(236,72,153,0.6)]">
            <svg
              className="w-7 h-7 transform -rotate-12 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2.5-1.23l-5 4H2c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h4.5l5 4c.67.54 1.5.06 1.5-.8V2.8c0-.86-.83-1.34-1.5-.8z" />
            </svg>
          </div>
        </div>

        {/* Massive Headline (Screen 11) */}
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight leading-none">
          PHONES DOWN.
        </h1>
        <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight leading-none bg-gradient-to-r from-[#FF3B8A] via-[#FF7A70] to-[#FFD23F] bg-clip-text text-transparent mt-1">
          DISCUSS & CONVINCE.
        </h1>

        <p className="text-gray-300 text-xs mt-2 font-medium leading-relaxed">
          Argue your stance. Flip their minds.
        </p>

        {/* Giant Glowing Circular Countdown Ring (Screen 11) */}
        <div className="my-3">
          <RadialCountdown
            startTimestamp={room.phaseStartTimestamp}
            totalDurationSeconds={room.phaseDurationSeconds || 60}
            onTimeUp={onTimeUp}
          />
        </div>

        {/* Host Timer Controls (+30s / Skip) */}
        {isHost && (
          <div className="flex items-center gap-2 mb-2">
            {onExtendDiscussion && (
              <button
                onClick={() => {
                  audio.play("click");
                  haptics.trigger("medium");
                  onExtendDiscussion();
                }}
                className="px-2.5 py-1 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-200 text-[11px] font-bold flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>+30s Debate</span>
              </button>
            )}
            {onSkipDiscussion && (
              <button
                onClick={() => {
                  audio.play("click");
                  onSkipDiscussion();
                }}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-gray-300 text-[11px] font-bold flex items-center gap-1 active:scale-95"
              >
                <SkipForward className="w-3 h-3" />
                <span>Vote Now</span>
              </button>
            )}
          </div>
        )}

        {/* Secret Mission Peek Toggle during discussion */}
        {secretMission && (
          <div className="w-full my-1">
            {showMission ? (
              <div className="relative">
                <SecretMissionCard mission={secretMission} />
                <button
                  onClick={() => setShowMission(false)}
                  className="mt-1 text-[11px] text-amber-300 font-bold underline"
                >
                  Hide Secret Card
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  audio.play("click");
                  setShowMission(true);
                }}
                className="py-1.5 px-3 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 mx-auto active:scale-95 shadow"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Peek Secret Mission</span>
              </button>
            )}
          </div>
        )}

        {/* Interactive Reaction Buzzer Bar */}
        {onBuzzer && (
          <div className="w-full mt-1">
            <ReactionBuzzerBar onBuzzer={onBuzzer} />
          </div>
        )}

        {/* Interactive Floating Emoji Reaction Bar */}
        {onSendEmoji && (
          <div className="w-full my-1">
            <TableEmojiBar onSendEmoji={onSendEmoji} />
          </div>
        )}
      </div>

      {/* Bottom Locked Answers Card */}
      <div className="w-full max-w-sm mx-auto p-3.5 rounded-2xl bg-[#180A2E]/95 border-2 border-purple-500/40 shadow-[0_0_24px_rgba(168,85,247,0.3)] flex items-center gap-3 text-left mt-2 mb-3">
        <div className="text-purple-300 flex-shrink-0">
          <Users className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="w-[1px] h-7 bg-purple-700/50 flex-shrink-0" />
        <div>
          <h4 className="font-sans font-bold text-xs text-[#D8B4FE] tracking-tight">
            Everyone has locked their initial votes.
          </h4>
          <p className="text-gray-300 text-[11px] mt-0.5 font-normal">
            Listen closely to who tries to sway your vote.
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { AlertTriangle, TrendingDown, Zap, ChevronRight, Coins } from "lucide-react";
import { RoomSession } from "../core/types/room.types";
import { ScenarioRound } from "../core/types/scenario.types";
import { TopHeader } from "../components/molecules/TopHeader";
import { AdBannerSlot } from "../components/molecules/AdBannerSlot";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface ConsequenceScreenProps {
  room: RoomSession;
  round: ScenarioRound;
  winningOptionId: string;
  liveConsequence?: {
    consequence: { title: string; narrative: string; resourceDelta?: Record<string, number>; isAbsurd?: boolean; triggerChaosMoment?: boolean };
    updatedResourceState: Record<string, number>;
    isChaosMoment: boolean;
    chaosMomentMessage: string | null;
  } | null;
  onProceedToBlame: () => void;
  onNextRound: () => void;
  onLeave: () => void;
  onRemoveAdsClick?: () => void;
}

export const ConsequenceScreen: React.FC<ConsequenceScreenProps> = ({
  room,
  round,
  winningOptionId,
  liveConsequence,
  onProceedToBlame,
  onNextRound,
  onLeave,
  onRemoveAdsClick,
}) => {
  // Prefer live consequence data from backend (CONSEQUENCE_RESOLVED event),
  // fall back to static scenario data
  const consequence = liveConsequence?.consequence ?? round.consequences[winningOptionId] ?? {
    title: "CONSEQUENCE",
    narrative: "The group made their choice. Now deal with the CHAOS.",
  };
  const isAbsurd = liveConsequence?.isChaosMoment ?? (consequence.isAbsurd || consequence.triggerChaosMoment);
  // Read chaosMomentMessage only from liveConsequence (it's not in the static consequence type used for fallback)
  const chaosMomentMessage = liveConsequence?.chaosMomentMessage ?? null;

  // Determine if cash balance is being tracked in this mode
  const isCouplesMode = room.mode === "couples" || round.category === "couples";
  const hasCashBalance = !isCouplesMode && typeof room.resourceState.balance === "number";

  // Cash balance calculations for squad mode
  const currentRoomBalance = room.resourceState.balance ?? 30000;
  const targetBalance = liveConsequence?.updatedResourceState?.balance ?? currentRoomBalance;
  const balanceDelta = hasCashBalance
    ? (consequence.resourceDelta?.balance ?? (targetBalance - currentRoomBalance))
    : 0;
  const isNegative = balanceDelta < 0;

  // Relationship dynamics meters for couples mode
  const sanityDelta = consequence.resourceDelta?.sanity ?? 0;
  const chaosDelta = consequence.resourceDelta?.chaosScore ?? 0;

  const [displayedBalance, setDisplayedBalance] = useState(targetBalance);

  useEffect(() => {
    // Sound & haptic triggers (smooth, luxurious, zero harshness)
    if (isAbsurd) {
      audio.playCinematicDrop(0.4);
      haptics.trigger("chaos_moment");
    } else if (isNegative || sanityDelta < 0) {
      audio.play("time_up", 0.35);
      haptics.trigger("heavy");
    } else {
      audio.play("correct", 0.5);
      haptics.trigger("selection");
    }

    if (hasCashBalance) {
      const timer = setTimeout(() => {
        setDisplayedBalance(targetBalance);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between px-3.5 py-1.5 sm:py-2 bg-[#080210] select-none overflow-hidden">
      {/* Top Header */}
      <TopHeader
        currentRound={room.currentRoundIndex}
        totalRounds={room.totalRounds}
        onLeave={onLeave}
      />

      <div className="my-auto w-full max-w-sm mx-auto flex flex-col items-center text-center py-1">
        {/* Chaos Moment Flashing Banner */}
        {isAbsurd && (
          <div className="w-full mb-2 p-2 rounded-xl bg-gradient-to-r from-red-600/40 via-amber-500/40 to-pink-600/40 border-2 border-red-500/80 animate-pulse flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="font-display font-black text-[11px] uppercase tracking-widest text-yellow-300">
              {chaosMomentMessage || "CHAOS MOMENT ACTIVATED!"}
            </span>
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          </div>
        )}

        {/* Outcome Header Badge */}
        <div className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/50 text-[10px] font-display font-extrabold uppercase tracking-widest text-purple-300 mb-1">
          THE CONSEQUENCE
        </div>

        {/* Consequence Title */}
        <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight bg-gradient-to-r from-[#FF3B8A] via-[#FF7A70] to-[#FFD23F] bg-clip-text text-transparent">
          {consequence.title}
        </h1>

        {/* Narrative Card */}
        <div className="w-full mt-2.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#2A103D]/95 via-[#190728]/95 to-[#10031C] border-2 border-pink-500/50 shadow-[0_0_24px_rgba(236,72,153,0.3)] text-left">
          <p className="text-white text-xs sm:text-sm font-medium leading-relaxed">
            {consequence.narrative}
          </p>

          {/* Couple Relationship Dynamics Meters */}
          {isCouplesMode && (sanityDelta !== 0 || chaosDelta !== 0) && (
            <div className="mt-2.5 pt-2 border-t border-purple-800/60 flex flex-col gap-1.5">
              {sanityDelta !== 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">❤️</span>
                    <span className="text-gray-300 text-[11px] font-bold">Relationship Harmony:</span>
                  </div>
                  <span
                    className={`font-display font-black text-[11px] px-2 py-0.5 rounded-lg ${
                      sanityDelta >= 0
                        ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-300"
                        : "bg-red-500/20 border border-red-400/50 text-red-300"
                    }`}
                  >
                    {sanityDelta >= 0 ? "+" : ""}{sanityDelta}%
                  </span>
                </div>
              )}

              {chaosDelta !== 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🔥</span>
                    <span className="text-gray-300 text-[11px] font-bold">Chaos Meter:</span>
                  </div>
                  <span
                    className={`font-display font-black text-[11px] px-2 py-0.5 rounded-lg ${
                      chaosDelta > 0
                        ? "bg-orange-500/20 border border-orange-400/50 text-orange-300"
                        : "bg-blue-500/20 border border-blue-400/50 text-blue-300"
                    }`}
                  >
                    {chaosDelta > 0 ? `+${chaosDelta}% Spicier` : `${chaosDelta}% Chill`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Party Squad Cash Balance Meter */}
          {hasCashBalance && balanceDelta !== 0 && (
            <div className="mt-2.5 pt-2 border-t border-purple-800/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-gray-300 text-[11px] font-bold">Budget Impact:</span>
              </div>
              <span
                className={`font-display font-black text-xs px-2 py-0.5 rounded-lg ${
                  isNegative
                    ? "bg-red-500/20 border border-red-400/50 text-red-300"
                    : "bg-green-500/20 border border-green-400/50 text-green-300"
                }`}
              >
                {isNegative ? "" : "+"}${balanceDelta.toLocaleString()}
              </span>
            </div>
          )}

          {/* Remaining Balance Tracker (Party Mode Only) */}
          {hasCashBalance && (
            <div className="mt-2 p-2 rounded-xl bg-black/50 border border-amber-400/40 flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-300">Remaining Balance:</span>
              <span className="font-display font-black text-base text-[#FFD23F] transition-all duration-500">
                ${displayedBalance.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-2 mt-1">
        <button
          onClick={onProceedToBlame}
          className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_6px_24px_rgba(255,0,56,0.6)] border-2 border-red-400/60 flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 fill-white text-white" />
          <span>WHO CAUSED THIS? (BLAME)</span>
        </button>

        <button
          onClick={onNextRound}
          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-gray-300 text-[11px] font-bold flex items-center justify-center gap-1 active:scale-98 transition-all"
        >
          <span>Skip to Next Round</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Non-intrusive Ad Banner Slot */}
        <AdBannerSlot
          isAdEligible={!room.isPaidSession}
          onRemoveAdsClick={onRemoveAdsClick}
        />
      </div>
    </div>
  );
};

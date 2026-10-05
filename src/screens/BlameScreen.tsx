import React, { useState } from "react";
import { AlertCircle, FileText, Check, Target, Flame, Users, ChevronRight } from "lucide-react";
import { PlayerSession } from "../core/types/player.types";
import { RoomSession } from "../core/types/room.types";
import { RoundReceiptsSummary } from "../core/types/influence.types";
import { TopHeader } from "../components/molecules/TopHeader";
import { AvatarBadge } from "../components/atoms/AvatarBadge";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface BlameScreenProps {
  room: RoomSession;
  currentPlayer: PlayerSession;
  players: PlayerSession[];
  receipts: RoundReceiptsSummary | null;
  missionResults?: import('../core/types/mission.types').MissionEvaluationResult[];
  onSubmitBlame: (blamedPlayerId: string) => Promise<void>;
  onCompileReceipts: () => Promise<RoundReceiptsSummary>;
  onNextRound: () => void;
  onLeave: () => void;
}

export const BlameScreen: React.FC<BlameScreenProps> = ({
  room,
  currentPlayer,
  players,
  receipts: initialReceipts,
  missionResults = [],
  onSubmitBlame,
  onCompileReceipts,
  onNextRound,
  onLeave,
}) => {
  const [selectedBlamedId, setSelectedBlamedId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(currentPlayer.hasSubmittedBlame);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipts, setReceipts] = useState<RoundReceiptsSummary | null>(initialReceipts);
  const [showReceipts, setShowReceipts] = useState(Boolean(initialReceipts));

  const handleSelectBlame = (id: string) => {
    if (hasSubmitted) return;
    audio.play("click");
    haptics.trigger("selection");
    setSelectedBlamedId(id);
  };

  const handleLockBlame = async () => {
    if (!selectedBlamedId || isSubmitting) return;
    setIsSubmitting(true);
    audio.play("lock");
    haptics.trigger("heavy");

    try {
      await onSubmitBlame(selectedBlamedId);
      setHasSubmitted(true);

      // Automatically fetch compiled receipts after squad blames
      setTimeout(async () => {
        try {
          const compiled = await onCompileReceipts();
          setReceipts(compiled);
          setShowReceipts(true);
          audio.play("fanfare");
          haptics.trigger("chaos_moment");
        } catch (e) {
          console.error("Failed to compile receipts:", e);
        }
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-[100dvh] w-full flex flex-col justify-between px-4 pt-5 pb-12 bg-[#080210] select-none overflow-y-auto overflow-x-hidden"
      style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom, 28px))" }}
    >
      {/* Top Header */}
      <TopHeader
        currentRound={room.currentRoundIndex}
        totalRounds={room.totalRounds}
        onLeave={onLeave}
      />

      <div className="my-auto w-full max-w-sm mx-auto flex flex-col items-center text-center py-2">
        {!showReceipts ? (
          /* ============================================================== */
          /* STAGE 1: ACCUSATION VOTE ("WHO CAUSED THIS?") */
          /* ============================================================== */
          <>
            <div className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 font-display font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span>TIME FOR RECKONING</span>
            </div>

            <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight bg-gradient-to-r from-[#FF0038] via-[#FF3B8A] to-[#FFD23F] bg-clip-text text-transparent">
              WHO CAUSED THIS?
            </h1>

            <p className="text-gray-300 text-xs mt-1.5 mb-5 max-w-xs leading-relaxed">
              Whose fault was this outcome? Point the finger at the person most responsible.
            </p>

            {/* Players Grid for Blame (Symmetric 2x2 for <=4 players, 3x2 for 5-6) */}
            <div
              className={`grid ${
                players.length <= 4 ? "grid-cols-2 max-w-[280px]" : "grid-cols-3"
              } gap-2.5 w-full mb-5 mx-auto`}
            >
              {players.map((p) => {
                const isSelected = selectedBlamedId === p.id;
                const isYou = p.id === currentPlayer.id;

                return (
                  <button
                    key={p.id}
                    disabled={hasSubmitted}
                    onClick={() => handleSelectBlame(p.id)}
                    className={`
                      p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border cursor-pointer
                      ${
                        isSelected
                          ? "bg-red-950/80 border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.6)] scale-[1.03]"
                          : "bg-[#180C2E]/80 border-purple-800/40 hover:bg-[#20103C]"
                      }
                      ${hasSubmitted ? "opacity-75 cursor-default" : "active:scale-95"}
                    `}
                  >
                    <AvatarBadge
                      name={p.name}
                      avatarKey={p.avatar}
                      isYou={isYou}
                      size="sm"
                      showLabel={false}
                    />
                    <span className="font-display font-black text-xs text-white mt-1.5 text-center leading-tight break-words max-w-[110px]">
                      {p.name} {isYou ? "(You)" : ""}
                    </span>
                    {isSelected && (
                      <span className="mt-1 text-[10px] text-red-300 font-bold flex items-center gap-0.5">
                        <Target className="w-3 h-3 text-red-400" /> Blamed
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* CTA Button */}
            {!hasSubmitted ? (
              <button
                disabled={!selectedBlamedId || isSubmitting}
                onClick={handleLockBlame}
                className={`
                  w-full py-4 rounded-3xl font-display font-black text-base uppercase tracking-wider transition-all
                  ${
                    selectedBlamedId
                      ? "bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] text-white shadow-[0_8px_30px_rgba(255,0,56,0.6)] border-2 border-red-400/60 active:scale-98 cursor-pointer"
                      : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
                  }
                `}
              >
                {isSubmitting ? "CASTING BLAME..." : "LOCK IN BLAME"}
              </button>
            ) : (
              <div className="w-full p-4 rounded-2xl bg-[#1B0F2E] border border-purple-500/40 text-center animate-pulse">
                <span className="text-pink-300 font-bold text-xs uppercase tracking-wider block">
                  ACCUSATION RECORDED!
                </span>
                <p className="text-gray-400 text-[11px] mt-1">
                  Compiling the receipts across all players...
                </p>
              </div>
            )}
          </>
        ) : (
          /* ============================================================== */
          /* STAGE 2: THE RECEIPTS ("RECEIPTS DON'T LIE!") */
          /* ============================================================== */
          <>
            <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-display font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>THE RECEIPTS DON'T LIE</span>
            </div>

            <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight bg-gradient-to-r from-[#FFD23F] via-[#FF7A70] to-[#FF3B8A] bg-clip-text text-transparent">
              WHO TOOK THE BLAME?
            </h1>

            {/* Most Blamed Spotlight Card */}
            <div className="w-full mt-3 p-4 rounded-3xl bg-gradient-to-b from-[#380E28]/95 via-[#1D0820]/95 to-[#120418] border-2 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.4)] text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-red-400 fill-red-400" />
                <span className="text-xs font-display font-black uppercase tracking-wider text-red-300">
                  MOST BLAMED BY THE GROUP
                </span>
              </div>

              <h2 className="font-display font-black text-2xl text-white">
                {receipts?.mostBlamedPlayerName || "Squad"}
              </h2>

              <p className="text-red-200 text-xs mt-1 font-medium">
                Received the majority of accusations for this outcome!
              </p>

              {/* Cross-Referencing Influence Data */}
              <div className="mt-3 p-3 rounded-2xl bg-black/50 border border-purple-500/30 text-left">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold mb-1">
                  <Users className="w-4 h-4" />
                  <span>Influence Reality Check:</span>
                </div>
                <p className="text-gray-300 text-[11px] leading-snug">
                  {receipts?.mostInfluentialPlayerName
                    ? `${receipts.mostInfluentialPlayerName} persuaded the most people during discussion!`
                    : "Multiple players moved votes during the discussion."}
                </p>
              </div>
            </div>

            {/* Receipts Breakdown List (Shows ALL players, deduplicated) */}
            <div className="w-full mt-3 flex flex-col gap-2">
              {(() => {
                const seenIds = new Set<string>();
                const seenNames = new Set<string>();
                const uniqueReceipts = (receipts?.receipts || []).filter((r) => {
                  const lower = r.playerName.trim().toLowerCase();
                  if (seenIds.has(r.playerId) || seenNames.has(lower)) return false;
                  seenIds.add(r.playerId);
                  seenNames.add(lower);
                  return true;
                });

                return uniqueReceipts.map((r) => {
                  const player = players.find((p) => p.id === r.playerId);
                  const isYou = r.playerId === currentPlayer.id;

                  return (
                    <div
                      key={r.playerId}
                      className="p-2.5 rounded-2xl bg-[#180A2E]/90 border border-purple-800/50 flex items-center justify-between text-left shadow"
                    >
                      <div className="flex items-center gap-2">
                        <AvatarBadge
                          name={r.playerName}
                          avatarKey={player?.avatar}
                          isYou={isYou}
                          size="sm"
                          showLabel={false}
                        />
                        <span className="font-display font-black text-xs text-white">
                          {r.playerName} {isYou ? "(You)" : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-red-300 font-bold">
                          {r.blameVotesReceived} {r.blameVotesReceived === 1 ? "blame" : "blames"}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-cyan-300 font-bold">
                          Influenced {r.peopleInfluencedCount}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Secret Mission Outcomes Spotlight */}
            {missionResults.length > 0 && (
              <div className="w-full mt-3 p-3.5 rounded-3xl bg-gradient-to-b from-[#2A103D]/95 via-[#180A2E]/95 to-[#10031C] border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.25)] text-left">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest font-display flex items-center gap-1.5">
                    <span>🕵️</span>
                    <span>SECRET MISSION INTEL REVEAL</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-black uppercase border border-amber-400/40">
                    ROUND {room.currentRoundIndex}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {missionResults.map((res) => {
                    const player = players.find((p) => p.id === res.playerId);
                    const isYou = res.playerId === currentPlayer.id;

                    return (
                      <div
                        key={res.playerId}
                        className={`p-3 rounded-2xl flex flex-col gap-2 border transition-all ${
                          res.isSuccess
                            ? "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : "bg-red-950/30 border-red-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AvatarBadge
                              name={res.playerName}
                              avatarKey={player?.avatar}
                              isYou={isYou}
                              size="sm"
                              showLabel={false}
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-display font-black text-xs text-white">
                                  {res.playerName} {isYou ? "(You)" : ""}
                                </span>
                                <span className="text-xs">{res.mission.badge}</span>
                              </div>
                              <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider block">
                                {res.mission.title}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap ${
                              res.isSuccess
                                ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                : "bg-red-500/25 text-red-300 border border-red-400/60"
                            }`}
                          >
                            {res.isSuccess ? `+${res.bonusPoints} PTS` : "BUSTED"}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-300 leading-snug pl-1 border-l-2 border-purple-500/40">
                          {res.summaryMessage}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next Round CTA */}
            <div className="w-full mt-4 mb-8">
              <button
                onClick={onNextRound}
                className="w-full py-4 rounded-3xl bg-gradient-to-r from-[#C026D3] via-[#A21CAF] to-[#701A75] text-white font-display font-black text-base uppercase tracking-wider shadow-[0_8px_30px_rgba(192,38,211,0.6)] border-2 border-pink-400/50 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>NEXT ROUND</span>
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

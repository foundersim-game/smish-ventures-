import React, { useEffect, useState } from "react";
import { ArrowRight, Users, Lock, X } from "lucide-react";
import confetti from "canvas-confetti";
import { PlayerSession } from "../core/types/player.types";
import { GamePhase, RoomSession } from "../core/types/room.types";
import { ScenarioOption } from "../core/types/scenario.types";
import { RoundVoteResolution } from "../core/types/vote.types";
import { AvatarBadge } from "../components/atoms/AvatarBadge";
import { getAvatarDefinition } from "../core/constants/avatars";
import { PhaseStepper } from "../components/molecules/PhaseStepper";
import { TopHeader } from "../components/molecules/TopHeader";
import { CardFlipReveal } from "../components/organisms/CardFlipReveal";
import { ChaosCoinToss } from "../components/organisms/ChaosCoinToss";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

const demoImages: Record<string, string> = {
  Aks: "/avatars/aks.jpg",
  Riya: "/avatars/riya.jpg",
  Karan: "/avatars/karan.jpg",
  Simran: "/avatars/simran.jpg",
  Vishal: "/avatars/vishal.jpg",
  Neha: "/avatars/neha.jpg",
};

const MiniVoterAvatar: React.FC<{ player?: { name: string; avatar?: any }; size?: number }> = ({
  player,
  size = 20,
}) => {
  const [imgError, setImgError] = useState(false);
  if (!player) return null;
  const preset = demoImages[player.name];
  const def = getAvatarDefinition(player.avatar);

  return (
    <div
      className="rounded-full overflow-hidden border border-white/80 shadow flex items-center justify-center flex-shrink-0 select-none relative"
      style={{
        width: size,
        height: size,
        background: def.glowColor ? def.glowColor.replace("0.6", "0.95") : "#8B5CF6",
      }}
      title={player.name}
    >
      {preset && !imgError ? (
        <img
          src={preset}
          alt={player.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-[10px] leading-none select-none filter drop-shadow">
          {def.emoji || "👤"}
        </span>
      )}
    </div>
  );
};

interface RevealScreenProps {
  room: RoomSession;
  options: ScenarioOption[];
  players: PlayerSession[];
  resolution: RoundVoteResolution;
  isHost: boolean;
  onAdvanceBeat: (beat: GamePhase) => void;
  onNextRound: () => void;
  onLeave: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({
  room,
  options,
  players,
  resolution,
  isHost,
  onAdvanceBeat,
  onNextRound,
  onLeave,
}) => {
  const currentPhase = room.phase;

  // Staged automatic progression:
  // Beat 1: Face-Down Mystery Card -> Beat 2: Shakes with BGM Suspense -> Beat 3: Rotates & Fanfare -> Beat 6: Final Answer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentPhase === "reveal_beat_1") {
      audio.play("tick_calm");
      if (isHost) {
        timer = setTimeout(() => {
          onAdvanceBeat("reveal_beat_2");
        }, 1000);
      }
    } else if (currentPhase === "reveal_beat_2") {
      // Beat 2: Card shakes with suspense + plays BGM reveal music
      audio.play("reveal_bgm");
      haptics.trigger("heavy");
      if (isHost) {
        timer = setTimeout(() => {
          onAdvanceBeat("reveal_beat_3");
        }, 1800);
      }
    } else if (currentPhase === "reveal_beat_3") {
      // Beat 3: Card rotates in 3D to reveal front face
      haptics.trigger("chaos_moment");
      try {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.38 },
          colors: ["#FF3B8A", "#FFD23F", "#00D2FF", "#C084FC"],
        });
      } catch {
        // Ignored
      }
      if (isHost) {
        timer = setTimeout(() => {
          onAdvanceBeat("reveal_beat_6");
        }, 1400);
      }
    } else if (currentPhase === "reveal_beat_4" || currentPhase === "reveal_beat_5") {
      if (isHost) {
        timer = setTimeout(() => {
          onAdvanceBeat("reveal_beat_6");
        }, 800);
      }
    }

    return () => clearTimeout(timer);
  }, [currentPhase, isHost, onAdvanceBeat]);

  const isEarlyStage = ["reveal_beat_1", "reveal_beat_2", "reveal_beat_3"].includes(currentPhase);
  const isBoxShaking = currentPhase === "reveal_beat_2";
  const isBoxOpen = currentPhase === "reveal_beat_3" || !isEarlyStage;

  const [showCoinTossModal, setShowCoinTossModal] = useState(false);

  const playerMap = new Map<string, PlayerSession>();
  players.forEach((p) => playerMap.set(p.id, p));

  const optionBadgeGradients: Record<string, string> = {
    A: "bg-[#FF2B85] text-white",
    B: "bg-[#00D2FF] text-white",
    C: "bg-[#FBBF24] text-purple-950 font-black",
    D: "bg-[#C084FC] text-white",
  };

  const winningId = resolution.winningOptionId || options[0]?.id || "A";
  const winningOpt = options.find((o) => o.id === winningId);
  const winningLabel = resolution.winningOptionLabel || winningOpt?.label || options[0]?.label || "Decision Locked";
  const winningVotes = resolution.voteTally?.[winningId]?.voteCount ?? 0;
  const totalVotes = resolution.totalVotes || players.length;

  // Robust tie detection: reads resolution.isTie or inspects voteTally directly
  const maxVoteCount = Math.max(
    ...Object.values(resolution.voteTally || {}).map((t) => t.voteCount),
    0
  );
  const optionsWithMaxVotes = Object.values(resolution.voteTally || {})
    .filter((t) => t.voteCount === maxVoteCount && maxVoteCount > 0)
    .map((t) => t.optionId);
  const isDeadlockTie = Boolean(
    resolution.isTie || optionsWithMaxVotes.length > 1
  );
  const tiedOptionIds = resolution.tiedOptionIds || optionsWithMaxVotes;
  const tiedOptions = options.filter((o) => tiedOptionIds.includes(o.id));

  const keptPlayers = (resolution.keptVotePlayerIds || [])
    .map((id) => playerMap.get(id))
    .filter(Boolean) as PlayerSession[];

  const handleNextRoundClick = () => {
    audio.play("click");
    haptics.trigger("medium");
    if (resolution.switchedPlayerCount > 0) {
      onAdvanceBeat("influence");
    } else {
      onAdvanceBeat("consequence");
    }
  };

  return (
    <div
      className="relative min-h-[100dvh] w-full flex flex-col justify-between px-4 pt-5 pb-12 bg-[#080210] select-none overflow-y-auto overflow-x-hidden"
      style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom, 28px))" }}
    >
      {/* Top Header (Screen Reveal End) */}
      <TopHeader
        currentRound={room.currentRoundIndex}
        totalRounds={room.totalRounds}
        onLeave={onLeave}
      />

      {/* 4-Step Stepper (Step 4 Reveal Active - Screen Reveal End) */}
      <PhaseStepper currentPhase="reveal_beat_6" />

      {/* Main Container */}
      <div className="flex flex-col items-center max-w-sm mx-auto w-full my-auto py-1">
        {/* ============================================================== */}
        {/* VIEW 1: EARLY BEATS 1, 2, 3 (Screen_Reveal.png Beats 1 to 3) */}
        {/* ============================================================== */}
        {isEarlyStage && (
          <div className="w-full flex flex-col items-center text-center">
            {isDeadlockTie ? (
              /* LIVE 3D COIN TOSS STAGE DURING DEADLOCK EARLY BEATS */
              <div className="w-full flex flex-col items-center">
                <ChaosCoinToss
                  tiedOptions={tiedOptions.length >= 2 ? tiedOptions : options.slice(0, 2)}
                  winnerOptionId={winningId}
                  autoStart={true}
                />
              </div>
            ) : (
              /* STANDARD MYSTERY BRIEFCASE EARLY BEATS */
              <>
                {/* Stage Title */}
                <div className="text-center mb-1">
                  <span className="text-[11px] font-display font-extrabold uppercase tracking-widest text-gray-400 block">
                    FINAL ANSWER
                  </span>
                  <h1 className="font-display font-black text-3xl tracking-tight bg-gradient-to-r from-[#FF3B8A] via-[#FF7A70] to-[#FFD23F] bg-clip-text text-transparent">
                    REVEALING...
                  </h1>
                </div>

                {/* 3D Animated Card Flip */}
                <div className="my-2 w-full">
                  <CardFlipReveal
                    isFlipped={currentPhase === "reveal_beat_3"}
                    isShaking={currentPhase === "reveal_beat_2"}
                    winningOptionId={winningId}
                    winningOptionLabel={winningLabel}
                    isTie={isDeadlockTie}
                  />
                </div>
              </>
            )}

            {/* Locked Players Row */}
            <div className="w-full flex flex-col items-center gap-2 mt-2">
              <span className="text-[11px] font-bold text-gray-400">
                All players have locked their final vote!
              </span>

              <div className="w-full grid grid-cols-6 gap-1 py-1">
                {players.map((p) => (
                  <div key={p.id} className="flex flex-col items-center">
                    <AvatarBadge
                      name={p.name}
                      avatarKey={p.avatar}
                      isHost={p.isHost}
                      isReady={true}
                      size="sm"
                      showLabel={true}
                    />
                    <div className="mt-1 flex items-center gap-0.5 text-[8px] font-bold text-cyan-400 bg-cyan-950/80 px-1 py-0.5 rounded-full border border-cyan-500/40">
                      <Lock className="w-2 h-2" />
                      <span>Locked</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Info Card */}
              <div className="w-full p-3 rounded-2xl bg-purple-950/70 border border-purple-800/40 text-left flex items-center gap-2.5 mt-2">
                <span className="text-purple-300 text-base">ℹ️</span>
                <p className="text-[11px] text-gray-300 leading-snug">
                  {isDeadlockTie
                    ? "Deadlock detected! CHAOS is flipping the coin between the tied options..."
                    : "Time's up! Everyone has locked their final vote. Now revealing the group's decision..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: FINAL REVEAL END SCREEN (Screen_Reveal_End.png) */}
        {/* ============================================================== */}
        {!isEarlyStage && (
          <div className="w-full flex flex-col items-center">
            {/* The Group Has Spoken Header with Deadlock/Tiebreaker Awareness */}
            {isDeadlockTie ? (
              <div className="text-center mb-1 flex flex-col items-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[11px] font-black tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse mb-1">
                  <span>⚖️ DEADLOCK! CHAOS BROKE THE TIE</span>
                </div>
                <h1 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                  {winningLabel}
                </h1>
                {/* Watch Live Coin Toss Button */}
                <button
                  onClick={() => {
                    audio.play("click");
                    setShowCoinTossModal(true);
                  }}
                  className="mt-1 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-display font-black text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.8)] border border-white/60 flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <span>🪙</span>
                  <span>Watch Coin Toss Flip</span>
                </button>
              </div>
            ) : (
              <div className="text-center mb-1">
                <span className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-300 block">
                  THE GROUP HAS SPOKEN.
                </span>
                <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight bg-gradient-to-r from-[#FF3B8A] via-[#FF7A70] to-[#FFD23F] bg-clip-text text-transparent">
                  {winningLabel}
                </h1>
              </div>
            )}

            {/* Vote Count Pill (Screen Reveal End) */}
            <div className="my-1.5 px-4 py-1 rounded-full bg-[#180A2E]/90 border border-purple-500/50 text-xs font-display font-black text-white shadow-lg flex items-center gap-1.5">
              <span className="text-yellow-400 font-extrabold">{winningVotes}</span>
              <span className="text-gray-400"> / </span>
              <span>{totalVotes} votes</span>
              {isDeadlockTie && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-400/25 text-amber-300 text-[10px] font-black border border-amber-400/50 flex items-center gap-0.5">
                  🪙 Coin Toss Winner
                </span>
              )}
            </div>

            {/* 3D Winning Option Card Flip Reveal */}
            <div className="my-1 w-full">
              <CardFlipReveal
                isFlipped={true}
                isShaking={false}
                winningOptionId={winningId}
                winningOptionLabel={winningLabel}
                isTie={isDeadlockTie}
              />
            </div>

            {/* 4 Option Breakdown Columns (Screen Reveal End) */}
            <div className="grid grid-cols-4 gap-1.5 w-full mt-1">
              {options.map((opt) => {
                const tally = resolution.voteTally[opt.id];
                const isWinner = opt.id === winningId;
                const isTied = isDeadlockTie && tiedOptionIds.includes(opt.id);
                const count = tally?.voteCount || 0;
                const voterPlayers = (tally?.voterPlayerIds || [])
                  .map((id) => playerMap.get(id))
                  .filter(Boolean) as PlayerSession[];

                return (
                  <div
                    key={opt.id}
                    className={`
                      p-2 rounded-2xl flex flex-col items-center text-center transition-all duration-200 border relative min-h-[165px]
                      ${
                        isWinner
                          ? "bg-[#0E2047] border-2 border-[#00D2FF] shadow-[0_0_20px_rgba(0,210,255,0.6)] scale-[1.02]"
                          : isTied
                          ? "bg-[#251508]/90 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                          : "bg-[#180C2E]/90 border-purple-800/40"
                      }
                    `}
                  >
                    {/* Uniform Top Status Slot (fixed height h-4 to align all columns) */}
                    <div className="h-4 w-full flex items-center justify-center mb-1">
                      {isTied ? (
                        <span className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 whitespace-nowrap leading-none">
                          {isWinner ? "🪙 Won Toss" : "⚖️ Tied"}
                        </span>
                      ) : isWinner ? (
                        <span className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 whitespace-nowrap leading-none">
                          👑 Winner
                        </span>
                      ) : null}
                    </div>

                    {/* Option Letter Badge */}
                    <span
                      className={`
                        w-6.5 h-6.5 rounded-xl flex items-center justify-center font-display font-black text-xs mb-1.5 shadow-sm flex-shrink-0
                        ${optionBadgeGradients[opt.id] || optionBadgeGradients.B}
                      `}
                    >
                      {opt.id}
                    </span>

                    {/* Option Text Label: Fixed height, top-aligned so line 1 starts on same row across all cards */}
                    <div className="w-full h-12 flex items-start justify-center text-center px-0.5 overflow-hidden">
                      <h5 className="text-white text-[8.5px] font-bold font-sans leading-tight text-center break-words line-clamp-3">
                        {opt.label}
                      </h5>
                    </div>

                    {/* Bottom Section pinned to bottom: Vote Count & Voter Avatars */}
                    <div className="mt-auto pt-1 flex flex-col items-center w-full">
                      <span className="text-gray-300 text-[9.5px] font-extrabold leading-none">
                        {count} {count === 1 ? "vote" : "votes"}
                      </span>

                      {/* Voter Avatars with reliable fallback */}
                      <div className="flex items-center justify-center -space-x-1.5 mt-1.5 min-h-[22px]">
                        {voterPlayers.length > 0 ? (
                          voterPlayers.map((p) => (
                            <MiniVoterAvatar key={p.id} player={p} size={20} />
                          ))
                        ) : (
                          <span className="text-gray-500 text-xs leading-none">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mind Change Banner Card (Screen Reveal End) */}
            <div className="p-3 rounded-2xl bg-[#1B0F2E]/90 border border-purple-500/40 flex items-center gap-3 w-full mt-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-900/60 flex items-center justify-center text-purple-300 flex-shrink-0">
                <Users className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-left">
                <h5 className="text-pink-400 font-bold text-xs uppercase tracking-wider">
                  {resolution.switchedPlayerCount} {resolution.switchedPlayerCount === 1 ? "person" : "people"} changed their minds!
                </h5>
                <p className="text-gray-300 text-[11px] mt-0.5 leading-snug">
                  Out of {resolution.totalVotes} players, {resolution.switchedPlayerCount} switched from their original vote.
                </p>
              </div>
            </div>

            {/* Two Split Columns: WHO CHANGED THEIR MIND? & WHO KEPT THEIR VOTE? (Screen Reveal End) */}
            <div className="grid grid-cols-2 gap-2 w-full mt-2 text-left">
              {/* Left Column: Who Changed */}
              <div className="p-2.5 rounded-2xl bg-[#180A2E]/90 border border-purple-800/50 flex flex-col justify-between">
                <h6 className="font-display font-black text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                  WHO CHANGED THEIR MIND?
                </h6>

                <div className="flex flex-col gap-1.5">
                  {resolution.mindChanges.map((mc) => {
                    const matchedPlayer = players.find((p) => p.id === mc.playerId) || {
                      name: mc.playerName,
                      avatar: "brain" as const,
                    };

                    return (
                      <div key={mc.playerId} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MiniVoterAvatar player={matchedPlayer} size={20} />
                          <span className="text-white text-[11px] font-bold">{mc.playerName}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[9px] ${optionBadgeGradients[mc.initialOptionId] || optionBadgeGradients.A}`}>
                            {mc.initialOptionId}
                          </span>
                          <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
                          <span className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[9px] ${optionBadgeGradients[mc.finalOptionId] || optionBadgeGradients.B}`}>
                            {mc.finalOptionId}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Who Kept */}
              <div className="p-2.5 rounded-2xl bg-[#180A2E]/90 border border-purple-800/50 flex flex-col justify-between">
                <h6 className="font-display font-black text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                  WHO KEPT THEIR VOTE?
                </h6>

                <div className="flex items-center justify-around py-1">
                  {keptPlayers.map((p) => (
                    <div key={p.id} className="flex flex-col items-center">
                      <AvatarBadge
                        name={p.name}
                        avatarKey={p.avatar}
                        isHost={p.isHost}
                        isYou={p.name === "Aks"}
                        size="sm"
                        showLabel={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glowing Magenta Pill Button: NEXT ROUND (Screen Reveal End) */}
            <div className="w-full mt-3 mb-6">
              <button
                onClick={handleNextRoundClick}
                className="w-full py-4 rounded-3xl bg-gradient-to-r from-[#C026D3] via-[#A21CAF] to-[#701A75] text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_8px_30px_rgba(192,38,211,0.6)] border-2 border-pink-400/50 active:scale-[0.98] transition-transform cursor-pointer"
              >
                {resolution.switchedPlayerCount > 0 ? "NEXT: WHO GOT INFLUENCED?" : "NEXT: SEE CONSEQUENCES"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive 3D Coin Toss Modal Overlay */}
      {showCoinTossModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-sm">
            <button
              onClick={() => setShowCoinTossModal(false)}
              className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold flex items-center justify-center text-sm shadow transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <ChaosCoinToss
              tiedOptions={tiedOptions.length >= 2 ? tiedOptions : options.slice(0, 2)}
              winnerOptionId={winningId}
              autoStart={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

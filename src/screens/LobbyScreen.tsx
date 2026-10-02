import React, { useState } from "react";
import {
  Copy,
  Share2,
  Play,
  Edit2,
  Users,
  Clock,
  Layers,
  Zap,
  Check,
  LogOut,
  Bot,
  UserPlus,
} from "lucide-react";
import { PlayerSession } from "../core/types/player.types";
import { RoomSession } from "../core/types/room.types";
import { AvatarBadge } from "../components/atoms/AvatarBadge";
import { ChaosButton } from "../components/atoms/ChaosButton";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface LobbyScreenProps {
  room: RoomSession;
  players: PlayerSession[];
  currentPlayerId: string;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onEditSettings?: () => void;
  onAddBot?: () => void;
  onKickPlayer?: (playerId: string) => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  room,
  players,
  currentPlayerId,
  onStartGame,
  onLeaveRoom,
  onEditSettings,
  onAddBot,
  onKickPlayer,
}) => {
  const [copied, setCopied] = useState(false);
  const isHost = room.hostId === currentPlayerId;
  const minRequired = room.mode === "couples" ? 2 : (room.settings.minPlayers || 3);
  const targetPlayers =
    room.settings.targetPlayers ||
    (room.mode === "couples" ? 2 : room.settings.maxPlayers);
  const canStart = players.length >= minRequired;
  const emptySlotsCount = Math.max(0, targetPlayers - players.length);

  const getJoinUrl = () => {
    if (typeof window === "undefined") return "";
    const base = window.location.pathname.startsWith("/chaos") ? "/chaos" : "";
    return `${window.location.origin}${base}?join=${room.roomCode}`;
  };

  const handleCopyCode = async () => {
    audio.play("click");
    haptics.trigger("light");
    try {
      await navigator.clipboard.writeText(getJoinUrl() || room.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleShare = async () => {
    audio.play("click");
    haptics.trigger("medium");
    const joinUrl = getJoinUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my CHAOS game!",
          text: `Join my CHAOS party game with code: ${room.roomCode}!`,
          url: joinUrl || window.location.href,
        });
      } catch {
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-5 pt-8 pb-6 bg-[#090310] select-none">
      {/* Top Bar */}
      <header className="relative w-full flex items-center justify-between z-10">
        <div className="w-10" />

        <button
          onClick={onLeaveRoom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/50 bg-red-950/40 text-red-200 text-xs font-bold active:scale-95 transition-all"
        >
          <span>Leave</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Title Header */}
      <div className="text-center mt-2">
        <span className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
          {room.mode === "couples" ? "COUPLES MODE" : "PARTY CHAOS"}
        </span>
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mt-0.5">
          GAME <span className="text-yellow-400">LOBBY</span>
        </h1>
        <p className="text-gray-300 text-xs mt-1">
          Share your room code with friends to join with their own avatars!
        </p>
      </div>

      {/* Room Code & Share Card */}
      <div className="p-4 rounded-3xl bg-[#1B0E2E] border border-purple-600/40 shadow-xl max-w-sm mx-auto w-full my-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            ROOM CODE
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-display font-black text-3xl text-white tracking-widest">
              {room.roomCode}
            </span>
            <button
              onClick={handleCopyCode}
              title="Copy Link"
              className="p-1.5 rounded-lg bg-purple-900/60 text-purple-300 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-display font-bold text-xs uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <Share2 className="w-4 h-4" />
          <span>{copied ? "Link Copied!" : "Invite Friends"}</span>
        </button>
      </div>

      {/* Players Section Header */}
      <div className="max-w-sm mx-auto w-full">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="font-display font-extrabold text-sm text-white uppercase tracking-wider">
            PLAYERS ({players.length}/{targetPlayers})
          </span>
          {canStart ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
              Ready to start!
            </span>
          ) : (
            <span className="text-xs text-yellow-400 font-bold">
              Need {minRequired - players.length} more...
            </span>
          )}
        </div>

        {/* Players Avatar Grid (4 per row) */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 py-1">
          {players.map((p) => (
            <div key={p.id} className="relative group">
              <AvatarBadge
                name={p.name}
                avatarKey={p.avatar}
                isHost={p.isHost}
                isReady={p.connected}
                isYou={p.id === currentPlayerId}
                size="md"
                showLabel={true}
              />
              {/* Host kick option */}
              {isHost && p.id !== currentPlayerId && onKickPlayer && (
                <button
                  onClick={() => onKickPlayer(p.id)}
                  title="Remove player"
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow opacity-60 hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Empty Waiting Slots (or Add Bot CTA) */}
          {emptySlotsCount > 0 &&
            Array.from({ length: Math.min(emptySlotsCount, 4) }).map((_, idx) => (
              <div
                key={idx}
                onClick={isHost && onAddBot ? onAddBot : undefined}
                className={`flex flex-col items-center select-none ${
                  isHost && onAddBot ? "cursor-pointer active:scale-95" : ""
                }`}
              >
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-purple-700/60 bg-purple-950/30 flex items-center justify-center text-purple-400 hover:border-yellow-400 transition-colors">
                  {isHost && onAddBot ? (
                    <UserPlus className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <span className="text-lg font-bold">+</span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-1">
                  {isHost && onAddBot ? "+ Add Bot" : "Waiting"}
                </span>
              </div>
            ))}
        </div>

        {/* Quick Add Bot Button for Solo / Quick Testing */}
        {isHost && onAddBot && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => {
                audio.play("click");
                haptics.trigger("light");
                onAddBot();
              }}
              className="px-3.5 py-1.5 rounded-full bg-purple-900/50 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow"
            >
              <Bot className="w-3.5 h-3.5 text-yellow-400" />
              <span>+ Add AI / Demo Player</span>
            </button>
          </div>
        )}
      </div>

      {/* Game Details Summary Card */}
      <div className="p-3.5 rounded-2xl bg-[#1B0F2E]/90 border border-purple-800/40 max-w-sm mx-auto w-full mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            GAME DETAILS
          </span>
          {isHost && onEditSettings && (
            <button
              onClick={onEditSettings}
              className="flex items-center gap-1 text-[11px] text-purple-300 font-bold hover:text-white"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-gray-200">
          <div className="flex flex-col items-center">
            <Users className="w-4 h-4 text-purple-400 mb-0.5" />
            <span className="font-bold text-xs">{targetPlayers}</span>
            <span className="text-[10px] text-gray-400">Players</span>
          </div>

          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-pink-400 mb-0.5" />
            <span className="font-bold text-xs">{room.settings.discussionDurationSeconds}s</span>
            <span className="text-[10px] text-gray-400">Debate</span>
          </div>

          <div className="flex flex-col items-center">
            <Layers className="w-4 h-4 text-amber-400 mb-0.5" />
            <span className="font-bold text-xs">{room.totalRounds}</span>
            <span className="text-[10px] text-gray-400">Rounds</span>
          </div>

          <div className="flex flex-col items-center">
            <Zap className="w-4 h-4 text-yellow-400 mb-0.5" />
            <span className="font-bold text-xs capitalize">{room.settings.intensity}</span>
            <span className="text-[10px] text-gray-400">Chaos</span>
          </div>
        </div>
      </div>

      {/* Host Start Game CTA */}
      <div className="w-full max-w-sm mx-auto mt-4">
        {isHost ? (
          <ChaosButton
            variant="primary"
            size="lg"
            disabled={!canStart}
            icon={<Play className="w-5 h-5 fill-white text-white" />}
            onClick={onStartGame}
          >
            {canStart
              ? "START THE CHAOS"
              : `WAITING FOR ${minRequired - players.length} MORE`}
          </ChaosButton>
        ) : (
          <div className="p-4 rounded-2xl bg-purple-950/70 border border-purple-800 text-center text-xs font-bold text-purple-300 animate-pulse">
            Waiting for the host to start the CHAOS...
          </div>
        )}
      </div>
    </div>
  );
};

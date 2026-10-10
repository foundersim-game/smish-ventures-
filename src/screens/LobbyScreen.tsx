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
  Crown,
  Sparkles,
  QrCode,
} from "lucide-react";
import { PlayerSession } from "../core/types/player.types";
import { RoomSession } from "../core/types/room.types";
import { AvatarBadge } from "../components/atoms/AvatarBadge";
import { ChaosButton } from "../components/atoms/ChaosButton";
import { HostPassModal } from "../components/organisms/HostPassModal";
import { LobbyQrModal } from "../components/molecules/LobbyQrModal";
import { PlayerStorage } from "../services/storage/player-storage";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface LobbyScreenProps {
  room: RoomSession;
  players: PlayerSession[];
  currentPlayerId: string;
  currentPlayer?: PlayerSession | null;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onEditSettings?: () => void;
  onAddBot?: () => void;
  onKickPlayer?: (playerId: string) => void;
  onActivatePass?: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  room,
  players,
  currentPlayerId,
  currentPlayer,
  onStartGame,
  onLeaveRoom,
  onEditSettings,
  onAddBot,
  onKickPlayer,
  onActivatePass,
}) => {
  const [copied, setCopied] = useState(false);
  const [loadingBot, setLoadingBot] = useState(false);
  const [showHostPass, setShowHostPass] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Resilient player roster: guarantee current player is always visible even during initial fetch
  const effectivePlayers = React.useMemo(() => {
    if (players && players.length > 0) {
      if (currentPlayer && !players.some((p) => p.id === currentPlayer.id)) {
        return [currentPlayer, ...players];
      }
      return players;
    }
    return currentPlayer ? [currentPlayer] : [];
  }, [players, currentPlayer]);

  // Multi-tier resilient host identification to ensure host is never locked out
  const activeSession = PlayerStorage.getActiveSession();
  const isHost =
    Boolean(currentPlayer?.isHost) ||
    room.hostId === currentPlayerId ||
    room.hostId === currentPlayer?.id ||
    Boolean(activeSession?.isHost && activeSession?.roomCode === room.roomCode) ||
    effectivePlayers.some((p) => (p.id === currentPlayerId || p.id === currentPlayer?.id) && p.isHost) ||
    (effectivePlayers.length > 0 && effectivePlayers[0].id === (currentPlayer?.id || currentPlayerId)) ||
    (effectivePlayers.length > 0 && Boolean(currentPlayer?.name) && effectivePlayers[0].name.trim().toLowerCase() === (currentPlayer?.name || "").trim().toLowerCase());

  const minRequired = room.mode === "couples" ? 2 : Math.min(room.settings.minPlayers || 2, 2);
  const targetPlayers =
    room.settings.targetPlayers ||
    (room.mode === "couples" ? 2 : room.settings.maxPlayers);
  const canStart = effectivePlayers.length >= minRequired;
  const emptySlotsCount = Math.max(0, targetPlayers - effectivePlayers.length);

  const handleAddBotClick = async () => {
    if (loadingBot || !onAddBot) return;
    setLoadingBot(true);
    audio.play("click");
    haptics.trigger("light");
    try {
      await onAddBot();
    } finally {
      setTimeout(() => setLoadingBot(false), 500);
    }
  };

  const getJoinUrl = () => {
    if (typeof window === "undefined") return "";
    const base = window.location.pathname.startsWith("/chaos") ? "/chaos" : "";
    return `${window.location.origin}${base}?join=${room.roomCode}`;
  };

  const handleCopyCode = async () => {
    audio.play("click");
    haptics.trigger("light");
    try {
      await navigator.clipboard.writeText(room.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleShare = async () => {
    audio.play("click");
    haptics.trigger("medium");
    const joinUrl = getJoinUrl() || `https://www.smishventures.com/chaos?join=${room.roomCode}`;
    const shareText = `🔥 Join my CHAOS game!\nRoom Code: ${room.roomCode}\nTap to join: ${joinUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my CHAOS game!",
          text: shareText,
          url: joinUrl,
        });
      } catch {
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between bg-[#090310] px-3.5 py-2.5 sm:py-3.5 select-none overflow-hidden">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-between overflow-hidden">
        {/* Top Bar */}
        <header
          style={{ paddingTop: "max(12px, env(safe-area-inset-top, 12px))" }}
          className="relative w-full flex items-center justify-between z-10 py-1"
        >
          {room.isPaidSession ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider shadow">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>AD-FREE ROOM</span>
            </div>
          ) : (
            <button
              onClick={() => setShowHostPass(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[11px] font-bold active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(251,191,36,0.2)]"
            >
              <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300" />
              <span>GO AD-FREE ($0.99)</span>
            </button>
          )}

          <button
            onClick={onLeaveRoom}
            className="flex items-center gap-1 px-3 py-1 rounded-full border border-red-500/50 bg-red-950/40 text-red-200 text-[11px] font-bold active:scale-95 transition-all"
          >
            <span>Leave</span>
            <LogOut className="w-3 h-3" />
          </button>
        </header>

        {/* Compact Header & Room Code Pill */}
        <div className="flex flex-col items-center text-center my-1">
          <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-gray-400">
            {room.mode === "couples" ? "COUPLES MODE" : "PARTY CHAOS"}
          </span>
          <h1 className="font-display font-black text-2xl text-white tracking-tight mt-0.5">
            GAME <span className="text-yellow-400">LOBBY</span>
          </h1>
        </div>

        {/* Compact Room Code & Share Card */}
        <div className="p-2.5 rounded-2xl bg-[#1B0E2E] border border-purple-600/40 shadow-lg w-full flex items-center justify-between mb-2">
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
              ROOM CODE
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-display font-black text-2xl text-white tracking-widest">
                {room.roomCode}
              </span>
              <button
                onClick={handleCopyCode}
                title="Copy Link"
                className="p-1 rounded-lg bg-purple-900/60 text-purple-300 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  audio.play("click");
                  setShowQr(true);
                }}
                title="Scan QR Code"
                className="p-1 rounded-lg bg-purple-900/60 text-yellow-400 hover:text-yellow-300 border border-yellow-500/30"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-display font-bold text-xs uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Invite Friends"}</span>
          </button>
        </div>

        {/* Players Section (Viewport Sized, Scrollable if many players) */}
        <div className="flex-1 min-h-0 flex flex-col justify-between w-full">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-display font-extrabold text-xs text-white uppercase tracking-wider">
              PLAYERS ({effectivePlayers.length}/{targetPlayers})
            </span>
            {canStart ? (
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                Ready to start!
              </span>
            ) : (
              <span className="text-[11px] text-yellow-400 font-bold">
                Need {minRequired - effectivePlayers.length} more...
              </span>
            )}
          </div>

          {/* Players Avatar Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar grid grid-cols-4 gap-y-2.5 gap-x-2 py-1 content-start">
            {effectivePlayers.map((p) => (
              <div key={p.id} className="relative group flex flex-col items-center">
                <AvatarBadge
                  name={p.name}
                  avatarKey={p.avatar}
                  isHost={p.isHost}
                  isReady={p.connected}
                  isYou={p.id === currentPlayerId || p.id === currentPlayer?.id}
                  size="sm"
                  showLabel={true}
                />
                {isHost && p.id !== currentPlayerId && p.id !== currentPlayer?.id && onKickPlayer && (
                  <button
                    onClick={() => onKickPlayer(p.id)}
                    title="Remove player"
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow opacity-70 hover:opacity-100"
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
                  onClick={isHost && onAddBot && !loadingBot ? handleAddBotClick : undefined}
                  className={`flex flex-col items-center select-none ${
                    isHost && onAddBot && !loadingBot ? "cursor-pointer active:scale-95" : "opacity-60"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-purple-700/60 bg-purple-950/30 flex items-center justify-center text-purple-400 hover:border-yellow-400 transition-colors">
                    {isHost && onAddBot ? (
                      <UserPlus className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <span className="text-sm font-bold">+</span>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 mt-0.5">
                    {isHost && onAddBot ? (loadingBot ? "..." : "+ Bot") : "Waiting"}
                  </span>
                </div>
              ))}
          </div>

          {/* Quick Add Bot Button for Solo / Quick Testing */}
          {isHost && onAddBot && (
            <div className="my-1.5 flex justify-center">
              <button
                disabled={loadingBot}
                onClick={handleAddBotClick}
                className={`px-3 py-1 rounded-full bg-purple-900/50 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-[11px] font-bold flex items-center gap-1 transition-all shadow ${
                  loadingBot ? "opacity-50 cursor-not-allowed" : "active:scale-95"
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-yellow-400" />
                <span>{loadingBot ? "Adding Bot..." : "+ Add AI Player"}</span>
              </button>
            </div>
          )}
        </div>

        {/* 1-Line Compact Game Details Bar */}
        <div className="px-3 py-1.5 rounded-xl bg-[#1B0F2E]/90 border border-purple-800/40 flex items-center justify-between text-gray-300 text-[11px] my-1.5">
          <span className="flex items-center gap-1 font-semibold">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{targetPlayers}P</span>
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>{room.settings.discussionDurationSeconds}s</span>
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1 font-semibold">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{room.totalRounds}R</span>
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1 font-semibold capitalize text-yellow-300">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>{room.settings.intensity}</span>
          </span>
          {isHost && onEditSettings && (
            <button
              onClick={onEditSettings}
              className="text-purple-300 hover:text-white font-bold ml-1"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Host Start Game CTA (ALWAYS Pinned Visible!) */}
        <div
          style={{
            paddingBottom: "calc(max(8px, env(safe-area-inset-bottom, 8px)) + var(--admob-banner-height, 0px))",
          }}
          className="w-full mt-1 mb-1 transition-[padding] duration-200"
        >
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
                : players.length === 1
                ? "NEED 1 MORE (OR TAP +BOT)"
                : `WAITING FOR ${minRequired - players.length} MORE`}
            </ChaosButton>
          ) : (
            <div className="p-3.5 rounded-2xl bg-purple-950/70 border border-purple-800 text-center text-xs font-bold text-purple-300 animate-pulse">
              Waiting for host to start the CHAOS...
            </div>
          )}
        </div>

        <HostPassModal
          isOpen={showHostPass}
          roomCode={room.roomCode}
          hostPlayerId={room.hostId}
          onClose={() => setShowHostPass(false)}
          onPassActivated={(product) => {
            if (product === "shared") {
              PlayerStorage.activatePass("shared_viral", 1);
            } else {
              PlayerStorage.activatePass(product.id, product.hostedGamesCount);
            }
            onActivatePass?.();
          }}
        />

        <LobbyQrModal
          isOpen={showQr}
          onClose={() => setShowQr(false)}
          roomCode={room.roomCode}
        />
      </div>
    </div>
  );
};

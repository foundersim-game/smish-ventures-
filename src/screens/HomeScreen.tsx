import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Settings,
  ChevronRight,
  BarChart3,
  Layers,
  Trophy,
  ShoppingBag,
  User,
  Heart,
  Sparkles,
  X,
  Lock,
} from "lucide-react";
import { SettingsModal } from "../components/organisms/SettingsModal";
import { HowToPlayModal } from "../components/organisms/HowToPlayModal";
import { PlayerProfileModal } from "../components/organisms/PlayerProfileModal";
import { HostPassModal } from "../components/organisms/HostPassModal";
import { PlayerStorage, StoredProfile, ActiveSession } from "../services/storage/player-storage";
import { getAvatarDefinition } from "../core/constants/avatars";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface HomeScreenProps {
  onCreateParty: () => void;
  onJoinParty: () => void;
  onCouplesMode: () => void;
  activeSession?: ActiveSession | null;
  onRejoinSession?: (session: ActiveSession) => void;
  onDismissSession?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onCreateParty,
  onJoinParty,
  onCouplesMode,
  activeSession,
  onRejoinSession,
  onDismissSession,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCouplesModal, setShowCouplesModal] = useState(false);
  const [showHostPassModal, setShowHostPassModal] = useState(false);
  const [profile, setProfile] = useState<StoredProfile>({ name: "Player", avatar: "crown" });

  useEffect(() => {
    setProfile(PlayerStorage.getProfile());
  }, []);

  const handleCreate = () => {
    audio.play("click");
    haptics.trigger("heavy");
    onCreateParty();
  };

  const handleJoin = () => {
    audio.play("click");
    haptics.trigger("medium");
    onJoinParty();
  };

  const handleCouples = () => {
    audio.play("invalid");
    haptics.trigger("warning");
    setShowCouplesModal(true);
  };

  const avatarDef = getAvatarDefinition(profile.avatar);

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between bg-[#0A0314] overflow-hidden select-none px-3 py-1.5 sm:py-2">
      {/* Ambient Animated Energy Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-[90px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/15 rounded-full blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      </div>

      {/* Top Header Controls */}
      <header className="relative z-10 w-full max-w-sm mx-auto flex items-center justify-between pt-1 pb-1 flex-shrink-0">
        <button
          onClick={() => {
            audio.play("click");
            setShowHowToPlay(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 text-xs font-semibold backdrop-blur-md active:scale-95 transition-all shadow-md group"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-300 group-hover:text-yellow-300 transition-colors" />
          <span>How to Play</span>
        </button>

        {/* Profile Pill */}
        <button
          onClick={() => {
            audio.play("click");
            haptics.trigger("light");
            setShowProfileModal(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-950/90 to-indigo-950/90 hover:from-purple-900 hover:to-indigo-900 border border-purple-400/40 text-white text-xs font-bold active:scale-95 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <span className="text-base drop-shadow">{avatarDef.emoji}</span>
          <div className="flex flex-col text-left leading-none">
            <span className="max-w-[100px] truncate font-extrabold text-white text-[12px]">{profile.name}</span>
            <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider">Tap to Edit</span>
          </div>
        </button>

        <button
          onClick={() => {
            audio.play("click");
            setShowSettings(true);
          }}
          className="p-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 backdrop-blur-md active:scale-95 transition-all shadow-md hover:text-white"
        >
          <Settings className="w-4 h-4 text-purple-300" />
        </button>
      </header>

      {/* Center Hero & Action Hub */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col justify-between items-center px-1 py-1 w-full max-w-sm mx-auto overflow-y-auto no-scrollbar">
        {/* Brand Banner with Floating 3D Logo */}
        <div className="flex flex-col items-center text-center my-auto flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-amber-300 text-[10px] font-display font-extrabold tracking-wider uppercase mb-1 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>LIVE MULTIPLAYER PARTY GAME</span>
          </div>

          <div className="relative flex items-center justify-center my-0.5 group">
            <div className="absolute inset-0 bg-red-600/35 rounded-full blur-2xl pointer-events-none scale-110 group-hover:scale-125 transition-transform" />
            <img
              src="/logo-transparent.png"
              alt="CHAOS — Make a Decision, Deal with the CHAOS"
              className="w-auto h-20 sm:h-24 md:h-28 max-h-28 object-contain drop-shadow-[0_10px_28px_rgba(224,24,68,0.7)] relative z-10 active:scale-95 transition-transform cursor-pointer"
              onClick={() => {
                audio.play("fanfare");
                haptics.trigger("chaos_moment");
              }}
            />
          </div>

          <div className="text-center mt-0.5 mb-1.5">
            <h2 className="font-display font-black text-xl sm:text-2xl italic tracking-tight text-white drop-shadow-md leading-tight">
              MAKE A DECISION.
            </h2>
            <h2 className="font-display font-black text-xl sm:text-2xl italic tracking-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(255,210,63,0.5)] leading-tight">
              DEAL WITH THE CHAOS.
            </h2>
          </div>
        </div>

        {/* Action Hub Cards */}
        <div className="w-full flex flex-col gap-2 my-auto">
          {/* Active Session Rejoin Banner */}
          {activeSession && (
            <div className="relative group w-full">
              <button
                onClick={() => {
                  audio.play("click");
                  haptics.trigger("heavy");
                  onRejoinSession?.(activeSession);
                }}
                className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left animate-pulse"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shadow flex-shrink-0">
                    ⚡
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-black text-sm text-white tracking-wide">
                        REJOIN LIVE GAME
                      </h3>
                      <span className="px-1.5 py-0.2 rounded-full bg-black/40 border border-white/30 text-[9px] font-black text-white">
                        {activeSession.roomCode}
                      </span>
                    </div>
                    <p className="text-emerald-100 text-[10px] font-medium leading-tight">
                      Room active • Tap to jump back in
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white flex-shrink-0" />
              </button>
              {onDismissSession && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audio.play("click");
                    onDismissSession();
                  }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-black/80 hover:bg-black border border-white/30 text-gray-300 hover:text-white flex items-center justify-center shadow-lg active:scale-95 transition-all z-20"
                  title="Dismiss active game"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* 1. HOST A PARTY (CREATE GAME) */}
          <button
            onClick={handleCreate}
            className="group relative w-full p-3 rounded-2xl bg-gradient-to-r from-[#FF0038] via-[#FF1E4C] to-[#E54800] border-2 border-rose-400/60 shadow-[0_6px_24px_rgba(255,0,56,0.45)] flex items-center justify-between active:scale-[0.98] hover:shadow-[0_8px_30px_rgba(255,0,56,0.6)] transition-all cursor-pointer text-left overflow-hidden"
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1.5 flex items-center justify-center shadow-[0_0_16px_rgba(251,191,36,0.7)] flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="text-2xl filter drop-shadow">👑</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-black text-base text-white tracking-wide leading-tight">
                    HOST A PARTY
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/25 text-amber-200 text-[9px] font-black uppercase tracking-wider">
                    NEW ROOM
                  </span>
                </div>
                <p className="text-rose-100 text-[11px] font-medium leading-tight mt-0.5">
                  Start game night • Invite up to 10 friends
                </p>
                <div className="flex items-center gap-2 mt-1 text-[9px] text-amber-200 font-bold">
                  <span>✨ 10 Scenarios</span>
                  <span>•</span>
                  <span>🤖 AI Bots Ready</span>
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform flex-shrink-0">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>

          {/* 2. JOIN SQUAD (JOIN GAME) */}
          <button
            onClick={handleJoin}
            className="group relative w-full p-3 rounded-2xl bg-gradient-to-r from-[#2F1759] via-[#241049] to-[#1B0A38] border-2 border-purple-400/40 shadow-[0_6px_22px_rgba(147,51,234,0.3)] flex items-center justify-between active:scale-[0.98] hover:border-purple-300/70 transition-all cursor-pointer text-left overflow-hidden"
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-1.5 flex items-center justify-center shadow-[0_0_16px_rgba(192,132,252,0.6)] flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="text-2xl filter drop-shadow">🎮</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-black text-base text-white tracking-wide leading-tight">
                    JOIN SQUAD
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-900/60 text-purple-200 text-[9px] font-black uppercase tracking-wider">
                    ENTER CODE
                  </span>
                </div>
                <p className="text-purple-200 text-[11px] font-medium leading-tight mt-0.5">
                  Got a 4-letter room code? Jump in!
                </p>
                <div className="flex items-center gap-2 mt-1 text-[9px] text-purple-300 font-bold">
                  <span>⚡ Instant Sync</span>
                  <span>•</span>
                  <span>🎭 Pick Any Avatar</span>
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform flex-shrink-0">
              <ChevronRight className="w-4 h-4 text-purple-200" />
            </div>
          </button>

          {/* 3. FEATURED SCENARIO SPOTLIGHT BANNER */}
          <div
            onClick={handleCreate}
            className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-400/30 flex items-center justify-between cursor-pointer hover:border-amber-400/60 active:scale-[0.99] transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-base flex-shrink-0 shadow-inner">
                💣
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-display font-black text-amber-300 uppercase tracking-wider">
                    HOT SCENARIO
                  </span>
                  <span className="text-gray-400 text-[10px]">•</span>
                  <span className="text-white text-xs font-bold">Startup Implosion</span>
                </div>
                <p className="text-gray-300 text-[10px] truncate max-w-[210px] leading-tight">
                  &ldquo;The burn rate is toxic. Who gets thrown under the bus?&rdquo;
                </p>
              </div>
            </div>
            <span className="text-[10px] text-amber-300 font-bold whitespace-nowrap pl-1">
              Play ➔
            </span>
          </div>

          {/* 4. COUPLES MODE (Coming Soon Teaser) */}
          <button
            onClick={handleCouples}
            className="w-full py-2 px-3 rounded-2xl bg-gradient-to-r from-pink-950/40 to-rose-950/40 border border-pink-500/30 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">💖</span>
              <div>
                <span className="font-display font-extrabold text-xs text-pink-200">
                  COUPLES MODE
                </span>
                <span className="text-[10px] text-pink-300/70 ml-2">
                  2-Player Drama • Coming Soon
                </span>
              </div>
            </div>
            <Lock className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar (Screen 1) */}
      <footer className="w-full bg-[#120520] border-t border-purple-900/50 py-1.5 px-4 flex-shrink-0">
        <div className="max-w-sm mx-auto flex items-center justify-around text-gray-400">
          <button
            onClick={() => {
              audio.play("click");
              setShowHowToPlay(true);
            }}
            className="flex flex-col items-center text-purple-400 font-bold"
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">My Games</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              onCreateParty();
            }}
            className="flex flex-col items-center hover:text-white"
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Scenarios</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              haptics.trigger("light");
              setShowProfileModal(true);
            }}
            className="flex flex-col items-center hover:text-white"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Avatar</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              haptics.trigger("light");
              setShowHostPassModal(true);
            }}
            className="flex flex-col items-center hover:text-white"
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Store</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      <HostPassModal
        isOpen={showHostPassModal}
        onClose={() => setShowHostPassModal(false)}
        onPassActivated={() => {
          setShowHostPassModal(false);
        }}
      />
      <PlayerProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setProfile(PlayerStorage.getProfile());
        }}
        onSaved={(name, avatar) => setProfile({ name, avatar })}
      />

      {/* Couples Mode Coming Soon Modal */}
      {showCouplesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#17051C] border-2 border-pink-500/50 p-6 shadow-2xl flex flex-col items-center text-center">
            <button
              onClick={() => setShowCouplesModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 p-3.5 flex items-center justify-center shadow-[0_0_24px_rgba(244,114,182,0.6)] mb-4">
              <span className="text-3xl">💖</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-display font-extrabold uppercase tracking-widest mb-2 shadow-[0_0_12px_rgba(236,72,153,0.3)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMING SOON</span>
            </div>

            <h2 className="font-display font-black text-2xl text-white tracking-tight">
              COUPLES <span className="text-pink-400">CHAOS</span>
            </h2>

            <p className="text-gray-300 text-xs mt-2 leading-relaxed max-w-xs">
              A dedicated 2-player experience crafted for partners. Playful disagreements, secret partner predictions, &ldquo;Same Brain&rdquo; challenges, and surprising relationship reveals.
            </p>

            <div className="w-full my-4 p-3 rounded-2xl bg-pink-950/40 border border-pink-800/40 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-pink-200">
                <span>🎯</span>
                <span className="font-medium"><strong>Who Knows Who:</strong> Predict your partner&apos;s answer</span>
              </div>
              <div className="flex items-center gap-2 text-pink-200">
                <span>🧠</span>
                <span className="font-medium"><strong>Same Brain:</strong> Rank dilemmas and compare alignment</span>
              </div>
              <div className="flex items-center gap-2 text-pink-200">
                <span>🔥</span>
                <span className="font-medium"><strong>No Therapy:</strong> 100% comedy, fun & laughter</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCouplesModal(false);
                onCreateParty();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_8px_20px_rgba(236,72,153,0.4)] active:scale-95 transition-all"
            >
              PLAY PARTY MODE WITH CREW
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

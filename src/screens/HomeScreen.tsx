import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Settings,
  ChevronRight,
  BarChart3,
  Layers,
  Trophy,
  ShoppingCart,
  X,
  Sparkles,
} from "lucide-react";
import { SettingsModal } from "../components/organisms/SettingsModal";
import { HowToPlayModal } from "../components/organisms/HowToPlayModal";
import { PlayerProfileModal } from "../components/organisms/PlayerProfileModal";
import { HostPassModal } from "../components/organisms/HostPassModal";
import { PlayerStorage, StoredProfile, ActiveSession } from "../services/storage/player-storage";
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

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between bg-gradient-to-b from-[#130526] via-[#1C0739] to-[#2B0C54] overflow-hidden select-none">
      {/* Top Header Controls (Matching Screen_1.png) */}
      <header className="relative z-10 w-full max-w-sm mx-auto flex items-center justify-between pt-3 pb-1 px-4 flex-shrink-0">
        <button
          onClick={() => {
            audio.play("click");
            setShowHowToPlay(true);
          }}
          className="flex items-center gap-2 group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#250F47]/90 border border-purple-400/30 flex items-center justify-center text-white shadow-md">
            <HelpCircle className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <span className="text-[13px] font-semibold text-white/95 tracking-wide">
            How to Play
          </span>
        </button>

        <button
          onClick={() => {
            audio.play("click");
            setShowSettings(true);
          }}
          className="w-9 h-9 rounded-2xl bg-[#250F47]/90 border border-purple-400/30 flex items-center justify-center text-white shadow-md active:scale-95 transition-transform cursor-pointer hover:border-purple-300/50"
        >
          <Settings className="w-5 h-5 text-white stroke-[2]" />
        </button>
      </header>

      {/* Center Hero Section with Large 3D Logo (Matching Screen_1.png) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4 flex-shrink-0">
        <div className="relative flex items-center justify-center w-full max-w-[340px] aspect-square max-h-[35vh]">
          <img
            src="/Logo_Transparent.png"
            alt="CHAOS — Make a Decision, Deal with the CHAOS"
            className="w-full h-full object-contain drop-shadow-[0_16px_40px_rgba(224,24,68,0.5)] cursor-pointer active:scale-95 transition-transform"
            onClick={() => {
              audio.play("fanfare");
              haptics.trigger("chaos_moment");
            }}
          />
        </div>

        {/* Tagline */}
        <div className="text-center mt-1 mb-2">
          <h1 className="font-display font-black text-2xl sm:text-[28px] italic tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-none">
            MAKE A DECISION.
          </h1>
          <h2 className="font-display font-black text-2xl sm:text-[28px] italic tracking-tight text-[#FFD23F] drop-shadow-[0_2px_14px_rgba(255,210,63,0.6)] leading-tight mt-1">
            DEAL WITH THE CHAOS.
          </h2>
        </div>
      </div>

      {/* 3 Main Action Cards (Matching Screen_1.png) */}
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-3 px-4 my-auto flex-shrink-0">
        {/* Active Session Rejoin Button */}
        {activeSession && (
          <div className="relative group w-full">
            <button
              onClick={() => {
                audio.play("click");
                haptics.trigger("heavy");
                onRejoinSession?.(activeSession);
              }}
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left animate-pulse"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⚡</span>
                <div>
                  <h3 className="font-display font-black text-xs text-white uppercase tracking-wide">
                    REJOIN LIVE GAME ({activeSession.roomCode})
                  </h3>
                  <p className="text-emerald-100 text-[10px]">
                    Room is active • Tap to resume
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
            {onDismissSession && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audio.play("click");
                  onDismissSession();
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/80 hover:bg-black border border-white/30 text-gray-300 hover:text-white flex items-center justify-center shadow-lg active:scale-95 transition-all z-20"
                title="Dismiss active game"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* 1. CREATE GAME Button */}
        <button
          onClick={handleCreate}
          className="w-full rounded-2xl bg-gradient-to-b from-[#FF2B4D] via-[#E10B35] to-[#99001D] border-t border-white/40 border-b border-red-950 shadow-[0_8px_25px_rgba(225,11,53,0.45)] px-4 py-3 sm:py-3.5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-10 h-10 flex items-center justify-center pr-3.5 border-r border-white/20 flex-shrink-0">
              <span className="text-3xl filter drop-shadow">👑</span>
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-display font-black text-[17px] sm:text-lg text-white tracking-wide uppercase leading-tight drop-shadow-sm">
                CREATE GAME
              </h3>
              <p className="text-white/85 text-[12px] font-medium leading-tight mt-0.5">
                Host a game with your friends
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/90 stroke-[2.5] flex-shrink-0 ml-2" />
        </button>

        {/* 2. JOIN GAME Button */}
        <button
          onClick={handleJoin}
          className="w-full rounded-2xl bg-gradient-to-b from-[#4C1E84] via-[#351067] to-[#1E0544] border-t border-purple-300/40 border-b border-purple-950 shadow-[0_8px_25px_rgba(76,30,132,0.4)] px-4 py-3 sm:py-3.5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-10 h-10 flex items-center justify-center pr-3.5 border-r border-white/15 flex-shrink-0">
              <span className="text-3xl filter drop-shadow">👥</span>
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-display font-black text-[17px] sm:text-lg text-white tracking-wide uppercase leading-tight drop-shadow-sm">
                JOIN GAME
              </h3>
              <p className="text-white/75 text-[12px] font-medium leading-tight mt-0.5">
                Enter a room code
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 stroke-[2.5] flex-shrink-0 ml-2" />
        </button>

        {/* 3. COUPLES MODE Button */}
        <button
          onClick={handleCouples}
          className="w-full rounded-2xl bg-gradient-to-b from-[#D4186B] via-[#A80B52] to-[#700034] border-t border-pink-300/40 border-b border-pink-950 shadow-[0_8px_25px_rgba(212,24,107,0.35)] px-4 py-3 sm:py-3.5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-10 h-10 flex items-center justify-center pr-3.5 border-r border-white/15 flex-shrink-0">
              <span className="text-3xl filter drop-shadow">💖</span>
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-display font-black text-[17px] sm:text-lg text-white tracking-wide uppercase leading-tight drop-shadow-sm">
                COUPLES MODE
              </h3>
              <p className="text-white/75 text-[12px] font-medium leading-tight mt-0.5">
                Just the two of you
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 stroke-[2.5] flex-shrink-0 ml-2" />
        </button>
      </div>

      {/* Bottom Navigation Dock (Matching Screen_1.png) */}
      <footer className="relative z-10 w-full max-w-sm mx-auto px-4 pb-3 pt-2 flex-shrink-0">
        <div className="w-full rounded-3xl bg-[#14062B]/90 border border-purple-500/25 backdrop-blur-xl px-3 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => {
              audio.play("click");
              setShowHowToPlay(true);
            }}
            className="flex flex-col items-center text-white/95 font-semibold group cursor-pointer"
          >
            <BarChart3 className="w-5 h-5 text-white/95 mb-0.5" />
            <span className="text-[10px] tracking-wide">My Games</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              onCreateParty();
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <Layers className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">Scenarios</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              haptics.trigger("light");
              setShowProfileModal(true);
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <Trophy className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">Achievements</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              haptics.trigger("light");
              setShowHostPassModal(true);
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <ShoppingCart className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">Store</span>
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

      {/* Couples Mode Modal */}
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

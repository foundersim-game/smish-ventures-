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
import { PlayerStorage, StoredProfile } from "../services/storage/player-storage";
import { getAvatarDefinition } from "../core/constants/avatars";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface HomeScreenProps {
  onCreateParty: () => void;
  onJoinParty: () => void;
  onCouplesMode: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onCreateParty,
  onJoinParty,
  onCouplesMode,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCouplesModal, setShowCouplesModal] = useState(false);
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
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#0A0314] overflow-x-hidden select-none">
      {/* Top Header Controls (Screen 1) */}
      <header className="relative z-10 w-full flex items-center justify-between px-5 pt-8 pb-2">
        <button
          onClick={() => {
            audio.play("click");
            setShowHowToPlay(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-gray-200 text-xs font-semibold backdrop-blur-md active:scale-95 transition-all shadow-md"
        >
          <HelpCircle className="w-4 h-4 text-purple-300" />
          <span>How to Play</span>
        </button>

        {/* Profile Pill */}
        <button
          onClick={() => {
            audio.play("click");
            haptics.trigger("light");
            setShowProfileModal(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-white text-xs font-bold active:scale-95 transition-all shadow-md"
        >
          <span className="text-base">{avatarDef.emoji}</span>
          <span className="max-w-[120px] break-words">{profile.name}</span>
          <span className="text-[10px] text-yellow-300">Edit</span>
        </button>

        <button
          onClick={() => {
            audio.play("click");
            setShowSettings(true);
          }}
          className="p-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-gray-200 backdrop-blur-md active:scale-95 transition-all shadow-md"
        >
          <Settings className="w-4 h-4 text-purple-300" />
        </button>
      </header>

      {/* Center Hero Section */}
      <main className="relative z-10 flex flex-col items-center my-auto px-5 py-2">
        {/* The Exact User-Provided Transparent 3D Logo */}
        <div className="relative flex items-center justify-center my-3">
          <div className="absolute inset-0 bg-red-600/35 rounded-full blur-3xl pointer-events-none scale-110" />
          <img
            src="/logo-transparent.png"
            alt="CHAOS — Make a Decision, Deal with the CHAOS"
            className="w-72 h-auto max-h-64 md:w-80 object-contain drop-shadow-[0_16px_40px_rgba(224,24,68,0.65)] relative z-10 active:scale-95 transition-transform cursor-pointer"
            onClick={() => {
              audio.play("fanfare");
              haptics.trigger("chaos_moment");
            }}
          />
        </div>

        {/* Tagline (Screen 1) */}
        <div className="text-center mt-3 mb-6">
          <h2 className="font-display font-black text-2xl md:text-3xl italic tracking-tight text-white drop-shadow-md">
            MAKE A DECISION.
          </h2>
          <h2 className="font-display font-black text-2xl md:text-3xl italic tracking-tight text-[#FFD23F] drop-shadow-[0_2px_14px_rgba(255,210,63,0.6)]">
            DEAL WITH THE CHAOS.
          </h2>
        </div>

        {/* 3 Main Action Cards (Screen 1) */}
        <div className="w-full flex flex-col gap-3.5 max-w-sm mx-auto">
          {/* 1. CREATE GAME Button */}
          <button
            onClick={handleCreate}
            className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] border-2 border-red-400/50 shadow-[0_8px_24px_rgba(255,0,56,0.45)] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-2 flex items-center justify-center shadow-[0_0_16px_rgba(251,191,36,0.6)]">
                <span className="text-2xl filter drop-shadow">👑</span>
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white tracking-wide">
                  CREATE GAME
                </h3>
                <p className="text-red-100 text-xs font-medium">
                  Host a game with your friends
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/80" />
          </button>

          {/* 2. JOIN GAME Button */}
          <button
            onClick={handleJoin}
            className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#2B1652] via-[#200F40] to-[#180A30] border-2 border-purple-500/40 shadow-[0_8px_24px_rgba(147,51,234,0.3)] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-400 p-2 flex items-center justify-center shadow-[0_0_16px_rgba(192,132,252,0.6)]">
                <span className="text-2xl filter drop-shadow">👥</span>
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white tracking-wide">
                  JOIN GAME
                </h3>
                <p className="text-purple-200 text-xs font-medium">
                  Enter a room code & pick your avatar
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/80" />
          </button>

          {/* 3. COUPLES MODE Button (Locked to Coming Soon) */}
          <button
            onClick={handleCouples}
            className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#D91B5C]/80 via-[#B51049]/80 to-[#8E0937]/80 border-2 border-pink-500/40 shadow-[0_8px_24px_rgba(236,72,153,0.25)] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer text-left relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 p-2 flex items-center justify-center shadow-[0_0_16px_rgba(244,114,182,0.5)]">
                <span className="text-2xl filter drop-shadow">💖</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-lg text-white tracking-wide">
                    COUPLES MODE
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-pink-400/20 border border-pink-400/40 text-[9px] font-black tracking-wider text-pink-300 uppercase shadow-sm">
                    COMING SOON
                  </span>
                </div>
                <p className="text-pink-100/75 text-xs font-medium mt-0.5">
                  Dedicated 2-player mode • Teaser preview
                </p>
              </div>
            </div>
            <Lock className="w-4 h-4 text-pink-300/80 mr-1" />
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar (Screen 1) */}
      <footer className="w-full bg-[#120520] border-t border-purple-900/50 py-2.5 px-6">
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
            }}
            className="flex flex-col items-center hover:text-white"
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Store</span>
          </button>
        </div>

        {/* Legal & Compliance Links */}
        <div className="flex items-center justify-center gap-3 pt-2 text-[10px] text-gray-400 font-medium select-none">
          <Link href="/privacy" className="hover:text-amber-300 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-amber-300 transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
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

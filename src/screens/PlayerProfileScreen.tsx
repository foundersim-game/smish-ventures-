import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  ShieldCheck,
  Mail,
  Lock,
  LogOut,
  Sparkles,
  Check,
  BarChart3,
  Trophy,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { AvatarKey } from "../core/types/player.types";
import { PlayerStorage, StoredProfile } from "../services/storage/player-storage";
import { AvatarPicker } from "../components/molecules/AvatarPicker";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface PlayerProfileScreenProps {
  onBack: () => void;
  onOpenHome: () => void;
  onOpenAchievements: () => void;
  onOpenStore: () => void;
  onSaved?: (name: string, avatar: AvatarKey) => void;
}

export const PlayerProfileScreen: React.FC<PlayerProfileScreenProps> = ({
  onBack,
  onOpenHome,
  onOpenAchievements,
  onOpenStore,
  onSaved,
}) => {
  const profile = PlayerStorage.getProfile();
  const [name, setName] = useState(profile.name || "");
  const [avatar, setAvatar] = useState<AvatarKey>(profile.avatar || "crown");
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");

  // Account State
  const [account, setAccount] = useState(PlayerStorage.getAccount());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    PlayerStorage.saveProfile({ name: name.trim(), avatar });
    audio.play("click");
    haptics.trigger("heavy");
    if (onSaved) onSaved(name.trim(), avatar);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateAccount = () => {
    if (!email.trim() || !password.trim()) {
      setAuthMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setAuthMsg("Password must be at least 6 characters.");
      return;
    }
    const newAccount = {
      email: email.trim(),
      isLoggedIn: true,
      createdAt: Date.now(),
    };
    PlayerStorage.saveAccount(newAccount);
    setAccount(newAccount);
    setAuthMsg("Account created! Stats and badges are synced to cloud.");
    audio.play("fanfare");
    haptics.trigger("chaos_moment");
  };

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      setAuthMsg("Please enter your email and password.");
      return;
    }
    const newAccount = {
      email: email.trim(),
      isLoggedIn: true,
      createdAt: Date.now(),
    };
    PlayerStorage.saveAccount(newAccount);
    setAccount(newAccount);
    setAuthMsg("Signed in successfully! Cloud backup active.");
    audio.play("click");
    haptics.trigger("medium");
  };

  const handleLogout = () => {
    PlayerStorage.logoutAccount();
    setAccount(null);
    setEmail("");
    setPassword("");
    setAuthMsg("Signed out. Playing as guest.");
    audio.play("click");
    haptics.trigger("light");
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between px-3.5 py-2 bg-[#090310] select-none overflow-hidden">
      {/* Top Header */}
      <header className="relative w-full max-w-sm mx-auto flex items-center justify-between z-10 flex-shrink-0 pt-1 pb-2">
        <button
          onClick={() => {
            audio.play("click");
            onBack();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-200 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h1 className="font-display font-black text-lg text-white tracking-tight uppercase">
            MY PLAYER
          </h1>
          <span className="text-[10px] font-bold text-pink-400 tracking-wider">
            IDENTITY & SQUAD STATS
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-display font-black text-xs shadow-[0_0_12px_rgba(168,85,247,0.3)]">
          👤
        </div>
      </header>

      {/* Scrollable Profile Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar w-full max-w-sm mx-auto space-y-3 pb-2">
        {/* Profile / Account Toggle Tabs */}
        <div className="flex bg-[#160B29] p-1 rounded-2xl border border-purple-800/40">
          <button
            onClick={() => {
              setActiveTab("profile");
              audio.play("click");
            }}
            className={`flex-1 py-1.5 text-xs font-display font-black uppercase rounded-xl transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Player Card
          </button>
          <button
            onClick={() => {
              setActiveTab("account");
              audio.play("click");
            }}
            className={`flex-1 py-1.5 text-xs font-display font-black uppercase rounded-xl transition-all cursor-pointer ${
              activeTab === "account"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Cloud Account
          </button>
        </div>

        {savedSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Player profile saved!</span>
          </div>
        )}

        {activeTab === "profile" ? (
          <>
            {/* Nickname Input Card */}
            <div className="p-3.5 rounded-2xl bg-[#170B2C]/90 border border-purple-500/40 shadow-lg space-y-2">
              <label className="text-purple-300 font-display font-black text-xs uppercase tracking-wider block">
                SQUAD NICKNAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={18}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your game name..."
                  className="w-full bg-[#0E051D] border-2 border-purple-500/50 focus:border-pink-500 rounded-xl px-3 py-2.5 text-white font-sans font-bold text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    const sampleNames = ["ChaosMaster", "Instigator", "TheBrain", "Wildcard", "Rebel", "Strategist"];
                    setName(sampleNames[Math.floor(Math.random() * sampleNames.length)]);
                    audio.play("click");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-pink-400 hover:text-pink-300 cursor-pointer"
                >
                  Randomize
                </button>
              </div>
            </div>

            {/* Avatar Picker Card */}
            <div className="p-3.5 rounded-2xl bg-[#170B2C]/90 border border-purple-500/40 shadow-lg space-y-2">
              <AvatarPicker selectedAvatar={avatar} onSelectAvatar={setAvatar} />
            </div>

            {/* Career Stats Card */}
            <div className="p-3.5 rounded-2xl bg-[#130724] border border-purple-900/50 space-y-2">
              <h4 className="text-purple-300 font-display font-black text-xs uppercase tracking-wider">
                CAREER SQUAD STATS
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/30">
                  <span className="font-display font-black text-base text-white block">18</span>
                  <span className="text-[9px] text-gray-400 font-bold">Games Played</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/30">
                  <span className="font-display font-black text-base text-yellow-400 block">72</span>
                  <span className="text-[9px] text-gray-400 font-bold">Decisions</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/30">
                  <span className="font-display font-black text-base text-pink-400 block">94%</span>
                  <span className="text-[9px] text-gray-400 font-bold">Chaos Rating</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_6px_20px_rgba(255,0,56,0.5)] border border-red-400/50 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>SAVE PLAYER PROFILE</span>
            </button>
          </>
        ) : (
          /* Cloud Account Tab */
          <div className="p-4 rounded-2xl bg-[#170B2C]/90 border border-purple-500/40 shadow-lg space-y-3">
            {account?.isLoggedIn ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-xs">Cloud Backup Connected</h4>
                    <p className="text-gray-300 text-[10px]">{account.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h4 className="font-display font-black text-white text-sm">
                    SYNC STATS & BADGES ACROSS DEVICES
                  </h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Save your level, achievements, and unlock history across games.
                  </p>
                </div>

                {authMsg && (
                  <div className="p-2 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs">
                    {authMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-[#0E051D] border border-purple-500/40 rounded-xl pl-9 pr-3 py-2 text-white text-xs outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (min 6 characters)"
                      className="w-full bg-[#0E051D] border border-purple-500/40 rounded-xl pl-9 pr-3 py-2 text-white text-xs outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSignIn}
                    className="flex-1 py-2.5 rounded-xl bg-purple-800/80 hover:bg-purple-700 text-white font-bold text-xs active:scale-95 transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleCreateAccount}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs active:scale-95 transition-all shadow-md"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Frosted Glass Dock */}
      <footer className="relative z-20 w-full max-w-sm mx-auto px-4 pb-2 pt-1 flex-shrink-0">
        <div className="w-full bg-[#1A0B2E]/90 backdrop-blur-md rounded-2xl border border-purple-500/30 px-3 py-2 flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => {
              audio.play("click");
              onOpenHome();
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <BarChart3 className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">Home</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
            }}
            className="flex flex-col items-center text-white transition-colors cursor-pointer group"
          >
            <User className="w-5 h-5 text-[#FF2A6D] mb-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wide text-white">My Player</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              onOpenAchievements();
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <Trophy className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">Achievements</span>
          </button>

          <button
            onClick={() => {
              audio.play("click");
              onOpenStore();
            }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <ShoppingCart className="w-5 h-5 text-white/60 mb-0.5 group-hover:text-white" />
            <span className="text-[10px] tracking-wide">Store</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

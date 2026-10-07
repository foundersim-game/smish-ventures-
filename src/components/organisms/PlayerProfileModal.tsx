import React, { useState } from "react";
import { X, Check, User, ShieldCheck, Mail, Lock, LogOut, Sparkles } from "lucide-react";
import { AvatarKey } from "../../core/types/player.types";
import { PlayerStorage } from "../../services/storage/player-storage";
import { AvatarPicker } from "../molecules/AvatarPicker";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (name: string, avatar: AvatarKey) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  onClose,
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

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    PlayerStorage.saveProfile({ name: name.trim(), avatar });
    audio.play("click");
    haptics.trigger("heavy");
    if (onSaved) onSaved(name.trim(), avatar);
    onClose();
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
    setAuthMsg("Account created! Stats and profile are now synced to cloud.");
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
    setAuthMsg("Signed in successfully! Cloud sync active.");
    audio.play("click");
    haptics.trigger("medium");
  };

  const handleLogout = () => {
    PlayerStorage.logoutAccount();
    setAccount(null);
    setEmail("");
    setPassword("");
    setAuthMsg("Signed out. Playing as local guest.");
    audio.play("click");
    haptics.trigger("light");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#150A26] border-2 border-purple-500/50 p-4 sm:p-5 shadow-2xl flex flex-col max-h-[85dvh] overflow-hidden justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between flex-shrink-0 pb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-black text-xl text-white tracking-wide">
              PLAYER PROFILE
            </h3>
            {account?.isLoggedIn && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] text-emerald-300 font-extrabold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SYNCED
              </span>
            )}
          </div>
          <button
            onClick={() => {
              audio.play("click");
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-purple-950/70 border border-purple-800/40 mb-3 flex-shrink-0">
          <button
            onClick={() => {
              setActiveTab("profile");
              audio.play("click");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-display font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "profile"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Avatar</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("account");
              audio.play("click");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-display font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "account"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{account?.isLoggedIn ? "Account Synced" : "Create Account"}</span>
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-3 py-1">
          {activeTab === "profile" && (
            <>
              {/* Nickname Input */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  NICKNAME
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter nickname"
                  className="w-full py-2 px-3 rounded-xl bg-purple-950/70 border border-purple-600/50 text-white font-bold text-sm outline-none focus:border-yellow-400 transition-all"
                />
              </div>

              {/* Avatar Picker with perfectly scaled scroll grid */}
              <AvatarPicker
                selectedAvatar={avatar}
                onSelectAvatar={(key) => setAvatar(key)}
              />

              {/* Guest / Account Callout */}
              {!account?.isLoggedIn && (
                <div
                  onClick={() => setActiveTab("account")}
                  className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-700/40 flex items-center justify-between cursor-pointer hover:bg-purple-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                    <span className="text-[11px] text-purple-200 font-semibold leading-tight">
                      Playing as guest. Tap to create a free account & save stats.
                    </span>
                  </div>
                  <span className="text-yellow-400 text-xs font-bold flex-shrink-0 ml-1">
                    Sign Up →
                  </span>
                </div>
              )}
            </>
          )}

          {activeTab === "account" && (
            <div className="flex flex-col gap-3 py-1">
              {account?.isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-display font-extrabold text-sm">
                        ACCOUNT ACTIVE & SYNCED
                      </span>
                    </div>
                    <p className="text-emerald-200 text-xs font-medium">
                      Signed in as <span className="font-bold text-white">{account.email}</span>
                    </p>
                    <p className="text-gray-400 text-[11px] mt-1">
                      Lifetime match history, unlocks, and saboteur stats are automatically saved to your cloud profile.
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-gray-200 font-display font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <p className="text-gray-300 text-xs leading-snug">
                    Create a free CHAOS account or sign in to sync lifetime game history, unlock badges, and host from any device.
                  </p>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      EMAIL ADDRESS
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-600/50">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-transparent text-white font-medium text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      PASSWORD
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-600/50">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-white font-medium text-xs outline-none"
                      />
                    </div>
                  </div>

                  {authMsg && (
                    <p className="text-yellow-300 text-[11px] font-medium leading-tight">
                      {authMsg}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={handleCreateAccount}
                      className="py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-display font-extrabold text-xs uppercase shadow-md active:scale-95 transition-all text-center"
                    >
                      Create Account
                    </button>
                    <button
                      onClick={handleSignIn}
                      className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-display font-bold text-xs uppercase active:scale-95 transition-all text-center"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ALWAYS PINNED Save CTA (Never cut off or overlapping!) */}
        <div className="pt-2 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white font-display font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>SAVE PROFILE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  User,
  ShieldCheck,
  Mail,
  KeyRound,
  LogOut,
  Sparkles,
  Check,
  BarChart3,
  Trophy,
  ShoppingCart,
  Zap,
  ArrowRight,
  RefreshCw,
  Trash2,
  Crown,
  Gamepad2,
} from "lucide-react";
import { AvatarKey } from "../core/types/player.types";
import { AVATAR_CATALOG } from "../core/constants/avatars";
import { PlayerStorage, StoredProfile, UserAccount } from "../services/storage/player-storage";
import { AvatarPicker } from "../components/molecules/AvatarPicker";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";
import { AuthClient } from "../services/auth/auth-client";
import { NativePaymentService } from "../services/payments/native-payment.service";

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
  const currentAvatarDef = AVATAR_CATALOG.find((a) => a.key === avatar) || AVATAR_CATALOG[0];
  const passStatus = PlayerStorage.getHostPass();

  // Account State
  const [account, setAccount] = useState<UserAccount | null>(PlayerStorage.getAccount());
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMsg, setAuthMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);

  useEffect(() => {
    // Listen for OAuth redirect state changes
    const unsub = AuthClient.initAuthListener((updated) => {
      setAccount(updated);
    });
    return unsub;
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    PlayerStorage.saveProfile({ name: name.trim(), avatar });
    audio.play("click");
    haptics.trigger("heavy");
    if (onSaved) onSaved(name.trim(), avatar);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes("@")) {
      setAuthMsg({ text: "Please enter a valid email address.", isError: true });
      return;
    }
    setIsLoading(true);
    setAuthMsg(null);
    audio.play("click");
    haptics.trigger("light");

    const res = await AuthClient.requestEmailOtp(email);
    setIsLoading(false);
    if (res.success) {
      setOtpSent(true);
      setAuthMsg({ text: res.message || "Access code sent to your email! Enter the 6-digit PIN below." });
      audio.play("click");
    } else {
      setAuthMsg({ text: res.error || "Failed to send code. Please try again.", isError: true });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setAuthMsg({ text: "Please enter the complete 6-digit verification code.", isError: true });
      return;
    }
    setIsLoading(true);
    setAuthMsg(null);
    audio.play("click");

    const res = await AuthClient.verifyEmailOtp(email, otpCode);
    setIsLoading(false);
    if (res.success && res.account) {
      setAccount(res.account);
      setOtpSent(false);
      setOtpCode("");
      setAuthMsg({ text: "Account verified! Your scores & stats are backed up." });
      audio.play("fanfare");
      haptics.trigger("chaos_moment");
    } else {
      setAuthMsg({ text: res.error || "Invalid code. Please check your inbox and try again.", isError: true });
      haptics.trigger("medium");
    }
  };

  const handleGoogleSignIn = async () => {
    audio.play("click");
    haptics.trigger("light");
    setIsLoading(true);
    const res = await AuthClient.signInWithGoogle();
    setIsLoading(false);
    if (res.success) {
      setAccount(PlayerStorage.getAccount());
      setAuthMsg({ text: "Signed in with Google! Cloud sync is live." });
      audio.play("fanfare");
    } else if (res.error) {
      setAuthMsg({ text: res.error, isError: true });
    }
  };

  const handleAppleSignIn = async () => {
    audio.play("click");
    haptics.trigger("light");
    setIsLoading(true);
    const res = await AuthClient.signInWithApple();
    setIsLoading(false);
    if (res.success) {
      setAccount(PlayerStorage.getAccount());
      setAuthMsg({ text: "Signed in with Apple! Cloud sync is live." });
      audio.play("fanfare");
    } else if (res.error) {
      setAuthMsg({ text: res.error, isError: true });
    }
  };

  const handleLogout = () => {
    PlayerStorage.logoutAccount();
    setAccount(null);
    setEmail("");
    setOtpCode("");
    setOtpSent(false);
    setAuthMsg({ text: "Signed out. Now using guest mode." });
    audio.play("click");
    haptics.trigger("light");
  };

  const handleRestorePurchases = async () => {
    setIsLoading(true);
    audio.play("click");
    haptics.trigger("light");
    try {
      const res = await NativePaymentService.restorePurchases();
      if (res.restored) {
        setRestoreMsg("Purchases restored successfully!");
      } else {
        setRestoreMsg("No active purchases found on this device.");
      }
    } catch {
      setRestoreMsg("Could not connect to App Store.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setRestoreMsg(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    audio.play("click");
    haptics.trigger("heavy");
    await AuthClient.deleteAccount();
    setIsLoading(false);
    setShowDeleteConfirm(false);
    setAccount(null);
    setEmail("");
    setOtpCode("");
    setOtpSent(false);
    setAuthMsg({ text: "Account & game data permanently deleted." });
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
            Account
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
          <div className="space-y-3.5">
            {account?.isLoggedIn ? (
              /* Signed In: Clean CHAOS Account Card */
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1C0A33] via-[#140626] to-[#0D031A] border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] space-y-4 relative overflow-hidden">
                {/* Subtle Ambient Glows */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-600/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

                {/* Player Identity Header */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr ${currentAvatarDef.gradient} ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] flex-shrink-0`}
                  >
                    <span className="text-3xl filter drop-shadow">{currentAvatarDef.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-base text-white tracking-wide truncate">
                        {name || "CHAOS Player"}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[9px] font-extrabold text-emerald-300 flex items-center gap-1 uppercase tracking-wider flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIVE
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-purple-900/70 border border-purple-700/60 text-[9px] font-black text-purple-300 uppercase flex-shrink-0">
                        {account.provider === "google"
                          ? "Google"
                          : account.provider === "apple"
                          ? "Apple"
                          : "Email"}
                      </span>
                      <span className="text-purple-200 text-xs font-mono truncate">{account.email}</span>
                    </div>
                  </div>
                </div>

                {/* Host Status & Store Access */}
                <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Host Status</div>
                      <div className="text-xs font-display font-black text-white">
                        {passStatus.hasPass
                          ? passStatus.passesRemaining === "unlimited"
                            ? "VIP Unlimited Host"
                            : `${passStatus.passesRemaining} Hosted Games Left`
                          : "Standard Party Host"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      audio.play("click");
                      onOpenStore();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 border border-purple-600/50 text-yellow-400 font-display font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Store</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Restore Purchases Button */}
                <div className="relative z-10">
                  <button
                    onClick={handleRestorePurchases}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Restore Purchases</span>
                  </button>
                  {restoreMsg && (
                    <div className="mt-1.5 text-center text-[11px] text-purple-300 font-semibold animate-fade-in">
                      {restoreMsg}
                    </div>
                  )}
                </div>

                {/* Account Actions */}
                <div className="space-y-2 pt-2 border-t border-purple-900/40 relative z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-gray-200 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-purple-300" />
                    <span>Sign Out</span>
                  </button>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => {
                        audio.play("click");
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full py-1 text-[11px] text-red-400/70 hover:text-red-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>Delete Account & Reset ID</span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/60 space-y-2 text-center animate-fade-in">
                      <p className="text-red-200 text-[11px] font-bold leading-tight">
                        Permanently delete your account and linked passes? This cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          className="flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Signed Out: Clean Link Account View */
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1C0A33] via-[#140626] to-[#0D031A] border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] space-y-3.5 relative overflow-hidden">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[10px] font-extrabold text-pink-300 uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-yellow-300" />
                    <span>CHAOS ACCOUNT</span>
                  </div>
                  <h4 className="font-display font-black text-base text-white tracking-wide uppercase">
                    LINK YOUR ACCOUNT
                  </h4>
                  <p className="text-gray-300 text-xs leading-relaxed max-w-xs mx-auto">
                    Sign in with Google, Apple, or Email to keep your game stats and host passes connected.
                  </p>
                </div>

                {authMsg && (
                  <div
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                      authMsg.isError
                        ? "bg-red-950/40 border-red-500/50 text-red-200"
                        : "bg-purple-950/50 border-purple-500/50 text-purple-200"
                    }`}
                  >
                    <span>{authMsg.text}</span>
                  </div>
                )}

                {/* Social Login Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-sans font-bold text-xs flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    onClick={handleAppleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-gray-900 border border-gray-700 text-white font-sans font-bold text-xs flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.68-10.12-11.83-21.65-15.46-34.6-3.63-12.95-5.45-25.07-5.45-36.35 0-14.94 3.63-27.17 10.89-36.7 7.26-9.52 16.36-14.39 27.31-14.6 4.8 0 10.11 1.25 15.93 3.75 5.82 2.5 9.72 3.75 11.7 3.75 1.54 0 5.58-1.29 12.13-3.86 6.55-2.58 12.01-3.71 16.37-3.39 12.39.99 22.18 5.61 29.36 13.88-10.89 6.64-16.22 15.77-16.01 27.39.22 9.06 3.69 16.74 10.41 23.05 6.72 6.31 14.86 10.05 24.42 11.22-2.18 6.42-4.99 13.1-8.44 20.06zM119.22 33.15c0-7.44 2.65-14.43 7.95-20.97 5.3-6.54 11.93-10.68 19.89-12.43.32 1.49.48 2.87.48 4.13 0 7.33-2.73 14.45-8.19 21.36-5.46 6.91-12.16 11.08-20.13 12.51-.11-1.38-.17-2.75-.17-4.6z" />
                    </svg>
                    <span>Sign in with Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 py-0.5">
                  <div className="flex-1 h-[1px] bg-purple-800/60" />
                  <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase">
                    OR EMAIL LOGIN CODE
                  </span>
                  <div className="flex-1 h-[1px] bg-purple-800/60" />
                </div>

                {/* Nodemailer Free Email OTP Flow */}
                {!otpSent ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email (e.g. alex@gmail.com)"
                        className="w-full bg-[#0E051D] border border-purple-500/40 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs outline-none focus:border-pink-500 font-sans"
                      />
                    </div>

                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading || !email.trim()}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:brightness-110 text-white font-display font-extrabold text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                      <span>SEND 6-DIGIT ACCESS CODE</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-between">
                      <span className="text-xs text-gray-300 font-mono truncate">{email}</span>
                      <button
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode("");
                          setAuthMsg(null);
                        }}
                        className="text-[10px] text-pink-400 hover:text-pink-300 font-bold ml-2 underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-yellow-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter 6-digit code"
                        className={`w-full bg-[#0E051D] border-2 border-yellow-500/50 focus:border-yellow-400 rounded-xl pl-9 pr-3 py-2.5 text-yellow-300 outline-none text-center transition-all placeholder:font-sans placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-400 placeholder:text-xs ${
                          otpCode
                            ? "font-mono font-black text-base tracking-[0.35em]"
                            : "font-sans font-medium text-xs tracking-normal"
                        }`}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otpCode.length < 6}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                        <span>VERIFY & SIGN IN</span>
                      </button>

                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                        title="Resend code"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Restore Purchases Button in Guest Mode */}
                <div className="pt-1 border-t border-purple-900/40">
                  <button
                    onClick={handleRestorePurchases}
                    disabled={isLoading}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-gray-300 font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 text-gray-400 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Restore Purchases</span>
                  </button>
                  {restoreMsg && (
                    <div className="mt-1.5 text-center text-[11px] text-purple-300 font-semibold animate-fade-in">
                      {restoreMsg}
                    </div>
                  )}
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

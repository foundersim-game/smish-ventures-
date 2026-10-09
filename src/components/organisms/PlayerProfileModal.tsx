import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  User,
  ShieldCheck,
  Mail,
  KeyRound,
  LogOut,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { AvatarKey } from "../../core/types/player.types";
import { PlayerStorage, UserAccount } from "../../services/storage/player-storage";
import { AvatarPicker } from "../molecules/AvatarPicker";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";
import { AuthClient } from "../../services/auth/auth-client";

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
  const [account, setAccount] = useState<UserAccount | null>(PlayerStorage.getAccount());
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMsg, setAuthMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const unsub = AuthClient.initAuthListener((updated) => {
      setAccount(updated);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    PlayerStorage.saveProfile({ name: name.trim(), avatar });
    audio.play("click");
    haptics.trigger("heavy");
    if (onSaved) onSaved(name.trim(), avatar);
    onClose();
  };

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes("@")) {
      setAuthMsg({ text: "Please enter a valid email address.", isError: true });
      return;
    }
    setIsLoading(true);
    setAuthMsg(null);
    audio.play("click");

    const res = await AuthClient.requestEmailOtp(email);
    setIsLoading(false);
    if (res.success) {
      setOtpSent(true);
      setAuthMsg({ text: res.message || "Code sent to your email!" });
    } else {
      setAuthMsg({ text: res.error || "Failed to send code.", isError: true });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setAuthMsg({ text: "Enter the complete 6-digit verification code.", isError: true });
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
      setAuthMsg({ text: "Account synced successfully!" });
      audio.play("fanfare");
      haptics.trigger("chaos_moment");
    } else {
      setAuthMsg({ text: res.error || "Invalid code. Please try again.", isError: true });
    }
  };

  const handleGoogleSignIn = async () => {
    audio.play("click");
    setIsLoading(true);
    const res = await AuthClient.signInWithGoogle();
    setIsLoading(false);
    if (res.success) {
      setAccount(PlayerStorage.getAccount());
      setAuthMsg({ text: "Signed in with Google!" });
      audio.play("fanfare");
    } else if (res.error) {
      setAuthMsg({ text: res.error, isError: true });
    }
  };

  const handleAppleSignIn = async () => {
    audio.play("click");
    setIsLoading(true);
    const res = await AuthClient.signInWithApple();
    setIsLoading(false);
    if (res.success) {
      setAccount(PlayerStorage.getAccount());
      setAuthMsg({ text: "Signed in with Apple!" });
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
    setAuthMsg({ text: "Signed out. Playing as guest." });
    audio.play("click");
    haptics.trigger("light");
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
    setAuthMsg({ text: "Account & data permanently deleted." });
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
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 cursor-pointer"
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
            className={`flex-1 py-1.5 rounded-lg text-xs font-display font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
            className={`flex-1 py-1.5 rounded-lg text-xs font-display font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "account"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{account?.isLoggedIn ? "Account Synced" : "Cloud Login"}</span>
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
                      Playing as guest. Tap to sign in & backup your progress.
                    </span>
                  </div>
                  <span className="text-yellow-400 text-xs font-bold flex-shrink-0 ml-1">
                    Sign In →
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
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-gray-200 font-display font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => {
                        audio.play("click");
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full py-2 text-[10px] text-red-400/80 hover:text-red-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>Delete Account & Wipe Data</span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-2xl bg-red-950/70 border border-red-500/60 space-y-2 text-center animate-fade-in">
                      <p className="text-red-200 text-[10px] font-bold leading-tight">
                        Permanently wipe account & cloud stats? This cannot be undone.
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
              ) : (
                <div className="flex flex-col gap-2.5">
                  <p className="text-gray-300 text-xs leading-snug">
                    Sign in to sync match history, unlock custom themes, and access your host pass across any device.
                  </p>

                  {authMsg && (
                    <div
                      className={`p-2 rounded-lg border text-xs font-medium ${
                        authMsg.isError
                          ? "bg-red-950/40 border-red-500/50 text-red-200"
                          : "bg-purple-950/50 border-purple-500/50 text-purple-200"
                      }`}
                    >
                      {authMsg.text}
                    </div>
                  )}

                  {/* Social Logins */}
                  <div className="space-y-2">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-sans font-bold text-xs flex items-center justify-center gap-2 shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                      className="w-full py-2 px-3 rounded-xl bg-black hover:bg-gray-900 border border-gray-700 text-white font-sans font-bold text-xs flex items-center justify-center gap-2 shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.68-10.12-11.83-21.65-15.46-34.6-3.63-12.95-5.45-25.07-5.45-36.35 0-14.94 3.63-27.17 10.89-36.7 7.26-9.52 16.36-14.39 27.31-14.6 4.8 0 10.11 1.25 15.93 3.75 5.82 2.5 9.72 3.75 11.7 3.75 1.54 0 5.58-1.29 12.13-3.86 6.55-2.58 12.01-3.71 16.37-3.39 12.39.99 22.18 5.61 29.36 13.88-10.89 6.64-16.22 15.77-16.01 27.39.22 9.06 3.69 16.74 10.41 23.05 6.72 6.31 14.86 10.05 24.42 11.22-2.18 6.42-4.99 13.1-8.44 20.06zM119.22 33.15c0-7.44 2.65-14.43 7.95-20.97 5.3-6.54 11.93-10.68 19.89-12.43.32 1.49.48 2.87.48 4.13 0 7.33-2.73 14.45-8.19 21.36-5.46 6.91-12.16 11.08-20.13 12.51-.11-1.38-.17-2.75-.17-4.6z" />
                      </svg>
                      <span>Sign in with Apple</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2 py-0.5">
                    <div className="flex-1 h-[1px] bg-purple-800/60" />
                    <span className="text-[9px] font-bold text-purple-400 uppercase">
                      OR EMAIL OTP
                    </span>
                    <div className="flex-1 h-[1px] bg-purple-800/60" />
                  </div>

                  {!otpSent ? (
                    <div className="space-y-2">
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

                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading || !email.trim()}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-display font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        <span>Send Login Code</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span className="truncate">{email}</span>
                        <button
                          onClick={() => { setOtpSent(false); setOtpCode(""); }}
                          className="text-pink-400 text-[10px] underline cursor-pointer"
                        >
                          Change
                        </button>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/70 border border-yellow-500/50">
                        <KeyRound className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="Enter 6-digit code"
                          className={`w-full bg-transparent text-yellow-300 outline-none text-center transition-all placeholder:font-sans placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-400 placeholder:text-xs ${
                            otpCode
                              ? "font-mono font-black text-sm tracking-[0.3em]"
                              : "font-sans font-medium text-xs tracking-normal"
                          }`}
                        />
                      </div>

                      <button
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otpCode.length < 6}
                        className="w-full py-2 rounded-xl bg-emerald-600 text-white font-display font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>Verify & Sign In</span>
                      </button>
                    </div>
                  )}
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

import React, { useState, useEffect } from "react";
import { Crown, Sparkles, Check, X, Share2, Zap, ShieldCheck, Users, Copy } from "lucide-react";
import { HOST_PASS_TIERS, HostPassProduct } from "../../backend/services/monetization.service";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

import { NativePaymentService } from "../../services/payments/native-payment.service";
import { AnalyticsService } from "../../services/analytics/analytics.service";
import { getApiBaseUrl } from "../../services/network/api-client";

interface HostPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPassActivated: (product: HostPassProduct | "shared") => void;
  packTitle?: string;
  roomCode?: string;
  hostPlayerId?: string;
}

export const HostPassModal: React.FC<HostPassModalProps> = ({
  isOpen,
  onClose,
  onPassActivated,
  packTitle,
  roomCode,
  hostPlayerId,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>("pass_10_games");
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [verifiedCount, setVerifiedCount] = useState<number>(0);
  const [isUnlockedByReferral, setIsUnlockedByReferral] = useState(false);
  const [refToken, setRefToken] = useState<string>("");
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  useEffect(() => {
    NativePaymentService.initialize();
  }, []);

  useEffect(() => {
    if (isOpen) {
      AnalyticsService.trackEvent("iap_opened", { roomCode });
    }
  }, [isOpen, roomCode]);

  // Initialize or fetch referral attribution for this room
  useEffect(() => {
    if (!isOpen || !roomCode) return;

    const initReferral = async () => {
      try {
        const res = await fetch(
          `${getApiBaseUrl()}/api/referrals?roomCode=${encodeURIComponent(roomCode)}&hostPlayerId=${encodeURIComponent(
            hostPlayerId || "host"
          )}`
        );
        const data = await res.json();
        if (data.success && data.attribution) {
          setRefToken(data.attribution.refToken);
          setVerifiedCount(data.attribution.verifiedVisitorIds?.length || 0);
          if (data.attribution.isUnlocked) {
            setIsUnlockedByReferral(true);
          }
        }
      } catch {
        // Fallback
      }
    };

    initReferral();

    // Poll for verified friend join while modal is open
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/referrals?roomCode=${encodeURIComponent(roomCode)}`);
        const data = await res.json();
        if (data.success && data.status) {
          setVerifiedCount(data.status.verifiedCount || 0);
          if (data.status.isUnlocked && !isUnlockedByReferral) {
            setIsUnlockedByReferral(true);
            audio.play("fanfare");
            haptics.trigger("chaos_moment");
            setTimeout(() => {
              onPassActivated("shared");
              onClose();
            }, 1400);
          }
        }
      } catch {
        // Ignore polling error
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, roomCode, hostPlayerId, isUnlockedByReferral, onPassActivated, onClose]);

  if (!isOpen) return null;

  const handleSelectTier = (tier: HostPassProduct) => {
    setSelectedTierId(tier.id);
    audio.play("click");
    haptics.trigger("light");
  };

  const handlePurchase = async () => {
    const tier = HOST_PASS_TIERS.find((t) => t.id === selectedTierId) || HOST_PASS_TIERS[1];
    setIsProcessing(true);
    audio.play("lock");
    haptics.trigger("heavy");

    try {
      const result = await NativePaymentService.purchase(tier, roomCode);
      if (result.success) {
        AnalyticsService.trackEvent("iap_purchased", {
          tierId: tier.id,
          priceUsd: tier.priceUsd,
          roomCode,
        });
        audio.play("fanfare");
        onPassActivated(tier);
        onClose();
      } else {
        console.warn("[HostPassModal] Purchase cancelled or failed:", result.error);
      }
    } catch (err) {
      console.error("[HostPassModal] Purchase exception:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    audio.play("click");
    try {
      const result = await NativePaymentService.restorePurchases();
      AnalyticsService.trackEvent("iap_restored", {
        restored: result.restored,
      });
      setRestoreMessage(result.message);
      setTimeout(() => setRestoreMessage(null), 3500);
    } catch {
      setRestoreMessage("Unable to connect to App Store. Please try again.");
      setTimeout(() => setRestoreMessage(null), 3500);
    } finally {
      setIsProcessing(false);
    }
  };

  const getInviteLink = () => {
    if (typeof window === "undefined") return "https://playchaos.app";
    const origin = window.location.origin;
    const base = window.location.pathname.startsWith("/chaos") ? "/chaos" : "";
    const code = roomCode ? roomCode.toUpperCase() : "";
    const token = refToken || `REF-${code}`;
    return `${origin}${base}?join=${code}&ref=${encodeURIComponent(token)}`;
  };

  const handleShareInvite = async () => {
    audio.play("click");
    haptics.trigger("medium");
    AnalyticsService.trackEvent("recap_shared", {
      type: "referral_invite",
      roomCode,
    });
    const link = getInviteLink();
    const shareText = `🔥 We're playing CHAOS tonight! Join our squad lobby with code: ${roomCode || "CHAOS"}! Tap here to join: ${link}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join our CHAOS Game!",
          text: shareText,
          url: link,
        });
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch {
      // Ignore
    }
  };

  const [activeTab, setActiveTab] = useState<"pass" | "invite">("pass");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#140A26] border border-amber-400/40 p-4 shadow-[0_0_40px_rgba(251,191,36,0.3)] flex flex-col relative max-h-[88dvh] overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-28 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            audio.play("click");
            onClose();
          }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex flex-col items-center text-center mt-0.5 flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-display font-black tracking-widest uppercase mb-1 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            <span>HOST PASS & PERKS</span>
          </div>

          <h3 className="font-display font-black text-lg text-white tracking-tight">
            {packTitle ? `UNLOCK ${packTitle}` : "UPGRADE GAME NIGHT"}
          </h3>
          <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">
            1 Host unlocks ad-free gameplay for all players.
          </p>

          {/* Segmented Tab Switch */}
          <div className="w-full grid grid-cols-2 gap-1 p-1 bg-purple-950/70 border border-purple-800/40 rounded-xl mt-2.5">
            <button
              onClick={() => {
                setActiveTab("pass");
                audio.play("click");
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-display font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "pass"
                  ? "bg-amber-400 text-black shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Pass Tiers</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("invite");
                audio.play("click");
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-display font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "invite"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Free with 1 Friend</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Pass Tiers */}
        {activeTab === "pass" && (
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto no-scrollbar pt-2.5">
            {/* Product Tiers */}
            <div className="flex flex-col gap-1.5">
              {HOST_PASS_TIERS.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => handleSelectTier(tier)}
                    className={`relative w-full py-2 px-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-500/20 to-purple-600/20 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        : "bg-[#1E1138]/60 border-purple-800/30 hover:border-purple-600/50"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black text-[8px] font-black uppercase tracking-wider shadow">
                        POPULAR
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "border-amber-400 bg-amber-400 text-black"
                            : "border-gray-500 bg-transparent text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>

                      <div>
                        <h4 className="font-display font-extrabold text-xs text-white leading-tight">
                          {tier.name}
                        </h4>
                        <p className="text-gray-400 text-[10px] leading-tight">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right pl-2 flex-shrink-0">
                      <span className="font-display font-black text-sm text-amber-300">
                        {tier.priceDisplay}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-3 pt-2 border-t border-purple-900/40 flex-shrink-0">
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-black font-display font-black text-xs uppercase tracking-wider shadow-[0_4px_18px_rgba(245,158,11,0.4)] border border-amber-300 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-black text-black" />
                <span>{isProcessing ? "PROCESSING..." : "ACTIVATE HOST PASS"}</span>
              </button>

              <div className="text-center mt-1.5">
                <button
                  onClick={handleRestore}
                  disabled={isProcessing}
                  className="text-[10px] text-gray-400 hover:text-amber-300 transition-colors underline cursor-pointer"
                >
                  Restore Purchases
                </button>
                {restoreMessage && (
                  <p className="text-[10px] text-emerald-300 mt-0.5 font-semibold">
                    {restoreMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Free Unlock via Referral */}
        {activeTab === "invite" && (
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto no-scrollbar pt-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="font-display font-black text-sm text-white">
                Unlock Free Ad-Free Game
              </h4>
              <p className="text-[11px] text-gray-300 mt-1 max-w-[260px] leading-relaxed">
                Send your invite link to a friend. As soon as 1 friend joins the lobby, this entire session unlocks ad-free for everyone!
              </p>

              {/* Status pill */}
              <div
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold mt-3 mb-2 flex items-center justify-between ${
                  isUnlockedByReferral || verifiedCount >= 1
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-purple-950/60 border-purple-700/50 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                  <span>
                    {isUnlockedByReferral || verifiedCount >= 1
                      ? "Friend Verified! Unlocked!"
                      : "Unique Friends Joined:"}
                  </span>
                </div>
                <span
                  className={`font-display font-black text-xs px-2 py-0.5 rounded-full ${
                    isUnlockedByReferral || verifiedCount >= 1
                      ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/50"
                      : "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                  }`}
                >
                  {verifiedCount} / 1
                </span>
              </div>
            </div>

            <div className="mt-2 flex-shrink-0">
              <button
                onClick={handleShareInvite}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-display font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  linkCopied
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 text-black border-emerald-400 shadow-md active:scale-98"
                }`}
              >
                {linkCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>INVITE LINK COPIED!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-black" />
                    <span>SHARE INVITE LINK</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[9px] text-gray-500 mt-2">
                <ShieldCheck className="w-2.5 h-2.5 text-gray-400" />
                <span>Verified Device Attribution • 100% Free Forever</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

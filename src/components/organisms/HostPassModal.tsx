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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#140A26] border-2 border-amber-400/50 p-5 shadow-[0_0_50px_rgba(251,191,36,0.3)] flex flex-col relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            audio.play("click");
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex flex-col items-center text-center mt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-display font-black tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>HOST PASS & EXPANSIONS</span>
          </div>

          <h3 className="font-display font-black text-2xl text-white tracking-tight">
            {packTitle ? `UNLOCK ${packTitle}` : "UPGRADE YOUR GAME NIGHT"}
          </h3>
          <p className="text-gray-300 text-xs mt-1 leading-relaxed">
            1 Host unlocks the room for everyone. Zero ads, unlimited players, and full scenario access.
          </p>
        </div>

        {/* Product Tiers */}
        <div className="flex flex-col gap-2 my-4">
          {HOST_PASS_TIERS.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => handleSelectTier(tier)}
                className={`relative w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500/25 to-purple-600/25 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                    : "bg-[#1E1138]/70 border-purple-800/40 hover:border-purple-600/60"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black text-[9px] font-black uppercase tracking-wider shadow">
                    MOST POPULAR
                  </span>
                )}

                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-amber-400 bg-amber-400 text-black"
                        : "border-gray-500 bg-transparent text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-sm text-white leading-tight">
                      {tier.name}
                    </h4>
                    <p className="text-gray-400 text-[11px] leading-tight mt-0.5">
                      {tier.description}
                    </p>
                  </div>
                </div>

                <div className="text-right pl-2">
                  <span className="font-display font-black text-lg text-amber-300">
                    {tier.priceDisplay}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Purchase CTA */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-black font-display font-black text-sm uppercase tracking-wider shadow-[0_6px_25px_rgba(245,158,11,0.5)] border border-amber-300 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-black text-black" />
          <span>{isProcessing ? "PROCESSING..." : "ACTIVATE HOST PASS"}</span>
        </button>

        {/* Restore Purchases (Mandatory App Store Guideline 3.1.1) */}
        <div className="text-center mt-2">
          <button
            onClick={handleRestore}
            disabled={isProcessing}
            className="text-[11px] text-gray-400 hover:text-amber-300 transition-colors underline cursor-pointer"
          >
            Restore App Store / Google Play Purchases
          </button>
          {restoreMessage && (
            <p className="text-[10px] text-emerald-300 mt-1 animate-fade-in font-semibold">
              {restoreMessage}
            </p>
          )}
        </div>

        {/* Verified Viral Referral Card (Proof-of-Reach Engine) */}
        <div className="mt-3 pt-3 border-t border-purple-800/40 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-200 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>OR UNLOCK FREE: GET 1 FRIEND TO JOIN</span>
          </div>

          <p className="text-[11px] text-gray-400 mb-2.5 leading-snug">
            Share this link to your group chat. When 1 unique friend opens it on their phone and enters the lobby, this room unlocks ad-free!
          </p>

          {/* Verification Status Pill */}
          <div
            className={`w-full py-2 px-3 rounded-xl border text-xs font-bold mb-2 flex items-center justify-between ${
              isUnlockedByReferral || verifiedCount >= 1
                ? "bg-green-500/20 border-green-400 text-green-300 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                : "bg-purple-950/60 border-purple-700/50 text-gray-300"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-300" />
              <span>
                {isUnlockedByReferral || verifiedCount >= 1
                  ? "Friend Verified! Pass Unlocked!"
                  : "Unique Friends Joined:"}
              </span>
            </div>
            <span
              className={`font-display font-black text-xs px-2 py-0.5 rounded-full ${
                isUnlockedByReferral || verifiedCount >= 1
                  ? "bg-green-500/30 text-green-200 border border-green-400/50"
                  : "bg-amber-400/20 text-amber-300 border border-amber-400/40"
              }`}
            >
              {verifiedCount} / 1
            </span>
          </div>

          <button
            onClick={handleShareInvite}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-display font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              linkCopied
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-purple-900/50 border-purple-500/50 text-purple-200 hover:bg-purple-800/60 active:scale-98"
            }`}
          >
            {linkCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>INVITE LINK COPIED! PASTE IN CHAT</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-purple-300" />
                <span>SHARE INVITE LINK TO UNLOCK</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 mt-2.5">
          <ShieldCheck className="w-3 h-3 text-gray-400" />
          <span>Verified Device Tracking • Prevents Spam • Ad-Free for All</span>
        </div>
      </div>
    </div>
  );
};

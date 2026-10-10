import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Crown,
  Sparkles,
  Zap,
  Check,
  Share2,
  Copy,
  ShieldCheck,
  Users,
  Trophy,
  BarChart3,
  User,
  ShoppingCart,
  Flame,
} from "lucide-react";
import { HOST_PASS_TIERS, HostPassProduct } from "../backend/services/monetization.service";
import { PlayerStorage, HostPassStatus } from "../services/storage/player-storage";
import { getAvatarDefinition } from "../core/constants/avatars";
import { NativePaymentService } from "../services/payments/native-payment.service";
import { BottomNavigationDock } from "../components/molecules/BottomNavigationDock";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface StoreScreenProps {
  onBack: () => void;
  onOpenHome: () => void;
  onOpenProfile: () => void;
  onOpenAchievements: () => void;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({
  onBack,
  onOpenHome,
  onOpenProfile,
  onOpenAchievements,
}) => {
  const [passStatus, setPassStatus] = useState<HostPassStatus>(PlayerStorage.getHostPass());
  const [profile, setProfile] = useState(PlayerStorage.getProfile());
  const [selectedTierId, setSelectedTierId] = useState<string>("pass_50_games");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  useEffect(() => {
    NativePaymentService.initialize();
    setProfile(PlayerStorage.getProfile());
  }, []);

  const avatarDef = getAvatarDefinition(profile.avatar);

  const handleBuyPass = async (tier: HostPassProduct) => {
    setIsProcessing(true);
    audio.play("click");
    haptics.trigger("medium");

    try {
      const result = await NativePaymentService.purchase(tier);
      if (result.success) {
        PlayerStorage.activatePass(tier.id, tier.hostedGamesCount);
        setPassStatus(PlayerStorage.getHostPass());
        setPurchaseSuccess(`Unlocked ${tier.name}! You are ready to host.`);
        audio.play("fanfare");
        haptics.trigger("chaos_moment");
      }
    } catch (e) {
      console.warn("Purchase failed:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyInvite = async () => {
    const refCode = PlayerStorage.getReferralCode();
    const inviteUrl = `https://www.smishventures.com/chaos?ref=${refCode}`;
    const shareText = `🎮 Play CHAOS with me! Make wild group decisions, expose your friends, and survive the chaos.\nDownload the app: ${inviteUrl}`;

    audio.play("click");
    haptics.trigger("light");

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Join me on CHAOS!",
          text: shareText,
          url: inviteUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleRestore = async () => {
    audio.play("click");
    haptics.trigger("light");
    const restored = await NativePaymentService.restorePurchases();
    if (restored.restored) {
      setPurchaseSuccess("Purchases restored successfully!");
    } else {
      setPurchaseSuccess("No previous purchases found on this device.");
    }
    setTimeout(() => setPurchaseSuccess(null), 3000);
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between bg-[#090310] select-none overflow-hidden">
      {/* Top Header */}
      <header className="relative w-full max-w-sm mx-auto flex items-center justify-between z-10 flex-shrink-0 pt-3 pb-1 px-4">
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
            CHAOS STORE
          </h1>
          <span className="text-[10px] font-bold text-yellow-400 tracking-wider">
            HOST PASSES & SQUAD UNLOCKS
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 font-display font-black text-xs shadow-[0_0_12px_rgba(236,72,153,0.3)]">
          💎
        </div>
      </header>

      {/* Scrollable Store Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar w-full max-w-sm mx-auto space-y-3 px-4 pb-2">
        {/* Active Pass Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/90 via-[#1D0830] to-pink-950/90 border border-purple-500/40 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarDef.gradient} border ${avatarDef.borderClass} flex items-center justify-center text-xl shadow-md`}>
              {avatarDef.emoji}
            </div>
            <div>
              <span className="text-[9.5px] font-black uppercase text-purple-300 tracking-wider block">
                YOUR HOST STATUS
              </span>
              <h4 className="font-display font-black text-white text-sm">
                {passStatus.hasPass
                  ? passStatus.passesRemaining === "unlimited"
                    ? "UNLIMITED HOST PASS"
                    : `${passStatus.passesRemaining} GAMES REMAINING`
                  : "FREE GUEST PASS (0 HOST CREDITS)"}
              </h4>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
            {passStatus.hasPass ? "ACTIVE" : "GUEST"}
          </span>
        </div>

        {/* Success Alert */}
        {purchaseSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold text-center animate-fade-in">
            {purchaseSuccess}
          </div>
        )}

        {/* Viral Referral Free Pass Card */}
        {(() => {
          const hasClaimed = PlayerStorage.hasClaimedReferralReward();
          return (
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#2B1038] to-[#150720] border-2 border-amber-400/50 shadow-[0_0_20px_rgba(250,204,21,0.25)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-display font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {hasClaimed ? "CLAIMED (1/1) • 1ST PARTY BONUS" : "100% FREE SQUAD UNLOCK"}
                </span>
                <span className="text-xs">{hasClaimed ? "✓" : "⚡"}</span>
              </div>

              <h3 className="font-display font-black text-base text-white tracking-tight mt-1">
                {hasClaimed ? "1ST PARTY BONUS CLAIMED!" : "INVITE 1 FRIEND, YOUR 1ST PARTY IS FREE!"}
              </h3>
              <p className="text-gray-300 text-[11px] mt-0.5 leading-snug">
                {hasClaimed
                  ? "You unlocked your 1 free welcome pass! For your upcoming parties, grab a 10-Game Squad Pass ($2.99) to keep hosting ad-free."
                  : "Share CHAOS with a squad friend. When they open the link & download the app, you instantly unlock 1 Free Party Pass (Welcome Gift)."}
              </p>

              <button
                onClick={handleCopyInvite}
                className="w-full mt-2.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-950 font-display font-black text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>INVITE LINK COPIED!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{hasClaimed ? "SHARE CHAOS WITH FRIENDS" : "SHARE INVITE LINK"}</span>
                  </>
                )}
              </button>
            </div>
          );
        })()}

        {/* Host Pass Product Tiers */}
        <div className="space-y-2">
          <div className="px-1 flex items-center justify-between">
            <h3 className="font-display font-black text-xs text-purple-300 uppercase tracking-wider">
              OFFICIAL HOST PASSES
            </h3>
            <span className="text-[10px] text-gray-400 font-medium">Only host pays • Squad plays free</span>
          </div>

          {HOST_PASS_TIERS.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            const isPopular = Boolean(tier.popular);

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTierId(tier.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-gradient-to-b from-[#2E0F3E] to-[#170524] border-2 border-[#FF0038] shadow-[0_0_24px_rgba(255,0,56,0.35)] scale-[1.01]"
                    : "bg-[#180A2E]/80 border-purple-800/40 hover:bg-[#200D3C]"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-950 font-display font-black text-[9px] uppercase tracking-wider shadow-md">
                    ★ MOST POPULAR
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-black text-base text-white tracking-tight flex items-center gap-1.5">
                      <span>{tier.name}</span>
                    </h4>
                    <p className="text-gray-300 text-[11px] mt-0.5 leading-snug">
                      {tier.description}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="font-display font-black text-xl text-yellow-400 block leading-tight">
                      {tier.priceDisplay}
                    </span>
                    <span className="text-[9.5px] text-gray-400 font-bold block">
                      {tier.hostedGamesCount === "unlimited" ? "LIFETIME" : `${tier.hostedGamesCount} GAMES`}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-2.5 pt-2 border-t border-purple-900/40 grid grid-cols-2 gap-1.5 text-[10px] text-gray-200">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>Up to 10 players</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>All 10 Story Decks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>Secret Saboteur Missions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>Zero Ad Interruptions</span>
                  </div>
                </div>

                {/* Buy Button */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyPass(tier);
                    }}
                    disabled={isProcessing}
                    className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#FF0038] via-[#E1002E] to-[#B30022] text-white font-display font-black text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(255,0,56,0.5)] border border-red-400/50 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 fill-white" />
                    <span>{isProcessing ? "PROCESSING..." : `UNLOCK NOW • ${tier.priceDisplay}`}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Restore Purchases & Security Footer */}
        <div className="pt-2 text-center space-y-2">
          <button
            onClick={handleRestore}
            className="text-[11px] font-bold text-purple-300 hover:text-white underline cursor-pointer"
          >
            Restore Previous Purchases
          </button>
          <div className="flex items-center justify-center gap-1.5 text-gray-500 text-[9.5px]">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Secure 256-bit checkout • Instant cross-platform activation</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Dock */}
      <BottomNavigationDock
        activeTab="store"
        onNavigate={(tab) => {
          if (tab === "home") onOpenHome();
          else if (tab === "player") onOpenProfile();
          else if (tab === "achievements") onOpenAchievements();
        }}
      />
    </div>
  );
};

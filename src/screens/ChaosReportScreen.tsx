import React, { useState } from "react";
import { Share2, RotateCcw, Home, Sparkles, Shield, Flame, Crown, Gift, Check, MessageSquare } from "lucide-react";
import { ChaosReportSummary } from "../core/types/scoring.types";
import { ChaosButton } from "../components/atoms/ChaosButton";
import { ChaosLogo } from "../components/atoms/ChaosLogo";
import { AdBannerSlot } from "../components/molecules/AdBannerSlot";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";
import { AnalyticsService } from "../services/analytics/analytics.service";

interface ChaosReportScreenProps {
  report: ChaosReportSummary;
  currentPlayerId: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
  isPaidSession?: boolean;
  onRemoveAdsClick?: () => void;
}

export const ChaosReportScreen: React.FC<ChaosReportScreenProps> = ({
  report,
  currentPlayerId,
  onPlayAgain,
  onGoHome,
  isPaidSession = false,
  onRemoveAdsClick,
}) => {
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const myTitle = report.playerTitles[currentPlayerId] || "THE DIPLOMAT";

  const handleShare = async () => {
    audio.play("fanfare");
    haptics.trigger("chaos_moment");
    AnalyticsService.trackEvent("recap_shared", {
      reportRoomId: report.roomId,
      damageDestroyed: report.totalResourcesDestroyed,
    });

    const base = typeof window !== "undefined" && window.location.pathname.startsWith("/chaos") ? "/chaos" : "";
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${base}` : "https://playchaos.app";
    const shareText = `🚨 CHAOS REPORT: GAME OVER 🚨\n💥 Total Damage: $${report.totalResourcesDestroyed.toLocaleString()} destroyed\n👑 Most Influential: ${report.mostInfluentialName}\n🐑 The Sheep: ${report.theSheepName}\n💀 Most Blamed: ${report.mostBlamedName}\nWho's hosting next? Play CHAOS with your crew 👉 ${shareUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Our Squad CHAOS Report",
          text: shareText,
          url: shareUrl,
        });
        setCopiedToast("🎉 Recap sent! Drop it in your squad group chat.");
        setTimeout(() => setCopiedToast(null), 3500);
      } catch {
        // Ignored or cancelled
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopiedToast("📋 Recap copied to clipboard! Paste it into your group chat.");
      setTimeout(() => setCopiedToast(null), 3500);
    }
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between px-3.5 py-1.5 sm:py-2 bg-[#090310] select-none overflow-hidden">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold shadow-xl border border-pink-400/50 max-w-xs text-center animate-fade-in">
          {copiedToast}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col items-center text-center flex-shrink-0 pt-0.5">
        <ChaosLogo size="sm" />
        <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-amber-300 mt-0.5">
          GAME OVER
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
          YOUR <span className="text-pink-400">CHAOS REPORT</span>
        </h1>
      </div>

      {/* Main Report Card Container */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar my-1 w-full max-w-sm mx-auto">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1D1036] border-2 border-purple-500/50 shadow-xl w-full">
        {/* Session Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pb-4 border-b border-purple-800/60 text-center">
          <div>
            <span className="font-display font-black text-2xl text-white block">
              {report.totalPlayers}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Players</span>
          </div>
          <div>
            <span className="font-display font-black text-2xl text-pink-400 block">
              {report.totalMindChanges}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Flips</span>
          </div>
          <div>
            <span className="font-display font-black text-2xl text-yellow-400 block">
              ${report.totalResourcesDestroyed.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Destroyed</span>
          </div>
        </div>

        {/* Archetype Honors List */}
        <div className="flex flex-col gap-2.5 py-4 border-b border-purple-800/60 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>MOST INFLUENTIAL</span>
            </span>
            <span className="font-display font-black text-white text-sm">
              {report.mostInfluentialName}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>THE WALL</span>
            </span>
            <span className="font-display font-black text-white text-sm">
              {report.theWallName}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60">
            <span className="flex items-center gap-1.5 text-pink-300 font-bold">
              <span>🐑</span>
              <span>THE SHEEP</span>
            </span>
            <span className="font-display font-black text-white text-sm">
              {report.theSheepName}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60">
            <span className="flex items-center gap-1.5 text-red-300 font-bold">
              <span>💀</span>
              <span>MOST BLAMED</span>
            </span>
            <span className="font-display font-black text-white text-sm">
              {report.mostBlamedName}
            </span>
          </div>
        </div>

        {/* Your Title Callout */}
        <div className="pt-3 text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            YOUR CHAOS TITLE
          </span>
          <h2 className="font-display font-black text-2xl text-yellow-300 tracking-tight mt-0.5">
            {myTitle}
          </h2>
        </div>

        {/* Viral Player-to-Host Acquisition Hook */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-purple-950/90 via-pink-950/70 to-purple-950/90 border border-pink-500/30 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-black uppercase text-pink-300 tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>HOST YOUR NEXT PARTY</span>
          </div>
          <p className="text-gray-300 text-[11px] leading-snug mb-2">
            Loved the chaos? Create a room and invite your friends for free!
          </p>
          <button
            onClick={onPlayAgain}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white font-display font-black text-xs uppercase tracking-wider shadow active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-yellow-300" />
            <span>CREATE A GAME (FREE)</span>
          </button>
        </div>
      </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 max-w-sm mx-auto w-full mt-2">
        <ChaosButton
          variant="primary"
          size="lg"
          icon={<MessageSquare className="w-5 h-5 text-white" />}
          onClick={handleShare}
        >
          SHARE SQUAD RECAP
        </ChaosButton>

        <div className="flex gap-2">
          <ChaosButton
            variant="glass"
            size="md"
            icon={<RotateCcw className="w-4 h-4 text-purple-300" />}
            onClick={onPlayAgain}
          >
            PLAY AGAIN
          </ChaosButton>

          <ChaosButton
            variant="glass"
            size="md"
            icon={<Home className="w-4 h-4 text-purple-300" />}
            onClick={onGoHome}
          >
            HOME
          </ChaosButton>
        </div>

        {/* Bottom Ad Banner Slot */}
        <div className="w-full max-w-sm mx-auto mt-2">
          <AdBannerSlot
            isAdEligible={!isPaidSession}
            onRemoveAdsClick={onRemoveAdsClick}
          />
        </div>
      </div>
    </div>
  );
};

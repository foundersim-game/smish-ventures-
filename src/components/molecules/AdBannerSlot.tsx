import React, { useEffect } from "react";
import { Sparkles, Crown } from "lucide-react";
import { AnalyticsService } from "../../services/analytics/analytics.service";

interface AdBannerSlotProps {
  isAdEligible: boolean;
  onRemoveAdsClick?: () => void;
  priceLabel?: string;
  showVipBadgeWhenAdFree?: boolean;
  hostName?: string;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  isAdEligible,
  onRemoveAdsClick,
  priceLabel = "$0.99",
  showVipBadgeWhenAdFree = true,
  hostName,
}) => {
  useEffect(() => {
    if (isAdEligible) {
      AnalyticsService.trackEvent("ad_banner_shown");
    }
  }, [isAdEligible]);
  if (!isAdEligible) {
    if (!showVipBadgeWhenAdFree) return null;
    return (
      <div className="w-full py-2 px-4 bg-gradient-to-r from-amber-500/10 via-purple-600/15 to-amber-500/10 border-t border-amber-400/30 flex items-center justify-center gap-2 select-none z-20">
        <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
        <span className="text-[11px] font-display font-extrabold text-amber-300 uppercase tracking-wider">
          VIP ROOM • {hostName ? `AD-FREE NIGHT BY ${hostName.toUpperCase()}` : "100% AD-FREE NIGHT"}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-12 bg-black/75 border-t border-purple-900/50 flex items-center justify-between px-4 select-none z-20">
      <div className="flex items-center gap-2">
        <span className="text-[9px] uppercase font-black text-gray-300 bg-purple-900/80 px-1.5 py-0.5 rounded border border-purple-700/60">
          SPONSOR
        </span>
        <span className="text-[11px] text-gray-300 font-sans leading-tight">
          Support CHAOS • Keep the party free
        </span>
      </div>

      {onRemoveAdsClick && (
        <button
          onClick={onRemoveAdsClick}
          className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 active:scale-95 transition-transform cursor-pointer bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.15)]"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Remove Ads ({priceLabel})</span>
        </button>
      )}
    </div>
  );
};


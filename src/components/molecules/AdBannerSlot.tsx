import React, { useEffect } from "react";
import { Crown } from "lucide-react";
import { AnalyticsService } from "../../services/analytics/analytics.service";
import { AdMobService } from "../../services/ads/admob.service";

interface AdBannerSlotProps {
  isAdEligible: boolean;
  onRemoveAdsClick?: () => void;
  priceLabel?: string;
  showVipBadgeWhenAdFree?: boolean;
  hostName?: string;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  isAdEligible,
  showVipBadgeWhenAdFree = true,
  hostName,
}) => {
  useEffect(() => {
    if (isAdEligible) {
      AnalyticsService.trackEvent("ad_banner_shown");
      AdMobService.showBanner();
    } else {
      AdMobService.hideBanner();
    }
  }, [isAdEligible]);

  // When room is Ad-Free due to VIP pass
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

  // Sample banner ads removed: real native AdMob banner is managed directly by AdMobService
  return null;
};

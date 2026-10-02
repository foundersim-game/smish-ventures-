import React from "react";
import { Sparkles } from "lucide-react";

interface AdBannerSlotProps {
  isAdEligible: boolean;
  onRemoveAdsClick?: () => void;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  isAdEligible,
  onRemoveAdsClick,
}) => {
  if (!isAdEligible) return null;

  return (
    <div className="w-full h-12 bg-black/70 border-t border-purple-900/50 flex items-center justify-between px-4 select-none z-20">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-800/80 px-1.5 py-0.5 rounded">
          Ad
        </span>
        <span className="text-xs text-gray-300 font-sans leading-tight">
          Support CHAOS • Keep the party free
        </span>
      </div>

      {onRemoveAdsClick && (
        <button
          onClick={onRemoveAdsClick}
          className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 active:scale-95 transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Remove Ads (₹49)</span>
        </button>
      )}
    </div>
  );
};

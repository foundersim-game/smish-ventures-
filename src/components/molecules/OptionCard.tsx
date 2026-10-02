import React from "react";
import { Check } from "lucide-react";
import { OptionBadgeColor } from "../../core/types/scenario.types";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface OptionCardProps {
  id: string; // "A" | "B" | "C" | "D"
  label: string;
  subtitle: string;
  badgeColor?: OptionBadgeColor;
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  id,
  label,
  subtitle,
  badgeColor = "blue",
  isSelected = false,
  onSelect,
  disabled = false,
}) => {
  const handleClick = () => {
    if (disabled) return;
    audio.play("click");
    haptics.trigger("light");
    onSelect?.();
  };

  const badgeGradients: Record<OptionBadgeColor, string> = {
    pink: "bg-gradient-to-br from-[#FF2B85] to-[#D91460] text-white",
    blue: "bg-gradient-to-br from-[#00D2FF] to-[#0284C7] text-white",
    yellow: "bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-purple-950 font-black",
    purple: "bg-gradient-to-br from-[#C084FC] to-[#7E22CE] text-white",
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-full p-4 rounded-2xl flex items-center gap-3.5 select-none transition-all duration-150 cursor-pointer border
        ${
          isSelected
            ? "border-2 border-[#00D2FF] bg-[#161642] shadow-[0_0_22px_rgba(0,210,255,0.45)] scale-[1.01]"
            : "border-purple-800/40 bg-[#1F1138]/90 hover:bg-[#281747] active:scale-[0.99]"
        }
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {/* Option Letter Badge */}
      <div
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-xl shadow-md flex-shrink-0
          ${badgeGradients[badgeColor] || badgeGradients.blue}
        `}
      >
        {id}
      </div>

      {/* Label and Subtitle */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-white font-sans font-bold text-sm md:text-base tracking-tight leading-snug break-words">
          {label}
        </h4>
        {subtitle && (
          <p className="text-gray-300 text-xs mt-1 leading-snug break-words">
            {subtitle}
          </p>
        )}
      </div>

      {/* Selector Icon */}
      <div className="flex-shrink-0">
        {isSelected ? (
          <div className="w-6 h-6 rounded-full bg-[#00D2FF] text-white flex items-center justify-center shadow-[0_0_10px_#00D2FF]">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-purple-500/50 bg-[#140A24]" />
        )}
      </div>
    </div>
  );
};

import React from "react";
import { AvatarKey } from "../../core/types/player.types";
import { Check, MoreHorizontal } from "lucide-react";
import { getAvatarDefinition } from "../../core/constants/avatars";

interface AvatarBadgeProps {
  name: string;
  avatarKey?: AvatarKey;
  isHost?: boolean;
  isReady?: boolean;
  isThinking?: boolean;
  isDunce?: boolean;
  isYou?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
}

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  name,
  avatarKey = "crown",
  isHost = false,
  isReady = false,
  isThinking = false,
  isDunce = false,
  isYou = false,
  size = "md",
  showLabel = true,
}) => {
  const def = getAvatarDefinition(avatarKey);

  const sizeMap = {
    sm: { box: "w-10 h-10", emoji: "text-lg", crown: "text-base -top-3", label: "text-[11px]" },
    md: { box: "w-14 h-14", emoji: "text-2xl", crown: "text-xl -top-3.5", label: "text-xs" },
    lg: { box: "w-16 h-16", emoji: "text-3xl", crown: "text-2xl -top-4", label: "text-xs" },
    xl: { box: "w-20 h-20", emoji: "text-4xl", crown: "text-3xl -top-5", label: "text-sm" },
  }[size];

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative">
        {/* Host 3D Golden Crown */}
        {(isHost || isYou && isHost) && (
          <div className={`absolute ${sizeMap.crown} left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_2px_10px_rgba(234,179,8,0.95)] animate-pulse`}>
            <span className="filter drop-shadow">👑</span>
          </div>
        )}

        {/* Dunce Scapegoat Cap */}
        {isDunce && (
          <div className="absolute -top-3 right-0 z-20 text-xl animate-bounce">
            🤡
          </div>
        )}

        {/* Avatar Circle */}
        <div
          className={`
            ${sizeMap.box} rounded-full overflow-hidden border-2.5 ${def.borderClass}
            relative shadow-lg flex items-center justify-center
            bg-gradient-to-tr ${def.gradient}
            transition-transform duration-200
          `}
        >
          <span className={`${sizeMap.emoji} filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] select-none`}>
            {def.emoji}
          </span>
        </div>

        {/* Ready Green Checkmark Pill */}
        {isReady && !isThinking && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 bg-emerald-500 text-white rounded-full p-0.5 border border-white shadow-[0_0_8px_#10B981]">
            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
          </div>
        )}

        {/* Thinking 3-Dots Pill */}
        {isThinking && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 bg-[#35155D] text-purple-300 rounded-full px-1.5 py-0.5 border border-purple-400 shadow-md flex items-center justify-center">
            <MoreHorizontal className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        )}
      </div>

      {showLabel && (
        <div className="mt-1.5 text-center">
          <p className={`${sizeMap.label} font-bold text-white tracking-wide break-words max-w-[90px] leading-tight text-center`}>
            {name}
          </p>
          {isYou && (
            <span className="inline-block mt-0.5 px-2 py-0.5 text-[9px] font-black uppercase bg-[#FDE047] text-purple-950 rounded-full shadow-sm">
              You
            </span>
          )}
        </div>
      )}
    </div>
  );
};

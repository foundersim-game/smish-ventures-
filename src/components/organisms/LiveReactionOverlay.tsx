import React from "react";
import { ChaosModifier } from "../../core/types/chaos-events.types";
import { AvatarKey } from "../../core/types/player.types";
import { getAvatarDefinition } from "../../core/constants/avatars";

export interface FloatingEmoji {
  id: string;
  emoji: string;
  senderName: string;
  avatar: AvatarKey;
  xPercent: number; // 10% to 80%
}

export interface BuzzerAlert {
  id: string;
  playerName: string;
  buzzerType: "bullshit" | "cap" | "not_moving";
  title: string;
  icon: string;
  bgColor: string;
}

interface LiveReactionOverlayProps {
  floatingEmojis: FloatingEmoji[];
  buzzerAlert: BuzzerAlert | null;
  activeModifier?: ChaosModifier | null;
  joinToast?: string | null;
}

export const LiveReactionOverlay: React.FC<LiveReactionOverlayProps> = ({
  floatingEmojis,
  buzzerAlert,
  activeModifier,
  joinToast,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {/* 1. Live Buzzer Alert Banner (Screen Top Shake, constrained inside mobile canvas) */}
      {buzzerAlert && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-11/12 max-w-[340px] animate-bounce z-50">
          <div
            className={`
              p-2.5 rounded-2xl ${buzzerAlert.bgColor} border-2 border-white/50
              shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex items-center justify-between
              text-white backdrop-blur-md
            `}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl filter drop-shadow">{buzzerAlert.icon}</span>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider opacity-90 block">
                  {buzzerAlert.playerName} CALLED
                </span>
                <h4 className="font-display font-black text-base tracking-wide leading-tight">
                  {buzzerAlert.title}
                </h4>
              </div>
            </div>
            <span className="text-xl animate-pulse">⚡</span>
          </div>
        </div>
      )}

      {/* 2. Floating Emojis ascending up the mobile screen */}
      {floatingEmojis.map((item) => {
        const def = getAvatarDefinition(item.avatar);
        return (
          <div
            key={item.id}
            style={{ left: `${Math.max(10, Math.min(85, item.xPercent))}%` }}
            className="absolute bottom-20 flex flex-col items-center animate-float-up pointer-events-none"
          >
            <span className="text-3xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] animate-pulse">
              {item.emoji}
            </span>
            <div className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-black/85 border border-white/20 shadow-md">
              <span className="text-[10px]">{def.emoji}</span>
              <span className="text-[9px] font-bold text-white break-words text-center max-w-[85px] leading-tight">
                {item.senderName}
              </span>
            </div>
          </div>
        );
      })}

      {/* 3. Player Joined / Left Toast */}
      {joinToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-10/12 max-w-xs animate-fade-in z-50">
          <div className="px-3.5 py-1.5 rounded-full bg-purple-900/95 border border-purple-400 text-white text-xs font-bold text-center shadow-lg backdrop-blur-sm">
            {joinToast}
          </div>
        </div>
      )}
    </div>
  );
};

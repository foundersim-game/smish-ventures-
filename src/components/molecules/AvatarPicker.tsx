import React from "react";
import { AvatarKey } from "../../core/types/player.types";
import { AVATAR_CATALOG, AvatarDefinition } from "../../core/constants/avatars";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface AvatarPickerProps {
  selectedAvatar: AvatarKey;
  onSelectAvatar: (avatar: AvatarKey) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedAvatar,
  onSelectAvatar,
}) => {
  const handleSelect = (def: AvatarDefinition) => {
    audio.play("click");
    haptics.trigger("light");
    onSelectAvatar(def.key);
  };

  return (
    <div className="w-full">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
        CHOOSE YOUR AVATAR
      </span>
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-0.5 p-1 select-none no-scrollbar">
        {AVATAR_CATALOG.map((def) => {
          const isSelected = selectedAvatar === def.key;
          return (
            <button
              key={def.key}
              type="button"
              onClick={() => handleSelect(def)}
              className={`
                relative flex flex-col items-center justify-center p-1.5 rounded-2xl
                transition-all duration-150 active:scale-95
                ${
                  isSelected
                    ? "bg-purple-900/80 border-2 border-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.5)] ring-1 ring-yellow-400/60"
                    : "bg-[#180A2E]/70 hover:bg-[#231042] border border-purple-800/40"
                }
              `}
            >
              {/* Avatar Emoji Bubble */}
              <div
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center
                  bg-gradient-to-tr ${def.gradient} shadow-md
                  ${isSelected ? "ring-2 ring-white" : ""}
                `}
              >
                <span className="text-2xl filter drop-shadow">{def.emoji}</span>
              </div>

              {/* Title */}
              <span className="text-[10px] font-bold text-gray-200 mt-1 break-words text-center leading-tight max-w-[70px]">
                {def.label}
              </span>

              {/* Selected Tick */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 text-purple-950 flex items-center justify-center text-[10px] font-black shadow">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

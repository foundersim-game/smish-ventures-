import React from "react";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface TableEmojiBarProps {
  onSendEmoji: (emoji: string) => void;
  disabled?: boolean;
}

const EMOJIS = ["🔥", "😂", "💀", "😱", "👏", "💩"];

export const TableEmojiBar: React.FC<TableEmojiBarProps> = ({
  onSendEmoji,
  disabled = false,
}) => {
  const handleClick = (emoji: string) => {
    if (disabled) return;
    audio.play("click");
    haptics.trigger("light");
    onSendEmoji(emoji);
  };

  return (
    <div className="w-full flex items-center justify-center gap-2 py-1 select-none">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">
        REACT:
      </span>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          disabled={disabled}
          onClick={() => handleClick(emoji)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 active:scale-125 border border-white/10 flex items-center justify-center text-lg transition-transform duration-100 shadow-sm"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

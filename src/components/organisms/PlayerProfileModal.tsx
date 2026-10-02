import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { AvatarKey } from "../../core/types/player.types";
import { PlayerStorage } from "../../services/storage/player-storage";
import { AvatarPicker } from "../molecules/AvatarPicker";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (name: string, avatar: AvatarKey) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const profile = PlayerStorage.getProfile();
  const [name, setName] = useState(profile.name || "");
  const [avatar, setAvatar] = useState<AvatarKey>(profile.avatar || "crown");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    PlayerStorage.saveProfile({ name: name.trim(), avatar });
    audio.play("click");
    haptics.trigger("heavy");
    if (onSaved) onSaved(name.trim(), avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#150A26] border-2 border-purple-500/50 p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-xl text-white tracking-wide">
            PLAYER PROFILE
          </h3>
          <button
            onClick={() => {
              audio.play("click");
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Name Input */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            NICKNAME
          </label>
          <input
            type="text"
            maxLength={15}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter nickname"
            className="w-full py-2.5 px-3.5 rounded-xl bg-purple-950/70 border border-purple-600/50 text-white font-bold text-sm outline-none focus:border-yellow-400 transition-all"
          />
        </div>

        {/* Avatar Picker */}
        <AvatarPicker
          selectedAvatar={avatar}
          onSelectAvatar={(key) => setAvatar(key)}
        />

        {/* Save CTA */}
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white font-display font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Check className="w-4 h-4" />
          <span>SAVE PROFILE</span>
        </button>
      </div>
    </div>
  );
};

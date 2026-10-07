import React, { useState } from "react";
import { ArrowLeft, Users, Sparkles } from "lucide-react";
import { AvatarKey } from "../core/types/player.types";
import { PlayerStorage } from "../services/storage/player-storage";
import { AvatarPicker } from "../components/molecules/AvatarPicker";
import { ChaosButton } from "../components/atoms/ChaosButton";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface JoinScreenProps {
  initialCode?: string;
  onJoin: (roomCode: string, name: string, avatar: AvatarKey) => Promise<void>;
  onBack: () => void;
}

export const JoinScreen: React.FC<JoinScreenProps> = ({
  initialCode = "",
  onJoin,
  onBack,
}) => {
  const profile = PlayerStorage.getProfile();
  const [roomCode, setRoomCode] = useState(initialCode.toUpperCase());
  const [name, setName] = useState(profile.name || "");
  const [avatar, setAvatar] = useState<AvatarKey>(profile.avatar || "sunglasses");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError("Please enter a room code.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Save profile for future sessions
      PlayerStorage.saveProfile({ name: name.trim(), avatar });
      audio.play("click");
      haptics.trigger("heavy");
      await onJoin(roomCode.trim().toUpperCase(), name.trim(), avatar);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to join room.");
      audio.play("buzzer_bullshit");
      haptics.trigger("warning");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col items-center bg-[#080210] px-3.5 py-1.5 sm:py-2 select-none overflow-hidden">
      <div className="w-full max-w-sm flex-1 min-h-0 flex flex-col justify-between overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <header className="relative w-full flex items-center justify-between z-10 mb-1 flex-shrink-0">
        <button
          onClick={() => {
            audio.play("click");
            onBack();
          }}
          className="p-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-gray-200 active:scale-95 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-purple-300" />
        </button>
        <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-gray-400">
          MULTIPLAYER JOIN
        </span>
        <div className="w-8" />
      </header>

      {/* Main Container */}
      <div className="flex flex-col items-center my-auto w-full max-w-sm mx-auto">
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-[11px] font-bold mb-0.5">
            <Users className="w-3 h-3" />
            <span>JOIN THE PARTY</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            ENTER <span className="text-[#FFD23F]">ROOM</span>
          </h1>
          <p className="text-gray-300 text-[11px] mt-0.5 leading-tight">
            Enter the 4-character code from your host and pick your avatar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5">
          {/* Room Code Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              ROOM CODE
            </label>
            <input
              type="text"
              maxLength={6}
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="e.g. 7XQ3"
              className="w-full py-2.5 px-3 rounded-2xl bg-[#180A2E] border-2 border-purple-500/50 font-display font-black text-2xl sm:text-3xl text-center tracking-[0.2em] text-yellow-300 outline-none uppercase placeholder:text-gray-600 focus:border-yellow-400 focus:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all"
            />
          </div>

          {/* Player Name Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              YOUR NICKNAME
            </label>
            <input
              type="text"
              maxLength={15}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Enter your name"
              className="w-full py-2 px-3 rounded-xl bg-[#180A2E] border border-purple-700/50 text-white font-bold text-sm outline-none placeholder:text-gray-500 focus:border-purple-400 transition-all"
            />
          </div>

          {/* Avatar Selector */}
          <AvatarPicker
            selectedAvatar={avatar}
            onSelectAvatar={(key) => setAvatar(key)}
          />

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-semibold text-center animate-shake">
              {error}
            </div>
          )}

          {/* Submit CTA */}
          <div className="mt-2">
            <ChaosButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !roomCode.trim() || !name.trim()}
              icon={<Sparkles className="w-5 h-5 text-white" />}
            >
              {isLoading ? "CONNECTING..." : "ENTER GAME"}
            </ChaosButton>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

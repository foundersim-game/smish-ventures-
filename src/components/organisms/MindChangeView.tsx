import React from "react";
import { ArrowRight } from "lucide-react";
import { PlayerSession } from "../../core/types/player.types";
import { RoundVoteResolution } from "../../core/types/vote.types";
import { AvatarBadge } from "../atoms/AvatarBadge";

interface MindChangeViewProps {
  players: PlayerSession[];
  resolution: RoundVoteResolution;
}

export const MindChangeView: React.FC<MindChangeViewProps> = ({
  players,
  resolution,
}) => {
  const playerMap = new Map<string, PlayerSession>();
  players.forEach((p) => playerMap.set(p.id, p));

  const optionColors: Record<string, string> = {
    A: "bg-[#FF2B85] text-white",
    B: "bg-[#00D2FF] text-white",
    C: "bg-[#FBBF24] text-purple-950 font-black",
    D: "bg-[#C084FC] text-white",
  };

  const keptPlayers = resolution.keptVotePlayerIds
    .map((id) => playerMap.get(id))
    .filter(Boolean) as PlayerSession[];

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* WHO CHANGED THEIR MIND */}
      <div className="p-4 rounded-2xl bg-[#1D1036]/90 border border-purple-500/30">
        <h5 className="font-display font-extrabold text-xs uppercase tracking-wider text-pink-400 mb-3">
          WHO CHANGED THEIR MIND?
        </h5>

        {resolution.mindChanges.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {resolution.mindChanges.map((mc) => (
              <div
                key={mc.playerId}
                className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60 border border-purple-800/40"
              >
                <div className="flex items-center gap-2">
                  <AvatarBadge
                    name={mc.playerName}
                    size="sm"
                    showLabel={false}
                  />
                  <span className="text-white text-xs font-bold font-sans">
                    {mc.playerName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-display font-black text-xs ${
                      optionColors[mc.initialOptionId] || optionColors.A
                    }`}
                  >
                    {mc.initialOptionId}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-display font-black text-xs ${
                      optionColors[mc.finalOptionId] || optionColors.B
                    }`}
                  >
                    {mc.finalOptionId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-xs text-center py-2">
            Nobody changed their mind! True stubborn loyalty.
          </p>
        )}
      </div>

      {/* WHO KEPT THEIR VOTE */}
      <div className="p-4 rounded-2xl bg-[#1D1036]/90 border border-purple-500/30">
        <h5 className="font-display font-extrabold text-xs uppercase tracking-wider text-amber-300 mb-3">
          WHO KEPT THEIR VOTE?
        </h5>

        {keptPlayers.length > 0 ? (
          <div className="flex items-center justify-around py-1">
            {keptPlayers.map((p) => (
              <AvatarBadge
                key={p.id}
                name={p.name}
                avatarKey={p.avatar}
                isHost={p.isHost}
                size="md"
                showLabel={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-xs text-center py-2">
            Total chaos! Everyone flipped their vote!
          </p>
        )}
      </div>
    </div>
  );
};

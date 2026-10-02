import React from "react";
import { Users } from "lucide-react";
import { PlayerSession } from "../../core/types/player.types";
import { ScenarioOption } from "../../core/types/scenario.types";
import { RoundVoteResolution } from "../../core/types/vote.types";
import { AvatarBadge } from "../atoms/AvatarBadge";

interface VoteBreakdownViewProps {
  options: ScenarioOption[];
  players: PlayerSession[];
  resolution: RoundVoteResolution;
}

export const VoteBreakdownView: React.FC<VoteBreakdownViewProps> = ({
  options,
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

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* 4 Options Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const tally = resolution.voteTally[opt.id];
          const isWinner = opt.id === resolution.winningOptionId;
          const count = tally?.voteCount || 0;
          const voterPlayers = (tally?.voterPlayerIds || [])
            .map((id) => playerMap.get(id))
            .filter(Boolean) as PlayerSession[];

          return (
            <div
              key={opt.id}
              className={`
                p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-200 border
                ${
                  isWinner
                    ? "bg-[#18194A] border-2 border-[#00D2FF] shadow-[0_0_18px_rgba(0,210,255,0.4)]"
                    : "bg-[#1C1033]/90 border-purple-800/40"
                }
              `}
            >
              {/* Badge Letter */}
              <span
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-sm mb-1.5 shadow-sm
                  ${optionColors[opt.id] || optionColors.B}
                `}
              >
                {opt.id}
              </span>

              <h5 className="text-white text-xs font-bold font-sans break-words leading-tight text-center">
                {opt.label}
              </h5>

              <span className="text-gray-300 text-xs font-extrabold mt-1">
                {count} {count === 1 ? "vote" : "votes"}
              </span>

              {/* Voter Avatars */}
              <div className="flex items-center justify-center -space-x-1.5 mt-2 min-h-[30px]">
                {voterPlayers.length > 0 ? (
                  voterPlayers.map((p) => (
                    <AvatarBadge
                      key={p.id}
                      name={p.name}
                      avatarKey={p.avatar}
                      size="sm"
                      showLabel={false}
                    />
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mind Change Summary Banner */}
      <div className="p-3.5 rounded-2xl bg-[#1C1138]/90 border border-purple-500/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-900/60 flex items-center justify-center text-purple-300 flex-shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="text-pink-400 font-bold text-xs uppercase tracking-wider">
            {resolution.switchedPlayerCount}{" "}
            {resolution.switchedPlayerCount === 1 ? "person" : "people"} changed their minds!
          </h5>
          <p className="text-gray-300 text-[11px] mt-0.5 leading-snug">
            Out of {resolution.totalVotes} players, {resolution.switchedPlayerCount} switched from their original vote.
          </p>
        </div>
      </div>
    </div>
  );
};

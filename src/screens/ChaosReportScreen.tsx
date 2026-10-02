import React from "react";
import { Share2, RotateCcw, Home, Sparkles, Shield, Flame } from "lucide-react";
import { ChaosReportSummary } from "../core/types/scoring.types";
import { ChaosButton } from "../components/atoms/ChaosButton";
import { ChaosLogo } from "../components/atoms/ChaosLogo";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface ChaosReportScreenProps {
  report: ChaosReportSummary;
  currentPlayerId: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ChaosReportScreen: React.FC<ChaosReportScreenProps> = ({
  report,
  currentPlayerId,
  onPlayAgain,
  onGoHome,
}) => {
  const myTitle = report.playerTitles[currentPlayerId] || "THE DIPLOMAT";

  const handleShare = async () => {
    audio.play("fanfare");
    haptics.trigger("chaos_moment");

    const shareText = `${report.totalPlayers} PEOPLE ENTERED. ${report.totalMindChanges} MINDS CHANGED. ${report.mostInfluentialName} CAUSED THE MOST CHAOS! WHO'S HOSTING NEXT? Play CHAOS now!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Our CHAOS Report",
          text: shareText,
          url: window.location.origin,
        });
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("CHAOS Report copied to clipboard!");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-5 pt-8 pb-6 bg-[#090310] select-none">
      {/* Top Header */}
      <div className="flex flex-col items-center text-center">
        <ChaosLogo size="sm" />
        <span className="text-xs font-display font-extrabold uppercase tracking-widest text-amber-300 mt-1">
          GAME OVER
        </span>
        <h1 className="font-display font-black text-3xl text-white tracking-tight">
          YOUR <span className="text-pink-400">CHAOS REPORT</span>
        </h1>
      </div>

      {/* Main Report Card */}
      <div className="p-5 rounded-3xl bg-[#1D1036] border-2 border-purple-500/50 shadow-2xl my-auto max-w-sm mx-auto w-full">
        {/* Session Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pb-4 border-b border-purple-800/60 text-center">
          <div>
            <span className="font-display font-black text-2xl text-white block">
              {report.totalPlayers}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Players</span>
          </div>
          <div>
            <span className="font-display font-black text-2xl text-pink-400 block">
              {report.totalMindChanges}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Flips</span>
          </div>
          <div>
            <span className="font-display font-black text-2xl text-yellow-400 block">
              ₹{report.totalResourcesDestroyed.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Destroyed</span>
          </div>
        </div>

        {/* Archetype Honors List */}
        <div className="flex flex-col gap-2.5 py-4 border-b border-purple-800/60 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>MOST INFLUENTIAL</span>
            </span>
            <span className="font-display font-black text-white text-sm">
              {report.mostInfluentialName}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>THE WALL</span>
            </span>
            <span className="font-display font-black text-white text-sm">
              {report.theWallName}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60">
            <span className="flex items-center gap-1.5 text-pink-300 font-bold">
              <span>🐑</span>
              <span>THE SHEEP</span>
            </span>
            <span className="font-display font-black text-white text-sm">
              {report.theSheepName}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60">
            <span className="flex items-center gap-1.5 text-red-300 font-bold">
              <span>💀</span>
              <span>MOST BLAMED</span>
            </span>
            <span className="font-display font-black text-white text-sm">
              {report.mostBlamedName}
            </span>
          </div>
        </div>

        {/* Your Title Callout */}
        <div className="pt-3 text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            YOUR CHAOS TITLE
          </span>
          <h2 className="font-display font-black text-2xl text-yellow-300 tracking-tight mt-0.5">
            {myTitle}
          </h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 max-w-sm mx-auto w-full mt-2">
        <ChaosButton
          variant="primary"
          size="lg"
          icon={<Share2 className="w-5 h-5 text-white" />}
          onClick={handleShare}
        >
          SHARE CHAOS
        </ChaosButton>

        <div className="flex gap-2">
          <ChaosButton
            variant="glass"
            size="md"
            icon={<RotateCcw className="w-4 h-4 text-purple-300" />}
            onClick={onPlayAgain}
          >
            PLAY AGAIN
          </ChaosButton>

          <ChaosButton
            variant="glass"
            size="md"
            icon={<Home className="w-4 h-4 text-purple-300" />}
            onClick={onGoHome}
          >
            HOME
          </ChaosButton>
        </div>
      </div>
    </div>
  );
};

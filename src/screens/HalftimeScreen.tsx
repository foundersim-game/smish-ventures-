import React, { useState, useEffect } from "react";
import { Sparkles, Crown, Zap, Coffee, ChevronRight, DollarSign, Brain, Flame } from "lucide-react";
import { RoomSession } from "../core/types/room.types";
import { AdBannerSlot } from "../components/molecules/AdBannerSlot";
import { audio } from "../services/audio/audio-manager";
import { AdMobService } from "../services/ads/admob.service";
import { AnalyticsService } from "../services/analytics/analytics.service";

interface HalftimeScreenProps {
  room: RoomSession;
  isHost: boolean;
  onContinue: () => void;
  onRemoveAdsClick?: () => void;
}

export const HalftimeScreen: React.FC<HalftimeScreenProps> = ({
  room,
  isHost,
  onContinue,
  onRemoveAdsClick,
}) => {
  const isPaid = Boolean(room.isPaidSession);
  const [countdown, setCountdown] = useState<number>(isPaid ? 0 : 7);

  useEffect(() => {
    if (isPaid) {
      // VIP rooms don't wait: short 1.5s celebratory glance or immediate continue
      const t = setTimeout(() => {
        onContinue();
      }, 1500);
      return () => clearTimeout(t);
    }

    // Non-VIP rooms: trigger interstitial and track halftime intermission
    AdMobService.showInterstitial();
    AnalyticsService.trackEvent("ad_interstitial_shown", {
      location: "halftime",
      roomCode: room.roomCode,
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaid, onContinue, room.roomCode]);

  const balance = room.resourceState?.balance ?? 15000;
  const sanity = room.resourceState?.sanity ?? 70;
  const chaosScore = room.resourceState?.chaosScore ?? 45;

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between px-3.5 py-1.5 sm:py-2.5 bg-[#090310] select-none text-white animate-fade-in overflow-hidden">
      {/* Top Header Badge */}
      <div className="flex flex-col items-center text-center flex-shrink-0 pt-1">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-display font-black tracking-widest uppercase mb-1">
          <Coffee className="w-3 h-3 text-yellow-300" />
          <span>HALFTIME BREAK</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
          SQUAD <span className="text-pink-400">STATUS CHECK</span>
        </h1>
        <p className="text-gray-400 text-[11px] mt-0.5 leading-tight">
          Halfway through the chaos. Grab a drink and catch your breath!
        </p>
      </div>

      {/* Resource Snapshot Card */}
      <div className="w-full max-w-sm mx-auto my-auto p-4 rounded-2xl bg-gradient-to-b from-[#2B1038] to-[#14061E] border-2 border-purple-500/40 shadow-xl flex flex-col gap-3">
        <h3 className="font-display font-extrabold text-xs text-center text-purple-200 uppercase tracking-wider">
          DAMAGE REPORT SO FAR
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40 flex flex-col items-center">
            <DollarSign className="w-4 h-4 text-emerald-400 mb-0.5" />
            <span className="text-[9px] text-gray-400 font-bold uppercase">Balance</span>
            <span className="font-display font-black text-sm sm:text-base text-emerald-300 mt-0.5">
              ${balance.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40 flex flex-col items-center">
            <Brain className="w-4 h-4 text-cyan-400 mb-0.5" />
            <span className="text-[9px] text-gray-400 font-bold uppercase">Sanity</span>
            <span className="font-display font-black text-sm sm:text-base text-cyan-300 mt-0.5">
              {sanity}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40 flex flex-col items-center">
            <Flame className="w-4 h-4 text-pink-400 mb-0.5" />
            <span className="text-[9px] text-gray-400 font-bold uppercase">Chaos</span>
            <span className="font-display font-black text-sm sm:text-base text-pink-300 mt-0.5">
              {chaosScore}
            </span>
          </div>
        </div>

        {isPaid ? (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 text-center animate-pulse">
            <div className="flex items-center justify-center gap-1 text-[11px] font-display font-black text-amber-300 uppercase">
              <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>VIP ROOM • BREAK SKIPPED</span>
            </div>
            <p className="text-[10px] text-gray-300 mt-0.5">
              Jumping straight into Round 5...
            </p>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/40 text-center">
            <span className="text-[10px] text-gray-400">
              Round 5 begins in{" "}
              <strong className="text-amber-300 font-mono text-sm">
                {countdown}s
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Action / Sponsor Bottom */}
      <div className="flex flex-col gap-2 max-w-sm mx-auto w-full mt-1 flex-shrink-0 mb-1">
        <button
          onClick={() => {
            audio.play("click");
            onContinue();
          }}
          disabled={!isPaid && countdown > 0}
          className={`w-full py-3 sm:py-3.5 rounded-2xl font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isPaid || countdown === 0
              ? "bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white shadow-[0_6px_25px_rgba(236,72,153,0.5)] active:scale-98"
              : "bg-gray-800/80 text-gray-500 cursor-not-allowed border border-gray-700/50"
          }`}
        >
          <span>{countdown > 0 ? `START ROUND 5 (${countdown}s)` : "RESUME ROUND 5"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <AdBannerSlot
          isAdEligible={!isPaid}
          onRemoveAdsClick={onRemoveAdsClick}
        />
      </div>
    </div>
  );
};

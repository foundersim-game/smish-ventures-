import React, { useState, useEffect } from "react";
import { Sparkles, Zap } from "lucide-react";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Play entrance sound & haptics
    audio.play("fanfare");
    haptics.trigger("chaos_moment");

    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onComplete, 400);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(onComplete, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#070110] p-6 select-none transition-opacity duration-300 cursor-pointer ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top spacer */}
      <div className="w-full flex items-center justify-center pt-8">
        <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-purple-400/80 animate-pulse">
          SMISH VENTURES PRESENTS
        </span>
      </div>

      {/* Center 3D Logo & Glowing Energy Rings */}
      <div className="relative flex flex-col items-center my-auto">
        {/* Pulsing Aura Rings */}
        <div className="absolute inset-0 bg-red-600/30 rounded-full blur-3xl scale-125 animate-pulse pointer-events-none" />
        <div className="absolute -inset-8 bg-purple-600/20 rounded-full blur-2xl animate-spin pointer-events-none" style={{ animationDuration: "8s" }} />

        {/* 3D Transparent Logo */}
        <img
          src="/logo-transparent.png"
          alt="CHAOS"
          className="w-48 sm:w-56 h-auto object-contain relative z-10 drop-shadow-[0_16px_40px_rgba(224,24,68,0.7)] animate-bounce"
          style={{ animationDuration: "2s" }}
        />

        {/* Animated Tagline */}
        <div className="text-center mt-4 z-10">
          <h2 className="font-display font-black text-2xl sm:text-3xl italic tracking-tight text-white drop-shadow-md">
            MAKE A DECISION.
          </h2>
          <h2 className="font-display font-black text-2xl sm:text-3xl italic tracking-tight text-[#FFD23F] drop-shadow-[0_2px_14px_rgba(255,210,63,0.7)]">
            DEAL WITH THE CHAOS.
          </h2>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="w-full max-w-xs flex flex-col items-center pb-6">
        <div className="w-full h-1.5 rounded-full bg-purple-950/80 border border-purple-800/40 overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 rounded-full animate-pulse w-full" />
        </div>
        <span className="text-[11px] text-gray-400 font-bold tracking-wider">
          Tap anywhere to continue
        </span>
      </div>
    </div>
  );
};

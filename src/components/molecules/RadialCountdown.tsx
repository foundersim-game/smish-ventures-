import React, { useEffect, useState, useRef } from "react";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface RadialCountdownProps {
  startTimestamp: number;
  totalDurationSeconds: number;
  onTimeUp?: () => void;
  size?: number;
}

export const RadialCountdown: React.FC<RadialCountdownProps> = ({
  startTimestamp,
  totalDurationSeconds,
  onTimeUp,
  size = 195,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(totalDurationSeconds);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;
  const hasTriggeredTimeUp = useRef(false);
  const lastSecondRef = useRef(totalDurationSeconds);

  useEffect(() => {
    hasTriggeredTimeUp.current = false;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - startTimestamp) / 1000;
      const remaining = Math.max(0, Math.ceil(totalDurationSeconds - elapsedSeconds));

      setSecondsRemaining(remaining);

      // Sound and haptic cues on second changes
      if (remaining !== lastSecondRef.current) {
        lastSecondRef.current = remaining;

        if (remaining <= 10 && remaining > 0) {
          audio.play("tick_urgent");
          haptics.trigger("warning");
        } else if (remaining <= 30 && remaining > 10 && remaining % 5 === 0) {
          audio.play("tick_calm");
        }
      }

      if (remaining <= 0 && !hasTriggeredTimeUp.current) {
        hasTriggeredTimeUp.current = true;
        clearInterval(interval);
        audio.play("time_up");
        haptics.trigger("chaos_moment");
        onTimeUpRef.current?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTimestamp, totalDurationSeconds]);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, secondsRemaining / totalDurationSeconds));
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Tension color shifts
  const isUrgent = secondsRemaining <= 10;
  const isPulsing = secondsRemaining <= 25 && !isUrgent;

  return (
    <div
      onClick={() => {
        audio.play("time_up");
        onTimeUpRef.current?.();
      }}
      className="relative flex flex-col items-center justify-center my-2 select-none cursor-pointer active:scale-95 transition-transform"
      title="Tap to finish discussion"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(168, 85, 247, 0.2)"
            strokeWidth={strokeWidth}
          />

          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={isUrgent ? "url(#urgentGradient)" : "url(#tensionGradient)"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-100 ease-linear"
          />

          <defs>
            <linearGradient id="tensionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="urgentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>

        {/* Outer Glow Halo */}
        <div
          className={`
            absolute inset-2 rounded-full pointer-events-none transition-all duration-300
            ${
              isUrgent
                ? "shadow-[0_0_40px_rgba(239,68,68,0.7)] animate-pulse"
                : isPulsing
                ? "shadow-[0_0_28px_rgba(236,72,153,0.5)]"
                : "shadow-[0_0_20px_rgba(168,85,247,0.35)]"
            }
          `}
        />

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`
              font-display font-black leading-none tracking-tight transition-all duration-150
              ${isUrgent ? "text-red-400 text-6xl scale-105" : "text-white text-6xl"}
            `}
          >
            {secondsRemaining}
          </span>
          <span className="font-display font-bold text-[10px] uppercase tracking-widest text-gray-400 mt-1">
            SECONDS
          </span>
        </div>
      </div>
    </div>
  );
};

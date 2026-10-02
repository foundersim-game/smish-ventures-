import React from "react";
import { Check } from "lucide-react";
import { GamePhase } from "../../core/types/room.types";

interface PhaseStepperProps {
  currentPhase: GamePhase;
}

export const PhaseStepper: React.FC<PhaseStepperProps> = ({ currentPhase }) => {
  // Map game phase to 1-indexed step (1 to 4)
  const getStepIndex = (phase: GamePhase): number => {
    switch (phase) {
      case "initial_vote":
        return 1;
      case "discussion":
        return 2;
      case "final_vote":
        return 3;
      case "reveal_beat_1":
      case "reveal_beat_2":
      case "reveal_beat_3":
      case "reveal_beat_4":
      case "reveal_beat_5":
      case "reveal_beat_6":
      case "consequence":
      case "blame":
      case "round_wrap":
        return 4;
      default:
        return 1;
    }
  };

  const activeStep = getStepIndex(currentPhase);

  const steps = [
    { index: 1, label: "Your Vote" },
    { index: 2, label: "Discussion" },
    { index: 3, label: "Final Vote" },
    { index: 4, label: "Reveal" },
  ];

  return (
    <div className="w-full px-6 py-2 select-none">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute top-4 left-6 right-6 h-[1.5px] border-t-2 border-dotted border-purple-800/80 -z-0" />

        {steps.map((step) => {
          const isCompleted = step.index < activeStep;
          const isActive = step.index === activeStep;

          return (
            <div key={step.index} className="relative z-10 flex flex-col items-center">
              {/* Circle Badge */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all duration-200
                  ${
                    isActive
                      ? "bg-transparent border-2 border-amber-400 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.6)] scale-110"
                      : isCompleted
                      ? "bg-[#1A0E2E] border-2 border-purple-400/80 text-white"
                      : "bg-[#140A24] border border-purple-900 text-gray-500"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                ) : (
                  <span>{step.index}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-1.5 text-[11px] font-sans font-medium tracking-tight whitespace-nowrap
                  ${isActive ? "text-amber-300 font-bold" : isCompleted ? "text-gray-300" : "text-gray-500"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

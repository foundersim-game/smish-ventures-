import React from "react";
import { X, Lock, Users, Trophy } from "lucide-react";
import { ChaosButton } from "../atoms/ChaosButton";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#1A0E2E] border-2 border-purple-500/40 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-900/50 text-gray-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display font-black text-2xl text-white tracking-wide mb-1">
          HOW TO PLAY
        </h3>
        <p className="text-gray-400 text-xs mb-6">
          Rule #1: The real game is in the room, not on your screen!
        </p>

        <div className="flex flex-col gap-4 mb-6">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40">
            <div className="w-8 h-8 rounded-xl bg-pink-600/30 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">1. Secret Initial Vote</h5>
              <p className="text-gray-300 text-xs mt-0.5">
                Everyone secretly locks what they would do. Nobody can see your answer.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40">
            <div className="w-8 h-8 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">2. Phones Down & Argue</h5>
              <p className="text-gray-300 text-xs mt-0.5">
                Phones down! 60 seconds to persuade, negotiate, bluff, and destroy their plan.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/30 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">3. Reveal & Blame</h5>
              <p className="text-gray-300 text-xs mt-0.5">
                Lock your final vote. See who flipped, who influenced whom, and point fingers!
              </p>
            </div>
          </div>
        </div>

        <ChaosButton variant="primary" onClick={onClose}>
          LET'S PLAY!
        </ChaosButton>
      </div>
    </div>
  );
};

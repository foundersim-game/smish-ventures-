import React, { useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX, Smartphone, Eye, X, Shield, FileText } from "lucide-react";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(audio.getSoundEnabled());
  const [hapticsEnabled, setHapticsEnabled] = useState(haptics.getEnabled());
  const [reducedMotion, setReducedMotion] = useState(false);

  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audio.setSoundEnabled(next);
    if (next) audio.play("click");
  };

  const toggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    haptics.setEnabled(next);
    if (next) haptics.trigger("medium");
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    audio.play("click");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#1A0E2E] border-2 border-purple-500/40 p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-900/50 text-gray-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-display font-black text-xl text-white tracking-wide mb-4">
          GAME SETTINGS
        </h3>

        <div className="flex flex-col gap-3">
          {/* Sound FX */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-300" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-white font-sans font-bold text-sm">Sound Effects</span>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                soundEnabled ? "bg-amber-400" : "bg-gray-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40">
            <div className="flex items-center gap-3">
              <Smartphone className={`w-5 h-5 ${hapticsEnabled ? "text-cyan-400" : "text-gray-500"}`} />
              <span className="text-white font-sans font-bold text-sm">Phone Haptics</span>
            </div>
            <button
              onClick={toggleHaptics}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                hapticsEnabled ? "bg-cyan-400" : "bg-gray-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  hapticsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40">
            <div className="flex items-center gap-3">
              <Eye className={`w-5 h-5 ${reducedMotion ? "text-green-400" : "text-gray-500"}`} />
              <span className="text-white font-sans font-bold text-sm">Reduced Motion</span>
            </div>
            <button
              onClick={toggleReducedMotion}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                reducedMotion ? "bg-green-400" : "bg-gray-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  reducedMotion ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Legal & App Info (Relocated cleanly to Settings) */}
        <div className="mt-4 pt-3.5 border-t border-purple-800/50 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>App Version</span>
            <span className="font-mono text-purple-300 font-bold">CHAOS v1.2.0</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link
              href="/privacy"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 text-xs font-bold transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Privacy Policy</span>
            </Link>
            <Link
              href="/terms"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 text-xs font-bold transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Terms of Service</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

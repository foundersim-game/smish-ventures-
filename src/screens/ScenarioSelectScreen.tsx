import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Heart,
  Layers,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { ScenarioDefinition } from "../core/types/scenario.types";
import { GameMode } from "../core/types/room.types";
import { ScenarioRegistry } from "../backend/data/scenarios";
import { ChaosButton } from "../components/atoms/ChaosButton";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface ScenarioSelectScreenProps {
  mode?: GameMode;
  onBack: () => void;
  onSelectScenario: (scenario: ScenarioDefinition) => void;
}

const getVibeBadgeStyle = (color?: string) => {
  switch (color) {
    case "pink":
      return "bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-[0_0_12px_rgba(236,72,153,0.3)]";
    case "red":
      return "bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]";
    case "rose":
      return "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]";
    case "amber":
      return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]";
    case "emerald":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
    case "cyan":
      return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]";
    case "purple":
    case "indigo":
    default:
      return "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]";
  }
};

export const ScenarioSelectScreen: React.FC<ScenarioSelectScreenProps> = ({
  mode = "party",
  onBack,
  onSelectScenario,
}) => {
  const isCouples = mode === "couples";
  const defaultScenario = ScenarioRegistry.getDefaultScenarioForMode(mode);

  const [activeTab, setActiveTab] = useState<"free" | "premium">("free");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(defaultScenario.id);
  const [previewScenario, setPreviewScenario] = useState<ScenarioDefinition | null>(null);

  // Scenarios strictly filtered by mode (couples vs party) and tier (free vs premium)
  const scenarios = ScenarioRegistry.getScenariosForMode(mode, activeTab);

  // Sync selection if active tab changes and current selection is not in list
  const currentSelected =
    scenarios.find((s) => s.id === selectedScenarioId) ||
    scenarios[0] ||
    defaultScenario;

  const handleTabChange = (tab: "free" | "premium") => {
    setActiveTab(tab);
    const tabScenarios = ScenarioRegistry.getScenariosForMode(mode, tab);
    if (tabScenarios.length > 0) {
      setSelectedScenarioId(tabScenarios[0].id);
    }
    audio.play("click");
    haptics.trigger("light");
  };

  const handleScenarioClick = (sc: ScenarioDefinition) => {
    setSelectedScenarioId(sc.id);
    setPreviewScenario(sc);
    audio.play("click");
    haptics.trigger("light");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-5 pt-8 pb-6 bg-[#090310] select-none">
      {/* Top Navigation */}
      <header className="relative w-full flex items-center justify-between z-10">
        <button
          onClick={previewScenario ? () => setPreviewScenario(null) : onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 4-Dash Step Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-1.5 rounded-full ${
              isCouples ? "bg-pink-500" : "bg-amber-400"
            }`}
          />
          <div
            className={`w-8 h-1.5 rounded-full ${
              isCouples ? "bg-pink-500" : "bg-amber-400"
            }`}
          />
          <div className="w-8 h-1.5 rounded-full bg-white/20" />
          <div className="w-8 h-1.5 rounded-full bg-white/20" />
        </div>

        <span className="text-xs font-bold text-gray-400">
          {previewScenario ? "3 / 4" : "2 / 4"}
        </span>
      </header>

      {/* VIEW A: LIST VIEW (Screen 3) */}
      {!previewScenario && (
        <div className="flex flex-col flex-1 mt-6">
          {/* Header Title Section */}
          <div className="text-center mb-5">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest mb-1 ${
                isCouples
                  ? "bg-pink-500/20 border border-pink-500/40 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                  : "bg-amber-500/20 border border-amber-500/40 text-amber-300"
              }`}
            >
              {isCouples ? (
                <>
                  <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                  <span>COUPLES MODE</span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>PARTY MODE</span>
                </>
              )}
            </div>

            <h1 className="font-display font-black text-3xl text-white tracking-tight leading-none mt-1">
              CHOOSE YOUR <br />
              <span className={isCouples ? "text-pink-400 drop-shadow-[0_0_16px_rgba(236,72,153,0.5)]" : "text-yellow-400"}>
                {isCouples ? "COUPLES CHAOS" : "CHAOS"}
              </span>
            </h1>
            <p className="text-gray-300 text-xs mt-1.5 max-w-xs mx-auto">
              {isCouples
                ? "Designed exclusively for 2 players. Playful arguments & surprises."
                : "Pick a game to see what's inside. 4 – 10 players."}
            </p>
          </div>

          {/* Tab Selector: FREE vs PREMIUM */}
          <div className="flex p-1 rounded-2xl bg-purple-950/60 border border-purple-800/40 mb-4 max-w-sm mx-auto w-full">
            <button
              onClick={() => handleTabChange("free")}
              className={`flex-1 py-2.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-wider transition-all ${
                activeTab === "free"
                  ? isCouples
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-900/40"
                    : "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-900/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              FREE ({ScenarioRegistry.getScenariosForMode(mode, "free").length})
            </button>
            <button
              onClick={() => handleTabChange("premium")}
              className={`flex-1 py-2.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "premium"
                  ? isCouples
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/40"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-yellow-300" />
              <span>PREMIUM ({ScenarioRegistry.getScenariosForMode(mode, "premium").length})</span>
            </button>
          </div>

          {/* Scenario List */}
          <div className="flex flex-col gap-3.5 overflow-y-auto max-w-sm mx-auto w-full flex-1 pt-1 pb-6 px-1">
            {scenarios.map((sc) => {
              const isSelected = sc.id === (currentSelected?.id || selectedScenarioId);

              return (
                <div
                  key={sc.id}
                  onClick={() => handleScenarioClick(sc)}
                  className={`
                    p-4 rounded-3xl flex flex-col justify-between cursor-pointer transition-all duration-200 border relative
                    ${
                      isSelected
                        ? isCouples
                          ? "bg-gradient-to-br from-[#38112D] via-[#240B22] to-[#120524] border-2 border-pink-500 shadow-[0_0_24px_rgba(236,72,153,0.45)] scale-[1.01]"
                          : "bg-gradient-to-br from-[#2E103E] via-[#220D3D] to-[#120524] border-2 border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.45)] scale-[1.01]"
                        : "bg-[#1B0F2E]/90 border-purple-800/40 hover:bg-[#25153E]"
                    }
                  `}
                >
                  {/* Top Header Row: Vibe Tag & Price Tier */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {sc.vibeTag ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display font-black uppercase tracking-wider border shadow-sm ${getVibeBadgeStyle(
                          sc.vibeColor
                        )}`}
                      >
                        <span>{sc.vibeTag}</span>
                      </span>
                    ) : (
                      <div />
                    )}

                    {sc.isPremium && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5 text-yellow-300" />
                        <span>{sc.priceTier || "₹99"}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="pr-2">
                      <h4 className="font-display font-black text-xl text-white tracking-tight flex items-center gap-2">
                        <span>{sc.title}</span>
                      </h4>
                      <p className="text-gray-300 text-xs mt-1 leading-snug">
                        {sc.tagline}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-purple-900/40 text-[11px] text-gray-300 font-semibold">
                    <span className="flex items-center gap-1 bg-purple-950/60 px-2 py-1 rounded-lg">
                      {isCouples ? (
                        <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                      ) : (
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      {sc.recommendedPlayers}
                    </span>
                    <span className="flex items-center gap-1 bg-purple-950/60 px-2 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {sc.estimatedMinutes}
                    </span>
                    <span className="flex items-center gap-1 bg-purple-950/60 px-2 py-1 rounded-lg">
                      <Layers className="w-3.5 h-3.5 text-pink-400" />
                      {sc.totalRounds >= 10 ? "Up to 10 rounds" : `${sc.totalRounds} rounds`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-sm mx-auto mt-2">
            <ChaosButton
              variant="primary"
              size="lg"
              rightIcon={<ChevronRight className="w-5 h-5 text-white/90" />}
              onClick={() => setPreviewScenario(currentSelected)}
            >
              CONTINUE
            </ChaosButton>
          </div>
        </div>
      )}

      {/* VIEW B: WHAT'S INSIDE PREVIEW (Screen 5) */}
      {previewScenario && (
        <div className="flex flex-col flex-1 mt-4 max-w-sm mx-auto w-full">
          {/* Hero Banner Card */}
          <div
            className={`p-4 rounded-3xl bg-gradient-to-b ${
              isCouples
                ? "from-[#3D1231] to-[#1E0824] border-2 border-pink-500/50 shadow-[0_0_24px_rgba(236,72,153,0.25)]"
                : "from-[#3A144E] to-[#1E082E] border-2 border-purple-500/50 shadow-xl"
            } mb-4 relative overflow-hidden`}
          >
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {previewScenario.isPremium ? (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-extrabold uppercase tracking-wider border border-purple-400/40 inline-flex items-center gap-1">
                  <Crown className="w-3 h-3 text-yellow-300" />
                  {previewScenario.priceTier || "₹99"} PREMIUM PACK
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-400/40">
                  FREE PACK
                </span>
              )}

              {previewScenario.vibeTag && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display font-black uppercase tracking-wider border shadow-sm ${getVibeBadgeStyle(
                    previewScenario.vibeColor
                  )}`}
                >
                  <span>{previewScenario.vibeTag}</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <h2 className="font-display font-black text-2xl text-white tracking-tight">
                {previewScenario.title}
              </h2>
              {isCouples ? (
                <Heart className="w-9 h-9 fill-pink-500 text-pink-400 flex-shrink-0 animate-pulse" />
              ) : (
                <Zap className="w-9 h-9 fill-yellow-400 text-yellow-300 flex-shrink-0 animate-pulse" />
              )}
            </div>

            <p className="text-gray-300 text-xs mt-1 leading-snug">
              {previewScenario.tagline}
            </p>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-800/50 text-[11px] text-gray-200 font-bold">
              <span className="bg-purple-900/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                {isCouples ? (
                  <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-300" />
                ) : (
                  <Users className="w-3.5 h-3.5 text-purple-300" />
                )}
                {previewScenario.recommendedPlayers}
              </span>
              <span className="bg-purple-900/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                {previewScenario.estimatedMinutes}
              </span>
              <span className="bg-purple-900/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-pink-300" />
                {previewScenario.totalRounds >= 10 ? "Up to 10 rounds" : `${previewScenario.totalRounds} rounds`}
              </span>
            </div>
          </div>

          {/* Section: WHAT'S INSIDE? */}
          <div className="mb-2">
            <h3
              className={`font-display font-black text-xl tracking-tight ${
                isCouples ? "text-pink-400" : "text-yellow-400"
              }`}
            >
              WHAT'S INSIDE?
            </h3>
            <p className="text-gray-300 text-xs">
              {isCouples
                ? "4 escalating dilemmas testing partner instincts, predictions & alignment."
                : "A mix of questions, decisions and consequences that get progressively crazier."}
            </p>
          </div>

          {/* 6 Feature Grid Cards (2x3) */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {previewScenario.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-[#1C1033] border border-purple-800/40 flex flex-col items-center text-center justify-center min-h-[75px]"
              >
                <Sparkles
                  className={`w-4 h-4 mb-1 ${
                    isCouples ? "text-pink-400" : "text-amber-400"
                  }`}
                />
                <span className="text-[11px] text-gray-200 font-bold leading-tight">
                  {feat}
                </span>
              </div>
            ))}
          </div>

          {/* Good For Card */}
          <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40 mb-4 flex items-start gap-2.5">
            <span className="text-xl">{isCouples ? "💖" : "💡"}</span>
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isCouples ? "text-pink-300" : "text-purple-300"
                }`}
              >
                GOOD FOR
              </span>
              <p className="text-gray-300 text-xs mt-0.5 leading-snug">
                {previewScenario.goodFor}
              </p>
            </div>
          </div>

          {/* Select CTA */}
          <ChaosButton
            variant="primary"
            size="lg"
            icon={
              previewScenario.isPremium ? (
                <Crown className="w-5 h-5 fill-yellow-300 text-yellow-200" />
              ) : isCouples ? (
                <Heart className="w-5 h-5 fill-white text-white" />
              ) : undefined
            }
            rightIcon={<ChevronRight className="w-5 h-5 text-white/90" />}
            onClick={() => onSelectScenario(previewScenario)}
          >
            {previewScenario.isPremium
              ? `PLAY THIS PACK (${previewScenario.priceTier || "₹99"})`
              : "SELECT THIS CHAOS"}
          </ChaosButton>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
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
import { ApiClient } from "../services/network/api-client";

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

  // All scenarios for the selected mode (ordered with newly added drops at the top)
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>(() =>
    ScenarioRegistry.getScenariosForMode(mode)
  );

  const defaultScenario = scenarios[0] || ScenarioRegistry.getDefaultScenarioForMode(mode);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(defaultScenario.id);
  const [previewScenario, setPreviewScenario] = useState<ScenarioDefinition | null>(null);

  useEffect(() => {
    // Keep local scenarios in sync and refresh with remote drops
    const fresh = ScenarioRegistry.getScenariosForMode(mode);
    setScenarios(fresh);
    if (!fresh.some((s) => s.id === selectedScenarioId) && fresh[0]) {
      setSelectedScenarioId(fresh[0].id);
    }

    ApiClient.getScenarios()
      .then((dynamicDrops) => {
        if (dynamicDrops && dynamicDrops.length > 0) {
          ScenarioRegistry.registerDynamic(dynamicDrops);
          const updated = ScenarioRegistry.getScenariosForMode(mode);
          setScenarios(updated);
          if (!updated.some((s) => s.id === selectedScenarioId) && updated[0]) {
            setSelectedScenarioId(updated[0].id);
          }
        }
      })
      .catch(() => {});
  }, [mode]);

  const currentSelected =
    scenarios.find((s) => s.id === selectedScenarioId) ||
    scenarios[0] ||
    defaultScenario;

  const handleScenarioClick = (sc: ScenarioDefinition) => {
    setSelectedScenarioId(sc.id);
    audio.play("click");
    haptics.trigger("light");
  };

  const handleOpenPreview = (sc: ScenarioDefinition) => {
    setSelectedScenarioId(sc.id);
    setPreviewScenario(sc);
    audio.play("click");
    haptics.trigger("medium");
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full flex flex-col justify-between px-3.5 py-1.5 sm:py-2.5 bg-[#090310] select-none overflow-hidden">
      {/* Top Navigation */}
      <header className="relative w-full max-w-sm mx-auto flex items-center justify-between z-10 flex-shrink-0 pt-0.5">
        <button
          onClick={previewScenario ? () => setPreviewScenario(null) : onBack}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-200 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* 4-Dash Step Indicator */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-6 h-1 rounded-full ${
              isCouples ? "bg-pink-500" : "bg-amber-400"
            }`}
          />
          <div
            className={`w-6 h-1 rounded-full ${
              isCouples ? "bg-pink-500" : "bg-amber-400"
            }`}
          />
          <div
            className={`w-6 h-1 rounded-full ${
              previewScenario
                ? (isCouples ? "bg-pink-500" : "bg-amber-400")
                : "bg-white/20"
            }`}
          />
          <div className="w-6 h-1 rounded-full bg-white/20" />
        </div>

        <span className="text-[11px] font-bold text-gray-400">
          {previewScenario ? "3 / 4" : "2 / 4"}
        </span>
      </header>

      {/* VIEW A: LIST VIEW (Step 2/4) */}
      {!previewScenario && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full max-w-sm mx-auto justify-between mt-1">
          {/* Header Title Section */}
          <div className="text-center mb-2 flex-shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-display font-black uppercase tracking-widest mb-1 ${
                isCouples
                  ? "bg-pink-500/20 border border-pink-500/40 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                  : "bg-amber-500/20 border border-amber-500/40 text-amber-300"
              }`}
            >
              {isCouples ? (
                <>
                  <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                  <span>COUPLES MODE</span>
                </>
              ) : (
                <>
                  <Users className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>PARTY MODE</span>
                </>
              )}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
              CHOOSE YOUR{" "}
              <span className={isCouples ? "text-pink-400 drop-shadow-[0_0_16px_rgba(236,72,153,0.5)]" : "text-yellow-400"}>
                CHAOS
              </span>
            </h1>
            <p className="text-gray-300 text-[11px] mt-1 max-w-xs mx-auto leading-tight">
              {isCouples
                ? "Designed exclusively for 2 players. Playful arguments & surprises."
                : `Tap a deck to preview details. ${scenarios.length} scenarios included.`}
            </p>
          </div>

          {/* Scenario List (Scrollable, perfectly contained within viewport) */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2.5 py-1 px-1">
            {scenarios.map((sc) => {
              const isSelected = sc.id === (currentSelected?.id || selectedScenarioId);

              return (
                <div
                  key={sc.id}
                  onClick={() => handleScenarioClick(sc)}
                  className={`
                    p-3 sm:p-3.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-150 relative border
                    ${
                      isSelected
                        ? isCouples
                          ? "bg-gradient-to-br from-[#38112D] via-[#240B22] to-[#120524] border-2 border-pink-400 shadow-[0_0_16px_rgba(236,72,153,0.4)] ring-1 ring-pink-400/50"
                          : "bg-gradient-to-br from-[#2E103E] via-[#220D3D] to-[#120524] border-2 border-yellow-400 shadow-[0_0_16px_rgba(251,191,36,0.4)] ring-1 ring-yellow-400/50"
                        : "bg-[#1B0F2E]/90 border-purple-800/40 hover:bg-[#25153E]"
                    }
                  `}
                >
                  {/* Top Header Row: Badges (NEW DROP & Vibe Tag) & Preview Button */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {sc.isNew && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-display font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/30 via-yellow-500/25 to-amber-500/30 text-yellow-300 border border-yellow-400/60 shadow-[0_0_12px_rgba(250,204,21,0.35)] animate-pulse">
                          <Sparkles className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                          <span>NEW DROP</span>
                        </span>
                      )}
                      {sc.vibeTag && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-display font-black uppercase tracking-wider border shadow-sm ${getVibeBadgeStyle(
                            sc.vibeColor
                          )}`}
                        >
                          <span>{sc.vibeTag}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPreview(sc);
                      }}
                      className="text-[10px] text-purple-300 hover:text-white font-bold flex items-center gap-0.5 bg-purple-900/50 px-2 py-0.5 rounded-lg border border-purple-700/40 active:scale-95 transition-transform"
                    >
                      <span>Preview</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="pr-1">
                      <h4 className="font-display font-black text-base sm:text-lg text-white tracking-tight leading-snug">
                        {sc.title}
                      </h4>
                      <p className="text-gray-300 text-[11px] mt-0.5 leading-snug">
                        {sc.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-purple-900/40 text-[10px] text-gray-300 font-semibold">
                    <span className="flex items-center gap-1 bg-purple-950/70 px-2 py-0.5 rounded-md">
                      {isCouples ? (
                        <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                      ) : (
                        <Users className="w-3 h-3 text-purple-400" />
                      )}
                      {sc.recommendedPlayers}
                    </span>
                    <span className="flex items-center gap-1 bg-purple-950/70 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {sc.estimatedMinutes}
                    </span>
                    <span className="flex items-center gap-1 bg-purple-950/70 px-2 py-0.5 rounded-md">
                      <Layers className="w-3 h-3 text-pink-400" />
                      {sc.totalRounds >= 10 ? "Up to 10 rounds" : `${sc.totalRounds} rounds`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ALWAYS PINNED Bottom Continue Button */}
          <div className="w-full pt-2 pb-0.5 flex-shrink-0 z-20">
            <ChaosButton
              variant="primary"
              size="lg"
              rightIcon={<ChevronRight className="w-5 h-5 text-white/90" />}
              onClick={() => handleOpenPreview(currentSelected)}
            >
              CONTINUE
            </ChaosButton>
          </div>
        </div>
      )}

      {/* VIEW B: WHAT'S INSIDE PREVIEW (Step 3/4) */}
      {previewScenario && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full max-w-sm mx-auto justify-between mt-1">
          {/* Header Title Section (Step 3/4) */}
          <div className="text-center mb-2 flex-shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-display font-black uppercase tracking-widest mb-1 ${
                isCouples
                  ? "bg-pink-500/20 border border-pink-500/40 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                  : "bg-amber-500/20 border border-amber-500/40 text-amber-300"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>STEP 3 OF 4 • DECK OVERVIEW</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
              SCENARIO{" "}
              <span className={isCouples ? "text-pink-400 drop-shadow-[0_0_16px_rgba(236,72,153,0.5)]" : "text-yellow-400"}>
                DETAILS
              </span>
            </h1>
            <p className="text-gray-300 text-[11px] mt-1 max-w-xs mx-auto leading-tight">
              Review storyline, rules & squad mechanics before launching.
            </p>
          </div>

          {/* Scrollable Preview Content */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2.5 py-1 px-1">
            {/* Hero Banner Card */}
            <div
              className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b ${
                isCouples
                  ? "from-[#3D1231] to-[#1E0824] border-2 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                  : "from-[#3A144E] to-[#1E082E] border-2 border-purple-500/50 shadow-xl"
              } relative overflow-hidden`}
            >
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {previewScenario.isNew && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/30 via-yellow-500/25 to-amber-500/30 text-yellow-300 border border-yellow-400/60 shadow-[0_0_12px_rgba(250,204,21,0.35)] animate-pulse">
                    <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>NEW DROP</span>
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

              <div className="flex items-start justify-between mt-1">
                <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
                  {previewScenario.title}
                </h2>
                {isCouples ? (
                  <Heart className="w-7 h-7 fill-pink-500 text-pink-400 flex-shrink-0 animate-pulse ml-2" />
                ) : (
                  <Zap className="w-7 h-7 fill-yellow-400 text-yellow-300 flex-shrink-0 animate-pulse ml-2" />
                )}
              </div>

              <p className="text-gray-300 text-xs mt-1.5 leading-snug">
                {previewScenario.tagline}
              </p>

              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-purple-800/50 text-[11px] text-gray-200 font-bold">
                <span className="bg-purple-900/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  {isCouples ? (
                    <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-300" />
                  ) : (
                    <Users className="w-3.5 h-3.5 text-purple-300" />
                  )}
                  {previewScenario.recommendedPlayers}
                </span>
                <span className="bg-purple-900/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {previewScenario.estimatedMinutes}
                </span>
                <span className="bg-purple-900/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-pink-300" />
                  {previewScenario.totalRounds >= 10 ? "Up to 10 rounds" : `${previewScenario.totalRounds} rounds`}
                </span>
              </div>
            </div>

            {/* Section: WHAT'S INSIDE? */}
            <div className="px-1">
              <h3
                className={`font-display font-black text-lg tracking-tight ${
                  isCouples ? "text-pink-400" : "text-yellow-400"
                }`}
              >
                WHAT'S INSIDE?
              </h3>
              <p className="text-gray-300 text-[11px] leading-tight">
                {isCouples
                  ? "Escalating dilemmas testing partner instincts, predictions & alignment."
                  : "A mix of questions, decisions and consequences that get progressively crazier."}
              </p>
            </div>

            {/* 6 Feature Grid Cards (2x3) */}
            <div className="grid grid-cols-3 gap-2">
              {previewScenario.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-[#1C1033] border border-purple-800/40 flex flex-col items-center text-center justify-center min-h-[64px]"
                >
                  <Sparkles
                    className={`w-3.5 h-3.5 mb-1 ${
                      isCouples ? "text-pink-400" : "text-amber-400"
                    }`}
                  />
                  <span className="text-[10px] text-gray-200 font-bold leading-tight">
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            {/* Good For Card */}
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-start gap-2">
              <span className="text-lg leading-none">{isCouples ? "💖" : "💡"}</span>
              <div>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider block ${
                    isCouples ? "text-pink-300" : "text-purple-300"
                  }`}
                >
                  GOOD FOR
                </span>
                <p className="text-gray-300 text-[11px] mt-0.5 leading-snug">
                  {previewScenario.goodFor}
                </p>
              </div>
            </div>
          </div>

          {/* ALWAYS PINNED Bottom Select CTA */}
          <div className="w-full pt-2 pb-0.5 flex-shrink-0 z-20">
            <ChaosButton
              variant="primary"
              size="lg"
              icon={
                isCouples ? (
                  <Heart className="w-5 h-5 fill-white text-white" />
                ) : (
                  <Zap className="w-5 h-5 fill-white text-white" />
                )
              }
              rightIcon={<ChevronRight className="w-5 h-5 text-white/90" />}
              onClick={() => onSelectScenario(previewScenario)}
            >
              START THIS CHAOS
            </ChaosButton>
          </div>
        </div>
      )}
    </div>
  );
};

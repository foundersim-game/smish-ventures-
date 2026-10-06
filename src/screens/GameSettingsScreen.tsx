import React, { useState } from "react";
import {
  ChevronLeft,
  Minus,
  Plus,
  Play,
  Users,
  Clock,
  Layers,
  BarChart2,
  Zap,
  Heart,
} from "lucide-react";
import {
  ChaosIntensity,
  DifficultyLevel,
  GameSettings,
} from "../core/types/room.types";
import { ScenarioDefinition } from "../core/types/scenario.types";
import { ChaosButton } from "../components/atoms/ChaosButton";
import { audio } from "../services/audio/audio-manager";
import { haptics } from "../services/haptics/haptics-manager";

interface GameSettingsScreenProps {
  scenario: ScenarioDefinition;
  onBack: () => void;
  onStartChaos: (settings: GameSettings) => void;
}

export const GameSettingsScreen: React.FC<GameSettingsScreenProps> = ({
  scenario,
  onBack,
  onStartChaos,
}) => {
  const isCouples =
    scenario.category === "couples" || scenario.id.startsWith("couples");

  const maxRoundsAvailable = scenario.rounds?.length || scenario.totalRounds || 4;

  const [numPlayers, setNumPlayers] = useState(isCouples ? 2 : 6);
  const [roundTime, setRoundTime] = useState<number>(60);
  const [numRounds, setNumRounds] = useState<number>(
    Math.min(scenario.totalRounds || 4, maxRoundsAvailable)
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("normal");
  const [intensity, setIntensity] = useState<ChaosIntensity>(
    isCouples ? "balanced" : "spicy"
  );

  const handlePlayersChange = (delta: number) => {
    if (isCouples) return;
    const next = Math.max(4, Math.min(10, numPlayers + delta));
    setNumPlayers(next);
    audio.play("click");
    haptics.trigger("light");
  };

  const handleStart = () => {
    onStartChaos({
      minPlayers: isCouples ? 2 : 4,
      maxPlayers: isCouples ? 2 : 10,
      targetPlayers: isCouples ? 2 : numPlayers,
      discussionDurationSeconds: roundTime,
      totalRounds: numRounds,
      difficulty,
      intensity,
    });
  };

  const intensityStops: ChaosIntensity[] = ["chill", "balanced", "spicy", "insane"];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-5 pt-8 pb-6 bg-[#090310] select-none">
      {/* Top Header */}
      <header className="relative w-full flex items-center justify-between z-10">
        <button
          onClick={onBack}
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
        </div>

        <span className="text-xs font-bold text-gray-400">4 / 4</span>
      </header>

      {/* Screen Title */}
      <div className="mt-4 text-center">
        {isCouples ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-display font-extrabold uppercase tracking-widest mb-1 shadow-[0_0_12px_rgba(236,72,153,0.3)]">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>COUPLES MODE</span>
          </div>
        ) : (
          <span className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
            {scenario.title}
          </span>
        )}
        <h1 className="font-display font-black text-3xl text-white tracking-tight mt-1">
          {isCouples ? "COUPLES " : "GAME "}
          <span className={isCouples ? "text-pink-400" : "text-yellow-400"}>
            SETTINGS
          </span>
        </h1>
        <p className="text-gray-300 text-xs mt-1">
          {isCouples
            ? "Configure your 2-player dynamic and let the truths unfold."
            : "Configure your game and get the chaos started."}
        </p>
      </div>

      {/* Settings Form Container */}
      <div className="flex flex-col gap-2.5 my-auto max-w-sm mx-auto w-full py-2">
        {/* Row 1: Number of Players */}
        <div className="p-3.5 rounded-2xl bg-[#1D1036] border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isCouples
                  ? "bg-pink-900/50 text-pink-400"
                  : "bg-purple-900/50 text-purple-300"
              }`}
            >
              {isCouples ? (
                <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
              ) : (
                <Users className="w-5 h-5" />
              )}
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Number of Players</h5>
              <p className="text-gray-400 text-xs">
                {isCouples ? "Just the two of you" : "4 – 10 players"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isCouples ? (
              <span className="px-3 py-1 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-display font-black tracking-wider">
                2 PLAYERS
              </span>
            ) : (
              <>
                <button
                  onClick={() => handlePlayersChange(-1)}
                  disabled={numPlayers <= 4}
                  className="w-8 h-8 rounded-lg bg-purple-900/70 border border-purple-600/50 flex items-center justify-center text-white active:scale-95 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-display font-black text-lg text-white w-4 text-center">
                  {numPlayers}
                </span>
                <button
                  onClick={() => handlePlayersChange(1)}
                  disabled={numPlayers >= 10}
                  className="w-8 h-8 rounded-lg bg-purple-900/70 border border-purple-600/50 flex items-center justify-center text-white active:scale-95 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Round Time */}
        <div className="p-3.5 rounded-2xl bg-[#1D1036] border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-900/50 flex items-center justify-center text-pink-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Round Time</h5>
              <p className="text-gray-400 text-xs">Time to discuss each round</p>
            </div>
          </div>

          <select
            value={roundTime}
            onChange={(e) => {
              setRoundTime(Number(e.target.value));
              audio.play("click");
            }}
            className="bg-purple-950/80 border border-purple-700/60 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
          >
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>120 seconds</option>
          </select>
        </div>

        {/* Row 3: Number of Rounds */}
        <div className="p-3.5 rounded-2xl bg-[#1D1036] border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-900/50 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Number of Rounds</h5>
              <p className="text-gray-400 text-xs">Total rounds in the game</p>
            </div>
          </div>

          <select
            value={numRounds}
            onChange={(e) => {
              setNumRounds(Number(e.target.value));
              audio.play("click");
            }}
            className="bg-purple-950/80 border border-purple-700/60 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
          >
            <option value={4}>4 rounds ({maxRoundsAvailable === 4 ? "Full Pack" : "Quick"} ~15m)</option>
            {maxRoundsAvailable >= 6 && <option value={6}>6 rounds (Standard ~25m)</option>}
            {maxRoundsAvailable >= 8 && <option value={8}>8 rounds (Deep Chaos ~35m)</option>}
            {maxRoundsAvailable >= 10 && <option value={10}>10 rounds (Full Story ~45m)</option>}
          </select>
        </div>

        {/* Row 4: Difficulty */}
        <div className="p-3.5 rounded-2xl bg-[#1D1036] border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-900/50 flex items-center justify-center text-cyan-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Difficulty</h5>
              <p className="text-gray-400 text-xs">How intense the questions are</p>
            </div>
          </div>

          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as DifficultyLevel);
              audio.play("click");
            }}
            className="bg-purple-950/80 border border-purple-700/60 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer capitalize"
          >
            <option value="casual">Casual</option>
            <option value="normal">Normal</option>
            <option value="spicy">Spicy</option>
          </select>
        </div>

        {/* Row 5: CHAOS Intensity Slider */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2F1138] to-[#1C0E35] border border-amber-500/40 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <h5 className="font-display font-black text-sm text-yellow-300 uppercase tracking-wider">
              CHAOS INTENSITY
            </h5>
          </div>
          <p className="text-gray-300 text-xs mb-3">Adjust how wild things get.</p>

          {/* 4-Stop Stepped Slider */}
          <div className="relative flex items-center justify-between pt-2 pb-1 px-1">
            <div className="absolute top-1/2 left-2 right-2 h-1 bg-gradient-to-r from-purple-800 via-amber-500 to-red-600 rounded-full -translate-y-1/2" />
            {intensityStops.map((stop) => {
              const isActive = stop === intensity;
              return (
                <button
                  key={stop}
                  onClick={() => {
                    setIntensity(stop);
                    audio.play("click");
                    haptics.trigger("medium");
                  }}
                  className={`
                    relative z-10 w-5 h-5 rounded-full transition-all border-2
                    ${
                      isActive
                        ? "bg-amber-400 border-white scale-125 shadow-[0_0_12px_#FBBF24]"
                        : "bg-[#180C2E] border-purple-600"
                    }
                  `}
                />
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-2 capitalize px-1">
            <span>Chill</span>
            <span>Balanced</span>
            <span className="text-amber-300">Spicy</span>
            <span>Insane</span>
          </div>
        </div>

        {/* Game Summary Card */}
        <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-800/40">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
            GAME SUMMARY
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <span className="font-display font-black text-lg text-white block">
                {numPlayers}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">Players</span>
            </div>
            <div>
              <span className="font-display font-black text-lg text-white block">
                {numRounds}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">Rounds</span>
            </div>
            <div>
              <span className="font-display font-black text-lg text-white block">
                {roundTime}s
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">Per Round</span>
            </div>
            <div>
              <span className="font-display font-black text-lg text-white capitalize block">
                {difficulty}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">Difficulty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="w-full max-w-sm mx-auto">
        <ChaosButton
          variant="primary"
          size="lg"
          icon={<Play className="w-5 h-5 fill-white text-white" />}
          onClick={handleStart}
        >
          START CHAOS
        </ChaosButton>
      </div>
    </div>
  );
};

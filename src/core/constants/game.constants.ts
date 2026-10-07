import { GameSettings } from "../types/room.types";

export const DEFAULT_PARTY_SETTINGS: GameSettings = {
  minPlayers: 2,
  maxPlayers: 10,
  targetPlayers: 6,
  discussionDurationSeconds: 60,
  totalRounds: 6,
  difficulty: "normal",
  intensity: "spicy",
};

export const DEFAULT_COUPLES_SETTINGS: GameSettings = {
  minPlayers: 2,
  maxPlayers: 2,
  targetPlayers: 2,
  discussionDurationSeconds: 60,
  totalRounds: 6,
  difficulty: "normal",
  intensity: "balanced",
};

export const ROUND_PRESETS = [
  { id: "quick", label: "QUICK CHAOS", rounds: 4, durationText: "10 - 15 min" },
  { id: "standard", label: "CHAOS", rounds: 6, durationText: "15 - 25 min" },
  { id: "total", label: "TOTAL CHAOS", rounds: 8, durationText: "30 - 40 min" },
] as const;

export const DISCUSSION_DURATION_OPTIONS = [60, 90, 120] as const;

export const INTENSITY_LEVELS = ["chill", "balanced", "spicy", "insane"] as const;

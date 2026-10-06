export type GameMode = "party" | "couples";

export type GamePhase =
  | "lobby"
  | "initial_vote"
  | "discussion"
  | "final_vote"
  | "reveal_beat_1" // Closed Box
  | "reveal_beat_2" // Box Shakes
  | "reveal_beat_3" // Box Opens
  | "reveal_beat_4" // Result Appears
  | "reveal_beat_5" // Vote Breakdown
  | "reveal_beat_6" // Mind Change Details
  | "influence"     // Who got to you? (GDD Section 6.5 & Section 7)
  | "consequence"   // Consequence & Escalation (GDD Section 6.6 & Section 9)
  | "blame"         // Who caused this? & Receipts (GDD Section 6.7 & Section 13)
  | "round_wrap"
  | "chaos_report";

export type ChaosIntensity = "chill" | "balanced" | "spicy" | "insane";

export type DifficultyLevel = "casual" | "normal" | "spicy";

export interface GameSettings {
  minPlayers: number;
  maxPlayers: number;
  targetPlayers: number;
  discussionDurationSeconds: number; // 60, 90, 120
  totalRounds: number; // 4 (Quick), 6 (Standard), 8-10 (Total)
  difficulty: DifficultyLevel;
  intensity: ChaosIntensity;
}

export interface ScenarioResourceState {
  balance?: number; // e.g. $3,000 Night Out budget
  chaosScore?: number;
  sanity?: number;
  customFlags?: Record<string, string | number | boolean>;
}

export interface RoomSession {
  id: string;
  roomCode: string;
  hostId: string;
  mode: GameMode;
  phase: GamePhase;
  phaseStartTimestamp: number;
  phaseDurationSeconds: number;
  settings: GameSettings;
  scenarioId: string;
  currentRoundIndex: number;
  totalRounds: number;
  resourceState: ScenarioResourceState;
  isPaidSession: boolean;
  createdAt: number;
  updatedAt: number;
}

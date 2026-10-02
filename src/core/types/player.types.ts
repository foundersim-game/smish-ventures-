import { SecretMission } from "./mission.types";

export type AvatarKey =
  | "crown"
  | "fire"
  | "devil"
  | "brain"
  | "clown"
  | "skull"
  | "snake"
  | "sunglasses"
  | "party"
  | "wolf"
  | "lightning"
  | "target"
  | "mask"
  | "lion"
  | "diamond"
  | "alien";

export interface PlayerStats {
  decisionsMade: number;
  mindChanges: number;
  timesInfluencedOthers: number;
  timesBlamed: number;
  totalScore: number;
}

export interface PlayerSession {
  id: string;
  roomId: string;
  name: string;
  avatar: AvatarKey;
  isHost: boolean;
  connected: boolean;
  ready: boolean;
  initialVoteOptionId: string | null;
  finalVoteOptionId: string | null;
  hasLockedInitialVote: boolean;
  hasLockedFinalVote: boolean;
  hasSubmittedInfluence: boolean;
  hasSubmittedBlame: boolean;
  secretIntel: string | null; // Asymmetric info for the current round
  secretMission?: SecretMission | null; // Top-secret objective assigned to player
  stats: PlayerStats;
  joinedAt: number;
  lastSeenAt: number;
}

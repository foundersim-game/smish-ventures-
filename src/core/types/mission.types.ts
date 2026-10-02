export type MissionConditionType =
  | "winner_is_option"
  | "be_lone_dissenter"
  | "influence_count_min"
  | "flip_vote_to_winner"
  | "get_blamed_min"
  | "unanimous_vote"
  | "stay_stubborn";

export interface SecretMission {
  id: string;
  roundIndex: number;
  title: string;
  badge: string; // Emoji
  objective: string;
  secretHint: string;
  rewardPoints: number;
  conditionType: MissionConditionType;
  targetOptionId?: string;
  minCount?: number;
  isAccomplished?: boolean;
  assignedPlayerId: string;
}

export interface MissionEvaluationResult {
  playerId: string;
  playerName: string;
  mission: SecretMission;
  isSuccess: boolean;
  bonusPoints: number;
  summaryMessage: string;
}

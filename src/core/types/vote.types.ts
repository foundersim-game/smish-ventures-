export interface PlayerVoteSubmission {
  playerId: string;
  roundIndex: number;
  optionId: string;
  submittedAt: number;
}

export interface MindChangeRecord {
  playerId: string;
  playerName: string;
  avatar: string;
  initialOptionId: string;
  finalOptionId: string;
}

export interface VoteTallyEntry {
  optionId: string;
  voteCount: number;
  percentage: number;
  voterPlayerIds: string[];
}

export interface RoundVoteResolution {
  roundIndex: number;
  totalVotes: number;
  winningOptionId: string;
  winningOptionLabel: string;
  voteTally: Record<string, VoteTallyEntry>;
  mindChanges: MindChangeRecord[];
  keptVotePlayerIds: string[];
  switchedPlayerCount: number;
  keptPlayerCount: number;
  isTie?: boolean;
  tiedOptionIds?: string[];
  tieBreakerWinnerId?: string;
  tieBreakerReason?: string;
}

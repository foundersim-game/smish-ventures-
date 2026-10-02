export interface InfluenceSubmission {
  playerId: string; // The player who flipped
  roundIndex: number;
  influencedByPlayerId: string | null; // null if "Nobody" or "I changed my mind myself"
  reason?: "player" | "nobody" | "myself";
}

export interface BlameSubmission {
  accuserPlayerId: string;
  roundIndex: number;
  blamedPlayerId: string;
}

export interface PlayerInfluenceReceipt {
  playerId: string;
  playerName: string;
  peopleInfluencedCount: number;
  voteMovementPercentage: number;
  blameVotesReceived: number;
  blamedByNames: string[];
}

export interface RoundReceiptsSummary {
  roundIndex: number;
  mostBlamedPlayerId: string | null;
  mostBlamedPlayerName: string | null;
  mostInfluentialPlayerId: string | null;
  mostInfluentialPlayerName: string | null;
  totalBlameVotes: number;
  receipts: PlayerInfluenceReceipt[];
}

export type PlayerArchetypeTitle =
  | "THE MANIPULATOR" // Influenced the most people
  | "THE SHEEP" // Changed decisions frequently
  | "THE WALL" // Almost never changed
  | "THE DIPLOMAT" // Influenced people without getting blamed
  | "THE CHAOS AGENT" // Selected volatile, unpredictable options
  | "THE VICTIM" // Blamed heavily despite zero influence
  | "THE MASTER OF DISASTER"; // Pushed catastrophic decisions

export interface PlayerScoreBreakdown {
  playerId: string;
  influencePoints: number;
  wallPoints: number;
  chaosCatalystPoints: number;
  blamePenaltyPoints: number;
  roundTotal: number;
  cumulativeScore: number;
}

export interface ChaosReportSummary {
  roomId: string;
  totalPlayers: number;
  totalDecisions: number;
  totalMindChanges: number;
  totalResourcesDestroyed: number;
  mostInfluentialName: string;
  theWallName: string;
  theSheepName: string;
  mostBlamedName: string;
  playerTitles: Record<string, PlayerArchetypeTitle>;
  scores: Record<string, number>;
}

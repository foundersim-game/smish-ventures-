import { SCORING_RULES } from "../constants/scoring.constants";
import { RoundReceiptsSummary } from "../types/influence.types";
import { PlayerSession } from "../types/player.types";
import { PlayerScoreBreakdown } from "../types/scoring.types";
import { RoundVoteResolution } from "../types/vote.types";

export class ScoringCalculator {
  /**
   * Calculates point deltas for all players following round reveal, receipts, and consequences.
   */
  public static calculateRoundScores(
    players: PlayerSession[],
    resolution: RoundVoteResolution,
    receipts: RoundReceiptsSummary | null,
    isAbsurdConsequence = false
  ): Record<string, PlayerScoreBreakdown> {
    const scores: Record<string, PlayerScoreBreakdown> = {};

    for (const player of players) {
      let influencePoints = 0;
      let wallPoints = 0;
      let chaosCatalystPoints = 0;
      let blamePenaltyPoints = 0;

      // 1. Influence Points (+150 per person credited)
      if (receipts) {
        const playerReceipt = receipts.receipts.find((r) => r.playerId === player.id);
        if (playerReceipt) {
          influencePoints =
            playerReceipt.peopleInfluencedCount * SCORING_RULES.INFLUENCE_POINTS_PER_FLIP;
        }
      }

      // 2. The Wall Bonus (+100 if you kept your vote and won)
      const keptVote = resolution.keptVotePlayerIds.includes(player.id);
      const isWinner = player.finalVoteOptionId === resolution.winningOptionId;
      if (keptVote && isWinner) {
        wallPoints = SCORING_RULES.THE_WALL_BONUS;
      }

      // 3. Chaos Catalyst Bonus (+200 if wild consequence triggered and you voted for it)
      if (isAbsurdConsequence && isWinner) {
        chaosCatalystPoints = SCORING_RULES.CHAOS_CATALYST_BONUS;
      }

      // 4. Blame Tax (-100 if you are the most blamed player)
      if (receipts && receipts.mostBlamedPlayerId === player.id && receipts.totalBlameVotes > 0) {
        blamePenaltyPoints = SCORING_RULES.BLAME_TAX_PENALTY;
      }

      const roundTotal =
        influencePoints + wallPoints + chaosCatalystPoints - blamePenaltyPoints;

      scores[player.id] = {
        playerId: player.id,
        influencePoints,
        wallPoints,
        chaosCatalystPoints,
        blamePenaltyPoints,
        roundTotal,
        cumulativeScore: (player.stats.totalScore || 0) + roundTotal,
      };
    }

    return scores;
  }
}

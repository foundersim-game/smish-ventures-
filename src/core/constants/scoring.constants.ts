export const SCORING_RULES = {
  INFLUENCE_POINTS_PER_FLIP: 150, // Points awarded for each person who credits you
  THE_WALL_BONUS: 100, // Points awarded if you defended your initial vote and won
  CHAOS_CATALYST_BONUS: 200, // Points awarded if you chose the wild option that succeeded
  BLAME_TAX_PENALTY: 100, // Points deducted if voted Most Blamed in a round
  COUPLES_TELEPATHY_ACCURACY_BONUS: 200,
  COUPLES_SAME_BRAIN_BONUS: 150,
} as const;

export const MAX_REACTION_BUZZES_PER_ROUND = 3;

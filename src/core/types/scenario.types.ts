export type ScenarioCategory =
  | "night_out"
  | "friends"
  | "travel"
  | "life"
  | "absurd"
  | "couples";

export type OptionBadgeColor = "pink" | "blue" | "yellow" | "purple";

export interface ScenarioOption {
  id: string; // "A" | "B" | "C" | "D"
  label: string; // e.g. "Book a luxury dinner"
  subtitle: string; // e.g. "Great food, classy night."
  badgeColor: OptionBadgeColor;
}

export interface ScenarioConsequence {
  title: string;
  narrative: string;
  isAbsurd?: boolean;
  resourceDelta?: {
    balance?: number; // e.g. -12000
    sanity?: number;
    chaosScore?: number;
  };
  triggerChaosMoment?: boolean;
  chaosMomentMessage?: string;
}

export interface SecretIntelRule {
  targetPlayerCount: number; // e.g. 1 or 2 players
  intelMessage: string;
  secretGoal: string;
}

export interface ScenarioRound {
  roundIndex: number;
  category: ScenarioCategory;
  difficulty: "casual" | "normal" | "spicy";
  prompt: string; // "It's 11:30 PM. You have $3,000 left for the rest of the night."
  question: string; // "What should the group do?"
  highlightedText?: string; // "$3,000"
  discussionDurationSeconds: number; // 60, 90, 120
  options: ScenarioOption[];
  consequences: Record<string, ScenarioConsequence>; // keyed by option id "A", "B", etc.
  secretIntelRule?: SecretIntelRule;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  category: ScenarioCategory;
  tagline: string;
  description: string;
  estimatedMinutes: string; // "10 - 15 min"
  recommendedPlayers: string; // "4 - 10 players"
  totalRounds: number;
  isPremium: boolean;
  priceTier?: string; // e.g. "$2.99"
  vibeTag?: string; // e.g. "⚡ FAST & LOUD", "🌶️ SPICY & UNFILTERED"
  vibeColor?: "pink" | "amber" | "purple" | "rose" | "emerald" | "red" | "cyan" | "indigo";
  goodFor: string;
  features: string[];
  initialResourceState?: {
    balance?: number;
    sanity?: number;
    chaosScore?: number;
  };
  rounds: ScenarioRound[];
  isNew?: boolean;
  releaseWeek?: number;
  isDynamic?: boolean;
}

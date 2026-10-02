export type ChaosModifierType =
  | "speed_debate"
  | "anonymous_discussion"
  | "double_blame"
  | "hot_seat"
  | "reverse_psychology"
  | "silent_treatment";

export interface ChaosModifier {
  id: ChaosModifierType;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  badgeColor: string;
  durationAdjustmentSeconds?: number;
}

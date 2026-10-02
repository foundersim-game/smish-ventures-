import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const TRUTH_OR_CHAOS_SCENARIO: ScenarioDefinition = {
  id: "truth_or_chaos",
  title: "TRUTH OR CHAOS",
  category: "friends",
  tagline: "Answer honestly... or deal with the chaos.",
  description: "Hypotheticals and confessions designed to test friendship loyalty, secrets, and spicy takes.",
  estimatedMinutes: "15 - 20 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 4,
  isPremium: false,
  vibeTag: "😈 BRUTAL HONESTY",
  vibeColor: "rose",
  goodFor: "Late nights, intimate dinners, best friends.",
  features: [
    "High-stakes confessions",
    "Mind-change tracking",
    "Accusation blame rounds",
    "Blame tax penalties",
  ],
  rounds: [
    {
      roundIndex: 1,
      category: "friends",
      difficulty: "spicy",
      prompt: "If your friend group had to survive a zombie apocalypse, who gets pushed to the horde first?",
      question: "Cast your anonymous decision:",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "The slowest runner",
          subtitle: "Natural selection in action.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "The loudest screamer",
          subtitle: "Tactical noise reduction.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "The friend who always forgets their wallet",
          subtitle: "Payback time.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Nobody — we go down together in glory",
          subtitle: "Heroic squad loyalty.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "TACTICAL CASUALTY",
          narrative: "The slowest runner was sacrificed. The squad survived another day.",
          resourceDelta: { sanity: -10, chaosScore: 50 },
        },
        B: {
          title: "SILENT NIGHT",
          narrative: "No more screaming. Stealth level increased to 100%.",
          resourceDelta: { sanity: 15, chaosScore: 20 },
        },
        C: {
          title: "DEBT PAID IN FULL",
          narrative: "The freeloader finally contributed to the group.",
          resourceDelta: { sanity: 20, chaosScore: 30 },
        },
        D: {
          title: "MARTYR SQUAD",
          narrative: "You held hands and charged. The zombies were deeply touched before feasting.",
          isAbsurd: true,
          resourceDelta: { sanity: -50, chaosScore: 90 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU DIED TOGETHER AS BROTHERS!",
        },
      },
    },
  ],
};

import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const HOT_TAKES_SCENARIO: ScenarioDefinition = {
  id: "hot_takes",
  title: "HOT TAKES",
  category: "absurd",
  tagline: "Bold opinions. Bigger arguments.",
  description: "Divisive, hilarious pop-culture, food, and lifestyle debates that tear friend groups apart.",
  estimatedMinutes: "10 - 15 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 4,
  isPremium: false,
  vibeTag: "💥 FRIENDSHIP RUINER",
  vibeColor: "red",
  goodFor: "Dinner parties, road trips, warming up the group.",
  features: ["Quick decisions", "45-second debates", "Mind-change tracking"],
  rounds: [
    {
      roundIndex: 1,
      category: "absurd",
      difficulty: "casual",
      prompt: "Pineapple on pizza is being banned worldwide by international treaty. Do you sign the petition to save it?",
      question: "Cast your controversial vote:",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "YES — Sweet & savoury is culinary art",
          subtitle: "Defend culinary freedom.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "NO — It's an abomination, jail the chefs",
          subtitle: "Purist Italian justice.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Add watermelon to pizza too just to trigger everyone",
          subtitle: "Pure agent of chaos.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "I only eat the crust anyway",
          subtitle: "Sociopath behavior.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "PINEAPPLE PRESERVED",
          narrative: "Hawaiian pizza lives to see another day. Half the room is disgusted.",
          resourceDelta: { sanity: 10, chaosScore: 20 },
        },
        B: {
          title: "ITALIAN EMBASSY APPLAUDS",
          narrative: "The treaty passed. Pineapples are confiscated at the border.",
          resourceDelta: { sanity: 15, chaosScore: 10 },
        },
        C: {
          title: "WATERMELON CRIME",
          narrative: "You put warm watermelon on mozzarella. The food inspector fainted.",
          isAbsurd: true,
          resourceDelta: { sanity: -30, chaosScore: 90 },
          triggerChaosMoment: true,
          chaosMomentMessage: "CULINARY TERRORISM COMMITTED!",
        },
        D: {
          title: "SOCIOPATH EXPOSED",
          narrative: "Everyone is staring at the crust eater with genuine concern.",
          resourceDelta: { sanity: -10, chaosScore: 40 },
        },
      },
    },
  ],
};

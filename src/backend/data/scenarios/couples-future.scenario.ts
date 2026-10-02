import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const COUPLES_FUTURE_SCENARIO: ScenarioDefinition = {
  id: "couples_future_chaos",
  title: "COUPLES: THE FUTURE TOGETHER",
  category: "couples",
  tagline: "Dream houses, wedding melt-downs, in-laws & absurd retirement plans.",
  description: "Test your long-term alignment on the biggest questions of life with hilarious hypotheticals.",
  estimatedMinutes: "15 - 20 min",
  recommendedPlayers: "2 players",
  totalRounds: 4,
  isPremium: true,
  priceTier: "₹99",
  vibeTag: "💍 REALITY CHECK",
  vibeColor: "purple",
  goodFor: "Couples planning their future, playful reality checks, fun arguments.",
  features: [
    "Future life alignment scoring",
    "Big decisions negotiation rounds",
    "Partner prediction tests",
    "Flip reveal drama",
    "Future Compatibility CHAOS report",
  ],
  initialResourceState: {
    sanity: 100,
    chaosScore: 15,
  },
  rounds: [
    {
      roundIndex: 1,
      category: "couples",
      difficulty: "normal",
      prompt: "You both buy your dream home together with zero budget limits. What does it look like?",
      question: "Choose your ultimate couple sanctuary:",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Sleek Ultra-Modern Penthouse with Glass Terrace",
          subtitle: "City skyline views, smart home everything, silent luxury.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Cozy Rustic Villa with a Massive Dog Yard",
          subtitle: "Fireplace, fruit trees, 3 golden retrievers running around.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Beachfront Bungalow with Waves at Your Doorstep",
          subtitle: "Surfboards, barefoot mornings, sunset barbecues.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Historic European Townhouse with Books & Art",
          subtitle: "Cobblestone alley, balcony coffee, tall vintage ceilings.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "PENTHOUSE POWER COUPLE",
          narrative: "Floor-to-ceiling glass windows and marble counters. Success looks good on you.",
          resourceDelta: { sanity: 30, chaosScore: -10 },
        },
        B: {
          title: "DOG PARADISE",
          narrative: "Muddy paws and happy tails. Warmest home in the neighborhood!",
          resourceDelta: { sanity: 40, chaosScore: 10 },
        },
        C: {
          title: "COASTAL BLISS",
          narrative: "Salt in your hair and sand between your toes every single day.",
          resourceDelta: { sanity: 35, chaosScore: -15 },
        },
        D: {
          title: "OLD WORLD CHARM",
          narrative: "Reading philosophy and drinking wine under historic archways.",
          resourceDelta: { sanity: 30, chaosScore: -5 },
        },
      },
    },
    {
      roundIndex: 2,
      category: "couples",
      difficulty: "spicy",
      prompt: "Wedding planning pressure hits boiling point! Which emergency wedding route do you take?",
      question: "How do you survive the wedding ceremony?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "700-Guest Grand Indian Extravaganza",
          subtitle: "Sangeet choreography, celebrity DJ, fireworks, everyone invited.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Secret Elopement in the Swiss Alps or Italy",
          subtitle: "Just the two of you, a photographer, and zero family drama.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Intimate 30-Person Beachfront Gathering",
          subtitle: "Only closest friends and parents. Chill dinner and acoustic music.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Court Marriage + Spend the Entire Budget on Traveling",
          subtitle: "₹25 Lakh budget redirected straight to a 6-month honeymoon.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE ROYAL SPECTACLE",
          narrative: "500 aunties took selfies with you. You danced till 4 AM. Iconic!",
          resourceDelta: { sanity: -15, chaosScore: 50 },
        },
        B: {
          title: "SECRET ESCAPE",
          narrative: "Exchanged vows on a snow-capped peak. Parents were shocked but photos are legendary.",
          resourceDelta: { sanity: 35, chaosScore: 20 },
        },
        C: {
          title: "PURE HEARTFELT MAGIC",
          narrative: "Zero stress, emotional speeches, everyone was crying tears of joy.",
          resourceDelta: { sanity: 45, chaosScore: -20 },
        },
        D: {
          title: "THE ULTIMATE HONEYMOON",
          narrative: "Signed the papers in 10 minutes and boarded a flight to Tokyo. Genius move!",
          resourceDelta: { sanity: 40, chaosScore: -10 },
        },
      },
    },
    {
      roundIndex: 3,
      category: "couples",
      difficulty: "spicy",
      prompt: "Your in-laws announce they want to stay at your apartment for 3 FULL WEEKS. Protocol?",
      question: "How do you navigate the in-law invasion?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Full Hospitality Mode: Treat Them Like Royalty",
          subtitle: "Cooking 3 meals a day, tea on demand, maximum politeness.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Book Them a Luxury Boutique Hotel 5 Mins Away",
          subtitle: "'For their privacy and ultimate comfort' (and your sanity).",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Schedule Daily Sightseeing & Tours Non-Stop",
          subtitle: "Keep them out of the apartment from 9 AM to 9 PM every day.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Fake a Sudden Urgent Work Trip",
          subtitle: "One partner flees the scene for 10 days on 'office emergencies'.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "GOLDEN CHILD STATUS",
          narrative: "Exhausted, but the in-laws declare you the greatest spouse in the world!",
          resourceDelta: { sanity: 10, chaosScore: 20 },
        },
        B: {
          title: "LUXURY BOUNDARIES",
          narrative: "They enjoyed the hotel buffet breakfast. You enjoyed having your living room!",
          resourceDelta: { sanity: 35, chaosScore: -15 },
        },
        C: {
          title: "TOUR GUIDE HEROES",
          narrative: "They visited 14 museums and slept like babies every night. Flawless strategy.",
          resourceDelta: { sanity: 25, chaosScore: 10 },
        },
        D: {
          title: "BOGUS CONFERENCE SCANDAL",
          narrative: "They found your laptop at home. 'Wait, aren't you supposed to be in Bangalore?'",
          resourceDelta: { sanity: -20, chaosScore: 45 },
        },
      },
    },
    {
      roundIndex: 4,
      category: "couples",
      difficulty: "normal",
      prompt: "Fast forward to retirement at age 60. How are the two of you living your golden years?",
      question: "What is your couple retirement dream?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Quaint Coastal Coffee Shop & Bakery in Goa",
          subtitle: "Baking bread, meeting travelers, watching the sunset every day.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Custom Luxury RV Traveling the Whole Continent",
          subtitle: "Waking up in a new national park every weekend.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Organic Farm with Solar Power & Vineyard",
          subtitle: "Growing your own veggies, making wine, total self-sufficiency.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "High-Rise City Condo with Theater Season Tickets",
          subtitle: "Dinners with old friends, galleries, and zero gardening work.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE SUNSET BAKERS",
          narrative: "Warm cinnamon rolls and sea breeze. Living the absolute dream together!",
          resourceDelta: { sanity: 45, chaosScore: -20 },
        },
        B: {
          title: "NOMAD SOULS",
          narrative: "Golden hour coffee on folding chairs looking over alpine lakes. Pure freedom.",
          resourceDelta: { sanity: 40, chaosScore: -15 },
        },
        C: {
          title: "VINEYARD RETREAT",
          narrative: "Harvesting grapes together in rubber boots. Your homemade wine is legendary.",
          resourceDelta: { sanity: 40, chaosScore: -10 },
        },
        D: {
          title: "CULTURE VULTURES",
          narrative: "Front-row seats to every comedy show and jazz concert in town.",
          resourceDelta: { sanity: 35, chaosScore: 0 },
        },
      },
    },
  ],
};

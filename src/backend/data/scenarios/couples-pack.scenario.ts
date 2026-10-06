import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const COUPLES_PACK_SCENARIO: ScenarioDefinition = {
  id: "couples_pack_01",
  title: "COUPLES: THE HOLIDAY DISASTER",
  category: "couples",
  tagline: "Lost luggage, fake villas, billionaire exes & 48 hours to survive paradise.",
  description: "A dream holiday turns into a comedy of errors. From 1:00 AM mountain breakdowns to overbooked flights, make high-stakes joint decisions to save your vacation.",
  estimatedMinutes: "15 - 20 min",
  recommendedPlayers: "2 players",
  totalRounds: 4,
  isPremium: false,
  vibeTag: "✈️ VACATION SURVIVAL",
  vibeColor: "pink",
  goodFor: "Date nights, road trips, vacation lovers & hilarious couple debates.",
  features: [
    "Escalating holiday disaster storyline",
    "Branching vacation consequences",
    "Partner debate & negotiation rounds",
    "Secret sabotage objectives",
    "Vacation Survival Relationship Report",
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
      prompt: "You both land in Bali at 1:00 AM for your dream getaway. Your luggage with all clothes, cash, and hotel vouchers was sent to Bangkok by mistake, and your rented scooter just died on a pitch-black mountain road in heavy rain. What is OUR immediate survival move?",
      question: "What do we do in this midnight crisis?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Abandon the scooter and walk toward a roadside noodle shack",
          subtitle: "Seek dry shelter, warm broth, and friendly locals.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Offer $100 cash to a passing pickup-truck driver for a ride",
          subtitle: "Ride in the flatbed under the stars straight into town.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Push the broken scooter 4 km uphill in stubborn silence",
          subtitle: "Refuse to surrender! Exercise and couple endurance.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Sit under a giant banana leaf and split emergency chocolate",
          subtitle: "Embrace the disaster with sugar and late-night laughter.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "WARM NOODLE SHELTER",
          narrative: "The kind noodle aunty gave you hot bowls and dry sarongs. Best meal of the entire trip!",
          resourceDelta: { sanity: 30, chaosScore: -10 },
        },
        B: {
          title: "THE CHICKEN EXPRESS",
          narrative: "You arrived at your town covered in feathers and smelling like livestock, but 100% on time!",
          resourceDelta: { sanity: 15, chaosScore: 25 },
        },
        C: {
          title: "THE SILENT UPHILL MARCH",
          narrative: "Legs burning, muscles screaming. You reached the gas station without saying a single word.",
          resourceDelta: { sanity: -10, chaosScore: 30 },
        },
        D: {
          title: "BANANA LEAF ROMANCE",
          narrative: "Drenched in rain eating molten chocolate at 2 AM. A memory you'll cherish for decades.",
          resourceDelta: { sanity: 35, chaosScore: -5 },
        },
      },
    },
    {
      roundIndex: 2,
      category: "couples",
      difficulty: "spicy",
      prompt: "You arrive at your luxury 'Private Pool Villa' booked online, only to find it's an abandoned construction site with stray roosters! The concierge offers two emergency backups: an underground penthouse suite above a poker club, or 2 bunk beds in a 12-person backpacker dorm. What do WE book?",
      question: "Where do we spend the night?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Take the underground poker penthouse suite",
          subtitle: "High risk, velvet luxury, bass vibrating through the floor.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Take the 12-person backpacker hostel bunk beds",
          subtitle: "Loud, snoring strangers, but safe and budget-friendly.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Bluff your way into the 5-star Four Seasons resort next door",
          subtitle: "Pretend you are billionaire honeymoon influencers.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Sleep under beach loungers with cocktail umbrellas",
          subtitle: "Zero rupees spent, ocean waves, total open-air freedom.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CASINO ROYALE SUITE",
          narrative: "Free caviar, neon lights, and high-roller energy! You slept like VIP kingpins.",
          resourceDelta: { sanity: 25, chaosScore: 20 },
        },
        B: {
          title: "HOSTEL DORM ODYSSEY",
          narrative: "German tourists talking about philosophy at 4 AM. Character-building at its finest.",
          resourceDelta: { sanity: 10, chaosScore: 15 },
        },
        C: {
          title: "THE FIVE-STAR CON",
          narrative: "The manager believed your story! Upgraded to the Presidential Villa with complimentary spa.",
          resourceDelta: { sanity: 40, chaosScore: 10 },
        },
        D: {
          title: "BEACH BUM SURVIVORS",
          narrative: "Sunrise over the ocean was breathtaking, although crabs investigated your partner's flip-flops.",
          resourceDelta: { sanity: 20, chaosScore: -10 },
        },
      },
    },
    {
      roundIndex: 3,
      category: "couples",
      difficulty: "spicy",
      prompt: "Next afternoon at an exclusive beach club, your partner's wealthy ex is sitting in the VIP cabana with a champagne magnum and invites you BOTH over for unlimited free caviar and a private sunset yacht cruise. How do WE play this?",
      question: "How do we handle the ex's VIP invite?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Accept with open arms and drink all their vintage champagne",
          subtitle: "Act like an effortless power couple enjoying free luxury.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Politely decline and drink cheap coconut water on the public beach",
          subtitle: "Stand on dignity, zero awkwardness, true self-respect.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Send an expensive cocktail to their table billed to their own tab",
          subtitle: "A cheeky, unforgettable power move with a napkin note.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Put on an over-the-top, affectionate romance display right in front of them",
          subtitle: "Dramatic movie-style PDA to assert total dominance.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "YACHT CRUISE HIGH-LIFE",
          narrative: "Drank $500 of champagne on their yacht. The ex looked bewildered while you two took golden-hour selfies!",
          resourceDelta: { sanity: 30, chaosScore: 25 },
        },
        B: {
          title: "SIMPLE DIGNITY",
          narrative: "Fresh coconuts, sandy toes, zero drama. You both agreed your own company is unmatched.",
          resourceDelta: { sanity: 35, chaosScore: -15 },
        },
        C: {
          title: "THE POWER PLAY",
          narrative: "They read your napkin note: 'Thanks for the drinks, you're sweet!' The whole beach club laughed.",
          resourceDelta: { sanity: 25, chaosScore: 35 },
        },
        D: {
          title: "CINEMATIC JEALOUSY",
          narrative: "You danced salsa on the deck. The ex packed their sunglasses and left the venue within 15 minutes!",
          resourceDelta: { sanity: 40, chaosScore: 20 },
        },
      },
    },
    {
      roundIndex: 4,
      category: "couples",
      difficulty: "spicy",
      prompt: "Final day! Your flight home is overbooked by 1 passenger. The airline offers a free $1,500 flight voucher if ONE of you stays behind alone for 24 hours, or you both can stay together and miss Monday morning work meetings. What is OUR verdict?",
      question: "What is our final flight resolution?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "One partner takes the $1,500 voucher for a solo luxury spa day",
          subtitle: "One flies home for work; the other enjoys 24 hours in paradise.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Refuse to separate! Miss work, take the boss's heat together",
          subtitle: "Solidarity forever. Extend the vacation another full day.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Create a theatrical scene at the gate demanding First Class upgrades for both",
          subtitle: "Loud, dramatic negotiation until the gate manager caves in.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Flip a coin right in front of the gate agent to decide who stays",
          subtitle: "Let CHAOS decide our fate in public view.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE SOLO SPA WINDFALL",
          narrative: "$1,500 voucher in pocket! One partner had infinity-pool massages; the other had quiet flight sleep.",
          resourceDelta: { sanity: 30, chaosScore: 10 },
        },
        B: {
          title: "PARTNERS IN CRIME",
          narrative: "You texted work 'Severe flight delay' and spent another 24 hours eating grilled fish on the beach!",
          resourceDelta: { sanity: 35, chaosScore: -10 },
        },
        C: {
          title: "THE FIRST-CLASS UPGRADE",
          narrative: "The gate agent caved! Champagne, lie-flat beds, and warm nuts in First Class for the entire flight home.",
          resourceDelta: { sanity: 45, chaosScore: 15 },
        },
        D: {
          title: "COIN TOSS AIRPORT DRAMA",
          narrative: "The coin landed! The entire gate cheered, and the gate agent gave you free airport lounge passes!",
          resourceDelta: { sanity: 25, chaosScore: 20 },
        },
      },
    },
  ],
};

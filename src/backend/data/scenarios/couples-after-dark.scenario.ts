import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const COUPLES_AFTER_DARK_SCENARIO: ScenarioDefinition = {
  id: "couples_after_dark",
  title: "COUPLES: THE 2 AM WILD EMERGENCY",
  category: "couples",
  tagline: "Mysterious cash boxes, 3 AM doorstep panic & surviving the craziest night of your lives.",
  description: "Late-night high-stakes dilemmas for two partners. Make rapid joint decisions to outsmart the chaos before sunrise.",
  estimatedMinutes: "15 - 25 min",
  recommendedPlayers: "2 players",
  totalRounds: 4,
  isPremium: true,
  priceTier: "$2.99",
  vibeTag: "🌙 2 AM ADRENALINE",
  vibeColor: "purple",
  goodFor: "Late night date nights, thrilling dilemmas, high-stakes teamwork & laughter.",
  features: [
    "Escalating midnight emergency storyline",
    "Branching late-night consequences",
    "Fast-paced couple debate rounds",
    "Secret sabotage twists",
    "Midnight Survivor Relationship Report",
  ],
  initialResourceState: {
    sanity: 100,
    chaosScore: 20,
  },
  rounds: [
    {
      roundIndex: 1,
      category: "couples",
      difficulty: "spicy",
      prompt: "It's 1:30 AM. A breathless courier delivers a heavy aluminum lockbox to your doorstep with an envelope of $100,000 cash and a note: 'Spend every single dollar before sunrise or the sender takes it back with interest.' What is OUR overnight blitz plan?",
      question: "Burn $100,000 before sunrise together:",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Rent an exotic supercar, book the Ritz penthouse & order 40 gourmet burgers",
          subtitle: "Live like Hollywood royalty for exactly 5 hours.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Buy gold coins & luxury timepieces from 24-hr airport duty-free",
          subtitle: "Convert the mystery cash into liquid assets to keep tomorrow.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Walk the night streets distributing $1,000 envelopes to night workers",
          subtitle: "Cleaners, emergency nurses, stray shelters—pure good karma.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Throw a spontaneous rooftop rave with custom DJs for every night owl awake",
          subtitle: "Blow the entire budget throwing a legendary city block party.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE PRESIDENTIAL RUSH",
          narrative: "V12 engine echoing through empty city tunnels at 2 AM! Penthouse room service arrived on silver platters.",
          resourceDelta: { sanity: 35, chaosScore: 20 },
        },
        B: {
          title: "THE FINANCIAL MASTERMINDS",
          narrative: "Duty-free clerks were stunned as you bought gold bullion at 3 AM. Wealth secured for the future!",
          resourceDelta: { sanity: 40, chaosScore: -10 },
        },
        C: {
          title: "MIDNIGHT ROBIN HOODS",
          narrative: "Tears of joy from night-shift nurses and street cleaners. You two became local folk heroes.",
          resourceDelta: { sanity: 50, chaosScore: -25 },
        },
        D: {
          title: "THE ROOFTOP RIOT",
          narrative: "120 strangers dancing under lasers until 4 AM. Even the pizza delivery guy joined the DJ booth!",
          resourceDelta: { sanity: 20, chaosScore: 40 },
        },
      },
    },
    {
      roundIndex: 2,
      category: "couples",
      difficulty: "spicy",
      prompt: "At 2:15 AM, your apartment intercom buzzes loudly. The lobby guard whispers in panic: 'Two men in black suits with earpieces are at the front gate asking for you both, claiming they are private investigators.' What is OUR move?",
      question: "How do we evade the midnight investigators?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Take the fire-escape stairs to the basement garage and slip away in your car",
          subtitle: "Tactical stealth escape before they reach your floor.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "March straight down to the lobby together and confront them face-to-face",
          subtitle: "Demand their badges and legal warrants with total authority.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Lock all deadbolts, kill all lights, and wait in silence with a rolling pin",
          subtitle: "Fortify the fortress and turn the apartment pitch black.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Order a decoy Uber from the front gate to draw them away while watching",
          subtitle: "Misdirection warfare while you observe from the balcony.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE SHADOW ESCAPE",
          narrative: "Slipped through the service basement like seasoned spies! The investigators knocked on an empty door.",
          resourceDelta: { sanity: 30, chaosScore: 15 },
        },
        B: {
          title: "THE LOBBY SHOWDOWN",
          narrative: "Turns out they were private security sent by an eccentric billionaire uncle! They handed over a congratulatory letter.",
          resourceDelta: { sanity: 35, chaosScore: -10 },
        },
        C: {
          title: "FORTRESS UNDER SIEGE",
          narrative: "Holding breath in the dark for 20 minutes while footsteps paused outside your door. Intense adrenaline!",
          resourceDelta: { sanity: 10, chaosScore: 30 },
        },
        D: {
          title: "THE UBER DECOY",
          narrative: "The investigators sprinted after the decoy sedan! You watched with popcorn from your 6th-floor balcony.",
          resourceDelta: { sanity: 40, chaosScore: 10 },
        },
      },
    },
    {
      roundIndex: 3,
      category: "couples",
      difficulty: "spicy",
      prompt: "3:30 AM. Your eccentric next-door neighbor knocks frantically wearing silk pajamas, begging for help: their smuggled baby exotic animal escaped into the ventilation shafts and is scratching loudly behind your bedroom wall! What do WE do?",
      question: "How do we handle the 3 AM exotic creature?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Grab a flashlight and a heavy blanket, open the vent, and rescue it together",
          subtitle: "Heroic couple rescue mission at 3:30 in the morning.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Shut the front door, lock it twice, and dial animal rescue and building security",
          subtitle: "Zero tolerance for illegal wildlife. Let the pros handle it.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Threaten to report them unless they surrender their covered parking spot for 1 year",
          subtitle: "A ruthless, brilliant negotiation in the middle of the night.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Lure it into the living room with chicken nuggets and consider keeping it as a pet",
          subtitle: "If it's cute, we are adopting it right now.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE JUNGLE RESCUE",
          narrative: "It was a tiny baby sugar glider! It leaped straight into your partner's hood and fell asleep purring.",
          resourceDelta: { sanity: 40, chaosScore: -5 },
        },
        B: {
          title: "PROFESSIONAL CONTAINMENT",
          narrative: "Wildlife officers arrived in 10 minutes. The neighbor was fined, and your hallway was restored to peace.",
          resourceDelta: { sanity: 30, chaosScore: -15 },
        },
        C: {
          title: "PARKING EXTORTION SUCCESS",
          narrative: "The neighbor signed over their prime basement parking spot on a napkin! Prime real estate secured forever.",
          resourceDelta: { sanity: 45, chaosScore: 10 },
        },
        D: {
          title: "THE CHICKEN NUGGET LURE",
          narrative: "It ate 4 nuggets from your partner's hand. You now have a secret midnight mascot living behind the sofa.",
          resourceDelta: { sanity: 20, chaosScore: 35 },
        },
      },
    },
    {
      roundIndex: 4,
      category: "couples",
      difficulty: "spicy",
      prompt: "5:30 AM. Sirens in the distance, dawn breaking over the skyline. You both have to report to your real corporate jobs in 2 hours with zero sleep and memories of pure madness. How do WE wrap up this legendary night?",
      question: "What is our grand sunrise wrap-up?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Call in 'extreme emergency' to both your bosses and sleep until 4:00 PM like champions",
          subtitle: "Sacrifice one sick day for the greatest sleep of your lives.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Chug triple espressos, put on designer sunglasses, and walk into work like smooth spies",
          subtitle: "Power through the Monday meetings on pure caffeine and adrenaline.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Pack a quick weekend bag right now, ditch work, and drive straight into the hills",
          subtitle: "Turn one wild night into an impromptu 3-day roadtrip getaway.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Head to a 24-hr breakfast dhaba, eat hot butter parathas, and debrief the madness",
          subtitle: "Crispy food, sweet chai, watching the city wake up together.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE CHAMPION'S COMA",
          narrative: "Curtains drawn, phones on airplane mode. Woke up at 4:30 PM with zero regrets and legendary memories.",
          resourceDelta: { sanity: 40, chaosScore: -20 },
        },
        B: {
          title: "THE CORPORATE SPIES",
          narrative: "You two exchanged knowing glances across conference tables all morning. Untouchable power couple!",
          resourceDelta: { sanity: 25, chaosScore: 15 },
        },
        C: {
          title: "THE ROADTRIP GETAWAY",
          narrative: "Windows rolled down, mountain air filling the car. One crazy night turned into the best weekend of the year.",
          resourceDelta: { sanity: 45, chaosScore: 30 },
        },
        D: {
          title: "SUNRISE CHAI TRIUMPH",
          narrative: "Steaming hot parathas and cutting chai. You laughed until your stomachs hurt as the sun lit the morning sky.",
          resourceDelta: { sanity: 50, chaosScore: -15 },
        },
      },
    },
  ],
};

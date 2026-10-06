import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const WEDDING_SCENARIO: ScenarioDefinition = {
  id: "wedding_chaos",
  title: "THE DESTINATION WEDDING DISASTER: HAMPTONS & NAPA MELTDOWN",
  category: "life",
  tagline: "Rehearsal toasts, runaway best men, and $15,000 platinum rings.",
  description: "A lavish 3-day Hamptons destination wedding where family politics, drunken best-man speeches, missing rings, and an open bar crisis turn high society celebration into chaos.",
  estimatedMinutes: "25 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 8,
  isPremium: false,
  priceTier: "FREE",
  vibeTag: "💃 MAXIMUM DRAMA",
  vibeColor: "rose",
  goodFor: "Wedding squads, bridesmaids, groomsmen, bachelor parties, family gatherings.",
  features: [
    "8 connected high-society wedding rounds",
    "Rehearsal dinner DJ showdowns",
    "Missing rings & cold feet drama",
    "Collapsed 5-tier wedding cake disaster",
    "Disastrous best man open-mic speeches",
    "Midnight golf-cart getaway finale",
  ],
  initialResourceState: {
    balance: 5000,
    sanity: 100,
    chaosScore: 35,
  },
  rounds: [
    {
      roundIndex: 1,
      category: "life",
      difficulty: "normal",
      prompt: "At 10:30 PM during the reception, the strict mother-of-the-bride demands vintage smooth jazz, while the groomsmen demand high-energy 2000s throwback hip-hop.",
      question: "What does the group DJ do?",
      highlightedText: "Reception DJ Civil War",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Drop the bass-heavy 2000s hip-hop: The dance floor is begging for it",
          subtitle: "Risk mother-of-the-bride cutting off the honeymoon fund.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Play slow classical jazz and put the entire bridal party to sleep",
          subtitle: "Respect elders, kill the party vibe completely.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Mashup remix: Vintage saxophone over heavy 808 trap beats",
          subtitle: "The experimental middle ground that baffles everyone.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Pretend the sound system blew a fuse and cut the power",
          subtitle: "Blame technical failure and escape the DJ booth.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "HIP-HOP EXPLOSION",
          narrative: "Two uncles tore their suits breakdancing! The mother-of-the-bride left in an offended huff.",
          resourceDelta: { sanity: 20, balance: -500 },
        },
        B: {
          title: "SNORE FESTIVAL",
          narrative: "Groomsmen abandoned the ballroom to drink beers on the golf course. Energy flatlined.",
          resourceDelta: { sanity: -25 },
        },
        C: {
          title: "THE ELECTRO-JAZZ HIT",
          narrative: "Accidental viral sensation! Even the grandfather was nodding along with a martini.",
          resourceDelta: { sanity: 35 },
        },
        D: {
          title: "THE AWKWARD SILENCE",
          narrative: "Dead silence filled the ballroom. All you could hear was fork clatter on china.",
          resourceDelta: { sanity: -30 },
          triggerChaosMoment: true,
          chaosMomentMessage: "Party killed! Scapegoat prosecution for the sound engineer!",
        },
      },
    },

    {
      roundIndex: 2,
      category: "life",
      difficulty: "spicy",
      prompt: "2 hours before the ceremony, the groom locks himself in the bridal suite bathroom, having severe cold feet, and refuses to open the door.",
      question: "How do the friends handle the panicked groom?",
      highlightedText: "Groom Locked in Bathroom",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Shoulder-check the vintage door down and splash cold water on his face",
          subtitle: "Aggressive love. The wedding must go on.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Listen through the door and offer to help him sneak out to the airport",
          subtitle: "Friend loyalty: Help him escape if he truly wants to run.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Slide two shots of premium tequila under the door and give a pep talk",
          subtitle: "Liquid courage and inspirational coaching.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Alert the bride immediately so she knows what's happening",
          subtitle: "Complete transparency, maximum emotional firestorm.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE SOGGY GROOM",
          narrative: "Door frame splintered ($1,200 resort damage). He stood at the altar damp, but happily married.",
          resourceDelta: { balance: -1200, sanity: -10 },
        },
        B: {
          title: "RUNAWAY GETAWAY",
          narrative: "You drove him away in an Uber. Both families declared an eternal blood feud against your squad.",
          resourceDelta: { sanity: -60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "The wedding is OFF! All-out blame war unleashed!",
        },
        C: {
          title: "TEQUILA BRAVERY",
          narrative: "He unlocked the door smiling, straightened his bow-tie, and delivered the best vows in resort history.",
          resourceDelta: { sanity: 40, balance: -100 },
        },
        D: {
          title: "BRIDE AT THE DOORSTEP",
          narrative: "She kicked the door in high heels. He surrendered in 10 seconds flat.",
          resourceDelta: { sanity: -20 },
        },
      },
    },

    {
      roundIndex: 3,
      category: "life",
      difficulty: "normal",
      prompt: "At 11:15 PM, the open bar cuts off. The catering director says extending the open bar for another hour will cost $2,000 cash upfront, or guests are restricted to water.",
      question: "Who finances the midnight open-bar extension?",
      highlightedText: "Bar Cuts Off at 11 PM",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Friends pool $2,000 together as an extra wedding gift",
          subtitle: "Be the legendary heroes of the wedding night.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Raid the secret vintage bourbon stash in the father-in-law's SUV trunk",
          subtitle: "He definitely has 4 cases of single barrel hidden away.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Send 2 designated drivers on a 15-mile run to the 24-hour liquor depot",
          subtitle: "Save $1,500 by buying retail cases.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Declare the party over and herd everyone to the dessert buffet",
          subtitle: "Eat wedding cake and call it a night.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE HEROES OF MIDNIGHT",
          narrative: "The bar reopened with deafening cheers! Group funds took a steep $2,000 hit, but legends were born.",
          resourceDelta: { balance: -2000, sanity: 30 },
        },
        B: {
          title: "FATHER-IN-LAW'S WRATH",
          narrative: "He caught you opening his tailgate. He glared at your table through the rest of the evening.",
          resourceDelta: { sanity: -25 },
        },
        C: {
          title: "HIGHWAY BOOTLEGGERS",
          narrative: "Brought back 5 cases at 12:30 AM. The afterparty continued on the beach until 4:30 AM.",
          resourceDelta: { balance: -500, sanity: 35 },
        },
        D: {
          title: "EARLY EXITS",
          narrative: "Disappointed guests cleared out the dessert table and went to sleep by midnight. Anti-climactic.",
          resourceDelta: { sanity: -15 },
        },
      },
    },

    {
      roundIndex: 4,
      category: "life",
      difficulty: "spicy",
      prompt: "You notice a squad of 8 college kids who clearly crashed the wedding eating the imported sushi raw-bar and drinking top-shelf tequila.",
      question: "How do you handle the wedding crashers?",
      highlightedText: "8 Wedding Crashers",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Confront them loudly and have estate security escort them out",
          subtitle: "Make a public spectacle and protect the guest list.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Recruit them into the bridal party dance circle to keep energy at 100",
          subtitle: "Put them to work in exchange for the free sushi.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Challenge their squad to a dance battle in the middle of the ballroom",
          subtitle: "Cinematic dance showdown on the custom dance floor.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Ignore them: Great weddings always have crashers",
          subtitle: "Abundance mindset. There's plenty of food.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "SECURITY SCUFFLE",
          narrative: "A shouting match broke out near the gift table. Someone knocked over a champagne tower.",
          resourceDelta: { balance: -800, sanity: -30 },
          triggerChaosMoment: true,
          chaosMomentMessage: "Champagne tower destroyed! Blame tax applied!",
        },
        B: {
          title: "THE CRASHER HYPE CREW",
          narrative: "They were actually incredible dancers and lifted the bride and groom onto their shoulders!",
          resourceDelta: { sanity: 35 },
        },
        C: {
          title: "THE GREAT DANCE BATTLE",
          narrative: "Viral TikTok moment! Everyone was filming and cheering as the crashers hit backflips.",
          resourceDelta: { sanity: 40 },
        },
        D: {
          title: "PEACEFUL SATED CRASHERS",
          narrative: "They toasted the bride, ate politely, and quietly disappeared into the night.",
          resourceDelta: { sanity: 15 },
        },
      },
    },

    {
      roundIndex: 5,
      category: "life",
      difficulty: "spicy",
      prompt: "CAKE CATASTROPHE! During the grand cake-cutting procession, a clumsy guest trips over the photographer's tripod and sends the 5-tier, $4,500 artisanal vanilla bean cake tumbling directly into the center of the parquet dance floor!",
      question: "How does the squad manage the collapsed wedding cake?",
      highlightedText: "Collapsed 5-Tier Cake",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Instigate a full-blown playful cake fight between the wedding party",
          subtitle: "Transform total tragedy into viral, joyful chaos.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Sprint to the catering kitchen and assemble an emergency donut/macaron tower",
          subtitle: "Fast-thinking culinary salvage before the bride sees.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Surround the cake with dessert forks and invite all guests to eat it straight off the floor",
          subtitle: "'The 5-second rule applies to $4,500 cakes.'",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Blame the photographer loudly and demand their liability insurance pay for it",
          subtitle: "Point fingers immediately to deflect from the squad.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE LEGENDARY CAKE FIGHT",
          narrative: "Frosting flew everywhere! The bride laughed hysterically and smashed a handful into the groom's nose! The photos won wedding of the year!",
          resourceDelta: { sanity: 45, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "FULL-SCALE WEDDING CAKE FIGHT UNLEASHED!",
        },
        B: {
          title: "THE MACARON TOWER SAVE",
          narrative: "The 3-tier macaron tower with sparklers looked high fashion! Guests thought it was an intentional culinary surprise!",
          resourceDelta: { balance: -300, sanity: 30, chaosScore: 10 },
        },
        C: {
          title: "DANCE FLOOR GLUTTONS",
          narrative: "20 guests actually grabbed spoons and ate it off the marble! Bizarre, slightly unhinged, but totally delicious.",
          resourceDelta: { sanity: 20, chaosScore: 40 },
        },
        D: {
          title: "PHOTOGRAPHER SHOWDOWN",
          narrative: "The photographer stopped shooting in protest! The rest of the reception photos had to be taken on iPhones.",
          resourceDelta: { sanity: -35, chaosScore: 50 },
        },
      },
    },

    {
      roundIndex: 6,
      category: "life",
      difficulty: "spicy",
      prompt: "THE MISSING VEIL: 45 minutes before outdoor sunset portraits, the bride's bespoke $8,000 vintage lace veil has vanished from the bridal suite. Last seen draped over a chair near the mimosa bar.",
      question: "Where does the squad search for the heirloom veil?",
      highlightedText: "$8,000 Missing Heirloom Veil",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Interrogate the bridal suite room service staff and search laundry hampers",
          subtitle: "Check every linen cart on the 3rd floor.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Check the estate vineyards: Did someone wear it outside for selfies?",
          subtitle: "Comb the grapevines for caught vintage lace.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Craft an emergency minimalist replacement veil from tulle fabric in the florist's van",
          subtitle: "DIY bridal couture in 15 minutes.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Offer a $500 cash reward over the estate PA system for its safe return",
          subtitle: "Mobilize the entire resort staff.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "LAUNDRY HAMPER EXTRACTION",
          narrative: "Found at the bottom of a housekeeping cart! Steamed in 8 minutes and placed on the bride's head with 30 seconds to spare!",
          resourceDelta: { sanity: 35, chaosScore: 20 },
        },
        B: {
          title: "VINEYARD RETRIEVAL",
          narrative: "A flower girl was playing fairy princess with it among the Pinot Noir vines! Unharmed and returned with giggles.",
          resourceDelta: { sanity: 30, chaosScore: 15 },
        },
        C: {
          title: "FLORIST COUTURE HIT",
          narrative: "The florist wove fresh white jasmine into simple tulle. The bride loved it even more than the $8,000 original!",
          resourceDelta: { balance: -150, sanity: 40, chaosScore: 10 },
        },
        D: {
          title: "THE BOUNTY PAYOUT",
          narrative: "A valet ran it up in 3 minutes. Cost $500 cash, but saved the wedding from complete nuclear meltdown.",
          resourceDelta: { balance: -500, sanity: 20, chaosScore: 5 },
        },
      },
    },

    {
      roundIndex: 7,
      category: "life",
      difficulty: "spicy",
      prompt: "UNFILTERED TOAST DISASTER: The Best Man has had 6 bourbon cocktails and takes the cordless microphone. He begins: 'Before Sarah, John swore he'd never settle down after that wild week in Cabo with his college ex...' The entire ballroom gasps into dead silence.",
      question: "How does the squad cut off the catastrophic best-man toast?",
      highlightedText: "Unhinged Best Man Toast",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Full football tackle: Blindside dive into the best man and knock the mic away",
          subtitle: "Physical sacrifice to prevent relational destruction.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Signal the DJ to blast wedding horns and sirens at 120 decibels to drown his voice",
          subtitle: "Sonic warfare over the speaker array.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Grab the second microphone, turn it into a high-energy toast to the couple's true love",
          subtitle: "Master-class oratorical takeover.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Kill the main ballroom circuit breaker and plunge the room into darkness",
          subtitle: "Total blackout: The silent reset.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE SPEECH TACKLE",
          narrative: "You tackled him into the floral arch! The mic skittered away, everyone laughed nervously, and disaster was cleanly averted!",
          resourceDelta: { sanity: 25, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "BEST MAN TACKLED TO SAVE THE MARRIAGE!",
        },
        B: {
          title: "AIR HORN BARRAGE",
          narrative: "The DJ dropped foghorns and 'Yeah!' by Usher! The dance floor flooded and nobody heard the rest of his story!",
          resourceDelta: { sanity: 35, chaosScore: 30 },
        },
        C: {
          title: "THE ORATORICAL HERO",
          narrative: "You delivered such a poetic, tear-jerking defense of their soulmate bond that the bride's mother hugged you weeping!",
          resourceDelta: { sanity: 45, chaosScore: 10 },
        },
        D: {
          title: "TACTICAL BALLROOM BLACKOUT",
          narrative: "Breaker tripped! Darkness for 45 seconds while someone physically escorted the best man to bed with a pitcher of water.",
          resourceDelta: { sanity: 20, chaosScore: 40 },
        },
      },
    },

    {
      roundIndex: 8,
      category: "life",
      difficulty: "spicy",
      prompt: "GRAND FINALE AT 3:30 AM! The formal reception has ended, but 12 survivors find the resort golf-cart charging depot unlocked. On the 18th fairway under the moonlight is a beach bonfire with leftover champagne and guitars.",
      question: "How does the squad conclude the destination wedding weekend?",
      highlightedText: "3:30 AM Golf-Cart Grand Prix",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Grand Prix golf-cart race across all 18 holes down to the beach bonfire",
          subtitle: "Midnight rally across sand traps and greens.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Sneak into the estate infinity pool with remaining champagne for skinny dipping",
          subtitle: "Hamptons tradition under the stars.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Gather around the beach fire, pass acoustic guitars, and sing throwback anthems",
          subtitle: "Intimate, unforgettable camaraderie till sunrise.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Raid the bridal suite kitchen for late-night grilled cheese sandwiches",
          subtitle: "Comfort food gluttony to end the night.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE 18-HOLE GRAND PRIX",
          narrative: "Golf carts drifted through sand traps! You reached the beach fire cheering wildly with zero damage to the carts! Peak wedding legend status!",
          resourceDelta: { sanity: 50, chaosScore: 70 },
          triggerChaosMoment: true,
          chaosMomentMessage: "GOLF CART GRAND PRIX TRIUMPH! ETERNAL WEDDING LEGENDS!",
        },
        B: {
          title: "INFINITY POOL GLORY",
          narrative: "Champagne in the heated pool under a sea of stars. The bride and groom joined in their formal wear! Iconic memories!",
          resourceDelta: { sanity: 45, chaosScore: 40 },
        },
        C: {
          title: "THE FAIRWAY BONFIRE BLISS",
          narrative: "Singing acoustic rock under the warm ocean breeze until the sunrise painted the sky pink. The perfect wedding finale.",
          resourceDelta: { sanity: 50, chaosScore: -10 },
        },
        D: {
          title: "MIDNIGHT CHEESE FEAST",
          narrative: "30 gourmet sourdough grilled cheeses with white cheddar. Fed the entire bridal party and slept like babies.",
          resourceDelta: { balance: -80, sanity: 40, chaosScore: 10 },
        },
      },
    },
  ],
};

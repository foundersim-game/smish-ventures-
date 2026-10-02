import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const COUPLES_WHO_KNOWS_WHO_SCENARIO: ScenarioDefinition = {
  id: "couples_who_knows_who",
  title: "COUPLES THRILLER: MURDER AT THE RETREAT",
  category: "couples",
  tagline: "A dead billionaire in the cellar, a storm outside, and 45 minutes to clear your names.",
  description: "An atmospheric locked-room murder mystery for two partners. Gather evidence, interrogate suspects, and make high-stakes joint decisions to survive the night.",
  estimatedMinutes: "15 - 25 min",
  recommendedPlayers: "2 players",
  totalRounds: 4,
  isPremium: false,
  vibeTag: "🔪 THRILLER & SUSPENSE",
  vibeColor: "red",
  goodFor: "Date nights, mystery lovers, high-energy debates & strategic teamwork.",
  features: [
    "Locked-room murder mystery storyline",
    "Branching suspense consequences",
    "Partner interrogation debates",
    "High-stakes secret saboteur twists",
    "Final Case-Solved Relationship Report",
  ],
  initialResourceState: {
    sanity: 100,
    chaosScore: 10,
  },
  rounds: [
    {
      roundIndex: 1,
      category: "couples",
      difficulty: "normal",
      prompt: "Midnight storm at an isolated hill-station manor. You both walk into the wine cellar and find the eccentric billionaire host face-down with a shattered crystal decanter. The heavy oak door slams shut and locks from the outside! What is OUR immediate move?",
      question: "Choose our first move under pressure:",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Search the body for the master keycard & flashlight",
          subtitle: "Get light, check his pulse, and find the keys.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Preserve the bloody crystal decanter in a napkin",
          subtitle: "Save forensic fingerprints before anyone tampers with it.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Kick down the cellar air-vent grate to climb out",
          subtitle: "Ditch the crime scene before we get framed.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Pound loudly on the cellar door shouting for help",
          subtitle: "Pretend we just walked in and alert the other guests.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "KEYCARD SECURED",
          narrative: "Found the master keycard and an encrypted USB stick in his inner coat pocket! The door unlocks with a click.",
          resourceDelta: { sanity: 25, chaosScore: -5 },
        },
        B: {
          title: "EVIDENCE PRESERVED",
          narrative: "Decanter safely wrapped! But vintage red wine stained your partner's sleeve, making them look slightly guilty.",
          resourceDelta: { sanity: 20, chaosScore: 15 },
        },
        C: {
          title: "VENTILATION ESCAPE",
          narrative: "You both squeezed through the air vent into the library, but dropped your flashlight down the shaft in the dark.",
          resourceDelta: { sanity: 15, chaosScore: 30 },
        },
        D: {
          title: "SQUAD ALARMED",
          narrative: "The door was unlocked from outside! Three terrified guests with flashlights are staring directly at you two over the body.",
          resourceDelta: { sanity: -10, chaosScore: 40 },
        },
      },
    },
    {
      roundIndex: 2,
      category: "couples",
      difficulty: "spicy",
      prompt: "Inside the private study, you uncover a hidden wall safe containing ₹50,00,000 in untraceable cash, a vintage revolver with 2 bullets, and a guest ledger with YOUR NAMES circled in red ink! Footsteps are creaking on the stairs above. What do WE take?",
      question: "What do we take before running?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Grab the revolver and hide behind the library curtains",
          subtitle: "Arm ourselves and prepare an ambush for the intruder.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Shove the ₹50,00,000 cash into your trench-coat",
          subtitle: "If we're being framed, we might as well fund our defense.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Take only the circled ledger as legal evidence",
          subtitle: "Leave weapons and cash untouched to prove 100% innocence.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Leave everything, shut the safe, and kill the lights",
          subtitle: "Slip out unseen like ghosts without disturbing a thing.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "ARMED & DANGEROUS",
          narrative: "You cocked the hammer. The shadow in the doorway froze, dropped their flashlight in terror, and fled into the rain!",
          resourceDelta: { sanity: 30, chaosScore: 20 },
        },
        B: {
          title: "THE HEIST WINDFALL",
          narrative: "Heavy pockets, racing hearts! You grabbed the bonds and slipped through the French doors into the gardens.",
          resourceDelta: { sanity: 15, chaosScore: 35 },
        },
        C: {
          title: "THE PROOF SECURED",
          narrative: "The handwriting on the ledger matches the house doctor's pen! You now have proof of who orchestrated this setup.",
          resourceDelta: { sanity: 35, chaosScore: -10 },
        },
        D: {
          title: "GHOSTS IN THE NIGHT",
          narrative: "Pitch black. The intruder searched the safe frantically, found nothing, and cursed aloud in a recognizable voice.",
          resourceDelta: { sanity: 25, chaosScore: -5 },
        },
      },
    },
    {
      roundIndex: 3,
      category: "couples",
      difficulty: "spicy",
      prompt: "You run into the greenhouse. It's the jittery house doctor holding a medical syringe, swearing he heard screams and came to help, but his boots are covered in fresh red mud from the wine cellar! How do WE handle him?",
      question: "How do we confront the prime suspect?",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Corner him at weapon-point and interrogate him on the mud",
          subtitle: "Aggressive confrontation to force a full confession.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Feign panic, act innocent, and ask him to lead us to the exit",
          subtitle: "Bait him into revealing his hidden getaway route.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Tackle him together and tie him to a greenhouse column",
          subtitle: "Physical takedown using garden hose to eliminate the threat.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Bluff that we already phoned cyber police and his GPS is traced",
          subtitle: "Psychological warfare to break his nerve completely.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CONFESSION UNDER PRESSURE",
          narrative: "The doctor broke down trembling! He dropped a blackmail letter proving the host was extorting every single guest.",
          resourceDelta: { sanity: 30, chaosScore: -10 },
        },
        B: {
          title: "THE DOUBLE CROSS",
          narrative: "He led you to the private garage, but tried to lock you inside! Your partner jammed the door with a crowbar.",
          resourceDelta: { sanity: 10, chaosScore: 30 },
        },
        C: {
          title: "HOGTIED IN THE ORCHIDS",
          narrative: "Flawless couple takedown! In his coat pocket, you found the missing cellar keys and a digital audio recorder.",
          resourceDelta: { sanity: 35, chaosScore: 10 },
        },
        D: {
          title: "PSYCHOLOGICAL CHECKMATE",
          narrative: "His jaw dropped. He smashed his own phone in panic, blabbering about an accomplice in the main house!",
          resourceDelta: { sanity: 25, chaosScore: 15 },
        },
      },
    },
    {
      roundIndex: 4,
      category: "couples",
      difficulty: "spicy",
      prompt: "Police sirens echo up the mountain road—they are 2 minutes away! The manor generator roars back on, blinding lights flood the front courtyard, and arriving guests are screaming. What is OUR grand finale move?",
      question: "Deliver our final masterstroke:",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Present the evidence and expose the killer publicly in the hall",
          subtitle: "A classic detective reveal in front of all guests and police.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Hotwire the host's vintage sports car and flee into the night",
          subtitle: "Outlaws on the run! Bonnie and Clyde escape through the mist.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Broadcast the security camera backup footage over the house intercom",
          subtitle: "Let the 4K CCTV tape expose the real murderer automatically.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Hand over the doctor's syringe and ledger directly to the police captain",
          subtitle: "Zero theatrics—pure forensic delivery on arrival.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CASE CLOSED IN GLORY",
          narrative: "You laid out the ledger and decanter fragments like master detectives. The real killer was handcuffed on the spot!",
          resourceDelta: { sanity: 40, chaosScore: -20 },
        },
        B: {
          title: "BONNIE & CLYDE ESCAPE",
          narrative: "V8 engine roaring through winding mountain roads under the stars. You survived the retreat and became legends!",
          resourceDelta: { sanity: 20, chaosScore: 50 },
        },
        C: {
          title: "CCTV SCREENPLAY",
          narrative: "The entire ballroom gasped as the killer's face was projected across the mansion screens. Standing ovation from police!",
          resourceDelta: { sanity: 35, chaosScore: -15 },
        },
        D: {
          title: "EXONERATED HEROES",
          narrative: "The captain matched the fingerprint evidence in 5 minutes. You were offered VIP police escort back to safety!",
          resourceDelta: { sanity: 30, chaosScore: -10 },
        },
      },
    },
  ],
};

import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const ABSURD_SCENARIO: ScenarioDefinition = {
  id: "absurd_chaos",
  title: "ABSURD CHAOS: THE BILLIONAIRE'S ESCAPE VAULT",
  category: "absurd",
  tagline: "10 connected rounds: Eccentric wills, laser mazes, strawberry milkshake floods & ₹100 Crores.",
  description: "A continuous 10-round thriller comedy. Locked inside an eccentric billionaire's automated smart-mansion, your squad must survive 10 ridiculous trials to inherit ₹100 Crores.",
  estimatedMinutes: "20 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 10,
  isPremium: false,
  priceTier: "Free",
  vibeTag: "🎭 PURE UNHINGED",
  vibeColor: "pink",
  goodFor: "Late night gaming, deep hypotheticals, creative minds, unhinged laughter.",
  features: [
    "10 connected story rounds",
    "Continuous mansion heist escape plot",
    "Dynamic group sanity & chaos tracking",
    "Secret saboteur missions across rounds",
    "Mind-change reveals & tie-breaker coin tosses",
    "End-game CHAOS Report summary",
  ],
  initialResourceState: {
    balance: 100000,
    sanity: 100,
    chaosScore: 50,
  },
  rounds: [
    // ROUND 1
    {
      roundIndex: 1,
      category: "absurd",
      difficulty: "spicy",
      prompt: "Midnight in a gothic cliffside mansion. The estate lawyer reads the will of eccentric tech billionaire Viktor Vance: 'To this friend group, I leave my entire ₹100 Crore estate. On ONE condition: you must complete the 10 trials of character inside my automated mansion tonight.'",
      question: "Does the group sign the blood-red contract to start the trials?",
      highlightedText: "₹100 Crore Inheritance Will",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Sign immediately with zero hesitation: We want the ₹100 Crores",
          subtitle: "Generational wealth. How hard could an escape mansion be?",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Demand a 15-minute recess to examine all fine print clauses",
          subtitle: "Check for legal traps, organ donation waivers, and hidden fees.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Vote out your most anxious friend right now for their own safety",
          subtitle: "Make the survivor split larger and reduce panic attacks.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Flip the mahogany conference table and search the lawyer's briefcase",
          subtitle: "There's a secret catch. Find the master cheat sheet first.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CONTRACT SEALED IN GOLD",
          narrative: "All signatures inked! The lawyer bowed, walked out, and locked the entrance doors from the outside.",
          resourceDelta: { sanity: 15, chaosScore: 25 },
        },
        B: {
          title: "LEGAL PARANOIA",
          narrative: "You found Clause 42B: 'Estate is not liable for spontaneous duck attacks.' Creepy, but you signed anyway!",
          resourceDelta: { sanity: -10, chaosScore: 15 },
        },
        C: {
          title: "TACTICAL EXCLUSION",
          narrative: "Anxious friend was escorted to the front porch with a juice box. Squad survivor count trimmed by one!",
          resourceDelta: { sanity: -20, chaosScore: 40 },
        },
        D: {
          title: "TABLE-FLIPPING CHAOS",
          narrative: "Mahogany table crashed! The lawyer's wig fell off, revealing a USB drive shaped like a golden skull!",
          isAbsurd: true,
          resourceDelta: { sanity: 20, chaosScore: 65 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU REVEALED A GOLDEN SKULL USB DRIVE!",
        },
      },
    },

    // ROUND 2
    {
      roundIndex: 2,
      category: "absurd",
      difficulty: "spicy",
      prompt: "CLANG! Heavy 12-inch titanium blast doors slam over all windows and exits! The chandelier dims red as a holographic AI butler named 'ALFRED-9000' flickers to life: 'Trial 1: The Trust Bridge. To cross the grand foyer, one friend must walk blindfolded guided only by animal noises.'",
      question: "Which animal sound system will guide your blindfolded volunteer?",
      highlightedText: "Blindfolded Animal Bridge",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You noticed the floor pressure pads trigger on sounds above 500 Hz. Deep frog croaks won't trigger traps!",
        secretGoal: "Persuade the group to pick Option B (Frog ribbits) or Option C (Duck quacks)!",
      },
      options: [
        {
          id: "A",
          label: "Majestic wolf howls (High pitch, loud direction)",
          subtitle: "AUUUUUU! Directional audio echoing through the marble halls.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Low-frequency deep bullfrog ribbits",
          subtitle: "Croak left, croak right. Bass-heavy, steady rhythm.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Aggressive farm duck quacks",
          subtitle: "Rapid-fire tactical quacking like angry mallards.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Ignore the AI rules and carry them across on a shared human stretcher",
          subtitle: "No blindfold obedience. Squad teamwork brute force.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "WOLF PACK NAVIGATION",
          narrative: "The blindfolded friend followed the howling like a champion! But a stray howl triggered a marble fountain spray!",
          resourceDelta: { sanity: 10, chaosScore: 30 },
        },
        B: {
          title: "TACTICAL BULLFROG MASTERY",
          narrative: "The deep ribbits guided them perfectly across the pressure tiles without a single trap firing! 100% stealth!",
          resourceDelta: { sanity: 25, chaosScore: 10 },
        },
        C: {
          title: "ANGRY DUCK CARNAGE",
          narrative: "QUACK! QUACK! Blindfolded friend stepped on a trap tile and got hit in the face with a warm lemon meringue pie!",
          isAbsurd: true,
          resourceDelta: { sanity: -15, chaosScore: 50 },
        },
        D: {
          title: "HUMAN TANK FORMATION",
          narrative: "ALFRED-9000 glitched: 'Rule breach detected... but impressive audacity.' The foyer doors unlocked!",
          resourceDelta: { sanity: 20, chaosScore: 40 },
        },
      },
    },

    // ROUND 3
    {
      roundIndex: 3,
      category: "absurd",
      difficulty: "spicy",
      prompt: "Trial 2: The Hall of Infinite Mirrors. The corridor walls are polished mirrors reflecting infinite copies of your squad. Moving red laser tripwires sweep across at alternating heights. A 60-second digital countdown begins!",
      question: "How does the squad breach the laser mirror hallway?",
      highlightedText: "Moving Laser Grid",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "The Limbo & Crab-Walk: Slide under the low beams together",
          subtitle: "Gymnastics flexibility and synchronized army crawling.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Use pocket makeup mirrors and phone screens to deflect the lasers",
          subtitle: "Optics physics! Bounce the beams back into the sensors.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Spray aerosol deodorant / perfume to make every beam visible",
          subtitle: "Movie heist trick. Reveal the entire grid in neon smoke.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Throw a velvet runner rug over the beams and roll over it",
          subtitle: "Direct physical smothering. No acrobatics required.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CRAB-WALK COMMANDOS",
          narrative: "Limbo skills unlocked! One by one you slid under the beams like buttered eels. Foyer cleared!",
          resourceDelta: { sanity: 20, chaosScore: 20 },
        },
        B: {
          title: "LASER PINBALL OVERLOAD",
          narrative: "Compact mirrors deflected the red beam into the main sensor, blinding the security camera and disabling the entire grid!",
          resourceDelta: { sanity: 30, chaosScore: 15 },
        },
        C: {
          title: "AXE DEODORANT APOCALYPSE",
          narrative: "You emptied three cans of body spray. Beams lit up glowing red, but the hallway now smells like a high-school locker room!",
          resourceDelta: { sanity: -10, chaosScore: 45 },
        },
        D: {
          title: "THE CARPET ROLLER",
          narrative: "Wrapped up like burritos inside the rug and rolled through! Bumping into each other laughing uncontrollably!",
          isAbsurd: true,
          resourceDelta: { sanity: 25, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "BURRITO RUG TACTIC WORKED! YOU ROLLED THROUGH THE LASERS!",
        },
      },
    },

    // ROUND 4
    {
      roundIndex: 4,
      category: "absurd",
      difficulty: "spicy",
      prompt: "Trial 3: The Banquet of 4 Chalices. You enter a medieval dining hall. On the table are 4 glowing chalices: Gold, Obsidian, Crystal, and Neon Green. ALFRED-9000 speaks: 'One holds refreshing vintage cider; the others hold truth serums of varying potency.'",
      question: "Which chalice does the squad nominate someone to drink from?",
      highlightedText: "Banquet of 4 Chalices",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You smell a hint of Granny Smith green apple coming from the Obsidian Chalice.",
        secretGoal: "Convince the group to drink from the Obsidian (B) or Crystal (C) Chalice!",
      },
      options: [
        {
          id: "A",
          label: "The Royal Gold Chalice (Heaviest, ornate engravings)",
          subtitle: "Classic royal bait. Is it glory or a trap?",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "The Obsidian Black Chalice (Smells subtly of apples)",
          subtitle: "Dark, sleek, mysterious, and cold to the touch.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "The Shimmering Crystal Chalice (Effervescent bubbles)",
          subtitle: "Clear sparkling liquid with rainbow reflections.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "The Radioactive Neon Green Chalice (Literally glowing in the dark)",
          subtitle: "Looks like superhero toxic waste. YOLO.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "GOLDEN TRUTH CONFESSION",
          narrative: "Drank from Gold! It tasted like grape juice, but your friend instantly blurted out: 'I accidentally dropped your AirPods in the toilet last year!'",
          resourceDelta: { sanity: -15, chaosScore: 40 },
        },
        B: {
          title: "THE CRISP CIDER OF DESTINY",
          narrative: "Pure sparkling apple cider! Chilled to perfection! The dining table slid open revealing the staircase down!",
          resourceDelta: { sanity: 30, chaosScore: 10 },
        },
        C: {
          title: "CRYSTAL SPARKLE HICCUPS",
          narrative: "Tasted delicious, but gave your friend uncontrollable high-pitched squeaky hiccups that sound like rubber chew toys!",
          resourceDelta: { sanity: 15, chaosScore: 35 },
        },
        D: {
          title: "THE NEON ENERGY RUSH",
          narrative: "It was mountain dew mixed with popping candy! Friend's eyes dilated and they sprinted laps around the dining table at Mach 2!",
          isAbsurd: true,
          resourceDelta: { sanity: 20, chaosScore: 70 },
          triggerChaosMoment: true,
          chaosMomentMessage: "NEON CHALICE DRUNK! FRIEND HAS HYPER-SPEED!",
        },
      },
    },

    // ROUND 5
    {
      roundIndex: 5,
      category: "absurd",
      difficulty: "spicy",
      prompt: "Trial 4: The Interrogation of Integrity. In the subterranean library, ALFRED-9000 projects a lie-detector beam: 'To advance, you must collectively declare which player in this room is the biggest freeloader who never pays their share of the restaurant bill.'",
      question: "How does the squad answer the AI lie-detector tribunal?",
      highlightedText: "Freeloader Tribunal",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Name the undisputed freeloader honestly and without mercy",
          subtitle: "We all know who it is. Truth sets us free for ₹100 Crores.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Nominate the AI butler ALFRED-9000 as the real freeloader",
          subtitle: "'You don't pay rent here, bro!' Logic loophole attack.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Declare collective guilt: 'We are ALL freeloaders in our own ways'",
          subtitle: "Philosophical socialist brotherhood shield.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Have the accused friend voluntarily confess with theatrical tears",
          subtitle: "'IT'S ME! I LOVE FREE NACHOS!' and bow dramatically.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "BRUTAL HONESTY ACCEPTED",
          narrative: "The lie detector flashed GREEN! The library bookshelves swung inward. The guilty friend is currently glaring daggers.",
          resourceDelta: { sanity: -10, chaosScore: 30 },
        },
        B: {
          title: "AI LOGIC OVERHEAT",
          narrative: "ALFRED-9000's processors sparked: 'DOES NOT COMPUTE... I DO NOT EAT NACHOS...' The doors unlocked in a system reboot!",
          isAbsurd: true,
          resourceDelta: { sanity: 30, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU BROKE THE AI WITH LOGIC! FREE ENTRY!",
        },
        C: {
          title: "PHILOSOPHICAL IMPASSE",
          narrative: "The AI paused, evaluated squad solidarity, and granted 10 bonus points for unshakeable squad camaraderie.",
          resourceDelta: { sanity: 25, chaosScore: 10 },
        },
        D: {
          title: "THE NACHO MONOLOGUE",
          narrative: "The theatrical confession moved the AI hologram to shed a single digital tear. A secret passage unlocked!",
          resourceDelta: { sanity: 30, chaosScore: 25 },
        },
      },
    },

    // ROUND 6
    {
      roundIndex: 6,
      category: "absurd",
      difficulty: "spicy",
      prompt: "Trial 5: The Milkshake Deluge! Entering the lowest vault level, heavy steel floodgates drop. Pipes in the ceiling burst open, pouring hundreds of liters of warm, frothy strawberry milkshake! Floating on the rising pink milk are 50 giant inflatable yellow rubber ducks.",
      question: "How does the squad survive the rising strawberry milkshake flood?",
      highlightedText: "Strawberry Milkshake Flood",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You see the primary drainage valve is shaped like a giant cherry on the back wall.",
        secretGoal: "Guide the squad towards Option A (Duck flotilla) or Option C (Cherry valve)!",
      },
      options: [
        {
          id: "A",
          label: "Lash 4 giant rubber ducks together to build an unsinkable squad raft",
          subtitle: "Paddle with our shoes towards the high ceiling ventilation hatch.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Start drinking with all your might: It's delicious gourmet strawberry!",
          subtitle: "Demolish the flood with pure human appetite.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Swim underwater through the pink foam to twist the cherry valve",
          subtitle: "Strawberry scuba dive to pull the emergency drain plug.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Have an epic rubber duck dogfight while floating to the top",
          subtitle: "Embrace the chaos. Best pool party of your life.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE YELLOW DUCK ARMADA",
          narrative: "The duck raft floated like a dream on the pink froth! You pushed open the ceiling hatch and climbed safely to higher ground!",
          resourceDelta: { sanity: 25, chaosScore: 30 },
        },
        B: {
          title: "DAIRY OVERDOSE",
          narrative: "You drank about 2 liters each. Delicious for 90 seconds, followed by massive sugar rushes and immediate stomach regrets!",
          resourceDelta: { sanity: -20, chaosScore: 40 },
        },
        C: {
          title: "CHERRY VALVE SCUBA HERO",
          narrative: "Dived into the pink depths! Twisted the cherry handle... GURGLE! 5,000 liters drained in 30 seconds! Covered in sticky sweet glory!",
          resourceDelta: { sanity: 30, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "DRAINED THE MILKSHAKE! STICKY SWEET VICTORY!",
        },
        D: {
          title: "MILKSHAKE GLADIATORS",
          narrative: "Riding inflatable ducks and splashing pink foam! ALFRED-9000 chimed: 'Sensory amusement protocol: Maximum score.'",
          isAbsurd: true,
          resourceDelta: { sanity: 35, chaosScore: 70 },
        },
      },
    },

    // ROUND 7
    {
      roundIndex: 7,
      category: "absurd",
      difficulty: "spicy",
      prompt: "Trial 6: The Gadget Armory. You step into Viktor Vance's prototype laboratory. Four bizarre gadget racks light up. To get past the automated robotic security guard dog in the next corridor, each player can pick ONE gadget.",
      question: "Which wacky prototype gadget does the squad deploy?",
      highlightedText: "Secret Gadget Armory",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "The Megaphone of Extreme Compliments (Soothes all AI with aggressive flattery)",
          subtitle: "'WHO'S A GOOD ROBOT DOG?! YOU HAVE AMAZING SENSORS!'",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "The Quantum Slinky & Banana Launcher",
          subtitle: "Fires fresh potassium projectiles at 60 km/h.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "The Anti-Gravity Umbrellas (Allows 50-foot glides and soft landings)",
          subtitle: "Float over the robotic dog like Mary Poppins.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "The Disco-Ball Hologram Grenade (Forces all nearby entities to dance)",
          subtitle: "Instant dance battle protocol for all automated security.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "ROBO-DOG FLATTERY OVERFLOW",
          narrative: "The robotic dog's metal tail began wagging at 300 RPM! It rolled over on its metal back demanding tummy scratches!",
          resourceDelta: { sanity: 30, chaosScore: 20 },
        },
        B: {
          title: "BANANA SLIP-N-SLIDE",
          narrative: "Fired 6 bananas across the corridor. The robot dog skidded on the peels and slid harmlessly into a broom closet!",
          resourceDelta: { sanity: 20, chaosScore: 35 },
        },
        C: {
          title: "GLIDING MARY POPPINS SQUAD",
          narrative: "Opened umbrellas and floated 15 feet in mid-air right over the dog's head, landing gracefully at the elevator doors!",
          resourceDelta: { sanity: 35, chaosScore: 30 },
        },
        D: {
          title: "CYBERPUNK ROBOT DISCO",
          narrative: "Disco ball popped! Laser strobes fired! The robot dog started doing the robot dance! Entire squad joined in!",
          isAbsurd: true,
          resourceDelta: { sanity: 40, chaosScore: 75 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE ROBOT DOG IS BREAKDANCING! CORRIDOR CLEARED!",
        },
      },
    },

    // ROUND 8
    {
      roundIndex: 8,
      category: "absurd",
      difficulty: "spicy",
      prompt: "Trial 7: THE SABOTEUR REVEAL! As you step into the express elevator, red emergency lights pulse! ALFRED-9000 announces: 'A traitor walks among you! One player was given a secret override master key in their sneaker to steal the entire ₹100 Crores alone!'",
      question: "How does the squad find and handle the sneaker saboteur?",
      highlightedText: "Sneaker Saboteur Alert",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You know the override key is actually a harmless USB drive containing Viktor Vance's Spotify party playlist.",
        secretGoal: "Persuade the squad to choose Option C (Check everyone's shoes) or Option D (Split the betrayal)!",
      },
      options: [
        {
          id: "A",
          label: "Full pat-down inspection: Everyone takes off their shoes right now",
          subtitle: "No exceptions. Smell the socks of truth.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Offer the saboteur an unconditional 50/50 immunity pact",
          subtitle: "'Whoever you are, come forward. We'll split the spoils.'",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Toss all shoes down the elevator shaft to eliminate the key entirely",
          subtitle: "Barefoot squad unity. The key dies with the shaft.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Turn off the elevator lights for 30 seconds and let the key be dropped anonymously",
          subtitle: "Zero blame, zero trial. Drop it on the floor in the dark.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE SHOE SHAKEDOWN",
          narrative: "Found it! Hidden under the insole of the quietest friend's sneaker! They blushed furiously: 'I didn't ask for this!'",
          resourceDelta: { sanity: -15, chaosScore: 40 },
        },
        B: {
          title: "THE CORRUPT ALLIANCE",
          narrative: "The saboteur winked and confessed. You shook hands in secret. Greed unites what chaos divided!",
          resourceDelta: { sanity: 10, chaosScore: 50 },
        },
        C: {
          title: "THE BAREFOOT SQUAD",
          narrative: "12 shoes tossed down the shaft! Clattering for 8 seconds. You are now 100% barefoot, but 100% unified!",
          isAbsurd: true,
          resourceDelta: { sanity: 20, chaosScore: 60 },
        },
        D: {
          title: "ANONYMOUS FLOOR DROP",
          narrative: "Lights flickered off... CLINK! The metal key landed on the carpet. Lights came back on. Squad trust restored!",
          resourceDelta: { sanity: 25, chaosScore: 20 },
        },
      },
    },

    // ROUND 9
    {
      roundIndex: 9,
      category: "absurd",
      difficulty: "spicy",
      prompt: "Trial 8: The Rooftop Helipad Obstacle Course. The elevator opens onto the mansion's wind-swept rooftop. The helipad is 100 meters away across an automated moving obstacle course of giant foam swinging hammers, rotating turntables, and slippery butter slides!",
      question: "What is the squad's synchronized assault across the Wipeout roof?",
      highlightedText: "Rooftop Obstacle Course",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Full sprint blitz: Run in a single-file cheetah pack without stopping",
          subtitle: "Momentum and speed. If someone falls, keep moving forward.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Crawl on bellies under the swinging hammers like stealth seals",
          subtitle: "Low profile, minimum surface area, maximum patience.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Ride the anti-gravity umbrellas from Trial 6 across the gap",
          subtitle: "Deploy the gadgets! Float straight onto the helipad.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Send your clumsy friend first to trigger all foam hammers early",
          subtitle: "The human crash-test dummy protocol.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CHEETAH PACK BLITZ",
          narrative: "THUMP! One friend got launched 10 feet into the foam pit, but the rest reached the helipad landing circle panting and cheering!",
          resourceDelta: { sanity: 15, chaosScore: 55 },
        },
        B: {
          title: "BELLY CRAWL SURVIVORS",
          narrative: "Slid like seals across the wet astro-turf. It looked utterly ridiculous, but zero people got hit! 100% success rate!",
          resourceDelta: { sanity: 25, chaosScore: 20 },
        },
        C: {
          title: "AERIAL HELIPAD TOUCHDOWN",
          narrative: "Umbrellas opened! You caught the rooftop sea breeze and floated down right onto the center of the giant H!",
          resourceDelta: { sanity: 40, chaosScore: 30 },
          triggerChaosMoment: true,
          chaosMomentMessage: "AERIAL GLIDE TO THE HELIPAD! MAJESTIC FINISH!",
        },
        D: {
          title: "HEROIC SACRIFICE",
          narrative: "The dummy friend absorbed 3 foam hammer strikes with a grin! Path cleared for everyone else!",
          isAbsurd: true,
          resourceDelta: { sanity: -10, chaosScore: 70 },
        },
      },
    },

    // ROUND 10
    {
      roundIndex: 10,
      category: "absurd",
      difficulty: "spicy",
      prompt: "GRAND FINALE: THE VAULT OF CRORES. The helipad center splits open, rising with the final titanium chamber. Inside sits a digital terminal showing: ₹100,00,00,000.00. Viktor Vance's hologram appears in a silk tuxedo: 'You survived all 10 trials. Claim your destiny.'",
      question: "How does the squad execute the ₹100 Crore claim?",
      highlightedText: "₹100 Crore Final Claim",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You see a hidden button under the terminal that buys the entire automated mansion itself with all its ridiculous gadgets.",
        secretGoal: "Persuade the squad to pick Option C (Keep the mansion) or Option A (Equal split)!",
      },
      options: [
        {
          id: "A",
          label: "Direct equal bank wire split: Liquid wealth into everyone's accounts",
          subtitle: "Instant multi-millionaires. Retire tomorrow morning.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Found the 'Chaos Foundation': Build the world's wildest theme park",
          subtitle: "A real-life amusement park designed by this friend group.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Keep the mansion forever as the permanent squad fortress",
          subtitle: "Live together in the tech fortress with ALFRED-9000 as our butler.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Put it all on 00 at the Monte Carlo casino roulette next weekend",
          subtitle: "₹3,500 Crores or nothing. The ultimate unhinged flex.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "GENERATIONAL WEALTH UNLOCKED",
          narrative: "DINGS! Bank accounts credited with ₹10+ Crores each! The squad embraced on the rooftop under the sunrise. You won the game of life!",
          resourceDelta: { sanity: 50, chaosScore: 20 },
          triggerChaosMoment: true,
          chaosMomentMessage: "₹100 CRORES TRANSFERRED! YOU SURVIVED THE VAULT!",
        },
        B: {
          title: "CHAOS WORLD OPENS 2027",
          narrative: "Theme park blueprints signed! Featuring the Strawberry Milkshake Flume Ride and Laser Limbo Hall. Legendary legacy created!",
          resourceDelta: { sanity: 45, chaosScore: 60 },
        },
        C: {
          title: "THE MANSION LORDS",
          narrative: "You took the keys to the cliffside fortress! ALFRED-9000 brought out morning croissants. You rule the castle forever!",
          resourceDelta: { sanity: 40, chaosScore: 40 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU INHERITED THE BILLIONAIRE FORTRESS!",
        },
        D: {
          title: "MONTE CARLO BOUND",
          narrative: "A private jet touched down on the helipad to fly you to Monaco. Madness, glory, and unhinged destiny!",
          isAbsurd: true,
          resourceDelta: { sanity: 50, chaosScore: 100 },
          triggerChaosMoment: true,
          chaosMomentMessage: "FLYING TO MONTE CARLO! ABSURD CHAOS COMPLETED!",
        },
      },
    },
  ],
};

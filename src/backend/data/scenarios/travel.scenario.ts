import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const TRAVEL_SCENARIO: ScenarioDefinition = {
  id: "travel_chaos",
  title: "TRAVEL CHAOS: THE ESCALATING MISADVENTURE",
  category: "travel",
  tagline: "10 connected rounds: Cancelled flights, sinking jeeps, monkey passport thieves & island raves.",
  description: "A continuous 10-round holiday catastrophe. What was supposed to be a relaxing tropical getaway spirals into an escalating survival comedy across 10 connected trials.",
  estimatedMinutes: "20 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 10,
  isPremium: false,
  priceTier: "Free",
  vibeTag: "🧳 SURVIVAL MODE",
  vibeColor: "cyan",
  goodFor: "Travelers, road-trippers, group holiday squads, vacation reunions.",
  features: [
    "10 connected story rounds",
    "Continuous island misadventure narrative",
    "Dynamic group sanity & emergency budget tracking",
    "Secret saboteur missions across rounds",
    "Mind-change reveals & tie-breaker coin tosses",
    "End-game CHAOS Report summary",
  ],
  initialResourceState: {
    balance: 1500,
    sanity: 100,
    chaosScore: 15,
  },
  rounds: [
    // ROUND 1
    {
      roundIndex: 1,
      category: "travel",
      difficulty: "normal",
      prompt: "2:00 AM at the overseas transit terminal. The departure screen flashes: 'FLIGHT 404 TO TROPICAL PARADISE CANCELLED'. The airline gives you a choice: Sleep on metal airport chairs with $50 food vouchers, or pool $400 for the last speedboat charter to the island tonight.",
      question: "What does the stranded squad decide?",
      highlightedText: "Flight 404 Cancelled",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Take the $50 vouchers and sleep on airport benches",
          subtitle: "Use luggage as pillows, save money, wait for morning standby.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Pool $400 and board the midnight speedboat charter right now",
          subtitle: "We came for the island, and we're reaching the island tonight.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Stage a peaceful sit-in protest at the airline service desk",
          subtitle: "Demand 5-star hotel vouchers and free business class upgrades.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Raid the 24-hour duty-free lounge and throw a terminal party",
          subtitle: "Turn the transit gate into an impromptu dance floor.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "AIRPORT BENCH SLUMBER",
          narrative: "Stiff cold metal benches. Airport cleaning floor polishers hummed all night, but your budget remains 100% intact.",
          resourceDelta: { balance: 0, sanity: -20, chaosScore: 5 },
        },
        B: {
          title: "MIDNIGHT SPEEDBOAT RUN",
          narrative: "Salt spray in your faces as the boat skimmed black waves under a starry sky! Landed on the island pier at 3:30 AM!",
          resourceDelta: { balance: -400, sanity: 25, chaosScore: 30 },
        },
        C: {
          title: "CUSTOMER SERVICE CRUSADE",
          narrative: "Your friend's passionate negotiation worked! The airline gave you vouchers for an airport transit hotel with warm showers!",
          resourceDelta: { balance: 0, sanity: 30, chaosScore: 10 },
        },
        D: {
          title: "GATE 14 RAVE",
          narrative: "Luggage speakers blasted pop anthems! Stranded passengers joined in! Airport security came over... and started dancing!",
          isAbsurd: true,
          resourceDelta: { balance: -100, sanity: 25, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU THREW A PARTY AT AIRPORT GATE 14!",
        },
      },
    },

    // ROUND 2
    {
      roundIndex: 2,
      category: "travel",
      difficulty: "spicy",
      prompt: "You made it to the island! You rent a battered open-top 4x4 Jeep to reach the coast. Driving along the beach at 5:00 AM, the driver tries an aesthetic drift... and the Jeep sinks axle-deep into rising tidal quicksand mud!",
      question: "The tide is coming in fast! How do you save the sinking rental Jeep?",
      highlightedText: "Jeep in Tidal Mud",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You know that deflating the tires to 12 PSI will double surface traction on wet sand.",
        secretGoal: "Persuade the squad to choose Option B (Deflate tires) or Option C (Palm fronds)!",
      },
      options: [
        {
          id: "A",
          label: "Everyone gets into the mud and pushes on the count of three",
          subtitle: "Human horsepower! Cover ourselves in tropical mud.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Deflate the tires and wedge floor mats under the wheels",
          subtitle: "Sand recovery engineering. Maximize traction.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Gather driftwood and palm fronds to build a makeshift ramp",
          subtitle: "Island bushcraft. Nature will lift us out.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Flag down a passing local fishing tractor for a $100 tow",
          subtitle: "Pay the tourist tax, keep our clothes clean.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE MUD MONSTER SQUAD",
          narrative: "Wheels spun, spraying black mud from head to toe! With one final heave, the Jeep popped onto dry gravel! Muddy victory!",
          resourceDelta: { balance: 0, sanity: 15, chaosScore: 40 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE SQUAD IS COVERED IN MUD! JEEP IS SAVED!",
        },
        B: {
          title: "OFF-ROAD MASTERS",
          narrative: "Tire deflated, floor mats placed. The 4x4 rolled out smoothly without breaking a sweat! Zero drama.",
          resourceDelta: { balance: 0, sanity: 25, chaosScore: 10 },
        },
        C: {
          title: "PALM TREE ENGINEERING",
          narrative: "The driftwood ramp held! The Jeep crested the sandbank just as the first ocean wave touched the exhaust pipe!",
          resourceDelta: { balance: 0, sanity: 20, chaosScore: 20 },
        },
        D: {
          title: "FISHING TRACTOR PULL",
          narrative: "The tractor driver laughed, took the cash, and yanked the Jeep free in 30 seconds. Easy, but $100 lighter.",
          resourceDelta: { balance: -100, sanity: 10, chaosScore: 15 },
        },
      },
    },

    // ROUND 3
    {
      roundIndex: 3,
      category: "travel",
      difficulty: "spicy",
      prompt: "You arrive at your prepaid 'Luxury 5-Star Oceanfront Villa'. The reality: It is an abandoned open-air wooden barn with no front door, 4 hammocks, and 12 live chickens roaming the living room.",
      question: "What is the group's protocol for the chicken villa?",
      highlightedText: "Chicken Villa Reality",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Embrace rustic island minimalism: Adopt the chickens and sleep in hammocks",
          subtitle: "Free fresh eggs in the morning! True bohemian backpacker life.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Call the booking app hotline and scream until they relocate you",
          subtitle: "Demand the CEO's personal number and a 5-star resort suite.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Pool another $300 to move to the hotel resort down the beach",
          subtitle: "Blow the budget. We deserve air conditioning and real beds.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Set up a pop-up tiki bar on the porch and invite neighboring tourists",
          subtitle: "Monetize the disaster: 'The Famous Chicken Lounge'.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CHICKEN VILLA RESIDENTS",
          narrative: "You named the lead rooster 'Captain Cluck'. Sleeping in ocean breeze hammocks was surprisingly magical.",
          resourceDelta: { balance: 0, sanity: 20, chaosScore: 35 },
        },
        B: {
          title: "BOOKING APP WARFARE",
          narrative: "After 40 minutes on hold, the app apologized with a 100% refund PLUS $200 resort compensation vouchers!",
          resourceDelta: { balance: 200, sanity: 30, chaosScore: 15 },
        },
        C: {
          title: "5-STAR RESCUE PURCHASED",
          narrative: "Checked into the ocean resort! Crisp white sheets, infinity pool, and no roosters in sight. Budget is bleeding though.",
          resourceDelta: { balance: -300, sanity: 40, chaosScore: 10 },
        },
        D: {
          title: "THE CHICKEN LOUNGE SENSATION",
          narrative: "You chopped coconuts and played music. 25 backpackers showed up! You made $250 in drink donations!",
          isAbsurd: true,
          resourceDelta: { balance: 250, sanity: 35, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOUR CHICKEN BAR MADE $250 PROFIT!",
        },
      },
    },

    // ROUND 4
    {
      roundIndex: 4,
      category: "travel",
      difficulty: "spicy",
      prompt: "DISASTER ON THE VERANDA! While making morning coffee, a gang of 8 cheeky macaques (wild island monkeys) descends from the palm trees! One alpha monkey grabs your group's zipped waterproof pouch containing ALL PASSPORTS AND SUNGLASSES and sprints up a 40-foot banyan tree!",
      question: "How does the squad retrieve the hostage passports from the monkey boss?",
      highlightedText: "Monkey Passport Bandit",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "Macaques cannot resist ripe yellow mangoes and shiny shiny foil snack bags.",
        secretGoal: "Get the group to pick Option B (Snack trade) or Option C (Tree climb)!",
      },
      options: [
        {
          id: "A",
          label: "Challenge the alpha monkey with loud chest-thumping and staring",
          subtitle: "Establish dominant apex predator status in the jungle.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Lure the monkey down with fresh sweet mangoes and potato chips",
          subtitle: "The peaceful barter trade. Fruit for national identity.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Send your most agile climber up the banyan tree vines",
          subtitle: "Tarzan stealth mission into the jungle canopy.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Use water guns and coconut shell slingshots to annoy him down",
          subtitle: "Ranged aerial assault on the monkey stronghold.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "MONKEY SHOWDOWN MISFIRE",
          narrative: "You thumped your chest... The monkey sneered and threw a half-eaten papaya directly into your face!",
          resourceDelta: { sanity: -25, chaosScore: 50 },
        },
        B: {
          title: "THE MANGO TRUCE",
          narrative: "The alpha dropped the pouch, snatched two mangoes, and gave an approving screech! All passports recovered intact!",
          resourceDelta: { balance: -200, sanity: 30, chaosScore: 10 },
        },
        C: {
          title: "TARZAN ASCENT",
          narrative: "Your friend climbed like a monkey! Reached the branch, grabbed the strap, and slid down the trunk to heroic applause!",
          resourceDelta: { sanity: 25, chaosScore: 30 },
          triggerChaosMoment: true,
          chaosMomentMessage: "CANOPY EXTRACTION COMPLETED! PASSPORTS ARE SAFE!",
        },
        D: {
          title: "COCONUT ARTILLERY",
          narrative: "Water gun stream hit the branch! The monkey dropped the pouch into the swimming pool! You fished it out slightly damp.",
          resourceDelta: { sanity: 10, chaosScore: 35 },
        },
      },
    },

    // ROUND 5
    {
      roundIndex: 5,
      category: "travel",
      difficulty: "spicy",
      prompt: "After drying the passports, you discover the local ferry to the mainland has been cancelled due to heavy chop. The ONLY way to cross to the full-moon party island tonight is a wooden smuggler longboat run by an eyepatch-wearing fisherman named 'Uncle Tony' who charges $150.",
      question: "Does the squad board Uncle Tony's suspicious longboat?",
      highlightedText: "Uncle Tony's Longboat",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Pay Uncle Tony $150, put on orange life jackets, and embrace fate",
          subtitle: "True pirate voyage across turbulent tropical waters.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Negotiate down to $100 by offering to help shovel bilge water",
          subtitle: "Working crew discount. Put your back into it.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Stay safe on this island and throw a bonfire beach acoustic night",
          subtitle: "Zero drowning risk. Roasted marshmallows and guitar singalongs.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Rent 3 two-person ocean kayaks and paddle the 6 km across",
          subtitle: "Olympic rowing squad. Maximum arm workout.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "PIRATES OF THE BAY",
          narrative: "Uncle Tony fired up the roaring two-stroke engine! The longboat skipped over 8-foot waves like a flying fish! Thrilling arrival!",
          resourceDelta: { balance: -150, sanity: 20, chaosScore: 40 },
        },
        B: {
          title: "DECKHAND APPRENTICES",
          narrative: "Uncle Tony gave you tin buckets to scoop seawater. Hard work, but you saved $50 and earned Uncle Tony's eternal respect.",
          resourceDelta: { balance: -100, sanity: 15, chaosScore: 25 },
        },
        C: {
          title: "BONFIRE PEACE",
          narrative: "Warm orange glow of the fire, gentle waves, singing along to acoustic songs under shooting stars. Peak wholesome relaxation.",
          resourceDelta: { balance: -20, sanity: 40, chaosScore: -15 },
        },
        D: {
          title: "KAYAK ARM REGRETS",
          narrative: "15 minutes in, everyone's forearms were burning! A curious dolphin bumped your kayak! You made it across looking like bodybuilders.",
          isAbsurd: true,
          resourceDelta: { balance: -3000, sanity: 10, chaosScore: 50 },
        },
      },
    },

    // ROUND 6
    {
      roundIndex: 6,
      category: "travel",
      difficulty: "spicy",
      prompt: "10:30 PM at the Secret Jungle Beach Rave! Neon body paint, fire dancers, and heavy bass shaking the palm trees. In the crowd, your loudest friend spots their toxic ex-partner standing near the DJ booth with a group of influencers!",
      question: "What is the emergency tactical protocol regarding the ex?",
      highlightedText: "Toxic Ex at Jungle Rave",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Squad shield formation: Surround your friend and dance away to the beach",
          subtitle: "360-degree human perimeter. No eye contact allowed.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Flock over looking devastatingly attractive and wealthy",
          subtitle: "The ultimate flex. Show them life has never been better.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Cover your friend in glowing neon war paint so they're unrecognizable",
          subtitle: "Neon camouflage. Blend in like Avatar warriors.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Challenge the ex's group to a synchronized dance battle near the fire dancers",
          subtitle: "Settle all past trauma with epic footwork.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "TACTICAL PERIMETER SUCCESS",
          narrative: "The squad formed a moving dance phalanx. The ex never saw them, and your friend danced peacefully until 2 AM!",
          resourceDelta: { sanity: 25, chaosScore: 10 },
        },
        B: {
          title: "THE ULTIMATE FLEX",
          narrative: "Walked past glowing with confidence! The ex stared with dropped jaw while your friend dropped an effortless wink.",
          resourceDelta: { sanity: 35, chaosScore: 30 },
        },
        C: {
          title: "AVATAR WARRIOR",
          narrative: "Covered in green and purple glow paint! Looked like a jungle spirit! Completely invisible to past mistakes.",
          resourceDelta: { sanity: 20, chaosScore: 25 },
        },
        D: {
          title: "FIRE DANCE SHOWDOWN",
          narrative: "Surrounded by flaming batons, the dance battle began! Your squad dropped hip-hop grooves that made the entire crowd chant your name!",
          isAbsurd: true,
          resourceDelta: { sanity: 40, chaosScore: 70 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU WON THE JUNGLE RAVE DANCE BATTLE!",
        },
      },
    },

    // ROUND 7
    {
      roundIndex: 7,
      category: "travel",
      difficulty: "spicy",
      prompt: "1:45 AM. At the night market taco stall, the group tries to pay for 30 seafood tacos. DECLINED! The primary group credit card was just frozen by the bank fraud prevention system for 'unusual midnight transactions in a tropical zone'!",
      question: "The taco chef is holding a cleaver. How do you pay for the 30 tacos?",
      highlightedText: "Card Frozen Overseas",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You have a hidden $50 emergency bill tucked inside your shoe insole.",
        secretGoal: "Persuade the squad to choose Option A (Scrape cash) or Option D (Wash dishes)!",
      },
      options: [
        {
          id: "A",
          label: "Scrape everyone's pockets for mixed coins, foreign bills, and loose cash",
          subtitle: "Euros, Dollars, loose change, and chewing gum. Total barter.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Call the bank emergency fraud hotline on speakerphone in the rain",
          subtitle: "Endure 20 minutes of automated hold music to unfreeze the card.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Offer the taco chef a private acoustic concert by your musician friend",
          subtitle: "Serenade the kitchen with heartfelt ballads for food.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Squad dishwasher shift: Wash taco pans for 45 minutes in the back",
          subtitle: "Honest labor pays the debt. Builds character.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "INTERNATIONAL CURRENCY PILE",
          narrative: "You produced 10 Euros, $25, and shiny coins. The chef nodded: 'Fair trade.'",
          resourceDelta: { balance: -50, sanity: 15, chaosScore: 20 },
        },
        B: {
          title: "HOLD MUSIC HYPNOSIS",
          narrative: "Standing under an umbrella listening to flute jazz on hold. The card unfroze! Tacos paid, but patience was tested.",
          resourceDelta: { balance: -60, sanity: -15, chaosScore: 10 },
        },
        C: {
          title: "TACO SERENADE",
          narrative: "Your friend sang a soulful Bollywood love song to the grill! The chef cried tears of joy and gave you extra guac for free!",
          isAbsurd: true,
          resourceDelta: { balance: 0, sanity: 35, chaosScore: 40 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE TACO CHEF CRIED! FREE TACOS FOR EVERYONE!",
        },
        D: {
          title: "THE PAN SCRUBBERS",
          narrative: "Scrubbed cast iron pans until they shone like mirrors! Chef gave everyone a high five and cold drinks for the road.",
          resourceDelta: { balance: 0, sanity: 20, chaosScore: 25 },
        },
      },
    },

    // ROUND 8
    {
      roundIndex: 8,
      category: "travel",
      difficulty: "spicy",
      prompt: "3:30 AM at the lagoon beach. A sudden tropical squall blows in. One friend fell asleep on an 8-foot inflatable pink flamingo and has drifted 200 meters out into the choppy bay, waving their flashlight frantically!",
      question: "How does the squad mount the Great Pink Flamingo Rescue?",
      highlightedText: "Flamingo Drifting at Sea",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Form a swimming relay squad with life jackets and a tow rope",
          subtitle: "Baywatch sprint into the surf. Strongest swimmers lead.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Wake up Uncle Tony and launch his wooden longboat for extraction",
          subtitle: "Diesel power rescue. $60 tip for his trouble.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Yell synchronized rowing instructions through a rolled-up magazine",
          subtitle: "'PADDLE WITH YOUR FLIP-FLOPS TOWARDS THE LIGHT!'",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Paddle out on an inflatable pizza slice mattress to link up",
          subtitle: "Double the inflatables, double the naval power.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "BAYWATCH RESCUE HEROES",
          narrative: "Swam out through the warm rain! Clipped the carabiner to the flamingo neck and towed them back to shore like champions!",
          resourceDelta: { sanity: 30, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "BAYWATCH EXTRACTION SUCCESSFUL! FLAMINGO RESCUED!",
        },
        B: {
          title: "UNCLE TONY COAST GUARD",
          narrative: "Uncle Tony sped through the dark waves, scooped friend and flamingo right into the hull! A true island savior.",
          resourceDelta: { balance: -3000, sanity: 25, chaosScore: 20 },
        },
        C: {
          title: "FLIP-FLOP OARS",
          narrative: "Friend used rubber flip-flops like paddleboat blades! Slowly but surely, the giant flamingo drifted back onto the sand.",
          resourceDelta: { sanity: 15, chaosScore: 35 },
        },
        D: {
          title: "FLAMINGO PIZZA FLOTILLA",
          narrative: "Linked the pizza slice to the flamingo! Now TWO of you were floating in the bay laughing hysterically until the tide turned!",
          isAbsurd: true,
          resourceDelta: { sanity: 20, chaosScore: 65 },
        },
      },
    },

    // ROUND 9
    {
      roundIndex: 9,
      category: "travel",
      difficulty: "spicy",
      prompt: "4:45 AM. Driving back to catch the morning flight, the Jeep's brakes screech, and you accidentally nudge over a wooden fence in a private coconut plantation. An angry grove owner steps out with a flashlight demanding $200 for the fence damages!",
      question: "How do you negotiate the coconut fence settlement?",
      highlightedText: "Coconut Plantation Standoff",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You have a toolkit in the trunk with screws and a hammer to fix the fence in 15 minutes.",
        secretGoal: "Persuade the squad to pick Option C (Repair it ourselves) or Option A (Buy coconuts)!",
      },
      options: [
        {
          id: "A",
          label: "Offer to buy 40 fresh coconuts from him right now for $80",
          subtitle: "Turn property damage into a bulk agricultural purchase.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Pay the full $200 settlement to avoid missing the flight",
          subtitle: "Time is money. The airport gate closes in 90 minutes.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Grab the trunk hammer and rebuild the fence neatly on the spot",
          subtitle: "15 minutes of carpenter squad teamwork. Good as new.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Apologize profusely and offer our spare designer sunglasses as collateral",
          subtitle: "Universal currency of the islands.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE COCONUT COMPROMISE",
          narrative: "He smiled, accepted the $80, and chopped down 40 fresh tender coconuts for the car! Refreshing road drinks!",
          resourceDelta: { balance: -80, sanity: 25, chaosScore: 20 },
        },
        B: {
          title: "EXPENSIVE DEPARTURE",
          narrative: "Paid $200 cash. He opened the gate immediately. Painful for the wallet, but path to airport is clear.",
          resourceDelta: { balance: -200, sanity: -10, chaosScore: 10 },
        },
        C: {
          title: "BOB THE BUILDER SQUAD",
          narrative: "Nailed the fence back together straighter than before! The farmer was so impressed he gave everyone a bag of fresh bananas!",
          resourceDelta: { balance: 0, sanity: 35, chaosScore: 15 },
        },
        D: {
          title: "THE SHADES BRIBE",
          narrative: "Farmer tried on the aviators, looked at his reflection in the truck window, and nodded approvingly. Gate opened!",
          resourceDelta: { balance: 0, sanity: 20, chaosScore: 25 },
        },
      },
    },

    // ROUND 10
    {
      roundIndex: 10,
      category: "travel",
      difficulty: "spicy",
      prompt: "GRAND FINALE AT 6:00 AM! You arrive at the airport departures hall just as the sun blazes across the tarmac. Flight 505 to home is boarding at Gate 1. You have mud on your shoes, coconut water in your bags, wild stories in your hearts, and zero regrets.",
      question: "How does the squad seal the final memory of this chaotic trip?",
      highlightedText: "Flight 505 Boarding Call",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You took a slow-motion video of the Great Pink Flamingo Rescue that will break the internet.",
        secretGoal: "Persuade the squad to choose Option A (Squad photo dump) or Option C (Book next year now)!",
      },
      options: [
        {
          id: "A",
          label: "Post the raw, unedited misadventure photo dump: 'Relaxing Beach Trip'",
          subtitle: "Muddy jeeps, monkey thieves, and floating flamingos. Pure comedy.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Buy duty-free luxury perfumes and board in full first-class swagger",
          subtitle: "Walk down the jet bridge smelling like kings after surviving the jungle.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Open the flight app right now and book next year's trip to Ladakh",
          subtitle: "The chaos never ends. Lock in the next expedition before wheels up.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Write the 'Holiday Commandments' on an airplane vomit bag",
          subtitle: "10 sacred rules learned the hard way. Frame it in the group chat.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "VIRAL VACATION CHRONICLES",
          narrative: "Posted the 10 slides! Comments exploded with 500 laughing emojis: 'ARE YOU GUYS ALIVE?!' Legendary status cemented!",
          resourceDelta: { sanity: 45, chaosScore: 70 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE MISADVENTURE PHOTO DUMP IS VIRAL! GLORY ACHIEVED!",
        },
        B: {
          title: "DUTY-FREE REDEMPTION",
          narrative: "Sprayed Tom Ford cologne over muddy linen shirts. Boarded the plane looking like tropical millionaires!",
          resourceDelta: { balance: -6000, sanity: 35, chaosScore: 20 },
        },
        C: {
          title: "LADAKH 2027 BOOKED",
          narrative: "Confirmation emails received while rolling down the runway! The adventure continues. True brotherhood forever!",
          resourceDelta: { balance: -15000, sanity: 50, chaosScore: 40 },
          triggerChaosMoment: true,
          chaosMomentMessage: "LADAKH IS BOOKED! THE ADVENTURE NEVER ENDS!",
        },
        D: {
          title: "THE SACRED VOMIT BAG SCROLL",
          narrative: "Inked all 10 commandments on the paper bag. Rule #1: Never trust a monkey near passports. You conquered the chaos!",
          isAbsurd: true,
          resourceDelta: { sanity: 40, chaosScore: 30 },
        },
      },
    },
  ],
};

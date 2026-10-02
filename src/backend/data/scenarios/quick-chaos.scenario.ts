import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const QUICK_CHAOS_SCENARIO: ScenarioDefinition = {
  id: "quick_chaos",
  title: "QUICK CHAOS: THE ₹5,00,000 RUNAWAY ROAD TRIP",
  category: "friends",
  tagline: "10 connected rounds: A ₹5 Lakh lottery ticket, highway police, and a royal wedding crash.",
  description: "A continuous 10-round runaway road trip saga. From scratching a winning ₹5,00,000 ticket at a gas station to surviving mountain ghats, missing keys, and an opulent destination wedding.",
  estimatedMinutes: "20 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 10,
  isPremium: false,
  vibeTag: "⚡ FAST & LOUD",
  vibeColor: "amber",
  goodFor: "Game nights, house parties, trips or anytime you want high-energy, escalating chaos.",
  features: [
    "10 connected story rounds",
    "Continuous runaway road trip plot",
    "Dynamic group sanity & chaos tracking",
    "Secret saboteur missions across rounds",
    "Mind-change reveals & tie-breaker coin tosses",
    "End-game CHAOS Report summary",
  ],
  initialResourceState: {
    sanity: 100,
    chaosScore: 0,
  },
  rounds: [
    // ROUND 1
    {
      roundIndex: 1,
      category: "friends",
      difficulty: "normal",
      prompt: "While waiting for highway tea, the squad buys a ₹100 scratchcard and hits the ₹5,00,000 JACKPOT! The cashier hands over the golden winning voucher. The squad is screaming in the parking lot.",
      question: "What is the unanimous squad plan for the ₹5 Lakh jackpot?",
      highlightedText: "₹5,00,000 Jackpot",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Book a 7-day all-inclusive oceanfront villa in Goa",
          subtitle: "Private pool, personal chef, pure unadulterated luxury.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Rent a luxury convertible RV and hit the open highway",
          subtitle: "Road trip of a lifetime with sound systems and leather couches.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Split it equally into liquid cash right now",
          subtitle: "Transfer ₹50,000 to everyone immediately. Zero drama.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Invest the entire ₹5 Lakh in a friend's wild tech startup",
          subtitle: "10x returns or zero. We build our own empire.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "VILLA DREAMS LOCKED",
          narrative: "Everyone hugged! You set Google Maps coordinates for the coast and hit the gas!",
          resourceDelta: { sanity: 25, chaosScore: 20 },
        },
        B: {
          title: "THE LUXURY CRUISER",
          narrative: "You upgraded to an executive cruiser with surround sound and mini-fridge. The ultimate squad vehicle!",
          resourceDelta: { sanity: 20, chaosScore: 30 },
        },
        C: {
          title: "ACCOUNT BALANCES GREEN",
          narrative: "Pragmatic, sensible, but the squad energy is so pumped you're taking the road trip anyway!",
          resourceDelta: { sanity: 15, chaosScore: 5 },
        },
        D: {
          title: "UNICORN DREAMS",
          narrative: "You shook hands on an AI-powered taco drone startup. High optimism, questionable viability!",
          isAbsurd: true,
          resourceDelta: { sanity: -10, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU INVESTED ₹5 LAKH IN A TACO DRONE STARTUP!",
        },
      },
    },

    // ROUND 2
    {
      roundIndex: 2,
      category: "friends",
      difficulty: "spicy",
      prompt: "Cruising down the highway at 90 km/h, someone rolls down the window to film an aesthetic vlog. WHOOSH! The ₹5,00,000 lottery voucher slips out and gets plastered across the windshield of a speeding oil tanker behind you!",
      question: "How do you recover the runaway lottery ticket?",
      highlightedText: "Ticket on Oil Tanker",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You know the toll plaza is only 3 km ahead and all heavy vehicles MUST stop for clearance.",
        secretGoal: "Convince the group to pick Option B (Tail to toll plaza) or Option C (Broom & selfie stick)!",
      },
      options: [
        {
          id: "A",
          label: "Emergency handbrake drift to the shoulder and sprint across lanes",
          subtitle: "Olympic hurdle sprint across 4 lanes of highway traffic.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Match speed with hazard lights and tail the tanker to the toll",
          subtitle: "Calm, tactical surveillance until the truck stops.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Lean out the window with a selfie stick and tape to grab it",
          subtitle: "Mission Impossible highway mid-air extraction.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Accept the universe's lesson and let it fly away forever",
          subtitle: "'Easy come, easy go. It was never meant to be.'",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "HIGHWAY PARKOUR HEROICS",
          narrative: "Your friend vaulted a divider, waved frantically, and peeled the golden voucher off the grill as the truck honked deafeningly! TICKET RETRIEVED!",
          resourceDelta: { sanity: -30, chaosScore: 70 },
          triggerChaosMoment: true,
          chaosMomentMessage: "HIGHWAY EXTRACTION SUCCESSFUL! TICKET IS SAFE!",
        },
        B: {
          title: "TOLL PLAZA TACTICS",
          narrative: "The tanker slowed at Lane 4. You politely tapped on the cabin, climbed the bumper, and retrieved the pristine ticket! Smooth work.",
          resourceDelta: { sanity: 20, chaosScore: 15 },
        },
        C: {
          title: "SELFIE STICK DISASTER",
          narrative: "The tape caught the ticket... but snapped the selfie stick in half! You scrambled on the asphalt and snatched it by millimeters!",
          resourceDelta: { sanity: -15, chaosScore: 50 },
        },
        D: {
          title: "THE ENLIGHTENED MONKS",
          narrative: "You sat in silence for 4 minutes before someone yelled: 'HELL NO! TURN THE CAR AROUND RIGHT NOW!' and slammed the brakes!",
          isAbsurd: true,
          resourceDelta: { sanity: -25, chaosScore: 40 },
        },
      },
    },

    // ROUND 3
    {
      roundIndex: 3,
      category: "friends",
      difficulty: "spicy",
      prompt: "The erratic lane-swerving caught the eye of Highway Patrol! Two police interceptor SUVs pull you over with sirens blaring. The officer walks to your window: 'Step out and pop the trunk for a full inspection.'",
      question: "The trunk is full of chaotic luggage, unlabeled fireworks, and 30 energy drinks. How do you handle the police?",
      highlightedText: "Highway Patrol Trunk Search",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "The officer's phone ringtone is a popular devotional bhajan. Respectful polite speech will work wonders.",
        secretGoal: "Steer the squad towards Option A (Show winning ticket) or Option C (Offer sweets)!",
      },
      options: [
        {
          id: "A",
          label: "Show the ₹5,00,000 ticket and explain you just won the jackpot",
          subtitle: "Pure honesty: 'Sir, we were celebrating and lost our minds.'",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Pretend a passenger is having severe food poisoning cramps",
          subtitle: "Dramatic groaning and begging for a police escort to hospital.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Offer the officers fresh celebratory pedas and fruit from the box",
          subtitle: "Classic Indian hospitality defuses all tension.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Claim you are undercover YouTube travel safety documentary hosts",
          subtitle: "Point a smartphone camera: 'You are live on Road Watch!'",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "OFFICERS JOIN THE CELEBRATION",
          narrative: "The officer inspected the golden ticket with wide eyes: 'ARRE WAAH!' He took a selfie with the squad and gave you a green light warning!",
          resourceDelta: { sanity: 25, chaosScore: 20 },
        },
        B: {
          title: "ACADEMY AWARD MEDICAL SCARE",
          narrative: "Your friend's groaning was so realistic the officers escorted you 10 km to a rural dispensary! You had to fake an injection to escape!",
          resourceDelta: { sanity: -20, chaosScore: 45 },
        },
        C: {
          title: "SWEET DIPLOMACY",
          narrative: "The sub-inspector ate two pedas, wiped his mustache, and said: 'Drive in your lane, boys. Congratulations on the prize.'",
          resourceDelta: { sanity: 20, chaosScore: 10 },
        },
        D: {
          title: "MEDIA BLUFF BUSTED",
          narrative: "The officer demanded press credentials. After 25 sweaty minutes of apologizing and deleting the footage, you were fined ₹1,000 and released.",
          resourceDelta: { sanity: -25, chaosScore: 35 },
        },
      },
    },

    // ROUND 4
    {
      roundIndex: 4,
      category: "friends",
      difficulty: "normal",
      prompt: "It's 1:15 AM in the middle of nowhere. The car engine radiator begins sputtering steam. The ONLY building open within 40 km is the eerie, neon-lit 'Starlight Highway Motel'. The manager only has ONE room left: The Velvet Honeymoon Suite.",
      question: "How does the squad arrange sleeping in the Honeymoon Suite?",
      highlightedText: "Velvet Honeymoon Suite",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Pack all 6+ people horizontally like sardines across the bed",
          subtitle: "Legs tangled, elbows in faces, true squad bonding.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Play high-stakes Rock-Paper-Scissors: Losers sleep on the rug",
          subtitle: "Democracy has no place here. Darwinian tournament.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Sleep in the car with windows cracked and mosquito coils lit",
          subtitle: "The suite wallpaper looks like a horror movie set anyway.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Bribe the night manager ₹3,000 for access to the lobby sofa and TV",
          subtitle: "Watch 90s action movies all night on the crt TV.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "SARDINE CAN BEDROOM",
          narrative: "Six people crammed sideways on a king mattress. Someone snored like a diesel tractor, but you made it through the night!",
          resourceDelta: { sanity: 10, chaosScore: 15 },
        },
        B: {
          title: "THE TOURNAMENT OF RUGS",
          narrative: "Rock crushed Scissors! The losers slept on stiff synthetic carpet using spare jeans as pillows. Morning backs are wrecked.",
          resourceDelta: { sanity: -10, chaosScore: 25 },
        },
        C: {
          title: "CAR CAMPING REGRETS",
          narrative: "Mosquitoes penetrated the window crack within 4 minutes. You woke up covered in red dots looking like leopards.",
          resourceDelta: { sanity: -30, chaosScore: 30 },
        },
        D: {
          title: "LOBBY CINEMA LOUNGE",
          narrative: "Manager brought out sweet biscuits and hot chai while you binged old action movies until 5 AM. Peak comfy memories!",
          resourceDelta: { sanity: 25, chaosScore: 10 },
        },
      },
    },

    // ROUND 5
    {
      roundIndex: 5,
      category: "friends",
      difficulty: "spicy",
      prompt: "Morning at 6:30 AM. You pack your bags, but THE CAR KEYS ARE GONE! Standing in the driveway is an eccentric hitchhiker in mirrored aviators and a floral shirt twirling your keys on his finger: 'I found these. Give me a ride to the coast, and they're yours.'",
      question: "How do you handle the key-holding hitchhiker?",
      highlightedText: "Keys Held Hostage",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You noticed the hitchhiker's guitar case has backstage VIP passes to the coastal music festival!",
        secretGoal: "Persuade the squad to choose Option A (Give him a ride) or Option D (Trade him)!",
      },
      options: [
        {
          id: "A",
          label: "Welcome him to the squad and give him the aux cord playlist",
          subtitle: "Free spirit roadtrip energy. He knows the route anyway.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Create a fake selfie distraction and tackle him for the keys",
          subtitle: "Tactical rugby strip. We don't negotiate with hitchhikers.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Hotwire the car using a paperclip and leave him standing there",
          subtitle: "YouTube mechanical tutorial will save us.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Trade him your best pair of designer sunglasses for the keys",
          subtitle: "Clean barter. He gets fashion, we get our ignition.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE LEGENDARY ROAD COMPANION",
          narrative: "He hopped in, plugged in his phone, and dropped the greatest road trip playlist in human history. Morale boosted 200%!",
          resourceDelta: { sanity: 30, chaosScore: 20 },
        },
        B: {
          title: "PARKING LOT TACKLE",
          narrative: "You tackled him into the gravel! Keys flew into the air and landed in the motel fountain! You got them back soaking wet.",
          resourceDelta: { sanity: -15, chaosScore: 50 },
        },
        C: {
          title: "SPARKING STEERING COLUMN",
          narrative: "Paperclip touched the wrong copper wire. Sparks shot into your lap and the car horn got stuck on CONSTANT BLARE!",
          isAbsurd: true,
          resourceDelta: { sanity: -40, chaosScore: 80 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE HORN IS STUCK ON FULL BLARE! DEAL WITH THE NOISE!",
        },
        D: {
          title: "THE SUNGLASS TRADER",
          narrative: "He slipped on the Ray-Bans, smiled: 'Deal, brothers.' He tossed the keys and wished you peace. Smooth trade.",
          resourceDelta: { sanity: 15, chaosScore: 10 },
        },
      },
    },

    // ROUND 6
    {
      roundIndex: 6,
      category: "friends",
      difficulty: "spicy",
      prompt: "8:00 AM on the mountain highway. Google Maps announces: 'Accident ahead. Turn left for 45-minute shortcut through the Ghat Pass.' The road ahead is a steep dirt cliffside path with heavy morning fog and zero guardrails.",
      question: "Does the squad risk the foggy mountain shortcut?",
      highlightedText: "Foggy Cliffside Shortcut",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Send it through the mountain shortcut! Fortune favors the bold",
          subtitle: "Save 45 minutes, conquer the ghat, drift the hairpin bends.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Stay on the safe national highway crawl with the trucks",
          subtitle: "Slow, boring, 100% survival rate. We have ₹5 Lakh to claim.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Stop at the cliffside viewpoint stall for Maggi and wait for fog to lift",
          subtitle: "Fresh mountain Maggi in the clouds cures all haste.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Let the hitchhiker drive because he claims to be a rally racer",
          subtitle: "'Trust me, I grew up on these cliffs.' High risk, high speed.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "RALLY STAGE DRIFTING",
          narrative: "Tires squealed on the wet mud! Everyone gripped the ceiling handles screaming prayers, but you beat the shortcut by 50 minutes!",
          resourceDelta: { sanity: -20, chaosScore: 60 },
        },
        B: {
          title: "TRUCK TRAFFIC PURGATORY",
          narrative: "Stuck behind 4 cement mixers for 2 hours reading 'HORN OK PLEASE'. Sanity drained, but zero danger encountered.",
          resourceDelta: { sanity: -15, chaosScore: -10 },
        },
        C: {
          title: "MOUNTAIN MAGGI BLISS",
          narrative: "Steaming hot spicy Maggi and sweet ginger tea above the clouds! The fog cleared, revealing breathtaking sunrise valleys.",
          resourceDelta: { sanity: 35, chaosScore: 5 },
        },
        D: {
          title: "THE RALLY RACER SCARE",
          narrative: "He clipped every apex at 80 km/h with one hand on the wheel humming rock songs! Terrifying, exhilarating, and shockingly fast!",
          isAbsurd: true,
          resourceDelta: { sanity: -25, chaosScore: 75 },
          triggerChaosMoment: true,
          chaosMomentMessage: "RALLY RACER TOOK OVER! WE SHAVED 1 HOUR OFF THE CLOCK!",
        },
      },
    },

    // ROUND 7
    {
      roundIndex: 7,
      category: "friends",
      difficulty: "spicy",
      prompt: "The mountain path spits you out at a river crossing... but the bridge has been washed out by flash floods! On the opposite bank is the highway. A local farmer with a heavy-duty sugarcane tractor offers to tow your car across the rapids for ₹12,000.",
      question: "How does the squad cross the roaring river?",
      highlightedText: "Washed-Out River Crossing",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You checked the water depth with a long bamboo pole: it's barely knee-deep if you follow the gravel bed.",
        secretGoal: "Persuade the squad to choose Option B (Wade on foot) or Option A (Tractor tow)!",
      },
      options: [
        {
          id: "A",
          label: "Pay the farmer ₹12,000 for the heavy tractor tow",
          subtitle: "Strap the tow cable, let the diesel monster drag us across.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Park the car on this side and wade across with luggage on heads",
          subtitle: "Adventure documentary style. Water is cold, but free.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Gun the car engine and try to hydroplane across the shallows",
          subtitle: "Speed and momentum! Fast & Furious river jump!",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Turn around and drive 80 km back around the mountain",
          subtitle: "Defeat accepted. We will lose 4 hours, but keep dry.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "TRACTOR SUBMARINE POWER",
          narrative: "The giant tractor pulled your car through the swirling waters like a toy boat! Wheels touched the other side safely. High fives all around!",
          resourceDelta: { sanity: 20, chaosScore: 30 },
        },
        B: {
          title: "THE RIVER EXPEDITION",
          narrative: "Forming a human chain with bags balanced on heads! Water reached your waists, but you laughed the entire way across!",
          resourceDelta: { sanity: 25, chaosScore: 40 },
        },
        C: {
          title: "FLOODED ENGINE CATASTROPHE",
          narrative: "Car splashed into the middle and stalled! Water sloshed through the pedals! You had to push the car out while cursing each other!",
          isAbsurd: true,
          resourceDelta: { sanity: -40, chaosScore: 85 },
          triggerChaosMoment: true,
          chaosMomentMessage: "CAR FLOODED IN THE RIVER! PUSH WITH ALL YOUR MIGHT!",
        },
        D: {
          title: "THE LONG U-TURN RETREAT",
          narrative: "Turned around in shame. 80 km of mountain potholes. The mood in the car was dead silence for an hour.",
          resourceDelta: { sanity: -30, chaosScore: -20 },
        },
      },
    },

    // ROUND 8
    {
      roundIndex: 8,
      category: "friends",
      difficulty: "spicy",
      prompt: "Soaked and muddy, you pull up to the nearest establishment to clean up. It's a ₹20 Crore royal palace where a massive NRI destination wedding is underway! The turbaned guards mistake your squad for the bride's international college reunion crew and pin royal rose corsages on you!",
      question: "How does the squad handle crashing a 500-guest royal wedding?",
      highlightedText: "Accidental Royal Wedding Crash",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Own the cover story, enter the banquet hall, and demolish the buffet",
          subtitle: "50 gourmet dishes, chocolate fountains, live counters. We feast.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Find the wedding planner, confess you're lost, ask for a phone charger",
          subtitle: "Polite honesty. Maybe they'll give us leftover snacks.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Hijack the Baraat dance procession and drop synchronized bhangra",
          subtitle: "Become the life of the wedding! Nobody questions great dancers.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Sneak into the palace poolside cabanas and take power naps",
          subtitle: "Velvet cushions, pool towels, recover from the river crossing.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "ROYAL BUFFET GLUTTONY",
          narrative: "You piled plates high with butter chicken, paneer tikkas, and warm gulab jamuns. The bride's grandmother pinched your cheeks!",
          resourceDelta: { sanity: 35, chaosScore: 25 },
        },
        B: {
          title: "WEDDING PLANNER RESCUE",
          narrative: "The planner smiled, gave you dry clothes from the staff pantry, charged your phones, and packed 4 boxes of biryani for the road!",
          resourceDelta: { sanity: 30, chaosScore: 10 },
        },
        C: {
          title: "BARAAT DANCE HEROES",
          narrative: "Your squad led the dance train around the groom's horse! Relatives showered you with ₹500 rupee notes! You made ₹8,000 in cash tips!",
          resourceDelta: { sanity: 40, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU WERE THE STARS OF THE BARAAT! ₹8,000 SHOWERED IN CASH!",
        },
        D: {
          title: "POOLSIDE CABANA SLUMBER",
          narrative: "Fell asleep on plush silk daybeds. 45 minutes of the most rejuvenating sleep of your entire lives.",
          resourceDelta: { sanity: 25, chaosScore: 10 },
        },
      },
    },

    // ROUND 9
    {
      roundIndex: 9,
      category: "friends",
      difficulty: "spicy",
      prompt: "DISASTER! While dancing at the wedding, the golden ₹5,00,000 winning lottery ticket fell out of someone's pocket! The groom's billionaire father found it on the champagne table, thinks it's a lucky wedding novelty gift, and is about to put it into the ceremonial gift vault!",
      question: "How do you retrieve the ₹5,00,000 ticket from the billionaire father?",
      highlightedText: "Ticket in Gift Vault",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "The groom's father has a weakness for old-school Hindi movie trivia and respect for honest youth.",
        secretGoal: "Get the squad to choose Option B (Dance-off) or Option C (Honest appeal)!",
      },
      options: [
        {
          id: "A",
          label: "Grab the DJ microphone and announce the truth to all 500 guests",
          subtitle: "'Uncleji, that scratcher is our life savings! Please return it!'",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Challenge the groom's brother to an epic dance battle for the ticket",
          subtitle: "High-drama cinematic showdown on the LED dance floor.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Approach Uncleji with folded hands and show the purchase receipt",
          subtitle: "Dignified, respectful, touch his feet for good measure.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Swap the winning ticket with a fake lottery paper from your wallet",
          subtitle: "Ocean's Eleven sleight of hand at the champagne table.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "MIC DROP COMMOTION",
          narrative: "The whole banquet gasped! Then Uncleji laughed boisterously: 'Bete, why didn't you say so?!' He handed it back with a hug!",
          resourceDelta: { sanity: 20, chaosScore: 50 },
        },
        B: {
          title: "BOLLYWOOD CLIMAX DANCE BATTLE",
          narrative: "Dhol beats kicked in! You hit backflips and bhangra spins! The crowd went berserk. Uncleji personally awarded you the ticket as the trophy!",
          isAbsurd: true,
          resourceDelta: { sanity: 35, chaosScore: 80 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU WON THE WEDDING DANCE BATTLE! TICKET RETRIEVED!",
        },
        C: {
          title: "THE BLESSING OF UNCLEJI",
          narrative: "Touched his feet. He was so impressed by your group's manners that he gave back the ticket PLUS a silver coin for good luck!",
          resourceDelta: { sanity: 30, chaosScore: 10 },
        },
        D: {
          title: "THE SLEIGHT OF HAND SLIP",
          narrative: "Swapped it smoothly while toasting drinks! Nobody noticed a thing. The golden ticket is back in your front pocket!",
          resourceDelta: { sanity: 15, chaosScore: 40 },
        },
      },
    },

    // ROUND 10
    {
      roundIndex: 10,
      category: "friends",
      difficulty: "spicy",
      prompt: "GRAND FINALE AT 6:30 AM! With the winning ticket safely clenched in hand, dry clothes from the wedding, and the morning sun gleaming over the beach resort strip, you pull up to the State Lottery Directorate office. The doors unlock in 10 minutes. ₹5,00,000 is officially yours.",
      question: "How does the squad seal the final triumph of this legendary trip?",
      highlightedText: "₹5,00,000 Claim Office",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You discovered the luxury beach resort next door has a private helicopter charter available for booking.",
        secretGoal: "Persuade the squad to choose Option A (Beach party) or Option D (Helicopter ride home)!",
      },
      options: [
        {
          id: "A",
          label: "Book the beachfront penthouse villa right now for 5 days of glory",
          subtitle: "Pool parties, water sports, unlimited seafood. Burn it together.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Lock ₹3,50,000 into a squad travel fund FD and split the rest",
          subtitle: "Guaranteed future epic trips for the next 5 years.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Buy an old seaside beach shack and make it the official squad clubhouse",
          subtitle: "Hammocks, graffiti walls, the permanent group sanctuary.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Hire a private helicopter to fly the entire squad home in style",
          subtitle: "Touch down in your home city like rockstars. Maximum flex.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE GOLDEN VILLA HOLIDAY",
          narrative: "Checked into the 3-story beachfront villa! Infinity pool overlooking the turquoise sea. The greatest victory celebration imaginable!",
          resourceDelta: { sanity: 50, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE SQUAD REACHED THE BEACH VILLA! VICTORY ACHIEVED!",
        },
        B: {
          title: "THE ETERNAL TRAVEL FUND",
          narrative: "Fixed deposit receipt signed by everyone. Your future trips to Bali, Japan, and Ladakh are fully funded. True brotherhood!",
          resourceDelta: { sanity: 45, chaosScore: -10 },
        },
        C: {
          title: "THE OFFICIAL SQUAD SHACK",
          narrative: "You bought the wooden beach shack! Painted your names on the driftwood beam. A physical monument to your friendship forever.",
          resourceDelta: { sanity: 40, chaosScore: 30 },
        },
        D: {
          title: "HELICOPTER ROCKSTAR RETURN",
          narrative: "The twin-rotor chopper touched down on the city golf course! The squad stepped out in sunglasses. You conquered the chaos!",
          isAbsurd: true,
          resourceDelta: { sanity: 50, chaosScore: 100 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU FLEW HOME IN A HELICOPTER! PEAK CHAOS VICTORY!",
        },
      },
    },
  ],
};

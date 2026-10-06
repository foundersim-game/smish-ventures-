import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const QUICK_CHAOS_SCENARIO: ScenarioDefinition = {
  id: "quick_chaos",
  title: "QUICK CHAOS: THE $50,000 VEGAS RUNAWAY ROAD TRIP",
  category: "friends",
  tagline: "10 connected rounds: A $50K scratcher, state troopers, and an accidental billionaire wedding crash.",
  description: "A continuous 10-round runaway road trip saga. From scratching a winning $50,000 ticket at a desert gas station to surviving mountain passes, missing car keys, and crashing a Napa Valley celebrity wedding on the way to the Vegas Strip.",
  estimatedMinutes: "20 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 10,
  isPremium: false,
  vibeTag: "⚡ FAST & LOUD",
  vibeColor: "amber",
  goodFor: "Game nights, house parties, trips, or anytime you want high-energy, escalating chaos.",
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
      prompt: "While grabbing road snacks at a remote desert gas station, the squad buys a $20 scratchcard and hits the $50,000 JACKPOT! The cashier hands over the golden winning claim slip. The squad is screaming in the parking lot.",
      question: "What is the unanimous squad plan for the $50,000 jackpot?",
      highlightedText: "$50,000 Jackpot",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Book a 5-star Bellagio Sky Villa penthouse in Vegas",
          subtitle: "Private hot tub, bottle service, pure unadulterated luxury.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Rent a cherry-red vintage convertible and blast the desert highway",
          subtitle: "Road trip of a lifetime with custom sound systems and sunglasses.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Direct deposit split right now via Apple Cash / Venmo",
          subtitle: "Transfer equal cuts to everyone immediately. Zero drama.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Invest the entire $50,000 in a friend's wild tech startup",
          subtitle: "Autonomous drone burrito delivery. 10x returns or zero.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "VEGAS PENTHOUSE LOCKED",
          narrative: "Everyone hugged in disbelief! You punched Vegas Strip coordinates into GPS and floored the gas!",
          resourceDelta: { sanity: 25, chaosScore: 20 },
        },
        B: {
          title: "THE VINTAGE CONVERTIBLE CRUISER",
          narrative: "You upgraded to an iconic open-top cruiser with surround sound. The ultimate squad getaway car!",
          resourceDelta: { sanity: 20, chaosScore: 30 },
        },
        C: {
          title: "BANK BALANCES GREEN",
          narrative: "Pragmatic, sensible, but the squad adrenaline is so high you're driving to Vegas anyway!",
          resourceDelta: { sanity: 15, chaosScore: 5 },
        },
        D: {
          title: "BURRITO DRONE DREAMS",
          narrative: "You shook hands on an AI-powered burrito drone startup. Astronomical optimism, questionable viability!",
          isAbsurd: true,
          resourceDelta: { sanity: -10, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU INVESTED $50,000 IN A BURRITO DRONE STARTUP!",
        },
      },
    },

    // ROUND 2
    {
      roundIndex: 2,
      category: "friends",
      difficulty: "spicy",
      prompt: "Cruising down the interstate at 80 MPH, someone rolls down the window to film a TikTok recap. WHOOSH! The $50,000 lottery voucher slips out and gets plastered across the windshield of an 18-wheeler tanker right behind you!",
      question: "How do you recover the runaway lottery ticket?",
      highlightedText: "Ticket on 18-Wheeler",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You know the state weigh station and rest stop is only 2 miles ahead and all commercial trucks MUST pull in.",
        secretGoal: "Convince the squad to pick Option B (Tail to weigh station) or Option C (Selfie stick trick)!",
      },
      options: [
        {
          id: "A",
          label: "Emergency handbrake drift to the shoulder and sprint across traffic",
          subtitle: "Olympic hurdle sprint across 3 lanes of interstate highway.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Match speed with hazard lights and tail the truck to the weigh station",
          subtitle: "Calm, tactical surveillance until the 18-wheeler stops.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Lean out the window with a selfie stick and duct tape to grab it",
          subtitle: "Fast & Furious mid-air extraction maneuver.",
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
          narrative: "Your friend vaulted the guardrail, waved frantically, and peeled the golden voucher off the grill as the truck blasted its air horn! TICKET RETRIEVED!",
          resourceDelta: { sanity: -30, chaosScore: 70 },
          triggerChaosMoment: true,
          chaosMomentMessage: "HIGHWAY EXTRACTION SUCCESSFUL! TICKET IS SAFE!",
        },
        B: {
          title: "WEIGH STATION TACTICS",
          narrative: "The 18-wheeler pulled into the inspection bay. You politely explained the situation to the driver, who chuckled and handed down your pristine ticket!",
          resourceDelta: { sanity: 20, chaosScore: 15 },
        },
        C: {
          title: "SELFIE STICK DISASTER",
          narrative: "The duct tape caught the edge... but snapped the selfie stick in half! You scrambled on the shoulder asphalt and snatched it by millimeters!",
          resourceDelta: { sanity: -15, chaosScore: 50 },
        },
        D: {
          title: "THE ENLIGHTENED MONKS",
          narrative: "You sat in silence for 90 seconds before someone yelled: 'HELL NO! TURN THE CAR AROUND RIGHT NOW!' and slammed the brakes!",
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
      prompt: "The frantic highway maneuvering caught the eye of State Highway Patrol! Two cruiser SUVs pull you over with cherries and sirens flashing. The trooper walks to your window: 'Step out and pop the trunk for inspection.'",
      question: "The trunk is full of messy road gear, leftover 4th of July fireworks, and 30 energy drinks. How do you handle the trooper?",
      highlightedText: "State Trooper Trunk Search",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "The trooper has a college football bumper sticker on his squad car. Sports small talk will instantly charm him.",
        secretGoal: "Steer the squad towards Option A (Show winning ticket) or Option C (Offer gourmet snacks)!",
      },
      options: [
        {
          id: "A",
          label: "Show the $50,000 ticket and explain you just won the jackpot",
          subtitle: "Pure honesty: 'Officer, we just won and completely lost our composure.'",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Pretend a passenger has acute appendicitis cramps",
          subtitle: "Dramatic Oscar-level groaning to request a police escort to hospital.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Offer the troopers fresh bakery donuts and cold iced coffee",
          subtitle: "Classic hospitality to defuse all roadside tension.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Claim you're filming an undercover travel documentary for Netflix",
          subtitle: "Point an iPhone: 'You are live on Route 66 Road Chronicles!'",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "TROOPERS JOIN THE CELEBRATION",
          narrative: "The trooper inspected the golden voucher with wide eyes: 'No way!' He snapped a selfie with the squad, congratulated you, and told you to drive safe!",
          resourceDelta: { sanity: 25, chaosScore: 20 },
        },
        B: {
          title: "ACADEMY AWARD MEDICAL SCARE",
          narrative: "Your friend's groaning was so convincing the troopers escorted you 15 miles to an urgent care clinic! You had to fake a miraculous recovery to escape!",
          resourceDelta: { sanity: -20, chaosScore: 45 },
        },
        C: {
          title: "DONUT DIPLOMACY",
          narrative: "The trooper took a glazed donut and an iced latte: 'Stay in your lane, kids, and enjoy Vegas.' No tickets issued!",
          resourceDelta: { sanity: 20, chaosScore: 10 },
        },
        D: {
          title: "PRESS PASS BLUFF BUSTED",
          narrative: "The trooper asked for press credentials. After 20 sweaty minutes of apologizing and deleting footage, you were handed a $150 lane violation fine.",
          resourceDelta: { sanity: -25, chaosScore: 35 },
        },
      },
    },

    // ROUND 4
    {
      roundIndex: 4,
      category: "friends",
      difficulty: "normal",
      prompt: "It's 1:30 AM in the middle of the desert. The radiator begins spitting white steam. The ONLY building open within 35 miles is the retro neon 'Starlight Palms Motel'. The eccentric night clerk has ONE room left: The Pink Velvet Honeymoon Suite.",
      question: "How does the squad arrange sleeping in the Honeymoon Suite?",
      highlightedText: "Velvet Honeymoon Suite",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Pack all 6+ people horizontally like sardines across the king bed",
          subtitle: "Elbows in ribs, feet in faces, authentic road trip bonding.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "High-stakes Rock-Paper-Scissors tournament: Losers sleep on the rug",
          subtitle: "Democracy is dead. Darwinian tournament for bed rights.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Camp in the car with windows cracked and the AC on low",
          subtitle: "The suite wallpaper looks like an unhinged horror movie set anyway.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Slide the night clerk $100 cash for access to the 24h lobby sofas and TV",
          subtitle: "Watch vintage 80s action movies all night on the cable TV.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "SARDINE CAN BEDROOM",
          narrative: "Six people crammed sideways on a pink satin mattress. Someone snored like a diesel locomotive, but you survived together!",
          resourceDelta: { sanity: 10, chaosScore: 15 },
        },
        B: {
          title: "THE TOURNAMENT OF RUGS",
          narrative: "Rock crushed Scissors! The losers slept on stiff synthetic carpet using spare hoodies as pillows. Morning backs are completely wrecked.",
          resourceDelta: { sanity: -10, chaosScore: 25 },
        },
        C: {
          title: "CAR CAMPING REGRETS",
          narrative: "Desert bugs slipped through the window crack within 5 minutes. You woke up sweating with weird mystery bug bites.",
          resourceDelta: { sanity: -30, chaosScore: 30 },
        },
        D: {
          title: "LOBBY CINEMA LOUNGE",
          narrative: "The clerk brought out cold sodas and pretzels while you binged vintage action movies until 5 AM. Peak nostalgic memories!",
          resourceDelta: { sanity: 25, chaosScore: 10 },
        },
      },
    },

    // ROUND 5
    {
      roundIndex: 5,
      category: "friends",
      difficulty: "spicy",
      prompt: "Morning at 6:45 AM. You pack up, but THE CAR KEYS ARE MISSING! Standing by the vending machine is an eccentric hitchhiker in mirrored aviators and a vintage Hawaiian shirt twirling your keys on his finger: 'Found these by the tire. Give me a ride down the highway, and they're yours.'",
      question: "How do you handle the key-holding hitchhiker?",
      highlightedText: "Keys Held Hostage",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You noticed his guitar case has all-access VIP artist laminates to the huge music festival in the valley!",
        secretGoal: "Persuade the squad to choose Option A (Give him a ride) or Option D (Trade sunglasses)!",
      },
      options: [
        {
          id: "A",
          label: "Welcome him to the squad and give him the aux cord playlist",
          subtitle: "Free spirit roadtrip energy. He knows all the backroads anyway.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Create a fake selfie distraction and football tackle him for the keys",
          subtitle: "Tactical rugby strip. We don't negotiate with hitchhikers.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Hotwire the car using a paperclip and bobby pin and leave him behind",
          subtitle: "YouTube mechanical tutorial will save us.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Trade him your best pair of designer Ray-Ban sunglasses for the keys",
          subtitle: "Clean barter. He gets high fashion, we get our ignition.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE LEGENDARY ROAD COMPANION",
          narrative: "He hopped into the passenger seat, plugged in his iPhone, and dropped the greatest road trip synth-wave playlist known to humanity!",
          resourceDelta: { sanity: 30, chaosScore: 20 },
        },
        B: {
          title: "PARKING LOT TACKLE",
          narrative: "You tackled him into the gravel! Keys flew through the air and splashed into the motel pool! You fished them out soaking wet.",
          resourceDelta: { sanity: -15, chaosScore: 50 },
        },
        C: {
          title: "SPARKING STEERING COLUMN",
          narrative: "The paperclip touched the wrong copper wire. Sparks shot into your lap and the car alarm horn got locked on CONSTANT HONKING!",
          isAbsurd: true,
          resourceDelta: { sanity: -40, chaosScore: 80 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE HORN IS STUCK ON FULL BLARE! DEAL WITH THE NOISE!",
        },
        D: {
          title: "THE SUNGLASS TRADER",
          narrative: "He slipped on the Ray-Bans and nodded: 'Pleasure doing business, legends.' He tossed the keys and wished you safe travels.",
          resourceDelta: { sanity: 15, chaosScore: 10 },
        },
      },
    },

    // ROUND 6
    {
      roundIndex: 6,
      category: "friends",
      difficulty: "spicy",
      prompt: "8:15 AM on the canyon highway. Google Maps announces: 'Major pileup ahead. Turn left for 40-minute shortcut through the mountain canyon pass.' The road ahead is a steep unpaved cliffside trail with heavy morning mist and zero guardrails.",
      question: "Does the squad risk the foggy mountain canyon shortcut?",
      highlightedText: "Foggy Canyon Shortcut",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Send it through the mountain canyon! Fortune favors the bold",
          subtitle: "Save 40 minutes, drift the gravel switchbacks, feel alive.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Stay in the dead stop interstate traffic with the semi-trucks",
          subtitle: "Slow, boring, 100% survival rate. We have $50,000 to cash.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Pull into a retro roadside diner for loaded pancakes and wait out the fog",
          subtitle: "Fresh diner coffee and maple syrup cures all road rage.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Let the hitchhiker drive because he claims to be an ex-Baja rally driver",
          subtitle: "'Trust me, I drove buggies across Baja.' High risk, high speed.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "RALLY STAGE DRIFTING",
          narrative: "Gravel sprayed against the undercarriage! Everyone gripped the roof handles screaming prayers, but you bypassed the jam by 45 minutes!",
          resourceDelta: { sanity: -20, chaosScore: 60 },
        },
        B: {
          title: "INTERSTATE TRAFFIC PURGATORY",
          narrative: "Stuck behind 3 oversized load freight trailers for 2 hours. Sanity drained to zero, but zero danger encountered.",
          resourceDelta: { sanity: -15, chaosScore: -10 },
        },
        C: {
          title: "DINER PANCAKE PARADISE",
          narrative: "Warm blueberry pancakes, crispy bacon, and bottomless coffee while the morning fog burned off under golden sunshine!",
          resourceDelta: { sanity: 35, chaosScore: 5 },
        },
        D: {
          title: "THE BAJA DRIVER SCARE",
          narrative: "He clipped every hairpin at 55 MPH with one hand on the wheel whistling classic rock! Terrifying, exhilarating, and shockingly fast!",
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
      prompt: "The canyon road spits you out at a river crossing... but the timber bridge was washed out by yesterday's flash flood! On the opposite bank is the direct highway to Vegas. A local rancher with an 8-wheel John Deere heavy mud tractor offers to tow your car across for $300.",
      question: "How does the squad cross the roaring river?",
      highlightedText: "Washed-Out River Crossing",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You checked the riverbed with a long pole: it's barely knee-deep if you stick to the high gravel bank.",
        secretGoal: "Persuade the squad to choose Option B (Wade on foot) or Option A (Tractor tow)!",
      },
      options: [
        {
          id: "A",
          label: "Pay the rancher $300 for the heavy tractor tow",
          subtitle: "Hook up the industrial winch cable and let the diesel beast drag us.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Park the car on this side and wade across carrying duffels on shoulders",
          subtitle: "Adventure documentary style. Water is freezing, but free.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Gun the engine and try to hydroplane across the gravel shallows",
          subtitle: "Speed and momentum! Action-movie river jump!",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Turn around and drive 60 miles back around the mountain ridge",
          subtitle: "Defeat accepted. We lose 3 hours, but stay 100% dry.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "TRACTOR SUBMARINE POWER",
          narrative: "The monster tractor pulled your car through the swirling waters like a toy boat! Tires touched dry asphalt safely. High fives all around!",
          resourceDelta: { sanity: 20, chaosScore: 30 },
        },
        B: {
          title: "THE RIVER EXPEDITION",
          narrative: "Forming a human chain with bags balanced on heads! Water hit your waists, but you laughed hysterically the entire way across!",
          resourceDelta: { sanity: 25, chaosScore: 40 },
        },
        C: {
          title: "FLOODED ENGINE CATASTROPHE",
          narrative: "The car splashed into the middle and stalled out! Water sloshed through the footwells! You had to push it out ankle-deep while cursing each other!",
          isAbsurd: true,
          resourceDelta: { sanity: -40, chaosScore: 85 },
          triggerChaosMoment: true,
          chaosMomentMessage: "CAR FLOODED IN THE RIVER! PUSH WITH ALL YOUR MIGHT!",
        },
        D: {
          title: "THE LONG U-TURN RETREAT",
          narrative: "Turned around in defeat. 60 miles of potholed gravel. The car was dead quiet for an entire hour.",
          resourceDelta: { sanity: -30, chaosScore: -20 },
        },
      },
    },

    // ROUND 8
    {
      roundIndex: 8,
      category: "friends",
      difficulty: "spicy",
      prompt: "Muddy and exhausted, you pull into the first gated estate to clean up. It turns out to be an ultra-exclusive $30 Million Napa Valley vineyard estate where a high-profile celebrity destination wedding is underway! The valets mistake your squad for the bride's international college crew and pin white orchid boutonnieres on you!",
      question: "How does the squad handle accidentally crashing a 400-guest luxury wedding?",
      highlightedText: "Accidental Celebrity Wedding Crash",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Own the cover story, hit the open bar, and demolish the artisanal buffet",
          subtitle: "Wagyu sliders, champagne towers, chocolate fountains. We feast.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Find the wedding coordinator, confess you're lost, and ask for phone chargers",
          subtitle: "Polite honesty. Maybe they'll take pity and give us gourmet leftovers.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Hijack the reception dance floor and drop synchronized choreography",
          subtitle: "Become the life of the party! Nobody questions legendary dancers.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Sneak into the private vineyard poolside cabanas and take power naps",
          subtitle: "Silk daybeds and plush towels to recover from the river crossing.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "VINEYARD BUFFET GLUTTONY",
          narrative: "You piled plates high with artisanal cheeses, truffle pasta, and vintage champagne! The bride's eccentric aunt toasted to your squad!",
          resourceDelta: { sanity: 35, chaosScore: 25 },
        },
        B: {
          title: "WEDDING PLANNER RESCUE",
          narrative: "The planner laughed, found you clean linen shirts from the event trailer, charged your phones, and handed you a box of gourmet cupcakes for the road!",
          resourceDelta: { sanity: 30, chaosScore: 10 },
        },
        C: {
          title: "RECEPTION DANCE HEROES",
          narrative: "Your squad led the entire conga line around the wedding gazebo! The wedding DJ shouted out your names and guests were cheering wildly!",
          resourceDelta: { sanity: 40, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU WERE THE STARS OF THE WEDDING! CHEERING CROWD!",
        },
        D: {
          title: "POOLSIDE CABANA SLUMBER",
          narrative: "Passed out on plush cabana loungers under the California sun. 45 minutes of the most rejuvenating sleep of your entire lives.",
          resourceDelta: { sanity: 25, chaosScore: 10 },
        },
      },
    },

    // ROUND 9
    {
      roundIndex: 9,
      category: "friends",
      difficulty: "spicy",
      prompt: "DISASTER! While dancing at the wedding reception, the golden $50,000 lottery voucher slipped out of someone's pocket! The groom's hedge-fund billionaire father picked it up off the champagne bar, thinks it's a clever novelty gag gift, and is about to drop it into the sealed custom wedding time-capsule vault!",
      question: "How do you retrieve the $50,000 ticket from the billionaire father?",
      highlightedText: "Ticket in Gift Vault",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "The hedge-fund father loves classic college sports trivia and respects bold, direct honesty.",
        secretGoal: "Get the squad to choose Option B (Dance battle) or Option C (Honest appeal)!",
      },
      options: [
        {
          id: "A",
          label: "Grab the wedding band's wireless microphone and announce the truth to all 400 guests",
          subtitle: "'Sir! That scratcher on the table is our actual lottery windfall! Please check it!'",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Challenge the groom's hedge-fund brothers to an epic dance battle for the ticket",
          subtitle: "High-drama cinematic showdown in the middle of the ballroom.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Walk up to the father, show the purchase receipt, and explain respectfully",
          subtitle: "Dignified, straightforward, shake his hand with firm eye contact.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Swap the winning ticket with a blank receipt from your wallet while toasting drinks",
          subtitle: "Ocean's Eleven sleight of hand at the champagne table.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "MIC DROP COMMOTION",
          narrative: "The whole reception went quiet! Then the billionaire laughed boisterously: 'Are you kidding me?!' He handed it back and bought you a round of shots!",
          resourceDelta: { sanity: 20, chaosScore: 50 },
        },
        B: {
          title: "BALLROOM DANCE BATTLE CLIMAX",
          narrative: "The 808 bass dropped! You threw down backspins and hip-hop freezes! The guests went wild and the father personally presented the ticket as your trophy!",
          isAbsurd: true,
          resourceDelta: { sanity: 35, chaosScore: 80 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU WON THE WEDDING DANCE BATTLE! TICKET RETRIEVED!",
        },
        C: {
          title: "THE BILLIONAIRE'S BLESSING",
          narrative: "You explained the road trip odyssey. He was so entertained by your story that he returned the ticket AND handed you a $500 chip for the Vegas tables!",
          resourceDelta: { sanity: 30, chaosScore: 10 },
        },
        D: {
          title: "THE SLEIGHT OF HAND SLIP",
          narrative: "Swapped it smoothly while clinking champagne glasses! Nobody saw a thing. The golden $50,000 slip is back in your inner pocket!",
          resourceDelta: { sanity: 15, chaosScore: 40 },
        },
      },
    },

    // ROUND 10
    {
      roundIndex: 10,
      category: "friends",
      difficulty: "spicy",
      prompt: "GRAND FINALE AT 6:30 AM! With the winning ticket clutched tightly in hand, fresh clothes from the vineyard, and the neon lights of the Las Vegas Strip gleaming against the sunrise, you pull right up to the Nevada Lottery Claim Office. The front doors unlock in 10 minutes. $50,000 is officially yours.",
      question: "How does the squad seal the final triumph of this legendary trip?",
      highlightedText: "$50,000 Claim Office",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You discovered the private airport nearby has a luxury helicopter charter available for booking.",
        secretGoal: "Persuade the squad to choose Option A (Penthouse party) or Option D (Helicopter ride home)!",
      },
      options: [
        {
          id: "A",
          label: "Book the Bellagio Sky Villa penthouse right now for 4 days of glory",
          subtitle: "Private pool, celebrity DJ club tables, unlimited room service. Live like kings.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Lock $35,000 into a joint high-yield squad travel fund and split the rest",
          subtitle: "Guaranteed epic squad vacations to Tokyo, Ibiza, and Miami for the next 4 years.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Buy a vintage ski boat as the permanent group clubhouse",
          subtitle: "Wakeboards, lake days, the eternal squad sanctuary.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Charter a private twin-engine helicopter to fly the squad home in style",
          subtitle: "Touch down in your home city like rockstars. Maximum flex.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE SKY VILLA HOLIDAY",
          narrative: "Checked into the 2-story Bellagio Sky Villa! Overlooking the dancing fountains with cold champagne. The greatest victory celebration imaginable!",
          resourceDelta: { sanity: 50, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE SQUAD REACHED THE SKY VILLA! VICTORY ACHIEVED!",
        },
        B: {
          title: "THE ETERNAL SQUAD TRAVEL FUND",
          narrative: "High-yield account opened and confirmed by everyone. Future trips to Tokyo, Ibiza, and the Rockies are officially funded forever!",
          resourceDelta: { sanity: 45, chaosScore: -10 },
        },
        C: {
          title: "THE OFFICIAL SQUAD BOAT",
          narrative: "You bought the vintage lake boat! Stenciled the squad name across the stern. A physical monument to your friendship forever.",
          resourceDelta: { sanity: 40, chaosScore: 30 },
        },
        D: {
          title: "HELICOPTER ROCKSTAR RETURN",
          narrative: "The twin-rotor chopper touched down on the downtown helipad! The squad stepped out in aviators. You completely conquered the chaos!",
          isAbsurd: true,
          resourceDelta: { sanity: 50, chaosScore: 100 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU FLEW HOME IN A PRIVATE CHOPPER! PEAK CHAOS VICTORY!",
        },
      },
    },
  ],
};

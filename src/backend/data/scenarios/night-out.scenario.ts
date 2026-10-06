import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const NIGHT_OUT_SCENARIO: ScenarioDefinition = {
  id: "night_out_01",
  title: "NIGHT OUT: THE $3,000 ESCALATION",
  category: "night_out",
  tagline: "10 connected rounds of midnight madness, bills, bouncers & escapes.",
  description: "A continuous 10-round midnight saga. Every single decision directly causes the next crazy emergency, from 11:30 PM pre-drinks to 6:00 AM sunrise reckoning.",
  estimatedMinutes: "20 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 10,
  isPremium: false,
  vibeTag: "💸 HIGH STAKES",
  vibeColor: "emerald",
  goodFor: "Weekend pre-drinks, house parties, club squads, wild nights.",
  features: [
    "10 connected story rounds",
    "Continuous narrative consequences",
    "Dynamic $3,000 budget & sanity tracking",
    "Secret saboteur missions across rounds",
    "Mind-change reveals & tie-breaker mechanics",
    "End-game CHAOS Report summary",
  ],
  initialResourceState: {
    balance: 3000,
    sanity: 100,
    chaosScore: 20,
  },
  rounds: [
    // ROUND 1
    {
      roundIndex: 1,
      category: "night_out",
      difficulty: "normal",
      prompt: "It's 11:30 PM outside the nightlife strip. The group has pooled a $3,000 fund for the entire night.",
      question: "Where does the squad make its opening move?",
      highlightedText: "$3,000 Kitty",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Lock in the velvet-rope VIP booth",
          subtitle: "Instant prestige, sparklers, burn $1,800 immediately.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Hit the open-air rooftop craft lounge",
          subtitle: "Signature cocktails, skyline view, respectable $1,000 tab.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Dive into the sketchy basement speakeasy",
          subtitle: "$300 entry, bass that shakes your ribs, unhinged crowd.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Bet $1,500 at the backroom roulette table first",
          subtitle: "Double the budget to $6,000 or start broke. YOLO.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "VIP STATUS SECURED (AT A PRICE)",
          narrative: "The velvet rope parted like the Red Sea. You took over Booth #1, but the $1,800 deposit vanished in 10 minutes!",
          resourceDelta: { balance: -1800, sanity: 10, chaosScore: 25 },
        },
        B: {
          title: "ELEVATED LUXURY, SLOW BURN",
          narrative: "The skyline was gorgeous and the craft cocktails hit instantly. $1,000 gone, but everyone feels like royalty.",
          resourceDelta: { balance: -1000, sanity: 15, chaosScore: 10 },
        },
        C: {
          title: "SWEATY UNDERGROUND MADNESS",
          narrative: "You stepped down into the dark basement. Ear-shattering bass, flashing strobes, and $300 spent. Chaos begins!",
          resourceDelta: { balance: -300, sanity: -15, chaosScore: 45 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE UNDERGROUND BASS DROPPED! WE'RE ALL UNHINGED!",
        },
        D: {
          title: "ROULETTE WHEEL SPUN",
          narrative: "Ball landed on Red 18! You didn't double it, but you walked away with $2,000 after an intense sweat session.",
          resourceDelta: { balance: -500, sanity: -25, chaosScore: 60 },
        },
      },
    },

    // ROUND 2
    {
      roundIndex: 2,
      category: "night_out",
      difficulty: "spicy",
      prompt: "Midnight bill shock! Four servers suddenly march to your table carrying lit pyrotechnic sparkler bottles with vintage champagne. The bill is $4,800 with 20% auto-gratuity, and 4 bouncers are blocking the VIP exit.",
      question: "How does the squad handle the surprise bill?",
      highlightedText: "$4,800 Surprise Bill",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You noticed the club manager is wearing a fake Rolex and sweating. He knows the server made an ordering mistake!",
        secretGoal: "Convince the group to choose Option B (Pool cards) or C (Charm manager)!",
      },
      options: [
        {
          id: "A",
          label: "Demand CCTV footage and dispute the order",
          subtitle: "Stand your ground. We didn't wave for sparklers.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Split across everyone's credit cards and max out Apple Pay",
          subtitle: "Pay the extortion, keep our reputations intact.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Send your smoothest friend to charm the manager",
          subtitle: "Flattery, charisma, and aggressive negotiation.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Create a fake medical emergency and bolt",
          subtitle: "'HE'S CHOKING ON AN ICE CUBE!' and sprint.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "SECURITY STANDOFF",
          narrative: "The head bouncer crossed his arms and stared. 20 tense minutes later, they discounted the bill to $2,200.",
          resourceDelta: { balance: -2200, sanity: -20, chaosScore: 35 },
        },
        B: {
          title: "FINANCIAL CARNAGE",
          narrative: "Six cards tapped simultaneously. Bank notifications pinged like machine guns. You survived, but bank balances are crying.",
          resourceDelta: { balance: -2800, sanity: -35, chaosScore: 20 },
        },
        C: {
          title: "THE CHARISMA MIRACLE",
          narrative: "Your friend offered to tag the club in an 'exclusive influencer reel'. Manager smiled, waived the sparklers, charging only $1,200!",
          resourceDelta: { balance: -1200, sanity: 20, chaosScore: 30 },
        },
        D: {
          title: "STAMPEDE THROUGH THE VELVET ROPE",
          narrative: "Your friend dropped to the floor coughing dramatically! As bouncers rushed over, the entire squad vaulted the sofa and dashed for the kitchen!",
          isAbsurd: true,
          resourceDelta: { balance: 0, sanity: -40, chaosScore: 80 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU FAKED A MEDICAL EMERGENCY! RUN FOR YOUR LIVES!",
        },
      },
    },

    // ROUND 3
    {
      roundIndex: 3,
      category: "night_out",
      difficulty: "spicy",
      prompt: "You made it into the service alley! But in the frantic escape, one friend's phone and designer leather jacket were left on the table. The head bouncer is calling the phone repeatedly.",
      question: "How do you recover the hostage phone?",
      highlightedText: "Hostage Phone & Jacket",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You have the kitchen dishwasher's personal UPI QR code saved from earlier.",
        secretGoal: "Get the squad to choose Option C (Send voice note) or Option A (Bribe dishwasher)!",
      },
      options: [
        {
          id: "A",
          label: "Bribe the back-alley dishwasher $100 cash to fetch it",
          subtitle: "Cash speaks louder than bouncers.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Wipe the phone remotely and sacrifice the jacket",
          subtitle: "Clean break. No digital footprint left behind.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Send a terrifying voice note threatening legal action",
          subtitle: "'My uncle is the Commissioner of Police.'",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Send your strongest friend to arm-wrestle the bouncer",
          subtitle: "Alleyway gladiators. Winner takes all.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "DISHWASHER DIPLOMACY",
          narrative: "The dishwasher slipped through the dish pit and returned 3 minutes later with both phone and jacket safely wrapped in an apron!",
          resourceDelta: { balance: -2000, sanity: 15, chaosScore: 10 },
        },
        B: {
          title: "DIGITAL CREMATION",
          narrative: "iCloud wiped. Jacket gone forever. Your friend is currently mourning their lost memes in the dumpster shadows.",
          resourceDelta: { balance: 0, sanity: -30, chaosScore: 15 },
        },
        C: {
          title: "COMMISSIONER CHACHA BLUFF",
          narrative: "The bouncer actually believed the voice note! He tossed the jacket and phone into the alley and slammed the metal door shut.",
          resourceDelta: { balance: 0, sanity: 10, chaosScore: 35 },
        },
        D: {
          title: "EPIC ALLEYWAY ARM WRESTLE",
          narrative: "On an overturned beer keg, your friend gripped the bouncer's hand. With the whole alley cheering, they slammed his arm down! Respect earned!",
          isAbsurd: true,
          resourceDelta: { balance: 0, sanity: 30, chaosScore: 75 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU BEAT THE BOUNCER AT ARM WRESTLING!",
        },
      },
    },

    // ROUND 4
    {
      roundIndex: 4,
      category: "night_out",
      difficulty: "normal",
      prompt: "Sprinting out of the alley at 2:15 AM, a midnight-black Mercedes-Maybach with tinted windows pulls up. A suited chauffeur steps out: 'Sir, your VIP afterparty transfer is ready.' He clearly has the wrong group.",
      question: "What does the group do with the mystery luxury ride?",
      highlightedText: "Mystery Mercedes-Maybach",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You saw a VIP wristband on the chauffeur's mirror that matches the ones you grabbed earlier.",
        secretGoal: "Convince the group to pick Option A (Get in the Maybach)!",
      },
      options: [
        {
          id: "A",
          label: "Jump in immediately and act like international producers",
          subtitle: "Heated massage seats, chilled sparkling water, zero questions.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Politely confess the mistake and try to hail an auto",
          subtitle: "Honest, safe, standing in the cold at 2 AM.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Tip the chauffeur $50 cash to drop you at a 24-hour drive-thru",
          subtitle: "Cheeseburgers in a $250,000 luxury Maybach.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Claim your loudest friend is an undercover celebrity DJ",
          subtitle: "Put sunglasses on them and demand aux cord control.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "LIVING LIKE BILLIONAIRES",
          narrative: "The doors closed with a soft thud. Ambient neon lights lit up the roof. The chauffeur sped off into the glowing expressway!",
          resourceDelta: { balance: 0, sanity: 25, chaosScore: 40 },
        },
        B: {
          title: "STRANDED ON THE ROADSIDE",
          narrative: "The Maybach drove off. You spent 45 minutes getting rejected by 14 auto-rickshaw drivers. Morale is at rock bottom.",
          resourceDelta: { balance: -500, sanity: -30, chaosScore: -10 },
        },
        C: {
          title: "DRIVE-THRU ROYALTY",
          narrative: "Chauffeur accepted the cash with a grin! Rolling through the McDonald's drive-thru in a Maybach was peak luxury comedy.",
          resourceDelta: { balance: -3000, sanity: 20, chaosScore: 25 },
        },
        D: {
          title: "DJ BLUFF WORKED TOO WELL",
          narrative: "Chauffeur immediately called the party host: 'Boss, I have DJ Skrillex's cousin in the back! We're arriving in 5 minutes!'",
          isAbsurd: true,
          resourceDelta: { balance: 0, sanity: -15, chaosScore: 65 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU'RE HEADLINING A PRIVATE ROOFTOP SET!",
        },
      },
    },

    // ROUND 5
    {
      roundIndex: 5,
      category: "night_out",
      difficulty: "spicy",
      prompt: "The Maybach whisks you straight up to a 30th-floor glass sky-penthouse! The doors open to an exclusive afterparty with models, tech founders, and an eccentric Bollywood producer who greets you with warm champagne!",
      question: "How does the squad maintain its cover in high society?",
      highlightedText: "30th-Floor Sky-Penthouse",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Nod mysteriously, sip champagne, speak in French accents",
          subtitle: "Less is more. Look expensive and unbothered.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Raid the imported sushi buffet and keep low profiles",
          subtitle: "We came for the free food, not the high society drama.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Hijack the Bluetooth speaker and drop nostalgic Bollywood hits",
          subtitle: "Break the snobby vibe and turn this into a real house party.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Confess everything to the billionaire host with honest charm",
          subtitle: "'We got into the wrong car, but we love the vibe.'",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE PARISIAN MYSTIQUE",
          narrative: "A tech founder offered your squad seed capital for an imaginary fashion brand. Nobody questioned anything.",
          resourceDelta: { balance: 5000, sanity: 20, chaosScore: 20 },
        },
        B: {
          title: "SUSHI PLUNDER",
          narrative: "You consumed $800 worth of bluefin tuna rolls behind a potted palm tree. Satisfied, full, and slightly paranoid.",
          resourceDelta: { balance: 0, sanity: 15, chaosScore: 10 },
        },
        C: {
          title: "PENTHOUSE CONGA LINE",
          narrative: "The 90s hits blasted through the surround sound! Models and investors kicked off their heels and formed a giant conga line!",
          resourceDelta: { balance: 0, sanity: 30, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE ENTIRE PENTHOUSE IS IN A CONGA LINE!",
        },
        D: {
          title: "HOST RESPECT EARNED",
          narrative: "The host burst into laughter: 'You kids have guts! Stay, drink, and make yourselves at home!' Full VIP immunity.",
          resourceDelta: { balance: 0, sanity: 25, chaosScore: 15 },
        },
      },
    },

    // ROUND 6
    {
      roundIndex: 6,
      category: "night_out",
      difficulty: "spicy",
      prompt: "At 3:45 AM, one friend went looking for the bathroom and accidentally wandered into the host's private biometric art vault. The heavy steel door clicked shut, trapping them inside next to a solid-gold antique cheetah statue!",
      question: "How do you free your friend before the alarm rings?",
      highlightedText: "Trapped in Art Vault",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You noticed the host's birthday is written on the champagne bottle cork on the kitchen counter.",
        secretGoal: "Steer the squad towards Option A (Code override) or Option C (Fire alarm)!",
      },
      options: [
        {
          id: "A",
          label: "Guess the keypad code using the host's birthday / pet's name",
          subtitle: "Classic hacker movie intuition.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Tell the friend through the keyhole to sleep it off till 9 AM",
          subtitle: "It has air conditioning and a Persian carpet. They're fine.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Pull the hallway fire alarm to force magnetic door release",
          subtitle: "Emergency protocols open all fire doors automatically.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Swallow your pride and tell the host's 6'6\" security guard",
          subtitle: "Honesty is the best policy before lasers trigger.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "MASTER CRACKER",
          narrative: "Entered 1-9-8-4... BEEP! The vault door swung open! Your friend tumbled out clutching a bowl of pistachios!",
          resourceDelta: { balance: 0, sanity: 25, chaosScore: 25 },
        },
        B: {
          title: "THE LUXURY PRISONER",
          narrative: "Friend fell asleep inside like a mummy. But they accidentally rolled onto the laser trigger and set off high-pitched sirens!",
          resourceDelta: { balance: 0, sanity: -30, chaosScore: 60 },
        },
        C: {
          title: "SPRINKLER APOCALYPSE",
          narrative: "The alarm wailed! Vault popped open, but building sprinkler heads triggered! 50 celebrities are drenched in freezing water!",
          isAbsurd: true,
          resourceDelta: { balance: -5000, sanity: -40, chaosScore: 90 },
          triggerChaosMoment: true,
          chaosMomentMessage: "FIRE SPRINKLERS ACTIVE! EVACUATE THE PENTHOUSE!",
        },
        D: {
          title: "SECURITY ESCORT",
          narrative: "The giant guard tapped his master keycard and unlocked the door. He gave your friend a stern 5-minute lecture on art appreciation.",
          resourceDelta: { balance: -1000, sanity: 5, chaosScore: 15 },
        },
      },
    },

    // ROUND 7
    {
      roundIndex: 7,
      category: "night_out",
      difficulty: "spicy",
      prompt: "4:15 AM! The building security network detected the intrusion. Two exterior surveillance drones are hovering outside the glass balcony, spotlighting the living room, and guards are riding the elevator up!",
      question: "What is the squad's emergency extraction plan?",
      highlightedText: "Security Drones Hovering",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Rooftop fire escape: Take the external spiral ladder",
          subtitle: "Cold wind, 30 floors up, maximum adrenaline.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Put on catering aprons and pretend to be cleaning staff",
          subtitle: "Grab brooms, push the laundry trolley, look busy.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Grab luxury swag bags and walk out the front with confidence",
          subtitle: "Walk fast, look annoyed, act like VIPs heading home.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Hide behind the heavy velvet curtains and hold your breath",
          subtitle: "If we don't move, the drone sensors won't see us.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "MISSION IMPOSSIBLE FIRE ESCAPE",
          narrative: "You slipped onto the metal fire stairs! City lights glowed beneath your feet. Cold wind in your hair, heart pounding at 160 BPM!",
          resourceDelta: { balance: 0, sanity: -10, chaosScore: 70 },
        },
        B: {
          title: "UNDERCOVER JANITORS",
          narrative: "Guards walked right past you while you aggressively mopped a clean floor. Oscar-worthy performance!",
          resourceDelta: { balance: 0, sanity: 20, chaosScore: 20 },
        },
        C: {
          title: "VIP EXIT PLAYBOOK",
          narrative: "You walked right past the guards carrying swag bags. One guard even held the elevator door for you: 'Have a good night, sir!'",
          resourceDelta: { balance: 0, sanity: 30, chaosScore: 30 },
        },
        D: {
          title: "DRONE LASER SCAN",
          narrative: "The drone thermal camera spotted 6 people breathing behind the curtain. A robotic voice announced: 'Trespassers identified.' Time to run!",
          resourceDelta: { balance: 0, sanity: -35, chaosScore: 85 },
          triggerChaosMoment: true,
          chaosMomentMessage: "DRONES SPOTTED YOU! RUN FOR YOUR LIVES!",
        },
      },
    },

    // ROUND 8
    {
      roundIndex: 8,
      category: "night_out",
      difficulty: "spicy",
      prompt: "Clattering down the fire escape stairs in socks and scuffed shoes, you reach the 4th floor! The final metal ladder is stuck retracted 14 feet above a giant alley dumpster full of cardboard boxes.",
      question: "How does the squad get down to street level?",
      highlightedText: "14-Foot Dumpster Drop",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You checked the dumpster earlier: it's purely clean soft mattress foam from a furniture delivery!",
        secretGoal: "Convince everyone to take Option A (Cannonball jump) or Option B (Human chain)!",
      },
      options: [
        {
          id: "A",
          label: "Cannonball jump into the cardboard dumpster like movie stuntmen",
          subtitle: "Aim for the middle, bend your knees, embrace destiny.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Form a human chain from the railing to lower members down",
          subtitle: "Coordinated teamwork. Zero broken ankles.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Pry open the 4th-floor laundry chute and slide down",
          subtitle: "Direct slide into the basement linen baskets.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Knock on the 4th-floor resident's window and ask to walk through",
          subtitle: "'Excuse me, our ladder broke. Can we cross your living room?'",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CARDBOARD HEROES",
          narrative: "KER-CRUNCH! Everyone landed in soft bubble wrap and cardboard! Laughing uncontrollably in the alley dumpster!",
          resourceDelta: { balance: 0, sanity: 20, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU JUMPED INTO A DUMPSTER! HOLLYWOOD STUNT COMPLETED!",
        },
        B: {
          title: "CIRQUE DU CHAOS",
          narrative: "Human chain executed flawlessly! One by one, every squad member landed softly on their feet like ninjas.",
          resourceDelta: { balance: 0, sanity: 25, chaosScore: 15 },
        },
        C: {
          title: "LAUNDRY CHUTE TOBOGGAN",
          narrative: "WHEEEEEE! You shot out of the metal tube into a mountain of fresh hotel towels. Smells like lavender!",
          isAbsurd: true,
          resourceDelta: { balance: 0, sanity: 30, chaosScore: 40 },
        },
        D: {
          title: "CONFUSED GRANDMA ENCOUNTER",
          narrative: "A sweet elderly lady opened her window, gave everyone a glass of water, and showed you to the lobby door. Wholesome climax!",
          resourceDelta: { balance: 0, sanity: 35, chaosScore: -10 },
        },
      },
    },

    // ROUND 9
    {
      roundIndex: 9,
      category: "night_out",
      difficulty: "spicy",
      prompt: "5:15 AM! Sweaty, disheveled, and starving, the squad collapses at a 24-hour neon highway dhaba. You order 20 piping-hot butter parathas when a highway patrol cruiser pulls in for morning chai.",
      question: "How do you handle the police presence while looking like escaped convicts?",
      highlightedText: "Highway Dhaba at 5:15 AM",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Buy the officers a round of special kulhad chai and maska buns",
          subtitle: "Morning hospitality melts all suspicion.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Pretend to be tired medical interns finishing a 24-hour shift",
          subtitle: "Messy hair, dark circles, completely plausible.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Eat in complete silence with sunglasses on in total darkness",
          subtitle: "If you don't make eye contact, you don't exist.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Send your cleanest friend to pay and exit through the back fields",
          subtitle: "Tactical retreat into the sunrise mustard crop.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CHAI DIPLOMACY WINS",
          narrative: "The officers loved the gesture! They gave you traffic advice for the morning and told you wild stories from their night shift.",
          resourceDelta: { balance: -800, sanity: 25, chaosScore: -10 },
        },
        B: {
          title: "DOCTOR DISGUISE SUCCESSFUL",
          narrative: "The sub-inspector said: 'Thank you for your service, doctors. Get some sleep!' Everyone suppressed giggles.",
          resourceDelta: { balance: 0, sanity: 20, chaosScore: 20 },
        },
        C: {
          title: "CREEPY SHADES SYNDROME",
          narrative: "Wearing dark Ray-Bans at 5:20 AM while chewing paratha looked suspicious as hell. The waiter stared at you like aliens.",
          resourceDelta: { balance: 0, sanity: -15, chaosScore: 30 },
        },
        D: {
          title: "MORNING FIELD STROLL",
          narrative: "Walking through dew-covered morning grass with warm parathas wrapped in foil. Peace and morning tranquility achieved.",
          resourceDelta: { balance: -600, sanity: 30, chaosScore: 10 },
        },
      },
    },

    // ROUND 10
    {
      roundIndex: 10,
      category: "night_out",
      difficulty: "spicy",
      prompt: "6:00 AM GRAND FINALE. The orange sun is rising over the skyline. The squad is sitting inside a 24-hour diner with $4 left in total, 3% phone battery, and 15 minutes before everyone's alarms go off.",
      question: "What is the official squad story and morning pact?",
      highlightedText: "$4 Remaining at 6:00 AM",
      discussionDurationSeconds: 60,
      secretIntelRule: {
        targetPlayerCount: 1,
        intelMessage: "You took a legendary 4K video of the rooftop conga line that would go viral anywhere.",
        secretGoal: "Convince the group to pick Option B (Post the photo dump) or Option D (Crowdfund)!",
      },
      options: [
        {
          id: "A",
          label: "The Blood Pact: Swear silence and delete all evidence",
          subtitle: "What happened between 11:30 PM and 6:00 AM stays in the grave.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Post the unhinged photo dump: 'Boring Tuesday with the boys'",
          subtitle: "Drop the photos, turn off notifications, watch the world burn.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "The Wholesome Cover Story: 'We watched movies and slept early'",
          subtitle: "Universal alibi. Everyone coordinates the story on WhatsApp.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Crowdfund our lost money by starting a hangover podcast right now",
          subtitle: "Record the 15-minute raw recap while the memories are fresh.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "VAULT OF SECRETS SEALED",
          narrative: "Hands stacked in the center. The pact was forged in blood. The greatest night of your lives will only ever be spoken of in whispers.",
          resourceDelta: { balance: 0, sanity: 30, chaosScore: 10 },
        },
        B: {
          title: "INTERNET BROKEN",
          narrative: "The 10-slide photo dump hit the internet. Within 2 hours it has 8,000 views and 400 comments demanding an explanation!",
          resourceDelta: { balance: 0, sanity: -20, chaosScore: 100 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU BROKE THE INTERNET! LEGENDARY NIGHT COMPLETED!",
        },
        C: {
          title: "ALIBI LOCKED AND LOADED",
          narrative: "Every parent and boss bought the wholesome excuse. You survived the night with zero casualties and elite camaraderie.",
          resourceDelta: { balance: 0, sanity: 40, chaosScore: -20 },
        },
        D: {
          title: "PODCAST PILOT EPISODE TRENDING",
          narrative: "The raw 15-minute voice recording got picked up on Spotify charts! A media sponsor is offering $2,500 for Episode 2!",
          isAbsurd: true,
          resourceDelta: { balance: 2500, sanity: 50, chaosScore: 80 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOUR HANGOVER RECAP HIT #1 ON THE CHARTS!",
        },
      },
    },
  ],
};

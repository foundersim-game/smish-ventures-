import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const ASPEN_SCENARIO: ScenarioDefinition = {
  id: "aspen_chaos",
  title: "THE ASPEN BLIZZARD: CHALET LOCK-IN & AVALANCHE DISASTER",
  category: "friends",
  tagline: "Off-piste avalanches, blacked-out luxury chalets, and private jet panic.",
  description: "You rented a $4,500/night luxury glass chalet in Aspen, Colorado for New Year's Eve. A Category 4 blizzard hits, the power grid collapses, an avalanche blocks the only road out, and the chalet host's $50,000 wine cellar is locked with a biometric padlock. Survive the freeze, the egos, and the rationing.",
  estimatedMinutes: "25 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 8,
  isPremium: false,
  priceTier: "FREE",
  vibeTag: "❄️ LUXURY SURVIVAL",
  vibeColor: "cyan",
  goodFor: "Ski squads, winter trip groups, luxury lovers, chaotic friend circles.",
  features: [
    "8 connected Aspen ski survival rounds",
    "$4,500/night chalet damage security tracker",
    "Biometric wine cellar heist",
    "Sub-zero hot tub group chat interrogation",
    "Burning designer furniture for survival",
    "Mountain rescue helicopter final seat tribunal",
  ],
  initialResourceState: {
    balance: 4500,
    sanity: 100,
    chaosScore: 30,
  },
  rounds: [
    {
      roundIndex: 1,
      category: "friends",
      difficulty: "spicy",
      prompt: "On day one, against the mountain safety patrol's explicit red-flag avalanche warning, someone in your group insisted on taking an unmarked backcountry chute. A small slide buried two pairs of custom $1,800 skis and the group's shared American Express Platinum card in 6 feet of fresh powder.",
      question: "How do you handle the lost gear and mountain patrol siren?",
      highlightedText: "Backcountry Avalanche & Buried Amex",
      discussionDurationSeconds: 75,
      options: [
        {
          id: "A",
          label: "Dig feverishly for the Amex Platinum card with your bare ski poles before the blizzard hits",
          subtitle: "Prioritize credit card limits over hypothermia.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Lie to mountain patrol: Claim French tourists bumped you off the marked trail",
          subtitle: "Deflect guilt and avoid the $1,500 off-piste rescue fee.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Abandon the skis, snap a scenic group photo with the avalanche debris, and hike down",
          subtitle: "Content over crisis: Turn near-death into aesthetic flex.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Vote right here: The person who chose the unmarked route owes the group $3,600",
          subtitle: "Immediate financial accountability on the mountain.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "FROSTBITE & PLASTIC RECOVERED",
          narrative: "You found the card! But three fingers are completely numb and the ski patrol caught you anyway.",
          resourceDelta: { sanity: -15, balance: -600 },
        },
        B: {
          title: "PATROL SEES RIGHT THROUGH IT",
          narrative: "The head ranger used drone footage to confirm you ducked the hazard tape. Instant $1,500 fine logged to the chalet.",
          resourceDelta: { sanity: -25, balance: -1500 },
        },
        C: {
          title: "VIRAL REEL, FROZEN SQUAD",
          narrative: "The video got 800,000 views, but walking down in ski boots destroyed your feet and pride.",
          resourceDelta: { sanity: 10, balance: -1800 },
        },
        D: {
          title: "CHAIRLIFT CIVIL WAR",
          narrative: "Screaming match on the mountain! The culprit refused to pay until drinks at the chalet.",
          resourceDelta: { sanity: -30, chaosScore: 25 },
        },
      },
    },

    {
      roundIndex: 2,
      category: "friends",
      difficulty: "spicy",
      prompt: "At 7:00 PM, a Category 4 blizzard kills the Aspen power grid. Outside it is -12°F and dropping. The heated floors turn icy, and the only heated, insulated room is the host's locked $50,000 temperature-controlled wine cellar, secured by a biometric fingerprint lock.",
      question: "How do you break into the heated wine cellar?",
      highlightedText: "Biometric Wine Cellar Lock-In",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Crowbar the hinges off using an iron fire poker and accept the massive host deposit penalty",
          subtitle: "Survival takes precedence over security deposits.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Trick the fingerprint sensor using a peeled gummy bear warmed by a lighter",
          subtitle: "Hollywood spy movie logic tested at 8,000 feet altitude.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "FaceTime the host pretending you smell gas coming from inside the cellar so he gives the master PIN",
          subtitle: "Panic engineering: Weaponize landlord liability against him.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Stay in the living room, pile under 14 cashmere blankets, and burn dining chairs in the fireplace",
          subtitle: "Refuse the crime, commit arson on the furniture instead.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "WINE VAULT BREACHED",
          narrative: "The door splintered open! It's warm, cozy, and stocked with 1982 Bordeaux. Host's silent security ping went off.",
          resourceDelta: { sanity: 30, balance: -2500, chaosScore: 20 },
        },
        B: {
          title: "GUMMY BEAR CATASTROPHE",
          narrative: "Sticky gelatin melted over the sensor, permanently triggering a loud screeching burglary alarm.",
          resourceDelta: { sanity: -35, chaosScore: 35 },
          triggerChaosMoment: true,
          chaosMomentMessage: "ALARM LOCKDOWN! The keypad locked for 12 hours while alarm wails!",
        },
        C: {
          title: "LANDLORD PANIC MASTERKEY",
          narrative: "The terrified host gave the 6-digit emergency PIN instantly. Free warmth and zero damage!",
          resourceDelta: { sanity: 40, balance: 0 },
        },
        D: {
          title: "SMOKE-FILLED LIVING ROOM",
          narrative: "The varnish on the designer chairs produced noxious fumes. Everyone is coughing in ski goggles.",
          resourceDelta: { sanity: -40, balance: -1200 },
        },
      },
    },

    {
      roundIndex: 3,
      category: "friends",
      difficulty: "normal",
      prompt: "Day 2 of the blizzard. Roads are completely shut. The grocery delivery never arrived. The only food left in the chalet is 3 tins of Russian Osetra caviar, a single half-eaten frozen lasagna, and 4 bottles of vintage Dom Pérignon.",
      question: "How does the squad ration the luxury sustenance?",
      highlightedText: "Caviar vs Lasagna Rationing",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Mix the caviar directly into the heated lasagna and serve everyone equal tiny luxury scoops",
          subtitle: "Unhinged Michelin-star fusion for desperate skiers.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Auction off the real carbs (the lasagna) to the highest Venmo bidder to fund the Airbnb damage",
          subtitle: "Late-stage capitalism in an Alpine blizzard.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Pop the vintage champagne for breakfast, skip solid food, and call it high-society fasting",
          subtitle: "Liquid calories and denial until the snowplow arrives.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Designate a scout to trek 2 miles down the mountain through 4-foot drifts to find gas station beef jerky",
          subtitle: "Send a sacrifice into the blizzard for snacks.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE $800 CASSEROLE",
          narrative: "Tasted bizarrely gourmet. Everyone was fed, though two people complained of fishy cheese.",
          resourceDelta: { sanity: 20, balance: -400 },
        },
        B: {
          title: "$450 FOR FROZEN MEAT",
          narrative: "A bidding war broke out. Someone paid $450 on Venmo for the corner slice.",
          resourceDelta: { sanity: -10, balance: 450, chaosScore: 15 },
        },
        C: {
          title: "DAY 2 MIDDAY EUPHORIA",
          narrative: "Everyone is toasted by 11:30 AM singing throwback pop hits in ski gear. Severe headache incoming.",
          resourceDelta: { sanity: 30, chaosScore: 20 },
        },
        D: {
          title: "SCOUT RETREATS IN 9 MINUTES",
          narrative: "The scout made it 200 feet before crying from frostbite and returning empty-handed.",
          resourceDelta: { sanity: -25 },
        },
      },
    },

    {
      roundIndex: 4,
      category: "friends",
      difficulty: "spicy",
      prompt: "The exterior hot tub is miraculously still steaming on solar backup. At 11:00 PM in 10°F snow, someone's unlocked iPhone is hooked to the Bluetooth speaker and suddenly displays an unread group chat named: 'Real Talk: The Aspen Group Is Annoying.'",
      question: "How does the hot tub circle confront the secret group chat?",
      highlightedText: "The Leaked Hot Tub Group Chat",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Read the chat out loud over the speaker with full dramatic voice acting",
          subtitle: "Complete nuclear transparency. Let the friendship burn.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Pass the phone secretly underwater to the host and pretend nobody saw it",
          subtitle: "Avoid bloodbath; let silent resentment simmer for years.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Toss the phone into the deep snowdrift outside the deck: 'Oops, it slipped!'",
          subtitle: "Destruction of evidence to preserve vacation peace.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Demand a live courtroom trial right here in the hot tub with drinks as legal fees",
          subtitle: "Cross-examine every member about what they said behind backs.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "ABSOLUTE EMOTIONAL CARNAGE",
          narrative: "Every roast, outfit critique, and cheapness accusation aired to the mountain valley. Shockingly liberating.",
          resourceDelta: { sanity: -40, chaosScore: 40 },
          triggerChaosMoment: true,
          chaosMomentMessage: "GROUP CHAT WAR! Betrayals exposed in the steaming hot tub!",
        },
        B: {
          title: "PASSIVE-AGGRESSIVE ICE STORM",
          narrative: "Total silence fell over the tub. Everyone was calculating who was in the secret chat.",
          resourceDelta: { sanity: -20 },
        },
        C: {
          title: "PHONE FROZEN IN ICE",
          narrative: "The phone bricked in the snow. Owner is furious, but secrets remain buried beneath the powder.",
          resourceDelta: { sanity: 15, balance: -1100 },
        },
        D: {
          title: "HOT TUB SUPREME COURT",
          narrative: "Two hours of unhinged testimony. Verdict: Everyone is guilty, everyone drinks a shot of tequila.",
          resourceDelta: { sanity: 25, chaosScore: 15 },
        },
      },
    },

    {
      roundIndex: 5,
      category: "friends",
      difficulty: "spicy",
      prompt: "Day 3. The chalet backup solar battery drops to 4%. The garage contains one working 2-seater Ski-Doo snowmobile with half a tank of gas—enough to make the 14-mile trek through mountain passes down to the main Aspen resort village.",
      question: "Who takes the 2-seater snowmobile?",
      highlightedText: "The 2-Seater Snowmobile Dilemma",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Send the two strongest athletes to pick up emergency gas, batteries, and pizzas",
          subtitle: "Practical rescue mission for the collective good.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Send the two loudest complainers so the chalet can finally enjoy pure peace and quiet",
          subtitle: "Sanity preservation through strategic banishment.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Attempt to overload all 6 of you onto one snowmobile like an Indian scooter stunt team",
          subtitle: "Nobody gets left behind; high probability of ditch crash.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Refuse to use it. Lock the garage and stay together until county plows arrive",
          subtitle: "Loyalty pact: If we freeze, we freeze as one.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "HEROES DEPART",
          narrative: "They sped into the snowstorm like Arctic explorers. Sent back a thumbs-up selfie 45 minutes later.",
          resourceDelta: { sanity: 30, balance: -200 },
        },
        B: {
          title: "BLISSFUL SILENCE ACHIEVED",
          narrative: "The house fell completely peaceful for the first time in 72 hours. Fire crackled smoothly.",
          resourceDelta: { sanity: 45, chaosScore: -20 },
        },
        C: {
          title: "SNOWBANK PILEUP",
          narrative: "The snowmobile tipped 80 yards out of the driveway. Six people tumbled into a 5-foot powder bank.",
          resourceDelta: { sanity: -30, chaosScore: 30 },
        },
        D: {
          title: "SURVIVAL PACT SOLIDIFIED",
          narrative: "A heartfelt moment around the dying hearth. Shared trauma bonded the friend group forever.",
          resourceDelta: { sanity: 20 },
        },
      },
    },

    {
      roundIndex: 6,
      category: "friends",
      difficulty: "spicy",
      prompt: "In a desperate attempt to alert search and rescue crews before nightfall, someone found an emergency maritime flare gun in the garage safety kit. Firing it into the fog, the burning magnesium flare ricocheted off a pine tree directly onto the solar glass roof of a hedge-fund billionaire's mega-mansion next door.",
      question: "How do you handle the burning roof next door?",
      highlightedText: "Flare Gun Disaster & Billionaire Roof",
      discussionDurationSeconds: 75,
      options: [
        {
          id: "A",
          label: "Sprint over with buckets of snow, scale their fence, and extinguish the flare before security wakes up",
          subtitle: "Ninja covert firefighting operation in 10-degree weather.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Kill the lights, draw the chalet curtains, and swear under oath it was a Chinese lantern from downtown",
          subtitle: "Plausible deniability against Wall Street billionaires.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Ring their gate intercom, confess immediately, and offer to fix it if they let you charge your phones",
          subtitle: "Negotiate emergency access using honest guilt.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Take a dramatic photo of the burning flare in the snow and post: 'Aspen is lit tonight'",
          subtitle: "Embrace the villain arc completely.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "ROOFTOP HEROES IN SKI BOOTS",
          narrative: "You doused the flare with 40 pounds of packed snow! The roof survived with minor scorch marks.",
          resourceDelta: { sanity: 20, balance: -500 },
        },
        B: {
          title: "SECURITY DRONE INVESTIGATION",
          narrative: "Their private security dispatched an automated thermal drone that filmed you holding the flare gun.",
          resourceDelta: { sanity: -35, balance: -3000, chaosScore: 35 },
          triggerChaosMoment: true,
          chaosMomentMessage: "SECURITY FOOTAGE ACQUIRED! Billionaire's legal team alerted!",
        },
        C: {
          title: "INVITED IN FOR ESPRESSO",
          narrative: "The billionaire thought the incident was hilarious and let you warm up by their commercial generator.",
          resourceDelta: { sanity: 40, balance: 0 },
        },
        D: {
          title: "DISASTER PUBLICITY",
          narrative: "Local Aspen Reddit identified your rental chalet within 30 minutes. Comments are ruthless.",
          resourceDelta: { sanity: -25, chaosScore: 25 },
        },
      },
    },

    {
      roundIndex: 7,
      category: "friends",
      difficulty: "spicy",
      prompt: "Day 4. Temperatures drop to -18°F. The fireplace is the last source of heat, but you have run out of dry birch firewood. In the modern living room sits an original 1956 Charles Eames Rosewood Lounge Chair (valued at $7,500) and an architectural mahogany coffee table.",
      question: "What goes into the survival fire?",
      highlightedText: "Burning Designer Furniture for Heat",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Chop the mahogany coffee table first with the kitchen meat cleaver; keep the Eames chair safe",
          subtitle: "Sacrifice flat surfaces; preserve mid-century modern icon.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Burn the host's decorative coffee table art books and mountain trail maps first",
          subtitle: "Paper burns in 4 minutes, but zero security deposit deduction.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Burn the Eames chair! Human warmth > mid-century designer leather furniture",
          subtitle: "Absolute chaos: Send photo of burning chair to the host as proof of emergency.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Huddle inside the sauna together using body heat and refuse to burn anything",
          subtitle: "Suffer through the freezing cold to save the $4,500 deposit.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "MAHOGANY WARMTH",
          narrative: "The table burned for 5 glorious hours. Smelled like expensive cedar and cedar ash. $2,200 gone.",
          resourceDelta: { sanity: 30, balance: -2200 },
        },
        B: {
          title: "ASH CLOUD IN 20 MINUTES",
          narrative: "The glossy books produced massive black smoke and burned out in minutes. Cold returned rapidly.",
          resourceDelta: { sanity: -30 },
        },
        C: {
          title: "THE $7,500 BONFIRE",
          narrative: "The Eames chair burned bright and hot. Truly the most expensive fire in Pitkin County history.",
          resourceDelta: { sanity: 35, balance: -7500, chaosScore: 50 },
        },
        D: {
          title: "HYPOTHERMIA HUDDLE",
          narrative: "Shivering together in 6 layers of outerwear. Teeth chattering rhythmically like castanets.",
          resourceDelta: { sanity: -25, balance: 0 },
        },
      },
    },

    {
      roundIndex: 8,
      category: "friends",
      difficulty: "spicy",
      prompt: "Day 5: FINALE. The storm breaks. A commercial mountain rescue helicopter lands on the private heli-pad. Due to high winds and fuel limits before the next squall, the pilot delivers a brutal ultimatum: 'I can only take TWO passengers right now to Eagle County Regional Airport. The rest must wait 18 hours for the snow cat.'",
      question: "Who gets the two helicopter seats?",
      highlightedText: "Rescue Helicopter: Final Two Seats",
      discussionDurationSeconds: 120,
      options: [
        {
          id: "A",
          label: "The two players who suffered the lowest sanity during the trip",
          subtitle: "Humanitarian triage: Evacuate the mentally broken first.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "The person whose credit card paid for the entire chalet booking + their best ally",
          subtitle: "Financial royalty privilege: Golden rule rules the skies.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Draw ski straws from a ski boot: Total blind luck and zero resentment",
          subtitle: "Alpine Russian roulette for helicopter tickets.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Nobody takes the chopper! We stayed together in the freeze, we ride the snow cat together!",
          subtitle: "The ultimate ride-or-die finale brotherhood.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "EVACUATION OF THE FRAGILE",
          narrative: "The two traumatized friends flew into the sunset wrapped in thermal foil blankets, weeping with relief.",
          resourceDelta: { sanity: 40 },
        },
        B: {
          title: "CAPITALISM TRIUMPHS IN ASPEN",
          narrative: "The cardholder departed with a glass of champagne. The remaining group stayed behind plotting revenge.",
          resourceDelta: { sanity: -20, chaosScore: 30 },
        },
        C: {
          title: "LUCK OF THE SKI POLE",
          narrative: "Two unlikely winners took off laughing. The losers spent 18 hours eating leftover cereal and playing cards.",
          resourceDelta: { sanity: 25 },
        },
        D: {
          title: "LEGENDARY ASPEN SQUAD SURVIVAL",
          narrative: "The pilot gave a standing salute! The snow cat arrived at sunrise with hot donuts and coffee. Unbreakable crew.",
          resourceDelta: { sanity: 50, chaosScore: -30 },
        },
      },
    },
  ],
};

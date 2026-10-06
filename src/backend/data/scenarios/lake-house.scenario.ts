import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const LAKE_HOUSE_SCENARIO: ScenarioDefinition = {
  id: "lake_house_chaos",
  title: "AIRBNB FROM HELL: LAKE TAHOE MANSION DISASTER",
  category: "friends",
  tagline: "Flipped jet skis, 15-page house rules, and 2 AM noise citations.",
  description: "Your group booked a 7-bedroom lakefront Lake Tahoe mansion with a 15-page contract, strict exterior decibel sensors, and a host named 'Chadwick' who lives directly across the cove with binoculars. Within 12 hours, a jet ski is submerged, the basement theater is leaking, and the local county sheriff is pulling up.",
  estimatedMinutes: "25 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 8,
  isPremium: false,
  priceTier: "FREE",
  vibeTag: "🏡 VACATION CHAOS",
  vibeColor: "amber",
  goodFor: "Summer lake groups, weekend getaway squads, Airbnb survivors, party crews.",
  features: [
    "8 connected Lake Tahoe disaster rounds",
    "$5,000 security deposit deduction tracker",
    "Decibel sensor & Ring camera evasion",
    "Submerged Emerald Bay jet ski rescue",
    "Flooded basement IMAX cinema panic",
    "Sheriff 2:00 AM noise citation standoff",
    "Chadwick morning surprise inspection",
  ],
  initialResourceState: {
    balance: 5000,
    sanity: 100,
    chaosScore: 25,
  },
  rounds: [
    {
      roundIndex: 1,
      category: "friends",
      difficulty: "normal",
      prompt: "Upon checking in, host Chadwick sends a message: 'Welcome! Note rule #42: No outdoor music after 8:00 PM, quiet hours strictly enforced by 5 NoiseAware decibel sensors, and all exterior doors must remain shut to protect the antique pine flooring.' Within 15 minutes, someone brought a JBL PartyBox speaker onto the dock.",
      question: "How do you handle the decibel sensor monitoring?",
      highlightedText: "Decibel Sensors & 15-Page Rulebook",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Cover every sensor with a thick wool sock and a strip of painter's tape",
          subtitle: "Classic DIY sound dampener hack.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Turn the party inside the insulated basement sauna and blast music with zero windows",
          subtitle: "Subterranean sweatbox rave.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Comply completely: Host a silent disco where everyone wears AirPods and dances in total silence",
          subtitle: "Ultra high-tech eerie compliance.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Message Chadwick: 'We are professional cellists practicing classical sonatas'",
          subtitle: "Pretend excessive volume is high culture.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "SENSOR TAMPER ALERT TRIGGERED",
          narrative: "NoiseAware sensors detect temperature change when covered! Chadwick sent a warning SMS within 4 minutes.",
          resourceDelta: { sanity: -15, balance: -250, chaosScore: 15 },
        },
        B: {
          title: "SAUNA RAVE SUCCESS",
          narrative: "Sweaty, chaotic, but 0 decibels reached the exterior microphone. Chadwick's app showed flatline green.",
          resourceDelta: { sanity: 25 },
        },
        C: {
          title: "EERIE SILENT DISCO",
          narrative: "Neighbors watched 8 people furiously twerking in total pitch-black silence on the dock. Unsettling but legal.",
          resourceDelta: { sanity: 20 },
        },
        D: {
          title: "CHADWICK REQUESTS A CONCERT",
          narrative: "Chadwick texted back: 'Delightful! I will kayak over to hear your Brahms concerto at 9 PM.' Panic!",
          resourceDelta: { sanity: -25, chaosScore: 25 },
        },
      },
    },

    {
      roundIndex: 2,
      category: "friends",
      difficulty: "spicy",
      prompt: "At 3:00 PM in Emerald Bay, someone rented a $15,000 Sea-Doo Spark jet ski using a group member's credit card. While attempting a 360-degree spray donut around a tourist ferry, the jet ski capsized, sucked gravel into the impeller, and is slowly sinking 300 yards offshore.",
      question: "How do you salvage the sinking jet ski?",
      highlightedText: "Capsized Jet Ski in Emerald Bay",
      discussionDurationSeconds: 75,
      options: [
        {
          id: "A",
          label: "Form a human chain with life jackets and physically tow it back to shore with bare hands",
          subtitle: "Adrenaline-fueled lake marathon rescue.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Flag down a passing $2M luxury wakeboard yacht and offer them $500 cash for a quick tow",
          subtitle: "Bailout by wealthy strangers.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Abandon the jet ski and report it 'drifted away during a freak sudden wind gust'",
          subtitle: "Insurance fraud fantasy; high probability of Coast Guard investigation.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "The person who flipped it takes full legal and financial blame before the marina closes",
          subtitle: "Stern group tribunal: No split bill for reckless stunts.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "EXHAUSTED BUT SAVED",
          narrative: "Legs cramping, shivering cold, but you dragged the jet ski onto the sandy beach before the engine drowned completely!",
          resourceDelta: { sanity: -20, balance: -400 },
        },
        B: {
          title: "YACHT PARTY RESCUE",
          narrative: "The yacht owner was a tech founder who towed it effortlessly and handed everyone iced hard seltzers.",
          resourceDelta: { sanity: 35, balance: -500 },
        },
        C: {
          title: "MARINA GPS TRACKING ALERT",
          narrative: "The jet ski has real-time GPS telemetry! Marina owner saw the 360 spins and confiscated the full $2,500 security deposit.",
          resourceDelta: { sanity: -35, balance: -2500, chaosScore: 30 },
          triggerChaosMoment: true,
          chaosMomentMessage: "SECURITY DEPOSIT SEIZED! Marina reported reckless operation!",
        },
        D: {
          title: "DOCK GRIEVANCE COMMITTEE",
          narrative: "Furious tears on the dock. The culprit signed an IOU on a soggy cardboard pizza box.",
          resourceDelta: { sanity: -15, chaosScore: 20 },
        },
      },
    },

    {
      roundIndex: 3,
      category: "friends",
      difficulty: "spicy",
      prompt: "At 11:30 PM, the party moved into the 12-person cliffside hot tub. Someone fell asleep leaning against the emergency water-fill valve. At 1:15 AM, you discover 400 gallons of hot chlorinated water cascading down the stairs into the mansion's custom $200K subterranean 4K Dolby Atmos cinema room.",
      question: "How do you control the basement cinema flood?",
      highlightedText: "Subterranean Cinema Room Flood",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Raid every bedroom for all 40 guest bath towels and hair dryers to build a makeshift dam",
          subtitle: "Futile textile barrier against hundreds of gallons of water.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Use the garage shop-vac to suction water out the window into Chadwick's manicured hydrangeas",
          subtitle: "Redirect the water damage onto the host's prized flowers.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Turn on the cinema projector, play 'Titanic' at 100% volume, and embrace the indoor water park",
          subtitle: "Nihilistic celebration of imminent disaster.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Call emergency 24/7 water extraction services and pay out of pocket before sunrise",
          subtitle: "Adult responsibility: Spend $1,800 immediately to save the $5,000 deposit.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "TOWEL DISASTER ZONE",
          narrative: "All 40 towels are soaking wet, smelling of bleach, and the plush cinema carpet is still squelching like a swamp.",
          resourceDelta: { sanity: -30, balance: -600 },
        },
        B: {
          title: "HYDRANGEA TSUNAMI",
          narrative: "The cinema carpet dried up! But Chadwick's award-winning blue hydrangeas are completely flattened and waterlogged.",
          resourceDelta: { sanity: 20, balance: -350, chaosScore: 20 },
        },
        C: {
          title: "CINEMATIC MADNESS",
          narrative: "Floating on pool inflatables inside the cinema while Leonardo DiCaprio sinks. A core memory, but the subwoofer is fried.",
          resourceDelta: { sanity: 30, balance: -3200, chaosScore: 40 },
          triggerChaosMoment: true,
          chaosMomentMessage: "EQUIPMENT FRIED! Subwoofer short-circuited with smoke!",
        },
        D: {
          title: "PROFESSIONAL RESTORATION",
          narrative: "Industrial blowers arrived at 2:00 AM. By dawn, the carpet was bone dry. Bank account stung, but disaster averted.",
          resourceDelta: { sanity: 25, balance: -1800 },
        },
      },
    },

    {
      roundIndex: 4,
      category: "friends",
      difficulty: "spicy",
      prompt: "At 2:15 AM, flashing red and blue lights reflect across the mansion's floor-to-ceiling glass windows. A Placer County Deputy Sheriff knocks firmly on the solid oak door. A neighbor 4 doors down filed a formal complaint under the County Vacation Rental Noise Ordinance ($1,000 first offense fine + mandatory shutdown).",
      question: "Who answers the door and what do they say?",
      highlightedText: "2:00 AM County Sheriff Citation",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Send the most sober, articulate friend wearing glasses and an Ivy League sweater",
          subtitle: "Weaponize prep-school politeness and respectful remorse.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Pretend nobody is home: Cut all lights, drop flat on the floor, and don't make a sound",
          subtitle: "Tactical blackout evasion against law enforcement.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Open the door and offer the deputy fresh barbecue ribs and a warm Red Bull",
          subtitle: "Bribe with late-night hospitality.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Blame the neighbor next door: 'Officer, the noise was coming from the yacht on the lake!'",
          subtitle: "Deflect suspicion onto imaginary lake parties.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CHARISMA DISMISSAL",
          narrative: "The deputy nodded: 'Keep it down, son. Next time it's a thousand-dollar ticket.' Zero citation issued!",
          resourceDelta: { sanity: 35, balance: 0 },
        },
        B: {
          title: "DEPUTY SHINES FLASHLIGHT INTO GLASS",
          narrative: "The flashlight beam caught 5 adults crawling on their stomachs behind the kitchen island. Deputy was NOT amused.",
          resourceDelta: { sanity: -35, balance: -1000, chaosScore: 25 },
        },
        C: {
          title: "CONFUSED DEPUTY DECLINES RIBS",
          narrative: "He chuckled at the audacity, took a business card, and gave a strict final warning. No fine!",
          resourceDelta: { sanity: 20 },
        },
        D: {
          title: "RADAR CHECK DISPROVES LIE",
          narrative: "Deputy pointed at the exterior decibel meter on the porch: 'Nice try, it registered 88 decibels right here.' $1,000 fine logged.",
          resourceDelta: { sanity: -30, balance: -1000 },
        },
      },
    },

    {
      roundIndex: 5,
      category: "friends",
      difficulty: "spicy",
      prompt: "At 3:45 AM, an enthusiastic game of indoor mini-golf using a golf umbrella and a billiard ball resulted in a 4-inch deep crater in the main hallway's custom Venetian plaster drywall. Check-out is in 6 hours.",
      question: "How do you patch the drywall crater before morning?",
      highlightedText: "4:00 AM Venetian Plaster Patch",
      discussionDurationSeconds: 75,
      options: [
        {
          id: "A",
          label: "Emergency patch using white Crest toothpaste, baking soda, and a hotel room key card",
          subtitle: "College dorm engineering at luxury property level.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Hang a framed landscape oil painting from the upstairs guest bedroom directly over the hole",
          subtitle: "Classic structural relocation coverup.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Sprint to the 24-hour Home Depot in Carson City (35 miles away) for real Spackle and paint",
          subtitle: "Middle of the night road trip for authentic repair supplies.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Leave it alone, take a photo, and blame previous guests in the checkout review",
          subtitle: "Aggressive gaslighting offensive.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "MINTY FRESH WALL CRATER",
          narrative: "The toothpaste dried with a chalky blue tint and smells intensely of spearmint. Obvious to anyone within 5 feet.",
          resourceDelta: { sanity: -20, balance: -300 },
        },
        B: {
          title: "ARTISTIC MASTERPIECE COVERUP",
          narrative: "The painting looks completely natural there! The hole is invisible, and the hallway aesthetic actually improved.",
          resourceDelta: { sanity: 30, balance: 0 },
        },
        C: {
          title: "THE CARSON CITY SUPPLY RUN",
          narrative: "You made the 70-mile round trip, patched and sanded it perfectly by 6:00 AM. Zero sleep, but zero proof of crime.",
          resourceDelta: { sanity: -25, balance: -150 },
        },
        D: {
          title: "CHADWICK'S PRE-TRIP VIDEO FOOTAGE",
          narrative: "Chadwick has a 4K timestamped walk-through video recorded 1 hour before you checked in. Instant fail.",
          resourceDelta: { sanity: -35, balance: -850, chaosScore: 25 },
        },
      },
    },

    {
      roundIndex: 6,
      category: "friends",
      difficulty: "spicy",
      prompt: "At 5:00 AM, you discover that two people invited back from a South Lake Tahoe beach bar at midnight are passed out on the leather living room couches, eating cold Grubhub leftovers, and claiming their Uber app 'isn't working until noon.'",
      question: "How do you evict the uninvited squatters before inspection?",
      highlightedText: "Squatters on the Living Room Couch",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Order them an Uber XL on your personal credit card, hand them cold water bottles, and escort them to the curb",
          subtitle: "Diplomatic paid eviction service.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Tell them Chadwick is a federal wildlife agent arriving in 15 minutes to inspect for contraband",
          subtitle: "Psychological fear motivation to clear the premises.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Arm the group with vacuum cleaners and leaf blowers on high blast in the living room",
          subtitle: "Hostile auditory warfare to break their sleep.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Confront the specific group member who invited them and make them handle it alone",
          subtitle: "Hold the enabler strictly responsible.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "PEACEFUL DEPARTURE",
          narrative: "The squatters thanked you for the ride and departed without fuss. Living room cleared by 5:30 AM.",
          resourceDelta: { sanity: 25, balance: -75 },
        },
        B: {
          title: "FULL SPRINT PANIC ESCAPE",
          narrative: "They grabbed their shoes, vaulted over the deck railing, and sprinted down the street! Comical victory.",
          resourceDelta: { sanity: 35 },
        },
        C: {
          title: "CHADWICK DECIBEL ALARM AGAIN",
          narrative: "The leaf blower at 5:15 AM woke Chadwick up across the cove. Chadwick texted: 'Why do I hear commercial landscaping machinery?'",
          resourceDelta: { sanity: -30, balance: -250, chaosScore: 20 },
        },
        D: {
          title: "HEATED ARGUMENT IN THE DRIVEWAY",
          narrative: "An emotional screaming match woke up three different bedrooms. The strangers eventually shuffled off.",
          resourceDelta: { sanity: -20 },
        },
      },
    },

    {
      roundIndex: 7,
      category: "friends",
      difficulty: "spicy",
      prompt: "At 8:30 AM (90 minutes before check-out), a sharp double-knock echoes on the front door. It's Chadwick in a Patagonia vest holding a clipboard, a thermal infrared scanner, and an espresso mug: 'Good morning! Just doing an early perimeter check before my cleaning crew arrives.'",
      question: "How does the group handle Chadwick at the threshold?",
      highlightedText: "Chadwick's Surprise Clipboard Knock",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "One person steps outside, pulls the door shut behind them, and stalls Chadwick with questions about Tahoe hiking trails",
          subtitle: "Body-block stall tactic while the squad panics inside.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Invite him in with supreme confidence, compliment his custom kitchen island, and offer fresh brewed espresso",
          subtitle: "The charm offensive: Kill suspicion with overwhelming warmth.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Point to the contract: 'Chadwick, Section 12 guarantees tenant privacy until 10:00 AM sharp. Please step off the porch.'",
          subtitle: "Legalistic hardline assertion of rights.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Claim someone inside has severe food poisoning and the bathroom is an active biohazard zone",
          subtitle: "Biological warfare excuse to keep him outside.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "20-MINUTE TRAIL STALL",
          narrative: "You pretended to be fascinated by granite rock formations for 22 minutes while the group threw trash into garbage bags like maniacs!",
          resourceDelta: { sanity: 30, balance: 0 },
        },
        B: {
          title: "CHADWICK'S EAGLE EYE",
          narrative: "He loved the espresso, but his eyes immediately locked onto the suspiciously moved painting in the hallway.",
          resourceDelta: { sanity: -20, balance: -400, chaosScore: 15 },
        },
        C: {
          title: "CHADWICK GOES PURE HOSTILE",
          narrative: "Chadwick scowled: 'Very well. I will inspect every square inch at 10:01 AM with a magnifying glass.'",
          resourceDelta: { sanity: -35, chaosScore: 30 },
          triggerChaosMoment: true,
          chaosMomentMessage: "HOST ENRAGED! Zero-tolerance inspection guaranteed at 10:01 AM!",
        },
        D: {
          title: "CHADWICK RETREATS TO HIS GOLF CART",
          narrative: "Chadwick backed away with a look of pure disgust and waited in his driveway. The house is safe for 1 more hour!",
          resourceDelta: { sanity: 35 },
        },
      },
    },

    {
      roundIndex: 8,
      category: "friends",
      difficulty: "spicy",
      prompt: "FINAL ROUND: Check-out time has arrived. Chadwick conducts the final walk-through. He compiles the ledger: minor dock scuffs, basement moisture readings, noise warning, and 3 missing highball glasses. He offers a choice: Pay $1,200 cash right now to settle quietly, or he escalates a $4,500 damage claim through Airbnb Trust & Safety.",
      question: "How does the squad resolve the final $5,000 security deposit war?",
      highlightedText: "Final Deposit Tribunal: $1,200 Cash vs $4,500 Claim",
      discussionDurationSeconds: 120,
      options: [
        {
          id: "A",
          label: "Split the $1,200 equally among all players right now and walk away clean with 5-star reviews",
          subtitle: "The pragmatic exit fee: $150 per person to end the nightmare.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Refuse to pay a penny: Let him file the $4,500 claim, and counter-file with photos of existing dust and mold",
          subtitle: "Mutual assured destruction in the Airbnb claims court.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Negotiate Chadwick down to $600 by pointing out that your friend group cleaned all windows and dishes",
          subtitle: "High-stakes flea-market haggling with an angry landlord.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Vote on the single player who caused the most destruction during the weekend: They pay the entire $1,200",
          subtitle: "Ultimate Scapegoat Trial: The group demands retribution.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "PRAGMATIC CLEANSING",
          narrative: "Everyone Venmoed their share instantly. Chadwick shook hands, left a 5-star review: 'Guests were lovely and communicative.'",
          resourceDelta: { sanity: 40, balance: -1200 },
        },
        B: {
          title: "AIRBNB ARBITRATION WAR",
          narrative: "Six weeks of endless emails, photo submissions, and credit card disputes. Sanity drained to zero.",
          resourceDelta: { sanity: -50, balance: -2800, chaosScore: 40 },
        },
        C: {
          title: "THE $600 SETTLEMENT",
          narrative: "Chadwick sighed, accepted $600 cash, and even gave you recommendations for next summer. Incredible deal!",
          resourceDelta: { sanity: 45, balance: -600 },
        },
        D: {
          title: "THE SCAPEGOAT'S EXPULSION",
          narrative: "The designated villain paid the $1,200 in tears. The group drove home in uncomfortable silence, but bank accounts were spared.",
          resourceDelta: { sanity: 15, balance: 0, chaosScore: 25 },
        },
      },
    },
  ],
};

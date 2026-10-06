import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const GOA_SCENARIO: ScenarioDefinition = {
  id: "goa_weekend",
  title: "MIAMI SPRING BREAK: BEYOND CONTROL",
  category: "night_out",
  tagline: "Rented convertibles, VIP beach club splits, and high-stakes casino tables.",
  description: "The quintessential squad trip to South Beach Miami where peer pressure, Ocean Drive nightlife, and terrible financial management collide.",
  estimatedMinutes: "25 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 8,
  isPremium: false,
  priceTier: "FREE",
  vibeTag: "🏖️ TOTAL DISASTER",
  vibeColor: "amber",
  goodFor: "Spring break squads, bachelor/bachelorette crews, party animals.",
  features: [
    "8 connected South Beach storyline rounds",
    "Convertible accidents & police checkpoints",
    "VIP Beach Club bottle minimums",
    "High-stakes casino gambles",
    "Jet ski accidents & Airbnb deposit wars",
    "Blame & scapegoat mechanics",
  ],
  initialResourceState: {
    balance: 4500,
    sanity: 100,
    chaosScore: 25,
  },
  rounds: [
    {
      roundIndex: 1,
      category: "night_out",
      difficulty: "normal",
      prompt: "Cruising Ocean Drive in a rented open-top convertible with music blasting at 1 AM. A Miami Beach Police checkpoint flags you down. The officer writes up an unlawful noise and reckless lane citation totaling $500.",
      question: "How do you handle the police checkpoint?",
      highlightedText: "Ocean Drive Checkpoint",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Negotiate politely, apologize sincerely, and accept the $500 ticket",
          subtitle: "Take the fine on the rental agreement and keep the night alive.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Name-drop an influential local nightclub owner",
          subtitle: "'Do you know who owns the table we're heading to?' high-risk gamble.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Demand full formal badge numbers and dispute the decibel measurement",
          subtitle: "Strictly constitutional. Stand your ground.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Reverse hard and peel out down a dark residential alley",
          subtitle: "Full Miami Vice getaway mode.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "CIVIL SETTLEMENT",
          narrative: "Officer appreciated the respectful attitude, reduced the ticket to $250, and wished you a safe night.",
          resourceDelta: { balance: -250, sanity: 5 },
        },
        B: {
          title: "NAME-DROP BACKFIRE",
          narrative: "The officer called his supervisor. You waited 45 minutes on the curb and were handed an increased $800 citation.",
          resourceDelta: { balance: -800, sanity: -20 },
        },
        C: {
          title: "CURBSIDE SOBRIETY RIGOR",
          narrative: "You spent 90 minutes performing alphabet-backwards tests while they ran every passenger's ID.",
          resourceDelta: { sanity: -35 },
          triggerChaosMoment: true,
          chaosMomentMessage: "2 hours lost on the curb! The party night is half ruined!",
        },
        D: {
          title: "PALM TREE ACCIDENT",
          narrative: "Escaped the cruiser, but clipped a stone driveway planter. $1,500 rental damage deposit forfeited instantly.",
          resourceDelta: { balance: -1500, sanity: -30 },
          triggerChaosMoment: true,
          chaosMomentMessage: "Rental convertible wrecked! Blame the driver immediately!",
        },
      },
    },

    {
      roundIndex: 2,
      category: "night_out",
      difficulty: "spicy",
      prompt: "At a world-famous South Beach oceanfront dayclub, entry is $150 per person for general admission or $2,800 for an oceanfront VIP cabana table with 3 bottles.",
      question: "How do you enter the club?",
      highlightedText: "$2,800 VIP Cabana Table",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Book the $2,800 VIP cabana table together",
          subtitle: "We came to Miami to live like royalty. Swipe the card.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "General admission entry tickets only ($150 each)",
          subtitle: "Stand in the packed crowd and guard your drinks.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Slide the VIP host $400 cash to sneak everyone in via guest list",
          subtitle: "Classic Miami promoter hack. Save over $2,000.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Skip the club and party on the public beach with speakers",
          subtitle: "Better music, ocean breeze, 5% of the cost.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "BOTTLE POPPIN' ROYALS",
          narrative: "Sparklers, ice buckets, and champagne sprays. Your remaining squad budget is in critical condition!",
          resourceDelta: { balance: -2800, sanity: 30 },
        },
        B: {
          title: "MOSH PIT SUFFOCATION",
          narrative: "Sweating in 90-degree humidity for 3 hours. Someone spilled a $24 seltzer down your friend's designer shirt.",
          resourceDelta: { balance: -900, sanity: -15 },
        },
        C: {
          title: "PROMOTER SHAKEDOWN",
          narrative: "The promoter pocketed the $400, walked you past the ropes, and disappeared. Smooth VIP finesse!",
          resourceDelta: { balance: -400, sanity: 20 },
        },
        D: {
          title: "BEACH SHORELINE GLORY",
          narrative: "Spent $150 on tacos and cold drinks under the moonlight. The most memorable night of the entire trip.",
          resourceDelta: { balance: -150, sanity: 40 },
        },
      },
    },

    {
      roundIndex: 3,
      category: "night_out",
      difficulty: "spicy",
      prompt: "At 3:30 AM, the squad rolls into the high-limit gaming floor at the Seminole Hard Rock. You have $1,200 remaining in the group kitty.",
      question: "What is the casino game plan?",
      highlightedText: "High-Limit Casino",
      discussionDurationSeconds: 90,
      options: [
        {
          id: "A",
          label: "Bet all remaining $1,200 on Red in Roulette",
          subtitle: "Double or nothing. Hero or absolute zero.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Split into small $25 chips and play arcade slots",
          subtitle: "Low risk entertainment and free drinks from cocktail servers.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Designate the most confident friend to play $100-hand Blackjack",
          subtitle: "Put all group faith into one 'card counter' buddy.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Refuse to gamble, hit the 24h noodle bar, and watch the high rollers",
          subtitle: "Zero financial risk. Pure observational luxury.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "BALL DROPS ON BLACK 26",
          narrative: "Dead silence as the ivory ball dropped into Black 26. Total squad wipeout. The kitty hit $0.",
          resourceDelta: { balance: -1200, sanity: -40 },
          triggerChaosMoment: true,
          chaosMomentMessage: "Complete financial wipeout! Scapegoat prosecution begins!",
        },
        B: {
          title: "SLOT MACHINE SUNRISE",
          narrative: "Hit a lucky bonus spin and won $650! Covered tomorrow's brunch and Uber rides.",
          resourceDelta: { balance: 650, sanity: 15 },
        },
        C: {
          title: "BLACKJACK BUST",
          narrative: "Your 'expert' friend doubled down on 12 and caught a Queen. He refuses to make eye contact.",
          resourceDelta: { balance: -1200, sanity: -30 },
        },
        D: {
          title: "NOODLE BAR CONNOISSEURS",
          narrative: "Ate steaming bowls of gourmet ramen while watching millionaires lose fortunes. Zero dollars lost.",
          resourceDelta: { balance: -100, sanity: 25 },
        },
      },
    },

    {
      roundIndex: 4,
      category: "night_out",
      difficulty: "spicy",
      prompt: "4:30 AM outside a famous 24-hr Cuban bakery in Little Havana. Someone discovers their wallet and the Airbnb master keycard are GONE! The bakery patio is packed with partygoers eating hot croquetas.",
      question: "How does the squad recover the lost wallet and keycard?",
      highlightedText: "4:30 AM Keycard Crisis",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Retrace steps through the last 3 clubs on foot while sober friends stand guard",
          subtitle: "Exhausting 3-mile walk through the South Beach nightlife strip.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Offer the Cuban bakery crowd a $100 bounty if anyone finds it",
          subtitle: "Put 40 late-night locals on high alert for your wallet.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Wake up the Airbnb host with 12 phone calls and pay a $250 lock-out fee",
          subtitle: "Face the host's 4:30 AM fury, but guarantee entry.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Sleep on the beach chairs under the lifeguard tower until morning",
          subtitle: "Free, cinematic beach sunrise sleep.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE CLUB RETRACE MIRACLE",
          narrative: "The coat check attendant at the second lounge had your wallet in the lost-and-found! Keycard safely inside!",
          resourceDelta: { sanity: 20, chaosScore: 15 },
        },
        B: {
          title: "CROQUETA BOUNTY SUCCESS",
          narrative: "A friendly bouncer found it wedged in the outdoor booth! You paid the $100 and treated the patio to espresso!",
          resourceDelta: { balance: -100, sanity: 30, chaosScore: 10 },
        },
        C: {
          title: "THE HOSTILE AIRBNB HOST",
          narrative: "Host arrived at 5:15 AM in a bathrobe glaring daggers. Charged $250 on the app and promised a brutal review.",
          resourceDelta: { balance: -250, sanity: -30, chaosScore: 35 },
        },
        D: {
          title: "LIFEGUARD TOWER REVOLT",
          narrative: "Beach patrol woke you up with megaphones at 6:15 AM. You have sand in every pocket, but sunrise was gorgeous.",
          resourceDelta: { sanity: 15, chaosScore: 30 },
        },
      },
    },

    {
      roundIndex: 5,
      category: "night_out",
      difficulty: "spicy",
      prompt: "Afternoon Day 2: Rented 3 high-speed jet skis in Biscayne Bay! While showing off doing donut wakes at 45 MPH, someone loses steering and clips the swim platform of a $20M docked mega-yacht! Two security guards step out onto the deck with cameras.",
      question: "How does the squad resolve the mega-yacht collision?",
      highlightedText: "Mega-Yacht Jet Ski Collision",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Apologize sincerely, show insurance, and offer to buff out the fiberglass scratch",
          subtitle: "Honest, calm maritime diplomacy.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Full throttle 50 MPH jet ski escape back to the rental marina",
          subtitle: "Fast & Furious water chase. Abandon the jet skis at the dock.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Claim your friend was stung by a Portuguese man o' war jellyfish and lost control",
          subtitle: "Medical emergency defense on the open water.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Charm the yacht owner with cold drinks and compliment his vessel",
          subtitle: "Turn a disaster into an invite to the yacht afterparty.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "YACHT CAPTAIN SETTLEMENT",
          narrative: "The captain checked the teak finish: 'It's just a scuff. Pay $400 for our deckhand to polish it and we're good.'",
          resourceDelta: { balance: -400, sanity: 20, chaosScore: 10 },
        },
        B: {
          title: "HARBOR PATROL CHASE",
          narrative: "Harbor police were waiting at the marina dock! $1,200 fine and the jet ski deposit was obliterated!",
          resourceDelta: { balance: -1200, sanity: -40, chaosScore: 70 },
          triggerChaosMoment: true,
          chaosMomentMessage: "HARBOR POLICE CAUGHT YOU AT THE DOCK! MASSIVE FINE!",
        },
        C: {
          title: "THE JELLYFISH HOAX",
          narrative: "The crew actually handed down ice and antiseptic ointment! No charges filed, but you had to fake itching for 2 hours.",
          resourceDelta: { sanity: 25, chaosScore: 25 },
        },
        D: {
          title: "FROM SCRATCH TO VIP GUESTS",
          narrative: "The tech billionaire owner laughed: 'You guys have guts.' He handed down cold champagne and invited you on board!",
          isAbsurd: true,
          resourceDelta: { sanity: 45, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "YOU GOT INVITED ABOARD THE $20M MEGA-YACHT!",
        },
      },
    },

    {
      roundIndex: 6,
      category: "night_out",
      difficulty: "spicy",
      prompt: "Sunrise at 6:30 AM. A promoter invites you to an ultra-exclusive afterparty in a Star Island mansion with a celebrity DJ. Checkout is 10:00 AM, bags are unpacked, and the villa looks like a tornado hit it.",
      question: "Do you send it to the Star Island mansion or clean the villa?",
      highlightedText: "Star Island Mansion Afterparty",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Send it to the Star Island rooftop afterparty! Sleep when you're 80",
          subtitle: "Head straight to Star Island in sunglasses. Figure out packing later.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Head back to the villa, pack luggage, and hydrate responsibly",
          subtitle: "Iced cold brew and guaranteed flight survival.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Split the squad: Party animals go to Star Island, responsible ones pack",
          subtitle: "Divide and conquer, meet at airport Gate D4.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Hire an emergency cleaning crew for $300 while you all hit the afterparty",
          subtitle: "Outsource adult responsibilities with cash.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "STAR ISLAND GLORY",
          narrative: "Infinity pool overlooking Biscayne Bay with house music playing! Reached the airport with sand in shoes and unforgettable memories!",
          resourceDelta: { sanity: 40, balance: -300 },
        },
        B: {
          title: "DISCIPLINED SURVIVORS",
          narrative: "Everyone showered, packed, and boarded with zero stress. Functional adults prevailed.",
          resourceDelta: { sanity: 15 },
        },
        C: {
          title: "AIRPORT MISS DISASTER",
          narrative: "The afterparty crew hit causeway traffic and missed boarding by 6 minutes! Cost $1,200 to rebook!",
          resourceDelta: { balance: -1200, sanity: -35 },
          triggerChaosMoment: true,
          chaosMomentMessage: "Missed flights! Blame the afterparty instigator!",
        },
        D: {
          title: "THE CLEANING CREW MIRACLE",
          narrative: "The emergency crew left the villa spotless! You got your full deposit back AND partied until noon!",
          resourceDelta: { balance: -300, sanity: 35, chaosScore: 20 },
        },
      },
    },

    {
      roundIndex: 7,
      category: "night_out",
      difficulty: "spicy",
      prompt: "VILLA INSPECTION STANDOFF: The Airbnb superhost arrives with a clipboard. He spots wine stains on the outdoor sectional, an empty tequila bottle floating in the hot tub, and accuses you of hosting an unauthorized party. He threatens to forfeit the entire $2,500 security deposit.",
      question: "How does the squad defend the $2,500 security deposit?",
      highlightedText: "$2,500 Airbnb Deposit War",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Show timestamped check-in photos proving the stains were already there",
          subtitle: "Forensic photographic defense. Catch the host in bad faith.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Offer $400 cash on the spot for professional carpet cleaning",
          subtitle: "Quick settlement before he escalates to Airbnb support.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Blame it on a raccoon that allegedly climbed through the patio screen",
          subtitle: "'Sir, South Florida wildlife is completely out of control.'",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Threaten to leave a 1-star review exposing his hidden backyard cameras",
          subtitle: "Mutually assured destruction: Terms of Service nuclear strike.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "FORENSIC VICTORY",
          narrative: "The photos had metadata timestamps! The host turned red, apologized, and released the entire $2,500 deposit on the spot!",
          resourceDelta: { balance: 2500, sanity: 35, chaosScore: 10 },
        },
        B: {
          title: "THE $400 SETTLEMENT",
          narrative: "He took the $400 cash and signed off on zero further damages. Lost $400, but salvaged the other $2,100.",
          resourceDelta: { balance: -400, sanity: 15, chaosScore: 15 },
        },
        C: {
          title: "THE RACOON DEFENSE BUSTED",
          narrative: "The host deadpanned: 'Raccoons don't drink Casamigos.' He billed the card for an extra $800 deep-clean fee!",
          resourceDelta: { balance: -800, sanity: -30, chaosScore: 40 },
        },
        D: {
          title: "THE CAMERA BLACKMAIL WIN",
          narrative: "The host went pale because undisclosed exterior cameras violate city rental ordinances! He refunded everything within 3 minutes!",
          isAbsurd: true,
          resourceDelta: { balance: 2500, sanity: 40, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "CAMERA POLICY BLACKMAIL WORKED! 100% DEPOSIT REFUNDED!",
        },
      },
    },

    {
      roundIndex: 8,
      category: "night_out",
      difficulty: "spicy",
      prompt: "GRAND FINALE AT MIAMI INTERNATIONAL AIRPORT! Sitting at the departure gate in aviator sunglasses, someone pulls up the group credit card app. The entire 4-day trip came out under budget with $1,800 left! Suddenly, an announcement blares: 'Flight to New York / London delayed 6 hours due to weather.'",
      question: "How does the squad seal the final triumph of Miami Spring Break?",
      highlightedText: "Flight Delayed: $1,800 Left",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Buy day-passes to the American Express Centurion Lounge and feast on caviar & martinis",
          subtitle: "Unlimited gourmet food, luxury showers, airport royalty.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Take an Uber back to South Beach for one final sunset swim and fish tacos",
          subtitle: "Squeeze every last second of Florida sunshine.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Lock the $1,800 surplus straight into the squad's summer trip fund",
          subtitle: "Pragmatic legends: Next trip to Cabo is already half paid for.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Buy everyone matching designer sunglasses at duty-free for the flight home",
          subtitle: "Walk onto the plane looking like an international music group.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "VIP AIRPORT ROYALS",
          narrative: "Lounging in velvet armchairs drinking top-shelf cocktails while other passengers slept on floors! Conquered the delay in peak comfort!",
          resourceDelta: { sanity: 50, chaosScore: 20 },
        },
        B: {
          title: "THE FINAL SUNSET SWIM",
          narrative: "Golden hour waves and fresh lime fish tacos! Boarded the plane with damp hair and huge smiles. Unbeatable ending!",
          resourceDelta: { sanity: 45, chaosScore: 30 },
        },
        C: {
          title: "CABO FUND LOCKED",
          narrative: "Surplus transferred to high-yield savings! The group chat is already buzzing about the next adventure!",
          resourceDelta: { balance: 1800, sanity: 40, chaosScore: -10 },
        },
        D: {
          title: "DUTY-FREE ROCKSTARS",
          narrative: "Matching Tom Ford aviators for the whole squad! The flight attendants thought you were a touring DJ crew! Peak flex!",
          isAbsurd: true,
          resourceDelta: { sanity: 50, chaosScore: 80 },
          triggerChaosMoment: true,
          chaosMomentMessage: "MATCHING DESIGNER AVIATORS! PEAK MIAMI TRIUMPH!",
        },
      },
    },
  ],
};

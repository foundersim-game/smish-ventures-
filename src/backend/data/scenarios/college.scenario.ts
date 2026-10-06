import { ScenarioDefinition } from "../../../core/types/scenario.types";

export const COLLEGE_SCENARIO: ScenarioDefinition = {
  id: "college_chaos",
  title: "CAMPUS CHAOS: DORM & GREEK LIFE CONFESSIONS",
  category: "friends",
  tagline: "Honor board hearings, missing treasury cash, and 3 AM dorm raids.",
  description: "Relive the chaotic pressure of university campus life where an exam study guide leaked on Discord, $2,500 in student treasury went missing, and campus safety is knocking on the dorm door.",
  estimatedMinutes: "25 - 35 min",
  recommendedPlayers: "4 - 10 players",
  totalRounds: 8,
  isPremium: false,
  priceTier: "FREE",
  vibeTag: "🎓 GUILTY SECRETS",
  vibeColor: "purple",
  goodFor: "College alumni, fraternity/sorority squads, batchmate reunions, university friends.",
  features: [
    "8 connected campus storyline rounds",
    "Academic Honor Board tribunals",
    "Campus safety & noise violation raids",
    "Dorm politics and backstabbing trials",
    "Secret saboteur missions across rounds",
    "Brutal end-game blame receipts",
  ],
  initialResourceState: {
    balance: 3000,
    sanity: 100,
    chaosScore: 20,
  },
  rounds: [
    {
      roundIndex: 1,
      category: "friends",
      difficulty: "normal",
      prompt: "The Dean of Academic Integrity catches leaked midterm questions circulating on a private campus Discord. The board threatens to fail the entire lecture hall unless the leaker confesses by 5 PM.",
      question: "What is the group strategy to handle the Honor Board?",
      highlightedText: "Midterm Exam Leak",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "The leaker confesses alone to save the rest of the class",
          subtitle: "Take academic probation on the chin like an honorable martyr.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Everyone stays completely silent: They can't fail 80 students",
          subtitle: "Collective solidarity. Don't say a single word.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Blame it on an exchange student who already flew back overseas",
          subtitle: "The phantom scapegoat maneuver.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Claim the Discord was a collaborative study group protected by student charter",
          subtitle: "Pre-law student defense: drown them in campus bylaws.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE CAMPUS MARTYR",
          narrative: "One brave hero took community service hours. The class pooled money to buy them free takeout coffee for the entire semester!",
          resourceDelta: { sanity: 20, chaosScore: 10 },
        },
        B: {
          title: "STONEWALL OF SILENCE",
          narrative: "Nobody cracked. The board had no concrete proof and was forced to schedule a rewritten open-book makeup exam!",
          resourceDelta: { sanity: 25, chaosScore: 15 },
        },
        C: {
          title: "GHOST SCAPEGOAT",
          narrative: "The board closed the case believing the phantom account belonged to the departed exchange student. Clean escape.",
          resourceDelta: { sanity: 15, chaosScore: 25 },
        },
        D: {
          title: "CAMPUS LAWYER VICTORY",
          narrative: "The 12-page legal rebuttal confused the administration so badly they dropped all disciplinary charges!",
          isAbsurd: true,
          resourceDelta: { sanity: 30, chaosScore: 40 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE SQUAD OUTSMARTED THE ENTIRE ACADEMIC BOARD!",
        },
      },
    },

    {
      roundIndex: 2,
      category: "friends",
      difficulty: "spicy",
      prompt: "At 2:30 AM, an off-campus house party gets raided by Campus Safety and local police following noise complaints. There's red cups everywhere, a blown speaker, and someone parked a motorized scooter in the kitchen.",
      question: "How does the squad avoid a massive campus citation fine?",
      highlightedText: "2:30 AM Party Raid",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Cut the main breaker, yell 'FIRE DRILL', and scatter into the back alley",
          subtitle: "Tactical blackout evacuation.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "House lease-holders step forward calmly and take a $400 noise citation",
          subtitle: "Adult responsibility. Squad reimburses tomorrow.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Pretend it's a dramatic rehearsal for the University Theater troupe",
          subtitle: "'Officers, this is an immersive modern Shakespeare performance!'",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Clean the entire living room in 90 seconds while officers wait outside",
          subtitle: "Record-speed trash bagging: 'Officers, what party?'",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "MIDNIGHT ALLEY SPRINT",
          narrative: "Breaker flipped! 40 people vanished through fences into the night. Zero citations recorded!",
          resourceDelta: { sanity: -15, chaosScore: 55 },
          triggerChaosMoment: true,
          chaosMomentMessage: "TACTICAL BLACKOUT ESCAPE ACROSS 4 BACKYARDS!",
        },
        B: {
          title: "THE CIVIL NOISE CITATION",
          narrative: "Officers appreciated the calm cooperation. Handed down a single $400 ticket and told everyone to go to sleep.",
          resourceDelta: { balance: -400, sanity: 15, chaosScore: 10 },
        },
        C: {
          title: "THE THEATER TROUPE BLUFF",
          narrative: "The officer deadpanned: 'If this is Shakespeare, it's terrible.' Fined $600 for noise plus a lecture on dramatics.",
          resourceDelta: { balance: -600, sanity: -20, chaosScore: 40 },
        },
        D: {
          title: "WORLD RECORD TRASH SPRINT",
          narrative: "By the time the door opened, people were calmly sitting around a board game with tea. The officers were thoroughly baffled!",
          resourceDelta: { sanity: 30, chaosScore: 20 },
        },
      },
    },

    {
      roundIndex: 3,
      category: "friends",
      difficulty: "spicy",
      prompt: "$1,800 in cash collected for the campus charity gala went missing from the organizing committee's locked desk. Only 4 squad members held the desk key.",
      question: "How do you resolve the missing charity treasury?",
      highlightedText: "$1,800 Missing Treasury",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Host an impromptu campus bake-sale and DJ fundraiser to replace the cash",
          subtitle: "Work through the night to cover the balance before inspection.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Call a closed-door 4-person tribunal and check bank transaction alerts",
          subtitle: "No one leaves the room until the rogue spender confesses.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "All 4 members quietly chip in $450 out of personal savings to cover it",
          subtitle: "Avoid administrative scandal, preserve friendship forever.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Blame it on an administrative accounting error on the official university portal",
          subtitle: "Bury it under bureaucratic confusion.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "EMERGENCY FUNDRAISER MIRACLE",
          narrative: "The midnight fundraiser made $2,200! Covered the shortfall and left $400 in surplus for pizza!",
          resourceDelta: { balance: 400, sanity: 25, chaosScore: 30 },
        },
        B: {
          title: "THE 4-WAY INTERROGATION",
          narrative: "Turned out someone accidentally took the cash envelope home in their hoodie pocket! Relieved hugs and endless teasing.",
          resourceDelta: { sanity: 20, chaosScore: 25 },
        },
        C: {
          title: "QUIET BAILOUT",
          narrative: "Covered the $1,800 out of pocket ($450 each). Quiet, efficient, but an unspoken tension lingers.",
          resourceDelta: { balance: -1800, sanity: -10, chaosScore: 10 },
        },
        D: {
          title: "BUREAUCRATIC SLEIGHT OF HAND",
          narrative: "Submitted an amendment form for 'misallocated campus funds.' The student accounts department rubber-stamped it without looking!",
          resourceDelta: { sanity: 15, chaosScore: 45 },
        },
      },
    },

    {
      roundIndex: 4,
      category: "friends",
      difficulty: "normal",
      prompt: "It's Rivalry Week! At 3 AM, a rival fraternity steals your dorm's historic bronze mascot statue and mounts it on top of the campus bell tower. The squad is assembling on the quad lawn.",
      question: "How do you retaliate against the rival fraternity?",
      highlightedText: "Mascot Heist Retaliation",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Midnight stealth mission: Scale the bell tower and reclaim the mascot",
          subtitle: "Harnesses, flashlights, Mission Impossible campus extraction.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Fill their fraternity chapter house lawn with 5,000 plastic pink flamingos",
          subtitle: "Non-destructive, psychological, and utterly hilarious flex.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Challenge their entire chapter to a high-noon quad dodgeball tournament",
          subtitle: "Public glory: winner takes the mascot and campus bragging rights.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Report the theft directly to campus facilities and let them get fined $2,500",
          subtitle: "Cold, calculated administrative revenge.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "BELL TOWER CAT BURGLARS",
          narrative: "You scaled the maintenance ladder, unbolted the mascot, and rappelled down under moonlight! Campus legends born overnight!",
          resourceDelta: { sanity: 30, chaosScore: 50 },
          triggerChaosMoment: true,
          chaosMomentMessage: "MASCOT RECLAIMED FROM THE BELL TOWER! TOTAL GLORY!",
        },
        B: {
          title: "THE FLAMINGO ARMY",
          narrative: "5,000 pink plastic flamingos blanketed their yard! Their president walked out speechless and surrendered with laughter on the campus quad!",
          resourceDelta: { balance: -350, sanity: 35, chaosScore: 25 },
        },
        C: {
          title: "THE DODGEBALL RECKONING",
          narrative: "600 students crowded the quad! Your squad swept the 3rd set with a diving catch! The mascot was returned in triumph!",
          resourceDelta: { sanity: 40, chaosScore: 20 },
        },
        D: {
          title: "THE BUREAUCRATIC CRUSH",
          narrative: "Facilities levied a $2,500 crane removal fee on their fraternity. Effective, but the whole campus labeled your squad snitches.",
          resourceDelta: { sanity: -20, chaosScore: -10 },
        },
      },
    },

    {
      roundIndex: 5,
      category: "friends",
      difficulty: "spicy",
      prompt: "DORM DISASTER: The shared suite refrigerator is at war. Someone drank $60 worth of cold brew, ate an artisanal birthday cheesecake, and left passive-aggressive Post-it notes claiming: 'Fridge is communal property.'",
      question: "How does the suite resolve the Refrigerator Civil War?",
      highlightedText: "Refrigerator Civil War",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Padlock individual fridge shelves with industrial bicycle U-locks",
          subtitle: "Maximum fortress security. Nobody eats unless they hold a physical key.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Bait the thief with a decoy cake packed with extreme ghost-pepper hot sauce",
          subtitle: "Forensic sting operation: The thief reveals themselves coughing.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Establish a mandatory 'Sunday Communal Meal' cooked by the thief",
          subtitle: "Turn resentment into shared groceries and peace treaties.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Drag the refrigerator into the hallway and declare the kitchen permanently closed",
          subtitle: "Total scorched-earth anarchy.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE FORTRESS FRIDGE",
          narrative: "The fridge looked like a maximum security prison. It took 4 minutes of key unlocking to grab milk, but zero items were stolen!",
          resourceDelta: { sanity: 15, chaosScore: 20 },
        },
        B: {
          title: "GHOST PEPPER EXTRACTION",
          narrative: "At 1:45 AM, someone sprinted to the bathroom chugging whole milk coughing fire! Thief caught red-handed with zero room to deny!",
          resourceDelta: { sanity: 30, chaosScore: 45 },
          triggerChaosMoment: true,
          chaosMomentMessage: "THE FRIDGE THIEF WAS CAUGHT RED-HANDED!",
        },
        C: {
          title: "THE PEACE TACO FEAST",
          narrative: "The guilty roommate apologized and cooked homemade carnitas tacos for the whole floor. Harmony restored!",
          resourceDelta: { sanity: 35, chaosScore: -10 },
        },
        D: {
          title: "HALLWAY MONUMENT",
          narrative: "The Resident Advisor fined the suite $200 for fire code obstruction. Now you all order UberEats twice a day.",
          resourceDelta: { balance: -200, sanity: -25, chaosScore: 50 },
        },
      },
    },

    {
      roundIndex: 6,
      category: "friends",
      difficulty: "spicy",
      prompt: "Spring Break Road Trip! Driving a beat-up 12-passenger rental van through the desert, the alternator dies 40 miles outside Vegas. Zero cell reception. 95-degree heat. You have 3 gallons of water.",
      question: "What is the survival game plan?",
      highlightedText: "Desert Breakdown: No Signal",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Send 2 marathon runners to jog 10 miles toward the nearest highway rest stop",
          subtitle: "Endurance heroics before sundown.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Pop the hood, put on matching Hawaiian shirts, and start an acoustic jam session",
          subtitle: "Keep squad morale high while waiting for a passing trucker.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Hike up the highest rocky bluff with an iPhone taped to a broom handle for signal",
          subtitle: "Search for 1 bar of 5G to call roadside towing.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Offer $200 cash and your cooler of ice to the first pickup truck that stops",
          subtitle: "Cold hard cash gets you towed to civilization.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE MARATHON RESCUE",
          narrative: "They made it 6 miles before a park ranger truck picked them up and came back for the squad! True legends!",
          resourceDelta: { sanity: 25, chaosScore: 30 },
        },
        B: {
          title: "ROADSIDE WOODSTOCK",
          narrative: "A tour bus of vintage RV campers pulled over, joined the jam session, gave you cold melon, and towed the van!",
          resourceDelta: { sanity: 40, chaosScore: 15 },
        },
        C: {
          title: "ONE BAR OF HOPE",
          narrative: "You held the broomstick steady for 4 sweaty minutes. The roadside dispatch ping went through! Flatbed truck arrived in 40 minutes!",
          resourceDelta: { sanity: 20, chaosScore: 10 },
        },
        D: {
          title: "THE CASH BAILOUT",
          narrative: "A lifted Ford F-250 pulled you right into a diner parking lot. Spent $200, but saved 5 hours of misery.",
          resourceDelta: { balance: -200, sanity: 30, chaosScore: 5 },
        },
      },
    },

    {
      roundIndex: 7,
      category: "friends",
      difficulty: "spicy",
      prompt: "The night before the final graduation thesis defense, an unhinged storm causes a campus-wide blackout. The backup generators fail. All laptops are at 12% battery, and the library servers are down.",
      question: "How do you deliver the final thesis presentations tomorrow at 9 AM?",
      highlightedText: "Finals Blackout: 12% Battery",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Siphon power from a squad member's hybrid car battery using an inverter cable",
          subtitle: "High-voltage MacGyver electrical engineering.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Switch to a handwritten posterboard presentation with colored markers and flashlights",
          subtitle: "Classic vintage science fair charm. Charisma over slides.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Squad camps out at the 24-hr diner downtown using their counter outlets and coffee",
          subtitle: "Work through the night eating french fries and pancakes.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Unanimously petition the faculty dean for a 24-hour university-wide extension",
          subtitle: "Solidarity petition: Act of God clause.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE HYBRID POWER GRID",
          narrative: "The Prius engine purred all night charging 6 laptops in the driveway! Presentations completed with 100% battery!",
          resourceDelta: { sanity: 30, chaosScore: 35 },
        },
        B: {
          title: "THE ANALOG GENIUSES",
          narrative: "The professors were blown away by the energetic marker posterboard presentation! Awarded highest honors for adaptability!",
          resourceDelta: { sanity: 45, chaosScore: 20 },
          triggerChaosMoment: true,
          chaosMomentMessage: "ANALOG POSTERBOARD GENIUS! HIGHEST HONORS WON!",
        },
        C: {
          title: "DINER ALL-NIGHTER",
          narrative: "Finished the thesis slides by 5 AM fueled by 8 pots of coffee! Sleep deprived, but presentations locked!",
          resourceDelta: { balance: -80, sanity: 15, chaosScore: 25 },
        },
        D: {
          title: "DEAN'S EXTENSION GRANTED",
          narrative: "The university provost sent a campus alert pushing all deadlines by 48 hours. Everyone slept for 14 straight hours.",
          resourceDelta: { sanity: 50, chaosScore: -15 },
        },
      },
    },

    {
      roundIndex: 8,
      category: "friends",
      difficulty: "spicy",
      prompt: "GRAND FINALE AT COMMENCEMENT! Caps and gowns on. The keynote billionaire speaker cancels at the last minute. The University President rushes to your squad backstage: 'You legends have caused all the chaos on this campus for 4 years... Go out on that stage and deliver the closing commencement address!'",
      question: "What is your squad's graduation commencement address?",
      highlightedText: "Live Commencement Speech",
      discussionDurationSeconds: 60,
      options: [
        {
          id: "A",
          label: "Deliver a heartfelt, emotional speech honoring true friendship over perfection",
          subtitle: "Make 5,000 parents, faculty, and students cry happy tears.",
          badgeColor: "pink",
        },
        {
          id: "B",
          label: "Drop an unhinged comedic roast of the university dining hall and parking tickets",
          subtitle: "Standup comedy special. Leave the stadium roaring in laughter.",
          badgeColor: "blue",
        },
        {
          id: "C",
          label: "Announce a fake AI startup and invite the entire graduating class to invest $10",
          subtitle: "Crowdfund a $50,000 graduation afterparty right from the podium.",
          badgeColor: "yellow",
        },
        {
          id: "D",
          label: "Start a massive synchronized stadium wave and lead a crowd-surfing exit",
          subtitle: "Rockstar graduation finale across 5,000 cheering students.",
          badgeColor: "purple",
        },
      ],
      consequences: {
        A: {
          title: "THE TEARFUL COMMENCEMENT TRIUMPH",
          narrative: "Standing ovation! The President handed you gold medals, and families were dabbing tears. The greatest collegiate sendoff in history!",
          resourceDelta: { sanity: 50, chaosScore: 10 },
        },
        B: {
          title: "THE LEGENDARY COMEDY ROAST",
          narrative: "The stadium erupted into hysterical laughter! Even the Dean was wiping tears of laughter! Clip went viral with 3M views!",
          resourceDelta: { sanity: 45, chaosScore: 60 },
          triggerChaosMoment: true,
          chaosMomentMessage: "VIRAL COMMENCEMENT SPEECH! 3 MILLION VIEWS!",
        },
        C: {
          title: "THE GRADUATION WAR CHEST",
          narrative: "Students actually Venmo'd $14,000 in 8 minutes! You funded an open-bar celebration for the entire class!",
          resourceDelta: { balance: 14000, sanity: 40, chaosScore: 80 },
        },
        D: {
          title: "CROWD SURFING OUT INTO THE WORLD",
          narrative: "Carried across the football field by 500 classmates tossing caps into the sky! Conquered college, ready for the world!",
          isAbsurd: true,
          resourceDelta: { sanity: 50, chaosScore: 100 },
          triggerChaosMoment: true,
          chaosMomentMessage: "CROWD SURFED OFF THE STAGE! PEAK CAMPUS VICTORY!",
        },
      },
    },
  ],
};

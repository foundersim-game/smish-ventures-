import { PlayerSession } from "../types/player.types";
import { RoundVoteResolution } from "../types/vote.types";
import { RoundReceiptsSummary } from "../types/influence.types";
import { SecretMission, MissionEvaluationResult } from "../types/mission.types";
import { ScenarioRound, ScenarioOption } from "../types/scenario.types";

export class MissionEngine {
  /**
   * Generates secret missions for selected players for a given round.
   */
  public static generateMissions(
    roundIndex: number,
    players: PlayerSession[],
    round: ScenarioRound
  ): Map<string, SecretMission> {
    const missions = new Map<string, SecretMission>();

    if (players.length < 2) return missions;

    // Pick 1 to 3 players randomly to receive a secret mission
    const count = Math.min(Math.max(1, Math.floor(players.length / 2)), 3);
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const assignedPlayers = shuffled.slice(0, count);

    const availableOptionIds = round.options.map((o: ScenarioOption) => o.id);

    const missionTemplates = [
      {
        title: "THE SABOTEUR",
        badge: "🕵️",
        objective: (targetOpt: string) => `Steer the group to pick Option ${targetOpt}.`,
        hint: "Argue subtly that this choice is the safest or funniest option without making it obvious.",
        conditionType: "winner_is_option" as const,
        rewardPoints: 200,
      },
      {
        title: "THE PUPPETEER",
        badge: "🎭",
        objective: () => "Convince at least 1 person to flip their vote to your choice.",
        hint: "Target someone who seemed indecisive in the initial vote and press your points.",
        conditionType: "influence_count_min" as const,
        rewardPoints: 250,
      },
      {
        title: "THE LONE WOLF",
        badge: "🐺",
        objective: () => "Be the only player in the room to vote differently in the final vote.",
        hint: "Listen to the majority opinion, then secretly lock the opposite choice at the last second.",
        conditionType: "be_lone_dissenter" as const,
        rewardPoints: 250,
      },
      {
        title: "THE CHAMELEON",
        badge: "🦎",
        objective: () => "Change your final vote to match the winning choice.",
        hint: "Go with the flow. If the group leans another way, ride the wave and switch sides.",
        conditionType: "flip_vote_to_winner" as const,
        rewardPoints: 150,
      },
      {
        title: "THE FALL GUY",
        badge: "🎯",
        objective: () => "Get nominated for Blame by at least 1 player at the end of the round.",
        hint: "Be loudly obnoxious or defend a controversial stance so people suspect you.",
        conditionType: "get_blamed_min" as const,
        rewardPoints: 200,
      },
      {
        title: "THE IRON WALL",
        badge: "🧱",
        objective: () => "Stick firmly to your initial decision and do not switch, no matter what.",
        hint: "Defend your ground firmly through all 60 seconds of discussion.",
        conditionType: "stay_stubborn" as const,
        rewardPoints: 150,
      },
    ];

    // Randomly shuffle available mission templates so every player and round gets varied secret missions
    const shuffledTemplates = [...missionTemplates].sort(() => Math.random() - 0.5);

    assignedPlayers.forEach((p, idx) => {
      const template = shuffledTemplates[idx % shuffledTemplates.length];
      // Pick a random target option from the round's options
      const targetOption = availableOptionIds[Math.floor(Math.random() * availableOptionIds.length)] || "A";

      const mission: SecretMission = {
        id: `mission_${roundIndex}_${p.id}`,
        roundIndex,
        title: template.title,
        badge: template.badge,
        objective: typeof template.objective === "function" ? template.objective(targetOption) : template.objective,
        secretHint: template.hint,
        rewardPoints: template.rewardPoints,
        conditionType: template.conditionType,
        targetOptionId: targetOption,
        minCount: 1,
        assignedPlayerId: p.id,
      };

      missions.set(p.id, mission);
    });

    return missions;
  }

  /**
   * Evaluates if players completed their secret missions.
   */
  public static evaluateMissions(
    missions: Map<string, SecretMission>,
    players: PlayerSession[],
    resolution: RoundVoteResolution,
    receipts?: RoundReceiptsSummary,
    blameVotes?: Record<string, string> // accuser -> blamed
  ): MissionEvaluationResult[] {
    const results: MissionEvaluationResult[] = [];

    missions.forEach((mission, playerId) => {
      const player = players.find((p) => p.id === playerId);
      if (!player) return;

      let isSuccess = false;
      let summaryMessage = "";

      switch (mission.conditionType) {
        case "winner_is_option": {
          isSuccess = resolution.winningOptionId === mission.targetOptionId;
          summaryMessage = isSuccess
            ? `Mastermind! Successfully steered the group to Option ${mission.targetOptionId}!`
            : `Cover blown! Tried to steer the group to Option ${mission.targetOptionId}, but the room didn't buy it.`;
          break;
        }

        case "influence_count_min": {
          const userReceipt = receipts?.receipts.find((r) => r.playerId === playerId);
          const influenceCount = userReceipt?.peopleInfluencedCount || 0;
          isSuccess = influenceCount >= (mission.minCount || 1);
          summaryMessage = isSuccess
            ? `Successfully influenced ${influenceCount} player(s)!`
            : `Failed: Did not influence anyone to change their vote.`;
          break;
        }

        case "be_lone_dissenter": {
          const myVote = player.finalVoteOptionId;
          const otherVotes = players
            .filter((p) => p.id !== playerId && p.finalVoteOptionId)
            .map((p) => p.finalVoteOptionId);
          // Dissenter: nobody else voted for what this player voted for
          const matchesAnyOther = otherVotes.some((v) => v === myVote);
          isSuccess = Boolean(myVote) && !matchesAnyOther && otherVotes.length > 0;
          summaryMessage = isSuccess
            ? "Stood completely alone as the lone dissenter!"
            : "Failed: Other players voted for the same option.";
          break;
        }

        case "flip_vote_to_winner": {
          const changedMind = player.initialVoteOptionId !== player.finalVoteOptionId;
          const votedWinner = player.finalVoteOptionId === resolution.winningOptionId;
          isSuccess = changedMind && votedWinner;
          summaryMessage = isSuccess
            ? `Switched sides and rode the winning wave to Option ${resolution.winningOptionId}!`
            : "Failed: Did not switch to the winning choice.";
          break;
        }

        case "get_blamed_min": {
          let blamesReceived = 0;
          if (blameVotes) {
            blamesReceived = Object.values(blameVotes).filter((b) => b === playerId).length;
          }
          isSuccess = blamesReceived >= (mission.minCount || 1);
          summaryMessage = isSuccess
            ? `Took the heat! Accused by ${blamesReceived} player(s).`
            : "Failed: Flew under the radar and nobody blamed you.";
          break;
        }

        case "stay_stubborn": {
          isSuccess =
            Boolean(player.initialVoteOptionId) &&
            player.initialVoteOptionId === player.finalVoteOptionId;
          summaryMessage = isSuccess
            ? "Unmovable! Held your ground through the chaos."
            : "Failed: You folded and switched your vote.";
          break;
        }

        default:
          isSuccess = false;
          summaryMessage = "Mission expired.";
      }

      mission.isAccomplished = isSuccess;

      results.push({
        playerId,
        playerName: player.name,
        mission,
        isSuccess,
        bonusPoints: isSuccess ? mission.rewardPoints : 0,
        summaryMessage,
      });
    });

    return results;
  }
}

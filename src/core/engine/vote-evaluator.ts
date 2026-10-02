import { PlayerSession } from "../types/player.types";
import { ScenarioOption } from "../types/scenario.types";
import {
  MindChangeRecord,
  RoundVoteResolution,
  VoteTallyEntry,
} from "../types/vote.types";

export class VoteEvaluator {
  /**
   * Resolves final votes, determines winning option, detects mind changes and vote retention.
   */
  public static evaluateRound(
    roundIndex: number,
    options: ScenarioOption[],
    players: PlayerSession[]
  ): RoundVoteResolution {
    const validPlayers = players.filter((p) => p.connected !== false && Boolean(p.finalVoteOptionId));
    const totalVotes = validPlayers.length;

    // Initialize tally
    const voteTally: Record<string, VoteTallyEntry> = {};
    for (const opt of options) {
      voteTally[opt.id] = {
        optionId: opt.id,
        voteCount: 0,
        percentage: 0,
        voterPlayerIds: [],
      };
    }

    const mindChanges: MindChangeRecord[] = [];
    const keptVotePlayerIds: string[] = [];

    for (const player of validPlayers) {
      const finalVote = player.finalVoteOptionId!;
      const initialVote = player.initialVoteOptionId;

      if (voteTally[finalVote]) {
        voteTally[finalVote].voteCount += 1;
        voteTally[finalVote].voterPlayerIds.push(player.id);
      }

      if (initialVote && initialVote !== finalVote) {
        mindChanges.push({
          playerId: player.id,
          playerName: player.name,
          avatar: player.avatar,
          initialOptionId: initialVote,
          finalOptionId: finalVote,
        });
      } else {
        keptVotePlayerIds.push(player.id);
      }
    }

    // Compute percentages
    for (const optId in voteTally) {
      const count = voteTally[optId].voteCount;
      voteTally[optId].percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    }

    // Determine winning option and check for ties
    let maxVotes = -1;
    for (const opt of options) {
      const count = voteTally[opt.id]?.voteCount || 0;
      if (count > maxVotes) {
        maxVotes = count;
      }
    }

    // Find all options that share the maximum vote count
    const tiedOptions = options.filter(
      (opt) => (voteTally[opt.id]?.voteCount || 0) === maxVotes && maxVotes > 0
    );

    const isTie = tiedOptions.length > 1;
    const tiedOptionIds = isTie ? tiedOptions.map((o) => o.id) : undefined;

    let winningOptionId: string;
    let tieBreakerReason: string | undefined;

    if (isTie) {
      // In CHAOS, when a tie occurs, the CHAOS Coin Toss breaks the tie randomly
      const randomTiedIndex = Math.floor(Math.random() * tiedOptions.length);
      const chosenTied = tiedOptions[randomTiedIndex];
      winningOptionId = chosenTied.id;
      tieBreakerReason = `⚖️ ${tiedOptions.length}-WAY DEADLOCK! CHAOS Coin Toss chose Option ${winningOptionId}!`;
    } else if (tiedOptions.length === 1) {
      winningOptionId = tiedOptions[0].id;
    } else {
      // Fallback if 0 votes cast
      winningOptionId = options[0]?.id || "A";
    }

    const winningOption = options.find((o) => o.id === winningOptionId);

    return {
      roundIndex,
      totalVotes,
      winningOptionId,
      winningOptionLabel: winningOption ? winningOption.label : "",
      voteTally,
      mindChanges,
      keptVotePlayerIds,
      switchedPlayerCount: mindChanges.length,
      keptPlayerCount: keptVotePlayerIds.length,
      isTie,
      tiedOptionIds,
      tieBreakerWinnerId: isTie ? winningOptionId : undefined,
      tieBreakerReason,
    };
  }
}

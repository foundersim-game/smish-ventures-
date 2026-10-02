import { PlayerSession } from "../types/player.types";
import {
  BlameSubmission,
  InfluenceSubmission,
  PlayerInfluenceReceipt,
  RoundReceiptsSummary,
} from "../types/influence.types";
import { MindChangeRecord } from "../types/vote.types";

export class InfluenceEngine {
  /**
   * Cross-references blame votes with self-reported influence.
   */
  public static compileReceipts(
    roundIndex: number,
    players: PlayerSession[],
    mindChanges: MindChangeRecord[],
    influences: InfluenceSubmission[],
    blames: BlameSubmission[]
  ): RoundReceiptsSummary {
    const totalSwitches = mindChanges.length;
    const playerMap = new Map<string, PlayerSession>();
    players.forEach((p) => playerMap.set(p.id, p));

    // Map player ID to receipts
    const receiptMap = new Map<string, PlayerInfluenceReceipt>();
    for (const player of players) {
      receiptMap.set(player.id, {
        playerId: player.id,
        playerName: player.name,
        peopleInfluencedCount: 0,
        voteMovementPercentage: 0,
        blameVotesReceived: 0,
        blamedByNames: [],
      });
    }

    // Count people influenced
    for (const inf of influences) {
      if (inf.influencedByPlayerId && receiptMap.has(inf.influencedByPlayerId)) {
        const entry = receiptMap.get(inf.influencedByPlayerId)!;
        entry.peopleInfluencedCount += 1;
      }
    }

    // Calculate vote movement percentage
    for (const [, entry] of receiptMap) {
      if (totalSwitches > 0) {
        entry.voteMovementPercentage = Math.round(
          (entry.peopleInfluencedCount / totalSwitches) * 100
        );
      }
    }

    // Process blame votes
    for (const b of blames) {
      if (receiptMap.has(b.blamedPlayerId)) {
        const target = receiptMap.get(b.blamedPlayerId)!;
        target.blameVotesReceived += 1;
        const accuser = playerMap.get(b.accuserPlayerId);
        if (accuser) {
          target.blamedByNames.push(accuser.name);
        }
      }
    }

    const receipts = Array.from(receiptMap.values());

    // Identify Most Blamed
    let mostBlamed: PlayerInfluenceReceipt | null = null;
    let maxBlame = 0;
    for (const r of receipts) {
      if (r.blameVotesReceived > maxBlame) {
        maxBlame = r.blameVotesReceived;
        mostBlamed = r;
      }
    }

    // Identify Most Influential
    let mostInfluential: PlayerInfluenceReceipt | null = null;
    let maxInfluence = 0;
    for (const r of receipts) {
      if (r.peopleInfluencedCount > maxInfluence) {
        maxInfluence = r.peopleInfluencedCount;
        mostInfluential = r;
      }
    }

    return {
      roundIndex,
      mostBlamedPlayerId: mostBlamed ? mostBlamed.playerId : null,
      mostBlamedPlayerName: mostBlamed ? mostBlamed.playerName : null,
      mostInfluentialPlayerId: mostInfluential ? mostInfluential.playerId : null,
      mostInfluentialPlayerName: mostInfluential ? mostInfluential.playerName : null,
      totalBlameVotes: blames.length,
      receipts,
    };
  }
}

import { InfluenceEngine } from "../../core/engine/influence-engine";
import { ScoringCalculator } from "../../core/engine/scoring-calculator";
import {
  BlameSubmission,
  InfluenceSubmission,
  RoundReceiptsSummary,
} from "../../core/types/influence.types";
import { RealtimeEventBus } from "../events/event-bus";
import { RoomRepository } from "../repositories/room.repository";
import { GameplayService } from "./gameplay.service";
import { getSupabaseClient } from "../../services/supabase/supabase-client";

// Survive Next.js hot-reloads in dev
const globalForBlame = globalThis as unknown as {
  chaosInfluences?: Map<string, InfluenceSubmission[]>;
  chaosBlames?: Map<string, BlameSubmission[]>;
};

if (!globalForBlame.chaosInfluences) {
  globalForBlame.chaosInfluences = new Map();
}
if (!globalForBlame.chaosBlames) {
  globalForBlame.chaosBlames = new Map();
}

export class BlameService {
  private static repo = RoomRepository.getInstance();
  private static bus = RealtimeEventBus.getInstance();

  private static get influencesByRoom(): Map<string, InfluenceSubmission[]> {
    if (!globalForBlame.chaosInfluences) globalForBlame.chaosInfluences = new Map();
    return globalForBlame.chaosInfluences;
  }

  private static get blamesByRoom(): Map<string, BlameSubmission[]> {
    if (!globalForBlame.chaosBlames) globalForBlame.chaosBlames = new Map();
    return globalForBlame.chaosBlames;
  }

  public static async submitInfluence(
    roomCode: string,
    submission: InfluenceSubmission
  ): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) return;

    if (!this.influencesByRoom.has(room.id)) {
      this.influencesByRoom.set(room.id, []);
    }
    this.influencesByRoom.get(room.id)!.push(submission);

    await this.repo.updatePlayer(room.id, submission.playerId, { hasSubmittedInfluence: true });
  }

  public static async submitBlame(roomCode: string, submission: BlameSubmission): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) return;

    if (!this.blamesByRoom.has(room.id)) {
      this.blamesByRoom.set(room.id, []);
    }
    this.blamesByRoom.get(room.id)!.push(submission);

    await this.repo.updatePlayer(room.id, submission.accuserPlayerId, { hasSubmittedBlame: true });
  }

  /**
   * Compiles influence + blame receipts, applies scoring to player stats,
   * and persists the scores into the repository and Supabase.
   */
  public static async compileReceipts(roomCode: string): Promise<{
    receipts: RoundReceiptsSummary;
    missionResults: import("../../core/types/mission.types").MissionEvaluationResult[];
  } | null> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) return null;

    let resolution = GameplayService.getCurrentResolution(room.id);
    if (!resolution) {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from("round_receipts")
          .select("data")
          .eq("room_id", room.id)
          .eq("round_index", room.currentRoundIndex)
          .maybeSingle();
        if (data?.data?.resolution) {
          resolution = data.data.resolution;
        }
      } catch {
        // Ignored
      }
    }
    if (!resolution) return null;

    const players = await this.repo.getPlayers(room.id);
    const influences = this.influencesByRoom.get(room.id) || [];
    const blames = this.blamesByRoom.get(room.id) || [];

    const receipts = InfluenceEngine.compileReceipts(
      room.currentRoundIndex,
      players,
      resolution.mindChanges,
      influences,
      blames
    );

    // Apply scoring to players after receipts are compiled
    const consequence = GameplayService.getCurrentConsequence(room.id);
    const isAbsurdConsequence = Boolean(consequence?.isChaosMoment);
    const scoreBreakdowns = ScoringCalculator.calculateRoundScores(
      players,
      resolution,
      receipts,
      isAbsurdConsequence
    );

    // Evaluate Secret Missions
    const missions = GameplayService.getCurrentMissions(room.id);
    let missionResults: import("../../core/types/mission.types").MissionEvaluationResult[] = [];
    if (missions && missions.size > 0) {
      const { MissionEngine } = require("../../core/engine/mission-engine");
      const blameVotesMap: Record<string, string> = {};
      for (const b of blames) {
        blameVotesMap[b.accuserPlayerId] = b.blamedPlayerId;
      }
      missionResults = MissionEngine.evaluateMissions(
        missions,
        players,
        resolution,
        receipts,
        blameVotesMap
      );

      // Award bonus points for successful missions
      for (const res of missionResults) {
        if (res.isSuccess && scoreBreakdowns[res.playerId]) {
          scoreBreakdowns[res.playerId].roundTotal += res.bonusPoints;
          scoreBreakdowns[res.playerId].cumulativeScore += res.bonusPoints;
        }
      }
    }

    // Persist score and stats to each player
    for (const player of players) {
      const breakdown = scoreBreakdowns[player.id];
      if (!breakdown) continue;

      const receipt = receipts.receipts.find((r) => r.playerId === player.id);
      const isBlamed = receipts.mostBlamedPlayerId === player.id;

      await this.repo.updatePlayer(room.id, player.id, {
        stats: {
          ...player.stats,
          totalScore: breakdown.cumulativeScore,
          timesInfluencedOthers:
            player.stats.timesInfluencedOthers + (receipt?.peopleInfluencedCount || 0),
          timesBlamed: player.stats.timesBlamed + (isBlamed ? 1 : 0),
        },
      });
    }

    // Broadcast the compiled receipts, scores, and mission results
    this.bus.publish(roomCode, "RECEIPTS_COMPILED", { receipts, scoreBreakdowns, missionResults });

    return { receipts, missionResults };
  }

  /**
   * Clears round-specific data for a room after scoring is committed (on nextRound).
   */
  public static clearRoundData(roomId: string): void {
    this.influencesByRoom.delete(roomId);
    this.blamesByRoom.delete(roomId);
  }
}

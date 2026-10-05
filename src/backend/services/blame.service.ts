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

  private static async persistToDatabase(
    roomId: string,
    roundIndex: number,
    key: "influences" | "blames",
    item: any
  ): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { data: existing } = await supabase
        .from("round_receipts")
        .select("id, data")
        .eq("room_id", roomId)
        .eq("round_index", roundIndex)
        .maybeSingle();

      const currentData = existing?.data || {};
      const currentList: any[] = Array.isArray(currentData[key]) ? currentData[key] : [];

      // Avoid duplicates
      const exists = currentList.some((existingItem: any) => {
        if (key === "influences") {
          return existingItem.playerId === item.playerId;
        } else {
          return existingItem.accuserPlayerId === item.accuserPlayerId;
        }
      });

      if (!exists) {
        currentList.push(item);
      }

      const updatedData = { ...currentData, [key]: currentList };

      if (existing) {
        await supabase
          .from("round_receipts")
          .update({ data: updatedData })
          .eq("id", existing.id);
      } else {
        await supabase.from("round_receipts").insert({
          id: crypto.randomUUID(),
          room_id: roomId,
          round_index: roundIndex,
          data: updatedData,
        });
      }
    } catch (err) {
      console.error(`[BlameService] Error persisting ${key} to Supabase:`, err);
    }
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

    const list = this.influencesByRoom.get(room.id)!;
    const existingIdx = list.findIndex((i) => i.playerId === submission.playerId);
    if (existingIdx >= 0) {
      list[existingIdx] = submission;
    } else {
      list.push(submission);
    }

    await this.persistToDatabase(room.id, room.currentRoundIndex, "influences", submission);
    await this.repo.updatePlayer(room.id, submission.playerId, { hasSubmittedInfluence: true });
  }

  public static async submitBlame(roomCode: string, submission: BlameSubmission): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) return;

    if (!this.blamesByRoom.has(room.id)) {
      this.blamesByRoom.set(room.id, []);
    }

    const list = this.blamesByRoom.get(room.id)!;
    const existingIdx = list.findIndex((b) => b.accuserPlayerId === submission.accuserPlayerId);
    if (existingIdx >= 0) {
      list[existingIdx] = submission;
    } else {
      list.push(submission);
    }

    await this.persistToDatabase(room.id, room.currentRoundIndex, "blames", submission);
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

    // Fetch existing stored data from Supabase round_receipts
    let dbData: any = {};
    try {
      const supabase = getSupabaseClient();
      const { data: dbReceiptRow } = await supabase
        .from("round_receipts")
        .select("data")
        .eq("room_id", room.id)
        .eq("round_index", room.currentRoundIndex)
        .maybeSingle();

      if (dbReceiptRow?.data) {
        dbData = dbReceiptRow.data;
      }
    } catch (err) {
      console.error("[BlameService] Error loading round_receipts from Supabase:", err);
    }

    let resolution = GameplayService.getCurrentResolution(room.id);
    if (!resolution && dbData?.resolution) {
      resolution = dbData.resolution;
    }
    if (!resolution) return null;

    const players = await this.repo.getPlayers(room.id);

    // Merge in-memory and Supabase influences
    const memoryInfluences = this.influencesByRoom.get(room.id) || [];
    const dbInfluences: InfluenceSubmission[] = Array.isArray(dbData.influences) ? dbData.influences : [];
    const influenceMap = new Map<string, InfluenceSubmission>();

    for (const inf of dbInfluences) {
      influenceMap.set(inf.playerId, inf);
    }
    for (const inf of memoryInfluences) {
      influenceMap.set(inf.playerId, inf);
    }

    // --- FIX FOR "INFLUENCED 0": Auto-attribute influence for all mind changes ---
    // If a player or bot changed their mind during discussion and no explicit influence submission exists,
    // attribute influence to the advocates of their final choice (those who initially voted for that choice)!
    const mindChanges = resolution.mindChanges || [];
    for (const mc of mindChanges) {
      if (!influenceMap.has(mc.playerId)) {
        // Who initially voted for the option this player switched to?
        const advocates = players.filter(
          (p) => p.id !== mc.playerId && p.initialVoteOptionId === mc.finalOptionId
        );
        const candidates = advocates.length > 0 ? advocates : players.filter((p) => p.id !== mc.playerId);

        if (candidates.length > 0) {
          // Select an advocate
          const chosenAdvocate = candidates[Math.floor(Math.random() * candidates.length)];
          const generatedInf: InfluenceSubmission = {
            playerId: mc.playerId,
            roundIndex: room.currentRoundIndex,
            influencedByPlayerId: chosenAdvocate.id,
            reason: "player",
          };
          influenceMap.set(mc.playerId, generatedInf);
          await this.persistToDatabase(room.id, room.currentRoundIndex, "influences", generatedInf);
        }
      }
    }

    const influences = Array.from(influenceMap.values());

    // Merge in-memory and Supabase blames
    const memoryBlames = this.blamesByRoom.get(room.id) || [];
    const dbBlames: BlameSubmission[] = Array.isArray(dbData.blames) ? dbData.blames : [];
    const blameMap = new Map<string, BlameSubmission>();

    for (const b of dbBlames) {
      blameMap.set(b.accuserPlayerId, b);
    }
    for (const b of memoryBlames) {
      blameMap.set(b.accuserPlayerId, b);
    }

    // Auto-cast blame for bot players if they haven't cast blame yet
    for (const p of players) {
      if (!blameMap.has(p.id) && !p.isHost) {
        const candidates = players.filter((c) => c.id !== p.id);
        if (candidates.length > 0) {
          const target = candidates[Math.floor(Math.random() * candidates.length)];
          const botBlame: BlameSubmission = {
            accuserPlayerId: p.id,
            roundIndex: room.currentRoundIndex,
            blamedPlayerId: target.id,
          };
          blameMap.set(p.id, botBlame);
          await this.persistToDatabase(room.id, room.currentRoundIndex, "blames", botBlame);
        }
      }
    }

    const blames = Array.from(blameMap.values());

    // Deduplicate players list before compiling to eliminate duplicate avatars/names
    const uniquePlayers: typeof players = [];
    const seenPlayerNames = new Set<string>();
    const seenPlayerIds = new Set<string>();

    for (const p of players) {
      const lower = p.name.trim().toLowerCase();
      if (!seenPlayerIds.has(p.id) && !seenPlayerNames.has(lower)) {
        seenPlayerIds.add(p.id);
        seenPlayerNames.add(lower);
        uniquePlayers.push(p);
      }
    }

    const receipts = InfluenceEngine.compileReceipts(
      room.currentRoundIndex,
      uniquePlayers,
      mindChanges,
      influences,
      blames
    );

    // Filter receipts array to ensure no duplicate entries exist in the breakdown list
    const seenReceiptIds = new Set<string>();
    const seenReceiptNames = new Set<string>();
    receipts.receipts = receipts.receipts.filter((r) => {
      const lower = r.playerName.trim().toLowerCase();
      if (seenReceiptIds.has(r.playerId) || seenReceiptNames.has(lower)) {
        return false;
      }
      seenReceiptIds.add(r.playerId);
      seenReceiptNames.add(lower);
      return true;
    });

    // Apply scoring to players after receipts are compiled
    const consequence = GameplayService.getCurrentConsequence(room.id) || dbData?.consequence;
    const isAbsurdConsequence = Boolean(consequence?.isChaosMoment);
    const scoreBreakdowns = ScoringCalculator.calculateRoundScores(
      uniquePlayers,
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
        uniquePlayers,
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
    for (const player of uniquePlayers) {
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

    // Persist compiled receipts to Supabase round_receipts
    try {
      const supabase = getSupabaseClient();
      const { data: existing } = await supabase
        .from("round_receipts")
        .select("id, data")
        .eq("room_id", room.id)
        .eq("round_index", room.currentRoundIndex)
        .maybeSingle();

      const fullData = {
        ...(existing?.data || {}),
        receipts,
        scoreBreakdowns,
        missionResults,
        influences,
        blames,
      };

      if (existing) {
        await supabase
          .from("round_receipts")
          .update({ data: fullData })
          .eq("id", existing.id);
      } else {
        await supabase.from("round_receipts").insert({
          id: crypto.randomUUID(),
          room_id: room.id,
          round_index: room.currentRoundIndex,
          data: fullData,
        });
      }
    } catch (err) {
      console.error("[BlameService] Error persisting compiled receipts to Supabase:", err);
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

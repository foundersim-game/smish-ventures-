import { ConsequenceResolver } from "../../core/engine/consequence-resolver";
import { GameStateMachine } from "../../core/engine/state-machine";
import { TitlesAssigner } from "../../core/engine/titles-assigner";
import { VoteEvaluator } from "../../core/engine/vote-evaluator";
import { MissionEngine } from "../../core/engine/mission-engine";
import { SecretMission } from "../../core/types/mission.types";
import { ChaosModifier } from "../../core/types/chaos-events.types";
import { getRandomChaosModifier } from "../../core/constants/chaos-modifiers";
import { ReactionBuzzerType } from "../../core/types/events.types";
import { GamePhase, RoomSession } from "../../core/types/room.types";
import { RoundVoteResolution } from "../../core/types/vote.types";
import { ScenarioRegistry } from "../data/scenarios";
import { RealtimeEventBus } from "../events/event-bus";
import { RoomRepository } from "../repositories/room.repository";
import { getSupabaseClient } from "../../services/supabase/supabase-client";

const globalForGameplay = globalThis as unknown as {
  chaosResolutions?: Map<string, RoundVoteResolution>;
  chaosConsequences?: Map<string, any>;
  chaosReceipts?: Map<string, any>;
  chaosMissions?: Map<string, Map<string, SecretMission>>;
  chaosModifiers?: Map<string, ChaosModifier>;
};

if (!globalForGameplay.chaosResolutions) {
  globalForGameplay.chaosResolutions = new Map<string, RoundVoteResolution>();
}
if (!globalForGameplay.chaosConsequences) {
  globalForGameplay.chaosConsequences = new Map<string, any>();
}
if (!globalForGameplay.chaosReceipts) {
  globalForGameplay.chaosReceipts = new Map<string, any>();
}
if (!globalForGameplay.chaosMissions) {
  globalForGameplay.chaosMissions = new Map<string, Map<string, SecretMission>>();
}
if (!globalForGameplay.chaosModifiers) {
  globalForGameplay.chaosModifiers = new Map<string, ChaosModifier>();
}

export class GameplayService {
  private static get repo() {
    return RoomRepository.getInstance();
  }
  private static get bus() {
    return RealtimeEventBus.getInstance();
  }

  // Cached resolutions per room (round-indexed)
  private static get currentResolutions(): Map<string, RoundVoteResolution> {
    if (!globalForGameplay.chaosResolutions) {
      globalForGameplay.chaosResolutions = new Map<string, RoundVoteResolution>();
    }
    return globalForGameplay.chaosResolutions;
  }

  private static get currentConsequences(): Map<string, any> {
    if (!globalForGameplay.chaosConsequences) {
      globalForGameplay.chaosConsequences = new Map<string, any>();
    }
    return globalForGameplay.chaosConsequences;
  }

  private static get currentReceipts(): Map<string, any> {
    if (!globalForGameplay.chaosReceipts) {
      globalForGameplay.chaosReceipts = new Map<string, any>();
    }
    return globalForGameplay.chaosReceipts;
  }

  private static get currentMissions(): Map<string, Map<string, SecretMission>> {
    if (!globalForGameplay.chaosMissions) {
      globalForGameplay.chaosMissions = new Map();
    }
    return globalForGameplay.chaosMissions;
  }

  private static get currentModifiers(): Map<string, ChaosModifier> {
    if (!globalForGameplay.chaosModifiers) {
      globalForGameplay.chaosModifiers = new Map();
    }
    return globalForGameplay.chaosModifiers;
  }

  /**
   * Helper to persist round resolution/consequence/receipt to Supabase
   */
  private static async persistRoundData(roomId: string, roundIndex: number, patchData: Record<string, any>) {
    try {
      const supabase = getSupabaseClient();
      const { data: existing } = await supabase
        .from("round_receipts")
        .select("id, data")
        .eq("room_id", roomId)
        .eq("round_index", roundIndex)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("round_receipts")
          .update({ data: { ...existing.data, ...patchData } })
          .eq("id", existing.id);
      } else {
        await supabase.from("round_receipts").insert({
          id: crypto.randomUUID(),
          room_id: roomId,
          round_index: roundIndex,
          data: patchData,
        });
      }
    } catch (err) {
      console.error("[GameplayService] persistRoundData error:", err);
    }
  }

  /**
   * Starts the game from the lobby into Round 1 Initial Voting.
   */
  public static async startGame(roomCode: string, hostPlayerId: string): Promise<RoomSession> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) throw new Error("Room not found.");

    const players = await this.repo.getPlayers(room.id);
    const callingPlayer = players.find((p) => p.id === hostPlayerId);
    const isHost =
      room.hostId === hostPlayerId ||
      callingPlayer?.isHost === true ||
      (players.length > 0 && players[0].id === hostPlayerId) ||
      (players.length > 0 && callingPlayer && players[0].name.trim().toLowerCase() === callingPlayer.name.trim().toLowerCase());

    if (!isHost) throw new Error("Only the host can start the game.");

    // Sync room.hostId if needed
    if (room.hostId !== hostPlayerId) {
      room.hostId = hostPlayerId;
    }

    const minPlayers = room.mode === "couples" ? 2 : Math.min(room.settings.minPlayers || 2, 2);
    if (players.length < minPlayers) {
      throw new Error(`At least ${minPlayers} players are required to start.`);
    }

    const updatedRoom = GameStateMachine.transition(room, "initial_vote", 0);
    await this.repo.saveRoom(updatedRoom);

    // Generate Secret Missions for Round 1
    const scenario = ScenarioRegistry.getById(room.scenarioId) || ScenarioRegistry.getDefaultPartyScenario();
    const round1 = scenario.rounds[0];
    const missions = MissionEngine.generateMissions(1, players, round1);
    this.currentMissions.set(room.id, missions);

    // Roll Chaos Modifier (35% chance for party mode in round 1)
    if (Math.random() < 0.35 && room.mode === "party") {
      const mod = getRandomChaosModifier();
      this.currentModifiers.set(room.id, mod);
      this.bus.publish(roomCode, "CHAOS_MODIFIER_TRIGGERED", { modifier: mod, roundIndex: 1 });
    } else {
      this.currentModifiers.delete(room.id);
    }

    // Reset player vote states for Round 1 & assign secret missions in parallel
    const updatedPlayers = await Promise.all(
      players.map(async (p) => {
        const mission = missions.get(p.id) || null;
        const updated = await this.repo.updatePlayer(room.id, p.id, {
          initialVoteOptionId: null,
          finalVoteOptionId: null,
          hasLockedInitialVote: false,
          hasLockedFinalVote: false,
          hasSubmittedInfluence: false,
          hasSubmittedBlame: false,
          secretMission: mission,
        });

        if (mission) {
          this.bus.publish(roomCode, "SECRET_MISSION_ASSIGNED", { playerId: p.id, mission });
        }
        return updated || p;
      })
    );

    this.bus.publish(roomCode, "PLAYERS_UPDATED", { players: updatedPlayers });
    this.bus.publish(roomCode, "PHASE_CHANGED", {
      previousPhase: "lobby",
      newPhase: "initial_vote",
      startTimestamp: updatedRoom.phaseStartTimestamp,
      durationSeconds: 0,
    });
    this.bus.publish(roomCode, "ROOM_UPDATED", { room: updatedRoom });

    return updatedRoom;
  }

  /**
   * Player locks their initial secret vote.
   */
  public static async lockInitialVote(roomCode: string, playerId: string, optionId: string): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room || room.phase !== "initial_vote") {
      throw new Error("Initial voting is not active.");
    }

    await this.repo.updatePlayer(room.id, playerId, {
      initialVoteOptionId: optionId,
      hasLockedInitialVote: true,
    });

    const players = await this.repo.getPlayers(room.id);
    const lockedCount = players.filter((p) => p.hasLockedInitialVote).length;
    const totalPlayers = players.length;

    this.bus.publish(roomCode, "VOTE_LOCKED_STATUS", {
      lockedCount,
      totalPlayers,
      lockedPlayerIds: players.filter((p) => p.hasLockedInitialVote).map((p) => p.id),
    });
    this.bus.publish(roomCode, "PLAYERS_UPDATED", { players });

    // Check if everyone has locked -> automatically transition to Phones Down Discussion
    if (lockedCount >= totalPlayers && totalPlayers > 0) {
      const scenario = ScenarioRegistry.getById(room.scenarioId);
      const currentRound = scenario?.rounds[room.currentRoundIndex - 1];
      const duration = currentRound?.discussionDurationSeconds || room.settings.discussionDurationSeconds || 60;

      const updated = GameStateMachine.transition(room, "discussion", duration);
      await this.repo.saveRoom(updated);

      this.bus.publish(roomCode, "PHASE_CHANGED", {
        previousPhase: "initial_vote",
        newPhase: "discussion",
        startTimestamp: updated.phaseStartTimestamp,
        durationSeconds: duration,
      });
      this.bus.publish(roomCode, "ROOM_UPDATED", { room: updated });
    }
  }

  /**
   * Host extends discussion time (+30s More Chaos button).
   */
  public static async extendDiscussion(
    roomCode: string,
    hostPlayerId: string,
    addSeconds = 30
  ): Promise<RoomSession> {
    const room = await this.repo.findByCode(roomCode);
    if (!room || room.phase !== "discussion") throw new Error("Discussion is not active.");
    if (room.hostId !== hostPlayerId) throw new Error("Only the host can modify discussion time.");

    const newDuration = room.phaseDurationSeconds + addSeconds;
    const updated = (await this.repo.updateRoom(roomCode, { phaseDurationSeconds: newDuration }))!;

    this.bus.publish(roomCode, "ROOM_UPDATED", { room: updated });
    return updated;
  }

  /**
   * Transitions to Final Vote (when discussion ends or host skips).
   */
  public static async transitionToFinalVote(roomCode: string): Promise<RoomSession> {
    const room = await this.repo.findByCode(roomCode);
    if (!room || room.phase !== "discussion") throw new Error("Discussion is not active.");

    const updated = GameStateMachine.transition(room, "final_vote", 0);
    await this.repo.saveRoom(updated);

    this.bus.publish(roomCode, "PHASE_CHANGED", {
      previousPhase: "discussion",
      newPhase: "final_vote",
      startTimestamp: updated.phaseStartTimestamp,
      durationSeconds: 0,
    });
    this.bus.publish(roomCode, "ROOM_UPDATED", { room: updated });

    return updated;
  }

  /**
   * Player locks their final vote.
   */
  public static async lockFinalVote(roomCode: string, playerId: string, optionId: string): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room || room.phase !== "final_vote") throw new Error("Final voting is not active.");

    const player = await this.repo.getPlayer(room.id, playerId);
    if (!player) throw new Error("Player not found.");

    const isMindChange = player.initialVoteOptionId && player.initialVoteOptionId !== optionId;

    await this.repo.updatePlayer(room.id, playerId, {
      finalVoteOptionId: optionId,
      hasLockedFinalVote: true,
      stats: {
        ...player.stats,
        decisionsMade: player.stats.decisionsMade + 1,
        mindChanges: player.stats.mindChanges + (isMindChange ? 1 : 0),
      },
    });

    const players = await this.repo.getPlayers(room.id);
    const lockedCount = players.filter((p) => p.hasLockedFinalVote).length;
    const totalPlayers = players.length;

    this.bus.publish(roomCode, "VOTE_LOCKED_STATUS", {
      lockedCount,
      totalPlayers,
      lockedPlayerIds: players.filter((p) => p.hasLockedFinalVote).map((p) => p.id),
    });
    this.bus.publish(roomCode, "PLAYERS_UPDATED", { players });

    // If all final votes locked -> begin the 6-beat staged mystery box reveal!
    if (lockedCount >= totalPlayers && totalPlayers > 0) {
      await this.beginStagedReveal(room);
    }
  }

  /**
   * Initiates the 6-Beat Staged Mystery Box Reveal.
   */
  private static async beginStagedReveal(room: RoomSession): Promise<void> {
    const scenario = ScenarioRegistry.getById(room.scenarioId);
    const currentRound = scenario?.rounds[room.currentRoundIndex - 1];
    if (!currentRound) return;

    const players = await this.repo.getPlayers(room.id);
    const resolution = VoteEvaluator.evaluateRound(room.currentRoundIndex, currentRound.options, players);
    this.currentResolutions.set(room.id, resolution);

    await this.persistRoundData(room.id, room.currentRoundIndex, { resolution });

    // Transition to Reveal Beat 1: Closed Box
    const updated = GameStateMachine.transition(room, "reveal_beat_1", 0);
    await this.repo.saveRoom(updated);

    this.bus.publish(room.roomCode, "REVEAL_RESOLVED", { resolution });
    this.bus.publish(room.roomCode, "PHASE_CHANGED", {
      previousPhase: "final_vote",
      newPhase: "reveal_beat_1",
      startTimestamp: updated.phaseStartTimestamp,
      durationSeconds: 0,
    });
  }

  /**
   * Advances the reveal beats (1 through 6) and concludes in consequence/blame.
   */
  public static async advanceRevealBeat(roomCode: string, targetBeat: GamePhase): Promise<RoomSession> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) throw new Error("Room not found.");

    const updated = GameStateMachine.transition(room, targetBeat, 0);
    await this.repo.saveRoom(updated);

    let resolution = this.currentResolutions.get(room.id);
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
          this.currentResolutions.set(room.id, resolution!);
        }
      } catch {
        // Ignored
      }
    }

    if (targetBeat === "consequence" && resolution) {
      const scenario = ScenarioRegistry.getById(room.scenarioId);
      const currentRound = scenario?.rounds[room.currentRoundIndex - 1];
      if (currentRound) {
        const consequenceResult = ConsequenceResolver.resolve(
          currentRound,
          resolution,
          room.resourceState
        );
        this.currentConsequences.set(room.id, consequenceResult);
        await this.persistRoundData(room.id, room.currentRoundIndex, { consequence: consequenceResult });
        await this.repo.updateRoom(roomCode, { resourceState: consequenceResult.updatedResourceState });
        this.bus.publish(roomCode, "CONSEQUENCE_RESOLVED", consequenceResult);
      }
    }

    this.bus.publish(roomCode, "PHASE_CHANGED", {
      previousPhase: room.phase,
      newPhase: targetBeat,
      startTimestamp: updated.phaseStartTimestamp,
      durationSeconds: 0,
    });
    const freshRoom = (await this.repo.findByCode(roomCode))!;
    this.bus.publish(roomCode, "ROOM_UPDATED", { room: freshRoom });

    return freshRoom;
  }

  /**
   * Progresses to next round or concludes the game into CHAOS Report.
   */
  public static async nextRound(roomCode: string, hostPlayerId: string): Promise<RoomSession> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) throw new Error("Room not found.");
    const players = await this.repo.getPlayers(room.id);
    const player = players.find(p => p.id === hostPlayerId);
    const hostPlayer = players.find(p => p.id === room.hostId);
    const isHostInactive = !hostPlayer || !hostPlayer.connected || (Date.now() - (hostPlayer.lastSeenAt || 0) > 45000);
    const oldestConnected = players.filter(p => p.connected)[0];
    const isAuthorized = room.hostId === hostPlayerId || Boolean(player?.isHost) || (isHostInactive && oldestConnected?.id === hostPlayerId);
    if (!isAuthorized) throw new Error("Only the host can advance rounds.");

    const nextIndex = room.currentRoundIndex + 1;
    const isGameOver = nextIndex > room.totalRounds;

    if (isGameOver) {
      const updated = GameStateMachine.transition(room, "chaos_report", 0);
      await this.repo.saveRoom(updated);

      const report = TitlesAssigner.assignTitles(room.id, players, 30000 - (room.resourceState.balance ?? 0));

      this.bus.publish(roomCode, "GAME_CONCLUDED", { report });
      this.bus.publish(roomCode, "PHASE_CHANGED", {
        previousPhase: room.phase,
        newPhase: "chaos_report",
        startTimestamp: updated.phaseStartTimestamp,
        durationSeconds: 0,
      });

      return updated;
    }

    // Advance to next round initial vote
    const updated = GameStateMachine.transition(
      {
        ...room,
        currentRoundIndex: nextIndex,
      },
      "initial_vote",
      0
    );
    await this.repo.saveRoom(updated);

    const scenario = ScenarioRegistry.getById(room.scenarioId) || ScenarioRegistry.getDefaultPartyScenario();
    const roundDef = scenario.rounds[nextIndex - 1] || scenario.rounds[0];
    const missions = MissionEngine.generateMissions(nextIndex, players, roundDef);
    this.currentMissions.set(room.id, missions);

    // Roll Chaos Modifier (65% chance in round 2+)
    if (Math.random() < 0.65 && room.mode === "party") {
      const mod = getRandomChaosModifier();
      this.currentModifiers.set(room.id, mod);
      this.bus.publish(roomCode, "CHAOS_MODIFIER_TRIGGERED", { modifier: mod, roundIndex: nextIndex });
    } else {
      this.currentModifiers.delete(room.id);
    }

    // Reset player vote states for the new round & assign new secret missions
    for (const p of players) {
      const mission = missions.get(p.id) || null;
      await this.repo.updatePlayer(room.id, p.id, {
        initialVoteOptionId: null,
        finalVoteOptionId: null,
        hasLockedInitialVote: false,
        hasLockedFinalVote: false,
        hasSubmittedInfluence: false,
        hasSubmittedBlame: false,
        secretMission: mission,
      });

      if (mission) {
        this.bus.publish(roomCode, "SECRET_MISSION_ASSIGNED", { playerId: p.id, mission });
      }
    }

    // Clean up per-round data to avoid cross-round contamination
    this.currentResolutions.delete(room.id);
    this.currentConsequences.delete(room.id);
    try {
      const { BlameService } = await import("./blame.service");
      BlameService.clearRoundData(room.id);
    } catch {
      // Non-fatal
    }

    this.bus.publish(roomCode, "PHASE_CHANGED", {
      previousPhase: room.phase,
      newPhase: "initial_vote",
      startTimestamp: updated.phaseStartTimestamp,
      durationSeconds: 0,
    });
    this.bus.publish(roomCode, "ROOM_UPDATED", { room: updated });

    return updated;
  }

  /**
   * Triggers a real-time table reaction buzzer during the discussion phase.
   */
  public static async triggerBuzzer(roomCode: string, playerId: string, buzzerType: ReactionBuzzerType): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) return;

    const player = await this.repo.getPlayer(room.id, playerId);
    if (!player) return;

    this.bus.publish(roomCode, "REACTION_BUZZER_FIRED", {
      playerId: player.id,
      playerName: player.name,
      buzzerType,
      timestamp: Date.now(),
    });
  }

  /**
   * Triggers a real-time table emoji reaction (floating emoji on everyone's screen).
   */
  public static async triggerEmojiReaction(roomCode: string, playerId: string, emoji: string): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) return;

    const player = await this.repo.getPlayer(room.id, playerId);
    if (!player) return;

    this.bus.publish(roomCode, "TABLE_EMOJI_REACTION", {
      playerId: player.id,
      playerName: player.name,
      avatar: player.avatar,
      emoji,
      timestamp: Date.now(),
    });
  }

  public static getCurrentMissions(roomId: string): Map<string, SecretMission> | undefined {
    return this.currentMissions.get(roomId);
  }

  public static getCurrentModifier(roomId: string): ChaosModifier | undefined {
    return this.currentModifiers.get(roomId);
  }

  public static getCurrentResolution(roomId: string, roundIndex?: number): RoundVoteResolution | undefined {
    const res = this.currentResolutions.get(roomId);
    if (!res) return undefined;
    if (typeof roundIndex === "number" && res.roundIndex !== roundIndex) {
      return undefined;
    }
    return res;
  }

  public static getCurrentConsequence(roomId: string, roundIndex?: number): any {
    const c = this.currentConsequences.get(roomId);
    if (!c) return undefined;
    if (typeof roundIndex === "number" && c.roundIndex && c.roundIndex !== roundIndex) {
      return undefined;
    }
    return c;
  }

  public static setReceipts(roomId: string, receipts: any): void {
    this.currentReceipts.set(roomId, receipts);
  }

  public static getCurrentReceipts(roomId: string): any {
    return this.currentReceipts.get(roomId);
  }
}

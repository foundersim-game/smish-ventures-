import { PlayerSession } from "../../core/types/player.types";
import { RoomSession } from "../../core/types/room.types";
import { getSupabaseClient } from "../../services/supabase/supabase-client";

const globalForRepo = globalThis as unknown as {
  chaosRoomRepository: RoomRepository | undefined;
};

function toDbRoom(r: RoomSession): Record<string, unknown> {
  return {
    id: r.id,
    room_code: r.roomCode.toUpperCase(),
    host_id: r.hostId,
    mode: r.mode,
    phase: r.phase,
    phase_start_timestamp: r.phaseStartTimestamp,
    phase_duration_seconds: r.phaseDurationSeconds,
    settings: r.settings,
    scenario_id: r.scenarioId,
    current_round_index: r.currentRoundIndex,
    total_rounds: r.totalRounds,
    resource_state: r.resourceState,
    is_paid_session: r.isPaidSession,
    updated_at: new Date().toISOString(),
  };
}

function fromDbRoom(row: any): RoomSession {
  return {
    id: row.id,
    roomCode: (row.room_code || "").toUpperCase(),
    hostId: row.host_id,
    mode: row.mode,
    phase: row.phase,
    phaseStartTimestamp: Number(row.phase_start_timestamp || Date.now()),
    phaseDurationSeconds: Number(row.phase_duration_seconds || 0),
    settings: row.settings || {},
    scenarioId: row.scenario_id || "quick_chaos",
    currentRoundIndex: Number(row.current_round_index || 1),
    totalRounds: Number(row.total_rounds || 4),
    resourceState: row.resource_state || { balance: 30000, sanity: 100, chaosScore: 0 },
    isPaidSession: Boolean(row.is_paid_session),
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
  };
}

function toDbRoomPatch(patch: Partial<RoomSession>): Record<string, unknown> {
  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.hostId !== undefined) row.host_id = patch.hostId;
  if (patch.mode !== undefined) row.mode = patch.mode;
  if (patch.phase !== undefined) row.phase = patch.phase;
  if (patch.phaseStartTimestamp !== undefined) row.phase_start_timestamp = patch.phaseStartTimestamp;
  if (patch.phaseDurationSeconds !== undefined) row.phase_duration_seconds = patch.phaseDurationSeconds;
  if (patch.settings !== undefined) row.settings = patch.settings;
  if (patch.scenarioId !== undefined) row.scenario_id = patch.scenarioId;
  if (patch.currentRoundIndex !== undefined) row.current_round_index = patch.currentRoundIndex;
  if (patch.totalRounds !== undefined) row.total_rounds = patch.totalRounds;
  if (patch.resourceState !== undefined) row.resource_state = patch.resourceState;
  if (patch.isPaidSession !== undefined) row.is_paid_session = patch.isPaidSession;
  return row;
}

function toDbPlayer(p: PlayerSession, roomCode: string): Record<string, unknown> {
  return {
    id: p.id,
    room_id: p.roomId,
    room_code: (roomCode || "CHAOS").toUpperCase(),
    name: p.name,
    avatar: p.avatar,
    is_host: p.isHost,
    connected: p.connected,
    ready: p.ready,
    initial_vote_option_id: p.initialVoteOptionId,
    final_vote_option_id: p.finalVoteOptionId,
    has_locked_initial_vote: p.hasLockedInitialVote,
    has_locked_final_vote: p.hasLockedFinalVote,
    has_submitted_influence: p.hasSubmittedInfluence,
    has_submitted_blame: p.hasSubmittedBlame,
    secret_intel: p.secretIntel,
    secret_mission: p.secretMission || null,
    stats: p.stats,
    joined_at: p.joinedAt,
    last_seen_at: p.lastSeenAt,
  };
}

function fromDbPlayer(row: any): PlayerSession {
  return {
    id: row.id,
    roomId: row.room_id,
    name: row.name,
    avatar: row.avatar,
    isHost: Boolean(row.is_host),
    connected: Boolean(row.connected),
    ready: Boolean(row.ready),
    initialVoteOptionId: row.initial_vote_option_id || null,
    finalVoteOptionId: row.final_vote_option_id || null,
    hasLockedInitialVote: Boolean(row.has_locked_initial_vote),
    hasLockedFinalVote: Boolean(row.has_locked_final_vote),
    hasSubmittedInfluence: Boolean(row.has_submitted_influence),
    hasSubmittedBlame: Boolean(row.has_submitted_blame),
    secretIntel: row.secret_intel || null,
    secretMission: row.secret_mission || null,
    stats: row.stats || {
      decisionsMade: 0,
      mindChanges: 0,
      timesInfluencedOthers: 0,
      timesBlamed: 0,
      totalScore: 0,
    },
    joinedAt: Number(row.joined_at || Date.now()),
    lastSeenAt: Number(row.last_seen_at || Date.now()),
  };
}

function toDbPlayerPatch(patch: Partial<PlayerSession>): Record<string, unknown> {
  const row: Record<string, unknown> = {
    last_seen_at: Date.now(),
  };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.avatar !== undefined) row.avatar = patch.avatar;
  if (patch.isHost !== undefined) row.is_host = patch.isHost;
  if (patch.connected !== undefined) row.connected = patch.connected;
  if (patch.ready !== undefined) row.ready = patch.ready;
  if (patch.initialVoteOptionId !== undefined) row.initial_vote_option_id = patch.initialVoteOptionId;
  if (patch.finalVoteOptionId !== undefined) row.final_vote_option_id = patch.finalVoteOptionId;
  if (patch.hasLockedInitialVote !== undefined) row.has_locked_initial_vote = patch.hasLockedInitialVote;
  if (patch.hasLockedFinalVote !== undefined) row.has_locked_final_vote = patch.hasLockedFinalVote;
  if (patch.hasSubmittedInfluence !== undefined) row.has_submitted_influence = patch.hasSubmittedInfluence;
  if (patch.hasSubmittedBlame !== undefined) row.has_submitted_blame = patch.hasSubmittedBlame;
  if (patch.secretIntel !== undefined) row.secret_intel = patch.secretIntel;
  if (patch.secretMission !== undefined) row.secret_mission = patch.secretMission;
  if (patch.stats !== undefined) row.stats = patch.stats;
  return row;
}

export class RoomRepository {
  private static instance: RoomRepository;

  // Keyed by room code (e.g. "7XQ3")
  private roomsByCode = new Map<string, RoomSession>();
  // Keyed by room ID
  private roomsById = new Map<string, RoomSession>();
  // Keyed by room ID -> Map<playerId, PlayerSession>
  private playersByRoom = new Map<string, Map<string, PlayerSession>>();

  private constructor() {}

  public static getInstance(): RoomRepository {
    if (!globalForRepo.chaosRoomRepository) {
      globalForRepo.chaosRoomRepository = new RoomRepository();
    }
    return globalForRepo.chaosRoomRepository;
  }

  public async saveRoom(room: RoomSession): Promise<RoomSession> {
    const code = room.roomCode.toUpperCase();
    this.roomsByCode.set(code, room);
    this.roomsById.set(room.id, room);
    if (!this.playersByRoom.has(room.id)) {
      this.playersByRoom.set(room.id, new Map());
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("rooms").upsert(toDbRoom(room), { onConflict: "id" });
      if (error) {
        console.error("[RoomRepository] Supabase saveRoom error:", error.message);
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase saveRoom exception:", err);
    }

    return room;
  }

  public async findByCode(code: string): Promise<RoomSession | null> {
    const upperCode = code.toUpperCase().trim();

    // 1. Check in-memory cache first
    const cached = this.roomsByCode.get(upperCode);

    // 2. Query Supabase for persistence across serverless invocations
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("room_code", upperCode)
        .maybeSingle();

      if (!error && data) {
        const room = fromDbRoom(data);
        this.roomsByCode.set(upperCode, room);
        this.roomsById.set(room.id, room);

        // Populate players from Supabase into cache
        const { data: playersData } = await supabase
          .from("players")
          .select("*")
          .eq("room_id", room.id);

        if (playersData && playersData.length > 0) {
          const map = new Map<string, PlayerSession>();
          for (const row of playersData) {
            const player = fromDbPlayer(row);
            map.set(player.id, player);
          }
          this.playersByRoom.set(room.id, map);
        }

        return room;
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase findByCode error:", err);
    }

    return cached || null;
  }

  public findByCodeSync(code: string): RoomSession | null {
    return this.roomsByCode.get(code.toUpperCase().trim()) || null;
  }

  public async findById(id: string): Promise<RoomSession | null> {
    const cached = this.roomsById.get(id);
    if (cached) return cached;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        const room = fromDbRoom(data);
        this.roomsByCode.set(room.roomCode, room);
        this.roomsById.set(room.id, room);
        return room;
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase findById error:", err);
    }

    return null;
  }

  public findByIdSync(id: string): RoomSession | null {
    return this.roomsById.get(id) || null;
  }

  public async updateRoom(roomCode: string, patch: Partial<RoomSession>): Promise<RoomSession | null> {
    const upperCode = roomCode.toUpperCase().trim();
    const existing = await this.findByCode(upperCode);
    if (!existing) return null;

    const updated: RoomSession = {
      ...existing,
      ...patch,
      updatedAt: Date.now(),
    };

    this.roomsByCode.set(upperCode, updated);
    this.roomsById.set(existing.id, updated);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("rooms")
        .update(toDbRoomPatch(patch))
        .eq("room_code", upperCode);
      if (error) {
        console.error("[RoomRepository] Supabase updateRoom error:", error.message);
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase updateRoom exception:", err);
    }

    return updated;
  }

  public async getPlayers(roomId: string): Promise<PlayerSession[]> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomId);

      if (!error && data) {
        const players = data.map(fromDbPlayer);
        const map = new Map<string, PlayerSession>();
        for (const p of players) {
          map.set(p.id, p);
        }
        this.playersByRoom.set(roomId, map);
        return players;
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase getPlayers error:", err);
    }

    const map = this.playersByRoom.get(roomId);
    if (!map) return [];
    return Array.from(map.values());
  }

  public getPlayersSync(roomId: string): PlayerSession[] {
    const map = this.playersByRoom.get(roomId);
    if (!map) return [];
    return Array.from(map.values());
  }

  public async getPlayer(roomId: string, playerId: string): Promise<PlayerSession | null> {
    const map = this.playersByRoom.get(roomId);
    if (map && map.has(playerId)) {
      return map.get(playerId)!;
    }

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .maybeSingle();

      if (!error && data) {
        const player = fromDbPlayer(data);
        if (!map) {
          const newMap = new Map<string, PlayerSession>();
          newMap.set(player.id, player);
          this.playersByRoom.set(roomId, newMap);
        } else {
          map.set(player.id, player);
        }
        return player;
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase getPlayer error:", err);
    }

    return null;
  }

  public getPlayerSync(roomId: string, playerId: string): PlayerSession | null {
    const map = this.playersByRoom.get(roomId);
    if (!map) return null;
    return map.get(playerId) || null;
  }

  public async savePlayer(player: PlayerSession, explicitRoomCode?: string): Promise<PlayerSession> {
    let map = this.playersByRoom.get(player.roomId);
    if (!map) {
      map = new Map();
      this.playersByRoom.set(player.roomId, map);
    }
    map.set(player.id, player);

    let roomCode = explicitRoomCode;
    if (!roomCode) {
      const room = this.roomsById.get(player.roomId);
      roomCode = room?.roomCode;
    }
    if (!roomCode) {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.from("rooms").select("room_code").eq("id", player.roomId).maybeSingle();
        roomCode = data?.room_code;
      } catch {
        // Ignored
      }
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("players")
        .upsert(toDbPlayer(player, roomCode || "CHAOS"), { onConflict: "id" });
      if (error) {
        console.error("[RoomRepository] Supabase savePlayer error:", error.message);
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase savePlayer exception:", err);
    }

    return player;
  }

  public async updatePlayer(
    roomId: string,
    playerId: string,
    patch: Partial<PlayerSession>
  ): Promise<PlayerSession | null> {
    const existing = await this.getPlayer(roomId, playerId);
    if (!existing) return null;

    const updated: PlayerSession = {
      ...existing,
      ...patch,
      lastSeenAt: Date.now(),
    };

    const map = this.playersByRoom.get(roomId);
    if (map) {
      map.set(playerId, updated);
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("players")
        .update(toDbPlayerPatch(patch))
        .eq("id", playerId);
      if (error) {
        console.error("[RoomRepository] Supabase updatePlayer error:", error.message);
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase updatePlayer exception:", err);
    }

    return updated;
  }

  public async removePlayer(roomId: string, playerId: string): Promise<boolean> {
    const map = this.playersByRoom.get(roomId);
    if (map) {
      map.delete(playerId);
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("players").delete().eq("id", playerId);
      if (error) {
        console.error("[RoomRepository] Supabase removePlayer error:", error.message);
      }
    } catch (err) {
      console.error("[RoomRepository] Supabase removePlayer exception:", err);
    }

    return true;
  }
}

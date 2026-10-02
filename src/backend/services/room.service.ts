import { DEFAULT_COUPLES_SETTINGS, DEFAULT_PARTY_SETTINGS } from "../../core/constants/game.constants";
import { AvatarKey, PlayerSession } from "../../core/types/player.types";
import { GameMode, GameSettings, RoomSession } from "../../core/types/room.types";
import { RealtimeEventBus } from "../events/event-bus";
import { RoomRepository } from "../repositories/room.repository";
import { ScenarioRegistry } from "../data/scenarios";

export class RoomService {
  private static repo = RoomRepository.getInstance();
  private static bus = RealtimeEventBus.getInstance();

  /**
   * Generates a short, memorable 4-6 alphanumeric room code.
   */
  public static generateRoomCode(): string {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude 0, 1, I, O
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Creates a new game room and establishes the host player.
   */
  public static async createRoom(params: {
    hostName: string;
    hostAvatar: AvatarKey;
    mode?: GameMode;
    scenarioId?: string;
    settings?: Partial<GameSettings>;
    isPaidSession?: boolean;
  }): Promise<{ room: RoomSession; host: PlayerSession }> {
    const mode = params.mode || "party";
    const defaultSettings = mode === "couples" ? DEFAULT_COUPLES_SETTINGS : DEFAULT_PARTY_SETTINGS;
    const finalSettings: GameSettings = { ...defaultSettings, ...(params.settings || {}) };

    let scenarioId = params.scenarioId;
    if (!scenarioId) {
      scenarioId =
        mode === "couples"
          ? ScenarioRegistry.getDefaultCouplesScenario().id
          : ScenarioRegistry.getDefaultPartyScenario().id;
    }

    const scenario = ScenarioRegistry.getById(scenarioId) || ScenarioRegistry.getDefaultPartyScenario();
    const roomId = crypto.randomUUID();
    let roomCode = this.generateRoomCode();

    // Ensure uniqueness
    let attempt = 0;
    while ((await this.repo.findByCode(roomCode)) && attempt < 10) {
      roomCode = this.generateRoomCode();
      attempt++;
    }

    const hostId = crypto.randomUUID();
    const now = Date.now();

    const room: RoomSession = {
      id: roomId,
      roomCode,
      hostId,
      mode,
      phase: "lobby",
      phaseStartTimestamp: now,
      phaseDurationSeconds: 0,
      settings: finalSettings,
      scenarioId: scenario.id,
      currentRoundIndex: 1,
      totalRounds: Math.min(finalSettings.totalRounds, scenario.rounds.length || 10),
      resourceState: scenario.initialResourceState || { balance: 30000, sanity: 100, chaosScore: 0 },
      isPaidSession: Boolean(params.isPaidSession),
      createdAt: now,
      updatedAt: now,
    };

    const host: PlayerSession = {
      id: hostId,
      roomId,
      name: params.hostName.trim() || "Host",
      avatar: params.hostAvatar || "crown",
      isHost: true,
      connected: true,
      ready: true,
      initialVoteOptionId: null,
      finalVoteOptionId: null,
      hasLockedInitialVote: false,
      hasLockedFinalVote: false,
      hasSubmittedInfluence: false,
      hasSubmittedBlame: false,
      secretIntel: null,
      stats: {
        decisionsMade: 0,
        mindChanges: 0,
        timesInfluencedOthers: 0,
        timesBlamed: 0,
        totalScore: 0,
      },
      joinedAt: now,
      lastSeenAt: now,
    };

    await this.repo.saveRoom(room);
    await this.repo.savePlayer(host, roomCode);

    return { room, host };
  }

  /**
   * Allows a player to join an existing room.
   */
  public static async joinRoom(params: {
    roomCode: string;
    playerName: string;
    avatar: AvatarKey;
  }): Promise<{ room: RoomSession; player: PlayerSession }> {
    const code = params.roomCode.toUpperCase().trim();
    const room = await this.repo.findByCode(code);

    if (!room) {
      throw new Error(`Room with code '${code}' not found.`);
    }

    if (room.phase !== "lobby") {
      throw new Error("Game has already started. Cannot join in-progress session.");
    }

    const existingPlayers = await this.repo.getPlayers(room.id);
    const maxPlayers = room.mode === "couples" ? 2 : room.settings.maxPlayers;

    if (existingPlayers.length >= maxPlayers) {
      throw new Error(`Room is full (${existingPlayers.length}/${maxPlayers} players).`);
    }

    const playerId = crypto.randomUUID();
    const now = Date.now();

    const player: PlayerSession = {
      id: playerId,
      roomId: room.id,
      name: params.playerName.trim() || `Player ${existingPlayers.length + 1}`,
      avatar: params.avatar || "sunglasses",
      isHost: false,
      connected: true,
      ready: true,
      initialVoteOptionId: null,
      finalVoteOptionId: null,
      hasLockedInitialVote: false,
      hasLockedFinalVote: false,
      hasSubmittedInfluence: false,
      hasSubmittedBlame: false,
      secretIntel: null,
      stats: {
        decisionsMade: 0,
        mindChanges: 0,
        timesInfluencedOthers: 0,
        timesBlamed: 0,
        totalScore: 0,
      },
      joinedAt: now,
      lastSeenAt: now,
    };

    await this.repo.savePlayer(player, room.roomCode);

    const updatedPlayers = await this.repo.getPlayers(room.id);
    this.bus.publish(room.roomCode, "PLAYERS_UPDATED", { players: updatedPlayers });
    this.bus.publish(room.roomCode, "PLAYER_JOINED", { player, totalPlayers: updatedPlayers.length });

    return { room, player };
  }

  /**
   * Adds an AI/Demo bot player to the room (useful for testing or solo play).
   */
  public static async addBotPlayer(
    roomCode: string,
    botName?: string,
    botAvatar?: AvatarKey
  ): Promise<{ room: RoomSession; player: PlayerSession }> {
    const defaultBots: { name: string; avatar: AvatarKey }[] = [
      { name: "Riya", avatar: "fire" },
      { name: "Karan", avatar: "sunglasses" },
      { name: "Simran", avatar: "brain" },
      { name: "Vishal", avatar: "devil" },
      { name: "Neha", avatar: "skull" },
      { name: "Zack", avatar: "lightning" },
      { name: "Maya", avatar: "mask" },
      { name: "Leo", avatar: "lion" },
    ];

    const room = await this.repo.findByCode(roomCode);
    if (!room) throw new Error("Room not found");
    const existingPlayers = await this.repo.getPlayers(room.id);

    const usedNames = new Set(existingPlayers.map((p) => p.name));
    const candidate = defaultBots.find((b) => !usedNames.has(b.name)) || {
      name: `Player ${existingPlayers.length + 1}`,
      avatar: "sunglasses" as AvatarKey,
    };

    return await this.joinRoom({
      roomCode,
      playerName: botName || candidate.name,
      avatar: botAvatar || candidate.avatar,
    });
  }

  /**
   * Reconnects an existing player.
   */
  public static async reconnectPlayer(
    roomCode: string,
    playerId: string
  ): Promise<{ room: RoomSession; player: PlayerSession }> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) throw new Error("Room not found.");

    const player = await this.repo.getPlayer(room.id, playerId);
    if (!player) throw new Error("Player session not found.");

    await this.repo.updatePlayer(room.id, playerId, { connected: true, lastSeenAt: Date.now() });

    const updatedPlayers = await this.repo.getPlayers(room.id);
    this.bus.publish(room.roomCode, "PLAYERS_UPDATED", { players: updatedPlayers });

    return { room, player };
  }

  /**
   * Disconnects a player and handles automatic host migration if needed.
   */
  public static async disconnectPlayer(roomCode: string, playerId: string): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) return;

    await this.repo.updatePlayer(room.id, playerId, { connected: false, lastSeenAt: Date.now() });

    // Host migration check
    if (room.hostId === playerId) {
      const players = await this.repo.getPlayers(room.id);
      const remainingConnected = players.filter((p) => p.connected && p.id !== playerId);
      if (remainingConnected.length > 0) {
        const newHost = remainingConnected[0];
        await this.repo.updatePlayer(room.id, newHost.id, { isHost: true });
        await this.repo.updatePlayer(room.id, playerId, { isHost: false });
        await this.repo.updateRoom(room.roomCode, { hostId: newHost.id });
      }
    }

    const updatedPlayers = await this.repo.getPlayers(room.id);
    this.bus.publish(room.roomCode, "PLAYERS_UPDATED", { players: updatedPlayers });
  }

  /**
   * Updates game settings (host only).
   */
  public static async updateSettings(
    roomCode: string,
    hostPlayerId: string,
    patch: Partial<GameSettings>
  ): Promise<RoomSession> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) throw new Error("Room not found.");
    if (room.hostId !== hostPlayerId) throw new Error("Only the host can modify settings.");

    const updatedSettings = { ...room.settings, ...patch };
    const updated = (await this.repo.updateRoom(roomCode, { settings: updatedSettings }))!;

    this.bus.publish(room.roomCode, "ROOM_UPDATED", { room: updated });
    return updated;
  }

  /**
   * Kicks or removes a player from the room (host only or player leaving).
   */
  public static async kickPlayer(
    roomCode: string,
    hostPlayerId: string,
    targetPlayerId: string
  ): Promise<void> {
    const room = await this.repo.findByCode(roomCode);
    if (!room) throw new Error("Room not found.");
    if (room.hostId !== hostPlayerId && hostPlayerId !== targetPlayerId) {
      throw new Error("Only the host can kick players.");
    }
    const target = await this.repo.getPlayer(room.id, targetPlayerId);
    if (!target) return;

    await this.repo.removePlayer(room.id, targetPlayerId);
    const updatedPlayers = await this.repo.getPlayers(room.id);
    this.bus.publish(room.roomCode, "PLAYERS_UPDATED", { players: updatedPlayers });
    this.bus.publish(room.roomCode, "PLAYER_LEFT", {
      playerId: targetPlayerId,
      playerName: target.name,
      totalPlayers: updatedPlayers.length,
    });
  }
}

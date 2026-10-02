import { PlayerSession } from "../../core/types/player.types";
import { RoomSession } from "../../core/types/room.types";

const globalForRepo = globalThis as unknown as {
  chaosRoomRepository: RoomRepository | undefined;
};

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


  public saveRoom(room: RoomSession): RoomSession {
    this.roomsByCode.set(room.roomCode, room);
    this.roomsById.set(room.id, room);
    if (!this.playersByRoom.has(room.id)) {
      this.playersByRoom.set(room.id, new Map());
    }
    return room;
  }

  public findByCode(code: string): RoomSession | null {
    return this.roomsByCode.get(code.toUpperCase()) || null;
  }

  public findById(id: string): RoomSession | null {
    return this.roomsById.get(id) || null;
  }

  public updateRoom(roomCode: string, patch: Partial<RoomSession>): RoomSession | null {
    const existing = this.findByCode(roomCode);
    if (!existing) return null;

    const updated: RoomSession = {
      ...existing,
      ...patch,
      updatedAt: Date.now(),
    };

    this.roomsByCode.set(roomCode, updated);
    this.roomsById.set(existing.id, updated);
    return updated;
  }

  public getPlayers(roomId: string): PlayerSession[] {
    const map = this.playersByRoom.get(roomId);
    if (!map) return [];
    return Array.from(map.values());
  }

  public getPlayer(roomId: string, playerId: string): PlayerSession | null {
    const map = this.playersByRoom.get(roomId);
    if (!map) return null;
    return map.get(playerId) || null;
  }

  public savePlayer(player: PlayerSession): PlayerSession {
    let map = this.playersByRoom.get(player.roomId);
    if (!map) {
      map = new Map();
      this.playersByRoom.set(player.roomId, map);
    }
    map.set(player.id, player);
    return player;
  }

  public updatePlayer(
    roomId: string,
    playerId: string,
    patch: Partial<PlayerSession>
  ): PlayerSession | null {
    const existing = this.getPlayer(roomId, playerId);
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
    return updated;
  }

  public removePlayer(roomId: string, playerId: string): boolean {
    const map = this.playersByRoom.get(roomId);
    if (!map) return false;
    return map.delete(playerId);
  }
}

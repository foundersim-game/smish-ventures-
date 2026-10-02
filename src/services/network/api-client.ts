import { AvatarKey, PlayerSession } from "../../core/types/player.types";
import { GameMode, GameSettings, RoomSession } from "../../core/types/room.types";
import { ScenarioDefinition } from "../../core/types/scenario.types";
import { HostPassProduct } from "../../backend/services/monetization.service";

export class ApiClient {
  public static async createRoom(params: {
    hostName: string;
    hostAvatar: AvatarKey;
    mode: GameMode;
    scenarioId?: string;
    settings?: Partial<GameSettings>;
    isPaidSession?: boolean;
  }): Promise<{ room: RoomSession; host: PlayerSession }> {
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  public static async getRoom(code: string): Promise<{
    room: RoomSession;
    players: PlayerSession[];
    scenario: ScenarioDefinition;
  }> {
    const res = await fetch(`/api/rooms/${code.toUpperCase()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  public static async joinRoom(
    code: string,
    playerName: string,
    avatar: AvatarKey
  ): Promise<{ room: RoomSession; player: PlayerSession }> {
    const res = await fetch(`/api/rooms/${code.toUpperCase()}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName, avatar }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  public static async sendAction(
    code: string,
    playerId: string,
    action: string,
    payload: Record<string, unknown> = {}
  ): Promise<Record<string, unknown>> {
    const res = await fetch(`/api/rooms/${code.toUpperCase()}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, playerId, payload }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  public static async addBotPlayer(
    code: string,
    playerId: string,
    name?: string,
    avatar?: AvatarKey
  ): Promise<{ room: RoomSession; player: PlayerSession }> {
    const res = await this.sendAction(code, playerId, "ADD_BOT_PLAYER", { name, avatar });
    return res as unknown as { room: RoomSession; player: PlayerSession };
  }

  public static async kickPlayer(
    code: string,
    playerId: string,
    targetPlayerId: string
  ): Promise<void> {
    await this.sendAction(code, playerId, "KICK_PLAYER", { targetPlayerId });
  }

  public static async sendEmojiReaction(
    code: string,
    playerId: string,
    emoji: string
  ): Promise<void> {
    await this.sendAction(code, playerId, "TRIGGER_EMOJI_REACTION", { emoji });
  }

  public static async getCatalog(): Promise<{
    scenarios: ScenarioDefinition[];
    pricingTiers: HostPassProduct[];
  }> {
    const res = await fetch("/api/rooms");
    return res.json();
  }
}

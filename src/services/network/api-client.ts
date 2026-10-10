import { AvatarKey, PlayerSession } from "../../core/types/player.types";
import { GameMode, GameSettings, RoomSession } from "../../core/types/room.types";
import { ScenarioDefinition } from "../../core/types/scenario.types";
import { RoundVoteResolution } from "../../core/types/vote.types";
import { HostPassProduct } from "../../backend/services/monetization.service";

export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return "";
}

export class ApiClient {
  public static async createRoom(params: {
    hostName: string;
    hostAvatar: AvatarKey;
    hostPlayerId?: string;
    mode: GameMode;
    scenarioId?: string;
    settings?: Partial<GameSettings>;
    isPaidSession?: boolean;
  }): Promise<{ room: RoomSession; host: PlayerSession }> {
    const res = await fetch(`${getApiBaseUrl()}/api/rooms`, {
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
    resolution?: RoundVoteResolution | null;
    consequence?: any;
  }> {
    const res = await fetch(`${getApiBaseUrl()}/api/rooms/${code.toUpperCase()}?_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  public static async joinRoom(
    code: string,
    playerName: string,
    avatar: AvatarKey,
    playerId?: string
  ): Promise<{ room: RoomSession; player: PlayerSession }> {
    const res = await fetch(`${getApiBaseUrl()}/api/rooms/${code.toUpperCase()}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName, avatar, playerId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  }

  public static async sendAction<T = Record<string, any>>(
    code: string,
    playerId: string,
    action: string,
    payload: Record<string, unknown> = {}
  ): Promise<T> {
    const res = await fetch(`${getApiBaseUrl()}/api/rooms/${code.toUpperCase()}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, playerId, payload }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data as T;
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

  public static async updateSettings(
    code: string,
    playerId: string,
    settings: Partial<GameSettings>
  ): Promise<{ room: RoomSession }> {
    const res = await this.sendAction(code, playerId, "UPDATE_SETTINGS", { settings });
    return res as unknown as { room: RoomSession };
  }

  public static async activateHostPass(code: string, playerId: string): Promise<void> {
    await this.sendAction(code, playerId, "ACTIVATE_HOST_PASS");
  }

  public static async getCatalog(): Promise<{
    scenarios: ScenarioDefinition[];
    pricingTiers: HostPassProduct[];
  }> {
    const res = await fetch(`${getApiBaseUrl()}/api/rooms`);
    return res.json();
  }

  public static async getScenarios(): Promise<ScenarioDefinition[]> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/scenarios?_t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.scenarios)) {
        return data.scenarios;
      }
    } catch {
      // Non-fatal
    }
    return [];
  }

  public static async trackInstallReferral(params: {
    refToken: string;
    newPlayerId: string;
    visitorFingerprint: string;
  }): Promise<{ success: boolean; rewardGranted?: boolean; message?: string }> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/referrals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "install", ...params }),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  }
}

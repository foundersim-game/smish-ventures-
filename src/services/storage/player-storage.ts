import { AvatarKey } from "../../core/types/player.types";

export interface StoredProfile {
  name: string;
  avatar: AvatarKey;
}

const STORAGE_KEY = "chaos_player_profile";

export interface HostPassStatus {
  hasPass: boolean;
  tierId?: string;
  passesRemaining: number | "unlimited";
  unlockedPacks: string[];
}

const PASS_STORAGE_KEY = "chaos_host_pass_status";

export interface ActiveSession {
  roomCode: string;
  roomId: string;
  playerId: string;
  playerName: string;
  avatar: AvatarKey;
  isHost: boolean;
}

const ACTIVE_SESSION_KEY = "chaos_active_session";
const PLAYER_ID_KEY = "chaos_persistent_player_id";

export interface UserAccount {
  email: string;
  isLoggedIn: boolean;
  createdAt: number;
  provider?: "google" | "apple" | "email";
  name?: string;
  avatar?: AvatarKey;
}

export class PlayerStorage {
  public static getOrCreatePlayerId(): string {
    if (typeof window === "undefined") {
      return "00000000-0000-0000-0000-000000000001";
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    try {
      let id = localStorage.getItem(PLAYER_ID_KEY);
      // Clean up legacy non-UUID or PLY- prefixed IDs
      if (id && id.startsWith("PLY-")) {
        const stripped = id.replace(/^PLY-/, "");
        if (uuidRegex.test(stripped)) {
          id = stripped;
        } else {
          id = null;
        }
      }
      if (!id || !uuidRegex.test(id)) {
        id = typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
              const r = (Math.random() * 16) | 0;
              const v = c === "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            });
        localStorage.setItem(PLAYER_ID_KEY, id);
      }
      return id;
    } catch {
      return "11111111-1111-4111-a111-111111111111";
    }
  }

  public static getDeviceId(): string {
    if (typeof window === "undefined") return "dev_server";
    try {
      let id = localStorage.getItem("chaos_device_fingerprint");
      if (!id) {
        id = `DEV-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString(36)}`;
        localStorage.setItem("chaos_device_fingerprint", id);
      }
      return id;
    } catch {
      return "dev_fallback";
    }
  }

  public static saveActiveSession(session: ActiveSession): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore
    }
  }

  public static getActiveSession(): ActiveSession | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return null;
  }

  public static clearActiveSession(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch {
      // Ignore
    }
  }

  public static getProfile(): StoredProfile {
    if (typeof window === "undefined") {
      return { name: "Player", avatar: "crown" };
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore
    }

    // Default random profile
    const randomAvatars: AvatarKey[] = ["crown", "fire", "sunglasses", "devil", "brain"];
    const randomAvatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    const defaultProfile: StoredProfile = {
      name: `Player ${Math.floor(Math.random() * 900 + 100)}`,
      avatar: randomAvatar,
    };

    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  public static saveProfile(profile: StoredProfile): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }

  public static getHostPass(): HostPassStatus {
    if (typeof window === "undefined") {
      return { hasPass: false, passesRemaining: 0, unlockedPacks: [] };
    }
    try {
      const data = localStorage.getItem(PASS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore
    }
    return { hasPass: false, passesRemaining: 0, unlockedPacks: [] };
  }

  public static saveHostPass(status: HostPassStatus): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(PASS_STORAGE_KEY, JSON.stringify(status));
    } catch {
      // Ignore
    }
  }

  public static activatePass(tierId: string, count: number | "unlimited", packId?: string): void {
    const current = this.getHostPass();
    const updatedPacks = packId && !current.unlockedPacks.includes(packId)
      ? [...current.unlockedPacks, packId]
      : current.unlockedPacks;

    let newRemaining: number | "unlimited" = count;
    if (typeof current.passesRemaining === "number" && typeof count === "number") {
      newRemaining = current.passesRemaining + count;
    } else if (current.passesRemaining === "unlimited" || count === "unlimited") {
      newRemaining = "unlimited";
    }

    this.saveHostPass({
      hasPass: true,
      tierId,
      passesRemaining: newRemaining,
      unlockedPacks: updatedPacks,
    });
  }

  public static getAccount(): UserAccount | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem("chaos_user_account");
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return null;
  }

  public static saveAccount(account: UserAccount): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("chaos_user_account", JSON.stringify(account));
    } catch {
      // Ignore
    }
  }

  public static logoutAccount(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("chaos_user_account");
    } catch {
      // Ignore
    }
  }
}

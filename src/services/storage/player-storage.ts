import { AvatarKey } from "../../core/types/player.types";

export interface StoredProfile {
  name: string;
  avatar: AvatarKey;
}

export interface PlayerCareerStats {
  gamesPlayed: number;
  decisionsMade: number;
  totalChaos: number;
  roundsCount: number;
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

  public static getReferralCode(): string {
    if (typeof window === "undefined") return "REF-HOST";
    try {
      let code = localStorage.getItem("chaos_referral_code");
      if (!code) {
        const id = this.getOrCreatePlayerId();
        code = `REF-${id.substring(0, 6).toUpperCase()}`;
        localStorage.setItem("chaos_referral_code", code);
      }
      return code;
    } catch {
      return "REF-HOST";
    }
  }

  public static hasClaimedReferralReward(): boolean {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("chaos_referral_reward_claimed") === "true";
    } catch {
      return false;
    }
  }

  public static setReferralRewardClaimed(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("chaos_referral_reward_claimed", "true");
    } catch {
      // Ignore
    }
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

  public static getAchievements(): Record<string, { progress: number; unlocked: boolean }> {
    if (typeof window === "undefined") return {};
    try {
      const data = localStorage.getItem("chaos_player_achievements");
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return {};
  }

  public static recordAchievementProgress(id: string, increment: number, target: number): boolean {
    if (typeof window === "undefined") return false;
    try {
      const records = this.getAchievements();
      const current = records[id] || { progress: 0, unlocked: false };
      if (current.unlocked) return false;

      const newProgress = Math.min(target, current.progress + increment);
      const isNowUnlocked = newProgress >= target;

      records[id] = {
        progress: newProgress,
        unlocked: isNowUnlocked,
      };

      localStorage.setItem("chaos_player_achievements", JSON.stringify(records));
      return isNowUnlocked;
    } catch {
      return false;
    }
  }

  public static getCareerStats(): PlayerCareerStats {
    if (typeof window === "undefined") {
      return { gamesPlayed: 0, decisionsMade: 0, totalChaos: 0, roundsCount: 0 };
    }
    try {
      const data = localStorage.getItem("chaos_player_career_stats");
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return { gamesPlayed: 0, decisionsMade: 0, totalChaos: 0, roundsCount: 0 };
  }

  public static saveCareerStats(stats: PlayerCareerStats): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("chaos_player_career_stats", JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }

  public static recordDecision(): void {
    const current = this.getCareerStats();
    current.decisionsMade += 1;
    this.saveCareerStats(current);
  }

  public static recordGameCompleted(chaosScore?: number): void {
    const current = this.getCareerStats();
    current.gamesPlayed += 1;
    if (typeof chaosScore === "number" && !isNaN(chaosScore)) {
      current.totalChaos += Math.min(100, Math.max(0, chaosScore));
      current.roundsCount += 1;
    }
    this.saveCareerStats(current);
  }

  public static async syncCloudProfile(email: string): Promise<boolean> {
    if (typeof window === "undefined" || !email) return false;
    try {
      const res = await fetch(`/api/auth/profile?email=${encodeURIComponent(email)}`);
      if (!res.ok) return false;
      const data = await res.json();
      if (data?.success && data?.profile) {
        const p = data.profile;
        if (p.name && p.avatar) {
          this.saveProfile({ name: p.name, avatar: p.avatar });
        }
        if (p.careerStats) {
          this.saveCareerStats(p.careerStats);
        }
        if (p.passStatus) {
          this.saveHostPass(p.passStatus);
        }
        return true;
      }
    } catch {
      // Non-fatal
    }
    return false;
  }

  public static async pushCloudProfile(): Promise<void> {
    const account = this.getAccount();
    if (!account?.email) return;
    try {
      const profile = this.getProfile();
      const careerStats = this.getCareerStats();
      const passStatus = this.getHostPass();
      await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.email,
          name: profile.name,
          avatar: profile.avatar,
          careerStats,
          passStatus,
        }),
      });
    } catch {
      // Non-fatal
    }
  }

  /**
   * Permanently wipes user identity, cloud tokens, and stored game data.
   * Required for Apple Guideline 5.1.1(v).
   */
  public static deleteAccount(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("chaos_user_account");
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PASS_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      localStorage.removeItem(PLAYER_ID_KEY);
      localStorage.removeItem("chaos_device_fingerprint");
      localStorage.removeItem("chaos_player_achievements");
      localStorage.removeItem("chaos_player_career_stats");
    } catch {
      // Ignore
    }
  }

  /**
   * Sound & Haptic user preferences persistence
   */
  public static getSoundVolume(): number {
    if (typeof window === "undefined") return 0.8;
    try {
      const saved = localStorage.getItem("chaos_sound_volume");
      return saved !== null ? parseFloat(saved) : 0.8;
    } catch {
      return 0.8;
    }
  }

  public static saveSoundVolume(vol: number): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("chaos_sound_volume", vol.toString());
    } catch {
      // Ignore
    }
  }

  public static getSoundEnabled(): boolean {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("chaos_sound_enabled");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  }

  public static saveSoundEnabled(enabled: boolean): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("chaos_sound_enabled", enabled ? "true" : "false");
    } catch {
      // Ignore
    }
  }
}

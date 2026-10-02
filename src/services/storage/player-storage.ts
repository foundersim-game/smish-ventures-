import { AvatarKey } from "../../core/types/player.types";

export interface StoredProfile {
  name: string;
  avatar: AvatarKey;
}

const STORAGE_KEY = "chaos_player_profile";

export class PlayerStorage {
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
}

import { createClient } from "@supabase/supabase-js";
import { AvatarKey } from "../../core/types/player.types";

export interface CloudPlayerProfile {
  email: string;
  name: string;
  avatar: AvatarKey;
  careerStats?: {
    gamesPlayed: number;
    decisionsMade: number;
    totalChaos: number;
    roundsCount: number;
  };
  passStatus?: {
    hasPass: boolean;
    tierId?: string;
    passesRemaining: number | "unlimited";
    unlockedPacks: string[];
  };
  updatedAt: number;
}

const globalForProfiles = global as unknown as {
  chaosProfileStore?: Map<string, CloudPlayerProfile>;
};

if (!globalForProfiles.chaosProfileStore) {
  globalForProfiles.chaosProfileStore = new Map<string, CloudPlayerProfile>();
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ddbodqpkojrskspxjdnk.supabase.co";
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYm9kcXBrb2pyc2tzcHhqZG5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc4MjY2MSwiZXhwIjoyMTA2MzU4NjYxfQ.dm5h8JpaJOcig3AEs46MbV6PEoHcePVirEmmLtlTeWM";

  if (!url || !serviceKey) return null;

  try {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (err) {
    console.error("[ProfileStore] Failed to initialize Supabase admin client:", err);
    return null;
  }
}

export class ProfileStore {
  private static store = globalForProfiles.chaosProfileStore!;

  public static async get(email: string): Promise<CloudPlayerProfile | null> {
    const clean = email.trim().toLowerCase();

    // 1. Check memory cache first
    const cached = this.store.get(clean);

    // 2. Query Supabase Auth user_metadata
    const sb = getSupabaseAdmin();
    if (sb) {
      try {
        const { data, error } = await sb.auth.admin.listUsers();
        if (!error && data?.users) {
          const user = data.users.find((u) => u.email?.toLowerCase() === clean);
          if (user) {
            const meta = user.user_metadata || {};
            const savedProfile = meta.chaos_profile as Partial<CloudPlayerProfile> | undefined;

            const name =
              savedProfile?.name ||
              meta.full_name ||
              meta.name ||
              clean.split("@")[0] ||
              "Player";
            const avatar = (savedProfile?.avatar as AvatarKey) || "crown";
            const careerStats = savedProfile?.careerStats || {
              gamesPlayed: 0,
              decisionsMade: 0,
              totalChaos: 0,
              roundsCount: 0,
            };
            const passStatus = savedProfile?.passStatus || {
              hasPass: false,
              passesRemaining: 0,
              unlockedPacks: [],
            };

            const profile: CloudPlayerProfile = {
              email: clean,
              name,
              avatar,
              careerStats,
              passStatus,
              updatedAt: savedProfile?.updatedAt || Date.now(),
            };

            this.store.set(clean, profile);
            return profile;
          }
        }
      } catch (err) {
        console.warn("[ProfileStore] Supabase profile fetch failed, using cache:", err);
      }
    }

    return cached || null;
  }

  public static async save(
    profile: Omit<CloudPlayerProfile, "updatedAt">
  ): Promise<CloudPlayerProfile> {
    const clean = profile.email.trim().toLowerCase();
    const existing = this.store.get(clean);

    const merged: CloudPlayerProfile = {
      ...existing,
      ...profile,
      email: clean,
      updatedAt: Date.now(),
    };

    // 1. Save to in-memory store
    this.store.set(clean, merged);

    // 2. Persist to Supabase Auth user_metadata
    const sb = getSupabaseAdmin();
    if (sb) {
      try {
        const { data, error } = await sb.auth.admin.listUsers();
        if (!error && data?.users) {
          const user = data.users.find((u) => u.email?.toLowerCase() === clean);
          if (user) {
            await sb.auth.admin.updateUserById(user.id, {
              user_metadata: {
                ...user.user_metadata,
                chaos_profile: merged,
              },
            });
          } else {
            // User does not exist in Supabase auth yet (e.g. Email OTP without oauth)
            await sb.auth.admin.createUser({
              email: clean,
              email_confirm: true,
              user_metadata: {
                chaos_profile: merged,
              },
            });
          }
        }
      } catch (err) {
        console.warn("[ProfileStore] Supabase profile sync failed, kept in cache:", err);
      }
    }

    return merged;
  }
}

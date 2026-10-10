import { Capacitor } from "@capacitor/core";
import { PlayerStorage } from "../storage/player-storage";

export type AnalyticsEventName =
  | "app_loaded"
  | "room_created"
  | "player_joined"
  | "game_started"
  | "round_started"
  | "vote_submitted"
  | "consequence_revealed"
  | "blame_cast"
  | "game_completed"
  | "recap_shared"
  | "iap_opened"
  | "iap_purchased"
  | "iap_restored"
  | "ad_banner_shown"
  | "ad_interstitial_shown";

const getFirebaseAnalytics = async () => {
  if (typeof window === "undefined") return null;
  try {
    const pkg = "@capacitor-firebase/analytics";
    const mod = await import(/* webpackIgnore: true */ pkg);
    return mod?.FirebaseAnalytics || null;
  } catch {
    return null;
  }
};

export class AnalyticsService {
  private static isInitialized = false;

  public static initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (Capacitor.isNativePlatform()) {
      const deviceId = PlayerStorage.getDeviceId();
      getFirebaseAnalytics()
        .then((fa) => {
          fa?.setUserId({ userId: deviceId }).catch(() => {});
        })
        .catch(() => {});
    }

    this.trackEvent("app_loaded", {
      platform: typeof window !== "undefined" ? window.navigator.userAgent : "server",
    });
  }

  /**
   * Tracks a product or gameplay event with device context.
   */
  public static trackEvent(
    name: AnalyticsEventName,
    properties: Record<string, any> = {}
  ): void {
    const deviceId = PlayerStorage.getDeviceId();
    const eventPayload = {
      event: name,
      timestamp: Date.now(),
      deviceId,
      ...properties,
    };

    // 1. Log to console during development
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics] 📊 ${name}:`, eventPayload);
    }

    // 2. Dispatch to Firebase Analytics on native iOS / Android
    if (Capacitor.isNativePlatform()) {
      getFirebaseAnalytics()
        .then((fa) => {
          fa?.logEvent({
            name,
            params: eventPayload,
          }).catch((err: any) => {
            if (process.env.NODE_ENV !== "production") {
              console.warn("[Analytics] Firebase logEvent error:", err);
            }
          });
        })
        .catch(() => {});
    }

    // 3. Dispatch to Google Analytics (gtag) if present on window
    if (typeof window !== "undefined") {
      const win = window as any;
      if (typeof win.gtag === "function") {
        win.gtag("event", name, eventPayload);
      } else if (Array.isArray(win.dataLayer)) {
        win.dataLayer.push(eventPayload);
      }
      // 4. Dispatch to PostHog if present on window
      if (win.posthog) {
        win.posthog.capture(name, eventPayload);
      }
    }
  }
}

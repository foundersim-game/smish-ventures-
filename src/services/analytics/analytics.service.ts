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

export class AnalyticsService {
  private static isInitialized = false;

  public static initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;
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

    // 2. Dispatch to Google Analytics (gtag) if present on window
    if (typeof window !== "undefined") {
      const win = window as any;
      if (win.gtag) {
        win.gtag("event", name, eventPayload);
      }
      // 3. Dispatch to PostHog if present on window
      if (win.posthog) {
        win.posthog.capture(name, eventPayload);
      }
    }
  }
}

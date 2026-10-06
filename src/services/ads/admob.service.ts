import { Capacitor } from "@capacitor/core";

export interface AdMobConfig {
  androidBannerId?: string;
  iosBannerId?: string;
  androidInterstitialId?: string;
  iosInterstitialId?: string;
  androidRewardedId?: string;
  iosRewardedId?: string;
  isTesting?: boolean;
}

// Official Google AdMob Test Ad Unit IDs
// NEVER USE LIVE ADS DURING DEVELOPMENT OR TESTING (Google AdMob policy violation)
const GOOGLE_ADMOB_TEST_IDS = {
  android: {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
    rewarded: "ca-app-pub-3940256099942544/5224354917",
  },
  ios: {
    banner: "ca-app-pub-3940256099942544/2934735716",
    interstitial: "ca-app-pub-3940256099942544/4411468910",
    rewarded: "ca-app-pub-3940256099942544/1712485313",
  },
};

export class AdMobService {
  private static isInitialized = false;
  private static isAdFreeActive = false;
  private static isBannerVisible = false;

  public static async initialize(config?: AdMobConfig): Promise<void> {
    if (this.isInitialized) return;

    const platform = Capacitor.getPlatform();
    console.log(`[AdMobService] Initializing Google AdMob on platform: ${platform}`);

    if (Capacitor.isNativePlatform()) {
      try {
        const win = window as any;
        if (win.AdMob) {
          await win.AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: config?.isTesting !== false ? ["EMULATOR"] : undefined,
            initializeForTesting: config?.isTesting !== false,
          });
          console.log("[AdMobService] Google AdMob SDK initialized successfully.");
        }
      } catch (err) {
        console.warn("[AdMobService] Error initializing native AdMob plugin:", err);
      }
    }

    this.isInitialized = true;
  }

  /**
   * Sets whether the current room or player is Ad-Free.
   * If true, suppresses all banners and interstitials immediately.
   */
  public static setAdFree(active: boolean): void {
    this.isAdFreeActive = active;
    if (active && this.isBannerVisible) {
      this.hideBanner();
    }
  }

  /**
   * Shows a sticky bottom banner ad.
   */
  public static async showBanner(): Promise<void> {
    if (this.isAdFreeActive) {
      console.log("[AdMobService] Suppressing banner: Room is Ad-Free.");
      return;
    }

    const platform = Capacitor.getPlatform();
    if (!Capacitor.isNativePlatform()) {
      // In web browser, handled by responsive DOM banner slot
      return;
    }

    try {
      const win = window as any;
      if (win.AdMob) {
        const adId =
          platform === "ios"
            ? GOOGLE_ADMOB_TEST_IDS.ios.banner
            : GOOGLE_ADMOB_TEST_IDS.android.banner;

        await win.AdMob.showBanner({
          adId,
          adSize: "BANNER",
          position: "BOTTOM_CENTER",
          margin: 0,
          isTesting: true,
        });
        this.isBannerVisible = true;
      }
    } catch (err) {
      console.warn("[AdMobService] Failed to show native banner:", err);
    }
  }

  /**
   * Hides the sticky banner ad.
   */
  public static async hideBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const win = window as any;
      if (win.AdMob) {
        await win.AdMob.hideBanner();
        this.isBannerVisible = false;
      }
    } catch (err) {
      console.warn("[AdMobService] Failed to hide banner:", err);
    }
  }

  /**
   * Pre-loads an interstitial ad (e.g. before the Halftime break or Rematch).
   */
  public static async prepareInterstitial(): Promise<void> {
    if (this.isAdFreeActive || !Capacitor.isNativePlatform()) return;

    const platform = Capacitor.getPlatform();
    try {
      const win = window as any;
      if (win.AdMob) {
        const adId =
          platform === "ios"
            ? GOOGLE_ADMOB_TEST_IDS.ios.interstitial
            : GOOGLE_ADMOB_TEST_IDS.android.interstitial;

        await win.AdMob.prepareInterstitial({
          adId,
          isTesting: true,
        });
      }
    } catch (err) {
      console.warn("[AdMobService] Failed to prepare interstitial:", err);
    }
  }

  /**
   * Displays the full-screen interstitial ad (for Halftime or Rematch).
   */
  public static async showInterstitial(): Promise<boolean> {
    if (this.isAdFreeActive) {
      console.log("[AdMobService] Suppressing interstitial: Room is Ad-Free.");
      return false;
    }

    if (!Capacitor.isNativePlatform()) {
      // In web mode, a 5-second sponsor card is displayed by the app
      return true;
    }

    try {
      const win = window as any;
      if (win.AdMob) {
        await win.AdMob.showInterstitial();
        return true;
      }
    } catch (err) {
      console.warn("[AdMobService] Failed to show interstitial:", err);
    }
    return false;
  }

  /**
   * Shows a rewarded video ad (e.g. for opt-in "Reveal Accuser" peek).
   */
  public static async showRewarded(): Promise<boolean> {
    if (this.isAdFreeActive) {
      return true; // Instantly granted for VIP rooms
    }

    const platform = Capacitor.getPlatform();
    if (!Capacitor.isNativePlatform()) {
      // In web fallback, simulate 3-second delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return true;
    }

    try {
      const win = window as any;
      if (win.AdMob) {
        const adId =
          platform === "ios"
            ? GOOGLE_ADMOB_TEST_IDS.ios.rewarded
            : GOOGLE_ADMOB_TEST_IDS.android.rewarded;

        await win.AdMob.prepareRewardVideoAd({ adId, isTesting: true });
        const result = await win.AdMob.showRewardVideoAd();
        return Boolean(result);
      }
    } catch (err) {
      console.warn("[AdMobService] Failed to show rewarded ad:", err);
    }
    return false;
  }
}
